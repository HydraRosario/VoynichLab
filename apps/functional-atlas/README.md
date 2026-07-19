# Functional Atlas

Functional Atlas is VoynichLab's local instrument for finding possible human
annotation errors through uncommon visual and structural patterns. It narrows
thousands of annotations to a review queue; a person still decides whether a
case is wrong.

Its primary audit combines two independent signals: contextual audit tests
declared visual ambiguities against patterns learned from the other folios;
geometry audit finds traces that look unusual for their assigned family.

The current contextual pilot tests the historically ambiguous segmentation
`m:1` versus `e:1 + b:1`. Equivalence, composition, repetition, and grammar
remain secondary research views and cannot create corpus corrections.

It provides eight connected views:

- contextual annotation audit;
- corpus and 14-vs-16 representation overview;
- visual particle atlas generated from Corpus V3 geometry;
- pairwise functional equivalence;
- single-vs-composition candidates;
- repetition and structural-operator candidates;
- constrained atom slots, functional atom classes, and recurrent molecule
  transformations without changing particle identities;
- visual geometry outliers prepared for human review.

## Prepare an analysis

Functional Atlas consumes the `corpus/` directory produced by the Corpus V3
working-export runner. It never opens or modifies DataSetCreator's live DB.

```text
cd apps/functional-atlas
npm run analyze -- --corpus <working-export>/corpus --out out/analysis.json --qc-out out/qc-candidates.json
```

The output is always marked `EXPLORATORY_NOT_FROZEN`. Audit output is separately
marked `CANDIDATES_NOT_DECISIONS` and separates contextual candidates from
geometry candidates.

## Open the instrument

```text
npm run serve -- --analysis out/analysis.json
```

Open the local address printed by the command. An analysis JSON may also be
loaded through the interface without configuring the server.

## Scientific boundary

Rarity is not an error, and contextual preference is not visual proof. Atlas
never edits the corpus. A candidate may enter the Corpus V3 correction ledger
only after a person inspects the manuscript region and annotation geometry and
records a decision.

Functional similarity does not imply visual identity, phonetics, semantics, or
translation. A counterfactual merge never edits the corpus.

See `SCIENTIFIC-PROTOCOL.md` for metrics, interpretation vocabulary, and
safeguards.
