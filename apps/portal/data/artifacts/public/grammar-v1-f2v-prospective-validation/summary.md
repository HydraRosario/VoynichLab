# GRAMMAR-V1 vs f2v Prospective Test

Purpose: evaluate the frozen `GRAMMAR-V1` families against a newly labeled folio without inducing new rules from it.

## Inputs

- Frozen grammar: `frozen\GRAMMAR-V1-2026-07-13`.
- Test folio: `f2v`.
- Test molecules: `57`; unique signatures: `46`.
- Frozen substitution families: `19`.
- Frozen optional families: `55`.

## Summary

- Substitution families observed in `f2v`: `7` / `19`.
- Observed substitution families with only known slot values: `7` / `7`.
- Observed substitution families with new slot values: `0`.
- Optional families with base or expansion observed in `f2v`: `32` / `55`.
- Optional families with observed expansions and no new optional values: `30` / `32`.
- Optional families with new optional values: `2`.

## Priority Family A

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
X in {empty, k:1, l:1}
```

- Base form X=empty in f2v: `0`.
- Known expansions in f2v: `4`; values: `k:1:4`.
- New expansions in f2v: `0`.
- Expanded-frame substitution hits: `4`; known=`4`; new=`0`; values: `k:1:4`.
- Examples: `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1 (4)`.

## Observed Substitution Families

| Test Total | Known | New | Slot | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 4 | 4 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:4` |
| 4 | 4 | 0 | 2 | `e:1 _ h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:10 c:2:1` | `c:1:4` |
| 4 | 4 | 0 | 8 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 _ d:1` | `i:1:10 j:1:1` | `i:1:4` |
| 2 | 2 | 0 | 5 | `e:1 g:1 e:1 e:1 _ f:1 i:1 d:1` | `f:1:4 c:1:2` | `c:1:1 f:1:1` |
| 1 | 1 | 0 | 5 | `n:1 e:1 g:1 e:1 _` | `c:1:4 e:1:1` | `c:1:1` |
| 1 | 1 | 0 | 1 | `_ e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `n:1:1` |
| 1 | 1 | 0 | 6 | `n:1 e:1 g:1 e:1 e:1 _` | `h:1:3 c:1:1` | `h:1:1` |

## New Slot Values

No rows.

## Observed Optional Families

| Test Base | Known Expansions | New Expansions | Optional Index | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 0 | 1 | 0 | 5 | `n:1 e:1 g:1 e:1` | `c:1:4 e:1:1` | `c:1:1` |
| 0 | 4 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:10 l:1:8` | `k:1:4` |
| 4 | 0 | 0 | 1 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:1` | `` |
| 1 | 0 | 0 | 3 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `` |
| 1 | 0 | 0 | 4 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `` |
| 1 | 0 | 0 | 5 | `e:1 g:1 e:1 e:1 h:1` | `e:1:3` | `` |
| 5 | 0 | 0 | 1 | `e:1 g:1 e:1 c:1 f:1 j:1` | `c:1:1` | `` |
| 5 | 1 | 0 | 3 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `e:1:1` |
| 5 | 1 | 0 | 4 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `e:1:1` |
| 0 | 4 | 0 | 9 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1` | `d:1:10` | `d:1:4` |
| 4 | 0 | 1 | 5 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `l:1:1` |
| 4 | 0 | 0 | 6 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `` |
| 1 | 1 | 0 | 1 | `e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `n:1:1` |
| 0 | 1 | 0 | 5 | `e:1 g:1 e:1 e:1` | `h:1:6` | `h:1:1` |
| 1 | 0 | 0 | 6 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `k:1:1` | `` |
| 0 | 1 | 0 | 3 | `e:1 f:1 f:1 i:1 d:1` | `k:1:1 l:1:1` | `k:1:1` |
| 3 | 1 | 0 | 3 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `e:1:1` |
| 3 | 1 | 0 | 4 | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `e:1:2` | `e:1:1` |
| 0 | 1 | 0 | 1 | `e:1 g:1 e:1 c:1` | `n:1:4` | `n:1:1` |
| 1 | 0 | 0 | 3 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 4 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 5 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 1 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `n:1:1` | `` |
| 1 | 0 | 0 | 4 | `n:1 e:1 g:1 e:1 c:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 5 | `n:1 e:1 g:1 e:1 c:1` | `e:1:1` | `` |
| 1 | 0 | 0 | 1 | `e:1 g:1 e:1 c:1 e:1 c:1 h:2 e:1 h:1` | `n:1:4` | `` |
| 1 | 0 | 0 | 5 | `n:1 e:1 g:1 e:1 e:1 h:1` | `e:1:2 c:1:1` | `` |
| 0 | 1 | 0 | 6 | `n:1 e:1 g:1 e:1 e:1` | `h:1:3 c:1:1` | `h:1:1` |
| 1 | 0 | 0 | 4 | `n:1 e:1 g:1 e:1 e:1 h:1` | `e:1:2` | `` |
| 1 | 0 | 0 | 6 | `n:1 e:1 g:1 e:1 e:1 h:1` | `e:1:2` | `` |
| 0 | 1 | 1 | 10 | `e:1 g:1 e:1 c:1 e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:2` | `k:1:1 l:1:1` |
| 2 | 0 | 0 | 5 | `e:1 c:1 h:2 c:1 f:1 i:1 d:1` | `k:1:1` | `` |

## New Optional Values

| Test Base | Known Expansions | New Expansions | Optional Index | Skeleton | Train Values | Test Values |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 4 | 0 | 1 | 5 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `l:1:1` |
| 0 | 1 | 1 | 10 | `e:1 g:1 e:1 c:1 e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:2` | `k:1:1 l:1:1` |

## Source Files

- `grammar-v1-vs-f2v-substitution.tsv`
- `grammar-v1-vs-f2v-optional.tsv`
