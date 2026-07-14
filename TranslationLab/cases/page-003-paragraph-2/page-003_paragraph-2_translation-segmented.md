# VoynichLab Romanization Translation Pass

- dataset: DataSetCreator/evidence/paragraph-2-page-3/page-003_paragraph-2_dataset.json
- roots: TranslationLab/translator/roots.tsv
- mode: segmented

This is not the final translation. It is the etymological candidate pass.

The main input is the visual-part segmentation, because flat romanization loses root-boundary information.

## Unit 1: ohorahiirime

- segmented input: o|hora|hi|irime
- best total score: 3.64
- best total unknown: 0

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 3: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 4: irime
1. score 1.20, unknown 0: i{proto:i/vowel} + rim{proto:rim-family} + e{proto:e/vowel}
2. score 0.90, unknown 0: i{proto:i/vowel} + rime{proto:rime-family}
3. score -0.42, unknown 1: i{proto:i/vowel} + r{?} + i{proto:i/vowel} + me{proto:me/root}
4. score -0.62, unknown 1: i{proto:i/vowel} + rim{proto:rim-family} + e{?}
5. score -0.62, unknown 1: i{?} + rim{proto:rim-family} + e{proto:e/vowel}


## Unit 2: hetraheteoa

- segmented input: hetera|hete|o|a
- best total score: 0.30
- best total unknown: 2

### Segment 1: hetera
1. score 0.00, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel} + ra{proto:ra/root}
2. score -1.62, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel} + r{?} + a{proto:a/vowel}
3. score -1.82, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?} + ra{proto:ra/root}
4. score -1.82, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel} + ra{proto:ra/root}
5. score -1.92, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel} + ra{proto:ra/root}

### Segment 2: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 3: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 4: a
1. score 0.32, unknown 0: a{proto:a/vowel}
2. score -1.50, unknown 1: a{?}


## Unit 3: hlaolmethotra

- segmented input: hlaolmehte|o|hra
- best total score: -0.88
- best total unknown: 3

### Segment 1: hlaolmehte
1. score -2.16, unknown 3: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{proto:breath/aspiration} + t{?} + e{proto:e/vowel}
2. score -3.78, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + m{?} + e{proto:e/vowel} + h{proto:breath/aspiration} + t{?} + e{proto:e/vowel}
3. score -3.98, unknown 4: h{proto:breath/aspiration} + l{?} + a{?} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{proto:breath/aspiration} + t{?} + e{proto:e/vowel}
4. score -3.98, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{proto:breath/aspiration} + t{?} + e{?}
5. score -4.08, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{?} + t{?} + e{proto:e/vowel}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 4: ohrahorahiirime

- segmented input: o|hra|hora|hi|irime
- best total score: 4.50
- best total unknown: 0

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}

### Segment 3: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 4: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 5: irime
1. score 1.20, unknown 0: i{proto:i/vowel} + rim{proto:rim-family} + e{proto:e/vowel}
2. score 0.90, unknown 0: i{proto:i/vowel} + rime{proto:rime-family}
3. score -0.42, unknown 1: i{proto:i/vowel} + r{?} + i{proto:i/vowel} + me{proto:me/root}
4. score -0.62, unknown 1: i{proto:i/vowel} + rim{proto:rim-family} + e{?}
5. score -0.62, unknown 1: i{?} + rim{proto:rim-family} + e{proto:e/vowel}


## Unit 5: hetecrime

- segmented input: hete|hrime
- best total score: 0.86
- best total unknown: 1

### Segment 1: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 2: hrime
1. score 1.30, unknown 0: h{proto:breath/aspiration} + rim{proto:rim-family} + e{proto:e/vowel}
2. score 1.00, unknown 0: h{proto:breath/aspiration} + rime{proto:rime-family}
3. score -0.32, unknown 1: h{proto:breath/aspiration} + r{?} + i{proto:i/vowel} + me{proto:me/root}
4. score -0.52, unknown 1: h{proto:breath/aspiration} + rim{proto:rim-family} + e{?}
5. score -0.62, unknown 1: h{?} + rim{proto:rim-family} + e{proto:e/vowel}


## Unit 6: hlaolmethohimirriaa

- segmented input: hlaolmeth|o|hi|mirriaa
- best total score: -4.54
- best total unknown: 6

### Segment 1: hlaolmeth
1. score -2.48, unknown 3: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + me{proto:me/root} + t{?} + h{proto:breath/aspiration}
2. score -4.10, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + m{?} + e{proto:e/vowel} + t{?} + h{proto:breath/aspiration}
3. score -4.30, unknown 4: h{proto:breath/aspiration} + l{?} + a{?} + o{proto:particle/o} + l{?} + me{proto:me/root} + t{?} + h{proto:breath/aspiration}
4. score -4.40, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{?} + l{?} + me{proto:me/root} + t{?} + h{proto:breath/aspiration}
5. score -4.40, unknown 4: h{proto:breath/aspiration} + l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + me{proto:me/root} + t{?} + h{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 4: mirriaa
1. score -3.22, unknown 3: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{proto:a/vowel}
2. score -5.04, unknown 4: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{?}
3. score -5.04, unknown 4: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{?} + a{proto:a/vowel}
4. score -5.04, unknown 4: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{?} + a{proto:a/vowel} + a{proto:a/vowel}
5. score -5.04, unknown 4: m{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{proto:a/vowel}


## Unit 7: heteohorahiirimehra

- segmented input: hete|hora|o|hi|irime|hra
- best total score: 4.06
- best total unknown: 1

### Segment 1: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 2: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 3: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 4: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 5: irime
1. score 1.20, unknown 0: i{proto:i/vowel} + rim{proto:rim-family} + e{proto:e/vowel}
2. score 0.90, unknown 0: i{proto:i/vowel} + rime{proto:rime-family}
3. score -0.42, unknown 1: i{proto:i/vowel} + r{?} + i{proto:i/vowel} + me{proto:me/root}
4. score -0.62, unknown 1: i{proto:i/vowel} + rim{proto:rim-family} + e{?}
5. score -0.62, unknown 1: i{?} + rim{proto:rim-family} + e{proto:e/vowel}

### Segment 6: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 8: hrahetehtra

- segmented input: hra|hete|h|tra
- best total score: -0.22
- best total unknown: 2

### Segment 1: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}

### Segment 2: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 3: h
1. score 0.42, unknown 0: h{proto:breath/aspiration}
2. score -1.50, unknown 1: h{?}

### Segment 4: tra
1. score -1.06, unknown 1: t{?} + ra{proto:ra/root}
2. score -2.68, unknown 2: t{?} + r{?} + a{proto:a/vowel}
3. score -4.50, unknown 3: t{?} + r{?} + a{?}


## Unit 9: heteohorahra

- segmented input: hete|hora|o|hra
- best total score: 2.12
- best total unknown: 1

### Segment 1: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 2: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 3: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 4: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 10: ololhateohra

- segmented input: o|lol|hate|o|hra
- best total score: -1.32
- best total unknown: 3

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: lol
1. score -2.58, unknown 2: l{?} + o{proto:particle/o} + l{?}
2. score -4.50, unknown 3: l{?} + o{?} + l{?}

### Segment 3: hate
1. score -0.44, unknown 1: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + a{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + a{?} + t{?} + e{?}

### Segment 4: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 5: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 11: olaolhateoa

- segmented input: o|laol|hate|o|a
- best total score: -1.54
- best total unknown: 3

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: laol
1. score -2.26, unknown 2: l{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?}
2. score -4.08, unknown 3: l{?} + a{?} + o{proto:particle/o} + l{?}
3. score -4.18, unknown 3: l{?} + a{proto:a/vowel} + o{?} + l{?}
4. score -6.00, unknown 4: l{?} + a{?} + o{?} + l{?}

### Segment 3: hate
1. score -0.44, unknown 1: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + a{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + a{?} + t{?} + e{?}

### Segment 4: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 5: a
1. score 0.32, unknown 0: a{proto:a/vowel}
2. score -1.50, unknown 1: a{?}


## Unit 12: hatehtluoltra

- segmented input: hate|h|tlhaolte|hra
- best total score: -3.68
- best total unknown: 5

### Segment 1: hate
1. score -0.44, unknown 1: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + a{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + a{?} + t{?} + e{?}

### Segment 2: h
1. score 0.42, unknown 0: h{proto:breath/aspiration}
2. score -1.50, unknown 1: h{?}

### Segment 3: tlhaolte
1. score -4.52, unknown 4: t{?} + l{?} + h{proto:breath/aspiration} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + t{?} + e{proto:e/vowel}
2. score -6.34, unknown 5: t{?} + l{?} + h{proto:breath/aspiration} + a{?} + o{proto:particle/o} + l{?} + t{?} + e{proto:e/vowel}
3. score -6.34, unknown 5: t{?} + l{?} + h{proto:breath/aspiration} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + t{?} + e{?}
4. score -6.44, unknown 5: t{?} + l{?} + h{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?} + t{?} + e{proto:e/vowel}
5. score -6.44, unknown 5: t{?} + l{?} + h{proto:breath/aspiration} + a{proto:a/vowel} + o{?} + l{?} + t{?} + e{proto:e/vowel}

### Segment 4: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 13: ocrinehatehra

- segmented input: o|hrine|hate|hra
- best total score: 2.14
- best total unknown: 1

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: hrine
1. score 1.30, unknown 0: h{proto:breath/aspiration} + rin{proto:rin-family} + e{proto:e/vowel}
2. score 1.00, unknown 0: h{proto:breath/aspiration} + rine{proto:rine-family}
3. score -0.52, unknown 1: h{proto:breath/aspiration} + rin{proto:rin-family} + e{?}
4. score -0.62, unknown 1: h{?} + rin{proto:rin-family} + e{proto:e/vowel}
5. score -0.92, unknown 1: h{?} + rine{proto:rine-family}

### Segment 3: hate
1. score -0.44, unknown 1: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + a{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + a{?} + t{?} + e{?}

### Segment 4: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 14: horahinirriaa

- segmented input: hora|hi|nirriaa
- best total score: -1.20
- best total unknown: 3

### Segment 1: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 2: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 3: nirriaa
1. score -3.22, unknown 3: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{proto:a/vowel}
2. score -5.04, unknown 4: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{?}
3. score -5.04, unknown 4: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + a{?} + a{proto:a/vowel}
4. score -5.04, unknown 4: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{?} + a{proto:a/vowel} + a{proto:a/vowel}
5. score -5.04, unknown 4: n{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + a{proto:a/vowel} + a{proto:a/vowel}


## Unit 15: hateoirime

- segmented input: hate|o|irime
- best total score: 1.18
- best total unknown: 1

### Segment 1: hate
1. score -0.44, unknown 1: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + a{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + a{proto:a/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + a{proto:a/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + a{?} + t{?} + e{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: irime
1. score 1.20, unknown 0: i{proto:i/vowel} + rim{proto:rim-family} + e{proto:e/vowel}
2. score 0.90, unknown 0: i{proto:i/vowel} + rime{proto:rime-family}
3. score -0.42, unknown 1: i{proto:i/vowel} + r{?} + i{proto:i/vowel} + me{proto:me/root}
4. score -0.62, unknown 1: i{proto:i/vowel} + rim{proto:rim-family} + e{?}
5. score -0.62, unknown 1: i{?} + rim{proto:rim-family} + e{proto:e/vowel}


## Unit 16: loliocrima

- segmented input: loli|o|hrima
- best total score: -0.54
- best total unknown: 2

### Segment 1: loli
1. score -2.26, unknown 2: l{?} + o{proto:particle/o} + l{?} + i{proto:i/vowel}
2. score -4.08, unknown 3: l{?} + o{proto:particle/o} + l{?} + i{?}
3. score -4.18, unknown 3: l{?} + o{?} + l{?} + i{proto:i/vowel}
4. score -6.00, unknown 4: l{?} + o{?} + l{?} + i{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: hrima
1. score 1.30, unknown 0: h{proto:breath/aspiration} + rim{proto:rim-family} + a{proto:a/vowel}
2. score -0.52, unknown 1: h{proto:breath/aspiration} + rim{proto:rim-family} + a{?}
3. score -0.62, unknown 1: h{?} + rim{proto:rim-family} + a{proto:a/vowel}
4. score -1.94, unknown 2: h{proto:breath/aspiration} + r{?} + i{proto:i/vowel} + m{?} + a{proto:a/vowel}
5. score -2.44, unknown 2: h{?} + rim{proto:rim-family} + a{?}


## Unit 17: horahimirrii

- segmented input: hora|hi|mirrii
- best total score: -1.52
- best total unknown: 3

### Segment 1: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 2: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 3: mirrii
1. score -3.54, unknown 3: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + i{proto:i/vowel}
2. score -5.36, unknown 4: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + i{?}
3. score -5.36, unknown 4: m{?} + i{proto:i/vowel} + r{?} + r{?} + i{?} + i{proto:i/vowel}
4. score -5.36, unknown 4: m{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + i{proto:i/vowel}
5. score -7.18, unknown 5: m{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + i{?}


## Unit 18: hetoh

- segmented input: hete|o|h
- best total score: 0.40
- best total unknown: 1

### Segment 1: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: h
1. score 0.42, unknown 0: h{proto:breath/aspiration}
2. score -1.50, unknown 1: h{?}


## Unit 19: tlolmehtoa

- segmented input: tlolmeht|o|a
- best total score: -3.98
- best total unknown: 4

### Segment 1: tlolmeht
1. score -4.72, unknown 4: t{?} + l{?} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{proto:breath/aspiration} + t{?}
2. score -6.34, unknown 5: t{?} + l{?} + o{proto:particle/o} + l{?} + m{?} + e{proto:e/vowel} + h{proto:breath/aspiration} + t{?}
3. score -6.64, unknown 5: t{?} + l{?} + o{?} + l{?} + me{proto:me/root} + h{proto:breath/aspiration} + t{?}
4. score -6.64, unknown 5: t{?} + l{?} + o{proto:particle/o} + l{?} + me{proto:me/root} + h{?} + t{?}
5. score -8.16, unknown 6: t{?} + l{?} + o{proto:particle/o} + l{?} + m{?} + e{?} + h{proto:breath/aspiration} + t{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: a
1. score 0.32, unknown 0: a{proto:a/vowel}
2. score -1.50, unknown 1: a{?}


## Unit 20: heteohorahra

- segmented input: hete|o|hora|hra
- best total score: 2.12
- best total unknown: 1

### Segment 1: hete
1. score -0.44, unknown 1: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
2. score -2.26, unknown 2: h{proto:breath/aspiration} + e{?} + t{?} + e{proto:e/vowel}
3. score -2.26, unknown 2: h{proto:breath/aspiration} + e{proto:e/vowel} + t{?} + e{?}
4. score -2.36, unknown 2: h{?} + e{proto:e/vowel} + t{?} + e{proto:e/vowel}
5. score -4.08, unknown 3: h{proto:breath/aspiration} + e{?} + t{?} + e{?}

### Segment 2: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 3: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 4: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}


## Unit 21: horahinirrii

- segmented input: hora|hi|nirrii
- best total score: -1.52
- best total unknown: 3

### Segment 1: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 2: hi
1. score 0.74, unknown 0: h{proto:breath/aspiration} + i{proto:i/vowel}
2. score -1.08, unknown 1: h{proto:breath/aspiration} + i{?}
3. score -1.18, unknown 1: h{?} + i{proto:i/vowel}
4. score -3.00, unknown 2: h{?} + i{?}

### Segment 3: nirrii
1. score -3.54, unknown 3: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + i{proto:i/vowel}
2. score -5.36, unknown 4: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{proto:i/vowel} + i{?}
3. score -5.36, unknown 4: n{?} + i{proto:i/vowel} + r{?} + r{?} + i{?} + i{proto:i/vowel}
4. score -5.36, unknown 4: n{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + i{proto:i/vowel}
5. score -7.18, unknown 5: n{?} + i{?} + r{?} + r{?} + i{proto:i/vowel} + i{?}


## Unit 22: oirine

- segmented input: o|irine
- best total score: 1.62
- best total unknown: 0

### Segment 1: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 2: irine
1. score 1.20, unknown 0: i{proto:i/vowel} + rin{proto:rin-family} + e{proto:e/vowel}
2. score 0.90, unknown 0: i{proto:i/vowel} + rine{proto:rine-family}
3. score -0.62, unknown 1: i{proto:i/vowel} + rin{proto:rin-family} + e{?}
4. score -0.62, unknown 1: i{?} + rin{proto:rin-family} + e{proto:e/vowel}
5. score -0.92, unknown 1: i{?} + rine{proto:rine-family}


## Unit 23: lhaoltohorahra

- segmented input: lhaol|t|o|hora|hra
- best total score: -0.78
- best total unknown: 3

### Segment 1: lhaol
1. score -1.84, unknown 2: l{?} + h{proto:breath/aspiration} + a{proto:a/vowel} + o{proto:particle/o} + l{?}
2. score -3.66, unknown 3: l{?} + h{proto:breath/aspiration} + a{?} + o{proto:particle/o} + l{?}
3. score -3.76, unknown 3: l{?} + h{?} + a{proto:a/vowel} + o{proto:particle/o} + l{?}
4. score -3.76, unknown 3: l{?} + h{proto:breath/aspiration} + a{proto:a/vowel} + o{?} + l{?}
5. score -5.58, unknown 4: l{?} + h{proto:breath/aspiration} + a{?} + o{?} + l{?}

### Segment 2: t
1. score -1.50, unknown 1: t{?}

### Segment 3: o
1. score 0.42, unknown 0: o{proto:particle/o}
2. score -1.50, unknown 1: o{?}

### Segment 4: hora
1. score 1.28, unknown 0: h{proto:breath/aspiration} + o{proto:particle/o} + ra{proto:ra/root}
2. score -0.34, unknown 1: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{proto:a/vowel}
3. score -0.64, unknown 1: h{?} + o{proto:particle/o} + ra{proto:ra/root}
4. score -0.64, unknown 1: h{proto:breath/aspiration} + o{?} + ra{proto:ra/root}
5. score -2.16, unknown 2: h{proto:breath/aspiration} + o{proto:particle/o} + r{?} + a{?}

### Segment 5: hra
1. score 0.86, unknown 0: h{proto:breath/aspiration} + ra{proto:ra/root}
2. score -0.76, unknown 1: h{proto:breath/aspiration} + r{?} + a{proto:a/vowel}
3. score -1.06, unknown 1: h{?} + ra{proto:ra/root}
4. score -2.58, unknown 2: h{proto:breath/aspiration} + r{?} + a{?}
5. score -2.68, unknown 2: h{?} + r{?} + a{proto:a/vowel}

