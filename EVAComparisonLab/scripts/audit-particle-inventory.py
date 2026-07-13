import json
import sqlite3
import sys
from collections import Counter, defaultdict
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def main() -> int:
    target_bag = sys.argv[1] if len(sys.argv) > 1 else "a:1+a:1+b:1+b:1+c:1+d:1+e:1"
    db_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_DB

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    rows = cur.execute(
        """
        SELECT i.name image_name, p.molecule_id, p.particle_id, p.source_index,
               p.particle_order, a.id atom_id, a.family, a.structural_config,
               a.atom_order, a.bounds_x, a.bounds_y
        FROM atoms a
        JOIN images i ON i.id = a.image_id
        JOIN particles p ON p.image_id = a.image_id AND p.particle_id = a.particle_id
        WHERE a.molecule_id IS NOT NULL AND a.particle_id IS NOT NULL
        ORDER BY i.name, p.molecule_id, p.particle_order, a.atom_order, a.bounds_x, a.id
        """
    ).fetchall()

    particles = defaultdict(list)
    for row in rows:
        particles[(row["image_name"], row["molecule_id"], row["particle_id"], row["source_index"])].append(row)

    matches = []
    for key, particle_rows in particles.items():
        tokens = [f"{row['family']}:{row['structural_config']}" for row in particle_rows]
        bag = "+".join(sorted(tokens))
        if bag == target_bag:
            matches.append((key, tokens, [str(row["atom_id"]) for row in particle_rows]))

    print(f"target_bag: {target_bag}")
    print(f"current_matches: {len(matches)}")
    print("sequences:")
    counts = Counter(" ".join(tokens) for _, tokens, _ in matches)
    for sequence, count in counts.most_common():
        print(f"- {count}x {sequence}")

    print("cases:")
    for key, tokens, atom_ids in matches:
        image_name, molecule_id, particle_id, source_index = key
        print(
            "\t".join([
                image_name,
                molecule_id,
                particle_id,
                f"P{source_index}",
                " ".join(tokens),
                " ".join(atom_ids),
            ])
        )

    print("learned_particle_order_patterns_matching:")
    patterns = cur.execute(
        """
        SELECT id, signature_key, ordered_tokens_json, sample_image_id, sample_particle_id, updated_at
        FROM particle_order_patterns
        WHERE signature_key = ?
        ORDER BY id
        """,
        (target_bag,),
    ).fetchall()
    for row in patterns:
        try:
            ordered = " ".join(json.loads(row["ordered_tokens_json"]))
        except Exception:
            ordered = row["ordered_tokens_json"]
        print(
            "\t".join([
                str(row["id"]),
                row["signature_key"],
                ordered,
                str(row["sample_image_id"]),
                row["sample_particle_id"],
                row["updated_at"],
            ])
        )

    con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
