# VOYNICHLAB V1 FROZEN 2026-07-13

Status: pre-validation frozen development corpus.

This snapshot preserves the V1 model state before labeling the next unseen validation folio.

## Corpus

- Development folios: `f1r`, `f1v`, `f47v`.
- DatasetCreator images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`.
- EVA lines: `48`.
- EVA tokens: `385`.
- Physical units: `370`.
- Atomic instances: `3621`.
- Active atom families: `16`.
- Pending labeling anomalies: `0`.
- Known anomalies: `3`.

## Main Metrics

- ATOMS weighted relative entropy: `0.3366`.
- EVA weighted relative entropy: `0.4934`.
- Morphology kNN accuracy: `0.9724`.
- Morphology nearest-centroid accuracy: `0.9406`.
- Visual snapshots generated: `5407`.

## Included Files

- `datasetcreator-v1-frozen.db`: frozen copy of the live DatasetCreator SQLite database.
- `FINAL-COMPLETE-REPORT.md`: complete report with entropy, rules, morphology, exceptions, anomalies, and snapshot inventory.
- `CURRENT-COMPRESSED-REPORT.md`: compact executive report.
- `atom-symbols.md`: active atom vocabulary.
- `known-labeling-anomalies.tsv`: known anomalies intentionally excluded from the pending audit queue.

## Git

- Base commit before frozen snapshot packaging: `f62111f8dacadbc0eec5e07f628ec8942f2ba4ab`.
- Intended tag: `v1-pre-validation`.

## Freeze Rules

- Do not modify the V1 development corpus while evaluating the next page.
- Do not change atom families, segmentation rules, or prior labels to make validation results cleaner.
- If a real error is discovered in V1 during validation, record it as an issue/anomaly instead of silently editing V1.
- The next truly unseen folio should be evaluated separately first, then combined only after page-level results are reported.
