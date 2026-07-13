# Freeze Corpus Audit

Purpose: aggressively search for possible human labeling issues before freezing the current corpus.

This report is intentionally broader than the academic metrics. It includes weak suspects and informational guardrails.

## Scope

- Images: `page-005.jpg`
- DB atoms read: `937`
- Assigned labeled atoms: `937`
- Particle sequences: `359`
- Molecule sequences: `104`
- Known anomalies list: `EVAComparisonLab\cases\known-labeling-anomalies.tsv`

## Summary

- Must review: `0`
- Inspect: `27`
- Informational: `3`
- Known anomalies suppressed from active review queue: `2`

## Categories

- `strong-context-exception`: `24`
- `dominant-role-exception`: `3`
- `manual-gap-overrides`: `1`
- `manual-row-overrides`: `1`
- `molecule-minority-order`: `1`

## Review Queue

### 1. inspect · dominant-role-exception · page-005.jpg · img5-m21 · img5-m21-p1

- Observed: `d:1 as medial in e:1 a:1 m:1 c:1 a:1 b:1 d:1 g:1 e:1`
- Expected/check: `d:1 as final`
- Support: 59/61
- Locate: y=709
- Atom ids: `6331`
- Why: d:1 is final in 59/61 occurrences

### 2. inspect · dominant-role-exception · page-005.jpg · img5-m72 · img5-m72-p1

- Observed: `i:1 as final in m:1 a:1 n:1 c:1 i:1`
- Expected/check: `i:1 as medial`
- Support: 56/57
- Locate: y=2618
- Atom ids: `6508`
- Why: i:1 is medial in 56/57 occurrences

### 3. inspect · dominant-role-exception · page-005.jpg · img5-m92 · img5-m92-p5

- Observed: `d:1 as initial in d:1 e:1 j:1`
- Expected/check: `d:1 as final`
- Support: 59/61
- Locate: y=2736
- Atom ids: `6380`
- Why: d:1 is final in 59/61 occurrences

### 4. inspect · strong-context-exception · page-005.jpg · img5-m24 · img5-m24-p2

- Observed: `l:1 f:1`
- Expected/check: `has_prior e:1`
- Support: 40/41
- Locate: y=747
- Atom ids: `6224`
- Why: f:1 final usually satisfies has_prior e:1

### 5. inspect · strong-context-exception · page-005.jpg · img5-m24 · img5-m24-p2

- Observed: `l:1 f:1`
- Expected/check: `prev_is e:1`
- Support: 40/41
- Locate: y=747
- Atom ids: `6224`
- Why: f:1 final usually satisfies prev_is e:1

### 6. inspect · strong-context-exception · page-005.jpg · img5-m24 · img5-m24-p2

- Observed: `l:1 f:1`
- Expected/check: `starts_with e:1`
- Support: 40/41
- Locate: y=747
- Atom ids: `6224`
- Why: f:1 final usually satisfies starts_with e:1

### 7. inspect · strong-context-exception · page-005.jpg · img5-m25 · img5-m25-p2

- Observed: `e:1 g:1 c:1`
- Expected/check: `has_after e:1`
- Support: 51/53
- Locate: y=741
- Atom ids: `6412`
- Why: g:1 medial usually satisfies has_after e:1

### 8. inspect · strong-context-exception · page-005.jpg · img5-m25 · img5-m25-p2

- Observed: `e:1 g:1 c:1`
- Expected/check: `next_is e:1`
- Support: 51/53
- Locate: y=741
- Atom ids: `6412`
- Why: g:1 medial usually satisfies next_is e:1

### 9. inspect · strong-context-exception · page-005.jpg · img5-m25 · img5-m25-p2

- Observed: `e:1 g:1 c:1`
- Expected/check: `ends_with e:1`
- Support: 51/53
- Locate: y=741
- Atom ids: `6412`
- Why: g:1 medial usually satisfies ends_with e:1

### 10. inspect · strong-context-exception · page-005.jpg · img5-m3 · img5-m3-p2

- Observed: `a:1 m:1 c:1 a:1 b:1 d:1`
- Expected/check: `has_prior i:1`
- Support: 56/59
- Locate: y=446
- Atom ids: `6345`
- Why: d:1 final usually satisfies has_prior i:1

### 11. inspect · strong-context-exception · page-005.jpg · img5-m3 · img5-m3-p2

- Observed: `a:1 m:1 c:1 a:1 b:1 d:1`
- Expected/check: `prev_is i:1`
- Support: 56/59
- Locate: y=446
- Atom ids: `6345`
- Why: d:1 final usually satisfies prev_is i:1

### 12. inspect · strong-context-exception · page-005.jpg · img5-m4 · img5-m4-p1

- Observed: `e:1 a:1 b:1 c:1 a:1 b:1 d:1`
- Expected/check: `has_prior i:1`
- Support: 56/59
- Locate: y=468
- Atom ids: `6347`
- Why: d:1 final usually satisfies has_prior i:1

### 13. inspect · strong-context-exception · page-005.jpg · img5-m4 · img5-m4-p1

- Observed: `e:1 a:1 b:1 c:1 a:1 b:1 d:1`
- Expected/check: `prev_is i:1`
- Support: 56/59
- Locate: y=468
- Atom ids: `6347`
- Why: d:1 final usually satisfies prev_is i:1

### 14. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `has_after d:1`
- Support: 23/24
- Locate: y=2433
- Atom ids: `6163`
- Why: f:1 medial usually satisfies has_after d:1

### 15. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `has_after i:1`
- Support: 23/24
- Locate: y=2433
- Atom ids: `6163`
- Why: f:1 medial usually satisfies has_after i:1

### 16. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `next_is i:1`
- Support: 23/24
- Locate: y=2433
- Atom ids: `6163`
- Why: f:1 medial usually satisfies next_is i:1

### 17. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `ends_with d:1`
- Support: 23/24
- Locate: y=2433
- Atom ids: `6163`
- Why: f:1 medial usually satisfies ends_with d:1

### 18. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `has_after d:1`
- Support: 17/18
- Locate: y=2433
- Atom ids: `6233`
- Why: k:1 initial usually satisfies has_after d:1

### 19. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `has_after i:1`
- Support: 17/18
- Locate: y=2433
- Atom ids: `6233`
- Why: k:1 initial usually satisfies has_after i:1

### 20. inspect · strong-context-exception · page-005.jpg · img5-m49 · img5-m49-p3

- Observed: `k:1 f:1 j:1`
- Expected/check: `ends_with d:1`
- Support: 17/18
- Locate: y=2433
- Atom ids: `6233`
- Why: k:1 initial usually satisfies ends_with d:1

### 21. inspect · strong-context-exception · page-005.jpg · img5-m57 · img5-m57-p3

- Observed: `a:1 b:1 c:1 a:1 b:1 d:1`
- Expected/check: `has_prior i:1`
- Support: 56/59
- Locate: y=2436
- Atom ids: `6391`
- Why: d:1 final usually satisfies has_prior i:1

### 22. inspect · strong-context-exception · page-005.jpg · img5-m57 · img5-m57-p3

- Observed: `a:1 b:1 c:1 a:1 b:1 d:1`
- Expected/check: `prev_is i:1`
- Support: 56/59
- Locate: y=2436
- Atom ids: `6391`
- Why: d:1 final usually satisfies prev_is i:1

### 23. inspect · strong-context-exception · page-005.jpg · img5-m9 · img5-m9-p1

- Observed: `e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1`
- Expected/check: `has_after e:1`
- Support: 51/53
- Locate: y=576
- Atom ids: `6400`
- Why: g:1 medial usually satisfies has_after e:1

### 24. inspect · strong-context-exception · page-005.jpg · img5-m9 · img5-m9-p1

- Observed: `e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1`
- Expected/check: `next_is e:1`
- Support: 51/53
- Locate: y=576
- Atom ids: `6400`
- Why: g:1 medial usually satisfies next_is e:1

### 25. inspect · strong-context-exception · page-005.jpg · img5-m9 · img5-m9-p1

- Observed: `e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1`
- Expected/check: `ends_with e:1`
- Support: 51/53
- Locate: y=576
- Atom ids: `6400`
- Why: g:1 medial usually satisfies ends_with e:1

### 26. inspect · strong-context-exception · page-005.jpg · img5-m92 · img5-m92-p5

- Observed: `d:1 e:1 j:1`
- Expected/check: `has_prior f:1`
- Support: 25/26
- Locate: y=2736
- Atom ids: `6379`
- Why: j:1 final usually satisfies has_prior f:1

### 27. inspect · strong-context-exception · page-005.jpg · img5-m92 · img5-m92-p5

- Observed: `d:1 e:1 j:1`
- Expected/check: `prev_is f:1`
- Support: 25/26
- Locate: y=2736
- Atom ids: `6379`
- Why: j:1 final usually satisfies prev_is f:1


## Informational

### 1. informational · manual-gap-overrides · page-005.jpg

- Observed: `0`
- Expected/check: ``
- Support: 0 gap overrides
- Locate: -
- Atom ids: `-`
- Why: manual cut/join overrides exist; audit visually before final freeze if desired

### 2. informational · manual-row-overrides · page-005.jpg

- Observed: `18`
- Expected/check: ``
- Support: 18 row overrides
- Locate: -
- Atom ids: `-`
- Why: manual row overrides exist; these are expected after row editing but worth documenting

### 3. informational · molecule-minority-order · page-005.jpg · img5-m93

- Observed: `e:1 g:1 e:1 e:1 a:1 e:1 b:1 c:1 a:1 e:1 h:1`
- Expected/check: `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 e:1 h:1`
- Support: minority 1/2; dominant 1/2
- Locate: y=2741
- Atom ids: `5887 6447 5888 5889 5979 5890 6003 6066 5980 5891 5939`
- Why: same inventory has a minority order; bag=a:1 a:1 b:1 c:1 e:1 e:1 e:1 e:1 e:1 g:1 h:1


Full table: `freeze-corpus-audit.tsv`

Known anomalies table: `freeze-corpus-known-anomalies.tsv`
