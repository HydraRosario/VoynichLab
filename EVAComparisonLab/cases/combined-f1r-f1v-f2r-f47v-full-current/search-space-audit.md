# Search-Space Audit

## Purpose

This report estimates how many contextual hypotheses are examined before strong candidates are reported. It is a guardrail against reading the strongest rows as if they were hand-picked in advance.

## Current Thresholds

- Candidate if share >= `0.8` or absolute delta >= `0.45`.
- Context tests: `has_prior`, `has_after`, `starts_with`, `ends_with`, `prev_is`, `next_is`.

## Search Space

| Scope | Atoms | Groups | Vocabulary | Observed symbol-role cells | Tests | Raw hypotheses | Reported candidates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `particle` | 4557 | 1777 | 16 | 38 | 6 | 3420 | 169 |
| `molecule` | 4557 | 473 | 16 | 32 | 6 | 2880 | 184 |

## Interpretation Rules

- A strong candidate is not automatically grammar; it is a rule worth validating.
- Perfect or near-perfect rows are most persuasive when they survive on folios not used to discover or tune the category.
- Counts should be interpreted with the search space in mind, especially when many symbol-role-test-token combinations are examined.
- Future preregistered runs should freeze the atom inventory, thresholds, corpus split, and accepted tests before new pages are labeled.
