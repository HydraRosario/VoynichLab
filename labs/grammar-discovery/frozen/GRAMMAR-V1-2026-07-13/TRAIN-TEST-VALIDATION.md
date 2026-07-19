# Train/Test Grammar Validation

Purpose: induce molecule families without `f2r`, then test whether `f2r` reuses the same restricted structures.

## Split

- Train folios: `f1r,f1v,f47v`.
- Test folio: `f2r`.
- Train molecules: `369`; unique signatures: `254`.
- Test molecules: `104`; unique signatures: `82`.

## Validation Summary

- Substitution families induced in train: `19`.
- Substitution families observed in test: `8`.
- Substitution families observed in test without new slot values: `8`.
- Optional families induced in train: `55`.
- Optional families with base or expansion observed in test: `38`.

## Priority Family A

Candidate productive optional-slot family:

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
X in {empty, k:1, l:1}
```

- Train base count, X=empty: `7`.
- Train expanded count: `18`; values: `k:1:10 l:1:8`.
- Test base count, X=empty: `3`.
- Test expanded known values: `4`; values: `k:1:3 l:1:1`.
- Test expanded new values: `0`.
- Test examples: `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1 (3) | e:1 c:1 h:2 e:1 f:1 l:1 f:1 i:1 d:1 (1)`.

Same frame as pure substitution among expanded forms:

- Train values: `k:1:10 l:1:8`.
- Test matches: `4`; known=`4`; new=`0`.
- Test values: `k:1:3 l:1:1`.

## Top Substitution Families Validated In Test

| Test Total | Known | New | Train Total | Slot | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 4 | 4 | 0 | 18 | 6 | `e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:3 l:1:1` |
| 3 | 3 | 0 | 11 | 2 | `e:1 _ h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:10 c:2:1` | `c:1:3` |
| 3 | 3 | 0 | 11 | 8 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 _ d:1` | `i:1:10 j:1:1` | `i:1:3` |
| 3 | 3 | 0 | 8 | 7 | `e:1 c:1 h:2 e:1 f:1 f:1 _ d:1` | `i:1:7 j:1:1` | `i:1:3` |
| 1 | 1 | 0 | 9 | 8 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 _ d:1` | `i:1:8 j:1:1` | `i:1:1` |
| 1 | 1 | 0 | 6 | 5 | `e:1 g:1 e:1 e:1 _ f:1 i:1 d:1` | `f:1:4 c:1:2` | `f:1:1` |
| 1 | 1 | 0 | 5 | 5 | `n:1 e:1 g:1 e:1 _` | `c:1:4 e:1:1` | `c:1:1` |
| 1 | 1 | 0 | 4 | 8 | `e:1 c:1 h:2 e:1 g:1 e:1 e:1 _` | `h:1:3 c:1:1` | `h:1:1` |

## Top Optional Families Seen In Test

| Test Base | Test Known Expansions | Test New Expansions | Train Base | Train Expanded | Optional Index | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 8 | 1 | 0 | 1 | 5 | 5 | `n:1 e:1 g:1 e:1` | `c:1:4 e:1:1` | `c:1:1` |
| 3 | 4 | 0 | 7 | 18 | 6 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:3 l:1:1` |
| 3 | 1 | 0 | 10 | 1 | 1 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:1` | `c:1:1` |
| 3 | 1 | 0 | 6 | 3 | 3 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 1 | 0 | 6 | 3 | 4 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 1 | 0 | 6 | 3 | 5 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 0 | 0 | 17 | 1 | 1 | `e:1 g:1 e:1 c:1 f:1 j:1` | `c:1:1` | `` |
| 3 | 0 | 0 | 17 | 1 | 3 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `` |
| 3 | 0 | 0 | 17 | 1 | 4 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `` |
| 0 | 3 | 0 | 1 | 10 | 9 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1` | `d:1:10` | `d:1:3` |
| 3 | 0 | 0 | 10 | 1 | 5 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `` |
| 3 | 0 | 0 | 10 | 1 | 6 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `` |
| 3 | 0 | 0 | 6 | 5 | 1 | `e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `` |
| 3 | 0 | 0 | 7 | 1 | 1 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `c:1:1` | `` |
| 0 | 3 | 0 | 1 | 6 | 5 | `e:1 g:1 e:1 e:1` | `h:1:6` | `h:1:3` |
| 1 | 2 | 0 | 4 | 1 | 6 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `k:1:1` | `k:1:2` |
| 2 | 1 | 0 | 1 | 2 | 3 | `e:1 f:1 f:1 i:1 d:1` | `k:1:1 l:1:1` | `k:1:1` |
| 2 | 0 | 0 | 5 | 1 | 2 | `c:1 f:1 i:1 d:1` | `k:1:1` | `` |
| 1 | 1 | 0 | 3 | 2 | 1 | `a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `c:1:2` | `c:1:1` |
| 2 | 0 | 0 | 3 | 2 | 3 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `` |
| 2 | 0 | 0 | 3 | 2 | 4 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `` |
| 0 | 1 | 0 | 6 | 4 | 1 | `e:1 g:1 e:1 c:1` | `n:1:4` | `n:1:1` |
| 1 | 0 | 0 | 4 | 1 | 7 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 3 | 2 | 1 | `e:1 g:1 e:1 e:1 e:1 h:1` | `n:1:2` | `` |
| 1 | 0 | 0 | 4 | 1 | 3 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |

## Reading

- A clean test hit means `f2r` matched a train-induced frame and used only slot values already seen in train.
- A new test value is not automatically bad; it may be productive grammar, but it is weaker as validation.
- Optional rules with repeated identical tokens can overcount insertion positions; these remain raw candidates until run-length normalization is added.

## Source Files

- `train-test-substitution-validation.tsv`
- `train-test-optional-validation.tsv`
