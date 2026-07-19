# Repository Stabilization Report — 2026-07-17

Status: local pre-commit review. No commit, tag, release, portal build, or push
was created by this campaign.

## Outcome

The repository's published scientific record remains valid and untouched. The
working tree is large because three legitimate work packages coexist locally,
not because generated build directories entered Git.

## Working packages

### A. Canonical ontology migration

Scope:

- active DatasetCreator Rust, JavaScript, HTML, and CSS vocabulary;
- schema-V3 tables and commands;
- read-only V2-to-V3 migrator and V3 inspector;
- PARTICLES-V1, nomenclature-transition, and V3 data-contract documents.

Risk: high. This package changes the annotation application's API and database
schema. It must be reviewed and committed independently of experiments.

### B. Corpus V3 preparation

Scope:

- canonical V3 exporter;
- working-export runner, manifest, and checksums;
- audit protocol and migration-readiness record;
- GRAMMAR-V2 decision gate.

Risk: medium. These tools read a separately migrated V3 database and refuse to
publish or freeze automatically.

### C. Functional Atlas

Scope:

- local static application and analysis engine;
- equivalence, composition, operator, visual-outlier, and structural-rule
  candidate generation;
- scientific protocol, validation record, and tests.

Risk: low to frozen evidence, medium to interpretation. The tool does not write
the corpus. Its outputs remain `EXPLORATORY_NOT_FROZEN`.

## Ignored local state verified

The following remain outside Git intentionally:

- `apps/dataset-creator/backups/`;
- local DatasetCreator databases;
- `apps/dataset-creator/manuscript-pages-yale/`;
- `apps/dataset-creator/node_modules/`;
- `apps/dataset-creator/src-tauri/target/` and generated Tauri files;
- EVA current outputs and backups;
- `labs/grammar-discovery/out/`;
- `apps/portal/.vercel/`;
- current geometry-audit output.

No database, manuscript page, backup, dependency tree, Vercel state, or Rust
build output is staged or tracked by these changes.

## Verification performed

- `cargo check` passes for DatasetCreator.
- Root repository audit passes and recognizes both script registries as
  complete.
- Research registry validation passes: 12 experiments, 10 milestones, and 8
  releases.
- Functional Atlas tests pass.
- V3 migration, inspection, recalculation, and working export were previously
  executed on disposable copies with 6,222 particles, 2,459 atoms, 639
  molecules, and zero foreign-key violations.
- Stabilization repeated the complete migration and export from a fresh,
  read-only copy of the active V2 database with the same counts and checks.
- The historical V1 freeze was deliberately rejected as a complete V2 input:
  it shares `user_version = 2` but predates several review-state tables. The
  migrator now reports that distinction explicitly instead of failing later in
  a table copy.
- Protected historical paths have no working-tree changes.

## Corrections made during stabilization

The ontology rename had produced incorrect Spanish interface phrases such as
`el particula`. These were corrected. No scientific data changed.

## Required commit sequence

Do not stage the entire tree at once. Review and commit in this order:

1. **Migrate active DatasetCreator ontology to schema V3**
   - DatasetCreator source and its two migration utilities;
   - PARTICLES-V1, nomenclature, and V3 data-contract documents.
2. **Add Corpus V3 working export and audit contracts**
   - EVA V3 exporter/preparation runner;
   - audit protocol, readiness record, and grammar decision gate.
3. **Add Functional Atlas exploratory instrument**
   - `apps/functional-atlas/`, app registry, retired-tool clarification, and
     its ignore rule.
4. **Document the stabilized active research foundation**
   - this report, active-foundation map, and small governance/root README
     cross-references.

Run the full validation matrix after each commit. Push only after all commits
have been reviewed together and the user explicitly authorizes publication.

## Explicit end condition

Repository stabilization is complete when the four packages above are
reviewable independently, all validation commands pass, historical paths have
zero changes, and no unexplained file remains in the working tree. The next
scientific task is then the human Corpus V3 audit—not another exploratory
experiment.
