# GrammarDiscoveryLab

Reproducible grammar-validation lab for VoynichLab ATOMS.

This package does not translate the Voynich Manuscript. It validates whether frozen ATOMS molecule families from `GRAMMAR-V1` reappear in held-out folios with only previously observed slot values.

## Reproducible Release V1

From a clean clone:

```bash
cd GrammarDiscoveryLab
npm install
npm run validate
```

Expected summary:

```text
f2r: 8/8 observed substitution families clean; new slot values=0
f2v: 7/7 observed substitution families clean; new slot values=0
```

The command writes reports to:

```text
out/reproducible-release-v1/
```

## Node Version

Validated locally with Node.js `v24.13.0`. The release scripts use only Node built-in modules and have no runtime package dependencies.

## Frozen Inputs

- `frozen/GRAMMAR-V1-2026-07-13/`: frozen grammar snapshot.
- `frozen/GRAMMAR-V1-2026-07-13/grammar-v1-substitution-families.tsv`: the 19 frozen substitution families.
- `frozen/GRAMMAR-V1-2026-07-13/grammar-v1-optional-families.tsv`: the 55 frozen optional families.
- `frozen/GRAMMAR-V1-2026-07-13/molecules-current.tsv`: frozen molecule table containing the original `f2r` held-out folio.
- `frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv`: frozen molecule table for the later `f2v` prospective folio.

`npm run validate` does not induce new grammar families. It only evaluates held-out molecule signatures against the frozen families above.

## Formal Definitions

### Molecule

A molecule is an ordered ATOMS token sequence exported from DatasetCreator, for example:

```text
e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1
```

### Substitution Family

A substitution family is a same-length set of molecule signatures that share all positions except one slot.

Example:

```text
e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1
```

with known slot values:

```text
k:1
l:1
```

### Known Slot Value

A slot value is known when it appears in the frozen `GRAMMAR-V1` training-derived family. A held-out molecule validates the family when it matches the skeleton and uses one of those known values.

### New Slot Value

A new slot value is a value observed in the held-out folio at a frozen slot but absent from the frozen family value set. New values are not automatically errors, but they are weaker evidence for V1 and must be reported.

### Optional Family

An optional family is a pair of observed signatures where inserting one token into a base skeleton creates an expanded form.

Example:

```text
base:     e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1
expanded: e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1
```

The optional value is `k:1`.

## Train/Test Separation

`GRAMMAR-V1` was induced from:

```text
f1r, f1v, f47v
```

It was first tested against:

```text
f2r
```

The later prospective test evaluates the same frozen grammar against:

```text
f2v
```

No `f2v` molecule is used to induce or modify `GRAMMAR-V1`.

## Output Files

After `npm run validate`:

- `out/reproducible-release-v1/VALIDATION-SUMMARY.md`
- `out/reproducible-release-v1/f2r/GRAMMAR-V1-vs-f2r.md`
- `out/reproducible-release-v1/f2r/grammar-v1-vs-f2r-substitution.tsv`
- `out/reproducible-release-v1/f2r/grammar-v1-vs-f2r-optional.tsv`
- `out/reproducible-release-v1/f2v/GRAMMAR-V1-vs-f2v.md`
- `out/reproducible-release-v1/f2v/grammar-v1-vs-f2v-substitution.tsv`
- `out/reproducible-release-v1/f2v/grammar-v1-vs-f2v-optional.tsv`

## Scientific Documentation

- `docs/METHODOLOGY.md`: exact validation method and train/test separation.
- `docs/ATOMS-V1-SPECIFICATION.md`: frozen ATOMS-V1 symbol inventory used by this release.
- `docs/LIMITATIONS.md`: scope limits, single-annotator status, image-rights caveat, and interpretation boundaries.
- `expected-results/REPRODUCIBLE-RELEASE-V1-EXPECTED.md`: expected validation table and input checksums.

## Open Science Statement

This work is published as a gift to the scientific community.

Long live open source. Long live reproducible evidence. Science should not be a private toll road, a prestige market, or a comfortable consensus machine. It should be a public method for forcing ideas to answer to data.

VoynichLab is offered in that spirit: reason over authority, measurements over dogma, reproducibility over belief, and curiosity over institutional comfort. Anyone who wants to challenge this work should do so with better data, better arguments, and runnable evidence.

No sacred claim, academic habit, political fashion, inherited doctrine, or profitable mythology should stand above inspection. Anti-scientific and genocidal ideologies deserve no shelter from reason.

Hail open science.

## Research Status

This release supports a methodological claim:

> A stroke-based ATOMS representation reveals molecule frames with restricted slots that reappear in held-out folios.

It does not claim decipherment, phonetic values, semantic translation, or a complete Voynich grammar.
