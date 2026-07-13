# Morphology Family Analysis

## Purpose

Test whether hand-labeled atom families form recurrent, measurable shape classes without using position, EVA text, or contextual grammar rules.

## Method

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`.
- Raw atoms read: `4557`.
- Eligible symbols: `16` with at least `8` samples.
- Shape normalization: bounding-box centering, max-dimension scaling, `32` resampled path points, and `16x16` occupancy mask.
- Classifier check: leave-one-out nearest centroid and 5-nearest-neighbor using only normalized morphology features.

## Global Result

- Nearest-centroid accuracy: `0.9394`.
- 5-nearest-neighbor accuracy: `0.9763`.
- Mean separation ratio: `1.4285`.
- Median separation ratio: `0.9970`.

Interpretation: separation ratio = nearest other family centroid distance / mean within-family distance. Values above 1 indicate the family is, on average, tighter internally than it is close to its nearest competing family.

## Family Cohesion And Separation

| Symbol | Count | Intra mean | Intra p95 | Nearest other | Other distance | Separation ratio | Centroid acc | kNN acc |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| `f:1` | 459 | 3.1271 | 15.9898 | `h:2` | 15.3710 | 4.9154 | 0.9782 | 0.9935 |
| `e:1` | 1332 | 4.7548 | 22.6474 | `h:2` | 15.5169 | 3.2634 | 0.9640 | 0.9962 |
| `j:1` | 114 | 11.0425 | 27.4915 | `n:1` | 20.2398 | 1.8329 | 0.8772 | 0.9474 |
| `c:2` | 34 | 23.0388 | 40.7629 | `m:1` | 34.5543 | 1.4998 | 0.7647 | 0.7647 |
| `h:1` | 209 | 9.8782 | 18.9730 | `a:1` | 14.5993 | 1.4779 | 0.9187 | 0.9809 |
| `a:1` | 419 | 9.7556 | 12.9702 | `h:2` | 12.8780 | 1.3201 | 0.9905 | 0.9905 |
| `g:1` | 298 | 9.1152 | 11.1819 | `b:1` | 10.2873 | 1.1286 | 1.0000 | 0.9698 |
| `h:2` | 160 | 12.0702 | 17.0813 | `i:1` | 12.3730 | 1.0251 | 0.8750 | 0.9625 |
| `c:1` | 642 | 17.9164 | 28.3790 | `n:1` | 17.3616 | 0.9690 | 0.8832 | 0.9829 |
| `l:1` | 31 | 17.6733 | 28.7643 | `b:1` | 16.8905 | 0.9557 | 1.0000 | 1.0000 |
| `k:1` | 65 | 15.0549 | 20.3470 | `b:1` | 12.3353 | 0.8194 | 0.9538 | 1.0000 |
| `m:1` | 51 | 16.9596 | 21.3339 | `b:1` | 13.3280 | 0.7859 | 0.9804 | 0.8627 |
| `i:1` | 222 | 16.0576 | 22.1182 | `h:2` | 12.3730 | 0.7705 | 0.9775 | 0.9865 |
| `b:1` | 191 | 13.7000 | 19.7579 | `g:1` | 10.2873 | 0.7509 | 0.8272 | 0.9581 |
| `d:1` | 248 | 14.8795 | 22.2889 | `g:1` | 10.3547 | 0.6959 | 0.8669 | 0.9476 |
| `n:1` | 82 | 19.1999 | 24.0761 | `d:1` | 12.3942 | 0.6455 | 0.9390 | 0.7439 |

## Strongest Current Morphological Families

- `f:1`: separation ratio `4.9154`, kNN accuracy `0.9935`, nearest competitor `h:2`.
- `e:1`: separation ratio `3.2634`, kNN accuracy `0.9962`, nearest competitor `h:2`.
- `j:1`: separation ratio `1.8329`, kNN accuracy `0.9474`, nearest competitor `n:1`.
- `c:2`: separation ratio `1.4998`, kNN accuracy `0.7647`, nearest competitor `m:1`.
- `h:1`: separation ratio `1.4779`, kNN accuracy `0.9809`, nearest competitor `a:1`.
- `a:1`: separation ratio `1.3201`, kNN accuracy `0.9905`, nearest competitor `h:2`.
- `g:1`: separation ratio `1.1286`, kNN accuracy `0.9698`, nearest competitor `b:1`.
- `h:2`: separation ratio `1.0251`, kNN accuracy `0.9625`, nearest competitor `i:1`.

## Weakest Or Most Confusable Families

- `n:1`: separation ratio `0.6455`, kNN accuracy `0.7439`, nearest competitor `d:1`.
- `d:1`: separation ratio `0.6959`, kNN accuracy `0.9476`, nearest competitor `g:1`.
- `b:1`: separation ratio `0.7509`, kNN accuracy `0.9581`, nearest competitor `g:1`.
- `i:1`: separation ratio `0.7705`, kNN accuracy `0.9865`, nearest competitor `h:2`.
- `m:1`: separation ratio `0.7859`, kNN accuracy `0.8627`, nearest competitor `b:1`.
- `k:1`: separation ratio `0.8194`, kNN accuracy `1.0000`, nearest competitor `b:1`.
- `l:1`: separation ratio `0.9557`, kNN accuracy `1.0000`, nearest competitor `b:1`.
- `c:1`: separation ratio `0.9690`, kNN accuracy `0.9829`, nearest competitor `n:1`.

## Closest Family Pairs

- `b:1` vs `g:1`: centroid distance `10.2873`.
- `d:1` vs `g:1`: centroid distance `10.3547`.
- `b:1` vs `k:1`: centroid distance `12.3353`.
- `h:2` vs `i:1`: centroid distance `12.3730`.
- `d:1` vs `n:1`: centroid distance `12.3942`.
- `b:1` vs `d:1`: centroid distance `12.5494`.
- `a:1` vs `h:2`: centroid distance `12.8780`.
- `b:1` vs `m:1`: centroid distance `13.3280`.
- `d:1` vs `i:1`: centroid distance `13.8751`.
- `b:1` vs `i:1`: centroid distance `14.0279`.
- `i:1` vs `n:1`: centroid distance `14.1884`.
- `d:1` vs `m:1`: centroid distance `14.2599`.

## Representative And Outlier Snapshots

| Symbol | Kind | Atom | Image | Distance | Snapshot |
| --- | --- | ---: | --- | ---: | --- |
| `a:1` | representative | 3220 | `page-003.jpg` | 6.5686 | `atoms\a_1\page-003.jpg\3220.svg` |
| `a:1` | representative | 2895 | `page-094.jpg` | 6.5688 | `atoms\a_1\page-094.jpg\2895.svg` |
| `a:1` | representative | 4709 | `page-004.jpg` | 6.5876 | `atoms\a_1\page-004.jpg\4709.svg` |
| `a:1` | outlier | 5549 | `page-005.jpg` | 17.5962 | `atoms\a_1\page-005.jpg\5549.svg` |
| `a:1` | outlier | 5551 | `page-005.jpg` | 17.5567 | `atoms\a_1\page-005.jpg\5551.svg` |
| `a:1` | outlier | 4678 | `page-004.jpg` | 17.2413 | `atoms\a_1\page-004.jpg\4678.svg` |
| `b:1` | representative | 981 | `page-003.jpg` | 10.1282 | `atoms\b_1\page-003.jpg\981.svg` |
| `b:1` | representative | 3397 | `page-003.jpg` | 10.1779 | `atoms\b_1\page-003.jpg\3397.svg` |
| `b:1` | representative | 5568 | `page-005.jpg` | 10.2014 | `atoms\b_1\page-005.jpg\5568.svg` |
| `b:1` | outlier | 4239 | `page-094.jpg` | 21.6584 | `atoms\b_1\page-094.jpg\4239.svg` |
| `b:1` | outlier | 5570 | `page-005.jpg` | 21.1093 | `atoms\b_1\page-005.jpg\5570.svg` |
| `b:1` | outlier | 4756 | `page-004.jpg` | 20.6302 | `atoms\b_1\page-004.jpg\4756.svg` |
| `c:1` | representative | 3173 | `page-003.jpg` | 11.1642 | `atoms\c_1\page-003.jpg\3173.svg` |
| `c:1` | representative | 3179 | `page-003.jpg` | 11.1642 | `atoms\c_1\page-003.jpg\3179.svg` |
| `c:1` | representative | 3176 | `page-003.jpg` | 11.1642 | `atoms\c_1\page-003.jpg\3176.svg` |
| `c:1` | outlier | 2696 | `page-094.jpg` | 49.4342 | `atoms\c_1\page-094.jpg\2696.svg` |
| `c:1` | outlier | 5621 | `page-005.jpg` | 47.7775 | `atoms\c_1\page-005.jpg\5621.svg` |
| `c:1` | outlier | 5714 | `page-005.jpg` | 41.2612 | `atoms\c_1\page-005.jpg\5714.svg` |
| `d:1` | representative | 6361 | `page-005.jpg` | 10.4070 | `atoms\d_1\page-005.jpg\6361.svg` |
| `d:1` | representative | 2517 | `page-003.jpg` | 10.4644 | `atoms\d_1\page-003.jpg\2517.svg` |
| `d:1` | representative | 6333 | `page-005.jpg` | 10.4952 | `atoms\d_1\page-005.jpg\6333.svg` |
| `d:1` | outlier | 3985 | `page-003.jpg` | 29.3802 | `atoms\d_1\page-003.jpg\3985.svg` |
| `d:1` | outlier | 6325 | `page-005.jpg` | 28.3942 | `atoms\d_1\page-005.jpg\6325.svg` |
| `d:1` | outlier | 6321 | `page-005.jpg` | 25.7236 | `atoms\d_1\page-005.jpg\6321.svg` |
| `f:1` | representative | 1254 | `page-003.jpg` | 1.2127 | `atoms\f_1\page-003.jpg\1254.svg` |
| `f:1` | representative | 3182 | `page-003.jpg` | 1.2127 | `atoms\f_1\page-003.jpg\3182.svg` |
| `f:1` | representative | 3188 | `page-003.jpg` | 1.2127 | `atoms\f_1\page-003.jpg\3188.svg` |
| `f:1` | outlier | 999 | `page-003.jpg` | 60.2347 | `atoms\f_1\page-003.jpg\999.svg` |
| `f:1` | outlier | 2514 | `page-003.jpg` | 57.1963 | `atoms\f_1\page-003.jpg\2514.svg` |
| `f:1` | outlier | 1644 | `page-003.jpg` | 36.6600 | `atoms\f_1\page-003.jpg\1644.svg` |
| `i:1` | representative | 6314 | `page-005.jpg` | 12.0559 | `atoms\i_1\page-005.jpg\6314.svg` |
| `i:1` | representative | 6293 | `page-005.jpg` | 12.2095 | `atoms\i_1\page-005.jpg\6293.svg` |
| `i:1` | representative | 2153 | `page-003.jpg` | 12.7143 | `atoms\i_1\page-003.jpg\2153.svg` |
| `i:1` | outlier | 3290 | `page-003.jpg` | 24.1071 | `atoms\i_1\page-003.jpg\3290.svg` |
| `i:1` | outlier | 2417 | `page-003.jpg` | 24.0331 | `atoms\i_1\page-003.jpg\2417.svg` |
| `i:1` | outlier | 6249 | `page-005.jpg` | 23.8991 | `atoms\i_1\page-005.jpg\6249.svg` |
| `e:1` | representative | 996 | `page-003.jpg` | 1.9145 | `atoms\e_1\page-003.jpg\996.svg` |
| `e:1` | representative | 993 | `page-003.jpg` | 1.9145 | `atoms\e_1\page-003.jpg\993.svg` |
| `e:1` | representative | 1263 | `page-003.jpg` | 1.9145 | `atoms\e_1\page-003.jpg\1263.svg` |
| `e:1` | outlier | 2416 | `page-003.jpg` | 41.7227 | `atoms\e_1\page-003.jpg\2416.svg` |
| `e:1` | outlier | 1944 | `page-003.jpg` | 38.8529 | `atoms\e_1\page-003.jpg\1944.svg` |
| `e:1` | outlier | 2099 | `page-003.jpg` | 36.5260 | `atoms\e_1\page-003.jpg\2099.svg` |
| `h:1` | representative | 3304 | `page-003.jpg` | 5.6484 | `atoms\h_1\page-003.jpg\3304.svg` |
| `h:1` | representative | 3340 | `page-003.jpg` | 5.6484 | `atoms\h_1\page-003.jpg\3340.svg` |
| `h:1` | representative | 3338 | `page-003.jpg` | 5.6484 | `atoms\h_1\page-003.jpg\3338.svg` |
| `h:1` | outlier | 1509 | `page-003.jpg` | 25.2959 | `atoms\h_1\page-003.jpg\1509.svg` |
| `h:1` | outlier | 1727 | `page-003.jpg` | 21.6397 | `atoms\h_1\page-003.jpg\1727.svg` |
| `h:1` | outlier | 1947 | `page-003.jpg` | 21.3635 | `atoms\h_1\page-003.jpg\1947.svg` |
| `g:1` | representative | 1705 | `page-003.jpg` | 7.6320 | `atoms\g_1\page-003.jpg\1705.svg` |
| `g:1` | representative | 2438 | `page-003.jpg` | 7.6681 | `atoms\g_1\page-003.jpg\2438.svg` |
| `g:1` | representative | 1382 | `page-003.jpg` | 7.6826 | `atoms\g_1\page-003.jpg\1382.svg` |
| `g:1` | outlier | 1413 | `page-003.jpg` | 16.2972 | `atoms\g_1\page-003.jpg\1413.svg` |
| `g:1` | outlier | 5144 | `page-004.jpg` | 11.6892 | `atoms\g_1\page-004.jpg\5144.svg` |
| `g:1` | outlier | 2493 | `page-003.jpg` | 11.2387 | `atoms\g_1\page-003.jpg\2493.svg` |
| `m:1` | representative | 3899 | `page-003.jpg` | 13.1315 | `atoms\m_1\page-003.jpg\3899.svg` |
| `m:1` | representative | 3900 | `page-003.jpg` | 13.1315 | `atoms\m_1\page-003.jpg\3900.svg` |
| `m:1` | representative | 3031 | `page-003.jpg` | 13.1315 | `atoms\m_1\page-003.jpg\3031.svg` |
| `m:1` | outlier | 3035 | `page-003.jpg` | 23.0474 | `atoms\m_1\page-003.jpg\3035.svg` |
| `m:1` | outlier | 3040 | `page-003.jpg` | 22.1460 | `atoms\m_1\page-003.jpg\3040.svg` |
| `m:1` | outlier | 5466 | `page-004.jpg` | 21.6344 | `atoms\m_1\page-004.jpg\5466.svg` |
| `h:2` | representative | 6091 | `page-005.jpg` | 8.4143 | `atoms\h_2\page-005.jpg\6091.svg` |
| `h:2` | representative | 6092 | `page-005.jpg` | 8.4143 | `atoms\h_2\page-005.jpg\6092.svg` |
| `h:2` | representative | 6093 | `page-005.jpg` | 8.4143 | `atoms\h_2\page-005.jpg\6093.svg` |
| `h:2` | outlier | 1764 | `page-003.jpg` | 19.3090 | `atoms\h_2\page-003.jpg\1764.svg` |
| `h:2` | outlier | 2013 | `page-003.jpg` | 18.5423 | `atoms\h_2\page-003.jpg\2013.svg` |
| `h:2` | outlier | 5309 | `page-004.jpg` | 17.7223 | `atoms\h_2\page-004.jpg\5309.svg` |
| `k:1` | representative | 4644 | `page-094.jpg` | 12.0885 | `atoms\k_1\page-094.jpg\4644.svg` |
| `k:1` | representative | 1347 | `page-003.jpg` | 12.1112 | `atoms\k_1\page-003.jpg\1347.svg` |
| `k:1` | representative | 2374 | `page-003.jpg` | 12.2918 | `atoms\k_1\page-003.jpg\2374.svg` |
| `k:1` | outlier | 3975 | `page-003.jpg` | 22.3097 | `atoms\k_1\page-003.jpg\3975.svg` |
| `k:1` | outlier | 5410 | `page-004.jpg` | 22.1863 | `atoms\k_1\page-004.jpg\5410.svg` |
| `k:1` | outlier | 3973 | `page-003.jpg` | 21.5338 | `atoms\k_1\page-003.jpg\3973.svg` |
| `n:1` | representative | 3700 | `page-094.jpg` | 15.1755 | `atoms\n_1\page-094.jpg\3700.svg` |
| `n:1` | representative | 3706 | `page-094.jpg` | 15.2792 | `atoms\n_1\page-094.jpg\3706.svg` |
| `n:1` | representative | 5459 | `page-004.jpg` | 15.6723 | `atoms\n_1\page-004.jpg\5459.svg` |
| `n:1` | outlier | 3672 | `page-003.jpg` | 30.4818 | `atoms\n_1\page-003.jpg\3672.svg` |
| `n:1` | outlier | 3664 | `page-003.jpg` | 26.1582 | `atoms\n_1\page-003.jpg\3664.svg` |
| `n:1` | outlier | 3686 | `page-003.jpg` | 25.5313 | `atoms\n_1\page-003.jpg\3686.svg` |
| `j:1` | representative | 3212 | `page-003.jpg` | 5.4500 | `atoms\j_1\page-003.jpg\3212.svg` |
| `j:1` | representative | 3213 | `page-003.jpg` | 5.4500 | `atoms\j_1\page-003.jpg\3213.svg` |
| `j:1` | representative | 3283 | `page-003.jpg` | 5.4500 | `atoms\j_1\page-003.jpg\3283.svg` |
| `j:1` | outlier | 6379 | `page-005.jpg` | 49.9134 | `atoms\j_1\page-005.jpg\6379.svg` |
| `j:1` | outlier | 2273 | `page-003.jpg` | 31.0910 | `atoms\j_1\page-003.jpg\2273.svg` |
| `j:1` | outlier | 2220 | `page-003.jpg` | 29.4453 | `atoms\j_1\page-003.jpg\2220.svg` |
| `c:2` | representative | 3379 | `page-003.jpg` | 14.5313 | `atoms\c_2\page-003.jpg\3379.svg` |
| `c:2` | representative | 3787 | `page-003.jpg` | 14.5313 | `atoms\c_2\page-003.jpg\3787.svg` |
| `c:2` | representative | 2753 | `page-094.jpg` | 14.5313 | `atoms\c_2\page-094.jpg\2753.svg` |
| `c:2` | outlier | 5103 | `page-004.jpg` | 41.5575 | `atoms\c_2\page-004.jpg\5103.svg` |
| `c:2` | outlier | 1136 | `page-003.jpg` | 41.1769 | `atoms\c_2\page-003.jpg\1136.svg` |
| `c:2` | outlier | 2293 | `page-003.jpg` | 40.5400 | `atoms\c_2\page-003.jpg\2293.svg` |
| `l:1` | representative | 3484 | `page-003.jpg` | 12.0639 | `atoms\l_1\page-003.jpg\3484.svg` |
| `l:1` | representative | 1212 | `page-003.jpg` | 12.1853 | `atoms\l_1\page-003.jpg\1212.svg` |
| `l:1` | representative | 1633 | `page-003.jpg` | 12.1853 | `atoms\l_1\page-003.jpg\1633.svg` |
| `l:1` | outlier | 6225 | `page-005.jpg` | 45.9970 | `atoms\l_1\page-005.jpg\6225.svg` |
| `l:1` | outlier | 2596 | `page-003.jpg` | 28.9458 | `atoms\l_1\page-003.jpg\2596.svg` |
| `l:1` | outlier | 3869 | `page-003.jpg` | 28.5829 | `atoms\l_1\page-003.jpg\3869.svg` |

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
