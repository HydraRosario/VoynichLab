# Page 003 / Paragraph 2 - Ranking de segmentaciones candidatas

- dataset: evidence\paragraph-2-page-3\page-003_paragraph-2_dataset.json
- etymology: evidence\paragraph-2-page-3\page-003_paragraph-2_user-v2_etymology.tsv
- user hypothesis: evidence\paragraph-2-page-3\page-003_paragraph-2_user-segmentation-v2.tsv
- seed tokens: 64

## Lectura

Este reporte no asume que la division humana V2 sea correcta. La compara contra segmentaciones generadas automaticamente desde las raices disponibles.

## Ranking por unidad

### 1. ohorahiirime

- V2 humana: o|hora|crime
- visual cruda: o|hora|hi|irime

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | human-v2 | o\|hora\|crime | 16.34 | no | no coincide literalmente con romanizacion; raices fuertes: hora, crime |
| 2 | generated | o\|hora\|hi\|ir\|ime | 15.78 | si | raices fuertes: hora |
| 3 | generated | o\|hora\|hi\|irime | 15.29 | si | sin datos: irime; raices fuertes: hora |
| 4 | generated | o\|hora\|hi\|i\|r\|ime | 9.88 | si | sin datos: i, r; raices fuertes: hora |
| 5 | generated | o\|h\|o\|ra\|hi\|ir\|ime | 9.81 | si | sin datos: h |
| 6 | generated | o\|h\|o\|ra\|hi\|irime | 9.32 | si | sin datos: h, irime |
| 7 | generated | o\|hora\|h\|i\|ir\|ime | 5.83 | si | sin datos: h, i; raices fuertes: hora |
| 8 | generated | o\|hora\|hi\|ir\|i\|m\|e | 5.49 | si | sin datos: i, m, e; raices fuertes: hora |

### 2. hetraheteoa

- V2 humana: hetra|he|teoa
- visual cruda: hetera|hete|o|a

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hetra\|hete\|oa | 10.96 | si | raices fuertes: hete |
| 2 | generated | he\|t\|ra\|hete\|oa | 10.66 | si | sin datos: t; raices fuertes: hete |
| 3 | generated | hetra\|hete\|o\|a | 10.42 | si | sin datos: a; raices fuertes: hete |
| 4 | generated | he\|tra\|hete\|oa | 9.91 | si | raices fuertes: hete |
| 5 | generated | he\|t\|ra\|hete\|o\|a | 9.78 | si | sin datos: t, a; raices fuertes: hete |
| 6 | generated | he\|tra\|hete\|o\|a | 9.02 | si | sin datos: a; raices fuertes: hete |
| 7 | generated | h\|e\|t\|ra\|hete\|oa | 4.76 | si | sin datos: h, e, t; raices fuertes: hete |
| 8 | generated | h\|e\|tra\|hete\|oa | 4.01 | si | sin datos: h, e; raices fuertes: hete |

### 3. hlaolmethotra

- V2 humana: laol|met|otra
- visual cruda: hlaolmehte|o|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hlaolmeth\|o\|t\|ra | 5.31 | si | sin datos: hlaolmeth, t |
| 2 | generated | hlaolmeth\|o\|tra | 4.20 | si | sin datos: hlaolmeth |
| 3 | generated | hlaolmeth\|otra | 2.48 | si | sin datos: hlaolmeth |
| 4 | generated | h\|laol\|met\|h\|o\|t\|ra | 0.66 | si | sin datos: h, h, t |
| 5 | generated | h\|laol\|met\|h\|o\|tra | -0.10 | si | sin datos: h, h |
| 6 | human-v2 | laol\|met\|otra | -0.92 | no | no coincide literalmente con romanizacion |
| 7 | generated | h\|laol\|met\|h\|otra | -1.47 | si | sin datos: h, h |
| 8 | visual | hlaolmehte\|o\|hra | -5.28 | no | no coincide literalmente con romanizacion; sin datos: hlaolmehte, hra |

### 4. ohrahorahiirime

- V2 humana: ora|hora|crime
- visual cruda: o|hra|hora|hi|irime

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | o\|h\|ra\|hora\|hi\|ir\|ime | 15.87 | si | sin datos: h; raices fuertes: hora |
| 2 | generated | o\|h\|ra\|hora\|hi\|irime | 15.38 | si | sin datos: h, irime; raices fuertes: hora |
| 3 | human-v2 | ora\|hora\|crime | 14.65 | no | no coincide literalmente con romanizacion; raices fuertes: hora, crime |
| 4 | generated | o\|hra\|hora\|hi\|ir\|ime | 13.23 | si | sin datos: hra; raices fuertes: hora |
| 5 | generated | o\|hra\|hora\|hi\|irime | 12.74 | si | sin datos: hra, irime; raices fuertes: hora |
| 6 | generated | o\|h\|ra\|hora\|hi\|i\|r\|ime | 9.97 | si | sin datos: h, i, r; raices fuertes: hora |
| 7 | generated | o\|h\|ra\|h\|o\|ra\|hi\|ir\|ime | 9.90 | si | sin datos: h, h |
| 8 | generated | o\|h\|ra\|h\|o\|ra\|hi\|irime | 9.41 | si | sin datos: h, h, irime |

### 5. hetecrime

- V2 humana: hete|crime
- visual cruda: hete|hrime

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | human-v2 | hete\|crime | 21.57 | si | raices fuertes: hete, crime |
| 2 | generated | he\|t\|e\|crime | 6.00 | si | sin datos: t, e; raices fuertes: crime |
| 3 | generated | hete\|cri\|m\|e | 5.41 | si | sin datos: m, e; raices fuertes: hete |
| 4 | generated | hete\|c\|r\|ime | 5.41 | si | sin datos: c, r; raices fuertes: hete |
| 5 | visual | hete\|hrime | 2.92 | no | no coincide literalmente con romanizacion; sin datos: hrime; raices fuertes: hete |
| 6 | generated | h\|e\|t\|e\|crime | 0.10 | si | sin datos: h, e, t, e; raices fuertes: crime |
| 7 | generated | hete\|c\|r\|i\|m\|e | -4.88 | si | sin datos: c, r, i, m, e; raices fuertes: hete |
| 8 | generated | he\|t\|e\|c\|r\|ime | -10.27 | si | sin datos: t, e, c, r |

### 6. hlaolmethohimirriaa

- V2 humana: laol|meto|imir|ria
- visual cruda: hlaolmeth|o|hi|mirriaa

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hlaolmeth\|o\|hi\|mirriaa | 5.32 | si | sin datos: hlaolmeth, mirriaa |
| 2 | generated | h\|laol\|met\|h\|o\|hi\|mirriaa | 0.67 | si | sin datos: h, h, mirriaa |
| 3 | generated | hlaolmeth\|o\|hi\|m\|ir\|ria\|a | -0.36 | si | sin datos: hlaolmeth, m, a |
| 4 | human-v2 | laol\|meto\|imir\|ria | -1.29 | no | no coincide literalmente con romanizacion |
| 5 | generated | hlaolmeth\|o\|h\|imir\|ria\|a | -2.27 | si | sin datos: hlaolmeth, h, a |
| 6 | generated | hlaolmeth\|o\|h\|i\|mirriaa | -4.63 | si | sin datos: hlaolmeth, h, i, mirriaa |
| 7 | generated | h\|laol\|met\|h\|o\|hi\|m\|ir\|ria\|a | -5.01 | si | sin datos: h, h, m, a |
| 8 | generated | hlaolmeth\|o\|hi\|m\|i\|r\|ria\|a | -6.26 | si | sin datos: hlaolmeth, m, i, r, a |

### 7. heteohorahiirimehra

- V2 humana: heteo|hora|cri|mera
- visual cruda: hete|hora|o|hi|irime|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hete\|o\|hora\|hi\|ir\|ime\|h\|ra | 22.84 | si | sin datos: h; raices fuertes: hete, hora |
| 2 | generated | hete\|o\|hora\|hi\|irime\|h\|ra | 22.36 | si | sin datos: irime, h; raices fuertes: hete, hora |
| 3 | generated | hete\|o\|hora\|hi\|ir\|ime\|hra | 20.20 | si | sin datos: hra; raices fuertes: hete, hora |
| 4 | generated | hete\|o\|hora\|hi\|irime\|hra | 19.72 | si | sin datos: irime, hra; raices fuertes: hete, hora |
| 5 | generated | hete\|o\|hora\|hi\|i\|r\|ime\|h\|ra | 16.94 | si | sin datos: i, r, h; raices fuertes: hete, hora |
| 6 | generated | hete\|o\|h\|o\|ra\|hi\|ir\|ime\|h\|ra | 16.87 | si | sin datos: h, h; raices fuertes: hete |
| 7 | generated | hete\|o\|h\|o\|ra\|hi\|irime\|h\|ra | 16.39 | si | sin datos: h, irime, h; raices fuertes: hete |
| 8 | generated | heteo\|hora\|hi\|ir\|ime\|h\|ra | 14.98 | si | sin datos: h; raices fuertes: hora |

### 8. hrahetehtra

- V2 humana: rae|tetra
- visual cruda: hra|hete|h|tra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | h\|ra\|hete\|h\|t\|ra | 9.90 | si | sin datos: h, h, t; raices fuertes: hete |
| 2 | generated | h\|ra\|hete\|h\|tra | 9.15 | si | sin datos: h, h; raices fuertes: hete |
| 3 | generated | hra\|hete\|h\|t\|ra | 7.26 | si | sin datos: hra, h, t; raices fuertes: hete |
| 4 | generated | hra\|hete\|h\|tra | 6.51 | si | sin datos: hra, h; raices fuertes: hete |
| 5 | generated | h\|r\|a\|hete\|h\|t\|ra | -1.14 | si | sin datos: h, r, a, h, t; raices fuertes: hete |
| 6 | generated | h\|ra\|hete\|h\|t\|r\|a | -1.14 | si | sin datos: h, h, t, r, a; raices fuertes: hete |
| 7 | generated | h\|r\|a\|hete\|h\|tra | -1.89 | si | sin datos: h, r, a, h; raices fuertes: hete |
| 8 | human-v2 | rae\|tetra | -2.43 | no | no coincide literalmente con romanizacion |

### 9. heteohorahra

- V2 humana: heteo|hora|ra
- visual cruda: hete|hora|o|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hete\|o\|hora\|h\|ra | 22.26 | si | sin datos: h; raices fuertes: hete, hora |
| 2 | generated | hete\|o\|hora\|hra | 19.62 | si | sin datos: hra; raices fuertes: hete, hora |
| 3 | generated | hete\|o\|h\|o\|ra\|h\|ra | 16.29 | si | sin datos: h, h; raices fuertes: hete |
| 4 | generated | heteo\|hora\|h\|ra | 14.39 | si | sin datos: h; raices fuertes: hora |
| 5 | generated | hete\|o\|h\|o\|ra\|hra | 13.65 | si | sin datos: h, hra; raices fuertes: hete |
| 6 | visual | hete\|hora\|o\|hra | 12.42 | no | no coincide literalmente con romanizacion; sin datos: hra; raices fuertes: hete, hora |
| 7 | generated | hete\|o\|h\|ora\|h\|ra | 11.66 | si | sin datos: h, h; raices fuertes: hete |
| 8 | generated | heteo\|hora\|hra | 11.40 | si | sin datos: hra; raices fuertes: hora |

### 10. ololhateohra

- V2 humana: olola|teora
- visual cruda: o|lol|hate|o|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | o\|lol\|hate\|o\|h\|ra | 13.73 | si | sin datos: lol, h; raices fuertes: hate |
| 2 | generated | o\|lol\|hate\|o\|hra | 11.09 | si | sin datos: lol, hra; raices fuertes: hate |
| 3 | generated | o\|l\|o\|l\|hate\|o\|h\|ra | 10.34 | si | sin datos: l, l, h; raices fuertes: hate |
| 4 | generated | o\|l\|o\|l\|hate\|o\|hra | 7.70 | si | sin datos: l, l, hra; raices fuertes: hate |
| 5 | generated | o\|lol\|hate\|o\|h\|r\|a | 2.69 | si | sin datos: lol, h, r, a; raices fuertes: hate |
| 6 | generated | o\|lol\|h\|ate\|o\|h\|ra | 2.36 | si | sin datos: lol, h, h |
| 7 | generated | o\|lol\|h\|ateo\|h\|ra | 0.99 | si | sin datos: lol, h, h |
| 8 | generated | o\|lol\|h\|ate\|o\|hra | -0.28 | si | sin datos: lol, h, hra |

### 11. olaolhateoa

- V2 humana: olaol|hate|oa
- visual cruda: o|laol|hate|o|a

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | o\|laol\|hate\|oa | 14.19 | si | raices fuertes: hate |
| 2 | generated | o\|laol\|hate\|o\|a | 13.30 | si | sin datos: a; raices fuertes: hate |
| 3 | human-v2 | olaol\|hate\|oa | 11.64 | si | raices fuertes: hate |
| 4 | generated | olaol\|hate\|o\|a | 10.50 | si | sin datos: a; raices fuertes: hate |
| 5 | generated | o\|l\|a\|o\|l\|hate\|oa | 3.84 | si | sin datos: l, a, l; raices fuertes: hate |
| 6 | generated | o\|l\|a\|o\|l\|hate\|o\|a | 2.95 | si | sin datos: l, a, l, a; raices fuertes: hate |
| 7 | generated | o\|laol\|h\|ate\|oa | 2.82 | si | sin datos: h |
| 8 | generated | o\|laol\|h\|ate\|o\|a | 1.93 | si | sin datos: h, a |

### 12. hatehtluoltra

- V2 humana: ate|tluol|tra
- visual cruda: hate|h|tlhaolte|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hate\|h\|tluol\|t\|ra | 9.23 | si | sin datos: h, t; raices fuertes: hate |
| 2 | generated | hate\|h\|tluol\|tra | 8.47 | si | sin datos: h; raices fuertes: hate |
| 3 | generated | hate\|h\|tluol\|t\|r\|a | -1.81 | si | sin datos: h, t, r, a; raices fuertes: hate |
| 4 | generated | h\|ate\|h\|tluol\|t\|ra | -2.14 | si | sin datos: h, h, t |
| 5 | human-v2 | ate\|tluol\|tra | -2.35 | no | no coincide literalmente con romanizacion |
| 6 | generated | h\|ate\|h\|tluol\|tra | -2.90 | si | sin datos: h, h |
| 7 | generated | hate\|h\|t\|l\|u\|o\|l\|t\|ra | -3.34 | si | sin datos: h, t, l, u, l, t; raices fuertes: hate |
| 8 | visual | hate\|h\|tlhaolte\|hra | -3.70 | no | no coincide literalmente con romanizacion; sin datos: h, tlhaolte, hra; raices fuertes: hate |

### 13. ocrinehatehra

- V2 humana: o|crine|atera
- visual cruda: o|hrine|hate|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | o\|crine\|hate\|h\|ra | 14.24 | si | sin datos: h; raices fuertes: hate |
| 2 | generated | o\|crine\|hate\|hra | 11.60 | si | sin datos: hra; raices fuertes: hate |
| 3 | generated | o\|c\|rine\|hate\|h\|ra | 10.59 | si | sin datos: c, h; raices fuertes: hate |
| 4 | generated | o\|c\|rine\|hate\|hra | 7.95 | si | sin datos: c, hra; raices fuertes: hate |
| 5 | generated | o\|cri\|n\|e\|hate\|h\|ra | 6.94 | si | sin datos: n, e, h; raices fuertes: hate |
| 6 | generated | o\|cri\|n\|e\|hate\|hra | 4.30 | si | sin datos: n, e, hra; raices fuertes: hate |
| 7 | generated | o\|crine\|hate\|h\|r\|a | 3.20 | si | sin datos: h, r, a; raices fuertes: hate |
| 8 | generated | o\|crine\|h\|ate\|h\|ra | 2.87 | si | sin datos: h, h |

### 14. horahinirriaa

- V2 humana: hora|inir|ria
- visual cruda: hora|hi|nirriaa

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hora\|hi\|nirriaa | 13.58 | si | sin datos: nirriaa; raices fuertes: hora |
| 2 | generated | hora\|hi\|n\|ir\|ria\|a | 8.25 | si | sin datos: n, a; raices fuertes: hora |
| 3 | generated | h\|o\|ra\|hi\|nirriaa | 7.96 | si | sin datos: h, nirriaa |
| 4 | human-v2 | hora\|inir\|ria | 6.89 | no | no coincide literalmente con romanizacion; raices fuertes: hora |
| 5 | generated | hora\|h\|inir\|ria\|a | 6.34 | si | sin datos: h, a; raices fuertes: hora |
| 6 | generated | hora\|h\|i\|nirriaa | 3.98 | si | sin datos: h, i, nirriaa; raices fuertes: hora |
| 7 | generated | h\|ora\|hi\|nirriaa | 3.33 | si | sin datos: h, nirriaa |
| 8 | generated | hora\|hi\|n\|i\|r\|ria\|a | 2.35 | si | sin datos: n, i, r, a; raices fuertes: hora |

### 15. hateoirime

- V2 humana: ateo|ir|ime
- visual cruda: hate|o|irime

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hate\|o\|ir\|ime | 12.75 | si | raices fuertes: hate |
| 2 | generated | hate\|o\|irime | 11.92 | si | sin datos: irime; raices fuertes: hate |
| 3 | generated | hate\|oi\|r\|ime | 7.74 | si | sin datos: r; raices fuertes: hate |
| 4 | generated | hate\|o\|i\|r\|ime | 6.85 | si | sin datos: i, r; raices fuertes: hate |
| 5 | generated | hate\|o\|ir\|i\|m\|e | 2.47 | si | sin datos: i, m, e; raices fuertes: hate |
| 6 | generated | h\|ate\|o\|ir\|ime | 1.38 | si | sin datos: h |
| 7 | generated | h\|ate\|o\|irime | 0.90 | si | sin datos: h, irime |
| 8 | generated | h\|ateo\|ir\|ime | 0.02 | si | sin datos: h |

### 16. loliocrima

- V2 humana: loli|o|crima
- visual cruda: loli|o|hrima

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | human-v2 | loli\|o\|crima | 6.68 | si | ok |
| 2 | generated | lol\|i\|o\|crima | 0.90 | si | sin datos: lol, i |
| 3 | generated | loli\|o\|cri\|m\|a | -0.87 | si | sin datos: m, a |
| 4 | generated | l\|o\|l\|i\|o\|crima | -2.48 | si | sin datos: l, l, i |
| 5 | visual | loli\|o\|hrima | -3.00 | no | no coincide literalmente con romanizacion; sin datos: hrima |
| 6 | generated | lol\|i\|o\|cri\|m\|a | -6.40 | si | sin datos: lol, i, m, a |
| 7 | generated | l\|o\|l\|i\|o\|cri\|m\|a | -9.78 | si | sin datos: l, l, i, m, a |
| 8 | generated | loli\|o\|c\|r\|i\|m\|a | -11.15 | si | sin datos: c, r, i, m, a |

### 17. horahimirrii

- V2 humana: ora|hi|mirrii
- visual cruda: hora|hi|mirrii

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hora\|hi\|mirrii | 15.46 | si | raices fuertes: hora |
| 2 | generated | h\|o\|ra\|hi\|mirrii | 9.84 | si | sin datos: h |
| 3 | generated | hora\|h\|i\|mirrii | 5.86 | si | sin datos: h, i; raices fuertes: hora |
| 4 | generated | h\|ora\|hi\|mirrii | 5.21 | si | sin datos: h |
| 5 | human-v2 | ora\|hi\|mirrii | 2.11 | no | no coincide literalmente con romanizacion |
| 6 | generated | hora\|hi\|m\|ir\|r\|i\|i | 0.48 | si | sin datos: m, r, i, i; raices fuertes: hora |
| 7 | generated | h\|o\|ra\|h\|i\|mirrii | -0.11 | si | sin datos: h, h, i |
| 8 | generated | h\|o\|r\|a\|hi\|mirrii | -1.20 | si | sin datos: h, r, a |

### 18. hetoh

- V2 humana: eto
- visual cruda: hete|o|h

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | visual | hete\|o\|h | 3.54 | no | no coincide literalmente con romanizacion; sin datos: h; raices fuertes: hete |
| 2 | generated | he\|to\|h | -0.40 | si | sin datos: h |
| 3 | generated | he\|t\|o\|h | -0.93 | si | sin datos: t, h |
| 4 | human-v2 | eto | -1.72 | no | no coincide literalmente con romanizacion |
| 5 | generated | h\|eto\|h | -1.92 | si | sin datos: h, h |
| 6 | generated | h\|e\|to\|h | -5.95 | si | sin datos: h, e, h |
| 7 | generated | h\|e\|t\|o\|h | -6.83 | si | sin datos: h, e, t, h |

### 19. tlolmehtoa

- V2 humana: tlolme|toa
- visual cruda: tlolmeht|o|a

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | tlolmeht\|oa | 1.75 | si | sin datos: tlolmeht |
| 2 | generated | tlolmeht\|o\|a | 1.22 | si | sin datos: tlolmeht, a |
| 3 | generated | tlolme\|h\|toa | 1.07 | si | sin datos: h |
| 4 | human-v2 | tlolme\|toa | -2.03 | no | no coincide literalmente con romanizacion |
| 5 | generated | tlolme\|h\|to\|a | -2.97 | si | sin datos: h, a |
| 6 | generated | tlolme\|h\|t\|oa | -2.97 | si | sin datos: h, t |
| 7 | generated | tlolme\|h\|t\|o\|a | -3.85 | si | sin datos: h, t, a |
| 8 | generated | t\|lol\|m\|e\|h\|toa | -11.42 | si | sin datos: t, lol, m, e, h |

### 20. heteohorahra

- V2 humana: eteo|hora|ra
- visual cruda: hete|o|hora|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | hete\|o\|hora\|h\|ra | 22.26 | si | sin datos: h; raices fuertes: hete, hora |
| 2 | generated | hete\|o\|hora\|hra | 19.62 | si | sin datos: hra; raices fuertes: hete, hora |
| 3 | generated | hete\|o\|h\|o\|ra\|h\|ra | 16.29 | si | sin datos: h, h; raices fuertes: hete |
| 4 | generated | heteo\|hora\|h\|ra | 14.39 | si | sin datos: h; raices fuertes: hora |
| 5 | generated | hete\|o\|h\|o\|ra\|hra | 13.65 | si | sin datos: h, hra; raices fuertes: hete |
| 6 | generated | hete\|o\|h\|ora\|h\|ra | 11.66 | si | sin datos: h, h; raices fuertes: hete |
| 7 | generated | heteo\|hora\|hra | 11.40 | si | sin datos: hra; raices fuertes: hora |
| 8 | generated | hete\|o\|hora\|h\|r\|a | 11.22 | si | sin datos: h, r, a; raices fuertes: hete, hora |

### 21. horahinirrii

- V2 humana: hora|hi|nirrii
- visual cruda: hora|hi|nirrii

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | human-v2 | hora\|hi\|nirrii | 16.06 | si | raices fuertes: hora |
| 2 | generated | h\|o\|ra\|hi\|nirrii | 9.84 | si | sin datos: h |
| 3 | generated | hora\|h\|i\|nirrii | 5.86 | si | sin datos: h, i; raices fuertes: hora |
| 4 | generated | h\|ora\|hi\|nirrii | 5.21 | si | sin datos: h |
| 5 | generated | hora\|hi\|n\|ir\|r\|i\|i | 0.48 | si | sin datos: n, r, i, i; raices fuertes: hora |
| 6 | generated | h\|o\|ra\|h\|i\|nirrii | -0.11 | si | sin datos: h, h, i |
| 7 | generated | h\|o\|r\|a\|hi\|nirrii | -1.20 | si | sin datos: h, r, a |
| 8 | generated | hora\|h\|inir\|r\|i\|i | -1.44 | si | sin datos: h, r, i, i; raices fuertes: hora |

### 22. oirine

- V2 humana: oi|rine
- visual cruda: o|irine

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | generated | o\|irine | 4.52 | si | sin datos: irine |
| 2 | human-v2 | oi\|rine | 4.23 | si | ok |
| 3 | generated | o\|i\|rine | 3.10 | si | sin datos: i |
| 4 | generated | o\|ir\|i\|n\|e | -4.58 | si | sin datos: i, n, e |
| 5 | generated | oi\|r\|i\|n\|e | -9.60 | si | sin datos: r, i, n, e |
| 6 | generated | o\|i\|r\|i\|n\|e | -10.48 | si | sin datos: i, r, i, n, e |

### 23. lhaoltohorahra

- V2 humana: laol|to|hora|ra
- visual cruda: lhaol|t|o|hora|hra

| rank | fuente | segmentacion | score | exacta | notas |
| ---: | --- | --- | ---: | --- | --- |
| 1 | human-v2 | laol\|to\|hora\|ra | 10.53 | no | no coincide literalmente con romanizacion; raices fuertes: hora |
| 2 | generated | lhaol\|to\|hora\|h\|ra | 9.97 | si | sin datos: lhaol, h; raices fuertes: hora |
| 3 | generated | lhaol\|t\|o\|hora\|h\|ra | 9.08 | si | sin datos: lhaol, t, h; raices fuertes: hora |
| 4 | generated | lhaol\|to\|hora\|hra | 7.33 | si | sin datos: lhaol, hra; raices fuertes: hora |
| 5 | generated | lhaol\|t\|o\|hora\|hra | 6.44 | si | sin datos: lhaol, t, hra; raices fuertes: hora |
| 6 | generated | lhaol\|to\|h\|o\|ra\|h\|ra | 4.00 | si | sin datos: lhaol, h, h |
| 7 | generated | lhaol\|t\|o\|h\|o\|ra\|h\|ra | 3.11 | si | sin datos: lhaol, t, h, h |
| 8 | generated | lhaol\|to\|h\|o\|ra\|hra | 1.36 | si | sin datos: lhaol, h, hra |

## Decision

La siguiente version del traductor debe elegir segmentaciones por ranking, no por intuicion unica. La V2 del investigador es una hipotesis fuerte, pero queda sometida a competencia contra otras divisiones.
