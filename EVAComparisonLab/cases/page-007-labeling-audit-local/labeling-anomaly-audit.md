# Labeling Anomaly Audit

Purpose: find likely human labeling/order mistakes before using the data for stronger metrics.

This is not an automatic correction list. It only flags cases where the current corpus has a dominant ordering pattern and a rare variant with the same atom inventory.

## Parameters

- Images: page-007.jpg
- Minimum support per inventory: 3
- Max rare count: 1
- Max rare ratio: 0.2
- Learned-pattern memory included: no
- Known anomalies list: `EVAComparisonLab\cases\known-labeling-anomalies.tsv`

## Summary

- Candidates: 0
- High priority: 0
- Medium priority: 0
- Known anomalies suppressed from pending list: 0
- Scopes: particle order and molecule particle-order

## Top Candidates

No strong candidates found with current thresholds.


Full table: `labeling-anomaly-audit.tsv`

Known anomalies table: `labeling-anomaly-known.tsv`
