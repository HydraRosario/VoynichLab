import csv
import sys
from collections import Counter
from pathlib import Path


DEFAULT_ATOMS = Path("EVAComparisonLab/cases/combined-f1r-f47v-full-current/atoms-current.tsv")


def main() -> int:
    tokens = set(sys.argv[1].split(",")) if len(sys.argv) > 1 else {"j:1", "j:2"}
    atoms_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_ATOMS
    rows = []

    with atoms_path.open(encoding="utf-8", newline="") as handle:
      reader = csv.DictReader(handle, delimiter="\t")
      for row in reader:
          sequence = (row.get("atom_sequence") or row.get("atoms") or "").split()
          atom_ids = (row.get("atom_ids") or "").split()
          for index, token in enumerate(sequence):
              if token not in tokens:
                  continue
              rows.append({
                  "token": token,
                  "unit_id": row["unit_id"],
                  "page_image": row.get("page_image") or row.get("image_name") or "",
                  "row": row.get("row") or row.get("row_index") or "",
                  "molecule_id": row.get("molecule_id") or row.get("source_molecule_id") or "",
                  "atom_id": atom_ids[index] if index < len(atom_ids) else "",
                  "position": index + 1,
                  "length": len(sequence),
                  "prev": sequence[index - 1] if index > 0 else "",
                  "next": sequence[index + 1] if index < len(sequence) - 1 else "",
                  "window": " ".join(sequence[max(0, index - 3):index + 4]),
                  "sequence": " ".join(sequence),
              })

    print(f"atoms: {atoms_path}")
    print(f"tokens: {', '.join(sorted(tokens))}")
    print(f"total_hits: {len(rows)}")
    counts = Counter(row["token"] for row in rows)
    print("counts:", " ".join(f"{token}={counts[token]}" for token in sorted(counts)))

    for token in sorted(tokens):
        token_rows = [row for row in rows if row["token"] == token]
        print(f"\n== {token} ==")
        print(f"hits: {len(token_rows)}")
        pair_counts = Counter((row["prev"], row["next"]) for row in token_rows)
        print("prev_next:")
        for (prev, next_), count in pair_counts.most_common():
            print(f"  {count}\tprev={prev or '<START>'}\tnext={next_ or '<END>'}")
        print("cases:")
        for row in token_rows:
            print(
                f"  {row['unit_id']}\t{row['page_image']}\tR{row['row']}\t{row['molecule_id']}"
                f"\tatom_id={row['atom_id']}\tpos={row['position']}/{row['length']}"
                f"\twindow={row['window']}"
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
