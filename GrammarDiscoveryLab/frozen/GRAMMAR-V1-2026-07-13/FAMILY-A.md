# Priority Family A

Frozen molecular frame:

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
X in {empty, k:1, l:1}
```

## Optional-Slot Evidence

| Split | Empty/Base | Expanded Known | Expanded New | Values | Examples |
| --- | ---: | ---: | ---: | --- | --- |
| Train | 7 | 18 | n/a | `k:1:10 l:1:8` | n/a |
| Test f2r | 3 | 4 | 0 | `k:1:3 l:1:1` | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1 (3) | e:1 c:1 h:2 e:1 f:1 l:1 f:1 i:1 d:1 (1)` |

## Substitution-Slot Evidence

| Split | Total | Known | New | Values | Examples |
| --- | ---: | ---: | ---: | --- | --- |
| Train | 18 | n/a | n/a | `k:1:10 l:1:8` | n/a |
| Test f2r | 4 | 4 | 0 | `k:1:3 l:1:1` | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1 (3) | e:1 c:1 h:2 e:1 f:1 l:1 f:1 i:1 d:1 (1)` |

## Claim

Family A is a candidate productive molecular construction because it was induced without `f2r`, then `f2r` reused the same frame with only train-observed slot values.
