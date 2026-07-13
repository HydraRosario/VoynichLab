# REPRODUCIBLE-RELEASE-V1 Manifest

Purpose: make the `GRAMMAR-V1` validation reproducible from a clean repository clone.

## Command

```bash
cd GrammarDiscoveryLab
npm install
npm run validate
```

## Expected Results

```text
f2r:
8/8 observed substitution families use known slot values
0 new substitution slot values

f2v:
7/7 observed substitution families use known slot values
0 new substitution slot values
```

## Frozen Grammar

Source:

```text
frozen/GRAMMAR-V1-2026-07-13
```

The validation command reads:

- `grammar-v1-substitution-families.tsv`
- `grammar-v1-optional-families.tsv`
- `molecules-current.tsv`

It does not run grammar induction and does not alter the frozen family lists.

## Prospective f2v Input

File:

```text
frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv
```

This is a frozen molecule table for `f2v/page-006.jpg`, generated after page 6 labeling was completed and after the pending human-error audit returned zero pending candidates.

## Interpretation

The release tests a narrow claim:

> Frozen molecular slot families from `GRAMMAR-V1` reappear in held-out folios with no new substitution-slot values.

It does not claim translation or final grammar.

Optional-slot rows may contain new optional values; these are reported separately and are not counted as substitution-slot contradictions.
