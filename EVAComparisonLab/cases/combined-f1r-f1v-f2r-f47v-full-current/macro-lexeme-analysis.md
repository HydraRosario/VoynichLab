# Macro Lexeme Analysis

## Hypothesis

Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.

## Scope

- Input: `cases\combined-f1r-f1v-f2r-f47v-full-current\atoms-current.tsv`
- Molecules / physical units: `473`
- Original atom vocabulary: `16`
- Macro vocabulary after merge: `12`
- Original unique molecule signatures: `305`
- Macro unique lexeme signatures: `298`

## Macro Vocabulary

| Macro Symbol | Source |
| --- | --- |
| `a:1` | `self` |
| `c:1` | `self` |
| `c:2` | `self` |
| `d:1` | `self` |
| `e:1` | `self` |
| `f:1` | `self` |
| `h:1` | `self` |
| `h:2` | `self` |
| `j:1` | `self` |
| `l:1` | `self` |
| `MEDIAL_OP` | `g:1`, `i:1`, `b:1`, `k:1`, `m:1` |
| `n:1` | `self` |

## Macro Role Entropy

| Symbol | Count | H(role) | Dominant | Share | Roles |
| --- | ---: | ---: | --- | ---: | --- |
| `l:1` | 31 | 0.0000 | medial | 1.0000 | medial:31 |
| `MEDIAL_OP` | 827 | 0.0380 | medial | 0.9964 | medial:824 final:2 initial:1 |
| `f:1` | 459 | 0.0809 | medial | 0.9913 | medial:455 final:2 initial:2 |
| `h:2` | 160 | 0.2864 | medial | 0.9500 | medial:152 final:8 |
| `c:2` | 34 | 0.4306 | medial | 0.9118 | medial:31 initial:3 |
| `a:1` | 419 | 0.5448 | medial | 0.8878 | medial:372 initial:44 final:3 |
| `h:1` | 209 | 0.7044 | final | 0.8086 | final:169 medial:40 |
| `c:1` | 642 | 0.7539 | medial | 0.8474 | medial:544 initial:67 final:31 |
| `e:1` | 1332 | 0.9076 | medial | 0.7515 | medial:1001 initial:305 final:26 |
| `d:1` | 248 | 0.9348 | final | 0.6492 | final:161 medial:87 |
| `j:1` | 114 | 0.9560 | final | 0.6228 | final:71 medial:43 |
| `n:1` | 82 | 0.9567 | initial | 0.6220 | initial:51 medial:31 |

## Top Macro Lexemes

| Count | Share | Macro Signature | Examples |
| ---: | ---: | --- | --- |
| 20 | 0.0423 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u091, p003-u105, p003-u106, p003-u110, p003-u150 |
| 13 | 0.0275 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u033, p003-u059, p003-u082, p003-u099, p003-u169 |
| 10 | 0.0211 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u096, p003-u154, p003-u159, p003-u162, p004-u035 |
| 9 | 0.0190 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` | p003-u056, p003-u063, p003-u089, p003-u132, p003-u143 |
| 9 | 0.0190 | `e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u049, p005-u018, p005-u083, p005-u091, p094-u061 |
| 9 | 0.0190 | `n:1 e:1 MEDIAL_OP e:1` | p004-u073, p005-u011, p005-u029, p005-u043, p005-u049 |
| 7 | 0.0148 | `c:1 f:1 j:1 n:1 e:1 MEDIAL_OP e:1` | p003-u005, p003-u127, p004-u032, p004-u043, p004-u079 |
| 7 | 0.0148 | `c:1 f:1 MEDIAL_OP d:1` | p003-u022, p003-u035, p003-u064, p004-u010, p004-u074 |
| 6 | 0.0127 | `e:1 MEDIAL_OP e:1 c:1` | p003-u108, p003-u165, p003-u191, p004-u029, p094-u063 |
| 6 | 0.0127 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u015, p004-u022, p004-u070, p004-u087, p094-u035 |
| 5 | 0.0106 | `e:1 a:1 e:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u097, p003-u124, p004-u050, p005-u013, p094-u027 |
| 5 | 0.0106 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` | p003-u057, p003-u141, p005-u017, p005-u092, p094-u030 |
| 5 | 0.0106 | `e:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u102, p004-u005, p004-u009, p005-u096, p094-u015 |
| 5 | 0.0106 | `n:1 e:1 MEDIAL_OP e:1 c:1` | p003-u087, p003-u109, p003-u116, p005-u100, p094-u024 |
| 4 | 0.0085 | `a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u104, p004-u064, p005-u060, p094-u023 |
| 4 | 0.0085 | `c:1 f:1 j:1` | p004-u003, p004-u052, p004-u063, p005-u073 |
| 4 | 0.0085 | `e:1 c:1 h:2 c:1 f:1 j:1` | p004-u024, p004-u045, p004-u055, p004-u058 |
| 4 | 0.0085 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | p003-u189, p004-u023, p004-u086, p005-u082 |
| 4 | 0.0085 | `e:1 c:1 h:2 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u094, p005-u041, p094-u059, p094-u064 |
| 4 | 0.0085 | `e:1 MEDIAL_OP d:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u035, p005-u069, p005-u097, p094-u037 |
| 4 | 0.0085 | `e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u142, p004-u036, p004-u046, p005-u102 |
| 4 | 0.0085 | `n:1 e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p003-u051, p003-u062, p003-u183, p004-u083 |
| 3 | 0.0063 | `a:1 MEDIAL_OP c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u013, p004-u030, p004-u037 |
| 3 | 0.0063 | `c:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u168, p004-u075, p005-u090 |
| 3 | 0.0063 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u178, p003-u186, p094-u010 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u084, p003-u144, p004-u056 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u011, p003-u017, p003-u164 |
| 3 | 0.0063 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u185, p004-u020, p005-u045 |
| 3 | 0.0063 | `e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u003, p005-u086, p005-u095 |
| 3 | 0.0063 | `e:1 MEDIAL_OP e:1 e:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p003-u119, p005-u098, p094-u049 |
| 3 | 0.0063 | `e:1 MEDIAL_OP e:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u007, p005-u020, p094-u080 |
| 3 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 e:1 h:1` | p003-u050, p005-u061, p094-u022 |
| 3 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u018, p094-u009, p094-u032 |
| 2 | 0.0042 | `a:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u187, p003-u188 |
| 2 | 0.0042 | `c:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u030, p094-u062 |
| 2 | 0.0042 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u034, p003-u166 |
| 2 | 0.0042 | `c:1 e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u092, p005-u030 |
| 2 | 0.0042 | `c:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u118, p004-u011 |
| 2 | 0.0042 | `e:1 a:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p005-u075, p094-u066 |
| 2 | 0.0042 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP d:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u040, p004-u006 |

## Interpretation

- This is a hypothesis test, not a destructive relabeling.
- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.
- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.
