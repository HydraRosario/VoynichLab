# Pilot Brief - Page 003 / Paragraph 2

This packet is now useful without annotating another paragraph.

## What Exists

- 23 romanized units
- 86 visual parts
- 199 stroke values
- 0 missing readings
- rule legend draft
- statistical audit
- translation-pass scaffold
- root workbench

## What This Can Prove Today

Not the full Voynich translation.

It can show:

- the method produces a complete structured reading for one paragraph
- the reading is decomposable into visual parts and strokes
- several stroke/color families are internally stable
- the paragraph can be converted into a root-analysis table
- the translation problem is now isolated: romanization -> etymological roots

## What This Cannot Prove Yet

- that the whole manuscript follows the same system
- that Zipf is confirmed
- that the semantic translation is correct
- that the roots are not cherry-picked

## Immediate Work With Existing Data

Do not annotate more today.

Use `page-003_paragraph-2_root-workbench.tsv`.

Fill the empty columns:

- `candidate_language`
- `candidate_root`
- `candidate_gloss`
- `confidence`
- `notes`

Start with the most frequent stroke and visual-part tokens, because those control the grammar:

- `h`
- `o`
- `ra`
- `te`
- `i`
- `l`
- `a`
- `e`
- `hora`
- `hete`
- `hra`

## Translation Standard

A proposed semantic translation is acceptable only if:

1. It maps to romanized units.
2. It uses roots listed in the workbench.
3. It explains repeated tokens consistently.
4. It marks uncertainty instead of hiding it.

## Next CTO Action

The next tool should consume the filled workbench and regenerate the translation pass using real roots, not placeholder roots.
