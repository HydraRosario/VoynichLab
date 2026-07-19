# VoynichLab V1 - Scientific Claims

This document defines the claim boundaries for the V1 paper. Every future paragraph should belong to one of these categories: demonstrated result, supported interpretation, open hypothesis, or explicit non-claim.

## Central V1 Claim

A frozen subglyph model induced recurrent structural frames with restricted internal variation, and every substitution family observed across two held-out folios reused only slot values defined before those folios were evaluated.

## Current Prospective Representation Claim

After the ATOMS/EVA regional-comparison protocol, metrics, model definitions, and interpretation rules were publicly frozen, ATOMS-V1 again outperformed EVA on the later annotated `f3r` target folio under the preregistered primary local-context metric.

## 1. Demonstrated by the Current Experiments

- ATOMS-V1 provides a fixed 16-symbol subglyph representation.
- GRAMMAR-V1 was induced using only `f1r`, `f1v`, and `f47v`.
- `f2r` and `f2v` were excluded from grammar induction.
- In `f2r`, 8 observed substitution families used only frozen slot values.
- In `f2v`, 7 observed substitution families used only frozen slot values.
- No new substitution-slot values appeared in either held-out folio.
- Family A reappeared in both held-out folios using only values already present in its frozen repertoire.
- The ATOMS/EVA prospective protocol for `f3r` was publicly preregistered before the target folio annotation was completed.
- The completed `f3r` run passed preregistration checksum verification and published V3 regression verification.
- In `f3r`, under preregistered `MODEL_1`, ATOMS had lower normalized held-out log-loss than EVA: `0.348262` versus `0.564957`.
- In the same `f3r` run, ATOMS had higher top-1 accuracy than EVA: `69.06%` versus `55.35%`.
- In the same `f3r` run, ATOMS had a lower unseen-context rate than EVA: `2.46%` versus `13.79%`.
- No out-of-vocabulary ATOMS symbols appeared in the final `f3r` export.
- The maintainer replay command for the V1 validation is:

```bash
cd labs/grammar-discovery
npm.cmd run validate
```

This command is not yet claimed as a certified clean-clone protocol for external
reviewers.

## 2. Supported, but Not Yet Established

- ATOMS-V1 may capture stable compositional constraints beneath conventional Voynich glyph segmentation.
- Some recurring sequences may be generated from conserved structural frames with restricted internal variation.
- The observed regularities may reflect a graphical, linguistic, scribal, or encoding system.
- The ATOMS representation may preserve structural information that conventional linear transcription systems partially obscure.
- Repeated cross-folio slot reuse suggests that at least some molecule-level patterns are not page-local artifacts.
- The prospective `f3r` result supports the interpretation that ATOMS-V1 preserves transferable local structure better than EVA under the current regional-alignment protocol.
- The strong performance of neighbor-based models suggests that local particle or symbol flow may be more informative than exact molecule-level frame identity in some contexts.

## 3. Open Hypotheses

- Some visual spaces may divide larger compositional structures rather than independent semantic words.
- Some molecule boundaries may interrupt larger local ATOMS structures rather than fully terminating them.
- A future boundary-continuity test should evaluate whether particle-level patterns continue across molecule boundaries.
- Restricted slots may encode functional distinctions.
- ATOMS may reveal a generative layer obscured by conventional transcription systems.
- Some atom variants may belong to higher-level macro-units while still preserving meaningful physical distinctions.
- Future folios may confirm, extend, or break GRAMMAR-V1 families; any revised grammar must use a new version identifier.

## 4. Not Claimed

- The Voynich Manuscript has been deciphered.
- ATOMS are letters or phonemes.
- Molecular units are words.
- Restricted slots are morphemes.
- The underlying system is necessarily linguistic.
- GRAMMAR-V1 describes the entire manuscript.
- EVA is mathematically invalid in all contexts.
- The current corpus is free from human annotation bias.
- The current results remove the need for independent annotation or external replication.
- ATOMS-V1 is proven to be globally superior to EVA for every Voynich analysis.
- Regional ATOMS/EVA comparisons prove exact token-level alignment between the two representations.

## Working Rule for the Paper

The paper should argue only from demonstrated claims to carefully bounded interpretations. Speculation belongs in the open-hypothesis layer unless a reproducible experiment moves it upward.
