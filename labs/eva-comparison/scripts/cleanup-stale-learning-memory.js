import fs from "node:fs";
import path from "node:path";

import {
  defaultDatasetCreatorDbPath,
  openDatasetDb,
  parseArgs,
  readTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));
const apply = Boolean(args.apply);
const includeMinority = Boolean(args.include_minority ?? args["include-minority"]);
const dbPath = path.resolve(args.db ?? defaultDatasetCreatorDbPath());
const auditDir = path.resolve(args.audit_dir ?? "research/audits/learning-memory-current");
const backupDir = path.resolve(args.backup_dir ?? "apps/dataset-creator/backups");

const particleRows = readTsv(path.join(auditDir, "particle-order-patterns.tsv"));
const moleculeRows = readTsv(path.join(auditDir, "molecule-order-patterns.tsv"));
const mergeRows = readTsv(path.join(auditDir, "particle-merge-patterns.tsv"));

const staleParticleIds = particleRows
  .filter((row) => row.status === "stale-signature")
  .map((row) => Number(row.id))
  .filter(Number.isFinite);
const staleMoleculeIds = moleculeRows
  .filter((row) => row.status === "stale-signature" || (includeMinority && row.status === "minority-order"))
  .map((row) => Number(row.id))
  .filter(Number.isFinite);
const staleMergeIds = mergeRows
  .filter((row) => row.status === "stale-pair")
  .map((row) => Number(row.id))
  .filter(Number.isFinite);

console.log(`db: ${dbPath}`);
console.log(`audit_dir: ${auditDir}`);
console.log(`mode: ${apply ? "APPLY" : "DRY RUN"}`);
console.log(`include minority-order: ${includeMinority ? "yes" : "no"}`);
console.log(`stale particle_order_patterns: ${staleParticleIds.length}`);
console.log(`stale molecule_order_patterns: ${staleMoleculeIds.length}`);
console.log(`stale particle_merge_patterns: ${staleMergeIds.length}`);

if (!apply) {
  console.log("No changes made. Re-run with --apply to delete stale learned-memory rows.");
  process.exit(0);
}

fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const backupPath = path.join(backupDir, `datasetcreator-before-stale-learning-cleanup-${stamp}.db`);
fs.copyFileSync(dbPath, backupPath);
console.log(`backup: ${backupPath}`);

const db = openDatasetDb(dbPath, { readOnly: false });
db.exec("BEGIN IMMEDIATE");
try {
  const deletedParticles = deleteIds(db, "particle_order_patterns", staleParticleIds);
  const deletedMolecules = deleteIds(db, "molecule_order_patterns", staleMoleculeIds);
  const deletedMerges = deleteIds(db, "particle_merge_patterns", staleMergeIds);
  db.exec("COMMIT");
  console.log(`deleted particle_order_patterns: ${deletedParticles}`);
  console.log(`deleted molecule_order_patterns: ${deletedMolecules}`);
  console.log(`deleted particle_merge_patterns: ${deletedMerges}`);
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

function deleteIds(db, table, ids) {
  if (!ids.length) return 0;
  const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  let deleted = 0;
  for (const id of ids) {
    const result = stmt.run(id);
    deleted += Number(result.changes ?? 0);
  }
  return deleted;
}
