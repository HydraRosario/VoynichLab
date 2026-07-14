# REPRESENTATION-COMPARISON-V3 ATOMS-EVA Ablations

**Status:** published | **Outcome:** supportive

## Question

Does the ATOMS advantage survive removal of exact regional sequence length?

## Result

ATOMS remained favorable under neighbor-only and coarse-position models.

## Interpretation

Exploratory evidence of stronger transferable local structure, with frequency concentration also contributing.

## Limitations
- Five folios
- Single ATOMS annotator
- Approximate EVA regional alignment
- Frequency distribution contributes to the advantage

## Reproduce
```bash
npm.cmd run representation-comparison:v3-ablations
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md`
- Script: `GrammarDiscoveryLab/scripts/representation-comparison-v3-ablations.js`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v3-ablations/representation-comparison-v3-summary.tsv`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v3-ablations/representation-comparison-v3-folio-results.tsv`
- Commit: `2ee61884bae295aa2ab99cb881148ea50a383672`
- Tag: `atoms-eva-ablations-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
