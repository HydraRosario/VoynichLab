# NULL-CONTROL-V3-MODEL-COMPARISON

Purpose: compare whether frozen full-frame identity predicts held-out substitution slot values better than local context alone, without using held-out folios for candidate values, frequencies, smoothing, vocabulary restrictions, or model selection.

## Data Split

- Training folios: `f1r`, `f1v`, `f47v`.
- Evaluation folios: `f2r`, `f2v`.
- Frozen substitution families: `19`.
- Evaluated opportunities: exactly the held-out molecules matching frozen substitution-family skeletons.

## Models

### Model A - Local Context Baseline

Predicts slot values from:

- immediate left neighbor;
- immediate right neighbor;
- positional role;
- molecule length.

### Model B - Full-Frame Model

Predicts slot values from the complete frozen substitution skeleton outside the target slot. This includes the local context but also the full surrounding frame.

### Smoothing

Both models use fixed Lidstone smoothing with `alpha=0.5` over the training-only ATOMS vocabulary.

Training vocabulary size: `16`.
Training vocabulary: `a:1 b:1 c:1 c:2 d:1 e:1 f:1 g:1 h:1 h:2 i:1 j:1 k:1 l:1 m:1 n:1`.

A held-out value absent from the training vocabulary receives probability `0`; this is reported separately. No held-out value was used to define the vocabulary.

## Primary Metric

Predictive log-loss / cross-entropy in bits. Lower is better.

Delta log-loss is:

```text
Model A log-loss - Model B log-loss
```

- Positive delta: full-frame identity improves prediction.
- Approximately zero: frame identity adds little beyond local context.
- Negative delta: frame model generalizes worse.

## Summary

| Scope | N | Model A log-loss | Model B log-loss | Delta | Model A top-1 | Model B top-1 | Mean P(obs) A | Mean P(obs) B | Unseen A contexts | Unseen B frames | Unseen values |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `combined` | 34 | 1.149743 | 1.214627 | -0.064884 | 94.12% | 94.12% | 0.472957 | 0.445978 | 0 | 0 | 0 |
| `f2r` | 17 | 1.101215 | 1.170346 | -0.069131 | 94.12% | 94.12% | 0.482630 | 0.454103 | 0 | 0 | 0 |
| `f2v` | 17 | 1.198271 | 1.258908 | -0.060637 | 94.12% | 94.12% | 0.463283 | 0.437852 | 0 | 0 | 0 |

## Interpretation

Model B generalizes worse than the local-context baseline. Under this comparison, frozen frame identity does not improve prediction and may be over-specific for the current held-out data.

No dramatic p-value is reported here. The purpose of V3 is model comparison, not significance testing.

## Output Table

- `null-control-v3-opportunities.tsv` contains one row per evaluated held-out slot opportunity.
