const { DatabaseSync } = require("node:sqlite");
const os = require("node:os");
const path = require("node:path");

const createdAt = process.argv[2] || "2026-07-10 16:57:51";
const db = new DatabaseSync(
  path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db"),
  { readOnly: true }
);

const atoms = db
  .prepare(
    `SELECT
       a.id,
       a.region_id,
       i.name AS image_name,
       a.family,
       a.structural_config,
       a.molecule_id,
       a.particle_id,
       a.atom_order,
       a.created_at,
       a.bounds_x,
       a.bounds_y,
       a.bounds_w,
       a.bounds_h
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     WHERE i.name = 'page-003.jpg'
       AND a.family = 'j'
       AND COALESCE(a.structural_config, '') = '1'
       AND a.created_at = ?
     ORDER BY a.id`
  )
  .all(createdAt);

const moleculeSummary = db
  .prepare(
    `SELECT
       a.molecule_id,
       COUNT(*) AS total_atoms,
       SUM(CASE WHEN a.family = 'j' AND COALESCE(a.structural_config, '') = '1' AND a.created_at = ? THEN 1 ELSE 0 END) AS batch_atoms,
       GROUP_CONCAT(a.id, ' ') AS atom_ids,
       GROUP_CONCAT(a.family || ':' || COALESCE(a.structural_config, ''), ' ') AS tokens
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     WHERE i.name = 'page-003.jpg'
       AND a.molecule_id IN (${atoms.map(() => "?").join(",") || "NULL"})
     GROUP BY a.molecule_id
     ORDER BY a.molecule_id`
  )
  .all(createdAt, ...atoms.map((atom) => atom.molecule_id));

console.log(`Batch created_at: ${createdAt}`);
console.log(`Candidate atoms: ${atoms.length}`);
console.table(atoms);
console.log("Molecule summary for candidate molecules");
console.table(moleculeSummary);
