# EVA Question-Mark Sensitivity

Purpose: audit whether the EVA `?` symbol materially changes REPRESENTATION-COMPARISON-V2-REGIONS.

The original regional comparison is preserved. This file adds predefined sensitivity treatments rather than silently removing or recoding `?` after seeing the result.

## Question-Mark Counts

| Folio | `?` occurrences | Regions containing `?` | Train/Test |
| --- | ---: | ---: | --- |
| `f1r` | 10 | 7 | train |
| `f1v` | 0 | 0 | train |
| `f2r` | 0 | 0 | test |
| `f2v` | 0 | 0 | test |
| `f47v` | 0 | 0 | train |

## Regional Counts

| Split | Regions | Regions containing `?` |
| --- | ---: | ---: |
| train | 144 | 7 |
| test | 65 | 0 |

## Treatments

- `original_keep_question`: `?` is kept as an EVA symbol.
- `exclude_question_regions`: Every region containing `?` is excluded for both representations.
- `question_non_evaluable`: Regions are kept, but EVA opportunities touching `?` as left, observed, or right symbol are skipped.

## Metrics

| Treatment | Representation | Scope | Train regions | Test regions | Opps | Skipped `?` opps | Unseen ctx | Norm log-loss | Top-1 | Mean P(obs) |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `original_keep_question` | ATOMS | `combined` | 144 | 65 | 1336 | 0 | 46.18% | 0.807922 | 42.96% | 0.136948 |
| `original_keep_question` | ATOMS | `f2r` | 144 | 42 | 852 | 0 | 46.24% | 0.809951 | 43.90% | 0.135196 |
| `original_keep_question` | ATOMS | `f2v` | 144 | 23 | 484 | 0 | 46.07% | 0.804350 | 41.32% | 0.140033 |
| `original_keep_question` | EVA | `combined` | 139 | 65 | 597 | 0 | 60.47% | 0.892706 | 26.30% | 0.088944 |
| `original_keep_question` | EVA | `f2r` | 139 | 42 | 356 | 0 | 63.76% | 0.897576 | 25.28% | 0.086747 |
| `original_keep_question` | EVA | `f2v` | 139 | 23 | 241 | 0 | 55.60% | 0.885512 | 27.80% | 0.092189 |
| `exclude_question_regions` | ATOMS | `combined` | 137 | 65 | 1336 | 0 | 46.26% | 0.809516 | 42.81% | 0.135658 |
| `exclude_question_regions` | ATOMS | `f2r` | 137 | 42 | 852 | 0 | 46.36% | 0.812339 | 43.66% | 0.133229 |
| `exclude_question_regions` | ATOMS | `f2v` | 137 | 23 | 484 | 0 | 46.07% | 0.804546 | 41.32% | 0.139935 |
| `exclude_question_regions` | EVA | `combined` | 132 | 65 | 597 | 0 | 61.64% | 0.896437 | 25.46% | 0.087621 |
| `exclude_question_regions` | EVA | `f2r` | 132 | 42 | 356 | 0 | 65.45% | 0.903928 | 23.88% | 0.084514 |
| `exclude_question_regions` | EVA | `f2v` | 132 | 23 | 241 | 0 | 56.02% | 0.885371 | 27.80% | 0.092210 |
| `question_non_evaluable` | ATOMS | `combined` | 144 | 65 | 1336 | 0 | 46.18% | 0.807922 | 42.96% | 0.136948 |
| `question_non_evaluable` | ATOMS | `f2r` | 144 | 42 | 852 | 0 | 46.24% | 0.809951 | 43.90% | 0.135196 |
| `question_non_evaluable` | ATOMS | `f2v` | 144 | 23 | 484 | 0 | 46.07% | 0.804350 | 41.32% | 0.140033 |
| `question_non_evaluable` | EVA | `combined` | 139 | 65 | 597 | 0 | 60.47% | 0.892706 | 26.30% | 0.088944 |
| `question_non_evaluable` | EVA | `f2r` | 139 | 42 | 356 | 0 | 63.76% | 0.897576 | 25.28% | 0.086747 |
| `question_non_evaluable` | EVA | `f2v` | 139 | 23 | 241 | 0 | 55.60% | 0.885512 | 27.80% | 0.092189 |

## Reading

- `original_keep_question`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.
- `exclude_question_regions`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.
- `question_non_evaluable`: normalized log-loss favors ATOMS; top-1 favors ATOMS; unseen-context rate favors ATOMS.

The `?` handling does not replace the original V2 regional result; it bounds one transcription-uncertainty objection.
