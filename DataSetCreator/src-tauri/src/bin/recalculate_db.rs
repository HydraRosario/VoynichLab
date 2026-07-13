#[path = "../models.rs"]
mod models;

#[path = "../database.rs"]
mod database;

use rusqlite::Connection;

fn main() {
    let args = std::env::args().skip(1).collect::<Vec<_>>();
    if args.len() < 2 {
        eprintln!("Usage: recalculate_db <datasetcreator.db> <image_id> [image_id...]");
        std::process::exit(2);
    }

    let db_path = &args[0];
    let mut conn = match Connection::open(db_path) {
        Ok(conn) => conn,
        Err(err) => {
            eprintln!("Failed to open database {db_path}: {err}");
            std::process::exit(1);
        }
    };

    for image_id_arg in &args[1..] {
        let image_id = match image_id_arg.parse::<i64>() {
            Ok(value) => value,
            Err(err) => {
                eprintln!("Invalid image_id {image_id_arg}: {err}");
                std::process::exit(2);
            }
        };
        match database::recalculate_molecules(&mut conn, image_id) {
            Ok(packet) => {
                println!(
                    "recalculated image_id={} atoms={} particles={} molecules={}",
                    image_id,
                    packet.atoms.len(),
                    packet.particles.len(),
                    packet.molecules.len()
                );
            }
            Err(err) => {
                eprintln!("Failed to recalculate image_id={image_id}: {err}");
                std::process::exit(1);
            }
        }
    }
}
