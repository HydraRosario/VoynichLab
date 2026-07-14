# VoynichLab Research Timeline

This timeline preserves the current experimental sequence, including negative and weakened results. It should not be rewritten as if every step supported ATOMS-V1.

## 1. ATOMS-V1 Freeze

ATOMS-V1 fixed a 16-symbol stroke-based inventory:

```text
a:1 b:1 c:1 c:2 d:1 e:1 f:1 g:1 h:1 h:2 i:1 j:1 k:1 l:1 m:1 n:1
```

The inventory is treated as a fixed representation for the experiments below. These symbols are not claimed to be letters, phonemes, morphemes, or semantic units.

## 2. GRAMMAR-V1 Induction

GRAMMAR-V1 was induced from the training folios:

```text
f1r, f1v, f47v
```

The frozen grammar contains 19 substitution families and 55 optional families. It was not induced from `f2r` or `f2v`.

## 3. f2r Held-Out Compatibility

The first held-out folio, `f2r`, reused known frozen substitution-slot values:

```text
observed substitution families: 8
clean families: 8
new slot values: 0
```

This result supported the claim that some train-derived ATOMS frames reappeared outside training.

## 4. f2v Prospective Compatibility

After GRAMMAR-V1 was already frozen, `f2v` was labeled and evaluated prospectively:

```text
observed substitution families: 7
clean families: 7
new slot values: 0
```

This extended the compatibility result to a second held-out folio without reinducing GRAMMAR-V1.

## 5. NULL-CONTROL-V1

NULL-CONTROL-V1 sampled slot values from broad empirical atom distributions. No simulation out of 100,000 reproduced the joint clean result, and a naive independence calculation produced an extremely small number.

This was not accepted as the main probability claim, because the null was too broad: it allowed draws from symbols that may not be structurally plausible in a local slot.

Report:

```text
out/null-control-v1/NULL-CONTROL-V1.md
```

## 6. NULL-CONTROL-V2-CONTEXTUAL

NULL-CONTROL-V2 sampled only from locally comparable contexts in the test folios: same length, same positional role, and same immediate neighbors.

The clean joint result became much less surprising:

```text
contextual empirical probability: 0.099090
```

This weakened the interpretation that GRAMMAR-V1 family compatibility was extraordinary by itself. Local syntax explained much of the apparent constraint.

Report:

```text
out/null-control-v2-contextual/NULL-CONTROL-V2-CONTEXTUAL.md
```

## 7. NULL-CONTROL-V3-MODEL-COMPARISON

V3 compared two train-only predictors:

```text
Model A: local context
Model B: exact frozen frame identity
```

The exact frame model did not improve out-of-sample prediction over local context. It was slightly worse:

```text
combined local-context log-loss: 1.149743
combined full-frame log-loss:   1.214627
```

Diagnostic analysis showed the loss was concentrated in a shared context:

```text
length=9 | medial | f:1 [_] d:1
```

This result preserved GRAMMAR-V1 as a useful descriptive structure, but weakened it as an independent predictive layer beyond local syntax.

Reports:

```text
out/null-control-v3/NULL-CONTROL-V3-MODEL-COMPARISON.md
out/null-control-v3/NULL-CONTROL-V3-DIAGNOSTICS.md
```

## 8. REPRESENTATION-COMPARISON-V1

The first EVA-vs-ATOMS predictive comparison used only rows with directly paired molecule-level EVA tokens.

It was insufficient as a global comparison because coverage was too low:

```text
test paired coverage: 14 / 161 molecules
```

On that tiny subset, EVA performed better. The main value of V1 was exposing the alignment problem, not deciding representation superiority.

Report:

```text
out/representation-comparison-v1/REPRESENTATION-COMPARISON-V1.md
```

## 9. REPRESENTATION-ALIGNMENT-V1

ALIGNMENT-V1 created monotonic manuscript regions linking EVA token groups and ATOMS physical unit groups without assuming one-to-one correspondence.

```text
aligned regions: 209
unresolved regions: 15
ATOMS coverage: 100%
EVA coverage: 93.33% to 98.82%
crossing alignments: 0
```

The method uses real ATOMS bounding-box spans and ordinal estimated EVA spans. It is a regional audit layer, not proof of exact token-level visual boundaries.

Report:

```text
out/representation-alignment-v1/REPRESENTATION-ALIGNMENT-V1.md
```

## 10. REPRESENTATION-COMPARISON-V2-REGIONS

V2 compared EVA and ATOMS over the same aligned manuscript regions.

Primary combined result:

```text
ATOMS normalized log-loss: 0.807922
EVA normalized log-loss:   0.892706

ATOMS top-1 accuracy: 42.96%
EVA top-1 accuracy:   26.30%

ATOMS unseen-context rate: 46.18%
EVA unseen-context rate:   60.47%
```

The advantage survived key sensitivity strata:

```text
medium confidence: ATOMS favorable
medium + low-medium: ATOMS favorable
1:1 regions: ATOMS favorable
lines without unresolved EVA tokens: ATOMS favorable
```

The real-versus-corrupted test also favored ATOMS in the combined regional comparison:

```text
ATOMS real better than median corruption: 86.15%
EVA real better than median corruption:   76.92%
```

This is exploratory evidence that ATOMS-V1 preserves more out-of-sample regional predictive structure than EVA under the current local-context protocol. It is not a decipherment claim and not proof of global representation superiority.

Reports:

```text
out/representation-comparison-v2-regions/REPRESENTATION-COMPARISON-V2-REGIONS.md
out/representation-comparison-v2-regions/EVA-QUESTION-MARK-SENSITIVITY.md
```

## 11. REPRESENTATION-COMPARISON-V3-ABLATIONS

V3 tested whether the V2 regional advantage depended on exact regional sequence length. Five train-only models were compared under the same held-out folios and aligned-region protocol:

```text
MODEL_0: unigram only
MODEL_1: left + right + role
MODEL_2: left + right
MODEL_3: left + right + role + exact length
MODEL_4: left + right + coarse length bucket
```

Combined normalized log-loss:

```text
MODEL_0: ATOMS 0.827423 | EVA 0.872674 | delta -0.045251
MODEL_1: ATOMS 0.242737 | EVA 0.431970 | delta -0.189234
MODEL_2: ATOMS 0.310095 | EVA 0.553298 | delta -0.243202
MODEL_3: ATOMS 0.807922 | EVA 0.892706 | delta -0.084784
MODEL_4: ATOMS 0.426049 | EVA 0.683648 | delta -0.257599
```

MODEL_3 reproduces the V2 primary model:

```text
ATOMS normalized log-loss: 0.807922
EVA normalized log-loss:   0.892706

ATOMS top-1 accuracy: 42.96%
EVA top-1 accuracy:   26.30%

ATOMS unseen-context rate: 46.18%
EVA unseen-context rate:   60.47%
```

The advantage remained favorable when exact length was removed from the local-context model:

```text
MODEL_1 ATOMS normalized log-loss: 0.242737
MODEL_1 EVA normalized log-loss:   0.431970

MODEL_2 ATOMS normalized log-loss: 0.310095
MODEL_2 EVA normalized log-loss:   0.553298
```

The unigram baseline also favored ATOMS overall:

```text
MODEL_0 ATOMS normalized log-loss: 0.827423
MODEL_0 EVA normalized log-loss:   0.872674
```

This means the current advantage cannot be attributed only to exact regional length. It also means frequency concentration contributes to the result, so the representation claim should not be reduced to local syntax alone.

One bounded exception appeared in the unigram baseline:

```text
one_to_one / f2v / MODEL_0 unigram:
ATOMS normalized log-loss: 0.785857
EVA normalized log-loss:   0.777664
```

ATOMS still had higher top-1 accuracy in that stratum, but the exception is kept as a limit on overinterpretation.

Report:

```text
out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md
```

## Current Reading

The strongest current claim is:

> Under matched regional out-of-sample conditions, ATOMS-V1 produced lower normalized uncertainty, higher top-1 accuracy, and lower unseen-context rate than EVA across aligned manuscript regions; ablation tests show that this advantage does not depend only on exact regional sequence length.

The strongest remaining limitations are:

- one ATOMS annotator;
- approximate EVA token spans;
- five folios only;
- small high-confidence strata;
- one family of predictive models;
- frequency concentration contributes to the ATOMS advantage;
- no independent visual annotation audit in the public release yet.
