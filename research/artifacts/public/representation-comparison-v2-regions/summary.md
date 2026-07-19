# REPRESENTATION-COMPARISON-V2-REGIONS

Purpose: compare ATOMS-V1 and EVA over the same aligned manuscript regions, without assuming one-to-one token correspondence.

This is an exploratory regional comparison. It is not a decipherment claim and not a final proof that either representation is globally superior.

## Inputs

- Alignment: `out/representation-alignment-v1/aligned-regions.tsv`.
- EVA source tokens: `EVAComparisonLab/cases/<folio>-full/eva-tokens.tsv`.
- ATOMS source units: `EVAComparisonLab/cases/<folio>-full/atoms.tsv`.

## Split And Vocabularies

- Train folios: `f1r`, `f1v`, `f47v`.
- Test folios: `f2r`, `f2v`.
- Smoothing: Lidstone alpha=`0.5`.
- ATOMS vocabulary: fixed ATOMS-V1 inventory, 16 symbols.
- EVA vocabulary: fixed EVA symbol inventory observed in the configured EVA source tables, 19 symbols: `? a c d e f h i k l m n o p q r s t y`.

For every aligned region, EVA is scored as the character stream of all EVA tokens assigned to that region. ATOMS is scored as the concatenated ATOMS stream of all physical units assigned to that region.

## Sensitivity Subsets

| Subset | Description | Train regions | Test regions |
| --- | --- | ---: | ---: |
| `all` | All aligned regions. | 144 | 65 |
| `medium` | Only medium-confidence regions. | 28 | 9 |
| `medium_low_medium` | Medium plus low-medium confidence regions. | 52 | 18 |
| `one_to_one` | Only 1:1 aligned regions. | 52 | 18 |
| `exclude_unresolved_eva_lines` | Regions whose line has no unresolved EVA token under ALIGNMENT-V1. | 122 | 51 |
| `relation_1_to_1` | Only relation type 1:1. | 52 | 18 |
| `relation_1_to_N` | Only relation type 1:N. | 6 | 2 |
| `relation_N_to_1` | Only relation type N:1. | 7 | 4 |
| `relation_N_to_M` | Only relation type N:M. | 79 | 41 |

Each subset trains and evaluates inside the same stratum. Small high-confidence strata should therefore be read as sensitivity checks, not as standalone decisive tests.

## Primary Regional Results

| Subset | Representation | Scope | Train regions | Test regions | Opps | Unseen ctx | Norm log-loss | Top-1 | Mean P(obs) | Bits/region |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `all` | ATOMS | `combined` | 144 | 65 | 1336 | 46.18% | 0.807922 | 42.96% | 0.136948 | 66.423599 |
| `all` | EVA | `combined` | 139 | 65 | 597 | 60.47% | 0.892706 | 26.30% | 0.088944 | 34.829430 |
| `medium` | ATOMS | `combined` | 28 | 9 | 76 | 48.68% | 0.843689 | 38.16% | 0.115203 | 28.497945 |
| `medium` | EVA | `combined` | 27 | 9 | 31 | 74.19% | 0.943992 | 16.13% | 0.069103 | 13.812260 |
| `medium_low_medium` | ATOMS | `combined` | 52 | 18 | 162 | 47.53% | 0.819184 | 37.65% | 0.135643 | 29.490635 |
| `medium_low_medium` | EVA | `combined` | 48 | 18 | 63 | 68.25% | 0.911102 | 22.22% | 0.082600 | 13.546034 |
| `one_to_one` | ATOMS | `combined` | 52 | 18 | 162 | 47.53% | 0.819184 | 37.65% | 0.135643 | 29.490635 |
| `one_to_one` | EVA | `combined` | 48 | 18 | 63 | 68.25% | 0.911102 | 22.22% | 0.082600 | 13.546034 |
| `exclude_unresolved_eva_lines` | ATOMS | `combined` | 122 | 51 | 1114 | 57.72% | 0.849665 | 34.47% | 0.121895 | 74.237437 |
| `exclude_unresolved_eva_lines` | EVA | `combined` | 118 | 51 | 518 | 72.97% | 0.920282 | 19.31% | 0.079794 | 39.706152 |
| `relation_1_to_1` | ATOMS | `combined` | 52 | 18 | 162 | 47.53% | 0.819184 | 37.65% | 0.135643 | 29.490635 |
| `relation_1_to_1` | EVA | `combined` | 48 | 18 | 63 | 68.25% | 0.911102 | 22.22% | 0.082600 | 13.546034 |
| `relation_1_to_N` | ATOMS | `combined` | 6 | 2 | 21 | 100.00% | 1.000000 | 0.00% | 0.062500 | 42.000000 |
| `relation_1_to_N` | EVA | `combined` | 5 | 2 | 6 | 100.00% | 1.000000 | 0.00% | 0.052632 | 12.743783 |
| `relation_N_to_1` | ATOMS | `combined` | 7 | 4 | 46 | 84.78% | 0.955607 | 17.39% | 0.075574 | 43.957926 |
| `relation_N_to_1` | EVA | `combined` | 7 | 4 | 21 | 100.00% | 1.000000 | 0.00% | 0.052632 | 22.301619 |
| `relation_N_to_M` | ATOMS | `combined` | 79 | 41 | 1107 | 50.59% | 0.826651 | 40.65% | 0.128609 | 89.278276 |
| `relation_N_to_M` | EVA | `combined` | 79 | 41 | 507 | 62.92% | 0.905528 | 24.26% | 0.083540 | 47.566716 |

### By Held-Out Folio

| Subset | Representation | Folio | Test regions | Opps | Unseen ctx | Norm log-loss | Top-1 | Bits/region |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `all` | ATOMS | `f2r` | 42 | 852 | 46.24% | 0.809951 | 43.90% | 65.721717 |
| `all` | ATOMS | `f2v` | 23 | 484 | 46.07% | 0.804350 | 41.32% | 67.705296 |
| `all` | EVA | `f2r` | 42 | 356 | 63.76% | 0.897576 | 25.28% | 32.318333 |
| `all` | EVA | `f2v` | 23 | 241 | 55.60% | 0.885512 | 27.80% | 39.414913 |
| `medium` | ATOMS | `f2r` | 3 | 22 | 72.73% | 0.903520 | 27.27% | 26.503258 |
| `medium` | ATOMS | `f2v` | 6 | 54 | 38.89% | 0.819314 | 42.59% | 29.495288 |
| `medium` | EVA | `f2r` | 3 | 10 | 80.00% | 1.006798 | 0.00% | 14.256018 |
| `medium` | EVA | `f2v` | 6 | 21 | 71.43% | 0.914085 | 23.81% | 13.590381 |
| `medium_low_medium` | ATOMS | `f2r` | 11 | 100 | 62.00% | 0.872186 | 30.00% | 31.715839 |
| `medium_low_medium` | ATOMS | `f2v` | 7 | 62 | 24.19% | 0.733698 | 50.00% | 25.993886 |
| `medium_low_medium` | EVA | `f2r` | 11 | 38 | 68.42% | 0.910388 | 21.05% | 13.359631 |
| `medium_low_medium` | EVA | `f2v` | 7 | 25 | 68.00% | 0.912188 | 24.00% | 13.838954 |
| `one_to_one` | ATOMS | `f2r` | 11 | 100 | 62.00% | 0.872186 | 30.00% | 31.715839 |
| `one_to_one` | ATOMS | `f2v` | 7 | 62 | 24.19% | 0.733698 | 50.00% | 25.993886 |
| `one_to_one` | EVA | `f2r` | 11 | 38 | 68.42% | 0.910388 | 21.05% | 13.359631 |
| `one_to_one` | EVA | `f2v` | 7 | 25 | 68.00% | 0.912188 | 24.00% | 13.838954 |
| `exclude_unresolved_eva_lines` | ATOMS | `f2r` | 32 | 693 | 55.70% | 0.845521 | 36.08% | 73.243221 |
| `exclude_unresolved_eva_lines` | ATOMS | `f2v` | 19 | 421 | 61.05% | 0.856488 | 31.83% | 75.911905 |
| `exclude_unresolved_eva_lines` | EVA | `f2r` | 32 | 306 | 75.82% | 0.924455 | 18.30% | 37.552109 |
| `exclude_unresolved_eva_lines` | EVA | `f2v` | 19 | 212 | 68.87% | 0.914260 | 20.75% | 43.334013 |
| `relation_1_to_1` | ATOMS | `f2r` | 11 | 100 | 62.00% | 0.872186 | 30.00% | 31.715839 |
| `relation_1_to_1` | ATOMS | `f2v` | 7 | 62 | 24.19% | 0.733698 | 50.00% | 25.993886 |
| `relation_1_to_1` | EVA | `f2r` | 11 | 38 | 68.42% | 0.910388 | 21.05% | 13.359631 |
| `relation_1_to_1` | EVA | `f2v` | 7 | 25 | 68.00% | 0.912188 | 24.00% | 13.838954 |
| `relation_1_to_N` | ATOMS | `f2r` | 2 | 21 | 100.00% | 1.000000 | 0.00% | 42.000000 |
| `relation_1_to_N` | ATOMS | `f2v` | 0 | 0 | 0.00% | 0.000000 | 0.00% | 0.000000 |
| `relation_1_to_N` | EVA | `f2r` | 2 | 6 | 100.00% | 1.000000 | 0.00% | 12.743783 |
| `relation_1_to_N` | EVA | `f2v` | 0 | 0 | 0.00% | 0.000000 | 0.00% | 0.000000 |
| `relation_N_to_1` | ATOMS | `f2r` | 4 | 46 | 84.78% | 0.955607 | 17.39% | 43.957926 |
| `relation_N_to_1` | ATOMS | `f2v` | 0 | 0 | 0.00% | 0.000000 | 0.00% | 0.000000 |
| `relation_N_to_1` | EVA | `f2r` | 4 | 21 | 100.00% | 1.000000 | 0.00% | 22.301619 |
| `relation_N_to_1` | EVA | `f2v` | 0 | 0 | 0.00% | 0.000000 | 0.00% | 0.000000 |
| `relation_N_to_M` | ATOMS | `f2r` | 25 | 685 | 49.78% | 0.823098 | 42.48% | 90.211553 |
| `relation_N_to_M` | ATOMS | `f2v` | 16 | 422 | 51.90% | 0.832417 | 37.68% | 87.820030 |
| `relation_N_to_M` | EVA | `f2r` | 25 | 291 | 67.01% | 0.908619 | 24.05% | 44.927467 |
| `relation_N_to_M` | EVA | `f2v` | 16 | 216 | 57.41% | 0.901364 | 24.54% | 51.690542 |

## Real Versus Corrupted Regions

For each test region, 100 corrupted alternatives were generated by shuffling only the internal symbols. Length, first/last symbols, and internal symbol multiset are preserved.

| Subset | Representation | Regions | Real better than median | Real better than all | Mean real-minus-median bits | Median real-minus-median bits |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `all` | ATOMS | 65 | 86.15% | 72.31% | -15.621426 | -12.295911 |
| `all` | EVA | 65 | 76.92% | 33.85% | -4.240551 | -3.025535 |
| `medium` | ATOMS | 9 | 66.67% | 33.33% | -5.180840 | -5.719044 |
| `medium` | EVA | 9 | 33.33% | 0.00% | -0.835534 | 0.000000 |
| `medium_low_medium` | ATOMS | 18 | 83.33% | 55.56% | -6.364554 | -6.379496 |
| `medium_low_medium` | EVA | 18 | 38.89% | 0.00% | -1.040090 | 0.000000 |
| `one_to_one` | ATOMS | 18 | 83.33% | 50.00% | -6.388726 | -6.354731 |
| `one_to_one` | EVA | 18 | 38.89% | 0.00% | -1.040090 | 0.000000 |
| `exclude_unresolved_eva_lines` | ATOMS | 51 | 74.51% | 62.75% | -13.210114 | -8.830075 |
| `exclude_unresolved_eva_lines` | EVA | 51 | 80.39% | 27.45% | -3.605913 | -2.736755 |
| `relation_1_to_1` | ATOMS | 18 | 83.33% | 50.00% | -6.306131 | -6.289403 |
| `relation_1_to_1` | EVA | 18 | 44.44% | 0.00% | -1.289080 | 0.000000 |
| `relation_1_to_N` | ATOMS | 2 | 0.00% | 0.00% | 0.000000 | 0.000000 |
| `relation_1_to_N` | EVA | 2 | 0.00% | 0.00% | 0.000000 | 0.000000 |
| `relation_N_to_1` | ATOMS | 4 | 75.00% | 25.00% | -2.250000 | -1.500000 |
| `relation_N_to_1` | EVA | 4 | 0.00% | 0.00% | 0.000000 | 0.000000 |
| `relation_N_to_M` | ATOMS | 41 | 78.05% | 73.17% | -18.675829 | -19.263034 |
| `relation_N_to_M` | EVA | 41 | 92.68% | 46.34% | -5.219792 | -4.466108 |

Negative real-minus-corrupted margin means the real region received a lower code length than corrupted versions.

## Interpretation

ATOMS is better on combined normalized log-loss under this regional protocol.

ATOMS is better on combined top-1 accuracy under this regional protocol.

ATOMS is better on combined unseen-context rate under this regional protocol.

Sensitivity read: medium: ATOMS favorable; medium_low_medium: ATOMS favorable; one_to_one: ATOMS favorable.

If the apparent winner changes across confidence strata, the result should be treated as alignment-sensitive rather than representation-level evidence.

## Output Tables

- `representation-comparison-v2-summary.tsv`
- `representation-comparison-v2-region-scores.tsv`
- `representation-comparison-v2-corruption.tsv`
