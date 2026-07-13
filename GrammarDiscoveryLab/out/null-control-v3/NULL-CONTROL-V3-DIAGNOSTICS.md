# NULL-CONTROL-V3-DIAGNOSTICS

Purpose: audit NULL-CONTROL-V3 without changing either model, smoothing, corpus, labels, or frozen family definitions.

## Scope

- Training folios: `f1r`, `f1v`, `f47v`.
- Evaluation folios: `f2r`, `f2v`.
- Evaluated opportunities: `34`.
- Unique local-context keys in evaluation: `9`.
- Unique full-frame keys in evaluation: `10`.
- Unique frozen family IDs in evaluation: `10`.

## Effective Training Support

### Model A local-context keys

| Metric | Value |
| --- | ---: |
| Keys with held-out opportunities | 9 |
| Median training N | 6 |
| Minimum training N | 4 |
| Maximum training N | 20 |
| Keys with training N <= 2 | 0 |
| Keys with training N <= 5 | 4 |

### Model B full-frame keys

| Metric | Value |
| --- | ---: |
| Keys with held-out opportunities | 10 |
| Median training N | 7 |
| Minimum training N | 4 |
| Maximum training N | 18 |
| Keys with training N <= 2 | 0 |
| Keys with training N <= 5 | 4 |

## Model A Local-Context Keys

| Key | Train N | Train values | Held-out N | Held-out values | Families |
| --- | ---: | --- | ---: | --- | --- |
| `length=5|role=final|left=e:1|right=END` | 5 | `c:1:4 e:1:1` | 2 | `c:1:2` | `substitution-07` |
| `length=6|role=final|left=e:1|right=END` | 4 | `h:1:3 c:1:1` | 1 | `h:1:1` | `substitution-11` |
| `length=6|role=initial|left=START|right=e:1` | 5 | `n:1:3 c:1:2` | 1 | `n:1:1` | `substitution-10` |
| `length=8|role=final|left=e:1|right=END` | 4 | `h:1:3 c:1:1` | 1 | `h:1:1` | `substitution-08` |
| `length=8|role=medial|left=e:1|right=f:1` | 6 | `f:1:4 c:1:2` | 3 | `f:1:2 c:1:1` | `substitution-06` |
| `length=8|role=medial|left=f:1|right=d:1` | 8 | `i:1:7 j:1:1` | 3 | `i:1:3` | `substitution-04` |
| `length=9|role=medial|left=e:1|right=h:2` | 11 | `c:1:10 c:2:1` | 7 | `c:1:7` | `substitution-02` |
| `length=9|role=medial|left=f:1|right=d:1` | 20 | `i:1:18 j:1:2` | 8 | `i:1:8` | `substitution-03 substitution-05` |
| `length=9|role=medial|left=f:1|right=f:1` | 18 | `k:1:10 l:1:8` | 8 | `k:1:7 l:1:1` | `substitution-01` |

## Model B Full-Frame Keys

| Key | Train N | Train values | Held-out N | Held-out values | Families |
| --- | ---: | --- | ---: | --- | --- |
| `slot=1|skeleton=_ e:1 g:1 e:1 e:1 h:1` | 5 | `n:1:3 c:1:2` | 1 | `n:1:1` | `substitution-10` |
| `slot=2|skeleton=e:1 _ h:2 e:1 f:1 k:1 f:1 i:1 d:1` | 11 | `c:1:10 c:2:1` | 7 | `c:1:7` | `substitution-02` |
| `slot=5|skeleton=e:1 g:1 e:1 e:1 _ f:1 i:1 d:1` | 6 | `f:1:4 c:1:2` | 3 | `f:1:2 c:1:1` | `substitution-06` |
| `slot=5|skeleton=n:1 e:1 g:1 e:1 _` | 5 | `c:1:4 e:1:1` | 2 | `c:1:2` | `substitution-07` |
| `slot=6|skeleton=e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1` | 18 | `k:1:10 l:1:8` | 8 | `k:1:7 l:1:1` | `substitution-01` |
| `slot=6|skeleton=n:1 e:1 g:1 e:1 e:1 _` | 4 | `h:1:3 c:1:1` | 1 | `h:1:1` | `substitution-11` |
| `slot=7|skeleton=e:1 c:1 h:2 e:1 f:1 f:1 _ d:1` | 8 | `i:1:7 j:1:1` | 3 | `i:1:3` | `substitution-04` |
| `slot=8|skeleton=e:1 c:1 h:2 e:1 f:1 k:1 f:1 _ d:1` | 11 | `i:1:10 j:1:1` | 7 | `i:1:7` | `substitution-03` |
| `slot=8|skeleton=e:1 c:1 h:2 e:1 f:1 l:1 f:1 _ d:1` | 9 | `i:1:8 j:1:1` | 1 | `i:1:1` | `substitution-05` |
| `slot=8|skeleton=e:1 c:1 h:2 e:1 g:1 e:1 e:1 _` | 4 | `h:1:3 c:1:1` | 1 | `h:1:1` | `substitution-08` |

## Overlap And Duplication Checks

- Multiple frozen family IDs sharing the same Model A context: `1`.
- Multiple frozen family IDs sharing the same full-frame key: `0`.
- Held-out molecules contributing more than one evaluated opportunity: `9`.
- Duplicate opportunity rows: `0`.
- Repeated evaluation of the same physical slot (same molecule + slot index): `0`.

### Shared Model A Contexts

| Key | Families | Held-out rows |
| --- | --- | ---: |
| `length=9|role=medial|left=f:1|right=d:1` | `substitution-03 substitution-05` | 8 |

### Shared Full-Frame Keys

No rows.

### Molecules With Multiple Opportunities

| Molecule | Folio | Opportunity count | Families / slots |
| --- | --- | ---: | --- |
| `p005-m004` | `f2r` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p005-m068` | `f2r` | 2 | `substitution-01@6 substitution-05@8` |
| `p005-m076` | `f2r` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p005-m103` | `f2r` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p006-m014` | `f2v` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p006-m028` | `f2v` | 2 | `substitution-10@1 substitution-11@6` |
| `p006-m035` | `f2v` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p006-m043` | `f2v` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |
| `p006-m046` | `f2v` | 3 | `substitution-01@6 substitution-02@2 substitution-03@8` |

### Repeated Physical Slots

No rows.

## Log-Loss Delta Decomposition

Positive delta means Model B improves over Model A. Negative delta means Model B is worse.

### By Folio

| Key | N | Mean delta | Sum delta |
| --- | ---: | ---: | ---: |
| `f2r` | 17 | -0.069131 | -1.175224 |
| `f2v` | 17 | -0.060637 | -1.030834 |

### By Family

| Key | N | Mean delta | Sum delta |
| --- | ---: | ---: | ---: |
| `substitution-05` | 1 | -0.402098 | -0.402098 |
| `substitution-03` | 7 | -0.257709 | -1.803960 |
| `substitution-01` | 8 | 0.000000 | 0.000000 |
| `substitution-02` | 7 | 0.000000 | 0.000000 |
| `substitution-04` | 3 | 0.000000 | 0.000000 |
| `substitution-06` | 3 | 0.000000 | 0.000000 |
| `substitution-07` | 2 | 0.000000 | 0.000000 |
| `substitution-08` | 1 | 0.000000 | 0.000000 |
| `substitution-10` | 1 | 0.000000 | 0.000000 |
| `substitution-11` | 1 | 0.000000 | 0.000000 |

### By Local Context

| Key | N | Mean delta | Sum delta |
| --- | ---: | ---: | ---: |
| `length=9|role=medial|left=f:1|right=d:1` | 8 | -0.275757 | -2.206058 |
| `length=5|role=final|left=e:1|right=END` | 2 | 0.000000 | 0.000000 |
| `length=6|role=final|left=e:1|right=END` | 1 | 0.000000 | 0.000000 |
| `length=6|role=initial|left=START|right=e:1` | 1 | 0.000000 | 0.000000 |
| `length=8|role=final|left=e:1|right=END` | 1 | 0.000000 | 0.000000 |
| `length=8|role=medial|left=e:1|right=f:1` | 3 | 0.000000 | 0.000000 |
| `length=8|role=medial|left=f:1|right=d:1` | 3 | 0.000000 | 0.000000 |
| `length=9|role=medial|left=e:1|right=h:2` | 7 | 0.000000 | 0.000000 |
| `length=9|role=medial|left=f:1|right=f:1` | 8 | 0.000000 | 0.000000 |

### Individual Opportunities

| Folio | Molecule | Family | Slot | Observed | Local context | Delta |
| --- | --- | --- | ---: | --- | --- | ---: |
| `f2r` | `p005-m068` | `substitution-05` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.402098 |
| `f2r` | `p005-m004` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2r` | `p005-m076` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2r` | `p005-m103` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2v` | `p006-m014` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2v` | `p006-m035` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2v` | `p006-m043` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2v` | `p006-m046` | `substitution-03` | 8 | `i:1` | `length=9|role=medial|left=f:1|right=d:1` | -0.257709 |
| `f2r` | `p005-m004` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2r` | `p005-m068` | `substitution-01` | 6 | `l:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2r` | `p005-m076` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2r` | `p005-m103` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m014` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m035` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m043` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m046` | `substitution-01` | 6 | `k:1` | `length=9|role=medial|left=f:1|right=f:1` | 0.000000 |
| `f2r` | `p005-m004` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2r` | `p005-m076` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2r` | `p005-m103` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2v` | `p006-m014` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2v` | `p006-m035` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2v` | `p006-m043` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2v` | `p006-m046` | `substitution-02` | 2 | `c:1` | `length=9|role=medial|left=e:1|right=h:2` | 0.000000 |
| `f2r` | `p005-m032` | `substitution-04` | 7 | `i:1` | `length=8|role=medial|left=f:1|right=d:1` | 0.000000 |
| `f2r` | `p005-m034` | `substitution-04` | 7 | `i:1` | `length=8|role=medial|left=f:1|right=d:1` | 0.000000 |
| `f2r` | `p005-m087` | `substitution-04` | 7 | `i:1` | `length=8|role=medial|left=f:1|right=d:1` | 0.000000 |
| `f2r` | `p005-m096` | `substitution-06` | 5 | `f:1` | `length=8|role=medial|left=e:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m025` | `substitution-06` | 5 | `c:1` | `length=8|role=medial|left=e:1|right=f:1` | 0.000000 |
| `f2v` | `p006-m045` | `substitution-06` | 5 | `f:1` | `length=8|role=medial|left=e:1|right=f:1` | 0.000000 |
| `f2r` | `p005-m100` | `substitution-07` | 5 | `c:1` | `length=5|role=final|left=e:1|right=END` | 0.000000 |
| `f2v` | `p006-m023` | `substitution-07` | 5 | `c:1` | `length=5|role=final|left=e:1|right=END` | 0.000000 |
| `f2r` | `p005-m041` | `substitution-08` | 8 | `h:1` | `length=8|role=final|left=e:1|right=END` | 0.000000 |
| `f2v` | `p006-m028` | `substitution-10` | 1 | `n:1` | `length=6|role=initial|left=START|right=e:1` | 0.000000 |
| `f2v` | `p006-m028` | `substitution-11` | 6 | `h:1` | `length=6|role=final|left=e:1|right=END` | 0.000000 |

## Diagnostic Interpretation

Model A has median training support `6`; Model B has median training support `7`.

Support fragmentation is not obvious from the median support alone.

There are `1` local contexts shared by multiple frozen families, so the local baseline can pool evidence that Model B separates.

No repeated physical-slot evaluations were detected.
