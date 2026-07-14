# GRAMMAR-V1 f2v Prospective Validation

**Status:** published | **Outcome:** supportive

## Question

Does the frozen grammar remain compatible with a later folio labeled after GRAMMAR-V1 was frozen?

## Result

f2v produced 7/7 clean observed substitution families with zero new slot values.

## Interpretation

Supportive prospective compatibility result, bounded by the same annotation and sample-size limits.

## Limitations
- Single ATOMS annotator
- Five-folio corpus
- Compatibility does not imply semantic interpretation

## Reproduce
```bash
npm.cmd run validate
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/reproducible-release-v1/f2v/GRAMMAR-V1-vs-f2v.md`
- Script: `GrammarDiscoveryLab/scripts/validate-release-v1.js`
- Table: `GrammarDiscoveryLab/out/reproducible-release-v1/f2v/grammar-v1-vs-f2v-substitution.tsv`
- Table: `GrammarDiscoveryLab/out/reproducible-release-v1/f2v/grammar-v1-vs-f2v-optional.tsv`
- Commit: `a57b727968cf27b0fdcb232cb31ed764bd7e3e49`
- Tag: `reproducible-release-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2v
