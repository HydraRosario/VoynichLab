# Particle Geometry Order Audit

Purpose: find molecules whose persisted particle order moves backward against the visual left-to-right geometry.

This is a geometry audit, not a grammar audit. It is designed for the failure mode where recalc or learned molecule-order memory leaves a molecule in a plausible but visually wrong particle order.

## Parameters

- Images: page-003.jpg, page-004.jpg, page-005.jpg, page-006.jpg, page-007.jpg, page-094.jpg
- Minimum particles per molecule: 2
- Inversion tolerance: 8px
- Vertical tolerance for comparable pairs: 42px
- Token-equivalent inversions included: no
- Known anomalies list: `cases\known-particle-geometry-anomalies.tsv`
- Accepted `n:1` over `e:1 g:1 e:1` convention: enabled. When enabled, `n:1` may precede `e:1 g:1 e:1` if the `n:1` particle is visually above and horizontally near that base particle. This suppresses that specific vertical-superposition layout from geometry-order error reports, without changing corpus data.

## Summary

- Candidates: 0
- High priority: 0
- Medium priority: 0
- Known anomalies suppressed from pending list: 11

## Top Candidates

No particle-order geometry inversions found with current thresholds.


Full table: `particle-geometry-order-audit.tsv`

Known anomalies table: `particle-geometry-order-known.tsv`
