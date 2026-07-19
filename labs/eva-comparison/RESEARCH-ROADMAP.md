# Research Roadmap

## Objective

Defend a physical-tokenization model for selected Voynich folios.

The near-term claim is narrow:

> A physically grounded tokenization can describe visible manuscript structure more stably than EVA on the same complete folios.

Translation and romanization remain deferred until the token inventory survives measurement, visual audit, and out-of-sample validation.

## Active Dataset

- `page-003.jpg`: complete `f1r`.
- `page-004.jpg`: complete `f1v`.
- `page-005.jpg`: complete `f2r`.
- `page-006.jpg`: complete `f2v`.
- `page-007.jpg`: complete `f3r`.
- `page-094.jpg`: complete `f47v`.
- Frozen public corpus: `../research/frozen/CORPUS-V2-AUDITED`.
- Published reports: `../../research/artifacts/public`.
- Regenerated local cases: `cases/*-current`.
- Known anomalies: `../research/audits/known-labeling-anomalies.tsv`.
- Regenerated local visual exports: `artifacts/visual-snapshots/current`.

## Research Layers

1. Physical tokenization
   - Atoms and variants.
   - Particles.
   - Molecules.
   - Program rows.
   - Stable row/order export from DatasetCreator.

2. Graphical grammar
   - Positional rigidity.
   - Conditional placement rules.
   - Particle-internal dependencies.
   - Molecule-scope dependencies.
   - Cross-folio survival of rules.

3. Visual validation
   - Snapshot library.
   - Morphology-only classification.
   - Representative and outlier inspection.

4. Romanization and semantics
   - Deferred.
   - Must not be used to justify tokenization.

## Metrics Battery

Current:

- Initial/medial/final role entropy.
- Relative Shannon entropy.
- Rigid-symbol counts.
- Particle and molecule contextual rule discovery.
- Molecule-neighbor adjacency.
- Conditional entropy for previous/next token prediction.
- Variant ablation with family-merged controls.
- Macro-lexeme analysis.
- Morphology-only classification.
- Cross-folio validation matrix.
- Human-labeling anomaly audit with known-anomaly suppression.

Next:

- Mutual information between adjacent atoms.
- Markov predictability inside particles and molecules.
- Compression comparison between EVA and physical tokens.
- Bootstrap confidence intervals as sample size grows.
- Out-of-sample page validation under a frozen V1 manual.

## Falsification Conditions

- New labeled folios raise physical-token entropy until it matches EVA.
- Strong rules collapse outside the discovery folios.
- Rules depend on accidental row grouping or manual cleanup.
- Variant splits lower entropy but fail visual/morphological validation.
- A second annotator cannot reproduce the same atom/particle/molecule structure.

## Protocol

Every run must report:

- DatasetCreator DB source.
- Images included.
- EVA source and full folio/line range.
- Physical unit count.
- EVA token count.
- Program row count.
- Known-anomaly suppressions.
- Whether count mismatches were preserved.

Never silently normalize mismatches. A mismatch is evidence to inspect.

## Work Queue

1. Keep `npm.cmd run corpus:v2` as the single reproducible entry point.
2. Curate representative snapshots for every active atom.
3. Add boundary examples for cut/join decisions.
4. Add a blind-labeling checklist for a second annotator.
5. Freeze V1 before adding the next folio.
6. Validate rules out of sample before changing the alphabet again.
