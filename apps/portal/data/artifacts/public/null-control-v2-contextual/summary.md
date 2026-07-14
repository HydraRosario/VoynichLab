# NULL-CONTROL-V2-CONTEXTUAL

Purpose: test whether the clean GRAMMAR-V1 substitution result remains rare under a contextual null model that preserves local structural opportunities.

This control keeps the frozen 19 substitution families unchanged and evaluates the same statistic as V1: every observed substitution family in `f2r` and `f2v` must reuse only frozen known slot values.

## Inputs

- Frozen grammar: `frozen/GRAMMAR-V1-2026-07-13`.
- Test folios: `f2r`, `f2v`.
- Validation command rerun by this script: `node scripts/validate-release-v1.js`.
- Simulation iterations: `100000`.
- RNG seed: `20260713`.

## Null Model

For each observed slot opportunity, replacement values are sampled only from atoms in the same test folio that match:

- same molecule length;
- same positional role: initial, medial, or final;
- same immediate left neighbor, when the slot is not initial;
- same immediate right neighbor, when the slot is not final.

Example: a slot shaped as `... f:1 [X] f:1 ...` is sampled from atoms that actually occur after `f:1` and before `f:1` in same-length test molecules.

The target observed molecules are included in the candidate pools. This makes the control conservative in favor of the null because real successful observations contribute to the pool of possible random draws.

## Observed Result

| Folio | Observed substitution families | Observed opportunities | New slot values |
| --- | ---: | ---: | ---: |
| `f2r` | 8 | 17 | 0 |
| `f2v` | 7 | 17 | 0 |

## Control Results

| Control | Clean joint simulations | Iterations | Estimated probability |
| --- | ---: | ---: | ---: |
| Contextual empirical null | 9909 | 100000 | 0.099090 |

Naive analytic contextual estimate under independence assumptions: `0.100000`.

## Per-Folio Contextual Probability

| Folio | Contextual analytic probability |
| --- | ---: |
| `f2r` | 0.200000 |
| `f2v` | 0.500000 |

## Candidate Pools

| Folio | Slot | Test Total | Context | Known Values | Candidate Values | Clean Probability |
| --- | ---: | ---: | --- | --- | --- | ---: |
| `f2r` | 6 | 4 | len=9; role=medial; f:1 [_] f:1 | `k:1 l:1` | `k:1:8 l:1:1` | 1.000000 |
| `f2r` | 2 | 3 | len=9; role=medial; e:1 [_] h:2 | `c:1 c:2` | `c:1:5` | 1.000000 |
| `f2r` | 8 | 3 | len=9; role=medial; f:1 [_] d:1 | `i:1 j:1` | `i:1:9` | 1.000000 |
| `f2r` | 7 | 3 | len=8; role=medial; f:1 [_] d:1 | `i:1 j:1` | `i:1:4` | 1.000000 |
| `f2r` | 8 | 1 | len=9; role=medial; f:1 [_] d:1 | `i:1 j:1` | `i:1:9` | 1.000000 |
| `f2r` | 5 | 1 | len=8; role=medial; e:1 [_] f:1 | `f:1 c:1` | `f:1:4` | 1.000000 |
| `f2r` | 5 | 1 | len=5; role=final; e:1 [_] END | `c:1 e:1` | `h:1:4 c:1:1` | 0.200000 |
| `f2r` | 8 | 1 | len=8; role=final; e:1 [_] END | `h:1 c:1` | `h:1:3` | 1.000000 |
| `f2v` | 6 | 4 | len=9; role=medial; f:1 [_] f:1 | `k:1 l:1` | `k:1:4` | 1.000000 |
| `f2v` | 2 | 4 | len=9; role=medial; e:1 [_] h:2 | `c:1 c:2` | `c:1:4` | 1.000000 |
| `f2v` | 8 | 4 | len=9; role=medial; f:1 [_] d:1 | `i:1 j:1` | `i:1:4` | 1.000000 |
| `f2v` | 5 | 2 | len=8; role=medial; e:1 [_] f:1 | `f:1 c:1` | `c:1:1 f:1:1` | 1.000000 |
| `f2v` | 5 | 1 | len=5; role=final; e:1 [_] END | `c:1 e:1` | `c:1:1 h:1:1` | 0.500000 |
| `f2v` | 1 | 1 | len=6; role=initial; START [_] e:1 | `n:1 c:1` | `n:1:1` | 1.000000 |
| `f2v` | 6 | 1 | len=6; role=final; e:1 [_] END | `h:1 c:1` | `h:1:2` | 1.000000 |

## Interpretation

Under this contextual control, the clean joint result is **not rare enough by itself**.

Important limitation: this still assumes candidate draws are exchangeable within a local context. It does not model higher-order family identity, cross-family overlap, scribal style, or annotator effects.

This control addresses the main weakness of NULL-CONTROL-V1 by avoiding global draws from the full atom inventory. It does not address the independent-annotation problem.

## Source Tables

- `null-control-v2-contextual-family-probabilities.tsv`
