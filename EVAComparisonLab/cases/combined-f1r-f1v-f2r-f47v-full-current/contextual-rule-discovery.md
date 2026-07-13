# Contextual Rule Discovery

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Context scope: `particle`
- Symbols audited: `d:1`, `e:1`, `c:1`, `c:2`, `f:1`, `a:1`, `h:1`, `h:2`, `m:1`, `g:1`, `j:1`, `n:1`, `k:1`, `l:1`

## d:1

Occurrences: `248`

| Role | Count |
| --- | ---: |
| initial | 1 |
| medial | 17 |
| final | 230 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | ends_with | j:1 | 1 | 1 | 1.0000 | 0/247 (0.0000) | 1.0000 |
| initial | has_after | j:1 | 1 | 1 | 1.0000 | 0/247 (0.0000) | 1.0000 |
| initial | next_is | e:1 | 1 | 1 | 1.0000 | 1/247 (0.0040) | 0.9960 |
| medial | has_after | e:1 | 17 | 17 | 1.0000 | 1/231 (0.0043) | 0.9957 |
| medial | has_prior | a:1 | 17 | 17 | 1.0000 | 12/231 (0.0519) | 0.9481 |
| medial | has_prior | c:1 | 17 | 17 | 1.0000 | 12/231 (0.0519) | 0.9481 |
| initial | has_after | e:1 | 1 | 1 | 1.0000 | 17/247 (0.0688) | 0.9312 |
| medial | has_prior | e:1 | 17 | 17 | 1.0000 | 53/231 (0.2294) | 0.7706 |
| medial | ends_with | e:1 | 16 | 17 | 0.9412 | 0/231 (0.0000) | 0.9412 |
| medial | has_after | g:1 | 16 | 17 | 0.9412 | 0/231 (0.0000) | 0.9412 |
| medial | next_is | g:1 | 16 | 17 | 0.9412 | 0/231 (0.0000) | 0.9412 |
| medial | has_prior | b:1 | 16 | 17 | 0.9412 | 12/231 (0.0519) | 0.8892 |
| medial | prev_is | b:1 | 16 | 17 | 0.9412 | 12/231 (0.0519) | 0.8892 |
| medial | starts_with | e:1 | 16 | 17 | 0.9412 | 53/231 (0.2294) | 0.7117 |
| final | has_prior | i:1 | 215 | 230 | 0.9348 | 0/18 (0.0000) | 0.9348 |
| final | prev_is | i:1 | 215 | 230 | 0.9348 | 0/18 (0.0000) | 0.9348 |
| final | has_prior | f:1 | 177 | 230 | 0.7696 | 0/18 (0.0000) | 0.7696 |
| final | has_prior | e:1 | 53 | 230 | 0.2304 | 17/18 (0.9444) | -0.7140 |

## e:1

Occurrences: `1332`

| Role | Count |
| --- | ---: |
| initial | 865 |
| medial | 67 |
| final | 293 |
| singleton | 107 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | g:1 | 293 | 293 | 1.0000 | 3/1039 (0.0029) | 0.9971 |
| final | prev_is | g:1 | 293 | 293 | 1.0000 | 3/1039 (0.0029) | 0.9971 |
| medial | has_prior | a:1 | 64 | 67 | 0.9552 | 62/1265 (0.0490) | 0.9062 |
| medial | next_is | b:1 | 61 | 67 | 0.9104 | 0/1265 (0.0000) | 0.9104 |
| medial | prev_is | a:1 | 61 | 67 | 0.9104 | 0/1265 (0.0000) | 0.9104 |
| medial | has_after | b:1 | 61 | 67 | 0.9104 | 59/1265 (0.0466) | 0.8638 |
| medial | has_after | c:1 | 61 | 67 | 0.9104 | 219/1265 (0.1731) | 0.7373 |
| medial | has_after | a:1 | 60 | 67 | 0.8955 | 71/1265 (0.0561) | 0.8394 |

## c:1

Occurrences: `642`

| Role | Count |
| --- | ---: |
| initial | 2 |
| medial | 354 |
| final | 11 |
| singleton | 275 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | next_is | g:1 | 2 | 2 | 1.0000 | 0/640 (0.0000) | 1.0000 |
| initial | has_after | e:1 | 2 | 2 | 1.0000 | 65/640 (0.1016) | 0.8984 |
| initial | has_after | g:1 | 2 | 2 | 1.0000 | 65/640 (0.1016) | 0.8984 |
| final | has_prior | a:1 | 10 | 11 | 0.9091 | 203/631 (0.3217) | 0.5874 |
| final | starts_with | a:1 | 9 | 11 | 0.8182 | 131/631 (0.2076) | 0.6106 |
| medial | has_prior | e:1 | 243 | 354 | 0.6864 | 3/288 (0.0104) | 0.6760 |
| final | prev_is | m:1 | 7 | 11 | 0.6364 | 42/631 (0.0666) | 0.5698 |
| final | has_prior | m:1 | 7 | 11 | 0.6364 | 43/631 (0.0681) | 0.5682 |
| medial | starts_with | e:1 | 218 | 354 | 0.6158 | 2/288 (0.0069) | 0.6089 |
| medial | has_prior | a:1 | 203 | 354 | 0.5734 | 10/288 (0.0347) | 0.5387 |
| medial | has_after | a:1 | 202 | 354 | 0.5706 | 0/288 (0.0000) | 0.5706 |
| medial | next_is | a:1 | 202 | 354 | 0.5706 | 0/288 (0.0000) | 0.5706 |
| initial | ends_with | h:1 | 1 | 2 | 0.5000 | 4/640 (0.0063) | 0.4938 |
| initial | has_after | h:1 | 1 | 2 | 0.5000 | 4/640 (0.0063) | 0.4938 |

## c:2

Occurrences: `34`

| Role | Count |
| --- | ---: |
| initial | 11 |
| medial | 20 |
| final | 3 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | ends_with | e:1 | 11 | 11 | 1.0000 | 5/23 (0.2174) | 0.7826 |
| initial | has_after | e:1 | 11 | 11 | 1.0000 | 6/23 (0.2609) | 0.7391 |
| initial | has_after | g:1 | 11 | 11 | 1.0000 | 6/23 (0.2609) | 0.7391 |
| initial | next_is | g:1 | 9 | 11 | 0.8182 | 6/23 (0.2609) | 0.5573 |
| medial | has_prior | e:1 | 14 | 20 | 0.7000 | 2/14 (0.1429) | 0.5571 |
| medial | starts_with | e:1 | 14 | 20 | 0.7000 | 2/14 (0.1429) | 0.5571 |
| final | has_prior | b:1 | 2 | 3 | 0.6667 | 4/31 (0.1290) | 0.5376 |
| final | prev_is | a:1 | 2 | 3 | 0.6667 | 6/31 (0.1935) | 0.4731 |
| medial | ends_with | h:2 | 12 | 20 | 0.6000 | 0/14 (0.0000) | 0.6000 |
| medial | has_after | h:2 | 12 | 20 | 0.6000 | 0/14 (0.0000) | 0.6000 |
| medial | next_is | h:2 | 12 | 20 | 0.6000 | 0/14 (0.0000) | 0.6000 |
| medial | prev_is | e:1 | 12 | 20 | 0.6000 | 0/14 (0.0000) | 0.6000 |
| medial | has_after | e:1 | 6 | 20 | 0.3000 | 11/14 (0.7857) | -0.4857 |
| medial | has_after | g:1 | 6 | 20 | 0.3000 | 11/14 (0.7857) | -0.4857 |
| medial | ends_with | e:1 | 5 | 20 | 0.2500 | 11/14 (0.7857) | -0.5357 |

## f:1

Occurrences: `459`

| Role | Count |
| --- | ---: |
| initial | 199 |
| medial | 92 |
| final | 166 |
| singleton | 2 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 165 | 166 | 0.9940 | 3/293 (0.0102) | 0.9837 |
| final | starts_with | e:1 | 165 | 166 | 0.9940 | 3/293 (0.0102) | 0.9837 |
| final | prev_is | e:1 | 164 | 166 | 0.9880 | 0/293 (0.0000) | 0.9880 |
| medial | ends_with | d:1 | 89 | 92 | 0.9674 | 88/367 (0.2398) | 0.7276 |
| medial | has_after | d:1 | 89 | 92 | 0.9674 | 88/367 (0.2398) | 0.7276 |
| medial | has_after | i:1 | 88 | 92 | 0.9565 | 90/367 (0.2452) | 0.7113 |
| medial | next_is | i:1 | 88 | 92 | 0.9565 | 90/367 (0.2452) | 0.7113 |
| medial | has_prior | k:1 | 63 | 92 | 0.6848 | 0/367 (0.0000) | 0.6848 |
| medial | prev_is | k:1 | 63 | 92 | 0.6848 | 0/367 (0.0000) | 0.6848 |
| medial | starts_with | k:1 | 61 | 92 | 0.6630 | 0/367 (0.0000) | 0.6630 |
| initial | has_after | j:1 | 109 | 199 | 0.5477 | 4/260 (0.0154) | 0.5324 |
| initial | next_is | j:1 | 109 | 199 | 0.5477 | 4/260 (0.0154) | 0.5324 |
| initial | ends_with | j:1 | 108 | 199 | 0.5427 | 2/260 (0.0077) | 0.5350 |

## a:1

Occurrences: `419`

| Role | Count |
| --- | ---: |
| initial | 141 |
| medial | 153 |
| final | 125 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | c:1 | 124 | 125 | 0.9920 | 78/294 (0.2653) | 0.7267 |
| final | prev_is | c:1 | 124 | 125 | 0.9920 | 78/294 (0.2653) | 0.7267 |
| initial | has_after | c:1 | 139 | 141 | 0.9858 | 74/278 (0.2662) | 0.7196 |
| medial | has_prior | e:1 | 143 | 153 | 0.9346 | 24/266 (0.0902) | 0.8444 |
| medial | starts_with | e:1 | 142 | 153 | 0.9281 | 0/266 (0.0000) | 0.9281 |
| medial | has_after | e:1 | 132 | 153 | 0.8627 | 28/266 (0.1053) | 0.7575 |
| medial | has_after | g:1 | 127 | 153 | 0.8301 | 3/266 (0.0113) | 0.8188 |
| final | has_prior | b:1 | 101 | 125 | 0.8080 | 61/294 (0.2075) | 0.6005 |
| medial | ends_with | e:1 | 121 | 153 | 0.7908 | 3/266 (0.0113) | 0.7796 |
| initial | has_after | b:1 | 109 | 141 | 0.7730 | 87/278 (0.3129) | 0.4601 |
| medial | prev_is | e:1 | 71 | 153 | 0.4641 | 0/266 (0.0000) | 0.4641 |

## h:1

Occurrences: `209`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 209 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 206 | 209 | 0.9856 | 0/0 (0.0000) | 0.9856 |
| final | prev_is | e:1 | 206 | 209 | 0.9856 | 0/0 (0.0000) | 0.9856 |
| final | starts_with | e:1 | 204 | 209 | 0.9761 | 0/0 (0.0000) | 0.9761 |

## h:2

Occurrences: `160`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 160 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 160 | 160 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | starts_with | e:1 | 160 | 160 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | has_prior | c:1 | 148 | 160 | 0.9250 | 0/0 (0.0000) | 0.9250 |
| final | prev_is | c:1 | 148 | 160 | 0.9250 | 0/0 (0.0000) | 0.9250 |

## m:1

Occurrences: `51`

| Role | Count |
| --- | ---: |
| initial | 1 |
| medial | 50 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | a:1 | 50 | 50 | 1.0000 | 0/1 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 50 | 50 | 1.0000 | 0/1 (0.0000) | 1.0000 |
| initial | ends_with | i:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | has_after | i:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | has_after | n:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | next_is | a:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | has_after | a:1 | 1 | 1 | 1.0000 | 43/50 (0.8600) | 0.1400 |
| initial | has_after | c:1 | 1 | 1 | 1.0000 | 49/50 (0.9800) | 0.0200 |
| medial | next_is | c:1 | 49 | 50 | 0.9800 | 0/1 (0.0000) | 0.9800 |
| medial | has_after | c:1 | 49 | 50 | 0.9800 | 1/1 (1.0000) | -0.0200 |
| medial | has_after | a:1 | 43 | 50 | 0.8600 | 1/1 (1.0000) | -0.1400 |
| medial | starts_with | a:1 | 32 | 50 | 0.6400 | 0/1 (0.0000) | 0.6400 |
| medial | ends_with | a:1 | 24 | 50 | 0.4800 | 0/1 (0.0000) | 0.4800 |

## g:1

Occurrences: `298`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 298 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | e:1 | 296 | 298 | 0.9933 | 0/0 (0.0000) | 0.9933 |
| medial | next_is | e:1 | 296 | 298 | 0.9933 | 0/0 (0.0000) | 0.9933 |
| medial | ends_with | e:1 | 293 | 298 | 0.9832 | 0/0 (0.0000) | 0.9832 |
| medial | has_prior | e:1 | 282 | 298 | 0.9463 | 0/0 (0.0000) | 0.9463 |
| medial | starts_with | e:1 | 282 | 298 | 0.9463 | 0/0 (0.0000) | 0.9463 |
| medial | prev_is | e:1 | 222 | 298 | 0.7450 | 0/0 (0.0000) | 0.7450 |

## j:1

Occurrences: `114`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 3 |
| final | 111 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | d:1 | 3 | 3 | 1.0000 | 0/111 (0.0000) | 1.0000 |
| medial | has_after | d:1 | 3 | 3 | 1.0000 | 0/111 (0.0000) | 1.0000 |
| medial | next_is | d:1 | 3 | 3 | 1.0000 | 0/111 (0.0000) | 1.0000 |
| medial | has_prior | f:1 | 3 | 3 | 1.0000 | 110/111 (0.9910) | 0.0090 |
| medial | prev_is | f:1 | 3 | 3 | 1.0000 | 110/111 (0.9910) | 0.0090 |
| final | has_prior | f:1 | 110 | 111 | 0.9910 | 3/3 (1.0000) | -0.0090 |
| final | prev_is | f:1 | 110 | 111 | 0.9910 | 3/3 (1.0000) | -0.0090 |
| final | starts_with | f:1 | 108 | 111 | 0.9730 | 1/3 (0.3333) | 0.6396 |
| medial | starts_with | f:1 | 1 | 3 | 0.3333 | 108/111 (0.9730) | -0.6396 |

## n:1

Occurrences: `82`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 1 |
| final | 0 |
| singleton | 81 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | i:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | has_after | c:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | has_after | i:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | has_prior | a:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | has_prior | m:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | next_is | c:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |
| medial | starts_with | m:1 | 1 | 1 | 1.0000 | 0/81 (0.0000) | 1.0000 |

## k:1

Occurrences: `65`

| Role | Count |
| --- | ---: |
| initial | 62 |
| medial | 2 |
| final | 0 |
| singleton | 1 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 0/63 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 0/63 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 0/63 (0.0000) | 1.0000 |
| medial | ends_with | d:1 | 2 | 2 | 1.0000 | 58/63 (0.9206) | 0.0794 |
| medial | has_after | d:1 | 2 | 2 | 1.0000 | 58/63 (0.9206) | 0.0794 |
| medial | has_after | i:1 | 2 | 2 | 1.0000 | 58/63 (0.9206) | 0.0794 |
| medial | has_after | f:1 | 2 | 2 | 1.0000 | 61/63 (0.9683) | 0.0317 |
| medial | next_is | f:1 | 2 | 2 | 1.0000 | 61/63 (0.9683) | 0.0317 |
| initial | has_after | f:1 | 61 | 62 | 0.9839 | 2/3 (0.6667) | 0.3172 |
| initial | next_is | f:1 | 61 | 62 | 0.9839 | 2/3 (0.6667) | 0.3172 |
| initial | ends_with | d:1 | 58 | 62 | 0.9355 | 2/3 (0.6667) | 0.2688 |
| initial | has_after | d:1 | 58 | 62 | 0.9355 | 2/3 (0.6667) | 0.2688 |
| initial | has_after | i:1 | 58 | 62 | 0.9355 | 2/3 (0.6667) | 0.2688 |

## l:1

Occurrences: `31`

| Role | Count |
| --- | ---: |
| initial | 29 |
| medial | 2 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 0/29 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 0/29 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 0/29 (0.0000) | 1.0000 |
| initial | has_after | f:1 | 29 | 29 | 1.0000 | 2/2 (1.0000) | 0.0000 |
| initial | next_is | f:1 | 29 | 29 | 1.0000 | 2/2 (1.0000) | 0.0000 |
| medial | has_after | f:1 | 2 | 2 | 1.0000 | 29/29 (1.0000) | 0.0000 |
| medial | next_is | f:1 | 2 | 2 | 1.0000 | 29/29 (1.0000) | 0.0000 |
| initial | ends_with | d:1 | 28 | 29 | 0.9655 | 1/2 (0.5000) | 0.4655 |
| initial | has_after | d:1 | 28 | 29 | 0.9655 | 1/2 (0.5000) | 0.4655 |
| initial | has_after | i:1 | 27 | 29 | 0.9310 | 1/2 (0.5000) | 0.4310 |
| medial | ends_with | d:1 | 1 | 2 | 0.5000 | 28/29 (0.9655) | -0.4655 |
| medial | has_after | d:1 | 1 | 2 | 0.5000 | 28/29 (0.9655) | -0.4655 |
| medial | ends_with | f:1 | 1 | 2 | 0.5000 | 1/29 (0.0345) | 0.4655 |
| initial | ends_with | f:1 | 1 | 29 | 0.0345 | 1/2 (0.5000) | -0.4655 |
