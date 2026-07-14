# NULL-CONTROL-V1 Broad Slot Simulation

**Status:** published | **Outcome:** inconclusive

## Question

How often does a broad null model reproduce the clean f2r and f2v grammar result?

## Result

No simulation out of 100000 reproduced the joint clean result, but the null was too broad.

## Interpretation

Exploratory only: the model allowed structurally implausible slot values and therefore overstated surprise.

## Limitations
- Over-broad slot inventory
- Naive independence estimate not accepted as main p-value

## Reproduce
```bash
npm.cmd run null-control:v1
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/null-control-v1/NULL-CONTROL-V1.md`
- Script: `GrammarDiscoveryLab/scripts/null-control-v1.js`
- Table: `GrammarDiscoveryLab/out/null-control-v1/null-control-family-probabilities.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
