import shutil
import sqlite3
import sys
from pathlib import Path


DEFAULT_LIVE_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"
DEFAULT_OUT_DB = Path("cases/experiments/no-j2-floating-merges/datasetcreator.no-j2-floating-merges.db")


def main() -> int:
    live_db = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_LIVE_DB
    out_db = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUT_DB
    if not live_db.exists():
        print(f"Live database not found: {live_db}")
        return 1

    out_db.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(live_db, out_db)

    con = sqlite3.connect(out_db)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    before = cur.execute("select count(*) from particle_merge_patterns").fetchone()[0]
    matching = cur.execute(
        """
        select id, signature_key, relation, first_token, second_token, sample_image_id,
               sample_particle_a, sample_particle_b, updated_at
        from particle_merge_patterns
        where first_token = 'j:2'
          and second_token in ('e:1+e:1+g:1', 'e:1+e:1+g:2')
        order by id
        """
    ).fetchall()

    print(f"source_db: {live_db}")
    print(f"experiment_db: {out_db}")
    print(f"particle_merge_patterns_before: {before}")
    print(f"removed_patterns: {len(matching)}")
    for row in matching:
        print(dict(row))

    cur.execute(
        """
        delete from particle_merge_patterns
        where first_token = 'j:2'
          and second_token in ('e:1+e:1+g:1', 'e:1+e:1+g:2')
        """
    )
    con.commit()
    after = cur.execute("select count(*) from particle_merge_patterns").fetchone()[0]
    print(f"particle_merge_patterns_after: {after}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
