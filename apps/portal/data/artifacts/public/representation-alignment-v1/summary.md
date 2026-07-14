# REPRESENTATION-ALIGNMENT-V1 Regional Alignment

**Status:** published | **Outcome:** methodological

## Question

Can EVA and ATOMS be compared over shared manuscript regions without assuming one-to-one token identity?

## Result

The alignment produced 209 aligned regions, 15 unresolved regions, 100% ATOMS coverage, and zero crossing alignments.

## Interpretation

Methodological bridge enabling regional EVA-vs-ATOMS comparison; not proof of exact token boundaries.

## Limitations
- Approximate EVA spans
- Regional not token-exact
- Depends on current folio mapping

## Reproduce
```bash
npm.cmd run representation-alignment:v1
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/representation-alignment-v1/REPRESENTATION-ALIGNMENT-V1.md`
- Script: `GrammarDiscoveryLab/scripts/representation-alignment-v1.js`
- Table: `GrammarDiscoveryLab/out/representation-alignment-v1/aligned-regions.tsv`
- Table: `GrammarDiscoveryLab/out/representation-alignment-v1/unresolved-regions.tsv`
- Commit: `c1bd90e8e8cb64f2b5bc9c72f50e62719cb533a9`
- Tag: `atoms-eva-regional-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r, f2v
