import sqlite3
import sys
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def main() -> int:
    atom_id = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    db_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_DB
    if not db_path.exists():
        print(f"Database not found: {db_path}")
        return 1

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    print(f"db: {db_path}")
    print(f"search_id: {atom_id}")

    tables = [row[0] for row in cur.execute("select name from sqlite_master where type='table' order by name")]
    found = False
    for table in tables:
        columns = [col[1] for col in cur.execute(f"pragma table_info({table})")]
        id_columns = [
            column
            for column in columns
            if column.lower() in {"id", "atom_id", "region_id"} or column.lower().endswith("_id")
        ]
        for column in id_columns:
            try:
                rows = cur.execute(f"select * from {table} where {column} = ?", (atom_id,)).fetchall()
            except sqlite3.Error:
                continue
            if rows:
                found = True
                print(f"\n[{table}.{column}] {len(rows)} row(s)")
                for row in rows[:8]:
                    print(dict(row))

    if not found:
        print("\nNo rows found for that id in id-like columns.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
