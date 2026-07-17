# Corpus V3 Migration Consolidation

Date: 2026-07-17

Status: **TECHNICALLY_READY_FOR_HUMAN_AUDIT**. Corpus V3 is still
**WORKING_NOT_FROZEN** and **HUMAN_AUDIT_PENDING**.

## What was consolidated

- The canonical hierarchy is `particle → atom → molecule`.
- Historical ATOMS-V1 and Corpus V1/V2 artifacts remain unchanged.
- The V2 source is read only; the migrator creates a separate schema-V3 file.
- The DatasetCreator runtime schema and migrator now share the same identifier
  crosswalk contract.
- Recalculation preserves V2 provenance instead of erasing
  `legacy_particle_id` from rebuilt atoms.
- V3 exports can be compared byte-for-byte before and after recalculation.
- The working audit package includes corpus tables, integrity and migration
  reports, the complete crosswalk, an empty decision ledger, a V3 anomaly
  queue, and manuscript-context crops.

## Verified inventory

```text
particles             6222
atoms                 2459
molecules              639
identifier mappings   9320
folios                    6
visual candidates       500
context crops            500
unassigned particles       0
invalid atom ids            0
foreign-key violations     0
```

The 9,320 mappings are not corrections. They are the complete traceability
crosswalk: 6,222 migrated particles, 2,459 migrated atoms, and 639 molecules.

## Six-folio idempotence result

Images 3, 4, 5, 6, 7, and 94 were recalculated on a disposable, freshly
migrated V3 database. The following exports were byte-identical before and
after:

```text
particles.tsv       f0cfc40bcb69044c05408be80a6c20391a83700299bff830138809d08eb2ec1d
atoms.tsv           ce4399f6878d7e7ea122f6f758d120af8363a4face98892b9357c2b1e1262609
molecules.tsv       bce4c1d4bb55e4f0db204b69dfe8105367edf5ebe995253b747d5931fb8143ab
identifier-map.tsv  c98e405016eef187028fe61f1c047d87da59b511677f3feb4959cf11d08796ac
```

## Local audit handoff

The generated package is intentionally ignored by Git:

`DataSetCreator/backups/corpus-v3-audit-candidate-20260717/`

Start with:

1. `README.md` and `audit-summary.md` for status and boundaries.
2. `qc-context/context-manifest.json` for the ranked candidate-to-image map.
3. The matching JPEG in `qc-context/` beside the original page in
   DatasetCreator.
4. Record every decision in `audit-ledger.tsv` as `confirmed`, `corrected`, or
   `deferred`; never remove a row merely because it is unusual.
5. Use `corpus/identifier-map.tsv` whenever a historical V2 ID appears.

No annotation correction has been made by this consolidation. No V3 release,
GRAMMAR-V2 result, commit, tag, or push was created.

## Explicit technical finish

The migration is consolidated when all automated checks pass and the audit
package is reproducible. That condition is now met. The next phase is the
human annotation audit; freezing Corpus V3 remains a later, explicit decision.
