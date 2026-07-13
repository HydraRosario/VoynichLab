import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.symbol || !args.role || !args.test || !args.token) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const dbPath = path.resolve(
  args.db ??
    path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);
const symbol = cleanToken(args.symbol);
const role = String(args.role).trim().toLowerCase();
const test = String(args.test).trim().toLowerCase();
const token = cleanToken(args.token);
const imageNames = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const predicate = predicateFor(test);
const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = atomRows(db, imageNames);
const particles = [...groupBy(rows, (row) => row.particle_id || `unassigned:${row.atom_id}`).values()]
  .map((particleRows) => particleRows.sort(atomSort));

const matchingRole = [];
const passing = [];
const exceptions = [];

for (const particleRows of particles) {
  const tokens = particleRows.map((row) => row.token);
  for (let index = 0; index < particleRows.length; index += 1) {
    const row = particleRows[index];
    if (row.token !== symbol) continue;
    const occurrence = decorate(row, tokens, index);
    if (occurrence.role !== role) continue;
    matchingRole.push(occurrence);
    if (predicate(occurrence, token)) {
      passing.push(occurrence);
    } else {
      exceptions.push(occurrence);
    }
  }
}

const markdown = buildMarkdown({ symbol, role, test, token, imageNames, matchingRole, passing, exceptions });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote contextual rule exceptions to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  const outPath = path.resolve(process.cwd(), args.tsv);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, toTsv(exceptions, [
    "image_name",
    "molecule_id",
    "particle_id",
    "atom_id",
    "role",
    "position",
    "particle_length",
    "first_token",
    "left_neighbor",
    "right_neighbor",
    "particle_signature",
  ]), "utf8");
  console.log(`Wrote contextual rule exceptions TSV to ${outPath}`);
}

function decorate(row, tokens, index) {
  return {
    image_name: row.image_name,
    molecule_id: row.molecule_id,
    particle_id: row.particle_id,
    atom_id: row.atom_id,
    role: roleFor(index, tokens.length),
    position: index + 1,
    particle_length: tokens.length,
    first_token: tokens[0] ?? "",
    last_token: tokens.at(-1) ?? "",
    left_neighbor: tokens[index - 1] ?? "",
    right_neighbor: tokens[index + 1] ?? "",
    before_tokens: tokens.slice(0, index),
    after_tokens: tokens.slice(index + 1),
    particle_signature: tokens.join(" "),
  };
}

function predicateFor(name) {
  const predicates = {
    has_prior: (row, value) => row.before_tokens.includes(value),
    has_after: (row, value) => row.after_tokens.includes(value),
    starts_with: (row, value) => row.first_token === value,
    ends_with: (row, value) => row.last_token === value,
    prev_is: (row, value) => row.left_neighbor === value,
    next_is: (row, value) => row.right_neighbor === value,
  };
  if (!predicates[name]) {
    throw new Error(`Unknown test: ${name}`);
  }
  return predicates[name];
}

function buildMarkdown({ symbol, role, test, token, imageNames, matchingRole, passing, exceptions }) {
  const lines = [
    `# Contextual Rule Exceptions: ${symbol}`,
    "",
    "## Scope",
    "",
    `- Rule: \`${symbol}\` as \`${role}\` where \`${test}\` \`${token}\``,
    `- Images: ${imageNames.map((name) => `\`${name}\``).join(", ")}`,
    `- Matching role occurrences: \`${matchingRole.length}\``,
    `- Passing: \`${passing.length}\``,
    `- Exceptions: \`${exceptions.length}\``,
    "",
    "## Exceptions",
    "",
    ...tableRows(exceptions),
    "",
  ];
  return lines.join("\n");
}

function tableRows(rows) {
  if (!rows.length) return ["No rows."];
  return [
    "| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |",
    "| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |",
    ...rows.map((row) =>
      `| ${row.image_name} | ${row.molecule_id} | ${row.particle_id} | ${row.atom_id} | ${row.role} | ${row.position}/${row.particle_length} | ${row.first_token} | ${row.left_neighbor || "-"} | ${row.right_neighbor || "-"} | \`${row.particle_signature}\` |`
    ),
  ];
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

function atomSort(a, b) {
  return Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id);
}

function roleFor(index, length) {
  if (length <= 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
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
  node scripts/contextual-rule-exceptions.js --symbol e:1 --role final --test has_prior --token g:1

Options:
  --images <names>   Comma-separated image names. Default: page-003.jpg,page-094.jpg
  --out <path>       Write markdown report.
  --tsv <path>       Write TSV report.`);
}
