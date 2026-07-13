const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(os.homedir(), 'AppData', 'Roaming', 'com.voynichlab.datasetcreator', 'datasetcreator.db');
const backupDir = path.resolve(__dirname, '..', 'backups');
const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
const backupPath = path.join(backupDir, `datasetcreator-before-page094-row-override-repair-${stamp}.db`);

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(dbPath, backupPath);

const db = new DatabaseSync(dbPath);
const image = db.prepare('SELECT id, name FROM images WHERE name = ?').get('page-094.jpg');
if (!image) {
  console.error('page-094.jpg not found.');
  process.exit(1);
}

const before = db.prepare(`
  SELECT id, particle_key, row_index, created_at, updated_at
  FROM particle_row_overrides
  WHERE image_id = ?
    AND (
      updated_at >= '2026-07-12 14:57:00'
      OR created_at >= '2026-07-12 14:57:00'
    )
  ORDER BY updated_at DESC, id ASC
`).all(image.id);

db.exec('BEGIN IMMEDIATE');
try {
  db.prepare(`
    DELETE FROM particle_row_overrides
    WHERE image_id = ?
      AND (
        updated_at >= '2026-07-12 14:57:00'
        OR created_at >= '2026-07-12 14:57:00'
      )
  `).run(image.id);
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');
  throw err;
}

console.log(`Backup: ${backupPath}`);
console.log(`Deleted ${before.length} suspicious page-094 row overrides:`);
for (const row of before) {
  console.log(`  id=${row.id} row=${row.row_index} key=${row.particle_key} created=${row.created_at} updated=${row.updated_at}`);
}
