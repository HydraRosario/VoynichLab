# Next Actions - Page 003 / Paragraph 2

The paragraph is complete. Do not label another paragraph yet.

## Current Position

We now have one complete evidence chain:

`image -> paragraph -> units -> visual parts -> strokes -> romanization -> etymology metasearch -> translation assembly`

The current assembly is intentionally strict:

- paragraph evidence score: 0.48
- paragraph risk score: 0.85
- usable units: 3
- fragile units: 16
- too ambiguous units: 4
- strong segmented formulas: 9
- impossible flat reconstructions: 6

This means the pilot is not wasted, but it is not proven. The machine found repeated structure, while also warning that many short roots are dangerous false positives.

## Most Important Signals

Recurring formulas:

- `hora|hi`: units 1, 4, 14, 17, 21
- `o|hra`: units 3, 4, 9, 10
- `hi|irime`: units 1, 4, 7
- `hete|o`: units 2, 18, 20
- `hate|o`: units 10, 11, 15

Segmentation-only or mutation-sensitive formulas:

- `hete|hora|o`
- `hete|hora`
- `hora|o`
- `o|hra`
- `o|hi`

These are important because they suggest the visual segmentation contains information that the flat romanized string does not preserve cleanly.

Candidate roots worth inspecting first:

- `hete`
- `hora`
- `hra`
- `hi`
- `o`

Roots that are too risky to use as proof by themselves:

- one-letter roots
- two-letter roots
- roots found across many unrelated languages
- roots with no explicit etymology

## Next Engineering Move

Build the next translator layer:

1. Promote only roots/formulas that survive `page-003_paragraph-2_segmentation-signal.md`.
2. Build a mutation-rule table for visual formulas that do not equal the flat string.
3. Generate ranked phrase hypotheses from surviving formulas.
4. Compare those hypotheses against a flat-control reading.
5. Produce a falsifiable translation memo: what would make this paragraph fail the theory?

## Next Research Move

Do not translate the whole manuscript yet.

Use this paragraph to answer one question:

Can the same visual-rule families explain repeated romanized formulas without forcing the meaning afterward?
