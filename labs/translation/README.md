# VoynichLab TranslationLab

> **Status: isolated exploratory workspace.** Nothing in this directory is a
> validated translation, a decipherment result, or evidence supporting the
> current public ATOMS claims. TranslationLab is not part of the current portal
> narrative or published research pipeline.

This is an early hypothesis and falsification workspace. It is preserved so
speculative attempts, failed segmentations, and key changes remain inspectable
instead of being confused with validated results or silently discarded.

Promotion into the public evidence record would require a named protocol,
frozen inputs, explicit falsification criteria, a registered experiment, and a
separate review. None has occurred yet.

## Experimental purpose

`DataSetCreator` answers:

```text
image -> labels -> romanizations
```

`TranslationLab` answers:

```text
romanizations -> candidate segmentations -> etymological roots -> translation hypotheses -> key pressure
```

In plain terms: this is a deliberately adversarial cherry-picking audit. It receives a
list of romanizations and tries many ways to split each word into etymological
roots across available sources. It is allowed to be opportunistic, but it must
log what it tried and why a candidate was chosen.

## Current Rule

Cherry picking is allowed only when it is logged.

Logging a hypothesis makes it auditable; it does not make it evidence.

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
