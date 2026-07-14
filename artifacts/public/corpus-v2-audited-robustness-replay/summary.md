# CORPUS-V2-AUDITED Robustness Replay

**Status:** published | **Outcome:** supportive

## Question

After a complete six-folio human-label audit and stale learned-memory cleanup, do the main ATOMS/EVA structural results remain stable?

## Result

The audited six-folio corpus has 0 pending audit candidates and ATOMS remains lower entropy than EVA: 0.5409 vs 0.7688 weighted positional entropy.

## Interpretation

Supportive robustness evidence that documented human-label corrections and learned-memory cleanup did not weaken the main ATOMS structural signal.

## Limitations
- Single ATOMS annotator
- Six folios only
- Corpus audit does not prove decipherment or semantic interpretation
- Known valid rare structures are documented rather than removed

## Reproduce
```bash
npm.cmd run validate
```
```bash
npm.cmd run research:validate
```
```bash
npm.cmd run research:build
```
```bash
node EVAComparisonLab/scripts/run-corpus-v2-analysis.js --include-morphology
```

## Artifacts
- Report: `research/frozen/CORPUS-V2-AUDITED/reports/CEO-FINAL-CORPUS-V2-REPORT.md`
- Script: `EVAComparisonLab/scripts/run-corpus-v2-analysis.js`
- Table: `research/frozen/CORPUS-V2-AUDITED/corpus/atoms.tsv`
- Table: `research/frozen/CORPUS-V2-AUDITED/corpus/molecules.tsv`
- Table: `research/frozen/CORPUS-V2-AUDITED/corpus/rows.tsv`
- Table: `research/frozen/CORPUS-V2-AUDITED/corpus/folios.tsv`
- Table: `research/frozen/CORPUS-V2-AUDITED/v1-v2-metrics.tsv`
- Table: `research/frozen/CORPUS-V2-AUDITED/checksums.txt`
- Commit: `to-be-filled-by-corpus-v2-audited-tag`
- Tag: `corpus-v2-audited`
- Test folios: f1r, f1v, f2r, f2v, f3r, f47v
