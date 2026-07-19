#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const args = parseArgs(process.argv.slice(2));
if (!args.source || !args.target) usage(1);

const sourcePath = path.resolve(args.source);
const targetPath = path.resolve(args.target);
const reportPath = path.resolve(args.report || `${targetPath}.migration-report.json`);

if (!fs.existsSync(sourcePath)) fail(`Source database does not exist: ${sourcePath}`);
if (fs.existsSync(targetPath)) fail(`Target already exists; refusing to overwrite: ${targetPath}`);
if (sourcePath === targetPath) fail("Source and target must be different files.");

fs.mkdirSync(path.dirname(targetPath), { recursive: true });

const source = new DatabaseSync(sourcePath, { readOnly: true });
const target = new DatabaseSync(targetPath);
const statementCache = new Map();
target.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = DELETE;");

try {
  assertV2(source);
  createV3Schema(target);
  target.exec("BEGIN IMMEDIATE;");
  migrateCore();
  migrateStructures();
  migrateReviewState();
  migrateIdentifierMap();
  target.exec("PRAGMA user_version = 3;");
  target.exec("COMMIT;");

  const report = validateMigration();
  target.close();
  source.close();
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log("DatasetCreator V2 -> V3 migration passed.");
  console.log(`Source: ${sourcePath}`);
  console.log(`Target: ${targetPath}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Particles: ${report.counts.particles}`);
  console.log(`Atoms: ${report.counts.atoms}`);
  console.log(`Molecules: ${report.counts.molecules}`);
} catch (error) {
  try { target.exec("ROLLBACK;"); } catch {}
  try { target.close(); } catch {}
  try { source.close(); } catch {}
  try { if (fs.existsSync(targetPath)) fs.rmSync(targetPath); } catch {}
  fail(error.stack || error.message || String(error));
}

function migrateCore() {
  copyRows("images", "images");
  copyRows("regions", "regions");
  copyRows("labels", "labels");
}

function migrateStructures() {
  const legacyParticles = source.prepare("SELECT * FROM particles ORDER BY id").all();
  const atomIdByLegacyParticle = new Map(
    legacyParticles.map((row) => [row.particle_id, canonicalAtomId(row.particle_id)])
  );

  const particleCounts = countBy(source.prepare(
    "SELECT molecule_id AS key, COUNT(*) AS n FROM atoms WHERE molecule_id IS NOT NULL GROUP BY molecule_id"
  ).all());
  const atomCounts = countBy(source.prepare(
    "SELECT molecule_id AS key, COUNT(*) AS n FROM particles GROUP BY molecule_id"
  ).all());

  for (const row of source.prepare("SELECT * FROM molecules ORDER BY id").all()) {
    insert("molecules", {
      id: row.id,
      molecule_id: row.molecule_id,
      image_id: row.image_id,
      particle_count: particleCounts.get(row.molecule_id) || 0,
      atom_count: atomCounts.get(row.molecule_id) || 0,
      centroid_x: row.centroid_x,
      centroid_y: row.centroid_y,
      bounds_x: row.bounds_x,
      bounds_y: row.bounds_y,
      bounds_w: row.bounds_w,
      bounds_h: row.bounds_h,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  for (const row of legacyParticles) {
    insert("atoms", {
      id: row.id,
      atom_id: atomIdByLegacyParticle.get(row.particle_id),
      legacy_particle_id: row.particle_id,
      molecule_id: row.molecule_id,
      image_id: row.image_id,
      particle_count: row.atom_count,
      atom_order: row.particle_order,
      source_index: row.source_index,
      centroid_x: row.centroid_x,
      centroid_y: row.centroid_y,
      bounds_x: row.bounds_x,
      bounds_y: row.bounds_y,
      bounds_w: row.bounds_w,
      bounds_h: row.bounds_h,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  for (const row of source.prepare("SELECT * FROM atoms ORDER BY id").all()) {
    insert("particles", {
      id: row.id,
      legacy_atom_id: row.id,
      region_id: row.region_id,
      image_id: row.image_id,
      family: row.family,
      color: row.color,
      points_json: row.points_json,
      anchor_x: row.anchor_x,
      anchor_y: row.anchor_y,
      bounds_x: row.bounds_x,
      bounds_y: row.bounds_y,
      bounds_w: row.bounds_w,
      bounds_h: row.bounds_h,
      length: row.length,
      angle: row.angle,
      points_count: row.points_count,
      visual_variant: row.visual_variant,
      structural_config: row.structural_config,
      molecule_id: row.molecule_id,
      atom_id: row.particle_id ? atomIdByLegacyParticle.get(row.particle_id) : null,
      particle_order: row.atom_order,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }
}

function migrateReviewState() {
  const mapAtom = (legacyId) => legacyId ? canonicalAtomId(legacyId) : null;

  copyTransformed("molecule_gap_overrides", "molecule_gap_overrides", (row) => ({
    id: row.id,
    image_id: row.image_id,
    left_atom_index: row.left_particle_index,
    right_atom_index: row.right_particle_index,
    left_atom_key: row.left_particle_key,
    right_atom_key: row.right_particle_key,
    decision: row.decision,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  copyTransformed("particle_order_patterns", "atom_particle_order_patterns", (row) => ({
    id: row.id,
    signature_key: row.signature_key,
    ordered_tokens_json: row.ordered_tokens_json,
    sample_image_id: row.sample_image_id,
    sample_atom_id: mapAtom(row.sample_particle_id),
    legacy_sample_particle_id: row.sample_particle_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  copyTransformed("molecule_order_patterns", "molecule_atom_order_patterns", (row) => ({
    ...row,
  }));

  copyTransformed("particle_atom_order_overrides", "atom_particle_order_overrides", (row) => ({
    id: row.id,
    image_id: row.image_id,
    atom_particle_key: row.particle_atom_key,
    ordered_particle_ids_json: row.ordered_atom_ids_json,
    sample_atom_id: mapAtom(row.sample_particle_id),
    legacy_sample_particle_id: row.sample_particle_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  copyTransformed("molecule_particle_order_overrides", "molecule_atom_order_overrides", (row) => ({
    id: row.id,
    image_id: row.image_id,
    molecule_particle_key: row.molecule_atom_key,
    ordered_atom_keys_json: row.ordered_particle_keys_json,
    sample_molecule_id: row.sample_molecule_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  copyTransformed("particle_merge_patterns", "atom_merge_patterns", (row) => ({
    id: row.id,
    signature_key: row.signature_key,
    relation: row.relation,
    first_token: row.first_token,
    second_token: row.second_token,
    max_gap: row.max_gap,
    min_overlap_ratio: row.min_overlap_ratio,
    sample_image_id: row.sample_image_id,
    sample_atom_a: mapAtom(row.sample_particle_a),
    sample_atom_b: mapAtom(row.sample_particle_b),
    legacy_sample_particle_a: row.sample_particle_a,
    legacy_sample_particle_b: row.sample_particle_b,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  copyTransformed("particle_row_guides", "atom_row_guides", (row) => ({ ...row }));
  copyTransformed("particle_row_overrides", "atom_row_overrides", (row) => ({
    id: row.id,
    image_id: row.image_id,
    atom_key: row.particle_key,
    row_index: row.row_index,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

function migrateIdentifierMap() {
  for (const row of source.prepare("SELECT id, image_id, molecule_id FROM atoms ORDER BY id").all()) {
    insert("nomenclature_id_map", {
      entity_type: "particle",
      legacy_entity_type: "atom",
      legacy_id: String(row.id),
      canonical_id: String(row.id),
      image_id: row.image_id,
      molecule_id: row.molecule_id,
      status: "mapped",
      note: "Numeric identity preserved",
    });
  }
  for (const row of source.prepare("SELECT particle_id, image_id, molecule_id FROM particles ORDER BY id").all()) {
    insert("nomenclature_id_map", {
      entity_type: "atom",
      legacy_entity_type: "particle",
      legacy_id: row.particle_id,
      canonical_id: canonicalAtomId(row.particle_id),
      image_id: row.image_id,
      molecule_id: row.molecule_id,
      status: "mapped",
      note: "Canonical suffix changed from p to a",
    });
  }
  for (const row of source.prepare("SELECT molecule_id, image_id FROM molecules ORDER BY id").all()) {
    insert("nomenclature_id_map", {
      entity_type: "molecule",
      legacy_entity_type: "molecule",
      legacy_id: row.molecule_id,
      canonical_id: row.molecule_id,
      image_id: row.image_id,
      molecule_id: row.molecule_id,
      status: "preserved",
      note: "Molecule identity unchanged",
    });
  }
}

function validateMigration() {
  const sourceCounts = counts(source, [
    "images", "regions", "labels", "atoms", "particles", "molecules",
    "particle_order_patterns", "molecule_order_patterns", "particle_merge_patterns",
    "particle_atom_order_overrides", "molecule_particle_order_overrides",
    "particle_row_guides", "particle_row_overrides", "molecule_gap_overrides",
  ]);
  const targetCounts = counts(target, [
    "images", "regions", "labels", "particles", "atoms", "molecules",
    "atom_particle_order_patterns", "molecule_atom_order_patterns", "atom_merge_patterns",
    "atom_particle_order_overrides", "molecule_atom_order_overrides",
    "atom_row_guides", "atom_row_overrides", "molecule_gap_overrides",
  ]);

  const expected = {
    images: sourceCounts.images,
    regions: sourceCounts.regions,
    labels: sourceCounts.labels,
    particles: sourceCounts.atoms,
    atoms: sourceCounts.particles,
    molecules: sourceCounts.molecules,
    atom_particle_order_patterns: sourceCounts.particle_order_patterns,
    molecule_atom_order_patterns: sourceCounts.molecule_order_patterns,
    atom_merge_patterns: sourceCounts.particle_merge_patterns,
    atom_particle_order_overrides: sourceCounts.particle_atom_order_overrides,
    molecule_atom_order_overrides: sourceCounts.molecule_particle_order_overrides,
    atom_row_guides: sourceCounts.particle_row_guides,
    atom_row_overrides: sourceCounts.particle_row_overrides,
    molecule_gap_overrides: sourceCounts.molecule_gap_overrides,
  };
  const mismatches = Object.entries(expected)
    .filter(([table, n]) => targetCounts[table] !== n)
    .map(([table, n]) => `${table}: expected ${n}, got ${targetCounts[table]}`);

  const foreignKeys = target.prepare("PRAGMA foreign_key_check").all();
  const migratedParticle = target.prepare("SELECT atom_id, molecule_id, particle_order FROM particles WHERE id = ?");
  let relationMismatches = 0;
  for (const legacy of source.prepare("SELECT id, particle_id, molecule_id, atom_order FROM atoms ORDER BY id").all()) {
    const canonical = migratedParticle.get(legacy.id);
    const expectedAtomId = legacy.particle_id ? canonicalAtomId(legacy.particle_id) : null;
    if (!canonical
      || canonical.atom_id !== expectedAtomId
      || canonical.molecule_id !== legacy.molecule_id
      || canonical.particle_order !== legacy.atom_order) {
      relationMismatches += 1;
    }
  }
  const mapCount = target.prepare("SELECT COUNT(*) AS n FROM nomenclature_id_map").get().n;
  const expectedMapCount = sourceCounts.atoms + sourceCounts.particles + sourceCounts.molecules;

  const fingerprints = buildFingerprints();
  const fingerprintMismatches = Object.entries(fingerprints)
    .filter(([, value]) => value.source !== value.target)
    .map(([name]) => name);

  if (mismatches.length) throw new Error(`Count validation failed:\n${mismatches.join("\n")}`);
  if (foreignKeys.length) throw new Error(`Foreign-key validation failed: ${JSON.stringify(foreignKeys)}`);
  if (relationMismatches) throw new Error(`Relation validation failed: ${relationMismatches} mismatches`);
  if (mapCount !== expectedMapCount) throw new Error(`Identifier map expected ${expectedMapCount}, got ${mapCount}`);
  if (fingerprintMismatches.length) throw new Error(`Content fingerprint mismatch: ${fingerprintMismatches.join(", ")}`);

  return {
    schemaVersion: 3,
    migratedAt: new Date().toISOString(),
    source: sourcePath,
    target: targetPath,
    counts: {
      particles: targetCounts.particles,
      atoms: targetCounts.atoms,
      molecules: targetCounts.molecules,
      identifierMappings: mapCount,
    },
    preserved: {
      images: targetCounts.images,
      regions: targetCounts.regions,
      labels: targetCounts.labels,
      manualAndLearnedRows:
        targetCounts.atom_particle_order_patterns +
        targetCounts.molecule_atom_order_patterns +
        targetCounts.atom_merge_patterns +
        targetCounts.atom_particle_order_overrides +
        targetCounts.molecule_atom_order_overrides +
        targetCounts.atom_row_guides +
        targetCounts.atom_row_overrides +
        targetCounts.molecule_gap_overrides,
    },
    checks: {
      tableCounts: "passed",
      foreignKeys: "passed",
      identifierMap: "passed",
      hierarchyRelations: "passed",
      contentFingerprints: "passed",
    },
    fingerprints,
  };
}

function buildFingerprints() {
  const legacyParticles = source.prepare("SELECT * FROM atoms ORDER BY id").all().map((row) => ({
    id: row.id,
    legacy_atom_id: row.id,
    region_id: row.region_id,
    image_id: row.image_id,
    family: row.family,
    color: row.color,
    points_json: row.points_json,
    anchor_x: row.anchor_x,
    anchor_y: row.anchor_y,
    bounds_x: row.bounds_x,
    bounds_y: row.bounds_y,
    bounds_w: row.bounds_w,
    bounds_h: row.bounds_h,
    length: row.length,
    angle: row.angle,
    points_count: row.points_count,
    visual_variant: row.visual_variant,
    structural_config: row.structural_config,
    molecule_id: row.molecule_id,
    atom_id: row.particle_id ? canonicalAtomId(row.particle_id) : null,
    particle_order: row.atom_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
  const canonicalParticles = target.prepare("SELECT * FROM particles ORDER BY id").all();

  const legacyAtoms = source.prepare("SELECT * FROM particles ORDER BY id").all().map((row) => ({
    id: row.id,
    atom_id: canonicalAtomId(row.particle_id),
    legacy_particle_id: row.particle_id,
    molecule_id: row.molecule_id,
    image_id: row.image_id,
    particle_count: row.atom_count,
    atom_order: row.particle_order,
    source_index: row.source_index,
    centroid_x: row.centroid_x,
    centroid_y: row.centroid_y,
    bounds_x: row.bounds_x,
    bounds_y: row.bounds_y,
    bounds_w: row.bounds_w,
    bounds_h: row.bounds_h,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
  const canonicalAtoms = target.prepare("SELECT * FROM atoms ORDER BY id").all();

  const particleCounts = countBy(source.prepare(
    "SELECT molecule_id AS key, COUNT(*) AS n FROM atoms WHERE molecule_id IS NOT NULL GROUP BY molecule_id"
  ).all());
  const atomCounts = countBy(source.prepare(
    "SELECT molecule_id AS key, COUNT(*) AS n FROM particles GROUP BY molecule_id"
  ).all());
  const legacyMolecules = source.prepare("SELECT * FROM molecules ORDER BY id").all().map((row) => ({
    id: row.id,
    molecule_id: row.molecule_id,
    image_id: row.image_id,
    particle_count: particleCounts.get(row.molecule_id) || 0,
    atom_count: atomCounts.get(row.molecule_id) || 0,
    centroid_x: row.centroid_x,
    centroid_y: row.centroid_y,
    bounds_x: row.bounds_x,
    bounds_y: row.bounds_y,
    bounds_w: row.bounds_w,
    bounds_h: row.bounds_h,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
  const canonicalMolecules = target.prepare("SELECT * FROM molecules ORDER BY id").all();

  return {
    particles: { source: hashRows(legacyParticles), target: hashRows(canonicalParticles) },
    atoms: { source: hashRows(legacyAtoms), target: hashRows(canonicalAtoms) },
    molecules: { source: hashRows(legacyMolecules), target: hashRows(canonicalMolecules) },
  };
}

function hashRows(rows) {
  return crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

function assertV2(db) {
  const version = Number(db.prepare("PRAGMA user_version").get().user_version);
  if (version !== 2) throw new Error(`Expected V2 database (user_version 2), got ${version}`);
  const requiredTables = [
    "images", "regions", "labels", "atoms", "particles", "molecules",
    "molecule_gap_overrides", "particle_order_patterns", "molecule_order_patterns",
    "particle_atom_order_overrides", "molecule_particle_order_overrides",
    "particle_merge_patterns", "particle_row_guides", "particle_row_overrides",
  ];
  const missing = [];
  for (const table of requiredTables) {
    const found = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
    if (!found) missing.push(table);
  }
  if (missing.length) {
    throw new Error(
      `Database declares user_version 2 but is not a complete Corpus V2 migration input. Missing tables: ${missing.join(", ")}`
    );
  }
}

function createV3Schema(db) {
  db.exec(`
    CREATE TABLE images (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, source_path TEXT NOT NULL, width INTEGER, height INTEGER, metadata_json TEXT, created_at TEXT);
    CREATE TABLE regions (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, geometry_json TEXT NOT NULL, order_index INTEGER, created_at TEXT, updated_at TEXT);
    CREATE TABLE labels (id INTEGER PRIMARY KEY AUTOINCREMENT, region_id INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE, label_type TEXT NOT NULL, value TEXT NOT NULL, created_at TEXT, updated_at TEXT);
    CREATE TABLE molecules (id INTEGER PRIMARY KEY AUTOINCREMENT, molecule_id TEXT NOT NULL UNIQUE, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, particle_count INTEGER NOT NULL, atom_count INTEGER NOT NULL, centroid_x REAL NOT NULL, centroid_y REAL NOT NULL, bounds_x REAL NOT NULL, bounds_y REAL NOT NULL, bounds_w REAL NOT NULL, bounds_h REAL NOT NULL, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE atoms (id INTEGER PRIMARY KEY AUTOINCREMENT, atom_id TEXT NOT NULL UNIQUE, legacy_particle_id TEXT UNIQUE, molecule_id TEXT NOT NULL REFERENCES molecules(molecule_id) ON DELETE CASCADE, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, particle_count INTEGER NOT NULL, atom_order INTEGER NOT NULL, source_index INTEGER NOT NULL, centroid_x REAL NOT NULL, centroid_y REAL NOT NULL, bounds_x REAL NOT NULL, bounds_y REAL NOT NULL, bounds_w REAL NOT NULL, bounds_h REAL NOT NULL, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE particles (id INTEGER PRIMARY KEY AUTOINCREMENT, legacy_atom_id INTEGER UNIQUE, region_id INTEGER NOT NULL UNIQUE REFERENCES regions(id) ON DELETE CASCADE, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, family TEXT NOT NULL DEFAULT '', color TEXT, points_json TEXT NOT NULL, anchor_x REAL NOT NULL, anchor_y REAL NOT NULL, bounds_x REAL NOT NULL, bounds_y REAL NOT NULL, bounds_w REAL NOT NULL, bounds_h REAL NOT NULL, length REAL NOT NULL, angle REAL NOT NULL, points_count INTEGER NOT NULL, visual_variant TEXT, structural_config TEXT, molecule_id TEXT REFERENCES molecules(molecule_id) ON DELETE SET NULL, atom_id TEXT REFERENCES atoms(atom_id) ON DELETE SET NULL, particle_order INTEGER, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE molecule_gap_overrides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, left_atom_index INTEGER NOT NULL, right_atom_index INTEGER NOT NULL, left_atom_key TEXT, right_atom_key TEXT, decision TEXT NOT NULL CHECK(decision IN ('cut','join')), created_at TEXT, updated_at TEXT);
    CREATE TABLE atom_particle_order_patterns (id INTEGER PRIMARY KEY AUTOINCREMENT, signature_key TEXT NOT NULL UNIQUE, ordered_tokens_json TEXT NOT NULL, sample_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, sample_atom_id TEXT, legacy_sample_particle_id TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE molecule_atom_order_patterns (id INTEGER PRIMARY KEY AUTOINCREMENT, signature_key TEXT NOT NULL UNIQUE, ordered_tokens_json TEXT NOT NULL, sample_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, sample_molecule_id TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE atom_particle_order_overrides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, atom_particle_key TEXT NOT NULL, ordered_particle_ids_json TEXT NOT NULL, sample_atom_id TEXT, legacy_sample_particle_id TEXT, created_at TEXT, updated_at TEXT, UNIQUE(image_id, atom_particle_key));
    CREATE TABLE molecule_atom_order_overrides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, molecule_particle_key TEXT NOT NULL, ordered_atom_keys_json TEXT NOT NULL, sample_molecule_id TEXT, created_at TEXT, updated_at TEXT, UNIQUE(image_id, molecule_particle_key));
    CREATE TABLE atom_merge_patterns (id INTEGER PRIMARY KEY AUTOINCREMENT, signature_key TEXT NOT NULL UNIQUE, relation TEXT NOT NULL CHECK(relation IN ('stacked','inline')), first_token TEXT NOT NULL, second_token TEXT NOT NULL, max_gap REAL NOT NULL, min_overlap_ratio REAL NOT NULL, sample_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, sample_atom_a TEXT, sample_atom_b TEXT, legacy_sample_particle_a TEXT, legacy_sample_particle_b TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE atom_row_guides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, row_index INTEGER NOT NULL, top_y REAL, y REAL NOT NULL, bottom_y REAL, created_at TEXT, updated_at TEXT, UNIQUE(image_id,row_index));
    CREATE TABLE atom_row_overrides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE, atom_key TEXT NOT NULL, row_index INTEGER NOT NULL, created_at TEXT, updated_at TEXT, UNIQUE(image_id,atom_key));
    CREATE TABLE nomenclature_id_map (id INTEGER PRIMARY KEY AUTOINCREMENT, entity_type TEXT NOT NULL, legacy_entity_type TEXT NOT NULL, legacy_id TEXT NOT NULL, canonical_id TEXT NOT NULL, image_id INTEGER REFERENCES images(id) ON DELETE CASCADE, molecule_id TEXT, status TEXT NOT NULL, note TEXT, UNIQUE(entity_type,legacy_id));
    CREATE INDEX idx_particles_image ON particles(image_id);
    CREATE INDEX idx_particles_atom ON particles(atom_id);
    CREATE INDEX idx_particles_molecule ON particles(molecule_id);
    CREATE INDEX idx_atoms_image ON atoms(image_id);
    CREATE INDEX idx_atoms_molecule ON atoms(molecule_id);
    CREATE INDEX idx_molecules_image ON molecules(image_id);
  `);
}

function insert(table, row) {
  const columns = Object.keys(row);
  const key = `${table}:${columns.join(",")}`;
  let statement = statementCache.get(key);
  if (!statement) {
    statement = target.prepare(`INSERT INTO ${table} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`);
    statementCache.set(key, statement);
  }
  statement.run(...columns.map((column) => row[column]));
}

function copyRows(sourceTable, targetTable) {
  for (const row of source.prepare(`SELECT * FROM ${sourceTable} ORDER BY id`).all()) insert(targetTable, row);
}

function copyTransformed(sourceTable, targetTable, transform) {
  for (const row of source.prepare(`SELECT * FROM ${sourceTable} ORDER BY id`).all()) insert(targetTable, transform(row));
}

function counts(db, tables) {
  return Object.fromEntries(tables.map((table) => [table, Number(db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n)]));
}

function countBy(rows) {
  return new Map(rows.map((row) => [row.key, Number(row.n)]));
}

function canonicalAtomId(legacyParticleId) {
  const value = String(legacyParticleId || "");
  if (!/-p\d+$/.test(value)) throw new Error(`Cannot canonicalize legacy particle ID: ${value}`);
  return value.replace(/-p(\d+)$/, "-a$1");
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--source") parsed.source = argv[++index];
    else if (key === "--target") parsed.target = argv[++index];
    else if (key === "--report") parsed.report = argv[++index];
    else if (key === "--help" || key === "-h") usage(0);
    else fail(`Unknown argument: ${key}`);
  }
  return parsed;
}

function usage(code) {
  console.log("Usage: node apps/dataset-creator/scripts/migrate-v2-to-v3.cjs --source <v2.db> --target <new-v3.db> [--report <report.json>]");
  process.exit(code);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
