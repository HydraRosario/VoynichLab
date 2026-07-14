# Macro Lexeme Analysis

## Hypothesis

Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.

## Scope

- Input: `cases\corpus-v2-audited-current\atoms-current.tsv`
- Molecules / physical units: `639`
- Original atom vocabulary: `16`
- Macro vocabulary after merge: `12`
- Original unique molecule signatures: `414`
- Macro unique lexeme signatures: `406`

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
| `l:1` | 39 | 0.0000 | medial | 1.0000 | medial:39 |
| `MEDIAL_OP` | 1160 | 0.0283 | medial | 0.9974 | medial:1157 final:2 initial:1 |
| `f:1` | 636 | 0.0307 | medial | 0.9969 | medial:634 initial:2 |
| `h:2` | 197 | 0.2678 | medial | 0.9543 | medial:188 final:9 |
| `c:2` | 57 | 0.4855 | medial | 0.8947 | medial:51 initial:6 |
| `a:1` | 570 | 0.6538 | medial | 0.8456 | medial:482 initial:85 final:3 |
| `h:1` | 277 | 0.6812 | final | 0.8195 | final:227 medial:50 |
| `c:1` | 924 | 0.6976 | medial | 0.8636 | medial:798 initial:86 final:40 |
| `e:1` | 1763 | 0.8468 | medial | 0.7680 | medial:1354 initial:389 final:20 |
| `d:1` | 335 | 0.9004 | final | 0.6836 | final:229 medial:106 |
| `j:1` | 160 | 0.9030 | final | 0.6813 | final:109 medial:51 |
| `n:1` | 104 | 0.9118 | initial | 0.6731 | initial:70 medial:34 |

## Top Macro Lexemes

| Count | Share | Macro Signature | Examples |
| ---: | ---: | --- | --- |
| 28 | 0.0438 | `e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u092, p003-u106, p003-u107, p003-u111, p003-u151 |
| 19 | 0.0297 | `e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u034, p003-u060, p003-u083, p003-u100, p003-u171 |
| 14 | 0.0219 | `e:1 MEDIAL_OP e:1 c:1 f:1 MEDIAL_OP d:1` | p003-u058, p003-u142, p005-u017, p005-u092, p006-u004 |
| 11 | 0.0172 | `e:1 c:1 h:2 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u019, p003-u097, p003-u156, p003-u161, p003-u164 |
| 10 | 0.0156 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 MEDIAL_OP d:1` | p003-u057, p003-u064, p003-u090, p003-u133, p003-u144 |
| 10 | 0.0156 | `e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u049, p005-u018, p005-u083, p005-u091, p006-u041 |
| 9 | 0.0141 | `n:1 e:1 MEDIAL_OP e:1` | p004-u073, p005-u011, p005-u029, p005-u043, p005-u049 |
| 8 | 0.0125 | `c:1 f:1 MEDIAL_OP d:1` | p003-u023, p003-u036, p003-u065, p004-u010, p004-u074 |
| 7 | 0.0110 | `c:1 f:1 j:1` | p004-u003, p004-u052, p004-u063, p005-u055, p005-u073 |
| 7 | 0.0110 | `e:1 a:1 e:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u098, p003-u125, p004-u050, p005-u013, p007-u015 |
| 7 | 0.0110 | `e:1 MEDIAL_OP e:1 c:1` | p003-u109, p003-u167, p003-u193, p004-u029, p007-u021 |
| 7 | 0.0110 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u015, p004-u022, p004-u070, p004-u087, p006-u019 |
| 7 | 0.0110 | `n:1 e:1 MEDIAL_OP e:1 c:1` | p003-u088, p003-u110, p003-u117, p005-u100, p006-u023 |
| 7 | 0.0110 | `n:1 e:1 MEDIAL_OP e:1 c:1 f:1 j:1` | p003-u005, p003-u128, p004-u032, p004-u043, p004-u079 |
| 6 | 0.0094 | `e:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u103, p004-u005, p004-u009, p005-u096, p006-u045 |
| 4 | 0.0063 | `a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u105, p004-u064, p005-u060, p094-u023 |
| 4 | 0.0063 | `e:1 c:1 h:2 c:1 f:1 j:1` | p004-u024, p004-u045, p004-u055, p004-u058 |
| 4 | 0.0063 | `e:1 c:1 h:2 c:1 f:1 MEDIAL_OP d:1` | p003-u115, p006-u033, p006-u036, p094-u017 |
| 4 | 0.0063 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | p003-u191, p004-u023, p004-u086, p005-u082 |
| 4 | 0.0063 | `e:1 MEDIAL_OP d:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u035, p005-u069, p005-u097, p094-u037 |
| 4 | 0.0063 | `e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u143, p004-u036, p004-u046, p005-u102 |
| 4 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 h:1` | p003-u052, p003-u063, p003-u185, p004-u083 |
| 4 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u104, p003-u153, p003-u165, p007-u052 |
| 4 | 0.0063 | `n:1 e:1 MEDIAL_OP e:1 e:1 h:1` | p004-u018, p006-u028, p094-u009, p094-u032 |
| 3 | 0.0047 | `a:1 MEDIAL_OP c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | p004-u013, p004-u030, p004-u037 |
| 3 | 0.0047 | `c:1 a:1 MEDIAL_OP c:1 a:1 c:1 f:1 j:1` | p003-u170, p004-u075, p005-u090 |
| 3 | 0.0047 | `c:1 a:1 MEDIAL_OP c:1 a:1 e:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u180, p003-u188, p094-u010 |
| 3 | 0.0047 | `c:1 e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u093, p005-u030, p007-u104 |
| 3 | 0.0047 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 e:1 h:1` | p003-u085, p003-u145, p004-u056 |
| 3 | 0.0047 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u011, p003-u017, p003-u166 |
| 3 | 0.0047 | `e:1 a:1 MEDIAL_OP c:1 a:1 MEDIAL_OP e:1 e:1 h:1` | p003-u187, p004-u020, p005-u045 |
| 3 | 0.0047 | `e:1 f:1 f:1 MEDIAL_OP d:1` | p003-u003, p005-u086, p005-u095 |
| 3 | 0.0047 | `e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u021, p005-u050, p007-u106 |
| 3 | 0.0047 | `e:1 MEDIAL_OP e:1 c:1 e:1 c:1 h:2 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p003-u116, p004-u002, p006-u026 |
| 3 | 0.0047 | `e:1 MEDIAL_OP e:1 e:1 c:1 f:1 j:1` | p004-u054, p006-u055, p007-u076 |
| 3 | 0.0047 | `e:1 MEDIAL_OP e:1 e:1 c:1 f:1 MEDIAL_OP d:1` | p006-u025, p094-u002, p094-u036 |
| 3 | 0.0047 | `e:1 MEDIAL_OP e:1 e:1 f:1 MEDIAL_OP f:1 MEDIAL_OP d:1` | p005-u007, p005-u020, p094-u080 |
| 3 | 0.0047 | `n:1 e:1 MEDIAL_OP e:1 e:1 e:1 e:1 h:1` | p005-u056, p005-u061, p094-u022 |
| 2 | 0.0031 | `a:1 MEDIAL_OP c:1 a:1 e:1 c:1 f:1 j:1` | p005-u078, p006-u040 |
| 2 | 0.0031 | `a:1 MEDIAL_OP c:1 a:1 e:1 e:1 e:1 h:1` | p003-u189, p003-u190 |

## Interpretation

- This is a hypothesis test, not a destructive relabeling.
- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.
- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.
