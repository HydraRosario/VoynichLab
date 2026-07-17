# PARTICLES-V1 Specification

Status: active ontology for the next VoynichLab corpus release.

PARTICLES-V1 is the canonical name for VoynichLab's fixed inventory of
smallest manually labeled visual components. A particle is a painted component
of manuscript ink represented by one label such as `e:1`, `c:1`, or `h:2`.

PARTICLES-V1 succeeds the historical name ATOMS-V1. The symbol mapping is
one-to-one: this terminology correction does not by itself change a symbol's
geometry, family, structural configuration, or historical measurements.

## Structural Hierarchy

VoynichLab uses exactly three active structural levels:

```text
particle -> atom -> molecule
```

### Particle

The smallest manually labeled visual component. A particle owns one painted
geometry, one stable numeric identifier, one family label, and one structural
configuration.

Example:

```text
e:1
```

### Atom

An ordered connected group of one or more particles. Contact geometry and
reviewed merge rules determine atom membership.

Example:

```text
[e:1 c:1 h:2]
```

### Molecule

An ordered group of one or more atoms on a manuscript row. Gap analysis and
reviewed cut/join decisions determine molecule boundaries.

Example:

```text
[e:1 c:1 h:2] [e:1 f:1] [k:1 f:1 i:1 d:1]
```

VoynichLab does not claim that particles are phonemes, that atoms are letters,
or that molecules are words. These are structural visual terms.

## Symbol Inventory

The PARTICLES-V1 inventory contains the same 16 label values preserved by the
historical ATOMS-V1 inventory:

```text
a:1 b:1 c:1 c:2 d:1 e:1 f:1 g:1
h:1 h:2 i:1 j:1 k:1 l:1 m:1 n:1
```

Retired historical labels `a:2`, `g:2`, and `j:2` do not become active again.
`n:1` continues to denote the visual family created by the earlier V1 split
decision.

## Identity Rules

- Particle IDs preserve the numeric IDs of the corresponding historical V2
  records wherever possible.
- Atom IDs use the canonical form `img<image>-m<molecule>-a<order>`.
- Molecule IDs retain the canonical form `img<image>-m<order>`.
- A V2-to-V3 identifier map must accompany the first canonical corpus release.
- A label correction changes a corpus instance, not the PARTICLES-V1 inventory.
- A family-definition or inventory change requires a new PARTICLES version.

## Serialization Rules

Atom boundaries must never be recoverable only from whitespace. Canonical
exports carry explicit IDs and relations.

Human-readable molecule example:

```text
[e:1 c:1 h:2] [e:1 f:1] [k:1 f:1 i:1 d:1]
```

Flattened particle sequence, retained only as an explicit derived view:

```text
e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1
```

## Historical Boundary

ATOMS-V1, CORPUS-V1, CORPUS-V2, GRAMMAR-V1, their tags, preregistrations,
artifacts, paths, and checksums remain historical objects with their original
terminology. See `docs/NOMENCLATURE-TRANSITION.md`.

