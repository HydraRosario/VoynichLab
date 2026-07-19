# VoynichLab Research Plan

This is the operating plan. Do not ask "what now?" after each paragraph; follow the pipeline.

Scientific stance:

The project must test the shorthand hypothesis, not assume it is true. The CTO role is to build tools that can either strengthen the method or expose contradictions.

No strong public claim is allowed until it survives:

- internal consistency checks
- held-out paragraph testing
- statistical controls
- explicit rule documentation

## Phase 1 - Capture

Goal: annotate one paragraph completely.

Status: done for page 003 / paragraph 2.

Completion criteria:

- every unit has a reading
- every unit has visual parts
- every visual part has a reading
- every visual part has strokes
- every stroke has a reading

## Phase 2 - Internal Consistency

Goal: turn the finished paragraph into rules.

Current target: `paragraph-2-page-3`.

Warning: this paragraph is a pilot, not proof. Entropy and Zipf are exploratory at this sample size.

Actions:

1. Generate `*_analysis.md`.
2. Identify stable colors.
3. Identify ambiguous colors.
4. Convert ambiguities into explicit rules.
5. Produce a first color/rule legend.

Current findings:

- `#64b4dc` is stable as `o`.
- `#4a9e6a` is stable as `ra`.
- `#56c0a8` is stable as `a`.
- `#f2e45c` is stable as `e`.
- `#b48cdc` is stable as `i`.
- `#ffffff` is stable as `me`.
- `#dc7864` is the first major rule target: observed as `h`, `t`, and `te`.
- `#d4a04a` is a shorthand curve-ending family: `rin/rim/rine/rime`.
- `#2f7df6` is a compact shorthand family: `mirriaa/mirrii/nirriaa/nirrii`.

## Phase 3 - Rule Layer In App

Goal: the app must stop storing only final readings and start storing why a reading happens.

Add fields for strokes:

- base family
- observed value
- visual variant
- rule id
- rule note

Example category, not final truth:

- base: `h`
- observed: `t`
- rule: contextual mutation

The point is not to force the theory. The point is to preserve the investigator's explanation at the exact visual location where the rule applies.

## Phase 4 - Second Paragraph Test

Goal: annotate a second paragraph only after phase 2 produces a first rule legend.

The second paragraph is not more data. It is a test.

Use it to ask:

- do stable colors remain stable?
- do red mutations behave the same way?
- do `rin/rim/rine/rime` variants follow a pattern?
- do `mir/nir` variants follow a pattern?

## Phase 5 - Model Preparation

Goal: train assistants, not miracles.

First model tasks:

- crop visual parts
- group visually similar strokes
- suggest color/value candidates
- flag contradictions

Do not start with full translation.

## Phase 6 - Public Evidence

Goal: produce a defensible packet for outside review.

A valid packet contains:

- manuscript source image
- annotation dataset
- human dossier
- consistency analysis
- rule legend
- second paragraph test result

This is the first thing that can be shown to another researcher without relying on private intuition.
