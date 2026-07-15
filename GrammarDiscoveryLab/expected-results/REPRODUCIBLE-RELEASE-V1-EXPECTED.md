# REPRODUCIBLE-RELEASE-V1 Expected Results

Maintainer replay command:

```bash
cd GrammarDiscoveryLab
npm.cmd run validate
```

Expected output:

| Test folio | Observed substitution families | Clean substitution families | New substitution slot values | Observed optional families | Clean optional families | New optional values |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `f2r` | 8 | 8 | 0 | 38 | 38 | 0 |
| `f2v` | 7 | 7 | 0 | 32 | 30 | 2 |

The decisive V1 condition is:

```text
f2r: 8/8 observed substitution families use known slot values.
f2v: 7/7 observed substitution families use known slot values.
```

Optional-slot novelty is reported separately and does not alter the substitution-slot result.

## Input Checksums

```text
80B61827D500B817E9ABC5509956E33B3E6FB9D68D0DFF06BB0757CA5E4A9C13  frozen/GRAMMAR-V1-2026-07-13/grammar-v1-substitution-families.tsv
377DEF6B8003E39227FB47BCB56FED3E97AEF22ADA3AAB52B5CBB19337F919C6  frozen/GRAMMAR-V1-2026-07-13/grammar-v1-optional-families.tsv
07C51D21490AB778FF3903CDACF958699C07C839E7380DF339850E142DC76959  frozen/GRAMMAR-V1-2026-07-13/molecules-current.tsv
9C94ECBBF632033F69D2DF69B98F027CF140E03C3E2A70B9531C90A1D6D12E0C  frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv
```
