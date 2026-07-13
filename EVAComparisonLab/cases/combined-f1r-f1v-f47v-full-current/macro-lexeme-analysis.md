# Macro Lexeme Analysis

## Hypothesis

Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.

## Scope

- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`
- Molecules / physical units: `370`
- Original atom vocabulary: `16`
- Macro vocabulary after merge: `12`
- Original unique molecule signatures: `254`
- Macro unique lexeme signatures: `248`

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
| `l:1` | 24 | 0.0000 | medial | 1.0000 | medial:24 |
| `MEDIAL_OP` | 654 | 0.0299 | medial | 0.9969 | medial:652 final:2 |
| `f:1` | 348 | 0.0568 | medial | 0.9943 | medial:346 final:1 initial:1 |
| `h:2` | 126 | 0.3095 | medial | 0.9444 | medial:119 final:7 |
| `c:2` | 33 | 0.3298 | medial | 0.9394 | medial:31 initial:2 |
| `a:1` | 341 | 0.5841 | medial | 0.8768 | medial:299 initial:39 final:3 |
| `h:1` | 161 | 0.5917 | final | 0.8571 | final:138 medial:23 |
| `c:1` | 524 | 0.7437 | medial | 0.8511 | medial:446 initial:52 final:26 |
| `e:1` | 1069 | 0.8024 | medial | 0.7802 | medial:834 initial:228 final:7 |
| `j:1` | 88 | 0.8454 | final | 0.7273 | final:64 medial:24 |
| `n:1` | 66 | 0.8454 | initial | 0.7273 | initial:48 medial:18 |
| `d:1` | 187 | 0.9319 | final | 0.6524 | final:122 medial:65 |

## Top Macro Lexemes

| Count | Share | Macro Signature | Examples |
| ---: | ---: | --- | --- |
| 17 | 0.0459 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u091, p003-u105, p003-u106, p003-u110, p003-u150 |
| 10 | 0.0270 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u033, p003-u059, p003-u082, p003-u099, p003-u170 |
| 8 | 0.0216 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` | p003-u056, p003-u063, p003-u089, p003-u132, p003-u143 |
| 7 | 0.0189 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u096, p003-u155, p003-u160, p003-u163, p004-u035 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 c:1` | p003-u108, p003-u166, p003-u192, p004-u029, p094-u063 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u015, p004-u022, p004-u070, p004-u087, p094-u035 |
| 6 | 0.0162 | `e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u049, p094-u061, p094-u065, p094-u070, p094-u073 |
| 6 | 0.0162 | `n:1 e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u005, p003-u127, p004-u032, p004-u043, p004-u079 |
| 5 | 0.0135 | `c:1 f:1 MEDIAL_OP d:1` | p003-u022, p003-u035, p003-u064, p004-u010, p004-u074 |
| 4 | 0.0108 | `e:1 a:1 e:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u097, p003-u124, p004-u050, p094-u027 |
| 4 | 0.0108 | `e:1 c:1 h:2 c:1 f:1 j:1` | p004-u024, p004-u045, p004-u055, p004-u058 |
| 4 | 0.0108 | `e:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u102, p004-u005, p004-u009, p094-u015 |
| 4 | 0.0108 | `n:1 e:1 MEDIAL_OP e:1 c:1` | p003-u087, p003-u109, p003-u116, p094-u024 |
| 4 | 0.0108 | `n:1 e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p003-u051, p003-u062, p003-u184, p004-u083 |
| 3 | 0.0081 | `a:1 MEDIAL_OP c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u013, p004-u030, p004-u037 |
| 3 | 0.0081 | `a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u104, p004-u064, p094-u023 |
| 3 | 0.0081 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u179, p003-u187, p094-u010 |
| 3 | 0.0081 | `c:1 f:1 j:1` | p004-u003, p004-u052, p004-u063 |
| 3 | 0.0081 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u084, p003-u144, p004-u056 |
| 3 | 0.0081 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u011, p003-u017, p003-u165 |
| 3 | 0.0081 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | p003-u190, p004-u023, p004-u086 |
| 3 | 0.0081 | `e:1 c:1 h:2 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u094, p094-u059, p094-u064 |
| 3 | 0.0081 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` | p003-u057, p003-u141, p094-u030 |
| 3 | 0.0081 | `e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u142, p004-u036, p004-u046 |
| 3 | 0.0081 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u103, p003-u152, p003-u164 |
| 3 | 0.0081 | `n:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u018, p094-u009, p094-u032 |
| 2 | 0.0054 | `a:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u188, p003-u189 |
| 2 | 0.0054 | `c:1 a:1 e:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u030, p094-u062 |
| 2 | 0.0054 | `c:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u169, p004-u075 |
| 2 | 0.0054 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u034, p003-u167 |
| 2 | 0.0054 | `c:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p003-u118, p004-u011 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP d:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u040, p004-u006 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p004-u042, p004-u069 |
| 2 | 0.0054 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u186, p004-u020 |
| 2 | 0.0054 | `e:1 c:1 h:2 c:1 f:1 MEDIAL_OP d:1` | p003-u114, p094-u017 |
| 2 | 0.0054 | `e:1 h:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p004-u057, p004-u060 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 f:1 f:1 j:1` | p094-u006, p094-u047 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 f:1 f:1 MEDIAL_OP d:1 e:1 h:1` | p094-u007, p094-u034 |
| 2 | 0.0054 | `e:1 MEDIAL_OP d:1 e:1 h:1` | p003-u019, p003-u028 |
| 2 | 0.0054 | `e:1 MEDIAL_OP e:1 c:1 a:1 MEDIAL_OP c:1 a:1 e:1 h:1` | p003-u195, p004-u040 |

## Interpretation

- This is a hypothesis test, not a destructive relabeling.
- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.
- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.
