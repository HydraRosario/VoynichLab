# NULL-CONTROL-V2 Contextual Slot Simulation

**Status:** published | **Outcome:** negative

## Question

Does the clean grammar result remain rare after preserving local context?

## Result

The contextual empirical probability was approximately 0.099090.

## Interpretation

Negative result for the strongest grammar claim: local syntax explains much of the apparent slot compatibility.

## Limitations
- Still one family of null models
- Depends on observed local contexts
- Does not test visual annotation quality

## Reproduce
```bash
npm.cmd run null-control:v2
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/null-control-v2-contextual/NULL-CONTROL-V2-CONTEXTUAL.md`
- Script: `GrammarDiscoveryLab/scripts/null-control-v2-contextual.js`
- Table: `GrammarDiscoveryLab/out/null-control-v2-contextual/null-control-v2-contextual-family-probabilities.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
