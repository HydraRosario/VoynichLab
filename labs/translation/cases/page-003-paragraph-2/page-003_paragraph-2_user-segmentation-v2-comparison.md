# Page 003 / Paragraph 2 - User Segmentation V2 Comparison

- dataset: evidence\paragraph-2-page-3\page-003_paragraph-2_dataset.json
- user segmentation: evidence\paragraph-2-page-3\page-003_paragraph-2_user-segmentation-v2.tsv
- units compared: 23
- changed vs visual labels: 22
- user segmentations not matching flat romanization exactly: 17

## Resultado corto

La nueva division del investigador produce raices mucho mas lexicas que la division visual cruda. En particular aparecen familias repetidas como `hora`, `crime/crima/crine`, `laol`, `ate/ateo/hate`, `teo/teoa/toa`, `ra/ria/rine`.

Los desajustes contra la romanizacion plana no se tratan como errores automaticos: pueden ser reglas de taquigrafia, elision o mutacion. Pero hay que documentarlos uno por uno.

## Raices repetidas segun division del investigador

| raiz | veces |
| --- | ---: |
| hora | 8 |
| crime | 3 |
| laol | 3 |
| ra | 3 |
| o | 3 |
| heteo | 2 |
| ora | 2 |
| ria | 2 |
| hi | 2 |

## Comparacion unidad por unidad

| # | romanizacion | division visual actual | division investigador | coincide con romanizacion | tipo de cambio | notas |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | ohorahiirime | o\|hora\|hi\|irime | o\|hora\|crime | no | user-merged-parts |  |
| 2 | hetraheteoa | hetera\|hete\|o\|a | hetra\|he\|teoa | si | user-merged-parts |  |
| 3 | hlaolmethotra | hlaolmehte\|o\|hra | laol\|met\|otra | no | same-count-different-boundaries | user omits initial h from flat romanization |
| 4 | ohrahorahiirime | o\|hra\|hora\|hi\|irime | ora\|hora\|crime | no | user-merged-parts | user omits h after initial o; may imply mutation/compression |
| 5 | hetecrime | hete\|hrime | hete\|crime | si | same-count-different-boundaries |  |
| 6 | hlaolmethohimirriaa | hlaolmeth\|o\|hi\|mirriaa | laol\|meto\|imir\|ria | no | same-count-different-boundaries | user omits initial h and final a from flat romanization |
| 7 | heteohorahiirimehra | hete\|hora\|o\|hi\|irime\|hra | heteo\|hora\|cri\|mera | no | user-merged-parts |  |
| 8 | hrahetehtra | hra\|hete\|h\|tra | rae\|tetra | no | user-merged-parts | major reinterpretation |
| 9 | heteohorahra | hete\|hora\|o\|hra | heteo\|hora\|ra | no | user-merged-parts | alternative: e\|teo\|orara |
| 10 | ololhateohra | o\|lol\|hate\|o\|hra | olola\|teora | no | user-merged-parts |  |
| 11 | olaolhateoa | o\|laol\|hate\|o\|a | olaol\|hate\|oa | si | user-merged-parts |  |
| 12 | hatehtluoltra | hate\|h\|tlhaolte\|hra | ate\|tluol\|tra | no | user-merged-parts | alternative: atet\|luol\|tra |
| 13 | ocrinehatehra | o\|hrine\|hate\|hra | o\|crine\|atera | no | user-merged-parts |  |
| 14 | horahinirriaa | hora\|hi\|nirriaa | hora\|inir\|ria | no | same-count-different-boundaries |  |
| 15 | hateoirime | hate\|o\|irime | ateo\|ir\|ime | no | same-count-different-boundaries |  |
| 16 | loliocrima | loli\|o\|hrima | loli\|o\|crima | si | same-count-different-boundaries |  |
| 17 | horahimirrii | hora\|hi\|mirrii | ora\|hi\|mirrii | no | same-count-different-boundaries |  |
| 18 | hetoh | hete\|o\|h | eto | no | user-merged-parts |  |
| 19 | tlolmehtoa | tlolmeht\|o\|a | tlolme\|toa | no | user-merged-parts |  |
| 20 | heteohorahra | hete\|o\|hora\|hra | eteo\|hora\|ra | no | user-merged-parts |  |
| 21 | horahinirrii | hora\|hi\|nirrii | hora\|hi\|nirrii | si | same |  |
| 22 | oirine | o\|irine | oi\|rine | si | same-count-different-boundaries |  |
| 23 | lhaoltohorahra | lhaol\|t\|o\|hora\|hra | laol\|to\|hora\|ra | no | user-merged-parts |  |

## Desajustes que hay que volver regla o corregir

- unidad 1: romanizacion `ohorahiirime`, division junta `ohoracrime`, diferencia: `hii -> c`
- unidad 3: romanizacion `hlaolmethotra`, division junta `laolmetotra`, diferencia: `hlaolmeth -> laolmet`
- unidad 4: romanizacion `ohrahorahiirime`, division junta `orahoracrime`, diferencia: `hrahorahii -> rahorac`
- unidad 6: romanizacion `hlaolmethohimirriaa`, division junta `laolmetoimirria`, diferencia: `hlaolmethohimirria -> laolmetoimirri`
- unidad 7: romanizacion `heteohorahiirimehra`, division junta `heteohoracrimera`, diferencia: `hiirimeh -> crime`
- unidad 8: romanizacion `hrahetehtra`, division junta `raetetra`, diferencia: `hraheteh -> raete`
- unidad 9: romanizacion `heteohorahra`, division junta `heteohorara`, diferencia: `h -> ∅`
- unidad 10: romanizacion `ololhateohra`, division junta `ololateora`, diferencia: `hateoh -> ateo`
- unidad 12: romanizacion `hatehtluoltra`, division junta `atetluoltra`, diferencia: `hateh -> ate`
- unidad 13: romanizacion `ocrinehatehra`, division junta `ocrineatera`, diferencia: `hateh -> ate`
- unidad 14: romanizacion `horahinirriaa`, division junta `horainirria`, diferencia: `hinirria -> inirri`
- unidad 15: romanizacion `hateoirime`, division junta `ateoirime`, diferencia: `h -> ∅`
- unidad 17: romanizacion `horahimirrii`, division junta `orahimirrii`, diferencia: `h -> ∅`
- unidad 18: romanizacion `hetoh`, division junta `eto`, diferencia: `hetoh -> eto`
- unidad 19: romanizacion `tlolmehtoa`, division junta `tlolmetoa`, diferencia: `h -> ∅`
- unidad 20: romanizacion `heteohorahra`, division junta `eteohorara`, diferencia: `heteohorah -> eteohora`
- unidad 23: romanizacion `lhaoltohorahra`, division junta `laoltohorara`, diferencia: `haoltohorah -> aoltohora`

## Decision

Esta division V2 debe usarse como entrada principal del traductor etimologico. La division visual cruda sigue siendo importante para entrenar imagen -> partes, pero la traduccion semantica necesita estas raices humanas mas grandes.
