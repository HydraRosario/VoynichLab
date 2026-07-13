# ATOMS-V1 Specification

ATOMS-V1 is a frozen stroke-level tokenization used by VoynichLab for the current grammar-validation release.

Future changes to the alphabet, split decisions, or label inventory should use a new version identifier.

## Current Symbol Inventory

Current combined export:

```text
folios: f1r, f1v, f2r, f2v, f47v
physical units: 530
atom tokens: 5087
vocabulary: 16
```

| Symbol | Count |
| --- | ---: |
| `a:1` | 460 |
| `b:1` | 207 |
| `c:1` | 723 |
| `c:2` | 35 |
| `d:1` | 279 |
| `e:1` | 1496 |
| `f:1` | 508 |
| `g:1` | 344 |
| `h:1` | 224 |
| `h:2` | 175 |
| `i:1` | 252 |
| `j:1` | 126 |
| `k:1` | 75 |
| `l:1` | 35 |
| `m:1` | 58 |
| `n:1` | 90 |

## Version Notes

- Retired labels `a:2`, `g:2`, and `j:2` are not present in the current combined export.
- `n:1` replaces the former `j:2` physical shape after the V1 split decision.
- Variants such as `c:1` and `c:2`, or `h:1` and `h:2`, are retained as distinct physical variants in this release.

## Evidence Policy

The symbol list above is a label inventory, not a full visual typology. A complete academic specification should later add representative snapshots, variation ranges, counterexamples, and ambiguous cases for every symbol.

The current reproducible release is intentionally limited to molecule-table validation of frozen GRAMMAR-V1.
