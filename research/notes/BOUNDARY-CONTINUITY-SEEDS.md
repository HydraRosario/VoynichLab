# BOUNDARY-CONTINUITY Seeds

**Status:** Observational hypothesis, not an experiment.

**Created:** 2026-07-14

This note preserves a testable observation for future experiment design. It is not a result and should not be cited as evidence.

## Observation

In `f3r`, molecule `img7-m50` is flagged as a labeling rarity by automated audit:

**Observed molecule:**
```
[n:1] [e:1 g:1 e:1] [c:1] [f:1 j:1]
```

**Expected molecule-local order** (dominant slot grammar):
```
[c:1] [f:1 j:1] [n:1] [e:1 g:1 e:1]
```

However, inspecting the preceding molecule reveals:

**Previous molecule tail:**
```
... c:1 | f:1 j:1
```

The particle sequence `c:1 | f:1 j:1` appears at the end of the previous molecule. If molecule boundaries do not fully terminate particle flow, then `img7-m50` may not be a disorder at all — the sequence could be continuous across the boundary.

## Hypothesis

Molecule boundaries may not fully segment the ATOMS particle stream. Some local structural rules may continue across molecule boundaries in the same row.

## Future Experiment Seed

A future `BOUNDARY-CONTINUITY-V1` experiment could compare:

- **Molecule-local windows**: current approach, treating molecules as isolated units.
- **Row-stream particle windows**: flatten particle sequence per row, ignoring molecule boundaries.
- **Boundary-aware windows**: allow limited cross-boundary context.
- **Boundary-shuffled controls**: shuffle boundaries to test if alignment is coincidental.

## Safety Rules

- Do not design the experiment around `img7-m50` alone. It is a seed, not a training target.
- Do not interpret results as proof of word-boundary errors.
- Declare results as exploratory unless preregistered.
- Do not modify molecule definitions or ATOMS annotations to "fix" boundary alignment.

## References

- Known anomalies: `research/audits/known-labeling-anomalies.tsv`
- Molecule data: `research/frozen/CORPUS-V2-AUDITED/corpus/molecules.tsv`
- Row structure: particle sequences grouped by `row_index`
