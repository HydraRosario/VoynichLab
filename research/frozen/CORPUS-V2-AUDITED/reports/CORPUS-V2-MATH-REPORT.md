# Corpus V2 Audited Math Report

Generated from the live DatasetCreator database after the geometry/order audit reached zero pending candidates.

## Scope

| Folio | Image | EVA units | ATOMS units |
| --- | --- | ---: | ---: |
| `f1r` | `page-003.jpg` | 210 | 198 |
| `f1v` | `page-004.jpg` | 90 | 90 |
| `f2r` | `page-005.jpg` | 99 | 104 |
| `f2v` | `page-006.jpg` | 61 | 57 |
| `f3r` | `page-007.jpg` | 115 | 107 |
| `f47v` | `page-094.jpg` | 85 | 83 |
| combined | six audited images | 660 | 639 |

Line alignment is clean at the line-count level: every included page has matching EVA-line count and physical-row count.

## Positional Entropy

| Scope | EVA H | ATOMS H | Delta ATOMS - EVA |
| --- | ---: | ---: | ---: |
| `f1r / page-003` | 0.7669 | 0.5096 | -0.2573 |
| `f1v / page-004` | 0.7182 | 0.5487 | -0.1695 |
| `f2r / page-005` | 0.7050 | 0.5934 | -0.1116 |
| `f2v / page-006` | 0.5163 | 0.5136 | -0.0027 |
| `f3r / page-007` | 0.6690 | 0.4820 | -0.1870 |
| `f47v / page-094` | 0.6974 | 0.5225 | -0.1749 |
| combined six-page corpus | 0.7688 | 0.5409 | -0.2279 |

ATOMS has lower weighted positional entropy than EVA on every included page. The smallest margin is `f2v`, where the two systems are almost tied.

## Combined Vocabulary

- ATOMS physical units: `639`.
- ATOMS atom tokens: `6222`.
- ATOMS vocabulary: `16`.
- EVA units: `660`.
- EVA symbol tokens: `2551`.
- EVA vocabulary: `26`.

ATOMS symbol counts:

| Symbol | Count |
| --- | ---: |
| `e:1` | 1763 |
| `c:1` | 924 |
| `f:1` | 636 |
| `a:1` | 570 |
| `g:1` | 408 |
| `d:1` | 335 |
| `i:1` | 330 |
| `h:1` | 277 |
| `b:1` | 246 |
| `h:2` | 197 |
| `j:1` | 160 |
| `n:1` | 104 |
| `m:1` | 92 |
| `k:1` | 84 |
| `c:2` | 57 |
| `l:1` | 39 |

## Strong Local Rules

Lowest next-token entropy in the combined corpus:

| Condition | Dominant next token | Count | Share | H |
| --- | --- | ---: | ---: | ---: |
| `l:1` | `f:1` | 39/39 | 1.0000 | 0.0000 |
| `g:1` | `e:1` | 405/408 | 0.9926 | 0.0627 |
| `k:1` | `f:1` | 82/84 | 0.9762 | 0.1623 |
| `m:1` | `c:1` | 90/92 | 0.9783 | 0.1728 |
| `n:1` | `e:1` | 95/104 | 0.9135 | 0.4909 |
| `i:1` | `d:1` | 295/328 | 0.8994 | 0.5698 |

Lowest previous-token entropy:

| Condition | Dominant previous token | Count | Share | H |
| --- | --- | ---: | ---: | ---: |
| `j:1` | `f:1` | 160/160 | 1.0000 | 0.0000 |
| `m:1` | `a:1` | 91/91 | 1.0000 | 0.0000 |
| `h:2` | `c:1`/`c:2` family | 197/197 | family-level 1.0000 | 0.3508 full-token |
| `k:1` | `f:1` | 79/84 | 0.9405 | 0.3833 |
| `d:1` | `i:1` | 295/335 | 0.8806 | 0.5933 |
| `h:1` | `e:1` | 245/277 | 0.8845 | 0.6101 |

## Role Rigidity

Top role-rigid ATOMS in the combined corpus:

| Symbol | Count | H(role) | Dominant role |
| --- | ---: | ---: | --- |
| `g:1` | 408 | 0.0000 | medial 100.00% |
| `b:1` | 246 | 0.0000 | medial 100.00% |
| `k:1` | 84 | 0.0000 | medial 100.00% |
| `l:1` | 39 | 0.0000 | medial 100.00% |
| `f:1` | 636 | 0.0307 | medial 99.69% |
| `i:1` | 330 | 0.0534 | medial 99.39% |
| `m:1` | 92 | 0.0865 | medial 98.91% |
| `h:2` | 197 | 0.2678 | medial 95.43% |

## Variant Ablation

| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: |
| Full variants | 6222 | 16 | 0.5409 | 8 |
| Families merged | 6222 | 14 | 0.5788 | 7 |

The current variant split still helps positional stability. The strongest split is `h`, where full variants reduce entropy from `1.0000` merged to `0.5094` weighted split.

## Macro Lexeme Probe

The exploratory macro merge maps `g:1`, `i:1`, `b:1`, `k:1`, and `m:1` into `MEDIAL_OP`.

- Original vocabulary: `16`.
- Macro vocabulary: `12`.
- Original unique molecule signatures: `414`.
- Macro unique lexeme signatures: `406`.
- `MEDIAL_OP`: 1160 tokens, H(role)=`0.0283`, medial share `99.74%`.

Top macro lexemes:

| Count | Macro signature |
| ---: | --- |
| 28 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` |
| 19 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` |
| 14 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` |
| 11 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` |
| 10 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` |
| 10 | `e:1 MEDIAL_OP e:1 e:1 h:1` |

## Morphology Family Analysis

The morphology test was included in the replay after optimizing the leave-one-out implementation.

- Raw atoms read: `6222`.
- Eligible symbols: `16`.
- Nearest-centroid accuracy: `0.9298`.
- 5-nearest-neighbor accuracy: `0.9785`.
- Mean separation ratio: `1.8552`.
- Median separation ratio: `1.0933`.

Strongest current morphology families:

| Symbol | Count | Separation ratio | kNN accuracy | Nearest competitor |
| --- | ---: | ---: | ---: | --- |
| `f:1` | 636 | 6.7185 | 0.9937 | `b:1` |
| `c:2` | 57 | 5.6370 | 1.0000 | `m:1` |
| `e:1` | 1763 | 3.8367 | 0.9983 | `h:2` |
| `j:1` | 160 | 2.2658 | 0.9688 | `h:1` |
| `a:1` | 570 | 1.3534 | 0.9912 | `h:2` |

Most confusable current morphology families:

| Symbol | Count | Separation ratio | kNN accuracy | Nearest competitor |
| --- | ---: | ---: | ---: | --- |
| `n:1` | 104 | 0.6227 | 0.7981 | `d:1` |
| `d:1` | 335 | 0.6658 | 0.9433 | `g:1` |
| `b:1` | 246 | 0.7383 | 0.9512 | `g:1` |
| `i:1` | 330 | 0.7601 | 0.9879 | `h:2` |
| `m:1` | 92 | 0.7701 | 0.8913 | `b:1` |

## Quality Gates

- Geometry-order pending candidates: `0` with the explicit `n:1` over `e:1 g:1 e:1` vertical-superposition convention enabled.
- Labeling anomaly candidates: `0` after applying the shared known-anomaly table.
- Learning-memory problems: `0` after removing the single stale molecule-order signature left by the temporary no-cut `page-005` state.
- Line-count alignment: all six pages match.

## Note On The Page-005 Cut Decision

The final run includes the restoration of the cut near the former `img5-m51` / `img5-m50` region. The restored cut separates `c:1 f:1 j:1` from the following `n:1 e:1 g:1 e:1 ...` molecule, returns `page-005.jpg` to `104` physical units, and keeps geometry-order candidates at `0`.

Compared with the temporary no-cut run, the restored-cut state changed:

- Combined ATOMS units: `638` -> `639`.
- Combined ATOMS H: `0.5412` -> `0.5409`.
- `f2r/page-005` ATOMS H: `0.5954` -> `0.5934`.

The `n:1` over `e:1 g:1 e:1` convention remains part of the audit rules for true vertical-superposition cases, but the restored cut is the cleaner state for this specific region.
