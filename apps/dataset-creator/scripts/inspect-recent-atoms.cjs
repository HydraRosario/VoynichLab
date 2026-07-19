const { DatabaseSync } = require("node:sqlite");
const os = require("node:os");
const path = require("node:path");

const db = new DatabaseSync(
  path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db"),
  { readOnly: true }
);

const recentJ = db
  .prepare(
    `SELECT
       a.id,
       a.region_id,
       a.image_id,
       i.name AS image_name,
       a.family,
       a.structural_config,
       a.molecule_id,
       a.particle_id,
       a.atom_order,
       a.created_at,
       a.updated_at,
       ROUND(a.bounds_x, 2) AS bounds_x,
       ROUND(a.bounds_y, 2) AS bounds_y,
       ROUND(a.bounds_w, 2) AS bounds_w,
       ROUND(a.bounds_h, 2) AS bounds_h
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     WHERE a.family = 'j' AND COALESCE(a.structural_config, '') = '1'
     ORDER BY datetime(a.created_at) DESC, a.id DESC
     LIMIT 140`
  )
  .all();

console.log("Recent j:1 atoms");
console.table(recentJ);

const recentGroups = db
  .prepare(
    `SELECT
       i.name AS image_name,
       a.family,
       COALESCE(a.structural_config, '') AS config,
       COUNT(*) AS count,
       MIN(a.created_at) AS first_created,
       MAX(a.created_at) AS last_created,
       ROUND(MIN(a.bounds_y), 2) AS min_y,
       ROUND(MAX(a.bounds_y), 2) AS max_y
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     GROUP BY i.name, a.family, config
     ORDER BY datetime(last_created) DESC, count DESC
     LIMIT 60`
  )
  .all();

console.log("Recent groups");
console.table(recentGroups);
