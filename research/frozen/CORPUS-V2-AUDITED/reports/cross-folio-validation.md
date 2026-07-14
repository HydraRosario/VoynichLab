# Cross-Folio Rule Validation

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-006.jpg`, `page-007.jpg`, `page-094.jpg`
- Context scope: `particle`
- Discovery rules tested: `65`
- Rule filter: total >= `10`, share >= `0.9`

## Validation Matrix

| Rule | Discovery | Image | Count | Total | Share | Status | Exceptions/examples |
| --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| `a:1` final has_prior `c:1` | 0.9881 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9881 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9689 | `page-003.jpg` | 60 | 60 | 1.0000 | perfect | - |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 103 | 103 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-003.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `c:1` final starts_with `a:1` | 0.9189 | `page-003.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 0.9500 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 0.9500 | `page-003.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_after `g:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial next_is `g:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` final has_prior `i:1` | 0.9277 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m119/img3-m119-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m150/img3-m150-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m167/img3-m167-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m119/img3-m119-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m150/img3-m150-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m167/img3-m167-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-003.jpg` | 41 | 42 | 0.9762 | survives | img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial next_is `b:1` | 0.9462 | `page-003.jpg` | 38 | 42 | 0.9048 | survives | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1; img3-m86/img3-m86-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-003.jpg` | 38 | 42 | 0.9048 | survives | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial has_after `b:1` | 0.9462 | `page-003.jpg` | 38 | 42 | 0.9048 | survives | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1; img3-m86/img3-m86-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `e:1` medial has_after `a:1` | 0.9355 | `page-003.jpg` | 37 | 42 | 0.8810 | weak | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m137/img3-m137-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9247 | `page-003.jpg` | 38 | 42 | 0.9048 | survives | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1; img3-m86/img3-m86-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `f:1` final has_prior `e:1` | 0.9953 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9953 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9811 | `page-003.jpg` | 84 | 86 | 0.9767 | survives | img3-m122/img3-m122-p2:e:1 l:1 f:1; img3-m41/img3-m41-p5:e:1 l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m175/img3-m175-p3:k:1 f:1 i:1; img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9658 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m175/img3-m175-p3:k:1 f:1 i:1; img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9658 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9658 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `g:1` medial has_after `e:1` | 0.9926 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9926 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-003.jpg` | 126 | 129 | 0.9767 | survives | img3-m122/img3-m122-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m30/img3-m30-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m49/img3-m49-p2:c:1 g:1 e:1 h:1 |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m137/img3-m137-p2:c:2 g:1 e:1; img3-m152/img3-m152-p2:c:2 g:1 e:1; img3-m183/img3-m183-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m198/img3-m198-p2:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m137/img3-m137-p2:c:2 g:1 e:1; img3-m152/img3-m152-p2:c:2 g:1 e:1; img3-m183/img3-m183-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m198/img3-m198-p2:c:2 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9340 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-003.jpg` | 114 | 115 | 0.9913 | survives | img3-m112/img3-m112-p4:f:1 i:1 c:1 h:1 |
| `i:1` medial has_after `d:1` | 0.9021 | `page-003.jpg` | 114 | 115 | 0.9913 | survives | img3-m112/img3-m112-p4:f:1 i:1 c:1 h:1 |
| `i:1` medial next_is `d:1` | 0.9021 | `page-003.jpg` | 114 | 115 | 0.9913 | survives | img3-m112/img3-m112-p4:f:1 i:1 c:1 h:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9877 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9877 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m175/img3-m175-p3:k:1 f:1 i:1; img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9506 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m175/img3-m175-p3:k:1 f:1 i:1; img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9506 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m83/img3-m83-p5:k:1 f:1 j:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9429 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9429 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9890 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9881 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9881 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9689 | `page-004.jpg` | 30 | 30 | 1.0000 | perfect | - |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 31 | 31 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:1` final starts_with `a:1` | 0.9189 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 0.9500 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 0.9500 | `page-004.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9277 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `e:1` medial next_is `b:1` | 0.9462 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `e:1` medial has_after `b:1` | 0.9462 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `e:1` medial has_after `a:1` | 0.9355 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9247 | `page-004.jpg` | 6 | 6 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9953 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9953 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9811 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9658 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9658 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9658 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9926 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9926 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-004.jpg` | 51 | 54 | 0.9444 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-004.jpg` | 51 | 54 | 0.9444 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9340 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p3:f:1 i:1 c:1 h:1 |
| `i:1` medial has_after `d:1` | 0.9021 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p3:f:1 i:1 c:1 h:1 |
| `i:1` medial next_is `d:1` | 0.9021 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p3:f:1 i:1 c:1 h:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9877 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9877 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9506 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9506 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9429 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9429 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9890 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9881 | `page-005.jpg` | 23 | 23 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9881 | `page-005.jpg` | 23 | 23 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9689 | `page-005.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-005.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-005.jpg` | 4 | 5 | 0.8000 | weak | img5-m25/img5-m25-p2:e:1 g:1 c:1 |
| `c:1` final starts_with `a:1` | 0.9189 | `page-005.jpg` | 3 | 5 | 0.6000 | weak | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 0.9500 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 0.9500 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-005.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9277 | `page-005.jpg` | 57 | 60 | 0.9500 | survives | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m4/img5-m4-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-005.jpg` | 57 | 60 | 0.9500 | survives | img5-m3/img5-m3-p2:a:1 m:1 c:1 a:1 b:1 d:1; img5-m4/img5-m4-p1:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img5-m57/img5-m57-p3:a:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-005.jpg` | 51 | 51 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-005.jpg` | 51 | 51 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `e:1` medial next_is `b:1` | 0.9462 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `e:1` medial has_after `b:1` | 0.9462 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `e:1` medial has_after `a:1` | 0.9355 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9247 | `page-005.jpg` | 11 | 11 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9953 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` final starts_with `e:1` | 0.9953 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` final prev_is `e:1` | 0.9811 | `page-005.jpg` | 40 | 41 | 0.9756 | survives | img5-m24/img5-m24-p2:l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9658 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9658 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9658 | `page-005.jpg` | 23 | 24 | 0.9583 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `g:1` medial has_after `e:1` | 0.9926 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial next_is `e:1` | 0.9926 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-005.jpg` | 51 | 53 | 0.9623 | survives | img5-m25/img5-m25-p2:e:1 g:1 c:1; img5-m9/img5-m9-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-005.jpg` | 52 | 53 | 0.9811 | survives | img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-005.jpg` | 52 | 53 | 0.9811 | survives | img5-m35/img5-m35-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9340 | `page-005.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-005.jpg` | 57 | 57 | 1.0000 | perfect | - |
| `i:1` medial has_after `d:1` | 0.9021 | `page-005.jpg` | 57 | 57 | 1.0000 | perfect | - |
| `i:1` medial next_is `d:1` | 0.9021 | `page-005.jpg` | 57 | 57 | 1.0000 | perfect | - |
| `j:1` final has_prior `f:1` | 1.0000 | `page-005.jpg` | 25 | 25 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-005.jpg` | 25 | 25 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-005.jpg` | 24 | 25 | 0.9600 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9877 | `page-005.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9877 | `page-005.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9506 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9506 | `page-005.jpg` | 17 | 18 | 0.9444 | survives | img5-m49/img5-m49-p3:k:1 f:1 j:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-005.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-005.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `l:1` initial has_after `d:1` | 0.9429 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `l:1` initial has_after `i:1` | 0.9429 | `page-005.jpg` | 6 | 7 | 0.8571 | weak | img5-m24/img5-m24-p2:l:1 f:1 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9890 | `page-005.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9881 | `page-006.jpg` | 16 | 16 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9881 | `page-006.jpg` | 16 | 16 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9689 | `page-006.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-006.jpg` | 16 | 16 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-006.jpg` | 4 | 4 | 1.0000 | perfect | - |
| `c:1` final starts_with `a:1` | 0.9189 | `page-006.jpg` | 3 | 4 | 0.7500 | weak | img6-m33/img6-m33-p2:e:1 a:1 b:1 c:1 a:1 g:1 c:1 |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-006.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 0.9500 | `page-006.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 0.9500 | `page-006.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-006.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` final has_prior `i:1` | 0.9277 | `page-006.jpg` | 30 | 31 | 0.9677 | survives | img6-m3/img6-m3-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-006.jpg` | 30 | 31 | 0.9677 | survives | img6-m3/img6-m3-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-006.jpg` | 45 | 45 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-006.jpg` | 45 | 45 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `e:1` medial next_is `b:1` | 0.9462 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `e:1` medial has_after `b:1` | 0.9462 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `e:1` medial has_after `a:1` | 0.9355 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9247 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 0.9953 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9953 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9811 | `page-006.jpg` | 12 | 13 | 0.9231 | survives | img6-m28/img6-m28-p2:e:1 l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9658 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9658 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9658 | `page-006.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9926 | `page-006.jpg` | 45 | 46 | 0.9783 | survives | img6-m33/img6-m33-p2:e:1 a:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial next_is `e:1` | 0.9926 | `page-006.jpg` | 45 | 46 | 0.9783 | survives | img6-m33/img6-m33-p2:e:1 a:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-006.jpg` | 45 | 46 | 0.9783 | survives | img6-m33/img6-m33-p2:e:1 a:1 b:1 c:1 a:1 g:1 c:1 |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-006.jpg` | 45 | 46 | 0.9783 | survives | img6-m53/img6-m53-p7:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-006.jpg` | 45 | 46 | 0.9783 | survives | img6-m53/img6-m53-p7:c:2 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-006.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-006.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-006.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9340 | `page-006.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-006.jpg` | 30 | 30 | 1.0000 | perfect | - |
| `i:1` medial has_after `d:1` | 0.9021 | `page-006.jpg` | 30 | 30 | 1.0000 | perfect | - |
| `i:1` medial next_is `d:1` | 0.9021 | `page-006.jpg` | 30 | 30 | 1.0000 | perfect | - |
| `j:1` final has_prior `f:1` | 1.0000 | `page-006.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-006.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-006.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9877 | `page-006.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9877 | `page-006.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-006.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9506 | `page-006.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9506 | `page-006.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-006.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-006.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-006.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9429 | `page-006.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9429 | `page-006.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9890 | `page-006.jpg` | 7 | 7 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9881 | `page-007.jpg` | 26 | 27 | 0.9630 | survives | img7-m29/img7-m29-p3:a:1 c:2 b:1 c:2 a:1 |
| `a:1` final prev_is `c:1` | 0.9881 | `page-007.jpg` | 26 | 27 | 0.9630 | survives | img7-m29/img7-m29-p3:a:1 c:2 b:1 c:2 a:1 |
| `a:1` initial has_after `c:1` | 0.9689 | `page-007.jpg` | 55 | 59 | 0.9322 | survives | img7-m29/img7-m29-p3:a:1 c:2 b:1 c:2 a:1; img7-m54/img7-m54-p2:a:1 b:1 a:1 c:2; img7-m62/img7-m62-p2:a:1 b:1 a:1 c:2; img7-m92/img7-m92-p2:a:1 e:1 b:1 a:1 c:2 |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-007.jpg` | 39 | 39 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-007.jpg` | 22 | 22 | 1.0000 | perfect | - |
| `c:1` final starts_with `a:1` | 0.9189 | `page-007.jpg` | 22 | 22 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-007.jpg` | 8 | 9 | 0.8889 | weak | img7-m18/img7-m18-p4:c:2 h:1 |
| `c:2` initial has_after `e:1` | 0.9500 | `page-007.jpg` | 8 | 9 | 0.8889 | weak | img7-m18/img7-m18-p4:c:2 h:1 |
| `c:2` initial has_after `g:1` | 0.9500 | `page-007.jpg` | 8 | 9 | 0.8889 | weak | img7-m18/img7-m18-p4:c:2 h:1 |
| `d:1` medial has_after `e:1` | 1.0000 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-007.jpg` | 0 | 0 | NA | not_observed | - |
| `d:1` final has_prior `i:1` | 0.9277 | `page-007.jpg` | 49 | 56 | 0.8750 | weak | img7-m4/img7-m4-p2:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img7-m48/img7-m48-p1:a:1 m:1 c:1 a:1 b:1 d:1; img7-m67/img7-m67-p2:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img7-m87/img7-m87-p1:a:1 m:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-007.jpg` | 49 | 56 | 0.8750 | weak | img7-m4/img7-m4-p2:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img7-m48/img7-m48-p1:a:1 m:1 c:1 a:1 b:1 d:1; img7-m67/img7-m67-p2:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img7-m87/img7-m87-p1:a:1 m:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-007.jpg` | 64 | 64 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-007.jpg` | 64 | 64 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-007.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `e:1` medial next_is `b:1` | 0.9462 | `page-007.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-007.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `e:1` medial has_after `b:1` | 0.9462 | `page-007.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `e:1` medial has_after `a:1` | 0.9355 | `page-007.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9247 | `page-007.jpg` | 14 | 15 | 0.9333 | survives | img7-m92/img7-m92-p2:a:1 e:1 b:1 a:1 c:2 |
| `f:1` final has_prior `e:1` | 0.9953 | `page-007.jpg` | 33 | 33 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9953 | `page-007.jpg` | 33 | 33 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9811 | `page-007.jpg` | 33 | 33 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-007.jpg` | 11 | 12 | 0.9167 | survives | img7-m3/img7-m3-p3:l:1 f:1 i:1 c:1 h:1 |
| `f:1` medial has_after `d:1` | 0.9658 | `page-007.jpg` | 11 | 12 | 0.9167 | survives | img7-m3/img7-m3-p3:l:1 f:1 i:1 c:1 h:1 |
| `f:1` medial has_after `i:1` | 0.9658 | `page-007.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9658 | `page-007.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 0.9926 | `page-007.jpg` | 64 | 64 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9926 | `page-007.jpg` | 64 | 64 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-007.jpg` | 64 | 64 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-007.jpg` | 56 | 64 | 0.8750 | weak | img7-m14/img7-m14-p1:c:2 g:1 e:1; img7-m18/img7-m18-p2:c:2 g:1 e:1; img7-m2/img7-m2-p3:c:2 g:1 e:1; img7-m26/img7-m26-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-007.jpg` | 56 | 64 | 0.8750 | weak | img7-m14/img7-m14-p1:c:2 g:1 e:1; img7-m18/img7-m18-p2:c:2 g:1 e:1; img7-m2/img7-m2-p3:c:2 g:1 e:1; img7-m26/img7-m26-p1:c:2 a:1 m:1 c:1 a:1 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-007.jpg` | 22 | 22 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-007.jpg` | 22 | 22 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-007.jpg` | 14 | 22 | 0.6364 | weak | img7-m12/img7-m12-p1:e:1 c:2 h:2; img7-m30/img7-m30-p1:e:1 c:2 h:2; img7-m53/img7-m53-p5:e:1 c:2 h:2; img7-m55/img7-m55-p4:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9340 | `page-007.jpg` | 14 | 22 | 0.6364 | weak | img7-m12/img7-m12-p1:e:1 c:2 h:2; img7-m30/img7-m30-p1:e:1 c:2 h:2; img7-m53/img7-m53-p5:e:1 c:2 h:2; img7-m55/img7-m55-p4:e:1 c:2 h:2 |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-007.jpg` | 49 | 77 | 0.6364 | weak | img7-m103/img7-m103-p8:f:1 i:1 c:1 h:1; img7-m17/img7-m17-p3:f:1 i:1 c:1 h:1; img7-m19/img7-m19-p3:f:1 i:1 c:1 h:1; img7-m23/img7-m23-p4:f:1 i:1 c:2 h:1 |
| `i:1` medial has_after `d:1` | 0.9021 | `page-007.jpg` | 49 | 77 | 0.6364 | weak | img7-m103/img7-m103-p8:f:1 i:1 c:1 h:1; img7-m17/img7-m17-p3:f:1 i:1 c:1 h:1; img7-m19/img7-m19-p3:f:1 i:1 c:1 h:1; img7-m23/img7-m23-p4:f:1 i:1 c:2 h:1 |
| `i:1` medial next_is `d:1` | 0.9021 | `page-007.jpg` | 49 | 77 | 0.6364 | weak | img7-m103/img7-m103-p8:f:1 i:1 c:1 h:1; img7-m17/img7-m17-p3:f:1 i:1 c:1 h:1; img7-m19/img7-m19-p3:f:1 i:1 c:1 h:1; img7-m23/img7-m23-p4:f:1 i:1 c:2 h:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-007.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-007.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-007.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9877 | `page-007.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9877 | `page-007.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-007.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9506 | `page-007.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9506 | `page-007.jpg` | 9 | 9 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-007.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-007.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-007.jpg` | 2 | 3 | 0.6667 | weak | img7-m3/img7-m3-p3:l:1 f:1 i:1 c:1 h:1 |
| `l:1` initial has_after `d:1` | 0.9429 | `page-007.jpg` | 2 | 3 | 0.6667 | weak | img7-m3/img7-m3-p3:l:1 f:1 i:1 c:1 h:1 |
| `l:1` initial has_after `i:1` | 0.9429 | `page-007.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-007.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-007.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-007.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9890 | `page-007.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9881 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` final prev_is `c:1` | 0.9881 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` initial has_after `c:1` | 0.9689 | `page-094.jpg` | 24 | 27 | 0.8889 | weak | img94-m16/img94-m16-p2:a:1 e:1 b:1 a:1 c:2; img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1; img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `b:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 22 | 22 | 1.0000 | perfect | - |
| `c:1` final has_prior `a:1` | 0.9730 | `page-094.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:1` final starts_with `a:1` | 0.9189 | `page-094.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `c:2` initial ends_with `e:1` | 0.9500 | `page-094.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `c:2` initial has_after `e:1` | 0.9500 | `page-094.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `c:2` initial has_after `g:1` | 0.9500 | `page-094.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9412 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial prev_is `b:1` | 0.9412 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial starts_with `e:1` | 0.9412 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9277 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9277 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9785 | `page-094.jpg` | 11 | 12 | 0.9167 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial next_is `b:1` | 0.9462 | `page-094.jpg` | 11 | 12 | 0.9167 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial prev_is `a:1` | 0.9462 | `page-094.jpg` | 11 | 12 | 0.9167 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `b:1` | 0.9462 | `page-094.jpg` | 11 | 12 | 0.9167 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `a:1` | 0.9355 | `page-094.jpg` | 11 | 12 | 0.9167 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9247 | `page-094.jpg` | 10 | 12 | 0.8333 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1; img94-m16/img94-m16-p2:a:1 e:1 b:1 a:1 c:2 |
| `f:1` final has_prior `e:1` | 0.9953 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 0.9953 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9811 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9658 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9658 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9658 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `f:1` medial next_is `i:1` | 0.9658 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `g:1` medial has_after `e:1` | 0.9926 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 0.9926 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9853 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9436 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9436 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9340 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9340 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `i:1` medial ends_with `d:1` | 0.9021 | `page-094.jpg` | 24 | 25 | 0.9600 | survives | img94-m28/img94-m28-p1:e:1 i:1 c:2 |
| `i:1` medial has_after `d:1` | 0.9021 | `page-094.jpg` | 24 | 25 | 0.9600 | survives | img94-m28/img94-m28-p1:e:1 i:1 c:2 |
| `i:1` medial next_is `d:1` | 0.9021 | `page-094.jpg` | 24 | 25 | 0.9600 | survives | img94-m28/img94-m28-p1:e:1 i:1 c:2 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9873 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9877 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial next_is `f:1` | 0.9877 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial ends_with `d:1` | 0.9506 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `d:1` | 0.9506 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `i:1` | 0.9506 | `page-094.jpg` | 7 | 9 | 0.7778 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `l:1` initial has_after `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 0.9429 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 0.9429 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9429 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9890 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial has_after `c:1` | 0.9890 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |

Statuses:

- `perfect`: every observed case in that image passes.
- `survives`: observed share remains above the threshold.
- `weak`: observed but below threshold.
- `not_observed`: no matching role occurrence in that image yet.
