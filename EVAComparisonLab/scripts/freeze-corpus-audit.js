import fs from "node:fs";
import path from "node:path";

import {
  atomSort,
  cleanToken,
  defaultDatasetCreatorDbPath,
  groupBy,
  openDatasetDb,
  parseArgs,
  roleFor,
  tokenSort,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const images = String(args.images ?? "page-003.jpg,page-004.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const outDir = path.resolve(args.out_dir ?? "cases/freeze-audit-current");
const knownAnomaliesPath = path.resolve(args.known_anomalies ?? "cases/known-labeling-anomalies.tsv");
const known = readKnownAnomalies(knownAnomaliesPath);

const db = openDatasetDb(args.db ?? defaultDatasetCreatorDbPath());
const atoms = allAtomRows(db, images);
const assignedAtoms = atoms.filter((row) => row.molecule_id && row.particle_id && row.token);
const particles = sequenceGroups(assignedAtoms, "particle");
const molecules = sequenceGroups(assignedAtoms, "molecule");

const findings = [
  ...integrityFindings(atoms),
  ...orderHealthFindings(particles, "particle"),
  ...orderHealthFindings(molecules, "molecule"),
  ...dominantRoleExceptions(particles),
  ...strongContextExceptions(particles),
  ...mergePatternFindings(db),
  ...manualOverrideFindings(db, images),
];

const activeFindings = [];
const knownFindings = [];
for (const finding of findings.sort(findingSort)) {
  const key = normalizeAtomIds(finding.atom_ids);
  const knownRow = key ? known.get(key) : null;
  if (knownRow && finding.reviewable !== "no") {
    knownFindings.push({ ...finding, anomaly_status: knownRow.status, anomaly_note: knownRow.note });
  } else {
    activeFindings.push(finding);
  }
}

const fields = [
  "severity",
  "category",
  "reason",
  "image_name",
  "molecule_id",
  "particle_id",
  "row_hint",
  "observed",
  "expected",
  "support",
  "atom_ids",
  "particle_ids",
];

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "freeze-corpus-audit.tsv"), activeFindings, fields);
writeTsv(path.join(outDir, "freeze-corpus-known-anomalies.tsv"), knownFindings, [
  ...fields,
  "anomaly_status",
  "anomaly_note",
]);
fs.writeFileSync(
  path.join(outDir, "freeze-corpus-audit.md"),
  renderMarkdown({ activeFindings, knownFindings, images, knownAnomaliesPath, atoms, assignedAtoms, particles, molecules }),
  "utf8"
);

console.log(`Wrote ${activeFindings.length} freeze-audit findings to ${path.join(outDir, "freeze-corpus-audit.md")}`);
console.log(`Suppressed ${knownFindings.length} known anomaly findings from ${knownAnomaliesPath}`);

function allAtomRows(db, imageNames) {
  const imageFilter = imageNames.length
    ? `AND i.name IN (${imageNames.map(() => "?").join(",")})`
    : "";
  return db.prepare(
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
     LEFT JOIN particles p ON p.image_id = a.image_id AND p.particle_id = a.particle_id
     LEFT JOIN molecules m ON m.image_id = a.image_id AND m.molecule_id = a.molecule_id
     WHERE 1 = 1
       ${imageFilter}
     ORDER BY i.name, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
  ).all(...imageNames).map((row) => ({
    ...row,
    token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
  }));
}

function sequenceGroups(rows, scope) {
  const keyFn = scope === "particle"
    ? (row) => `${row.image_id}\u0000${row.particle_id}`
    : (row) => `${row.image_id}\u0000${row.molecule_id}`;
  return [...groupBy(rows, keyFn).values()].map((groupRows) => {
    const ordered = groupRows.slice().sort(atomSort);
    const first = ordered[0];
    const tokens = ordered.map((row) => row.token).filter(Boolean);
    return {
      scope,
      image_name: first.image_name,
      image_id: first.image_id,
      molecule_id: first.molecule_id,
      particle_id: scope === "particle" ? first.particle_id : "",
      source_index: scope === "particle" ? Number(first.source_index ?? 0) : "",
      row_hint: rowHint(first),
      tokens,
      sequence: tokens.join(" "),
      bag: bagSignature(tokens),
      atom_ids: ordered.map((row) => row.atom_id).join(" "),
      atom_id_list: ordered.map((row) => row.atom_id),
      particle_ids: [...new Set(ordered.map((row) => row.particle_id).filter(Boolean))].join(" "),
      length: tokens.length,
      ordered,
    };
  }).filter((item) => item.sequence);
}

function integrityFindings(rows) {
  const findings = [];
  for (const row of rows) {
    const token = row.token;
    const retired = ["a:2", "g:2", "j:2"].includes(token);
    const blank = !token;
    const unassigned = !row.molecule_id || !row.particle_id;
    if (!retired && !blank && !unassigned) continue;
    findings.push({
      severity: retired || blank ? "must_review" : "inspect",
      category: retired ? "retired-symbol" : blank ? "blank-label" : "unassigned-atom",
      reason: retired ? "symbol retired from current alphabet" : blank ? "atom has missing family/config" : "atom is labeled but not assigned to molecule/particle",
      image_name: row.image_name,
      molecule_id: row.molecule_id ?? "",
      particle_id: row.particle_id ?? "",
      row_hint: `y=${Number(row.bounds_y ?? 0).toFixed(0)}`,
      observed: token || "(blank)",
      expected: "",
      support: "",
      atom_ids: String(row.atom_id),
      particle_ids: row.particle_id ?? "",
    });
  }
  return findings;
}

function orderHealthFindings(groups, scope) {
  const findings = [];
  const byBag = groupBy(groups.filter((group) => group.length >= 2), (group) => group.bag);
  for (const [bag, bagGroups] of byBag.entries()) {
    if (bagGroups.length < 2) continue;
    const variants = [...groupBy(bagGroups, (group) => group.sequence).entries()]
      .map(([sequence, items]) => ({ sequence, items }))
      .sort((a, b) => b.items.length - a.items.length || a.sequence.localeCompare(b.sequence));
    if (variants.length < 2) continue;
    const dominant = variants[0];
    const total = bagGroups.length;
    for (const variant of variants.slice(1)) {
      const share = variant.items.length / total;
      const severity = total >= 5 && variant.items.length <= 2 && share <= 0.25
        ? "must_review"
        : total >= 3 && variant.items.length <= 2 && share <= 0.34
          ? "inspect"
          : "informational";
      for (const item of variant.items) {
        findings.push({
          severity,
          category: `${scope}-minority-order`,
          reason: `same inventory has a minority order; bag=${bag}`,
          image_name: item.image_name,
          molecule_id: item.molecule_id,
          particle_id: item.particle_id,
          row_hint: item.row_hint,
          observed: item.sequence,
          expected: dominant.sequence,
          support: `minority ${variant.items.length}/${total}; dominant ${dominant.items.length}/${total}`,
          atom_ids: item.atom_ids,
          particle_ids: item.particle_ids,
        });
      }
    }
  }
  return findings;
}

function dominantRoleExceptions(particles) {
  const rows = [];
  const occurrences = [];
  for (const particle of particles) {
    particle.tokens.forEach((token, index) => {
      occurrences.push({
        token,
        role: roleFor(index, particle.tokens.length),
        particle,
        index,
        atom_id: particle.atom_id_list[index],
      });
    });
  }
  const byToken = groupBy(occurrences, (row) => row.token);
  for (const [token, tokenRows] of byToken.entries()) {
    if (tokenRows.length < 20) continue;
    const roleCounts = countMap(tokenRows.map((row) => row.role));
    const [dominantRole, dominantCount] = [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    const share = dominantCount / tokenRows.length;
    if (share < 0.95) continue;
    for (const row of tokenRows.filter((item) => item.role !== dominantRole)) {
      rows.push({
        severity: "inspect",
        category: "dominant-role-exception",
        reason: `${token} is ${dominantRole} in ${dominantCount}/${tokenRows.length} occurrences`,
        image_name: row.particle.image_name,
        molecule_id: row.particle.molecule_id,
        particle_id: row.particle.particle_id,
        row_hint: row.particle.row_hint,
        observed: `${token} as ${row.role} in ${row.particle.sequence}`,
        expected: `${token} as ${dominantRole}`,
        support: `${dominantCount}/${tokenRows.length}`,
        atom_ids: String(row.atom_id),
        particle_ids: row.particle.particle_id,
      });
    }
  }
  return rows;
}

function strongContextExceptions(particles) {
  const occurrences = [];
  const vocabulary = [...new Set(particles.flatMap((particle) => particle.tokens))].sort(tokenSort);
  for (const particle of particles) {
    particle.tokens.forEach((token, index) => {
      occurrences.push({
        token,
        role: roleFor(index, particle.tokens.length),
        particle,
        index,
        before: particle.tokens.slice(0, index),
        after: particle.tokens.slice(index + 1),
        prev: particle.tokens[index - 1] ?? "",
        next: particle.tokens[index + 1] ?? "",
        first: particle.tokens[0] ?? "",
        last: particle.tokens.at(-1) ?? "",
        atom_id: particle.atom_id_list[index],
      });
    });
  }
  const tests = [
    ["has_prior", (row, token) => row.before.includes(token)],
    ["has_after", (row, token) => row.after.includes(token)],
    ["prev_is", (row, token) => row.prev === token],
    ["next_is", (row, token) => row.next === token],
    ["starts_with", (row, token) => row.first === token],
    ["ends_with", (row, token) => row.last === token],
  ];
  const findings = [];
  const bySymbolRole = groupBy(occurrences, (row) => `${row.token}\u0000${row.role}`);
  for (const [key, rows] of bySymbolRole.entries()) {
    if (rows.length < 15) continue;
    const [symbol, role] = key.split("\u0000");
    for (const [testName, predicate] of tests) {
      for (const token of vocabulary) {
        if (token === symbol) continue;
        const passing = rows.filter((row) => predicate(row, token));
        const share = passing.length / rows.length;
        const exceptionCount = rows.length - passing.length;
        if (passing.length < 10 || share < 0.94 || exceptionCount === 0 || exceptionCount > 4) continue;
        for (const row of rows.filter((item) => !predicate(item, token))) {
          findings.push({
            severity: share >= 0.98 ? "must_review" : "inspect",
            category: "strong-context-exception",
            reason: `${symbol} ${role} usually satisfies ${testName} ${token}`,
            image_name: row.particle.image_name,
            molecule_id: row.particle.molecule_id,
            particle_id: row.particle.particle_id,
            row_hint: row.particle.row_hint,
            observed: row.particle.sequence,
            expected: `${testName} ${token}`,
            support: `${passing.length}/${rows.length}`,
            atom_ids: String(row.atom_id),
            particle_ids: row.particle.particle_id,
          });
        }
      }
    }
  }
  return findings;
}

function mergePatternFindings(db) {
  const rows = db.prepare(
    `SELECT id, signature_key, ordered_tokens_json, sample_image_id, sample_particle_id
     FROM particle_order_patterns
     WHERE signature_key LIKE '%a:2%'
        OR signature_key LIKE '%g:2%'
        OR signature_key LIKE '%j:2%'
     ORDER BY id`
  ).all();
  return rows.map((row) => ({
    severity: "must_review",
    category: "stale-learned-pattern",
    reason: "learned particle order pattern still references retired symbols",
    image_name: String(row.sample_image_id ?? ""),
    molecule_id: "",
    particle_id: String(row.sample_particle_id ?? ""),
    row_hint: "",
    observed: row.signature_key,
    expected: "no retired symbols",
    support: `pattern #${row.id}`,
    atom_ids: "",
    particle_ids: String(row.sample_particle_id ?? ""),
    reviewable: "no",
  }));
}

function manualOverrideFindings(db, imageNames) {
  const imageRows = db.prepare(
    `SELECT id, name FROM images WHERE name IN (${imageNames.map(() => "?").join(",")})`
  ).all(...imageNames);
  const ids = imageRows.map((row) => row.id);
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const gapCount = db.prepare(`SELECT count(*) AS n FROM molecule_gap_overrides WHERE image_id IN (${placeholders})`).get(...ids).n;
  const rowCount = db.prepare(`SELECT count(*) AS n FROM particle_row_overrides WHERE image_id IN (${placeholders})`).get(...ids).n;
  return [
    {
      severity: "informational",
      category: "manual-gap-overrides",
      reason: "manual cut/join overrides exist; audit visually before final freeze if desired",
      image_name: imageRows.map((row) => row.name).join(","),
      molecule_id: "",
      particle_id: "",
      row_hint: "",
      observed: String(gapCount),
      expected: "",
      support: `${gapCount} gap overrides`,
      atom_ids: "",
      particle_ids: "",
      reviewable: "no",
    },
    {
      severity: "informational",
      category: "manual-row-overrides",
      reason: "manual row overrides exist; these are expected after row editing but worth documenting",
      image_name: imageRows.map((row) => row.name).join(","),
      molecule_id: "",
      particle_id: "",
      row_hint: "",
      observed: String(rowCount),
      expected: "",
      support: `${rowCount} row overrides`,
      atom_ids: "",
      particle_ids: "",
      reviewable: "no",
    },
  ];
}

function renderMarkdown({ activeFindings, knownFindings, images, knownAnomaliesPath, atoms, assignedAtoms, particles, molecules }) {
  const counts = countMap(activeFindings.map((row) => row.severity));
  const categoryCounts = [...countMap(activeFindings.map((row) => row.category)).entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = activeFindings.filter((row) => row.severity !== "informational").slice(0, 80);
  const info = activeFindings.filter((row) => row.severity === "informational");
  return `# Freeze Corpus Audit

Purpose: aggressively search for possible human labeling issues before freezing the current corpus.

This report is intentionally broader than the academic metrics. It includes weak suspects and informational guardrails.

## Scope

- Images: ${images.map((name) => `\`${name}\``).join(", ")}
- DB atoms read: \`${atoms.length}\`
- Assigned labeled atoms: \`${assignedAtoms.length}\`
- Particle sequences: \`${particles.length}\`
- Molecule sequences: \`${molecules.length}\`
- Known anomalies list: \`${path.relative(process.cwd(), knownAnomaliesPath)}\`

## Summary

- Must review: \`${counts.get("must_review") ?? 0}\`
- Inspect: \`${counts.get("inspect") ?? 0}\`
- Informational: \`${counts.get("informational") ?? 0}\`
- Known anomalies suppressed from active review queue: \`${knownFindings.length}\`

## Categories

${categoryCounts.length ? categoryCounts.map(([category, count]) => `- \`${category}\`: \`${count}\``).join("\n") : "No active categories."}

## Review Queue

${top.length ? top.map(renderFinding).join("\n") : "No active review findings under the current freeze-audit rules.\n"}

## Informational

${info.length ? info.map(renderFinding).join("\n") : "No informational guardrails.\n"}

Full table: \`freeze-corpus-audit.tsv\`

Known anomalies table: \`freeze-corpus-known-anomalies.tsv\`
`;
}

function renderFinding(row, index) {
  return `### ${index + 1}. ${row.severity} · ${row.category} · ${row.image_name}${row.molecule_id ? ` · ${row.molecule_id}` : ""}${row.particle_id ? ` · ${row.particle_id}` : ""}

- Observed: \`${row.observed}\`
- Expected/check: \`${row.expected}\`
- Support: ${row.support || "-"}
- Locate: ${row.row_hint || "-"}
- Atom ids: \`${row.atom_ids || "-"}\`
- Why: ${row.reason}
`;
}

function rowHint(row) {
  const y = Number(row.molecule_y ?? row.bounds_y ?? 0);
  return Number.isFinite(y) ? `y=${y.toFixed(0)}` : "";
}

function bagSignature(tokens) {
  return tokens.slice().sort(tokenSort).join(" ");
}

function countMap(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function findingSort(a, b) {
  const severityOrder = { must_review: 0, inspect: 1, informational: 2 };
  return (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)
    || a.category.localeCompare(b.category)
    || String(a.image_name).localeCompare(String(b.image_name))
    || String(a.molecule_id).localeCompare(String(b.molecule_id))
    || String(a.particle_id).localeCompare(String(b.particle_id));
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
  const rows = new Map();
  for (const line of lines) {
    const cells = line.split("\t");
    const key = normalizeAtomIds(cells[atomIndex] ?? "");
    if (!key) continue;
    rows.set(key, {
      status: cells[statusIndex] || "known-anomaly",
      note: cells[noteIndex] || "",
    });
  }
  return rows;
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

function printHelp() {
  console.log(`Usage:
  node scripts/freeze-corpus-audit.js --images page-003.jpg,page-004.jpg,page-094.jpg

Options:
  --db <path>              Path to datasetcreator.db.
  --images <csv>           Image names to inspect.
  --out-dir <path>         Output directory. Default: cases/freeze-audit-current
  --known-anomalies <path> TSV with atom_ids/status/note for known rare cases.`);
}
