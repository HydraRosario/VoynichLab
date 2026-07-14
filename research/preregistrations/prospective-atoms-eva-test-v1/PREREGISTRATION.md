# PROSPECTIVE-ATOMS-EVA-TEST-V1

Status: `preregistered`.

This protocol is frozen before completion of the next annotated folio.

## Scientific Objective

Test whether the previously published ATOMS advantage over EVA replicates on a folio annotated after the protocol, models, metrics, and interpretation rules were frozen publicly.

This is not a decipherment claim.

## Target Identity

DatasetCreator metadata inspection identified the in-progress target as:

| Field | Value |
| --- | --- |
| DatasetCreator image ID | `7` |
| Image name | `page-007.jpg` |
| Expected folio | `f3r` |
| Status | `annotation-in-progress` |
| Prior experiment membership | absent from published tests |

No ATOMS sequences, EVA alignment metrics, model scores, or representation statistics from this target were exported before preregistration.

## Frozen Training And Test Policy

Training folios remain frozen:

```text
f1r
f1v
f47v
```

Previously evaluated folios:

```text
f2r
f2v
```

The newly completed folio must remain test-only. It must not update training distributions, model definitions, alignment heuristics, vocabulary policy, smoothing, or interpretation rules.

## Frozen Models

The five models are exactly those published in `REPRESENTATION-COMPARISON-V3-ABLATIONS`:

| Model | Frozen features |
| --- | --- |
| `MODEL_0` | unigram |
| `MODEL_1` | immediate left neighbor, immediate right neighbor |
| `MODEL_2` | immediate neighbors, coarse position |
| `MODEL_3` | exact regional sequence length, positional role, immediate neighbors |
| `MODEL_4` | immediate neighbors, coarse position, training-only length tertile |

Fixed parameters:

- Lidstone smoothing with `alpha=0.5`.
- Frozen 16-symbol ATOMS-V1 vocabulary.
- Same EVA vocabulary handling as V3.
- Same `REPRESENTATION-ALIGNMENT-V1` regional alignment method.
- `100` internal-order corruptions per test region.

No models may be added or removed after annotation completion.

## Primary Outcome

Primary outcome:

```text
combined normalized held-out log-loss under MODEL_1, all aligned regions
```

Reason: `MODEL_1` showed a strong ATOMS advantage without exact regional length and tests transferable local structure with minimal representation-dependent features.

## Secondary Outcomes

- `MODEL_0` through `MODEL_4` normalized log-loss.
- Top-1 accuracy.
- Unseen-context rate.
- Mean probability assigned to observed symbols.
- Real-versus-corrupted discrimination.

Frozen subsets:

- `all`
- `medium`
- `medium_low_medium`
- `one_to_one`
- `exclude_unresolved_eva_lines`

The standalone folio result must be reported before any pooled result.

## Interpretation Rules

### SUPPORTIVE

- ATOMS has lower normalized log-loss than EVA in `MODEL_1`.
- The direction is also favorable in at least one higher-confidence subset.
- There are sufficient aligned opportunities to evaluate.

### MIXED

- `MODEL_1` favors ATOMS in the complete subset but not in higher-confidence subsets.
- Metrics disagree materially.
- The direction changes across major subsets.

### NEGATIVE

- EVA has lower normalized log-loss than ATOMS in `MODEL_1`.
- Coverage is adequate.

### INCONCLUSIVE

- Insufficient EVA coverage.
- Insufficient aligned regions.
- Excessive unresolved alignment.
- Model cannot evaluate enough opportunities.
- Data integrity fails.

These rules must not be redefined after seeing the result.

## Not Claimed

This protocol does not claim:

- decipherment;
- global superiority;
- optimality of ATOMS;
- linguistic interpretation.

## Locked Runner

The locked runner is:

```text
GrammarDiscoveryLab/scripts/prospective-atoms-eva-test-v1.js
```

The runner must:

- refuse to run if the target folio is incomplete;
- refuse previously evaluated folios;
- verify this preregistration checksum;
- verify published V3 regression values before evaluating the new folio;
- freeze the completed folio export before calculating metrics;
- generate alignment;
- run the five frozen models;
- run corruption tests;
- classify the outcome using only these preregistered rules;
- never update training distributions with the test folio.

## Expected Outputs After Completion

```text
artifacts/public/prospective-atoms-eva-test-v1/
  report.md
  tables/folio-freeze-manifest.json
  tables/model-results.tsv
  tables/subset-results.tsv
  tables/corruption-results.tsv
  checksums.txt
```
