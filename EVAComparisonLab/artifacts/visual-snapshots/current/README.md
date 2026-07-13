# Visual Snapshots

Generated from DatasetCreator geometry. SVG files reference the original manuscript page image and overlay the hand-painted atom strokes.

## Counts

- Atoms: `3621`
- Particles: `1416`
- Molecules: `370`

## Files

- `visual-snapshots.db`: SQLite index for querying snapshots by token, signature, image, and entity.
- `visual-snapshots.tsv`: flat manifest with the same core metadata.
- `atoms/<token>/<image>/<atom-id>.svg`: one visual sample per labeled atom.
- `particles/<image>/<particle-id>.svg`: one sample per particle.
- `molecules/<image>/<molecule-id>.svg`: one sample per molecule.

These are evidence artifacts, not new labels. They should be regenerated from the source DB after label changes.
