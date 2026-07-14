# REPRESENTATION-COMPARISON-V2 Regional ATOMS-EVA Comparison

**Status:** published | **Outcome:** supportive

## Question

Does ATOMS preserve more held-out regional predictive structure than EVA under a matched local-context protocol?

## Result

ATOMS had lower normalized log-loss, higher top-1 accuracy, and lower unseen-context rate than EVA over aligned regions.

## Interpretation

Exploratory evidence that ATOMS-V1 captures transferable regional structure better than EVA under this protocol.

## Limitations
- Approximate EVA regional alignment
- Five folios
- Single ATOMS annotator
- Not proof of global optimality

## Reproduce
```bash
npm.cmd run representation-comparison:v2-regions
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/representation-comparison-v2-regions/REPRESENTATION-COMPARISON-V2-REGIONS.md`
- Script: `GrammarDiscoveryLab/scripts/representation-comparison-v2-regions.js`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v2-regions/representation-comparison-v2-summary.tsv`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v2-regions/representation-comparison-v2-region-scores.tsv`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v2-regions/representation-comparison-v2-corruption.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
