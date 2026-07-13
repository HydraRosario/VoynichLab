# Molecule Neighbor Discovery

## Scope

- Molecules: `370`
- Neighbor rows: `370`
- Input: `cases\combined-f1r-f1v-f47v-full-current\atoms-current.tsv`

This report studies molecule-to-molecule adjacency inside each exported program row.

## Current last atom -> next first atom

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `last_token=a:1` | `e:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |
| `last_token=h:2` | `e:1` | 3 | 3 | 1.0000 | img3-m24->img3-m19, img3-m122->img3-m120, img94-m35->img94-m37 |

## Current first atom -> previous last atom

No strong findings under current thresholds.

## Current suffix2 -> next prefix2

| Condition | Result | Count | Total | Share | Examples |
| --- | --- | ---: | ---: | ---: | --- |
| `suffix2=c:1 a:1` | `e:1 g:1` | 3 | 3 | 1.0000 | img3-m142->img3-m144, img4-m20->img4-m28, img94-m1->img94-m6 |
