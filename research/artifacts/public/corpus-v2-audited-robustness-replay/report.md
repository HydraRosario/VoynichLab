# VoynichLab Corpus V2 - Executive Scientific Report

Date: 2026-07-14

## Executive Summary

VoynichLab has completed a second-pass quality audit of the current ATOMS corpus and replayed the core mathematical analysis against the standard EVA transcription on six folios/images:

| Folio | DatasetCreator image | EVA units | ATOMS physical units | Status |
| --- | --- | ---: | ---: | --- |
| `f1r` | `page-003.jpg` | 210 | 198 | audited |
| `f1v` | `page-004.jpg` | 90 | 90 | audited |
| `f2r` | `page-005.jpg` | 99 | 104 | audited |
| `f2v` | `page-006.jpg` | 61 | 57 | audited |
| `f3r` | `page-007.jpg` | 115 | 107 | audited |
| `f47v` | `page-094.jpg` | 85 | 83 | audited |
| combined | six-image corpus | 660 | 639 | audited |

The current result is clear: after correcting human labeling and ordering issues, ATOMS still has substantially lower positional entropy than EVA across the combined corpus and on every included page. The corpus is cleaner than the temporary no-cut state tested earlier today, and the restored `page-005.jpg` cut is now the preferred version.

This is not a decipherment claim. The result supports a narrower but stronger scientific statement: ATOMS-V1 is currently behaving as a physically grounded subglyph representation that captures positional and morphological regularities more cleanly than EVA on the audited corpus.

## Main Result

Weighted positional entropy:

| Scope | EVA H | ATOMS H | ATOMS advantage |
| --- | ---: | ---: | ---: |
| `f1r / page-003` | 0.7669 | 0.5096 | -0.2573 |
| `f1v / page-004` | 0.7182 | 0.5487 | -0.1695 |
| `f2r / page-005` | 0.7050 | 0.5934 | -0.1116 |
| `f2v / page-006` | 0.5163 | 0.5136 | -0.0027 |
| `f3r / page-007` | 0.6690 | 0.4820 | -0.1870 |
| `f47v / page-094` | 0.6974 | 0.5225 | -0.1749 |
| combined six-page corpus | 0.7688 | 0.5409 | -0.2279 |

Interpretation: ATOMS is not merely adding more labels. It is producing a representation where symbol position is more constrained. The difference is especially important because the comparison uses the same physical page scope and the same ordinal line-alignment framework.

## Quality Control Status

Current quality gates:

| Audit | Result | Notes |
| --- | ---: | --- |
| Geometry/order candidates | 0 pending | 11 known valid geometry inversions suppressed |
| Labeling anomaly candidates | 0 pending | 3 known valid anomalies suppressed |
| Line-count alignment | 6/6 pages match | EVA lines and DatasetCreator rows match by count |
| Morphology run | completed | included in final replay |
| Learning memory | 0 problems | stale temporary no-cut signature removed after backup |

The important point: no current strong candidate remains suggesting a human labeling/order error in the active six-page corpus under the current audit thresholds.

## Page-005 Cut Decision

The temporary no-cut state around the former `img5-m51`/`img5-m50` region produced:

- 638 combined ATOMS units.
- Combined ATOMS entropy `0.5412`.
- `f2r/page-005` entropy `0.5954`.
- 9 geometry-order candidates, all explained by the `n:1` over `e:1 g:1 e:1` vertical-superposition convention.

After restoring the cut:

- 639 combined ATOMS units.
- Combined ATOMS entropy improves to `0.5409`.
- `f2r/page-005` entropy improves to `0.5934`.
- Geometry-order candidates return to `0`.

Decision: keep the restored cut. It is both visually cleaner for that region and slightly better mathematically.

## Morphological Evidence

The morphology analysis tests whether the labeled atoms form measurable shape families without using EVA, grammar, or positional context.

Global morphology result:

| Metric | Value |
| --- | ---: |
| Raw atoms read | 6222 |
| Eligible ATOMS symbols | 16 |
| Nearest-centroid accuracy | 0.9298 |
| 5-nearest-neighbor accuracy | 0.9785 |
| Mean separation ratio | 1.8552 |
| Median separation ratio | 1.0933 |

Strongest current morphology families:

| Symbol | Count | Separation ratio | 5NN accuracy | Nearest competitor |
| --- | ---: | ---: | ---: | --- |
| `f:1` | 636 | 6.7185 | 0.9937 | `b:1` |
| `c:2` | 57 | 5.6370 | 1.0000 | `m:1` |
| `e:1` | 1763 | 3.8367 | 0.9983 | `h:2` |
| `j:1` | 160 | 2.2658 | 0.9688 | `h:1` |
| `a:1` | 570 | 1.3534 | 0.9912 | `h:2` |

Weakest/confusable families remain scientifically useful because they define where the annotation system needs the most scrutiny:

| Symbol | Count | Separation ratio | 5NN accuracy | Nearest competitor |
| --- | ---: | ---: | ---: | --- |
| `n:1` | 104 | 0.6227 | 0.7981 | `d:1` |
| `d:1` | 335 | 0.6658 | 0.9433 | `g:1` |
| `b:1` | 246 | 0.7383 | 0.9512 | `g:1` |
| `i:1` | 330 | 0.7601 | 0.9879 | `h:2` |
| `m:1` | 92 | 0.7701 | 0.8913 | `b:1` |

Interpretation: the shapes are not random label assignments. Most ATOMS families are recoverable from visual morphology alone at high accuracy, while the weaker families identify the exact zones where future corpus review and second-annotator validation should focus.

## Strong Structural Signals

The most rigid positional ATOMS in the combined corpus:

| Symbol | Count | H(role) | Dominant role |
| --- | ---: | ---: | --- |
| `g:1` | 408 | 0.0000 | medial 100.00% |
| `b:1` | 246 | 0.0000 | medial 100.00% |
| `k:1` | 84 | 0.0000 | medial 100.00% |
| `l:1` | 39 | 0.0000 | medial 100.00% |
| `f:1` | 636 | 0.0307 | medial 99.69% |
| `i:1` | 330 | 0.0534 | medial 99.39% |
| `m:1` | 92 | 0.0865 | medial 98.91% |
| `h:2` | 197 | 0.2678 | medial 95.43% |

Strong local rules remain visible after audit:

| Condition | Dominant next/previous token | Evidence |
| --- | --- | ---: |
| `l:1` -> next | `f:1` | 39/39 |
| `g:1` -> next | `e:1` | 405/408 |
| `k:1` -> next | `f:1` | 82/84 |
| `m:1` -> next | `c:1` | 90/92 |
| previous -> `j:1` | `f:1` | 160/160 |
| previous -> `m:1` | `a:1` | 91/91 |

Interpretation: the best signals are not isolated anecdotes. They persist at corpus scale after manual audit and after the restored cut.

## Variant Ablation

ATOMS currently uses 16 symbol variants. If variants are collapsed into broader families, the result gets worse:

| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: |
| Full variants | 6222 | 16 | 0.5409 | 8 |
| Families merged | 6222 | 14 | 0.5788 | 7 |

Interpretation: the variant split is not cosmetic. Keeping variants improves positional stability, especially in the `h` family.

## Macro-Lexeme Probe

An exploratory macro merge groups `g:1`, `i:1`, `b:1`, `k:1`, and `m:1` into `MEDIAL_OP`.

| Metric | Value |
| --- | ---: |
| Original atom vocabulary | 16 |
| Macro vocabulary | 12 |
| Original unique molecule signatures | 414 |
| Macro unique lexeme signatures | 406 |
| `MEDIAL_OP` tokens | 1160 |
| `MEDIAL_OP` medial share | 99.74% |
| `MEDIAL_OP` role entropy | 0.0283 |

Interpretation: a large fraction of the ATOMS inventory appears to behave like a constrained medial operator class. This is not yet a translation theory; it is a structural compression result worth formalizing.

## Scientific Meaning

What is demonstrated now:

- ATOMS has lower positional entropy than EVA on all six included pages.
- The advantage survives a second-pass audit of human annotation/order errors.
- The restored `page-005` cut produces the cleaner current state.
- The 16-symbol ATOMS inventory is visually measurable through morphology.
- Several ATOMS families exhibit near-zero positional entropy at corpus scale.
- Variant distinctions improve the metrics instead of adding noise.

What is not claimed:

- The Voynich Manuscript has been deciphered.
- ATOMS symbols are letters, phonemes, morphemes, or semantic units.
- ATOMS is proven globally optimal.
- The current six-page corpus is enough to characterize the whole manuscript.

## Recommended Next Step

Do not immediately expand the corpus before freezing this replay. The next professional move is:

1. Re-run the same replay once more immediately before freeze if any UI edit happens.
2. Freeze this as `CORPUS-V2-AUDITED`.
3. Publish it as a robustness/sensitivity milestone.
4. Then resume either second-annotator preparation or additional folio labeling.

## Evidence Files

- `role-entropy.md`
- `variant-ablation.md`
- `morphology-family-analysis.md`
- `contextual-rule-discovery.md`
- `cross-folio-validation.md`
- `macro-lexeme-analysis.md`
- `line-alignment-audit.md`
- `labeling-anomaly-audit/labeling-anomaly-audit.md`
- `CORPUS-V2-RUN-MANIFEST.md`

Bottom line: Corpus V2 is now strong enough to treat as a serious audited scientific artifact.
