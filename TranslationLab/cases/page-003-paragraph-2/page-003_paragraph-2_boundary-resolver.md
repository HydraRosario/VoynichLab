# VoynichLab Boundary Resolver

- dataset: C:\Users\HHHES\Documents\apps\VoynichLab\DataSetCreator\evidence\paragraph-2-page-3\page-003_paragraph-2_dataset.json
- roots loaded: 11

This report compares possible root boundaries. It does not assume the current visual-part split is correct; it scores it against alternatives.

Score components:

- visual: support from current visual parts
- recurrence: repeated substrings in the paragraph
- roots: known roots from the root table
- penalties: unknown pieces and excessive fragmentation

## Unit 1: ohorahiirime

- current visual split: o|hora|hi|irime

1. o|hora|hi|irime visual-current
   - total 60.84 | visual 44.97 | recurrence 20.87 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. o|h|o|ra|hi|irime
   - total 54.08 | visual 35.97 | recurrence 23.91 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
3. o|h|o|r|a|hi|irime
   - total 51.41 | visual 41.97 | recurrence 24.65 | roots 1.60 | unknown penalty 6.00 | complexity penalty 10.80
4. o|h|o|ra|h|i|irime
   - total 50.64 | visual 34.97 | recurrence 25.97 | roots 4.00 | unknown penalty 3.50 | complexity penalty 10.80
5. o|h|o|ra|hi|iri|me
   - total 49.41 | visual 29.64 | recurrence 25.36 | roots 5.20 | unknown penalty 0.00 | complexity penalty 10.80
6. o|h|o|ra|h|ii|ri|me
   - total 49.28 | visual 28.64 | recurrence 27.64 | roots 5.60 | unknown penalty 0.00 | complexity penalty 12.60
7. o|h|o|ra|h|ii|rime
   - total 49.10 | visual 28.64 | recurrence 25.66 | roots 5.60 | unknown penalty 0.00 | complexity penalty 10.80
8. o|h|or|a|hi|irime
   - total 48.67 | visual 33.64 | recurrence 22.83 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
9. o|h|o|ra|h|iiri|me
   - total 48.42 | visual 28.64 | recurrence 24.97 | roots 5.60 | unknown penalty 0.00 | complexity penalty 10.80
10. o|h|o|r|a|h|i|irime
   - total 47.97 | visual 40.97 | recurrence 26.71 | roots 2.40 | unknown penalty 9.50 | complexity penalty 12.60
11. o|h|o|ra|hi|ir|ime
   - total 47.59 | visual 29.64 | recurrence 25.54 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
12. o|h|o|ra|hi|i|ri|me
   - total 46.89 | visual 29.64 | recurrence 27.75 | roots 5.60 | unknown penalty 3.50 | complexity penalty 12.60

### Compact Challengers

1. o|hora|hi|irime visual-current
   - total 60.84 | visual 44.97 | recurrence 20.87 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. o|hora|hi|iri|me
   - total 40.17 | visual 22.64 | recurrence 22.32 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
3. o|ho|ra|hi|irime
   - total 39.12 | visual 21.64 | recurrence 22.28 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
4. oh|o|ra|hi|irime
   - total 38.82 | visual 21.64 | recurrence 21.97 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
5. o|hora|hi|ir|ime
   - total 38.35 | visual 22.64 | recurrence 22.50 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
6. o|hora|hii|ri|me
   - total 32.96 | visual 15.64 | recurrence 22.12 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
7. o|hora|hii|rime
   - total 32.78 | visual 15.64 | recurrence 20.13 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40
8. o|hora|hiiri|me
   - total 32.78 | visual 15.64 | recurrence 20.13 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 2: hetraheteoa

- current visual split: hetera|hete|o|a

1. hetera|hete|o|a visual-current
   - total 49.98 | visual 42.32 | recurrence 12.26 | roots 0.80 | unknown penalty 0.00 | complexity penalty 5.40
2. h|e|t|ra|hete|o|a
   - total 47.05 | visual 32.32 | recurrence 25.43 | roots 3.60 | unknown penalty 3.50 | complexity penalty 10.80
3. h|e|t|ra|h|ete|o|a
   - total 45.98 | visual 31.32 | recurrence 26.76 | roots 4.00 | unknown penalty 3.50 | complexity penalty 12.60
4. h|et|ra|hete|o|a
   - total 45.69 | visual 27.32 | recurrence 24.17 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
5. h|et|ra|h|ete|o|a
   - total 44.62 | visual 26.32 | recurrence 25.50 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
6. h|e|tr|a|hete|o|a
   - total 44.52 | visual 33.32 | recurrence 23.49 | roots 2.00 | unknown penalty 3.50 | complexity penalty 10.80
7. h|e|t|r|a|hete|o|a
   - total 44.38 | visual 38.32 | recurrence 26.16 | roots 2.00 | unknown penalty 9.50 | complexity penalty 12.60
8. h|e|t|ra|h|e|t|e|o|a
   - total 44.19 | visual 36.32 | recurrence 29.77 | roots 4.80 | unknown penalty 10.50 | complexity penalty 16.20
9. he|t|ra|hete|o|a
   - total 43.50 | visual 26.32 | recurrence 23.38 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
10. h|e|tr|a|h|ete|o|a
   - total 43.45 | visual 32.32 | recurrence 24.82 | roots 2.40 | unknown penalty 3.50 | complexity penalty 12.60
11. h|e|tra|hete|o|a
   - total 43.41 | visual 32.32 | recurrence 21.99 | roots 1.60 | unknown penalty 3.50 | complexity penalty 9.00
12. h|e|t|r|a|h|ete|o|a
   - total 43.31 | visual 37.32 | recurrence 27.49 | roots 2.40 | unknown penalty 9.50 | complexity penalty 14.40

### Compact Challengers

1. he|tra|hete|o|a
   - total 39.86 | visual 26.32 | recurrence 19.94 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
2. het|ra|hete|o|a
   - total 39.58 | visual 21.32 | recurrence 22.65 | roots 2.80 | unknown penalty 0.00 | complexity penalty 7.20
3. hetr|a|hete|o|a
   - total 31.44 | visual 27.32 | recurrence 15.12 | roots 1.20 | unknown penalty 5.00 | complexity penalty 7.20
4. het|rah|ete|o|a
   - total 30.36 | visual 14.32 | recurrence 22.43 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
5. het|rahe|te|o|a
   - total 26.93 | visual 14.32 | recurrence 19.01 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
6. het|rahete|o|a
   - total 26.40 | visual 14.32 | recurrence 16.68 | roots 0.80 | unknown penalty 0.00 | complexity penalty 5.40
7. he|tr|ahete|o|a
   - total 24.58 | visual 14.32 | recurrence 16.66 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
8. he|tr|a|heteo|a
   - total 24.41 | visual 12.00 | recurrence 18.81 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 3: hlaolmethotra

- current visual split: hlaolmehte|o|hra

1. h|l|a|o|lme|t|h|o|t|ra
   - total 56.63 | visual 44.64 | recurrence 30.18 | roots 4.00 | unknown penalty 6.00 | complexity penalty 16.20
2. h|la|o|lme|t|h|o|t|ra
   - total 55.35 | visual 38.64 | recurrence 27.50 | roots 3.60 | unknown penalty 0.00 | complexity penalty 14.40
3. h|laol|me|t|h|o|t|ra
   - total 55.10 | visual 35.32 | recurrence 27.18 | roots 5.20 | unknown penalty 0.00 | complexity penalty 12.60
4. hl|a|o|lme|t|h|o|t|ra
   - total 54.75 | visual 38.64 | recurrence 26.91 | roots 3.60 | unknown penalty 0.00 | complexity penalty 14.40
5. h|l|a|o|lme|t|h|o|tr|a
   - total 54.09 | visual 45.64 | recurrence 28.25 | roots 2.40 | unknown penalty 6.00 | complexity penalty 16.20
6. h|l|a|o|lme|t|h|o|t|r|a
   - total 53.96 | visual 50.64 | recurrence 30.92 | roots 2.40 | unknown penalty 12.00 | complexity penalty 18.00
7. h|l|a|o|lm|e|t|h|o|t|ra
   - total 53.26 | visual 44.64 | recurrence 31.71 | roots 4.40 | unknown penalty 9.50 | complexity penalty 18.00
8. h|l|a|o|l|me|t|h|o|t|ra
   - total 53.18 | visual 44.64 | recurrence 32.54 | roots 6.00 | unknown penalty 12.00 | complexity penalty 18.00
9. h|l|a|o|lme|t|h|o|tra
   - total 52.99 | visual 44.64 | recurrence 26.74 | roots 2.00 | unknown penalty 6.00 | complexity penalty 14.40
10. h|la|o|lme|t|h|o|tr|a
   - total 52.81 | visual 39.64 | recurrence 25.57 | roots 2.00 | unknown penalty 0.00 | complexity penalty 14.40
11. h|la|o|lme|t|h|o|t|r|a
   - total 52.68 | visual 44.64 | recurrence 28.24 | roots 2.00 | unknown penalty 6.00 | complexity penalty 16.20
12. h|laol|me|t|h|o|tr|a
   - total 52.57 | visual 36.32 | recurrence 25.25 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60

### Compact Challengers

1. hlaolmeth|o|tra
   - total 28.14 | visual 18.32 | recurrence 13.02 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
2. hla|o|lmetho|tra
   - total 23.56 | visual 13.32 | recurrence 15.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
3. hla|olmeth|o|tra
   - total 23.56 | visual 13.32 | recurrence 15.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
4. hlao|lmeth|o|tra
   - total 23.56 | visual 13.32 | recurrence 15.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
5. hlaol|meth|o|tra
   - total 23.56 | visual 13.32 | recurrence 15.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
6. hlaolm|eth|o|tra
   - total 23.56 | visual 13.32 | recurrence 15.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
7. hl|aolmeth|o|tra
   - total 23.19 | visual 13.32 | recurrence 14.87 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
8. hlaolme|th|o|tra
   - total 23.19 | visual 13.32 | recurrence 14.87 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 4: ohrahorahiirime

- current visual split: o|hra|hora|hi|irime

1. o|hra|hora|hi|irime visual-current
   - total 72.05 | visual 52.43 | recurrence 26.42 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. o|hra|h|o|ra|hi|irime
   - total 65.29 | visual 43.43 | recurrence 29.46 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
3. o|hra|h|or|a|hi|irime
   - total 59.88 | visual 41.10 | recurrence 28.37 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80
4. o|h|rah|o|ra|hi|irime
   - total 58.67 | visual 35.97 | recurrence 30.30 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
5. o|hra|h|o|ra|h|iirime
   - total 58.06 | visual 36.10 | recurrence 29.16 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
6. o|h|ra|h|o|rahi|irime
   - total 57.70 | visual 34.97 | recurrence 29.93 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
7. o|h|ra|hora|hi|irime
   - total 57.58 | visual 34.97 | recurrence 28.81 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
8. o|hra|h|o|rahi|irime
   - total 56.16 | visual 36.43 | recurrence 27.54 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
9. o|h|ra|h|ora|hi|irime
   - total 55.89 | visual 33.64 | recurrence 29.84 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
10. o|h|ra|hor|a|hi|irime
   - total 55.78 | visual 33.64 | recurrence 29.74 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
11. o|h|r|a|hora|hi|irime
   - total 54.91 | visual 40.97 | recurrence 29.55 | roots 1.20 | unknown penalty 6.00 | complexity penalty 10.80
12. o|hra|h|ora|hi|irime
   - total 54.35 | visual 35.10 | recurrence 27.45 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. o|hra|hora|hi|irime visual-current
   - total 72.05 | visual 52.43 | recurrence 26.42 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. o|hra|hora|hi|iri|me
   - total 51.38 | visual 30.10 | recurrence 27.87 | roots 2.40 | unknown penalty 0.00 | complexity penalty 9.00
3. o|hra|ho|ra|hi|irime
   - total 50.33 | visual 29.10 | recurrence 27.83 | roots 2.40 | unknown penalty 0.00 | complexity penalty 9.00
4. o|hra|hora|hi|ir|ime
   - total 49.55 | visual 30.10 | recurrence 28.05 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00
5. o|hrah|o|ra|hi|irime
   - total 48.41 | visual 29.97 | recurrence 24.65 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
6. o|hra|hora|hii|ri|me
   - total 44.17 | visual 23.10 | recurrence 27.67 | roots 2.40 | unknown penalty 0.00 | complexity penalty 9.00
7. o|hra|hora|hii|rime
   - total 43.98 | visual 23.10 | recurrence 25.68 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
8. o|hra|hora|hiiri|me
   - total 43.98 | visual 23.10 | recurrence 25.68 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 5: hetecrime

- current visual split: hete|hrime

1. hete|hrime visual-current
   - total 32.75 | visual 28.00 | recurrence 6.55 | roots 0.00 | unknown penalty 0.00 | complexity penalty 1.80
2. hete|cri|me
   - total 19.15 | visual 7.00 | recurrence 13.75 | roots 2.00 | unknown penalty 0.00 | complexity penalty 3.60
3. h|ete|cri|me
   - total 18.08 | visual 6.00 | recurrence 15.08 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40
4. hete|cr|ime
   - total 16.81 | visual 7.00 | recurrence 13.41 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
5. h|e|t|e|cri|me
   - total 16.29 | visual 11.00 | recurrence 18.09 | roots 3.20 | unknown penalty 7.00 | complexity penalty 9.00
6. h|ete|cr|ime
   - total 15.74 | visual 6.00 | recurrence 14.74 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
7. hete|cr|i|me
   - total 15.67 | visual 7.00 | recurrence 15.17 | roots 2.40 | unknown penalty 3.50 | complexity penalty 5.40
8. h|e|te|cri|me
   - total 15.14 | visual 6.00 | recurrence 17.04 | roots 2.80 | unknown penalty 3.50 | complexity penalty 7.20
9. h|et|e|cri|me
   - total 14.93 | visual 6.00 | recurrence 16.83 | roots 2.80 | unknown penalty 3.50 | complexity penalty 7.20
10. h|ete|cr|i|me
   - total 14.60 | visual 6.00 | recurrence 16.50 | roots 2.80 | unknown penalty 3.50 | complexity penalty 7.20
11. h|e|t|e|cr|ime
   - total 13.95 | visual 11.00 | recurrence 17.75 | roots 1.20 | unknown penalty 7.00 | complexity penalty 9.00
12. hete|cr|im|e
   - total 13.78 | visual 7.00 | recurrence 15.28 | roots 0.40 | unknown penalty 3.50 | complexity penalty 5.40

### Compact Challengers

1. hete|cri|me
   - total 19.15 | visual 7.00 | recurrence 13.75 | roots 2.00 | unknown penalty 0.00 | complexity penalty 3.60
2. hete|cr|ime
   - total 16.81 | visual 7.00 | recurrence 13.41 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
3. hete|crime
   - total 6.75 | visual 7.00 | recurrence 6.55 | roots 0.00 | unknown penalty 5.00 | complexity penalty 1.80
4. het|ec|rime
   - total 4.85 | visual 0.00 | recurrence 11.45 | roots 2.00 | unknown penalty 5.00 | complexity penalty 3.60
5. he|tec|rime
   - total 3.04 | visual 0.00 | recurrence 9.64 | roots 2.00 | unknown penalty 5.00 | complexity penalty 3.60
6. het|ecri|me
   - total 2.52 | visual 0.00 | recurrence 9.12 | roots 2.00 | unknown penalty 5.00 | complexity penalty 3.60
7. hetec|ri|me
   - total 1.42 | visual 0.00 | recurrence 8.02 | roots 2.00 | unknown penalty 5.00 | complexity penalty 3.60
8. het|ecr|ime
   - total 1.34 | visual 0.00 | recurrence 9.94 | roots 0.00 | unknown penalty 5.00 | complexity penalty 3.60

## Unit 6: hlaolmethohimirriaa

- current visual split: hlaolmeth|o|hi|mirriaa

1. hlaolmeth|o|hi|mirriaa visual-current
   - total 48.78 | visual 41.32 | recurrence 12.45 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. h|laol|meth|o|hi|mirriaa
   - total 40.80 | visual 31.32 | recurrence 17.68 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
3. hlaolmeth|o|himirri|a|a
   - total 40.10 | visual 25.32 | recurrence 20.78 | roots 1.20 | unknown penalty 0.00 | complexity penalty 7.20
4. h|laol|metho|himirri|a|a
   - total 39.28 | visual 23.00 | recurrence 24.08 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
5. h|lao|lmeth|o|hi|mirriaa
   - total 35.56 | visual 26.32 | recurrence 17.44 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
6. h|laolmeth|o|hi|mirriaa
   - total 35.34 | visual 26.32 | recurrence 15.42 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
7. hlaolmet|h|o|hi|mirriaa
   - total 35.34 | visual 26.32 | recurrence 15.42 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
8. h|la|o|lmetho|hi|mirriaa
   - total 35.32 | visual 26.32 | recurrence 17.20 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
9. h|la|olmeth|o|hi|mirriaa
   - total 35.32 | visual 26.32 | recurrence 17.20 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
10. h|laolm|eth|o|hi|mirriaa
   - total 34.84 | visual 26.32 | recurrence 16.71 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
11. hlaolmeth|o|h|im|irriaa
   - total 34.09 | visual 19.32 | recurrence 21.17 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
12. h|lao|lmetho|himirri|a|a
   - total 34.04 | visual 18.00 | recurrence 23.84 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. hlaolmeth|o|hi|mirriaa visual-current
   - total 48.78 | visual 41.32 | recurrence 12.45 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. hlaolmeth|o|hi|mi|rriaa
   - total 32.45 | visual 20.32 | recurrence 18.93 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
3. hlaolmeth|o|hi|mir|riaa
   - total 32.45 | visual 20.32 | recurrence 18.93 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
4. hlaolmeth|o|hi|mirr|iaa
   - total 32.45 | visual 20.32 | recurrence 18.93 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
5. hlaolmeth|o|hi|mirri|aa
   - total 32.45 | visual 20.32 | recurrence 18.93 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
6. hla|o|lmetho|hi|mirriaa
   - total 28.19 | visual 20.32 | recurrence 14.67 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
7. hla|olmeth|o|hi|mirriaa
   - total 28.19 | visual 20.32 | recurrence 14.67 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
8. hlao|lmeth|o|hi|mirriaa
   - total 28.19 | visual 20.32 | recurrence 14.67 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 7: heteohorahiirimehra

- current visual split: hete|hora|o|hi|irime|hra

1. hete|hora|o|hi|irime|hra visual-current
   - total 83.80 | visual 59.43 | recurrence 32.97 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00
2. h|eteo|hora|hi|irime|hra
   - total 57.46 | visual 34.10 | recurrence 31.96 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00
3. hete|o|horahi|irime|hra
   - total 53.85 | visual 29.10 | recurrence 31.55 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
4. hete|o|hora|hiirime|hra
   - total 53.70 | visual 30.10 | recurrence 30.40 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
5. h|ete|o|horahi|irime|hra
   - total 52.78 | visual 28.10 | recurrence 32.88 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
6. h|ete|o|hora|hiirime|hra
   - total 52.63 | visual 29.10 | recurrence 31.73 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
7. heteo|hora|hi|irime|hra
   - total 51.25 | visual 28.10 | recurrence 30.34 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
8. hete|ohora|hi|irime|hra
   - total 50.49 | visual 27.78 | recurrence 29.91 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
9. h|eteoh|o|rahi|irime|hra
   - total 50.42 | visual 28.10 | recurrence 30.52 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
10. h|eteo|hora|h|iirime|hra
   - total 50.23 | visual 26.78 | recurrence 31.65 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
11. h|eteo|h|orahi|irime|hra
   - total 49.44 | visual 25.78 | recurrence 31.86 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
12. h|ete|ohora|hi|irime|hra
   - total 49.42 | visual 26.78 | recurrence 31.24 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. hete|o|horahi|irime|hra
   - total 53.85 | visual 29.10 | recurrence 31.55 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. hete|o|hora|hiirime|hra
   - total 53.70 | visual 30.10 | recurrence 30.40 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
3. heteo|hora|hi|irime|hra
   - total 51.25 | visual 28.10 | recurrence 30.34 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
4. hete|ohora|hi|irime|hra
   - total 50.49 | visual 27.78 | recurrence 29.91 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
5. hete|o|horah|iirime|hra
   - total 47.62 | visual 22.78 | recurrence 31.64 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
6. hete|o|horahii|rime|hra
   - total 46.66 | visual 22.78 | recurrence 28.68 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
7. hete|oh|orahi|irime|hra
   - total 44.52 | visual 20.78 | recurrence 30.93 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
8. hete|o|hor|ahiirime|hra
   - total 44.44 | visual 22.78 | recurrence 28.46 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 8: hrahetehtra

- current visual split: hra|hete|h|tra

1. hra|hete|h|tra visual-current
   - total 55.59 | visual 41.46 | recurrence 19.13 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. h|ra|hete|h|t|ra
   - total 44.76 | visual 24.00 | recurrence 24.96 | roots 4.80 | unknown penalty 0.00 | complexity penalty 9.00
3. h|ra|h|ete|h|t|ra
   - total 43.69 | visual 23.00 | recurrence 26.29 | roots 5.20 | unknown penalty 0.00 | complexity penalty 10.80
4. hra|hete|h|t|ra
   - total 43.23 | visual 25.46 | recurrence 22.57 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
5. h|ra|hete|h|tr|a
   - total 42.23 | visual 25.00 | recurrence 23.03 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
6. hra|h|ete|h|t|ra
   - total 42.16 | visual 24.46 | recurrence 23.90 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
7. h|r|a|hete|h|t|ra
   - total 42.09 | visual 30.00 | recurrence 25.69 | roots 3.20 | unknown penalty 6.00 | complexity penalty 10.80
8. h|ra|hete|h|t|r|a
   - total 42.09 | visual 30.00 | recurrence 25.69 | roots 3.20 | unknown penalty 6.00 | complexity penalty 10.80
9. h|ra|h|e|t|e|h|t|ra
   - total 41.90 | visual 28.00 | recurrence 29.30 | roots 6.00 | unknown penalty 7.00 | complexity penalty 14.40
10. hr|a|hete|h|t|ra
   - total 41.38 | visual 24.00 | recurrence 23.58 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
11. h|ra|h|ete|h|tr|a
   - total 41.15 | visual 24.00 | recurrence 24.35 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
12. h|ra|hete|h|tra
   - total 41.12 | visual 24.00 | recurrence 21.52 | roots 2.80 | unknown penalty 0.00 | complexity penalty 7.20

### Compact Challengers

1. hra|hete|h|tra visual-current
   - total 55.59 | visual 41.46 | recurrence 19.13 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. h|ra|hete|h|tra
   - total 41.12 | visual 24.00 | recurrence 21.52 | roots 2.80 | unknown penalty 0.00 | complexity penalty 7.20
3. hra|h|ete|h|tra
   - total 38.52 | visual 24.46 | recurrence 20.46 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
4. hra|he|te|h|tra
   - total 32.03 | visual 18.46 | recurrence 20.37 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
5. h|ra|hete|ht|ra
   - total 32.00 | visual 13.00 | recurrence 21.80 | roots 4.40 | unknown penalty 0.00 | complexity penalty 7.20
6. h|rah|ete|h|tra
   - total 31.90 | visual 17.00 | recurrence 21.30 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
7. hra|h|et|eh|tra
   - total 31.37 | visual 18.46 | recurrence 19.71 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
8. hra|hete|ht|ra
   - total 30.46 | visual 14.46 | recurrence 19.40 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 9: heteohorahra

- current visual split: hete|hora|o|hra

1. hete|hora|o|hra visual-current
   - total 63.80 | visual 46.10 | recurrence 22.70 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. hete|o|h|o|ra|h|ra
   - total 58.58 | visual 35.64 | recurrence 28.13 | roots 5.60 | unknown penalty 0.00 | complexity penalty 10.80
3. h|ete|o|h|o|ra|h|ra
   - total 57.50 | visual 34.64 | recurrence 29.46 | roots 6.00 | unknown penalty 0.00 | complexity penalty 12.60
4. hete|o|h|o|ra|hra
   - total 57.04 | visual 37.10 | recurrence 25.74 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
5. h|ete|o|h|o|ra|hra
   - total 55.97 | visual 36.10 | recurrence 27.07 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
6. hete|o|h|o|r|a|h|ra
   - total 55.91 | visual 41.64 | recurrence 28.87 | roots 4.00 | unknown penalty 6.00 | complexity penalty 12.60
7. hete|o|h|o|ra|h|r|a
   - total 55.91 | visual 41.64 | recurrence 28.87 | roots 4.00 | unknown penalty 6.00 | complexity penalty 12.60
8. h|e|t|e|o|h|o|ra|h|ra
   - total 55.72 | visual 39.64 | recurrence 32.47 | roots 6.80 | unknown penalty 7.00 | complexity penalty 16.20
9. hete|o|h|o|ra|hr|a
   - total 55.19 | visual 35.64 | recurrence 26.75 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
10. h|ete|o|h|o|r|a|h|ra
   - total 54.84 | visual 40.64 | recurrence 30.19 | roots 4.40 | unknown penalty 6.00 | complexity penalty 14.40
11. h|ete|o|h|o|ra|h|r|a
   - total 54.84 | visual 40.64 | recurrence 30.19 | roots 4.40 | unknown penalty 6.00 | complexity penalty 14.40
12. h|e|te|o|h|o|ra|h|ra
   - total 54.57 | visual 34.64 | recurrence 31.43 | roots 6.40 | unknown penalty 3.50 | complexity penalty 14.40

### Compact Challengers

1. hete|o|hora|hra
   - total 47.80 | visual 30.10 | recurrence 22.70 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. hete|o|ho|ra|hra
   - total 42.09 | visual 22.78 | recurrence 24.10 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
3. hete|oh|o|ra|hra
   - total 41.78 | visual 22.78 | recurrence 23.80 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
4. he|te|o|hora|hra
   - total 40.25 | visual 23.10 | recurrence 23.95 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
5. hete|o|horah|ra
   - total 36.39 | visual 15.32 | recurrence 24.06 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40
6. hete|o|ho|rah|ra
   - total 35.47 | visual 15.32 | recurrence 24.95 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
7. hete|oh|o|rah|ra
   - total 35.16 | visual 15.32 | recurrence 24.64 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
8. hete|o|hor|ah|ra
   - total 34.97 | visual 15.32 | recurrence 24.45 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 10: ololhateohra

- current visual split: o|lol|hate|o|hra

1. o|lol|hate|o|hra visual-current
   - total 66.07 | visual 51.69 | recurrence 20.78 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
2. o|lol|h|a|t|e|o|h|ra
   - total 59.34 | visual 44.64 | recurrence 28.20 | roots 4.40 | unknown penalty 3.50 | complexity penalty 14.40
3. o|lol|h|a|te|o|h|ra
   - total 58.19 | visual 39.64 | recurrence 27.15 | roots 4.00 | unknown penalty 0.00 | complexity penalty 12.60
4. o|lol|h|a|t|e|o|hra
   - total 57.81 | visual 46.10 | recurrence 25.80 | roots 2.00 | unknown penalty 3.50 | complexity penalty 12.60
5. o|lol|h|a|t|e|o|h|r|a
   - total 56.67 | visual 50.64 | recurrence 28.93 | roots 2.80 | unknown penalty 9.50 | complexity penalty 16.20
6. o|lol|h|a|te|o|hra
   - total 56.66 | visual 41.10 | recurrence 24.76 | roots 1.60 | unknown penalty 0.00 | complexity penalty 10.80
7. o|lol|h|a|t|e|o|hr|a
   - total 55.96 | visual 44.64 | recurrence 26.81 | roots 2.40 | unknown penalty 3.50 | complexity penalty 14.40
8. o|lol|h|a|te|o|h|r|a
   - total 55.53 | visual 45.64 | recurrence 27.89 | roots 2.40 | unknown penalty 6.00 | complexity penalty 14.40
9. o|lol|h|a|te|o|hr|a
   - total 54.81 | visual 39.64 | recurrence 25.77 | roots 2.00 | unknown penalty 0.00 | complexity penalty 12.60
10. o|lol|h|a|t|eo|h|ra
   - total 53.47 | visual 36.32 | recurrence 26.15 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60
11. o|lol|h|a|t|eo|hra
   - total 51.94 | visual 37.78 | recurrence 23.75 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80
12. o|lol|hate|o|h|ra
   - total 51.60 | visual 34.23 | recurrence 23.17 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. o|lol|hate|o|hra visual-current
   - total 66.07 | visual 51.69 | recurrence 20.78 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
2. o|lol|ha|te|o|hra
   - total 43.11 | visual 29.10 | recurrence 22.21 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
3. ol|o|lha|te|o|hra
   - total 38.73 | visual 24.10 | recurrence 22.82 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
4. ol|o|lh|ate|o|hra
   - total 37.90 | visual 24.10 | recurrence 22.00 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
5. ol|ol|hate|o|hra
   - total 37.78 | visual 22.37 | recurrence 22.21 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
6. ol|o|lhate|o|hra
   - total 37.47 | visual 24.10 | recurrence 19.76 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
7. o|lo|lha|te|o|hra
   - total 37.17 | visual 24.10 | recurrence 21.27 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
8. o|lo|lh|ate|o|hra
   - total 36.34 | visual 24.10 | recurrence 20.44 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00

## Unit 11: olaolhateoa

- current visual split: o|laol|hate|o|a

1. o|laol|hate|o|a visual-current
   - total 63.49 | visual 50.23 | recurrence 19.26 | roots 1.20 | unknown penalty 0.00 | complexity penalty 7.20
2. o|laol|h|a|t|e|o|a
   - total 55.23 | visual 44.64 | recurrence 24.28 | roots 2.40 | unknown penalty 3.50 | complexity penalty 12.60
3. o|laol|h|a|te|o|a
   - total 54.08 | visual 39.64 | recurrence 23.24 | roots 2.00 | unknown penalty 0.00 | complexity penalty 10.80
4. o|l|a|o|l|h|a|t|e|o|a
   - total 53.30 | visual 53.97 | recurrence 29.64 | roots 3.20 | unknown penalty 15.50 | complexity penalty 18.00
5. o|l|a|o|l|h|a|te|o|a
   - total 52.16 | visual 48.97 | recurrence 28.59 | roots 2.80 | unknown penalty 12.00 | complexity penalty 16.20
6. o|la|o|l|h|a|t|e|o|a
   - total 52.02 | visual 47.97 | recurrence 26.96 | roots 2.80 | unknown penalty 9.50 | complexity penalty 16.20
7. o|l|a|o|lh|a|t|e|o|a
   - total 51.92 | visual 47.97 | recurrence 26.85 | roots 2.80 | unknown penalty 9.50 | complexity penalty 16.20
8. o|l|a|ol|h|a|t|e|o|a
   - total 51.27 | visual 45.64 | recurrence 28.52 | roots 2.80 | unknown penalty 9.50 | complexity penalty 16.20
9. ol|a|o|l|h|a|t|e|o|a
   - total 51.27 | visual 45.64 | recurrence 28.52 | roots 2.80 | unknown penalty 9.50 | complexity penalty 16.20
10. o|la|o|l|h|a|te|o|a
   - total 50.88 | visual 42.97 | recurrence 25.91 | roots 2.40 | unknown penalty 6.00 | complexity penalty 14.40
11. o|l|a|o|lh|a|te|o|a
   - total 50.77 | visual 42.97 | recurrence 25.80 | roots 2.40 | unknown penalty 6.00 | complexity penalty 14.40
12. o|la|o|lh|a|t|e|o|a
   - total 50.63 | visual 41.97 | recurrence 24.17 | roots 2.40 | unknown penalty 3.50 | complexity penalty 14.40

### Compact Challengers

1. o|laol|hate|o|a visual-current
   - total 63.49 | visual 50.23 | recurrence 19.26 | roots 1.20 | unknown penalty 0.00 | complexity penalty 7.20
2. o|la|ol|hate|o|a
   - total 42.25 | visual 29.23 | recurrence 20.82 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
3. o|la|o|lhate|o|a
   - total 41.94 | visual 30.97 | recurrence 18.37 | roots 1.60 | unknown penalty 0.00 | complexity penalty 9.00
4. ol|a|ol|hate|o|a
   - total 41.49 | visual 26.91 | recurrence 22.39 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
5. ol|a|o|lhate|o|a
   - total 41.18 | visual 28.64 | recurrence 19.94 | roots 1.60 | unknown penalty 0.00 | complexity penalty 9.00
6. o|laol|ha|te|o|a
   - total 40.53 | visual 27.64 | recurrence 20.69 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
7. o|lao|lha|te|o|a
   - total 34.59 | visual 22.64 | recurrence 19.75 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
8. o|la|o|lha|teo|a
   - total 34.49 | visual 22.64 | recurrence 19.65 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00

## Unit 12: hatehtluoltra

- current visual split: hate|h|tlhaolte|hra

1. hate|h|tlhaolte|hra visual-current
   - total 50.59 | visual 41.04 | recurrence 14.55 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. h|a|t|e|h|t|lu|o|l|t|ra
   - total 41.88 | visual 41.32 | recurrence 29.06 | roots 4.00 | unknown penalty 14.50 | complexity penalty 18.00
3. h|a|t|e|h|t|lu|o|lt|ra
   - total 41.85 | visual 36.32 | recurrence 26.22 | roots 4.00 | unknown penalty 8.50 | complexity penalty 16.20
4. h|a|te|h|t|lu|o|l|t|ra
   - total 40.74 | visual 36.32 | recurrence 28.01 | roots 3.60 | unknown penalty 11.00 | complexity penalty 16.20
5. h|a|te|h|t|lu|o|lt|ra
   - total 40.70 | visual 31.32 | recurrence 25.18 | roots 3.60 | unknown penalty 5.00 | complexity penalty 14.40
6. h|a|t|e|h|t|lu|ol|t|ra
   - total 39.84 | visual 33.00 | recurrence 27.94 | roots 3.60 | unknown penalty 8.50 | complexity penalty 16.20
7. h|a|t|e|h|t|lu|o|l|tr|a
   - total 39.35 | visual 42.32 | recurrence 27.12 | roots 2.40 | unknown penalty 14.50 | complexity penalty 18.00
8. h|a|t|e|h|t|lu|o|l|t|r|a
   - total 39.21 | visual 47.32 | recurrence 29.79 | roots 2.40 | unknown penalty 20.50 | complexity penalty 19.80
9. h|a|t|e|h|t|lu|o|lt|r|a
   - total 39.18 | visual 42.32 | recurrence 26.96 | roots 2.40 | unknown penalty 14.50 | complexity penalty 18.00
10. h|a|te|h|t|lu|ol|t|ra
   - total 38.70 | visual 28.00 | recurrence 26.90 | roots 3.20 | unknown penalty 5.00 | complexity penalty 14.40
11. h|a|t|e|h|t|lu|o|l|tra
   - total 38.24 | visual 41.32 | recurrence 25.62 | roots 2.00 | unknown penalty 14.50 | complexity penalty 16.20
12. h|a|te|h|t|lu|o|l|tr|a
   - total 38.20 | visual 37.32 | recurrence 26.08 | roots 2.00 | unknown penalty 11.00 | complexity penalty 16.20

### Compact Challengers

1. hate|h|tlu|ol|tra
   - total 22.74 | visual 17.58 | recurrence 16.95 | roots 0.40 | unknown penalty 5.00 | complexity penalty 7.20
2. hate|h|tl|uol|tra
   - total 20.70 | visual 17.58 | recurrence 14.91 | roots 0.40 | unknown penalty 5.00 | complexity penalty 7.20
3. hate|h|tluol|tra
   - total 20.65 | visual 17.58 | recurrence 13.06 | roots 0.40 | unknown penalty 5.00 | complexity penalty 5.40
4. h|ate|h|tluol|tra
   - total 20.12 | visual 17.00 | recurrence 14.52 | roots 0.80 | unknown penalty 5.00 | complexity penalty 7.20
5. hate|h|tlu|olt|ra
   - total 19.53 | visual 12.58 | recurrence 16.74 | roots 2.40 | unknown penalty 5.00 | complexity penalty 7.20
6. hate|h|tl|uolt|ra
   - total 18.61 | visual 12.58 | recurrence 15.82 | roots 2.40 | unknown penalty 5.00 | complexity penalty 7.20
7. hate|h|tluo|lt|ra
   - total 18.61 | visual 12.58 | recurrence 15.82 | roots 2.40 | unknown penalty 5.00 | complexity penalty 7.20
8. hate|h|tluolt|ra
   - total 18.56 | visual 12.58 | recurrence 13.97 | roots 2.40 | unknown penalty 5.00 | complexity penalty 5.40

## Unit 13: ocrinehatehra

- current visual split: o|hrine|hate|hra

1. o|hrine|hate|hra visual-current
   - total 52.80 | visual 43.37 | recurrence 14.43 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. o|cri|ne|h|a|t|e|h|ra
   - total 44.62 | visual 31.32 | recurrence 27.19 | roots 4.00 | unknown penalty 3.50 | complexity penalty 14.40
3. o|cr|ine|h|a|t|e|h|ra
   - total 44.37 | visual 31.32 | recurrence 26.95 | roots 4.00 | unknown penalty 3.50 | complexity penalty 14.40
4. o|cri|ne|h|a|te|h|ra
   - total 43.47 | visual 26.32 | recurrence 26.15 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60
5. o|cr|ine|h|a|te|h|ra
   - total 43.23 | visual 26.32 | recurrence 25.91 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60
6. o|cri|ne|h|a|t|e|hra
   - total 43.08 | visual 32.78 | recurrence 24.80 | roots 1.60 | unknown penalty 3.50 | complexity penalty 12.60
7. o|cr|ine|h|a|t|e|hra
   - total 42.84 | visual 32.78 | recurrence 24.56 | roots 1.60 | unknown penalty 3.50 | complexity penalty 12.60
8. o|cri|ne|h|a|t|ehr|a
   - total 42.51 | visual 31.32 | recurrence 22.19 | roots 1.60 | unknown penalty 0.00 | complexity penalty 12.60
9. o|cr|ine|h|a|t|ehr|a
   - total 42.27 | visual 31.32 | recurrence 21.95 | roots 1.60 | unknown penalty 0.00 | complexity penalty 12.60
10. o|cr|in|e|h|a|t|e|h|ra
   - total 42.11 | visual 31.32 | recurrence 29.58 | roots 4.40 | unknown penalty 7.00 | complexity penalty 16.20
11. o|cri|ne|h|a|t|e|h|r|a
   - total 41.95 | visual 37.32 | recurrence 27.93 | roots 2.40 | unknown penalty 9.50 | complexity penalty 16.20
12. o|cri|ne|h|a|te|hra
   - total 41.94 | visual 27.78 | recurrence 23.76 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80

### Compact Challengers

1. o|cri|ne|hate|hra
   - total 35.35 | visual 22.37 | recurrence 19.78 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. o|cr|ine|hate|hra
   - total 35.10 | visual 22.37 | recurrence 19.54 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
3. oc|rine|hate|hra
   - total 27.77 | visual 14.04 | recurrence 17.13 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
4. o|crine|hate|hra
   - total 26.80 | visual 22.37 | recurrence 14.43 | roots 0.40 | unknown penalty 5.00 | complexity penalty 5.40
5. oc|ri|ne|hate|hra
   - total 26.44 | visual 14.04 | recurrence 19.59 | roots 0.00 | unknown penalty 0.00 | complexity penalty 7.20
6. ocr|ine|hate|hra
   - total 25.77 | visual 14.04 | recurrence 17.13 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
7. ocri|ne|hate|hra
   - total 25.77 | visual 14.04 | recurrence 17.13 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
8. o|cri|ne|hateh|ra
   - total 21.32 | visual 8.32 | recurrence 17.80 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 14: horahinirriaa

- current visual split: hora|hi|nirriaa

1. h|o|ra|h|in|ir|ri|a|a
   - total 52.30 | visual 32.32 | recurrence 30.38 | roots 4.00 | unknown penalty 0.00 | complexity penalty 14.40
2. h|o|ra|hi|nir|ri|a|a
   - total 51.42 | visual 33.32 | recurrence 27.10 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60
3. h|o|ra|h|in|irri|a|a
   - total 51.33 | visual 32.32 | recurrence 27.60 | roots 4.00 | unknown penalty 0.00 | complexity penalty 12.60
4. h|o|ra|h|inir|ri|a|a
   - total 51.21 | visual 32.32 | recurrence 27.49 | roots 4.00 | unknown penalty 0.00 | complexity penalty 12.60
5. h|o|ra|hi|nirri|a|a
   - total 50.76 | visual 33.32 | recurrence 24.63 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
6. h|o|ra|h|inirri|a|a
   - total 50.55 | visual 32.32 | recurrence 25.02 | roots 4.00 | unknown penalty 0.00 | complexity penalty 10.80
7. h|o|ra|hi|ni|rri|a|a
   - total 50.24 | visual 33.32 | recurrence 25.92 | roots 3.60 | unknown penalty 0.00 | complexity penalty 12.60
8. h|o|ra|h|ini|rri|a|a
   - total 50.04 | visual 32.32 | recurrence 26.31 | roots 4.00 | unknown penalty 0.00 | complexity penalty 12.60
9. h|o|r|a|h|in|ir|ri|a|a
   - total 49.63 | visual 38.32 | recurrence 31.11 | roots 2.40 | unknown penalty 6.00 | complexity penalty 16.20
10. h|o|r|a|hi|nir|ri|a|a
   - total 48.76 | visual 39.32 | recurrence 27.84 | roots 2.00 | unknown penalty 6.00 | complexity penalty 14.40
11. h|o|r|a|h|in|irri|a|a
   - total 48.66 | visual 38.32 | recurrence 28.34 | roots 2.40 | unknown penalty 6.00 | complexity penalty 14.40
12. h|o|r|a|h|inir|ri|a|a
   - total 48.55 | visual 38.32 | recurrence 28.23 | roots 2.40 | unknown penalty 6.00 | complexity penalty 14.40

### Compact Challengers

1. hora|hi|nirriaa visual-current
   - total 42.97 | visual 35.32 | recurrence 11.25 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
2. hora|hi|ni|rriaa
   - total 26.65 | visual 14.32 | recurrence 17.72 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
3. hora|hi|nir|riaa
   - total 26.65 | visual 14.32 | recurrence 17.72 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
4. hora|hi|nirr|iaa
   - total 26.65 | visual 14.32 | recurrence 17.72 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
5. hora|hi|nirri|aa
   - total 26.65 | visual 14.32 | recurrence 17.72 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
6. ho|ra|hi|nirriaa
   - total 21.26 | visual 12.00 | recurrence 12.66 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
7. hora|hinir|ri|aa
   - total 20.46 | visual 7.32 | recurrence 18.54 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
8. hora|hin|ir|riaa
   - total 20.02 | visual 7.32 | recurrence 18.10 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 15: hateoirime

- current visual split: hate|o|irime

1. hate|o|irime visual-current
   - total 49.68 | visual 37.23 | recurrence 15.66 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
2. h|a|t|e|o|irime
   - total 41.42 | visual 31.64 | recurrence 20.68 | roots 1.60 | unknown penalty 3.50 | complexity penalty 9.00
3. h|a|te|o|irime
   - total 40.28 | visual 26.64 | recurrence 19.63 | roots 1.20 | unknown penalty 0.00 | complexity penalty 7.20
4. h|a|t|e|o|iri|me
   - total 36.75 | visual 25.32 | recurrence 22.13 | roots 3.60 | unknown penalty 3.50 | complexity penalty 10.80
5. h|a|te|o|iri|me
   - total 35.60 | visual 20.32 | recurrence 21.08 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
6. h|a|t|eo|irime
   - total 35.55 | visual 23.32 | recurrence 18.63 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
7. h|a|t|e|o|ir|ime
   - total 34.93 | visual 25.32 | recurrence 22.30 | roots 1.60 | unknown penalty 3.50 | complexity penalty 10.80
8. h|a|t|e|o|i|ri|me
   - total 34.23 | visual 25.32 | recurrence 24.51 | roots 4.00 | unknown penalty 7.00 | complexity penalty 12.60
9. h|a|t|e|o|i|rime
   - total 34.05 | visual 25.32 | recurrence 22.53 | roots 4.00 | unknown penalty 7.00 | complexity penalty 10.80
10. h|a|t|e|o|ir|i|me
   - total 33.79 | visual 25.32 | recurrence 24.07 | roots 4.00 | unknown penalty 7.00 | complexity penalty 12.60
11. h|a|te|o|ir|ime
   - total 33.78 | visual 20.32 | recurrence 21.26 | roots 1.20 | unknown penalty 0.00 | complexity penalty 9.00
12. h|ate|o|irime
   - total 33.16 | visual 20.64 | recurrence 17.11 | roots 0.80 | unknown penalty 0.00 | complexity penalty 5.40

### Compact Challengers

1. hate|o|irime visual-current
   - total 49.68 | visual 37.23 | recurrence 15.66 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
2. hate|o|iri|me
   - total 29.01 | visual 14.91 | recurrence 17.10 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40
3. hate|o|ir|ime
   - total 27.19 | visual 14.91 | recurrence 17.28 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
4. ha|te|o|irime
   - total 26.73 | visual 14.64 | recurrence 17.08 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
5. hate|oi|ri|me
   - total 19.08 | visual 6.58 | recurrence 15.90 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
6. hate|oi|rime
   - total 18.90 | visual 6.58 | recurrence 13.91 | roots 2.00 | unknown penalty 0.00 | complexity penalty 3.60
7. hate|oiri|me
   - total 18.41 | visual 6.58 | recurrence 13.43 | roots 2.00 | unknown penalty 0.00 | complexity penalty 3.60
8. ha|teo|irime
   - total 18.02 | visual 6.32 | recurrence 15.30 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60

## Unit 16: loliocrima

- current visual split: loli|o|hrima

1. loli|o|hrima visual-current
   - total 33.97 | visual 34.32 | recurrence 2.85 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
2. lol|i|o|cr|im|a
   - total 25.86 | visual 19.32 | recurrence 17.83 | roots 1.20 | unknown penalty 3.50 | complexity penalty 9.00
3. lol|i|o|crim|a
   - total 25.32 | visual 19.32 | recurrence 15.50 | roots 1.20 | unknown penalty 3.50 | complexity penalty 7.20
4. loli|o|cr|im|a
   - total 24.66 | visual 19.32 | recurrence 11.74 | roots 0.80 | unknown penalty 0.00 | complexity penalty 7.20
5. loli|o|crim|a
   - total 24.13 | visual 19.32 | recurrence 9.41 | roots 0.80 | unknown penalty 0.00 | complexity penalty 5.40
6. lol|i|o|c|rim|a
   - total 21.90 | visual 19.32 | recurrence 17.88 | roots 3.20 | unknown penalty 9.50 | complexity penalty 9.00
7. loli|o|c|rim|a
   - total 20.71 | visual 19.32 | recurrence 11.79 | roots 2.80 | unknown penalty 6.00 | complexity penalty 7.20
8. lol|i|o|cri|m|a
   - total 19.38 | visual 19.32 | recurrence 17.36 | roots 1.20 | unknown penalty 9.50 | complexity penalty 9.00
9. lol|i|oc|rim|a
   - total 18.81 | visual 11.00 | recurrence 15.71 | roots 2.80 | unknown penalty 3.50 | complexity penalty 7.20
10. l|o|li|o|cr|im|a
   - total 18.79 | visual 22.64 | recurrence 16.75 | roots 1.20 | unknown penalty 11.00 | complexity penalty 10.80
11. l|o|li|o|crim|a
   - total 18.26 | visual 22.64 | recurrence 14.42 | roots 1.20 | unknown penalty 11.00 | complexity penalty 9.00
12. loli|o|cri|m|a
   - total 18.19 | visual 19.32 | recurrence 11.27 | roots 0.80 | unknown penalty 6.00 | complexity penalty 7.20

### Compact Challengers

1. loli|o|cri|ma
   - total 9.67 | visual 13.32 | recurrence 6.35 | roots 0.40 | unknown penalty 5.00 | complexity penalty 5.40
2. loli|o|cr|ima
   - total 8.51 | visual 13.32 | recurrence 5.18 | roots 0.40 | unknown penalty 5.00 | complexity penalty 5.40
3. loli|o|crima
   - total 7.97 | visual 13.32 | recurrence 2.85 | roots 0.40 | unknown penalty 5.00 | complexity penalty 3.60
4. lol|iocrima
   - total 1.70 | visual 5.00 | recurrence 3.50 | roots 0.00 | unknown penalty 5.00 | complexity penalty 1.80
5. loli|oc|ri|ma
   - total 0.77 | visual 5.00 | recurrence 6.17 | roots 0.00 | unknown penalty 5.00 | complexity penalty 5.40
6. loli|ocri|ma
   - total 0.10 | visual 5.00 | recurrence 3.70 | roots 0.00 | unknown penalty 5.00 | complexity penalty 3.60
7. loli|ocr|ima
   - total -0.83 | visual 5.00 | recurrence 2.77 | roots 0.00 | unknown penalty 5.00 | complexity penalty 3.60
8. lo|li|o|crima
   - total -1.49 | visual 8.32 | recurrence 5.18 | roots 0.40 | unknown penalty 10.00 | complexity penalty 5.40

## Unit 17: horahimirrii

- current visual split: hora|hi|mirrii

1. hora|hi|mirrii visual-current
   - total 42.97 | visual 35.32 | recurrence 11.25 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
2. h|o|ra|h|im|irr|ii
   - total 37.26 | visual 20.32 | recurrence 24.53 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
3. h|o|ra|h|im|ir|rii
   - total 36.83 | visual 20.32 | recurrence 24.10 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
4. h|o|ra|h|im|irrii
   - total 36.60 | visual 20.32 | recurrence 22.08 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
5. h|o|ra|hi|mirrii
   - total 36.21 | visual 26.32 | recurrence 14.29 | roots 2.80 | unknown penalty 0.00 | complexity penalty 7.20
6. h|o|ra|hi|mirr|ii
   - total 36.13 | visual 21.32 | recurrence 21.00 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
7. h|o|ra|h|im|ir|ri|i
   - total 36.06 | visual 20.32 | recurrence 28.24 | roots 3.60 | unknown penalty 3.50 | complexity penalty 12.60
8. h|o|ra|h|imirr|ii
   - total 35.92 | visual 20.32 | recurrence 21.40 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
9. h|o|ra|hi|mi|rr|ii
   - total 35.19 | visual 21.32 | recurrence 21.86 | roots 2.80 | unknown penalty 0.00 | complexity penalty 10.80
10. h|o|ra|h|im|irri|i
   - total 35.09 | visual 20.32 | recurrence 25.46 | roots 3.60 | unknown penalty 3.50 | complexity penalty 10.80
11. h|o|ra|h|imi|rr|ii
   - total 34.98 | visual 20.32 | recurrence 22.26 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
12. h|o|ra|hi|mi|rrii
   - total 34.96 | visual 21.32 | recurrence 19.84 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. hora|hi|mirrii visual-current
   - total 42.97 | visual 35.32 | recurrence 11.25 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
2. hora|hi|mirr|ii
   - total 26.89 | visual 14.32 | recurrence 17.97 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
3. hora|hi|mi|rrii
   - total 25.72 | visual 14.32 | recurrence 16.80 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
4. hora|hi|mir|rii
   - total 25.72 | visual 14.32 | recurrence 16.80 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
5. ho|ra|hi|mirrii
   - total 21.26 | visual 12.00 | recurrence 12.66 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
6. hora|himirr|ii
   - total 20.04 | visual 7.32 | recurrence 16.31 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
7. hora|him|irr|ii
   - total 19.53 | visual 7.32 | recurrence 17.60 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
8. hora|him|ir|rii
   - total 19.10 | visual 7.32 | recurrence 17.17 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 18: hetoh

- current visual split: hete|o|h

1. hete|o|h visual-current
   - total 46.89 | visual 37.32 | recurrence 12.37 | roots 0.80 | unknown penalty 0.00 | complexity penalty 3.60
2. h|e|t|o|h
   - total 30.23 | visual 25.32 | recurrence 14.01 | roots 1.60 | unknown penalty 3.50 | complexity penalty 7.20
3. h|et|o|h
   - total 28.87 | visual 20.32 | recurrence 12.75 | roots 1.20 | unknown penalty 0.00 | complexity penalty 5.40
4. he|t|o|h
   - total 26.68 | visual 19.32 | recurrence 11.96 | roots 0.80 | unknown penalty 0.00 | complexity penalty 5.40
5. het|o|h
   - total 22.76 | visual 14.32 | recurrence 11.24 | roots 0.80 | unknown penalty 0.00 | complexity penalty 3.60
6. h|e|to|h
   - total 15.26 | visual 12.00 | recurrence 10.96 | roots 1.20 | unknown penalty 3.50 | complexity penalty 5.40
7. h|e|t|oh
   - total 14.97 | visual 11.00 | recurrence 12.07 | roots 0.80 | unknown penalty 3.50 | complexity penalty 5.40
8. h|et|oh
   - total 13.61 | visual 6.00 | recurrence 10.81 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
9. he|to|h
   - total 11.71 | visual 6.00 | recurrence 8.91 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
10. he|t|oh
   - total 11.42 | visual 5.00 | recurrence 10.02 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
11. h|eto|h
   - total 10.13 | visual 12.00 | recurrence 5.93 | roots 0.80 | unknown penalty 5.00 | complexity penalty 3.60
12. h|e|toh
   - total 8.14 | visual 6.00 | recurrence 8.44 | roots 0.80 | unknown penalty 3.50 | complexity penalty 3.60

### Compact Challengers

1. h|et|o|h
   - total 28.87 | visual 20.32 | recurrence 12.75 | roots 1.20 | unknown penalty 0.00 | complexity penalty 5.40
2. het|o|h
   - total 22.76 | visual 14.32 | recurrence 11.24 | roots 0.80 | unknown penalty 0.00 | complexity penalty 3.60
3. h|et|oh
   - total 13.61 | visual 6.00 | recurrence 10.81 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
4. he|to|h
   - total 11.71 | visual 6.00 | recurrence 8.91 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
5. h|eto|h
   - total 10.13 | visual 12.00 | recurrence 5.93 | roots 0.80 | unknown penalty 5.00 | complexity penalty 3.60
6. het|oh
   - total 7.50 | visual 0.00 | recurrence 9.30 | roots 0.00 | unknown penalty 0.00 | complexity penalty 1.80
7. he|toh
   - total 4.59 | visual 0.00 | recurrence 6.39 | roots 0.00 | unknown penalty 0.00 | complexity penalty 1.80
8. h|etoh
   - total 2.57 | visual 6.00 | recurrence 2.97 | roots 0.40 | unknown penalty 5.00 | complexity penalty 1.80

## Unit 19: tlolmehtoa

- current visual split: tlolmeht|o|a

1. t|lol|me|h|t|o|a
   - total 48.66 | visual 35.32 | recurrence 20.94 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
2. t|l|o|lme|h|t|o|a
   - total 43.89 | visual 38.64 | recurrence 22.24 | roots 1.60 | unknown penalty 6.00 | complexity penalty 12.60
3. tl|o|lme|h|t|o|a
   - total 43.85 | visual 33.64 | recurrence 19.41 | roots 1.60 | unknown penalty 0.00 | complexity penalty 10.80
4. t|l|o|lm|e|h|t|o|a
   - total 40.52 | visual 38.64 | recurrence 23.77 | roots 2.00 | unknown penalty 9.50 | complexity penalty 14.40
5. tl|o|lm|e|h|t|o|a
   - total 40.48 | visual 33.64 | recurrence 20.94 | roots 2.00 | unknown penalty 3.50 | complexity penalty 12.60
6. t|l|o|l|me|h|t|o|a
   - total 40.44 | visual 38.64 | recurrence 24.60 | roots 3.60 | unknown penalty 12.00 | complexity penalty 14.40
7. tl|o|l|me|h|t|o|a
   - total 40.40 | visual 33.64 | recurrence 21.76 | roots 3.60 | unknown penalty 6.00 | complexity penalty 12.60
8. t|lo|lme|h|t|o|a
   - total 40.29 | visual 30.32 | recurrence 19.57 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80
9. t|l|ol|me|h|t|o|a
   - total 38.40 | visual 30.32 | recurrence 23.48 | roots 3.20 | unknown penalty 6.00 | complexity penalty 12.60
10. tl|ol|me|h|t|o|a
   - total 38.37 | visual 25.32 | recurrence 20.65 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
11. tlolmeht|o|a visual-current
   - total 38.23 | visual 35.32 | recurrence 5.71 | roots 0.80 | unknown penalty 0.00 | complexity penalty 3.60
12. t|lol|meh|t|o|a
   - total 38.17 | visual 29.32 | recurrence 17.04 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. tlolmeht|o|a visual-current
   - total 38.23 | visual 35.32 | recurrence 5.71 | roots 0.80 | unknown penalty 0.00 | complexity penalty 3.60
2. tlolm|eht|o|a
   - total 13.93 | visual 14.32 | recurrence 9.21 | roots 0.80 | unknown penalty 5.00 | complexity penalty 5.40
3. tlolme|ht|o|a
   - total 12.77 | visual 14.32 | recurrence 8.04 | roots 0.80 | unknown penalty 5.00 | complexity penalty 5.40
4. tl|o|lmehto|a
   - total 12.28 | visual 14.32 | recurrence 7.56 | roots 0.80 | unknown penalty 5.00 | complexity penalty 5.40
5. tl|olmeht|o|a
   - total 12.28 | visual 14.32 | recurrence 7.56 | roots 0.80 | unknown penalty 5.00 | complexity penalty 5.40
6. tl|o|lme|htoa
   - total 6.52 | visual 8.32 | recurrence 8.20 | roots 0.40 | unknown penalty 5.00 | complexity penalty 5.40
7. tl|olm|eht|oa
   - total 5.78 | visual 0.00 | recurrence 11.18 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
8. tl|olme|ht|oa
   - total 5.78 | visual 0.00 | recurrence 11.18 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 20: heteohorahra

- current visual split: hete|o|hora|hra

1. hete|o|hora|hra visual-current
   - total 63.80 | visual 46.10 | recurrence 22.70 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. hete|o|h|o|ra|h|ra
   - total 58.58 | visual 35.64 | recurrence 28.13 | roots 5.60 | unknown penalty 0.00 | complexity penalty 10.80
3. h|ete|o|h|o|ra|h|ra
   - total 57.50 | visual 34.64 | recurrence 29.46 | roots 6.00 | unknown penalty 0.00 | complexity penalty 12.60
4. hete|o|h|o|ra|hra
   - total 57.04 | visual 37.10 | recurrence 25.74 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
5. h|ete|o|h|o|ra|hra
   - total 55.97 | visual 36.10 | recurrence 27.07 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
6. hete|o|h|o|r|a|h|ra
   - total 55.91 | visual 41.64 | recurrence 28.87 | roots 4.00 | unknown penalty 6.00 | complexity penalty 12.60
7. hete|o|h|o|ra|h|r|a
   - total 55.91 | visual 41.64 | recurrence 28.87 | roots 4.00 | unknown penalty 6.00 | complexity penalty 12.60
8. h|e|t|e|o|h|o|ra|h|ra
   - total 55.72 | visual 39.64 | recurrence 32.47 | roots 6.80 | unknown penalty 7.00 | complexity penalty 16.20
9. hete|o|h|o|ra|hr|a
   - total 55.19 | visual 35.64 | recurrence 26.75 | roots 3.60 | unknown penalty 0.00 | complexity penalty 10.80
10. h|ete|o|h|o|r|a|h|ra
   - total 54.84 | visual 40.64 | recurrence 30.19 | roots 4.40 | unknown penalty 6.00 | complexity penalty 14.40
11. h|ete|o|h|o|ra|h|r|a
   - total 54.84 | visual 40.64 | recurrence 30.19 | roots 4.40 | unknown penalty 6.00 | complexity penalty 14.40
12. h|e|te|o|h|o|ra|h|ra
   - total 54.57 | visual 34.64 | recurrence 31.43 | roots 6.40 | unknown penalty 3.50 | complexity penalty 14.40

### Compact Challengers

1. hete|o|hora|hra visual-current
   - total 63.80 | visual 46.10 | recurrence 22.70 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
2. hete|o|ho|ra|hra
   - total 42.09 | visual 22.78 | recurrence 24.10 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
3. hete|oh|o|ra|hra
   - total 41.78 | visual 22.78 | recurrence 23.80 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
4. he|te|o|hora|hra
   - total 40.25 | visual 23.10 | recurrence 23.95 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
5. hete|o|horah|ra
   - total 36.39 | visual 15.32 | recurrence 24.06 | roots 2.40 | unknown penalty 0.00 | complexity penalty 5.40
6. hete|o|ho|rah|ra
   - total 35.47 | visual 15.32 | recurrence 24.95 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
7. hete|oh|o|rah|ra
   - total 35.16 | visual 15.32 | recurrence 24.64 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
8. hete|o|hor|ah|ra
   - total 34.97 | visual 15.32 | recurrence 24.45 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20

## Unit 21: horahinirrii

- current visual split: hora|hi|nirrii

1. hora|hi|nirrii visual-current
   - total 42.97 | visual 35.32 | recurrence 11.25 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
2. h|o|ra|h|in|irr|ii
   - total 36.27 | visual 20.32 | recurrence 23.55 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
3. h|o|ra|hi|nirrii
   - total 36.21 | visual 26.32 | recurrence 14.29 | roots 2.80 | unknown penalty 0.00 | complexity penalty 7.20
4. h|o|ra|hi|nirr|ii
   - total 36.13 | visual 21.32 | recurrence 21.00 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
5. h|o|ra|h|inirr|ii
   - total 35.92 | visual 20.32 | recurrence 21.40 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
6. h|o|ra|h|in|ir|rii
   - total 35.84 | visual 20.32 | recurrence 23.12 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
7. h|o|ra|h|in|irrii
   - total 35.61 | visual 20.32 | recurrence 21.09 | roots 3.20 | unknown penalty 0.00 | complexity penalty 9.00
8. h|o|ra|hi|ni|rr|ii
   - total 35.19 | visual 21.32 | recurrence 21.86 | roots 2.80 | unknown penalty 0.00 | complexity penalty 10.80
9. h|o|ra|h|in|ir|ri|i
   - total 35.07 | visual 20.32 | recurrence 27.25 | roots 3.60 | unknown penalty 3.50 | complexity penalty 12.60
10. h|o|ra|h|ini|rr|ii
   - total 34.98 | visual 20.32 | recurrence 22.26 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
11. h|o|ra|hi|ni|rrii
   - total 34.96 | visual 21.32 | recurrence 19.84 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00
12. h|o|ra|hi|nir|rii
   - total 34.96 | visual 21.32 | recurrence 19.84 | roots 2.80 | unknown penalty 0.00 | complexity penalty 9.00

### Compact Challengers

1. hora|hi|nirrii visual-current
   - total 42.97 | visual 35.32 | recurrence 11.25 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
2. hora|hi|nirr|ii
   - total 26.89 | visual 14.32 | recurrence 17.97 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
3. hora|hi|ni|rrii
   - total 25.72 | visual 14.32 | recurrence 16.80 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
4. hora|hi|nir|rii
   - total 25.72 | visual 14.32 | recurrence 16.80 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
5. ho|ra|hi|nirrii
   - total 21.26 | visual 12.00 | recurrence 12.66 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
6. hora|hinirr|ii
   - total 20.04 | visual 7.32 | recurrence 16.31 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
7. hora|hin|irr|ii
   - total 19.53 | visual 7.32 | recurrence 17.60 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
8. hora|hin|ir|rii
   - total 19.10 | visual 7.32 | recurrence 17.17 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40

## Unit 22: oirine

- current visual split: o|irine

1. o|irine visual-current
   - total 30.77 | visual 29.32 | recurrence 2.85 | roots 0.40 | unknown penalty 0.00 | complexity penalty 1.80
2. o|ir|ine
   - total 14.62 | visual 8.32 | recurrence 9.50 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
3. o|iri|ne
   - total 14.35 | visual 8.32 | recurrence 9.22 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
4. o|i|rine
   - total 13.16 | visual 8.32 | recurrence 9.14 | roots 2.80 | unknown penalty 3.50 | complexity penalty 3.60
5. o|ir|in|e
   - total 12.36 | visual 8.32 | recurrence 12.13 | roots 0.80 | unknown penalty 3.50 | complexity penalty 5.40
6. o|i|ri|ne
   - total 11.83 | visual 8.32 | recurrence 11.61 | roots 0.80 | unknown penalty 3.50 | complexity penalty 5.40
7. o|ir|i|ne
   - total 11.39 | visual 8.32 | recurrence 11.17 | roots 0.80 | unknown penalty 3.50 | complexity penalty 5.40
8. o|i|rin|e
   - total 10.04 | visual 8.32 | recurrence 10.91 | roots 3.20 | unknown penalty 7.00 | complexity penalty 5.40
9. oi|rine
   - total 5.75 | visual 0.00 | recurrence 5.55 | roots 2.00 | unknown penalty 0.00 | complexity penalty 1.80
10. o|iri|n|e
   - total 5.65 | visual 8.32 | recurrence 11.43 | roots 0.80 | unknown penalty 9.50 | complexity penalty 5.40
11. o|i|r|ine
   - total 5.29 | visual 8.32 | recurrence 11.06 | roots 0.80 | unknown penalty 9.50 | complexity penalty 5.40
12. oi|ri|ne
   - total 4.42 | visual 0.00 | recurrence 8.02 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60

### Compact Challengers

1. o|irine visual-current
   - total 30.77 | visual 29.32 | recurrence 2.85 | roots 0.40 | unknown penalty 0.00 | complexity penalty 1.80
2. o|ir|ine
   - total 14.62 | visual 8.32 | recurrence 9.50 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
3. o|iri|ne
   - total 14.35 | visual 8.32 | recurrence 9.22 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
4. oi|rine
   - total 5.75 | visual 0.00 | recurrence 5.55 | roots 2.00 | unknown penalty 0.00 | complexity penalty 1.80
5. oi|ri|ne
   - total 4.42 | visual 0.00 | recurrence 8.02 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
6. oir|ine
   - total 3.75 | visual 0.00 | recurrence 5.55 | roots 0.00 | unknown penalty 0.00 | complexity penalty 1.80
7. oiri|ne
   - total 3.75 | visual 0.00 | recurrence 5.55 | roots 0.00 | unknown penalty 0.00 | complexity penalty 1.80
8. oirine
   - total -5.00 | visual 0.00 | recurrence 0.00 | roots 0.00 | unknown penalty 5.00 | complexity penalty 0.00

## Unit 23: lhaoltohorahra

- current visual split: lhaol|t|o|hora|hra

1. lhaol|t|o|hora|hra visual-current
   - total 60.98 | visual 49.10 | recurrence 18.68 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. l|h|a|o|lt|o|hora|hra
   - total 55.26 | visual 43.43 | recurrence 28.83 | roots 1.60 | unknown penalty 6.00 | complexity penalty 12.60
3. lhaol|t|o|h|o|ra|hra
   - total 54.22 | visual 40.10 | recurrence 21.72 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
4. lh|a|o|lt|o|hora|hra
   - total 53.87 | visual 37.43 | recurrence 26.04 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80
5. l|h|a|ol|t|o|hora|hra
   - total 53.26 | visual 40.10 | recurrence 30.55 | roots 1.20 | unknown penalty 6.00 | complexity penalty 12.60
6. lh|a|ol|t|o|hora|hra
   - total 51.87 | visual 34.10 | recurrence 27.76 | roots 0.80 | unknown penalty 0.00 | complexity penalty 10.80
7. lha|o|lt|o|hora|h|ra
   - total 49.11 | visual 29.97 | recurrence 26.74 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
8. lhaol|t|o|h|or|a|hra
   - total 48.81 | visual 37.78 | recurrence 20.63 | roots 1.20 | unknown penalty 0.00 | complexity penalty 10.80
9. lhaol|t|o|h|o|rahr|a
   - total 48.17 | visual 38.64 | recurrence 18.73 | roots 1.60 | unknown penalty 0.00 | complexity penalty 10.80
10. lha|olt|o|h|o|ra|hra
   - total 47.97 | visual 30.10 | recurrence 25.46 | roots 3.20 | unknown penalty 0.00 | complexity penalty 10.80
11. l|h|a|olt|o|hora|h|ra
   - total 47.94 | visual 33.64 | recurrence 29.30 | roots 3.60 | unknown penalty 6.00 | complexity penalty 12.60
12. lha|o|l|t|o|hora|hra
   - total 47.61 | visual 36.43 | recurrence 27.19 | roots 0.80 | unknown penalty 6.00 | complexity penalty 10.80

### Compact Challengers

1. lhaol|t|o|hora|hra visual-current
   - total 60.98 | visual 49.10 | recurrence 18.68 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
2. lha|o|lt|o|hora|hra
   - total 47.58 | visual 31.43 | recurrence 24.35 | roots 0.80 | unknown penalty 0.00 | complexity penalty 9.00
3. lha|ol|t|o|hora|hra
   - total 45.57 | visual 28.10 | recurrence 26.07 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00
4. lh|aol|t|o|hora|hra
   - total 44.58 | visual 28.10 | recurrence 25.08 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00
5. lhaol|t|o|ho|ra|hra
   - total 39.27 | visual 25.78 | recurrence 20.08 | roots 2.40 | unknown penalty 0.00 | complexity penalty 9.00
6. lhaol|t|oh|o|ra|hra
   - total 38.96 | visual 25.78 | recurrence 19.78 | roots 2.40 | unknown penalty 0.00 | complexity penalty 9.00
7. lha|olt|o|hora|hra
   - total 38.73 | visual 23.10 | recurrence 22.42 | roots 0.40 | unknown penalty 0.00 | complexity penalty 7.20
8. lh|ao|lt|o|hora|hra
   - total 37.54 | visual 23.10 | recurrence 23.04 | roots 0.40 | unknown penalty 0.00 | complexity penalty 9.00

## How To Use

A boundary is stronger when it wins without relying only on visual bonus.
If visual-current loses badly, inspect the annotation: the visual split may be wrong or the flat unit reading may be normalized differently.
If many alternatives tie, the key needs an explicit boundary marker/rule.
