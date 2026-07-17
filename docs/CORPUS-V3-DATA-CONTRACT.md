# Corpus V3 Data Contract

Status: normative design for migration and active V3 exports.

Corpus V3 stores every structural level separately. No filename may use one
level's name for rows belonging to another level.

## `particles.tsv`

One row per smallest labeled visual component.

Required fields:

```text
particle_id
legacy_atom_id
image_id
image_name
atom_id
molecule_id
particle_order
family
structural_config
geometry and bounds fields
```

`particle_id` preserves the historical numeric atom identifier when possible.
`legacy_atom_id` makes the transition explicit and is never used to imply the
old ontology remains active. It is populated for migrated V2 records and may be
null for particles created natively under V3.

## `atoms.tsv`

One row per connected ordered group.

Required fields:

```text
atom_id
legacy_particle_id
image_id
image_name
molecule_id
atom_order
particle_count
particle_ids
particle_signature
geometry and bounds fields
```

`legacy_particle_id` is populated for migrated V2 records and may be null for
atoms created or recalculated natively under V3. Historical provenance belongs
in the crosswalk; it is not a required identity for new data.

## `molecules.tsv`

One row per ordered molecule.

Required fields:

```text
molecule_id
image_id
image_name
row_index
molecule_order
atom_count
atom_ids
atom_signatures
particle_count
particle_ids
flattened_particle_signature
geometry and bounds fields
```

## `identifier-map.tsv`

The first V3 freeze must include a complete crosswalk:

```text
entity_type
legacy_entity_type
legacy_id
canonical_id
image_id
molecule_id
status
note
```

## SQLite Schema Version

The canonical DataSetCreator database uses `PRAGMA user_version = 3`.

Active tables:

```text
images
regions
labels
particles
atoms
molecules
molecule_gap_overrides
atom_row_guides
atom_row_overrides
atom_particle_order_overrides
molecule_atom_order_overrides
atom_particle_order_patterns
molecule_atom_order_patterns
atom_merge_patterns
nomenclature_id_map
```

The V2 database is an immutable migration input. Migration must create and
validate a separate V3 database before any active-file swap.

## Invariants

1. Every particle references exactly one region and image.
2. Every assigned particle references one atom and one molecule.
3. Every atom references exactly one molecule.
4. Particle order is unique inside an atom.
5. Atom order is unique inside a molecule.
6. Bounds at higher levels contain their children within numeric tolerance.
7. Every migrated V2 atom has one V3 particle mapping.
8. Every migrated V2 particle has one V3 atom mapping.
9. Molecule membership and geometry remain unchanged unless a reviewed Corpus
   V3 correction explicitly records the change.
10. Frozen V1/V2 files are never migration targets.
