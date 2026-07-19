# VoynichLab EVA Comparison Complete Report

Generated from the current DatasetCreator database export.

This is the single-file report. It embeds the current compressed report plus the full generated markdown reports for entropy, rules, pattern searches, morphology, exceptions, anomaly audit, and visual snapshot inventory.

## Output Inventory

- Combined case directory: `cases\combined-f1r-f1v-f47v-full-current`
- Visual snapshots directory: `artifacts\visual-snapshots\current`
- Visual snapshots DB: `artifacts\visual-snapshots\current\visual-snapshots.db`
- Known anomalies list: `cases/known-labeling-anomalies.tsv`

## Visual Snapshot Inventory

- Snapshot PNG files: `0`
- Snapshot index DB exists: `yes`

Representative snapshot files:

---

# Current Compressed Report

Source: `cases\CURRENT-COMPRESSED-REPORT.md`

Generated from the current DatasetCreator database export.

## Scope

- Main f1r case: full `f1r` page from IVTFF.
- f1r EVA lines: `24`.
- f1r EVA tokens: `210`.
- f1r physical atom units: `197`.
- f1r DatasetCreator/exported rows: `24`.
- New f1v case: full `f1v` page from IVTFF, mapped to `page-004.jpg`.
- f1v EVA lines: `10`.
- f1v EVA tokens: `90`.
- f1v physical atom units: `90`.
- f1v DatasetCreator/exported rows: `10`.
- Combined case: full `f1r` page + full `f1v` page + full `f47v` page.
- Combined EVA lines: `48`.
- Combined EVA tokens: `385`.
- Combined physical atom units: `370`.

Note: stored DatasetCreator row guides are not always the full computed row set. The export mirrors the backend behavior by adding overflow rows for particles outside stored guide bands, so the lab rows match the program inspector.

f1r exported row distribution: `R1=9`, `R2=9`, `R3=10`, `R4=8`, `R5=6`, `R6=7`, `R7=9`, `R8=7`, `R9=7`, `R10=10`, `R11=6`, `R12=10`, `R13=10`, `R14=9`, `R15=8`, `R16=8`, `R17=6`, `R18=7`, `R19=9`, `R20=10`, `R21=9`, `R22=8`, `R23=9`, `R24=6`.
f1v exported row distribution: `R1=7`, `R2=8`, `R3=8`, `R4=7`, `R5=9`, `R6=11`, `R7=11`, `R8=11`, `R9=11`, `R10=7`.

Alignment note: f1r currently has `210` EVA tokens and `197` physical atom units. That mismatch is preserved as evidence and should not be silently normalized.

## Line Alignment Audit

- `page-003.jpg`: EVA lines=`24`, physical rows=`24`, status=`line-count-match`.
- `page-004.jpg`: EVA lines=`10`, physical rows=`10`, status=`line-count-match`.
- `page-094.jpg`: EVA lines=`14`, physical rows=`14`, status=`line-count-match`.
- Corpus-level entropy comparison remains usable; strict line-by-line comparison is only valid where line counts match or after an explicit mapping table.

## Entropy Summary

### f1r Full Page

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 210 | 828 | 24 | 0.7669 | 0.4839 | 8 | 8 |
| ATOMS | 197 | 2065 | 16 | 0.5058 | 0.3191 | 7 | 8 |

### f1v Full Page

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 90 | 324 | 22 | 0.7182 | 0.4531 | 10 | 11 |
| ATOMS | 90 | 787 | 16 | 0.5624 | 0.3548 | 7 | 8 |

### Combined f1r + f1v + f47v

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 385 | 1470 | 25 | 0.7821 | 0.4934 | 7 | 7 |
| ATOMS | 370 | 3621 | 16 | 0.5334 | 0.3366 | 5 | 7 |

## Atom Vocabulary

| Symbol | Count |
| --- | ---: |
| `a:1` | 341 |
| `b:1` | 156 |
| `c:1` | 524 |
| `c:2` | 33 |
| `d:1` | 187 |
| `e:1` | 1069 |
| `f:1` | 348 |
| `g:1` | 245 |
| `h:1` | 161 |
| `h:2` | 126 |
| `i:1` | 165 |
| `j:1` | 88 |
| `k:1` | 47 |
| `l:1` | 24 |
| `m:1` | 41 |
| `n:1` | 66 |

## Cleanup Audit

- New split symbol `n:1` appears `66` time(s) after replacing the former `j:2` shape.
- No retired `j:2`, `a:2`, or `g:2` symbols remain in the current combined export.
- Labeling anomaly audit: `0` pending candidates, high=`0`, medium=`0`, known anomalies suppressed=`3`.

## Strong Positional Rigidity

- `g:1`: H=0.0000, n=245, dominant=medial:1.0000.
- `b:1`: H=0.0000, n=156, dominant=medial:1.0000.
- `k:1`: H=0.0000, n=47, dominant=medial:1.0000.
- `m:1`: H=0.0000, n=41, dominant=medial:1.0000.
- `l:1`: H=0.0000, n=24, dominant=medial:1.0000.
- `f:1`: H=0.0568, n=348, dominant=medial:0.9943.
- `i:1`: H=0.0945, n=165, dominant=medial:0.9879.
- `h:2`: H=0.3095, n=126, dominant=medial:0.9444.
- `c:2`: H=0.3298, n=33, dominant=medial:0.9394.
- `a:1`: H=0.5841, n=341, dominant=medial:0.8768.
- `h:1`: H=0.5917, n=161, dominant=final:0.8571.
- `c:1`: H=0.7437, n=524, dominant=medial:0.8511.

## Most Dispersed Atom Symbols

- `d:1`: H=0.9319, n=187, initial=0 medial=65 final=122.
- `j:1`: H=0.8454, n=88, initial=0 medial=24 final=64.
- `n:1`: H=0.8454, n=66, initial=48 medial=18 final=0.
- `e:1`: H=0.8024, n=1069, initial=228 medial=834 final=7.
- `c:1`: H=0.7437, n=524, initial=52 medial=446 final=26.
- `h:1`: H=0.5917, n=161, initial=0 medial=23 final=138.
- `a:1`: H=0.5841, n=341, initial=39 medial=299 final=3.
- `c:2`: H=0.3298, n=33, initial=2 medial=31 final=0.

## Contextual Grammar Candidates

Particle-scope strongest current findings:

- `d:1` final: `has_prior i:1` = `159/171` (0.9298).
- `d:1` medial: `has_prior a:1` = `16/16` (1.0000).
- `d:1` medial: `has_after e:1` = `16/16` (1.0000).
- `e:1` final: `has_prior g:1` = `242/242` (1.0000).
- `f:1` final: `prev_is e:1` = `124/125` (0.9920).
- `f:1` medial: `next_is i:1` = `65/68` (0.9559).
- `h:2` final: `has_prior e:1` = `126/126` (1.0000).
- `m:1` medial: `prev_is a:1` = `41/41` (1.0000).
- `m:1` medial: `next_is c:1` = `40/41` (0.9756).

Molecule-scope exploratory signals:

- `j:1` final: `has_prior f:1` = `64/64` (1.0000).
- `j:1` final: `prev_is f:1` = `64/64` (1.0000).
- `n:1` initial: `has_after g:1` = `48/48` (1.0000).
- `n:1` initial: `has_after e:1` = `48/48` (1.0000).
- `n:1` medial: `has_prior c:1` = `18/18` (1.0000).
- `n:1` medial: `next_is e:1` = `17/18` (0.9444).
- `k:1` medial: `has_prior e:1` = `46/47` (0.9787).

Molecule-neighbor scan:

- `last_token=a:1` -> `e:1`: `3/3` (1.0000).
- `last_token=h:2` -> `e:1`: `3/3` (1.0000).
- `suffix2=c:1 a:1` -> `e:1 g:1`: `3/3` (1.0000).

## Search-Space And Validation Guardrails

- `particle` scope examined `3240` raw symbol-role-test-token hypotheses and reported `159` candidates.
- `molecule` scope examined `2790` raw symbol-role-test-token hypotheses and reported `176` candidates.
- Strong contextual rows are treated as candidate rules, not as proof by themselves.
- The next scientific step is a frozen alphabet/manual plus out-of-sample annotation, so discovered rules cannot silently shape future labels.

## New Pattern Search Layers

- Conditional entropy: weighted next=`1.9007`, previous=`1.6449`.
- Lowest next-token entropy leads: `g:1` -> `e:1` (1.0000, H=0.0000); `l:1` -> `f:1` (1.0000, H=0.0000); `m:1` -> `c:1` (0.9756, H=0.1654); `i:1` -> `d:1` (0.9755, H=0.1861); `k:1` -> `f:1` (0.9574, H=0.2539).
- Variant ablation: full H=`0.5334`, merged-family H=`0.5764`.
- Variant-family checks: `h` split-minus-merged=-0.5321; `c` split-minus-merged=-0.0052.
- Macro lexeme test: `16` atom symbols collapse to `12` macro-units over `370` physical units.
- Macro signature diversity: original `254` signatures, macro `248` signatures.
- Merged `MEDIAL_OP` (medial:652 final:2) keeps H(role)=`0.0299`, dominant=`medial` at `0.9969`.
- Top macro lexemes: `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` (17x); `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` (10x); `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` (8x); `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` (7x); `e:1 MEDIAL_OP e:1 c:1` (6x).
- Morphology-only classifier: nearest-centroid accuracy=`0.9406`, kNN accuracy=`0.9724`, mean separation=`1.3017`.
- Strongest morphology families: `f:1`: separation ratio `3.6294`, kNN accuracy `0.9914`, nearest competitor `h:2`; `e:1`: separation ratio `2.7335`, kNN accuracy `0.9963`, nearest competitor `h:2`; `j:1`: separation ratio `1.8927`, kNN accuracy `0.9432`, nearest competitor `n:1`.
- Most confusable morphology families: `n:1`: separation ratio `0.6605`, kNN accuracy `0.7121`, nearest competitor `d:1`; `d:1`: separation ratio `0.7221`, kNN accuracy `0.9465`, nearest competitor `g:1`; `b:1`: separation ratio `0.7489`, kNN accuracy `0.9551`, nearest competitor `g:1`.
- Cross-folio validation statuses: perfect:110, survives:47, weak:17.
- Branch audit `has_prior:g:1`: dominant `e:1` = `228/242` (0.9421), distribution e:1:228 c:2:10 a:1:3 c:1:1.

## Exceptions To Inspect

### e:1 final without prior g:1

No exceptions.

### f:1 medial without next i:1

| Image | Molecule | Particle | Atom | Signature |
| --- | --- | --- | ---: | --- |
| `page-003.jpg` | `img3-m82` | `img3-m82-p5` | 2413 | `k:1 f:1 j:1` |
| `page-094.jpg` | `img94-m42` | `img94-m42-p3` | 4253 | `l:1 f:1 j:1 d:1` |
| `page-094.jpg` | `img94-m58` | `img94-m58-p3` | 4560 | `k:1 f:1 j:1 d:1` |

### m:1 medial without next c:1

| Image | Molecule | Particle | Atom | Signature |
| --- | --- | --- | ---: | --- |
| `page-094.jpg` | `img94-m20` | `img94-m20-p2` | 3058 | `a:1 m:1 c:2 a:1` |

## Data Quality Notes

- This export compares complete EVA pages against the complete currently labeled DatasetCreator pages.
- The contaminated paint batch was removed before this export.
- The paint mode frontend stores a label snapshot per stroke, so a heterogeneous row should not collapse into the last active atom label.
- `export-datasetcreator-atoms.js` uses DatasetCreator row guides plus backend-style overflow rows when guides exist.
- Real rare structures remain in the dataset; only confirmed labeling errors should be corrected upstream.

## Source Files

- `cases/combined-f1r-f1v-f47v-full-current/role-entropy.md`
- `cases/combined-f1r-f1v-f47v-full-current/contextual-rule-discovery.md`
- `cases/combined-f1r-f1v-f47v-full-current/contextual-rule-discovery-molecule-scope.md`
- `cases/combined-f1r-f1v-f47v-full-current/molecule-neighbor-discovery.md`
- `cases/combined-f1r-f1v-f47v-full-current/line-alignment-audit.md`
- `cases/combined-f1r-f1v-f47v-full-current/search-space-audit.md`
- `cases/combined-f1r-f1v-f47v-full-current/conditional-entropy.md`
- `cases/combined-f1r-f1v-f47v-full-current/variant-ablation.md`
- `cases/combined-f1r-f1v-f47v-full-current/macro-lexeme-analysis.md`
- `cases/combined-f1r-f1v-f47v-full-current/morphology-family-analysis.md`
- `cases/combined-f1r-f1v-f47v-full-current/cross-folio-validation.md`
- `cases/combined-f1r-f1v-f47v-full-current/e1-final-branch-audit.md`
- `cases/combined-f1r-f1v-f47v-full-current/labeling-anomaly-audit.md`
- `cases/combined-f1r-f1v-f47v-full-current/labeling-anomaly-known.tsv`
- `cases/combined-f1r-f1v-f47v-full-current/atom-symbols.md`

---

# Combined Role Entropy

Source: `cases\combined-f1r-f1v-f47v-full-current\role-entropy.md`

== eva role entropy ==
units: 385
symbols: 1470
vocabulary: 25
weighted_entropy_bits: 0.7821
weighted_relative_entropy_0_to_1: 0.4934
zero_entropy_symbols: 7
rigid_symbols_95pct: 7
most_positionally_chaotic:
  s: H=1.4958 rel=0.9438 n=32 initial=14 medial=6 final=14 dominant=final:0.4118
  ?: H=1.2955 rel=0.8173 n=10 initial=3 medial=6 final=1 dominant=medial:0.6000
  o: H=1.2224 rel=0.7712 n=233 initial=49 medial=158 final=28 dominant=medial:0.6723
  d: H=1.2054 rel=0.7605 n=125 initial=71 medial=49 final=6 dominant=initial:0.5635
  k: H=1.1696 rel=0.7380 n=63 initial=29 medial=32 final=2 dominant=medial:0.5079
  c: H=1.0000 rel=0.6309 n=4 initial=2 medial=2 final=0 dominant=initial:0.5000
  l: H=0.9604 rel=0.6059 n=88 initial=4 medial=17 final=67 dominant=final:0.7614
  ch: H=0.9491 rel=0.5988 n=125 initial=79 medial=46 final=0 dominant=initial:0.6320
  sh: H=0.9369 rel=0.5911 n=64 initial=47 medial=17 final=1 dominant=initial:0.7231
  r: H=0.9123 rel=0.5756 n=69 initial=3 medial=12 final=54 dominant=final:0.7826
  ckh: H=0.7642 rel=0.4822 n=9 initial=7 medial=2 final=0 dominant=initial:0.7778
  t: H=0.7611 rel=0.4802 n=46 initial=7 medial=38 final=1 dominant=medial:0.8261
most_positionally_rigid:
  i: H=0.0000 rel=0.0000 n=116 initial=0 medial=116 final=0 dominant=medial:1.0000
  n: H=0.0000 rel=0.0000 n=62 initial=0 medial=0 final=62 dominant=final:1.0000
  ee: H=0.0000 rel=0.0000 n=19 initial=0 medial=19 final=0 dominant=medial:1.0000
  cph: H=0.0000 rel=0.0000 n=11 initial=11 medial=0 final=0 dominant=initial:1.0000
  cfh: H=0.0000 rel=0.0000 n=4 initial=4 medial=0 final=0 dominant=initial:1.0000
  m: H=0.0000 rel=0.0000 n=3 initial=0 medial=0 final=3 dominant=final:1.0000
  f: H=0.0000 rel=0.0000 n=2 initial=2 medial=0 final=0 dominant=initial:1.0000
  a: H=0.3493 rel=0.2204 n=133 initial=4 medial=126 final=3 dominant=medial:0.9474
  e: H=0.3712 rel=0.2342 n=56 initial=0 medial=52 final=4 dominant=medial:0.9286
  p: H=0.5436 rel=0.3430 n=8 initial=7 medial=1 final=0 dominant=initial:0.8750
  cth: H=0.6194 rel=0.3908 n=26 initial=22 medial=4 final=0 dominant=initial:0.8462
  qo: H=0.7219 rel=0.4555 n=4 initial=4 medial=0 final=1 dominant=initial:0.8000

== atoms role entropy ==
units: 370
symbols: 3621
vocabulary: 16
weighted_entropy_bits: 0.5334
weighted_relative_entropy_0_to_1: 0.3366
zero_entropy_symbols: 5
rigid_symbols_95pct: 7
most_positionally_chaotic:
  d:1: H=0.9319 rel=0.5880 n=187 initial=0 medial=65 final=122 dominant=final:0.6524
  j:1: H=0.8454 rel=0.5334 n=88 initial=0 medial=24 final=64 dominant=final:0.7273
  n:1: H=0.8454 rel=0.5334 n=66 initial=48 medial=18 final=0 dominant=initial:0.7273
  e:1: H=0.8024 rel=0.5062 n=1069 initial=228 medial=834 final=7 dominant=medial:0.7802
  c:1: H=0.7437 rel=0.4692 n=524 initial=52 medial=446 final=26 dominant=medial:0.8511
  h:1: H=0.5917 rel=0.3733 n=161 initial=0 medial=23 final=138 dominant=final:0.8571
  a:1: H=0.5841 rel=0.3685 n=341 initial=39 medial=299 final=3 dominant=medial:0.8768
  c:2: H=0.3298 rel=0.2081 n=33 initial=2 medial=31 final=0 dominant=medial:0.9394
  h:2: H=0.3095 rel=0.1953 n=126 initial=0 medial=119 final=7 dominant=medial:0.9444
  i:1: H=0.0945 rel=0.0597 n=165 initial=0 medial=163 final=2 dominant=medial:0.9879
  f:1: H=0.0568 rel=0.0358 n=348 initial=1 medial=346 final=1 dominant=medial:0.9943
  g:1: H=0.0000 rel=0.0000 n=245 initial=0 medial=245 final=0 dominant=medial:1.0000
most_positionally_rigid:
  g:1: H=0.0000 rel=0.0000 n=245 initial=0 medial=245 final=0 dominant=medial:1.0000
  b:1: H=0.0000 rel=0.0000 n=156 initial=0 medial=156 final=0 dominant=medial:1.0000
  k:1: H=0.0000 rel=0.0000 n=47 initial=0 medial=47 final=0 dominant=medial:1.0000
  m:1: H=0.0000 rel=0.0000 n=41 initial=0 medial=41 final=0 dominant=medial:1.0000
  l:1: H=0.0000 rel=0.0000 n=24 initial=0 medial=24 final=0 dominant=medial:1.0000
  f:1: H=0.0568 rel=0.0358 n=348 initial=1 medial=346 final=1 dominant=medial:0.9943
  i:1: H=0.0945 rel=0.0597 n=165 initial=0 medial=163 final=2 dominant=medial:0.9879
  h:2: H=0.3095 rel=0.1953 n=126 initial=0 medial=119 final=7 dominant=medial:0.9444
  c:2: H=0.3298 rel=0.2081 n=33 initial=2 medial=31 final=0 dominant=medial:0.9394
  a:1: H=0.5841 rel=0.3685 n=341 initial=39 medial=299 final=3 dominant=medial:0.8768
  h:1: H=0.5917 rel=0.3733 n=161 initial=0 medial=23 final=138 dominant=final:0.8571
  c:1: H=0.7437 rel=0.4692 n=524 initial=52 medial=446 final=26 dominant=medial:0.8511

---

# Line Alignment Audit

Source: `cases\combined-f1r-f1v-f47v-full-current\line-alignment-audit.md`

Case: `cases\combined-f1r-f1v-f47v-full-current`

This audit checks whether EVA lines and DatasetCreator physical rows can be compared ordinally. It does not force alignment; it reports mismatches.

## Summary

| Image | EVA lines | Physical rows | Status |
| --- | ---: | ---: | --- |
| `page-003.jpg` | 24 | 24 | line-count-match |
| `page-004.jpg` | 10 | 10 | line-count-match |
| `page-094.jpg` | 14 | 14 | line-count-match |

## Row Detail

| Image | Ordinal | Status | EVA line | EVA tokens | Physical row | Physical units | Physical y-range | Units | Note |
| --- | ---: | --- | --- | ---: | --- | ---: | --- | --- | --- |
| `page-003.jpg` | 1 | paired-by-ordinal | `f1r.1` | 10 | R1 | 9 | 362-597 | p003-u001..p003-u009 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 2 | paired-by-ordinal | `f1r.2` | 11 | R2 | 9 | 560-704 | p003-u010..p003-u018 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 3 | paired-by-ordinal | `f1r.3` | 9 | R3 | 10 | 647-768 | p003-u019..p003-u028 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 4 | paired-by-ordinal | `f1r.4` | 9 | R4 | 8 | 730-875 | p003-u029..p003-u036 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 5 | paired-by-ordinal | `f1r.5` | 7 | R5 | 6 | 822-963 | p003-u037..p003-u042 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 6 | paired-by-ordinal | `f1r.7` | 10 | R6 | 7 | 972-1139 | p003-u043..p003-u049 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 7 | paired-by-ordinal | `f1r.8` | 9 | R7 | 9 | 1114-1235 | p003-u050..p003-u058 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 8 | paired-by-ordinal | `f1r.9` | 7 | R8 | 7 | 1191-1318 | p003-u059..p003-u065 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 9 | paired-by-ordinal | `f1r.11` | 8 | R9 | 7 | 1401-1580 | p003-u066..p003-u072 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 10 | paired-by-ordinal | `f1r.12` | 8 | R10 | 10 | 1539-1759 | p003-u073..p003-u082 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 11 | paired-by-ordinal | `f1r.13` | 9 | R11 | 6 | 1638-1748 | p003-u083..p003-u088 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 12 | paired-by-ordinal | `f1r.14` | 10 | R12 | 10 | 1721-1839 | p003-u089..p003-u098 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 13 | paired-by-ordinal | `f1r.15` | 10 | R13 | 10 | 1804-1905 | p003-u099..p003-u108 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 14 | paired-by-ordinal | `f1r.16` | 9 | R14 | 9 | 1887-1986 | p003-u109..p003-u117 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 15 | paired-by-ordinal | `f1r.17` | 8 | R15 | 8 | 1953-2075 | p003-u118..p003-u125 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 16 | paired-by-ordinal | `f1r.18` | 8 | R16 | 8 | 2033-2167 | p003-u126..p003-u133 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 17 | paired-by-ordinal | `f1r.19` | 8 | R17 | 6 | 2117-2243 | p003-u134..p003-u139 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 18 | paired-by-ordinal | `f1r.20` | 7 | R18 | 7 | 2208-2337 | p003-u140..p003-u146 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 19 | paired-by-ordinal | `f1r.22` | 10 | R19 | 9 | 2350-2618 | p003-u147..p003-u155 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 20 | paired-by-ordinal | `f1r.23` | 10 | R20 | 10 | 2568-2700 | p003-u156..p003-u165 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 21 | paired-by-ordinal | `f1r.24` | 9 | R21 | 9 | 2649-2785 | p003-u166..p003-u174 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 22 | paired-by-ordinal | `f1r.25` | 9 | R22 | 8 | 2730-2867 | p003-u175..p003-u182 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 23 | paired-by-ordinal | `f1r.26` | 9 | R23 | 9 | 2822-2971 | p003-u183..p003-u191 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 24 | paired-by-ordinal | `f1r.27` | 6 | R24 | 6 | 2913-3048 | p003-u192..p003-u197 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 1 | paired-by-ordinal | `f1v.1` | 7 | R1 | 7 | 1808-2071 | p004-u001..p004-u007 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 2 | paired-by-ordinal | `f1v.2` | 8 | R2 | 8 | 1935-2134 | p004-u008..p004-u015 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 3 | paired-by-ordinal | `f1v.3` | 9 | R3 | 8 | 2014-2208 | p004-u016..p004-u023 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 4 | paired-by-ordinal | `f1v.4` | 6 | R4 | 7 | 2084-2248 | p004-u024..p004-u030 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 5 | paired-by-ordinal | `f1v.5` | 9 | R5 | 9 | 2190-2465 | p004-u031..p004-u039 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 6 | paired-by-ordinal | `f1v.6` | 10 | R6 | 11 | 2369-2554 | p004-u040..p004-u050 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 7 | paired-by-ordinal | `f1v.7` | 12 | R7 | 11 | 2475-2607 | p004-u051..p004-u061 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 8 | paired-by-ordinal | `f1v.8` | 11 | R8 | 11 | 2514-2677 | p004-u062..p004-u072 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 9 | paired-by-ordinal | `f1v.9` | 11 | R9 | 11 | 2610-2761 | p004-u073..p004-u083 | ordinal pair only; not visual proof of exact alignment |
| `page-004.jpg` | 10 | paired-by-ordinal | `f1v.10` | 7 | R10 | 7 | 2685-2833 | p004-u084..p004-u090 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 1 | paired-by-ordinal | `f47v.1` | 6 | R1 | 7 | 392-686 | p094-u001..p094-u007 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 2 | paired-by-ordinal | `f47v.2` | 7 | R2 | 6 | 592-727 | p094-u008..p094-u013 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 3 | paired-by-ordinal | `f47v.3` | 7 | R3 | 7 | 680-806 | p094-u014..p094-u020 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 4 | paired-by-ordinal | `f47v.4` | 7 | R4 | 7 | 760-901 | p094-u021..p094-u027 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 5 | paired-by-ordinal | `f47v.5` | 7 | R5 | 7 | 858-993 | p094-u028..p094-u034 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 6 | paired-by-ordinal | `f47v.6` | 5 | R6 | 5 | 948-1044 | p094-u035..p094-u039 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 7 | paired-by-ordinal | `f47v.7` | 3 | R7 | 3 | 2383-2513 | p094-u040..p094-u042 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 8 | paired-by-ordinal | `f47v.8` | 4 | R8 | 5 | 2510-2599 | p094-u043..p094-u047 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 9 | paired-by-ordinal | `f47v.9` | 5 | R9 | 8 | 2576-2722 | p094-u048..p094-u055 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 10 | paired-by-ordinal | `f47v.10` | 9 | R10 | 6 | 2652-2803 | p094-u056..p094-u061 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 11 | paired-by-ordinal | `f47v.11` | 9 | R11 | 8 | 2728-2883 | p094-u062..p094-u069 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 12 | paired-by-ordinal | `f47v.12` | 8 | R12 | 7 | 2812-2949 | p094-u070..p094-u076 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 13 | paired-by-ordinal | `f47v.13` | 6 | R13 | 5 | 2890-3059 | p094-u077..p094-u081 | ordinal pair only; not visual proof of exact alignment |
| `page-094.jpg` | 14 | paired-by-ordinal | `f47v.14` | 2 | R14 | 2 | 3024-3136 | p094-u082..p094-u083 | ordinal pair only; not visual proof of exact alignment |

## Reading

- Global EVA-vs-ATOMS entropy remains valid as a corpus-level comparison.
- Line-level comparison is valid only for images where EVA line count and physical row count match, or after an explicit manual mapping table is created.
- Combined cases must never group by `row_index` alone because row numbers restart per image. Use `image_name + row_index`.

---

# Atom Symbols

Source: `cases\combined-f1r-f1v-f47v-full-current\atom-symbols.md`

Units: 370
Vocabulary: 16
Total atom tokens: 3621

| Symbol | Count |
| --- | ---: |
| `a:1` | 341 |
| `b:1` | 156 |
| `c:1` | 524 |
| `c:2` | 33 |
| `d:1` | 187 |
| `e:1` | 1069 |
| `f:1` | 348 |
| `g:1` | 245 |
| `h:1` | 161 |
| `h:2` | 126 |
| `i:1` | 165 |
| `j:1` | 88 |
| `k:1` | 47 |
| `l:1` | 24 |
| `m:1` | 41 |
| `n:1` | 66 |

---

# Particle Rule Discovery

Source: `cases\combined-f1r-f1v-f47v-full-current\contextual-rule-discovery.md`

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

---

# Molecule Rule Discovery

Source: `cases\combined-f1r-f1v-f47v-full-current\contextual-rule-discovery-molecule-scope.md`

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

---

# Molecule Neighbor Discovery

Source: `cases\combined-f1r-f1v-f47v-full-current\molecule-neighbor-discovery.md`

## Scope

- Molecules: `370`
- Neighbor rows: `370`
- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`

This report studies molecule-to-molecule adjacency inside each exported program row.

## Current last atom -> next first atom

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `last_token=a:1` | `e:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |
| `last_token=h:2` | `e:1` | 3 | 3 | 1.0000 | img3-m24->img3-m19, img3-m122->img3-m120, img94-m35->img94-m37 |

## Current first atom -> previous last atom

No strong findings under current thresholds.

## Current suffix2 -> next prefix2

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `suffix2=c:1 a:1` | `e:1 g:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |

---

# Search Space Audit

Source: `cases\combined-f1r-f1v-f47v-full-current\search-space-audit.md`

## Purpose

This report estimates how many contextual hypotheses are examined before strong candidates are reported. It is a guardrail against reading the strongest rows as if they were hand-picked in advance.

## Current Thresholds

- Candidate if share >= `0.8` or absolute delta >= `0.45`.
- Context tests: `has_prior`, `has_after`, `starts_with`, `ends_with`, `prev_is`, `next_is`.

## Search Space

| Scope | Atoms | Groups | Vocabulary | Observed symbol-role cells | Tests | Raw hypotheses | Reported candidates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `particle` | 3621 | 1416 | 16 | 36 | 6 | 3240 | 159 |
| `molecule` | 3621 | 370 | 16 | 31 | 6 | 2790 | 176 |

## Interpretation Rules

- A strong candidate is not automatically grammar; it is a rule worth validating.
- Perfect or near-perfect rows are most persuasive when they survive on folios not used to discover or tune the category.
- Counts should be interpreted with the search space in mind, especially when many symbol-role-test-token combinations are examined.
- Future preregistered runs should freeze the atom inventory, thresholds, corpus split, and accepted tests before new pages are labeled.

---

# Conditional Entropy

Source: `cases\combined-f1r-f1v-f47v-full-current\conditional-entropy.md`

## Scope

- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`
- Token mode: `full`
- Molecules: `370`
- Atom occurrences with adjacency rows: `3621`

## Summary

- Weighted next-token entropy: `1.9007` bits.
- Weighted previous-token entropy: `1.6449` bits.

## Lowest Next-Token Entropy

| Condition token | Total | H | Dominant | Share | Alternatives |
| --- | ---: | ---: | --- | ---: | --- |
| `g:1` | 245 | 0.0000 | `e:1` | 1.0000 | e:1:245 |
| `l:1` | 24 | 0.0000 | `f:1` | 1.0000 | f:1:24 |
| `m:1` | 41 | 0.1654 | `c:1` | 0.9756 | c:1:40 c:2:1 |
| `i:1` | 163 | 0.1861 | `d:1` | 0.9755 | d:1:159 c:1:3 c:2:1 |
| `k:1` | 47 | 0.2539 | `f:1` | 0.9574 | f:1:45 e:1:2 |
| `n:1` | 66 | 0.3790 | `e:1` | 0.9394 | e:1:62 c:2:3 c:1:1 |
| `b:1` | 156 | 0.7152 | `c:1` | 0.8333 | c:1:130 d:1:24 a:1:2 |
| `h:2` | 119 | 1.0543 | `e:1` | 0.8067 | e:1:96 c:1:13 n:1:4 f:1:3 c:2:2 a:1:1 |
| `h:1` | 23 | 1.2088 | `e:1` | 0.5217 | e:1:12 a:1:10 n:1:1 |
| `d:1` | 65 | 1.7197 | `e:1` | 0.5846 | e:1:38 g:1:15 c:1:7 n:1:2 f:1:1 k:1:1 l:1:1 |
| `c:2` | 33 | 1.8208 | `g:1` | 0.4545 | g:1:15 h:2:12 e:1:3 a:1:1 b:1:1 c:2:1 |
| `j:1` | 24 | 1.9029 | `e:1` | 0.5417 | e:1:13 a:1:3 c:1:3 d:1:3 n:1:2 |
| `c:1` | 498 | 2.0069 | `a:1` | 0.4317 | a:1:215 h:2:114 f:1:93 e:1:66 h:1:3 g:1:2 k:1:2 n:1:2 c:1:1 |
| `f:1` | 347 | 2.2457 | `i:1` | 0.3833 | i:1:133 j:1:88 f:1:54 k:1:42 l:1:21 e:1:4 c:1:3 a:1:1 n:1:1 |
| `a:1` | 338 | 2.3530 | `e:1` | 0.3343 | e:1:113 b:1:104 m:1:41 g:1:33 c:1:29 c:2:11 n:1:5 d:1:1 f:1:1 |
| `e:1` | 1062 | 2.8707 | `c:1` | 0.2279 | c:1:242 e:1:187 g:1:180 h:1:158 f:1:126 a:1:69 b:1:51 i:1:32 c:2:12 k:1:2 l:1:2 n:1:1 |

## Lowest Previous-Token Entropy

| Condition token | Total | H | Dominant | Share | Alternatives |
| --- | ---: | ---: | --- | ---: | --- |
| `j:1` | 88 | 0.0000 | `f:1` | 1.0000 | f:1:88 |
| `m:1` | 41 | 0.0000 | `a:1` | 1.0000 | a:1:41 |
| `h:1` | 161 | 0.1337 | `e:1` | 0.9814 | e:1:158 c:1:3 |
| `h:2` | 126 | 0.4537 | `c:1` | 0.9048 | c:1:114 c:2:12 |
| `k:1` | 47 | 0.6508 | `f:1` | 0.8936 | f:1:42 c:1:2 e:1:2 d:1:1 |
| `l:1` | 24 | 0.6584 | `f:1` | 0.8750 | f:1:21 e:1:2 d:1:1 |
| `i:1` | 165 | 0.7096 | `f:1` | 0.8061 | f:1:133 e:1:32 |
| `d:1` | 187 | 0.7151 | `i:1` | 0.8503 | i:1:159 b:1:24 j:1:3 a:1:1 |
| `b:1` | 156 | 0.9640 | `a:1` | 0.6667 | a:1:104 e:1:51 c:2:1 |
| `a:1` | 302 | 1.1943 | `c:1` | 0.7119 | c:1:215 e:1:69 h:1:10 j:1:3 b:1:2 c:2:1 f:1:1 h:2:1 |
| `g:1` | 245 | 1.2664 | `e:1` | 0.7347 | e:1:180 a:1:33 c:2:15 d:1:15 c:1:2 |
| `c:1` | 472 | 1.9652 | `e:1` | 0.5127 | e:1:242 b:1:130 m:1:40 a:1:29 h:2:13 d:1:7 f:1:3 i:1:3 j:1:3 c:1:1 n:1:1 |
| `c:2` | 31 | 2.1210 | `e:1` | 0.3871 | e:1:12 a:1:11 n:1:3 h:2:2 c:2:1 i:1:1 m:1:1 |
| `f:1` | 347 | 2.2141 | `e:1` | 0.3631 | e:1:126 c:1:93 f:1:54 k:1:45 l:1:24 h:2:3 a:1:1 d:1:1 |
| `n:1` | 18 | 2.7472 | `a:1` | 0.2778 | a:1:5 h:2:4 c:1:2 d:1:2 j:1:2 e:1:1 f:1:1 h:1:1 |
| `e:1` | 841 | 2.7814 | `g:1` | 0.2913 | g:1:245 e:1:187 a:1:113 h:2:96 c:1:66 n:1:62 d:1:38 j:1:13 h:1:12 f:1:4 c:2:3 k:1:2 |

## Role Entropy By Token

| Token | Total | H(role) | Dominant role | Dominant share | Roles |
| --- | ---: | ---: | --- | ---: | --- |
| `g:1` | 245 | 0.0000 | medial | 1.0000 | medial:245 |
| `b:1` | 156 | 0.0000 | medial | 1.0000 | medial:156 |
| `k:1` | 47 | 0.0000 | medial | 1.0000 | medial:47 |
| `m:1` | 41 | 0.0000 | medial | 1.0000 | medial:41 |
| `l:1` | 24 | 0.0000 | medial | 1.0000 | medial:24 |
| `f:1` | 348 | 0.0568 | medial | 0.9943 | medial:346 final:1 initial:1 |
| `i:1` | 165 | 0.0945 | medial | 0.9879 | medial:163 final:2 |
| `h:2` | 126 | 0.3095 | medial | 0.9444 | medial:119 final:7 |
| `c:2` | 33 | 0.3298 | medial | 0.9394 | medial:31 initial:2 |
| `a:1` | 341 | 0.5841 | medial | 0.8768 | medial:299 initial:39 final:3 |
| `h:1` | 161 | 0.5917 | final | 0.8571 | final:138 medial:23 |
| `c:1` | 524 | 0.7437 | medial | 0.8511 | medial:446 initial:52 final:26 |
| `e:1` | 1069 | 0.8024 | medial | 0.7802 | medial:834 initial:228 final:7 |
| `j:1` | 88 | 0.8454 | final | 0.7273 | final:64 medial:24 |
| `n:1` | 66 | 0.8454 | initial | 0.7273 | initial:48 medial:18 |
| `d:1` | 187 | 0.9319 | final | 0.6524 | final:122 medial:65 |

---

# Variant Ablation

Source: `cases\combined-f1r-f1v-f47v-full-current\variant-ablation.md`

## Scope

- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`
- Molecules: `370`

## Global Comparison

| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: |
| Full variants | 3621 | 16 | 0.5334 | 7 |
| Families merged | 3621 | 14 | 0.5764 | 7 |

Interpretation: negative `split_minus_merged` means variants reduce entropy versus merging the family; positive values mean the split is not helping positional stability yet.

## Variant Families

| Family | Variants | Tokens | H merged | H split weighted | Split - merged | Variant details |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `h` | 2 | 287 | 0.9999 | 0.4678 | -0.5321 | h:1:n161:H0.5917 h:2:n126:H0.3095 |
| `c` | 2 | 557 | 0.7243 | 0.7191 | -0.0052 | c:1:n524:H0.7437 c:2:n33:H0.3298 |

---

# Macro Lexeme Analysis

Source: `cases\combined-f1r-f1v-f47v-full-current\macro-lexeme-analysis.md`

## Hypothesis

Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.

## Scope

- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`
- Molecules / physical units: `370`
- Original atom vocabulary: `16`
- Macro vocabulary after merge: `12`
- Original unique molecule signatures: `254`
- Macro unique lexeme signatures: `248`

## Macro Vocabulary

| Macro Symbol | Source |
| --- | --- |
| `a:1` | `self` |
| `c:1` | `self` |
| `c:2` | `self` |
| `d:1` | `self` |
| `e:1` | `self` |
| `f:1` | `self` |
| `h:1` | `self` |
| `h:2` | `self` |
| `j:1` | `self` |
| `l:1` | `self` |
| `MEDIAL_OP` | `g:1`, `i:1`, `b:1`, `k:1`, `m:1` |
| `n:1` | `self` |

## Macro Role Entropy

| Symbol | Count | H(role) | Dominant | Share | Roles |
| --- | ---: | ---: | --- | ---: | --- |
| `l:1` | 24 | 0.0000 | medial | 1.0000 | medial:24 |
| `MEDIAL_OP` | 654 | 0.0299 | medial | 0.9969 | medial:652 final:2 |
| `f:1` | 348 | 0.0568 | medial | 0.9943 | medial:346 final:1 initial:1 |
| `h:2` | 126 | 0.3095 | medial | 0.9444 | medial:119 final:7 |
| `c:2` | 33 | 0.3298 | medial | 0.9394 | medial:31 initial:2 |
| `a:1` | 341 | 0.5841 | medial | 0.8768 | medial:299 initial:39 final:3 |
| `h:1` | 161 | 0.5917 | final | 0.8571 | final:138 medial:23 |
| `c:1` | 524 | 0.7437 | medial | 0.8511 | medial:446 initial:52 final:26 |
| `e:1` | 1069 | 0.8024 | medial | 0.7802 | medial:834 initial:228 final:7 |
| `j:1` | 88 | 0.8454 | final | 0.7273 | final:64 medial:24 |
| `n:1` | 66 | 0.8454 | initial | 0.7273 | initial:48 medial:18 |
| `d:1` | 187 | 0.9319 | final | 0.6524 | final:122 medial:65 |

## Top Macro Lexemes

| Count | Share | Macro Signature | Examples |
| ---: | ---: | --- | --- |
| 17 | 0.0459 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u091, p003-u105, p003-u106, p003-u110, p003-u150 |
| 10 | 0.0270 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u033, p003-u059, p003-u082, p003-u099, p003-u170 |
| 8 | 0.0216 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` | p003-u056, p003-u063, p003-u089, p003-u132, p003-u143 |
| 7 | 0.0189 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u096, p003-u155, p003-u160, p003-u163, p004-u035 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 c:1` | p003-u108, p003-u166, p003-u192, p004-u029, p094-u063 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u015, p004-u022, p004-u070, p004-u087, p094-u035 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u049, p094-u061, p094-u065, p094-u070, p094-u073 |
| 6 | 0.0162 | `n:1 e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u005, p003-u127, p004-u032, p004-u043, p004-u079 |
| 5 | 0.0135 | `c:1 f:1 MEDIAL_OP d:1` | p003-u022, p003-u035, p003-u064, p004-u010, p004-u074 |
| 4 | 0.0108 | `e:1 a:1 e:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u097, p003-u124, p004-u050, p094-u027 |
| 4 | 0.0108 | `e:1 c:1 h:2 c:1 f:1 j:1` | p004-u024, p004-u045, p004-u055, p004-u058 |
| 4 | 0.0108 | `e:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u102, p004-u005, p004-u009, p094-u015 |
| 4 | 0.0108 | `n:1 e:1 MEDIAL_OP e:1 c:1` | p003-u087, p003-u109, p003-u116, p094-u024 |
| 4 | 0.0108 | `n:1 e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p003-u051, p003-u062, p003-u184, p004-u083 |
| 3 | 0.0081 | `a:1 MEDIAL_OP c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u013, p004-u030, p004-u037 |
| 3 | 0.0081 | `a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u104, p004-u064, p094-u023 |
| 3 | 0.0081 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u179, p003-u187, p094-u010 |
| 3 | 0.0081 | `c:1 f:1 j:1` | p004-u003, p004-u052, p004-u063 |
| 3 | 0.0081 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u084, p003-u144, p004-u056 |
| 3 | 0.0081 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u011, p003-u017, p003-u165 |
| 3 | 0.0081 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | p003-u190, p004-u023, p004-u086 |
| 3 | 0.0081 | `e:1 c:1 h:2 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u094, p094-u059, p094-u064 |
| 3 | 0.0081 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` | p003-u057, p003-u141, p094-u030 |
| 3 | 0.0081 | `e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u142, p004-u036, p004-u046 |
| 3 | 0.0081 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u103, p003-u152, p003-u164 |
| 3 | 0.0081 | `n:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u018, p094-u009, p094-u032 |
| 2 | 0.0054 | `a:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u188, p003-u189 |
| 2 | 0.0054 | `c:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u030, p094-u062 |
| 2 | 0.0054 | `c:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u169, p004-u075 |
| 2 | 0.0054 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u034, p003-u167 |
| 2 | 0.0054 | `c:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u118, p004-u011 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP d:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u040, p004-u006 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p004-u042, p004-u069 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u186, p004-u020 |
| 2 | 0.0054 | `e:1 c:1 h:2 c:1 f:1 MEDIAL_OP d:1` | p003-u114, p094-u017 |
| 2 | 0.0054 | `e:1 h:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p004-u057, p004-u060 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 f:1 f:1 j:1` | p094-u006, p094-u047 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 f:1 f:1 MEDIAL_OP d:1 e:1 h:1` | p094-u007, p094-u034 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 h:1` | p003-u019, p003-u028 |
| 2 | 0.0054 | `e:1 MEDIAL_OP e:1 c:1 a:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p003-u195, p004-u040 |

## Interpretation

- This is a hypothesis test, not a destructive relabeling.
- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.
- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.

---

# Morphology Family Analysis

Source: `cases\combined-f1r-f1v-f47v-full-current\morphology-family-analysis.md`

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

---

# Cross-Folio Validation

Source: `cases\combined-f1r-f1v-f47v-full-current\cross-folio-validation.md`

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Context scope: `particle`
- Discovery rules tested: `58`
- Rule filter: total >= `10`, share >= `0.9`

## Validation Matrix

| Rule | Discovery | Image | Count | Total | Share | Status | Exceptions/examples |
| --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| `d:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_after `g:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial next_is `g:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` final has_prior `i:1` | 0.9298 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m149/img3-m149-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m166/img3-m166-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m149/img3-m149-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m166/img3-m166-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-003.jpg` | 40 | 43 | 0.9302 | survives | img3-m122/img3-m122-p2:e:1 h:1 e:1 c:1 h:2; img3-m45/img3-m45-p2:e:1 h:1 e:1 c:1 h:2; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9138 | `page-003.jpg` | 39 | 43 | 0.9070 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1; img3-m85/img3-m85-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `f:1` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-003.jpg` | 85 | 86 | 0.9884 | survives | img3-m121/img3-m121-p2:e:1 l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9706 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9559 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9559 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `a:1` final has_prior `c:1` | 0.9902 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9902 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9823 | `page-003.jpg` | 59 | 59 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-003.jpg` | 85 | 87 | 0.9770 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-003.jpg` | 84 | 87 | 0.9655 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-003.jpg` | 76 | 77 | 0.9870 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9811 | `page-003.jpg` | 76 | 77 | 0.9870 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9686 | `page-003.jpg` | 75 | 77 | 0.9740 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9048 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9756 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `a:1` | 0.9024 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-003.jpg` | 126 | 129 | 0.9767 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m151/img3-m151-p2:c:2 g:1 e:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m197/img3-m197-p2:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m151/img3-m151-p2:c:2 g:1 e:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m197/img3-m197-p2:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9773 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9773 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9318 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9318 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9298 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9138 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9706 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9559 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9559 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9902 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9902 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9823 | `page-004.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9811 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9686 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9048 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9756 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `a:1` | 0.9024 | `page-004.jpg` | 11 | 12 | 0.9167 | survives | img4-m49/img4-m49-p1:a:1 m:1 c:1 |
| `g:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9773 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9773 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9298 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9138 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `f:1` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9706 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9559 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `f:1` medial next_is `i:1` | 0.9559 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `a:1` final has_prior `c:1` | 0.9902 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` final prev_is `c:1` | 0.9902 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` initial has_after `c:1` | 0.9823 | `page-094.jpg` | 23 | 25 | 0.9200 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1; img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final prev_is `e:1` | 0.9811 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final starts_with `e:1` | 0.9686 | `page-094.jpg` | 45 | 46 | 0.9783 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9048 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial next_is `c:1` | 0.9756 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial has_after `a:1` | 0.9024 | `page-094.jpg` | 11 | 14 | 0.7857 | weak | img94-m24/img94-m24-p1:a:1 m:1 c:1; img94-m25/img94-m25-p1:a:1 m:1 c:1; img94-m53/img94-m53-p1:a:1 m:1 c:1 |
| `g:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9773 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial next_is `f:1` | 0.9773 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `d:1` | 0.9318 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `i:1` | 0.9318 | `page-094.jpg` | 7 | 9 | 0.7778 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |

Statuses:

- `perfect`: every observed case in that image passes.
- `survives`: observed share remains above the threshold.
- `weak`: observed but below threshold.
- `not_observed`: no matching role occurrence in that image yet.

---

# e:1 Final Branch Audit

Source: `cases\combined-f1r-f1v-f47v-full-current\e1-final-branch-audit.md`

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Context scope: `particle`
- Target: `e:1` as `final`
- Split: `has_prior g:1`
- Measure: `starts_with`
- Occurrences: `242`

## Branch Summary

| Branch | Total | Dominant measured value | Count | Share | Distribution |
| --- | ---: | --- | ---: | ---: | --- |
| `has_prior:g:1` | 242 | `e:1` | 228 | 0.9421 | e:1:228 c:2:10 a:1:3 c:1:1 |

## Examples

### has_prior:g:1

- `page-003.jpg` / `img3-m1` / `img3-m1-p5` / atom 994: `e:1 g:1 e:1`
- `page-003.jpg` / `img3-m10` / `img3-m10-p1` / atom 1217: `e:1 a:1 m:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m100` / `img3-m100-p1` / atom 3156: `e:1 a:1 b:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m103` / `img3-m103-p2` / atom 3150: `e:1 g:1 e:1`
- `page-003.jpg` / `img3-m103` / `img3-m103-p3` / atom 3152: `e:1 a:1 b:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m104` / `img3-m104-p1` / atom 3165: `e:1 g:1 e:1`

---

# e:1 Final Exceptions

Source: `cases\combined-f1r-f1v-f47v-full-current\exceptions-e1-final-without-prior-g1.md`

## Scope

- Rule: `e:1` as `final` where `has_prior` `g:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Matching role occurrences: `242`
- Passing: `242`
- Exceptions: `0`

## Exceptions

No rows.

---

# f:1 Medial Exceptions

Source: `cases\combined-f1r-f1v-f47v-full-current\exceptions-f1-medial-without-next-i1.md`

## Scope

- Rule: `f:1` as `medial` where `next_is` `i:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Matching role occurrences: `68`
- Passing: `65`
- Exceptions: `3`

## Exceptions

| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |
| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |
| page-003.jpg | img3-m82 | img3-m82-p5 | 2413 | medial | 2/3 | k:1 | k:1 | j:1 | `k:1 f:1 j:1` |
| page-094.jpg | img94-m42 | img94-m42-p3 | 4253 | medial | 2/4 | l:1 | l:1 | j:1 | `l:1 f:1 j:1 d:1` |
| page-094.jpg | img94-m58 | img94-m58-p3 | 4560 | medial | 2/4 | k:1 | k:1 | j:1 | `k:1 f:1 j:1 d:1` |

---

# m:1 Medial Exceptions

Source: `cases\combined-f1r-f1v-f47v-full-current\exceptions-m1-medial-without-next-c1.md`

## Scope

- Rule: `m:1` as `medial` where `next_is` `c:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Matching role occurrences: `41`
- Passing: `40`
- Exceptions: `1`

## Exceptions

| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |
| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |
| page-094.jpg | img94-m20 | img94-m20-p2 | 3058 | medial | 2/4 | a:1 | a:1 | c:2 | `a:1 m:1 c:2 a:1` |

---

# Labeling Anomaly Audit

Source: `cases\combined-f1r-f1v-f47v-full-current\labeling-anomaly-audit.md`

Purpose: find likely human labeling/order mistakes before using the data for stronger metrics.

This is not an automatic correction list. It only flags cases where the current corpus has a dominant ordering pattern and a rare variant with the same atom inventory.

## Parameters

- Images: page-003.jpg, page-004.jpg, page-094.jpg
- Minimum support per inventory: 4
- Max rare count: 2
- Max rare ratio: 0.18
- Learned-pattern memory included: no
- Known anomalies list: `cases\known-labeling-anomalies.tsv`

## Summary

- Candidates: 0
- High priority: 0
- Medium priority: 0
- Known anomalies suppressed from pending list: 3
- Scopes: particle order and molecule particle-order

## Top Candidates

No strong candidates found with current thresholds.


Full table: `labeling-anomaly-audit.tsv`

Known anomalies table: `labeling-anomaly-known.tsv`
