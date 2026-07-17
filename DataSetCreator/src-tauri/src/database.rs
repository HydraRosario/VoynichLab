use rusqlite::{params, Connection, OptionalExtension};
use std::collections::{HashMap, VecDeque};
use tauri::Manager;

use crate::models::*;

// =============================================================================
// Database initialisation
// =============================================================================

/// Open (or create) the SQLite database in the app data directory and ensure
/// all tables and indexes exist.
pub fn init_db(app_handle: &tauri::AppHandle) -> Result<Connection, Box<dyn std::error::Error>> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?;

    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {e}"))?;

    let db_path = app_data_dir.join("datasetcreator.db");
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {e}"))?;

    conn.execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(|e| format!("Failed to enable foreign keys: {e}"))?;

    conn.execute_batch("PRAGMA journal_mode = WAL;")
        .map_err(|e| format!("Failed to set journal mode: {e}"))?;

    let schema_version: i64 = conn.query_row("PRAGMA user_version;", [], |row| row.get(0))?;
    if schema_version == 2 {
        return Err(format!(
            "DatasetCreator found a historical V2 database at {}. Refusing to open it with the canonical V3 ontology. Run DataSetCreator/scripts/migrate-v2-to-v3.cjs against a copy, validate the report, and activate the V3 database explicitly.",
            db_path.display()
        ).into());
    }
    if schema_version > 3 {
        return Err(format!("Unsupported DatasetCreator schema version: {schema_version}").into());
    }

    create_tables(&conn)?;
    migrate_atom_schema(&conn)?;
    migrate_molecule_gap_override_schema(&conn)?;
    migrate_atom_order_pattern_schema(&conn)?;
    migrate_molecule_order_pattern_schema(&conn)?;
    migrate_atom_merge_pattern_schema(&conn)?;
    migrate_atom_row_guide_schema(&conn)?;
    migrate_atom_row_override_schema(&conn)?;
    migrate_double_first_row_ceiling(&conn)?;
    backfill_particles_from_regions(&conn).map_err(|e| format!("Failed to backfill particles: {e}"))?;
    conn.execute_batch("PRAGMA user_version = 3;")?;

    Ok(conn)
}

fn create_tables(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS images (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT NOT NULL,
            source_path   TEXT NOT NULL,
            width         INTEGER,
            height        INTEGER,
            metadata_json TEXT,
            created_at    TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS regions (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id         INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            geometry_json    TEXT NOT NULL,
            order_index      INTEGER,
            created_at       TEXT DEFAULT (datetime('now')),
            updated_at       TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS labels (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            region_id     INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
            label_type    TEXT NOT NULL,
            value         TEXT NOT NULL,
            created_at    TEXT DEFAULT (datetime('now')),
            updated_at    TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS molecules (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            molecule_id TEXT NOT NULL UNIQUE,
            image_id    INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            particle_count  INTEGER NOT NULL DEFAULT 0,
            atom_count      INTEGER NOT NULL DEFAULT 0,
            centroid_x  REAL NOT NULL DEFAULT 0,
            centroid_y  REAL NOT NULL DEFAULT 0,
            bounds_x    REAL NOT NULL DEFAULT 0,
            bounds_y    REAL NOT NULL DEFAULT 0,
            bounds_w    REAL NOT NULL DEFAULT 0,
            bounds_h    REAL NOT NULL DEFAULT 0,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS atoms (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            atom_id TEXT NOT NULL UNIQUE,
            molecule_id TEXT NOT NULL REFERENCES molecules(molecule_id) ON DELETE CASCADE,
            image_id    INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            particle_count  INTEGER NOT NULL DEFAULT 0,
            atom_order INTEGER NOT NULL DEFAULT 0,
            source_index INTEGER NOT NULL DEFAULT 0,
            centroid_x  REAL NOT NULL DEFAULT 0,
            centroid_y  REAL NOT NULL DEFAULT 0,
            bounds_x    REAL NOT NULL DEFAULT 0,
            bounds_y    REAL NOT NULL DEFAULT 0,
            bounds_w    REAL NOT NULL DEFAULT 0,
            bounds_h    REAL NOT NULL DEFAULT 0,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS particles (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            region_id         INTEGER NOT NULL UNIQUE REFERENCES regions(id) ON DELETE CASCADE,
            image_id          INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            family            TEXT NOT NULL DEFAULT '',
            color             TEXT,
            points_json       TEXT NOT NULL,
            anchor_x          REAL NOT NULL,
            anchor_y          REAL NOT NULL,
            bounds_x          REAL NOT NULL,
            bounds_y          REAL NOT NULL,
            bounds_w          REAL NOT NULL,
            bounds_h          REAL NOT NULL,
            length            REAL NOT NULL,
            angle             REAL NOT NULL,
            points_count      INTEGER NOT NULL,
            visual_variant    TEXT,
            structural_config TEXT,
            molecule_id       TEXT REFERENCES molecules(molecule_id) ON DELETE SET NULL,
            atom_id       TEXT REFERENCES atoms(atom_id) ON DELETE SET NULL,
            particle_order        INTEGER,
            created_at        TEXT DEFAULT (datetime('now')),
            updated_at        TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS molecule_gap_overrides (
            id                   INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id             INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            left_atom_index  INTEGER NOT NULL,
            right_atom_index INTEGER NOT NULL,
            left_atom_key    TEXT,
            right_atom_key   TEXT,
            decision             TEXT NOT NULL CHECK(decision IN ('cut', 'join')),
            created_at           TEXT DEFAULT (datetime('now')),
            updated_at           TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS atom_particle_order_patterns (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key       TEXT NOT NULL UNIQUE,
            ordered_tokens_json TEXT NOT NULL,
            sample_image_id     INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_atom_id  TEXT,
            created_at          TEXT DEFAULT (datetime('now')),
            updated_at          TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS molecule_atom_order_patterns (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key       TEXT NOT NULL UNIQUE,
            ordered_tokens_json TEXT NOT NULL,
            sample_image_id     INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_molecule_id  TEXT,
            created_at          TEXT DEFAULT (datetime('now')),
            updated_at          TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS atom_particle_order_overrides (
            id                    INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id              INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            atom_particle_key     TEXT NOT NULL,
            ordered_particle_ids_json TEXT NOT NULL,
            sample_atom_id    TEXT,
            created_at            TEXT DEFAULT (datetime('now')),
            updated_at            TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, atom_particle_key)
        );

        CREATE TABLE IF NOT EXISTS molecule_atom_order_overrides (
            id                         INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id                   INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            molecule_particle_key          TEXT NOT NULL,
            ordered_atom_keys_json TEXT NOT NULL,
            sample_molecule_id         TEXT,
            created_at                 TEXT DEFAULT (datetime('now')),
            updated_at                 TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, molecule_particle_key)
        );

        CREATE TABLE IF NOT EXISTS atom_merge_patterns (
            id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key      TEXT NOT NULL UNIQUE,
            relation           TEXT NOT NULL CHECK(relation IN ('stacked', 'inline')),
            first_token        TEXT NOT NULL,
            second_token       TEXT NOT NULL,
            max_gap            REAL NOT NULL,
            min_overlap_ratio  REAL NOT NULL,
            sample_image_id    INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_atom_a  TEXT,
            sample_atom_b  TEXT,
            created_at         TEXT DEFAULT (datetime('now')),
            updated_at         TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS atom_row_guides (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id    INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            row_index   INTEGER NOT NULL,
            top_y       REAL,
            y           REAL NOT NULL,
            bottom_y    REAL,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, row_index)
        );

        CREATE TABLE IF NOT EXISTS atom_row_overrides (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id     INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            atom_key TEXT NOT NULL,
            row_index    INTEGER NOT NULL,
            created_at   TEXT DEFAULT (datetime('now')),
            updated_at   TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, atom_key)
        );

        CREATE TABLE IF NOT EXISTS nomenclature_id_map (
            id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            entity_type       TEXT NOT NULL,
            legacy_entity_type TEXT NOT NULL,
            legacy_id         TEXT NOT NULL,
            canonical_id      TEXT NOT NULL,
            image_id          INTEGER REFERENCES images(id) ON DELETE CASCADE,
            molecule_id       TEXT,
            status            TEXT NOT NULL,
            note              TEXT,
            UNIQUE(entity_type, legacy_id)
        );

        -- Foreign-key indexes for faster joins / cascades
        CREATE INDEX IF NOT EXISTS idx_regions_image_id     ON regions(image_id);
        CREATE INDEX IF NOT EXISTS idx_labels_region_id     ON labels(region_id);
        CREATE INDEX IF NOT EXISTS idx_labels_region_label  ON labels(region_id, label_type);
        CREATE INDEX IF NOT EXISTS idx_particles_image_id       ON particles(image_id);
        CREATE INDEX IF NOT EXISTS idx_particles_family         ON particles(family);
        CREATE INDEX IF NOT EXISTS idx_particles_anchor         ON particles(image_id, anchor_x, anchor_y);
        CREATE INDEX IF NOT EXISTS idx_particles_molecule_id    ON particles(molecule_id);
        CREATE INDEX IF NOT EXISTS idx_particles_atom_id    ON particles(atom_id);
        CREATE INDEX IF NOT EXISTS idx_molecules_image_id   ON molecules(image_id);
        CREATE INDEX IF NOT EXISTS idx_atoms_image_id   ON atoms(image_id);
        CREATE INDEX IF NOT EXISTS idx_atoms_molecule_id ON atoms(molecule_id);
        CREATE INDEX IF NOT EXISTS idx_molecule_gap_overrides_image ON molecule_gap_overrides(image_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_molecule_gap_overrides_index_pair
            ON molecule_gap_overrides(image_id, left_atom_index, right_atom_index);
        CREATE INDEX IF NOT EXISTS idx_atom_particle_order_patterns_signature ON atom_particle_order_patterns(signature_key);
        CREATE INDEX IF NOT EXISTS idx_molecule_atom_order_patterns_signature ON molecule_atom_order_patterns(signature_key);
        CREATE INDEX IF NOT EXISTS idx_atom_particle_order_overrides_image ON atom_particle_order_overrides(image_id);
        CREATE INDEX IF NOT EXISTS idx_molecule_atom_order_overrides_image ON molecule_atom_order_overrides(image_id);
        CREATE INDEX IF NOT EXISTS idx_atom_merge_patterns_signature ON atom_merge_patterns(signature_key);
        CREATE INDEX IF NOT EXISTS idx_atom_row_guides_image ON atom_row_guides(image_id);
        CREATE INDEX IF NOT EXISTS idx_atom_row_overrides_image ON atom_row_overrides(image_id);
        ",
    )
    .map_err(|e| format!("Failed to create tables: {e}"))?;

    Ok(())
}

fn table_columns(conn: &Connection, table: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({table})"))?;
    let columns = stmt
        .query_map([], |row| row.get::<_, String>(1))?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(columns)
}

fn migrate_atom_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS atoms (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            atom_id TEXT NOT NULL UNIQUE,
            molecule_id TEXT NOT NULL REFERENCES molecules(molecule_id) ON DELETE CASCADE,
            image_id    INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            particle_count  INTEGER NOT NULL DEFAULT 0,
            atom_order INTEGER NOT NULL DEFAULT 0,
            source_index INTEGER NOT NULL DEFAULT 0,
            centroid_x  REAL NOT NULL DEFAULT 0,
            centroid_y  REAL NOT NULL DEFAULT 0,
            bounds_x    REAL NOT NULL DEFAULT 0,
            bounds_y    REAL NOT NULL DEFAULT 0,
            bounds_w    REAL NOT NULL DEFAULT 0,
            bounds_h    REAL NOT NULL DEFAULT 0,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_atoms_image_id ON atoms(image_id);
        CREATE INDEX IF NOT EXISTS idx_atoms_molecule_id ON atoms(molecule_id);
        ",
    )?;

    let particle_columns = table_columns(conn, "particles")?;
    if !particle_columns.iter().any(|column| column == "atom_id") {
        conn.execute_batch(
            "
            ALTER TABLE particles ADD COLUMN atom_id TEXT REFERENCES atoms(atom_id) ON DELETE SET NULL;
            CREATE INDEX IF NOT EXISTS idx_particles_atom_id ON particles(atom_id);
            ",
        )?;
    }

    let atom_columns = table_columns(conn, "atoms")?;
    if !atom_columns.iter().any(|column| column == "source_index") {
        conn.execute_batch(
            "
            ALTER TABLE atoms ADD COLUMN source_index INTEGER NOT NULL DEFAULT 0;
            ",
        )?;
    }

    Ok(())
}

fn migrate_molecule_gap_override_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS molecule_gap_overrides (
            id                   INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id             INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            left_atom_index  INTEGER NOT NULL,
            right_atom_index INTEGER NOT NULL,
            left_atom_key    TEXT,
            right_atom_key   TEXT,
            decision             TEXT NOT NULL CHECK(decision IN ('cut', 'join')),
            created_at           TEXT DEFAULT (datetime('now')),
            updated_at           TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_molecule_gap_overrides_image ON molecule_gap_overrides(image_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_molecule_gap_overrides_index_pair
            ON molecule_gap_overrides(image_id, left_atom_index, right_atom_index);
        ",
    )?;
    let columns = table_columns(conn, "molecule_gap_overrides")?;
    if !columns.iter().any(|column| column == "left_atom_key") {
        conn.execute_batch("ALTER TABLE molecule_gap_overrides ADD COLUMN left_atom_key TEXT;")?;
    }
    if !columns.iter().any(|column| column == "right_atom_key") {
        conn.execute_batch("ALTER TABLE molecule_gap_overrides ADD COLUMN right_atom_key TEXT;")?;
    }
    conn.execute_batch(
        "
        CREATE UNIQUE INDEX IF NOT EXISTS idx_molecule_gap_overrides_key_pair
            ON molecule_gap_overrides(image_id, left_atom_key, right_atom_key)
            WHERE left_atom_key IS NOT NULL AND right_atom_key IS NOT NULL;
        ",
    )?;
    Ok(())
}

fn migrate_atom_order_pattern_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS atom_particle_order_patterns (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key       TEXT NOT NULL UNIQUE,
            ordered_tokens_json TEXT NOT NULL,
            sample_image_id     INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_atom_id  TEXT,
            created_at          TEXT DEFAULT (datetime('now')),
            updated_at          TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_atom_particle_order_patterns_signature ON atom_particle_order_patterns(signature_key);
        ",
    )?;
    Ok(())
}

fn migrate_molecule_order_pattern_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS molecule_atom_order_patterns (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key       TEXT NOT NULL UNIQUE,
            ordered_tokens_json TEXT NOT NULL,
            sample_image_id     INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_molecule_id  TEXT,
            created_at          TEXT DEFAULT (datetime('now')),
            updated_at          TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_molecule_atom_order_patterns_signature ON molecule_atom_order_patterns(signature_key);
        ",
    )?;
    Ok(())
}

fn migrate_atom_merge_pattern_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS atom_merge_patterns (
            id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            signature_key      TEXT NOT NULL UNIQUE,
            relation           TEXT NOT NULL CHECK(relation IN ('stacked', 'inline')),
            first_token        TEXT NOT NULL,
            second_token       TEXT NOT NULL,
            max_gap            REAL NOT NULL,
            min_overlap_ratio  REAL NOT NULL,
            sample_image_id    INTEGER REFERENCES images(id) ON DELETE SET NULL,
            sample_atom_a  TEXT,
            sample_atom_b  TEXT,
            created_at         TEXT DEFAULT (datetime('now')),
            updated_at         TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_atom_merge_patterns_signature ON atom_merge_patterns(signature_key);
        ",
    )?;
    Ok(())
}

fn migrate_atom_row_guide_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS atom_row_guides (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id    INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            row_index   INTEGER NOT NULL,
            top_y       REAL,
            y           REAL NOT NULL,
            bottom_y    REAL,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, row_index)
        );
        CREATE INDEX IF NOT EXISTS idx_atom_row_guides_image ON atom_row_guides(image_id);
        ",
    )?;
    let columns = table_columns(conn, "atom_row_guides")?;
    if !columns.iter().any(|column| column == "top_y") {
        conn.execute_batch("ALTER TABLE atom_row_guides ADD COLUMN top_y REAL;")?;
    }
    if !columns.iter().any(|column| column == "bottom_y") {
        conn.execute_batch("ALTER TABLE atom_row_guides ADD COLUMN bottom_y REAL;")?;
    }
    Ok(())
}

fn migrate_atom_row_override_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS atom_row_overrides (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id     INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            atom_key TEXT NOT NULL,
            row_index    INTEGER NOT NULL,
            created_at   TEXT DEFAULT (datetime('now')),
            updated_at   TEXT DEFAULT (datetime('now')),
            UNIQUE(image_id, atom_key)
        );
        CREATE INDEX IF NOT EXISTS idx_atom_row_overrides_image ON atom_row_overrides(image_id);
        ",
    )?;
    Ok(())
}

fn migrate_double_first_row_ceiling(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    let _ = conn;
    Ok(())
}


// =============================================================================
// Images CRUD
// =============================================================================

pub fn insert_image(conn: &Connection, input: &CreateImage) -> Result<Image, String> {
    conn.execute(
        "INSERT INTO images (name, source_path, width, height, metadata_json)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            input.name,
            input.source_path,
            input.width,
            input.height,
            input.metadata_json,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_image(conn, id)
}

pub fn list_images(conn: &Connection) -> Result<Vec<Image>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, source_path, width, height, metadata_json, created_at
             FROM images ORDER BY created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Image {
                id: row.get(0)?,
                name: row.get(1)?,
                source_path: row.get(2)?,
                width: row.get(3)?,
                height: row.get(4)?,
                metadata_json: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut images = Vec::new();
    for row in rows {
        images.push(row.map_err(|e| e.to_string())?);
    }
    Ok(images)
}

pub fn get_image(conn: &Connection, id: i64) -> Result<Image, String> {
    conn.query_row(
        "SELECT id, name, source_path, width, height, metadata_json, created_at
         FROM images WHERE id = ?1",
        params![id],
        |row| {
            Ok(Image {
                id: row.get(0)?,
                name: row.get(1)?,
                source_path: row.get(2)?,
                width: row.get(3)?,
                height: row.get(4)?,
                metadata_json: row.get(5)?,
                created_at: row.get(6)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

// =============================================================================
// Regions CRUD
// =============================================================================

fn create_region_tx(conn: &Connection, input: &CreateRegion) -> Result<Region, String> {
    conn.execute(
        "INSERT INTO regions (image_id, geometry_json, order_index)
         VALUES (?1, ?2, ?3)",
        params![
            input.image_id,
            input.geometry_json,
            input.order_index,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_region(conn, id)
}

pub fn create_region(conn: &Connection, input: &CreateRegion) -> Result<Region, String> {
    create_region_tx(conn, input)
}

pub fn get_region(conn: &Connection, id: i64) -> Result<Region, String> {
    conn.query_row(
        "SELECT id, image_id, geometry_json,
                order_index, created_at, updated_at
         FROM regions WHERE id = ?1",
        params![id],
        |row| {
            Ok(Region {
                id: row.get(0)?,
                image_id: row.get(1)?,
                geometry_json: row.get(2)?,
                order_index: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn update_region(conn: &Connection, id: i64, input: &UpdateRegion) -> Result<Region, String> {
    // Fetch existing to merge optional fields
    let existing = get_region(conn, id)?;

    let geometry_json = input.geometry_json.as_deref().unwrap_or(&existing.geometry_json);
    let order_index = if input.order_index.is_some() {
        input.order_index
    } else {
        existing.order_index
    };
    let affected = conn
        .execute(
            "UPDATE regions SET geometry_json = ?1,
                    order_index = ?2, updated_at = datetime('now')
             WHERE id = ?3",
            params![geometry_json, order_index, id],
        )
        .map_err(|e| e.to_string())?;

    if affected == 0 {
        return Err(format!("Region with id {id} not found"));
    }
    get_region(conn, id)
}

pub fn delete_region(conn: &Connection, id: i64) -> Result<(), String> {
    let affected = conn
        .execute("DELETE FROM regions WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if affected == 0 {
        return Err(format!("Region with id {id} not found"));
    }
    Ok(())
}

pub fn delete_regions_batch(conn: &mut Connection, ids: &[i64]) -> Result<(), String> {
    if ids.is_empty() {
        return Ok(());
    }

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    {
        let mut stmt = tx
            .prepare("DELETE FROM regions WHERE id = ?1")
            .map_err(|e| e.to_string())?;

        for id in ids {
            let affected = stmt.execute(params![id]).map_err(|e| e.to_string())?;
            if affected == 0 {
                return Err(format!("Region with id {id} not found"));
            }
        }
    }

    tx.commit().map_err(|e| e.to_string())
}

pub fn list_regions(conn: &Connection, image_id: i64) -> Result<Vec<Region>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, image_id, geometry_json,
                    order_index, created_at, updated_at
             FROM regions WHERE image_id = ?1 ORDER BY order_index ASC, id ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![image_id], |row| {
            Ok(Region {
                id: row.get(0)?,
                image_id: row.get(1)?,
                geometry_json: row.get(2)?,
                order_index: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut regions = Vec::new();
    for row in rows {
        regions.push(row.map_err(|e| e.to_string())?);
    }
    Ok(regions)
}

// =============================================================================
// Labels CRUD
// =============================================================================

pub fn create_label(conn: &Connection, input: &CreateLabel) -> Result<Label, String> {
    create_label_tx(conn, input)
}

fn create_label_tx(conn: &Connection, input: &CreateLabel) -> Result<Label, String> {
    conn.execute(
        "INSERT INTO labels (region_id, label_type, value)
         VALUES (?1, ?2, ?3)",
        params![
            input.region_id,
            input.label_type,
            input.value,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_label(conn, id)
}

fn get_label(conn: &Connection, id: i64) -> Result<Label, String> {
    conn.query_row(
        "SELECT id, region_id, label_type, value, created_at, updated_at
         FROM labels WHERE id = ?1",
        params![id],
        |row| {
            Ok(Label {
                id: row.get(0)?,
                region_id: row.get(1)?,
                label_type: row.get(2)?,
                value: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn update_label(conn: &Connection, id: i64, input: &UpdateLabel) -> Result<Label, String> {
    let existing = get_label(conn, id)?;

    let label_type = input.label_type.as_deref().unwrap_or(&existing.label_type);
    let value = input.value.as_deref().unwrap_or(&existing.value);

    let affected = conn
        .execute(
            "UPDATE labels SET label_type = ?1, value = ?2, updated_at = datetime('now')
             WHERE id = ?3",
            params![label_type, value, id],
        )
        .map_err(|e| e.to_string())?;

    if affected == 0 {
        return Err(format!("Label with id {id} not found"));
    }
    get_label(conn, id)
}

pub fn delete_label(conn: &Connection, id: i64) -> Result<(), String> {
    let affected = conn
        .execute("DELETE FROM labels WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if affected == 0 {
        return Err(format!("Label with id {id} not found"));
    }
    Ok(())
}

pub fn list_labels(conn: &Connection, region_id: i64) -> Result<Vec<Label>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, region_id, label_type, value, created_at, updated_at
             FROM labels WHERE region_id = ?1 ORDER BY id ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![region_id], |row| {
            Ok(Label {
                id: row.get(0)?,
                region_id: row.get(1)?,
                label_type: row.get(2)?,
                value: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut labels = Vec::new();
    for row in rows {
        labels.push(row.map_err(|e| e.to_string())?);
    }
    Ok(labels)
}

// =============================================================================
// Particles / molecules
// =============================================================================

pub fn sync_particle_for_region(
    conn: &mut Connection,
    region_id: i64,
    family: Option<&str>,
    structural_config: Option<&str>,
) -> Result<Particle, String> {
    let image_id: i64 = conn
        .query_row("SELECT image_id FROM regions WHERE id = ?1", params![region_id], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    let particle = upsert_particle_for_region_tx(&tx, region_id, family, structural_config)?;
    recalculate_molecules_tx(&tx, image_id)?;
    tx.commit().map_err(|e| e.to_string())?;
    get_particle(conn, particle.id)
}

pub fn create_particle_strokes_batch(
    conn: &mut Connection,
    image_id: i64,
    strokes: &[BatchParticleStrokeInput],
) -> Result<ParticlePagePacket, String> {
    if strokes.is_empty() {
        return recalculate_molecules(conn, image_id);
    }

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    for stroke in strokes {
        let region = create_region_tx(
            &tx,
            &CreateRegion {
                image_id,
                geometry_json: stroke.geometry_json.clone(),
                order_index: stroke.order_index,
            },
        )?;

        for label in &stroke.labels {
            let label_type = label.label_type.trim();
            let value = label.value.trim();
            if label_type.is_empty() || value.is_empty() {
                continue;
            }
            create_label_tx(
                &tx,
                &CreateLabel {
                    region_id: region.id,
                    label_type: label_type.to_string(),
                    value: value.to_string(),
                },
            )?;
        }

        upsert_particle_for_region_tx(
            &tx,
            region.id,
            stroke.family.as_deref(),
            stroke.structural_config.as_deref(),
        )?;
    }

    recalculate_molecules_tx(&tx, image_id)?;
    tx.commit().map_err(|e| e.to_string())?;

    let particles = list_particles_for_image(conn, image_id)?;
    let molecules = list_molecules_for_image(conn, image_id)?;
    let atoms = list_atoms_for_image(conn, image_id)?;
    let molecule_audits = molecule_audits_for_image(&particles, &atoms, &molecules);

    Ok(ParticlePagePacket {
        image_id,
        cluster_explanation: cluster_explanation_for_image(conn, image_id, &particles)?,
        particles,
        molecules,
        atoms,
        molecule_audits,
    })
}

pub fn list_particles_for_image(conn: &Connection, image_id: i64) -> Result<Vec<Particle>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, region_id, image_id, family, color, points_json, anchor_x, anchor_y,
                    bounds_x, bounds_y, bounds_w, bounds_h, length, angle, points_count,
                    visual_variant, structural_config, molecule_id, atom_id, particle_order, created_at, updated_at
             FROM particles WHERE image_id = ?1 ORDER BY anchor_y ASC, anchor_x ASC, id ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![image_id], particle_from_row)
        .map_err(|e| e.to_string())?;

    let mut particles = Vec::new();
    for row in rows {
        particles.push(row.map_err(|e| e.to_string())?);
    }
    Ok(particles)
}

pub fn list_molecules_for_image(conn: &Connection, image_id: i64) -> Result<Vec<Molecule>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, molecule_id, image_id, particle_count, atom_count, centroid_x, centroid_y,
                    bounds_x, bounds_y, bounds_w, bounds_h, created_at, updated_at
             FROM molecules WHERE image_id = ?1 ORDER BY bounds_y ASC, bounds_x ASC, id ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![image_id], |row| {
            Ok(Molecule {
                id: row.get(0)?,
                molecule_id: row.get(1)?,
                image_id: row.get(2)?,
                particle_count: row.get(3)?,
                atom_count: row.get(4)?,
                centroid_x: row.get(5)?,
                centroid_y: row.get(6)?,
                bounds_x: row.get(7)?,
                bounds_y: row.get(8)?,
                bounds_w: row.get(9)?,
                bounds_h: row.get(10)?,
                created_at: row.get(11)?,
                updated_at: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut molecules = Vec::new();
    for row in rows {
        molecules.push(row.map_err(|e| e.to_string())?);
    }
    Ok(molecules)
}

pub fn list_atoms_for_image(conn: &Connection, image_id: i64) -> Result<Vec<Atom>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, atom_id, molecule_id, image_id, particle_count, atom_order,
                    source_index, centroid_x, centroid_y, bounds_x, bounds_y, bounds_w, bounds_h, created_at, updated_at
             FROM atoms WHERE image_id = ?1 ORDER BY bounds_y ASC, bounds_x ASC, id ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![image_id], |row| {
            Ok(Atom {
                id: row.get(0)?,
                atom_id: row.get(1)?,
                molecule_id: row.get(2)?,
                image_id: row.get(3)?,
                particle_count: row.get(4)?,
                atom_order: row.get(5)?,
                source_index: row.get(6)?,
                centroid_x: row.get(7)?,
                centroid_y: row.get(8)?,
                bounds_x: row.get(9)?,
                bounds_y: row.get(10)?,
                bounds_w: row.get(11)?,
                bounds_h: row.get(12)?,
                created_at: row.get(13)?,
                updated_at: row.get(14)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut atoms = Vec::new();
    for row in rows {
        atoms.push(row.map_err(|e| e.to_string())?);
    }
    Ok(atoms)
}

fn molecule_audits_for_image(particles: &[Particle], atoms: &[Atom], molecules: &[Molecule]) -> Vec<MoleculeAudit> {
    let mut audits = molecules
        .iter()
        .map(|molecule| {
            let mut molecule_atoms = atoms
                .iter()
                .filter(|atom| atom.molecule_id == molecule.molecule_id)
                .cloned()
                .collect::<Vec<_>>();
            molecule_atoms.sort_by(|a, b| {
                a.atom_order
                    .cmp(&b.atom_order)
                    .then_with(|| a.bounds_x.partial_cmp(&b.bounds_x).unwrap_or(std::cmp::Ordering::Equal))
            });

            let atom_count = molecule_atoms.len() as i64;
            let atom_audits = molecule_atoms
                .iter()
                .map(|atom| atom_audit_for_atom(particles, atom, atom_count))
                .collect::<Vec<_>>();
            let signature = atom_audits
                .iter()
                .map(|atom| format!("{}:{}", atom.slot, atom.signature))
                .collect::<Vec<_>>()
                .join("|");

            MoleculeAudit {
                molecule_id: molecule.molecule_id.clone(),
                atom_count,
                particle_count: molecule.particle_count,
                signature,
                atoms: atom_audits,
            }
        })
        .collect::<Vec<_>>();

    audits.sort_by(|a, b| a.molecule_id.cmp(&b.molecule_id));
    audits
}

fn atom_audit_for_atom(particles: &[Particle], atom: &Atom, atom_count: i64) -> AtomAudit {
    let mut atom_particles = particles
        .iter()
        .filter(|particle| particle.atom_id.as_deref() == Some(atom.atom_id.as_str()))
        .cloned()
        .collect::<Vec<_>>();
    atom_particles.sort_by(|a, b| {
        a.particle_order
            .unwrap_or(i64::MAX)
            .cmp(&b.particle_order.unwrap_or(i64::MAX))
            .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });

    let particle_audits = atom_particles
        .iter()
        .enumerate()
        .map(|(index, particle)| ParticleAudit {
            particle_id: particle.id,
            particle_order: particle.particle_order.unwrap_or(index as i64 + 1),
            family: particle.family.clone(),
            structural_config: particle.structural_config.clone(),
            anchor_x: particle.anchor_x,
            anchor_y: particle.anchor_y,
            bounds_x: particle.bounds_x,
            bounds_y: particle.bounds_y,
            bounds_w: particle.bounds_w,
            bounds_h: particle.bounds_h,
            length: particle.length,
            angle: particle.angle,
        })
        .collect::<Vec<_>>();
    let signature = particle_audits
        .iter()
        .map(|particle| match particle.structural_config.as_deref() {
            Some(config) if !config.trim().is_empty() => format!("{}:{}", particle.family, config),
            _ => particle.family.clone(),
        })
        .collect::<Vec<_>>()
        .join("+");
    let signature_key = atom_signature_key(&atom_particles);
    let internal_contact_count = internal_atom_contact_count(particles, &atom_particles);

    AtomAudit {
        atom_id: atom.atom_id.clone(),
        atom_order: atom.atom_order,
        source_index: atom.source_index,
        slot: atom_slot(atom.atom_order, atom_count),
        particle_count: atom.particle_count,
        signature,
        signature_key,
        internal_contact_count,
        centroid_x: atom.centroid_x,
        centroid_y: atom.centroid_y,
        bounds_x: atom.bounds_x,
        bounds_y: atom.bounds_y,
        bounds_w: atom.bounds_w,
        bounds_h: atom.bounds_h,
        particles: particle_audits,
    }
}

fn internal_atom_contact_count(all_particles: &[Particle], atom_particles: &[Particle]) -> i64 {
    let indexes = atom_particles
        .iter()
        .filter_map(|atom_particle| all_particles.iter().position(|particle| particle.id == atom_particle.id))
        .collect::<Vec<_>>();
    let mut count = 0;
    for left in 0..indexes.len() {
        for right in (left + 1)..indexes.len() {
            if should_contact_particles(all_particles, indexes[left], indexes[right]) {
                count += 1;
            }
        }
    }
    count
}

fn atom_slot(order: i64, count: i64) -> String {
    if count <= 1 {
        return "token".to_string();
    }
    if order <= 1 {
        "prefijo".to_string()
    } else if order >= count {
        "sufijo".to_string()
    } else {
        "raiz".to_string()
    }
}

pub fn recalculate_molecules(conn: &mut Connection, image_id: i64) -> Result<ParticlePagePacket, String> {
    let tx = conn.transaction().map_err(|e| e.to_string())?;
    recalculate_molecules_tx(&tx, image_id)?;
    tx.commit().map_err(|e| e.to_string())?;
    let particles = list_particles_for_image(conn, image_id)?;
    let molecules = list_molecules_for_image(conn, image_id)?;
    let atoms = list_atoms_for_image(conn, image_id)?;
    let molecule_audits = molecule_audits_for_image(&particles, &atoms, &molecules);

    Ok(ParticlePagePacket {
        image_id,
        cluster_explanation: cluster_explanation_for_image(conn, image_id, &particles)?,
        particles,
        molecules,
        atoms,
        molecule_audits,
    })
}

pub fn set_molecule_gap_override(
    conn: &mut Connection,
    image_id: i64,
    left_atom_index: i64,
    right_atom_index: i64,
    decision: &str,
) -> Result<ParticlePagePacket, String> {
    let decision = match decision {
        "cut" | "join" => decision,
        _ => return Err("Decision must be 'cut' or 'join'".to_string()),
    };
    let atom_keys = current_atom_key_pair(conn, image_id, left_atom_index, right_atom_index)?;

    conn.execute(
        "INSERT INTO molecule_gap_overrides (
            image_id, left_atom_index, right_atom_index, left_atom_key, right_atom_key, decision, updated_at
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, datetime('now'))
         ON CONFLICT(image_id, left_atom_index, right_atom_index)
         DO UPDATE SET
            left_atom_key = excluded.left_atom_key,
            right_atom_key = excluded.right_atom_key,
            decision = excluded.decision,
            updated_at = datetime('now')",
        params![
            image_id,
            left_atom_index,
            right_atom_index,
            atom_keys.as_ref().map(|pair| pair.0.as_str()),
            atom_keys.as_ref().map(|pair| pair.1.as_str()),
            decision
        ],
    )
    .map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn clear_molecule_gap_override(
    conn: &mut Connection,
    image_id: i64,
    left_atom_index: i64,
    right_atom_index: i64,
) -> Result<ParticlePagePacket, String> {
    let atom_keys = current_atom_key_pair(conn, image_id, left_atom_index, right_atom_index)?;
    conn.execute(
        "DELETE FROM molecule_gap_overrides
         WHERE image_id = ?1 AND (
            (left_atom_index = ?2 AND right_atom_index = ?3)
            OR (left_atom_key = ?4 AND right_atom_key = ?5)
         )",
        params![
            image_id,
            left_atom_index,
            right_atom_index,
            atom_keys.as_ref().map(|pair| pair.0.as_str()),
            atom_keys.as_ref().map(|pair| pair.1.as_str())
        ],
    )
    .map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn set_molecule_gap_overrides_batch(
    conn: &mut Connection,
    image_id: i64,
    overrides: &[MoleculeGapOverrideDraft],
) -> Result<ParticlePagePacket, String> {
    if overrides.is_empty() {
        return recalculate_molecules(conn, image_id);
    }

    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let atom_keys = atom_groups
        .iter()
        .map(|atom| atom_key_for_group(&particles, atom))
        .collect::<Vec<_>>();

    let resolved = overrides
        .iter()
        .map(|draft| {
            let decision = match draft.decision.as_str() {
                "cut" | "join" => Some(draft.decision.as_str()),
                "auto" => None,
                _ => return Err("Decision must be 'cut', 'join' or 'auto'".to_string()),
            };
            let left_key = atom_keys
                .get(draft.left_atom_index.max(1) as usize - 1)
                .cloned();
            let right_key = atom_keys
                .get(draft.right_atom_index.max(1) as usize - 1)
                .cloned();
            Ok((
                draft.left_atom_index,
                draft.right_atom_index,
                decision.map(|value| value.to_string()),
                left_key.zip(right_key),
            ))
        })
        .collect::<Result<Vec<_>, String>>()?;

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    for (left_atom_index, right_atom_index, decision, atom_keys) in resolved {
        tx.execute(
            "DELETE FROM molecule_gap_overrides
             WHERE image_id = ?1 AND (
                (left_atom_index = ?2 AND right_atom_index = ?3)
                OR (left_atom_key = ?4 AND right_atom_key = ?5)
             )",
            params![
                image_id,
                left_atom_index,
                right_atom_index,
                atom_keys.as_ref().map(|pair| pair.0.as_str()),
                atom_keys.as_ref().map(|pair| pair.1.as_str())
            ],
        )
        .map_err(|e| e.to_string())?;

        let Some(decision) = decision else {
            continue;
        };

        tx.execute(
            "INSERT INTO molecule_gap_overrides (
                image_id, left_atom_index, right_atom_index, left_atom_key, right_atom_key, decision, updated_at
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, datetime('now'))",
            params![
                image_id,
                left_atom_index,
                right_atom_index,
                atom_keys.as_ref().map(|pair| pair.0.as_str()),
                atom_keys.as_ref().map(|pair| pair.1.as_str()),
                decision
            ],
        )
        .map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn set_atom_row_override(
    conn: &mut Connection,
    image_id: i64,
    atom_index: i64,
    row_index: i64,
) -> Result<ParticlePagePacket, String> {
    if row_index < 1 {
        return Err("El renglon debe ser 1 o mayor.".to_string());
    }
    let atom_key = current_atom_key(conn, image_id, atom_index)?
        .ok_or_else(|| "No pude resolver la atomo actual.".to_string())?;
    conn.execute(
        "INSERT INTO atom_row_overrides (image_id, atom_key, row_index, updated_at)
         VALUES (?1, ?2, ?3, datetime('now'))
         ON CONFLICT(image_id, atom_key)
         DO UPDATE SET row_index = excluded.row_index, updated_at = datetime('now')",
        params![image_id, atom_key, row_index],
    )
    .map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn clear_atom_row_override(
    conn: &mut Connection,
    image_id: i64,
    atom_index: i64,
) -> Result<ParticlePagePacket, String> {
    let Some(atom_key) = current_atom_key(conn, image_id, atom_index)? else {
        return recalculate_molecules(conn, image_id);
    };
    conn.execute(
        "DELETE FROM atom_row_overrides
         WHERE image_id = ?1 AND atom_key = ?2",
        params![image_id, atom_key],
    )
    .map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn set_atom_row_overrides_batch(
    conn: &mut Connection,
    image_id: i64,
    overrides: &[AtomRowOverrideDraft],
) -> Result<ParticlePagePacket, String> {
    if overrides.is_empty() {
        return recalculate_molecules(conn, image_id);
    }

    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let atom_keys = atom_groups
        .iter()
        .map(|atom| atom_key_for_group(&particles, atom))
        .collect::<Vec<_>>();

    let resolved = overrides
        .iter()
        .map(|draft| {
            if let Some(row_index) = draft.row_index {
                if row_index < 1 {
                    return Err("El renglon debe ser 1 o mayor.".to_string());
                }
            }
            let atom_key = draft
                .atom_key
                .as_ref()
                .filter(|key| !key.trim().is_empty())
                .cloned()
                .or_else(|| atom_keys.get(draft.atom_index.max(1) as usize - 1).cloned())
                .ok_or_else(|| "No pude resolver la atomo actual.".to_string())?;
            Ok((atom_key, draft.row_index))
        })
        .collect::<Result<Vec<_>, String>>()?;

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    for (atom_key, row_index) in resolved {
        if let Some(row_index) = row_index {
            tx.execute(
                "INSERT INTO atom_row_overrides (image_id, atom_key, row_index, updated_at)
                 VALUES (?1, ?2, ?3, datetime('now'))
                 ON CONFLICT(image_id, atom_key)
                 DO UPDATE SET row_index = excluded.row_index, updated_at = datetime('now')",
                params![image_id, atom_key, row_index],
            )
            .map_err(|e| e.to_string())?;
        } else {
            tx.execute(
                "DELETE FROM atom_row_overrides
                 WHERE image_id = ?1 AND atom_key = ?2",
                params![image_id, atom_key],
            )
            .map_err(|e| e.to_string())?;
        }
    }
    tx.commit().map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

fn write_current_atom_row_guides(conn: &mut Connection, image_id: i64) -> Result<(), String> {
    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let rows = atom_rows(&particles, &atom_groups);
    let mut bands = rows
        .iter()
        .map(|row| RowBand {
            row_index: row.row_index,
            top_y: row.top_y,
            y: row.y,
            bottom_y: row.bottom_y,
        })
        .collect::<Vec<_>>();
    glue_row_band_tops_to_previous_bottoms(&mut bands);

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    tx.execute("DELETE FROM atom_row_guides WHERE image_id = ?1", params![image_id])
        .map_err(|e| e.to_string())?;
    for (index, row) in bands.iter().enumerate() {
        tx.execute(
            "INSERT INTO atom_row_guides (image_id, row_index, top_y, y, bottom_y, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))",
            params![image_id, index as i64 + 1, row.top_y, row.y, row.bottom_y],
        )
        .map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

fn ensure_atom_row_guides(conn: &mut Connection, image_id: i64) -> Result<(), String> {
    repair_atom_row_guides(conn, image_id)?;

    let max_row_index: i64 = conn
        .query_row(
            "SELECT COALESCE(MAX(row_index), 0) FROM atom_row_guides WHERE image_id = ?1",
            params![image_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;
    if max_row_index == 0 {
        write_current_atom_row_guides(conn, image_id)?;
        return Ok(());
    }

    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let guides = atom_row_guides_for_image(conn, image_id)?;
    let row_overrides = atom_row_overrides_for_image(conn, image_id)?;
    let rows = atom_rows_with_guides(&particles, &atom_groups, &guides, &row_overrides);

    if rows.len() as i64 > max_row_index {
        for (index, row) in rows.iter().enumerate().skip(max_row_index as usize) {
            conn.execute(
                "INSERT OR IGNORE INTO atom_row_guides (image_id, row_index, top_y, y, bottom_y, updated_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))",
                params![
                    image_id,
                    index as i64 + 1,
                    row.top_y,
                    (row.top_y + row.bottom_y) / 2.0,
                    row.bottom_y,
                ],
            )
            .map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

fn repair_atom_row_guides(conn: &mut Connection, image_id: i64) -> Result<(), String> {
    let mut guides = Vec::new();
    let mut needs_repair = false;
    {
        let mut stmt = conn
            .prepare(
                "SELECT row_index, top_y, y, bottom_y
                 FROM atom_row_guides
                 WHERE image_id = ?1
                 ORDER BY row_index ASC",
            )
            .map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map(params![image_id], |row| {
                let row_index = row.get::<_, i64>(0)?;
                let y = row.get::<_, f64>(2)?;
                let top_y = row.get::<_, Option<f64>>(1)?.unwrap_or(y - 14.0);
                let bottom_y = row.get::<_, Option<f64>>(3)?.unwrap_or(y + 14.0);
                Ok(RowBand {
                    row_index,
                    top_y,
                    y,
                    bottom_y,
                })
            })
            .map_err(|e| e.to_string())?;

        for row in rows {
            let guide = row.map_err(|e| e.to_string())?;
            if guide.row_index != guides.len() as i64 + 1 {
                needs_repair = true;
            }
            if guide.top_y.is_finite()
                && guide.y.is_finite()
                && guide.bottom_y.is_finite()
                && guide.top_y < guide.bottom_y
            {
                guides.push(guide);
            } else {
                needs_repair = true;
            }
        }
    }

    if !needs_repair {
        return Ok(());
    }

    guides.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    glue_row_band_tops_to_previous_bottoms(&mut guides);

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    tx.execute(
        "DELETE FROM atom_row_guides WHERE image_id = ?1",
        params![image_id],
    )
    .map_err(|e| e.to_string())?;
    for (index, guide) in guides.iter().enumerate() {
        let row_index = index as i64 + 1;
        let center_y = (guide.top_y + guide.bottom_y) / 2.0;
        tx.execute(
            "INSERT INTO atom_row_guides (image_id, row_index, top_y, y, bottom_y, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))",
            params![image_id, row_index, guide.top_y, center_y, guide.bottom_y],
        )
        .map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

fn normalize_atom_row_guides(conn: &Connection, image_id: i64) -> Result<(), String> {
    let guides = atom_row_guides_for_image(conn, image_id)?;
    for guide in guides.iter() {
        let center_y = (guide.top_y + guide.bottom_y) / 2.0;
        conn.execute(
            "UPDATE atom_row_guides
             SET top_y = ?3, y = ?4, bottom_y = ?5, updated_at = datetime('now')
             WHERE image_id = ?1 AND row_index = ?2",
            params![image_id, guide.row_index, guide.top_y, center_y, guide.bottom_y],
        )
        .map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn clamped_atom_row_guide_delta(
    conn: &Connection,
    image_id: i64,
    row_index: i64,
    delta_y: f64,
    edge: &str,
) -> Result<f64, String> {
    let guides = atom_row_guides_for_image(conn, image_id)?;
    let Some(position) = guides.iter().position(|guide| guide.row_index == row_index) else {
        return Ok(delta_y);
    };
    let guide = guides[position];
    let previous = if position > 0 {
        guides.get(position - 1).copied()
    } else {
        None
    };
    let next = guides.get(position + 1).copied();
    let minimum_height = 2.0;

    let clamped = match edge {
        "top" => {
            let lower_bound = previous
                .map(|row| row.top_y + minimum_height)
                .unwrap_or(f64::NEG_INFINITY);
            let upper_bound = guide.bottom_y - minimum_height;
            (guide.top_y + delta_y).clamp(lower_bound, upper_bound) - guide.top_y
        }
        "bottom" => {
            let lower_bound = guide.top_y + minimum_height;
            let upper_bound = next
                .map(|row| row.bottom_y - minimum_height)
                .unwrap_or(f64::INFINITY);
            (guide.bottom_y + delta_y).clamp(lower_bound, upper_bound) - guide.bottom_y
        }
        "all" | "center" => {
            let lower_delta = previous
                .map(|row| row.top_y + minimum_height - guide.top_y)
                .unwrap_or(f64::NEG_INFINITY);
            let upper_delta = next
                .map(|row| row.bottom_y - minimum_height - guide.bottom_y)
                .unwrap_or(f64::INFINITY);
            delta_y.clamp(lower_delta, upper_delta)
        }
        _ => delta_y,
    };

    Ok(clamped)
}

pub fn adjust_atom_row_guide(
    conn: &mut Connection,
    image_id: i64,
    row_index: i64,
    delta_y: f64,
    edge: &str,
) -> Result<ParticlePagePacket, String> {
    ensure_atom_row_guides(conn, image_id)?;
    let delta_y = clamped_atom_row_guide_delta(conn, image_id, row_index, delta_y, edge)?;

    match edge {
        "top" => {
            let default_top = if row_index == 1 { "y - 28.0" } else { "y - 14.0" };
            let query = format!(
                "UPDATE atom_row_guides
                 SET top_y = COALESCE(top_y, {}) + ?3, updated_at = datetime('now')
                 WHERE image_id = ?1 AND row_index = ?2",
                default_top
            );
            conn.execute(&query, params![image_id, row_index, delta_y])
                .and_then(|_| {
                    if row_index <= 1 {
                        Ok(0)
                    } else {
                        conn.execute(
                            "UPDATE atom_row_guides
                             SET bottom_y = (
                                 SELECT top_y FROM atom_row_guides
                                 WHERE image_id = ?1 AND row_index = ?2
                             ),
                             updated_at = datetime('now')
                             WHERE image_id = ?1 AND row_index = ?2 - 1",
                            params![image_id, row_index],
                        )
                    }
                })
        }
        "bottom" => conn.execute(
            "UPDATE atom_row_guides
             SET bottom_y = COALESCE(bottom_y, y + 14.0) + ?3, updated_at = datetime('now')
             WHERE image_id = ?1 AND row_index = ?2",
            params![image_id, row_index, delta_y],
        ).and_then(|_| {
            conn.execute(
                "UPDATE atom_row_guides
                 SET top_y = (
                     SELECT bottom_y FROM atom_row_guides
                     WHERE image_id = ?1 AND row_index = ?2
                 ),
                 updated_at = datetime('now')
                 WHERE image_id = ?1 AND row_index = ?2 + 1",
                params![image_id, row_index],
            )
        }),
        "all" | "center" => {
            let default_top = if row_index == 1 { "y - 28.0" } else { "y - 14.0" };
            let query = format!(
                "UPDATE atom_row_guides
                 SET top_y = COALESCE(top_y, {}) + ?3,
                     y = y + ?3,
                     bottom_y = COALESCE(bottom_y, y + 14.0) + ?3,
                     updated_at = datetime('now')
                 WHERE image_id = ?1 AND row_index = ?2",
                default_top
            );
            conn.execute(&query, params![image_id, row_index, delta_y])
                .and_then(|_| {
                    if row_index <= 1 {
                        Ok(0)
                    } else {
                        conn.execute(
                            "UPDATE atom_row_guides
                             SET bottom_y = (
                                 SELECT top_y FROM atom_row_guides
                                 WHERE image_id = ?1 AND row_index = ?2
                             ),
                             updated_at = datetime('now')
                             WHERE image_id = ?1 AND row_index = ?2 - 1",
                            params![image_id, row_index],
                        )
                    }
                })
                .and_then(|_| {
                    conn.execute(
                        "UPDATE atom_row_guides
                         SET top_y = (
                             SELECT bottom_y FROM atom_row_guides
                             WHERE image_id = ?1 AND row_index = ?2
                         ),
                         updated_at = datetime('now')
                         WHERE image_id = ?1 AND row_index = ?2 + 1",
                        params![image_id, row_index],
                    )
                })
        }
        _ => return Err("Edge must be 'top', 'bottom', or 'all'.".to_string()),
    }
    .map_err(|e| e.to_string())?;
    normalize_atom_row_guides(conn, image_id)?;

    recalculate_molecules(conn, image_id)
}

pub fn set_atom_row_guides(
    conn: &mut Connection,
    image_id: i64,
    guides: &[AtomRowGuideDraft],
) -> Result<ParticlePagePacket, String> {
    if guides.is_empty() {
        return Err("No hay renglones para guardar.".to_string());
    }

    let mut rows = guides
        .iter()
        .copied()
        .filter(|guide| {
            guide.row_index > 0
                && guide.top_y.is_finite()
                && guide.y.is_finite()
                && guide.bottom_y.is_finite()
        })
        .collect::<Vec<_>>();
    if rows.len() != guides.len() {
        return Err("Hay guias de renglon invalidas.".to_string());
    }

    rows.sort_by(|a, b| {
        a.row_index
            .cmp(&b.row_index)
            .then_with(|| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal))
    });

    for (index, row) in rows.iter().enumerate() {
        let expected = index as i64 + 1;
        if row.row_index != expected {
            return Err(format!("Los renglones deben ser continuos: falta R{expected}."));
        }
        if row.top_y >= row.bottom_y {
            return Err(format!("R{} tiene altura invalida.", row.row_index));
        }
    }

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    tx.execute(
        "DELETE FROM atom_row_guides WHERE image_id = ?1",
        params![image_id],
    )
    .map_err(|e| e.to_string())?;
    for row in rows {
        let center_y = (row.top_y + row.bottom_y) / 2.0;
        tx.execute(
            "INSERT INTO atom_row_guides (image_id, row_index, top_y, y, bottom_y, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))",
            params![image_id, row.row_index, row.top_y, center_y, row.bottom_y],
        )
        .map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn set_atom_particle_order(
    conn: &mut Connection,
    image_id: i64,
    atom_id: &str,
    particle_ids: &[i64],
) -> Result<ParticlePagePacket, String> {
    learn_atom_particle_order_override(conn, image_id, atom_id, particle_ids)?;
    learn_atom_particle_order_pattern(conn, image_id, atom_id, particle_ids)?;
    recalculate_molecules(conn, image_id)
}

fn learn_atom_particle_order_override(
    conn: &Connection,
    image_id: i64,
    atom_id: &str,
    particle_ids: &[i64],
) -> Result<(), String> {
    if particle_ids.is_empty() {
        return Err("El atomo no puede quedar sin particulas.".to_string());
    }

    let current_particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| particle.atom_id.as_deref() == Some(atom_id))
        .collect::<Vec<_>>();
    if current_particles.len() != particle_ids.len() {
        return Err("El orden enviado no coincide con las particulas del atomo.".to_string());
    }

    let current_ids = current_particles.iter().map(|particle| particle.id).collect::<std::collections::HashSet<_>>();
    let requested_ids = particle_ids.iter().copied().collect::<std::collections::HashSet<_>>();
    if current_ids != requested_ids {
        return Err("Solo se pueden ordenar particulas que pertenecen a ese atomo.".to_string());
    }

    let atom_particle_key = particle_id_key(particle_ids);
    let ordered_particle_ids_json = serde_json::to_string(particle_ids).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO atom_particle_order_overrides (
            image_id, atom_particle_key, ordered_particle_ids_json, sample_atom_id, updated_at
         ) VALUES (?1, ?2, ?3, ?4, datetime('now'))
         ON CONFLICT(image_id, atom_particle_key) DO UPDATE SET
            ordered_particle_ids_json = excluded.ordered_particle_ids_json,
            sample_atom_id = excluded.sample_atom_id,
            updated_at = datetime('now')",
        params![image_id, atom_particle_key, ordered_particle_ids_json, atom_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn learn_atom_particle_order_pattern(
    conn: &Connection,
    image_id: i64,
    atom_id: &str,
    particle_ids: &[i64],
) -> Result<(), String> {
    if particle_ids.is_empty() {
        return Err("El atomo no puede quedar sin particulas.".to_string());
    }

    let current_particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| particle.atom_id.as_deref() == Some(atom_id))
        .collect::<Vec<_>>();
    if current_particles.len() != particle_ids.len() {
        return Err("El orden enviado no coincide con las particulas del atomo.".to_string());
    }

    let current_ids = current_particles.iter().map(|particle| particle.id).collect::<std::collections::HashSet<_>>();
    let requested_ids = particle_ids.iter().copied().collect::<std::collections::HashSet<_>>();
    if current_ids != requested_ids {
        return Err("Solo se pueden ordenar particulas que pertenecen a ese atomo.".to_string());
    }

    let particles_by_id = current_particles
        .into_iter()
        .map(|particle| (particle.id, particle))
        .collect::<HashMap<_, _>>();
    let ordered_particles = particle_ids
        .iter()
        .filter_map(|particle_id| particles_by_id.get(particle_id).cloned())
        .collect::<Vec<_>>();
    let signature_key = atom_signature_key(&ordered_particles);
    let ordered_tokens = ordered_particles
        .iter()
        .map(particle_signature_token)
        .collect::<Vec<_>>();
    let ordered_tokens_json = serde_json::to_string(&ordered_tokens).map_err(|e| e.to_string())?;

    let existing = conn
        .query_row(
            "SELECT ordered_tokens_json FROM atom_particle_order_patterns WHERE signature_key = ?1",
            params![signature_key],
            |row| row.get::<_, String>(0),
        )
        .ok();
    if let Some(existing_json) = existing {
        if existing_json != ordered_tokens_json {
            conn.execute(
                "DELETE FROM atom_particle_order_patterns WHERE signature_key = ?1",
                params![signature_key],
            )
            .map_err(|e| e.to_string())?;
            return Ok(());
        }
    }

    conn.execute(
        "INSERT INTO atom_particle_order_patterns (
            signature_key, ordered_tokens_json, sample_image_id, sample_atom_id, updated_at
         ) VALUES (?1, ?2, ?3, ?4, datetime('now'))
         ON CONFLICT(signature_key) DO UPDATE SET
            ordered_tokens_json = excluded.ordered_tokens_json,
            sample_image_id = excluded.sample_image_id,
            sample_atom_id = excluded.sample_atom_id,
            updated_at = datetime('now')",
        params![signature_key, ordered_tokens_json, image_id, atom_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn set_molecule_atom_order(
    conn: &mut Connection,
    image_id: i64,
    molecule_id: &str,
    atom_ids: &[String],
) -> Result<ParticlePagePacket, String> {
    learn_molecule_atom_order_override(conn, image_id, molecule_id, atom_ids)?;
    learn_molecule_atom_order_pattern(conn, image_id, molecule_id, atom_ids)?;
    recalculate_molecules(conn, image_id)
}

fn learn_molecule_atom_order_override(
    conn: &Connection,
    image_id: i64,
    molecule_id: &str,
    atom_ids: &[String],
) -> Result<(), String> {
    if atom_ids.is_empty() {
        return Err("La molecula no puede quedar sin atomos.".to_string());
    }

    let current_atoms = list_atoms_for_image(conn, image_id)?
        .into_iter()
        .filter(|atom| atom.molecule_id == molecule_id)
        .collect::<Vec<_>>();
    if current_atoms.len() != atom_ids.len() {
        return Err("El orden enviado no coincide con los atomos de la molecula.".to_string());
    }

    let current_ids = current_atoms
        .iter()
        .map(|atom| atom.atom_id.clone())
        .collect::<std::collections::HashSet<_>>();
    let requested_ids = atom_ids.iter().cloned().collect::<std::collections::HashSet<_>>();
    if current_ids != requested_ids {
        return Err("Solo se pueden ordenar atomos que pertenecen a esa molecula.".to_string());
    }

    let particles = list_particles_for_image(conn, image_id)?;
    let atoms_by_id = current_atoms
        .into_iter()
        .map(|atom| (atom.atom_id.clone(), atom))
        .collect::<HashMap<_, _>>();
    let molecule_particle_key = molecule_particle_key_for_atoms(&particles, atoms_by_id.values());
    let ordered_atom_keys = atom_ids
        .iter()
        .filter_map(|atom_id| atoms_by_id.get(atom_id))
        .map(|atom| atom_particle_key_for_atom(&particles, atom))
        .collect::<Vec<_>>();
    if ordered_atom_keys.len() != atom_ids.len() {
        return Err("No pude resolver los atomos de la molecula.".to_string());
    }
    let ordered_atom_keys_json = serde_json::to_string(&ordered_atom_keys).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO molecule_atom_order_overrides (
            image_id, molecule_particle_key, ordered_atom_keys_json, sample_molecule_id, updated_at
         ) VALUES (?1, ?2, ?3, ?4, datetime('now'))
         ON CONFLICT(image_id, molecule_particle_key) DO UPDATE SET
            ordered_atom_keys_json = excluded.ordered_atom_keys_json,
            sample_molecule_id = excluded.sample_molecule_id,
            updated_at = datetime('now')",
        params![image_id, molecule_particle_key, ordered_atom_keys_json, molecule_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn learn_molecule_atom_order_pattern(
    conn: &Connection,
    image_id: i64,
    molecule_id: &str,
    atom_ids: &[String],
) -> Result<(), String> {
    if atom_ids.is_empty() {
        return Err("La molecula no puede quedar sin atomos.".to_string());
    }

    let current_atoms = list_atoms_for_image(conn, image_id)?
        .into_iter()
        .filter(|atom| atom.molecule_id == molecule_id)
        .collect::<Vec<_>>();
    if current_atoms.len() != atom_ids.len() {
        return Err("El orden enviado no coincide con los atomos de la molecula.".to_string());
    }

    let current_ids = current_atoms
        .iter()
        .map(|atom| atom.atom_id.clone())
        .collect::<std::collections::HashSet<_>>();
    let requested_ids = atom_ids.iter().cloned().collect::<std::collections::HashSet<_>>();
    if current_ids != requested_ids {
        return Err("Solo se pueden ordenar atomos que pertenecen a esa molecula.".to_string());
    }

    let particles = list_particles_for_image(conn, image_id)?;
    let atoms_by_id = current_atoms
        .into_iter()
        .map(|atom| (atom.atom_id.clone(), atom))
        .collect::<HashMap<_, _>>();
    let occurrence_tokens = atom_occurrence_tokens_for_atoms(&particles, atoms_by_id.values().cloned().collect());
    let ordered_tokens = atom_ids
        .iter()
        .filter_map(|atom_id| occurrence_tokens.get(atom_id).cloned())
        .collect::<Vec<_>>();
    let signature_key = molecule_signature_key_from_atom_tokens(
        &ordered_tokens
            .iter()
            .map(|token| strip_occurrence_suffix(token).to_string())
            .collect::<Vec<_>>(),
    );
    let ordered_tokens_json = serde_json::to_string(&ordered_tokens).map_err(|e| e.to_string())?;

    let existing = conn
        .query_row(
            "SELECT ordered_tokens_json FROM molecule_atom_order_patterns WHERE signature_key = ?1",
            params![signature_key],
            |row| row.get::<_, String>(0),
        )
        .ok();
    if let Some(existing_json) = existing {
        if existing_json != ordered_tokens_json {
            conn.execute(
                "DELETE FROM molecule_atom_order_patterns WHERE signature_key = ?1",
                params![signature_key],
            )
            .map_err(|e| e.to_string())?;
            return Ok(());
        }
    }

    conn.execute(
        "INSERT INTO molecule_atom_order_patterns (
            signature_key, ordered_tokens_json, sample_image_id, sample_molecule_id, updated_at
         ) VALUES (?1, ?2, ?3, ?4, datetime('now'))
         ON CONFLICT(signature_key) DO UPDATE SET
            ordered_tokens_json = excluded.ordered_tokens_json,
            sample_image_id = excluded.sample_image_id,
            sample_molecule_id = excluded.sample_molecule_id,
            updated_at = datetime('now')",
        params![signature_key, ordered_tokens_json, image_id, molecule_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn set_order_drafts_batch(
    conn: &mut Connection,
    image_id: i64,
    atom_particle_orders: &[AtomParticleOrderDraft],
    molecule_atom_orders: &[MoleculeAtomOrderDraft],
) -> Result<ParticlePagePacket, String> {
    if atom_particle_orders.is_empty() && molecule_atom_orders.is_empty() {
        return recalculate_molecules(conn, image_id);
    }

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    for draft in atom_particle_orders {
        learn_atom_particle_order_override(&tx, image_id, &draft.atom_id, &draft.particle_ids)?;
        learn_atom_particle_order_pattern(&tx, image_id, &draft.atom_id, &draft.particle_ids)?;
    }
    for draft in molecule_atom_orders {
        learn_molecule_atom_order_override(&tx, image_id, &draft.molecule_id, &draft.atom_ids)?;
        learn_molecule_atom_order_pattern(&tx, image_id, &draft.molecule_id, &draft.atom_ids)?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn set_atom_merge_pattern(
    conn: &mut Connection,
    image_id: i64,
    atom_id_a: &str,
    atom_id_b: &str,
) -> Result<ParticlePagePacket, String> {
    if atom_id_a == atom_id_b {
        return Err("No se puede fusionar una atomo consigo misma.".to_string());
    }

    let atoms = list_atoms_for_image(conn, image_id)?;
    let atom_a = atoms
        .iter()
        .find(|atom| atom.atom_id == atom_id_a)
        .cloned()
        .ok_or_else(|| "No encontre la primera atomo.".to_string())?;
    let atom_b = atoms
        .iter()
        .find(|atom| atom.atom_id == atom_id_b)
        .cloned()
        .ok_or_else(|| "No encontre la segunda atomo.".to_string())?;
    if atom_a.molecule_id != atom_b.molecule_id {
        return Err("Por ahora solo se ensena fusion entre atomos de la misma molecula.".to_string());
    }

    let particles = list_particles_for_image(conn, image_id)?;
    let token_a = atom_signature_key_for_atom(&particles, &atom_a);
    let token_b = atom_signature_key_for_atom(&particles, &atom_b);
    let merge = atom_merge_measure_from_boxes(
        &token_a,
        &atom_box(&atom_a),
        &token_b,
        &atom_box(&atom_b),
    );

    conn.execute(
        "INSERT INTO atom_merge_patterns (
            signature_key, relation, first_token, second_token, max_gap, min_overlap_ratio,
            sample_image_id, sample_atom_a, sample_atom_b, updated_at
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'))
         ON CONFLICT(signature_key) DO UPDATE SET
            relation = excluded.relation,
            first_token = excluded.first_token,
            second_token = excluded.second_token,
            max_gap = excluded.max_gap,
            min_overlap_ratio = excluded.min_overlap_ratio,
            sample_image_id = excluded.sample_image_id,
            sample_atom_a = excluded.sample_atom_a,
            sample_atom_b = excluded.sample_atom_b,
            updated_at = datetime('now')",
        params![
            merge.signature_key,
            merge.relation,
            merge.first_token,
            merge.second_token,
            merge.max_gap,
            merge.min_overlap_ratio,
            image_id,
            atom_id_a,
            atom_id_b,
        ],
    )
    .map_err(|e| e.to_string())?;

    recalculate_molecules(conn, image_id)
}

pub fn clear_latest_atom_merge_pattern(
    conn: &mut Connection,
    image_id: i64,
) -> Result<ParticlePagePacket, String> {
    let deleted = conn
        .execute(
            "DELETE FROM atom_merge_patterns
             WHERE id = (
                SELECT id FROM atom_merge_patterns
                ORDER BY datetime(updated_at) DESC, id DESC
                LIMIT 1
             )",
            [],
        )
        .map_err(|e| e.to_string())?;

    if deleted == 0 {
        return Err("No hay fusiones aprendidas para deshacer.".to_string());
    }

    recalculate_molecules(conn, image_id)
}

fn atom_particle_order_patterns(conn: &Connection) -> Result<HashMap<String, Vec<String>>, String> {
    let mut stmt = conn
        .prepare("SELECT signature_key, ordered_tokens_json FROM atom_particle_order_patterns")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            let signature_key: String = row.get(0)?;
            let ordered_tokens_json: String = row.get(1)?;
            Ok((signature_key, ordered_tokens_json))
        })
        .map_err(|e| e.to_string())?;

    let mut patterns = HashMap::new();
    for row in rows {
        let (signature_key, ordered_tokens_json) = row.map_err(|e| e.to_string())?;
        if let Ok(tokens) = serde_json::from_str::<Vec<String>>(&ordered_tokens_json) {
            patterns.insert(signature_key, tokens);
        }
    }
    Ok(patterns)
}

fn molecule_atom_order_patterns(conn: &Connection) -> Result<HashMap<String, Vec<String>>, String> {
    let mut stmt = conn
        .prepare("SELECT signature_key, ordered_tokens_json FROM molecule_atom_order_patterns")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            let signature_key: String = row.get(0)?;
            let ordered_tokens_json: String = row.get(1)?;
            Ok((signature_key, ordered_tokens_json))
        })
        .map_err(|e| e.to_string())?;

    let mut patterns = HashMap::new();
    for row in rows {
        let (signature_key, ordered_tokens_json) = row.map_err(|e| e.to_string())?;
        if let Ok(tokens) = serde_json::from_str::<Vec<String>>(&ordered_tokens_json) {
            patterns.insert(signature_key, tokens);
        }
    }
    Ok(patterns)
}

fn atom_particle_order_overrides(conn: &Connection, image_id: i64) -> Result<HashMap<String, Vec<i64>>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT atom_particle_key, ordered_particle_ids_json
             FROM atom_particle_order_overrides
             WHERE image_id = ?1",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![image_id], |row| {
            let atom_particle_key: String = row.get(0)?;
            let ordered_particle_ids_json: String = row.get(1)?;
            Ok((atom_particle_key, ordered_particle_ids_json))
        })
        .map_err(|e| e.to_string())?;

    let mut overrides = HashMap::new();
    for row in rows {
        let (atom_particle_key, ordered_particle_ids_json) = row.map_err(|e| e.to_string())?;
        if let Ok(particle_ids) = serde_json::from_str::<Vec<i64>>(&ordered_particle_ids_json) {
            overrides.insert(atom_particle_key, particle_ids);
        }
    }
    Ok(overrides)
}

fn molecule_atom_order_overrides(conn: &Connection, image_id: i64) -> Result<HashMap<String, Vec<String>>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT molecule_particle_key, ordered_atom_keys_json
             FROM molecule_atom_order_overrides
             WHERE image_id = ?1",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![image_id], |row| {
            let molecule_particle_key: String = row.get(0)?;
            let ordered_atom_keys_json: String = row.get(1)?;
            Ok((molecule_particle_key, ordered_atom_keys_json))
        })
        .map_err(|e| e.to_string())?;

    let mut overrides = HashMap::new();
    for row in rows {
        let (molecule_particle_key, ordered_atom_keys_json) = row.map_err(|e| e.to_string())?;
        if let Ok(atom_keys) = serde_json::from_str::<Vec<String>>(&ordered_atom_keys_json) {
            overrides.insert(molecule_particle_key, atom_keys);
        }
    }
    Ok(overrides)
}

#[derive(Debug, Clone)]
struct AtomMergePattern {
    signature_key: String,
    relation: String,
    first_token: String,
    second_token: String,
    max_gap: f64,
    min_overlap_ratio: f64,
}

#[derive(Debug, Clone, Copy)]
struct RectBox {
    x: f64,
    y: f64,
    w: f64,
    h: f64,
}

fn atom_merge_patterns(conn: &Connection) -> Result<Vec<AtomMergePattern>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT signature_key, relation, first_token, second_token, max_gap, min_overlap_ratio
             FROM atom_merge_patterns",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(AtomMergePattern {
                signature_key: row.get(0)?,
                relation: row.get(1)?,
                first_token: row.get(2)?,
                second_token: row.get(3)?,
                max_gap: row.get(4)?,
                min_overlap_ratio: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut patterns = Vec::new();
    for row in rows {
        patterns.push(row.map_err(|e| e.to_string())?);
    }
    Ok(patterns)
}

fn merge_atom_groups_by_patterns(
    particles: &[Particle],
    groups: Vec<Vec<usize>>,
    patterns: &[AtomMergePattern],
) -> Vec<Vec<usize>> {
    if groups.len() < 2 || patterns.is_empty() {
        return groups;
    }

    let mut dsu = IndexDisjointSet::new(groups.len());
    for left in 0..groups.len() {
        for right in (left + 1)..groups.len() {
            if atom_groups_match_merge_patterns(particles, &groups[left], &groups[right], patterns) {
                dsu.union(left, right);
            }
        }
    }

    let mut merged: HashMap<usize, Vec<usize>> = HashMap::new();
    for (index, group) in groups.into_iter().enumerate() {
        let root = dsu.find(index);
        merged.entry(root).or_default().extend(group);
    }
    let mut result = merged.into_values().collect::<Vec<_>>();
    result.sort_by(|a, b| {
        let bounds_a = particle_bounds_for_indexes(particles, a);
        let bounds_b = particle_bounds_for_indexes(particles, b);
        bounds_a
            .y
            .partial_cmp(&bounds_b.y)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then_with(|| bounds_a.x.partial_cmp(&bounds_b.x).unwrap_or(std::cmp::Ordering::Equal))
    });
    result
}

fn atom_groups_match_merge_patterns(
    particles: &[Particle],
    left: &[usize],
    right: &[usize],
    patterns: &[AtomMergePattern],
) -> bool {
    let left_token = atom_group_signature_key(particles, left);
    let right_token = atom_group_signature_key(particles, right);
    let left_box = particle_bounds_for_indexes(particles, left).into_rect_box();
    let right_box = particle_bounds_for_indexes(particles, right).into_rect_box();
    let measure = atom_merge_measure_from_boxes(&left_token, &left_box, &right_token, &right_box);

    patterns.iter().any(|pattern| {
        pattern.signature_key == measure.signature_key
            && pattern.relation == measure.relation
            && pattern.first_token == measure.first_token
            && pattern.second_token == measure.second_token
            && measure.max_gap <= ATOM_CONTACT_DISTANCE
            && measure.max_gap <= pattern.max_gap
            && measure.min_overlap_ratio + 0.0001 >= pattern.min_overlap_ratio
    })
}

fn atom_merge_measure_from_boxes(
    token_a: &str,
    box_a: &RectBox,
    token_b: &str,
    box_b: &RectBox,
) -> AtomMergePattern {
    let horizontal_overlap = rect_axis_overlap(box_a.x, box_a.w, box_b.x, box_b.w);
    let vertical_overlap = rect_axis_overlap(box_a.y, box_a.h, box_b.y, box_b.h);
    if horizontal_overlap > 0.0 {
        let (first_token, first_box, second_token, second_box) = if box_a.y <= box_b.y {
            (token_a.to_string(), box_a, token_b.to_string(), box_b)
        } else {
            (token_b.to_string(), box_b, token_a.to_string(), box_a)
        };
        let gap = (second_box.y - (first_box.y + first_box.h)).max(0.0);
        let overlap_ratio = horizontal_overlap / first_box.w.min(second_box.w).max(1.0);
        return AtomMergePattern {
            signature_key: atom_merge_signature_key("stacked", &first_token, &second_token),
            relation: "stacked".to_string(),
            first_token,
            second_token,
            max_gap: learned_atom_merge_gap(gap, first_box.h.min(second_box.h)),
            min_overlap_ratio: learned_atom_merge_overlap(overlap_ratio),
        };
    }

    let (first_token, first_box, second_token, second_box) = if box_a.x <= box_b.x {
        (token_a.to_string(), box_a, token_b.to_string(), box_b)
    } else {
        (token_b.to_string(), box_b, token_a.to_string(), box_a)
    };
    let gap = (second_box.x - (first_box.x + first_box.w)).max(0.0);
    let overlap_ratio = vertical_overlap / first_box.h.min(second_box.h).max(1.0);
    AtomMergePattern {
        signature_key: atom_merge_signature_key("inline", &first_token, &second_token),
        relation: "inline".to_string(),
        first_token,
        second_token,
        max_gap: learned_atom_merge_gap(gap, first_box.w.min(second_box.w)),
        min_overlap_ratio: learned_atom_merge_overlap(overlap_ratio),
    }
}

fn atom_merge_signature_key(relation: &str, first_token: &str, second_token: &str) -> String {
    format!("{relation}|{first_token}|{second_token}")
}

fn learned_atom_merge_gap(gap: f64, _local_size: f64) -> f64 {
    gap.max(0.0)
}

fn learned_atom_merge_overlap(overlap_ratio: f64) -> f64 {
    (overlap_ratio * 0.72).clamp(0.0, 1.0)
}

fn rect_axis_overlap(a_start: f64, a_size: f64, b_start: f64, b_size: f64) -> f64 {
    let left = a_start.max(b_start);
    let right = (a_start + a_size).min(b_start + b_size);
    (right - left).max(0.0)
}

fn atom_box(atom: &Atom) -> RectBox {
    RectBox {
        x: atom.bounds_x,
        y: atom.bounds_y,
        w: atom.bounds_w,
        h: atom.bounds_h,
    }
}

fn apply_atom_order_pattern(particles: &mut Vec<Particle>, patterns: &HashMap<String, Vec<String>>) {
    let signature_key = atom_signature_key(particles);
    let Some(pattern) = patterns.get(&signature_key) else {
        return;
    };
    if pattern.len() != particles.len() {
        return;
    }

    let mut ranks: HashMap<String, VecDeque<usize>> = HashMap::new();
    for (index, token) in pattern.iter().enumerate() {
        ranks.entry(token.clone()).or_default().push_back(index);
    }

    let mut ranked_particles = particles
        .iter()
        .cloned()
        .map(|particle| {
            let token = particle_signature_token(&particle);
            let rank = ranks
                .get_mut(&token)
                .and_then(|positions| positions.pop_front())
                .unwrap_or(usize::MAX);
            (rank, particle)
        })
        .collect::<Vec<_>>();

    if ranked_particles.iter().any(|(rank, _)| *rank == usize::MAX) {
        return;
    }

    ranked_particles.sort_by(|a, b| {
        a.0.cmp(&b.0)
            .then_with(|| a.1.anchor_x.partial_cmp(&b.1.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
            .then_with(|| a.1.anchor_y.partial_cmp(&b.1.anchor_y).unwrap_or(std::cmp::Ordering::Equal))
    });
    *particles = ranked_particles.into_iter().map(|(_, particle)| particle).collect();
}

fn apply_atom_particle_order_override(particles: &mut Vec<Particle>, overrides: &HashMap<String, Vec<i64>>) -> bool {
    let key = particle_id_key_from_particles(particles.iter());
    let Some(ordered_particle_ids) = overrides.get(&key) else {
        return false;
    };
    if ordered_particle_ids.len() != particles.len() {
        return false;
    }

    let particle_ids = particles.iter().map(|particle| particle.id).collect::<std::collections::HashSet<_>>();
    let override_ids = ordered_particle_ids.iter().copied().collect::<std::collections::HashSet<_>>();
    if particle_ids != override_ids {
        return false;
    }

    let mut ranks = HashMap::new();
    for (index, particle_id) in ordered_particle_ids.iter().enumerate() {
        ranks.insert(*particle_id, index);
    }
    particles.sort_by(|a, b| {
        ranks
            .get(&a.id)
            .unwrap_or(&usize::MAX)
            .cmp(ranks.get(&b.id).unwrap_or(&usize::MAX))
            .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });
    true
}

fn apply_molecule_order_pattern(
    atom_indexes: &mut Vec<usize>,
    particles: &[Particle],
    atom_groups: &[Vec<usize>],
    patterns: &HashMap<String, Vec<String>>,
) {
    let tokens = atom_indexes
        .iter()
        .map(|index| atom_group_signature_key(particles, &atom_groups[*index]))
        .collect::<Vec<_>>();
    let signature_key = molecule_signature_key_from_atom_tokens(&tokens);
    let Some(pattern) = patterns.get(&signature_key) else {
        return;
    };
    if pattern.len() != atom_indexes.len() {
        return;
    }

    let uses_occurrences = pattern.iter().any(|token| token.rsplit_once('#').is_some());
    let mut ranks: HashMap<String, VecDeque<usize>> = HashMap::new();
    for (index, token) in pattern.iter().enumerate() {
        ranks.entry(token.clone()).or_default().push_back(index);
    }
    let occurrence_tokens = if uses_occurrences {
        atom_occurrence_tokens_for_groups(particles, atom_indexes, atom_groups)
    } else {
        HashMap::new()
    };

    let mut ranked_atoms = atom_indexes
        .iter()
        .copied()
        .map(|atom_index| {
            let token = occurrence_tokens
                .get(&atom_index)
                .cloned()
                .unwrap_or_else(|| atom_group_signature_key(particles, &atom_groups[atom_index]));
            let rank = ranks
                .get_mut(&token)
                .and_then(|positions| positions.pop_front())
                .unwrap_or(usize::MAX);
            (rank, atom_index)
        })
        .collect::<Vec<_>>();

    if ranked_atoms.iter().any(|(rank, _)| *rank == usize::MAX) {
        return;
    }

    ranked_atoms.sort_by(|a, b| a.0.cmp(&b.0).then_with(|| a.1.cmp(&b.1)));
    *atom_indexes = ranked_atoms
        .into_iter()
        .map(|(_, atom_index)| atom_index)
        .collect();
}

fn apply_molecule_atom_order_override(
    atom_indexes: &mut Vec<usize>,
    particles: &[Particle],
    atom_groups: &[Vec<usize>],
    overrides: &HashMap<String, Vec<String>>,
) -> bool {
    let molecule_particle_key = molecule_particle_key_for_groups(particles, atom_indexes, atom_groups);
    let Some(ordered_atom_keys) = overrides.get(&molecule_particle_key) else {
        return false;
    };
    if ordered_atom_keys.len() != atom_indexes.len() {
        return false;
    }

    let mut ranks: HashMap<String, VecDeque<usize>> = HashMap::new();
    for (index, key) in ordered_atom_keys.iter().enumerate() {
        ranks.entry(key.clone()).or_default().push_back(index);
    }

    let mut ranked_atoms = atom_indexes
        .iter()
        .copied()
        .map(|atom_index| {
            let key = atom_particle_key_for_group(particles, &atom_groups[atom_index]);
            let rank = ranks
                .get_mut(&key)
                .and_then(|positions| positions.pop_front())
                .unwrap_or(usize::MAX);
            (rank, atom_index)
        })
        .collect::<Vec<_>>();

    if ranked_atoms.iter().any(|(rank, _)| *rank == usize::MAX) {
        return false;
    }

    ranked_atoms.sort_by(|a, b| a.0.cmp(&b.0).then_with(|| a.1.cmp(&b.1)));
    *atom_indexes = ranked_atoms
        .into_iter()
        .map(|(_, atom_index)| atom_index)
        .collect();
    true
}

fn atom_signature_key(particles: &[Particle]) -> String {
    let mut tokens = particles.iter().map(particle_signature_token).collect::<Vec<_>>();
    tokens.sort();
    tokens.join("+")
}

fn atom_group_signature_key(particles: &[Particle], atom_group: &[usize]) -> String {
    let mut tokens = atom_group
        .iter()
        .map(|particle_index| particle_signature_token(&particles[*particle_index]))
        .collect::<Vec<_>>();
    tokens.sort();
    tokens.join("+")
}

fn atom_occurrence_tokens_for_groups(
    particles: &[Particle],
    atom_indexes: &[usize],
    atom_groups: &[Vec<usize>],
) -> HashMap<usize, String> {
    let mut ordered = atom_indexes.to_vec();
    ordered.sort();
    let mut counts: HashMap<String, i64> = HashMap::new();
    let mut tokens = HashMap::new();
    for atom_index in ordered {
        let base = atom_group_signature_key(particles, &atom_groups[atom_index]);
        let count = counts.entry(base.clone()).or_insert(0);
        *count += 1;
        tokens.insert(atom_index, format!("{}#{}", base, count));
    }
    tokens
}

fn atom_occurrence_tokens_for_atoms(particles: &[Particle], atoms: Vec<Atom>) -> HashMap<String, String> {
    let mut ordered = atoms;
    ordered.sort_by(|a, b| {
        a.source_index
            .cmp(&b.source_index)
            .then_with(|| a.bounds_x.partial_cmp(&b.bounds_x).unwrap_or(std::cmp::Ordering::Equal))
    });
    let mut counts: HashMap<String, i64> = HashMap::new();
    let mut tokens = HashMap::new();
    for atom in ordered {
        let base = atom_signature_key_for_atom(particles, &atom);
        let count = counts.entry(base.clone()).or_insert(0);
        *count += 1;
        tokens.insert(atom.atom_id.clone(), format!("{}#{}", base, count));
    }
    tokens
}

fn strip_occurrence_suffix(token: &str) -> &str {
    token.rsplit_once('#')
        .and_then(|(base, suffix)| suffix.parse::<i64>().ok().map(|_| base))
        .unwrap_or(token)
}

fn atom_signature_key_for_atom(particles: &[Particle], atom: &Atom) -> String {
    let mut atom_particles = particles
        .iter()
        .filter(|particle| particle.atom_id.as_deref() == Some(atom.atom_id.as_str()))
        .cloned()
        .collect::<Vec<_>>();
    atom_particles.sort_by(|a, b| {
        a.particle_order
            .unwrap_or(i64::MAX)
            .cmp(&b.particle_order.unwrap_or(i64::MAX))
            .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });
    atom_signature_key(&atom_particles)
}

fn particle_id_key(particle_ids: &[i64]) -> String {
    let mut ids = particle_ids.to_vec();
    ids.sort();
    ids.iter().map(|id| id.to_string()).collect::<Vec<_>>().join("+")
}

fn particle_id_key_from_particles<'a>(particles: impl Iterator<Item = &'a Particle>) -> String {
    let mut ids = particles.map(|particle| particle.id).collect::<Vec<_>>();
    ids.sort();
    ids.iter().map(|id| id.to_string()).collect::<Vec<_>>().join("+")
}

fn atom_particle_key_for_group(particles: &[Particle], atom_group: &[usize]) -> String {
    let ids = atom_group
        .iter()
        .map(|particle_index| particles[*particle_index].id)
        .collect::<Vec<_>>();
    particle_id_key(&ids)
}

fn atom_particle_key_for_atom(particles: &[Particle], atom: &Atom) -> String {
    let ids = particles
        .iter()
        .filter(|particle| particle.atom_id.as_deref() == Some(atom.atom_id.as_str()))
        .map(|particle| particle.id)
        .collect::<Vec<_>>();
    particle_id_key(&ids)
}

fn molecule_particle_key_for_groups(particles: &[Particle], atom_indexes: &[usize], atom_groups: &[Vec<usize>]) -> String {
    let ids = atom_indexes
        .iter()
        .flat_map(|atom_index| atom_groups[*atom_index].iter())
        .map(|particle_index| particles[*particle_index].id)
        .collect::<Vec<_>>();
    particle_id_key(&ids)
}

fn molecule_particle_key_for_atoms<'a>(particles: &[Particle], atoms: impl Iterator<Item = &'a Atom>) -> String {
    let atom_ids = atoms
        .map(|atom| atom.atom_id.as_str())
        .collect::<std::collections::HashSet<_>>();
    let ids = particles
        .iter()
        .filter(|particle| particle.atom_id.as_deref().is_some_and(|atom_id| atom_ids.contains(atom_id)))
        .map(|particle| particle.id)
        .collect::<Vec<_>>();
    particle_id_key(&ids)
}

fn molecule_signature_key_from_atom_tokens(tokens: &[String]) -> String {
    let mut sorted = tokens.to_vec();
    sorted.sort();
    sorted.join("|")
}

fn particle_signature_token(particle: &Particle) -> String {
    match particle.structural_config.as_deref() {
        Some(config) if !config.trim().is_empty() => format!("{}:{}", particle.family, config),
        _ => particle.family.clone(),
    }
}

fn clean_particle_token(particle: &Particle) -> String {
    match particle.structural_config.as_deref() {
        Some(config) if !config.trim().is_empty() => {
            format!("{}:{}", clean_particle_key(&particle.family), clean_particle_key(config))
        }
        _ => clean_particle_key(&particle.family),
    }
}

fn backfill_particles_from_regions(conn: &Connection) -> Result<(), String> {
    let mut stmt = conn
        .prepare(
            "SELECT id FROM regions
             WHERE geometry_json LIKE '%points%'
             AND id NOT IN (SELECT region_id FROM particles)",
        )
        .map_err(|e| e.to_string())?;
    let ids = stmt
        .query_map([], |row| row.get::<_, i64>(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    drop(stmt);

    for region_id in ids {
        upsert_particle_for_region_tx(conn, region_id, None, None)?;
    }

    let image_ids = conn
        .prepare("SELECT DISTINCT image_id FROM particles")
        .map_err(|e| e.to_string())?
        .query_map([], |row| row.get::<_, i64>(0))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    for image_id in image_ids {
        recalculate_molecules_tx(conn, image_id)?;
    }

    Ok(())
}

fn upsert_particle_for_region_tx(
    conn: &Connection,
    region_id: i64,
    family_override: Option<&str>,
    config_override: Option<&str>,
) -> Result<Particle, String> {
    let region = get_region(conn, region_id)?;
    let geometry = parse_geometry(&region.geometry_json)?;
    let metrics = geometry_metrics(&geometry.points);
    let labels = labels_for_region(conn, region_id)?;
    let family = clean_particle_key(
        family_override
            .or_else(|| labels.get("base_family").map(String::as_str))
            .unwrap_or(""),
    );
    let structural_config = config_override
        .map(clean_particle_key)
        .or_else(|| labels.get("structural_config").map(|v| v.trim().to_string()))
        .filter(|v| !v.is_empty());
    let visual_variant = labels
        .get("visual_variant")
        .map(|v| v.trim().to_string())
        .filter(|v| !v.is_empty());
    let points_json = serde_json::to_string(&geometry.points).map_err(|e| e.to_string())?;
    if family_override.is_some() && !family.is_empty() {
        upsert_label_value_tx(conn, region_id, "base_family", &family)?;
    }
    if config_override.is_some() {
        match structural_config.as_deref() {
            Some(config) if !config.trim().is_empty() => {
                upsert_label_value_tx(conn, region_id, "structural_config", config)?;
            }
            _ => delete_label_type_tx(conn, region_id, "structural_config")?,
        }
    }

    conn.execute(
        "INSERT INTO particles (
            region_id, image_id, family, color, points_json, anchor_x, anchor_y,
            bounds_x, bounds_y, bounds_w, bounds_h, length, angle, points_count,
            visual_variant, structural_config
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
        ON CONFLICT(region_id) DO UPDATE SET
            image_id = excluded.image_id,
            family = excluded.family,
            color = excluded.color,
            points_json = excluded.points_json,
            anchor_x = excluded.anchor_x,
            anchor_y = excluded.anchor_y,
            bounds_x = excluded.bounds_x,
            bounds_y = excluded.bounds_y,
            bounds_w = excluded.bounds_w,
            bounds_h = excluded.bounds_h,
            length = excluded.length,
            angle = excluded.angle,
            points_count = excluded.points_count,
            visual_variant = excluded.visual_variant,
            structural_config = excluded.structural_config,
            updated_at = datetime('now')",
        params![
            region.id,
            region.image_id,
            family,
            geometry.color,
            points_json,
            metrics.anchor_x,
            metrics.anchor_y,
            metrics.bounds_x,
            metrics.bounds_y,
            metrics.bounds_w,
            metrics.bounds_h,
            metrics.length,
            metrics.angle,
            metrics.points_count,
            visual_variant,
            structural_config,
        ],
    )
    .map_err(|e| e.to_string())?;

    get_particle_by_region(conn, region_id)
}

fn upsert_label_value_tx(
    conn: &Connection,
    region_id: i64,
    label_type: &str,
    value: &str,
) -> Result<(), String> {
    let existing_id = conn
        .query_row(
            "SELECT id FROM labels WHERE region_id = ?1 AND label_type = ?2 ORDER BY id ASC LIMIT 1",
            params![region_id, label_type],
            |row| row.get::<_, i64>(0),
        )
        .ok();

    if let Some(id) = existing_id {
        conn.execute(
            "UPDATE labels SET value = ?1, updated_at = datetime('now') WHERE id = ?2",
            params![value, id],
        )
        .map_err(|e| e.to_string())?;
    } else {
        create_label_tx(
            conn,
            &CreateLabel {
                region_id,
                label_type: label_type.to_string(),
                value: value.to_string(),
            },
        )?;
    }

    conn.execute(
        "DELETE FROM labels WHERE region_id = ?1 AND label_type = ?2 AND id NOT IN (
            SELECT id FROM labels WHERE region_id = ?1 AND label_type = ?2 ORDER BY id ASC LIMIT 1
        )",
        params![region_id, label_type],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn delete_label_type_tx(conn: &Connection, region_id: i64, label_type: &str) -> Result<(), String> {
    conn.execute(
        "DELETE FROM labels WHERE region_id = ?1 AND label_type = ?2",
        params![region_id, label_type],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

fn recalculate_molecules_tx(conn: &Connection, image_id: i64) -> Result<(), String> {
    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let signature = density_signature_for_image(conn, image_id, &particles)?;

    conn.execute("UPDATE particles SET molecule_id = NULL, atom_id = NULL, particle_order = NULL WHERE image_id = ?1", params![image_id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM atoms WHERE image_id = ?1", params![image_id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM molecules WHERE image_id = ?1", params![image_id])
        .map_err(|e| e.to_string())?;

    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let row_guides = atom_row_guides_for_image(conn, image_id)?;
    let row_overrides = atom_row_overrides_for_image(conn, image_id)?;
    let molecule_gap_threshold = calibrate_molecule_gap_threshold(&particles, &atom_groups, signature.macro_threshold, &row_guides, &row_overrides);
    let overrides = molecule_gap_overrides_for_image(conn, image_id)?;
    let atom_particle_order_patterns = atom_particle_order_patterns(conn)?;
    let molecule_atom_order_patterns = molecule_atom_order_patterns(conn)?;
    let atom_particle_order_overrides = atom_particle_order_overrides(conn, image_id)?;
    let molecule_atom_order_overrides = molecule_atom_order_overrides(conn, image_id)?;
    let molecule_groups = row_segmented_atom_groups(&particles, &atom_groups, molecule_gap_threshold, &overrides, &row_guides, &row_overrides);
    for (group_index, atom_group_indexes) in molecule_groups.iter().enumerate() {
        let mut molecule_particles = atom_group_indexes
            .iter()
            .flat_map(|atom_index| atom_groups[*atom_index].iter())
            .map(|particle_index| particles[*particle_index].clone())
            .collect::<Vec<_>>();
        sort_particles_for_molecule(&mut molecule_particles);

        let molecule_id = format!("img{image_id}-m{}", group_index + 1);
        let particle_count = molecule_particles.len() as i64;
        let atom_count = atom_group_indexes.len() as i64;
        let bounds = particle_bounds(&molecule_particles);

        conn.execute(
            "INSERT INTO molecules (
                molecule_id, image_id, particle_count, atom_count, centroid_x, centroid_y,
                bounds_x, bounds_y, bounds_w, bounds_h
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![
                molecule_id,
                image_id,
                particle_count,
                atom_count,
                bounds.centroid_x,
                bounds.centroid_y,
                bounds.x,
                bounds.y,
                bounds.w,
                bounds.h
            ],
        )
        .map_err(|e| e.to_string())?;

        let mut ordered_atoms = atom_group_indexes.clone();
        ordered_atoms.sort_by(|a, b| {
            let bounds_a = particle_bounds_for_indexes(&particles, &atom_groups[*a]);
            let bounds_b = particle_bounds_for_indexes(&particles, &atom_groups[*b]);
            bounds_a
                .y
                .partial_cmp(&bounds_b.y)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| bounds_a.x.partial_cmp(&bounds_b.x).unwrap_or(std::cmp::Ordering::Equal))
        });
        if !apply_molecule_atom_order_override(
            &mut ordered_atoms,
            &particles,
            &atom_groups,
            &molecule_atom_order_overrides,
        ) {
            apply_molecule_order_pattern(
                &mut ordered_atoms,
                &particles,
                &atom_groups,
                &molecule_atom_order_patterns,
            );
        }

        for (atom_index, atom_group_index) in ordered_atoms.iter().enumerate() {
            let mut atom_particles = atom_groups[*atom_group_index]
                .iter()
                .map(|index| particles[*index].clone())
                .collect::<Vec<_>>();
            sort_particles_for_molecule(&mut atom_particles);
            if !apply_atom_particle_order_override(&mut atom_particles, &atom_particle_order_overrides) {
                apply_atom_order_pattern(&mut atom_particles, &atom_particle_order_patterns);
            }

            let atom_id = format!("{molecule_id}-a{}", atom_index + 1);
            let atom_bounds = particle_bounds(&atom_particles);
            // The V2 -> V3 crosswalk is durable provenance, not derived geometry.
            // Recalculation may rebuild atoms, but it must not erase the historical
            // identifier that lets reviewers trace a canonical V3 atom back to V2.
            let legacy_particle_id = conn
                .query_row(
                    "SELECT legacy_id FROM nomenclature_id_map
                     WHERE entity_type = 'atom' AND canonical_id = ?1
                     LIMIT 1",
                    params![atom_id],
                    |row| row.get::<_, String>(0),
                )
                .optional()
                .map_err(|error| format!("Failed to preserve atom provenance for {atom_id}: {error}"))?;
            conn.execute(
                "INSERT INTO atoms (
                    atom_id, legacy_particle_id, molecule_id, image_id, particle_count, atom_order,
                    source_index, centroid_x, centroid_y, bounds_x, bounds_y, bounds_w, bounds_h
                 ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
                params![
                    atom_id,
                    legacy_particle_id,
                    molecule_id,
                    image_id,
                    atom_particles.len() as i64,
                    atom_index as i64 + 1,
                    *atom_group_index as i64 + 1,
                    atom_bounds.centroid_x,
                    atom_bounds.centroid_y,
                    atom_bounds.x,
                    atom_bounds.y,
                    atom_bounds.w,
                    atom_bounds.h
                ],
            )
            .map_err(|e| e.to_string())?;

            for (particle_index, particle) in atom_particles.iter().enumerate() {
                conn.execute(
                    "UPDATE particles SET molecule_id = ?1, atom_id = ?2, particle_order = ?3, updated_at = datetime('now') WHERE id = ?4",
                    params![molecule_id, atom_id, particle_index as i64 + 1, particle.id],
                )
                .map_err(|e| e.to_string())?;
            }
        }

        for particle in molecule_particles.iter() {
            conn.execute(
                "UPDATE particles SET molecule_id = ?1, updated_at = datetime('now') WHERE id = ?2",
                params![molecule_id, particle.id],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

#[derive(Debug, Clone, Copy)]
struct DensitySignature {
    micro_threshold: f64,
    macro_threshold: f64,
    training_particle_count: i64,
    gap_count: i64,
    gap_centers: [f64; 3],
}

#[derive(Debug)]
struct ParticleBounds {
    x: f64,
    y: f64,
    w: f64,
    h: f64,
    centroid_x: f64,
    centroid_y: f64,
}

impl ParticleBounds {
    fn into_rect_box(self) -> RectBox {
        RectBox {
            x: self.x,
            y: self.y,
            w: self.w,
            h: self.h,
        }
    }
}

#[derive(Debug)]
struct IndexDisjointSet {
    parent: Vec<usize>,
}

impl IndexDisjointSet {
    fn new(size: usize) -> Self {
        Self {
            parent: (0..size).collect(),
        }
    }

    fn find(&mut self, index: usize) -> usize {
        let parent = self.parent[index];
        if parent != index {
            let root = self.find(parent);
            self.parent[index] = root;
        }
        self.parent[index]
    }

    fn union(&mut self, left: usize, right: usize) {
        let left_root = self.find(left);
        let right_root = self.find(right);
        if left_root != right_root {
            self.parent[right_root] = left_root;
        }
    }
}

fn density_signature_for_image(conn: &Connection, image_id: i64, particles: &[Particle]) -> Result<DensitySignature, String> {
    let training_particles = training_particles_for_signature(conn, image_id, particles)?;
    Ok(calibrate_density_signature(&training_particles))
}

fn cluster_explanation_for_image(
    conn: &Connection,
    image_id: i64,
    particles: &[Particle],
) -> Result<ClusterExplanation, String> {
    let clustered_particles = particles
        .iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .cloned()
        .collect::<Vec<_>>();
    let signature = density_signature_for_image(conn, image_id, &clustered_particles)?;
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(
        &clustered_particles,
        contact_particle_groups(&clustered_particles),
        &merge_patterns,
    );
    let row_guides = atom_row_guides_for_image(conn, image_id)?;
    let row_overrides = atom_row_overrides_for_image(conn, image_id)?;
    let molecule_gap_threshold = calibrate_molecule_gap_threshold(&clustered_particles, &atom_groups, signature.macro_threshold, &row_guides, &row_overrides);
    let links = cluster_links_for_particles(&clustered_particles, signature.micro_threshold, molecule_gap_threshold);
    let overrides = molecule_gap_overrides_for_image(conn, image_id)?;
    let molecule_gaps = molecule_gap_audits(&clustered_particles, &atom_groups, molecule_gap_threshold, &overrides, &row_guides, &row_overrides);
    let atom_rows = atom_row_audits(&clustered_particles, &atom_groups, &row_guides, &row_overrides);

    Ok(ClusterExplanation {
        micro_threshold: signature.micro_threshold,
        macro_threshold: molecule_gap_threshold,
        training_particle_count: signature.training_particle_count,
        gap_count: signature.gap_count,
        gap_centers: signature.gap_centers.to_vec(),
        links,
        molecule_gaps,
        atom_rows,
    })
}

fn training_particles_for_signature(conn: &Connection, image_id: i64, particles: &[Particle]) -> Result<Vec<Particle>, String> {
    let page_three_id = conn
        .query_row("SELECT id FROM images WHERE name = 'page-003.jpg' LIMIT 1", [], |row| row.get::<_, i64>(0))
        .ok();

    if let Some(training_image_id) = page_three_id {
        if training_image_id != image_id {
            let page_three_particles = list_particles_for_image(conn, training_image_id)?
                .into_iter()
                .filter(|particle| !particle.family.trim().is_empty())
                .collect::<Vec<_>>();
            if page_three_particles.len() >= 50 {
                return Ok(page_three_particles);
            }
        }
    }

    Ok(particles.to_vec())
}

fn calibrate_density_signature(particles: &[Particle]) -> DensitySignature {
    let mut gaps = same_row_horizontal_gaps(particles)
        .into_iter()
        .filter(|gap| *gap >= 0.0 && *gap <= 120.0)
        .collect::<Vec<_>>();
    gaps.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    if gaps.len() < 12 {
        return DensitySignature {
            micro_threshold: 20.0,
            macro_threshold: 75.0,
            training_particle_count: particles.len() as i64,
            gap_count: gaps.len() as i64,
            gap_centers: [15.0, 57.0, 96.0],
        };
    }

    let centers = kmeans_1d(&gaps, [15.0, 57.0, 96.0]);
    let micro_threshold = ((centers[0] + centers[1]) / 2.0).clamp(18.0, 44.0);
    let macro_threshold = ((centers[1] + centers[2]) / 2.0).clamp(micro_threshold + 10.0, 95.0);

    DensitySignature {
        micro_threshold,
        macro_threshold,
        training_particle_count: particles.len() as i64,
        gap_count: gaps.len() as i64,
        gap_centers: centers,
    }
}

fn same_row_horizontal_gaps(particles: &[Particle]) -> Vec<f64> {
    let mut row_particles = particles.to_vec();
    row_particles.sort_by(|a, b| {
        a.anchor_y
            .partial_cmp(&b.anchor_y)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });

    let mut rows: Vec<(f64, Vec<Particle>)> = Vec::new();
    for particle in row_particles {
        if let Some((row_y, row)) = rows.iter_mut().find(|(row_y, _)| (particle.anchor_y - *row_y).abs() <= 8.0) {
            row.push(particle);
            *row_y = row.iter().map(|item| item.anchor_y).sum::<f64>() / row.len() as f64;
        } else {
            rows.push((particle.anchor_y, vec![particle]));
        }
    }

    let mut gaps = Vec::new();
    for (_, row) in rows.iter_mut() {
        row.sort_by(|a, b| {
            a.bounds_x
                .partial_cmp(&b.bounds_x)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
        });

        for pair in row.windows(2) {
            let gap = pair[1].bounds_x - (pair[0].bounds_x + pair[0].bounds_w);
            if gap >= 0.0 {
                gaps.push(gap);
            }
        }
    }

    gaps
}

fn kmeans_1d(values: &[f64], initial: [f64; 3]) -> [f64; 3] {
    let mut centers = initial;
    for _ in 0..100 {
        let mut clusters = [Vec::<f64>::new(), Vec::<f64>::new(), Vec::<f64>::new()];
        for value in values {
            let index = (0..centers.len())
                .min_by(|a, b| {
                    (value - centers[*a])
                        .abs()
                        .partial_cmp(&(value - centers[*b]).abs())
                        .unwrap_or(std::cmp::Ordering::Equal)
                })
                .unwrap_or(0);
            clusters[index].push(*value);
        }

        let next = [
            cluster_center(&clusters[0], centers[0]),
            cluster_center(&clusters[1], centers[1]),
            cluster_center(&clusters[2], centers[2]),
        ];

        if centers
            .iter()
            .zip(next.iter())
            .all(|(current, next)| (current - next).abs() < 0.001)
        {
            break;
        }
        centers = next;
    }

    centers.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    centers
}

fn cluster_center(values: &[f64], fallback: f64) -> f64 {
    if values.is_empty() {
        fallback
    } else {
        values.iter().sum::<f64>() / values.len() as f64
    }
}

fn particle_bounds(particles: &[Particle]) -> ParticleBounds {
    let particle_count = particles.len().max(1) as f64;
    let min_x = particles.iter().map(|a| a.bounds_x).fold(f64::INFINITY, f64::min);
    let min_y = particles.iter().map(|a| a.bounds_y).fold(f64::INFINITY, f64::min);
    let max_x = particles.iter().map(|a| a.bounds_x + a.bounds_w).fold(f64::NEG_INFINITY, f64::max);
    let max_y = particles.iter().map(|a| a.bounds_y + a.bounds_h).fold(f64::NEG_INFINITY, f64::max);
    let centroid_x = particles.iter().map(|a| a.anchor_x).sum::<f64>() / particle_count;
    let centroid_y = particles.iter().map(|a| a.anchor_y).sum::<f64>() / particle_count;

    ParticleBounds {
        x: if min_x.is_finite() { min_x } else { 0.0 },
        y: if min_y.is_finite() { min_y } else { 0.0 },
        w: if min_x.is_finite() && max_x.is_finite() { max_x - min_x } else { 0.0 },
        h: if min_y.is_finite() && max_y.is_finite() { max_y - min_y } else { 0.0 },
        centroid_x,
        centroid_y,
    }
}

fn sort_particles_for_molecule(particles: &mut [Particle]) {
    let snapshot = particles.to_vec();
    particles.sort_by(|a, b| {
        let a_is_closing = is_closing_idk_particle(a, &snapshot);
        let b_is_closing = is_closing_idk_particle(b, &snapshot);

        a_is_closing
            .cmp(&b_is_closing)
            .then_with(|| a.anchor_x.partial_cmp(&b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });
}

fn is_closing_idk_particle(particle: &Particle, molecule_particles: &[Particle]) -> bool {
    if particle.family.trim() != "idk" || molecule_particles.len() <= 1 {
        return false;
    }

    let overlaps_neighbor = molecule_particles.iter().any(|other| {
        other.id != particle.id
            && horizontal_overlap(particle, other) > 0.0
            && particle.bounds_y <= other.bounds_y + 8.0
    });
    if !overlaps_neighbor {
        return false;
    }

    let points = parse_particle_points(&particle.points_json);
    let has_backward_return = match (points.first(), points.last()) {
        (Some(first), Some(last)) => last.x < first.x || highest_point_x(&points) < first.x,
        _ => false,
    };
    let roof_overlap = molecule_particles.iter().any(|other| {
        other.id != particle.id
            && horizontal_overlap(particle, other) > 0.0
            && particle.bounds_y < other.bounds_y
    });

    has_backward_return || roof_overlap
}

fn parse_particle_points(raw: &str) -> Vec<Point> {
    if let Ok(points) = serde_json::from_str::<Vec<Point>>(raw) {
        return points;
    }

    serde_json::from_str::<serde_json::Value>(raw)
        .ok()
        .and_then(|value| value.get("points").cloned())
        .and_then(|value| serde_json::from_value::<Vec<Point>>(value).ok())
        .unwrap_or_default()
}

fn highest_point_x(points: &[Point]) -> f64 {
    points
        .iter()
        .min_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal))
        .map(|point| point.x)
        .unwrap_or(0.0)
}

fn horizontal_overlap(a: &Particle, b: &Particle) -> f64 {
    let left = a.bounds_x.max(b.bounds_x);
    let right = (a.bounds_x + a.bounds_w).min(b.bounds_x + b.bounds_w);
    (right - left).max(0.0)
}

fn contact_particle_groups(particles: &[Particle]) -> Vec<Vec<usize>> {
    let mut remaining = (0..particles.len()).collect::<std::collections::BTreeSet<_>>();
    let mut groups = Vec::new();

    while let Some(first) = remaining.iter().next().copied() {
        remaining.remove(&first);
        let mut queue = vec![first];
        let mut group = Vec::new();

        while let Some(index) = queue.pop() {
            group.push(index);
            let neighbors = remaining.iter().copied().collect::<Vec<_>>();
            for other in neighbors {
                if should_contact_particles(particles, index, other) {
                    remaining.remove(&other);
                    queue.push(other);
                }
            }
        }

        groups.push(group);
    }

    groups.sort_by(|a, b| {
        let bounds_a = particle_bounds_for_indexes(particles, a);
        let bounds_b = particle_bounds_for_indexes(particles, b);
        bounds_a
            .y
            .partial_cmp(&bounds_b.y)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then_with(|| bounds_a.x.partial_cmp(&bounds_b.x).unwrap_or(std::cmp::Ordering::Equal))
    });
    groups
}

fn should_contact_particles(
    particles: &[Particle],
    left: usize,
    right: usize,
) -> bool {
    let a = &particles[left];
    let b = &particles[right];
    particle_contact_gap(a, b) <= ATOM_CONTACT_DISTANCE
}

fn particle_bounds_for_indexes(particles: &[Particle], indexes: &[usize]) -> ParticleBounds {
    let selected = indexes.iter().map(|index| particles[*index].clone()).collect::<Vec<_>>();
    particle_bounds(&selected)
}

#[derive(Debug, Clone)]
struct AtomSpan {
    index: usize,
    x: f64,
    y: f64,
    w: f64,
    h: f64,
    baseline_y: f64,
    body_y: f64,
    bottom_y: f64,
}

#[derive(Debug, Clone)]
struct AtomRow {
    row_index: i64,
    y: f64,
    top_y: f64,
    bottom_y: f64,
    atoms: Vec<AtomSpan>,
}

#[derive(Debug, Clone, Copy)]
struct RowBand {
    row_index: i64,
    top_y: f64,
    y: f64,
    bottom_y: f64,
}

#[derive(Debug, Default)]
struct GapOverrides {
    by_index: HashMap<(i64, i64), String>,
    by_key: HashMap<(String, String), String>,
}

#[derive(Debug, Clone, Copy)]
pub struct AtomRowGuideDraft {
    pub row_index: i64,
    pub top_y: f64,
    pub y: f64,
    pub bottom_y: f64,
}

#[derive(Debug, Clone)]
pub struct AtomParticleOrderDraft {
    pub atom_id: String,
    pub particle_ids: Vec<i64>,
}

#[derive(Debug, Clone)]
pub struct MoleculeAtomOrderDraft {
    pub molecule_id: String,
    pub atom_ids: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct MoleculeGapOverrideDraft {
    pub left_atom_index: i64,
    pub right_atom_index: i64,
    pub decision: String,
}

#[derive(Debug, Clone)]
pub struct AtomRowOverrideDraft {
    pub atom_index: i64,
    pub atom_key: Option<String>,
    pub row_index: Option<i64>,
}

fn row_segmented_atom_groups(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    max_horizontal_gap: f64,
    overrides: &GapOverrides,
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> Vec<Vec<usize>> {
    let mut groups = Vec::new();
    let manual_rows = !row_guides.is_empty();
    for mut row in atom_rows_with_guides(particles, atoms, row_guides, row_overrides) {
        row.atoms.sort_by(|a, b| {
            a.x.partial_cmp(&b.x)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| a.baseline_y.partial_cmp(&b.baseline_y).unwrap_or(std::cmp::Ordering::Equal))
        });

        let mut row_groups = Vec::new();
        let mut current = Vec::new();
        for index in 0..row.atoms.len() {
            let atom = row.atoms[index].clone();
            if index > 0 {
                let prev = &row.atoms[index - 1];
                let prev_gap = atom.x - (prev.x + prev.w);
                let next_gap = row
                    .atoms
                    .get(index + 1)
                    .map(|next| next.x - (atom.x + atom.w));
                let decision = molecule_boundary_decision(
                    prev_gap,
                    next_gap,
                    max_horizontal_gap,
                    (prev.baseline_y - atom.baseline_y).abs(),
                    override_for_gap(overrides, particles, atoms, prev.index, atom.index),
                    manual_rows,
                );
                if decision.cut && !current.is_empty() {
                    row_groups.push(current);
                    current = Vec::new();
                }
            }
            current.push(atom.index);
        }
        if !current.is_empty() {
            row_groups.push(current);
        }
        groups.extend(merge_nonisolated_singletons(row_groups, &row.atoms, max_horizontal_gap));
    }

    groups.sort_by(|a, b| {
        let bounds_a = particle_bounds_for_indexes(particles, &atoms[a[0]]);
        let bounds_b = particle_bounds_for_indexes(particles, &atoms[b[0]]);
        bounds_a
            .y
            .partial_cmp(&bounds_b.y)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then_with(|| bounds_a.x.partial_cmp(&bounds_b.x).unwrap_or(std::cmp::Ordering::Equal))
    });
    groups
}

fn merge_nonisolated_singletons(
    row_groups: Vec<Vec<usize>>,
    row_atoms: &[AtomSpan],
    max_horizontal_gap: f64,
) -> Vec<Vec<usize>> {
    if row_groups.len() <= 1 {
        return row_groups;
    }

    let mut groups = row_groups;
    let spans = row_atoms
        .iter()
        .map(|atom| (atom.index, atom.clone()))
        .collect::<std::collections::HashMap<_, _>>();
    let mut index = 0;
    while index < groups.len() {
        if groups[index].len() != 1 {
            index += 1;
            continue;
        }

        let left_gap = if index > 0 {
            group_gap(&groups[index - 1], &groups[index], &spans)
        } else {
            None
        };
        let right_gap = if index + 1 < groups.len() {
            group_gap(&groups[index], &groups[index + 1], &spans)
        } else {
            None
        };
        if singleton_is_isolated(left_gap, right_gap, max_horizontal_gap) {
            index += 1;
            continue;
        }

        match (left_gap, right_gap) {
            (Some(left), Some(right)) if right < left * 0.82 => {
                let atom = groups.remove(index)[0];
                groups[index].insert(0, atom);
            }
            (Some(_), _) if index > 0 => {
                let atom = groups.remove(index)[0];
                groups[index - 1].push(atom);
                index = index.saturating_sub(1);
            }
            (_, Some(_)) if index + 1 < groups.len() => {
                let atom = groups.remove(index)[0];
                groups[index].insert(0, atom);
            }
            _ => index += 1,
        }
    }

    groups
}

fn singleton_is_isolated(left_gap: Option<f64>, right_gap: Option<f64>, max_horizontal_gap: f64) -> bool {
    let isolation_gap = max_horizontal_gap * 1.25;
    match (left_gap, right_gap) {
        (Some(left), Some(right)) => left > isolation_gap && right > isolation_gap,
        (Some(gap), None) | (None, Some(gap)) => gap > isolation_gap,
        (None, None) => true,
    }
}

fn group_gap(
    left_group: &[usize],
    right_group: &[usize],
    spans: &std::collections::HashMap<usize, AtomSpan>,
) -> Option<f64> {
    let left_max = left_group
        .iter()
        .filter_map(|index| spans.get(index))
        .map(|span| span.x + span.w)
        .fold(f64::NEG_INFINITY, f64::max);
    let right_min = right_group
        .iter()
        .filter_map(|index| spans.get(index))
        .map(|span| span.x)
        .fold(f64::INFINITY, f64::min);

    if left_max.is_finite() && right_min.is_finite() {
        Some((right_min - left_max).max(0.0))
    } else {
        None
    }
}

#[derive(Debug, Clone)]
struct MoleculeBoundaryDecision {
    cut: bool,
    reason: String,
}

fn molecule_boundary_decision(
    prev_gap: f64,
    next_gap: Option<f64>,
    max_horizontal_gap: f64,
    baseline_delta: f64,
    override_decision: Option<&str>,
    manual_row: bool,
) -> MoleculeBoundaryDecision {
    if let Some(decision) = override_decision {
        return MoleculeBoundaryDecision {
            cut: decision == "cut",
            reason: format!("manual: {}", if decision == "cut" { "corte" } else { "union" }),
        };
    }

    if !manual_row && baseline_delta > atom_row_threshold_delta() {
        return MoleculeBoundaryDecision {
            cut: true,
            reason: "corte: salto vertical entre renglones".to_string(),
        };
    }

    let prev_gap = prev_gap.max(0.0);
    let hard_cut_gap = max_horizontal_gap * 1.15;
    if prev_gap > hard_cut_gap {
        return MoleculeBoundaryDecision {
            cut: true,
            reason: "corte: gap supera umbral".to_string(),
        };
    }

    if let Some(next_gap) = next_gap {
        let next_gap = next_gap.max(0.0);
        if next_gap > 0.0
            && prev_gap > max_horizontal_gap * 0.78
            && prev_gap > next_gap * 1.85
        {
            return MoleculeBoundaryDecision {
                cut: true,
                reason: "corte: gap local dominante".to_string(),
            };
        }
    }

    MoleculeBoundaryDecision {
        cut: false,
        reason: "une: gap dentro del umbral".to_string(),
    }
}

fn atom_row_threshold_delta() -> f64 {
    42.0
}

fn molecule_gap_overrides_for_image(
    conn: &Connection,
    image_id: i64,
) -> Result<GapOverrides, String> {
    let mut stmt = conn
        .prepare(
            "SELECT left_atom_index, right_atom_index, left_atom_key, right_atom_key, decision
             FROM molecule_gap_overrides
             WHERE image_id = ?1",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![image_id], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, i64>(1)?,
                row.get::<_, Option<String>>(2)?,
                row.get::<_, Option<String>>(3)?,
                row.get::<_, String>(4)?,
            ))
        })
        .map_err(|e| e.to_string())?;

    let mut overrides = GapOverrides::default();
    for row in rows {
        let (left, right, left_key, right_key, decision) = row.map_err(|e| e.to_string())?;
        overrides.by_index.insert((left, right), decision.clone());
        if let (Some(left_key), Some(right_key)) = (left_key, right_key) {
            overrides.by_key.insert((left_key, right_key), decision);
        }
    }
    Ok(overrides)
}

fn atom_row_overrides_for_image(conn: &Connection, image_id: i64) -> Result<HashMap<String, i64>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT atom_key, row_index
             FROM atom_row_overrides
             WHERE image_id = ?1",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![image_id], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, i64>(1)?))
        })
        .map_err(|e| e.to_string())?;

    let mut overrides = HashMap::new();
    for row in rows {
        let (key, row_index) = row.map_err(|e| e.to_string())?;
        overrides.insert(key, row_index);
    }
    Ok(overrides)
}

fn atom_row_guides_for_image(conn: &Connection, image_id: i64) -> Result<Vec<RowBand>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT row_index, top_y, y, bottom_y
             FROM atom_row_guides
             WHERE image_id = ?1
             ORDER BY row_index ASC",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![image_id], |row| {
            let row_index = row.get::<_, i64>(0)?;
            let y = row.get::<_, f64>(2)?;
            let top_y = row.get::<_, Option<f64>>(1)?;
            let bottom_y = row.get::<_, Option<f64>>(3)?.unwrap_or(y + 14.0);
            Ok((row_index, top_y, y, bottom_y))
        })
        .map_err(|e| e.to_string())?;

    let mut guides = Vec::new();
    for (idx, row) in rows.enumerate() {
        let (row_index, top_y_opt, y, bottom_y) = row.map_err(|e| e.to_string())?;
        let top_y = if idx == 0 {
            top_y_opt.unwrap_or(y - 28.0)
        } else {
            top_y_opt.unwrap_or(y - 14.0)
        };
        let guide = RowBand { row_index, top_y, y, bottom_y };
        if guide.y.is_finite() && guide.top_y.is_finite() && guide.bottom_y.is_finite() {
            guides.push(guide);
        }
    }
    glue_row_band_tops_to_previous_bottoms(&mut guides);
    Ok(guides)
}

fn override_for_gap<'a>(
    overrides: &'a GapOverrides,
    particles: &[Particle],
    atoms: &[Vec<usize>],
    left_index: usize,
    right_index: usize,
) -> Option<&'a str> {
    overrides
        .by_key
        .get(&(
            atom_key_for_group(particles, &atoms[left_index]),
            atom_key_for_group(particles, &atoms[right_index]),
        ))
        .or_else(|| {
            overrides
                .by_index
                .get(&(left_index as i64 + 1, right_index as i64 + 1))
        })
        .map(|value| value.as_str())
}

fn current_atom_key_pair(
    conn: &Connection,
    image_id: i64,
    left_atom_index: i64,
    right_atom_index: i64,
) -> Result<Option<(String, String)>, String> {
    let left = current_atom_key(conn, image_id, left_atom_index)?;
    let right = current_atom_key(conn, image_id, right_atom_index)?;
    Ok(match (left, right) {
        (Some(left), Some(right)) => Some((left, right)),
        _ => None,
    })
}

fn current_atom_key(conn: &Connection, image_id: i64, atom_index: i64) -> Result<Option<String>, String> {
    if atom_index < 1 {
        return Ok(None);
    }
    let particles = list_particles_for_image(conn, image_id)?
        .into_iter()
        .filter(|particle| !particle.family.trim().is_empty())
        .collect::<Vec<_>>();
    let merge_patterns = atom_merge_patterns(conn)?;
    let atom_groups = merge_atom_groups_by_patterns(&particles, contact_particle_groups(&particles), &merge_patterns);
    let index = atom_index as usize - 1;
    Ok(atom_groups
        .get(index)
        .map(|atom| atom_key_for_group(&particles, atom)))
}

fn atom_key_for_group(particles: &[Particle], atom: &[usize]) -> String {
    let mut ids = atom
        .iter()
        .filter_map(|index| particles.get(*index))
        .map(|particle| particle.id)
        .collect::<Vec<_>>();
    ids.sort_unstable();
    ids.iter()
        .map(|id| id.to_string())
        .collect::<Vec<_>>()
        .join(",")
}

fn molecule_gap_audits(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    max_horizontal_gap: f64,
    overrides: &GapOverrides,
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> Vec<MoleculeGapAudit> {
    let mut audits = Vec::new();
    let manual_rows = !row_guides.is_empty();
    for mut row in atom_rows_with_guides(particles, atoms, row_guides, row_overrides) {
        row.atoms.sort_by(|a, b| {
            a.x.partial_cmp(&b.x)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| a.baseline_y.partial_cmp(&b.baseline_y).unwrap_or(std::cmp::Ordering::Equal))
        });

        for index in 1..row.atoms.len() {
            let left = &row.atoms[index - 1];
            let right = &row.atoms[index];
            let gap = (right.x - (left.x + left.w)).max(0.0);
            let next_gap = row
                .atoms
                .get(index + 1)
                .map(|next| (next.x - (right.x + right.w)).max(0.0));
            let override_decision = override_for_gap(overrides, particles, atoms, left.index, right.index);
            let baseline_y = if manual_rows {
                row.bottom_y
            } else {
                (left.baseline_y + right.baseline_y) / 2.0
            };
            let baseline_delta = (left.baseline_y - right.baseline_y).abs();
            let decision = molecule_boundary_decision(gap, next_gap, max_horizontal_gap, baseline_delta, override_decision, manual_rows);

            audits.push(MoleculeGapAudit {
                row_index: row.row_index,
                left_atom_index: left.index as i64 + 1,
                right_atom_index: right.index as i64 + 1,
                gap,
                threshold: max_horizontal_gap,
                next_gap,
                baseline_y,
                baseline_delta,
                cut: decision.cut,
                override_decision: override_decision.map(|value| value.to_string()),
                reason: decision.reason,
                x: left.x + left.w + gap / 2.0,
                y: baseline_y,
                left_edge: left.x + left.w,
                right_edge: right.x,
            });
        }
    }

    audits
}

fn atom_row_audits(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> Vec<AtomRowAudit> {
    atom_rows_with_guides(particles, atoms, row_guides, row_overrides)
        .into_iter()
        .map(|mut row| {
            row.atoms.sort_by(|a, b| {
                a.x.partial_cmp(&b.x)
                    .unwrap_or(std::cmp::Ordering::Equal)
                    .then_with(|| a.baseline_y.partial_cmp(&b.baseline_y).unwrap_or(std::cmp::Ordering::Equal))
            });
            let row_bounds = atom_row_bounds(&row);
            AtomRowAudit {
                row_index: row.row_index,
                baseline_y: row.y,
                display_y: atom_row_display_y(&row),
                top_y: row.top_y,
                bottom_y: row.bottom_y,
                x: row_bounds.x,
                y: row_bounds.y,
                w: row_bounds.w,
                h: row_bounds.h,
                atom_count: row.atoms.len() as i64,
                atoms: row
                    .atoms
                    .into_iter()
                    .map(|atom| AtomPlacementAudit {
                        source_index: atom.index as i64 + 1,
                        atom_key: atom_key_for_group(particles, &atoms[atom.index]),
                        row_override: row_overrides
                            .get(&atom_key_for_group(particles, &atoms[atom.index]))
                            .copied(),
                        x: atom.x,
                        y: atom.y,
                        w: atom.w,
                        h: atom.h,
                        baseline_y: atom.baseline_y,
                        body_y: atom.body_y,
                        bottom_y: atom.bottom_y,
                    })
                    .collect(),
            }
        })
        .collect()
}

fn atom_row_display_y(row: &AtomRow) -> f64 {
    row.y
}

fn calibrate_molecule_gap_threshold(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    fallback: f64,
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> f64 {
    let mut gaps = Vec::new();
    for mut row in atom_rows_with_guides(particles, atoms, row_guides, row_overrides) {
        row.atoms.sort_by(|a, b| a.x.partial_cmp(&b.x).unwrap_or(std::cmp::Ordering::Equal));
        for pair in row.atoms.windows(2) {
            let gap = pair[1].x - (pair[0].x + pair[0].w);
            if gap >= 0.0 && gap <= 140.0 {
                gaps.push(gap);
            }
        }
    }
    gaps.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    if gaps.len() < 4 {
        return fallback.clamp(30.0, 44.0);
    }

    let centers = kmeans_1d(&gaps, [9.0, 32.0, 62.0]);
    ((centers[0] + centers[1]) / 2.0).clamp(28.0, 44.0)
}

fn atom_rows(particles: &[Particle], atoms: &[Vec<usize>]) -> Vec<AtomRow> {
    let threshold = atom_row_threshold(particles);
    let mut spans = atoms
        .iter()
        .enumerate()
        .map(|(index, atom)| atom_span(particles, atom, index))
        .collect::<Vec<_>>();
    spans.sort_by(|a, b| {
        a.baseline_y
            .partial_cmp(&b.baseline_y)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then_with(|| a.x.partial_cmp(&b.x).unwrap_or(std::cmp::Ordering::Equal))
    });

    let mut rows = if let Some(rows) = seeded_atom_rows(particles, &spans, threshold) {
        rows
    } else {
        fallback_atom_rows(spans, threshold)
    };

    if !rows.is_empty() {
        rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
        let distance = rows[0].y - rows[0].top_y;
        rows[0].top_y = rows[0].y - distance * 2.0;
        assign_atom_row_indexes(&mut rows, 1);
    }

    rows
}

fn atom_rows_with_guides(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> Vec<AtomRow> {
    if row_guides.is_empty() {
        atom_rows(particles, atoms)
    } else {
        guided_atom_rows_from_atoms(particles, atoms, row_guides, row_overrides)
    }
}

fn guided_atom_rows_from_atoms(
    particles: &[Particle],
    atoms: &[Vec<usize>],
    row_guides: &[RowBand],
    row_overrides: &HashMap<String, i64>,
) -> Vec<AtomRow> {
    let threshold = atom_row_threshold(particles);
    let mut guides = row_guides
        .iter()
        .copied()
        .filter(|guide| guide.top_y.is_finite() && guide.bottom_y.is_finite() && guide.top_y < guide.bottom_y)
        .collect::<Vec<_>>();
    guides.sort_by(|a, b| a.top_y.partial_cmp(&b.top_y).unwrap_or(std::cmp::Ordering::Equal));
    if guides.is_empty() {
        return atom_rows(particles, atoms);
    }

    let mut rows = guides
        .iter()
        .map(|guide| AtomRow {
            row_index: guide.row_index,
            y: (guide.top_y + guide.bottom_y) / 2.0,
            top_y: guide.top_y,
            bottom_y: guide.bottom_y,
            atoms: Vec::new(),
        })
        .collect::<Vec<_>>();
    let mut overflow_spans = Vec::new();
    let mut deferred_row_overrides = Vec::new();

    for (index, atom) in atoms.iter().enumerate() {
        let span = atom_span(particles, atom, index);
        let atom_key = atom_key_for_group(particles, atom);
        if let Some(target_row_index) = row_overrides.get(&atom_key).copied() {
            if let Some(row) = rows.iter_mut().find(|row| row.row_index == target_row_index) {
                row.atoms.push(span);
            } else {
                deferred_row_overrides.push((span, target_row_index));
            }
        } else if let Some(row_index) = containing_manual_row_band(&guides, &span) {
            rows[row_index].atoms.push(span);
        } else {
            overflow_spans.push(span);
        }
    }

    if !overflow_spans.is_empty() {
        overflow_spans.sort_by(|a, b| {
            a.baseline_y
                .partial_cmp(&b.baseline_y)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| a.x.partial_cmp(&b.x).unwrap_or(std::cmp::Ordering::Equal))
        });
        let next_row_index = rows.iter().map(|row| row.row_index).max().unwrap_or(0) + 1;
        let mut overflow_rows = fallback_atom_rows(overflow_spans, threshold);
        assign_atom_row_indexes(&mut overflow_rows, next_row_index);
        rows.extend(overflow_rows);
    }

    for (span, target_row_index) in deferred_row_overrides {
        if let Some(row) = rows.iter_mut().find(|row| row.row_index == target_row_index) {
            row.atoms.push(span);
        } else {
            rows.push(AtomRow {
                row_index: target_row_index,
                y: span.baseline_y,
                top_y: span.y,
                bottom_y: span.y + span.h,
                atoms: vec![span],
            });
        }
    }

    rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    glue_atom_row_bands(&mut rows);
    rows
}

fn containing_manual_row_band(guides: &[RowBand], span: &AtomSpan) -> Option<usize> {
    let y = atom_manual_row_y(span);
    guides
        .iter()
        .enumerate()
        .find(|(_, guide)| y >= guide.top_y && y <= guide.bottom_y)
        .map(|(index, _)| index)
}

fn atom_manual_row_y(span: &AtomSpan) -> f64 {
    if span.body_y.is_finite() {
        span.body_y
    } else if span.baseline_y.is_finite() {
        span.baseline_y
    } else {
        span.y + span.h / 2.0
    }
}

fn glue_atom_row_bands(rows: &mut [AtomRow]) {
    rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    for index in 1..rows.len() {
        rows[index].top_y = rows[index - 1].bottom_y;
    }
}

fn glue_row_band_tops_to_previous_bottoms(bands: &mut [RowBand]) {
    bands.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    for index in 1..bands.len() {
        bands[index].top_y = bands[index - 1].bottom_y;
    }
}

fn strict_row_anchor_indexes_for_atom(particles: &[Particle], atom: &[usize]) -> Option<Vec<usize>> {
    if let Some(indexes) = initial_a_row_anchor_indexes(particles, atom) {
        return Some(indexes);
    }

    if let Some(indexes) = e_f_row_anchor_indexes(particles, atom) {
        return Some(indexes);
    }

    let indexes = atom
        .iter()
        .copied()
        .filter(|particle_index| is_exact_row_anchor_particle(particles, *particle_index, atom))
        .collect::<Vec<_>>();
    if indexes.is_empty() {
        None
    } else {
        Some(indexes)
    }
}

fn is_exact_row_anchor_particle(particles: &[Particle], particle_index: usize, atom: &[usize]) -> bool {
    let token = clean_particle_token(&particles[particle_index]);
    initial_a_row_anchor_indexes(particles, atom)
        .map(|indexes| indexes.contains(&particle_index))
        .unwrap_or(false)
        || matches!(token.as_str(), "f:1" | "k:1" | "k:2")
        || (matches!(token.as_str(), "c:1" | "e:1") && atom.len() == 1)
        || e_f_row_anchor_indexes(particles, atom)
            .map(|indexes| indexes.contains(&particle_index))
            .unwrap_or(false)
}

fn atom_is_row_ignored(particles: &[Particle], atom: &[usize]) -> bool {
    atom_starts_with_tokens(particles, atom, &["a:1"])
        || atom_starts_with_tokens(particles, atom, &["e:1", "a:1"])
}

fn initial_a_row_anchor_indexes(particles: &[Particle], atom: &[usize]) -> Option<Vec<usize>> {
    let ordered = ordered_atom_particle_indexes(particles, atom);
    let first = *ordered.first()?;
    if clean_particle_token(&particles[first]) == "a:1" {
        Some(vec![first])
    } else {
        None
    }
}

fn e_f_row_anchor_indexes(particles: &[Particle], atom: &[usize]) -> Option<Vec<usize>> {
    let ordered = ordered_atom_particle_indexes(particles, atom);
    if ordered.len() < 2 {
        return None;
    }
    if clean_particle_token(&particles[ordered[0]]) == "e:1" && clean_particle_token(&particles[ordered[1]]) == "f:1" {
        Some(vec![ordered[1]])
    } else {
        None
    }
}

fn fallback_atom_rows(spans: Vec<AtomSpan>, threshold: f64) -> Vec<AtomRow> {
    let mut rows: Vec<AtomRow> = Vec::new();
    for span in spans {
        if let Some(row) = rows
            .iter_mut()
            .find(|row| (span.baseline_y - row.y).abs() <= threshold)
        {
            row.atoms.push(span);
            row.y = row.atoms.iter().map(|atom| atom.baseline_y).sum::<f64>() / row.atoms.len() as f64;
        } else {
            rows.push(AtomRow {
                row_index: rows.len() as i64 + 1,
                y: span.baseline_y,
                top_y: span.baseline_y - threshold / 2.0,
                bottom_y: span.baseline_y + threshold / 2.0,
                atoms: vec![span],
            });
        }
    }

    rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    absorb_singleton_outlier_rows(&mut rows, threshold);
    rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    assign_atom_row_indexes(&mut rows, 1);
    rows
}

fn seeded_atom_rows(particles: &[Particle], spans: &[AtomSpan], threshold: f64) -> Option<Vec<AtomRow>> {
    let mut seed_values = particles
        .iter()
        .filter_map(core_row_anchor)
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    if seed_values.len() < 3 {
        return None;
    }
    seed_values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    let seed_split = core_seed_split_threshold(&seed_values, threshold)?;
    let mut seed_rows: Vec<Vec<f64>> = Vec::new();
    for seed in seed_values {
        if let Some(row) = seed_rows.last_mut() {
            let previous = *row.last().unwrap_or(&seed);
            if (seed - previous).abs() <= seed_split {
                row.push(seed);
            } else {
                seed_rows.push(vec![seed]);
            }
        } else {
            seed_rows.push(vec![seed]);
        }
    }

    let mut row_centers = seed_rows
        .iter_mut()
        .filter_map(|row| {
            row.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
            median_sorted(row)
        })
        .collect::<Vec<_>>();
    if row_centers.len() < 2 {
        return None;
    }
    row_centers.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    let mut rows = row_centers
        .iter()
        .map(|center| AtomRow {
            row_index: 0,
            y: *center,
            top_y: *center - threshold / 2.0,
            bottom_y: *center + threshold / 2.0,
            atoms: Vec::new(),
        })
        .collect::<Vec<_>>();
    for span in spans.iter().cloned() {
        let target = rows
            .iter()
            .enumerate()
            .min_by(|(_, a), (_, b)| {
                (span.baseline_y - a.y)
                    .abs()
                    .partial_cmp(&(span.baseline_y - b.y).abs())
                    .unwrap_or(std::cmp::Ordering::Equal)
            })
            .map(|(index, _)| index)?;
        rows[target].atoms.push(span);
    }

    rows.retain(|row| !row.atoms.is_empty());
    for row in rows.iter_mut() {
        row.y = robust_row_y(&row.atoms);
    }
    rows.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal));
    assign_atom_row_indexes(&mut rows, 1);
    Some(rows)
}

fn assign_atom_row_indexes(rows: &mut [AtomRow], start_index: i64) {
    for (index, row) in rows.iter_mut().enumerate() {
        row.row_index = start_index + index as i64;
    }
}

fn core_seed_split_threshold(seed_values: &[f64], fallback: f64) -> Option<f64> {
    let mut gaps = seed_values
        .windows(2)
        .filter_map(|pair| {
            let gap = pair[1] - pair[0];
            if gap.is_finite() && gap > 0.5 {
                Some(gap)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    if gaps.is_empty() {
        return None;
    }
    gaps.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    if gaps.len() == 1 {
        return Some(gaps[0].max(fallback * 0.65));
    }

    let centers = kmeans_1d(&gaps, [4.0, fallback * 0.55, fallback * 1.75]);
    let small_large_midpoint = (centers[1] + centers[2]) / 2.0;
    let has_clear_large_gap = centers[2] > centers[1] * 1.45 && centers[2] - centers[1] > 8.0;
    if has_clear_large_gap {
        Some(small_large_midpoint)
    } else {
        let mut lower_half = gaps[..(gaps.len() / 2).max(1)].to_vec();
        lower_half.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        let local_gap = median_sorted(&lower_half).unwrap_or(fallback * 0.55);
        Some(local_gap.mul_add(2.4, 0.0).max(fallback * 0.75))
    }
}

fn absorb_singleton_outlier_rows(rows: &mut Vec<AtomRow>, threshold: f64) {
    if rows.len() < 2 {
        return;
    }

    let mut index = 0;
    while index < rows.len() {
        if rows[index].atoms.len() != 1 {
            index += 1;
            continue;
        }

        let Some(target_index) = nearest_populated_row_for_singleton(rows, index, threshold) else {
            index += 1;
            continue;
        };

        let atoms = rows.remove(index).atoms;
        let adjusted_target = if target_index > index { target_index - 1 } else { target_index };
        rows[adjusted_target].atoms.extend(atoms);
        rows[adjusted_target].y = robust_row_y(&rows[adjusted_target].atoms);
        if adjusted_target <= index && index > 0 {
            index -= 1;
        }
    }
}

fn nearest_populated_row_for_singleton(rows: &[AtomRow], singleton_index: usize, threshold: f64) -> Option<usize> {
    let singleton = rows.get(singleton_index)?.atoms.first()?;
    let max_delta = (threshold * 1.45).clamp(34.0, 72.0);

    rows.iter()
        .enumerate()
        .filter(|(index, row)| *index != singleton_index && row.atoms.len() >= 2)
        .filter_map(|(index, row)| {
            let delta = (singleton.baseline_y - row.y).abs();
            if delta > max_delta || !singleton_belongs_to_row_band(singleton, row, threshold) {
                return None;
            }
            Some((index, delta))
        })
        .min_by(|a, b| a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal))
        .map(|(index, _)| index)
}

fn singleton_belongs_to_row_band(singleton: &AtomSpan, row: &AtomRow, threshold: f64) -> bool {
    let bounds = atom_row_bounds(row);
    let singleton_center_x = singleton.x + singleton.w / 2.0;
    let horizontal_margin = threshold.mul_add(3.0, 24.0);
    let within_row_x = singleton_center_x >= bounds.x - horizontal_margin
        && singleton_center_x <= bounds.x + bounds.w + horizontal_margin;
    let x_overlap = rect_axis_overlap(singleton.x, singleton.w, bounds.x, bounds.w) > 0.0;
    within_row_x || x_overlap
}

fn robust_row_y(atoms: &[AtomSpan]) -> f64 {
    let mut values = atoms
        .iter()
        .map(|atom| atom.baseline_y)
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    median_sorted(&values).unwrap_or(0.0)
}

fn atom_row_bounds(row: &AtomRow) -> RectBox {
    let min_x = row.atoms.iter().map(|atom| atom.x).fold(f64::INFINITY, f64::min);
    let min_y = row.atoms.iter().map(|atom| atom.y).fold(f64::INFINITY, f64::min);
    let max_x = row.atoms.iter().map(|atom| atom.x + atom.w).fold(f64::NEG_INFINITY, f64::max);
    let max_y = row.atoms.iter().map(|atom| atom.y + atom.h).fold(f64::NEG_INFINITY, f64::max);
    RectBox {
        x: if min_x.is_finite() { min_x } else { 0.0 },
        y: if min_y.is_finite() { min_y } else { row.y },
        w: if max_x.is_finite() && min_x.is_finite() { max_x - min_x } else { 0.0 },
        h: if max_y.is_finite() && min_y.is_finite() { max_y - min_y } else { 0.0 },
    }
}

fn atom_span(particles: &[Particle], atom: &[usize], index: usize) -> AtomSpan {
    let bounds = particle_bounds_for_indexes(particles, atom);
    let row_vote_particles = strict_row_anchor_indexes_for_atom(particles, atom)
        .unwrap_or_else(|| row_vote_particle_indexes(particles, atom));
    let mut core_anchors = row_vote_particles
        .iter()
        .filter_map(|particle_index| core_row_anchor(&particles[*particle_index]))
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    core_anchors.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let mut anchors = row_vote_particles
        .iter()
        .map(|particle_index| particle_row_anchor(&particles[*particle_index]))
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    anchors.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let body_y = median_sorted(&core_anchors)
        .or_else(|| median_sorted(&anchors))
        .unwrap_or(bounds.centroid_y);

    let mut bottoms = row_vote_particles
        .iter()
        .map(|particle_index| particles[*particle_index].bounds_y + particles[*particle_index].bounds_h)
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    bottoms.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let bottom_y = median_sorted(&bottoms).unwrap_or(bounds.y + bounds.h);
    let baseline_y = atom_row_anchor(body_y, bottom_y, bounds.h);

    AtomSpan {
        index,
        x: bounds.x,
        y: bounds.y,
        w: bounds.w,
        h: bounds.h,
        baseline_y,
        body_y,
        bottom_y,
    }
}

fn atom_row_anchor(body_y: f64, bottom_y: f64, height: f64) -> f64 {
    if !body_y.is_finite() {
        return bottom_y;
    }
    if !bottom_y.is_finite() {
        return body_y;
    }

    let body_to_bottom = (bottom_y - body_y).max(0.0);
    let tall_atom = height > 34.0;
    if tall_atom && body_to_bottom > height * 0.18 {
        return bottom_y - body_to_bottom.min(height * 0.22);
    }

    body_y
}

fn row_vote_particle_indexes(particles: &[Particle], atom: &[usize]) -> Vec<usize> {
    let ordered = ordered_atom_particle_indexes(particles, atom);
    if !atom_is_row_ignored(particles, atom) {
        return ordered;
    }

    let without_distorter = ordered
        .iter()
        .copied()
        .filter(|particle_index| !matches!(clean_particle_token(&particles[*particle_index]).as_str(), "a:1" | "e:1"))
        .collect::<Vec<_>>();
    if without_distorter.is_empty() {
        ordered
    } else {
        without_distorter
    }
}

fn atom_starts_with_tokens(particles: &[Particle], atom: &[usize], tokens: &[&str]) -> bool {
    let ordered = ordered_atom_particle_indexes(particles, atom);
    if ordered.len() < tokens.len() {
        return false;
    }
    tokens.iter().enumerate().all(|(index, token)| clean_particle_token(&particles[ordered[index]]) == *token)
}

fn ordered_atom_particle_indexes(particles: &[Particle], atom: &[usize]) -> Vec<usize> {
    let snapshot = atom
        .iter()
        .map(|particle_index| particles[*particle_index].clone())
        .collect::<Vec<_>>();
    let mut ordered = atom.to_vec();
    ordered.sort_by(|a, b| {
        let particle_a = &particles[*a];
        let particle_b = &particles[*b];
        let a_is_closing = is_closing_idk_particle(particle_a, &snapshot);
        let b_is_closing = is_closing_idk_particle(particle_b, &snapshot);

        a_is_closing
            .cmp(&b_is_closing)
            .then_with(|| particle_a.anchor_x.partial_cmp(&particle_b.anchor_x).unwrap_or(std::cmp::Ordering::Equal))
    });
    ordered
}

fn particle_row_anchor(particle: &Particle) -> f64 {
    let family = clean_particle_key(&particle.family);
    let top = particle.bounds_y;
    let bottom = particle.bounds_y + particle.bounds_h;
    match family.as_str() {
        "a" => bottom,
        "h" => top + particle.bounds_h.min(18.0) * 0.20,
        _ => particle.anchor_y,
    }
}

fn core_row_anchor(particle: &Particle) -> Option<f64> {
    match clean_particle_token(particle).as_str() {
        "f:1" | "k:1" | "k:2" | "c:1" | "e:1" => Some(particle.anchor_y),
        _ => None,
    }
}

fn atom_row_threshold(particles: &[Particle]) -> f64 {
    let mut heights = particles
        .iter()
        .filter(|particle| clean_particle_key(&particle.family) == "k")
        .map(|particle| particle.bounds_h.max(1.0))
        .filter(|height| height.is_finite())
        .collect::<Vec<_>>();
    if heights.len() < 4 {
        heights = particles
            .iter()
            .map(|particle| particle.bounds_h.max(1.0))
            .filter(|height| height.is_finite())
            .collect::<Vec<_>>();
    }
    heights.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    median_sorted(&heights).unwrap_or(16.0).mul_add(2.2, 0.0).clamp(26.0, 56.0)
}

fn median_sorted(values: &[f64]) -> Option<f64> {
    if values.is_empty() {
        return None;
    }
    let mid = values.len() / 2;
    if values.len() % 2 == 0 {
        Some((values[mid - 1] + values[mid]) / 2.0)
    } else {
        Some(values[mid])
    }
}

#[derive(Debug)]
struct LinkEvaluation {
    accepted: bool,
    reason: String,
    horizontal_gap: f64,
    vertical_delta: f64,
    distance: f64,
    distance_limit: f64,
    local_height: f64,
}

const ATOM_CONTACT_DISTANCE: f64 = 1.25;

fn cluster_links_for_particles(
    particles: &[Particle],
    micro_threshold: f64,
    _macro_threshold: f64,
) -> Vec<ClusterLink> {
    let mut links = Vec::new();
    for left in 0..particles.len() {
        for right in (left + 1)..particles.len() {
            let micro_eval = evaluate_particle_contact_link(particles, left, right);
            if micro_eval.accepted {
                links.push(cluster_link_from_eval("atom", &particles[left], &particles[right], micro_threshold, micro_eval));
            }
        }
    }
    links
}

fn cluster_link_from_eval(
    stage: &str,
    particle_a: &Particle,
    particle_b: &Particle,
    max_horizontal_gap: f64,
    eval: LinkEvaluation,
) -> ClusterLink {
    ClusterLink {
        stage: stage.to_string(),
        particle_id_a: particle_a.id,
        particle_id_b: particle_b.id,
        accepted: eval.accepted,
        reason: eval.reason,
        horizontal_gap: eval.horizontal_gap,
        max_horizontal_gap,
        vertical_delta: eval.vertical_delta,
        distance: eval.distance,
        distance_limit: eval.distance_limit,
        local_height: eval.local_height,
    }
}

fn evaluate_particle_contact_link(
    particles: &[Particle],
    left: usize,
    right: usize,
) -> LinkEvaluation {
    let a = &particles[left];
    let b = &particles[right];
    let vertical_delta = (a.anchor_y - b.anchor_y).abs();
    let (left_particle, right_particle) = if a.anchor_x <= b.anchor_x { (a, b) } else { (b, a) };
    let horizontal_gap = (right_particle.bounds_x - (left_particle.bounds_x + left_particle.bounds_w)).max(0.0);
    let local_height = local_average_height(particles, a, b);
    let distance = ((a.anchor_x - b.anchor_x).powi(2) + (a.anchor_y - b.anchor_y).powi(2)).sqrt();
    let distance_limit = ATOM_CONTACT_DISTANCE;
    let contact_gap = particle_contact_gap(a, b);

    let accepted = contact_gap <= ATOM_CONTACT_DISTANCE;
    LinkEvaluation {
        accepted,
        reason: if accepted { "contacto" } else { "sin contacto" }.to_string(),
        horizontal_gap,
        vertical_delta,
        distance: contact_gap.min(distance),
        distance_limit,
        local_height,
    }
}

fn particle_contact_gap(a: &Particle, b: &Particle) -> f64 {
    let box_gap = bounds_gap(a, b);
    if box_gap > ATOM_CONTACT_DISTANCE {
        return box_gap;
    }

    let a_points = parse_particle_points(&a.points_json);
    let b_points = parse_particle_points(&b.points_json);
    if a_points.is_empty() || b_points.is_empty() {
        return box_gap;
    }

    polyline_distance(&a_points, &b_points)
}

fn bounds_gap(a: &Particle, b: &Particle) -> f64 {
    rect_gap(a.bounds_x, a.bounds_y, a.bounds_w, a.bounds_h, b.bounds_x, b.bounds_y, b.bounds_w, b.bounds_h)
}

fn rect_gap(ax: f64, ay: f64, aw: f64, ah: f64, bx: f64, by: f64, bw: f64, bh: f64) -> f64 {
    let ax2 = ax + aw;
    let ay2 = ay + ah;
    let bx2 = bx + bw;
    let by2 = by + bh;
    let dx = if ax2 < bx {
        bx - ax2
    } else if bx2 < ax {
        ax - bx2
    } else {
        0.0
    };
    let dy = if ay2 < by {
        by - ay2
    } else if by2 < ay {
        ay - by2
    } else {
        0.0
    };
    (dx.powi(2) + dy.powi(2)).sqrt()
}

fn polyline_distance(a: &[Point], b: &[Point]) -> f64 {
    let mut best = f64::INFINITY;
    for point in a {
        best = best.min(point_to_polyline_distance(point, b));
    }
    for point in b {
        best = best.min(point_to_polyline_distance(point, a));
    }
    best
}

fn point_to_polyline_distance(point: &Point, polyline: &[Point]) -> f64 {
    if polyline.is_empty() {
        return f64::INFINITY;
    }
    if polyline.len() == 1 {
        return point_distance(point, &polyline[0]);
    }

    polyline
        .windows(2)
        .map(|segment| point_to_segment_distance(point, &segment[0], &segment[1]))
        .fold(f64::INFINITY, f64::min)
}

fn point_to_segment_distance(point: &Point, start: &Point, end: &Point) -> f64 {
    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let len_sq = dx * dx + dy * dy;
    if len_sq <= f64::EPSILON {
        return point_distance(point, start);
    }

    let t = (((point.x - start.x) * dx + (point.y - start.y) * dy) / len_sq).clamp(0.0, 1.0);
    let projected = Point {
        x: start.x + t * dx,
        y: start.y + t * dy,
    };
    point_distance(point, &projected)
}

fn point_distance(a: &Point, b: &Point) -> f64 {
    ((a.x - b.x).powi(2) + (a.y - b.y).powi(2)).sqrt()
}

fn local_average_height(particles: &[Particle], a: &Particle, b: &Particle) -> f64 {
    let center_x = (a.anchor_x + b.anchor_x) / 2.0;
    let center_y = (a.anchor_y + b.anchor_y) / 2.0;
    let local = particles
        .iter()
        .filter(|particle| {
            (particle.anchor_x - center_x).abs() <= 90.0 &&
            (particle.anchor_y - center_y).abs() <= 45.0
        })
        .map(|particle| particle.bounds_h.max(1.0))
        .collect::<Vec<_>>();

    if local.is_empty() {
        return ((a.bounds_h + b.bounds_h) / 2.0).max(8.0);
    }

    (local.iter().sum::<f64>() / local.len() as f64).max(8.0)
}

fn get_particle(conn: &Connection, id: i64) -> Result<Particle, String> {
    conn.query_row(
        "SELECT id, region_id, image_id, family, color, points_json, anchor_x, anchor_y,
                bounds_x, bounds_y, bounds_w, bounds_h, length, angle, points_count,
                visual_variant, structural_config, molecule_id, atom_id, particle_order, created_at, updated_at
         FROM particles WHERE id = ?1",
        params![id],
        particle_from_row,
    )
    .map_err(|e| e.to_string())
}

fn get_particle_by_region(conn: &Connection, region_id: i64) -> Result<Particle, String> {
    conn.query_row(
        "SELECT id, region_id, image_id, family, color, points_json, anchor_x, anchor_y,
                bounds_x, bounds_y, bounds_w, bounds_h, length, angle, points_count,
                visual_variant, structural_config, molecule_id, atom_id, particle_order, created_at, updated_at
         FROM particles WHERE region_id = ?1",
        params![region_id],
        particle_from_row,
    )
    .map_err(|e| e.to_string())
}

fn particle_from_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<Particle> {
    Ok(Particle {
        id: row.get(0)?,
        region_id: row.get(1)?,
        image_id: row.get(2)?,
        family: row.get(3)?,
        color: row.get(4)?,
        points_json: row.get(5)?,
        anchor_x: row.get(6)?,
        anchor_y: row.get(7)?,
        bounds_x: row.get(8)?,
        bounds_y: row.get(9)?,
        bounds_w: row.get(10)?,
        bounds_h: row.get(11)?,
        length: row.get(12)?,
        angle: row.get(13)?,
        points_count: row.get(14)?,
        visual_variant: row.get(15)?,
        structural_config: row.get(16)?,
        molecule_id: row.get(17)?,
        atom_id: row.get(18)?,
        particle_order: row.get(19)?,
        created_at: row.get(20)?,
        updated_at: row.get(21)?,
    })
}

fn labels_for_region(conn: &Connection, region_id: i64) -> Result<std::collections::HashMap<String, String>, String> {
    let mut stmt = conn
        .prepare("SELECT label_type, value FROM labels WHERE region_id = ?1")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![region_id], |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)))
        .map_err(|e| e.to_string())?;
    let mut labels = std::collections::HashMap::new();
    for row in rows {
        let (key, value) = row.map_err(|e| e.to_string())?;
        labels.entry(key).or_insert(value);
    }
    Ok(labels)
}

#[derive(Debug)]
struct Geometry {
    points: Vec<Point>,
    color: Option<String>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct Point {
    x: f64,
    y: f64,
}

#[derive(Debug)]
struct ParticleMetrics {
    anchor_x: f64,
    anchor_y: f64,
    bounds_x: f64,
    bounds_y: f64,
    bounds_w: f64,
    bounds_h: f64,
    length: f64,
    angle: f64,
    points_count: i64,
}

fn parse_geometry(raw: &str) -> Result<Geometry, String> {
    let value: serde_json::Value = serde_json::from_str(raw).map_err(|e| e.to_string())?;
    let points = if value.get("points").is_some() {
        serde_json::from_value(value["points"].clone()).map_err(|e| e.to_string())?
    } else {
        Vec::new()
    };
    Ok(Geometry {
        points,
        color: value.get("color").and_then(|v| v.as_str()).map(|v| v.to_string()),
    })
}

fn geometry_metrics(points: &[Point]) -> ParticleMetrics {
    let points_count = points.len() as i64;
    let xs = points.iter().map(|p| p.x).collect::<Vec<_>>();
    let ys = points.iter().map(|p| p.y).collect::<Vec<_>>();
    let bounds_x = xs.iter().copied().fold(f64::INFINITY, f64::min);
    let bounds_y = ys.iter().copied().fold(f64::INFINITY, f64::min);
    let max_x = xs.iter().copied().fold(f64::NEG_INFINITY, f64::max);
    let max_y = ys.iter().copied().fold(f64::NEG_INFINITY, f64::max);
    let bounds_w = if xs.is_empty() { 0.0 } else { max_x - bounds_x };
    let bounds_h = if ys.is_empty() { 0.0 } else { max_y - bounds_y };
    let anchor_x = if xs.is_empty() { 0.0 } else { xs.iter().sum::<f64>() / xs.len() as f64 };
    let anchor_y = if ys.is_empty() { 0.0 } else { ys.iter().sum::<f64>() / ys.len() as f64 };

    let mut length = 0.0;
    for index in 1..points.len() {
        length += ((points[index].x - points[index - 1].x).powi(2) + (points[index].y - points[index - 1].y).powi(2)).sqrt();
    }

    let angle = match (points.first(), points.last()) {
        (Some(first), Some(last)) => (last.y - first.y).atan2(last.x - first.x).to_degrees(),
        _ => 0.0,
    };

    ParticleMetrics {
        anchor_x,
        anchor_y,
        bounds_x: if bounds_x.is_finite() { bounds_x } else { 0.0 },
        bounds_y: if bounds_y.is_finite() { bounds_y } else { 0.0 },
        bounds_w,
        bounds_h,
        length,
        angle,
        points_count,
    }
}

fn clean_particle_key(value: &str) -> String {
    let clean = value.trim();
    let clean = clean.strip_suffix("_base").unwrap_or(clean);
    clean.to_lowercase()
}
