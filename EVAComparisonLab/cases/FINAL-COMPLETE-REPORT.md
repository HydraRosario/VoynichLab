# VoynichLab EVA Comparison Complete Report

Generated from the current DatasetCreator database export.

This is the single-file report. It embeds the current compressed report plus the full generated markdown reports for entropy, rules, pattern searches, morphology, exceptions, anomaly audit, and visual snapshot inventory.

## Output Inventory

- Combined case directory: `cases\combined-f1r-f1v-f2r-f47v-full-current`
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
- f1r physical atom units: `196`.
- f1r DatasetCreator/exported rows: `24`.
- New f1v case: full `f1v` page from IVTFF, mapped to `page-004.jpg`.
- f1v EVA lines: `10`.
- f1v EVA tokens: `90`.
- f1v physical atom units: `90`.
- f1v DatasetCreator/exported rows: `10`.
- New f2r case: full `f2r` page from IVTFF, mapped to `page-005.jpg`.
- f2r EVA lines: `13`.
- f2r EVA tokens: `99`.
- f2r physical atom units: `104`.
- f2r DatasetCreator/exported rows: `13`.
- Combined case: full `f1r` page + full `f1v` page + full `f2r` page + full `f47v` page.
- Combined EVA lines: `61`.
- Combined EVA tokens: `484`.
- Combined physical atom units: `473`.

Note: stored DatasetCreator row guides are not always the full computed row set. The export mirrors the backend behavior by adding overflow rows for particles outside stored guide bands, so the lab rows match the program inspector.

f1r exported row distribution: `R1=9`, `R2=9`, `R3=10`, `R4=8`, `R5=6`, `R6=7`, `R7=9`, `R8=7`, `R9=7`, `R10=10`, `R11=6`, `R12=10`, `R13=10`, `R14=9`, `R15=8`, `R16=8`, `R17=6`, `R18=7`, `R19=8`, `R20=10`, `R21=9`, `R22=8`, `R23=9`, `R24=6`.
f1v exported row distribution: `R1=7`, `R2=8`, `R3=8`, `R4=7`, `R5=9`, `R6=11`, `R7=11`, `R8=11`, `R9=11`, `R10=7`.
f2r exported row distribution: `R1=8`, `R2=6`, `R3=6`, `R4=6`, `R5=8`, `R6=8`, `R7=5`, `R8=11`, `R9=12`, `R10=10`, `R11=9`, `R12=10`, `R13=5`.

Alignment note: f1r currently has `210` EVA tokens and `196` physical atom units. That mismatch is preserved as evidence and should not be silently normalized.

Alignment note: f2r currently has `99` EVA tokens and `104` physical atom units. That mismatch is preserved as evidence and should not be silently normalized.

## Line Alignment Audit

- `page-003.jpg`: EVA lines=`24`, physical rows=`24`, status=`line-count-match`.
- `page-004.jpg`: EVA lines=`10`, physical rows=`10`, status=`line-count-match`.
- `page-005.jpg`: EVA lines=`13`, physical rows=`13`, status=`line-count-match`.
- `page-094.jpg`: EVA lines=`14`, physical rows=`14`, status=`line-count-match`.
- Corpus-level entropy comparison remains usable; strict line-by-line comparison is only valid where line counts match or after an explicit mapping table.

## Entropy Summary

### f1r Full Page

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 210 | 828 | 24 | 0.7669 | 0.4839 | 8 | 8 |
| ATOMS | 196 | 2065 | 16 | 0.5246 | 0.3310 | 7 | 8 |

### f1v Full Page

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 90 | 324 | 22 | 0.7182 | 0.4531 | 10 | 11 |
| ATOMS | 90 | 787 | 16 | 0.6038 | 0.3809 | 7 | 8 |

### f2r Full Page

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 99 | 383 | 21 | 0.7050 | 0.4448 | 9 | 10 |
| ATOMS | 104 | 936 | 16 | 0.6093 | 0.3844 | 6 | 7 |

### Combined f1r + f1v + f2r + f47v

| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| EVA | 484 | 1853 | 25 | 0.7864 | 0.4962 | 6 | 7 |
| ATOMS | 473 | 4557 | 16 | 0.5725 | 0.3612 | 4 | 8 |

## Atom Vocabulary

| Symbol | Count |
| --- | ---: |
| `a:1` | 419 |
| `b:1` | 191 |
| `c:1` | 642 |
| `c:2` | 34 |
| `d:1` | 248 |
| `e:1` | 1332 |
| `f:1` | 459 |
| `g:1` | 298 |
| `h:1` | 209 |
| `h:2` | 160 |
| `i:1` | 222 |
| `j:1` | 114 |
| `k:1` | 65 |
| `l:1` | 31 |
| `m:1` | 51 |
| `n:1` | 82 |

## Cleanup Audit

- New split symbol `n:1` appears `82` time(s) after replacing the former `j:2` shape.
- No retired `j:2`, `a:2`, or `g:2` symbols remain in the current combined export.
- Labeling anomaly audit: `0` pending candidates, high=`0`, medium=`0`, known anomalies suppressed=`2`.

## Strong Positional Rigidity

- `g:1`: H=0.0000, n=298, dominant=medial:1.0000.
- `b:1`: H=0.0000, n=191, dominant=medial:1.0000.
- `k:1`: H=0.0000, n=65, dominant=medial:1.0000.
- `l:1`: H=0.0000, n=31, dominant=medial:1.0000.
- `i:1`: H=0.0741, n=222, dominant=medial:0.9910.
- `f:1`: H=0.0809, n=459, dominant=medial:0.9913.
- `m:1`: H=0.1392, n=51, dominant=medial:0.9804.
- `h:2`: H=0.2864, n=160, dominant=medial:0.9500.
- `c:2`: H=0.4306, n=34, dominant=medial:0.9118.
- `a:1`: H=0.5448, n=419, dominant=medial:0.8878.
- `h:1`: H=0.7044, n=209, dominant=final:0.8086.
- `c:1`: H=0.7539, n=642, dominant=medial:0.8474.

## Most Dispersed Atom Symbols

- `n:1`: H=0.9567, n=82, initial=51 medial=31 final=0.
- `j:1`: H=0.9560, n=114, initial=0 medial=43 final=71.
- `d:1`: H=0.9348, n=248, initial=0 medial=87 final=161.
- `e:1`: H=0.9076, n=1332, initial=305 medial=1001 final=26.
- `c:1`: H=0.7539, n=642, initial=67 medial=544 final=31.
- `h:1`: H=0.7044, n=209, initial=0 medial=40 final=169.
- `a:1`: H=0.5448, n=419, initial=44 medial=372 final=3.
- `c:2`: H=0.4306, n=34, initial=3 medial=31 final=0.

## Contextual Grammar Candidates

Particle-scope strongest current findings:

- `d:1` final: `has_prior i:1` = `215/230` (0.9348).
- `d:1` medial: `has_prior a:1` = `17/17` (1.0000).
- `d:1` medial: `has_after e:1` = `17/17` (1.0000).
- `e:1` final: `has_prior g:1` = `293/293` (1.0000).
- `f:1` final: `prev_is e:1` = `164/166` (0.9880).
- `f:1` medial: `next_is i:1` = `88/92` (0.9565).
- `h:2` final: `has_prior e:1` = `160/160` (1.0000).
- `m:1` medial: `prev_is a:1` = `50/50` (1.0000).
- `m:1` medial: `next_is c:1` = `49/50` (0.9800).

Molecule-scope exploratory signals:

- `j:1` final: `has_prior f:1` = `71/71` (1.0000).
- `j:1` final: `prev_is f:1` = `71/71` (1.0000).
- `n:1` initial: `has_after g:1` = `51/51` (1.0000).
- `n:1` initial: `has_after e:1` = `51/51` (1.0000).
- `n:1` medial: `has_prior c:1` = `28/31` (0.9032).
- `n:1` medial: `next_is e:1` = `29/31` (0.9355).
- `k:1` medial: `has_prior e:1` = `64/65` (0.9846).

Molecule-neighbor scan:

- `last_token=a:1` -> `e:1`: `3/3` (1.0000).
- `last_token=h:2` -> `e:1`: `3/3` (1.0000).
- `suffix2=c:1 a:1` -> `e:1 g:1`: `3/3` (1.0000).

## Search-Space And Validation Guardrails

- `particle` scope examined `3420` raw symbol-role-test-token hypotheses and reported `169` candidates.
- `molecule` scope examined `2880` raw symbol-role-test-token hypotheses and reported `184` candidates.
- Strong contextual rows are treated as candidate rules, not as proof by themselves.
- The next scientific step is a frozen alphabet/manual plus out-of-sample annotation, so discovered rules cannot silently shape future labels.

## New Pattern Search Layers

- Conditional entropy: weighted next=`1.8929`, previous=`1.6503`.
- Lowest next-token entropy leads: `l:1` -> `f:1` (1.0000, H=0.0000); `g:1` -> `e:1` (0.9933, H=0.0581); `i:1` -> `d:1` (0.9773, H=0.1876); `k:1` -> `f:1` (0.9692, H=0.1982); `m:1` -> `c:1` (0.9608, H=0.2779).
- Variant ablation: full H=`0.5725`, merged-family H=`0.6115`.
- Variant-family checks: `h` split-minus-merged=-0.4757; `c` split-minus-merged=-0.0037.
- Macro lexeme test: `16` atom symbols collapse to `12` macro-units over `473` physical units.
- Macro signature diversity: original `305` signatures, macro `298` signatures.
- Merged `MEDIAL_OP` (medial:824 final:2 initial:1) keeps H(role)=`0.0380`, dominant=`medial` at `0.9964`.
- Top macro lexemes: `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` (20x); `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` (13x); `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` (10x); `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` (9x); `e:1 MEDIAL_OP e:1 e:1 h:1` (9x).
- Morphology-only classifier: nearest-centroid accuracy=`0.9394`, kNN accuracy=`0.9763`, mean separation=`1.4285`.
- Strongest morphology families: `f:1`: separation ratio `4.9154`, kNN accuracy `0.9935`, nearest competitor `h:2`; `e:1`: separation ratio `3.2634`, kNN accuracy `0.9962`, nearest competitor `h:2`; `j:1`: separation ratio `1.8329`, kNN accuracy `0.9474`, nearest competitor `n:1`.
- Most confusable morphology families: `n:1`: separation ratio `0.6455`, kNN accuracy `0.7439`, nearest competitor `d:1`; `d:1`: separation ratio `0.6959`, kNN accuracy `0.9476`, nearest competitor `g:1`; `b:1`: separation ratio `0.7509`, kNN accuracy `0.9581`, nearest competitor `g:1`.
- Cross-folio validation statuses: perfect:157, survives:77, weak:22.
- Branch audit `has_prior:g:1`: dominant `e:1` = `278/293` (0.9488), distribution e:1:278 c:2:11 a:1:3 c:1:1.

## Exceptions To Inspect

### e:1 final without prior g:1

No exceptions.

### f:1 medial without next i:1

| Image | Molecule | Particle | Atom | Signature |
| --- | --- | --- | ---: | --- |
| `page-003.jpg` | `img3-m82` | `img3-m82-p5` | 2413 | `k:1 f:1 j:1` |
| `page-005.jpg` | `img5-m49` | `img5-m49-p3` | 6163 | `k:1 f:1 j:1` |
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

- `cases/combined-f1r-f1v-f2r-f47v-full-current/role-entropy.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/contextual-rule-discovery.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/contextual-rule-discovery-molecule-scope.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/molecule-neighbor-discovery.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/line-alignment-audit.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/search-space-audit.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/conditional-entropy.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/variant-ablation.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/macro-lexeme-analysis.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/morphology-family-analysis.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/cross-folio-validation.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/e1-final-branch-audit.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/labeling-anomaly-audit.md`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/labeling-anomaly-known.tsv`
- `cases/combined-f1r-f1v-f2r-f47v-full-current/atom-symbols.md`

---

# Combined Role Entropy

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\role-entropy.md`

== eva role entropy ==
units: 484
symbols: 1853
vocabulary: 25
weighted_entropy_bits: 0.7864
weighted_relative_entropy_0_to_1: 0.4962
zero_entropy_symbols: 6
rigid_symbols_95pct: 7
most_positionally_chaotic:
  s: H=1.4911 rel=0.9408 n=45 initial=23 medial=9 final=17 dominant=initial:0.4694
  ?: H=1.2955 rel=0.8173 n=10 initial=3 medial=6 final=1 dominant=medial:0.6000
  d: H=1.2192 rel=0.7692 n=158 initial=93 medial=58 final=9 dominant=initial:0.5813
  o: H=1.1823 rel=0.7460 n=274 initial=54 medial=191 final=31 dominant=medial:0.6920
  k: H=1.1306 rel=0.7133 n=79 initial=33 medial=44 final=2 dominant=medial:0.5570
  c: H=1.0000 rel=0.6309 n=4 initial=2 medial=2 final=0 dominant=initial:0.5000
  l: H=0.9853 rel=0.6217 n=113 initial=4 medial=26 final=83 dominant=final:0.7345
  sh: H=0.9560 rel=0.6032 n=78 initial=58 medial=19 final=2 dominant=initial:0.7342
  ch: H=0.9422 rel=0.5945 n=153 initial=98 medial=55 final=0 dominant=initial:0.6405
  r: H=0.8954 rel=0.5649 n=83 initial=3 medial=15 final=65 dominant=final:0.7831
  p: H=0.8813 rel=0.5560 n=10 initial=7 medial=3 final=0 dominant=initial:0.7000
  y: H=0.8492 rel=0.5358 n=206 initial=28 medial=11 final=172 dominant=final:0.8152
most_positionally_rigid:
  i: H=0.0000 rel=0.0000 n=160 initial=0 medial=160 final=0 dominant=medial:1.0000
  ee: H=0.0000 rel=0.0000 n=23 initial=0 medial=23 final=0 dominant=medial:1.0000
  cph: H=0.0000 rel=0.0000 n=12 initial=12 medial=0 final=0 dominant=initial:1.0000
  cfh: H=0.0000 rel=0.0000 n=4 initial=4 medial=0 final=0 dominant=initial:1.0000
  f: H=0.0000 rel=0.0000 n=3 initial=3 medial=0 final=0 dominant=initial:1.0000
  m: H=0.0000 rel=0.0000 n=3 initial=0 medial=0 final=3 dominant=final:1.0000
  n: H=0.2559 rel=0.1615 n=93 initial=0 medial=4 final=89 dominant=final:0.9570
  e: H=0.3412 rel=0.2152 n=63 initial=0 medial=59 final=4 dominant=medial:0.9365
  a: H=0.3427 rel=0.2162 n=173 initial=6 medial=164 final=3 dominant=medial:0.9480
  qo: H=0.5033 rel=0.3175 n=8 initial=8 medial=0 final=1 dominant=initial:0.8889
  ckh: H=0.6500 rel=0.4101 n=12 initial=10 medial=2 final=0 dominant=initial:0.8333
  t: H=0.6942 rel=0.4380 n=53 initial=7 medial=45 final=1 dominant=medial:0.8491

== atoms role entropy ==
units: 473
symbols: 4557
vocabulary: 16
weighted_entropy_bits: 0.5725
weighted_relative_entropy_0_to_1: 0.3612
zero_entropy_symbols: 4
rigid_symbols_95pct: 8
most_positionally_chaotic:
  n:1: H=0.9567 rel=0.6036 n=82 initial=51 medial=31 final=0 dominant=initial:0.6220
  j:1: H=0.9560 rel=0.6032 n=114 initial=0 medial=43 final=71 dominant=final:0.6228
  d:1: H=0.9348 rel=0.5898 n=248 initial=0 medial=87 final=161 dominant=final:0.6492
  e:1: H=0.9076 rel=0.5726 n=1332 initial=305 medial=1001 final=26 dominant=medial:0.7515
  c:1: H=0.7539 rel=0.4756 n=642 initial=67 medial=544 final=31 dominant=medial:0.8474
  h:1: H=0.7044 rel=0.4444 n=209 initial=0 medial=40 final=169 dominant=final:0.8086
  a:1: H=0.5448 rel=0.3438 n=419 initial=44 medial=372 final=3 dominant=medial:0.8878
  c:2: H=0.4306 rel=0.2716 n=34 initial=3 medial=31 final=0 dominant=medial:0.9118
  h:2: H=0.2864 rel=0.1807 n=160 initial=0 medial=152 final=8 dominant=medial:0.9500
  m:1: H=0.1392 rel=0.0878 n=51 initial=1 medial=50 final=0 dominant=medial:0.9804
  f:1: H=0.0809 rel=0.0510 n=459 initial=2 medial=455 final=2 dominant=medial:0.9913
  i:1: H=0.0741 rel=0.0468 n=222 initial=0 medial=220 final=2 dominant=medial:0.9910
most_positionally_rigid:
  g:1: H=0.0000 rel=0.0000 n=298 initial=0 medial=298 final=0 dominant=medial:1.0000
  b:1: H=0.0000 rel=0.0000 n=191 initial=0 medial=191 final=0 dominant=medial:1.0000
  k:1: H=0.0000 rel=0.0000 n=65 initial=0 medial=65 final=0 dominant=medial:1.0000
  l:1: H=0.0000 rel=0.0000 n=31 initial=0 medial=31 final=0 dominant=medial:1.0000
  i:1: H=0.0741 rel=0.0468 n=222 initial=0 medial=220 final=2 dominant=medial:0.9910
  f:1: H=0.0809 rel=0.0510 n=459 initial=2 medial=455 final=2 dominant=medial:0.9913
  m:1: H=0.1392 rel=0.0878 n=51 initial=1 medial=50 final=0 dominant=medial:0.9804
  h:2: H=0.2864 rel=0.1807 n=160 initial=0 medial=152 final=8 dominant=medial:0.9500
  c:2: H=0.4306 rel=0.2716 n=34 initial=3 medial=31 final=0 dominant=medial:0.9118
  a:1: H=0.5448 rel=0.3438 n=419 initial=44 medial=372 final=3 dominant=medial:0.8878
  h:1: H=0.7044 rel=0.4444 n=209 initial=0 medial=40 final=169 dominant=final:0.8086
  c:1: H=0.7539 rel=0.4756 n=642 initial=67 medial=544 final=31 dominant=medial:0.8474

---

# Line Alignment Audit

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\line-alignment-audit.md`

Case: `cases\combined-f1r-f1v-f2r-f47v-full-current`

This audit checks whether EVA lines and DatasetCreator physical rows can be compared ordinally. It does not force alignment; it reports mismatches.

## Summary

| Image | EVA lines | Physical rows | Status |
| --- | ---: | ---: | --- |
| `page-003.jpg` | 24 | 24 | line-count-match |
| `page-004.jpg` | 10 | 10 | line-count-match |
| `page-005.jpg` | 13 | 13 | line-count-match |
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
| `page-003.jpg` | 19 | paired-by-ordinal | `f1r.22` | 10 | R19 | 8 | 2350-2618 | p003-u147..p003-u154 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 20 | paired-by-ordinal | `f1r.23` | 10 | R20 | 10 | 2568-2700 | p003-u155..p003-u164 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 21 | paired-by-ordinal | `f1r.24` | 9 | R21 | 9 | 2649-2785 | p003-u165..p003-u173 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 22 | paired-by-ordinal | `f1r.25` | 9 | R22 | 8 | 2730-2867 | p003-u174..p003-u181 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 23 | paired-by-ordinal | `f1r.26` | 9 | R23 | 9 | 2822-2971 | p003-u182..p003-u190 | ordinal pair only; not visual proof of exact alignment |
| `page-003.jpg` | 24 | paired-by-ordinal | `f1r.27` | 6 | R24 | 6 | 2913-3048 | p003-u191..p003-u196 | ordinal pair only; not visual proof of exact alignment |
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
| `page-005.jpg` | 1 | paired-by-ordinal | `f2r.1` | 6 | R1 | 8 | 444-587 | p005-u001..p005-u008 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 2 | paired-by-ordinal | `f2r.2` | 6 | R2 | 6 | 563-669 | p005-u009..p005-u014 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 3 | paired-by-ordinal | `f2r.3` | 7 | R3 | 6 | 640-757 | p005-u015..p005-u020 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 4 | paired-by-ordinal | `f2r.4` | 7 | R4 | 6 | 709-820 | p005-u021..p005-u026 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 5 | paired-by-ordinal | `f2r.5` | 7 | R5 | 8 | 801-894 | p005-u027..p005-u034 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 6 | paired-by-ordinal | `f2r.6` | 8 | R6 | 8 | 871-976 | p005-u035..p005-u042 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 7 | paired-by-ordinal | `f2r.7` | 5 | R7 | 5 | 942-1052 | p005-u043..p005-u047 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 8 | paired-by-ordinal | `f2r.8` | 9 | R8 | 11 | 2389-2561 | p005-u048..p005-u058 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 9 | paired-by-ordinal | `f2r.9` | 10 | R9 | 12 | 2526-2672 | p005-u059..p005-u070 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 10 | paired-by-ordinal | `f2r.10` | 9 | R10 | 10 | 2601-2730 | p005-u071..p005-u080 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 11 | paired-by-ordinal | `f2r.11` | 9 | R11 | 9 | 2694-2783 | p005-u081..p005-u089 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 12 | paired-by-ordinal | `f2r.12` | 11 | R12 | 10 | 2736-2880 | p005-u090..p005-u099 | ordinal pair only; not visual proof of exact alignment |
| `page-005.jpg` | 13 | paired-by-ordinal | `f2r.13` | 5 | R13 | 5 | 2856-2962 | p005-u100..p005-u104 | ordinal pair only; not visual proof of exact alignment |
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

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\atom-symbols.md`

Units: 473
Vocabulary: 16
Total atom tokens: 4557

| Symbol | Count |
| --- | ---: |
| `a:1` | 419 |
| `b:1` | 191 |
| `c:1` | 642 |
| `c:2` | 34 |
| `d:1` | 248 |
| `e:1` | 1332 |
| `f:1` | 459 |
| `g:1` | 298 |
| `h:1` | 209 |
| `h:2` | 160 |
| `i:1` | 222 |
| `j:1` | 114 |
| `k:1` | 65 |
| `l:1` | 31 |
| `m:1` | 51 |
| `n:1` | 82 |

---

# Particle Rule Discovery

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\contextual-rule-discovery.md`

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

---

# Molecule Rule Discovery

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\contextual-rule-discovery-molecule-scope.md`

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

---

# Molecule Neighbor Discovery

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\molecule-neighbor-discovery.md`

## Scope

- Molecules: `473`
- Neighbor rows: `473`
- Input: `cases\combined-f1r-f1v-f2r-f47v-full-current\atoms-current.tsv`

This report studies molecule-to-molecule adjacency inside each exported program row.

## Current last atom -> next first atom

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `last_token=a:1` | `e:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |
| `last_token=h:2` | `e:1` | 3 | 3 | 1.0000 | img3-m24->img3-m19, img5-m36->img5-m40, img94-m35->img94-m37 |

## Current first atom -> previous last atom

No strong findings under current thresholds.

## Current suffix2 -> next prefix2

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `suffix2=c:1 a:1` | `e:1 g:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |

---

# Search Space Audit

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\search-space-audit.md`

## Purpose

This report estimates how many contextual hypotheses are examined before strong candidates are reported. It is a guardrail against reading the strongest rows as if they were hand-picked in advance.

## Current Thresholds

- Candidate if share >= `0.8` or absolute delta >= `0.45`.
- Context tests: `has_prior`, `has_after`, `starts_with`, `ends_with`, `prev_is`, `next_is`.

## Search Space

| Scope | Atoms | Groups | Vocabulary | Observed symbol-role cells | Tests | Raw hypotheses | Reported candidates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `particle` | 4557 | 1777 | 16 | 38 | 6 | 3420 | 169 |
| `molecule` | 4557 | 473 | 16 | 32 | 6 | 2880 | 184 |

## Interpretation Rules

- A strong candidate is not automatically grammar; it is a rule worth validating.
- Perfect or near-perfect rows are most persuasive when they survive on folios not used to discover or tune the category.
- Counts should be interpreted with the search space in mind, especially when many symbol-role-test-token combinations are examined.
- Future preregistered runs should freeze the atom inventory, thresholds, corpus split, and accepted tests before new pages are labeled.

---

# Conditional Entropy

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\conditional-entropy.md`

## Scope

- Input: `cases\combined-f1r-f1v-f2r-f47v-full-current\atoms-current.tsv`
- Token mode: `full`
- Molecules: `473`
- Atom occurrences with adjacency rows: `4557`

## Summary

- Weighted next-token entropy: `1.8929` bits.
- Weighted previous-token entropy: `1.6503` bits.

## Lowest Next-Token Entropy

| Condition token | Total | H | Dominant | Share | Alternatives |
| --- | ---: | ---: | --- | ---: | --- |
| `l:1` | 31 | 0.0000 | `f:1` | 1.0000 | f:1:31 |
| `g:1` | 298 | 0.0581 | `e:1` | 0.9933 | e:1:296 c:1:2 |
| `i:1` | 220 | 0.1876 | `d:1` | 0.9773 | d:1:215 c:1:3 a:1:1 c:2:1 |
| `k:1` | 65 | 0.1982 | `f:1` | 0.9692 | f:1:63 e:1:2 |
| `m:1` | 51 | 0.2779 | `c:1` | 0.9608 | c:1:49 a:1:1 c:2:1 |
| `n:1` | 82 | 0.3905 | `e:1` | 0.9390 | e:1:77 c:2:3 c:1:2 |
| `b:1` | 191 | 0.6828 | `c:1` | 0.8429 | c:1:161 d:1:28 a:1:2 |
| `h:2` | 152 | 0.9819 | `e:1` | 0.8289 | e:1:126 c:1:14 f:1:4 n:1:4 a:1:2 c:2:2 |
| `h:1` | 40 | 1.5190 | `a:1` | 0.4500 | a:1:18 e:1:18 c:1:2 d:1:1 n:1:1 |
| `d:1` | 87 | 1.8251 | `e:1` | 0.5747 | e:1:50 g:1:16 c:1:11 n:1:6 l:1:2 f:1:1 k:1:1 |
| `j:1` | 43 | 1.8605 | `e:1` | 0.5349 | e:1:23 n:1:9 a:1:4 c:1:4 d:1:3 |
| `c:2` | 34 | 1.8999 | `g:1` | 0.4412 | g:1:15 h:2:12 e:1:3 a:1:2 b:1:1 c:2:1 |
| `c:1` | 611 | 1.9974 | `a:1` | 0.4223 | a:1:258 h:2:148 f:1:122 e:1:72 h:1:3 g:1:2 k:1:2 n:1:2 c:1:1 i:1:1 |
| `f:1` | 457 | 2.2233 | `i:1` | 0.3895 | i:1:178 j:1:113 f:1:69 k:1:60 l:1:27 e:1:5 c:1:3 a:1:1 n:1:1 |
| `a:1` | 416 | 2.3428 | `e:1` | 0.3317 | e:1:138 b:1:129 m:1:50 g:1:43 c:1:36 c:2:11 n:1:7 d:1:1 f:1:1 |
| `e:1` | 1306 | 2.8774 | `c:1` | 0.2198 | c:1:287 g:1:222 e:1:217 h:1:206 f:1:166 a:1:86 b:1:61 i:1:43 c:2:12 k:1:2 l:1:2 j:1:1 n:1:1 |

## Lowest Previous-Token Entropy

| Condition token | Total | H | Dominant | Share | Alternatives |
| --- | ---: | ---: | --- | ---: | --- |
| `m:1` | 50 | 0.0000 | `a:1` | 1.0000 | a:1:50 |
| `j:1` | 114 | 0.0725 | `f:1` | 0.9912 | f:1:113 e:1:1 |
| `h:1` | 209 | 0.1084 | `e:1` | 0.9856 | e:1:206 c:1:3 |
| `h:2` | 160 | 0.3843 | `c:1` | 0.9250 | c:1:148 c:2:12 |
| `k:1` | 65 | 0.5083 | `f:1` | 0.9231 | f:1:60 c:1:2 e:1:2 d:1:1 |
| `d:1` | 248 | 0.6751 | `i:1` | 0.8669 | i:1:215 b:1:28 j:1:3 a:1:1 h:1:1 |
| `l:1` | 31 | 0.6838 | `f:1` | 0.8710 | f:1:27 d:1:2 e:1:2 |
| `i:1` | 222 | 0.7493 | `f:1` | 0.8018 | f:1:178 e:1:43 c:1:1 |
| `b:1` | 191 | 0.9480 | `a:1` | 0.6754 | a:1:129 e:1:61 c:2:1 |
| `g:1` | 298 | 1.2115 | `e:1` | 0.7450 | e:1:222 a:1:43 d:1:16 c:2:15 c:1:2 |
| `a:1` | 375 | 1.3278 | `c:1` | 0.6880 | c:1:258 e:1:86 h:1:18 j:1:4 b:1:2 c:2:2 h:2:2 f:1:1 i:1:1 m:1:1 |
| `c:1` | 575 | 2.0375 | `e:1` | 0.4991 | e:1:287 b:1:161 m:1:49 a:1:36 h:2:14 d:1:11 j:1:4 f:1:3 i:1:3 g:1:2 h:1:2 n:1:2 c:1:1 |
| `c:2` | 31 | 2.1210 | `e:1` | 0.3871 | e:1:12 a:1:11 n:1:3 h:2:2 c:2:1 i:1:1 m:1:1 |
| `f:1` | 457 | 2.2071 | `e:1` | 0.3632 | e:1:166 c:1:122 f:1:69 k:1:63 l:1:31 h:2:4 a:1:1 d:1:1 |
| `n:1` | 31 | 2.5771 | `j:1` | 0.2903 | j:1:9 a:1:7 d:1:6 h:2:4 c:1:2 e:1:1 f:1:1 h:1:1 |
| `e:1` | 1027 | 2.8175 | `g:1` | 0.2882 | g:1:296 e:1:217 a:1:138 h:2:126 n:1:77 c:1:72 d:1:50 j:1:23 h:1:18 f:1:5 c:2:3 k:1:2 |

## Role Entropy By Token

| Token | Total | H(role) | Dominant role | Dominant share | Roles |
| --- | ---: | ---: | --- | ---: | --- |
| `g:1` | 298 | 0.0000 | medial | 1.0000 | medial:298 |
| `b:1` | 191 | 0.0000 | medial | 1.0000 | medial:191 |
| `k:1` | 65 | 0.0000 | medial | 1.0000 | medial:65 |
| `l:1` | 31 | 0.0000 | medial | 1.0000 | medial:31 |
| `i:1` | 222 | 0.0741 | medial | 0.9910 | medial:220 final:2 |
| `f:1` | 459 | 0.0809 | medial | 0.9913 | medial:455 final:2 initial:2 |
| `m:1` | 51 | 0.1392 | medial | 0.9804 | medial:50 initial:1 |
| `h:2` | 160 | 0.2864 | medial | 0.9500 | medial:152 final:8 |
| `c:2` | 34 | 0.4306 | medial | 0.9118 | medial:31 initial:3 |
| `a:1` | 419 | 0.5448 | medial | 0.8878 | medial:372 initial:44 final:3 |
| `h:1` | 209 | 0.7044 | final | 0.8086 | final:169 medial:40 |
| `c:1` | 642 | 0.7539 | medial | 0.8474 | medial:544 initial:67 final:31 |
| `e:1` | 1332 | 0.9076 | medial | 0.7515 | medial:1001 initial:305 final:26 |
| `d:1` | 248 | 0.9348 | final | 0.6492 | final:161 medial:87 |
| `j:1` | 114 | 0.9560 | final | 0.6228 | final:71 medial:43 |
| `n:1` | 82 | 0.9567 | initial | 0.6220 | initial:51 medial:31 |

---

# Variant Ablation

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\variant-ablation.md`

## Scope

- Input: `cases\combined-f1r-f1v-f2r-f47v-full-current\atoms-current.tsv`
- Molecules: `473`

## Global Comparison

| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: |
| Full variants | 4557 | 16 | 0.5725 | 8 |
| Families merged | 4557 | 14 | 0.6115 | 7 |

Interpretation: negative `split_minus_merged` means variants reduce entropy versus merging the family; positive values mean the split is not helping positional stability yet.

## Variant Families

| Family | Variants | Tokens | H merged | H split weighted | Split - merged | Variant details |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `h` | 2 | 369 | 0.9988 | 0.5231 | -0.4757 | h:1:n209:H0.7044 h:2:n160:H0.2864 |
| `c` | 2 | 676 | 0.7413 | 0.7376 | -0.0037 | c:1:n642:H0.7539 c:2:n34:H0.4306 |

---

# Macro Lexeme Analysis

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\macro-lexeme-analysis.md`

## Hypothesis

Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.

## Scope

- Input: `cases\combined-f1r-f1v-f2r-f47v-full-current\atoms-current.tsv`
- Molecules / physical units: `473`
- Original atom vocabulary: `16`
- Macro vocabulary after merge: `12`
- Original unique molecule signatures: `305`
- Macro unique lexeme signatures: `298`

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
| `l:1` | 31 | 0.0000 | medial | 1.0000 | medial:31 |
| `MEDIAL_OP` | 827 | 0.0380 | medial | 0.9964 | medial:824 final:2 initial:1 |
| `f:1` | 459 | 0.0809 | medial | 0.9913 | medial:455 final:2 initial:2 |
| `h:2` | 160 | 0.2864 | medial | 0.9500 | medial:152 final:8 |
| `c:2` | 34 | 0.4306 | medial | 0.9118 | medial:31 initial:3 |
| `a:1` | 419 | 0.5448 | medial | 0.8878 | medial:372 initial:44 final:3 |
| `h:1` | 209 | 0.7044 | final | 0.8086 | final:169 medial:40 |
| `c:1` | 642 | 0.7539 | medial | 0.8474 | medial:544 initial:67 final:31 |
| `e:1` | 1332 | 0.9076 | medial | 0.7515 | medial:1001 initial:305 final:26 |
| `d:1` | 248 | 0.9348 | final | 0.6492 | final:161 medial:87 |
| `j:1` | 114 | 0.9560 | final | 0.6228 | final:71 medial:43 |
| `n:1` | 82 | 0.9567 | initial | 0.6220 | initial:51 medial:31 |

## Top Macro Lexemes

| Count | Share | Macro Signature | Examples |
| ---: | ---: | --- | --- |
| 20 | 0.0423 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u091, p003-u105, p003-u106, p003-u110, p003-u150 |
| 13 | 0.0275 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u033, p003-u059, p003-u082, p003-u099, p003-u169 |
| 10 | 0.0211 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u096, p003-u154, p003-u159, p003-u162, p004-u035 |
| 9 | 0.0190 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` | p003-u056, p003-u063, p003-u089, p003-u132, p003-u143 |
| 9 | 0.0190 | `e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u049, p005-u018, p005-u083, p005-u091, p094-u061 |
| 9 | 0.0190 | `n:1 e:1 MEDIAL_OP e:1` | p004-u073, p005-u011, p005-u029, p005-u043, p005-u049 |
| 7 | 0.0148 | `c:1 f:1 j:1 n:1 e:1 MEDIAL_OP e:1` | p003-u005, p003-u127, p004-u032, p004-u043, p004-u079 |
| 7 | 0.0148 | `c:1 f:1 MEDIAL_OP d:1` | p003-u022, p003-u035, p003-u064, p004-u010, p004-u074 |
| 6 | 0.0127 | `e:1 MEDIAL_OP e:1 c:1` | p003-u108, p003-u165, p003-u191, p004-u029, p094-u063 |
| 6 | 0.0127 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u015, p004-u022, p004-u070, p004-u087, p094-u035 |
| 5 | 0.0106 | `e:1 a:1 e:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u097, p003-u124, p004-u050, p005-u013, p094-u027 |
| 5 | 0.0106 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` | p003-u057, p003-u141, p005-u017, p005-u092, p094-u030 |
| 5 | 0.0106 | `e:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u102, p004-u005, p004-u009, p005-u096, p094-u015 |
| 5 | 0.0106 | `n:1 e:1 MEDIAL_OP e:1 c:1` | p003-u087, p003-u109, p003-u116, p005-u100, p094-u024 |
| 4 | 0.0085 | `a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u104, p004-u064, p005-u060, p094-u023 |
| 4 | 0.0085 | `c:1 f:1 j:1` | p004-u003, p004-u052, p004-u063, p005-u073 |
| 4 | 0.0085 | `e:1 c:1 h:2 c:1 f:1 j:1` | p004-u024, p004-u045, p004-u055, p004-u058 |
| 4 | 0.0085 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | p003-u189, p004-u023, p004-u086, p005-u082 |
| 4 | 0.0085 | `e:1 c:1 h:2 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u094, p005-u041, p094-u059, p094-u064 |
| 4 | 0.0085 | `e:1 MEDIAL_OP d:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u035, p005-u069, p005-u097, p094-u037 |
| 4 | 0.0085 | `e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u142, p004-u036, p004-u046, p005-u102 |
| 4 | 0.0085 | `n:1 e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p003-u051, p003-u062, p003-u183, p004-u083 |
| 3 | 0.0063 | `a:1 MEDIAL_OP c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u013, p004-u030, p004-u037 |
| 3 | 0.0063 | `c:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u168, p004-u075, p005-u090 |
| 3 | 0.0063 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u178, p003-u186, p094-u010 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u084, p003-u144, p004-u056 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u011, p003-u017, p003-u164 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u185, p004-u020, p005-u045 |
| 3 | 0.0063 | `e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u003, p005-u086, p005-u095 |
| 3 | 0.0063 | `e:1 MEDIAL_OP e:1 e:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p003-u119, p005-u098, p094-u049 |
| 3 | 0.0063 | `e:1 MEDIAL_OP e:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u007, p005-u020, p094-u080 |
| 3 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 e:1 h:1` | p003-u050, p005-u061, p094-u022 |
| 3 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u018, p094-u009, p094-u032 |
| 2 | 0.0042 | `a:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u187, p003-u188 |
| 2 | 0.0042 | `c:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u030, p094-u062 |
| 2 | 0.0042 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u034, p003-u166 |
| 2 | 0.0042 | `c:1 e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u092, p005-u030 |
| 2 | 0.0042 | `c:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u118, p004-u011 |
| 2 | 0.0042 | `e:1 a:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p005-u075, p094-u066 |
| 2 | 0.0042 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP d:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u040, p004-u006 |

## Interpretation

- This is a hypothesis test, not a destructive relabeling.
- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.
- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.

---

# Morphology Family Analysis

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\morphology-family-analysis.md`

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

---

# Cross-Folio Validation

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\cross-folio-validation.md`

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Context scope: `particle`
- Discovery rules tested: `64`
- Rule filter: total >= `10`, share >= `0.9`

## Validation Matrix

| Rule | Discovery | Image | Count | Total | Share | Status | Exceptions/examples |
| --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| `d:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_after `g:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial next_is `g:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` final has_prior `i:1` | 0.9348 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m152/img3-m152-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m165/img3-m165-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9348 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m152/img3-m152-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m165/img3-m165-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9552 | `page-003.jpg` | 40 | 41 | 0.9756 | survives | img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial next_is `b:1` | 0.9104 | `page-003.jpg` | 37 | 41 | 0.9024 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1; img3-m85/img3-m85-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `e:1` medial prev_is `a:1` | 0.9104 | `page-003.jpg` | 37 | 41 | 0.9024 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial has_after `b:1` | 0.9104 | `page-003.jpg` | 37 | 41 | 0.9024 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1; img3-m85/img3-m85-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `e:1` medial has_after `c:1` | 0.9104 | `page-003.jpg` | 37 | 41 | 0.9024 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1; img3-m85/img3-m85-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `c:1` final has_prior `a:1` | 0.9091 | `page-003.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 1.0000 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 1.0000 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 1.0000 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9940 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9940 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9880 | `page-003.jpg` | 85 | 86 | 0.9884 | survives | img3-m121/img3-m121-p2:e:1 l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9674 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m173/img3-m173-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9674 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m173/img3-m173-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9565 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9565 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `a:1` final has_prior `c:1` | 0.9920 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9920 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9858 | `page-003.jpg` | 59 | 59 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9346 | `page-003.jpg` | 85 | 87 | 0.9770 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m181/img3-m181-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9281 | `page-003.jpg` | 84 | 87 | 0.9655 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m181/img3-m181-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9856 | `page-003.jpg` | 78 | 79 | 0.9873 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9856 | `page-003.jpg` | 78 | 79 | 0.9873 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9761 | `page-003.jpg` | 77 | 79 | 0.9747 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9250 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9250 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9800 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9800 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9933 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9933 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9832 | `page-003.jpg` | 126 | 129 | 0.9767 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `g:1` medial has_prior `e:1` | 0.9463 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m150/img3-m150-p2:c:2 g:1 e:1; img3-m181/img3-m181-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m196/img3-m196-p2:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9463 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m150/img3-m150-p2:c:2 g:1 e:1; img3-m181/img3-m181-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m196/img3-m196-p2:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 0.9910 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 0.9910 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9730 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9839 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9839 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9355 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m173/img3-m173-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9355 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m173/img3-m173-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9355 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9655 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9655 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9310 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9348 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9348 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9552 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial next_is `b:1` | 0.9104 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial prev_is `a:1` | 0.9104 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial has_after `b:1` | 0.9104 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9104 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9091 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 1.0000 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 1.0000 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 1.0000 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9940 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9940 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9880 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9674 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9674 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9565 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9565 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9920 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9920 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9858 | `page-004.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9346 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9281 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9856 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9856 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9761 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9250 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9250 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9800 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9800 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9933 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9933 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9832 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9463 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9463 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 0.9910 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 0.9910 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9730 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9839 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9839 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9355 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9355 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9355 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9655 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9655 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9310 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9348 | `page-005.jpg` | 56 | 59 | 0.9492 | survives | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m4/img5-m4-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9348 | `page-005.jpg` | 56 | 59 | 0.9492 | survives | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m4/img5-m4-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-005.jpg` | 51 | 51 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-005.jpg` | 51 | 51 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9552 | `page-005.jpg` | 10 | 11 | 0.9091 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `e:1` medial next_is `b:1` | 0.9104 | `page-005.jpg` | 10 | 11 | 0.9091 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `e:1` medial prev_is `a:1` | 0.9104 | `page-005.jpg` | 10 | 11 | 0.9091 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `e:1` medial has_after `b:1` | 0.9104 | `page-005.jpg` | 10 | 11 | 0.9091 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `e:1` medial has_after `c:1` | 0.9104 | `page-005.jpg` | 10 | 11 | 0.9091 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `c:1` final has_prior `a:1` | 0.9091 | `page-005.jpg` | 4 | 5 | 0.8000 | weak | img5-m25/img5-m25-p2:e:1 g:1 c:1 |
| `c:2` initial ends_with `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9940 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` final starts_with `e:1` | 0.9940 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` final prev_is `e:1` | 0.9880 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9674 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9674 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9565 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9565 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `a:1` final has_prior `c:1` | 0.9920 | `page-005.jpg` | 23 | 23 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9920 | `page-005.jpg` | 23 | 23 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9858 | `page-005.jpg` | 28 | 28 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9346 | `page-005.jpg` | 22 | 27 | 0.8148 | weak | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1; img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `a:1` medial starts_with `e:1` | 0.9281 | `page-005.jpg` | 22 | 27 | 0.8148 | weak | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1; img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `h:1` final has_prior `e:1` | 0.9856 | `page-005.jpg` | 48 | 48 | 1.0000 | perfect | - |
| `h:1` final prev_is `e:1` | 0.9856 | `page-005.jpg` | 48 | 48 | 1.0000 | perfect | - |
| `h:1` final starts_with `e:1` | 0.9761 | `page-005.jpg` | 48 | 48 | 1.0000 | perfect | - |
| `h:2` final has_prior `e:1` | 1.0000 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9250 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9250 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9800 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9800 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9933 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial next_is `e:1` | 0.9933 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial ends_with `e:1` | 0.9832 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial has_prior `e:1` | 0.9463 | `page-005.jpg` | 52 | 53 | 0.9811 | survives | img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9463 | `page-005.jpg` | 52 | 53 | 0.9811 | survives | img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `j:1` final has_prior `f:1` | 0.9910 | `page-005.jpg` | 25 | 26 | 0.9615 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `j:1` final prev_is `f:1` | 0.9910 | `page-005.jpg` | 25 | 26 | 0.9615 | survives | img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `j:1` final starts_with `f:1` | 0.9730 | `page-005.jpg` | 24 | 26 | 0.9231 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1; img5-m92/img5-m92-p5:d:1 e:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9839 | `page-005.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9839 | `page-005.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9355 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9355 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9355 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-005.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-005.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9655 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `l:1` initial has_after `d:1` | 0.9655 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `l:1` initial has_after `i:1` | 0.9310 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `d:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9348 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9348 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9552 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial next_is `b:1` | 0.9104 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial prev_is `a:1` | 0.9104 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `b:1` | 0.9104 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9104 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `c:1` final has_prior `a:1` | 0.9091 | `page-094.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 1.0000 | `page-094.jpg` | 4 | 4 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 1.0000 | `page-094.jpg` | 4 | 4 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 1.0000 | `page-094.jpg` | 4 | 4 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9940 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9940 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9880 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9674 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9674 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9565 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `f:1` medial next_is `i:1` | 0.9565 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `a:1` final has_prior `c:1` | 0.9920 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` final prev_is `c:1` | 0.9920 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` initial has_after `c:1` | 0.9858 | `page-094.jpg` | 23 | 25 | 0.9200 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1; img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial has_prior `e:1` | 0.9346 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial starts_with `e:1` | 0.9281 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `h:1` final has_prior `e:1` | 0.9856 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final prev_is `e:1` | 0.9856 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final starts_with `e:1` | 0.9761 | `page-094.jpg` | 45 | 46 | 0.9783 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9250 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9250 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9800 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial has_after `c:1` | 0.9800 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `g:1` medial has_after `e:1` | 0.9933 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9933 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9832 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9463 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9463 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 0.9910 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 0.9910 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9730 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9839 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial next_is `f:1` | 0.9839 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial ends_with `d:1` | 0.9355 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `d:1` | 0.9355 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `i:1` | 0.9355 | `page-094.jpg` | 7 | 9 | 0.7778 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9655 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9655 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9310 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |

Statuses:

- `perfect`: every observed case in that image passes.
- `survives`: observed share remains above the threshold.
- `weak`: observed but below threshold.
- `not_observed`: no matching role occurrence in that image yet.

---

# e:1 Final Branch Audit

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\e1-final-branch-audit.md`

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Context scope: `particle`
- Target: `e:1` as `final`
- Split: `has_prior g:1`
- Measure: `starts_with`
- Occurrences: `293`

## Branch Summary

| Branch | Total | Dominant measured value | Count | Share | Distribution |
| --- | ---: | --- | ---: | ---: | --- |
| `has_prior:g:1` | 293 | `e:1` | 278 | 0.9488 | e:1:278 c:2:11 a:1:3 c:1:1 |

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

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\exceptions-e1-final-without-prior-g1.md`

## Scope

- Rule: `e:1` as `final` where `has_prior` `g:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Matching role occurrences: `293`
- Passing: `293`
- Exceptions: `0`

## Exceptions

No rows.

---

# f:1 Medial Exceptions

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\exceptions-f1-medial-without-next-i1.md`

## Scope

- Rule: `f:1` as `medial` where `next_is` `i:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Matching role occurrences: `92`
- Passing: `88`
- Exceptions: `4`

## Exceptions

| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |
| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |
| page-003.jpg | img3-m82 | img3-m82-p5 | 2413 | medial | 2/3 | k:1 | k:1 | j:1 | `k:1 f:1 j:1` |
| page-005.jpg | img5-m49 | img5-m49-p3 | 6163 | medial | 2/3 | k:1 | k:1 | j:1 | `k:1 f:1 j:1` |
| page-094.jpg | img94-m42 | img94-m42-p3 | 4253 | medial | 2/4 | l:1 | l:1 | j:1 | `l:1 f:1 j:1 d:1` |
| page-094.jpg | img94-m58 | img94-m58-p3 | 4560 | medial | 2/4 | k:1 | k:1 | j:1 | `k:1 f:1 j:1 d:1` |

---

# m:1 Medial Exceptions

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\exceptions-m1-medial-without-next-c1.md`

## Scope

- Rule: `m:1` as `medial` where `next_is` `c:1`
- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Matching role occurrences: `50`
- Passing: `49`
- Exceptions: `1`

## Exceptions

| Image | Molecule | Particle | Atom | Role | Pos | First | Prev | Next | Signature |
| --- | --- | --- | ---: | --- | ---: | --- | --- | --- | --- |
| page-094.jpg | img94-m20 | img94-m20-p2 | 3058 | medial | 2/4 | a:1 | a:1 | c:2 | `a:1 m:1 c:2 a:1` |

---

# Labeling Anomaly Audit

Source: `cases\combined-f1r-f1v-f2r-f47v-full-current\labeling-anomaly-audit.md`

Purpose: find likely human labeling/order mistakes before using the data for stronger metrics.

This is not an automatic correction list. It only flags cases where the current corpus has a dominant ordering pattern and a rare variant with the same atom inventory.

## Parameters

- Images: page-003.jpg, page-004.jpg, page-005.jpg, page-094.jpg
- Minimum support per inventory: 4
- Max rare count: 2
- Max rare ratio: 0.18
- Learned-pattern memory included: no
- Known anomalies list: `cases\known-labeling-anomalies.tsv`

## Summary

- Candidates: 0
- High priority: 0
- Medium priority: 0
- Known anomalies suppressed from pending list: 2
- Scopes: particle order and molecule particle-order

## Top Candidates

No strong candidates found with current thresholds.


Full table: `labeling-anomaly-audit.tsv`

Known anomalies table: `labeling-anomaly-known.tsv`
