# REPRESENTATION-COMPARISON-V3-ABLATIONS

Purpose: test whether the exploratory ATOMS advantage from V2 survives removal or simplification of representation-dependent contextual features.

This is a predefined ablation suite. It does not add model variants after seeing results.

## Inputs

- Alignment: `out/representation-alignment-v1/aligned-regions.tsv`.
- ATOMS units: `EVAComparisonLab/cases/<folio>-full/atoms-current.tsv`.
- Train folios: `f1r`, `f1v`, `f47v`.
- Test folios: `f2r`, `f2v`.
- Smoothing: Lidstone `alpha=0.5`.
- ATOMS vocabulary: fixed 16-symbol ATOMS-V1 inventory.
- EVA vocabulary: 19 symbols from the configured EVA source tables: `? a c d e f h i k l m n o p q r s t y`.

## Models

| Model | Label | Features |
| --- | --- | --- |
| `MODEL_0` | Unigram baseline | No contextual features; symbol frequency only. |
| `MODEL_1` | Neighbors only | Immediate left and right symbols only. |
| `MODEL_2` | Neighbors plus coarse position | Immediate neighbors plus first/middle/final third. |
| `MODEL_3` | Published V2 exact-length model | Immediate neighbors, current medial role, and exact regional sequence length. |
| `MODEL_4` | Neighbors plus coarse position and train-defined length bins | Immediate neighbors, first/middle/final third, and short/medium/long bin from representation-specific train tertiles. |

MODEL_4 length bins are representation-specific train tertiles computed from training regions only. Test lengths do not set bin boundaries.

## Combined Results

| Subset | Model | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 | ATOMS unseen | EVA unseen | Delta unseen |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `all` | `MODEL_0` | 0.827423 | 0.872674 | -0.045251 | 28.74% | 15.91% | 12.83% | 0.00% | 0.00% | 0.00% |
| `all` | `MODEL_1` | 0.242737 | 0.431970 | -0.189234 | 79.19% | 66.50% | 12.69% | 0.97% | 2.68% | -1.71% |
| `all` | `MODEL_2` | 0.310095 | 0.553298 | -0.243202 | 79.42% | 62.98% | 16.43% | 2.02% | 9.72% | -7.69% |
| `all` | `MODEL_3` | 0.807922 | 0.892706 | -0.084784 | 42.96% | 26.30% | 16.67% | 46.18% | 60.47% | -14.29% |
| `all` | `MODEL_4` | 0.426049 | 0.683648 | -0.257599 | 74.33% | 54.27% | 20.05% | 6.36% | 22.45% | -16.08% |
| `medium` | `MODEL_0` | 0.775557 | 0.848171 | -0.072614 | 31.58% | 19.35% | 12.22% | 0.00% | 0.00% | 0.00% |
| `medium` | `MODEL_1` | 0.527597 | 0.852534 | -0.324937 | 61.84% | 29.03% | 32.81% | 10.53% | 41.94% | -31.41% |
| `medium` | `MODEL_2` | 0.629963 | 0.876742 | -0.246779 | 51.32% | 22.58% | 28.74% | 21.05% | 51.61% | -30.56% |
| `medium` | `MODEL_3` | 0.843689 | 0.943992 | -0.100303 | 38.16% | 16.13% | 22.03% | 48.68% | 74.19% | -25.51% |
| `medium` | `MODEL_4` | 0.804723 | 0.949689 | -0.144966 | 39.47% | 16.13% | 23.34% | 38.16% | 70.97% | -32.81% |
| `medium_low_medium` | `MODEL_0` | 0.828641 | 0.847427 | -0.018786 | 25.31% | 12.70% | 12.61% | 0.00% | 0.00% | 0.00% |
| `medium_low_medium` | `MODEL_1` | 0.420332 | 0.723104 | -0.302772 | 71.60% | 53.97% | 17.64% | 5.56% | 26.98% | -21.43% |
| `medium_low_medium` | `MODEL_2` | 0.547244 | 0.804048 | -0.256804 | 62.35% | 38.10% | 24.25% | 16.67% | 41.27% | -24.60% |
| `medium_low_medium` | `MODEL_3` | 0.819184 | 0.911102 | -0.091918 | 37.65% | 22.22% | 15.43% | 47.53% | 68.25% | -20.72% |
| `medium_low_medium` | `MODEL_4` | 0.695897 | 0.890935 | -0.195038 | 51.85% | 28.57% | 23.28% | 29.01% | 61.90% | -32.89% |
| `one_to_one` | `MODEL_0` | 0.828641 | 0.847427 | -0.018786 | 25.31% | 12.70% | 12.61% | 0.00% | 0.00% | 0.00% |
| `one_to_one` | `MODEL_1` | 0.420332 | 0.723104 | -0.302772 | 71.60% | 53.97% | 17.64% | 5.56% | 26.98% | -21.43% |
| `one_to_one` | `MODEL_2` | 0.547244 | 0.804048 | -0.256804 | 62.35% | 38.10% | 24.25% | 16.67% | 41.27% | -24.60% |
| `one_to_one` | `MODEL_3` | 0.819184 | 0.911102 | -0.091918 | 37.65% | 22.22% | 15.43% | 47.53% | 68.25% | -20.72% |
| `one_to_one` | `MODEL_4` | 0.695897 | 0.890935 | -0.195038 | 51.85% | 28.57% | 23.28% | 29.01% | 61.90% | -32.89% |
| `exclude_unresolved_eva_lines` | `MODEL_0` | 0.828923 | 0.875600 | -0.046677 | 28.55% | 15.44% | 13.10% | 0.00% | 0.00% | 0.00% |
| `exclude_unresolved_eva_lines` | `MODEL_1` | 0.246852 | 0.450557 | -0.203705 | 79.17% | 65.83% | 13.34% | 1.17% | 2.90% | -1.73% |
| `exclude_unresolved_eva_lines` | `MODEL_2` | 0.321316 | 0.577518 | -0.256203 | 79.17% | 61.58% | 17.59% | 2.42% | 11.20% | -8.77% |
| `exclude_unresolved_eva_lines` | `MODEL_3` | 0.849665 | 0.920282 | -0.070617 | 34.47% | 19.31% | 15.17% | 57.72% | 72.97% | -15.25% |
| `exclude_unresolved_eva_lines` | `MODEL_4` | 0.460183 | 0.717654 | -0.257471 | 73.88% | 50.77% | 23.11% | 7.99% | 28.57% | -20.58% |

Negative normalized-log-loss delta favors ATOMS. Positive top-1 delta favors ATOMS. Negative unseen-context delta favors ATOMS.

## Held-Out Folio Results

| Subset | Model | Folio | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `all` | `MODEL_0` | `f2r` | 0.839619 | 0.892252 | -0.052634 | 27.58% | 13.76% | 13.82% |
| `all` | `MODEL_0` | `f2v` | 0.805955 | 0.843754 | -0.037800 | 30.79% | 19.09% | 11.70% |
| `all` | `MODEL_1` | `f2r` | 0.234972 | 0.448507 | -0.213535 | 81.69% | 65.45% | 16.24% |
| `all` | `MODEL_1` | `f2v` | 0.256404 | 0.407542 | -0.151137 | 74.79% | 68.05% | 6.74% |
| `all` | `MODEL_2` | `f2r` | 0.304856 | 0.561130 | -0.256274 | 80.99% | 64.04% | 16.94% |
| `all` | `MODEL_2` | `f2v` | 0.319319 | 0.541729 | -0.222409 | 76.65% | 61.41% | 15.24% |
| `all` | `MODEL_3` | `f2r` | 0.809951 | 0.897576 | -0.087625 | 43.90% | 25.28% | 18.62% |
| `all` | `MODEL_3` | `f2v` | 0.804350 | 0.885512 | -0.081162 | 41.32% | 27.80% | 13.52% |
| `all` | `MODEL_4` | `f2r` | 0.429838 | 0.709703 | -0.279865 | 74.30% | 53.65% | 20.64% |
| `all` | `MODEL_4` | `f2v` | 0.419379 | 0.645159 | -0.225781 | 74.38% | 55.19% | 19.19% |
| `medium` | `MODEL_0` | `f2r` | 0.780186 | 0.837698 | -0.057511 | 27.27% | 20.00% | 7.27% |
| `medium` | `MODEL_0` | `f2v` | 0.773671 | 0.853158 | -0.079487 | 33.33% | 19.05% | 14.29% |
| `medium` | `MODEL_1` | `f2r` | 0.516503 | 0.957278 | -0.440775 | 68.18% | 10.00% | 58.18% |
| `medium` | `MODEL_1` | `f2v` | 0.532117 | 0.802656 | -0.270539 | 59.26% | 38.10% | 21.16% |
| `medium` | `MODEL_2` | `f2r` | 0.600939 | 0.956098 | -0.355158 | 54.55% | 10.00% | 44.55% |
| `medium` | `MODEL_2` | `f2v` | 0.641787 | 0.838953 | -0.197166 | 50.00% | 28.57% | 21.43% |
| `medium` | `MODEL_3` | `f2r` | 0.903520 | 1.006798 | -0.103278 | 27.27% | 0.00% | 27.27% |
| `medium` | `MODEL_3` | `f2v` | 0.819314 | 0.914085 | -0.094771 | 42.59% | 23.81% | 18.78% |
| `medium` | `MODEL_4` | `f2r` | 0.760954 | 0.976285 | -0.215331 | 40.91% | 10.00% | 30.91% |
| `medium` | `MODEL_4` | `f2v` | 0.822555 | 0.937024 | -0.114469 | 38.89% | 19.05% | 19.84% |
| `medium_low_medium` | `MODEL_0` | `f2r` | 0.855167 | 0.893323 | -0.038156 | 23.00% | 10.53% | 12.47% |
| `medium_low_medium` | `MODEL_0` | `f2v` | 0.785857 | 0.777664 | 0.008192 | 29.03% | 16.00% | 13.03% |
| `medium_low_medium` | `MODEL_1` | `f2r` | 0.407029 | 0.740388 | -0.333359 | 76.00% | 50.00% | 26.00% |
| `medium_low_medium` | `MODEL_1` | `f2v` | 0.441789 | 0.696832 | -0.255043 | 64.52% | 60.00% | 4.52% |
| `medium_low_medium` | `MODEL_2` | `f2r` | 0.539505 | 0.823215 | -0.283710 | 61.00% | 36.84% | 24.16% |
| `medium_low_medium` | `MODEL_2` | `f2v` | 0.559727 | 0.774914 | -0.215187 | 64.52% | 40.00% | 24.52% |
| `medium_low_medium` | `MODEL_3` | `f2r` | 0.872186 | 0.910388 | -0.038202 | 30.00% | 21.05% | 8.95% |
| `medium_low_medium` | `MODEL_3` | `f2v` | 0.733698 | 0.912188 | -0.178489 | 50.00% | 24.00% | 26.00% |
| `medium_low_medium` | `MODEL_4` | `f2r` | 0.648165 | 0.884509 | -0.236344 | 57.00% | 28.95% | 28.05% |
| `medium_low_medium` | `MODEL_4` | `f2v` | 0.772884 | 0.900701 | -0.127818 | 43.55% | 28.00% | 15.55% |
| `one_to_one` | `MODEL_0` | `f2r` | 0.855167 | 0.893323 | -0.038156 | 23.00% | 10.53% | 12.47% |
| `one_to_one` | `MODEL_0` | `f2v` | 0.785857 | 0.777664 | 0.008192 | 29.03% | 16.00% | 13.03% |
| `one_to_one` | `MODEL_1` | `f2r` | 0.407029 | 0.740388 | -0.333359 | 76.00% | 50.00% | 26.00% |
| `one_to_one` | `MODEL_1` | `f2v` | 0.441789 | 0.696832 | -0.255043 | 64.52% | 60.00% | 4.52% |
| `one_to_one` | `MODEL_2` | `f2r` | 0.539505 | 0.823215 | -0.283710 | 61.00% | 36.84% | 24.16% |
| `one_to_one` | `MODEL_2` | `f2v` | 0.559727 | 0.774914 | -0.215187 | 64.52% | 40.00% | 24.52% |
| `one_to_one` | `MODEL_3` | `f2r` | 0.872186 | 0.910388 | -0.038202 | 30.00% | 21.05% | 8.95% |
| `one_to_one` | `MODEL_3` | `f2v` | 0.733698 | 0.912188 | -0.178489 | 50.00% | 24.00% | 26.00% |
| `one_to_one` | `MODEL_4` | `f2r` | 0.648165 | 0.884509 | -0.236344 | 57.00% | 28.95% | 28.05% |
| `one_to_one` | `MODEL_4` | `f2v` | 0.772884 | 0.900701 | -0.127818 | 43.55% | 28.00% | 15.55% |
| `exclude_unresolved_eva_lines` | `MODEL_0` | `f2r` | 0.844737 | 0.895523 | -0.050787 | 27.13% | 13.07% | 14.06% |
| `exclude_unresolved_eva_lines` | `MODEL_0` | `f2v` | 0.802892 | 0.846842 | -0.043950 | 30.88% | 18.87% | 12.01% |
| `exclude_unresolved_eva_lines` | `MODEL_1` | `f2r` | 0.237660 | 0.469239 | -0.231579 | 82.11% | 64.38% | 17.73% |
| `exclude_unresolved_eva_lines` | `MODEL_1` | `f2v` | 0.261983 | 0.423593 | -0.161610 | 74.35% | 67.92% | 6.42% |
| `exclude_unresolved_eva_lines` | `MODEL_2` | `f2r` | 0.313305 | 0.585715 | -0.272410 | 81.53% | 62.75% | 18.78% |
| `exclude_unresolved_eva_lines` | `MODEL_2` | `f2v` | 0.334502 | 0.565687 | -0.231185 | 75.30% | 59.91% | 15.39% |
| `exclude_unresolved_eva_lines` | `MODEL_3` | `f2r` | 0.845521 | 0.924455 | -0.078934 | 36.08% | 18.30% | 17.77% |
| `exclude_unresolved_eva_lines` | `MODEL_3` | `f2v` | 0.856488 | 0.914260 | -0.057771 | 31.83% | 20.75% | 11.07% |
| `exclude_unresolved_eva_lines` | `MODEL_4` | `f2r` | 0.463413 | 0.743428 | -0.280016 | 74.46% | 49.35% | 25.11% |
| `exclude_unresolved_eva_lines` | `MODEL_4` | `f2v` | 0.454866 | 0.680451 | -0.225585 | 72.92% | 52.83% | 20.09% |

## MODEL_3 Regression Check

| Representation | Norm log-loss | Top-1 | Unseen-context | Matches V2 |
| --- | ---: | ---: | ---: | --- |
| ATOMS | 0.807922 | 42.96% | 46.18% | yes |
| EVA | 0.892706 | 26.30% | 60.47% | yes |

## Interpretation

- `MODEL_0`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors EVA.
- `MODEL_1`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.
- `MODEL_2`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.
- `MODEL_3`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.
- `MODEL_4`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.

ATOMS retains lower combined normalized log-loss without exact regional length in MODEL_1 and MODEL_2. The V2 advantage is therefore not solely dependent on exact length.

## Output Tables

- `representation-comparison-v3-summary.tsv`
- `representation-comparison-v3-folio-results.tsv`
