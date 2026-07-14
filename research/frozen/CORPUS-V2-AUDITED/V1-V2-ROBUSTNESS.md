# V1 to V2 Robustness Summary

CORPUS-V2-AUDITED is not a new alphabet and not a redefinition of ATOMS-V1. It is a quality-control pass over the labeled corpus followed by a replay of the existing structural analyses.

## Current V2 replay

| Metric | V2 result |
|---|---:|
| Folios | 6 |
| ATOMS units | 639 |
| EVA units | 660 |
| ATOMS atom tokens | 6,222 |
| ATOMS weighted positional entropy | 0.5409 |
| EVA weighted positional entropy | 0.7688 |
| Delta ATOMS - EVA | -0.2279 |
| Morphology 5NN accuracy | 97.85% |
| Line alignment mismatches | 0 |
| Pending audit candidates | 0 |

## Robustness reading

The audited corpus preserves the main direction of the project: ATOMS remains a lower-entropy structural representation than EVA over the currently labeled folios. Morphological separability also remains high under the current snapshot-derived feature set.

The result does not prove decipherment, semantic interpretation, or global optimality. It says that after documented human-error cleanup and stale-memory removal, the current six-folio corpus still supports the structural comparison that motivated the audit.

## Historical sensitivity note

During the audit, page-003 entropy decreased from the earlier working value 0.5246 to the audited value 0.5096. This supports the interpretation that at least some manual corrections removed noise rather than manufacturing the main signal. The full-corpus V2 result should be treated as the authoritative audited state going forward.
