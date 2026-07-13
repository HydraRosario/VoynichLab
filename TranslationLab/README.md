# VoynichLab TranslationLab

This is the translation and audit engine.

`DataSetCreator` answers:

```text
image -> labels -> romanizations
```

`TranslationLab` answers:

```text
romanizations -> candidate segmentations -> etymological roots -> translation hypotheses -> key pressure
```

In plain terms: this is the final-boss cherry-picking machine. It receives a
list of romanizations and tries many ways to split each word into etymological
roots across available sources. It is allowed to be opportunistic, but it must
log what it tried and why a candidate was chosen.

## Current Rule

Cherry picking is allowed only when it is logged.

That means the engine may try suspicious splits, alternate syllables, elisions,
mutations, and near roots, but every choice must produce an audit trail:

- what was tried
- what source supported it
- what repeated internally
- what failed
- what part of the romanization key is under pressure

## Pilot Commands

From `TranslationLab`:

```bash
npm run audit:pilot
```

This reads:

```text
inputs/page-003-paragraph-2_romanizations.txt
```

and writes:

```text
outputs/page-003-paragraph-2_raw-etymology.md
outputs/page-003-paragraph-2_raw-etymology.tsv
```

Existing paragraph-2 research moved here:

```text
cases/page-003-paragraph-2/
```

## Scientific Shape

The goal is not to avoid cherry picking completely. The goal is to make it
computational, repeatable, comparable, and falsifiable.

If a better translation appears after changing `mirriaa` into `merrio`, that is
not accepted silently. It becomes a proposed key mutation and must be tested
against other words, pages, and paragraphs.

## Reference Material

Foundational images and translation references live in:

```text
reference-images/
```
