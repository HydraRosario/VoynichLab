# VoynichLab V1 - Figure Plan

Status: figure-design document, not generated artwork.

Evidence rule: figures must illustrate only claims allowed by `paper/CLAIMS.md` and sections planned in `paper/OUTLINE.md`.

Do not generate final images yet. This file defines what each figure must demonstrate, what data it needs, and what claim boundary it must respect.

## Figure 1. From Ink to Frozen Slot Reuse

### Purpose

Explain the core V1 result visually in one figure.

### Central Message

A visible manuscript form can be represented as ordered ATOMS-V1 subglyph components; recurring ordered sequences form structural frames; a frozen frame with a variable slot reappears in held-out folios using only previously observed slot values.

### Proposed Panel Flow

```text
original ink
    ->
ATOMS-V1 annotated strokes
    ->
ordered subglyph sequence
    ->
fixed structural frame + variable slot
    ->
development corpus: empty / k:1 / l:1
    ->
f2r: empty / k:1 / l:1
    ->
f2v: k:1
    ->
new substitution-slot values: 0
```

### Required Visual Elements

- One manuscript crop showing an example member of Family A.
- ATOMS-V1 stroke overlay for that crop.
- The corresponding ordered sequence:

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
```

- A highlighted slot `X`.
- Slot value counts:

```text
DISCOVERED IN DEVELOPMENT

empty x7
k:1   x10
l:1   x8

INITIAL HELD-OUT FOLIO - f2r

empty x3
k:1   x3
l:1   x1
new values x0

PROSPECTIVE FOLIO - f2v

empty x0
k:1   x4
l:1   x0
new values x0
```

### Claim Boundary

This figure may claim structural recurrence and restricted slot reuse.

It must not claim:

- translation;
- phonetic value;
- semantic value;
- that Family A is a word, morpheme, or linguistic form;
- that ATOMS-V1 is the only possible representation.

### Notes

- Introduce "molecule" only after showing that it means an operational ordered subglyph unit.
- Prefer labels such as "ordered subglyph sequence", "structural frame", and "slot" in the main visual.

## Figure 2. Experimental Timeline and Freeze Logic

### Purpose

Show why the main result is not a retrospective fit to the later folio.

### Central Message

The strongest V1 test is temporal: GRAMMAR-V1 was frozen before `f2v` was labeled and evaluated.

### Proposed Timeline

```text
ATOMS-V1 freeze
    ->
initial held-out evaluation on f2r
    ->
GRAMMAR-V1 induction from f1r, f1v, f47v
    ->
GRAMMAR-V1 freeze and public archive
    ->
f2v annotation
    ->
prospective f2v evaluation without learning
    ->
REPRODUCIBLE-RELEASE-V1
```

### Required Visual Elements

- Horizontal timeline.
- Clear distinction between development/training folios and held-out folios.
- Separate visual status for:
  - initial held-out validation: `f2r`;
  - stronger prospective validation: `f2v`.
- Freeze markers for ATOMS-V1, GRAMMAR-V1, and REPRODUCIBLE-RELEASE-V1.

### Claim Boundary

This figure may claim sequence of operations and freeze-before-test design.

It must not imply that all future folios are already predicted or that GRAMMAR-V1 is complete.

## Figure 3. Coverage Versus Compatibility

### Purpose

Prevent misreading `8/19` or `7/19` as model accuracy, and prevent overreading `8/8` or `7/7` as if all 19 frozen families occurred in each folio.

### Central Message

Unobserved frozen families are not contradictions. The compatibility test applies only to families whose skeletons appear in the held-out folio.

### Proposed Matrix Layout

```text
FROZEN FAMILIES: 19

f2r

observed:        ########-----------
not encountered: 8 observed / 11 not encountered

among the 8 observed:

check check check check check check check check

8 used only known slot values
0 introduced new values

f2v

observed:        #######------------
not encountered: 7 observed / 12 not encountered

among the 7 observed:

check check check check check check check

7 used only known slot values
0 introduced new values
```

### Required Visual Elements

- A 19-cell matrix per folio showing observed versus not encountered frozen families.
- A separate compatibility row showing only the observed/evaluable families.
- One explicit column or badge for new substitution-slot values.

### Claim Boundary

This figure may claim perfect compatibility among evaluable substitution families in `f2r` and `f2v`.

It must not claim perfect prediction of every frozen family in every folio.

## Figure 4. Optional Families and Reported Novelty

### Purpose

Show that V1 reports optional-family novelty instead of hiding it.

### Central Message

The substitution-slot result has zero new values in both held-out folios, while optional-family analysis reports two new optional values in `f2v`.

### Required Visual Elements

- Separate substitution-slot result from optional-family result.
- Small table:

```text
f2v optional families observed: 32/55
clean optional families: 30/32
new optional values: 2
```

### Claim Boundary

This figure may show methodological transparency.

It must not frame optional novelty as failure of substitution-slot compatibility.

## Figure 5. ATOMS-V1 Inventory and Example Snapshots

### Purpose

Make the 16-symbol inventory visually auditable.

### Central Message

ATOMS-V1 is a fixed visual-stroke inventory for this release, not a hidden private alphabet.

### Required Visual Elements

- 16-symbol table.
- Representative snapshot or trace for each symbol.
- Count from the current frozen/current documented inventory where appropriate.
- Note that variants remain structural/visual labels.

### Claim Boundary

This figure may show the label inventory and representative visual examples.

It must not imply that the snapshots alone prove linguistic function.

## Figure 6. Public Verifiability Path

### Purpose

Show what a reader can inspect directly and which commands currently belong to
maintainer replay rather than certified external reproduction.

### Required Visual Elements

- Repository path or link placeholder.
- Tag: `reproducible-release-v1`.
- Maintainer replay command:

```bash
cd GrammarDiscoveryLab
npm.cmd run validate
```

- Expected output:

```text
f2r: 8/8 observed substitution families clean; new slot values=0
f2v: 7/7 observed substitution families clean; new slot values=0
```

### Claim Boundary

This figure may claim that the release artifacts, expected outputs, commits, and
tags are publicly inspectable.

It must not claim clean-clone reproducibility or independent replication until an
external reviewer runs and verifies the process.

## Priority Order for the First Draft

1. Figure 1: from ink to frozen slot reuse.
2. Figure 2: experimental timeline and freeze logic.
3. Figure 3: coverage versus compatibility.
4. Figure 4: optional families and reported novelty.
5. Figure 5: ATOMS-V1 inventory and example snapshots.
6. Figure 6: reproducibility path.

Figure 1 explains what the project found. Figure 2 explains why the result is not a retrospective adjustment.

## Drafting Guardrails

- Do not use visual design to overstate the result.
- Do not hide unobserved families.
- Do not hide optional-family novelty.
- Do not present ATOMS as letters, phonemes, morphemes, or semantic units.
- Do not use manuscript imagery unless provenance and image-use status are handled explicitly.
