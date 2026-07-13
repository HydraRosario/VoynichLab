# Contextual Branch Audit

## Scope

- Images: `page-003.jpg`, `page-004.jpg`, `page-005.jpg`, `page-094.jpg`
- Context scope: `particle`
- Target: `e:1` as `final`
- Split: `has_prior g:1`
- Measure: `starts_with`
- Occurrences: `293`

## Branch Summary

| Branch | Total | Dominant measured value | Count | Share | Distribution |
| --- | ---: | --- | ---: | ---: | --- |
| `has_prior:g:1` | 293 | `e:1` | 278 | 0.9488 | e:1:278 c:2:11 a:1:3 c:1:1 |

## Examples

### has_prior:g:1

- `page-003.jpg` / `img3-m1` / `img3-m1-p5` / atom 994: `e:1 g:1 e:1`
- `page-003.jpg` / `img3-m10` / `img3-m10-p1` / atom 1217: `e:1 a:1 m:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m100` / `img3-m100-p1` / atom 3156: `e:1 a:1 b:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m103` / `img3-m103-p2` / atom 3150: `e:1 g:1 e:1`
- `page-003.jpg` / `img3-m103` / `img3-m103-p3` / atom 3152: `e:1 a:1 b:1 c:1 a:1 g:1 e:1`
- `page-003.jpg` / `img3-m104` / `img3-m104-p1` / atom 3165: `e:1 g:1 e:1`
