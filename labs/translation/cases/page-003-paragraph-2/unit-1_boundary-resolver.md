# VoynichLab Boundary Resolver

- dataset: DataSetCreator/evidence/paragraph-2-page-3/page-003_paragraph-2_dataset.json
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
9. o|horahi|irime
   - total 30.89 | visual 14.64 | recurrence 19.45 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
10. o|hora|hiirime
   - total 30.75 | visual 15.64 | recurrence 18.30 | roots 0.40 | unknown penalty 0.00 | complexity penalty 3.60
11. o|hora|hiir|ime
   - total 30.44 | visual 15.64 | recurrence 19.79 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
12. o|ho|rahi|irime
   - total 30.00 | visual 14.64 | recurrence 20.36 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
13. o|hor|ahi|irime
   - total 29.99 | visual 14.64 | recurrence 20.35 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
14. oh|o|rahi|irime
   - total 29.69 | visual 14.64 | recurrence 20.05 | roots 0.40 | unknown penalty 0.00 | complexity penalty 5.40
15. oho|ra|hi|irime
   - total 29.69 | visual 13.32 | recurrence 19.77 | roots 2.00 | unknown penalty 0.00 | complexity penalty 5.40
16. oh|ora|hi|irime
   - total 27.88 | visual 13.32 | recurrence 19.96 | roots 0.00 | unknown penalty 0.00 | complexity penalty 5.40
17. ohora|hi|irime
   - total 27.53 | visual 13.32 | recurrence 17.81 | roots 0.00 | unknown penalty 0.00 | complexity penalty 3.60
18. o|horah|ii|ri|me
   - total 27.09 | visual 8.32 | recurrence 23.57 | roots 2.40 | unknown penalty 0.00 | complexity penalty 7.20
19. o|ho|ra|hii|rime
   - total 27.06 | visual 8.32 | recurrence 21.54 | roots 4.40 | unknown penalty 0.00 | complexity penalty 7.20
20. o|ho|ra|hiiri|me
   - total 27.06 | visual 8.32 | recurrence 21.54 | roots 4.40 | unknown penalty 0.00 | complexity penalty 7.20

## How To Use

A boundary is stronger when it wins without relying only on visual bonus.
If visual-current loses badly, inspect the annotation: the visual split may be wrong or the flat unit reading may be normalized differently.
If many alternatives tie, the key needs an explicit boundary marker/rule.
