import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function parseArgs(argv) {
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

export function defaultDatasetCreatorDbPath() {
  return path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db");
}

export function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

export function writeTsv(filePath, rows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, toTsv(rows, fields), "utf8");
}

export function toTsv(rows, fields) {
  return [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
  ].join("\n") + "\n";
}

export function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

export function openDatasetDb(dbPath, options = {}) {
  const resolved = path.resolve(dbPath ?? defaultDatasetCreatorDbPath());
  if (!fs.existsSync(resolved)) {
    throw new Error(`Database not found: ${resolved}`);
  }
  const { DatabaseSync } = require("node:sqlite");
  return new DatabaseSync(resolved, { readOnly: options.readOnly ?? true });
}

export function atomRowsFromDb(db, imageNames) {
  const names = imageNames
    .map((value) => String(value).trim())
    .filter(Boolean);
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
         p.particle_order,
         a.family,
         a.structural_config,
         a.bounds_x
       FROM atoms a
       JOIN images i ON i.id = a.image_id
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       WHERE a.molecule_id IS NOT NULL
       ${imageFilter}
       ORDER BY a.image_id, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
    )
    .all(...names)
    .map((row) => ({
      ...row,
      token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
    }));
}

export function groupsFromDbRows(rows, scope) {
  return [...groupBy(rows, (row) => groupKeyForScope(row, scope)).values()]
    .map((groupRows) => groupRows.sort(atomSort))
    .filter((groupRows) => groupRows.length > 0);
}

export function sequencesFromAtomsTsv(filePath, mode = "full") {
  return readTsv(filePath)
    .map((row) => ({
      ...row,
      tokens: tokenizeAtoms(row.atoms, mode),
    }))
    .filter((row) => row.tokens.length > 0);
}

export function tokenizeAtoms(value, mode = "full") {
  const tokens = String(value ?? "").trim().split(/\s+/).filter(Boolean).map(cleanToken);
  if (mode === "family") return tokens.map(tokenFamily);
  if (mode === "full") return tokens;
  throw new Error(`Unknown atom token mode: ${mode}`);
}

export function tokenFamily(token) {
  return cleanToken(token).split(":")[0] ?? "";
}

export function atomSort(a, b) {
  return Number(a.particle_order ?? Number.MAX_SAFE_INTEGER) - Number(b.particle_order ?? Number.MAX_SAFE_INTEGER)
    || String(a.particle_id ?? "").localeCompare(String(b.particle_id ?? ""))
    || Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id);
}

export function groupKeyForScope(row, scope) {
  if (scope === "molecule") return row.molecule_id || `unassigned-molecule:${row.atom_id}`;
  if (scope === "particle") return row.particle_id || `unassigned-particle:${row.atom_id}`;
  throw new Error(`Unknown scope: ${scope}`);
}

export function roleFor(index, length) {
  if (length <= 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}

export function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

export function entropy(counts) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  return counts.reduce((sum, count) => {
    if (count === 0) return sum;
    const probability = count / total;
    return sum - probability * Math.log2(probability);
  }, 0);
}

export function weightedAverage(pairs) {
  const totalWeight = pairs.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight === 0) return 0;
  return pairs.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
}

export function cleanToken(value) {
  const [family, config = ""] = String(value ?? "").trim().toLowerCase().split(":");
  if (!family) return "";
  return config ? `${family}:${config}` : family;
}

export function tokenSort(a, b) {
  const [familyA, variantA = ""] = a.split(":");
  const [familyB, variantB = ""] = b.split(":");
  return familyA.localeCompare(familyB) || Number(variantA) - Number(variantB) || variantA.localeCompare(variantB);
}
