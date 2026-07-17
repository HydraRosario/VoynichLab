#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node DataSetCreator/scripts/inspect-v3-db.cjs <datasetcreator-v3.db>");
  process.exit(2);
}

const dbPath = path.resolve(input);
if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const version = Number(db.prepare("PRAGMA user_version").get().user_version);
const count = (table) => Number(db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n);
const foreignKeys = db.prepare("PRAGMA foreign_key_check").all();
const invalidAtomIds = Number(db.prepare("SELECT COUNT(*) AS n FROM atoms WHERE atom_id NOT GLOB 'img*-m*-a*'").get().n);
const unassignedParticles = Number(db.prepare("SELECT COUNT(*) AS n FROM particles WHERE atom_id IS NULL OR molecule_id IS NULL").get().n);

const summary = {
  schemaVersion: version,
  particles: count("particles"),
  atoms: count("atoms"),
  molecules: count("molecules"),
  identifierMappings: count("nomenclature_id_map"),
  unassignedParticles,
  invalidAtomIds,
  foreignKeyViolations: foreignKeys.length,
};

console.log(JSON.stringify(summary, null, 2));
db.close();

if (version !== 3 || invalidAtomIds || foreignKeys.length) process.exit(1);

