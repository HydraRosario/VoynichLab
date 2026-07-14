# Labeling Anomaly Audit

Purpose: find likely human labeling/order mistakes before using the data for stronger metrics.

This is not an automatic correction list. It only flags cases where the current corpus has a dominant ordering pattern and a rare variant with the same atom inventory.

## Parameters

- Images: page-003.jpg, page-004.jpg, page-005.jpg, page-006.jpg, page-007.jpg, page-094.jpg
- Minimum support per inventory: 4
- Max rare count: 2
- Max rare ratio: 0.18
- Learned-pattern memory included: yes
- Known anomalies list: `cases\known-labeling-anomalies.tsv`

## Summary

- Candidates: 0
- High priority: 0
- Medium priority: 0
- Known anomalies suppressed from pending list: 3
- Scopes: particle order and molecule particle-order

## Top Candidates

No strong candidates found with current thresholds.


Full table: `labeling-anomaly-audit.tsv`

Known anomalies table: `labeling-anomaly-known.tsv`
