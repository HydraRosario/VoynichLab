# VoynichLab Deep Repository Audit

Date: 2026-07-14

Scope: tracked repository structure, ignored local state, research artifacts, lab scripts, portal data, documentation references, and validation tooling. DatasetCreator source and local data were inspected conservatively; no DatasetCreator data, DB, backups, or manuscript images were moved or deleted.

## Executive Status

The repository is in much better shape after the recent cleanup campaign. The tracked tree is no longer behaving like an AI scratchpad full of generated debris: build outputs, dependency folders, temporary current exports, and Atom Atlas review code are out of the public code surface.

Current tracked file count: 525.

Main remaining issue: the repo still has a few places where scientific source-of-truth boundaries are blurry. The first concrete example was the known-anomaly ledger split between root `cases/` and `EVAComparisonLab/cases/`; that split has now been consolidated into `research/audits/known-labeling-anomalies.tsv`.

## What Was Checked

- Top-level directory inventory.
- Tracked file counts by module.
- Largest tracked files.
- Ignored local state under DatasetCreator.
- Package scripts and validation entry points.
- Lab scripts not exposed through package scripts.
- Absolute Windows paths and local-user references in tracked text.
- Secret-like tokens in tracked text.
- Known-anomaly ledger references.
- Portal data duplication against public artifacts.
- TranslationLab speculative artifacts and reference images.

## Tracked Layout

Tracked files by top-level area:

| Area | Files | Status |
|---|---:|---|
| `apps` | 110 | Active portal and generated portal data |
| `EVAComparisonLab` | 96 | Active research lab plus historical freeze |
| `artifacts` | 96 | Public research artifacts |
| `TranslationLab` | 66 | Speculative isolated lab |
| `DataSetCreator` | 46 | Critical annotation app; treat as protected |
| `GrammarDiscoveryLab` | 39 | Active/frozen grammar lab |
| `research` | 38 | Research notes, audits, frozen V2 corpus |
| `docs` | 9 | Governance and architecture docs |
| `research-feed` | 8 | Public milestone feed |
| `packages` | 6 | Shared tooling |
| `paper` | 5 | Paper planning |
| `cases` | 1 | Shared geometry-order anomaly ledger |

## Largest Tracked Files

Largest intentional tracked artifacts:

| File | Size | Verdict |
|---|---:|---|
| `EVAComparisonLab/frozen/VOYNICHLAB-V1-FROZEN-2026-07-13/datasetcreator-v1-frozen.db` | 15.7 MB | Intentional frozen evidence DB |
| `apps/portal/images/la-diosa-tau.png` | 1.1 MB | Intentional portal image |
| `research/audits/anomaly-candidates.json` | 0.88 MB | Research audit artifact |
| `EVAComparisonLab/sources/IT2a-n.txt` | 0.34 MB | EVA source transcription |
| duplicated portal/public TSV artifacts | 0.07-0.21 MB each | Intentional deployment copy, but should remain generated |

No tracked `node_modules`, `target`, `dist`, `.vercel`, logs, temporary backups, or ignored DatasetCreator databases were found.

## Ignored Local State

DatasetCreator dominates local disk usage because it correctly keeps large working assets out of Git:

| Path | Local count | Local size | Verdict |
|---|---:|---:|---|
| `DataSetCreator/manuscript-pages-yale/` | 213 files | ~561 MB | Local source images; ignored intentionally |
| `DataSetCreator/backups/` | 11 files | ~212 MB | Valuable safety backups; ignored intentionally |
| `DataSetCreator/*.db` | local DB files | not tracked | Critical working data; do not delete casually |

This is acceptable for now, but it deserves a later backup policy. "Ignored" should mean either local source material or intentional safety backup, not a junk drawer.

## Fixes Applied In This Pass

### 1. Removed Absolute Local Paths

Several TranslationLab case documents contained hardcoded local paths pointing at the original Windows user profile. They were replaced with repository-relative paths:

- `DataSetCreator/evidence/paragraph-2-page-3/...`
- `TranslationLab/translator/roots.tsv`

This makes the documents portable and prevents the public repo from encoding the local machine layout.

### 2. Generalized EVA DB Path Documentation

`EVAComparisonLab/README.md` now documents the DatasetCreator DB with `%APPDATA%\com.voynichlab.datasetcreator\datasetcreator.db` instead of a user-specific absolute path.

### 3. Strengthened Repo Audit Coverage

`packages/lab-exporter/src/cli.js` now scans every tracked text-like file for:

- absolute Windows paths;
- common secret patterns.

Previously, `repo:audit` and `research:validate` only scanned a narrower set of documentation, package, portal, and registry paths. That missed TranslationLab case files. This was a classic AI-project failure mode: the validator existed, but its perimeter was smaller than the repo.

## Important Findings

### P1: Known-Anomaly Ledgers Were Split

The audit found two tracked known-labeling anomaly ledgers:

- `cases/known-labeling-anomalies.tsv`
- `EVAComparisonLab/cases/known-labeling-anomalies.tsv`

They were not identical, and they were both referenced by active or public code paths.

Root `cases/known-labeling-anomalies.tsv` is used by the Corpus V2 freeze/provenance path:

- `packages/lab-exporter/src/freeze-corpus-v2-audited.js`
- `research/frozen/CORPUS-V2-AUDITED/provenance.json`

`EVAComparisonLab/cases/known-labeling-anomalies.tsv` is used by the EVA lab default audit scripts and public evidence links:

- `EVAComparisonLab/scripts/labeling-anomaly-audit.js`
- `EVAComparisonLab/scripts/freeze-corpus-audit.js`
- `EVAComparisonLab/README.md`
- `EVAComparisonLab/docs/ALPHABET-V1-LABELING-MANUAL.md`
- `evidence-cases.json`
- `apps/portal/data/evidence-cases.json`

This was the most important repo-architecture issue found in this pass. The fix could not be a blind merge because some entries referred to the same atom windows with different statuses or historical notes.

Resolution: the active current-corpus ledger now lives at `research/audits/known-labeling-anomalies.tsv`, with explicit scope, image, molecule, particle, source, and review-date columns. Historical frozen ledgers remain only inside frozen releases.

### P1: Lab Scripts Needed Classification

`EVAComparisonLab/scripts/` contained active pipeline scripts plus one-off diagnostics and historical experiments. They needed classification before deletion:

- `active`: used by current reproducible reports.
- `utility`: useful manual inspection tools.
- `repair`: DB-modifying or cleanup scripts requiring explicit backup protocol.
- `historical`: kept only for provenance.
- `retired`: safe to remove after no references remain.

Resolution started: `EVAComparisonLab/scripts/README.md` now classifies scripts as active, utility, audit, repair, or historical. `repo:audit` now fails if a new script appears without being listed in that registry. Two superseded DB cleanup scripts were retired: `experiment-remove-j2-merges.py` and `cleanup-learning-memory.py`.

### P1: DatasetCreator Is Protected But Needs A Read-Only Architecture Audit

DatasetCreator is the most valuable and dangerous part of the monorepo. It contains the annotation app and the workflow that creates the corpus. It also has local backups and old repair scripts.

Current policy should remain:

- do not move DatasetCreator;
- do not delete local DBs;
- do not delete backups without a backup-retention plan;
- do not rewrite learning/memory logic during repo cleanup.

Recommended next step: create a read-only map of DatasetCreator tables, commands, scripts, and generated local data. Only after that map exists should we simplify or retire its repair scripts.

### P2: Portal Data Duplication Is Intentional But Needs A Rule

The portal contains copies of public artifact data:

- `artifacts/public/...`
- `apps/portal/data/artifacts/public/...`

This is currently intentional for static deployment. The repo should preserve a clear rule:

`artifacts/public` is the canonical published artifact store; `apps/portal/data/artifacts/public` is a generated deployment mirror.

The mirror should be updated only through tooling, not hand-edited.

### P2: TranslationLab Is Isolated But Speculative

`TranslationLab` contains useful exploratory work, but it is not yet evidence-grade like the ATOMS/EVA comparison or Corpus V2 replay. It includes placeholder roots and speculative translation files.

That is acceptable only if the repo keeps a clear boundary:

- TranslationLab is exploratory.
- It is not part of the validated ATOMS/GRAMMAR evidence chain.
- It should not feed claims until upgraded through a frozen protocol.

### P2: Frozen V1 DB Is Large But Legitimate

`EVAComparisonLab/frozen/VOYNICHLAB-V1-FROZEN-2026-07-13/datasetcreator-v1-frozen.db` is the largest tracked file. It should stay unless a deliberate artifact-storage migration is planned. It is historical evidence, not random bulk.

## What Was Not Removed

Nothing was deleted in this pass.

Reason: the remaining suspicious areas are source-of-truth or provenance problems, not obvious garbage. Removing them without a migration plan would make the repo prettier but scientifically weaker.

In particular, the following were intentionally left untouched:

- DatasetCreator local DBs and backups.
- DatasetCreator scripts.
- EVAComparisonLab manual diagnostic scripts.
- Frozen V1 DB.
- TranslationLab reference images.
- Portal artifact mirror.
- Script lifecycle classification.

## Recommended Cleanup Campaigns

### Campaign 1: Canonical Audit Ledgers

Goal: one source of truth for reviewed anomalies.

Status: started. The current labeling ledger is now canonicalized at `research/audits/known-labeling-anomalies.tsv`; geometry-order anomalies already live in shared `cases/known-particle-geometry-anomalies.tsv`.

Steps:

1. Create `research/audits/known-labeling-anomalies.tsv`.
2. Merge root and EVAComparisonLab ledgers into it.
3. Add columns: `scope`, `image_name`, `molecule_id`, `particle_id`, `atom_ids`, `status`, `note`, `source_file`, `reviewed_at`.
4. Update scripts to require the canonical path.
5. Keep frozen historical ledgers only inside frozen releases.
6. Add a validator that fails if any new non-frozen `known-labeling-anomalies.tsv` appears elsewhere.

### Campaign 2: Script Registry

Goal: every lab script has a declared status and owner.

Status: started. `EVAComparisonLab/scripts/README.md` now provides the registry, and `repo:audit` enforces script registration.

Steps:

1. Add `EVAComparisonLab/scripts/README.md`.
2. Classify each script as `active`, `utility`, `repair`, `historical`, or `retired`.
3. Add command examples for active scripts.
4. Move repair scripts behind explicit backup instructions.
5. Delete truly retired one-off experiments after validation.

### Campaign 3: DatasetCreator Architecture Map

Goal: understand the annotation engine before touching it again.

Status: started. The read-only map now lives at `docs/DATASETCREATOR-ARCHITECTURE.md`.

The local repair/inspection scripts are now registered in `DataSetCreator/scripts/README.md`, and `repo:audit` enforces that new scripts in that directory are declared.

Steps:

1. Document SQLite tables and migration paths.
2. Document learning-memory tables and order-pattern tables.
3. Document which actions trigger recalculation.
4. Document local backup creation.
5. Document which scripts modify DB state.
6. Only then refactor or remove DatasetCreator scripts.

### Campaign 4: Portal Data Contract

Goal: make the portal feel like a scientific interface, not a copied folder.

Steps:

1. Define `artifacts/public` as canonical.
2. Define `apps/portal/data/artifacts/public` as generated.
3. Add a checksum or manifest check for portal mirror freshness.
4. Make the portal consume registry metadata consistently.
5. Avoid hardcoded scientific claims in React components when they can come from artifact metadata.

### Campaign 5: TranslationLab Quarantine Or Promotion

Goal: prevent speculative translation work from contaminating validated claims.

Options:

- Quarantine: keep TranslationLab clearly marked exploratory.
- Promote: define a frozen protocol and evidence criteria before it becomes paper-grade.

## Current Verdict

The monorepo is no longer chaotic, but it still has a few AI-era scars:

- duplicate source-of-truth files;
- scripts without lifecycle status;
- local data that is ignored but operationally important;
- generated portal mirrors that need a stricter contract;
- exploratory translation material living beside validated experimental work.

The next highest-value cleanup is not deleting more files. It is canonicalizing the anomaly ledgers and making every script declare why it exists.
