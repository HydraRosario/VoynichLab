# Functional Atlas Validation Record

Validation input: the six-folio Corpus V3 working export migrated from Corpus
V2. This is not a frozen Corpus V3 result.

## Input accepted

```text
particles             6222
atoms                 2459
molecules              639
folios                    6
PARTICLES-V1 labels      16
pair comparisons        120
composition candidates  101
```

Input fingerprint:

```text
422ed571cc234c27dfd38ba0511b206166454c65506d857ed6d09d3fdd68da49
```

## Retrospective 14-vs-16 result

```text
representation  vocabulary  role entropy  held-out normalized loss
16 labels               16      0.701700                  0.743490
14 families             14      0.707733                  0.753701
```

On this protocol, the historical 14-family counterfactual is worse on both
measures. This supports retaining the current visual distinctions for analysis;
it does not prove every individual label is correct.

## Pairwise equivalence

The largest raw similarity was `k:1 ↔ l:1` at `0.974794`. Under 50
deterministic within-image permutations its empirical p-value was `0.019608`,
but it did not survive correction across 120 comparisons (`q = 1.0`). No pair
currently survives the implemented false-discovery control.

This negative correction is important. Raw contextual resemblance is common
under the corpus's rigid positional structure, so high similarity cannot be
treated as equivalence by itself.

## Composition discovery

After excluding trivial candidates where `X` is already one member of `Z + Y`,
the strongest current exploratory candidates include:

```text
m:1 ≈ e:1 + b:1
j:1 ≈ i:1 + d:1
d:1 ≈ c:1 + h:1
n:1 ≈ e:1 + f:1
```

These are ranked external-context similarities inside atoms. Under 30
within-image permutations, the first four obtained raw empirical `p = 0.032258`,
but none survived false-discovery correction across 101 composition candidates;
their best corrected value was `q = 0.296188`. They therefore remain questions,
not findings.

## Rigid-role candidates

All 16 particle families scored above their own within-folio permutation null
under the current operator protocol (`q = 0.032258` for each family after
correction across 16 tests). This says that every retained family occupies a
more constrained structural role than labels randomly reassigned to the same
observed slots.

It does **not** distinguish linguistic signs from operators, modifiers, formula
components, or constraints created by the annotation system. The result is a
candidate-generating observation, not evidence for chemistry or meaning. The
highest current score belongs to `n:1` (`0.859674`; null mean `0.117387`).

## Structural grammar discovery

With particle identities frozen, the higher-level search retained:

```text
cross-folio atom frames          7
functional atom-role pairs      61
one-edit molecule relations     26
particle labels changed          0
```

The clearest constrained frames reproduce on all six folios:

```text
e:1 ?                 -> h:1 / f:1
? i:1 d:1             -> f:1 / e:1
a:1 ? c:1 a:1         -> b:1 / m:1
? f:1 i:1 d:1         -> k:1 / l:1
e:1 ? h:2             -> c:1 / c:2
```

This is the first concrete indication that the current corpus may support
conditional alternatives without globally merging any particle family. At the
atom level, `f:1 i:1 d:1` and `f:1 j:1` occupy similar molecule contexts
(`0.923393`) on all six folios. Molecule types containing those atoms are also
connected by a one-atom substitution with 14 versus 28 occurrences across five
common folios.

Other recurrent operations include optional initial `n:1`, substitution of
`k:1 f:1 i:1 d:1` by `l:1 f:1 i:1 d:1`, and insertion of the atom
`e:1 g:1 e:1`. These are discovery candidates, not grammar rules yet.

## Software verification

- Corpus V3 referential validation passes.
- Four synthetic tests pass.
- All 120 supported label pairs are evaluated deterministically.
- Composition candidates preserve atom boundaries.
- Operator candidates include a deterministic within-folio permutation null
  and false-discovery correction.
- Structural-rule candidates require repeated support across folios and never
  rewrite particle identities.
- Visual anomalies are exported separately from functional hypotheses.
- The local server returns the application and analysis with status 200.
- Generated output is explicitly marked `EXPLORATORY_NOT_FROZEN`.

## Remaining scientific gates

- Bootstrap confidence intervals by molecule and folio.
- Frequency-matched controls for repeated templates.
- Frequency-matched nulls and a frozen held-out replay for structural-rule
  rankings.
- Manuscript-context snapshot generation for V3 QC candidates.
- Human inspection before any annotation correction or research claim.
