import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));
const startToken = args.start ?? args._[0] ?? "a:1";
const endToken = args.end ?? args._[1] ?? "e:1";
const startsWith = splitTokens(args.startsWith ?? args.starts_with ?? "");
const endsWith = splitTokens(args.endsWith ?? args.ends_with ?? "");
const contains = splitTokens(args.contains ?? "");
const anyStart = Boolean(args.anyStart ?? args.any_start);
const anyEnd = Boolean(args.anyEnd ?? args.any_end);
const dbPath = path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db");
const images = ["page-003.jpg", "page-004.jpg", "page-094.jpg"];

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db.prepare(
  `SELECT
     a.id AS atom_id,
     i.name AS image_name,
     a.molecule_id,
     a.particle_id,
     a.atom_order,
     a.bounds_x,
     a.family,
     a.structural_config,
     p.particle_order,
     p.source_index,
     m.bounds_y AS molecule_y
   FROM atoms a
   JOIN images i ON i.id = a.image_id
   LEFT JOIN particles p ON p.image_id = a.image_id AND p.particle_id = a.particle_id
   LEFT JOIN molecules m ON m.image_id = a.image_id AND m.molecule_id = a.molecule_id
   WHERE i.name IN (${images.map(() => "?").join(",")})
     AND a.molecule_id IS NOT NULL
     AND a.particle_id IS NOT NULL
   ORDER BY i.name, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
).all(...images);

const groups = new Map();
for (const row of rows) {
  const key = `${row.image_name}\u0000${row.molecule_id}\u0000${row.particle_id}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

const matches = [];
for (const group of groups.values()) {
  const ordered = group.slice().sort((a, b) =>
    Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id)
  );
  const tokens = ordered.map((row) => token(row));
  const startMatch = anyStart ? true : startsWith.length ? sequenceStartsWith(tokens, startsWith) : tokens[0] === startToken;
  const endMatch = anyEnd ? true : endsWith.length ? sequenceEndsWith(tokens, endsWith) : tokens.at(-1) === endToken;
  const containsMatch = contains.length ? sequenceContains(tokens, contains) : true;
  if (!startMatch || !endMatch || !containsMatch) continue;
  const first = ordered[0];
  matches.push({
    image_name: first.image_name,
    molecule_id: first.molecule_id,
    particle_id: first.particle_id,
    source_index: first.source_index ?? "",
    y: Math.round(Number(first.molecule_y ?? 0)),
    signature: tokens.join(" "),
    atom_ids: ordered.map((row) => row.atom_id).join(" "),
  });
}

matches.sort((a, b) =>
  a.image_name.localeCompare(b.image_name)
  || a.y - b.y
  || String(a.molecule_id).localeCompare(String(b.molecule_id))
  || String(a.particle_id).localeCompare(String(b.particle_id))
);

console.log(`count=${matches.length}`);
console.log("image\tmolecule\tparticle\tP\ty\tsignature\tatom_ids");
for (const row of matches) {
  console.log([
    row.image_name,
    row.molecule_id,
    row.particle_id,
    row.source_index,
    row.y,
    row.signature,
    row.atom_ids,
  ].join("\t"));
}

db.close();

function token(row) {
  return `${String(row.family ?? "").trim().toLowerCase()}:${String(row.structural_config ?? "").trim().toLowerCase()}`;
}

function splitTokens(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function sequenceStartsWith(tokens, prefix) {
  if (tokens.length < prefix.length) return false;
  return prefix.every((tokenValue, index) => tokens[index] === tokenValue);
}

function sequenceEndsWith(tokens, suffix) {
  if (tokens.length < suffix.length) return false;
  return suffix.every((tokenValue, index) => tokens[tokens.length - suffix.length + index] === tokenValue);
}

function sequenceContains(tokens, needle) {
  if (!needle.length) return true;
  if (tokens.length < needle.length) return false;
  for (let index = 0; index <= tokens.length - needle.length; index += 1) {
    if (needle.every((tokenValue, offset) => tokens[index + offset] === tokenValue)) return true;
  }
  return false;
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      parsed._.push(arg);
      continue;
    }
    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
