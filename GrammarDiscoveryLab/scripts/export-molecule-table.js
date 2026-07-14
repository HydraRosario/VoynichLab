import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));
const labRoot = process.cwd();
const repoRoot = path.resolve(labRoot, "..");
const atomsPath = resolveInputPath(
  args.atoms ?? (args.case_dir ? path.join(args.case_dir, "atoms.tsv") : "research/frozen/CORPUS-V2-AUDITED/corpus/atoms.tsv")
);
const dbPath = path.resolve(
  args.db ?? path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);
const outDir = path.resolve(labRoot, args.out_dir ?? "out/current");

const atomsRows = readTsv(atomsPath);
const evaTokens = readEvaTokens();
const db = fs.existsSync(dbPath) ? new DatabaseSync(dbPath, { readOnly: true }) : null;
const wantedImageNames = new Set(atomsRows.map((row) => row.image_name).filter(Boolean));
const particlesByImageMolecule = db ? readParticles(db, wantedImageNames) : new Map();
const evaByImageRowUnit = indexEvaTokens(evaTokens);

const moleculeRows = atomsRows.map((row) => {
  const imageName = row.image_name;
  const rowIndex = Number(row.row_index);
  const unitIndex = Number(row.unit_index);
  const eva = evaByImageRowUnit.get(key(imageName, rowIndex, unitIndex));
  const particles = particlesByImageMolecule.get(key(imageName, row.source_molecule_id)) ?? [];
  const particleSignatures = particles.map((particle) => particle.signature);
  const particleIds = particles.map((particle) => particle.particle_id);

  return {
    molecule_uid: `${imageStem(imageName)}-m${String(unitIndex).padStart(3, "0")}`,
    folio: folioForImage(imageName),
    image_name: imageName,
    source_molecule_id: row.source_molecule_id,
    row_index: row.row_index,
    unit_index: row.unit_index,
    line_position: `${row.row_index}.${row.unit_index}`,
    signature: normalizeSpaces(row.atoms),
    atom_count: row.atom_count,
    atom_ids: row.atom_ids,
    particle_count: particles.length || "",
    particles: particleSignatures.join(" | "),
    particle_ids: particleIds.join(" "),
    eva_line: eva?.line ?? "",
    eva_token_index: eva?.token_index ?? "",
    eva_token: eva?.eva ?? "",
    bounds_x: row.bounds_x,
    bounds_y: row.bounds_y,
    bounds_w: row.bounds_w,
    bounds_h: row.bounds_h,
  };
});

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "molecules-current.tsv"), moleculeRows, [
  "molecule_uid",
  "folio",
  "image_name",
  "source_molecule_id",
  "row_index",
  "unit_index",
  "line_position",
  "signature",
  "atom_count",
  "atom_ids",
  "particle_count",
  "particles",
  "particle_ids",
  "eva_line",
  "eva_token_index",
  "eva_token",
  "bounds_x",
  "bounds_y",
  "bounds_w",
  "bounds_h",
]);

console.log(`Wrote ${moleculeRows.length} molecules to ${path.join(outDir, "molecules-current.tsv")}`);
if (!db) {
  console.warn(`Database not found at ${dbPath}; particle internals were left blank.`);
}
console.log(`ATOMS input: ${atomsPath}`);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[name] = true;
    } else {
      result[name] = next;
      index += 1;
    }
  }
  return result;
}

function resolveInputPath(inputPath) {
  const absoluteFromLab = path.resolve(labRoot, inputPath);
  if (fs.existsSync(absoluteFromLab)) return absoluteFromLab;
  return path.resolve(repoRoot, inputPath);
}

function readEvaTokens() {
  if (args.eva) return readTsv(resolveInputPath(args.eva));
  if (args.case_dir) return readTsv(resolveInputPath(path.join(args.case_dir, "eva-tokens.tsv")));

  const folios = ["f1r", "f1v", "f2r", "f2v", "f3r", "f47v"];
  return folios.flatMap((folio) => readTsv(path.join(repoRoot, "EVAComparisonLab", "cases", `${folio}-full`, "eva-tokens.tsv")));
}

function readParticles(db, wantedImageNames) {
  const result = new Map();
  const stmt = db.prepare(
    `SELECT
       a.image_id,
       i.name AS image_name,
       a.molecule_id,
       a.particle_id,
       p.particle_order,
       a.atom_order,
       a.id AS atom_id,
       a.family,
       a.structural_config,
       a.bounds_x
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
     WHERE a.molecule_id IS NOT NULL
     ORDER BY i.name ASC, a.molecule_id ASC, p.particle_order ASC, a.particle_id ASC, a.atom_order ASC, a.bounds_x ASC, a.id ASC`
  );
  const byParticle = new Map();
  for (const atom of stmt.all()) {
    if (!wantedImageNames.has(atom.image_name)) continue;
    const particleKey = key(atom.image_name, atom.molecule_id, atom.particle_id || `unassigned:${atom.atom_id}`);
    if (!byParticle.has(particleKey)) {
      byParticle.set(particleKey, {
        image_name: atom.image_name,
        molecule_id: atom.molecule_id,
        particle_id: atom.particle_id || `unassigned:${atom.atom_id}`,
        particle_order: finiteNumber(atom.particle_order, 999999),
        atoms: [],
      });
    }
    byParticle.get(particleKey).atoms.push(atom);
  }

  const grouped = new Map();
  for (const particle of byParticle.values()) {
    particle.atoms.sort((a, b) =>
      finiteNumber(a.atom_order, 999999) - finiteNumber(b.atom_order, 999999)
      || finiteNumber(a.bounds_x, 0) - finiteNumber(b.bounds_x, 0)
      || Number(a.atom_id) - Number(b.atom_id)
    );
    const moleculeKey = key(particle.image_name, particle.molecule_id);
    if (!grouped.has(moleculeKey)) grouped.set(moleculeKey, []);
    grouped.get(moleculeKey).push({
      particle_id: particle.particle_id,
      particle_order: particle.particle_order,
      signature: particle.atoms.map(cleanAtomToken).join(" "),
    });
  }

  for (const particles of grouped.values()) {
    particles.sort((a, b) =>
      a.particle_order - b.particle_order || String(a.particle_id).localeCompare(String(b.particle_id))
    );
  }
  return grouped;
}

function indexEvaTokens(rows) {
  const indexed = new Map();
  const lineOrdinals = new Map();
  for (const row of rows) {
    const imageName = imageForFolio(row.page);
    const line = String(row.line ?? "");
    if (!lineOrdinals.has(key(imageName, line))) {
      const ordinal = [...lineOrdinals.keys()].filter((item) => item.startsWith(`${imageName}\u0000`)).length + 1;
      lineOrdinals.set(key(imageName, line), ordinal);
    }
    const rowIndex = lineOrdinals.get(key(imageName, line));
    indexed.set(key(imageName, rowIndex, Number(row.token_index)), row);
  }
  return indexed;
}

function imageForFolio(folio) {
  return {
    f1r: "page-003.jpg",
    f1v: "page-004.jpg",
    f2r: "page-005.jpg",
    f2v: "page-006.jpg",
    f47v: "page-094.jpg",
  }[folio] ?? folio;
}

function folioForImage(imageName) {
  return {
    "page-003.jpg": "f1r",
    "page-004.jpg": "f1v",
    "page-005.jpg": "f2r",
    "page-006.jpg": "f2v",
    "page-094.jpg": "f47v",
  }[imageName] ?? imageName;
}

function imageStem(imageName) {
  return imageName.replace(/\.[^.]+$/, "").replace("page-", "p");
}

function cleanAtomToken(atom) {
  const family = cleanAtomKey(atom.family);
  const config = cleanAtomKey(atom.structural_config ?? "");
  return config ? `${family}:${config}` : family;
}

function cleanAtomKey(value) {
  return String(value ?? "").trim().replace(/_base$/i, "").toLowerCase();
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function writeTsv(filePath, rows, fields) {
  fs.writeFileSync(
    filePath,
    [fields.join("\t"), ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t"))].join("\n") + "\n",
    "utf8"
  );
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function normalizeSpaces(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function key(...parts) {
  return parts.map((part) => String(part)).join("\u0000");
}
