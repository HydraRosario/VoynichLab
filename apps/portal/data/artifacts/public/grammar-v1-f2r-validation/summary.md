# GRAMMAR-V1 vs f2r Prospective Test

Purpose: evaluate the frozen `GRAMMAR-V1` families against a newly labeled folio without inducing new rules from it.

## Inputs

- Frozen grammar: `frozen\GRAMMAR-V1-2026-07-13`.
- Test folio: `f2r`.
- Test molecules: `104`; unique signatures: `82`.
- Frozen substitution families: `19`.
- Frozen optional families: `55`.

## Summary

- Substitution families observed in `f2r`: `8` / `19`.
- Observed substitution families with only known slot values: `8` / `8`.
- Observed substitution families with new slot values: `0`.
- Optional families with base or expansion observed in `f2r`: `38` / `55`.
- Optional families with observed expansions and no new optional values: `38` / `38`.
- Optional families with new optional values: `0`.

## Priority Family A

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
X in {empty, k:1, l:1}
```

- Base form X=empty in f2r: `3`.
- Known expansions in f2r: `4`; values: `k:1:3 l:1:1`.
- New expansions in f2r: `0`.
- Expanded-frame substitution hits: `4`; known=`4`; new=`0`; values: `k:1:3 l:1:1`.
- Examples: `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1 (3) | e:1 c:1 h:2 e:1 f:1 l:1 f:1 i:1 d:1 (1)`.

## Observed Substitution Families

| Test Total | Known | New | Slot | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 4 | 4 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:3 l:1:1` |
| 3 | 3 | 0 | 2 | `e:1 _ h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:10 c:2:1` | `c:1:3` |
| 3 | 3 | 0 | 8 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 _ d:1` | `i:1:10 j:1:1` | `i:1:3` |
| 3 | 3 | 0 | 7 | `e:1 c:1 h:2 e:1 f:1 f:1 _ d:1` | `i:1:7 j:1:1` | `i:1:3` |
| 1 | 1 | 0 | 8 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 _ d:1` | `i:1:8 j:1:1` | `i:1:1` |
| 1 | 1 | 0 | 5 | `e:1 g:1 e:1 e:1 _ f:1 i:1 d:1` | `f:1:4 c:1:2` | `f:1:1` |
| 1 | 1 | 0 | 5 | `n:1 e:1 g:1 e:1 _` | `c:1:4 e:1:1` | `c:1:1` |
| 1 | 1 | 0 | 8 | `e:1 c:1 h:2 e:1 g:1 e:1 e:1 _` | `h:1:3 c:1:1` | `h:1:1` |

## New Slot Values

No rows.

## Observed Optional Families

| Test Base | Known Expansions | New Expansions | Optional Index | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 8 | 1 | 0 | 5 | `n:1 e:1 g:1 e:1` | `c:1:4 e:1:1` | `c:1:1` |
| 3 | 4 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:3 l:1:1` |
| 3 | 1 | 0 | 1 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:1` | `c:1:1` |
| 3 | 1 | 0 | 3 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 1 | 0 | 4 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 1 | 0 | 5 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `e:1:1` |
| 3 | 0 | 0 | 1 | `e:1 g:1 e:1 c:1 f:1 j:1` | `c:1:1` | `` |
| 3 | 0 | 0 | 3 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `` |
| 3 | 0 | 0 | 4 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `` |
| 0 | 3 | 0 | 9 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1` | `d:1:10` | `d:1:3` |
| 3 | 0 | 0 | 5 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `` |
| 3 | 0 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `` |
| 3 | 0 | 0 | 1 | `e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `` |
| 3 | 0 | 0 | 1 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `c:1:1` | `` |
| 0 | 3 | 0 | 5 | `e:1 g:1 e:1 e:1` | `h:1:6` | `h:1:3` |
| 1 | 2 | 0 | 6 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `k:1:1` | `k:1:2` |
| 2 | 1 | 0 | 3 | `e:1 f:1 f:1 i:1 d:1` | `k:1:1 l:1:1` | `k:1:1` |
| 2 | 0 | 0 | 2 | `c:1 f:1 i:1 d:1` | `k:1:1` | `` |
| 1 | 1 | 0 | 1 | `a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `c:1:2` | `c:1:1` |
| 2 | 0 | 0 | 3 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `` |
| 2 | 0 | 0 | 4 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `` |
| 0 | 1 | 0 | 1 | `e:1 g:1 e:1 c:1` | `n:1:4` | `n:1:1` |
| 1 | 0 | 0 | 7 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 1 | `e:1 g:1 e:1 e:1 e:1 h:1` | `n:1:2` | `` |
| 1 | 0 | 0 | 3 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 4 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 5 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 1 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `n:1:1` | `` |
| 1 | 0 | 0 | 4 | `n:1 e:1 g:1 e:1 c:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 5 | `n:1 e:1 g:1 e:1 c:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 8 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | `d:1:1` | `` |
| 1 | 0 | 0 | 4 | `e:1 c:1 h:2 e:1 g:1 e:1 e:1 h:1` | `n:1:1` | `` |
| 0 | 1 | 0 | 4 | `n:1 e:1 g:1 e:1 e:1 e:1 h:1` | `e:1:2` | `e:1:1` |
| 0 | 1 | 0 | 5 | `n:1 e:1 g:1 e:1 e:1 e:1 h:1` | `e:1:2` | `e:1:1` |
| 0 | 1 | 0 | 6 | `n:1 e:1 g:1 e:1 e:1 e:1 h:1` | `e:1:2` | `e:1:1` |
| 0 | 1 | 0 | 7 | `n:1 e:1 g:1 e:1 e:1 e:1 h:1` | `e:1:2` | `e:1:1` |
| 0 | 1 | 0 | 1 | `a:1 b:1 c:1 a:1 e:1 h:1` | `c:1:1 e:1:1` | `e:1:1` |
| 1 | 0 | 0 | 3 | `c:1 a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `e:1:1` | `` |

## New Optional Values

No rows.

## Source Files

- `grammar-v1-vs-f2r-substitution.tsv`
- `grammar-v1-vs-f2r-optional.tsv`
