# Corpus V3 Annotation Audit Protocol

Status: planned human review; not yet executed.

## Purpose

Corpus V3 combines two different changes that must never be confused:

1. a nomenclature migration from historical `atom → particle → molecule` to
   canonical `particle → atom → molecule`; and
2. reviewed corrections to human annotations discovered after Corpus V2 froze.

The nomenclature migration changes names and identifiers, not geometry or
experimental results. Annotation corrections may change corpus content, but
only through the review ledger below.

## Audit input

- A validated schema-V3 database produced from the frozen V2 source.
- The complete V2→V3 identifier crosswalk.
- A checksummed working export created by `npm run corpus:v3:prepare` in
  `EVAComparisonLab`.
- Candidates from a V3-compatible anomaly detector, ranked by rarity and
  geometric inconsistency.
- The original manuscript image for visual adjudication after a candidate is
  detected computationally.

Atom Atlas is retired and is not part of this protocol. Its historical role was
to export many per-symbol SVG examples for visual comparison during the Corpus
V2 campaign. Corpus V3 must not silently restore that generated bundle.

The active repository preserves `apps/qc-review`, the local surface used to
inspect candidates and record human decisions. The historical V2 detector uses
the old ontology. Its V3 successor is the visual-outlier channel in
`apps/functional-atlas`, which reads canonical exported particles and emits a
separate `CANDIDATES_NOT_DECISIONS` queue. That queue must be paired with
manuscript-context snapshots before a human audit round begins.

## Review unit

Each decision records:

```text
decision_id
image_id
folio
canonical_particle_id
canonical_atom_id
molecule_id
candidate_source
candidate_reason
before_label
after_label
manuscript_region_reference
reviewer
reviewed_at
decision
notes
```

Allowed decisions are `confirmed`, `corrected`, and `deferred`. No row may be
deleted merely because it is unusual.

## Required passes

1. Validate every V2→V3 identifier mapping and hierarchy relation.
2. Review all V3 anomaly candidates, highest anomaly score first, in QC Review.
3. Review every known post-V2 issue already recorded in the audit ledgers.
4. Re-run the V3 anomaly detector after corrections and review newly exposed
   exceptions.
5. Sample common, non-flagged families to estimate false-negative risk.
6. Have a second review pass adjudicate every correction and deferred case.
7. Re-export the corpus and verify geometry, ordering, counts, and checksums.

## Exit gates

Corpus V3 is eligible to freeze only when:

- no candidate remains without a recorded decision;
- every correction has before/after evidence and a second review;
- all schema and foreign-key checks pass;
- particle, atom, and molecule exports match the V3 data contract;
- a replay plan names which experiments will be recomputed;
- limitations and unresolved deferred cases are published;
- the working directory is promoted through a separate, explicit freeze step.

Until then, every generated V3 directory must say `WORKING_NOT_FROZEN`.
