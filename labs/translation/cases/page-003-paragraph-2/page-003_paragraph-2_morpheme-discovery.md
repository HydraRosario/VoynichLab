# VoynichLab Morpheme Discovery

This report tests whether romanized units can be segmented into recurring candidate roots without manually choosing every boundary.

## Top Candidate Roots

- horah: count 9, units 9, score 11.91
- hora: count 9, units 9, score 11.04
- orah: count 9, units 9, score 11.04
- rah: count 12, units 11, score 10.99
- horahi: count 6, units 6, score 10.69
- ra: count 21, units 15, score 10.57
- orahi: count 6, units 6, score 10.06
- hor: count 9, units 9, score 9.97
- ora: count 9, units 9, score 9.97
- ohorah: count 5, units 5, score 9.84
- hra: count 8, units 8, score 9.51
- het: count 8, units 7, score 9.34
- hete: count 6, units 6, score 9.33
- rahi: count 6, units 6, score 9.33
- ohora: count 5, units 5, score 9.27
- te: count 13, units 12, score 9.23
- ho: count 12, units 12, score 9.07
- ri: count 12, units 12, score 9.07
- ete: count 7, units 7, score 9.00
- teo: count 7, units 7, score 9.00
- ah: count 12, units 11, score 8.95
- et: count 11, units 10, score 8.64
- hate: count 5, units 5, score 8.59
- ohor: count 5, units 5, score 8.59
- rime: count 5, units 5, score 8.59
- ol: count 11, units 9, score 8.50
- ahi: count 6, units 6, score 8.42
- rim: count 6, units 6, score 8.42
- ahiirime: count 3, units 3, score 8.34
- eteohora: count 3, units 3, score 8.34
- heteohor: count 3, units 3, score 8.34
- horahiir: count 3, units 3, score 8.34
- ohorahra: count 3, units 3, score 8.34
- orahiiri: count 3, units 3, score 8.34
- rahiirim: count 3, units 3, score 8.34
- teohorah: count 3, units 3, score 8.34
- heteo: count 4, units 4, score 8.32
- irime: count 4, units 4, score 8.32
- ir: count 9, units 9, score 8.09
- me: count 9, units 9, score 8.09

## Segmentations

### Unit 1: ohorahiirime

1. score 41.42, unknown 0: oho-ra-hi-ir-ime
2. score 41.42, unknown 0: oho-ra-hi-iri-me
3. score 41.15, unknown 0: oh-ora-hi-ir-ime
4. score 41.15, unknown 0: oh-ora-hi-iri-me
5. score 40.73, unknown 1: oho-ra-hi-i?-ri-me

### Unit 2: hetraheteoa

1. score 34.50, unknown 1: het-ra-het-eo-a?
2. score 34.43, unknown 1: het-ra-he-teo-a?
3. score 34.22, unknown 1: het-rah-et-eo-a?
4. score 32.67, unknown 2: het-ra-he-te-o?-a?
5. score 31.80, unknown 2: het-ra-h?-et-eo-a?

### Unit 3: hlaolmethotra

1. score 26.78, unknown 5: h?-l?-a?-ol-m?-et-ho-t?-ra
2. score 26.22, unknown 5: h?-l?-a?-ol-me-t?-ho-t?-ra
3. score 14.27, unknown 7: h?-l?-a?-o?-l?-m?-et-ho-t?-ra
4. score 14.14, unknown 7: h?-l?-a?-ol-m?-e?-t?-ho-t?-ra
5. score 13.72, unknown 7: h?-l?-a?-o?-l?-me-t?-ho-t?-ra

### Unit 4: ohrahorahiirime

1. score 61.39, unknown 0: oh-ra-ho-ra-hi-ir-ime
2. score 61.39, unknown 0: oh-ra-ho-ra-hi-iri-me
3. score 60.70, unknown 1: oh-ra-ho-ra-hi-i?-ri-me
4. score 59.72, unknown 1: oh-ra-ho-ra-hi-ir-i?-me
5. score 59.32, unknown 1: oh-ra-ho-ra-hi-ir-im-e?

### Unit 5: hetecrime

1. score 31.91, unknown 1: he-te-c?-ri-me
2. score 24.48, unknown 1: hete-c?-ri-me
3. score 23.35, unknown 1: he-te-c?-rime
4. score 22.49, unknown 2: het-e?-c?-ri-me
5. score 22.15, unknown 2: h?-ete-c?-ri-me

### Unit 6: hlaolmethohimirriaa

1. score 37.06, unknown 7: h?-l?-a?-ol-m?-et-ho-h?-im-ir-ri-a?-a?
2. score 36.62, unknown 7: h?-l?-a?-ol-m?-et-ho-hi-m?-ir-ri-a?-a?
3. score 36.50, unknown 7: h?-l?-a?-ol-me-t?-ho-h?-im-ir-ri-a?-a?
4. score 36.08, unknown 7: h?-l?-a?-ol-m?-et-h?-oh-im-ir-ri-a?-a?
5. score 36.06, unknown 7: h?-l?-a?-ol-me-t?-ho-hi-m?-ir-ri-a?-a?

### Unit 7: heteohorahiirimehra

1. score 77.16, unknown 0: het-eo-ho-ra-hi-ir-im-eh-ra
2. score 77.09, unknown 0: he-teo-ho-ra-hi-ir-im-eh-ra
3. score 76.02, unknown 0: he-te-oho-ra-hi-ir-im-eh-ra
4. score 75.75, unknown 0: he-te-oh-ora-hi-ir-im-eh-ra
5. score 75.33, unknown 1: he-te-o?-ho-ra-hi-ir-im-eh-ra

### Unit 8: hrahetehtra

1. score 34.75, unknown 1: hra-het-eh-t?-ra
2. score 33.81, unknown 2: h?-ra-het-eh-t?-ra
3. score 33.53, unknown 2: h?-rah-et-eh-t?-ra
4. score 32.84, unknown 2: hra-he-te-h?-t?-ra
5. score 32.05, unknown 2: hra-h?-et-eh-t?-ra

### Unit 9: heteohorahra

1. score 52.45, unknown 0: he-te-oh-or-ah-ra
2. score 47.21, unknown 0: het-eo-ho-rah-ra
3. score 47.14, unknown 0: he-teo-ho-rah-ra
4. score 46.45, unknown 0: he-te-oh-orah-ra
5. score 46.08, unknown 0: het-eo-hor-ah-ra

### Unit 10: ololhateohra

1. score 44.25, unknown 0: ol-ol-hate-oh-ra
2. score 41.53, unknown 0: ol-ol-hat-eo-hra
3. score 41.42, unknown 1: ol-ol-hat-e?-oh-ra
4. score 41.42, unknown 1: ol-ol-h?-ate-oh-ra
5. score 40.90, unknown 2: ol-ol-h?-a?-te-oh-ra

### Unit 11: olaolhateoa

1. score 28.02, unknown 2: ol-a?-ol-hat-eo-a?
2. score 19.59, unknown 3: ol-a?-ol-hate-o?-a?
3. score 18.01, unknown 4: ol-a?-ol-h?-a?-teo-a?
4. score 16.76, unknown 4: ol-a?-ol-hat-e?-o?-a?
5. score 16.76, unknown 4: ol-a?-ol-h?-ate-o?-a?

### Unit 12: hatehtluoltra

1. score 26.16, unknown 4: hat-eh-t?-l?-u?-ol-t?-ra
2. score 17.66, unknown 5: hate-h?-t?-l?-u?-ol-t?-ra
3. score 14.83, unknown 6: hat-e?-h?-t?-l?-u?-ol-t?-ra
4. score 14.83, unknown 6: h?-ate-h?-t?-l?-u?-ol-t?-ra
5. score 14.31, unknown 7: h?-a?-te-h?-t?-l?-u?-ol-t?-ra

### Unit 13: ocrinehatehra

1. score 27.66, unknown 3: o?-c?-ri-n?-eh-ate-hra
2. score 27.14, unknown 4: o?-c?-ri-n?-eh-a?-te-hra
3. score 26.72, unknown 4: o?-c?-ri-n?-e?-hat-eh-ra
4. score 26.72, unknown 4: o?-c?-ri-n?-eh-ate-h?-ra
5. score 26.20, unknown 5: o?-c?-ri-n?-eh-a?-te-h?-ra

### Unit 14: horahinirriaa

1. score 38.04, unknown 3: ho-ra-hi-n?-ir-ri-a?-a?
2. score 29.54, unknown 3: ho-rahi-n?-ir-ri-a?-a?
3. score 29.54, unknown 3: hor-ahi-n?-ir-ri-a?-a?
4. score 29.44, unknown 3: hora-hi-n?-ir-ri-a?-a?
5. score 29.20, unknown 4: ho-rah-i?-n?-ir-ri-a?-a?

### Unit 15: hateoirime

1. score 30.85, unknown 0: hat-eo-ir-ime
2. score 30.85, unknown 0: hat-eo-iri-me
3. score 30.16, unknown 1: hat-eo-i?-ri-me
4. score 29.18, unknown 1: hat-eo-ir-i?-me
5. score 28.79, unknown 1: hat-eo-ir-im-e?

### Unit 16: loliocrima

1. score 6.93, unknown 5: l?-ol-i?-o?-c?-rim-a?
2. score 5.57, unknown 6: l?-ol-i?-o?-c?-ri-m?-a?
3. score 4.20, unknown 6: l?-ol-i?-o?-c?-r?-im-a?
4. score -5.58, unknown 7: l?-o?-l?-i?-o?-c?-rim-a?
5. score -6.93, unknown 8: l?-o?-l?-i?-o?-c?-ri-m?-a?

### Unit 17: horahimirrii

1. score 42.90, unknown 1: ho-rah-im-ir-ri-i?
2. score 41.76, unknown 1: hor-ah-im-ir-ri-i?
3. score 40.48, unknown 2: ho-ra-h?-im-ir-ri-i?
4. score 40.04, unknown 2: ho-ra-hi-m?-ir-ri-i?
5. score 38.86, unknown 2: ho-r?-ah-im-ir-ri-i?

### Unit 18: hetoh

1. score 17.43, unknown 0: het-oh
2. score 14.73, unknown 1: h?-et-oh
3. score 13.61, unknown 1: he-t?-oh
4. score 5.34, unknown 2: het-o?-h?
5. score 2.64, unknown 3: h?-et-o?-h?

### Unit 19: tlolmehtoa

1. score 4.59, unknown 6: t?-l?-ol-me-h?-t?-o?-a?
2. score 3.84, unknown 6: t?-l?-ol-m?-eh-t?-o?-a?
3. score -7.50, unknown 8: t?-l?-ol-m?-e?-h?-t?-o?-a?
4. score -7.91, unknown 8: t?-l?-o?-l?-me-h?-t?-o?-a?
5. score -8.67, unknown 8: t?-l?-o?-l?-m?-eh-t?-o?-a?

### Unit 20: heteohorahra

1. score 52.45, unknown 0: he-te-oh-or-ah-ra
2. score 47.21, unknown 0: het-eo-ho-rah-ra
3. score 47.14, unknown 0: he-teo-ho-rah-ra
4. score 46.45, unknown 0: he-te-oh-orah-ra
5. score 46.08, unknown 0: het-eo-hor-ah-ra

### Unit 21: horahinirrii

1. score 40.04, unknown 2: ho-ra-hi-n?-ir-ri-i?
2. score 31.54, unknown 2: ho-rahi-n?-ir-ri-i?
3. score 31.54, unknown 2: hor-ahi-n?-ir-ri-i?
4. score 31.44, unknown 2: hora-hi-n?-ir-ri-i?
5. score 31.20, unknown 3: ho-rah-i?-n?-ir-ri-i?

### Unit 22: oirine

1. score 1.75, unknown 3: o?-iri-n?-e?
2. score 1.07, unknown 4: o?-i?-ri-n?-e?
3. score 0.09, unknown 4: o?-ir-i?-n?-e?
4. score -12.00, unknown 6: o?-i?-r?-i?-n?-e?

### Unit 23: lhaoltohorahra

1. score 36.20, unknown 4: l?-h?-a?-ol-t?-oh-or-ah-ra
2. score 30.19, unknown 4: l?-h?-a?-ol-t?-oh-orah-ra
3. score 29.81, unknown 4: l?-h?-a?-ol-t?-oho-rah-ra
4. score 29.12, unknown 5: l?-h?-a?-ol-t?-o?-ho-rah-ra
5. score 28.61, unknown 4: l?-h?-a?-ol-t?-ohor-ah-ra

### Unit manual: lhurlumehteteholaarli

1. score 9.62, unknown 13: l?-h?-u?-r?-l?-u?-me-h?-te-te-ho-l?-a?-a?-r?-l?-i?
2. score 9.06, unknown 13: l?-h?-u?-r?-l?-u?-me-h?-te-te-h?-ol-a?-a?-r?-l?-i?
3. score 8.87, unknown 13: l?-h?-u?-r?-l?-u?-m?-eh-te-te-ho-l?-a?-a?-r?-l?-i?
4. score 8.31, unknown 13: l?-h?-u?-r?-l?-u?-m?-eh-te-te-h?-ol-a?-a?-r?-l?-i?
5. score 7.16, unknown 13: l?-h?-u?-r?-l?-u?-me-h?-te-t?-eh-ol-a?-a?-r?-l?-i?

## Scientific Reading

- If top segmentations rely on many one-letter unknowns, the romanization lacks enough root-boundary information.
- If the same pieces recur across units and explain most letters, the key is producing reusable structure.
- If multiple segmentations have similar scores, the next missing layer is likely boundary/rule annotation, not more visual boxes.
