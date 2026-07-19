import sqlite3
import sys
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def main() -> int:
    image_name = sys.argv[1] if len(sys.argv) > 1 else "page-003.jpg"
    db_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_DB

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        """
        SELECT
          a.id AS atom_id,
          i.name AS image_name,
          a.family,
          a.structural_config,
          a.molecule_id,
          a.particle_id,
          a.atom_order,
          a.bounds_x,
          a.bounds_y,
          m.molecule_id AS molecule_exists,
          p.particle_id AS particle_exists
        FROM atoms a
        JOIN images i ON i.id = a.image_id
        LEFT JOIN molecules m ON m.image_id = a.image_id AND m.molecule_id = a.molecule_id
        LEFT JOIN particles p ON p.image_id = a.image_id AND p.particle_id = a.particle_id
        WHERE i.name = ?
          AND a.molecule_id IS NOT NULL
          AND a.particle_id IS NOT NULL
          AND (m.molecule_id IS NULL OR p.particle_id IS NULL)
        ORDER BY a.id
        """,
        (image_name,),
    ).fetchall()

    print(f"db: {db_path}")
    print(f"image: {image_name}")
    print(f"assigned_not_exportable: {len(rows)}")
    for row in rows:
        token = f"{row['family']}:{row['structural_config']}"
        missing = []
        if row["molecule_exists"] is None:
            missing.append("missing_molecule")
        if row["particle_exists"] is None:
            missing.append("missing_particle")
        print(
            f"- atom={row['atom_id']} token={token} molecule={row['molecule_id']} "
            f"particle={row['particle_id']} order={row['atom_order']} "
            f"xy={row['bounds_x']},{row['bounds_y']} reason={','.join(missing)}"
        )

    con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
