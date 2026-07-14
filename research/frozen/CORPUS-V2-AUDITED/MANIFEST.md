# CORPUS-V2-AUDITED Manifest

CORPUS-V2-AUDITED closes the six-folio annotation audit and robustness replay for the current VoynichLab ATOMS corpus.

## Scope

- Folios/images: f1r/page-003, f1v/page-004, f2r/page-005, f2v/page-006, f3r/page-007, f47v/page-094
- ATOMS units: 639
- EVA units: 660
- ATOMS atom tokens: 6,222
- ATOMS vocabulary: 16
- EVA symbol tokens: 2,551
- EVA vocabulary: 26

## Main replay result

| Representation | Weighted positional entropy |
|---|---:|
| EVA | 0.7688 |
| ATOMS | 0.5409 |
| ATOMS - EVA | -0.2279 |

ATOMS remains lower than EVA under the current six-folio corpus replay. This is a structural result, not a translation claim.

## Quality gates

| Gate | Result |
|---|---:|
| Pending labeling anomaly candidates | 0 |
| Pending particle geometry-order candidates | 0 |
| Pending stale learned-memory rows | 0 |
| Line alignment mismatches | 0 |

## Files

- `corpus/atoms.tsv` - final exported ATOMS units with atom ids and bounds.
- `corpus/molecules.tsv` - molecule-level sequence table derived from the ATOMS export.
- `corpus/rows.tsv` - EVA/ATOMS ordinal line-alignment audit.
- `corpus/folios.tsv` - per-folio replay summary.
- `reports/` - copied replay reports from the final run.
- `tables/` - supporting replay TSVs.
- `corrections.tsv` - QC and audit ledger for the campaign.
- `audit-summary.json` - machine-readable audit closure summary.
- `provenance.json` - source, script, and checksum provenance without absolute local paths.
- `checksums.txt` - SHA-256 checksums for this freeze.

## Boundary

This freeze preserves the audited corpus state and its replay outputs. It does not modify ATOMS-V1 definitions, EVA source transcription, previous V1 freezes, the f3r preregistration, or any historical tags.
