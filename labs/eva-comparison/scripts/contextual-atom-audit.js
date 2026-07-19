import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.symbol) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const dbPath = path.resolve(
  args.db ??
    path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);
const symbol = cleanToken(args.symbol);
const contextSymbol = cleanToken(args.context ?? "a:1");
const imageNames = String(args.images ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = atomRows(db, imageNames);
const particles = groupBy(rows, (row) => row.particle_id || `unassigned:${row.atom_id}`);
const occurrences = [];

for (const particleRows of particles.values()) {
  particleRows.sort((a, b) =>
    Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id)
  );
  const tokens = particleRows.map((row) => row.token);
  const firstToken = tokens[0] ?? "";
  for (let index = 0; index < particleRows.length; index += 1) {
    const row = particleRows[index];
    if (row.token !== symbol) continue;
    const leftTokens = tokens.slice(0, index);
    const rightTokens = tokens.slice(index + 1);
    occurrences.push({
      image_name: row.image_name,
      image_id: row.image_id,
      molecule_id: row.molecule_id,
      particle_id: row.particle_id,
      atom_id: row.atom_id,
      role: roleFor(index, tokens.length),
      position: index + 1,
      particle_length: tokens.length,
      first_token: firstToken,
      starts_with_context: firstToken === contextSymbol ? "yes" : "no",
      context_before: leftTokens.includes(contextSymbol) ? "yes" : "no",
      context_anywhere: tokens.includes(contextSymbol) ? "yes" : "no",
      left_neighbor: tokens[index - 1] ?? "",
      right_neighbor: tokens[index + 1] ?? "",
      particle_signature: tokens.join(" "),
    });
  }
}

const markdown = buildMarkdown(occurrences, symbol, contextSymbol, imageNames);
const tsv = toTsv(occurrences, [
  "image_name",
  "molecule_id",
  "particle_id",
  "atom_id",
  "role",
  "position",
  "particle_length",
  "first_token",
  "starts_with_context",
  "context_before",
  "context_anywhere",
  "left_neighbor",
  "right_neighbor",
  "particle_signature",
]);

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote contextual audit to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  const outPath = path.resolve(process.cwd(), args.tsv);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tsv, "utf8");
  console.log(`Wrote contextual audit TSV to ${outPath}`);
}

function atomRows(db, names) {
  const imageFilter = names.length
    ? `AND i.name IN (${names.map(() => "?").join(",")})`
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
         a.bounds_x
       FROM atoms a
       JOIN images i ON i.id = a.image_id
       WHERE a.molecule_id IS NOT NULL
       ${imageFilter}
       ORDER BY a.image_id, a.molecule_id, a.particle_id, a.atom_order, a.bounds_x, a.id`
    )
    .all(...names)
    .map((row) => ({
      ...row,
      token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
    }));
}

function buildMarkdown(rows, symbol, contextSymbol, imageNames) {
  const byRole = countBy(rows, (row) => row.role);
  const medial = rows.filter((row) => row.role === "medial");
  const final = rows.filter((row) => row.role === "final");
  const medialStarts = medial.filter((row) => row.starts_with_context === "yes");
  const medialBefore = medial.filter((row) => row.context_before === "yes");
  const medialNoBefore = medial.filter((row) => row.context_before !== "yes");
  const finalBefore = final.filter((row) => row.context_before === "yes");
  const finalStarts = final.filter((row) => row.starts_with_context === "yes");

  const lines = [
    `# Contextual Atom Audit: ${symbol}`,
    "",
    "## Scope",
    "",
    `- Symbol: \`${symbol}\``,
    `- Context symbol: \`${contextSymbol}\``,
    `- Images: ${imageNames.length ? imageNames.map((name) => `\`${name}\``).join(", ") : "`all annotated images`"}`,
    `- Occurrences: \`${rows.length}\``,
    "",
    "## Role Counts",
    "",
    "| Role | Count |",
    "| --- | ---: |",
    `| initial | ${byRole.initial ?? 0} |`,
    `| medial | ${byRole.medial ?? 0} |`,
    `| final | ${byRole.final ?? 0} |`,
    `| singleton | ${byRole.singleton ?? 0} |`,
    "",
    "## Context Test",
    "",
    "| Test | Count | Total | Share |",
    "| --- | ---: | ---: | ---: |",
    metricRow(`${symbol} medial and particle starts with ${contextSymbol}`, medialStarts.length, medial.length),
    metricRow(`${symbol} medial and ${contextSymbol} occurs before it`, medialBefore.length, medial.length),
    metricRow(`${symbol} medial without ${contextSymbol} before it`, medialNoBefore.length, medial.length),
    metricRow(`${symbol} final with ${contextSymbol} before it`, finalBefore.length, final.length),
    metricRow(`${symbol} final in particle starting with ${contextSymbol}`, finalStarts.length, final.length),
    "",
    "## Exceptions To Inspect",
    "",
    `### Medial ${symbol} without prior ${contextSymbol}`,
    "",
    ...tableRows(medialNoBefore),
    "",
    `### Final ${symbol} with prior ${contextSymbol}`,
    "",
    ...tableRows(finalBefore),
    "",
    "## All Occurrences",
    "",
    ...tableRows(rows),
    "",
  ];
  return lines.join("\n");
}

function metricRow(label, count, total) {
  const share = total ? (count / total).toFixed(4) : "0.0000";
  return `| ${label} | ${count} | ${total} | ${share} |`;
}

function tableRows(rows) {
  if (!rows.length) return ["No rows."];
  return [
    "| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |",
    "| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |",
    ...rows.map((row) => (
      `| ${row.image_name} | ${row.molecule_id} | ${row.particle_id} | ${row.atom_id} | ${row.role} | ${row.position}/${row.particle_length} | ${row.first_token} | ${row.left_neighbor || "-"} | ${row.right_neighbor || "-"} | \`${row.particle_signature}\` |`
    )),
  ];
}

function roleFor(index, length) {
  if (length <= 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function cleanToken(value) {
  const [family, config = ""] = String(value ?? "").trim().toLowerCase().split(":");
  return config ? `${family}:${config}` : family;
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

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }
    if (!arg.startsWith("--")) continue;
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
  node scripts/contextual-atom-audit.js --symbol d:1 --context a:1 --images page-003.jpg,page-094.jpg --out cases/combined/contextual-d1-audit.md --tsv cases/combined/contextual-d1-audit.tsv`);
}
