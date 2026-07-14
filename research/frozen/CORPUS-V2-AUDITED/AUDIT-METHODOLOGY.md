# CORPUS-V2-AUDITED Audit Methodology

The audit campaign focused on three human-error surfaces:

1. atom label mistakes;
2. particle and molecule order mistakes;
3. stale learned-memory patterns created by temporary segmentation states.

The audit used visual QC ledgers, geometry-order anomaly checks, labeling anomaly checks, and learned-memory checks. Candidate anomalies were either corrected in DatasetCreator or marked as known valid exceptions when manual inspection confirmed that the unusual order was intentional.

Known-valid exceptions remain documented instead of hidden. This prevents repeated review of the same rare but valid structures while preserving the fact that they are unusual.

The final quality gate requires:

- zero pending labeling anomaly candidates;
- zero pending particle geometry-order candidates under the current rules;
- zero stale learned-memory rows;
- matching EVA/ATOMS line counts for the audited folios.
