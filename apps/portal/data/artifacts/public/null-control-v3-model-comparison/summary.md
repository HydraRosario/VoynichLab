# NULL-CONTROL-V3 Full Frame vs Local Context

**Status:** published | **Outcome:** negative

## Question

Does exact frozen frame identity improve held-out prediction beyond local context?

## Result

The exact frame model was slightly worse than local context on combined held-out log-loss.

## Interpretation

GRAMMAR-V1 remains descriptive, but its exact frame identity did not add predictive value beyond local syntax.

## Limitations
- Same held-out folios
- Same ATOMS annotation source
- Does not evaluate alternate grammar definitions

## Reproduce
```bash
npm.cmd run null-control:v3
```
```bash
npm.cmd run null-control:v3:diagnostics
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/null-control-v3/NULL-CONTROL-V3-MODEL-COMPARISON.md`
- Script: `GrammarDiscoveryLab/scripts/null-control-v3-model-comparison.js`
- Table: `GrammarDiscoveryLab/out/null-control-v3/null-control-v3-opportunities.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
