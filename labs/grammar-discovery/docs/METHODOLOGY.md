# Methodology

## Research Claim

`REPRODUCIBLE-RELEASE-V1` tests a narrow methodological claim:

> A frozen ATOMS-based molecular grammar induced before the held-out tests reappears in later folios with restricted substitution-slot values.

This is not a translation claim and does not assign phonetic, semantic, or linguistic values to the symbols.

## Pipeline

The research pipeline is:

```text
manual stroke labeling
-> ATOMS token sequences
-> molecule signatures
-> train/test family induction
-> frozen GRAMMAR-V1
-> held-out validation
```

`GRAMMAR-V1` was induced from molecule signatures, not from EVA labels. The validation scripts only compare held-out molecule signatures against frozen family tables.

## Train/Test Separation

`GRAMMAR-V1` was induced from:

```text
f1r, f1v, f47v
```

It was then evaluated against:

```text
f2r
```

`REPRODUCIBLE-RELEASE-V1` evaluates the same frozen grammar against the later prospective folio:

```text
f2v
```

No `f2v` molecule is used to induce, edit, or expand `GRAMMAR-V1`.

## Substitution Families

A substitution family is a set of same-length molecule signatures that share every token except one slot.

Example:

```text
e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1
```

If the frozen family observed only:

```text
k:1
l:1
```

then a held-out molecule validates the family when the same skeleton appears with `k:1` or `l:1` in the slot. A different slot value is reported as a new substitution-slot value.

## Optional Families

An optional family compares a base signature with an expanded signature produced by inserting one token.

Example:

```text
base:     e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1
expanded: e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1
```

Optional families are reported separately from substitution families. New optional values are not counted as substitution-slot contradictions.

## Maintainer Replay Command

The V1 validation can be replayed in the maintainer environment with:

```bash
cd labs/grammar-discovery
npm.cmd run validate
```

The scripts use Node.js built-in modules only and do not require external runtime dependencies.
This is not yet a certified clean-clone protocol for the full repository; see
`../../docs/PUBLIC-VERIFIABILITY.md` for the current public-verifiability
boundary.
