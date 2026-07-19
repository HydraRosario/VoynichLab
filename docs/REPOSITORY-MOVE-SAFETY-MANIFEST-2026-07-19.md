# Repository Move Safety Manifest — 2026-07-19

Status: captured immediately before the architectural directory migration.

## Pre-move inventory

| Source | Total files | Tracked | Ignored | Untracked | Approximate bytes |
|---|---:|---:|---:|---:|---:|
| `DataSetCreator/` | 15,672 | 49 | 15,623 | 0 | 17,038,160,707 |
| `EVAComparisonLab/` | 9,535 | 141 | 9,394 | 0 | 88,802,662 |
| `GrammarDiscoveryLab/` | 70 | 41 | 29 | 0 | 837,247 |
| `TranslationLab/` | 66 | 66 | 0 | 0 | 1,082,461 |
| `artifacts/public/` | 111 | 111 | 0 | 0 | 1,147,687 |

No target destination existed when this inventory was recorded. Every move is
performed within the same workspace and filesystem so the directory entry is
relocated without copying or deleting protected contents.

## Protected DataSetCreator state

The move must preserve the complete directory, including ignored state:

- `backups/` — 593 files, approximately 479 MB;
- `manuscript-pages-yale/` — 213 files, approximately 561 MB;
- `src-tauri/` — 14,758 files, approximately 15.97 GB;
- `node_modules/`;
- local database files;
- the relative launcher `Abrir DataSetCreator.cmd`.

The launcher changes its working directory through `%~dp0`, so relocating the
complete application directory preserves its relative launch behavior.

## Intended moves

| Source | Destination |
|---|---|
| `artifacts/` | `research/artifacts/` |
| `EVAComparisonLab/` | `labs/eva-comparison/` |
| `GrammarDiscoveryLab/` | `labs/grammar-discovery/` |
| `TranslationLab/` | `labs/translation/` |
| `DataSetCreator/` | `apps/dataset-creator/` |

`TranslationLab` contents must remain unchanged. Historical Git objects and
tags remain untouched; only the current working-tree paths change.
