import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.db || !args.out_dir) {
  console.log(`Usage:
  npm run corpus:v3:prepare -- --db <validated-v3.db> --out-dir <working-directory> [--migration-report <report.json>]

Creates a reviewable Corpus V3 working export. It does not freeze, publish, tag,
or claim that the human annotation audit is complete.`);
  process.exit(args.help ? 0 : 1);
}

const dbPath = path.resolve(args.db);
const outDir = path.resolve(args.out_dir);
const exportDir = path.join(outDir, "corpus");
if (fs.existsSync(outDir) && fs.readdirSync(outDir).length) {
  throw new Error(`Refusing non-empty output directory: ${outDir}`);
}
fs.mkdirSync(exportDir, { recursive: true });

const exporter = path.resolve("scripts", "export-datasetcreator-v3.js");
const run = spawnSync(process.execPath, [exporter, "--db", dbPath, "--out-dir", exportDir], {
  cwd: process.cwd(),
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});
if (run.status !== 0) throw new Error(run.stderr || run.stdout || "V3 export failed");

const files = ["particles.tsv", "atoms.tsv", "molecules.tsv", "identifier-map.tsv"];
const checksums = files.map((name) => ({
  path: `corpus/${name}`,
  sha256: sha256(path.join(exportDir, name)),
  rows: dataRows(path.join(exportDir, name)),
}));
const integrity = inspectDatabase(dbPath);
fs.writeFileSync(path.join(outDir, "integrity-report.json"), `${JSON.stringify(integrity, null, 2)}\n`);

if (args.migration_report) {
  const migrationReport = path.resolve(args.migration_report);
  if (!fs.existsSync(migrationReport)) throw new Error(`Migration report not found: ${migrationReport}`);
  fs.copyFileSync(migrationReport, path.join(outDir, "migration-report.json"));
}

fs.writeFileSync(path.join(outDir, "mapping-summary.md"), mappingSummary(integrity));
fs.writeFileSync(path.join(outDir, "audit-summary.md"), `# Corpus V3 human audit\n\nStatus: **HUMAN_AUDIT_PENDING**\n\nThis package passed the technical migration and integrity gates. It does not claim that the annotations are correct. Review decisions belong in \`audit-ledger.tsv\`; unusual cases must never be deleted merely because they are unusual.\n`);
fs.writeFileSync(path.join(outDir, "audit-ledger.tsv"), [
  "decision_id", "image_id", "folio", "canonical_particle_id", "canonical_atom_id",
  "molecule_id", "candidate_source", "candidate_reason", "before_label", "after_label",
  "manuscript_region_reference", "reviewer", "reviewed_at", "decision", "notes",
].join("\t") + "\n");

const manifest = {
  status: "WORKING_NOT_FROZEN",
  auditStatus: "HUMAN_AUDIT_PENDING",
  ontology: "particle < atom < molecule",
  alphabet: "PARTICLES-V1",
  schemaVersion: 3,
  sourceDatabase: path.basename(dbPath),
  sourceDatabaseSha256: sha256(dbPath),
  createdAt: new Date().toISOString(),
  humanAuditComplete: false,
  publicationAuthorized: false,
  files: checksums,
};
fs.writeFileSync(path.join(outDir, "working-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "checksums.txt"), checksums.map((row) => `${row.sha256}  ${row.path}`).join("\n") + "\n");
fs.writeFileSync(path.join(outDir, "README.md"), `# Corpus V3 working export

This directory is an audit input, not a frozen release.

- Ontology: particle → atom → molecule
- Alphabet: PARTICLES-V1
- Human annotation audit: pending
- Publication and tag: not authorized

Begin with \`audit-summary.md\`, record decisions in \`audit-ledger.tsv\`, and
use \`identifier-map.tsv\` whenever a historical V2 identifier is referenced.

Do not place this directory under \`research/frozen\` until the audit protocol is
completed and a separate freeze step validates provenance and checksums.
`);
console.log(JSON.stringify(manifest, null, 2));

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

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function dataRows(filePath) {
  return Math.max(0, fs.readFileSync(filePath, "utf8").trimEnd().split(/\r?\n/).length - 1);
}

function inspectDatabase(filePath) {
  const db = new DatabaseSync(filePath, { readOnly: true });
  try {
    const schemaVersion = Number(db.prepare("PRAGMA user_version").get().user_version);
    const counts = Object.fromEntries(["particles", "atoms", "molecules", "nomenclature_id_map"].map((table) => [
      table,
      Number(db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count),
    ]));
    const unassignedParticles = Number(db.prepare("SELECT COUNT(*) AS count FROM particles WHERE atom_id IS NULL OR molecule_id IS NULL").get().count);
    const invalidAtomIds = Number(db.prepare("SELECT COUNT(*) AS count FROM atoms WHERE atom_id NOT GLOB 'img*-m*-a*'").get().count);
    const foreignKeyViolations = db.prepare("PRAGMA foreign_key_check").all().length;
    const mappingsByEntity = Object.fromEntries(db.prepare("SELECT entity_type, COUNT(*) AS count FROM nomenclature_id_map GROUP BY entity_type ORDER BY entity_type").all().map((row) => [row.entity_type, Number(row.count)]));
    const passed = schemaVersion === 3 && unassignedParticles === 0 && invalidAtomIds === 0 && foreignKeyViolations === 0;
    if (!passed) throw new Error("Corpus V3 integrity gates failed");
    return { status: "PASSED", schemaVersion, counts, mappingsByEntity, unassignedParticles, invalidAtomIds, foreignKeyViolations };
  } finally {
    db.close();
  }
}

function mappingSummary(integrity) {
  const byEntity = Object.entries(integrity.mappingsByEntity).map(([name, count]) => `- ${name}: ${count}`).join("\n");
  return `# V2 to V3 identifier mapping\n\nThe crosswalk contains ${integrity.counts.nomenclature_id_map} historical-to-canonical correspondences. This is expected: it records one mapping for every migrated particle, atom, and molecule, not 9,320 corrections.\n\n${byEntity}\n`;
}
