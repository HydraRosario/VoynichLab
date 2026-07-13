const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const args = parseArgs(process.argv.slice(2));
const createdAt = args.createdAt || "2026-07-10 16:57:51";
const imageName = args.image || "page-003.jpg";
const family = args.family || "j";
const structuralConfig = args.config || "1";
const apply = Boolean(args.apply);

const appDataDb = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "com.voynichlab.datasetcreator",
  "datasetcreator.db"
);
const dbPath = path.resolve(args.db || appDataDb);
const db = new DatabaseSync(dbPath);

db.exec("PRAGMA foreign_keys = ON");

const candidates = db
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
       a.created_at
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     WHERE i.name = ?
       AND a.family = ?
       AND COALESCE(a.structural_config, '') = ?
       AND a.created_at = ?
     ORDER BY a.id`
  )
  .all(imageName, family, structuralConfig, createdAt);

if (!candidates.length) {
  console.log("No candidates found.");
  process.exit(0);
}

const candidateIds = candidates.map((row) => row.id);
const regionIds = candidates.map((row) => row.region_id);
const moleculeIds = [...new Set(candidates.map((row) => row.molecule_id).filter(Boolean))];
const particleIds = [...new Set(candidates.map((row) => row.particle_id).filter(Boolean))];
const imageId = candidates[0].image_id;

const moleculeSummary = db
  .prepare(
    `SELECT
       a.molecule_id,
       COUNT(*) AS total_atoms,
       SUM(CASE WHEN a.id IN (${candidateIds.map(() => "?").join(",")}) THEN 1 ELSE 0 END) AS batch_atoms
     FROM atoms a
     WHERE a.image_id = ?
       AND a.molecule_id IN (${moleculeIds.map(() => "?").join(",")})
     GROUP BY a.molecule_id
     ORDER BY a.molecule_id`
  )
  .all(...candidateIds, imageId, ...moleculeIds);

const mixedMolecules = moleculeSummary.filter((row) => row.total_atoms !== row.batch_atoms);
if (mixedMolecules.length) {
  console.error("Refusing cleanup: candidate atoms are mixed with non-batch atoms.");
  console.table(mixedMolecules);
  process.exit(1);
}

console.log("Cleanup target");
console.table({
  imageName,
  imageId,
  createdAt,
  token: `${family}:${structuralConfig}`,
  atomCount: candidateIds.length,
  regionCount: regionIds.length,
  moleculeCount: moleculeIds.length,
  particleCount: particleIds.length,
});

console.log("Molecules to remove");
console.table(moleculeSummary);

if (!apply) {
  console.log("Dry run only. Re-run with --apply to delete this batch.");
  process.exit(0);
}

const backupDir = path.resolve(process.cwd(), "backups");
fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
const backupPath = path.join(backupDir, `datasetcreator-before-paint-batch-cleanup-${stamp}.db`);
fs.copyFileSync(dbPath, backupPath);

try {
  db.exec("BEGIN IMMEDIATE");
  runInChunks(regionIds, (placeholders, chunk) => {
    db.prepare(`DELETE FROM labels WHERE region_id IN (${placeholders})`).run(...chunk);
  });
  runInChunks(candidateIds, (placeholders, chunk) => {
    db.prepare(`DELETE FROM atoms WHERE id IN (${placeholders})`).run(...chunk);
  });
  runInChunks(regionIds, (placeholders, chunk) => {
    db.prepare(`DELETE FROM regions WHERE id IN (${placeholders})`).run(...chunk);
  });
  db.prepare(
    `DELETE FROM particles
     WHERE image_id = ?
       AND NOT EXISTS (
         SELECT 1 FROM atoms a
         WHERE a.image_id = particles.image_id
           AND a.particle_id = particles.particle_id
       )`
  ).run(imageId);
  db.prepare(
    `DELETE FROM molecules
     WHERE image_id = ?
     AND NOT EXISTS (
         SELECT 1 FROM atoms a
         WHERE a.image_id = molecules.image_id
           AND a.molecule_id = molecules.molecule_id
       )`
  ).run(imageId);
  db.exec("COMMIT");
} catch (error) {
  try {
    db.exec("ROLLBACK");
  } catch {
    // Ignore rollback errors; the original error is more useful.
  }
  throw error;
}

const remaining = db
  .prepare(`SELECT COUNT(*) AS count FROM atoms WHERE id IN (${candidateIds.map(() => "?").join(",")})`)
  .get(...candidateIds).count;

console.log(`Backup written: ${backupPath}`);
console.log(`Remaining candidate atoms: ${remaining}`);

function runInChunks(values, callback) {
  for (let index = 0; index < values.length; index += 900) {
    const chunk = values.slice(index, index + 900);
    callback(chunk.map(() => "?").join(","), chunk);
  }
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--apply") {
      result.apply = true;
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
