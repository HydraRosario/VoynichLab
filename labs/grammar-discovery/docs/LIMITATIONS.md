# Limitations

## Scope

This release does not claim decipherment, translation, phonetic values, semantic values, or a complete Voynich grammar.

It supports a narrower claim: frozen ATOMS molecule families can be evaluated reproducibly against held-out folios.

## Single-Annotator Corpus

ATOMS-V1 was developed and annotated by the same researcher. This does not invalidate the result, but it is a methodological limitation.

Future validation should include:

- independent annotation;
- inter-annotator agreement;
- blind re-labeling of selected folios;
- explicit disagreement handling;
- public visual examples for each atom family.

## Dataset Size

The current combined working corpus contains:

```text
530 physical units
5087 atom tokens
16 symbol labels
```

The corpus is large enough to support exploratory and early prospective tests, but it is not a complete-manuscript sample.

## Label Corrections

Human labeling corrections occurred before freezes. Frozen artifacts should not be silently modified after publication; later corrections should create a new version identifier such as `ATOMS-V2` or `GRAMMAR-V2`.

## Image Rights

Voynich Manuscript images and institutional digitizations may have source-specific usage policies. This release should prefer derived annotations, coordinates, labels, and scripts over redistributing full image datasets unless rights are explicitly verified.

## Interpretation

Restricted slot reuse is evidence of compositional structure in this tokenization. It is not by itself proof that ATOMS symbols are phonemes, letters, morphemes, or semantic units.
