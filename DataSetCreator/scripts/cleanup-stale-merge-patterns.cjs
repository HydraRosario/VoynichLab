const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = process.argv[2] || path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  'com.voynichlab.datasetcreator',
  'datasetcreator.db'
);

const staleSignatureKeys = new Set([
  'inline|c:1|f:1+j:1',
  'inline|j:2|e:1+e:1+g:1',
  'stacked|j:2|c:1+e:1+g:1',
  'stacked|j:2|c:1+e:1+g:1+h:1',
  'stacked|j:2|e:1+e:1+g:2',
]);

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '-',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');
}

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const backupDir = path.join(process.cwd(), 'backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `datasetcreator-before-stale-merge-pattern-cleanup-${timestamp()}.db`);
fs.copyFileSync(dbPath, backupPath);

const db = new DatabaseSync(dbPath);
const before = db.prepare(`
  SELECT id, signature_key, relation, first_token, second_token, max_gap, min_overlap_ratio, sample_image_id, updated_at
  FROM particle_merge_patterns
  ORDER BY id
`).all();

const targets = before.filter((row) => staleSignatureKeys.has(row.signature_key));

db.exec('BEGIN');
try {
  const remove = db.prepare('DELETE FROM particle_merge_patterns WHERE signature_key = ?');
  for (const row of targets) {
    remove.run(row.signature_key);
  }
  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  db.close();
  throw error;
}

const after = db.prepare(`
  SELECT id, signature_key, relation, first_token, second_token, max_gap, min_overlap_ratio, sample_image_id, updated_at
  FROM particle_merge_patterns
  ORDER BY id
`).all();
db.close();

console.log(`db: ${dbPath}`);
console.log(`backup: ${backupPath}`);
console.log(`before: ${before.length}`);
console.log(`deleted: ${targets.length}`);
for (const row of targets) {
  console.log(`- deleted #${row.id}: ${row.signature_key}`);
}
console.log(`after: ${after.length}`);
for (const row of after) {
  console.log(`- kept #${row.id}: ${row.signature_key}`);
}
