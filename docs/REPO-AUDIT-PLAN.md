# VoynichLab Repo Audit Plan

Goal: make the repo professional enough for scientific review without damaging
the annotation corpus. This is a cleanup plan, not a scientific reinterpretation.

## Core Rule

Git records scientific milestones and maintainable source code. It should not
become a landfill for every temporary export made while exploring.

## Round 0 Findings

Initial inspection on 2026-07-14 found:

- the worktree is dominated by regenerated visual snapshots and `current` lab
  outputs;
- `DataSetCreator/src-tauri/src/database.rs` is modified and must be treated as
  high risk;
- local Vercel state exists under `apps/portal/.vercel/` and must stay ignored;
- the canonical public portal is `https://voynich-lab.vercel.app/`;
- `REPOSITORY-GOVERNANCE.md` already exists and should remain the repo policy
  anchor;
- no obvious hardcoded Windows drive or `AppData` strings were found in the first
  searched source/docs set.

## AI-Code-Smell Checklist

Search for these repeatedly. They are common when a repo has been grown mostly
through agent work:

- source and generated outputs mixed in the same commit;
- `current`, `tmp`, `scratch`, or `working` folders with publishable-looking
  names but no manifest;
- scripts that mutate DBs or evidence without a `--dry-run` mode;
- hardcoded local paths, machine names, or Vercel project state;
- duplicate exporters that disagree about the same metric;
- silent fallbacks that hide missing files;
- UI text that claims more than the data proves;
- stale generated files that survive after their source data changed;
- giant files where unrelated responsibilities were added instead of split;
- validators that check success cases but not failure or drift;
- old learned patterns or caches that can influence new corpus exports;
- portal pages that hardcode experiment numbers instead of reading registry data.

## Cleanup Campaigns

### Campaign 1: Governance And Guardrails

Deliverables:

- repository inventory;
- deployment notes;
- DataSetCreator safety notes;
- read-only repo audit command;
- ignore rules for local deployment state.

No data moves. No DB writes. No scientific claims changed.

### Campaign 2: Worktree Triage

Deliverables:

- group dirty files by bucket;
- decide which generated outputs are public evidence and which are scratch;
- create a quarantine path for scratch if needed;
- produce a staging plan before any commit.

This campaign may require moving files. Do it only after a written plan and
explicit approval.

### Campaign 3: Portal Public Experience

Deliverables:

- visual atom atlas page with examples per symbol;
- experiment timeline fed by `research-feed`;
- result pages that link to reports, tables, checksums, and source scripts;
- clear "not a decipherment claim" language;
- canonical Vercel project linkage.

### Campaign 4: DataSetCreator Technical Audit

Deliverables:

- read-only map of DB schema, learned patterns, recalculation paths, and UI
  editing modes;
- performance profile for molecule/row edit saves;
- separation between learned pattern state, manual overrides, and live
  recalculation;
- migration plan before any schema or ordering logic change.

This campaign is high risk. Do not combine it with portal or artifact cleanup.

### Campaign 5: Scientific Replay Hygiene

Deliverables:

- single command to regenerate public artifacts from frozen inputs;
- checksums for all published data tables;
- explicit distinction between frozen V1, audited V2, and current working data;
- validator that fails if registry, public artifacts, and portal data disagree.

## Near-Term Sequence

1. Run `npm.cmd run repo:audit`.
2. Run `npm.cmd run research:doctor`.
3. Inspect high-risk changes manually.
4. Keep `DataSetCreator/` changes out of cleanup commits unless the commit is
   specifically about DataSetCreator source code.
5. Fix portal deployment linkage to the canonical Vercel project.
6. Only then plan any file moves.
