import json
import sqlite3
import sys
from collections import Counter, defaultdict
from pathlib import Path


DEFAULT_DB = Path.home() / "AppData" / "Roaming" / "com.voynichlab.datasetcreator" / "datasetcreator.db"


def token(row):
    return f"{row['family']}:{row['structural_config']}"


def main() -> int:
    db_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DB
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    atoms = cur.execute(
        """
        SELECT i.name image_name, a.image_id, a.molecule_id, a.particle_id,
               p.particle_order, p.source_index,
               a.id atom_id, a.family, a.structural_config, a.atom_order, a.bounds_x
        FROM atoms a
        JOIN images i ON i.id = a.image_id
        LEFT JOIN particles p ON p.image_id = a.image_id AND p.particle_id = a.particle_id
        WHERE a.molecule_id IS NOT NULL AND a.particle_id IS NOT NULL
        ORDER BY a.image_id, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id
        """
    ).fetchall()

    by_particle = defaultdict(list)
    by_molecule = defaultdict(lambda: defaultdict(list))
    for row in atoms:
        particle_key = (row["image_id"], row["particle_id"])
        by_particle[particle_key].append(row)
        molecule_key = (row["image_id"], row["molecule_id"])
        by_molecule[molecule_key][row["particle_id"]].append(row)

    particle_sequences = defaultdict(Counter)
    particle_examples = defaultdict(list)
    for rows in by_particle.values():
        ordered = sorted(rows, key=lambda r: (r["atom_order"] or 999999, r["bounds_x"], r["atom_id"]))
        sequence = tuple(token(row) for row in ordered)
        signature = "+".join(sorted(sequence))
        particle_sequences[signature][sequence] += 1
        if len(particle_examples[signature]) < 8:
            first = ordered[0]
            particle_examples[signature].append(
                (first["image_name"], first["molecule_id"], first["particle_id"], first["source_index"], sequence)
            )

    molecule_sequences = defaultdict(Counter)
    molecule_examples = defaultdict(list)
    for particle_map in by_molecule.values():
        particle_rows = []
        for rows in particle_map.values():
            ordered = sorted(rows, key=lambda r: (r["atom_order"] or 999999, r["bounds_x"], r["atom_id"]))
            first = ordered[0]
            particle_rows.append((first["particle_order"] or 999999, first["particle_id"], "+".join(token(row) for row in ordered), first))
        particle_rows.sort()
        sequence = tuple(item[2] for item in particle_rows)
        signature = "+".join(sorted(sequence))
        molecule_sequences[signature][sequence] += 1
        if len(molecule_examples[signature]) < 8 and particle_rows:
            first = particle_rows[0][3]
            molecule_examples[signature].append((first["image_name"], first["molecule_id"], sequence))

    print(f"db: {db_path}")
    audit_patterns(cur, "particle_order_patterns", particle_sequences, particle_examples)
    audit_patterns(cur, "molecule_order_patterns", molecule_sequences, molecule_examples)

    merge_rows = cur.execute(
        """
        SELECT id, signature_key, relation, first_token, second_token, sample_image_id,
               sample_particle_a, sample_particle_b, updated_at
        FROM particle_merge_patterns
        ORDER BY id
        """
    ).fetchall()
    print(f"\nparticle_merge_patterns: {len(merge_rows)}")
    for row in merge_rows:
        print(f"- #{row['id']} {row['signature_key']} sample={row['sample_image_id']} {row['sample_particle_a']} {row['sample_particle_b']} updated={row['updated_at']}")

    con.close()
    return 0


def audit_patterns(cur, table, current_sequences, examples):
    columns = {row[1] for row in cur.execute(f"PRAGMA table_info({table})").fetchall()}
    sample_particle_expr = "sample_particle_id" if "sample_particle_id" in columns else "NULL AS sample_particle_id"
    sample_molecule_expr = "sample_molecule_id" if "sample_molecule_id" in columns else "NULL AS sample_molecule_id"
    rows = cur.execute(
        f"""
        SELECT id, signature_key, ordered_tokens_json, sample_image_id,
               {sample_particle_expr}, {sample_molecule_expr}, updated_at
        FROM {table}
        ORDER BY id
        """
    ).fetchall()
    print(f"\n{table}: {len(rows)}")
    stale = 0
    minority = 0
    for row in rows:
        try:
            learned = tuple(json.loads(row["ordered_tokens_json"]))
        except Exception:
            learned = tuple()
        signature = row["signature_key"]
        counts = current_sequences.get(signature, Counter())
        total = sum(counts.values())
        current_count = counts.get(learned, 0)
        dominant, dominant_count = counts.most_common(1)[0] if counts else ((), 0)
        status = "ok"
        if total == 0 or current_count == 0:
            status = "stale"
            stale += 1
        elif learned != dominant:
            status = "minority"
            minority += 1
        print(
            f"- #{row['id']} {status} signature={signature} learned={' '.join(learned)} "
            f"current={current_count}/{total} dominant={dominant_count}/{total} {' '.join(dominant)} "
            f"sample_image={row['sample_image_id']} sample_particle={row['sample_particle_id']} "
            f"sample_molecule={row['sample_molecule_id']} updated={row['updated_at']}"
        )
        if status != "ok":
            for example in examples.get(signature, [])[:4]:
                print(f"    example: {example}")
    print(f"{table}_stale: {stale}")
    print(f"{table}_minority: {minority}")


if __name__ == "__main__":
    raise SystemExit(main())
