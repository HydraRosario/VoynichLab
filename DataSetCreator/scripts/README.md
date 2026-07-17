# DataSetCreator Script Registry

This directory contains local inspection and repair scripts for the DatasetCreator SQLite database. These scripts are not part of the public research pipeline. Treat them as emergency tooling around the live annotation database.

## Safety Rules

- Do not run a repair script while DataSetCreator is open.
- Do not run any DB-writing script unless the intended table changes are understood.
- DB-writing scripts must create a backup before mutation.
- New repair scripts must support dry-run by default and require explicit `--apply`.
- Prefer read-only audit scripts first; repair scripts should be the last step.

## Scripts

| Script | Status | DB access | Tables touched | Purpose |
|---|---|---|---|---|
| `inspect-recent-atoms.cjs` | utility | read-only | `atoms`, `images` | Lists recent `j:1` atoms and recent atom-family groups. Historical debugging helper from the `j:2`/`n:1` cleanup period. |
| `inspect-paint-batch.cjs` | utility | read-only | `atoms`, `images` | Inspects one suspicious paint batch by `created_at`, image, family, and config. |
| `cleanup-contaminated-paint-batch.cjs` | repair-current | write with dry-run default | `labels`, `atoms`, `regions`, `particles`, `molecules` | Deletes one contaminated paint batch only when candidate molecules contain no non-batch atoms. Requires `--apply` and writes a backup first. |
| `cleanup-stale-merge-patterns.cjs` | historical-repair | writes immediately | `particle_merge_patterns` | Historical cleanup for hardcoded stale merge signatures, including retired `j:2` patterns. Do not use for new cleanup; use the EVAComparisonLab learned-memory audit/cleanup path instead. |
| `repair-page094-row-overrides.cjs` | historical-repair | writes immediately | `particle_row_overrides` | One-off page-094 row override repair using a hardcoded timestamp. Do not use unless reconstructing that exact historical incident from backup. |
| `migrate-v2-to-v3.cjs` | current migration | reads V2; creates a separate V3 file | all canonical V3 tables | Creates a new particle -> atom -> molecule database, an ID crosswalk, and a validation report. Refuses to overwrite either its source or an existing target. |
| `inspect-v3-db.cjs` | current validation | read-only | all canonical V3 tables | Reports schema version, hierarchy counts, identifier-map coverage, unassigned particles, canonical atom IDs, and foreign-key violations. |

## Current Preferred Cleanup Path

For learned-memory cleanup, use the audited path outside this directory:

```powershell
node EVAComparisonLab/scripts/learning-memory-audit.js
node EVAComparisonLab/scripts/cleanup-stale-learning-memory.js
```

The cleanup script is dry-run by default and only writes when `--apply` is passed.

## Future Cleanup

Before changing or removing these scripts, document:

- whether the script reads or writes the live DB;
- exact tables modified;
- whether it has dry-run behavior;
- whether it creates a backup;
- whether its target condition is still possible in the current schema/corpus.
