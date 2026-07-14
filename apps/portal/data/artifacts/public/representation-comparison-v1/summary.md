# REPRESENTATION-COMPARISON-V1 Molecule-Paired Pilot

**Status:** published | **Outcome:** inconclusive

## Question

Can directly paired molecule-level EVA and ATOMS rows decide representation quality?

## Result

Coverage was too low: only 14 of 161 test molecules were paired.

## Interpretation

The pilot exposed the alignment problem and should not be used as the global EVA-vs-ATOMS result.

## Limitations
- Very low paired coverage
- Not a regional alignment
- Insufficient for global comparison

## Reproduce
```bash
npm.cmd run representation-comparison:v1
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/representation-comparison-v1/REPRESENTATION-COMPARISON-V1.md`
- Script: `GrammarDiscoveryLab/scripts/representation-comparison-v1.js`
- Table: `GrammarDiscoveryLab/out/representation-comparison-v1/representation-comparison-summary.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
