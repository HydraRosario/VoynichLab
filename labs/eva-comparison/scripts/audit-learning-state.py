import sqlite3
import sys
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def main() -> int:
    token = sys.argv[1] if len(sys.argv) > 1 else "j:2"
    db_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_DB
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    print(f"db: {db_path}")
    print(f"token: {token}")
    for table in ["particle_merge_patterns", "molecule_order_patterns", "particle_order_patterns"]:
        count = cur.execute(f"select count(*) from {table}").fetchone()[0]
        print(f"{table}: {count}")

    like = f"%{token}%"
    merge_rows = cur.execute(
        """
        select id, signature_key, relation, first_token, second_token, max_gap,
               min_overlap_ratio, sample_image_id, sample_particle_a, sample_particle_b, updated_at
        from particle_merge_patterns
        where signature_key like ? or first_token like ? or second_token like ?
        order by datetime(updated_at) desc, id desc
        """,
        (like, like, like),
    ).fetchall()
    print(f"\nparticle_merge_patterns matching {token}: {len(merge_rows)}")
    for row in merge_rows[:50]:
        print(dict(row))

    molecule_rows = cur.execute(
        """
        select id, signature_key, ordered_tokens_json, sample_image_id, sample_molecule_id, updated_at
        from molecule_order_patterns
        where signature_key like ? or ordered_tokens_json like ?
        order by datetime(updated_at) desc, id desc
        """,
        (like, like),
    ).fetchall()
    print(f"\nmolecule_order_patterns matching {token}: {len(molecule_rows)}")
    for row in molecule_rows[:50]:
        print(dict(row))

    particle_rows = cur.execute(
        """
        select id, signature_key, ordered_tokens_json, sample_image_id, sample_particle_id, updated_at
        from particle_order_patterns
        where signature_key like ? or ordered_tokens_json like ?
        order by datetime(updated_at) desc, id desc
        """,
        (like, like),
    ).fetchall()
    print(f"\nparticle_order_patterns matching {token}: {len(particle_rows)}")
    for row in particle_rows[:50]:
        print(dict(row))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
