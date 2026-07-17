#!/usr/bin/env python3
"""Create manuscript-context crops for a Corpus V3 candidate queue."""
import argparse
import csv
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

parser = argparse.ArgumentParser(description="Crop manuscript context for V3 QC candidates.")
parser.add_argument("--candidates", required=True)
parser.add_argument("--particles", required=True)
parser.add_argument("--out-dir", required=True)
parser.add_argument("--limit", type=int, default=0, help="Optional candidate limit; 0 exports all.")
parser.add_argument("--padding", type=int, default=100)
args = parser.parse_args()

candidate_path = Path(args.candidates).resolve()
particle_path = Path(args.particles).resolve()
out_dir = Path(args.out_dir).resolve()
page_dir = ROOT / "DataSetCreator" / "manuscript-pages-yale"
out_dir.mkdir(parents=True, exist_ok=True)

with candidate_path.open("r", encoding="utf-8") as handle:
    queue = json.load(handle)
if queue.get("status") != "CANDIDATES_NOT_DECISIONS":
    raise SystemExit("Refusing an unmarked candidate queue")

with particle_path.open("r", encoding="utf-8", newline="") as handle:
    particles = {row["particle_id"]: row for row in csv.DictReader(handle, delimiter="\t")}

candidates = queue.get("candidates", [])
if args.limit > 0:
    candidates = candidates[: args.limit]

manifest = []
for rank, candidate in enumerate(candidates, start=1):
    particle_id = str(candidate["particle_id"])
    particle = particles.get(particle_id)
    if not particle:
        raise SystemExit(f"Candidate particle missing from corpus export: {particle_id}")
    image_name = particle["image_name"]
    page_path = page_dir / image_name
    if not page_path.exists():
        raise SystemExit(f"Manuscript page missing: {page_path}")

    x = float(particle["bounds_x"])
    y = float(particle["bounds_y"])
    w = float(particle["bounds_w"])
    h = float(particle["bounds_h"])
    with Image.open(page_path) as image:
        left = max(0, int(x - args.padding))
        upper = max(0, int(y - args.padding))
        right = min(image.width, int(x + w + args.padding))
        lower = min(image.height, int(y + h + args.padding))
        crop = image.crop((left, upper, right, lower))
        filename = f"{rank:04d}-particle-{particle_id}.jpg"
        crop.save(out_dir / filename, "JPEG", quality=90)

    manifest.append({
        "rank": rank,
        "particle_id": particle_id,
        "atom_id": candidate.get("atom_id"),
        "molecule_id": candidate.get("molecule_id"),
        "token": candidate.get("token"),
        "candidate_feature": candidate.get("feature"),
        "robust_z": candidate.get("robust_z"),
        "image_name": image_name,
        "context_image": filename,
        "status": "CANDIDATE_NOT_DECISION",
    })

with (out_dir / "context-manifest.json").open("w", encoding="utf-8") as handle:
    json.dump({"status": "CANDIDATES_NOT_DECISIONS", "count": len(manifest), "candidates": manifest}, handle, indent=2)
    handle.write("\n")

print(json.dumps({"status": "CANDIDATES_NOT_DECISIONS", "contexts": len(manifest), "output": str(out_dir)}, indent=2))
