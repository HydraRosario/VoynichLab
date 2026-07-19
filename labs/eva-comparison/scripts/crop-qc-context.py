#!/usr/bin/env python3
"""Crop manuscript context images around candidate anomaly atoms."""
import argparse, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JSON_PATH = os.path.join(ROOT, "research", "audits", "anomaly-candidates.json")
ROUNDS_PATH = os.path.join(ROOT, "research", "audits", "qc-rounds.json")
PAGE_DIR = os.path.join(ROOT, "apps", "dataset-creator", "manuscript-pages-yale")
SNAPSHOT_ATOMS = os.path.join(ROOT, "labs", "eva-comparison", "artifacts", "visual-snapshots", "current", "atoms")
OUT_DIR = os.path.join(ROOT, "apps", "portal", "data", "qc-context")
CROP_SIZE = 200
PAD = 60

os.makedirs(OUT_DIR, exist_ok=True)

with open(JSON_PATH, "r") as f:
    data = json.load(f)

with open(ROUNDS_PATH, "r") as f:
    rounds_config = json.load(f)

rounds = rounds_config.get("rounds", {})
default_round = rounds_config.get("defaultRound") or next(iter(rounds), None)
if not default_round:
    raise SystemExit("No QC rounds are defined in research/audits/qc-rounds.json")

parser = argparse.ArgumentParser(description="Crop QC context images for a review round.")
parser.add_argument("--round", default=default_round, choices=sorted(rounds), help="QC round to export.")
args = parser.parse_args()
focus_ids = set(rounds[args.round].get("focusIds", []))

candidates = data.get("intraClassCandidates", [])
candidates = [c for c in candidates if c["id"] in focus_ids]
# Also add any confusion candidates we need
print(f"Round: {args.round}")
print(f"Focus candidates: {len(candidates)}")
pages_needed = set()
for c in candidates:
    if c.get("bounds") and c.get("image"):
        pages_needed.add(c["image"])

print(f"Found {len(candidates)} candidates across {len(pages_needed)} pages")

cropped = 0
svgs_copied = 0
missing_page = 0
no_bounds = 0

for c in candidates:
    img_name = c.get("image")
    bounds = c.get("bounds")
    if not img_name or not bounds:
        no_bounds += 1
        continue

    page_path = os.path.join(PAGE_DIR, img_name)
    if not os.path.exists(page_path):
        missing_page += 1
        continue

    img = Image.open(page_path)
    cx = bounds["x"] + bounds["w"] // 2
    cy = bounds["y"] + bounds["h"] // 2
    half = CROP_SIZE // 2
    left = max(0, cx - half - PAD)
    upper = max(0, cy - half - PAD)
    right = min(img.width, cx + half + PAD)
    lower = min(img.height, cy + half + PAD)
    crop = img.crop((left, upper, right, lower))

    out_name = f"{c['id']}.jpg"
    out_path = os.path.join(OUT_DIR, out_name)
    crop.save(out_path, "JPEG", quality=85)
    cropped += 1

    # Also copy the atom SVG
    label_dir = c["label"].replace(":", "_")
    svg_src = os.path.join(SNAPSHOT_ATOMS, label_dir, img_name, f"{c['id']}.svg")
    if os.path.exists(svg_src):
        svg_dst = os.path.join(OUT_DIR, f"{c['id']}.svg")
        with open(svg_src, "r") as sf:
            svg_content = sf.read()
        with open(svg_dst, "w") as sf:
            sf.write(svg_content)
        svgs_copied += 1

print(f"Cropped: {cropped}, SVGs copied: {svgs_copied}, No bounds: {no_bounds}, Missing page: {missing_page}")
print(f"Output: {OUT_DIR}")
