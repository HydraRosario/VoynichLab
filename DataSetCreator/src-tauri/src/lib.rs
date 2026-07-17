mod commands;
mod database;
mod models;

use std::sync::Mutex;
use rusqlite::Connection;
use tauri::Manager;

/// Managed Tauri state wrapping the SQLite connection behind a Mutex.
pub struct DbState(pub Mutex<Connection>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let conn = database::init_db(app.handle())?;
            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::sync_default_manuscript_pages,
            // Images
            commands::list_images,
            commands::get_image,
            commands::get_image_base64,
            // Regions
            commands::create_region,
            commands::update_region,
            commands::delete_region,
            commands::delete_regions_batch,
            commands::list_regions,
            // Particle engine
            commands::sync_particle_for_region,
            commands::create_particle_strokes_batch,
            commands::recalculate_molecules,
            commands::set_molecule_gap_override,
            commands::clear_molecule_gap_override,
            commands::set_molecule_gap_overrides_batch,
            commands::set_atom_row_override,
            commands::clear_atom_row_override,
            commands::set_atom_row_overrides_batch,
            commands::adjust_atom_row_guide,
            commands::set_atom_row_guides,
            commands::set_atom_particle_order,
            commands::set_molecule_atom_order,
            commands::set_order_drafts_batch,
            commands::set_atom_merge_pattern,
            commands::clear_latest_atom_merge_pattern,
            // Labels
            commands::create_label,
            commands::update_label,
            commands::delete_label,
            commands::list_labels,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
