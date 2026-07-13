import fs from "node:fs";
import path from "node:path";

import {
  cleanToken,
  defaultDatasetCreatorDbPath,
  groupBy,
  openDatasetDb,
  parseArgs,
  tokenSort,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const images = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const outDir = path.resolve(args.out_dir ?? "cases/combined-f1r-f47v-full-current");
const minSupport = Number(args.min_support ?? 4);
const maxRareCount = Number(args.max_rare_count ?? 2);
const maxRareRatio = Number(args.max_rare_ratio ?? 0.18);
const includeLearnedPatterns = Boolean(args.include_learned_patterns ?? args["include-learned-patterns"]);
const knownAnomaliesPath = path.resolve(args.known_anomalies ?? "cases/known-labeling-anomalies.tsv");
const knownAnomalies = readKnownAnomalies(knownAnomaliesPath);

const db = openDatasetDb(args.db ?? defaultDatasetCreatorDbPath());
const atoms = atomRows(db, images);
const particles = particleSequences(atoms);
const molecules = moleculeSequences(particles);
const particleOrderPatterns = includeLearnedPatterns ? orderPatterns(db, "particle_order_patterns") : new Map();
const moleculeOrderPatterns = includeLearnedPatterns ? orderPatterns(db, "molecule_order_patterns") : new Map();

const particleFindings = orderAnomalies(particles, {
  scope: "particle",
  minSupport,
  maxRareCount,
  maxRareRatio,
});
const moleculeFindings = orderAnomalies(molecules, {
  scope: "molecule",
  minSupport: Math.max(3, Math.ceil(minSupport / 2)),
  maxRareCount,
  maxRareRatio,
});
const patternFindings = includeLearnedPatterns
  ? [
      ...patternMismatches(particles, particleOrderPatterns, "particle"),
      ...patternMismatches(molecules, moleculeOrderPatterns, "molecule"),
    ]
  : [];
const windowFindings = windowOrderAnomalies(particles);

const allRows = [...patternFindings, ...windowFindings, ...particleFindings, ...moleculeFindings]
  .sort((a, b) =>
    b.score - a.score
    || b.total - a.total
    || a.scope.localeCompare(b.scope)
    || String(a.image_name).localeCompare(String(b.image_name))
    || String(a.molecule_id).localeCompare(String(b.molecule_id))
    || String(a.particle_id).localeCompare(String(b.particle_id))
  );
const rows = [];
const knownRows = [];
for (const row of allRows) {
  const known = knownAnomalies.get(normalizeAtomIds(row.atom_ids));
  if (known) {
    knownRows.push({
      ...row,
      anomaly_status: known.status,
      anomaly_note: known.note,
    });
  } else {
    rows.push(row);
  }
}

const fields = [
  "scope",
  "severity",
  "score",
  "reason",
  "image_name",
  "molecule_id",
  "particle_id",
  "source_index",
  "row_hint",
  "observed_sequence",
  "dominant_sequence",
  "bag_signature",
  "variant_count",
  "dominant_count",
  "total",
  "rare_ratio",
  "atom_ids",
  "particle_ids",
];

writeTsv(path.join(outDir, "labeling-anomaly-audit.tsv"), rows, fields);
writeTsv(path.join(outDir, "labeling-anomaly-known.tsv"), knownRows, [
  ...fields,
  "anomaly_status",
  "anomaly_note",
]);
fs.writeFileSync(
  path.join(outDir, "labeling-anomaly-audit.md"),
  renderMarkdown(rows, { images, minSupport, maxRareCount, maxRareRatio, knownRows, knownAnomaliesPath, includeLearnedPatterns }),
  "utf8"
);

console.log(`Wrote ${rows.length} labeling anomaly candidates to ${path.join(outDir, "labeling-anomaly-audit.md")}`);
console.log(`Suppressed ${knownRows.length} known anomaly candidates from ${knownAnomaliesPath}`);

function atomRows(db, imageNames) {
  const filter = imageNames.length
    ? `AND i.name IN (${imageNames.map(() => "?").join(",")})`
    : "";
  return db
    .prepare(
      `SELECT
         a.id AS atom_id,
         a.image_id,
         i.name AS image_name,
         a.molecule_id,
         a.particle_id,
         a.atom_order,
         a.family,
         a.structural_config,
         a.bounds_x,
         a.bounds_y,
         p.particle_order,
         p.source_index,
         m.bounds_y AS molecule_y,
         m.bounds_x AS molecule_x
       FROM atoms a
       JOIN images i ON i.id = a.image_id
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       LEFT JOIN molecules m ON m.molecule_id = a.molecule_id AND m.image_id = a.image_id
       WHERE a.molecule_id IS NOT NULL
         AND a.particle_id IS NOT NULL
         AND trim(coalesce(a.family, '')) <> ''
         ${filter}
       ORDER BY
         a.image_id,
         m.bounds_y,
         m.bounds_x,
         a.molecule_id,
         p.particle_order,
         a.particle_id,
         a.atom_order,
         a.bounds_x,
         a.id`
    )
    .all(...imageNames)
    .map((row) => ({
      ...row,
      token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
    }));
}

function orderPatterns(db, table) {
  const rows = db
    .prepare(`SELECT signature_key, ordered_tokens_json FROM ${table}`)
    .all();
  const patterns = new Map();
  for (const row of rows) {
    try {
      patterns.set(String(row.signature_key), JSON.parse(row.ordered_tokens_json).map(cleanToken).join(" "));
    } catch {
      // Ignore malformed historical rows; the audit is read-only.
    }
  }
  return patterns;
}

function particleSequences(rows) {
  return [...groupBy(rows, (row) => `${row.image_id}\u0000${row.particle_id}`).values()]
    .map((groupRows) => {
      const ordered = groupRows.slice().sort(atomSort);
      const first = ordered[0];
      const tokens = ordered.map((row) => row.token).filter(Boolean);
      return {
        scope: "particle",
        image_id: first.image_id,
        image_name: first.image_name,
        molecule_id: first.molecule_id,
        particle_id: first.particle_id,
        source_index: Number(first.source_index || 0),
        row_hint: rowHint(first),
        sequence: tokens.join(" "),
        tokens,
        atom_id_list: ordered.map((row) => row.atom_id),
        bag: bagSignature(tokens),
        signature_key: bagSignaturePlus(tokens),
        atom_ids: ordered.map((row) => row.atom_id).join(" "),
        particle_ids: String(first.particle_id ?? ""),
        order_index: Number(first.particle_order ?? 0),
        molecule_y: Number(first.molecule_y ?? 0),
        molecule_x: Number(first.molecule_x ?? 0),
      };
    })
    .filter((item) => item.sequence && item.bag);
}

function moleculeSequences(particles) {
  return [...groupBy(particles, (particle) => `${particle.image_id}\u0000${particle.molecule_id}`).values()]
    .map((groupRows) => {
      const ordered = groupRows.slice().sort((a, b) =>
        Number(a.order_index ?? 0) - Number(b.order_index ?? 0)
        || String(a.particle_id).localeCompare(String(b.particle_id))
      );
      const first = ordered[0];
      const tokens = ordered.map((particle) => `[${particle.sequence}]`);
      return {
        scope: "molecule",
        image_id: first.image_id,
        image_name: first.image_name,
        molecule_id: first.molecule_id,
        particle_id: "",
        source_index: "",
        row_hint: first.row_hint,
        sequence: tokens.join(" "),
        bag: bagSignature(tokens),
        signature_key: bagSignaturePlus(ordered.map((particle) => particle.sequence)),
        atom_ids: ordered.map((particle) => particle.atom_ids).join(" | "),
        particle_ids: ordered.map((particle) => particle.particle_id).join(" "),
        order_index: 0,
        molecule_y: first.molecule_y,
        molecule_x: first.molecule_x,
      };
    })
    .filter((item) => item.sequence && item.bag);
}

function patternMismatches(items, patterns, scope) {
  const findings = [];
  for (const item of items) {
    const expected = patterns.get(item.signature_key);
    if (!expected || expected === item.sequence) continue;
    const observedParts = item.sequence.split(/\s+/);
    const expectedParts = expected.split(/\s+/);
    const distance = editDistance(observedParts, expectedParts);
    findings.push({
      scope,
      severity: distance <= 2 ? "alta" : "media",
      score: Number((140 - Math.min(distance, 8) * 4).toFixed(2)),
      reason: `no coincide con el patron aprendido para la misma firma; distancia ${distance}`,
      image_name: item.image_name,
      molecule_id: item.molecule_id,
      particle_id: item.particle_id,
      source_index: item.source_index,
      row_hint: item.row_hint,
      observed_sequence: item.sequence,
      dominant_sequence: expected,
      bag_signature: item.signature_key,
      variant_count: 1,
      dominant_count: "pattern",
      total: "pattern",
      rare_ratio: "",
      atom_ids: item.atom_ids,
      particle_ids: item.particle_ids,
    });
  }
  return findings;
}

function windowOrderAnomalies(particles) {
  const windows = [];
  for (const particle of particles) {
    const tokens = particle.tokens || [];
    const atomIds = particle.atom_id_list || [];
    for (const size of [3, 4]) {
      if (tokens.length < size) continue;
      for (let index = 0; index <= tokens.length - size; index += 1) {
        const slice = tokens.slice(index, index + size);
        windows.push({
          ...particle,
          scope: `particle-window-${size}`,
          window_index: index + 1,
          full_sequence: tokens.join(" "),
          sequence: slice.join(" "),
          bag: bagSignature(slice),
          atom_ids: atomIds.slice(index, index + size).join(" "),
        });
      }
    }
  }

  return orderAnomalies(windows, {
    scope: "particle-window",
    minSupport: 5,
    maxRareCount: 1,
    maxRareRatio: 0.12,
    suppressIfDominantWindowPresent: true,
  }).map((row) => ({
    ...row,
    reason: `ventana interna rara: ${row.reason}`,
  }));
}

function orderAnomalies(items, options) {
  const findings = [];
  const groups = groupBy(items, (item) => item.bag);
  for (const [bag, groupItems] of groups.entries()) {
    if (groupItems.length < options.minSupport) continue;
    const variants = [...groupBy(groupItems, (item) => item.sequence).entries()]
      .map(([sequence, sequenceItems]) => ({ sequence, items: sequenceItems }))
      .sort((a, b) => b.items.length - a.items.length || a.sequence.localeCompare(b.sequence));
    if (variants.length < 2) continue;

    const dominant = variants[0];
    const total = groupItems.length;
    const dominantCount = dominant.items.length;
    if (dominantCount < 2) continue;

    for (const variant of variants.slice(1)) {
      const variantCount = variant.items.length;
      const rareRatio = variantCount / total;
      if (variantCount > options.maxRareCount || rareRatio > options.maxRareRatio) continue;

      const distance = editDistance(variant.sequence.split(/\s+/), dominant.sequence.split(/\s+/));
      for (const item of variant.items) {
        if (
          options.suppressIfDominantWindowPresent
          && containsContiguousSubsequence(
            String(item.full_sequence || "").split(/\s+/).filter(Boolean),
            dominant.sequence.split(/\s+/)
          )
        ) {
          continue;
        }
        const score = Number(((dominantCount / total) * 100 + distance * 12 + (1 / variantCount) * 10).toFixed(2));
        findings.push({
          scope: options.scope,
          severity: score >= 105 ? "alta" : score >= 85 ? "media" : "baja",
          score,
          reason: `${variantCount}/${total} con mismo inventario aparece en orden raro; dominante ${dominantCount}/${total}; distancia ${distance}`,
          image_name: item.image_name,
          molecule_id: item.molecule_id,
          particle_id: item.particle_id,
          source_index: item.source_index,
          row_hint: item.row_hint,
          observed_sequence: item.sequence,
          dominant_sequence: dominant.sequence,
          bag_signature: bag,
          variant_count: variantCount,
          dominant_count: dominantCount,
          total,
          rare_ratio: rareRatio.toFixed(3),
          atom_ids: item.atom_ids,
          particle_ids: item.particle_ids,
        });
      }
    }
  }
  return findings;
}

function containsContiguousSubsequence(tokens, subsequence) {
  if (!tokens.length || !subsequence.length || subsequence.length > tokens.length) return false;
  for (let index = 0; index <= tokens.length - subsequence.length; index += 1) {
    if (subsequence.every((token, offset) => tokens[index + offset] === token)) {
      return true;
    }
  }
  return false;
}

function atomSort(a, b) {
  return Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id);
}

function bagSignature(tokens) {
  return tokens.slice().sort(tokenSort).join(" ");
}

function bagSignaturePlus(tokens) {
  return tokens.slice().sort(tokenSort).join("+");
}

function rowHint(row) {
  const y = Number(row.molecule_y ?? row.bounds_y ?? 0);
  return Number.isFinite(y) ? `y=${y.toFixed(0)}` : "";
}

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function readKnownAnomalies(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return new Map();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  const atomIndex = header.indexOf("atom_ids");
  const statusIndex = header.indexOf("status");
  const noteIndex = header.indexOf("note");
  if (atomIndex < 0) {
    throw new Error(`Known-anomalies file needs an atom_ids column: ${filePath}`);
  }
  const known = new Map();
  for (const line of lines) {
    const cells = line.split("\t");
    const key = normalizeAtomIds(cells[atomIndex] ?? "");
    if (!key) continue;
    known.set(key, {
      status: cells[statusIndex] || "known-anomaly",
      note: cells[noteIndex] || "",
    });
  }
  return known;
}

function normalizeAtomIds(value) {
  return String(value ?? "")
    .split("|")
    .flatMap((chunk) => chunk.trim().split(/\s+/))
    .map((item) => Number(item))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .join(" ");
}

function renderMarkdown(rows, options) {
  const high = rows.filter((row) => row.severity === "alta");
  const medium = rows.filter((row) => row.severity === "media");
  const top = rows.slice(0, 40);
  return `# Labeling Anomaly Audit

Purpose: find likely human labeling/order mistakes before using the data for stronger metrics.

This is not an automatic correction list. It only flags cases where the current corpus has a dominant ordering pattern and a rare variant with the same atom inventory.

## Parameters

- Images: ${options.images.join(", ")}
- Minimum support per inventory: ${options.minSupport}
- Max rare count: ${options.maxRareCount}
- Max rare ratio: ${options.maxRareRatio}
- Learned-pattern memory included: ${options.includeLearnedPatterns ? "yes" : "no"}
- Known anomalies list: \`${path.relative(process.cwd(), options.knownAnomaliesPath)}\`

## Summary

- Candidates: ${rows.length}
- High priority: ${high.length}
- Medium priority: ${medium.length}
- Known anomalies suppressed from pending list: ${options.knownRows.length}
- Scopes: particle order and molecule particle-order

## Top Candidates

${top.length ? top.map(renderFinding).join("\n") : "No strong candidates found with current thresholds.\n"}

Full table: \`labeling-anomaly-audit.tsv\`

Known anomalies table: \`labeling-anomaly-known.tsv\`
`;
}

function renderFinding(row, index) {
  return `### ${index + 1}. ${row.severity.toUpperCase()} · ${row.scope} · ${row.image_name} · ${row.molecule_id}${row.particle_id ? ` · ${row.particle_id}` : ""}

- Observed: \`${row.observed_sequence}\`
- Dominant: \`${row.dominant_sequence}\`
- Support: rare ${row.variant_count}/${row.total}, dominant ${row.dominant_count}/${row.total}
- Locate: image \`${row.image_name}\`, molecule \`${row.molecule_id}\`${row.particle_id ? `, particle \`${row.particle_id}\`, source P${row.source_index}` : ""}, ${row.row_hint}
- Atom ids: \`${row.atom_ids}\`
- Why flagged: ${row.reason}
`;
}

function printHelp() {
  console.log(`Usage:
  node scripts/labeling-anomaly-audit.js --images page-003.jpg,page-094.jpg --out-dir cases/combined-f1r-f47v-full-current

Options:
  --db <path>              Path to datasetcreator.db.
  --images <csv>           Image names to inspect. Default: page-003.jpg,page-094.jpg
  --out-dir <path>         Output directory.
  --min-support <n>        Minimum repeated inventory count. Default: 4
  --max-rare-count <n>     Maximum count for a rare variant. Default: 2
  --max-rare-ratio <n>     Maximum ratio for a rare variant. Default: 0.18
  --known-anomalies <path> TSV with atom_ids/status/note for known rare cases.
  --include-learned-patterns
                          Also compare against DatasetCreator learned order patterns.
                          Off by default so old training memory cannot influence this audit.`);
}
