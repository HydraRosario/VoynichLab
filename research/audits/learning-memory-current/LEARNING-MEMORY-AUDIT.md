# Learning Memory Audit

Purpose: compare DatasetCreator learned memory against the current live corpus without modifying the database.

## Summary

- Particle order patterns: 47 (ok: 47)
- Molecule order patterns: 353 (ok: 353)
- Particle merge patterns: 3 (observable-pair: 3)

## Interpretation

- `stale-signature`: learned rule points to a signature that no longer exists in the current corpus.
- `unsupported-order`: signature exists, but the learned order is no longer observed.
- `minority-order`: learned order exists, but another order is now dominant.
- `stale-pair`: merge rule points to a token pair not observed together in current molecules.

## Particle Order Problems

No particle order memory problems found.


## Molecule Order Problems

No molecule order memory problems found.




## Merge Pattern Problems

No merge pattern problems found.


Full tables:

- `particle-order-patterns.tsv`
- `molecule-order-patterns.tsv`
- `particle-merge-patterns.tsv`
