import fs from "node:fs";
import path from "node:path";

import {
  cleanToken,
  defaultDatasetCreatorDbPath,
  groupBy,
  openDatasetDb,
  parseArgs,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const images = String(args.images ?? "page-003.jpg,page-004.jpg,page-005.jpg,page-006.jpg,page-007.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const outDir = path.resolve(args.out_dir ?? "research/audits/particle-geometry-order-current");
const minParticles = Number(args.min_particles ?? 2);
const inversionTolerance = Number(args.inversion_tolerance ?? 8);
const verticalTolerance = Number(args.vertical_tolerance ?? 42);
const nOverEgeConvention = optionEnabled(args, "n_over_ege_convention", true);
const includeTokenEquivalent = Boolean(args.include_token_equivalent ?? args["include-token-equivalent"]);
const knownAnomaliesPath = path.resolve(args.known_anomalies ?? "cases/known-particle-geometry-anomalies.tsv");
const knownAnomalies = readKnownAnomalies(knownAnomaliesPath);

const db = openDatasetDb(args.db ?? defaultDatasetCreatorDbPath());
const rows = particleRows(db, images);
const molecules = [...groupBy(rows, (row) => `${row.image_id}\u0000${row.molecule_id}`).values()]
  .map(buildMolecule)
  .filter((molecule) => molecule.particles.length >= minParticles);

const allFindings = molecules
  .map((molecule) => auditMolecule(molecule, { inversionTolerance, verticalTolerance, nOverEgeConvention }))
  .filter(Boolean)
  .sort((a, b) =>
    b.score - a.score
    || b.inversion_count - a.inversion_count
    || String(a.image_name).localeCompare(String(b.image_name))
    || Number(a.row_y) - Number(b.row_y)
    || Number(a.left_x) - Number(b.left_x)
  );
const knownFindings = [];
const findings = [];
for (const finding of allFindings) {
  const known = knownAnomalies.get(knownKey(finding));
  if (known) {
    knownFindings.push({
      ...finding,
      anomaly_status: known.status,
      anomaly_note: known.note,
    });
  } else {
    findings.push(finding);
  }
}

const fields = [
  "severity",
  "score",
  "reason",
  "image_name",
  "molecule_id",
  "row_hint",
  "particle_count",
  "inversion_count",
  "accepted_n_over_ege_pairs",
  "max_backtrack_px",
  "left_x",
  "row_y",
  "current_particle_order",
  "geometry_particle_order",
  "current_signature",
  "geometry_signature",
  "particle_ids",
  "atom_ids",
  "particle_boxes",
];

writeTsv(path.join(outDir, "particle-geometry-order-audit.tsv"), findings, fields);
writeTsv(path.join(outDir, "particle-geometry-order-known.tsv"), knownFindings, [
  ...fields,
  "anomaly_status",
  "anomaly_note",
]);
fs.writeFileSync(
  path.join(outDir, "particle-geometry-order-audit.md"),
  renderMarkdown(findings, { images, minParticles, inversionTolerance, verticalTolerance, nOverEgeConvention, includeTokenEquivalent, knownFindings, knownAnomaliesPath }),
  "utf8"
);

console.log(`Wrote ${findings.length} particle geometry-order candidates to ${path.join(outDir, "particle-geometry-order-audit.md")}`);
console.log(`Suppressed ${knownFindings.length} known geometry-order candidates from ${knownAnomaliesPath}`);

function particleRows(db, imageNames) {
  const filter = imageNames.length
    ? `AND i.name IN (${imageNames.map(() => "?").join(",")})`
    : "";
  return db
    .prepare(
      `SELECT
         i.name AS image_name,
         p.image_id,
         p.molecule_id,
         p.particle_id,
         p.particle_order,
         p.source_index,
         p.bounds_x AS particle_x,
         p.bounds_y AS particle_y,
         p.bounds_w AS particle_w,
         p.bounds_h AS particle_h,
         p.centroid_x AS particle_centroid_x,
         p.centroid_y AS particle_centroid_y,
         m.bounds_x AS molecule_x,
         m.bounds_y AS molecule_y,
         a.id AS atom_id,
         a.atom_order,
         a.family,
         a.structural_config,
         a.bounds_x AS atom_x
       FROM particles p
       JOIN images i ON i.id = p.image_id
       JOIN molecules m ON m.image_id = p.image_id AND m.molecule_id = p.molecule_id
       LEFT JOIN atoms a ON a.image_id = p.image_id AND a.particle_id = p.particle_id
       WHERE trim(coalesce(p.molecule_id, '')) <> ''
         ${filter}
       ORDER BY
         p.image_id,
         m.bounds_y,
         m.bounds_x,
         p.molecule_id,
         p.particle_order,
         p.particle_id,
         a.atom_order,
         a.bounds_x,
         a.id`
    )
    .all(...imageNames);
}

function buildMolecule(groupRows) {
  const first = groupRows[0];
  const particleGroups = [...groupBy(groupRows, (row) => row.particle_id).values()]
    .map((particleRows) => {
      const p = particleRows[0];
      const atoms = particleRows
        .filter((row) => row.atom_id !== null && row.atom_id !== undefined)
        .sort((a, b) =>
          Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
          || Number(a.atom_x ?? 0) - Number(b.atom_x ?? 0)
          || Number(a.atom_id) - Number(b.atom_id)
        );
      const tokens = atoms.map((atom) => cleanToken(`${atom.family}${atom.structural_config ? `:${atom.structural_config}` : ""}`));
      return {
        image_name: p.image_name,
        image_id: p.image_id,
        molecule_id: p.molecule_id,
        particle_id: p.particle_id,
        particle_order: Number(p.particle_order ?? Number.MAX_SAFE_INTEGER),
        source_index: Number(p.source_index ?? Number.MAX_SAFE_INTEGER),
        x: Number(p.particle_x ?? 0),
        y: Number(p.particle_y ?? 0),
        w: Number(p.particle_w ?? 0),
        h: Number(p.particle_h ?? 0),
        centroid_x: Number(p.particle_centroid_x ?? p.particle_x ?? 0),
        centroid_y: Number(p.particle_centroid_y ?? p.particle_y ?? 0),
        token: tokens.join(" "),
        atom_ids: atoms.map((atom) => atom.atom_id).join(" "),
      };
    });

  return {
    image_name: first.image_name,
    image_id: first.image_id,
    molecule_id: first.molecule_id,
    row_y: Number(first.molecule_y ?? 0),
    left_x: Number(first.molecule_x ?? 0),
    particles: particleGroups,
  };
}

function auditMolecule(molecule, options) {
  const current = molecule.particles.slice().sort((a, b) =>
    a.particle_order - b.particle_order
    || String(a.particle_id).localeCompare(String(b.particle_id))
  );
  const geometry = molecule.particles.slice().sort((a, b) =>
    a.x - b.x
    || a.centroid_y - b.centroid_y
    || a.particle_order - b.particle_order
  );

  const currentIds = current.map((particle) => particle.particle_id);
  const geometryIds = geometry.map((particle) => particle.particle_id);
  if (currentIds.join("\u0000") === geometryIds.join("\u0000")) {
    return null;
  }

  const byId = new Map(molecule.particles.map((particle) => [particle.particle_id, particle]));
  let inversionCount = 0;
  let maxBacktrack = 0;
  let comparablePairs = 0;
  let acceptedConventionPairs = 0;
  for (let left = 0; left < currentIds.length; left += 1) {
    for (let right = left + 1; right < currentIds.length; right += 1) {
      const a = byId.get(currentIds[left]);
      const b = byId.get(currentIds[right]);
      if (!a || !b) continue;
      const verticalDelta = Math.abs(a.centroid_y - b.centroid_y);
      if (verticalDelta > options.verticalTolerance) continue;
      comparablePairs += 1;
      const backtrack = a.x - b.x;
      if (backtrack > options.inversionTolerance) {
        if (options.nOverEgeConvention && isAcceptedNOverEgeConvention(a, b)) {
          acceptedConventionPairs += 1;
          continue;
        }
        inversionCount += 1;
        maxBacktrack = Math.max(maxBacktrack, backtrack);
      }
    }
  }

  if (inversionCount === 0) {
    return null;
  }

  const currentSignature = current.map((particle) => `[${particle.token}]`).join(" ");
  const geometrySignature = geometry.map((particle) => `[${particle.token}]`).join(" ");
  const tokenSequenceChanged = currentSignature !== geometrySignature;
  if (!tokenSequenceChanged && !includeTokenEquivalent) {
    return null;
  }

  const score = Number((inversionCount * 25 + maxBacktrack + comparablePairs * 0.5 + (tokenSequenceChanged ? 35 : 0)).toFixed(2));
  const severity = score >= 120 || inversionCount >= 3 ? "alta" : score >= 70 ? "media" : "baja";
  return {
    severity,
    score,
    reason: `particle_order backtracks against left-to-right geometry in ${inversionCount} comparable pair(s)`,
    image_name: molecule.image_name,
    molecule_id: molecule.molecule_id,
    row_hint: `y=${molecule.row_y.toFixed(0)}`,
    particle_count: molecule.particles.length,
    inversion_count: inversionCount,
    accepted_n_over_ege_pairs: acceptedConventionPairs,
    max_backtrack_px: maxBacktrack.toFixed(1),
    left_x: molecule.left_x.toFixed(1),
    row_y: molecule.row_y.toFixed(1),
    current_particle_order: currentIds.join(" "),
    geometry_particle_order: geometryIds.join(" "),
    current_signature: currentSignature,
    geometry_signature: geometrySignature,
    particle_ids: currentIds.join(" "),
    atom_ids: current.map((particle) => particle.atom_ids).join(" | "),
    particle_boxes: current.map((particle) => `${particle.particle_id}@${particle.x.toFixed(0)},${particle.y.toFixed(0)} ${particle.w.toFixed(0)}x${particle.h.toFixed(0)}`).join(" | "),
  };
}

function isAcceptedNOverEgeConvention(leftParticle, rightParticle) {
  if (leftParticle.token !== "n:1" || rightParticle.token !== "e:1 g:1 e:1") {
    return false;
  }

  const verticalOffset = rightParticle.centroid_y - leftParticle.centroid_y;
  if (verticalOffset <= 0) {
    return false;
  }

  const leftMin = leftParticle.x;
  const leftMax = leftParticle.x + leftParticle.w;
  const rightMin = rightParticle.x;
  const rightMax = rightParticle.x + rightParticle.w;
  const horizontalSlack = 40;
  const horizontallyNearby = leftMin <= rightMax + horizontalSlack && leftMax >= rightMin - horizontalSlack;

  return horizontallyNearby;
}

function optionEnabled(parsedArgs, key, defaultValue) {
  if (!(key in parsedArgs)) return defaultValue;
  const value = parsedArgs[key];
  if (value === false) return false;
  const normalized = String(value).trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

function renderMarkdown(rows, options) {
  const high = rows.filter((row) => row.severity === "alta").length;
  const medium = rows.filter((row) => row.severity === "media").length;
  const top = rows.slice(0, 60);
  return `# Particle Geometry Order Audit

Purpose: find molecules whose persisted particle order moves backward against the visual left-to-right geometry.

This is a geometry audit, not a grammar audit. It is designed for the failure mode where recalc or learned molecule-order memory leaves a molecule in a plausible but visually wrong particle order.

## Parameters

- Images: ${options.images.join(", ")}
- Minimum particles per molecule: ${options.minParticles}
- Inversion tolerance: ${options.inversionTolerance}px
- Vertical tolerance for comparable pairs: ${options.verticalTolerance}px
- Token-equivalent inversions included: ${options.includeTokenEquivalent ? "yes" : "no"}
- Known anomalies list: \`${path.relative(process.cwd(), options.knownAnomaliesPath)}\`
- Accepted \`n:1\` over \`e:1 g:1 e:1\` convention: ${options.nOverEgeConvention ? "enabled" : "disabled"}. When enabled, \`n:1\` may precede \`e:1 g:1 e:1\` if the \`n:1\` particle is visually above and horizontally near that base particle. This suppresses that specific vertical-superposition layout from geometry-order error reports, without changing corpus data.

## Summary

- Candidates: ${rows.length}
- High priority: ${high}
- Medium priority: ${medium}
- Known anomalies suppressed from pending list: ${options.knownFindings.length}

## Top Candidates

${top.length ? top.map(renderFinding).join("\n") : "No particle-order geometry inversions found with current thresholds.\n"}

Full table: \`particle-geometry-order-audit.tsv\`

Known anomalies table: \`particle-geometry-order-known.tsv\`
`;
}

function renderFinding(row, index) {
  return `### ${index + 1}. ${row.severity.toUpperCase()} - ${row.image_name} - ${row.molecule_id}

- Current order: \`${row.current_particle_order}\`
- Geometry order: \`${row.geometry_particle_order}\`
- Current signature: \`${row.current_signature}\`
- Geometry signature: \`${row.geometry_signature}\`
- Locate: image \`${row.image_name}\`, molecule \`${row.molecule_id}\`, ${row.row_hint}, x=${row.left_x}
- Inversions: ${row.inversion_count}, max backtrack ${row.max_backtrack_px}px
- Boxes: \`${row.particle_boxes}\`
- Atom ids: \`${row.atom_ids}\`
`;
}

function printHelp() {
  console.log(`Usage:
  node EVAComparisonLab/scripts/particle-geometry-order-audit.js --images page-003.jpg,page-004.jpg --out-dir research/audits/particle-geometry-order-current

Options:
  --db <path>                    Path to datasetcreator.db.
  --images <csv>                 Image names to inspect.
  --out-dir <path>               Output directory.
  --min-particles <n>            Minimum particles per molecule. Default: 2
  --inversion-tolerance <px>     X backtrack required to flag. Default: 8
  --vertical-tolerance <px>      Max centroid-y delta for comparable pairs. Default: 42
  --include-token-equivalent     Also report swaps that do not change the ATOMS sequence.
  --n-over-ege-convention=false  Disable the audited n:1 over e:1 g:1 e:1 ordering convention.
  --known-anomalies <path>       TSV with image_name/molecule_id/status/note for known valid layout inversions.`);
}

function readKnownAnomalies(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return new Map();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  const imageIndex = header.indexOf("image_name");
  const moleculeIndex = header.indexOf("molecule_id");
  const statusIndex = header.indexOf("status");
  const noteIndex = header.indexOf("note");
  if (imageIndex < 0 || moleculeIndex < 0) {
    throw new Error(`Known geometry anomalies file needs image_name and molecule_id columns: ${filePath}`);
  }
  const known = new Map();
  for (const line of lines) {
    const cells = line.split("\t");
    const imageName = cells[imageIndex] ?? "";
    const moleculeId = cells[moleculeIndex] ?? "";
    if (!imageName || !moleculeId) continue;
    known.set(`${imageName}\u0000${moleculeId}`, {
      status: cells[statusIndex] || "valid",
      note: cells[noteIndex] || "",
    });
  }
  return known;
}

function knownKey(row) {
  return `${row.image_name}\u0000${row.molecule_id}`;
}
