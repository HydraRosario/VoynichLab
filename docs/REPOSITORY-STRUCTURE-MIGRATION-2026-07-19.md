# Repository Structure Migration — 2026-07-19

Status: implemented and validated locally; pending campaign commit.

## Purpose

This migration consolidates applications, laboratories, public research
metadata, publication planning, and public artifacts into explicit
architectural zones. It changes current repository organization, not
scientific results or historical Git objects.

## Path changes

| Previous path | Canonical path |
|---|---|
| `research-feed/` | `research/registry/` |
| `paper/` | `research/publications/` |
| `apps/portal/data/research-feed/` | `apps/portal/data/registry/` |
| `artifacts/` | `research/artifacts/` |
| `EVAComparisonLab/` | `labs/eva-comparison/` |
| `GrammarDiscoveryLab/` | `labs/grammar-discovery/` |
| `TranslationLab/` | `labs/translation/` |
| `DataSetCreator/` | `apps/dataset-creator/` |

The portal mirror remains generated from the canonical registry by
`npm.cmd run research:build`.

## Laboratory policy

The established laboratories now occupy the canonical `labs/` zone:

- `labs/eva-comparison/`
- `labs/grammar-discovery/`
- `labs/translation/`

All new laboratories belong under `labs/`. The contents of `labs/translation/`
were moved as one directory and remain otherwise unchanged. Historical tags
retain their original paths and can still reproduce the repository as it
existed when each result was published.

## Scientific preservation

- Dataset Creator is moved only as a complete directory, preserving its local
  databases, backups, manuscript pages, dependencies, and build state.
- No frozen release was rewritten.
- No public experiment result or metric was changed.
- The artifact checksum verifier now accepts the recorded raw or LF-normalized
  digest for text files, preventing Windows line endings from producing false
  corruption reports. Binary files still require an exact raw-byte digest.
- Registry, artifact, portal-mirror, and speculative-boundary validations pass.

## Dataset Creator move verification

The protected application directory was compared immediately before and after
the move:

- files before: 15,672;
- files after: 15,672;
- bytes before: 17,038,168,923;
- bytes after: 17,038,168,923.

This count includes ignored local state such as the live database, backups,
manuscript pages, dependencies, and Rust build output. None of those local
assets was promoted into Git by the move.

## Retired root workspace

The former root `cases/` workspace was inspected after the migration. It held
two empty directories, no files, and no tracked content, so the empty tree was
removed. Lab-local `cases/` directories remain valid where they are part of a
laboratory workflow or historical provenance.

## Validation closure

The reorganized tree passed the following checks without opening a desktop app
or starting a server:

- 73 active JavaScript modules passed `node --check`;
- Functional Atlas passed all 7 automated tests;
- the research build regenerated and verified 12 experiment bundles, 10
  milestones, and 8 releases;
- registry validation passed;
- the frozen GRAMMAR-V1 replay passed for f2r and f2v;
- repository doctor and repository audit completed without integrity errors;
- `git diff --check` passed;
- active source and documentation contain no dependency on the retired root
  paths.

Before the campaign is staged, Git reports moved files as deletions plus
untracked destinations. Those high-risk warnings are expected at this phase;
all tracked source paths were independently checked at their mapped
destinations, with zero missing files. The Translation Lab move is byte-for-byte
unchanged. Files that differ in other moved trees contain the required active
path updates or regenerated public metadata.
