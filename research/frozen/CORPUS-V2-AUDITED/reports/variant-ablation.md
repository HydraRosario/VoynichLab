# Variant Ablation

## Scope

- Input: `cases\corpus-v2-audited-current\atoms-current.tsv`
- Molecules: `639`

## Global Comparison

| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |
| --- | ---: | ---: | ---: | ---: |
| Full variants | 6222 | 16 | 0.5409 | 8 |
| Families merged | 6222 | 14 | 0.5788 | 7 |

Interpretation: negative `split_minus_merged` means variants reduce entropy versus merging the family; positive values mean the split is not helping positional stability yet.

## Variant Families

| Family | Variants | Tokens | H merged | H split weighted | Split - merged | Variant details |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `h` | 2 | 474 | 1.0000 | 0.5094 | -0.4906 | h:1:n277:H0.6812 h:2:n197:H0.2678 |
| `c` | 2 | 981 | 0.6889 | 0.6853 | -0.0036 | c:1:n924:H0.6976 c:2:n57:H0.4855 |
