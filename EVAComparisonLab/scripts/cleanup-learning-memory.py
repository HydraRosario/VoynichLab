import argparse
import json
import shutil
import sqlite3
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def token(row):
    return f"{row['family']}:{row['structural_config']}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--include-minority", action="store_true", help="Also delete learned patterns that still exist but are not the dominant current sequence.")
    args = parser.parse_args()

    db_path = DEFAULT_DB
    backup_dir = Path.cwd() / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = backup_dir / f"datasetcreator-before-learning-memory-cleanup-{stamp}.db"
    shutil.copy2(db_path, backup_path)

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    current_sequences = current_particle_sequences(cur)
    rows = cur.execute(
        """
        SELECT id, signature_key, ordered_tokens_json, sample_image_id, sample_particle_id, updated_at
        FROM particle_order_patterns
        ORDER BY id
        """
    ).fetchall()

    targets = []
    for row in rows:
        try:
            learned = tuple(json.loads(row["ordered_tokens_json"]))
        except Exception:
            learned = tuple()
        counts = current_sequences.get(row["signature_key"], Counter())
        total = sum(counts.values())
        current_count = counts.get(learned, 0)
        dominant, _dominant_count = counts.most_common(1)[0] if counts else ((), 0)
        if total == 0:
            targets.append((row, "stale"))
        elif current_count == 0:
            targets.append((row, "stale"))
        elif args.include_minority and learned != dominant:
            targets.append((row, "minority"))

    with con:
        for row, _reason in targets:
            cur.execute("DELETE FROM particle_order_patterns WHERE id = ?", (row["id"],))

    print(f"db: {db_path}")
    print(f"backup: {backup_path}")
    print(f"particle_order_patterns_before: {len(rows)}")
    print(f"deleted: {len(targets)}")
    for row, reason in targets:
        print(f"- {reason} #{row['id']} {row['signature_key']} sample={row['sample_image_id']} {row['sample_particle_id']} updated={row['updated_at']}")
    remaining = cur.execute("SELECT count(*) FROM particle_order_patterns").fetchone()[0]
    print(f"particle_order_patterns_after: {remaining}")
    con.close()
    return 0


def current_particle_sequences(cur):
    rows = cur.execute(
        """
        SELECT a.image_id, a.particle_id, a.id atom_id, a.family, a.structural_config,
               a.atom_order, a.bounds_x
        FROM atoms a
        WHERE a.molecule_id IS NOT NULL AND a.particle_id IS NOT NULL
        ORDER BY a.image_id, a.particle_id, a.atom_order, a.bounds_x, a.id
        """
    ).fetchall()
    by_particle = defaultdict(list)
    for row in rows:
        by_particle[(row["image_id"], row["particle_id"])].append(row)

    sequences = defaultdict(Counter)
    for particle_rows in by_particle.values():
        ordered = sorted(particle_rows, key=lambda r: (r["atom_order"] or 999999, r["bounds_x"], r["atom_id"]))
        sequence = tuple(token(row) for row in ordered)
        signature = "+".join(sorted(sequence))
        sequences[signature][sequence] += 1
    return sequences


if __name__ == "__main__":
    raise SystemExit(main())
