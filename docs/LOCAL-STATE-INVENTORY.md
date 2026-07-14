# Local State Inventory

Status: workspace-only inventory.

Date: 2026-07-14

This document records large ignored local state found during the repository cleanup campaign. These files are not tracked by Git, but they matter operationally because they affect disk usage, local rebuild time, and DatasetCreator safety.

## Current Local State

Measured from the current workspace:

| Path | Files | Size | Git status | Verdict |
|---|---:|---:|---|---|
| `DataSetCreator/src-tauri/target/` | 10,549 | ~12.4 GB | ignored | Rust/Tauri build output; safe to regenerate, but deleting forces a slow rebuild |
| `DataSetCreator/manuscript-pages-yale/` | 213 | ~535 MB | ignored | Local manuscript source images; keep unless there is an external restore path |
| `DataSetCreator/backups/` | 11 | ~202 MB | ignored | DB safety backups from repair/cleanup work; keep until backup retention policy exists |
| `apps/portal/.vercel/` | 2 | ~0 MB | ignored | Local Vercel linkage; do not commit |
| `EVAComparisonLab/artifacts/visual-snapshots/current/` | 0 | 0 MB | ignored | Scratch snapshot output path; currently empty |
| `EVAComparisonLab/cases/corpus-v2-audited-current/` | 0 | 0 MB | ignored | Regenerated current corpus output path; currently empty |
| `research/audits/*-current/` | 0 | 0 MB | ignored | Scratch audit output paths; currently empty for checked paths |

Top-level workspace size is dominated by `DataSetCreator/`, mostly because of `src-tauri/target/`.

## Policy

Ignored local state falls into three categories:

| Category | Examples | Policy |
|---|---|---|
| Regenerable build output | `DataSetCreator/src-tauri/target/` | Can be deleted only as a deliberate local disk cleanup, never as a Git cleanup |
| Local source material | `DataSetCreator/manuscript-pages-yale/` | Keep unless a documented restore/download process exists |
| Safety backups | `DataSetCreator/backups/`, `DataSetCreator/*.db` backups | Keep until a retention/archive policy is written and verified |

## Do Not Confuse

Large ignored local state is not the same thing as tracked repository bloat.

The tracked repository is currently clean of build outputs, dependency folders, active DB files, and scratch current outputs. The large local footprint is mostly local development state.

## Recommended Later Cleanup

1. Add a DatasetCreator backup retention policy.
2. Decide whether old DB backups should be archived outside the repo workspace.
3. Add a local-only command or note for deleting `DataSetCreator/src-tauri/target/` when disk space is needed.
4. Document how to restore `DataSetCreator/manuscript-pages-yale/` before considering any local deletion.

