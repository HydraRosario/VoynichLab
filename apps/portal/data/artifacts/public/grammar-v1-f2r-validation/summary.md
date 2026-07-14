# GRAMMAR-V1 f2r Held-Out Validation

**Status:** published | **Outcome:** supportive

## Question

Do frozen GRAMMAR-V1 substitution families reappear in the first held-out folio using only known slot values?

## Result

f2r produced 8/8 clean observed substitution families with zero new slot values.

## Interpretation

Supportive evidence that some ATOMS molecular frames recur outside the training folios.

## Limitations
- Single ATOMS annotator
- Small number of observed families
- Not a decipherment test

## Reproduce
```bash
npm.cmd run validate
```

## Artifacts
- Report: `GrammarDiscoveryLab/out/reproducible-release-v1/f2r/GRAMMAR-V1-vs-f2r.md`
- Script: `GrammarDiscoveryLab/scripts/validate-release-v1.js`
- Table: `GrammarDiscoveryLab/out/reproducible-release-v1/f2r/grammar-v1-vs-f2r-substitution.tsv`
- Table: `GrammarDiscoveryLab/out/reproducible-release-v1/f2r/grammar-v1-vs-f2r-optional.tsv`
- Commit: `a57b727968cf27b0fdcb232cb31ed764bd7e3e49`
- Tag: `reproducible-release-v1`
- Train folios: f1r, f1v, f47v
- Test folios: f2r
