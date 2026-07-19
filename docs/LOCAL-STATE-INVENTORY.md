# Local State Inventory

Status: workspace-only inventory.

Date: 2026-07-14

This document records large ignored local state found during the repository cleanup campaign. These files are not tracked by Git, but they matter operationally because they affect disk usage, local rebuild time, and DatasetCreator safety.

## Current Local State

Measured from the current workspace:

| Path | Files | Size | Git status | Verdict |
|---|---:|---:|---|---|
| `apps/dataset-creator/src-tauri/target/` | 10,549 | ~12.4 GB | ignored | Rust/Tauri build output; safe to regenerate, but deleting forces a slow rebuild |
| `apps/dataset-creator/manuscript-pages-yale/` | 213 | ~535 MB | ignored | Local manuscript source images; keep unless there is an external restore path |
| `apps/dataset-creator/backups/` | 11 | ~202 MB | ignored | DB safety backups from repair/cleanup work; keep until backup retention policy exists |
| `apps/portal/.vercel/` | 2 | ~0 MB | ignored | Local Vercel linkage; do not commit |
| `labs/eva-comparison/artifacts/visual-snapshots/current/` | 0 | 0 MB | ignored | Scratch snapshot output path; currently empty |
| `labs/eva-comparison/cases/corpus-v2-audited-current/` | 0 | 0 MB | ignored | Regenerated current corpus output path; currently empty |
| `research/audits/*-current/` | 0 | 0 MB | ignored | Scratch audit output paths; currently empty for checked paths |

Top-level workspace size is dominated by `apps/dataset-creator/`, mostly because of `src-tauri/target/`.

## Policy

Ignored local state falls into three categories:

| Category | Examples | Policy |
|---|---|---|
| Regenerable build output | `apps/dataset-creator/src-tauri/target/` | Can be deleted only as a deliberate local disk cleanup, never as a Git cleanup |
| Local source material | `apps/dataset-creator/manuscript-pages-yale/` | Keep unless a documented restore/download process exists |
| Safety backups | `apps/dataset-creator/backups/`, `apps/dataset-creator/*.db` backups | Keep until a retention/archive policy is written and verified |

## Do Not Confuse

Large ignored local state is not the same thing as tracked repository bloat.

The tracked repository is currently clean of build outputs, dependency folders, active DB files, and scratch current outputs. The large local footprint is mostly local development state.

## Recommended Later Cleanup

1. Add a DatasetCreator backup retention policy.
2. Decide whether old DB backups should be archived outside the repo workspace.
3. Add a local-only command or note for deleting `apps/dataset-creator/src-tauri/target/` when disk space is needed.
4. Document how to restore `apps/dataset-creator/manuscript-pages-yale/` before considering any local deletion.

