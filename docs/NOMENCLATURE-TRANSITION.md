# VoynichLab Nomenclature Transition

Status: migration policy for the first particle -> atom -> molecule release.

## Why The Vocabulary Changes

Early VoynichLab releases called the smallest labeled component an `atom` and a
connected group of those components a `particle`. That ordering was internally
usable but reversed the physical hierarchy invoked by the metaphor.

The active ontology therefore changes from:

```text
historical: atom -> particle -> molecule
canonical:  particle -> atom -> molecule
```

This is a terminology correction. It does not retroactively change a painted
geometry, an observed sequence, an experiment result, or a historical claim.

## Crosswalk

| Historical V1/V2 term | Canonical V3 term | Meaning |
|---|---|---|
| ATOMS-V1 symbol | PARTICLES-V1 symbol | Smallest labeled visual component |
| atom | particle | One painted labeled geometry |
| particle | atom | Connected ordered group |
| molecule | molecule | Ordered group separated by reviewed gaps |
| atom order inside particle | particle order inside atom | Internal connected-group order |
| particle order inside molecule | atom order inside molecule | Molecular order |

## Immutability Rule

The following objects must not be renamed or rewritten:

- published experiment IDs and titles;
- existing Git tags and releases;
- preregistrations;
- frozen reports and tables;
- public artifact paths;
- checksums;
- ATOMS-V1 and GRAMMAR-V1 specifications used by historical releases;
- CORPUS-V1 and CORPUS-V2 files.

Historical verifiers must continue to operate against the historical names and
frozen bytes. Active V3 tools must use the canonical vocabulary.

## Public Interpretation

Any current surface that links to historical evidence should explain the
crosswalk without rewriting that evidence. New experiments use `PARTICLES`,
`particles`, and `atoms` according to the canonical hierarchy.

Recommended public statement:

> Before PARTICLES-V1, VoynichLab used "atom" for the smallest labeled
> component and "particle" for a connected group. The active terminology was
> reversed to match the intended physical hierarchy. Historical releases keep
> their original vocabulary and remain scientifically unchanged.

## Versioning Rule

- `PARTICLES-V1` identifies the canonical 16-symbol visual inventory.
- `CORPUS-V3` identifies reviewed instances and canonical V3 relations.
- Replaying GRAMMAR-V1 on Corpus V3 does not create GRAMMAR-V2.
- `GRAMMAR-V2` requires a newly induced model or a changed model contract, such
  as explicit use of atom boundaries.

