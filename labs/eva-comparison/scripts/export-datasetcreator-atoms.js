import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const dbPath = path.resolve(
  args.db ??
    path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const image = selectImage(db, args);

if (!image) {
  console.error("Image not found. Available annotated images:");
  for (const row of annotatedImages(db)) {
    console.error(`  id=${row.id} name=${row.name} molecules=${row.molecules} atoms=${row.atoms}`);
  }
  process.exit(1);
}

const molecules = moleculesForImage(db, image.id);
const atomsByMolecule = atomsForImage(db, image.id);
const particlesByMolecule = particlesForImage(db, image.id);
const rowGuides = particleRowGuidesForImage(db, image.id);
const rowOverrides = particleRowOverridesForImage(db, image.id);
const orderedMolecules = rowGuides.length
  ? orderMoleculesWithProgramRows(molecules, atomsByMolecule, particlesByMolecule, rowGuides, rowOverrides)
  : orderMoleculesIntoRows(molecules);
const rows = orderedMolecules.map((molecule, index) => {
  const atoms = atomsByMolecule.get(molecule.molecule_id) ?? [];
  return {
    unit_id: unitId(image.name, index + 1),
    image_id: image.id,
    image_name: image.name,
    source_molecule_id: molecule.molecule_id,
    row_index: molecule.row_index,
    unit_index: index + 1,
    atoms: atoms.map(cleanAtomToken).join(" "),
    atom_ids: atoms.map((atom) => atom.id).join(" "),
    atom_count: atoms.length,
    bounds_x: molecule.bounds_x,
    bounds_y: molecule.bounds_y,
    bounds_w: molecule.bounds_w,
    bounds_h: molecule.bounds_h,
  };
});

const tsv = toTsv(rows, [
  "unit_id",
  "image_id",
  "image_name",
  "source_molecule_id",
  "row_index",
  "unit_index",
  "atoms",
  "atom_ids",
  "atom_count",
  "bounds_x",
  "bounds_y",
  "bounds_w",
  "bounds_h",
]);

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tsv, "utf8");
  console.log(`Exported ${rows.length} units from ${image.name} to ${outPath}`);
} else {
  process.stdout.write(tsv);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  npm run export:atoms -- --image page-003.jpg --out cases/page-003/atoms.tsv
  npm run export:atoms -- --image-id 3 --out cases/page-003/atoms.tsv

Options:
  --db <path>        Path to datasetcreator.db. Defaults to the Tauri app data path.
  --image <name>    Image name, for example page-003.jpg.
  --image-id <id>   Numeric image id.
  --out <path>      Output TSV path. Prints to stdout when omitted.

Rows:
  When DatasetCreator row guides exist, export uses particle_row_guides and
  particle_row_overrides, then adds backend-style overflow rows for particles
  outside the stored guide bands. Otherwise it falls back to the old geometric
  grouping.`);
}

function selectImage(db, args) {
  if (args.image_id) {
    return db
      .prepare("SELECT id, name FROM images WHERE id = ?")
      .get(Number(args.image_id));
  }

  if (args.image) {
    return db
      .prepare("SELECT id, name FROM images WHERE lower(name) = lower(?)")
      .get(args.image);
  }

  return db
    .prepare(
      `SELECT i.id, i.name
       FROM images i
       WHERE EXISTS (SELECT 1 FROM molecules m WHERE m.image_id = i.id)
       ORDER BY i.id
       LIMIT 1`
    )
    .get();
}

function annotatedImages(db) {
  return db
    .prepare(
      `SELECT
         i.id,
         i.name,
         (SELECT count(*) FROM molecules m WHERE m.image_id = i.id) AS molecules,
         (SELECT count(*) FROM atoms a WHERE a.image_id = i.id) AS atoms
       FROM images i
       WHERE molecules > 0 OR atoms > 0
       ORDER BY i.id`
    )
    .all();
}

function moleculesForImage(db, imageId) {
  return db
    .prepare(
      `SELECT molecule_id, atom_count, centroid_x, centroid_y, bounds_x, bounds_y, bounds_w, bounds_h
       FROM molecules
       WHERE image_id = ?
       ORDER BY bounds_y ASC, bounds_x ASC, id ASC`
    )
    .all(imageId);
}

function atomsForImage(db, imageId) {
  const atoms = db
    .prepare(
      `SELECT
         a.id,
         a.molecule_id,
         a.particle_id,
         a.atom_order,
         a.family,
         a.structural_config,
         a.bounds_x,
         a.bounds_y,
         a.bounds_w,
         a.bounds_h,
         a.anchor_x,
         a.anchor_y,
         p.particle_order
       FROM atoms a
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       WHERE a.image_id = ? AND a.molecule_id IS NOT NULL
       ORDER BY a.molecule_id ASC, p.particle_order ASC, a.particle_id ASC, a.atom_order ASC, a.bounds_x ASC, a.id ASC`
    )
    .all(imageId);

  const grouped = new Map();
  for (const atom of atoms) {
    if (!grouped.has(atom.molecule_id)) grouped.set(atom.molecule_id, []);
    grouped.get(atom.molecule_id).push(atom);
  }
  return grouped;
}

function particlesForImage(db, imageId) {
  const particles = db
    .prepare(
      `SELECT
         particle_id,
         molecule_id,
         particle_order,
         source_index,
         bounds_x,
         bounds_y,
         bounds_w,
         bounds_h,
         centroid_y
       FROM particles
       WHERE image_id = ?
       ORDER BY particle_order ASC, bounds_x ASC, id ASC`
    )
    .all(imageId);

  const grouped = new Map();
  for (const particle of particles) {
    if (!grouped.has(particle.molecule_id)) grouped.set(particle.molecule_id, []);
    grouped.get(particle.molecule_id).push(particle);
  }
  return grouped;
}

function particleRowGuidesForImage(db, imageId) {
  const guides = db
    .prepare(
      `SELECT row_index, top_y, y, bottom_y
       FROM particle_row_guides
       WHERE image_id = ?
       ORDER BY row_index ASC`
    )
    .all(imageId)
    .map((guide, index) => {
      const y = finiteNumber(guide.y, 0);
      return {
        row_index: Number(guide.row_index),
        top_y: finiteNumber(guide.top_y, index === 0 ? y - 28 : y - 14),
        y,
        bottom_y: finiteNumber(guide.bottom_y, y + 14),
      };
    })
    .filter((guide) => Number.isFinite(guide.top_y) && Number.isFinite(guide.bottom_y) && guide.top_y < guide.bottom_y);

  for (let index = 1; index < guides.length; index += 1) {
    guides[index].top_y = guides[index - 1].bottom_y;
  }
  return guides;
}

function particleRowOverridesForImage(db, imageId) {
  return new Map(
    db
      .prepare(
        `SELECT particle_key, row_index
         FROM particle_row_overrides
         WHERE image_id = ?`
      )
      .all(imageId)
      .map((row) => [String(row.particle_key), Number(row.row_index)])
  );
}

function orderMoleculesWithProgramRows(molecules, atomsByMolecule, particlesByMolecule, rowGuides, rowOverrides) {
  const particleRows = buildParticleRowAssignments(atomsByMolecule, particlesByMolecule, rowGuides, rowOverrides);
  return molecules
    .map((molecule) => ({
      ...molecule,
      row_index: rowIndexForMolecule(molecule, particlesByMolecule, particleRows, rowGuides),
    }))
    .sort((a, b) =>
      a.row_index - b.row_index
      || a.bounds_x - b.bounds_x
      || a.bounds_y - b.bounds_y
      || String(a.molecule_id).localeCompare(String(b.molecule_id))
    );
}

function buildParticleRowAssignments(atomsByMolecule, particlesByMolecule, rowGuides, rowOverrides) {
  const rowEntries = rowGuides.map((guide) => ({
    y: guide.y,
    top_y: guide.top_y,
    bottom_y: guide.bottom_y,
    particles: [],
  }));
  const overflow = [];
  const allAtoms = [...atomsByMolecule.values()].flat();
  const threshold = particleRowThreshold(allAtoms);

  for (const [moleculeId, particles] of particlesByMolecule.entries()) {
    const atoms = atomsByMolecule.get(moleculeId) ?? [];
    const atomsByParticle = groupBy(atoms, (atom) => atom.particle_id || `unassigned:${atom.id}`);

    for (const particle of particles) {
      const particleAtoms = atomsByParticle.get(particle.particle_id) ?? [];
      const span = particleSpan(particle, particleAtoms);
      const override = rowOverrides.get(particleKey(particleAtoms));
      const overrideIndex = Number(override) - 1;
      if (Number.isInteger(overrideIndex) && overrideIndex >= 0 && overrideIndex < rowEntries.length) {
        rowEntries[overrideIndex].particles.push({ ...span, particle_id: particle.particle_id });
        continue;
      }

      const guideIndex = containingManualRowBand(rowGuides, span);
      if (guideIndex >= 0) {
        rowEntries[guideIndex].particles.push({ ...span, particle_id: particle.particle_id });
      } else {
        overflow.push({ ...span, particle_id: particle.particle_id });
      }
    }
  }

  rowEntries.push(...fallbackParticleRows(overflow, threshold));
  const populatedRows = rowEntries
    .filter((row) => row.particles.length > 0)
    .sort((a, b) => a.y - b.y);

  const particleRows = new Map();
  for (const [rowIndex, row] of populatedRows.entries()) {
    for (const particle of row.particles) {
      particleRows.set(particle.particle_id, rowIndex + 1);
    }
  }
  return particleRows;
}

function rowIndexForMolecule(molecule, particlesByMolecule, particleRows, rowGuides) {
  const particles = particlesByMolecule.get(molecule.molecule_id) ?? [];
  const rowVotes = [];

  for (const particle of particles) {
    rowVotes.push(particleRows.get(particle.particle_id));
  }

  const validVotes = rowVotes.filter((rowIndex) => Number.isFinite(rowIndex) && rowIndex > 0);
  if (validVotes.length) {
    const counts = countBy(validVotes, (rowIndex) => rowIndex);
    return Number(
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0]))[0][0]
    );
  }

  return rowIndexForY(molecule.bounds_y + molecule.bounds_h / 2, rowGuides);
}

function rowIndexForY(y, rowGuides) {
  const containing = rowGuides.find((guide) => y >= guide.top_y && y <= guide.bottom_y);
  if (containing) return containing.row_index;
  const nearest = rowGuides
    .map((guide) => ({ row_index: guide.row_index, distance: Math.abs(y - guide.y) }))
    .sort((a, b) => a.distance - b.distance)[0];
  return nearest?.row_index ?? 1;
}

function containingManualRowBand(rowGuides, span) {
  const y = Number.isFinite(span.body_y) ? span.body_y : span.baseline_y;
  return rowGuides.findIndex((guide) => y >= guide.top_y && y <= guide.bottom_y);
}

function fallbackParticleRows(spans, threshold) {
  const rows = [];
  const sorted = [...spans].sort((a, b) => a.baseline_y - b.baseline_y || a.x - b.x);
  for (const span of sorted) {
    const row = rows.find((candidate) => Math.abs(span.baseline_y - candidate.y) <= threshold);
    if (row) {
      row.particles.push(span);
      row.y = row.particles.reduce((sum, particle) => sum + particle.baseline_y, 0) / row.particles.length;
    } else {
      rows.push({
        y: span.baseline_y,
        top_y: span.baseline_y - threshold / 2,
        bottom_y: span.baseline_y + threshold / 2,
        particles: [span],
      });
    }
  }
  return rows.sort((a, b) => a.y - b.y);
}

function particleSpan(particle, particleAtoms) {
  const bounds = particleBounds(particle, particleAtoms);
  const voteAtoms = rowVoteAtoms(particleAtoms);
  const coreAnchors = voteAtoms
    .map(coreRowAnchor)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const anchors = voteAtoms
    .map(atomRowAnchor)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const body_y = maybeMedian(coreAnchors) ?? maybeMedian(anchors) ?? bounds.centroid_y;
  const bottoms = voteAtoms
    .map((atom) => Number(atom.bounds_y) + Number(atom.bounds_h))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const bottom_y = maybeMedian(bottoms) ?? bounds.y + bounds.h;
  const baseline_y = particleRowAnchor(body_y, bottom_y, bounds.h);
  return {
    x: bounds.x,
    y: bounds.y,
    w: bounds.w,
    h: bounds.h,
    baseline_y,
    body_y,
    bottom_y,
  };
}

function particleBounds(particle, particleAtoms) {
  if (!particleAtoms.length) {
    const x = finiteNumber(particle.bounds_x, 0);
    const y = finiteNumber(particle.bounds_y, finiteNumber(particle.centroid_y, 0));
    const w = finiteNumber(particle.bounds_w, 0);
    const h = finiteNumber(particle.bounds_h, 0);
    return { x, y, w, h, centroid_y: finiteNumber(particle.centroid_y, y + h / 2) };
  }

  const minX = Math.min(...particleAtoms.map((atom) => Number(atom.bounds_x)).filter(Number.isFinite));
  const minY = Math.min(...particleAtoms.map((atom) => Number(atom.bounds_y)).filter(Number.isFinite));
  const maxX = Math.max(
    ...particleAtoms
      .map((atom) => Number(atom.bounds_x) + Number(atom.bounds_w))
      .filter(Number.isFinite)
  );
  const maxY = Math.max(
    ...particleAtoms
      .map((atom) => Number(atom.bounds_y) + Number(atom.bounds_h))
      .filter(Number.isFinite)
  );
  const x = Number.isFinite(minX) ? minX : finiteNumber(particle.bounds_x, 0);
  const y = Number.isFinite(minY) ? minY : finiteNumber(particle.bounds_y, 0);
  const w = Number.isFinite(maxX) && Number.isFinite(x) ? maxX - x : finiteNumber(particle.bounds_w, 0);
  const h = Number.isFinite(maxY) && Number.isFinite(y) ? maxY - y : finiteNumber(particle.bounds_h, 0);
  return { x, y, w, h, centroid_y: y + h / 2 };
}

function rowVoteAtoms(atoms) {
  const ordered = [...atoms].sort((a, b) =>
    Number(a.particle_order ?? 0) - Number(b.particle_order ?? 0)
    || Number(a.atom_order ?? 0) - Number(b.atom_order ?? 0)
    || Number(a.anchor_x ?? a.bounds_x ?? 0) - Number(b.anchor_x ?? b.bounds_x ?? 0)
  );
  const tokens = ordered.map(cleanAtomToken);
  if (tokens[0] === "a:1") return [ordered[0]];
  if (tokens[0] === "e:1" && tokens[1] === "f:1") return [ordered[1]];
  if (tokens[0] === "a:1" || (tokens[0] === "e:1" && tokens[1] === "a:1")) {
    const withoutDistorters = ordered.filter((atom) => !["a:1", "e:1"].includes(cleanAtomToken(atom)));
    return withoutDistorters.length ? withoutDistorters : ordered;
  }
  return ordered;
}

function atomRowAnchor(atom) {
  const family = cleanAtomKey(atom.family);
  const top = Number(atom.bounds_y);
  const height = Number(atom.bounds_h);
  const bottom = top + height;
  if (family === "a") return bottom;
  if (family === "h") return top + Math.min(height, 18) * 0.2;
  return Number(atom.anchor_y);
}

function coreRowAnchor(atom) {
  return ["f:1", "k:1", "k:2", "c:1", "e:1"].includes(cleanAtomToken(atom))
    ? Number(atom.anchor_y)
    : Number.NaN;
}

function particleRowAnchor(bodyY, bottomY, height) {
  if (!Number.isFinite(bodyY)) return bottomY;
  if (!Number.isFinite(bottomY)) return bodyY;
  const bodyToBottom = Math.max(bottomY - bodyY, 0);
  const tallParticle = height > 34;
  if (tallParticle && bodyToBottom > height * 0.18) {
    return bottomY - Math.min(bodyToBottom, height * 0.22);
  }
  return bodyY;
}

function particleRowThreshold(atoms) {
  let heights = atoms
    .filter((atom) => cleanAtomKey(atom.family) === "k")
    .map((atom) => Math.max(Number(atom.bounds_h), 1))
    .filter(Number.isFinite);
  if (heights.length < 4) {
    heights = atoms
      .map((atom) => Math.max(Number(atom.bounds_h), 1))
      .filter(Number.isFinite);
  }
  return clamp(median(heights) * 2.2, 26, 56);
}

function maybeMedian(values) {
  return values.length ? median(values) : undefined;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function particleKey(atoms) {
  return atoms
    .map((atom) => Number(atom.id))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .join(",");
}

function orderMoleculesIntoRows(molecules) {
  if (molecules.length === 0) return [];

  const sortedByY = [...molecules].sort((a, b) => a.bounds_y - b.bounds_y || a.bounds_x - b.bounds_x);
  const gaps = sortedByY
    .slice(1)
    .map((molecule, index) => molecule.bounds_y - sortedByY[index].bounds_y)
    .filter((gap) => gap > 0);
  const medianGap = median(gaps);
  const rowBreak = Math.max(24, medianGap * 2.2);

  const rows = [];
  for (const molecule of sortedByY) {
    const lastRow = rows.at(-1);
    if (!lastRow || molecule.bounds_y - lastRow.lastY > rowBreak) {
      rows.push({ lastY: molecule.bounds_y, molecules: [molecule] });
      continue;
    }

    lastRow.lastY = Math.max(lastRow.lastY, molecule.bounds_y);
    lastRow.molecules.push(molecule);
  }

  return rows.flatMap((row, rowIndex) =>
    row.molecules
      .sort((a, b) => a.bounds_x - b.bounds_x || a.bounds_y - b.bounds_y)
      .map((molecule) => ({ ...molecule, row_index: rowIndex + 1 }))
  );
}

function median(values) {
  if (values.length === 0) return 30;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function groupBy(rows, keyFn) {
  const grouped = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return grouped;
}

function countBy(values, keyFn) {
  const counts = {};
  for (const value of values) {
    const key = keyFn(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function cleanAtomToken(atom) {
  const family = cleanAtomKey(atom.family);
  const config = cleanAtomKey(atom.structural_config ?? "");
  return config ? `${family}:${config}` : family;
}

function cleanAtomKey(value) {
  const clean = String(value ?? "").trim();
  return clean.replace(/_base$/i, "").toLowerCase();
}

function unitId(imageName, index) {
  const page = imageName.replace(/\.[^.]+$/, "").replace(/^page-/, "p");
  return `${page}-u${String(index).padStart(3, "0")}`;
}

function toTsv(rows, fields) {
  return [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
  ].join("\n") + "\n";
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}
