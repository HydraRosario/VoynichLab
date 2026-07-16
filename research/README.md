# VoynichLab Research Record

This directory is the canonical entry point for the scientific record. Older
freezes remain in the laboratory that created them because their published
paths, manifests, scripts, checksums, commits, and tags are historical anchors.
Their location does not change their scientific type.

Start with [FROZEN-EVIDENCE.md](FROZEN-EVIDENCE.md) for a single map of every
frozen corpus, model, validation release, and public artifact.

## Current layout

| Area | Meaning |
|---|---|
| `frozen/` | Repository-level immutable releases, currently Corpus V2 |
| `preregistrations/` | Protocols frozen before results were observed |
| `audits/` | Canonical anomaly and quality-control ledgers |
| `corpus-revisions/` | Working material for a future corpus release; not frozen evidence |
| `notes/` | Exploratory research notes; not evidence |

Both labeling anomalies and particle-geometry exceptions have one canonical
ledger under `research/audits/`. Root-level `cases/` is retired; historical
references remain recoverable from the release tags that published them.

## Canonical policy from Corpus V3 onward

New corpus releases belong under:

```text
research/frozen/CORPUS-V3/
research/frozen/CORPUS-V4/
```

New model or protocol freezes also belong under `research/frozen/<release>/`
unless preserving them inside a self-contained package is necessary for an
already published reproduction contract.

Published experiment bundles remain under `artifacts/public/<experiment-id>/`.
They are derived, portal-consumable evidence bundles—not additional corpus
versions.

## Immutability rule

Do not move or rewrite a published freeze merely to make the tree look cleaner.
Create a new version, update this catalog, and preserve the historical path.
