# PROSPECTIVE-ATOMS-EVA-TEST-V1

Status: `completed`.
Outcome classification: `SUPPORTIVE`.

## Preregistered Target

- Folio: `f3r`
- DatasetCreator image: `page-007.jpg`
- Image ID: `7`
- ATOMS units/molecules in completed DB export: `107`

## Guardrail Verification

- Preregistration checksum verification: `passed`
- Published V3 regression verification: `passed`
- Training folios unchanged: `f1r, f1v, f47v`
- Previously evaluated folios not used for training update: `f2r, f2v`
- Target role: `test-only`

## Alignment Coverage

- Target aligned regions: `39`
- Target unresolved regions: `0`
- Target line pairs: `20`

## Primary Outcome

Primary preregistered metric: combined normalized held-out log-loss under `MODEL_1`, all aligned regions.

| Representation | Norm log-loss | Top-1 | Unseen context | Opportunities |
| --- | ---: | ---: | ---: | ---: |
| ATOMS | 0.348262 | 69.06% | 2.46% | 1057 |
| EVA | 0.564957 | 55.35% | 13.79% | 486 |
| ATOMS - EVA | -0.216696 | 13.71% | -11.33% |  |

Interpretation: ATOMS has lower MODEL_1 normalized log-loss in all regions and at least one higher-confidence subset.

## Frozen Vocabulary Integrity

- Out-of-vocabulary ATOMS in target folio: `0`
- None.

Negative normalized-log-loss delta favors ATOMS. Positive top-1 delta favors ATOMS. Negative unseen-context delta favors ATOMS.

## Model And Subset Results

| Subset | Model | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `all` | `MODEL_0` | 0.865765 | 0.949841 | -0.084076 | 23.37% | 13.37% | 9.99% |
| `all` | `MODEL_1` | 0.348262 | 0.564957 | -0.216696 | 69.06% | 55.35% | 13.71% |
| `all` | `MODEL_2` | 0.417798 | 0.668282 | -0.250484 | 69.44% | 49.18% | 20.26% |
| `all` | `MODEL_3` | 0.883163 | 0.930038 | -0.046875 | 30.56% | 16.67% | 13.89% |
| `all` | `MODEL_4` | 0.495986 | 0.741408 | -0.245421 | 66.04% | 43.42% | 22.62% |
| `medium` | `MODEL_0` | 0.850809 | 0.848725 | 0.002085 | 17.86% | 12.90% | 4.95% |
| `medium` | `MODEL_1` | 0.585677 | 0.773298 | -0.187621 | 58.33% | 38.71% | 19.62% |
| `medium` | `MODEL_2` | 0.715960 | 0.879813 | -0.163853 | 46.43% | 22.58% | 23.85% |
| `medium` | `MODEL_3` | 0.919711 | 0.922603 | -0.002893 | 29.76% | 19.35% | 10.41% |
| `medium` | `MODEL_4` | 0.845160 | 0.931959 | -0.086799 | 38.10% | 19.35% | 18.74% |
| `medium_low_medium` | `MODEL_0` | 0.820952 | 0.799601 | 0.021351 | 20.42% | 13.46% | 6.96% |
| `medium_low_medium` | `MODEL_1` | 0.478101 | 0.729446 | -0.251345 | 66.20% | 44.23% | 21.97% |
| `medium_low_medium` | `MODEL_2` | 0.602228 | 0.853943 | -0.251715 | 59.86% | 23.08% | 36.78% |
| `medium_low_medium` | `MODEL_3` | 0.856711 | 0.902295 | -0.045584 | 38.73% | 19.23% | 19.50% |
| `medium_low_medium` | `MODEL_4` | 0.743609 | 0.923079 | -0.179470 | 52.11% | 17.31% | 34.80% |
| `one_to_one` | `MODEL_0` | 0.820952 | 0.799601 | 0.021351 | 20.42% | 13.46% | 6.96% |
| `one_to_one` | `MODEL_1` | 0.478101 | 0.729446 | -0.251345 | 66.20% | 44.23% | 21.97% |
| `one_to_one` | `MODEL_2` | 0.602228 | 0.853943 | -0.251715 | 59.86% | 23.08% | 36.78% |
| `one_to_one` | `MODEL_3` | 0.856711 | 0.902295 | -0.045584 | 38.73% | 19.23% | 19.50% |
| `one_to_one` | `MODEL_4` | 0.743609 | 0.923079 | -0.179470 | 52.11% | 17.31% | 34.80% |
| `exclude_unresolved_eva_lines` | `MODEL_0` | 0.865774 | 0.947329 | -0.081555 | 23.37% | 13.37% | 9.99% |
| `exclude_unresolved_eva_lines` | `MODEL_1` | 0.364918 | 0.579370 | -0.214452 | 69.16% | 54.94% | 14.22% |
| `exclude_unresolved_eva_lines` | `MODEL_2` | 0.438780 | 0.682894 | -0.244114 | 67.93% | 47.53% | 20.40% |
| `exclude_unresolved_eva_lines` | `MODEL_3` | 0.911239 | 0.944117 | -0.032878 | 26.40% | 13.79% | 12.61% |
| `exclude_unresolved_eva_lines` | `MODEL_4` | 0.521853 | 0.756210 | -0.234357 | 65.28% | 43.42% | 21.86% |

## Corruption Test Summary

Corruption tests are reported for `MODEL_1`, preserving sequence length, first/last symbol, and internal symbol multiset.

| Subset | Representation | Regions | Real better than median | Mean real-minus-median bits |
| --- | --- | ---: | ---: | ---: |
| `all` | ATOMS | 39 | 100.00% | -92.551891 |
| `all` | EVA | 38 | 94.74% | -28.214310 |
| `medium` | ATOMS | 8 | 100.00% | -18.466961 |
| `medium` | EVA | 8 | 87.50% | -3.743694 |
| `medium_low_medium` | ATOMS | 15 | 100.00% | -20.645001 |
| `medium_low_medium` | EVA | 14 | 85.71% | -4.459275 |
| `one_to_one` | ATOMS | 15 | 100.00% | -21.146210 |
| `one_to_one` | EVA | 14 | 85.71% | -4.495175 |
| `exclude_unresolved_eva_lines` | ATOMS | 39 | 100.00% | -89.244081 |
| `exclude_unresolved_eva_lines` | EVA | 38 | 94.74% | -26.879024 |

## Output Tables

- `folio-freeze-manifest.json`
- `line-alignment-audit.tsv`
- `aligned-regions.tsv`
- `unresolved-regions.tsv`
- `model-results.tsv`
- `subset-results.tsv`
- `region-scores.tsv`
- `corruption-results.tsv`
- `checksums.txt`
