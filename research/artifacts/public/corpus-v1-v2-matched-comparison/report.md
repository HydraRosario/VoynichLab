# Corpus V1 to V2 matched-folio comparison

## Question

On the three folios present in the official frozen V1 corpus, how did ATOMS positional entropy change after the Corpus V2 annotation audit?

## Matched scope

- Folios: `f1r`, `f1v`, `f47v`
- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- V1 input: frozen DatasetCreator database from `VOYNICHLAB-V1-FROZEN-2026-07-13`
- V2 input: frozen `CORPUS-V2-AUDITED` atom table, filtered to the same pages
- Metric: weighted relative positional entropy from the same `role-entropy.js` implementation

## Result

| Version | Physical units | Atom tokens | Vocabulary | Weighted relative positional entropy |
| --- | ---: | ---: | ---: | ---: |
| V1 frozen | 364 | 3558 | 16 | 0.3365 |
| V2 audited | 371 | 3621 | 16 | 0.3342 |

V2 minus V1 is **-0.0023** (-0.68%). Lower entropy means ATOMS labels are more concentrated in consistent structural roles.

## Interpretation

This is a like-for-like comparison of the three folios frozen in V1. It does not compare all six V2 folios with a six-folio V1, because no official six-folio V1 freeze exists. The result measures how the audited annotations changed positional regularity on the shared historical scope.

## Reproduction

`node EVAComparisonLab/scripts/run-corpus-v1-v2-matched-comparison.js`

## Integrity

Inputs are read-only frozen artifacts. Generated tables preserve the exact matched rows used by the calculation.
