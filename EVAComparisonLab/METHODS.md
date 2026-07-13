# Methods

## Unit Definitions

Atom:
The smallest labeled physical stroke component currently used by the model.

Variant:
A persistent physical variant of an atom family, written as `family:variant`
such as `c:1`, `c:2`, or `m:1`.

Particle:
A local group of atoms that DatasetCreator treats as a coherent subunit.

Molecule:
A higher-level unit exported from DatasetCreator segmentation. This is the
main unit used for row ordering and comparison against EVA token counts.

Program row:
The row assignment computed by DatasetCreator. Stored row guides are not always
the complete row set: particles outside stored guide bands may create computed
overflow rows. The export scripts must mirror this behavior.

## Role Entropy

For each symbol, occurrences are classified as:

- `initial`
- `medial`
- `final`
- `singleton`

Current entropy reports use the three-position Shannon form:

```text
H = -sum(P_i * log2(P_i))
```

where `i` is initial, medial, or final. The relative value divides by
`log2(3)`, giving a 0-to-1 score.

Low entropy alone is not proof. The stronger signal is low entropy plus
repeatable contextual rules plus survival across new folios.

## Contextual Rules

Particle-scope rules inspect atoms inside each particle.

Molecule-scope rules inspect atoms inside each molecule.

Molecule-neighbor rules inspect adjacency between exported molecules inside the
same program row.

Rules should be reported with:

- scope;
- role;
- tested condition;
- passing count;
- total count;
- share;
- concrete exceptions.

## Conditional Entropy

Conditional entropy measures predictability between adjacent atom tokens.

For each token `x`, the next-token report measures the distribution of `P(next
token | x)`. Low entropy means the following token is highly constrained.

The previous-token report measures `P(previous token | x)`. This is useful for
finding closure rules such as `j:1` being preceded by `f:1`.

These metrics do not prove meaning. They identify graphical grammar candidates.

## Variant Ablation

Variant ablation compares two token modes:

- full variants: `c:1`, `c:2`, `h:1`, `h:2`, etc.;
- families merged: `c`, `h`, `j`, etc.

If full variants have lower weighted role entropy than merged families, the
variant split is carrying structural information. If not, the split is only a
working hypothesis until more data supports it.

## Cross-Folio Validation

Rules are first discovered on the combined dataset and then scored per image.

Statuses:

- `perfect`: every observed case in that image passes.
- `survives`: observed share remains above threshold.
- `weak`: observed but below threshold.
- `not_observed`: no matching role occurrence in that image yet.

## Evidence Discipline

Do not delete exceptions from the story. Exceptions are classified as:

- labeling error;
- row/export artifact;
- variant-compatible exception;
- real rare structure;
- unknown.

Only labeling errors should be corrected in DatasetCreator. Real rare
structures remain in the dataset.
