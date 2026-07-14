# Audit Methodology — CORPUS-V2-AUDITED

## How candidates were identified

Three detection channels, each feeding into the visual review pipeline:

### 1. Atlas visual inspection

The `atom-atlas/` export grouped all instances of each ATOMS class on a single page. Scanning these groups by eye revealed:
- Instances whose morphology did not match the class definition
- Accidental clicks producing zero-area strokes

### 2. Geometric outlier detection

Per-atom features (n-points, bounding box, gap, trajectory length, aspect ratio, compactness, mid-offset) were computed from SVG polyline data. For each class, median and MAD-based thresholds were calculated. Atoms with 2+ features exceeding ±5×MAD were flagged as intra-class candidates.

### 3. Cross-class confusion detection

Each atom's feature vector was compared to all class centroids. Atoms whose nearest centroid was a different class (and whose distance to own centroid exceeded a threshold) were flagged as cross-class candidates.

## How decisions were made

Each candidate was presented to the human reviewer via the QC review tool (`apps/qc-review/`) with:

1. **Isolated stroke** — the atom's SVG polyline on a transparent background
2. **Manuscript context** — a 200×200 pixel crop from the full page image centered on the atom
3. **Current label** — the ATOMS class assigned in CORPUS-V1
4. **Suggested label** — the detector's best alternative (when applicable)
5. **Feature comparison** — the atom's feature values vs. class median and normal range
6. **Canonical examples** — 5 example atoms from the current class and 5 from the suggested class

The reviewer could select from these verdicts:

| Verdict | Meaning |
|---------|---------|
| `confirm` | Current label is correct; no change needed |
| `relabel` | Atom belongs to a different ATOMS class (specified) |
| `exclude_artifact` | Atom is an accidental click or degenerate stroke; remove from corpus |
| `ambiguous` | Cannot determine correct label without further evidence |
| `needs_context` | Need a larger manuscript context region to decide |

## What the detector did NOT do

- Did **not** auto-correct any labels
- Did **not** delete any records
- Did **not** redefine ATOMS-V1 class boundaries
- Did **not** modify the frozen CORPUS-V1 database

## Correction ledger

Every change is recorded in `corrections.tsv` with:
- atom ID, folio, old label, action, new label, reason, reviewer, date

The frozen CORPUS-V1 database remains untouched. The live working DB is the target for corrections, and a new frozen snapshot (CORPUS-V2-AUDITED) will be created when the round is complete.
