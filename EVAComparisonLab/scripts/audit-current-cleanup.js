import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const dbPath = path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db");
const atomsPath = path.resolve(root, "cases/combined-f1r-f47v-full-current/atoms-current.tsv");

const db = new DatabaseSync(dbPath, { readOnly: true });
const j2Atoms = db.prepare(
  `SELECT
     a.id AS atom_id,
     a.region_id,
     a.image_id,
     i.name AS image_name,
     a.family,
     a.structural_config,
     a.molecule_id,
     a.particle_id,
     a.atom_order,
     a.bounds_x,
     a.bounds_y
   FROM atoms a
   JOIN images i ON i.id = a.image_id
   WHERE lower(a.family) = 'j'
     AND trim(coalesce(a.structural_config, '')) = '2'
   ORDER BY i.name, a.id`
).all();

const j2Labels = db.prepare(
  `SELECT
     r.id AS region_id,
     i.name AS image_name
   FROM regions r
   JOIN images i ON i.id = r.image_id
   WHERE EXISTS (
     SELECT 1 FROM labels l
     WHERE l.region_id = r.id
       AND lower(l.label_type) = 'base_family'
       AND lower(l.value) = 'j'
   )
   AND EXISTS (
     SELECT 1 FROM labels l
     WHERE l.region_id = r.id
       AND lower(l.label_type) = 'structural_config'
       AND l.value = '2'
   )
   ORDER BY i.name, r.id`
).all();

const currentRows = readTsv(atomsPath);
const currentRetiredHits = [];
const n1MedialExceptions = [];

for (const row of currentRows) {
  const tokens = String(row.atoms || "").trim().split(/\s+/).filter(Boolean);
  const ids = String(row.atom_ids || "").trim().split(/\s+/).filter(Boolean);

  tokens.forEach((token, index) => {
    if (token === "j:2" || token === "a:2") {
      currentRetiredHits.push(currentContext(row, tokens, ids, index, token));
    }

    if (token !== "n:1") return;
    const role = roleFor(index, tokens.length);
    if (role !== "medial") return;

    const hasPriorC1 = tokens.slice(0, index).includes("c:1");
    const nextIsE1 = tokens[index + 1] === "e:1";
    if (hasPriorC1 && nextIsE1) return;

    n1MedialExceptions.push({
      ...currentContext(row, tokens, ids, index, token),
      reason: [
        hasPriorC1 ? null : "no_has_prior_c1",
        nextIsE1 ? null : "next_not_e1",
      ].filter(Boolean).join(","),
      prev: tokens[index - 1] || "",
      next: tokens[index + 1] || "",
    });
  });
}

console.log(JSON.stringify({
  live_db: {
    j2_atoms: j2Atoms.length,
    j2_labels: j2Labels.length,
    j2_atom_rows: j2Atoms,
    j2_label_rows: j2Labels,
  },
  current_export: {
    retired_hits: currentRetiredHits.length,
    retired_rows: currentRetiredHits,
    n1_medial_exceptions: n1MedialExceptions,
  },
}, null, 2));

function currentContext(row, tokens, ids, index, token) {
  return {
    token,
    unit_id: row.unit_id,
    image: row.image_name,
    row_index: row.row_index,
    molecule: row.source_molecule_id,
    atom_id: ids[index] || "",
    position: index + 1,
    token_count: tokens.length,
    bounds: [row.bounds_x, row.bounds_y, row.bounds_w, row.bounds_h].join(","),
    signature: row.atoms,
  };
}

function roleFor(index, length) {
  if (length === 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}
