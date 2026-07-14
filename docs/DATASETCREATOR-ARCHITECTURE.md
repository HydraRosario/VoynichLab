# DataSetCreator Architecture Map

Status: read-only architecture audit.

Date: 2026-07-14

This document maps DataSetCreator without changing its code or local data. DataSetCreator is the corpus production tool; treat it as protected infrastructure.

## Safety Boundary

Do not casually move, delete, or rewrite:

- local SQLite databases under the Tauri app data directory;
- `DataSetCreator/*.db`;
- `DataSetCreator/backups/`;
- `DataSetCreator/manuscript-pages-yale/`;
- learned order/merge memory tables;
- row guide and row override tables.

Any DB-writing cleanup must have:

1. a read-only audit step;
2. an explicit apply step;
3. an automatic backup;
4. exact table names in its documentation;
5. validation after reopening DataSetCreator.

## Runtime Shape

DataSetCreator is a Tauri 2 desktop app.

| Layer | Files | Role |
|---|---|---|
| Shell/runtime | `DataSetCreator/package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` | Tauri application wiring |
| Backend commands | `src-tauri/src/commands.rs` | Tauri command API exposed to frontend |
| Backend persistence/recalculation | `src-tauri/src/database.rs` | SQLite schema, migrations, molecule/particle recalculation, learning memory |
| Backend models | `src-tauri/src/models.rs` | Serialized Rust types shared through commands |
| Frontend app coordinator | `src/scripts/app.js` | Main UI state, edit modes, sidebar, command orchestration |
| Frontend canvas/viewer | `src/scripts/image-viewer.js` | Manuscript viewer, overlays, painting, row/gap hit testing |
| Frontend bridge | `src/scripts/tauri-bridge.js` | JavaScript wrapper around Tauri `invoke` |
| Frontend panels | `src/scripts/annotation-panel.js`, `image-list.js` | Atom palette and image list |
| Local repair scripts | `DataSetCreator/scripts/*.cjs` | Emergency inspection/repair tools; high caution |

## Database Location

The app uses the Tauri app data directory for the live SQLite database. Documentation should describe this generically as:

```text
%APPDATA%\com.voynichlab.datasetcreator\datasetcreator.db
```

The repository must not hardcode a personal user profile path.

## Core Tables

| Table | Type | Meaning |
|---|---|---|
| `images` | source inventory | Manuscript page records loaded into the app |
| `regions` | primary annotation | User-painted or selected geometry regions |
| `labels` | primary annotation | Label values attached to regions |
| `atoms` | derived-plus-primary | Atom geometry and identity synchronized from regions/labels |
| `molecules` | derived | Recalculated molecule groups per image |
| `particles` | derived | Recalculated particle groups inside molecules |
| `molecule_gap_overrides` | manual correction | Manual cut/join overrides between neighboring particles |
| `particle_row_guides` | manual/derived row model | Row guide bands for particle-row assignment |
| `particle_row_overrides` | manual correction | Per-particle row reassignment overrides |
| `particle_atom_order_overrides` | manual correction | Per-image atom order override for a particle instance/signature |
| `molecule_particle_order_overrides` | manual correction | Per-image particle order override for a molecule instance/signature |
| `particle_order_patterns` | learned memory | Learned canonical atom order for particle signatures |
| `molecule_order_patterns` | learned memory | Learned canonical particle order for molecule signatures |
| `particle_merge_patterns` | learned memory | Learned particle merge patterns, such as stacked or inline joins |

## Command Surface

Major Tauri commands exposed by `commands.rs`:

| Command group | Commands |
|---|---|
| Images | `sync_default_manuscript_pages`, `list_images`, `get_image`, `get_image_base64` |
| Regions | `create_region`, `update_region`, `delete_region`, `delete_regions_batch`, `list_regions` |
| Atoms | `sync_atom_for_region`, `create_atom_strokes_batch` |
| Recalculation | `recalculate_molecules` |
| Molecule gaps | `set_molecule_gap_override`, `clear_molecule_gap_override`, `set_molecule_gap_overrides_batch` |
| Rows | `set_particle_row_override`, `clear_particle_row_override`, `set_particle_row_overrides_batch`, `adjust_particle_row_guide`, `set_particle_row_guides` |
| Ordering | `set_particle_atom_order`, `set_molecule_particle_order`, `set_order_drafts_batch` |
| Learned merges | `set_particle_merge_pattern`, `clear_latest_particle_merge_pattern` |
| Labels | `create_label`, `update_label`, `delete_label`, `list_labels` |

## Recalculation Pipeline

The central backend operation is `recalculate_molecules`.

High-level flow:

1. Load atoms for an image.
2. Build contact/particle groups from atom geometry.
3. Apply learned particle merge patterns.
4. Segment particles into rows using detected row bands and manual guides.
5. Decide molecule boundaries using gap thresholds and manual gap overrides.
6. Create molecule and particle records.
7. Assign `molecule_id`, `particle_id`, and `atom_order` back onto atoms.
8. Apply learned order patterns and manual order overrides.
9. Emit an `AtomPagePacket` for frontend rendering and audit display.

This means many UI actions can change derived molecule/particle structure even if the underlying painted regions are unchanged.

## Manual Edits Versus Learned Memory

Manual corrections and learned patterns are separate concepts:

| Mechanism | Scope | Risk |
|---|---|---|
| `molecule_gap_overrides` | cut/join between neighboring particles | Bad override can merge/split molecules incorrectly |
| `particle_row_guides` | row geometry bands | Bad guide can move many particles at once |
| `particle_row_overrides` | one particle key to row | Bad key can survive recalculation unexpectedly |
| `particle_atom_order_overrides` | atom order in a particle | Bad order changes ATOMS sequence and grammar metrics |
| `molecule_particle_order_overrides` | particle order in a molecule | Bad order changes molecule signatures |
| `particle_order_patterns` | learned atom order by signature | Stale memory can reorder future particles incorrectly |
| `molecule_order_patterns` | learned particle order by signature | Stale memory can reorder future molecules incorrectly |
| `particle_merge_patterns` | learned merge rule | Stale memory can glue unrelated particles |

The recent Corpus V2 audit found that order and merge memory are scientific risk surfaces. Future changes should prefer batch edit modes that accumulate local drafts and save once, rather than recalculating on every click.

## Frontend Edit Modes

Observed frontend concepts:

- paint mode;
- batch delete mode;
- row edit mode;
- molecule/particle order editing;
- pending gap overrides;
- pending row guide edits;
- pending particle row overrides;
- pending atom/particle order drafts.

The current direction is correct: user edits should be staged locally and committed in batches. Immediate per-click backend recalculation was the source of lag and accidental state churn.

## Local Scripts

`DataSetCreator/scripts/` currently contains high-risk inspection and repair tools:

| Script | Current class | Notes |
|---|---|---|
| `inspect-recent-atoms.cjs` | read-only inspection | Useful for recent paint/debug checks |
| `inspect-paint-batch.cjs` | read-only inspection | Useful for batch paint contamination checks |
| `cleanup-contaminated-paint-batch.cjs` | repair | Deletes labels/atoms/regions and orphan particles/molecules; requires backup review |
| `cleanup-stale-merge-patterns.cjs` | repair | Deletes stale rows from `particle_merge_patterns` |
| `repair-page094-row-overrides.cjs` | repair | Historical targeted row override repair |

Registry: `DataSetCreator/scripts/README.md`.

Each script declares read/write behavior, affected tables, backup behavior, and whether it is still current. `repo:audit` fails if a new script appears in this directory without a registry entry.

## Current Architectural Risks

### Large Files With Too Much Responsibility

- `src-tauri/src/database.rs` is over 170 KB and mixes schema, migrations, recalculation, ordering, learning memory, row logic, and audits.
- `src/scripts/app.js` is over 115 KB and coordinates many unrelated UI concerns.
- `src/scripts/image-viewer.js` is over 58 KB and owns canvas state, overlays, hit testing, edit modes, and rendering.

This is not an immediate correctness bug, but it makes future changes risky. The next refactor should split by responsibility, not by arbitrary file size.

### Learned Memory Can Outlive Corpus Truth

Order and merge patterns are meant to save time, but stale learned memory can mutate current annotations after recalculation. This was already observed during Corpus V2 cleanup. Keep the learning engine, but require audit tooling and explicit cleanup gates.

### Derived IDs Can Shift

Molecule IDs and particle source indexes can change after boundary edits. Stable audit references should prefer atom IDs, image names, and explicit particle keys when possible.

### Local Backups Are Valuable But Unmanaged

`DataSetCreator/backups/` is ignored and currently protects DB repair work. It should remain ignored, but future cleanup should define retention rules and a manual archive path before deleting anything.

## Recommended Next Refactor Plan

1. Split `database.rs` into modules:
   - schema/migrations;
   - region/label/atom persistence;
   - recalculation;
   - row guides and row overrides;
   - order learning;
   - merge learning;
   - audit packet construction.
2. Split `app.js` into state, sidebar rendering, edit-mode controller, and command orchestration.
3. Split `image-viewer.js` into canvas rendering, hit testing, overlay rendering, and local edit drafts.
4. Add a small regression checklist for:
   - opening the app;
   - loading page 003;
   - painting one atom;
   - batch painting;
   - batch deletion;
   - row guide edit/save;
   - gap override edit/save;
   - atom order draft/save;
   - molecule particle order draft/save;
   - export through EVAComparisonLab.

## Current Verdict

DataSetCreator is powerful but concentrated. The best next move is not deleting code from it. The best next move is to document and then modularize it carefully, while protecting the live database and learned-memory tables.
