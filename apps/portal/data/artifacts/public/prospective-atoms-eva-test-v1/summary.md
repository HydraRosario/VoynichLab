# Prospective ATOMS-EVA Test V1

**Status:** published | **Outcome:** supportive

## Question

Does the previously published ATOMS advantage over EVA replicate on a folio annotated after the protocol, models, metrics, and interpretation rules were frozen publicly?

## Result

On f3r, ATOMS had lower preregistered MODEL_1 normalized log-loss than EVA: 0.348262 vs 0.564957.

## Interpretation

Supportive prospective evidence that the previously published ATOMS-vs-EVA predictive advantage replicated on a newly annotated folio under frozen rules.

## Limitations
- Single ATOMS annotator
- Same regional alignment limitations as REPRESENTATION-ALIGNMENT-V1
- One prospective folio
- Not proof of decipherment or global optimality

## Reproduce
```bash
npm.cmd run prospective-atoms-eva:test -- --preflight
```
```bash
npm.cmd run prospective-atoms-eva:test -- --confirm-complete
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/PROSPECTIVE-ATOMS-EVA-TEST-V1.md`
- Script: `GrammarDiscoveryLab/scripts/prospective-atoms-eva-test-v1.js`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/model-results.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/subset-results.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/line-alignment-audit.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/aligned-regions.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/unresolved-regions.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/region-scores.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/corruption-results.tsv`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/folio-freeze-manifest.json`
- Table: `GrammarDiscoveryLab/out/prospective-atoms-eva-test-v1/checksums.txt`
- Commit: `8137d72d5b979d296f6def65b87f1cca1f48288a`
- Tag: `prospective-atoms-eva-test-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f3r
