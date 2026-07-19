# VoynichLab Cleanup Backlog

This is the long-form cleanup plan. It is meant for agents and developers who
need to work without asking the project owner to adjudicate every tiny step.

## Operating Principle

Clean by risk class, not by emotion. The repo contains valuable scientific
evidence, live annotation software, generated exports, and exploratory tools.
Each class needs a different cleanup rule.

## Phase 1: Stop New Noise

Status: mostly complete.

Actions:

- Ignore local Vercel state.
- Ignore live `*-current` and `*-WORKING` lab outputs.
- Ignore new visual snapshot exports under `visual-snapshots/current`.
- Retire Atom Atlas after its Corpus V2 QC role.
- Remove stale generated project summary tooling.
- Remove tracked live `current`/`WORKING` outputs after their results were
  preserved in frozen/public artifacts.

Acceptance criteria:

- `npm.cmd run repo:audit` reports generated/scratch groups clearly.
- New temporary exports do not flood `git status`.
- No ignored rule hides already tracked evidence silently.
- `research/audits/qc-rounds.json` remains tracked because it is canonical QC
  app configuration, while downloaded `qc-decisions-v*.json` files are scratch.

## Phase 2: Revert Or Freeze Generated Diffs

Targets:

- `labs/eva-comparison/artifacts/visual-snapshots/current/**`
- `research/artifacts/public/**`
- `research/audits/**`

Decision rule:

- If the files are outputs from a named release, freeze them with manifests,
  reports, provenance, checksums, and table paths.
- If the files are local rebuilds of already published artifacts, revert them.
- If the files are scratch/QC working files, ignore or quarantine them.

Do not mix this phase with source-code changes.

## Phase 3: Portal Source Cleanup

Targets:

- `apps/portal/index.html`
- `apps/portal/main.js`
- `apps/portal/styles.css`

Known issues:

- Some copy is static even though the same facts live in `research/registry`.
- Atom Atlas has been removed from the public portal; future visual evidence
  should return only as a curated release.
- The portal should show a clean public timeline and scientific cards without
  requiring a user to inspect raw repo folders.

Acceptance criteria:

- Portal can run from registry/artifacts without local scratch data.
- No current scientific metric is hardcoded when a registry value exists.
- The canonical URL remains `https://voynich-lab.vercel.app/`.

## Phase 4: QC Tool Cleanup

Targets:

- `apps/qc-review/index.html`
- `research/audits/*.json`
- `labs/eva-comparison/scripts/crop-qc-context.py`
- `labs/eva-comparison/scripts/detect-atom-anomalies.js`

Known issues:

- QC is useful but should remain tied to candidate context and ledgers, not to a
  generated atlas bundle.
- The UI needs clearer candidate explanations and decision provenance.
- Review ledgers should be canonical; downloaded `qc-decisions-v*.json` files
  should remain scratch unless explicitly consolidated.

Acceptance criteria:

- QC app reads one canonical candidate file and one canonical reviewed ledger.
- Exported decisions are either consolidated or ignored.
- No stale candidate queue is presented as current truth.

## Phase 5: DataSetCreator Read-Only Architecture Audit

Targets:

- `apps/dataset-creator/src-tauri/src/database.rs`
- `apps/dataset-creator/src/scripts/app.js`
- `apps/dataset-creator/src/scripts/image-viewer.js`
- `apps/dataset-creator/src/scripts/annotation-panel.js`

Known risks:

- The Rust database module is very large.
- Frontend app state is very large.
- Learned ordering patterns, manual overrides, draft edits, and recalculation
  paths are high-risk because they can affect corpus metrics.

Required output before edits:

- DB schema map.
- Command/API map.
- Recalculation map.
- Learned-memory map.
- Manual-override persistence map.
- List of actions that can rewrite existing labels/order/rows.

No source changes in this phase until the map exists.

## Phase 6: Lab Script Consolidation

Targets:

- `labs/eva-comparison/scripts/*.js`
- `labs/grammar-discovery/scripts/*.js`
- `labs/translation/scripts/*.js`

Known issues:

- Many scripts are one-off experiment drivers.
- Repeated TSV/Markdown/report helpers likely exist.
- Some scripts are historical and should be documented as frozen-era tools.

Acceptance criteria:

- Every script is classified as live, frozen reproduction, exploratory, or
  retired.
- Shared IO/reporting helpers are extracted only where duplication causes real
  maintenance risk.
- Frozen reproduction scripts are not rewritten casually.

## Phase 7: Public Evidence Model

Goal:

Separate local visual evidence from public scientific artifacts.

Possible structure:

```text
research/frozen/<release>/
research/artifacts/public/<experiment>/
apps/portal/data/
local/generated/
```

Rules:

- Public artifacts need manifest, report, provenance, checksums, and source
  command.
- Local/generated visual exports stay ignored unless promoted.
- Snapshot DBs are not casually committed.
