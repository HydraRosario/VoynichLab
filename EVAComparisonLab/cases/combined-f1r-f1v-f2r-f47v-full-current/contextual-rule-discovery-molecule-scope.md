# Contextual Rule Discovery

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Context scope: `molecule`
- Symbols audited: `d:1`, `e:1`, `c:1`, `c:2`, `f:1`, `a:1`, `h:1`, `h:2`, `m:1`, `g:1`, `j:1`, `n:1`, `k:1`, `l:1`

## d:1

Occurrences: `248`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 87 |
| final | 161 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | i:1 | 157 | 161 | 0.9752 | 58/87 (0.6667) | 0.3085 |
| final | prev_is | i:1 | 157 | 161 | 0.9752 | 58/87 (0.6667) | 0.3085 |
| medial | has_prior | e:1 | 84 | 87 | 0.9655 | 151/161 (0.9379) | 0.0276 |
| final | has_prior | f:1 | 154 | 161 | 0.9565 | 34/87 (0.3908) | 0.5657 |
| final | has_prior | e:1 | 151 | 161 | 0.9379 | 84/87 (0.9655) | -0.0276 |
| medial | has_after | e:1 | 81 | 87 | 0.9310 | 0/161 (0.0000) | 0.9310 |
| final | has_prior | c:1 | 133 | 161 | 0.8261 | 63/87 (0.7241) | 0.1019 |
| medial | next_is | e:1 | 50 | 87 | 0.5747 | 0/161 (0.0000) | 0.5747 |
| medial | has_after | f:1 | 44 | 87 | 0.5057 | 0/161 (0.0000) | 0.5057 |
| medial | has_after | h:1 | 43 | 87 | 0.4943 | 0/161 (0.0000) | 0.4943 |
| medial | ends_with | h:1 | 41 | 87 | 0.4713 | 0/161 (0.0000) | 0.4713 |
| medial | has_prior | f:1 | 34 | 87 | 0.3908 | 154/161 (0.9565) | -0.5657 |

## e:1

Occurrences: `1332`

| Role | Count |
| --- | ---: |
| initial | 305 |
| medial | 1001 |
| final | 26 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | g:1 | 25 | 26 | 0.9615 | 608/1306 (0.4655) | 0.4960 |
| final | has_prior | n:1 | 23 | 26 | 0.8846 | 227/1306 (0.1738) | 0.7108 |
| final | prev_is | g:1 | 22 | 26 | 0.8462 | 274/1306 (0.2098) | 0.6364 |
| initial | has_after | c:1 | 252 | 305 | 0.8262 | 386/1027 (0.3759) | 0.4504 |
| medial | has_prior | c:1 | 657 | 1001 | 0.6563 | 13/331 (0.0393) | 0.6171 |
| medial | has_prior | g:1 | 608 | 1001 | 0.6074 | 25/331 (0.0755) | 0.5319 |

## c:1

Occurrences: `642`

| Role | Count |
| --- | ---: |
| initial | 67 |
| medial | 544 |
| final | 31 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 30 | 31 | 0.9677 | 445/611 (0.7283) | 0.2394 |
| final | has_prior | g:1 | 27 | 31 | 0.8710 | 184/611 (0.3011) | 0.5698 |
| medial | has_prior | e:1 | 445 | 544 | 0.8180 | 30/98 (0.3061) | 0.5119 |
| medial | has_prior | a:1 | 315 | 544 | 0.5790 | 12/98 (0.1224) | 0.4566 |

## c:2

Occurrences: `34`

| Role | Count |
| --- | ---: |
| initial | 3 |
| medial | 31 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | has_after | c:1 | 3 | 3 | 1.0000 | 10/31 (0.3226) | 0.6774 |
| initial | has_after | g:1 | 3 | 3 | 1.0000 | 17/31 (0.5484) | 0.4516 |
| initial | has_after | e:1 | 3 | 3 | 1.0000 | 29/31 (0.9355) | 0.0645 |
| medial | has_after | e:1 | 29 | 31 | 0.9355 | 3/3 (1.0000) | -0.0645 |
| medial | has_prior | e:1 | 24 | 31 | 0.7742 | 0/3 (0.0000) | 0.7742 |
| medial | has_prior | c:1 | 21 | 31 | 0.6774 | 0/3 (0.0000) | 0.6774 |
| initial | has_after | a:1 | 2 | 3 | 0.6667 | 6/31 (0.1935) | 0.4731 |
| medial | starts_with | e:1 | 18 | 31 | 0.5806 | 0/3 (0.0000) | 0.5806 |
| medial | has_after | g:1 | 17 | 31 | 0.5484 | 3/3 (1.0000) | -0.4516 |
| medial | has_after | f:1 | 15 | 31 | 0.4839 | 0/3 (0.0000) | 0.4839 |
| medial | has_prior | a:1 | 15 | 31 | 0.4839 | 0/3 (0.0000) | 0.4839 |
| medial | has_after | c:1 | 10 | 31 | 0.3226 | 3/3 (1.0000) | -0.6774 |
| medial | has_after | a:1 | 6 | 31 | 0.1935 | 2/3 (0.6667) | -0.4731 |

## f:1

Occurrences: `459`

| Role | Count |
| --- | ---: |
| initial | 2 |
| medial | 455 |
| final | 2 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | next_is | j:1 | 2 | 2 | 1.0000 | 111/457 (0.2429) | 0.7571 |
| initial | has_after | j:1 | 2 | 2 | 1.0000 | 136/457 (0.2976) | 0.7024 |
| final | prev_is | e:1 | 2 | 2 | 1.0000 | 164/457 (0.3589) | 0.6411 |
| final | has_prior | e:1 | 2 | 2 | 1.0000 | 419/457 (0.9168) | 0.0832 |
| medial | has_prior | e:1 | 419 | 455 | 0.9209 | 2/4 (0.5000) | 0.4209 |
| medial | has_prior | c:1 | 383 | 455 | 0.8418 | 1/4 (0.2500) | 0.5918 |
| medial | starts_with | e:1 | 335 | 455 | 0.7363 | 1/4 (0.2500) | 0.4863 |
| medial | has_after | d:1 | 328 | 455 | 0.7209 | 0/4 (0.0000) | 0.7209 |
| medial | has_after | i:1 | 328 | 455 | 0.7209 | 0/4 (0.0000) | 0.7209 |
| medial | ends_with | d:1 | 289 | 455 | 0.6352 | 0/4 (0.0000) | 0.6352 |
| final | has_prior | j:1 | 1 | 2 | 0.5000 | 17/457 (0.0372) | 0.4628 |

## a:1

Occurrences: `419`

| Role | Count |
| --- | ---: |
| initial | 44 |
| medial | 372 |
| final | 3 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | b:1 | 3 | 3 | 1.0000 | 172/416 (0.4135) | 0.5865 |
| final | prev_is | c:1 | 3 | 3 | 1.0000 | 255/416 (0.6130) | 0.3870 |
| final | has_prior | c:1 | 3 | 3 | 1.0000 | 270/416 (0.6490) | 0.3510 |
| initial | has_after | c:1 | 44 | 44 | 1.0000 | 258/375 (0.6880) | 0.3120 |
| medial | has_after | e:1 | 339 | 372 | 0.9113 | 36/47 (0.7660) | 0.1453 |
| initial | has_after | b:1 | 39 | 44 | 0.8864 | 164/375 (0.4373) | 0.4490 |
| initial | has_after | e:1 | 36 | 44 | 0.8182 | 339/375 (0.9040) | -0.0858 |
| initial | next_is | b:1 | 32 | 44 | 0.7273 | 97/375 (0.2587) | 0.4686 |
| medial | has_prior | c:1 | 270 | 372 | 0.7258 | 3/47 (0.0638) | 0.6620 |
| medial | has_prior | e:1 | 262 | 372 | 0.7043 | 2/47 (0.0426) | 0.6617 |
| medial | prev_is | c:1 | 255 | 372 | 0.6855 | 3/47 (0.0638) | 0.6217 |
| final | has_prior | n:1 | 2 | 3 | 0.6667 | 18/416 (0.0433) | 0.6234 |
| final | has_prior | m:1 | 2 | 3 | 0.6667 | 54/416 (0.1298) | 0.5369 |
| final | has_prior | g:1 | 2 | 3 | 0.6667 | 67/416 (0.1611) | 0.5056 |
| medial | starts_with | e:1 | 222 | 372 | 0.5968 | 1/47 (0.0213) | 0.5755 |

## h:1

Occurrences: `209`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 40 |
| final | 169 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | e:1 | 169 | 169 | 1.0000 | 40/40 (1.0000) | 0.0000 |
| medial | has_prior | e:1 | 40 | 40 | 1.0000 | 169/169 (1.0000) | 0.0000 |
| final | prev_is | e:1 | 167 | 169 | 0.9882 | 39/40 (0.9750) | 0.0132 |
| medial | prev_is | e:1 | 39 | 40 | 0.9750 | 167/169 (0.9882) | -0.0132 |
| medial | has_after | e:1 | 34 | 40 | 0.8500 | 0/169 (0.0000) | 0.8500 |
| medial | starts_with | e:1 | 33 | 40 | 0.8250 | 108/169 (0.6391) | 0.1859 |
| final | has_prior | c:1 | 137 | 169 | 0.8107 | 13/40 (0.3250) | 0.4857 |
| medial | has_after | c:1 | 30 | 40 | 0.7500 | 0/169 (0.0000) | 0.7500 |
| final | has_prior | g:1 | 122 | 169 | 0.7219 | 10/40 (0.2500) | 0.4719 |
| medial | has_after | f:1 | 24 | 40 | 0.6000 | 0/169 (0.0000) | 0.6000 |
| medial | has_after | a:1 | 19 | 40 | 0.4750 | 0/169 (0.0000) | 0.4750 |
| medial | has_after | d:1 | 18 | 40 | 0.4500 | 0/169 (0.0000) | 0.4500 |
| medial | next_is | a:1 | 18 | 40 | 0.4500 | 0/169 (0.0000) | 0.4500 |
| medial | next_is | e:1 | 18 | 40 | 0.4500 | 0/169 (0.0000) | 0.4500 |
| medial | has_prior | c:1 | 13 | 40 | 0.3250 | 137/169 (0.8107) | -0.4857 |
| medial | has_prior | g:1 | 10 | 40 | 0.2500 | 122/169 (0.7219) | -0.4719 |

## h:2

Occurrences: `160`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 152 |
| final | 8 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | c:1 | 8 | 8 | 1.0000 | 146/152 (0.9605) | 0.0395 |
| medial | has_prior | e:1 | 152 | 152 | 1.0000 | 8/8 (1.0000) | 0.0000 |
| final | has_prior | e:1 | 8 | 8 | 1.0000 | 152/152 (1.0000) | 0.0000 |
| medial | has_prior | c:1 | 146 | 152 | 0.9605 | 8/8 (1.0000) | -0.0395 |
| medial | has_after | e:1 | 142 | 152 | 0.9342 | 0/8 (0.0000) | 0.9342 |
| medial | prev_is | c:1 | 142 | 152 | 0.9342 | 6/8 (0.7500) | 0.1842 |
| medial | starts_with | e:1 | 127 | 152 | 0.8355 | 3/8 (0.3750) | 0.4605 |
| medial | next_is | e:1 | 126 | 152 | 0.8289 | 0/8 (0.0000) | 0.8289 |
| medial | has_after | f:1 | 104 | 152 | 0.6842 | 0/8 (0.0000) | 0.6842 |
| medial | has_after | d:1 | 80 | 152 | 0.5263 | 0/8 (0.0000) | 0.5263 |
| medial | has_after | i:1 | 80 | 152 | 0.5263 | 0/8 (0.0000) | 0.5263 |
| medial | ends_with | d:1 | 70 | 152 | 0.4605 | 0/8 (0.0000) | 0.4605 |
| final | starts_with | e:1 | 3 | 8 | 0.3750 | 127/152 (0.8355) | -0.4605 |

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
| initial | has_after | n:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | next_is | a:1 | 1 | 1 | 1.0000 | 0/50 (0.0000) | 1.0000 |
| initial | has_after | b:1 | 1 | 1 | 1.0000 | 10/50 (0.2000) | 0.8000 |
| initial | has_after | i:1 | 1 | 1 | 1.0000 | 12/50 (0.2400) | 0.7600 |
| initial | ends_with | h:1 | 1 | 1 | 1.0000 | 26/50 (0.5200) | 0.4800 |
| initial | has_after | h:1 | 1 | 1 | 1.0000 | 26/50 (0.5200) | 0.4800 |
| initial | has_after | e:1 | 1 | 1 | 1.0000 | 45/50 (0.9000) | 0.1000 |
| initial | has_after | a:1 | 1 | 1 | 1.0000 | 48/50 (0.9600) | 0.0400 |
| medial | has_after | c:1 | 50 | 50 | 1.0000 | 1/1 (1.0000) | 0.0000 |
| initial | has_after | c:1 | 1 | 1 | 1.0000 | 50/50 (1.0000) | 0.0000 |
| medial | next_is | c:1 | 49 | 50 | 0.9800 | 0/1 (0.0000) | 0.9800 |
| medial | has_after | a:1 | 48 | 50 | 0.9600 | 1/1 (1.0000) | -0.0400 |
| medial | has_after | e:1 | 45 | 50 | 0.9000 | 1/1 (1.0000) | -0.1000 |
| medial | has_prior | e:1 | 30 | 50 | 0.6000 | 0/1 (0.0000) | 0.6000 |
| medial | starts_with | e:1 | 28 | 50 | 0.5600 | 0/1 (0.0000) | 0.5600 |
| medial | has_after | g:1 | 27 | 50 | 0.5400 | 0/1 (0.0000) | 0.5400 |

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
| medial | has_prior | e:1 | 288 | 298 | 0.9664 | 0/0 (0.0000) | 0.9664 |
| medial | prev_is | e:1 | 222 | 298 | 0.7450 | 0/0 (0.0000) | 0.7450 |
| medial | starts_with | e:1 | 195 | 298 | 0.6544 | 0/0 (0.0000) | 0.6544 |
| medial | has_after | c:1 | 158 | 298 | 0.5302 | 0/0 (0.0000) | 0.5302 |
| medial | has_prior | c:1 | 144 | 298 | 0.4832 | 0/0 (0.0000) | 0.4832 |
| medial | has_after | h:1 | 141 | 298 | 0.4732 | 0/0 (0.0000) | 0.4732 |
| medial | ends_with | h:1 | 136 | 298 | 0.4564 | 0/0 (0.0000) | 0.4564 |

## j:1

Occurrences: `114`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 43 |
| final | 71 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| final | has_prior | f:1 | 71 | 71 | 1.0000 | 42/43 (0.9767) | 0.0233 |
| final | prev_is | f:1 | 71 | 71 | 1.0000 | 42/43 (0.9767) | 0.0233 |
| medial | has_prior | f:1 | 42 | 43 | 0.9767 | 71/71 (1.0000) | -0.0233 |
| medial | prev_is | f:1 | 42 | 43 | 0.9767 | 71/71 (1.0000) | -0.0233 |
| final | has_prior | c:1 | 69 | 71 | 0.9718 | 41/43 (0.9535) | 0.0183 |
| medial | has_prior | c:1 | 41 | 43 | 0.9535 | 69/71 (0.9718) | -0.0183 |
| medial | has_after | e:1 | 37 | 43 | 0.8605 | 0/71 (0.0000) | 0.8605 |
| final | has_prior | e:1 | 59 | 71 | 0.8310 | 28/43 (0.6512) | 0.1798 |
| medial | next_is | e:1 | 23 | 43 | 0.5349 | 0/71 (0.0000) | 0.5349 |

## n:1

Occurrences: `82`

| Role | Count |
| --- | ---: |
| initial | 51 |
| medial | 31 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| initial | has_after | g:1 | 51 | 51 | 1.0000 | 30/31 (0.9677) | 0.0323 |
| initial | has_after | e:1 | 51 | 51 | 1.0000 | 31/31 (1.0000) | 0.0000 |
| medial | has_after | e:1 | 31 | 31 | 1.0000 | 51/51 (1.0000) | 0.0000 |
| medial | has_after | g:1 | 30 | 31 | 0.9677 | 51/51 (1.0000) | -0.0323 |
| initial | next_is | e:1 | 48 | 51 | 0.9412 | 29/31 (0.9355) | 0.0057 |
| medial | next_is | e:1 | 29 | 31 | 0.9355 | 48/51 (0.9412) | -0.0057 |
| medial | has_prior | c:1 | 28 | 31 | 0.9032 | 0/51 (0.0000) | 0.9032 |
| medial | has_prior | e:1 | 20 | 31 | 0.6452 | 0/51 (0.0000) | 0.6452 |
| medial | starts_with | e:1 | 14 | 31 | 0.4516 | 0/51 (0.0000) | 0.4516 |

## k:1

Occurrences: `65`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 65 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_prior | e:1 | 64 | 65 | 0.9846 | 0/0 (0.0000) | 0.9846 |
| medial | has_after | f:1 | 63 | 65 | 0.9692 | 0/0 (0.0000) | 0.9692 |
| medial | next_is | f:1 | 63 | 65 | 0.9692 | 0/0 (0.0000) | 0.9692 |
| medial | has_after | d:1 | 61 | 65 | 0.9385 | 0/0 (0.0000) | 0.9385 |
| medial | has_after | i:1 | 61 | 65 | 0.9385 | 0/0 (0.0000) | 0.9385 |
| medial | has_prior | f:1 | 60 | 65 | 0.9231 | 0/0 (0.0000) | 0.9231 |
| medial | prev_is | f:1 | 60 | 65 | 0.9231 | 0/0 (0.0000) | 0.9231 |
| medial | ends_with | d:1 | 56 | 65 | 0.8615 | 0/0 (0.0000) | 0.8615 |
| medial | has_prior | c:1 | 51 | 65 | 0.7846 | 0/0 (0.0000) | 0.7846 |
| medial | starts_with | e:1 | 49 | 65 | 0.7538 | 0/0 (0.0000) | 0.7538 |
| medial | has_prior | h:2 | 32 | 65 | 0.4923 | 0/0 (0.0000) | 0.4923 |

## l:1

Occurrences: `31`

| Role | Count |
| --- | ---: |
| initial | 0 |
| medial | 31 |
| final | 0 |
| singleton | 0 |

### Strong Context Findings

| Role | Test | Token | Count | Total | Share | Contrast | Delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| medial | has_after | f:1 | 31 | 31 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_prior | e:1 | 31 | 31 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | next_is | f:1 | 31 | 31 | 1.0000 | 0/0 (0.0000) | 1.0000 |
| medial | has_prior | f:1 | 30 | 31 | 0.9677 | 0/0 (0.0000) | 0.9677 |
| medial | has_after | d:1 | 29 | 31 | 0.9355 | 0/0 (0.0000) | 0.9355 |
| medial | has_after | i:1 | 28 | 31 | 0.9032 | 0/0 (0.0000) | 0.9032 |
| medial | prev_is | f:1 | 27 | 31 | 0.8710 | 0/0 (0.0000) | 0.8710 |
| medial | has_prior | c:1 | 26 | 31 | 0.8387 | 0/0 (0.0000) | 0.8387 |
| medial | ends_with | d:1 | 25 | 31 | 0.8065 | 0/0 (0.0000) | 0.8065 |
| medial | starts_with | e:1 | 24 | 31 | 0.7742 | 0/0 (0.0000) | 0.7742 |
| medial | has_prior | h:2 | 21 | 31 | 0.6774 | 0/0 (0.0000) | 0.6774 |
