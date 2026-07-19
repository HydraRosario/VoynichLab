import math
import sqlite3
import sys
from collections import Counter, defaultdict
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def token(row):
    return f"{row['family']}:{row['structural_config']}"


def sequence_key(rows):
    return "+".join(token(row) for row in rows)


def main() -> int:
    image_name = sys.argv[1] if len(sys.argv) > 1 else "page-004.jpg"
    db_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_DB

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    image = cur.execute("SELECT id, name FROM images WHERE name = ?", (image_name,)).fetchone()
    if not image:
        print(f"Image not found: {image_name}")
        return 1

    atoms = cur.execute(
        """
        SELECT a.id atom_id, a.image_id, i.name image_name, a.molecule_id, a.particle_id,
               a.atom_order, a.family, a.structural_config, a.bounds_x, a.bounds_y,
               p.particle_order, p.source_index
        FROM atoms a
        JOIN images i ON i.id = a.image_id
        LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
        WHERE a.image_id = ? AND a.molecule_id IS NOT NULL AND a.particle_id IS NOT NULL
        ORDER BY a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id
        """,
        (image["id"],),
    ).fetchall()

    counts = {
        "atoms": len(atoms),
        "particles": cur.execute("SELECT count(*) FROM particles WHERE image_id = ?", (image["id"],)).fetchone()[0],
        "molecules": cur.execute("SELECT count(*) FROM molecules WHERE image_id = ?", (image["id"],)).fetchone()[0],
        "row_guides": cur.execute("SELECT count(*) FROM particle_row_guides WHERE image_id = ?", (image["id"],)).fetchone()[0],
        "row_overrides": cur.execute("SELECT count(*) FROM particle_row_overrides WHERE image_id = ?", (image["id"],)).fetchone()[0],
        "gap_overrides": cur.execute("SELECT count(*) FROM molecule_gap_overrides WHERE image_id = ?", (image["id"],)).fetchone()[0],
    }

    obsolete = Counter(token(row) for row in atoms if token(row) in {"a:2", "g:2", "j:2"} or not row["family"] or not row["structural_config"])

    bad_merges = cur.execute(
        """
        SELECT id, signature_key
        FROM particle_merge_patterns
        WHERE signature_key LIKE '%j:2%'
           OR signature_key LIKE '%g:2%'
           OR signature_key = 'inline|c:1|f:1+j:1'
        ORDER BY id
        """
    ).fetchall()

    particles = defaultdict(list)
    for row in atoms:
        particles[(row["image_id"], row["particle_id"])].append(row)
    particle_rows = []
    for rows in particles.values():
        ordered = sorted(rows, key=lambda r: (r["atom_order"] or 999999, r["bounds_x"], r["atom_id"]))
        particle_rows.append({
            "image_name": ordered[0]["image_name"],
            "molecule_id": ordered[0]["molecule_id"],
            "particle_id": ordered[0]["particle_id"],
            "source_index": ordered[0]["source_index"],
            "sequence": sequence_key(ordered),
            "bag": "+".join(sorted(token(row) for row in ordered)),
            "atom_ids": " ".join(str(row["atom_id"]) for row in ordered),
            "n": len(ordered),
        })

    by_bag = defaultdict(list)
    for row in particle_rows:
        if row["n"] >= 2:
            by_bag[row["bag"]].append(row)

    rare_order = []
    for bag, rows in by_bag.items():
        if len(rows) < 3:
            continue
        seq_counts = Counter(row["sequence"] for row in rows)
        dominant, dominant_n = seq_counts.most_common(1)[0]
        for row in rows:
            if row["sequence"] == dominant:
                continue
            rare_n = seq_counts[row["sequence"]]
            rare_ratio = rare_n / len(rows)
            if rare_n <= 2 and rare_ratio <= 0.20:
                rare_order.append({
                    **row,
                    "dominant": dominant,
                    "total": len(rows),
                    "dominant_n": dominant_n,
                    "rare_n": rare_n,
                    "score": (dominant_n / len(rows)) * math.log2(len(rows) + 1),
                })

    suspicious_large_particles = [
        row for row in particle_rows
        if row["n"] >= 4 and row["sequence"].count("+") >= 3
    ]

    print(f"db: {db_path}")
    print(f"image: {image['name']} id={image['id']}")
    for key, value in counts.items():
        print(f"{key}: {value}")
    print(f"obsolete_or_blank_tokens: {sum(obsolete.values())}")
    for item, value in sorted(obsolete.items()):
        print(f"- {item}: {value}")
    print(f"bad_merge_patterns: {len(bad_merges)}")
    for row in bad_merges:
        print(f"- #{row['id']} {row['signature_key']}")

    print(f"rare_order_candidates: {len(rare_order)}")
    for row in sorted(rare_order, key=lambda r: (-r["score"], r["molecule_id"], r["particle_id"]))[:20]:
        print(
            f"- {row['molecule_id']} {row['particle_id']} P{row['source_index']} "
            f"ids={row['atom_ids']} observed={row['sequence']} dominant={row['dominant']} "
            f"support={row['dominant_n']}/{row['total']}"
        )

    print(f"suspicious_large_particles_ge4_atoms: {len(suspicious_large_particles)}")
    for row in suspicious_large_particles[:20]:
        print(f"- {row['molecule_id']} {row['particle_id']} P{row['source_index']} ids={row['atom_ids']} seq={row['sequence']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
