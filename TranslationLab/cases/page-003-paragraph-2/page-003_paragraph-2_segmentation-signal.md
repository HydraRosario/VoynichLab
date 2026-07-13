# VoynichLab - Segmentation Signal Test

- dataset: evidence\paragraph-2-page-3\page-003_paragraph-2_dataset.json
- assembly: evidence\paragraph-2-page-3\page-003_paragraph-2_translation-assembly.json
- root tokens tested: 28
- units: 23
- average flat ambiguity: 0.74
- high-ambiguity flat units: 0
- impossible flat reconstructions: 6
- strong segmented formulas: 9

## Resultado en simple

Esta prueba pregunta si las partes visuales que marcaste agregan informacion. Si una formula aparece repetida justo en limites visuales, y no aparece como accidente por todos lados en el texto plano, entonces el etiquetado visual esta capturando estructura.

## Formulas visuales contra texto plano

| formula visual | texto plano esperado | veces con limite visual | veces como substring plano | acuerdo con plano | veredicto |
| --- | --- | ---: | ---: | ---: | --- |
| hora\|hi | horahi | 5 | 6 | 1.00 | segmentacion-fuerte |
| o\|hra | ohra | 4 | 2 | 0.50 | segmentacion-con-mutacion |
| hi\|irime | hiirime | 3 | 3 | 1.00 | segmentacion-fuerte |
| o\|hora | ohora | 3 | 5 | 1.00 | segmentacion-fuerte |
| hete\|o | heteo | 3 | 4 | 1.00 | segmentacion-fuerte |
| hate\|o | hateo | 3 | 3 | 1.00 | segmentacion-fuerte |
| o\|a | oa | 3 | 3 | 1.00 | segmentacion-fuerte |
| hora\|hi\|irime | horahiirime | 2 | 3 | 1.00 | segmentacion-fuerte |
| hete\|hora\|o | hetehorao | 2 | 0 | 0.00 | solo-visible-en-segmentacion |
| o\|hora\|hra | ohorahra | 2 | 3 | 1.00 | segmentacion-fuerte |
| hete\|hora | hetehora | 2 | 0 | 0.00 | solo-visible-en-segmentacion |
| hora\|hra | horahra | 2 | 3 | 1.00 | segmentacion-fuerte |
| hora\|o | horao | 2 | 0 | 0.00 | solo-visible-en-segmentacion |
| o\|hi | ohi | 2 | 1 | 0.50 | segmentacion-con-mutacion |

## Ambiguedad por unidad

| unidad | romanizacion | segmentacion visual | segmentaciones planas posibles | veredicto |
| ---: | --- | --- | ---: | --- |
| 1 | ohorahiirime | o\|hora\|hi\|irime | 1 | sin-ambiguedad |
| 2 | hetraheteoa | hetera\|hete\|o\|a | 0 | flat-no-puede-reconstruir |
| 3 | hlaolmethotra | hlaolmehte\|o\|hra | 1 | sin-ambiguedad |
| 4 | ohrahorahiirime | o\|hra\|hora\|hi\|irime | 1 | sin-ambiguedad |
| 5 | hetecrime | hete\|hrime | 0 | flat-no-puede-reconstruir |
| 6 | hlaolmethohimirriaa | hlaolmeth\|o\|hi\|mirriaa | 1 | sin-ambiguedad |
| 7 | heteohorahiirimehra | hete\|hora\|o\|hi\|irime\|hra | 1 | sin-ambiguedad |
| 8 | hrahetehtra | hra\|hete\|h\|tra | 1 | sin-ambiguedad |
| 9 | heteohorahra | hete\|hora\|o\|hra | 1 | sin-ambiguedad |
| 10 | ololhateohra | o\|lol\|hate\|o\|hra | 1 | sin-ambiguedad |
| 11 | olaolhateoa | o\|laol\|hate\|o\|a | 1 | sin-ambiguedad |
| 12 | hatehtluoltra | hate\|h\|tlhaolte\|hra | 0 | flat-no-puede-reconstruir |
| 13 | ocrinehatehra | o\|hrine\|hate\|hra | 0 | flat-no-puede-reconstruir |
| 14 | horahinirriaa | hora\|hi\|nirriaa | 1 | sin-ambiguedad |
| 15 | hateoirime | hate\|o\|irime | 1 | sin-ambiguedad |
| 16 | loliocrima | loli\|o\|hrima | 0 | flat-no-puede-reconstruir |
| 17 | horahimirrii | hora\|hi\|mirrii | 1 | sin-ambiguedad |
| 18 | hetoh | hete\|o\|h | 0 | flat-no-puede-reconstruir |
| 19 | tlolmehtoa | tlolmeht\|o\|a | 1 | sin-ambiguedad |
| 20 | heteohorahra | hete\|o\|hora\|hra | 1 | sin-ambiguedad |
| 21 | horahinirrii | hora\|hi\|nirrii | 1 | sin-ambiguedad |
| 22 | oirine | o\|irine | 1 | sin-ambiguedad |
| 23 | lhaoltohorahra | lhaol\|t\|o\|hora\|hra | 1 | sin-ambiguedad |

## Lectura cientifica

Si las formulas fuertes sobreviven en otros parrafos, tenemos evidencia a favor de que la llave no es solo romanizacion arbitraria: estaria capturando unidades visuales con funcion repetible.

Cuando una formula tiene mas apariciones visuales que apariciones planas, no se trata como error automatico. Se marca como segmentacion-con-mutacion, porque puede indicar que la gramatica comprime o modifica sonidos al unir partes.

Si el texto plano produce demasiadas segmentaciones alternativas, entonces el modelo no debe aprender solo romanizacion. Debe aprender imagen -> limites visuales -> raiz.
