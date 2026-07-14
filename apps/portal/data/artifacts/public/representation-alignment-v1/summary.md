# REPRESENTATION-ALIGNMENT-V1

Purpose: create an auditable mapping between complete EVA tokens and ATOMS physical units over the same manuscript rows, without assuming one-to-one correspondence.

## Inputs

- EVA token tables: `EVAComparisonLab/cases/<folio>-full/eva-tokens.tsv`.
- ATOMS unit tables: `EVAComparisonLab/cases/<folio>-full/atoms-current.tsv`.
- Row alignment table: `EVAComparisonLab/cases/combined-f1r-f1v-f2r-f2v-f47v-full-current/line-alignment-audit.tsv`.

## Method

The hierarchy is:

```text
folio -> line -> left-to-right visual span -> EVA token group -> ATOMS unit group
```

ATOMS units use real bounding-box x spans. EVA tokens currently have no token-level coordinates in the case tables, so V1 assigns EVA tokens uniform ordinal spans within each paired line. Overlapping spans are merged into monotonic connected regions. This allows `1:1`, `1:N`, `N:1`, and `N:M` relations without forcing one-to-one alignment.

Because EVA token coordinates are estimated, this is an alignment audit layer, not visual proof of exact token boundaries.

## Coverage

| Folio | EVA tokens | ATOMS units | Aligned EVA tokens | Aligned ATOMS units | EVA coverage | ATOMS coverage | Regions | Unresolved |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `f1r` | 210 | 196 | 206 | 196 | 98.10% | 100.00% | 68 | 4 |
| `f1v` | 90 | 90 | 84 | 90 | 93.33% | 100.00% | 39 | 6 |
| `f2r` | 99 | 104 | 96 | 104 | 96.97% | 100.00% | 42 | 3 |
| `f2v` | 61 | 57 | 60 | 57 | 98.36% | 100.00% | 23 | 1 |
| `f47v` | 85 | 83 | 84 | 83 | 98.82% | 100.00% | 37 | 1 |

## Relation Types

| Relation | Count |
| --- | ---: |
| `1:1` | 70 |
| `1:N` | 8 |
| `N:1` | 11 |
| `N:M` | 120 |

## Confidence

| Confidence | Count |
| --- | ---: |
| `low` | 139 |
| `low-medium` | 33 |
| `medium` | 37 |

## Examples By Relation Type

### 1:1

| Region | EVA | ATOMS units | Confidence | Evidence |
| --- | --- | --- | --- | --- |
| `f1r-l2-r001` | `sory` | `p003-u010` | `low-medium` | `atoms_x=565-721; eva_ordinal=1-1/11; line_pair=paired-by-ordinal` |
| `f1r-l7-r001` | `odar` | `p003-u043` | `low-medium` | `atoms_x=780-897; eva_ordinal=1-1/10; line_pair=paired-by-ordinal` |
| `f1r-l8-r002` | `okchoy` | `p003-u052` | `medium` | `atoms_x=976-1153; eva_ordinal=3-3/9; line_pair=paired-by-ordinal` |
| `f1r-l11-r002` | `s` | `p003-u069` | `low-medium` | `atoms_x=1332-1484; eva_ordinal=4-4/8; line_pair=paired-by-ordinal` |
| `f1r-l11-r003` | `cphey` | `p003-u070` | `low-medium` | `atoms_x=1539-1731; eva_ordinal=5-5/8; line_pair=paired-by-ordinal` |
| `f1r-l12-r001` | `oksho` | `p003-u073` | `low-medium` | `atoms_x=566-746; eva_ordinal=1-1/8; line_pair=paired-by-ordinal` |
| `f1r-l12-r004` | `okan` | `p003-u078` | `low-medium` | `atoms_x=1516-1668; eva_ordinal=5-5/8; line_pair=paired-by-ordinal` |
| `f1r-l15-r001` | `daiin` | `p003-u099` | `medium` | `atoms_x=561-699; eva_ordinal=1-1/10; line_pair=paired-by-ordinal` |

### 1:N

| Region | EVA | ATOMS units | Confidence | Evidence |
| --- | --- | --- | --- | --- |
| `f1r-l12-r003` | `oteol` | `p003-u076 p003-u077` | `low` | `atoms_x=1263-1460; eva_ordinal=4-4/8; line_pair=paired-by-ordinal` |
| `f1v-l4-r003` | `chokody` | `p004-u029 p004-u030` | `low` | `atoms_x=1784-2015; eva_ordinal=6-6/6; line_pair=paired-by-ordinal` |
| `f1v-l7-r001` | `qo` | `p004-u051 p004-u052` | `low` | `atoms_x=557-707; eva_ordinal=1-1/12; line_pair=paired-by-ordinal` |
| `f1v-l9-r001` | `shor` | `p004-u073 p004-u074` | `low` | `atoms_x=570-709; eva_ordinal=1-1/11; line_pair=paired-by-ordinal` |
| `f2r-l3-r003` | `chy` | `p005-u017 p005-u018` | `low` | `atoms_x=1362-1581; eva_ordinal=5-5/7; line_pair=paired-by-ordinal` |
| `f2r-l4-r001` | `chaindy` | `p005-u021 p005-u022` | `low` | `atoms_x=436-623; eva_ordinal=1-1/7; line_pair=paired-by-ordinal` |
| `f47v-l9-r002` | `chol` | `p094-u051 p094-u052` | `low` | `atoms_x=1455-1750; eva_ordinal=3-3/5; line_pair=paired-by-ordinal` |
| `f47v-l9-r004` | `dain` | `p094-u054 p094-u055` | `low` | `atoms_x=2094-2431; eva_ordinal=5-5/5; line_pair=paired-by-ordinal` |

### N:1

| Region | EVA | ATOMS units | Confidence | Evidence |
| --- | --- | --- | --- | --- |
| `f1r-l2-r003` | `cthar dan` | `p003-u018` | `low` | `atoms_x=2077-2406; eva_ordinal=10-11/11; line_pair=paired-by-ordinal` |
| `f1r-l5-r002` | `cfhaiin ydaraishy` | `p003-u042` | `low` | `atoms_x=2015-2357; eva_ordinal=6-7/7; line_pair=paired-by-ordinal` |
| `f1r-l13-r002` | `kodaiin cphy` | `p003-u085` | `low` | `atoms_x=993-1219; eva_ordinal=3-4/9; line_pair=paired-by-ordinal` |
| `f1r-l13-r003` | `cphodaiils cthey` | `p003-u086` | `low` | `atoms_x=1404-1729; eva_ordinal=5-6/9; line_pair=paired-by-ordinal` |
| `f1v-l7-r006` | `do lchody` | `p004-u061` | `low` | `atoms_x=2174-2461; eva_ordinal=11-12/12; line_pair=paired-by-ordinal` |
| `f2r-l2-r002` | `s shor` | `p005-u010` | `low` | `atoms_x=1039-1220; eva_ordinal=3-4/6; line_pair=paired-by-ordinal` |
| `f2r-l3-r002` | `y chor` | `p005-u016` | `low` | `atoms_x=1059-1231; eva_ordinal=3-4/7; line_pair=paired-by-ordinal` |
| `f2r-l7-r002` | `chol dan` | `p005-u047` | `low` | `atoms_x=1019-1230; eva_ordinal=4-5/5; line_pair=paired-by-ordinal` |

### N:M

| Region | EVA | ATOMS units | Confidence | Evidence |
| --- | --- | --- | --- | --- |
| `f1r-l1-r001` | `fachys ykal ar` | `p003-u001 p003-u002 p003-u003` | `low` | `atoms_x=545-1088; eva_ordinal=1-3/10; line_pair=paired-by-ordinal` |
| `f1r-l1-r002` | `ataiin shol shory cthres y kor sholdy` | `p003-u004 p003-u005 p003-u006 p003-u007 p003-u008 p003-u009` | `low` | `atoms_x=1117-2397; eva_ordinal=4-10/10; line_pair=paired-by-ordinal` |
| `f1r-l2-r002` | `ckhar or y kair chtaiin shar are cthar` | `p003-u011 p003-u012 p003-u013 p003-u014 p003-u015 p003-u016 p003-u017` | `low` | `atoms_x=772-2046; eva_ordinal=2-9/11; line_pair=paired-by-ordinal` |
| `f1r-l3-r001` | `syaiir sheky or ykaiin` | `p003-u019 p003-u020 p003-u021 p003-u022 p003-u023` | `low` | `atoms_x=513-1321; eva_ordinal=1-4/9; line_pair=paired-by-ordinal` |
| `f1r-l3-r002` | `shod cthoary cthes daraiin sa` | `p003-u024 p003-u025 p003-u026 p003-u027 p003-u028` | `low` | `atoms_x=1365-2385; eva_ordinal=5-9/9; line_pair=paired-by-ordinal` |
| `f1r-l4-r001` | `ooiin oteey oteos roloty cth?ar daiin otaiin or okan` | `p003-u029 p003-u030 p003-u031 p003-u032 p003-u033 p003-u034 p003-u035 p003-u036` | `low` | `atoms_x=577-2389; eva_ordinal=1-9/9; line_pair=paired-by-ordinal` |
| `f1r-l5-r001` | `dair y chear cthaiin cphar` | `p003-u037 p003-u038 p003-u039 p003-u040 p003-u041` | `low` | `atoms_x=584-1693; eva_ordinal=1-5/7; line_pair=paired-by-ordinal` |
| `f1r-l7-r002` | `o y shol` | `p003-u044 p003-u045` | `low` | `atoms_x=947-1405; eva_ordinal=2-4/10; line_pair=paired-by-ordinal` |

## Drift And Crossing Checks

- Lines with different EVA token count and ATOMS unit count: `34`.
- Crossing alignments detected: `0`.

The method builds monotonic connected regions from ordered line spans, so crossing alignments are structurally disallowed in V1. Future coordinate-level EVA spans should re-check this with real token boxes.

### Lines With Count Drift

| Folio | Line | EVA tokens | ATOMS units | Difference |
| --- | ---: | ---: | ---: | ---: |
| `f1r` | 1 | 10 | 9 | -1 |
| `f1r` | 2 | 11 | 9 | -2 |
| `f1r` | 3 | 9 | 10 | 1 |
| `f1r` | 4 | 9 | 8 | -1 |
| `f1r` | 5 | 7 | 6 | -1 |
| `f1r` | 7 | 10 | 7 | -3 |
| `f1r` | 11 | 8 | 7 | -1 |
| `f1r` | 12 | 8 | 10 | 2 |
| `f1r` | 13 | 9 | 6 | -3 |
| `f1r` | 19 | 8 | 6 | -2 |
| `f1r` | 22 | 10 | 8 | -2 |
| `f1r` | 25 | 9 | 8 | -1 |
| `f1v` | 3 | 9 | 8 | -1 |
| `f1v` | 4 | 6 | 7 | 1 |
| `f1v` | 6 | 10 | 11 | 1 |
| `f1v` | 7 | 12 | 11 | -1 |
| `f2r` | 1 | 6 | 8 | 2 |
| `f2r` | 3 | 7 | 6 | -1 |
| `f2r` | 4 | 7 | 6 | -1 |
| `f2r` | 5 | 7 | 8 | 1 |
| `f2r` | 8 | 9 | 11 | 2 |
| `f2r` | 9 | 10 | 12 | 2 |
| `f2r` | 10 | 9 | 10 | 1 |
| `f2r` | 12 | 11 | 10 | -1 |
| `f2v` | 1 | 9 | 6 | -3 |
| `f2v` | 2 | 9 | 8 | -1 |
| `f47v` | 1 | 6 | 7 | 1 |
| `f47v` | 2 | 7 | 6 | -1 |
| `f47v` | 8 | 4 | 5 | 1 |
| `f47v` | 9 | 5 | 8 | 3 |

## Unresolved Regions

Total unresolved regions: `15`.

| Region | Side | Items | Reason | Note |
| --- | --- | --- | --- | --- |
| `f1r-l9-eva-4` | `EVA` | `shody` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1r-l9-eva-5` | `EVA` | `dain` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1r-l20-eva-5` | `EVA` | `ckhey` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1r-l27-eva-5` | `EVA` | `chotey` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l1-eva-3` | `EVA` | `ol` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l1-eva-4` | `EVA` | `oltchey` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l2-eva-4` | `EVA` | `ochy` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l3-eva-4` | `EVA` | `ckhy` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l3-eva-5` | `EVA` | `shy` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f1v-l4-eva-4` | `EVA` | `dam` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f2r-l2-eva-2` | `EVA` | `chkar` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f2r-l3-eva-2` | `EVA` | `cthey` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f2r-l4-eva-2` | `EVA` | `chtod` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f2v-l5-eva-5` | `EVA` | `s` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |
| `f47v-l12-eva-6` | `EVA` | `cheky` | `no-overlapping-atoms-span` | EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate. |

## Output Tables

- `aligned-regions.tsv`
- `unresolved-regions.tsv`

## Interpretation

REPRESENTATION-ALIGNMENT-V1 is good enough to audit coverage, relation types, and line-level monotonic grouping. It is not yet good enough to claim precise token-level visual correspondence, because EVA token spans are ordinal estimates rather than measured coordinates.
