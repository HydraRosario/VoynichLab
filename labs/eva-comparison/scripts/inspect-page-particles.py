import sqlite3
import sys
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def main() -> int:
    image_id = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    molecule_ids = sys.argv[2:] or ["img4-m22", "img4-m30"]
    con = sqlite3.connect(DEFAULT_DB)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    for molecule_id in molecule_ids:
        print(f"\nMOLECULE {molecule_id}")
        rows = cur.execute(
            """
            SELECT p.particle_id, p.source_index, p.particle_order, p.atom_count,
                   a.id, a.family, a.structural_config, a.atom_order, a.bounds_x, a.bounds_y
            FROM particles p
            LEFT JOIN atoms a ON a.image_id = p.image_id AND a.particle_id = p.particle_id
            WHERE p.image_id = ? AND p.molecule_id = ?
            ORDER BY p.particle_order, a.atom_order, a.bounds_x, a.id
            """,
            (image_id, molecule_id),
        ).fetchall()
        current = None
        buffered = []
        def flush():
            if not buffered:
                return
            head = buffered[0]
            signature = "+".join(f"{row['family']}:{row['structural_config']}" for row in buffered)
            print(
                f"  {head['particle_id']} P{head['source_index']} "
                f"order={head['particle_order']} count={head['atom_count']} sig={signature}"
            )
            for row in buffered:
                print(
                    f"    {row['id']} {row['family']}:{row['structural_config']} "
                    f"order={row['atom_order']} xy={row['bounds_x']},{row['bounds_y']}"
                )

        for row in rows:
            if row["particle_id"] != current:
                flush()
                buffered = []
                current = row["particle_id"]
            buffered.append(row)
        flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
