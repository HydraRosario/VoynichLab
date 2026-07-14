# VoynichLab Corpus V2 — Audited (Working)

**Status:** Under construction
**Based on:** CORPUS-V1 (datasetcreator-v1-frozen, 2026-07-13)
**Target:** CORPUS-V2-AUDITED (corrected derivative)
**Started:** 2026-07-14

---

## What this is

CORPUS-V2-AUDITED is a corrected derivative of the frozen VoynichLab V1 corpus.

Following completion of the initial manual annotation phase, visual inspection of grouped ATOMS examples revealed a small number of human annotation errors, including mislabeled strokes and accidental click artifacts.

A systematic quality-control phase was therefore conducted. Candidate anomalies were identified using geometric outlier detection and cross-class morphological comparison. All changes included in V2 were reviewed and confirmed by the human annotator.

The original V1 corpus remains preserved and reproducible. No historical experiment outputs were modified.

## Scope

| Property | Value |
|----------|-------|
| Base corpus | CORPUS-V1 (frozen 2026-07-13) |
| Folios | f1r, f1v, f2r, f2v, f47v |
| Total atoms (V1) | 4,585 |
| Atom classes | 16 (ATOMS-V1) |
| Excluded from scope | f3r (visual snapshots not yet exported at audit time) |

## Correction types

| Type | Meaning |
|------|---------|
| `relabel` | Atom label changed from one ATOMS class to another |
| `exclude_artifact` | Atom removed from corpus (accidental click, zero-area stroke, etc.) |

These are **instance-level corrections** only. ATOMS-V1 class definitions are unchanged.

## Audit methodology

See [AUDIT-METHODOLOGY.md](./AUDIT-METHODOLOGY.md) for the detailed procedure.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a human-readable summary of all changes.

## Full correction ledger

See [corrections.tsv](./corrections.tsv) for the machine-readable record of every change.

## Integrity

This is a working audit record, not a frozen corpus release. Final checksums should be generated only when `CORPUS-V2-AUDITED` is frozen.
