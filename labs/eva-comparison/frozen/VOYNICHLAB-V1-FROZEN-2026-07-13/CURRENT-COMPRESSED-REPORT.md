# Current Compressed Report

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
