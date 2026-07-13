# Current Compressed Report

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
