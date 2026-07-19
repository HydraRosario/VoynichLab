# NULL-CONTROL-V1

Purpose: estimate how often the clean GRAMMAR-V1 substitution result could occur under simple empirical null models that preserve the observed test opportunities and atom-frequency distribution.

This is a first control, not a final statistical proof. It tests whether `8/8` on `f2r` and `7/7` on `f2v`, with zero new substitution slot values, looks common or rare when slot values are sampled without structural restrictions.

## Inputs

- Frozen grammar: `frozen/GRAMMAR-V1-2026-07-13`.
- Test folios: `f2r`, `f2v`.
- Validation command rerun by this script: `node scripts/validate-release-v1.js`.
- Simulation iterations: `100000`.
- RNG seed: `20260713`.

## Null Models

### Exact-Known Empirical Null

For each observed family, preserve:

- the actual frozen known slot values for that family;
- the number of observed test opportunities;
- the empirical atom-frequency distribution of the tested folio.

Then draw random slot values from the folio's atom distribution. A family is clean only if every draw falls inside its actual frozen known-value set.

This is conservative because it gives the null model the real known values learned by GRAMMAR-V1.

### Size-Only Empirical Null

For each observed family, preserve:

- the number of known values, but not their identities;
- the number of observed test opportunities;
- the empirical atom-frequency distribution of the tested folio.

Then draw a random same-size known-value set and random slot values from the folio's atom distribution. This asks whether simply having small vocabularies of allowed values makes the result easy.

## Observed Result

| Folio | Observed substitution families | Observed opportunities | New slot values |
| --- | ---: | ---: | ---: |
| `f2r` | 8 | 17 | 0 |
| `f2v` | 7 | 17 | 0 |

## Control Results

| Control | Clean joint simulations | Iterations | Estimated probability |
| --- | ---: | ---: | ---: |
| Exact-known empirical null | 0 | 100000 | 0 (no hits; rough 95% upper bound < 3.0000e-5) |
| Size-only empirical null | 0 | 100000 | 0 (no hits; rough 95% upper bound < 3.0000e-5) |

Naive analytical estimate for the exact-known empirical null under independence assumptions: `7.4117e-36`.

## Per-Folio Exact-Known Probability

| Folio | Exact-known analytic probability |
| --- | ---: |
| `f2r` | 7.9639e-19 |
| `f2v` | 9.3066e-18 |

## Interpretation

Under this first control, the clean joint result is **extremely rare**.

Important limitation: this null samples slot values from the full empirical atom distribution of each folio. That is useful as a first sanity check, but it is probably too broad because real slot candidates may already be constrained by position, particle context, or morphology. A stronger next null should preserve positional class or local frame context before drawing replacement slot values.

This does not yet solve reviewer attack #2: all labels were produced by the project author. The next independent control remains a second annotator or a public ink-linked annotation audit.

## Source Tables

- `null-control-family-probabilities.tsv`
