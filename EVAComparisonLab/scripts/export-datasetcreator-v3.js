import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.db || !args.out_dir) {
  console.log(`Usage:
  npm run export:v3 -- --db <validated-v3.db> --out-dir <directory>
  npm run export:v3 -- --db <validated-v3.db> --out-dir <directory> --image-id 3

The command accepts only DataSetCreator schema V3 and writes particles.tsv,
atoms.tsv, molecules.tsv, and identifier-map.tsv. It never mutates the DB.`);
  process.exit(args.help ? 0 : 1);
}

const dbPath = path.resolve(args.db);
const outDir = path.resolve(args.out_dir);
if (!fs.existsSync(dbPath)) throw new Error(`Database not found: ${dbPath}`);

const db = new DatabaseSync(dbPath, { readOnly: true });
db.exec("PRAGMA foreign_keys = ON");
const schemaVersion = Number(db.prepare("PRAGMA user_version").get().user_version);
if (schemaVersion !== 3) {
  throw new Error(`Expected DataSetCreator schema V3; found user_version=${schemaVersion}`);
}

const imageWhere = args.image_id ? "WHERE i.id = ?" : "";
const imageParams = args.image_id ? [Number(args.image_id)] : [];
const images = db.prepare(`SELECT i.id, i.name FROM images i ${imageWhere} ORDER BY i.id`).all(...imageParams);
if (!images.length) throw new Error("No matching images found");
const imageIds = new Set(images.map((image) => Number(image.id)));
const imageNameById = new Map(images.map((image) => [Number(image.id), image.name]));

const particles = db.prepare(`
  SELECT id, legacy_atom_id, region_id, image_id, family, structural_config,
         points_json, anchor_x, anchor_y, bounds_x, bounds_y, bounds_w, bounds_h,
         length, angle, points_count, atom_id, molecule_id, particle_order
  FROM particles ORDER BY image_id, molecule_id, atom_id, particle_order, id
`).all().filter((row) => imageIds.has(Number(row.image_id)));

const atoms = db.prepare(`
  SELECT id, atom_id, legacy_particle_id, molecule_id, image_id, particle_count,
         atom_order, source_index, centroid_x, centroid_y, bounds_x, bounds_y,
         bounds_w, bounds_h
  FROM atoms ORDER BY image_id, molecule_id, atom_order, id
`).all().filter((row) => imageIds.has(Number(row.image_id)));

const molecules = db.prepare(`
  SELECT id, molecule_id, image_id, particle_count, atom_count, centroid_x,
         centroid_y, bounds_x, bounds_y, bounds_w, bounds_h
  FROM molecules ORDER BY image_id, bounds_y, bounds_x, id
`).all().filter((row) => imageIds.has(Number(row.image_id)));

const particlesByAtom = groupBy(particles, (row) => row.atom_id);
const atomsByMolecule = groupBy(atoms, (row) => row.molecule_id);
const particlesByMolecule = groupBy(particles, (row) => row.molecule_id);
const rowGuidesByImage = new Map();
for (const image of images) {
  rowGuidesByImage.set(Number(image.id), db.prepare(`
    SELECT row_index, top_y, y, bottom_y FROM atom_row_guides
    WHERE image_id = ? ORDER BY row_index
  `).all(image.id));
}

const particleRows = particles.map((particle) => ({
  particle_id: particle.id,
  legacy_atom_id: particle.legacy_atom_id ?? "",
  region_id: particle.region_id,
  image_id: particle.image_id,
  image_name: imageNameById.get(Number(particle.image_id)),
  atom_id: particle.atom_id,
  molecule_id: particle.molecule_id,
  particle_order: particle.particle_order,
  family: clean(particle.family),
  structural_config: clean(particle.structural_config),
  signature: token(particle),
  points_json: particle.points_json,
  anchor_x: particle.anchor_x,
  anchor_y: particle.anchor_y,
  bounds_x: particle.bounds_x,
  bounds_y: particle.bounds_y,
  bounds_w: particle.bounds_w,
  bounds_h: particle.bounds_h,
  length: particle.length,
  angle: particle.angle,
  points_count: particle.points_count,
}));

const atomRows = atoms.map((atom) => {
  const members = ordered(particlesByAtom.get(atom.atom_id) ?? [], "particle_order");
  return {
    atom_id: atom.atom_id,
    legacy_particle_id: atom.legacy_particle_id ?? "",
    image_id: atom.image_id,
    image_name: imageNameById.get(Number(atom.image_id)),
    molecule_id: atom.molecule_id,
    atom_order: atom.atom_order,
    source_index: atom.source_index,
    particle_count: members.length,
    particle_ids: members.map((row) => row.id).join(" "),
    particle_signature: members.map(token).join(" "),
    centroid_x: atom.centroid_x,
    centroid_y: atom.centroid_y,
    bounds_x: atom.bounds_x,
    bounds_y: atom.bounds_y,
    bounds_w: atom.bounds_w,
    bounds_h: atom.bounds_h,
  };
});

const moleculeOrdinalByImage = new Map();
const moleculeRows = molecules.map((molecule) => {
  const imageId = Number(molecule.image_id);
  const moleculeOrder = (moleculeOrdinalByImage.get(imageId) ?? 0) + 1;
  moleculeOrdinalByImage.set(imageId, moleculeOrder);
  const memberAtoms = ordered(atomsByMolecule.get(molecule.molecule_id) ?? [], "atom_order");
  const memberParticles = ordered(particlesByMolecule.get(molecule.molecule_id) ?? [], "particle_order");
  const atomSignatures = memberAtoms.map((atom) =>
    ordered(particlesByAtom.get(atom.atom_id) ?? [], "particle_order").map(token).join(" ")
  );
  return {
    molecule_id: molecule.molecule_id,
    image_id: molecule.image_id,
    image_name: imageNameById.get(Number(molecule.image_id)),
    row_index: rowIndex(molecule, rowGuidesByImage.get(Number(molecule.image_id)) ?? []),
    molecule_order: moleculeOrder,
    atom_count: memberAtoms.length,
    atom_ids: memberAtoms.map((row) => row.atom_id).join(" "),
    atom_signatures: atomSignatures.join(" | "),
    particle_count: memberParticles.length,
    particle_ids: memberParticles.map((row) => row.id).join(" "),
    flattened_particle_signature: memberAtoms.flatMap((atom) =>
      ordered(particlesByAtom.get(atom.atom_id) ?? [], "particle_order").map(token)
    ).join(" "),
    centroid_x: molecule.centroid_x,
    centroid_y: molecule.centroid_y,
    bounds_x: molecule.bounds_x,
    bounds_y: molecule.bounds_y,
    bounds_w: molecule.bounds_w,
    bounds_h: molecule.bounds_h,
  };
});

const identifierRows = db.prepare(`
  SELECT entity_type, legacy_entity_type, legacy_id, canonical_id, image_id,
         molecule_id, status, note FROM nomenclature_id_map
  ORDER BY entity_type, legacy_id
`).all().filter((row) => row.image_id == null || imageIds.has(Number(row.image_id)));

fs.mkdirSync(outDir, { recursive: true });
writeTsv("particles.tsv", particleRows);
writeTsv("atoms.tsv", atomRows);
writeTsv("molecules.tsv", moleculeRows);
writeTsv("identifier-map.tsv", identifierRows);

const foreignKeyViolations = db.prepare("PRAGMA foreign_key_check").all();
if (foreignKeyViolations.length) throw new Error(`Foreign-key violations: ${foreignKeyViolations.length}`);
if (particles.some((row) => !row.atom_id || !row.molecule_id)) throw new Error("Unassigned particles found");
if (atoms.some((row) => !row.molecule_id)) throw new Error("Unassigned atoms found");

console.log(JSON.stringify({
  schemaVersion,
  images: images.length,
  particles: particleRows.length,
  atoms: atomRows.length,
  molecules: moleculeRows.length,
  identifierMappings: identifierRows.length,
  output: outDir,
}, null, 2));

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") { parsed.help = true; continue; }
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) parsed[key] = true;
    else { parsed[key] = next; index += 1; }
  }
  return parsed;
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

function ordered(rows, field) {
  return [...rows].sort((a, b) => Number(a[field] ?? 0) - Number(b[field] ?? 0) || Number(a.id) - Number(b.id));
}

function clean(value) {
  return String(value ?? "").trim().replace(/_base$/i, "").toLowerCase();
}

function token(particle) {
  const family = clean(particle.family);
  const config = clean(particle.structural_config);
  return config ? `${family}:${config}` : family;
}

function rowIndex(molecule, guides) {
  const y = Number(molecule.centroid_y);
  const containing = guides.find((guide) => y >= Number(guide.top_y ?? guide.y) && y <= Number(guide.bottom_y ?? guide.y));
  if (containing) return Number(containing.row_index);
  return Number(guides.map((guide) => ({
    row: guide.row_index,
    distance: Math.abs(y - Number(guide.y)),
  })).sort((a, b) => a.distance - b.distance)[0]?.row ?? 1);
}

function writeTsv(name, rows) {
  if (!rows.length) throw new Error(`Refusing empty export: ${name}`);
  const fields = Object.keys(rows[0]);
  const text = [fields.join("\t"), ...rows.map((row) => fields.map((field) => cell(row[field])).join("\t"))].join("\n") + "\n";
  fs.writeFileSync(path.join(outDir, name), text, "utf8");
}

function cell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}
