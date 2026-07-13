# VoynichLab - Hipotesis de Traduccion

- assembly: evidence\paragraph-2-page-3\page-003_paragraph-2_translation-assembly.json
- pagina: page-003.jpg
- pagina manuscrita: 1
- parrafo: 2
- unidades: 23
- evidencia global: 0.48
- riesgo global: 0.85

## Resultado en simple

Todavia no tenemos una traduccion final. Si tenemos algo util: el parrafo muestra formulas repetidas. Eso permite empezar a separar gramatica posible de raices demasiado ambiguas.

La regla operativa desde ahora es esta: ninguna raiz corta prueba significado por si sola. Solo sirve si aparece dentro de una formula repetida y compatible con las reglas visuales.

## Formulas que importan

| formula | veces | unidades | rol probable | lectura tecnica |
| --- | ---: | --- | --- | --- |
| hora\|hi | 5 | 1, 4, 14, 17, 21 | bloque-gramatical-posible | bloque-gramatical-posible: hora=candidata fuerte, hi=debil |
| o\|hra | 4 | 3, 4, 9, 10 | patron-recurrente | patron-recurrente: o=debil, hra=usable con cuidado |
| hi\|irime | 3 | 1, 4, 7 | formula-repetida-con-huecos | formula-repetida-con-huecos: hi=debil, irime=sin resolver |
| o\|hora | 3 | 1, 20, 23 | patron-recurrente | patron-recurrente: o=debil, hora=candidata fuerte |
| hete\|o | 3 | 2, 18, 20 | bloque-gramatical-posible | bloque-gramatical-posible: hete=candidata fuerte, o=debil |
| hate\|o | 3 | 10, 11, 15 | formula-repetida-con-huecos | formula-repetida-con-huecos: hate=sin resolver, o=debil |
| o\|a | 3 | 2, 11, 19 | cierre-posible | cierre-posible: o=debil, a=ruido probable |
| hora\|hi\|irime | 2 | 1, 4 | formula-repetida-con-huecos | formula-repetida-con-huecos: hora=candidata fuerte, hi=debil, irime=sin resolver |
| hete\|hora\|o | 2 | 7, 9 | apertura-posible | apertura-posible: hete=candidata fuerte, hora=candidata fuerte, o=debil |
| o\|hora\|hra | 2 | 20, 23 | cierre-posible | cierre-posible: o=debil, hora=candidata fuerte, hra=usable con cuidado |
| hete\|hora | 2 | 7, 9 | apertura-posible | apertura-posible: hete=candidata fuerte, hora=candidata fuerte |
| hora\|hra | 2 | 20, 23 | cierre-posible | cierre-posible: hora=candidata fuerte, hra=usable con cuidado |
| hora\|o | 2 | 7, 9 | patron-recurrente | patron-recurrente: hora=candidata fuerte, o=debil |
| o\|hi | 2 | 6, 7 | patron-recurrente | patron-recurrente: o=debil, hi=debil |

## Raices por prioridad

| raiz | veces | rol | evidencia | riesgo | decision |
| --- | ---: | --- | ---: | ---: | --- |
| hete | 7 | raiz-lexica-candidata | 1.00 | 0.25 | puede entrar a hipotesis |
| h | 3 | particula-gramatical-posible | 0.97 | 0.90 | no usar como prueba |
| hora | 9 | raiz-lexica-candidata | 0.92 | 0.51 | puede entrar a hipotesis |
| o | 19 | particula-gramatical-posible | 0.71 | 1.00 | no usar como prueba |
| hi | 7 | particula-gramatical-posible | 0.69 | 0.93 | no usar como prueba |
| hra | 10 | formula-o-morfema-recurrente | 0.50 | 0.73 | usar solo con contexto |
| hate | 5 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| irime | 4 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| a | 3 | ruido-probable | 0.00 | 1.00 | no usar como prueba |
| hetera | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| hlaolmehte | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| hlaolmeth | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| hrima | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| hrime | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| hrine | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| irine | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| laol | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| lhaol | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| lol | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |
| loli | 1 | raiz-no-resuelta | 0.00 | 1.00 | no usar como prueba |

## Mejores unidades para probar sentido

### Unidad 18: hetoh

- segmentacion: hete|o|h
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: hete, o, h
- huecos: ninguno

### Unidad 9: heteohorahra

- segmentacion: hete|hora|o|hra
- estado: usable-candidate
- veredicto: mejor candidata para intentar sentido
- raices utilizables: hete, hora, o, hra
- huecos: ninguno

### Unidad 20: heteohorahra

- segmentacion: hete|o|hora|hra
- estado: usable-candidate
- veredicto: mejor candidata para intentar sentido
- raices utilizables: hete, o, hora, hra
- huecos: ninguno

### Unidad 7: heteohorahiirimehra

- segmentacion: hete|hora|o|hi|irime|hra
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: hete, hora, o, hi, hra
- huecos: irime

### Unidad 8: hrahetehtra

- segmentacion: hra|hete|h|tra
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: hra, hete, h
- huecos: tra

### Unidad 1: ohorahiirime

- segmentacion: o|hora|hi|irime
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: o, hora, hi
- huecos: irime

### Unidad 4: ohrahorahiirime

- segmentacion: o|hra|hora|hi|irime
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: o, hra, hora, hi
- huecos: irime

### Unidad 14: horahinirriaa

- segmentacion: hora|hi|nirriaa
- estado: fragile-candidate
- veredicto: sirve para estudiar patron, no para traducir sola
- raices utilizables: hora, hi
- huecos: nirriaa

## Que significa esto para el Nobel

Esto todavia no demuestra la traduccion. Pero si convierte tu parrafo en una prueba cientifica: si las mismas formulas visuales siguen produciendo las mismas funciones romanizadas en otros parrafos, la teoria gana fuerza. Si no se repiten, cae o hay que corregir la llave.

Proximo paso automatico: tomar estas formulas y generar una tabla de comparacion contra el modo plano. Si el modo segmentado explica mas que el modo plano, tu etiquetado visual esta aportando informacion real.
