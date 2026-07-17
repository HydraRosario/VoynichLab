# Functional Atlas

Functional Atlas is VoynichLab's local instrument for testing whether
PARTICLES-V1 visual families also behave as distinct structural units.

It provides six connected views:

- corpus and 14-vs-16 representation overview;
- visual particle atlas generated from Corpus V3 geometry;
- pairwise functional equivalence;
- single-vs-composition candidates;
- repetition and structural-operator candidates;
- constrained atom slots, functional atom classes, and recurrent molecule
  transformations without changing particle identities;
- visual geometry outliers prepared for QC Review.

## Prepare an analysis

Functional Atlas consumes the `corpus/` directory produced by the Corpus V3
working-export runner. It never opens or modifies DataSetCreator's live DB.

```text
cd apps/functional-atlas
npm run analyze -- --corpus <working-export>/corpus --out out/analysis.json --qc-out out/qc-candidates.json
```

The output is always marked `EXPLORATORY_NOT_FROZEN`. QC output is separately
marked `CANDIDATES_NOT_DECISIONS`.

## Open the instrument

```text
npm run serve -- --analysis out/analysis.json
```

Open the local address printed by the command. An analysis JSON may also be
loaded through the interface without configuring the server.

## Scientific boundary

Functional similarity does not imply visual identity, phonetics, semantics, or
translation. A counterfactual merge never edits the corpus. Only separately
reviewed visual annotation errors may enter the Corpus V3 correction ledger.

See `SCIENTIFIC-PROTOCOL.md` for metrics, interpretation vocabulary, and
safeguards.
