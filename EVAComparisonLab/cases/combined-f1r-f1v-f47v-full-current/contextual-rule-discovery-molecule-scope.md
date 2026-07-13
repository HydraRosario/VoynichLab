# Contextual Rule Discovery

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Context scope: `molecule`
- Symbols audited: `d:1`, `e:1`, `c:1`, `f:1`, `a:1`, `h:1`, `h:2`, `m:1`, `g:1`, `j:1`, `n:1`, `k:1`, `l:1`

## d:1

Occurrences: `187`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 65 |
| final | 122 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | i:1 | 119 | 122 | 0.9754 | 40/65 (0.6154) | 0.3600 |
| final | prev_is | i:1 | 119 | 122 | 0.9754 | 40/65 (0.6154) | 0.3600 |
| medial | has_after | e:1 | 63 | 65 | 0.9692 | 0/122 (0.0000) | 0.9692 |
| medial | has_prior | e:1 | 62 | 65 | 0.9538 | 114/122 (0.9344) | 0.0194 |
| final | has_prior | f:1 | 115 | 122 | 0.9426 | 22/65 (0.3385) | 0.6042 |
| final | has_prior | e:1 | 114 | 122 | 0.9344 | 62/65 (0.9538) | -0.0194 |
| final | has_prior | c:1 | 103 | 122 | 0.8443 | 48/65 (0.7385) | 0.1058 |
| medial | next_is | e:1 | 38 | 65 | 0.5846 | 0/122 (0.0000) | 0.5846 |
| medial | has_after | h:1 | 37 | 65 | 0.5692 | 0/122 (0.0000) | 0.5692 |
| medial | ends_with | h:1 | 35 | 65 | 0.5385 | 0/122 (0.0000) | 0.5385 |
| medial | has_after | f:1 | 34 | 65 | 0.5231 | 0/122 (0.0000) | 0.5231 |
| medial | has_prior | f:1 | 22 | 65 | 0.3385 | 115/122 (0.9426) | -0.6042 |

## e:1

Occurrences: `1069`

| Role | Count |
| --- | ---: |
| initial | 228 |
| medial | 834 |
| final | 7 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | g:1 | 6 | 7 | 0.8571 | 527/1062 (0.4962) | 0.3609 |
| initial | has_after | c:1 | 193 | 228 | 0.8465 | 336/841 (0.3995) | 0.4470 |
| medial | has_prior | c:1 | 542 | 834 | 0.6499 | 4/235 (0.0170) | 0.6329 |
| medial | has_prior | g:1 | 527 | 834 | 0.6319 | 6/235 (0.0255) | 0.6064 |

## c:1

Occurrences: `524`

| Role | Count |
| --- | ---: |
| initial | 52 |
| medial | 446 |
| final | 26 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 25 | 26 | 0.9615 | 363/498 (0.7289) | 0.2326 |
| final | has_prior | g:1 | 23 | 26 | 0.8846 | 165/498 (0.3313) | 0.5533 |
| medial | has_prior | e:1 | 363 | 446 | 0.8139 | 25/78 (0.3205) | 0.4934 |
| final | prev_is | e:1 | 21 | 26 | 0.8077 | 221/498 (0.4438) | 0.3639 |

## f:1

Occurrences: `348`

| Role | Count |
| --- | ---: |
| initial | 1 |
| medial | 346 |
| final | 1 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | h:1 | 1 | 1 | 1.0000 | 24/347 (0.0692) | 0.9308 |
| initial | has_after | c:1 | 1 | 1 | 1.0000 | 25/347 (0.0720) | 0.9280 |
| final | has_prior | i:1 | 1 | 1 | 1.0000 | 28/347 (0.0807) | 0.9193 |
| initial | ends_with | j:1 | 1 | 1 | 1.0000 | 73/347 (0.2104) | 0.7896 |
| initial | next_is | j:1 | 1 | 1 | 1.0000 | 87/347 (0.2507) | 0.7493 |
| initial | has_after | j:1 | 1 | 1 | 1.0000 | 104/347 (0.2997) | 0.7003 |
| final | prev_is | e:1 | 1 | 1 | 1.0000 | 125/347 (0.3602) | 0.6398 |
| final | has_prior | h:2 | 1 | 1 | 1.0000 | 146/347 (0.4207) | 0.5793 |
| final | starts_with | e:1 | 1 | 1 | 1.0000 | 249/347 (0.7176) | 0.2824 |
| final | has_prior | c:1 | 1 | 1 | 1.0000 | 296/347 (0.8530) | 0.1470 |
| final | has_prior | e:1 | 1 | 1 | 1.0000 | 323/347 (0.9308) | 0.0692 |
| medial | has_prior | e:1 | 323 | 346 | 0.9335 | 1/2 (0.5000) | 0.4335 |
| medial | has_prior | c:1 | 296 | 346 | 0.8555 | 1/2 (0.5000) | 0.3555 |
| medial | has_after | d:1 | 241 | 346 | 0.6965 | 0/2 (0.0000) | 0.6965 |
| medial | has_after | i:1 | 241 | 346 | 0.6965 | 0/2 (0.0000) | 0.6965 |
| medial | ends_with | d:1 | 215 | 346 | 0.6214 | 0/2 (0.0000) | 0.6214 |

## a:1

Occurrences: `341`

| Role | Count |
| --- | ---: |
| initial | 39 |
| medial | 299 |
| final | 3 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | b:1 | 3 | 3 | 1.0000 | 141/338 (0.4172) | 0.5828 |
| final | prev_is | c:1 | 3 | 3 | 1.0000 | 212/338 (0.6272) | 0.3728 |
| final | has_prior | c:1 | 3 | 3 | 1.0000 | 224/338 (0.6627) | 0.3373 |
| initial | has_after | c:1 | 39 | 39 | 1.0000 | 206/302 (0.6821) | 0.3179 |
| medial | has_after | e:1 | 274 | 299 | 0.9164 | 32/42 (0.7619) | 0.1545 |
| initial | has_after | b:1 | 35 | 39 | 0.8974 | 128/302 (0.4238) | 0.4736 |
| initial | has_after | e:1 | 32 | 39 | 0.8205 | 274/302 (0.9073) | -0.0868 |
| initial | next_is | b:1 | 30 | 39 | 0.7692 | 74/302 (0.2450) | 0.5242 |
| medial | has_prior | c:1 | 224 | 299 | 0.7492 | 3/42 (0.0714) | 0.6777 |
| medial | prev_is | c:1 | 212 | 299 | 0.7090 | 3/42 (0.0714) | 0.6376 |
| medial | has_prior | e:1 | 206 | 299 | 0.6890 | 2/42 (0.0476) | 0.6413 |
| final | has_prior | n:1 | 2 | 3 | 0.6667 | 16/338 (0.0473) | 0.6193 |
| final | has_prior | m:1 | 2 | 3 | 0.6667 | 41/338 (0.1213) | 0.5454 |
| final | has_prior | g:1 | 2 | 3 | 0.6667 | 55/338 (0.1627) | 0.5039 |
| medial | starts_with | e:1 | 168 | 299 | 0.5619 | 1/42 (0.0238) | 0.5381 |
| medial | next_is | b:1 | 74 | 299 | 0.2475 | 30/42 (0.7143) | -0.4668 |

## h:1

Occurrences: `161`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 23 |
| final | 138 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 138 | 138 | 1.0000 | 23/23 (1.0000) | 0.0000 |
| medial | has_prior | e:1 | 23 | 23 | 1.0000 | 138/138 (1.0000) | 0.0000 |
| final | prev_is | e:1 | 136 | 138 | 0.9855 | 22/23 (0.9565) | 0.0290 |
| medial | prev_is | e:1 | 22 | 23 | 0.9565 | 136/138 (0.9855) | -0.0290 |
| medial | has_after | e:1 | 20 | 23 | 0.8696 | 0/138 (0.0000) | 0.8696 |
| final | has_prior | c:1 | 112 | 138 | 0.8116 | 9/23 (0.3913) | 0.4203 |
| medial | has_after | c:1 | 18 | 23 | 0.7826 | 0/138 (0.0000) | 0.7826 |
| final | has_prior | g:1 | 106 | 138 | 0.7681 | 5/23 (0.2174) | 0.5507 |
| medial | has_after | f:1 | 15 | 23 | 0.6522 | 0/138 (0.0000) | 0.6522 |
| medial | next_is | e:1 | 12 | 23 | 0.5217 | 0/138 (0.0000) | 0.5217 |
| medial | has_prior | g:1 | 5 | 23 | 0.2174 | 106/138 (0.7681) | -0.5507 |

## h:2

Occurrences: `126`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 119 |
| final | 7 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | c:1 | 7 | 7 | 1.0000 | 113/119 (0.9496) | 0.0504 |
| medial | has_prior | e:1 | 119 | 119 | 1.0000 | 7/7 (1.0000) | 0.0000 |
| final | has_prior | e:1 | 7 | 7 | 1.0000 | 119/119 (1.0000) | 0.0000 |
| medial | has_prior | c:1 | 113 | 119 | 0.9496 | 7/7 (1.0000) | -0.0504 |
| medial | has_after | e:1 | 110 | 119 | 0.9244 | 0/7 (0.0000) | 0.9244 |
| medial | prev_is | c:1 | 109 | 119 | 0.9160 | 5/7 (0.7143) | 0.2017 |
| medial | starts_with | e:1 | 98 | 119 | 0.8235 | 2/7 (0.2857) | 0.5378 |
| medial | next_is | e:1 | 96 | 119 | 0.8067 | 0/7 (0.0000) | 0.8067 |
| medial | has_after | f:1 | 80 | 119 | 0.6723 | 0/7 (0.0000) | 0.6723 |
| medial | has_after | d:1 | 60 | 119 | 0.5042 | 0/7 (0.0000) | 0.5042 |
| medial | has_after | i:1 | 60 | 119 | 0.5042 | 0/7 (0.0000) | 0.5042 |
| medial | ends_with | d:1 | 56 | 119 | 0.4706 | 0/7 (0.0000) | 0.4706 |
| final | starts_with | e:1 | 2 | 7 | 0.2857 | 98/119 (0.8235) | -0.5378 |

## m:1

Occurrences: `41`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 41 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | c:1 | 41 | 41 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_prior | a:1 | 41 | 41 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 41 | 41 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_after | a:1 | 40 | 41 | 0.9756 | 0/0 (0.0000) | 0.9756 |
| medial | next_is | c:1 | 40 | 41 | 0.9756 | 0/0 (0.0000) | 0.9756 |
| medial | has_after | e:1 | 37 | 41 | 0.9024 | 0/0 (0.0000) | 0.9024 |
| medial | has_prior | e:1 | 26 | 41 | 0.6341 | 0/0 (0.0000) | 0.6341 |
| medial | has_after | g:1 | 24 | 41 | 0.5854 | 0/0 (0.0000) | 0.5854 |
| medial | starts_with | e:1 | 24 | 41 | 0.5854 | 0/0 (0.0000) | 0.5854 |
| medial | ends_with | h:1 | 20 | 41 | 0.4878 | 0/0 (0.0000) | 0.4878 |
| medial | has_after | h:1 | 20 | 41 | 0.4878 | 0/0 (0.0000) | 0.4878 |

## g:1

Occurrences: `245`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 245 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | e:1 | 245 | 245 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | next_is | e:1 | 245 | 245 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_prior | e:1 | 236 | 245 | 0.9633 | 0/0 (0.0000) | 0.9633 |
| medial | prev_is | e:1 | 180 | 245 | 0.7347 | 0/0 (0.0000) | 0.7347 |
| medial | starts_with | e:1 | 154 | 245 | 0.6286 | 0/0 (0.0000) | 0.6286 |
| medial | has_after | c:1 | 141 | 245 | 0.5755 | 0/0 (0.0000) | 0.5755 |
| medial | has_after | h:1 | 123 | 245 | 0.5020 | 0/0 (0.0000) | 0.5020 |
| medial | ends_with | h:1 | 119 | 245 | 0.4857 | 0/0 (0.0000) | 0.4857 |
| medial | has_prior | c:1 | 117 | 245 | 0.4776 | 0/0 (0.0000) | 0.4776 |

## j:1

Occurrences: `88`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 24 |
| final | 64 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | f:1 | 64 | 64 | 1.0000 | 24/24 (1.0000) | 0.0000 |
| final | prev_is | f:1 | 64 | 64 | 1.0000 | 24/24 (1.0000) | 0.0000 |
| medial | has_prior | f:1 | 24 | 24 | 1.0000 | 64/64 (1.0000) | 0.0000 |
| medial | prev_is | f:1 | 24 | 24 | 1.0000 | 64/64 (1.0000) | 0.0000 |
| final | has_prior | c:1 | 62 | 64 | 0.9688 | 23/24 (0.9583) | 0.0104 |
| medial | has_prior | c:1 | 23 | 24 | 0.9583 | 62/64 (0.9688) | -0.0104 |
| final | has_prior | e:1 | 55 | 64 | 0.8594 | 19/24 (0.7917) | 0.0677 |
| medial | has_after | e:1 | 19 | 24 | 0.7917 | 0/64 (0.0000) | 0.7917 |
| medial | next_is | e:1 | 13 | 24 | 0.5417 | 0/64 (0.0000) | 0.5417 |
| medial | has_after | c:1 | 11 | 24 | 0.4583 | 0/64 (0.0000) | 0.4583 |

## n:1

Occurrences: `66`

| Role | Count |
| --- | ---: |
| initial | 48 |
| medial | 18 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | c:1 | 18 | 18 | 1.0000 | 0/48 (0.0000) | 1.0000 |
| initial | has_after | e:1 | 48 | 48 | 1.0000 | 18/18 (1.0000) | 0.0000 |
| initial | has_after | g:1 | 48 | 48 | 1.0000 | 18/18 (1.0000) | 0.0000 |
| medial | has_after | e:1 | 18 | 18 | 1.0000 | 48/48 (1.0000) | 0.0000 |
| medial | has_after | g:1 | 18 | 18 | 1.0000 | 48/48 (1.0000) | 0.0000 |
| medial | next_is | e:1 | 17 | 18 | 0.9444 | 45/48 (0.9375) | 0.0069 |
| initial | next_is | e:1 | 45 | 48 | 0.9375 | 17/18 (0.9444) | -0.0069 |
| medial | has_prior | e:1 | 14 | 18 | 0.7778 | 0/48 (0.0000) | 0.7778 |
| medial | has_prior | a:1 | 10 | 18 | 0.5556 | 0/48 (0.0000) | 0.5556 |
| medial | has_prior | b:1 | 10 | 18 | 0.5556 | 0/48 (0.0000) | 0.5556 |

## k:1

Occurrences: `47`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 47 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 46 | 47 | 0.9787 | 0/0 (0.0000) | 0.9787 |
| medial | has_after | f:1 | 45 | 47 | 0.9574 | 0/0 (0.0000) | 0.9574 |
| medial | next_is | f:1 | 45 | 47 | 0.9574 | 0/0 (0.0000) | 0.9574 |
| medial | has_after | d:1 | 44 | 47 | 0.9362 | 0/0 (0.0000) | 0.9362 |
| medial | has_after | i:1 | 44 | 47 | 0.9362 | 0/0 (0.0000) | 0.9362 |
| medial | ends_with | d:1 | 42 | 47 | 0.8936 | 0/0 (0.0000) | 0.8936 |
| medial | has_prior | f:1 | 42 | 47 | 0.8936 | 0/0 (0.0000) | 0.8936 |
| medial | prev_is | f:1 | 42 | 47 | 0.8936 | 0/0 (0.0000) | 0.8936 |
| medial | has_prior | c:1 | 39 | 47 | 0.8298 | 0/0 (0.0000) | 0.8298 |
| medial | starts_with | e:1 | 34 | 47 | 0.7234 | 0/0 (0.0000) | 0.7234 |
| medial | has_prior | h:2 | 25 | 47 | 0.5319 | 0/0 (0.0000) | 0.5319 |

## l:1

Occurrences: `24`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 24 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | f:1 | 24 | 24 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_prior | e:1 | 24 | 24 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | next_is | f:1 | 24 | 24 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_after | d:1 | 23 | 24 | 0.9583 | 0/0 (0.0000) | 0.9583 |
| medial | has_prior | f:1 | 23 | 24 | 0.9583 | 0/0 (0.0000) | 0.9583 |
| medial | has_after | i:1 | 22 | 24 | 0.9167 | 0/0 (0.0000) | 0.9167 |
| medial | ends_with | d:1 | 21 | 24 | 0.8750 | 0/0 (0.0000) | 0.8750 |
| medial | has_prior | c:1 | 21 | 24 | 0.8750 | 0/0 (0.0000) | 0.8750 |
| medial | prev_is | f:1 | 21 | 24 | 0.8750 | 0/0 (0.0000) | 0.8750 |
| medial | starts_with | e:1 | 19 | 24 | 0.7917 | 0/0 (0.0000) | 0.7917 |
| medial | has_prior | h:2 | 16 | 24 | 0.6667 | 0/0 (0.0000) | 0.6667 |
