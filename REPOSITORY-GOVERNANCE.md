# VoynichLab Repository Governance

VoynichLab is both a research repository and a living laboratory. The repo must stay useful to three different audiences:

- researchers who want to audit claims;
- developers who need to maintain tools;
- non-technical readers who need a clear public portal.

The rule is simple: Git preserves evidence, the portal explains evidence, and local tools create evidence. These roles should not be mixed casually.

Companion operating docs:

- `docs/REPO-INVENTORY.md` maps the major repo areas and their cleanup risk.
- `docs/REPO-AUDIT-PLAN.md` defines the staged cleanup campaign.
- `docs/DEPLOYMENT.md` records the canonical portal URL and Vercel safety rules.
- `docs/DATASETCREATOR-SAFETY.md` defines the DataSetCreator no-damage policy.

## Source, Evidence, And Scratch

| Category | Examples | Git policy |
|---|---|---|
| Source code | `DataSetCreator/`, `GrammarDiscoveryLab/scripts/`, `packages/lab-exporter/`, `apps/portal/` | Commit intentionally, in small thematic changes |
| Research registry | `research-feed/*.json` | Commit when publishing or correcting public experiment metadata |
| Public artifacts | `artifacts/public/<experiment>/` | Commit only when produced by a named experiment or release |
| Portal build data | `apps/portal/data/` | Generated from registry/artifacts; commit only when needed for static deployment |
| Frozen evidence | tagged releases, checksums, frozen reports | Never rewrite; supersede with a new version |
| Local annotation data | DatasetCreator databases, backups, Yale page assets | Do not commit |
| Scratch/QC cache | temporary visual crops, audit work dirs, staging exports | Ignore or quarantine until reviewed |

## DataSetCreator Protection Rule

`DataSetCreator/` is high-risk because it owns the manual annotation workflow and local labeled data. Before modifying it:

1. Read the relevant code path completely.
2. Confirm the database will not be rewritten unexpectedly.
3. Keep UI, schema, and export changes in separate commits when possible.
4. Run the app or the narrowest available validation.
5. Never move database files, manuscript pages, backups, or generated annotation assets as part of repo cleanup.

If a change is only for the public portal, it should not touch `DataSetCreator/`.

## Experiment Publishing Flow

Publishing a result should be boring and reproducible:

1. Generate or update the experiment output inside its lab.
2. Register the experiment in `research-feed/experiments.json`.
3. Run `npm.cmd run research:validate`.
4. Run `npm.cmd run research:build`.
5. Run `npm.cmd run research:stage-plan -- --experiment <id>`.
6. Review the staged file list manually.
7. Commit source, registry, public artifacts, and portal data together.
8. Tag only frozen or externally meaningful milestones.

The exporter must never commit, tag, push, or delete files automatically.

## Portal Rule

The public portal is the front door, not the laboratory. It should:

- explain the current strongest result without claiming decipherment;
- make ATOMS visually inspectable;
- show negative and inconclusive experiments honestly;
- link every claim to reproducible artifacts;
- keep technical details available without forcing them on casual readers.

Prefer data-driven sections from `research-feed/` and `artifacts/public/`. Avoid hardcoding experiment claims in HTML/JS when the same fact already lives in the registry.

The canonical portal URL is `https://voynich-lab.vercel.app/`. Local Vercel state
under `apps/portal/.vercel/` is machine state and must not be committed.

## Audit And Corpus Revision Rule

Instance-level corrections belong in a correction ledger, not in silent edits. A corpus revision needs:

- a manifest;
- methodology;
- machine-readable corrections;
- human-readable changelog;
- verification script or checksums;
- an explicit statement that frozen V1 outputs were not overwritten.

Changing an instance label is not the same as redefining ATOMS. A new ATOMS version is only needed when class definitions or the inventory change.

## Worktree Hygiene

Before committing, separate changes into buckets:

- source code;
- generated public artifacts;
- portal data;
- frozen research docs;
- local scratch;
- high-risk annotation assets.

Do not let thousands of regenerated SVGs hide one real source-code change. Use `research:doctor` and `research:stage-plan` as guardrails, then inspect the actual diff.

## Commit Style

Good commits are small enough to review and named by intent:

- `Fix binary scanning in research validator`
- `Publish f3r prospective comparison artifacts`
- `Add atom atlas to public portal`
- `Document corpus V2 audit methodology`

Avoid mixing unrelated changes like portal redesign, corpus correction, DatasetCreator UI work, and generated snapshots in one commit.
