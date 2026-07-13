# Cross-Folio Rule Validation

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-094.jpg`
- Context scope: `particle`
- Discovery rules tested: `58`
- Rule filter: total >= `10`, share >= `0.9`

## Validation Matrix

| Rule | Discovery | Image | Count | Total | Share | Status | Exceptions/examples |
| --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| `d:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_after `g:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial next_is `g:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-003.jpg` | 13 | 13 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-003.jpg` | 12 | 13 | 0.9231 | survives | img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1 |
| `d:1` final has_prior `i:1` | 0.9298 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m149/img3-m149-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m166/img3-m166-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-003.jpg` | 114 | 118 | 0.9661 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m118/img3-m118-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m149/img3-m149-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img3-m166/img3-m166-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-003.jpg` | 126 | 126 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-003.jpg` | 40 | 43 | 0.9302 | survives | img3-m122/img3-m122-p2:e:1 h:1 e:1 c:1 h:2; img3-m45/img3-m45-p2:e:1 h:1 e:1 c:1 h:2; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9138 | `page-003.jpg` | 39 | 43 | 0.9070 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1; img3-m85/img3-m85-p1:e:1 a:1 e:1 b:1 c:1 a:1 e:1 g:1 e:1 |
| `f:1` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 86 | 86 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-003.jpg` | 85 | 86 | 0.9884 | survives | img3-m121/img3-m121-p2:e:1 l:1 f:1 |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `d:1` | 0.9706 | `page-003.jpg` | 51 | 53 | 0.9623 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial has_after `i:1` | 0.9559 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `f:1` medial next_is `i:1` | 0.9559 | `page-003.jpg` | 52 | 53 | 0.9811 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `a:1` final has_prior `c:1` | 0.9902 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9902 | `page-003.jpg` | 55 | 55 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9823 | `page-003.jpg` | 59 | 59 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-003.jpg` | 85 | 87 | 0.9770 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-003.jpg` | 84 | 87 | 0.9655 | survives | img3-m1/img3-m1-p1:a:1 b:1 c:1 a:1 b:1 d:1; img3-m136/img3-m136-p4:a:1 e:1 b:1 c:1 a:1 b:1 d:1 e:1 b:1 c:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-003.jpg` | 76 | 77 | 0.9870 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9811 | `page-003.jpg` | 76 | 77 | 0.9870 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9686 | `page-003.jpg` | 75 | 77 | 0.9740 | survives | img3-m111/img3-m111-p4:f:1 i:1 c:1 h:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-003.jpg` | 63 | 63 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9048 | `page-003.jpg` | 56 | 63 | 0.8889 | weak | img3-m11/img3-m11-p4:e:1 c:2 h:2; img3-m22/img3-m22-p1:e:1 c:2 h:2; img3-m72/img3-m72-p2:e:1 c:2 h:2; img3-m78/img3-m78-p4:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9756 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `m:1` medial has_after `a:1` | 0.9024 | `page-003.jpg` | 15 | 15 | 1.0000 | perfect | - |
| `g:1` medial has_after `e:1` | 1.0000 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-003.jpg` | 129 | 129 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-003.jpg` | 126 | 129 | 0.9767 | survives | img3-m121/img3-m121-p3:e:1 a:1 e:1 b:1 c:1 a:1 c:2 g:1 e:1 h:1; img3-m29/img3-m29-p1:e:1 a:1 e:1 b:1 c:1 a:1 g:1 e:1 f:1; img3-m48/img3-m48-p2:c:1 g:1 e:1 h:1 |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m151/img3-m151-p2:c:2 g:1 e:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m197/img3-m197-p2:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-003.jpg` | 124 | 129 | 0.9612 | survives | img3-m136/img3-m136-p2:c:2 g:1 e:1; img3-m151/img3-m151-p2:c:2 g:1 e:1; img3-m182/img3-m182-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img3-m197/img3-m197-p2:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `f:1` | 0.9773 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9773 | `page-003.jpg` | 32 | 32 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `d:1` | 0.9318 | `page-003.jpg` | 30 | 32 | 0.9375 | survives | img3-m174/img3-m174-p3:k:1 f:1 i:1; img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `k:1` initial has_after `i:1` | 0.9318 | `page-003.jpg` | 31 | 32 | 0.9688 | survives | img3-m82/img3-m82-p5:k:1 f:1 j:1 |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-003.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9298 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-004.jpg` | 21 | 23 | 0.9130 | survives | img4-m30/img4-m30-p1:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img4-m87/img4-m87-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `e:1` medial has_after `c:1` | 0.9138 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-004.jpg` | 19 | 19 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9706 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9559 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `f:1` medial next_is `i:1` | 0.9559 | `page-004.jpg` | 5 | 5 | 1.0000 | perfect | - |
| `a:1` final has_prior `c:1` | 0.9902 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` final prev_is `c:1` | 0.9902 | `page-004.jpg` | 26 | 26 | 1.0000 | perfect | - |
| `a:1` initial has_after `c:1` | 0.9823 | `page-004.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-004.jpg` | 20 | 22 | 0.9091 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final prev_is `e:1` | 0.9811 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:1` final starts_with `e:1` | 0.9686 | `page-004.jpg` | 34 | 36 | 0.9444 | survives | img4-m11/img4-m11-p2:f:1 i:1 c:1 h:1; img4-m24/img4-m24-p2:f:1 i:1 c:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `h:2` final prev_is `c:1` | 0.9048 | `page-004.jpg` | 34 | 34 | 1.0000 | perfect | - |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial next_is `c:1` | 0.9756 | `page-004.jpg` | 12 | 12 | 1.0000 | perfect | - |
| `m:1` medial has_after `a:1` | 0.9024 | `page-004.jpg` | 11 | 12 | 0.9167 | survives | img4-m49/img4-m49-p1:a:1 m:1 c:1 |
| `g:1` medial has_after `e:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-004.jpg` | 54 | 54 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-004.jpg` | 49 | 54 | 0.9074 | survives | img4-m13/img4-m13-p1:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m13/img4-m13-p3:a:1 b:1 c:1 a:1 c:2 g:1 e:1; img4-m21/img4-m21-p4:c:2 g:1 e:1; img4-m54/img4-m54-p1:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-004.jpg` | 35 | 35 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9773 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial next_is `f:1` | 0.9773 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `d:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `k:1` initial has_after `i:1` | 0.9318 | `page-004.jpg` | 3 | 3 | 1.0000 | perfect | - |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-004.jpg` | 2 | 2 | 1.0000 | perfect | - |
| `d:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `c:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `e:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial ends_with `e:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_after `g:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial next_is `g:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` medial has_prior `b:1` | 0.9375 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial prev_is `b:1` | 0.9375 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m7/img94-m7-p1:e:1 a:1 m:1 c:1 a:1 d:1 g:1 e:1 |
| `d:1` medial starts_with `e:1` | 0.9375 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `d:1` final has_prior `i:1` | 0.9298 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `d:1` final prev_is `i:1` | 0.9298 | `page-094.jpg` | 24 | 30 | 0.8000 | weak | img94-m1/img94-m1-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m4/img94-m4-p3:e:1 a:1 b:1 c:1 a:1 b:1 d:1; img94-m40/img94-m40-p1:e:1 a:1 e:1 b:1 c:1 a:1 b:1 d:1; img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |
| `e:1` final has_prior `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` final prev_is `g:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `e:1` medial has_prior `a:1` | 0.9310 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `e:1` medial has_after `c:1` | 0.9138 | `page-094.jpg` | 9 | 10 | 0.9000 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `f:1` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` final prev_is `e:1` | 0.9920 | `page-094.jpg` | 20 | 20 | 1.0000 | perfect | - |
| `f:1` medial ends_with `d:1` | 0.9706 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `d:1` | 0.9706 | `page-094.jpg` | 10 | 10 | 1.0000 | perfect | - |
| `f:1` medial has_after `i:1` | 0.9559 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `f:1` medial next_is `i:1` | 0.9559 | `page-094.jpg` | 8 | 10 | 0.8000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `a:1` final has_prior `c:1` | 0.9902 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` final prev_is `c:1` | 0.9902 | `page-094.jpg` | 20 | 21 | 0.9524 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `a:1` initial has_after `c:1` | 0.9823 | `page-094.jpg` | 23 | 25 | 0.9200 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1; img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial has_prior `e:1` | 0.9603 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `a:1` medial starts_with `e:1` | 0.9524 | `page-094.jpg` | 16 | 17 | 0.9412 | survives | img94-m71/img94-m71-p3:a:1 b:1 a:1 c:2 |
| `h:1` final has_prior `e:1` | 0.9811 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final prev_is `e:1` | 0.9811 | `page-094.jpg` | 46 | 46 | 1.0000 | perfect | - |
| `h:1` final starts_with `e:1` | 0.9686 | `page-094.jpg` | 45 | 46 | 0.9783 | survives | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `h:2` final has_prior `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final starts_with `e:1` | 1.0000 | `page-094.jpg` | 29 | 29 | 1.0000 | perfect | - |
| `h:2` final has_prior `c:1` | 0.9048 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `h:2` final prev_is `c:1` | 0.9048 | `page-094.jpg` | 24 | 29 | 0.8276 | weak | img94-m11/img94-m11-p1:e:1 c:2 h:2; img94-m35/img94-m35-p1:e:1 c:2 h:2; img94-m48/img94-m48-p1:e:1 c:2 h:2; img94-m64/img94-m64-p1:e:1 c:2 h:2 |
| `m:1` medial has_prior `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial prev_is `a:1` | 1.0000 | `page-094.jpg` | 14 | 14 | 1.0000 | perfect | - |
| `m:1` medial has_after `c:1` | 0.9756 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial next_is `c:1` | 0.9756 | `page-094.jpg` | 13 | 14 | 0.9286 | survives | img94-m20/img94-m20-p2:a:1 m:1 c:2 a:1 |
| `m:1` medial has_after `a:1` | 0.9024 | `page-094.jpg` | 11 | 14 | 0.7857 | weak | img94-m24/img94-m24-p1:a:1 m:1 c:1; img94-m25/img94-m25-p1:a:1 m:1 c:1; img94-m53/img94-m53-p1:a:1 m:1 c:1 |
| `g:1` medial has_after `e:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial next_is `e:1` | 1.0000 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial ends_with `e:1` | 0.9878 | `page-094.jpg` | 62 | 62 | 1.0000 | perfect | - |
| `g:1` medial has_prior `e:1` | 0.9388 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `g:1` medial starts_with `e:1` | 0.9388 | `page-094.jpg` | 57 | 62 | 0.9194 | survives | img94-m17/img94-m17-p1:c:2 g:1 e:1; img94-m53/img94-m53-p3:c:2 g:1 e:1; img94-m57/img94-m57-p3:c:2 g:1 e:1; img94-m59/img94-m59-p8:c:2 g:1 e:1 |
| `j:1` final has_prior `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final prev_is `f:1` | 1.0000 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `j:1` final starts_with `f:1` | 0.9882 | `page-094.jpg` | 18 | 18 | 1.0000 | perfect | - |
| `k:1` initial has_after `f:1` | 0.9773 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial next_is `f:1` | 0.9773 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial ends_with `d:1` | 0.9318 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `d:1` | 0.9318 | `page-094.jpg` | 8 | 9 | 0.8889 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1 |
| `k:1` initial has_after `i:1` | 0.9318 | `page-094.jpg` | 7 | 9 | 0.7778 | weak | img94-m11/img94-m11-p3:k:1 e:1 h:1; img94-m58/img94-m58-p3:k:1 f:1 j:1 d:1 |
| `l:1` initial ends_with `d:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `d:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial next_is `f:1` | 1.0000 | `page-094.jpg` | 1 | 1 | 1.0000 | perfect | - |
| `l:1` initial has_after `i:1` | 0.9545 | `page-094.jpg` | 0 | 1 | 0.0000 | weak | img94-m42/img94-m42-p3:l:1 f:1 j:1 d:1 |

Statuses:

- `perfect`: every observed case in that image passes.
- `survives`: observed share remains above the threshold.
- `weak`: observed but below threshold.
- `not_observed`: no matching role occurrence in that image yet.
