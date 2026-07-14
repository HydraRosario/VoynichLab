# Contextual Rule Discovery

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-006.jpg`, `page-007.jpg`, `page-094.jpg`
- Context scope: `particle`
- Symbols audited: `a:1`, `b:1`, `c:1`, `c:2`, `d:1`, `e:1`, `f:1`, `g:1`, `h:1`, `h:2`, `i:1`, `j:1`, `k:1`, `l:1`, `m:1`, `n:1`

## a:1

Occurrences: `570`

| Role | Count |
| --- | ---: |
| initial | 225 |
| medial | 177 |
| final | 168 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | c:1 | 166 | 168 | 0.9881 | 95/402 (0.2363) | 0.7518 |
| final | prev_is | c:1 | 166 | 168 | 0.9881 | 95/402 (0.2363) | 0.7518 |
| initial | has_after | c:1 | 218 | 225 | 0.9689 | 80/345 (0.2319) | 0.7370 |
| medial | has_prior | e:1 | 158 | 177 | 0.8927 | 36/393 (0.0916) | 0.8011 |
| medial | starts_with | e:1 | 148 | 177 | 0.8362 | 0/393 (0.0000) | 0.8362 |
| medial | has_after | e:1 | 148 | 177 | 0.8362 | 49/393 (0.1247) | 0.7115 |
| medial | has_after | g:1 | 145 | 177 | 0.8192 | 3/393 (0.0076) | 0.8116 |
| final | has_prior | b:1 | 134 | 168 | 0.7976 | 75/402 (0.1866) | 0.6111 |
| medial | ends_with | e:1 | 137 | 177 | 0.7740 | 3/393 (0.0076) | 0.7664 |

## b:1

Occurrences: `246`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 246 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | a:1 | 246 | 246 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_after | a:1 | 209 | 246 | 0.8496 | 0/0 (0.0000) | 0.8496 |
| medial | has_after | c:1 | 205 | 246 | 0.8333 | 0/0 (0.0000) | 0.8333 |
| medial | next_is | c:1 | 204 | 246 | 0.8293 | 0/0 (0.0000) | 0.8293 |
| medial | starts_with | a:1 | 169 | 246 | 0.6870 | 0/0 (0.0000) | 0.6870 |
| medial | prev_is | a:1 | 155 | 246 | 0.6301 | 0/0 (0.0000) | 0.6301 |
| medial | ends_with | a:1 | 134 | 246 | 0.5447 | 0/0 (0.0000) | 0.5447 |
| medial | has_prior | e:1 | 132 | 246 | 0.5366 | 0/0 (0.0000) | 0.5366 |

## c:1

Occurrences: `924`

| Role | Count |
| --- | ---: |
| initial | 1 |
| medial | 470 |
| final | 37 |
| singleton | 416 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | next_is | g:1 | 1 | 1 | 1.0000 | 0/923 (0.0000) | 1.0000 |
| initial | ends_with | h:1 | 1 | 1 | 1.0000 | 25/923 (0.0271) | 0.9729 |
| initial | has_after | h:1 | 1 | 1 | 1.0000 | 25/923 (0.0271) | 0.9729 |
| initial | has_after | e:1 | 1 | 1 | 1.0000 | 73/923 (0.0791) | 0.9209 |
| initial | has_after | g:1 | 1 | 1 | 1.0000 | 74/923 (0.0802) | 0.9198 |
| final | has_prior | a:1 | 36 | 37 | 0.9730 | 262/887 (0.2954) | 0.6776 |
| final | starts_with | a:1 | 34 | 37 | 0.9189 | 185/887 (0.2086) | 0.7104 |
| final | prev_is | m:1 | 32 | 37 | 0.8649 | 58/887 (0.0654) | 0.7995 |
| final | has_prior | m:1 | 32 | 37 | 0.8649 | 59/887 (0.0665) | 0.7983 |
| medial | has_prior | e:1 | 305 | 470 | 0.6489 | 4/454 (0.0088) | 0.6401 |
| medial | has_prior | a:1 | 262 | 470 | 0.5574 | 36/454 (0.0793) | 0.4782 |
| medial | has_after | a:1 | 261 | 470 | 0.5553 | 0/454 (0.0000) | 0.5553 |
| medial | next_is | a:1 | 261 | 470 | 0.5553 | 0/454 (0.0000) | 0.5553 |
| medial | starts_with | e:1 | 261 | 470 | 0.5553 | 3/454 (0.0066) | 0.5487 |

## c:2

Occurrences: `57`

| Role | Count |
| --- | ---: |
| initial | 20 |
| medial | 30 |
| final | 6 |
| singleton | 1 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | ends_with | e:1 | 19 | 20 | 0.9500 | 5/37 (0.1351) | 0.8149 |
| initial | has_after | e:1 | 19 | 20 | 0.9500 | 6/37 (0.1622) | 0.7878 |
| initial | has_after | g:1 | 19 | 20 | 0.9500 | 6/37 (0.1622) | 0.7878 |
| initial | next_is | g:1 | 17 | 20 | 0.8500 | 5/37 (0.1351) | 0.7149 |
| final | has_prior | b:1 | 5 | 6 | 0.8333 | 5/51 (0.0980) | 0.7353 |
| final | starts_with | a:1 | 5 | 6 | 0.8333 | 7/51 (0.1373) | 0.6961 |
| final | prev_is | a:1 | 5 | 6 | 0.8333 | 8/51 (0.1569) | 0.6765 |
| final | has_prior | a:1 | 5 | 6 | 0.8333 | 10/51 (0.1961) | 0.6373 |
| medial | starts_with | e:1 | 16 | 30 | 0.5333 | 1/27 (0.0370) | 0.4963 |
| medial | has_after | e:1 | 6 | 30 | 0.2000 | 19/27 (0.7037) | -0.5037 |
| medial | has_after | g:1 | 6 | 30 | 0.2000 | 19/27 (0.7037) | -0.5037 |
| medial | ends_with | e:1 | 5 | 30 | 0.1667 | 19/27 (0.7037) | -0.5370 |
| medial | next_is | g:1 | 5 | 30 | 0.1667 | 17/27 (0.6296) | -0.4630 |

## d:1

Occurrences: `335`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 17 |
| final | 318 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | e:1 | 17 | 17 | 1.0000 | 0/318 (0.0000) | 1.0000 |
| medial | has_prior | a:1 | 17 | 17 | 1.0000 | 20/318 (0.0629) | 0.9371 |
| medial | has_prior | c:1 | 17 | 17 | 1.0000 | 20/318 (0.0629) | 0.9371 |
| medial | has_prior | e:1 | 17 | 17 | 1.0000 | 77/318 (0.2421) | 0.7579 |
| medial | ends_with | e:1 | 16 | 17 | 0.9412 | 0/318 (0.0000) | 0.9412 |
| medial | has_after | g:1 | 16 | 17 | 0.9412 | 0/318 (0.0000) | 0.9412 |
| medial | next_is | g:1 | 16 | 17 | 0.9412 | 0/318 (0.0000) | 0.9412 |
| medial | has_prior | b:1 | 16 | 17 | 0.9412 | 20/318 (0.0629) | 0.8783 |
| medial | prev_is | b:1 | 16 | 17 | 0.9412 | 20/318 (0.0629) | 0.8783 |
| medial | starts_with | e:1 | 16 | 17 | 0.9412 | 70/318 (0.2201) | 0.7211 |
| final | has_prior | i:1 | 295 | 318 | 0.9277 | 0/17 (0.0000) | 0.9277 |
| final | prev_is | i:1 | 295 | 318 | 0.9277 | 0/17 (0.0000) | 0.9277 |
| final | has_prior | f:1 | 236 | 318 | 0.7421 | 0/17 (0.0000) | 0.7421 |
| final | has_prior | e:1 | 77 | 318 | 0.2421 | 17/17 (1.0000) | -0.7579 |
| final | starts_with | e:1 | 70 | 318 | 0.2201 | 16/17 (0.9412) | -0.7211 |
| final | has_prior | a:1 | 20 | 318 | 0.0629 | 17/17 (1.0000) | -0.9371 |
| final | has_prior | c:1 | 20 | 318 | 0.0629 | 17/17 (1.0000) | -0.9371 |
| final | has_prior | b:1 | 20 | 318 | 0.0629 | 16/17 (0.9412) | -0.8783 |

## e:1

Occurrences: `1763`

| Role | Count |
| --- | ---: |
| initial | 1109 |
| medial | 93 |
| final | 402 |
| singleton | 159 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | g:1 | 402 | 402 | 1.0000 | 3/1361 (0.0022) | 0.9978 |
| final | prev_is | g:1 | 402 | 402 | 1.0000 | 3/1361 (0.0022) | 0.9978 |
| medial | has_prior | a:1 | 91 | 93 | 0.9785 | 70/1670 (0.0419) | 0.9366 |
| medial | next_is | b:1 | 88 | 93 | 0.9462 | 0/1670 (0.0000) | 0.9462 |
| medial | prev_is | a:1 | 88 | 93 | 0.9462 | 0/1670 (0.0000) | 0.9462 |
| medial | has_after | b:1 | 88 | 93 | 0.9462 | 62/1670 (0.0371) | 0.9091 |
| medial | has_after | a:1 | 87 | 93 | 0.9355 | 74/1670 (0.0443) | 0.8912 |
| medial | has_after | c:1 | 86 | 93 | 0.9247 | 262/1670 (0.1569) | 0.7678 |
| medial | starts_with | a:1 | 47 | 93 | 0.5054 | 3/1670 (0.0018) | 0.5036 |

## f:1

Occurrences: `636`

| Role | Count |
| --- | ---: |
| initial | 305 |
| medial | 117 |
| final | 212 |
| singleton | 2 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 211 | 212 | 0.9953 | 3/424 (0.0071) | 0.9882 |
| final | starts_with | e:1 | 211 | 212 | 0.9953 | 3/424 (0.0071) | 0.9882 |
| final | prev_is | e:1 | 208 | 212 | 0.9811 | 0/424 (0.0000) | 0.9811 |
| medial | ends_with | d:1 | 113 | 117 | 0.9658 | 123/519 (0.2370) | 0.7288 |
| medial | has_after | d:1 | 113 | 117 | 0.9658 | 123/519 (0.2370) | 0.7288 |
| medial | has_after | i:1 | 113 | 117 | 0.9658 | 149/519 (0.2871) | 0.6787 |
| medial | next_is | i:1 | 113 | 117 | 0.9658 | 149/519 (0.2871) | 0.6787 |
| medial | has_prior | k:1 | 82 | 117 | 0.7009 | 0/519 (0.0000) | 0.7009 |
| medial | prev_is | k:1 | 82 | 117 | 0.7009 | 0/519 (0.0000) | 0.7009 |
| medial | starts_with | k:1 | 80 | 117 | 0.6838 | 0/519 (0.0000) | 0.6838 |
| initial | has_after | j:1 | 156 | 305 | 0.5115 | 4/331 (0.0121) | 0.4994 |
| initial | next_is | j:1 | 156 | 305 | 0.5115 | 4/331 (0.0121) | 0.4994 |
| initial | ends_with | j:1 | 155 | 305 | 0.5082 | 2/331 (0.0060) | 0.5022 |

## g:1

Occurrences: `408`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 408 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | e:1 | 405 | 408 | 0.9926 | 0/0 (0.0000) | 0.9926 |
| medial | next_is | e:1 | 405 | 408 | 0.9926 | 0/0 (0.0000) | 0.9926 |
| medial | ends_with | e:1 | 402 | 408 | 0.9853 | 0/0 (0.0000) | 0.9853 |
| medial | has_prior | e:1 | 385 | 408 | 0.9436 | 0/0 (0.0000) | 0.9436 |
| medial | starts_with | e:1 | 385 | 408 | 0.9436 | 0/0 (0.0000) | 0.9436 |
| medial | prev_is | e:1 | 317 | 408 | 0.7770 | 0/0 (0.0000) | 0.7770 |

## h:1

Occurrences: `277`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 277 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 248 | 277 | 0.8953 | 0/0 (0.0000) | 0.8953 |
| final | starts_with | e:1 | 246 | 277 | 0.8881 | 0/0 (0.0000) | 0.8881 |
| final | prev_is | e:1 | 245 | 277 | 0.8845 | 0/0 (0.0000) | 0.8845 |

## h:2

Occurrences: `197`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 197 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 197 | 197 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | starts_with | e:1 | 197 | 197 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | has_prior | c:1 | 184 | 197 | 0.9340 | 0/0 (0.0000) | 0.9340 |
| final | prev_is | c:1 | 184 | 197 | 0.9340 | 0/0 (0.0000) | 0.9340 |

## i:1

Occurrences: `330`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 327 |
| final | 3 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | d:1 | 295 | 327 | 0.9021 | 0/3 (0.0000) | 0.9021 |
| medial | has_after | d:1 | 295 | 327 | 0.9021 | 0/3 (0.0000) | 0.9021 |
| medial | next_is | d:1 | 295 | 327 | 0.9021 | 0/3 (0.0000) | 0.9021 |
| medial | has_prior | f:1 | 261 | 327 | 0.7982 | 1/3 (0.3333) | 0.4648 |
| medial | prev_is | f:1 | 261 | 327 | 0.7982 | 1/3 (0.3333) | 0.4648 |
| medial | starts_with | f:1 | 149 | 327 | 0.4557 | 0/3 (0.0000) | 0.4557 |
| final | has_prior | f:1 | 1 | 3 | 0.3333 | 261/327 (0.7982) | -0.4648 |
| final | prev_is | f:1 | 1 | 3 | 0.3333 | 261/327 (0.7982) | -0.4648 |

## j:1

Occurrences: `160`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 3 |
| final | 157 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | d:1 | 3 | 3 | 1.0000 | 0/157 (0.0000) | 1.0000 |
| medial | has_after | d:1 | 3 | 3 | 1.0000 | 0/157 (0.0000) | 1.0000 |
| medial | next_is | d:1 | 3 | 3 | 1.0000 | 0/157 (0.0000) | 1.0000 |
| final | has_prior | f:1 | 157 | 157 | 1.0000 | 3/3 (1.0000) | 0.0000 |
| final | prev_is | f:1 | 157 | 157 | 1.0000 | 3/3 (1.0000) | 0.0000 |
| medial | has_prior | f:1 | 3 | 3 | 1.0000 | 157/157 (1.0000) | 0.0000 |
| medial | prev_is | f:1 | 3 | 3 | 1.0000 | 157/157 (1.0000) | 0.0000 |
| final | starts_with | f:1 | 155 | 157 | 0.9873 | 1/3 (0.3333) | 0.6539 |
| medial | starts_with | f:1 | 1 | 3 | 0.3333 | 155/157 (0.9873) | -0.6539 |

## k:1

Occurrences: `84`

| Role | Count |
| --- | ---: |
| initial | 81 |
| medial | 2 |
| final | 0 |
| singleton | 1 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 0/82 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 0/82 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 0/82 (0.0000) | 1.0000 |
| medial | ends_with | d:1 | 2 | 2 | 1.0000 | 77/82 (0.9390) | 0.0610 |
| medial | has_after | d:1 | 2 | 2 | 1.0000 | 77/82 (0.9390) | 0.0610 |
| medial | has_after | i:1 | 2 | 2 | 1.0000 | 77/82 (0.9390) | 0.0610 |
| medial | has_after | f:1 | 2 | 2 | 1.0000 | 80/82 (0.9756) | 0.0244 |
| medial | next_is | f:1 | 2 | 2 | 1.0000 | 80/82 (0.9756) | 0.0244 |
| initial | has_after | f:1 | 80 | 81 | 0.9877 | 2/3 (0.6667) | 0.3210 |
| initial | next_is | f:1 | 80 | 81 | 0.9877 | 2/3 (0.6667) | 0.3210 |
| initial | ends_with | d:1 | 77 | 81 | 0.9506 | 2/3 (0.6667) | 0.2840 |
| initial | has_after | d:1 | 77 | 81 | 0.9506 | 2/3 (0.6667) | 0.2840 |
| initial | has_after | i:1 | 77 | 81 | 0.9506 | 2/3 (0.6667) | 0.2840 |

## l:1

Occurrences: `39`

| Role | Count |
| --- | ---: |
| initial | 35 |
| medial | 4 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 4 | 4 | 1.0000 | 0/35 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 4 | 4 | 1.0000 | 0/35 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 4 | 4 | 1.0000 | 0/35 (0.0000) | 1.0000 |
| initial | has_after | f:1 | 35 | 35 | 1.0000 | 4/4 (1.0000) | 0.0000 |
| initial | next_is | f:1 | 35 | 35 | 1.0000 | 4/4 (1.0000) | 0.0000 |
| medial | has_after | f:1 | 4 | 4 | 1.0000 | 35/35 (1.0000) | 0.0000 |
| medial | next_is | f:1 | 4 | 4 | 1.0000 | 35/35 (1.0000) | 0.0000 |
| initial | ends_with | d:1 | 33 | 35 | 0.9429 | 1/4 (0.2500) | 0.6929 |
| initial | has_after | d:1 | 33 | 35 | 0.9429 | 1/4 (0.2500) | 0.6929 |
| initial | has_after | i:1 | 33 | 35 | 0.9429 | 1/4 (0.2500) | 0.6929 |
| medial | ends_with | f:1 | 3 | 4 | 0.7500 | 1/35 (0.0286) | 0.7214 |
| medial | ends_with | d:1 | 1 | 4 | 0.2500 | 33/35 (0.9429) | -0.6929 |
| medial | has_after | d:1 | 1 | 4 | 0.2500 | 33/35 (0.9429) | -0.6929 |
| medial | has_after | i:1 | 1 | 4 | 0.2500 | 33/35 (0.9429) | -0.6929 |
| initial | ends_with | f:1 | 1 | 35 | 0.0286 | 3/4 (0.7500) | -0.7214 |

## m:1

Occurrences: `92`

| Role | Count |
| --- | ---: |
| initial | 1 |
| medial | 91 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | a:1 | 91 | 91 | 1.0000 | 0/1 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 91 | 91 | 1.0000 | 0/1 (0.0000) | 1.0000 |
| initial | ends_with | i:1 | 1 | 1 | 1.0000 | 0/91 (0.0000) | 1.0000 |
| initial | has_after | i:1 | 1 | 1 | 1.0000 | 0/91 (0.0000) | 1.0000 |
| initial | has_after | n:1 | 1 | 1 | 1.0000 | 0/91 (0.0000) | 1.0000 |
| initial | next_is | a:1 | 1 | 1 | 1.0000 | 0/91 (0.0000) | 1.0000 |
| initial | has_after | a:1 | 1 | 1 | 1.0000 | 59/91 (0.6484) | 0.3516 |
| initial | has_after | c:1 | 1 | 1 | 1.0000 | 90/91 (0.9890) | 0.0110 |
| medial | next_is | c:1 | 90 | 91 | 0.9890 | 0/1 (0.0000) | 0.9890 |
| medial | has_after | c:1 | 90 | 91 | 0.9890 | 1/1 (1.0000) | -0.0110 |
| medial | starts_with | a:1 | 72 | 91 | 0.7912 | 0/1 (0.0000) | 0.7912 |

## n:1

Occurrences: `104`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 1 |
| final | 0 |
| singleton | 103 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | i:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | has_after | c:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | has_after | i:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | has_prior | a:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | has_prior | m:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | next_is | c:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
| medial | starts_with | m:1 | 1 | 1 | 1.0000 | 0/103 (0.0000) | 1.0000 |
