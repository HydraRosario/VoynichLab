# Morphology Family Analysis

## Purpose

Test whether hand-labeled atom families form recurrent, measurable shape classes without using position, EVA text, or contextual grammar rules.

## Method

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-006.jpg`, `page-007.jpg`, `page-094.jpg`.
- Raw atoms read: `6222`.
- Eligible symbols: `16` with at least `8` samples.
- Shape normalization: bounding-box centering, max-dimension scaling, `32` resampled path points, and `16x16` occupancy mask.
- Classifier check: leave-one-out nearest centroid and 5-nearest-neighbor using only normalized morphology features.

## Global Result

- Nearest-centroid accuracy: `0.9298`.
- 5-nearest-neighbor accuracy: `0.9785`.
- Mean separation ratio: `1.8552`.
- Median separation ratio: `1.0933`.

Interpretation: separation ratio = nearest other family centroid distance / mean within-family distance. Values above 1 indicate the family is, on average, tighter internally than it is close to its nearest competing family.

## Family Cohesion And Separation

| Symbol | Count | Intra mean | Intra p95 | Nearest other | Other distance | Separation ratio | Centroid acc | kNN acc |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| `f:1` | 636 | 2.3121 | 15.2597 | `b:1` | 15.5338 | 6.7185 | 0.9827 | 0.9937 |
| `c:2` | 57 | 7.8642 | 26.6751 | `m:1` | 44.3302 | 5.6370 | 1.0000 | 1.0000 |
| `e:1` | 1763 | 4.0926 | 22.9885 | `h:2` | 15.7020 | 3.8367 | 0.9592 | 0.9983 |
| `j:1` | 160 | 9.0683 | 26.5912 | `h:1` | 20.5467 | 2.2658 | 0.8812 | 0.9688 |
| `a:1` | 570 | 9.7232 | 13.4457 | `h:2` | 13.1590 | 1.3534 | 0.9912 | 0.9912 |
| `c:1` | 924 | 14.5467 | 29.7326 | `i:1` | 17.9618 | 1.2348 | 0.8333 | 0.9892 |
| `h:1` | 277 | 11.2774 | 18.8614 | `a:1` | 13.6672 | 1.2119 | 0.8845 | 0.9314 |
| `g:1` | 408 | 9.0471 | 11.0770 | `b:1` | 9.9183 | 1.0963 | 1.0000 | 0.9779 |
| `h:2` | 197 | 11.6520 | 16.9193 | `i:1` | 12.7043 | 1.0903 | 0.8782 | 0.9391 |
| `l:1` | 39 | 18.6795 | 24.6505 | `b:1` | 16.1321 | 0.8636 | 0.9744 | 0.9744 |
| `k:1` | 84 | 15.0372 | 19.7227 | `b:1` | 12.3109 | 0.8187 | 0.9643 | 1.0000 |
| `m:1` | 92 | 17.0061 | 21.2691 | `b:1` | 13.0971 | 0.7701 | 0.9891 | 0.8913 |
| `i:1` | 330 | 16.7141 | 21.7182 | `h:2` | 12.7043 | 0.7601 | 0.9333 | 0.9879 |
| `b:1` | 246 | 13.4337 | 19.3875 | `g:1` | 9.9183 | 0.7383 | 0.8089 | 0.9512 |
| `d:1` | 335 | 15.8144 | 23.8877 | `g:1` | 10.5297 | 0.6658 | 0.8776 | 0.9433 |
| `n:1` | 104 | 19.1079 | 23.2917 | `d:1` | 11.8986 | 0.6227 | 0.9519 | 0.7981 |

## Strongest Current Morphological Families

- `f:1`: separation ratio `6.7185`, kNN accuracy `0.9937`, nearest competitor `b:1`.
- `c:2`: separation ratio `5.6370`, kNN accuracy `1.0000`, nearest competitor `m:1`.
- `e:1`: separation ratio `3.8367`, kNN accuracy `0.9983`, nearest competitor `h:2`.
- `j:1`: separation ratio `2.2658`, kNN accuracy `0.9688`, nearest competitor `h:1`.
- `a:1`: separation ratio `1.3534`, kNN accuracy `0.9912`, nearest competitor `h:2`.
- `c:1`: separation ratio `1.2348`, kNN accuracy `0.9892`, nearest competitor `i:1`.
- `h:1`: separation ratio `1.2119`, kNN accuracy `0.9314`, nearest competitor `a:1`.
- `g:1`: separation ratio `1.0963`, kNN accuracy `0.9779`, nearest competitor `b:1`.

## Weakest Or Most Confusable Families

- `n:1`: separation ratio `0.6227`, kNN accuracy `0.7981`, nearest competitor `d:1`.
- `d:1`: separation ratio `0.6658`, kNN accuracy `0.9433`, nearest competitor `g:1`.
- `b:1`: separation ratio `0.7383`, kNN accuracy `0.9512`, nearest competitor `g:1`.
- `i:1`: separation ratio `0.7601`, kNN accuracy `0.9879`, nearest competitor `h:2`.
- `m:1`: separation ratio `0.7701`, kNN accuracy `0.8913`, nearest competitor `b:1`.
- `k:1`: separation ratio `0.8187`, kNN accuracy `1.0000`, nearest competitor `b:1`.
- `l:1`: separation ratio `0.8636`, kNN accuracy `0.9744`, nearest competitor `b:1`.
- `h:2`: separation ratio `1.0903`, kNN accuracy `0.9391`, nearest competitor `i:1`.

## Closest Family Pairs

- `b:1` vs `g:1`: centroid distance `9.9183`.
- `d:1` vs `g:1`: centroid distance `10.5297`.
- `d:1` vs `n:1`: centroid distance `11.8986`.
- `b:1` vs `k:1`: centroid distance `12.3109`.
- `b:1` vs `d:1`: centroid distance `12.4751`.
- `h:2` vs `i:1`: centroid distance `12.7043`.
- `b:1` vs `m:1`: centroid distance `13.0971`.
- `a:1` vs `h:2`: centroid distance `13.1590`.
- `b:1` vs `i:1`: centroid distance `13.1908`.
- `d:1` vs `i:1`: centroid distance `13.5038`.
- `a:1` vs `h:1`: centroid distance `13.6672`.
- `d:1` vs `m:1`: centroid distance `13.6803`.

## Representative And Outlier Snapshots

| Symbol | Kind | Atom | Image | Distance | Snapshot |
| --- | --- | ---: | --- | ---: | --- |
| `a:1` | representative | 3220 | `page-003.jpg` | 6.7212 | `atoms\a_1\page-003.jpg\3220.svg` |
| `a:1` | representative | 2895 | `page-094.jpg` | 6.7269 | `atoms\a_1\page-094.jpg\2895.svg` |
| `a:1` | representative | 4709 | `page-004.jpg` | 6.7439 | `atoms\a_1\page-004.jpg\4709.svg` |
| `a:1` | outlier | 4678 | `page-004.jpg` | 17.1392 | `atoms\a_1\page-004.jpg\4678.svg` |
| `a:1` | outlier | 5549 | `page-005.jpg` | 16.9988 | `atoms\a_1\page-005.jpg\5549.svg` |
| `a:1` | outlier | 4676 | `page-004.jpg` | 16.9818 | `atoms\a_1\page-004.jpg\4676.svg` |
| `b:1` | representative | 981 | `page-003.jpg` | 9.9144 | `atoms\b_1\page-003.jpg\981.svg` |
| `b:1` | representative | 5568 | `page-005.jpg` | 9.9420 | `atoms\b_1\page-005.jpg\5568.svg` |
| `b:1` | representative | 2070 | `page-003.jpg` | 10.0027 | `atoms\b_1\page-003.jpg\2070.svg` |
| `b:1` | outlier | 4239 | `page-094.jpg` | 21.6391 | `atoms\b_1\page-094.jpg\4239.svg` |
| `b:1` | outlier | 5570 | `page-005.jpg` | 21.0219 | `atoms\b_1\page-005.jpg\5570.svg` |
| `b:1` | outlier | 4756 | `page-004.jpg` | 20.2820 | `atoms\b_1\page-004.jpg\4756.svg` |
| `c:1` | representative | 3175 | `page-003.jpg` | 7.9246 | `atoms\c_1\page-003.jpg\3175.svg` |
| `c:1` | representative | 3173 | `page-003.jpg` | 7.9246 | `atoms\c_1\page-003.jpg\3173.svg` |
| `c:1` | representative | 3179 | `page-003.jpg` | 7.9246 | `atoms\c_1\page-003.jpg\3179.svg` |
| `c:1` | outlier | 5621 | `page-005.jpg` | 46.2158 | `atoms\c_1\page-005.jpg\5621.svg` |
| `c:1` | outlier | 7588 | `page-007.jpg` | 41.1189 | `atoms\c_1\page-007.jpg\7588.svg` |
| `c:1` | outlier | 5714 | `page-005.jpg` | 40.0620 | `atoms\c_1\page-005.jpg\5714.svg` |
| `d:1` | representative | 2517 | `page-003.jpg` | 10.9082 | `atoms\d_1\page-003.jpg\2517.svg` |
| `d:1` | representative | 6350 | `page-005.jpg` | 11.1514 | `atoms\d_1\page-005.jpg\6350.svg` |
| `d:1` | representative | 6361 | `page-005.jpg` | 11.2177 | `atoms\d_1\page-005.jpg\6361.svg` |
| `d:1` | outlier | 8143 | `page-007.jpg` | 59.6116 | `atoms\d_1\page-007.jpg\8143.svg` |
| `d:1` | outlier | 8157 | `page-007.jpg` | 56.5617 | `atoms\d_1\page-007.jpg\8157.svg` |
| `d:1` | outlier | 6753 | `page-006.jpg` | 45.8514 | `atoms\d_1\page-006.jpg\6753.svg` |
| `e:1` | representative | 993 | `page-003.jpg` | 1.6276 | `atoms\e_1\page-003.jpg\993.svg` |
| `e:1` | representative | 996 | `page-003.jpg` | 1.6276 | `atoms\e_1\page-003.jpg\996.svg` |
| `e:1` | representative | 1263 | `page-003.jpg` | 1.6276 | `atoms\e_1\page-003.jpg\1263.svg` |
| `e:1` | outlier | 7971 | `page-007.jpg` | 39.1241 | `atoms\e_1\page-007.jpg\7971.svg` |
| `e:1` | outlier | 2416 | `page-003.jpg` | 37.0198 | `atoms\e_1\page-003.jpg\2416.svg` |
| `e:1` | outlier | 1944 | `page-003.jpg` | 34.8125 | `atoms\e_1\page-003.jpg\1944.svg` |
| `f:1` | representative | 1254 | `page-003.jpg` | 0.8833 | `atoms\f_1\page-003.jpg\1254.svg` |
| `f:1` | representative | 3185 | `page-003.jpg` | 0.8833 | `atoms\f_1\page-003.jpg\3185.svg` |
| `f:1` | representative | 3182 | `page-003.jpg` | 0.8833 | `atoms\f_1\page-003.jpg\3182.svg` |
| `f:1` | outlier | 999 | `page-003.jpg` | 57.3070 | `atoms\f_1\page-003.jpg\999.svg` |
| `f:1` | outlier | 2514 | `page-003.jpg` | 52.1563 | `atoms\f_1\page-003.jpg\2514.svg` |
| `f:1` | outlier | 1644 | `page-003.jpg` | 37.8035 | `atoms\f_1\page-003.jpg\1644.svg` |
| `g:1` | representative | 7003 | `page-006.jpg` | 7.6413 | `atoms\g_1\page-006.jpg\7003.svg` |
| `g:1` | representative | 1705 | `page-003.jpg` | 7.6596 | `atoms\g_1\page-003.jpg\1705.svg` |
| `g:1` | representative | 2438 | `page-003.jpg` | 7.6948 | `atoms\g_1\page-003.jpg\2438.svg` |
| `g:1` | outlier | 1413 | `page-003.jpg` | 16.2577 | `atoms\g_1\page-003.jpg\1413.svg` |
| `g:1` | outlier | 7247 | `page-007.jpg` | 12.3702 | `atoms\g_1\page-007.jpg\7247.svg` |
| `g:1` | outlier | 5144 | `page-004.jpg` | 11.6751 | `atoms\g_1\page-004.jpg\5144.svg` |
| `h:1` | representative | 3304 | `page-003.jpg` | 7.0044 | `atoms\h_1\page-003.jpg\3304.svg` |
| `h:1` | representative | 3340 | `page-003.jpg` | 7.0044 | `atoms\h_1\page-003.jpg\3340.svg` |
| `h:1` | representative | 3338 | `page-003.jpg` | 7.0044 | `atoms\h_1\page-003.jpg\3338.svg` |
| `h:1` | outlier | 7094 | `page-007.jpg` | 25.1676 | `atoms\h_1\page-007.jpg\7094.svg` |
| `h:1` | outlier | 1509 | `page-003.jpg` | 24.6406 | `atoms\h_1\page-003.jpg\1509.svg` |
| `h:1` | outlier | 8201 | `page-007.jpg` | 23.6450 | `atoms\h_1\page-007.jpg\8201.svg` |
| `i:1` | representative | 6314 | `page-005.jpg` | 12.7472 | `atoms\i_1\page-005.jpg\6314.svg` |
| `i:1` | representative | 6293 | `page-005.jpg` | 12.8479 | `atoms\i_1\page-005.jpg\6293.svg` |
| `i:1` | representative | 8109 | `page-007.jpg` | 12.9752 | `atoms\i_1\page-007.jpg\8109.svg` |
| `i:1` | outlier | 3290 | `page-003.jpg` | 24.7077 | `atoms\i_1\page-003.jpg\3290.svg` |
| `i:1` | outlier | 7406 | `page-007.jpg` | 24.4138 | `atoms\i_1\page-007.jpg\7406.svg` |
| `i:1` | outlier | 4632 | `page-094.jpg` | 24.0965 | `atoms\i_1\page-094.jpg\4632.svg` |
| `m:1` | representative | 4340 | `page-094.jpg` | 13.3209 | `atoms\m_1\page-094.jpg\4340.svg` |
| `m:1` | representative | 7828 | `page-007.jpg` | 13.3628 | `atoms\m_1\page-007.jpg\7828.svg` |
| `m:1` | representative | 3899 | `page-003.jpg` | 13.5251 | `atoms\m_1\page-003.jpg\3899.svg` |
| `m:1` | outlier | 7841 | `page-007.jpg` | 25.2933 | `atoms\m_1\page-007.jpg\7841.svg` |
| `m:1` | outlier | 3035 | `page-003.jpg` | 22.7056 | `atoms\m_1\page-003.jpg\3035.svg` |
| `m:1` | outlier | 3040 | `page-003.jpg` | 22.2588 | `atoms\m_1\page-003.jpg\3040.svg` |
| `j:1` | representative | 3210 | `page-003.jpg` | 4.3616 | `atoms\j_1\page-003.jpg\3210.svg` |
| `j:1` | representative | 3212 | `page-003.jpg` | 4.3616 | `atoms\j_1\page-003.jpg\3212.svg` |
| `j:1` | representative | 3213 | `page-003.jpg` | 4.3616 | `atoms\j_1\page-003.jpg\3213.svg` |
| `j:1` | outlier | 2273 | `page-003.jpg` | 31.1000 | `atoms\j_1\page-003.jpg\2273.svg` |
| `j:1` | outlier | 2220 | `page-003.jpg` | 29.5210 | `atoms\j_1\page-003.jpg\2220.svg` |
| `j:1` | outlier | 8173 | `page-007.jpg` | 28.9166 | `atoms\j_1\page-007.jpg\8173.svg` |
| `h:2` | representative | 6091 | `page-005.jpg` | 8.0250 | `atoms\h_2\page-005.jpg\6091.svg` |
| `h:2` | representative | 6092 | `page-005.jpg` | 8.0250 | `atoms\h_2\page-005.jpg\6092.svg` |
| `h:2` | representative | 6093 | `page-005.jpg` | 8.0250 | `atoms\h_2\page-005.jpg\6093.svg` |
| `h:2` | outlier | 1764 | `page-003.jpg` | 19.7612 | `atoms\h_2\page-003.jpg\1764.svg` |
| `h:2` | outlier | 2013 | `page-003.jpg` | 18.9060 | `atoms\h_2\page-003.jpg\2013.svg` |
| `h:2` | outlier | 5309 | `page-004.jpg` | 18.0206 | `atoms\h_2\page-004.jpg\5309.svg` |
| `k:1` | representative | 6665 | `page-006.jpg` | 11.4648 | `atoms\k_1\page-006.jpg\6665.svg` |
| `k:1` | representative | 6663 | `page-006.jpg` | 11.6540 | `atoms\k_1\page-006.jpg\6663.svg` |
| `k:1` | representative | 4644 | `page-094.jpg` | 11.6599 | `atoms\k_1\page-094.jpg\4644.svg` |
| `k:1` | outlier | 3975 | `page-003.jpg` | 21.9547 | `atoms\k_1\page-003.jpg\3975.svg` |
| `k:1` | outlier | 5410 | `page-004.jpg` | 21.6421 | `atoms\k_1\page-004.jpg\5410.svg` |
| `k:1` | outlier | 7757 | `page-007.jpg` | 21.6344 | `atoms\k_1\page-007.jpg\7757.svg` |
| `n:1` | representative | 3700 | `page-094.jpg` | 15.8675 | `atoms\n_1\page-094.jpg\3700.svg` |
| `n:1` | representative | 3706 | `page-094.jpg` | 16.1704 | `atoms\n_1\page-094.jpg\3706.svg` |
| `n:1` | representative | 6496 | `page-005.jpg` | 16.3011 | `atoms\n_1\page-005.jpg\6496.svg` |
| `n:1` | outlier | 3672 | `page-003.jpg` | 30.5884 | `atoms\n_1\page-003.jpg\3672.svg` |
| `n:1` | outlier | 3664 | `page-003.jpg` | 26.3094 | `atoms\n_1\page-003.jpg\3664.svg` |
| `n:1` | outlier | 3686 | `page-003.jpg` | 25.5747 | `atoms\n_1\page-003.jpg\3686.svg` |
| `l:1` | representative | 2117 | `page-003.jpg` | 13.6804 | `atoms\l_1\page-003.jpg\2117.svg` |
| `l:1` | representative | 3484 | `page-003.jpg` | 13.8402 | `atoms\l_1\page-003.jpg\3484.svg` |
| `l:1` | representative | 1986 | `page-003.jpg` | 14.0651 | `atoms\l_1\page-003.jpg\1986.svg` |
| `l:1` | outlier | 6225 | `page-005.jpg` | 43.9810 | `atoms\l_1\page-005.jpg\6225.svg` |
| `l:1` | outlier | 8274 | `page-003.jpg` | 27.2804 | `` |
| `l:1` | outlier | 7526 | `page-007.jpg` | 24.3583 | `atoms\l_1\page-007.jpg\7526.svg` |
| `c:2` | representative | 3787 | `page-003.jpg` | 3.7158 | `atoms\c_2\page-003.jpg\3787.svg` |
| `c:2` | representative | 6651 | `page-006.jpg` | 3.7158 | `atoms\c_2\page-006.jpg\6651.svg` |
| `c:2` | representative | 7888 | `page-007.jpg` | 3.7158 | `atoms\c_2\page-007.jpg\7888.svg` |
| `c:2` | outlier | 4162 | `page-003.jpg` | 32.2592 | `atoms\c_2\page-003.jpg\4162.svg` |
| `c:2` | outlier | 6488 | `page-005.jpg` | 28.9272 | `atoms\c_2\page-005.jpg\6488.svg` |
| `c:2` | outlier | 4099 | `page-003.jpg` | 28.6538 | `atoms\c_2\page-003.jpg\4099.svg` |

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
