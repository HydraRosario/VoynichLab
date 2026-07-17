# Corpus V3 Migration Readiness

Status: technical migration path implemented; human corpus audit and release
not yet executed.

## Completed

- Canonical ontology fixed as `particle → atom → molecule`.
- The 16-label visual inventory is specified as PARTICLES-V1.
- Historical ATOMS-V1, Corpus V1/V2, GRAMMAR-V1, tags, checksums, and reports
  remain unchanged.
- A read-only V2→V3 migrator creates a separate schema-V3 database and a full
  identifier crosswalk.
- DataSetCreator active code, commands, models, tables, controls, and audit
  vocabulary use the canonical hierarchy.
- A schema-V3 inspector validates counts, assignments, canonical atom IDs, and
  foreign keys.
- The active engine recalculated all six migrated images successfully on a
  disposable database.
- A V3 exporter produces separate particle, atom, molecule, and identifier-map
  tables.
- A preparation runner creates checksums and marks output as
  `WORKING_NOT_FROZEN`.
- A human annotation audit protocol and a GRAMMAR-V2 decision gate are defined.

## Verified migration snapshot

The verified input was a read-only copy of the current DatasetCreator V2
working database. The historical V1 freeze is not a substitute migration input:
although it also declares SQLite `user_version = 2`, it predates some V2 review
tables. The migrator detects this condition before creating output and reports
the missing tables explicitly.

The disposable V3 migration preserved:

```text
particles             6222
atoms                 2459
molecules              639
identifier mappings   9320
unassigned particles     0
invalid atom ids          0
foreign-key violations   0
```

After recalculating images 3, 4, 5, 6, 7, and 94, every exported particle,
atom, molecule, and identifier-map byte remained unchanged. This includes the
historical provenance fields on all 2,459 atoms.

## Verification commands passed

- JavaScript syntax checks for DataSetCreator and the V3 export tools.
- `cargo check`.
- `cargo test` (the crate currently defines no unit tests, so this primarily
  verifies compilation of all test targets).
- V2→V3 migration and content-fingerprint validation.
- V3 six-image recalculation round trip with byte-identical exports.
- Full V3 working export with four checksummed TSV files.
- Functional Atlas V3 candidate queue plus 500 manuscript-context crops.
- Tauri application compilation through creation of the debug executable.

The optional Windows MSI bundling stage could not download WiX because network
access was blocked in the execution environment. Application compilation had
already succeeded; this is not a code or data-integrity failure.

## Deliberately not done

- The live V2 database was not replaced or modified.
- No Corpus V3 annotation correction was asserted without human review.
- No V3 corpus was placed under `research/frozen`.
- No GRAMMAR-V2 was created merely for a vocabulary rename.
- No portal copy, historical artifact, release, tag, commit, or push was
  changed as part of this preparation.

## Next authorized research phase

Generate a V3 visual-anomaly queue with Functional Atlas, attach manuscript
context snapshots, then run the QC Review-led human audit described in
`research/audits/CORPUS-V3-AUDIT-PROTOCOL.md`, record every decision, replay the
selected experiments, and only then decide whether Corpus V3 and a substantive
GRAMMAR-V2 are ready to freeze together.
