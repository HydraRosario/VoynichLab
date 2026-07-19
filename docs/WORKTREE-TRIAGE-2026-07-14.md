# Worktree Triage 2026-07-14

This file records the current cleanup diagnosis. It is intentionally
non-destructive: no files were moved, deleted, unstaged, or reverted.

## Summary

The repository is not dirty because of one bug. It is dirty because several
classes of files are currently mixed:

- source-code changes;
- regenerated visual snapshots;
- current lab outputs;
- public artifact rebuilds;
- temporary Atom Atlas examples, since retired;
- QC/audit scratch data;
- local Vercel state;
- high-risk DataSetCreator changes.

This should be cleaned by campaign, not by bulk deletion.

## Observed Buckets

| Bucket | Examples | Suggested action |
|---|---|---|
| Governance/source changes from this pass | `.gitignore`, `package.json`, `packages/lab-exporter/src/cli.js`, `docs/`, `REPOSITORY-GOVERNANCE.md`, `apps/portal/.gitignore` | Candidate for a small cleanup/guardrails commit |
| High-risk DataSetCreator source | `apps/dataset-creator/src-tauri/src/database.rs` | Do not include in cleanup commit; audit separately |
| Regenerated visual snapshots | `labs/eva-comparison/artifacts/visual-snapshots/current/**` | Decide whether to freeze a curated snapshot bundle or keep as local/generated |
| Atom Atlas visual examples | `atom-atlas/**` | Retired after Corpus V2 QC; do not restore unless rebuilt as a curated visual-evidence release |
| Public artifact rebuilds | `research/artifacts/public/**` | Commit only as part of a named scientific release/replay |
| Current lab case outputs | `labs/eva-comparison/cases/*-current/**` | Promote only selected reports/tables; otherwise treat as scratch |
| QC/audit scratch | `research/audits/**`, `research/corpus-revisions/*-WORKING/**` | Keep correction ledgers; quarantine temporary candidates |
| Portal local state | `apps/portal/.vercel/` | Ignore permanently; never commit |
| Generated project summary | `PROJECT-SUMMARY.md` | Removed from the working tree because it described the older five-folio state |

## Proposed Commit Sequence

### Commit 1: Repo Governance Guardrails

Include only:

- `.gitignore`
- `package.json`
- `packages/lab-exporter/src/cli.js`
- `REPOSITORY-GOVERNANCE.md`
- `docs/REPO-INVENTORY.md`
- `docs/REPO-AUDIT-PLAN.md`
- `docs/DEPLOYMENT.md`
- `docs/DATASETCREATOR-SAFETY.md`
- `docs/WORKTREE-TRIAGE-2026-07-14.md`
- `apps/portal/.gitignore`

Do not include DataSetCreator, snapshots, public artifacts, retired Atom Atlas output, QC
outputs, or current lab cases.

### Commit 2: Portal Visual Publication

Only after deciding what the public visual story should show. Atom Atlas was
retired as a temporary QC tool; if visual examples return, publish only a
curated visual-evidence bundle with manifest, checksums, and a clear reason for
each example.

### Commit 3: Scientific Artifact Replay

Only after deciding which rebuilt `research/artifacts/public` outputs correspond to a
named release or replay. Include registry and generated portal data together.

### Commit 4: DataSetCreator Technical Fixes

Only after a dedicated read-only audit of:

- schema;
- learned patterns;
- row/molecule/particle ordering;
- manual overrides;
- save/recalculate paths.

## Current Red Flags

- A modified DB exists under `labs/eva-comparison/artifacts/visual-snapshots/current/`.
- `apps/dataset-creator/src-tauri/src/database.rs` is modified.
- There are thousands of visual snapshot diffs, enough to hide real source
  changes if committed together.
- New untracked files under `visual-snapshots/current/` are ignored from now on,
  but already tracked snapshot files will still appear when modified. That is
  intentional: ignore rules are not being used to erase historical evidence.
- The canonical portal is `https://voynich-lab.vercel.app/`; local Vercel
  linkage must be checked before deployment.
- `PROJECT-SUMMARY.md` and `packages/lab-exporter/src/generate-project-summary.js`
  were removed from the working tree because they described the older five-folio
  state and were not connected to the active root scripts.
- Atom Atlas was useful as a QC/review tool and is now retired. It should not
  become public evidence unless rebuilt as a formal visual atlas with provenance
  and checksums.

## Safe Next Command

```bash
npm.cmd run repo:audit
```

That command is read-only. It should be run before staging any cleanup commit.
