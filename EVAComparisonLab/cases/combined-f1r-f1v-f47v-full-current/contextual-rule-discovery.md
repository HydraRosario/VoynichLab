# Contextual Rule Discovery

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Context scope: `particle`
- Symbols audited: `d:1`, `e:1`, `c:1`, `f:1`, `a:1`, `h:1`, `h:2`, `m:1`, `g:1`, `j:1`, `n:1`, `k:1`, `l:1`

## d:1

Occurrences: `187`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 16 |
| final | 171 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | e:1 | 16 | 16 | 1.0000 | 0/171 (0.0000) | 1.0000 |
| medial | has_prior | a:1 | 16 | 16 | 1.0000 | 9/171 (0.0526) | 0.9474 |
| medial | has_prior | c:1 | 16 | 16 | 1.0000 | 9/171 (0.0526) | 0.9474 |
| medial | has_prior | e:1 | 16 | 16 | 1.0000 | 41/171 (0.2398) | 0.7602 |
| medial | ends_with | e:1 | 15 | 16 | 0.9375 | 0/171 (0.0000) | 0.9375 |
| medial | has_after | g:1 | 15 | 16 | 0.9375 | 0/171 (0.0000) | 0.9375 |
| medial | next_is | g:1 | 15 | 16 | 0.9375 | 0/171 (0.0000) | 0.9375 |
| medial | has_prior | b:1 | 15 | 16 | 0.9375 | 9/171 (0.0526) | 0.8849 |
| medial | prev_is | b:1 | 15 | 16 | 0.9375 | 9/171 (0.0526) | 0.8849 |
| medial | starts_with | e:1 | 15 | 16 | 0.9375 | 41/171 (0.2398) | 0.6977 |
| final | has_prior | i:1 | 159 | 171 | 0.9298 | 0/16 (0.0000) | 0.9298 |
| final | prev_is | i:1 | 159 | 171 | 0.9298 | 0/16 (0.0000) | 0.9298 |
| final | has_prior | f:1 | 132 | 171 | 0.7719 | 0/16 (0.0000) | 0.7719 |
| final | has_prior | e:1 | 41 | 171 | 0.2398 | 16/16 (1.0000) | -0.7602 |
| final | starts_with | e:1 | 41 | 171 | 0.2398 | 15/16 (0.9375) | -0.6977 |
| final | has_prior | a:1 | 9 | 171 | 0.0526 | 16/16 (1.0000) | -0.9474 |
| final | has_prior | c:1 | 9 | 171 | 0.0526 | 16/16 (1.0000) | -0.9474 |
| final | has_prior | b:1 | 9 | 171 | 0.0526 | 15/16 (0.9375) | -0.8849 |

## e:1

Occurrences: `1069`

| Role | Count |
| --- | ---: |
| initial | 677 |
| medial | 58 |
| final | 242 |
| singleton | 92 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | g:1 | 242 | 242 | 1.0000 | 3/827 (0.0036) | 0.9964 |
| final | prev_is | g:1 | 242 | 242 | 1.0000 | 3/827 (0.0036) | 0.9964 |
| medial | has_prior | a:1 | 54 | 58 | 0.9310 | 52/1011 (0.0514) | 0.8796 |
| medial | has_after | c:1 | 53 | 58 | 0.9138 | 173/1011 (0.1711) | 0.7427 |
| medial | next_is | b:1 | 51 | 58 | 0.8793 | 0/1011 (0.0000) | 0.8793 |
| medial | prev_is | a:1 | 51 | 58 | 0.8793 | 0/1011 (0.0000) | 0.8793 |
| medial | has_after | b:1 | 51 | 58 | 0.8793 | 48/1011 (0.0475) | 0.8318 |
| medial | has_after | a:1 | 50 | 58 | 0.8621 | 60/1011 (0.0593) | 0.8027 |

## c:1

Occurrences: `524`

| Role | Count |
| --- | ---: |
| initial | 2 |
| medial | 282 |
| final | 6 |
| singleton | 234 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | next_is | g:1 | 2 | 2 | 1.0000 | 0/522 (0.0000) | 1.0000 |
| initial | has_after | g:1 | 2 | 2 | 1.0000 | 54/522 (0.1034) | 0.8966 |
| initial | has_after | e:1 | 2 | 2 | 1.0000 | 55/522 (0.1054) | 0.8946 |
| final | starts_with | a:1 | 6 | 6 | 1.0000 | 106/518 (0.2046) | 0.7954 |
| final | has_prior | a:1 | 6 | 6 | 1.0000 | 165/518 (0.3185) | 0.6815 |
| medial | has_prior | e:1 | 194 | 282 | 0.6879 | 1/242 (0.0041) | 0.6838 |
| final | has_prior | m:1 | 4 | 6 | 0.6667 | 36/518 (0.0695) | 0.5972 |
| final | prev_is | m:1 | 4 | 6 | 0.6667 | 36/518 (0.0695) | 0.5972 |
| medial | starts_with | e:1 | 173 | 282 | 0.6135 | 0/242 (0.0000) | 0.6135 |
| medial | has_after | a:1 | 165 | 282 | 0.5851 | 0/242 (0.0000) | 0.5851 |
| medial | next_is | a:1 | 165 | 282 | 0.5851 | 0/242 (0.0000) | 0.5851 |
| medial | has_prior | a:1 | 165 | 282 | 0.5851 | 6/242 (0.0248) | 0.5603 |
| initial | ends_with | h:1 | 1 | 2 | 0.5000 | 4/522 (0.0077) | 0.4923 |
| initial | has_after | h:1 | 1 | 2 | 0.5000 | 4/522 (0.0077) | 0.4923 |
| medial | has_prior | b:1 | 129 | 282 | 0.4574 | 1/242 (0.0041) | 0.4533 |
| medial | prev_is | b:1 | 129 | 282 | 0.4574 | 1/242 (0.0041) | 0.4533 |

## f:1

Occurrences: `348`

| Role | Count |
| --- | ---: |
| initial | 153 |
| medial | 68 |
| final | 125 |
| singleton | 2 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 125 | 125 | 1.0000 | 3/223 (0.0135) | 0.9865 |
| final | starts_with | e:1 | 125 | 125 | 1.0000 | 3/223 (0.0135) | 0.9865 |
| final | prev_is | e:1 | 124 | 125 | 0.9920 | 0/223 (0.0000) | 0.9920 |
| medial | ends_with | d:1 | 66 | 68 | 0.9706 | 66/280 (0.2357) | 0.7349 |
| medial | has_after | d:1 | 66 | 68 | 0.9706 | 66/280 (0.2357) | 0.7349 |
| medial | has_after | i:1 | 65 | 68 | 0.9559 | 68/280 (0.2429) | 0.7130 |
| medial | next_is | i:1 | 65 | 68 | 0.9559 | 68/280 (0.2429) | 0.7130 |
| medial | has_prior | k:1 | 45 | 68 | 0.6618 | 0/280 (0.0000) | 0.6618 |
| medial | prev_is | k:1 | 45 | 68 | 0.6618 | 0/280 (0.0000) | 0.6618 |
| medial | starts_with | k:1 | 43 | 68 | 0.6324 | 0/280 (0.0000) | 0.6324 |
| initial | has_after | j:1 | 85 | 153 | 0.5556 | 3/195 (0.0154) | 0.5402 |
| initial | next_is | j:1 | 85 | 153 | 0.5556 | 3/195 (0.0154) | 0.5402 |
| initial | ends_with | j:1 | 84 | 153 | 0.5490 | 1/195 (0.0051) | 0.5439 |

## a:1

Occurrences: `341`

| Role | Count |
| --- | ---: |
| initial | 113 |
| medial | 126 |
| final | 102 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | c:1 | 101 | 102 | 0.9902 | 64/239 (0.2678) | 0.7224 |
| final | prev_is | c:1 | 101 | 102 | 0.9902 | 64/239 (0.2678) | 0.7224 |
| initial | has_after | c:1 | 111 | 113 | 0.9823 | 60/228 (0.2632) | 0.7191 |
| medial | has_prior | e:1 | 121 | 126 | 0.9603 | 20/215 (0.0930) | 0.8673 |
| medial | starts_with | e:1 | 120 | 126 | 0.9524 | 0/215 (0.0000) | 0.9524 |
| medial | has_after | e:1 | 111 | 126 | 0.8810 | 24/215 (0.1116) | 0.7693 |
| medial | has_after | g:1 | 105 | 126 | 0.8333 | 3/215 (0.0140) | 0.8194 |
| medial | ends_with | e:1 | 101 | 126 | 0.8016 | 3/215 (0.0140) | 0.7876 |
| final | has_prior | b:1 | 81 | 102 | 0.7941 | 50/239 (0.2092) | 0.5849 |
| initial | has_after | b:1 | 87 | 113 | 0.7699 | 72/228 (0.3158) | 0.4541 |
| medial | prev_is | e:1 | 60 | 126 | 0.4762 | 0/215 (0.0000) | 0.4762 |

## h:1

Occurrences: `161`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 2 |
| final | 159 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | h:2 | 2 | 2 | 1.0000 | 0/159 (0.0000) | 1.0000 |
| medial | has_after | c:1 | 2 | 2 | 1.0000 | 0/159 (0.0000) | 1.0000 |
| medial | has_after | e:1 | 2 | 2 | 1.0000 | 0/159 (0.0000) | 1.0000 |
| medial | has_after | h:2 | 2 | 2 | 1.0000 | 0/159 (0.0000) | 1.0000 |
| medial | next_is | e:1 | 2 | 2 | 1.0000 | 0/159 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 154/159 (0.9686) | 0.0314 |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 156/159 (0.9811) | 0.0189 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 156/159 (0.9811) | 0.0189 |
| final | has_prior | e:1 | 156 | 159 | 0.9811 | 2/2 (1.0000) | -0.0189 |
| final | prev_is | e:1 | 156 | 159 | 0.9811 | 2/2 (1.0000) | -0.0189 |
| final | starts_with | e:1 | 154 | 159 | 0.9686 | 2/2 (1.0000) | -0.0314 |

## h:2

Occurrences: `126`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 126 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 126 | 126 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | starts_with | e:1 | 126 | 126 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| final | has_prior | c:1 | 114 | 126 | 0.9048 | 0/0 (0.0000) | 0.9048 |
| final | prev_is | c:1 | 114 | 126 | 0.9048 | 0/0 (0.0000) | 0.9048 |

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
| medial | has_prior | a:1 | 41 | 41 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | prev_is | a:1 | 41 | 41 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_after | c:1 | 40 | 41 | 0.9756 | 0/0 (0.0000) | 0.9756 |
| medial | next_is | c:1 | 40 | 41 | 0.9756 | 0/0 (0.0000) | 0.9756 |
| medial | has_after | a:1 | 37 | 41 | 0.9024 | 0/0 (0.0000) | 0.9024 |
| medial | starts_with | a:1 | 25 | 41 | 0.6098 | 0/0 (0.0000) | 0.6098 |
| medial | ends_with | a:1 | 21 | 41 | 0.5122 | 0/0 (0.0000) | 0.5122 |

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
| medial | ends_with | e:1 | 242 | 245 | 0.9878 | 0/0 (0.0000) | 0.9878 |
| medial | has_prior | e:1 | 230 | 245 | 0.9388 | 0/0 (0.0000) | 0.9388 |
| medial | starts_with | e:1 | 230 | 245 | 0.9388 | 0/0 (0.0000) | 0.9388 |
| medial | prev_is | e:1 | 180 | 245 | 0.7347 | 0/0 (0.0000) | 0.7347 |

## j:1

Occurrences: `88`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 3 |
| final | 85 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | ends_with | d:1 | 3 | 3 | 1.0000 | 0/85 (0.0000) | 1.0000 |
| medial | has_after | d:1 | 3 | 3 | 1.0000 | 0/85 (0.0000) | 1.0000 |
| medial | next_is | d:1 | 3 | 3 | 1.0000 | 0/85 (0.0000) | 1.0000 |
| final | has_prior | f:1 | 85 | 85 | 1.0000 | 3/3 (1.0000) | 0.0000 |
| final | prev_is | f:1 | 85 | 85 | 1.0000 | 3/3 (1.0000) | 0.0000 |
| medial | has_prior | f:1 | 3 | 3 | 1.0000 | 85/85 (1.0000) | 0.0000 |
| medial | prev_is | f:1 | 3 | 3 | 1.0000 | 85/85 (1.0000) | 0.0000 |
| final | starts_with | f:1 | 84 | 85 | 0.9882 | 1/3 (0.3333) | 0.6549 |
| medial | starts_with | f:1 | 1 | 3 | 0.3333 | 84/85 (0.9882) | -0.6549 |

## n:1

Occurrences: `66`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 0 |
| final | 0 |
| singleton | 66 |

### Strong Context Findings

No strong findings under the current thresholds.

## k:1

Occurrences: `47`

| Role | Count |
| --- | ---: |
| initial | 44 |
| medial | 2 |
| final | 0 |
| singleton | 1 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 0/45 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 0/45 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 0/45 (0.0000) | 1.0000 |
| medial | ends_with | d:1 | 2 | 2 | 1.0000 | 41/45 (0.9111) | 0.0889 |
| medial | has_after | d:1 | 2 | 2 | 1.0000 | 41/45 (0.9111) | 0.0889 |
| medial | has_after | i:1 | 2 | 2 | 1.0000 | 41/45 (0.9111) | 0.0889 |
| medial | has_after | f:1 | 2 | 2 | 1.0000 | 43/45 (0.9556) | 0.0444 |
| medial | next_is | f:1 | 2 | 2 | 1.0000 | 43/45 (0.9556) | 0.0444 |
| initial | has_after | f:1 | 43 | 44 | 0.9773 | 2/3 (0.6667) | 0.3106 |
| initial | next_is | f:1 | 43 | 44 | 0.9773 | 2/3 (0.6667) | 0.3106 |
| initial | ends_with | d:1 | 41 | 44 | 0.9318 | 2/3 (0.6667) | 0.2652 |
| initial | has_after | d:1 | 41 | 44 | 0.9318 | 2/3 (0.6667) | 0.2652 |
| initial | has_after | i:1 | 41 | 44 | 0.9318 | 2/3 (0.6667) | 0.2652 |

## l:1

Occurrences: `24`

| Role | Count |
| --- | ---: |
| initial | 22 |
| medial | 2 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 2 | 2 | 1.0000 | 0/22 (0.0000) | 1.0000 |
| medial | prev_is | e:1 | 2 | 2 | 1.0000 | 0/22 (0.0000) | 1.0000 |
| medial | starts_with | e:1 | 2 | 2 | 1.0000 | 0/22 (0.0000) | 1.0000 |
| initial | ends_with | d:1 | 22 | 22 | 1.0000 | 1/2 (0.5000) | 0.5000 |
| initial | has_after | d:1 | 22 | 22 | 1.0000 | 1/2 (0.5000) | 0.5000 |
| initial | has_after | f:1 | 22 | 22 | 1.0000 | 2/2 (1.0000) | 0.0000 |
| initial | next_is | f:1 | 22 | 22 | 1.0000 | 2/2 (1.0000) | 0.0000 |
| medial | has_after | f:1 | 2 | 2 | 1.0000 | 22/22 (1.0000) | 0.0000 |
| medial | next_is | f:1 | 2 | 2 | 1.0000 | 22/22 (1.0000) | 0.0000 |
| initial | has_after | i:1 | 21 | 22 | 0.9545 | 1/2 (0.5000) | 0.4545 |
| medial | ends_with | d:1 | 1 | 2 | 0.5000 | 22/22 (1.0000) | -0.5000 |
| medial | ends_with | f:1 | 1 | 2 | 0.5000 | 0/22 (0.0000) | 0.5000 |
| medial | has_after | d:1 | 1 | 2 | 0.5000 | 22/22 (1.0000) | -0.5000 |
| medial | has_after | i:1 | 1 | 2 | 0.5000 | 21/22 (0.9545) | -0.4545 |
