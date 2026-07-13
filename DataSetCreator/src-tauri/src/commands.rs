use std::path::{Path, PathBuf};

use base64::Engine as _;
use base64::engine::general_purpose::STANDARD as BASE64;
use image::GenericImageView;
use serde::Deserialize;
use tauri::Emitter;

use crate::database;
use crate::models::*;
use crate::DbState;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RowGuideDraft {
    pub row_index: i64,
    pub top_y: f64,
    pub y: f64,
    pub bottom_y: f64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParticleAtomOrderDraft {
    pub particle_id: String,
    pub atom_ids: Vec<i64>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MoleculeParticleOrderDraft {
    pub molecule_id: String,
    pub particle_ids: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MoleculeGapOverrideDraft {
    pub left_particle_index: i64,
    pub right_particle_index: i64,
    pub decision: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParticleRowOverrideDraft {
    pub particle_index: i64,
    pub particle_key: Option<String>,
    pub row_index: Option<i64>,
}

// =============================================================================
// Helper: lock the database connection from managed state
// =============================================================================

fn db_lock<'a>(
    state: &'a tauri::State<'a, DbState>,
) -> Result<std::sync::MutexGuard<'a, rusqlite::Connection>, String> {
    state.0.lock().map_err(|e| format!("DB lock error: {e}"))
}

// =============================================================================
// Image commands
// =============================================================================

#[tauri::command]
pub fn sync_default_manuscript_pages(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<Image>, String> {
    let app_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .map(|p| p.to_path_buf())
        .ok_or_else(|| "Failed to resolve app root".to_string())?;
    let folder = app_root.join("manuscript-pages-yale");

    if !folder.exists() {
        return Ok(Vec::new());
    }

    let mut paths = Vec::new();
    collect_image_paths(&folder, &mut paths)?;
    paths.sort_by_key(|path| path.to_string_lossy().to_lowercase());

    let conn = db_lock(&state)?;
    let mut imported = Vec::new();

    for path in paths {
        let name = path
            .file_name()
            .and_then(|value| value.to_str())
            .unwrap_or("page")
            .to_string();
        let (width, height) = match image::open(&path) {
            Ok(img) => {
                let (width, height) = img.dimensions();
                (Some(width as i64), Some(height as i64))
            }
            Err(_) => (None, None),
        };
        let relative_path = path
            .strip_prefix(&folder)
            .unwrap_or(&path)
            .to_string_lossy()
            .replace('\\', "/");
        let metadata_json = serde_json::json!({
            "source": "manuscript-pages-yale",
            "relative_path": relative_path
        })
        .to_string();

        imported.push(database::insert_image(
            &conn,
            &CreateImage {
                name,
                source_path: path.to_string_lossy().to_string(),
                width,
                height,
                metadata_json: Some(metadata_json),
            },
        )?);
    }

    Ok(imported)
}

#[tauri::command]
pub fn list_images(state: tauri::State<'_, DbState>) -> Result<Vec<Image>, String> {
    let conn = db_lock(&state)?;
    database::list_images(&conn)
}

#[tauri::command]
pub fn get_image(state: tauri::State<'_, DbState>, id: i64) -> Result<Image, String> {
    let conn = db_lock(&state)?;
    database::get_image(&conn, id)
}

/// Read an image from disk and return it as a base64 data URI
/// (e.g. `data:image/png;base64,...`).
#[tauri::command]
pub fn get_image_base64(state: tauri::State<'_, DbState>, id: i64) -> Result<String, String> {
    let conn = db_lock(&state)?;
    let img = database::get_image(&conn, id)?;

    let path = PathBuf::from(&img.source_path);
    let bytes = std::fs::read(&path)
        .map_err(|e| format!("Failed to read image file: {e}"))?;

    let mime = mime_from_extension(
        path.extension()
            .and_then(|e| e.to_str())
            .unwrap_or("png"),
    );

    let b64 = BASE64.encode(&bytes);
    Ok(format!("data:{mime};base64,{b64}"))
}

// =============================================================================
// Region commands
// =============================================================================

#[tauri::command]
pub fn create_region(
    state: tauri::State<'_, DbState>,
    image_id: i64,
    geometry_json: String,
    order_index: Option<i64>,
) -> Result<Region, String> {
    let conn = db_lock(&state)?;
    let input = CreateRegion {
        image_id,
        geometry_json,
        order_index,
    };
    database::create_region(&conn, &input)
}

#[tauri::command]
pub fn update_region(
    state: tauri::State<'_, DbState>,
    id: i64,
    geometry_json: Option<String>,
    order_index: Option<i64>,
) -> Result<Region, String> {
    let conn = db_lock(&state)?;
    let input = UpdateRegion {
        geometry_json,
        order_index,
    };
    database::update_region(&conn, id, &input)
}

#[tauri::command]
pub fn delete_region(state: tauri::State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = db_lock(&state)?;
    database::delete_region(&conn, id)
}

#[tauri::command]
pub fn delete_regions_batch(
    state: tauri::State<'_, DbState>,
    ids: Vec<i64>,
) -> Result<(), String> {
    let mut conn = db_lock(&state)?;
    database::delete_regions_batch(&mut conn, &ids)
}

#[tauri::command]
pub fn list_regions(
    state: tauri::State<'_, DbState>,
    image_id: i64,
) -> Result<Vec<Region>, String> {
    let conn = db_lock(&state)?;
    database::list_regions(&conn, image_id)
}

// =============================================================================
// Atom engine commands
// =============================================================================

#[tauri::command]
pub fn sync_atom_for_region(
    state: tauri::State<'_, DbState>,
    region_id: i64,
    family: Option<String>,
    structural_config: Option<String>,
) -> Result<Atom, String> {
    let mut conn = db_lock(&state)?;
    database::sync_atom_for_region(
        &mut conn,
        region_id,
        family.as_deref(),
        structural_config.as_deref(),
    )
}

#[tauri::command]
pub fn create_atom_strokes_batch(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    strokes: Vec<BatchAtomStrokeInput>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::create_atom_strokes_batch(&mut conn, image_id, &strokes)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn recalculate_molecules(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::recalculate_molecules(&mut conn, image_id)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_molecule_gap_override(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    left_particle_index: i64,
    right_particle_index: i64,
    decision: String,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::set_molecule_gap_override(
        &mut conn,
        image_id,
        left_particle_index,
        right_particle_index,
        &decision,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn clear_molecule_gap_override(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    left_particle_index: i64,
    right_particle_index: i64,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::clear_molecule_gap_override(
        &mut conn,
        image_id,
        left_particle_index,
        right_particle_index,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_molecule_gap_overrides_batch(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    overrides: Vec<MoleculeGapOverrideDraft>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let drafts = overrides
        .into_iter()
        .map(|draft| database::MoleculeGapOverrideDraft {
            left_particle_index: draft.left_particle_index,
            right_particle_index: draft.right_particle_index,
            decision: draft.decision,
        })
        .collect::<Vec<_>>();
    let packet = database::set_molecule_gap_overrides_batch(&mut conn, image_id, &drafts)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_particle_row_override(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    particle_index: i64,
    row_index: i64,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::set_particle_row_override(
        &mut conn,
        image_id,
        particle_index,
        row_index,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn clear_particle_row_override(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    particle_index: i64,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::clear_particle_row_override(
        &mut conn,
        image_id,
        particle_index,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_particle_row_overrides_batch(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    overrides: Vec<ParticleRowOverrideDraft>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let drafts = overrides
        .into_iter()
        .map(|draft| database::ParticleRowOverrideDraft {
            particle_index: draft.particle_index,
            particle_key: draft.particle_key,
            row_index: draft.row_index,
        })
        .collect::<Vec<_>>();
    let packet = database::set_particle_row_overrides_batch(&mut conn, image_id, &drafts)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn adjust_particle_row_guide(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    row_index: i64,
    delta_y: f64,
    edge: Option<String>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::adjust_particle_row_guide(
        &mut conn,
        image_id,
        row_index,
        delta_y,
        edge.as_deref().unwrap_or("all"),
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_particle_row_guides(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    guides: Vec<RowGuideDraft>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let drafts = guides
        .into_iter()
        .map(|guide| database::ParticleRowGuideDraft {
            row_index: guide.row_index,
            top_y: guide.top_y,
            y: guide.y,
            bottom_y: guide.bottom_y,
        })
        .collect::<Vec<_>>();
    let packet = database::set_particle_row_guides(&mut conn, image_id, &drafts)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_particle_atom_order(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    particle_id: String,
    atom_ids: Vec<i64>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::set_particle_atom_order(&mut conn, image_id, &particle_id, &atom_ids)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_molecule_particle_order(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    molecule_id: String,
    particle_ids: Vec<String>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::set_molecule_particle_order(&mut conn, image_id, &molecule_id, &particle_ids)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_order_drafts_batch(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    particle_atom_orders: Vec<ParticleAtomOrderDraft>,
    molecule_particle_orders: Vec<MoleculeParticleOrderDraft>,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let particle_atom_drafts = particle_atom_orders
        .into_iter()
        .map(|draft| database::ParticleAtomOrderDraft {
            particle_id: draft.particle_id,
            atom_ids: draft.atom_ids,
        })
        .collect::<Vec<_>>();
    let molecule_particle_drafts = molecule_particle_orders
        .into_iter()
        .map(|draft| database::MoleculeParticleOrderDraft {
            molecule_id: draft.molecule_id,
            particle_ids: draft.particle_ids,
        })
        .collect::<Vec<_>>();
    let packet = database::set_order_drafts_batch(
        &mut conn,
        image_id,
        &particle_atom_drafts,
        &molecule_particle_drafts,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn set_particle_merge_pattern(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
    particle_id_a: String,
    particle_id_b: String,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::set_particle_merge_pattern(
        &mut conn,
        image_id,
        &particle_id_a,
        &particle_id_b,
    )?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

#[tauri::command]
pub fn clear_latest_particle_merge_pattern(
    state: tauri::State<'_, DbState>,
    app_handle: tauri::AppHandle,
    image_id: i64,
) -> Result<AtomPagePacket, String> {
    let mut conn = db_lock(&state)?;
    let packet = database::clear_latest_particle_merge_pattern(&mut conn, image_id)?;
    app_handle
        .emit("molecules-updated", &packet)
        .map_err(|e| format!("Failed to emit molecules-updated: {e}"))?;
    Ok(packet)
}

// =============================================================================
// Label commands
// =============================================================================

#[tauri::command]
pub fn create_label(
    state: tauri::State<'_, DbState>,
    region_id: i64,
    label_type: String,
    value: String,
) -> Result<Label, String> {
    let conn = db_lock(&state)?;
    let input = CreateLabel {
        region_id,
        label_type,
        value,
    };
    database::create_label(&conn, &input)
}

#[tauri::command]
pub fn update_label(
    state: tauri::State<'_, DbState>,
    id: i64,
    label_type: Option<String>,
    value: Option<String>,
) -> Result<Label, String> {
    let conn = db_lock(&state)?;
    let input = UpdateLabel {
        label_type,
        value,
    };
    database::update_label(&conn, id, &input)
}

#[tauri::command]
pub fn delete_label(state: tauri::State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = db_lock(&state)?;
    database::delete_label(&conn, id)
}

#[tauri::command]
pub fn list_labels(
    state: tauri::State<'_, DbState>,
    region_id: i64,
) -> Result<Vec<Label>, String> {
    let conn = db_lock(&state)?;
    database::list_labels(&conn, region_id)
}

// =============================================================================
// Helpers
// =============================================================================

/// Map common file extensions to MIME types for data URIs.
fn mime_from_extension(ext: &str) -> &'static str {
    match ext.to_lowercase().as_str() {
        "jpg" | "jpeg" => "image/jpeg",
        "png" => "image/png",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "bmp" => "image/bmp",
        "tiff" | "tif" => "image/tiff",
        "svg" => "image/svg+xml",
        _ => "application/octet-stream",
    }
}

fn collect_image_paths(dir: &Path, paths: &mut Vec<PathBuf>) -> Result<(), String> {
    let entries = std::fs::read_dir(dir)
        .map_err(|e| format!("Failed to read directory {}: {e}", dir.display()))?;

    for entry in entries {
        let path = entry.map_err(|e| e.to_string())?.path();
        if path.is_dir() {
            collect_image_paths(&path, paths)?;
            continue;
        }

        let Some(ext) = path.extension().and_then(|e| e.to_str()) else {
            continue;
        };
        let ext = ext.to_lowercase();
        if matches!(
            ext.as_str(),
            "jpg" | "jpeg" | "png" | "tif" | "tiff" | "bmp" | "webp"
        ) {
            paths.push(path);
        }
    }

    Ok(())
}
