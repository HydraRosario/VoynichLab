# VoynichLab Translator

This is the second engine.

The annotator answers:

`image -> romanization`

The translator answers:

`romanization -> etymological candidates -> semantic translation`

## Current Pipeline

1. Export a complete paragraph dataset from the annotator.
2. Run the multi-source etymology search.
3. Run the translation assembly.
4. Use the assembly to decide which roots are signal, weak signal, or noise.
5. Promote only defensible roots into `translator/roots.tsv`.
6. Re-run the strict translation pass.

## Command

From `TranslationLab`:

```bash
node scripts/etymology-search.js --romanizations inputs/page-003-paragraph-2_romanizations.txt --maxTokens 80 --out outputs/page-003-paragraph-2_raw-etymology.md --tsv outputs/page-003-paragraph-2_raw-etymology.tsv

node scripts/key-pressure-audit.js --user cases/page-003-paragraph-2/page-003_paragraph-2_user-segmentation-v2.tsv --etymology cases/page-003-paragraph-2/page-003_paragraph-2_user-v2_etymology.tsv --out outputs/page-003-paragraph-2_key-pressure-audit.md

node scripts/rank-segmentation-candidates.js --dataset ../DataSetCreator/evidence/paragraph-2-page-3/page-003_paragraph-2_dataset.json --etymology cases/page-003-paragraph-2/page-003_paragraph-2_user-v2_etymology.tsv --user cases/page-003-paragraph-2/page-003_paragraph-2_user-segmentation-v2.tsv --out outputs/page-003-paragraph-2_segmentation-ranking.md
```

The default dataset mode is now segmented. That means the translator consumes visual-part boundaries:

```text
o|hora|hi|irime
```

instead of only the flat unit:

```text
ohorahiirime
```

Flat mode still exists as a control:

```bash
node scripts/translate-romanization.js --dataset evidence/paragraph-2-page-3/page-003_paragraph-2_dataset.json --mode flat --out evidence/paragraph-2-page-3/page-003_paragraph-2_translation-flat-control.md
```

Scientific rule:

If segmented mode is interpretable and flat mode is ambiguous, root boundaries are part of the key.

## Important

Current external providers:

- Wiktionary
- Wikipedia
- Datamuse
- Omniglot

The seed roots are placeholders. They exist only to make the algorithm run.

The real work is building `roots.tsv` from the investigator's etymological method.

The assembly report is the guardrail against self-deception. Roots that are too
short, too common across languages, or missing explicit etymology are allowed as
hypotheses, but not as proof.
