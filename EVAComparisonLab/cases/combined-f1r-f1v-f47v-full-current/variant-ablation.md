# Variant Ablation

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
