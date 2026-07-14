# DataSetCreator Safety Notes

DataSetCreator is the most valuable and dangerous part of the repo. It is both
software and the working interface to manually labeled research data.

## Non-Negotiable Rules

- Do not delete, move, or rename local DB files.
- Do not delete, move, or rename manuscript page assets.
- Do not delete backups during cleanup.
- Do not run migrations or recalculation scripts casually.
- Do not change learned-pattern behavior without reading the full path from UI
  action to database write.
- Do not mix DataSetCreator source changes with portal cleanup or artifact
  publishing commits.

## Required Read Before Editing

Before modifying a DataSetCreator behavior, identify:

- the frontend component that triggers the action;
- the Tauri command/API boundary;
- the Rust function that writes or recalculates data;
- the DB tables affected;
- whether manual overrides can be overwritten;
- whether learned patterns can influence already corrected instances.

## Preferred Change Shape

Use small, named changes:

- one commit for UI-only visibility/ergonomics;
- one commit for Rust/backend behavior;
- one commit for schema/migration work;
- one commit for export/report changes.

Every schema or write-path change needs a rollback story before implementation.

