# Changelog — CORPUS-V1 → CORPUS-V2-AUDITED

## Relabels (c:2 ↔ c:1 confusion)

Systematic relabeling of a c:2 subfamily (~80 pts, open arc) to c:1, and one c:1 (668 pts, closed arc) to c:2.

| Atom ID | Folio | V1 label | V2 label | Reason |
|---------|-------|----------|----------|--------|
| 1287 | f1r | c:2 | c:1 | Morphology consistent with c:1 |
| 1136 | f1r | c:2 | c:1 | Same subfamily as 1287 |
| 1440 | f1r | c:2 | c:1 | Same subfamily as 1287 |
| 2100 | f1r | c:2 | c:1 | Same subfamily as 1287 |
| 2553 | f1r | c:2 | c:1 | Same subfamily as 1287 |
| 2696 | f47v | c:1 | c:2 | Metric twin of canonical c:2 (668 pts, closed variant) |

## Confirmed correct

| Atom ID | Folio | Label | Reason |
|---------|-------|-------|--------|
| 1509 | f1r | h:1 | Large variant but correctly labeled |
| 1727 | f1r | h:1 | Large variant but correctly labeled |

## Excluded artifacts

| Atom ID | Folio | V1 label | Reason |
|---------|-------|----------|--------|
| 5103 | f1v | c:2 | Accidental three-point click; zero stroke area |

## Stale snapshot artifacts

| Atom ID | Folio | V1 label | Reason |
|---------|-------|----------|--------|
| 3777 | f1r | g:1 | Does not exist in live DB; visual snapshot is stale |
| 3778 | f1r | g:1 | Does not exist in live DB; visual snapshot is stale |

## Inventory impact

| Label | V1 count | V2 count (projected) | Delta |
|-------|:--------:|:--------------------:|:-----:|
| c:1 | 645 | 643 | −2 |
| c:2 | 34 | 35 | +1 |
| (excluded) | — | 1 | — |

*Note: counts require snapshot regeneration from live DB for precise verification.*
