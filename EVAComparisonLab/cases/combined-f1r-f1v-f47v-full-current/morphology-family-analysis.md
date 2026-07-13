# Morphology Family Analysis

## Purpose

Test whether hand-labeled atom families form recurrent, measurable shape classes without using position, EVA text, or contextual grammar rules.

## Method

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`.
- Raw atoms read: `3621`.
- Eligible symbols: `16` with at least `8` samples.
- Shape normalization: bounding-box centering, max-dimension scaling, `32` resampled path points, and `16x16` occupancy mask.
- Classifier check: leave-one-out nearest centroid and 5-nearest-neighbor using only normalized morphology features.

## Global Result

- Nearest-centroid accuracy: `0.9406`.
- 5-nearest-neighbor accuracy: `0.9724`.
- Mean separation ratio: `1.3017`.
- Median separation ratio: `1.0063`.

Interpretation: separation ratio = nearest other family centroid distance / mean within-family distance. Values above 1 indicate the family is, on average, tighter internally than it is close to its nearest competing family.

## Family Cohesion And Separation

| Symbol | Count | Intra mean | Intra p95 | Nearest other | Other distance | Separation ratio | Centroid acc | kNN acc |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| `f:1` | 348 | 4.0339 | 16.7904 | `h:2` | 14.6405 | 3.6294 | 0.9713 | 0.9914 |
| `e:1` | 1069 | 5.5192 | 22.3670 | `h:2` | 15.0865 | 2.7335 | 0.9626 | 0.9963 |
| `j:1` | 88 | 10.6224 | 27.0233 | `n:1` | 20.1049 | 1.8927 | 0.9091 | 0.9432 |
| `c:2` | 33 | 22.5662 | 40.0786 | `m:1` | 33.8594 | 1.5005 | 0.7576 | 0.7576 |
| `h:1` | 161 | 10.9653 | 18.9786 | `a:1` | 14.1994 | 1.2949 | 0.9627 | 0.9814 |
| `a:1` | 341 | 9.5792 | 13.1281 | `h:2` | 12.1542 | 1.2688 | 0.9824 | 0.9883 |
| `g:1` | 245 | 9.0098 | 11.2011 | `b:1` | 9.9492 | 1.1043 | 1.0000 | 0.9592 |
| `l:1` | 24 | 16.6294 | 31.9575 | `b:1` | 17.4587 | 1.0499 | 0.9583 | 1.0000 |
| `h:2` | 126 | 12.5096 | 16.7379 | `i:1` | 12.0427 | 0.9627 | 0.8889 | 0.9444 |
| `c:1` | 524 | 18.7639 | 27.2203 | `n:1` | 16.2471 | 0.8659 | 0.9046 | 0.9790 |
| `k:1` | 47 | 14.5015 | 21.0918 | `b:1` | 12.4848 | 0.8609 | 0.9149 | 0.9787 |
| `m:1` | 41 | 16.6942 | 21.5485 | `b:1` | 13.0404 | 0.7811 | 0.9512 | 0.8537 |
| `i:1` | 165 | 16.0256 | 21.3678 | `h:2` | 12.0427 | 0.7515 | 0.9818 | 0.9879 |
| `b:1` | 156 | 13.2850 | 19.4067 | `g:1` | 9.9492 | 0.7489 | 0.8013 | 0.9551 |
| `d:1` | 187 | 14.2678 | 21.8160 | `g:1` | 10.3030 | 0.7221 | 0.8556 | 0.9465 |
| `n:1` | 66 | 19.0776 | 23.9264 | `d:1` | 12.6007 | 0.6605 | 0.9242 | 0.7121 |

## Strongest Current Morphological Families

- `f:1`: separation ratio `3.6294`, kNN accuracy `0.9914`, nearest competitor `h:2`.
- `e:1`: separation ratio `2.7335`, kNN accuracy `0.9963`, nearest competitor `h:2`.
- `j:1`: separation ratio `1.8927`, kNN accuracy `0.9432`, nearest competitor `n:1`.
- `c:2`: separation ratio `1.5005`, kNN accuracy `0.7576`, nearest competitor `m:1`.
- `h:1`: separation ratio `1.2949`, kNN accuracy `0.9814`, nearest competitor `a:1`.
- `a:1`: separation ratio `1.2688`, kNN accuracy `0.9883`, nearest competitor `h:2`.
- `g:1`: separation ratio `1.1043`, kNN accuracy `0.9592`, nearest competitor `b:1`.
- `l:1`: separation ratio `1.0499`, kNN accuracy `1.0000`, nearest competitor `b:1`.

## Weakest Or Most Confusable Families

- `n:1`: separation ratio `0.6605`, kNN accuracy `0.7121`, nearest competitor `d:1`.
- `d:1`: separation ratio `0.7221`, kNN accuracy `0.9465`, nearest competitor `g:1`.
- `b:1`: separation ratio `0.7489`, kNN accuracy `0.9551`, nearest competitor `g:1`.
- `i:1`: separation ratio `0.7515`, kNN accuracy `0.9879`, nearest competitor `h:2`.
- `m:1`: separation ratio `0.7811`, kNN accuracy `0.8537`, nearest competitor `b:1`.
- `k:1`: separation ratio `0.8609`, kNN accuracy `0.9787`, nearest competitor `b:1`.
- `c:1`: separation ratio `0.8659`, kNN accuracy `0.9790`, nearest competitor `n:1`.
- `h:2`: separation ratio `0.9627`, kNN accuracy `0.9444`, nearest competitor `i:1`.

## Closest Family Pairs

- `b:1` vs `g:1`: centroid distance `9.9492`.
- `d:1` vs `g:1`: centroid distance `10.3030`.
- `h:2` vs `i:1`: centroid distance `12.0427`.
- `a:1` vs `h:2`: centroid distance `12.1542`.
- `b:1` vs `k:1`: centroid distance `12.4848`.
- `b:1` vs `d:1`: centroid distance `12.5159`.
- `d:1` vs `n:1`: centroid distance `12.6007`.
- `b:1` vs `m:1`: centroid distance `13.0404`.
- `b:1` vs `i:1`: centroid distance `13.8485`.
- `d:1` vs `i:1`: centroid distance `13.8560`.
- `i:1` vs `n:1`: centroid distance `14.0082`.
- `a:1` vs `h:1`: centroid distance `14.1994`.

## Representative And Outlier Snapshots

| Symbol | Kind | Atom | Image | Distance | Snapshot |
| --- | --- | ---: | --- | ---: | --- |
| `a:1` | representative | 2895 | `page-094.jpg` | 6.5340 | `atoms\a_1\page-094.jpg\2895.svg` |
| `a:1` | representative | 3220 | `page-003.jpg` | 6.5370 | `atoms\a_1\page-003.jpg\3220.svg` |
| `a:1` | representative | 4709 | `page-004.jpg` | 6.5544 | `atoms\a_1\page-004.jpg\4709.svg` |
| `a:1` | outlier | 4678 | `page-004.jpg` | 17.1495 | `atoms\a_1\page-004.jpg\4678.svg` |
| `a:1` | outlier | 4676 | `page-004.jpg` | 16.8477 | `atoms\a_1\page-004.jpg\4676.svg` |
| `a:1` | outlier | 3897 | `page-003.jpg` | 15.3116 | `atoms\a_1\page-003.jpg\3897.svg` |
| `b:1` | representative | 981 | `page-003.jpg` | 9.6273 | `atoms\b_1\page-003.jpg\981.svg` |
| `b:1` | representative | 3397 | `page-003.jpg` | 9.7226 | `atoms\b_1\page-003.jpg\3397.svg` |
| `b:1` | representative | 2070 | `page-003.jpg` | 9.7671 | `atoms\b_1\page-003.jpg\2070.svg` |
| `b:1` | outlier | 4239 | `page-094.jpg` | 21.8300 | `atoms\b_1\page-094.jpg\4239.svg` |
| `b:1` | outlier | 4756 | `page-004.jpg` | 20.2494 | `atoms\b_1\page-004.jpg\4756.svg` |
| `b:1` | outlier | 3788 | `page-003.jpg` | 20.1167 | `atoms\b_1\page-003.jpg\3788.svg` |
| `c:1` | representative | 3179 | `page-003.jpg` | 12.6248 | `atoms\c_1\page-003.jpg\3179.svg` |
| `c:1` | representative | 3189 | `page-003.jpg` | 12.6248 | `atoms\c_1\page-003.jpg\3189.svg` |
| `c:1` | representative | 3274 | `page-003.jpg` | 12.6248 | `atoms\c_1\page-003.jpg\3274.svg` |
| `c:1` | outlier | 2696 | `page-094.jpg` | 48.1004 | `atoms\c_1\page-094.jpg\2696.svg` |
| `c:1` | outlier | 4243 | `page-094.jpg` | 32.3739 | `atoms\c_1\page-094.jpg\4243.svg` |
| `c:1` | outlier | 3356 | `page-003.jpg` | 32.3619 | `atoms\c_1\page-003.jpg\3356.svg` |
| `d:1` | representative | 1109 | `page-003.jpg` | 9.8161 | `atoms\d_1\page-003.jpg\1109.svg` |
| `d:1` | representative | 1996 | `page-003.jpg` | 9.8542 | `atoms\d_1\page-003.jpg\1996.svg` |
| `d:1` | representative | 1215 | `page-003.jpg` | 9.9034 | `atoms\d_1\page-003.jpg\1215.svg` |
| `d:1` | outlier | 3985 | `page-003.jpg` | 28.7030 | `atoms\d_1\page-003.jpg\3985.svg` |
| `d:1` | outlier | 5240 | `page-004.jpg` | 24.6190 | `atoms\d_1\page-004.jpg\5240.svg` |
| `d:1` | outlier | 5253 | `page-004.jpg` | 24.4229 | `atoms\d_1\page-004.jpg\5253.svg` |
| `f:1` | representative | 1254 | `page-003.jpg` | 1.5893 | `atoms\f_1\page-003.jpg\1254.svg` |
| `f:1` | representative | 3182 | `page-003.jpg` | 1.5893 | `atoms\f_1\page-003.jpg\3182.svg` |
| `f:1` | representative | 3188 | `page-003.jpg` | 1.5893 | `atoms\f_1\page-003.jpg\3188.svg` |
| `f:1` | outlier | 999 | `page-003.jpg` | 64.1107 | `atoms\f_1\page-003.jpg\999.svg` |
| `f:1` | outlier | 2514 | `page-003.jpg` | 62.7341 | `atoms\f_1\page-003.jpg\2514.svg` |
| `f:1` | outlier | 1644 | `page-003.jpg` | 36.7905 | `atoms\f_1\page-003.jpg\1644.svg` |
| `i:1` | representative | 1646 | `page-003.jpg` | 12.7957 | `atoms\i_1\page-003.jpg\1646.svg` |
| `i:1` | representative | 1022 | `page-003.jpg` | 12.8015 | `atoms\i_1\page-003.jpg\1022.svg` |
| `i:1` | representative | 3482 | `page-003.jpg` | 12.8682 | `atoms\i_1\page-003.jpg\3482.svg` |
| `i:1` | outlier | 3290 | `page-003.jpg` | 23.6666 | `atoms\i_1\page-003.jpg\3290.svg` |
| `i:1` | outlier | 4632 | `page-094.jpg` | 23.3819 | `atoms\i_1\page-094.jpg\4632.svg` |
| `i:1` | outlier | 2417 | `page-003.jpg` | 22.8675 | `atoms\i_1\page-003.jpg\2417.svg` |
| `e:1` | representative | 996 | `page-003.jpg` | 2.2811 | `atoms\e_1\page-003.jpg\996.svg` |
| `e:1` | representative | 993 | `page-003.jpg` | 2.2811 | `atoms\e_1\page-003.jpg\993.svg` |
| `e:1` | representative | 1263 | `page-003.jpg` | 2.2811 | `atoms\e_1\page-003.jpg\1263.svg` |
| `e:1` | outlier | 2416 | `page-003.jpg` | 38.0996 | `atoms\e_1\page-003.jpg\2416.svg` |
| `e:1` | outlier | 1944 | `page-003.jpg` | 35.1635 | `atoms\e_1\page-003.jpg\1944.svg` |
| `e:1` | outlier | 2099 | `page-003.jpg` | 32.9632 | `atoms\e_1\page-003.jpg\2099.svg` |
| `h:1` | representative | 3304 | `page-003.jpg` | 6.7494 | `atoms\h_1\page-003.jpg\3304.svg` |
| `h:1` | representative | 3340 | `page-003.jpg` | 6.7494 | `atoms\h_1\page-003.jpg\3340.svg` |
| `h:1` | representative | 3338 | `page-003.jpg` | 6.7494 | `atoms\h_1\page-003.jpg\3338.svg` |
| `h:1` | outlier | 1509 | `page-003.jpg` | 24.6901 | `atoms\h_1\page-003.jpg\1509.svg` |
| `h:1` | outlier | 1727 | `page-003.jpg` | 21.0380 | `atoms\h_1\page-003.jpg\1727.svg` |
| `h:1` | outlier | 1947 | `page-003.jpg` | 20.7237 | `atoms\h_1\page-003.jpg\1947.svg` |
| `g:1` | representative | 1705 | `page-003.jpg` | 7.4850 | `atoms\g_1\page-003.jpg\1705.svg` |
| `g:1` | representative | 2438 | `page-003.jpg` | 7.5073 | `atoms\g_1\page-003.jpg\2438.svg` |
| `g:1` | representative | 1382 | `page-003.jpg` | 7.5204 | `atoms\g_1\page-003.jpg\1382.svg` |
| `g:1` | outlier | 1413 | `page-003.jpg` | 16.1749 | `atoms\g_1\page-003.jpg\1413.svg` |
| `g:1` | outlier | 5144 | `page-004.jpg` | 11.5642 | `atoms\g_1\page-004.jpg\5144.svg` |
| `g:1` | outlier | 2493 | `page-003.jpg` | 11.2386 | `atoms\g_1\page-003.jpg\2493.svg` |
| `m:1` | representative | 3039 | `page-003.jpg` | 13.1594 | `atoms\m_1\page-003.jpg\3039.svg` |
| `m:1` | representative | 3899 | `page-003.jpg` | 13.1606 | `atoms\m_1\page-003.jpg\3899.svg` |
| `m:1` | representative | 3031 | `page-003.jpg` | 13.1606 | `atoms\m_1\page-003.jpg\3031.svg` |
| `m:1` | outlier | 3035 | `page-003.jpg` | 22.5040 | `atoms\m_1\page-003.jpg\3035.svg` |
| `m:1` | outlier | 3040 | `page-003.jpg` | 21.6253 | `atoms\m_1\page-003.jpg\3040.svg` |
| `m:1` | outlier | 5466 | `page-004.jpg` | 21.5485 | `atoms\m_1\page-004.jpg\5466.svg` |
| `h:2` | representative | 3842 | `page-003.jpg` | 9.2196 | `atoms\h_2\page-003.jpg\3842.svg` |
| `h:2` | representative | 3561 | `page-003.jpg` | 9.2973 | `atoms\h_2\page-003.jpg\3561.svg` |
| `h:2` | representative | 2966 | `page-094.jpg` | 9.4308 | `atoms\h_2\page-094.jpg\2966.svg` |
| `h:2` | outlier | 1764 | `page-003.jpg` | 18.6391 | `atoms\h_2\page-003.jpg\1764.svg` |
| `h:2` | outlier | 2013 | `page-003.jpg` | 17.9164 | `atoms\h_2\page-003.jpg\2013.svg` |
| `h:2` | outlier | 2215 | `page-003.jpg` | 16.9595 | `atoms\h_2\page-003.jpg\2215.svg` |
| `k:1` | representative | 1174 | `page-003.jpg` | 11.5191 | `atoms\k_1\page-003.jpg\1174.svg` |
| `k:1` | representative | 1193 | `page-003.jpg` | 11.5191 | `atoms\k_1\page-003.jpg\1193.svg` |
| `k:1` | representative | 1490 | `page-003.jpg` | 11.5191 | `atoms\k_1\page-003.jpg\1490.svg` |
| `k:1` | outlier | 5410 | `page-004.jpg` | 22.4876 | `atoms\k_1\page-004.jpg\5410.svg` |
| `k:1` | outlier | 3975 | `page-003.jpg` | 22.3526 | `atoms\k_1\page-003.jpg\3975.svg` |
| `k:1` | outlier | 3973 | `page-003.jpg` | 21.4451 | `atoms\k_1\page-003.jpg\3973.svg` |
| `n:1` | representative | 3700 | `page-094.jpg` | 15.2453 | `atoms\n_1\page-094.jpg\3700.svg` |
| `n:1` | representative | 3706 | `page-094.jpg` | 15.2528 | `atoms\n_1\page-094.jpg\3706.svg` |
| `n:1` | representative | 5459 | `page-004.jpg` | 15.8546 | `atoms\n_1\page-004.jpg\5459.svg` |
| `n:1` | outlier | 3672 | `page-003.jpg` | 29.5904 | `atoms\n_1\page-003.jpg\3672.svg` |
| `n:1` | outlier | 3664 | `page-003.jpg` | 25.0799 | `atoms\n_1\page-003.jpg\3664.svg` |
| `n:1` | outlier | 3661 | `page-003.jpg` | 24.2027 | `atoms\n_1\page-003.jpg\3661.svg` |
| `j:1` | representative | 3212 | `page-003.jpg` | 5.2830 | `atoms\j_1\page-003.jpg\3212.svg` |
| `j:1` | representative | 3213 | `page-003.jpg` | 5.2830 | `atoms\j_1\page-003.jpg\3213.svg` |
| `j:1` | representative | 3283 | `page-003.jpg` | 5.2830 | `atoms\j_1\page-003.jpg\3283.svg` |
| `j:1` | outlier | 2273 | `page-003.jpg` | 29.7280 | `atoms\j_1\page-003.jpg\2273.svg` |
| `j:1` | outlier | 2220 | `page-003.jpg` | 28.3887 | `atoms\j_1\page-003.jpg\2220.svg` |
| `j:1` | outlier | 4616 | `page-094.jpg` | 27.7255 | `atoms\j_1\page-094.jpg\4616.svg` |
| `c:2` | representative | 3379 | `page-003.jpg` | 14.2773 | `atoms\c_2\page-003.jpg\3379.svg` |
| `c:2` | representative | 3787 | `page-003.jpg` | 14.2773 | `atoms\c_2\page-003.jpg\3787.svg` |
| `c:2` | representative | 2753 | `page-094.jpg` | 14.2773 | `atoms\c_2\page-094.jpg\2753.svg` |
| `c:2` | outlier | 5103 | `page-004.jpg` | 40.7843 | `atoms\c_2\page-004.jpg\5103.svg` |
| `c:2` | outlier | 1136 | `page-003.jpg` | 40.4500 | `atoms\c_2\page-003.jpg\1136.svg` |
| `c:2` | outlier | 2293 | `page-003.jpg` | 39.8310 | `atoms\c_2\page-003.jpg\2293.svg` |
| `l:1` | representative | 1986 | `page-003.jpg` | 10.9736 | `atoms\l_1\page-003.jpg\1986.svg` |
| `l:1` | representative | 2183 | `page-003.jpg` | 10.9736 | `atoms\l_1\page-003.jpg\2183.svg` |
| `l:1` | representative | 2276 | `page-003.jpg` | 10.9736 | `atoms\l_1\page-003.jpg\2276.svg` |
| `l:1` | outlier | 2596 | `page-003.jpg` | 32.3542 | `atoms\l_1\page-003.jpg\2596.svg` |
| `l:1` | outlier | 3869 | `page-003.jpg` | 32.0348 | `atoms\l_1\page-003.jpg\3869.svg` |
| `l:1` | outlier | 3647 | `page-003.jpg` | 31.5194 | `atoms\l_1\page-003.jpg\3647.svg` |

## Scientific Reading

- High within-family cohesion plus successful blind morphology-only classification supports the claim that atom labels are recurrent visual families rather than arbitrary names.
- Confusable families are not failures; they identify where the alphabet needs more visual examples, sharper operational rules, or possible future merging.
- This analysis deliberately ignores positional grammar, so positive results are independent from the contextual-rule reports.

## Source Tables

- `morphology-family-families.tsv`
- `morphology-family-pairs.tsv`
- `morphology-family-loo.tsv`
- `morphology-family-representatives.tsv`
- `morphology-family-confusion.tsv`
