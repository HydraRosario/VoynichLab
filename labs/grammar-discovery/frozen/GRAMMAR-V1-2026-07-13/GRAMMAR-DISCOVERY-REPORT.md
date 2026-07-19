# Grammar Discovery Report

Purpose: move from local ATOMS relations to candidate generative molecule structure.

## Corpus

- Molecules: `473`.
- Unique signatures: `305`.
- Repeated signatures: `58`.
- Cross-folio signatures: `43`.
- Folio counts: `f1r=196`, `f1v=90`, `f2r=104`, `f47v=83`.

## Most Frequent Exact Molecules

| Count | Folios | Signature | Examples |
| ---: | --- | --- | --- |
| 20 | `f1r,f1v,f2r,f47v` | `e:1 g:1 e:1 c:1 f:1 j:1` | `p003-m091 p003-m105 p003-m106 p003-m110 p003-m150 p003-m156 p003-m192 p004-m041` |
| 13 | `f1r,f1v,f2r,f47v` | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `p003-m033 p003-m059 p003-m082 p003-m099 p003-m169 p003-m177 p004-m072 p005-m004` |
| 10 | `f1r,f1v,f2r` | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `p003-m096 p003-m154 p003-m159 p003-m162 p004-m035 p004-m078 p004-m082 p005-m032` |
| 9 | `f1r,f1v,f2r` | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 i:1 d:1` | `p003-m056 p003-m063 p003-m089 p003-m132 p003-m143 p003-m157 p004-m026 p004-m033` |
| 9 | `f1v,f2r,f47v` | `e:1 g:1 e:1 e:1 h:1` | `p004-m049 p005-m018 p005-m083 p005-m091 p094-m061 p094-m065 p094-m070 p094-m073` |
| 9 | `f1v,f2r` | `n:1 e:1 g:1 e:1` | `p004-m073 p005-m011 p005-m029 p005-m043 p005-m049 p005-m062 p005-m074 p005-m079` |
| 7 | `f1r,f1v,f2r,f47v` | `c:1 f:1 j:1 n:1 e:1 g:1 e:1` | `p003-m005 p003-m127 p004-m032 p004-m043 p004-m079 p005-m055 p094-m014` |
| 7 | `f1r,f1v,f2r` | `c:1 f:1 i:1 d:1` | `p003-m022 p003-m035 p003-m064 p004-m010 p004-m074 p005-m012 p005-m044` |
| 6 | `f1r,f1v,f47v` | `e:1 g:1 e:1 c:1` | `p003-m108 p003-m165 p003-m191 p004-m029 p094-m063 p094-m071` |
| 6 | `f1v,f47v` | `e:1 g:1 e:1 c:1 e:1 c:1 h:2 e:1 h:1` | `p004-m015 p004-m022 p004-m070 p004-m087 p094-m035 p094-m054` |
| 5 | `f1r,f1v,f2r,f47v` | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `p003-m097 p003-m124 p004-m050 p005-m013 p094-m027` |
| 5 | `f1r,f1v,f2r,f47v` | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `p003-m102 p004-m005 p004-m009 p005-m096 p094-m015` |
| 5 | `f1r,f2r,f47v` | `e:1 g:1 e:1 c:1 f:1 i:1 d:1` | `p003-m057 p003-m141 p005-m017 p005-m092 p094-m030` |
| 5 | `f1r,f2r,f47v` | `n:1 e:1 g:1 e:1 c:1` | `p003-m087 p003-m109 p003-m116 p005-m100 p094-m024` |
| 4 | `f1r,f1v,f2r,f47v` | `a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `p003-m104 p004-m064 p005-m060 p094-m023` |
| 4 | `f1r,f1v,f2r` | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | `p003-m189 p004-m023 p004-m086 p005-m082` |
| 4 | `f1r,f2r,f47v` | `e:1 c:1 h:2 e:1 g:1 e:1 e:1 h:1` | `p003-m094 p005-m041 p094-m059 p094-m064` |
| 4 | `f1r,f1v,f2r` | `e:1 g:1 e:1 e:1 e:1 h:1` | `p003-m142 p004-m036 p004-m046 p005-m102` |
| 4 | `f1v,f2r` | `c:1 f:1 j:1` | `p004-m003 p004-m052 p004-m063 p005-m073` |
| 4 | `f2r,f47v` | `e:1 i:1 d:1 e:1 f:1 k:1 f:1 i:1 d:1` | `p005-m035 p005-m069 p005-m097 p094-m037` |

## Strongest Substitution Slots

These families share every token except one slot.

| Total | Variants | Slot | Skeleton | Values | Folios |
| ---: | ---: | ---: | --- | --- | --- |
| 22 | 2 | 6 | `e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1` | `k:1:13 l:1:9` | `f1r,f1v,f2r,f47v` |
| 14 | 2 | 2 | `e:1 _ h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:13 c:2:1` | `f1r,f1v,f2r,f47v` |
| 14 | 2 | 8 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 _ d:1` | `i:1:13 j:1:1` | `f1r,f1v,f2r,f47v` |
| 11 | 2 | 7 | `e:1 c:1 h:2 e:1 f:1 f:1 _ d:1` | `i:1:10 j:1:1` | `f1r,f1v,f2r,f47v` |
| 10 | 2 | 8 | `e:1 c:1 h:2 e:1 f:1 l:1 f:1 _ d:1` | `i:1:9 j:1:1` | `f1r,f1v,f2r,f47v` |
| 7 | 2 | 5 | `e:1 g:1 e:1 e:1 _ f:1 i:1 d:1` | `f:1:5 c:1:2` | `f1r,f1v,f2r,f47v` |
| 7 | 2 | 4 | `e:1 g:1 e:1 _` | `c:1:6 e:1:1` | `f1r,f1v,f47v` |
| 6 | 2 | 5 | `n:1 e:1 g:1 e:1 _` | `c:1:5 e:1:1` | `f1r,f2r,f47v` |
| 5 | 2 | 1 | `_ e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `f1r,f1v,f47v` |
| 5 | 2 | 8 | `e:1 c:1 h:2 e:1 g:1 e:1 e:1 _` | `h:1:4 c:1:1` | `f1r,f2r,f47v` |
| 4 | 2 | 6 | `n:1 e:1 g:1 e:1 e:1 _` | `h:1:3 c:1:1` | `f1r,f1v,f47v` |
| 3 | 2 | 1 | `_ a:1 b:1 c:1 a:1 e:1 h:1` | `e:1:2 c:1:1` | `f1r,f2r,f47v` |
| 3 | 2 | 1 | `_ a:1 m:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:2 c:2:1` | `f1r,f1v,f2r` |
| 3 | 2 | 3 | `e:1 a:1 _ c:1 a:1 g:1 e:1 e:1 h:1` | `m:1:2 b:1:1` | `f1r,f1v,f2r` |
| 10 | 2 | 4 | `n:1 e:1 g:1 _` | `e:1:9 c:1:1` | `f1v,f2r` |
| 3 | 2 | 3 | `c:1 a:1 _ c:1 a:1 e:1 g:1 e:1 e:1 e:1 h:1` | `b:1:2 m:1:1` | `f1r,f47v` |
| 3 | 2 | 3 | `e:1 a:1 _ c:1 a:1 g:1 e:1 e:1 e:1 h:1` | `b:1:2 m:1:1` | `f1r,f1v` |
| 3 | 2 | 3 | `e:1 f:1 _ f:1 i:1 d:1` | `k:1:2 l:1:1` | `f1r,f2r` |
| 3 | 2 | 3 | `e:1 i:1 _ e:1 h:1` | `d:1:2 c:2:1` | `f1r,f47v` |
| 3 | 2 | 2 | `a:1 _ c:1 a:1 c:1 e:1 c:1 h:2 e:1 h:1` | `b:1:2 m:1:1` | `f1v` |
| 3 | 2 | 8 | `c:1 a:1 b:1 c:1 a:1 e:1 f:1 _ f:1 i:1 d:1` | `k:1:2 l:1:1` | `f1r` |
| 3 | 2 | 9 | `c:1 a:1 b:1 c:1 a:1 e:1 g:1 e:1 _ e:1 h:1` | `e:1:2 c:1:1` | `f1r` |
| 3 | 2 | 3 | `e:1 a:1 _ c:1 a:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `m:1:2 b:1:1` | `f1r` |
| 3 | 2 | 5 | `n:1 e:1 g:1 e:1 _ e:1 h:1` | `e:1:2 c:1:1` | `f1r` |

## Strongest Optional Slots

These families have an observed base form and observed one-token expansion.

| Total | Base | Expanded | Optional Index | Skeleton | Optional Values | Folios |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 32 | 10 | 22 | 6 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `k:1:13 l:1:9` | `f1r,f1v,f2r,f47v` |
| 21 | 20 | 1 | 1 | `e:1 g:1 e:1 c:1 f:1 j:1` | `c:1:1` | `f1r,f1v,f2r,f47v` |
| 21 | 20 | 1 | 3 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 21 | 20 | 1 | 4 | `e:1 g:1 e:1 c:1 f:1 j:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 15 | 13 | 2 | 1 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `c:1:2` | `f1r,f1v,f2r,f47v` |
| 15 | 9 | 6 | 5 | `n:1 e:1 g:1 e:1` | `c:1:5 e:1:1` | `f1r,f1v,f2r,f47v` |
| 14 | 1 | 13 | 9 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1` | `d:1:13` | `f1r,f1v,f2r,f47v` |
| 14 | 13 | 1 | 5 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `f1r,f1v,f2r,f47v` |
| 14 | 13 | 1 | 6 | `e:1 c:1 h:2 e:1 f:1 k:1 f:1 i:1 d:1` | `f:1:1` | `f1r,f1v,f2r,f47v` |
| 14 | 9 | 5 | 1 | `e:1 g:1 e:1 e:1 h:1` | `n:1:3 c:1:2` | `f1r,f1v,f2r,f47v` |
| 13 | 9 | 4 | 3 | `e:1 g:1 e:1 e:1 h:1` | `e:1:4` | `f1r,f1v,f2r,f47v` |
| 13 | 9 | 4 | 4 | `e:1 g:1 e:1 e:1 h:1` | `e:1:4` | `f1r,f1v,f2r,f47v` |
| 13 | 9 | 4 | 5 | `e:1 g:1 e:1 e:1 h:1` | `e:1:4` | `f1r,f1v,f2r,f47v` |
| 11 | 6 | 5 | 1 | `e:1 g:1 e:1 c:1` | `n:1:5` | `f1r,f1v,f2r,f47v` |
| 8 | 5 | 3 | 6 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `k:1:3` | `f1r,f1v,f2r,f47v` |
| 7 | 4 | 3 | 1 | `a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `c:1:3` | `f1r,f1v,f2r,f47v` |
| 6 | 1 | 5 | 3 | `e:1 a:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:5` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 7 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 8 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 9 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 10 | `e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 e:1 h:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 3 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 4 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 5 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 6 | 5 | 1 | 1 | `e:1 g:1 e:1 e:1 f:1 f:1 i:1 d:1` | `n:1:1` | `f1r,f1v,f2r,f47v` |
| 5 | 4 | 1 | 5 | `a:1 b:1 c:1 a:1 c:1 f:1 j:1` | `e:1:1` | `f1r,f1v,f2r,f47v` |
| 5 | 4 | 1 | 8 | `e:1 c:1 h:2 e:1 f:1 f:1 j:1` | `d:1:1` | `f1r,f1v,f2r,f47v` |
| 4 | 1 | 3 | 1 | `a:1 b:1 c:1 a:1 e:1 h:1` | `e:1:2 c:1:1` | `f1r,f1v,f2r,f47v` |
| 11 | 10 | 1 | 1 | `e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1` | `c:1:1` | `f1r,f1v,f2r` |
| 11 | 2 | 9 | 2 | `e:1 e:1 e:1 h:1` | `g:1:9` | `f1v,f2r,f47v` |

## Reading

- Exact repetition is not the main target; productive variation is.
- Substitution-slot rows are candidate paradigms: a shared molecule frame with a constrained variable position.
- Optional-slot rows are candidate transformations: a base molecule plus a recurrent inserted operator.
- The next step is train/test grammar induction: induce candidates without `f2r`, then test whether `f2r` contains predicted slot values and expansions.

## Source Files

- `molecules-current.tsv`
- `signature-frequencies.tsv`
- `slot-families.tsv`
- `optional-families.tsv`
