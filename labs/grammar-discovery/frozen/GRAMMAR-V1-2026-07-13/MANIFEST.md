# GRAMMAR-V1 Manifest

Frozen grammar candidate snapshot for the first molecular train/test validation.

## Freeze

- Freeze name: `GRAMMAR-V1-2026-07-13`.
- Train folios: `f1r,f1v,f47v`.
- Held-out test folio: `f2r`.
- Alphabet source: ATOMS V1, after `v1-validation-f2r`.
- Scope: molecule signatures, substitution slots, optional slots.

## Corpus

- Total molecules: `473`.
- Train molecules: `369`.
- Test molecules: `104`.

## Frozen Families

- Substitution families induced in train: `19`.
- Substitution families observed in test: `8`.
- Substitution families observed in test with no new slot values: `8`.
- Optional families induced in train: `55`.
- Optional families with base or expansion observed in test: `38`.

## Priority Family A

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
X in {empty, k:1, l:1}
```

- Train base count, X=empty: `7`.
- Train expansions: `18`; values: `k:1:10 l:1:8`.
- Test base count, X=empty: `3`.
- Test known expansions: `4`; values: `k:1:3 l:1:1`.
- Test new expansions: `0`.
- Expanded-frame train slot values: `k:1:10 l:1:8`.
- Expanded-frame test slot values: `k:1:3 l:1:1`; new=`0`.

## Scientific Reading

- This freeze does not claim translation, words, morphemes, or full Voynich grammar.
- It freezes a formal claim: train-induced molecular frames with restricted slots reappeared in a held-out folio.
- Future pages should be evaluated against these frozen families before being used to revise them.

## Files

- `grammar-v1-substitution-families.tsv`
- `grammar-v1-optional-families.tsv`
- `train-test-substitution-validation.tsv`
- `train-test-optional-validation.tsv`
- `FAMILY-A.md`
- `TRAIN-TEST-VALIDATION.md`
- `GRAMMAR-DISCOVERY-REPORT.md`
- `molecules-current.tsv`
- `signature-frequencies.tsv`
- `slot-families.tsv`
- `optional-families.tsv`
