# EVAComparisonLab Script Registry

This directory contains the active analysis surface plus manual utilities used during corpus audit work. Scripts are classified so future cleanup does not confuse reproducible pipeline code with one-off inspection tools.

## Status Classes

- `active`: part of the current reproducible or local replay path.
- `utility`: safe read-only helper for manual inspection.
- `audit`: read-only or report-generating quality-control script.
- `repair`: can modify a live DatasetCreator DB; requires explicit backup protocol.
- `historical`: kept for provenance or old report compatibility, not recommended for new work.

## Active Pipeline

| Script | Status | Purpose |
|---|---|---|
| `run-corpus-v2-analysis.js` | active | Main local replay for the six-folio Corpus V2 analysis. |
| `export-datasetcreator-atoms.js` | active | Exports ATOMS rows from the live DatasetCreator DB. |
| `extract-ivtff-page.js` | active | Extracts EVA/IVTFF page text into comparable case files. |
| `combine-cases.js` | active | Combines per-folio case directories. |
| `role-entropy.js` | active | Computes EVA/ATOMS positional role entropy. |
| `list-atom-symbols.js` | active | Lists current atom vocabulary from an atoms TSV. |
| `line-alignment-audit.js` | active | Checks EVA/ATOMS line alignment. |
| `contextual-rule-discovery.js` | active | Discovers contextual ATOMS rules. |
| `molecule-neighbor-discovery.js` | active | Finds cross-molecule neighbor patterns. |
| `search-space-audit.js` | active | Measures observed versus possible local search space. |
| `conditional-entropy.js` | active | Computes contextual conditional entropy. |
| `variant-ablation.js` | active | Compares full variants against family-merged representations. |
| `macro-lexeme-analysis.js` | active | Builds macro-level lexeme summaries. |
| `morphology-family-analysis.js` | active | Measures morphology-family separability. |
| `cross-folio-validation.js` | active | Tests discovered rules across folios. |

## Audit And Quality Control

| Script | Status | Purpose |
|---|---|---|
| `labeling-anomaly-audit.js` | audit | Finds likely atom/particle ordering mistakes while suppressing canonical known anomalies. |
| `freeze-corpus-audit.js` | audit | Older/focused corpus freeze audit; still useful for targeted checks. |
| `particle-geometry-order-audit.js` | audit | Finds molecule particle-order cases that disagree with simple geometry. |
| `learning-memory-audit.js` | audit | Audits DatasetCreator learned order/merge memory before cleanup. |
| `cleanup-stale-learning-memory.js` | repair | Deletes stale learned-memory rows only after audit output and backup. |
| `detect-atom-anomalies.js` | audit | Scans visual snapshot exports for atom-level morphology outliers. |
| `crop-qc-context.py` | utility | Crops manuscript context images for QC review. |

## Read-Only Utilities

| Script | Status | Purpose |
|---|---|---|
| `atom-sequence-utils.js` | active | Shared helpers for DB access, TSV parsing, grouping, and token sorting. |
| `build-evidence-pack.js` | utility | Builds a compact report bundle from a case directory. |
| `build-parallel.js` | utility | Builds older parallel EVA/ATOMS tables. |
| `contextual-atom-audit.js` | utility | Inspects one atom in a requested context. |
| `contextual-branch-audit.js` | utility | Compares one branch split for an atom/context. |
| `contextual-rule-exceptions.js` | utility | Lists exceptions for one contextual rule. |
| `export-visual-snapshots.js` | utility | Regenerates local visual snapshot scratch artifacts. |
| `list-particles-start-end.js` | utility | Searches live DB particles by start/end token. |
| `positional-entropy.js` | historical | Older positional entropy entry point used before the Corpus V2 replay path. |

## Legacy Manual DB Inspection

These Python scripts are currently retained as read-only manual diagnostics. They should be reviewed during the DatasetCreator architecture pass and either promoted into documented utilities or removed:

- `audit-export-orphans.py`
- `audit-learning-memory.py`
- `audit-learning-state.py`
- `audit-page-labeling.py`
- `audit-particle-inventory.py`
- `inspect-page-particles.py`
- `query-live-db.py`

## Safety Rules

- Do not add a new script without adding it to this registry.
- Do not add DB-writing behavior to a script classified as `utility` or `audit`.
- DB-writing scripts must support dry-run or explicit `--apply`, create a backup, and document the exact tables they modify.
- Generated `cases/*-current`, visual snapshots, and audit scratch outputs stay out of Git unless promoted through a frozen release.

