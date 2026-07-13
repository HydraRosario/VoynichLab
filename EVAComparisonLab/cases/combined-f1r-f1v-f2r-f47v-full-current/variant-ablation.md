# Variant Ablation

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
