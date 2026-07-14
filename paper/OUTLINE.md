# VoynichLab V1 - Preprint Outline

Status: planning document, not manuscript prose.

Evidence rule: every future statement must remain within the boundaries defined in `paper/CLAIMS.md`.

Working title:

> A Subglyph Representation of the Voynich Manuscript Reveals Structural Frames with Restricted Internal Variation

## 1. Abstract

- State the problem: conventional Voynich transcriptions generally represent complete glyphs or glyph-like units, while potentially meaningful internal graphical structure may be compressed or obscured.
- State the method: VoynichLab represents recurring visible stroke components using the frozen 16-symbol ATOMS-V1 inventory.
- State the experiment: GRAMMAR-V1 was induced only from `f1r`, `f1v`, and `f47v`, then evaluated without learning new rules on held-out folios `f2r` and `f2v`.
- State the principal result:
  - In `f2r`, all 8 observed substitution families used only frozen slot values.
  - In `f2v`, all 7 observed substitution families used only frozen slot values.
  - No new substitution-slot values appeared in either held-out folio.
- State the limitation: the corpus is manually annotated by the model developer, remains small, and does not establish linguistic interpretation or decipherment.
- State the later prospective representation result: after the ATOMS/EVA comparison protocol was publicly preregistered, ATOMS again outperformed EVA on `f3r` under the frozen primary local-context metric.

## 2. Introduction

### 2.1 The Voynich Transcription Problem

- Introduce the manuscript and the role of transcription in computational analysis. [CITATION NEEDED]
- Explain why transcription choices affect downstream statistical structure. [CITATION NEEDED]

### 2.2 Why Complete Glyphs May Not Be the Only Useful Analytical Units

- Motivate subglyph analysis without claiming that conventional glyph units are invalid.
- Present the possibility that internal graphical structure may carry reproducible constraints.

### 2.3 Subglyph Decomposition as a Testable Representation

- Frame ATOMS-V1 as a representation to test, not as a decipherment.
- Emphasize freeze, reproducibility, and held-out evaluation.

### 2.4 Research Question

Can recurrent structural frames and restricted internal variation learned from a development corpus generalize to held-out folios?

### 2.5 Contributions

- A frozen 16-symbol ATOMS-V1 subglyph representation.
- A frozen GRAMMAR-V1 set of ordered subglyph structural families induced from a development corpus.
- A held-out evaluation on `f2r` and `f2v`.
- A matched regional ATOMS/EVA representation comparison.
- A preregistered prospective ATOMS/EVA replication on `f3r`.
- A reproducible validation pipeline with expected results and checksums.
- A bounded interpretation separating structural results from linguistic or semantic claims.

## 3. Related Work

### 3.1 EVA and Conventional Voynich Transcription

- Describe EVA and its role in Voynich studies. [CITATION NEEDED]
- Discuss conventional glyph-level or glyph-like transcription practices. [CITATION NEEDED]

### 3.2 Statistical Structure in Voynichese

- Summarize prior statistical observations about Voynichese. [CITATION NEEDED]
- Avoid claiming that V1 resolves these observations.

### 3.3 Word-Boundary and Glyph-Boundary Uncertainty

- Discuss the uncertainty of visual word boundaries and glyph segmentation. [CITATION NEEDED]

### 3.4 Graphical, Paleographic, and Computational Approaches

- Situate VoynichLab among graphical and computational approaches. [CITATION NEEDED]
- Do not invent citations before a dedicated literature review.

## 4. Data

### 4.1 Manuscript Image Source

- Identify the manuscript image source and acquisition path. [CITATION NEEDED]
- State any image-use and provenance caveats.

### 4.2 Folio Selection

- Explain the initial folio scope and why it is limited.
- Avoid implying full-manuscript coverage.

### 4.3 Development Corpus

- Development folios: `f1r`, `f1v`, `f47v`.
- These folios were used to induce GRAMMAR-V1.

### 4.4 Held-Out Evaluation Folios

- Held-out evaluation folios: `f2r`, `f2v`.
- These folios were excluded from grammar induction.

### 4.5 Corpus Size and Current Scope

- Report corpus size only from frozen/reproducible artifacts.
- Do not add unsupported numerical claims.

### 4.6 Image-Use and Data-Provenance Considerations

- Separate derived labels and coordinates from manuscript image rights.
- State that provenance and reuse policies must be handled explicitly.

## 5. ATOMS-V1 Representation

### 5.1 Motivation

- Motivate visible stroke-component annotation as a testable representation.

### 5.2 Frozen 16-Symbol Inventory

- Present the ATOMS-V1 inventory.
- Refer to `GrammarDiscoveryLab/docs/ATOMS-V1-SPECIFICATION.md`.

### 5.3 Physical Stroke Annotation

- Explain manual stroke annotation at a high level.
- Avoid implying automated detection in V1.

### 5.4 Particles, Molecular Units, and Terminology

- Define atom, particle, molecule, molecule signature, slot, substitution family, optional family.
- Make clear that these are structural labels.

### 5.5 Segmentation Protocol

- Describe how labeled strokes are grouped into particles and molecules.
- Flag that detailed visual protocol belongs in methods or appendix.

### 5.6 Ambiguous Cases

- Discuss ambiguity as a limitation and future validation target.
- Do not hide manual judgment.

### 5.7 Freeze and Version History

- State that ATOMS-V1 and GRAMMAR-V1 are frozen V1 artifacts.
- Future revisions must use new version identifiers.

## 6. Grammar Discovery

### 6.1 Molecular Signatures

- Define molecular signatures as ordered ATOMS token sequences.

### 6.2 Recurrent Structural Frames

- Explain structural frames as repeated molecule skeletons.

### 6.3 Substitution Families

- Define same-length signatures sharing all positions except one slot.

### 6.4 Restricted Slots

- Define known slot values and new slot values.
- Explain why held-out reuse of known values is the central V1 test.

### 6.5 Optional-Component Candidates

- Define optional-component candidates as base/expanded pairs differing by one inserted token.
- Keep optional results separate from substitution-slot results.

### 6.6 Priority Family A

Define:

```text
e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1
```

with:

```text
X in {empty, k:1, l:1}
```

- Explain that these are structural labels, not linguistic interpretations.
- Report Family A behavior in held-out folios in the Results section.

## 7. Experimental Design

### 7.1 Training Corpus

- Training/development folios: `f1r`, `f1v`, `f47v`.

### 7.2 Held-Out Folios

- Held-out folios: `f2r`, `f2v`.
- The two held-out folios differ in evidential status.
- `f2r` served as the initial held-out evaluation folio during V1 development.
- `f2v` was labeled and evaluated only after GRAMMAR-V1 had been frozen and publicly archived. It therefore constitutes the stronger prospective evaluation of the frozen grammar.

### 7.3 GRAMMAR-V1 Freeze

- Explain that GRAMMAR-V1 was frozen before held-out validation.
- Reference frozen snapshot and tag.

### 7.4 Prospective Evaluation Procedure

- Evaluate held-out molecule signatures against frozen family definitions.
- Do not induce new families during validation.

### 7.5 Definition of an Observed Family

- A frozen family is observed in a held-out folio when at least one held-out molecule matches its skeleton.

### 7.6 Definition of a Known Slot Value

- A held-out slot value is known when it belongs to the frozen family value set.

### 7.7 Definition of a New Slot Value

- A held-out slot value is new when it matches a frozen skeleton but uses a value absent from the frozen family value set.

### 7.8 Reproducible Validation Command

```bash
cd GrammarDiscoveryLab
npm install
npm run validate
```

### 7.9 Versioning and Prevention of Retrospective Rule Modification

- Use frozen snapshots, tags, expected results, and checksums.
- State that later corrections or extensions require V2 identifiers.

### 7.10 Experimental Timeline

- Freeze of ATOMS-V1 before held-out annotation.
- Initial evaluation on `f2r`.
- Induction of GRAMMAR-V1 using only `f1r`, `f1v`, and `f47v`.
- Public freeze of GRAMMAR-V1.
- Annotation of `f2v`.
- Prospective evaluation of frozen GRAMMAR-V1 against `f2v`.
- Publication of REPRODUCIBLE-RELEASE-V1.

### 7.11 Evaluability and Family Coverage

- A frozen family that does not occur in a held-out folio is classified as unobserved, not contradicted.
- Structural compatibility is evaluated only among families whose frozen skeletons are observed in the held-out folio.
- Report family coverage as observed frozen families / total frozen families.
- Report slot compatibility as observed families using only known values / observed families.
- Report new substitution-slot values separately.

### 7.12 Matched ATOMS/EVA Representation Comparison

- Compare ATOMS and EVA over shared manuscript regions rather than assuming exact token identity.
- Use training folios `f1r`, `f1v`, and `f47v`.
- Keep `f2r`, `f2v`, and later `f3r` as evaluation folios.
- Primary comparison metrics:
  - normalized held-out log-loss;
  - top-1 accuracy;
  - unseen-context rate.
- Do not compare raw total code length alone because ATOMS and EVA use different granularities.

### 7.13 Preregistered f3r Prospective Test

- Publicly freeze protocol, model definitions, metrics, and interpretation rules before completing `f3r` annotation.
- Target folio: `f3r`, DatasetCreator `page-007.jpg`.
- Confirm preregistration checksum verification before interpreting the result.
- Confirm published V3 regression verification before interpreting the result.
- Evaluate `f3r` as test-only; do not update training from `f3r`.

## 8. Results

### 8.1 f2r Results

- Family coverage: 8 / 19 frozen substitution families observed.
- 8 observed substitution families.
- 8 observed substitution families with only known values.
- Slot compatibility among evaluable families: 8 / 8.
- 0 new substitution-slot values.

### 8.2 f2v Results

- Family coverage: 7 / 19 frozen substitution families observed.
- 7 observed substitution families.
- 7 observed substitution families with only known values.
- Slot compatibility among evaluable families: 7 / 7.
- 0 new substitution-slot values.

### 8.3 Family A in Held-Out Folios

- Report Family A reuse in `f2r`.
- Report Family A reuse in `f2v`.
- Do not interpret Family A linguistically.

### 8.4 Optional-Family Results

- Report optional-family results separately.
- Report the two new optional values in `f2v` rather than hiding them.

### 8.5 Reproducibility Result

- State that the validation command reproduces the V1 expected results.
- Reference expected-result checksums.

### 8.6 ATOMS/EVA Regional Comparison Results

- Report the V2 regional comparison as exploratory evidence that ATOMS preserved more held-out predictive structure than EVA over aligned regions.
- Report the V3 ablations showing that the ATOMS advantage survived removal of exact regional sequence length.
- Keep alignment limitations explicit.

### 8.7 f3r Prospective Representation Result

- Report `f3r` as the first preregistered prospective replication of the ATOMS/EVA comparison.
- Report primary `MODEL_1` result:
  - ATOMS normalized log-loss: `0.348262`.
  - EVA normalized log-loss: `0.564957`.
  - ATOMS minus EVA: `-0.216696`.
- Report supporting metrics:
  - ATOMS top-1 accuracy: `69.06%`.
  - EVA top-1 accuracy: `55.35%`.
  - ATOMS unseen-context rate: `2.46%`.
  - EVA unseen-context rate: `13.79%`.
  - OOV ATOMS: `0`.
- Report that the automatic classification was `SUPPORTIVE` under frozen rules.

## 9. Discussion

### 9.1 Evidence for Cross-Folio Structural Constraints

- Interpret repeated held-out slot reuse as evidence for structure across folios.

### 9.2 What Restricted Slot Reuse May Indicate

- Discuss restricted graphical or compositional constraints.
- Keep interpretations bounded.

### 9.3 Graphical Versus Linguistic Interpretations

- Present multiple possible origins: graphical, linguistic, scribal, or encoding system.
- Do not privilege a linguistic interpretation without evidence.

### 9.4 Why the Current Result Is Not a Decipherment

- Explicitly separate structure detection from translation.

### 9.5 Alternative Explanations

- Single-annotator bias.
- Representation-induced structure.
- Small sample size.
- Folio proximity.
- Scribal or graphical construction rules.
- Alignment artifacts.
- Family-selection effects.

### 9.6 Local Flow and Boundary Continuity

- Discuss the convergence between null controls, ablations, and the prospective `f3r` result: local context carries substantial transferable signal.
- Introduce boundary-continuity as a future testable hypothesis, not as an established result.
- Do not infer semantic word boundaries from current molecule boundaries.

## 10. Limitations

Derive this section from `GrammarDiscoveryLab/docs/LIMITATIONS.md`.

- Manual single-annotator corpus.
- Need for independent annotation.
- Need for inter-annotator agreement.
- Limited corpus size.
- Label corrections before freeze.
- Image rights and provenance.
- No decipherment, phonetic interpretation, or semantic interpretation.
- No claim that ATOMS-V1 is unique or optimal.

Do not weaken or omit known limitations.

## 11. Future Work

### 11.1 Independent Annotation

### 11.2 Inter-Annotator Agreement

### 11.3 Preregistered Multi-Folio Evaluation

### 11.4 Automated or Assisted Atom Detection

### 11.5 Cross-Section and Cross-Scribe Analysis

### 11.6 Statistical Null Models

### 11.7 Functional Interpretation of Restricted Slots

### 11.8 Boundary-Continuity Testing

- Test whether ATOMS particle-flow patterns continue across molecule boundaries.
- Compare molecule-local windows against row-stream windows.
- Use observations such as `img7-m50` only as motivation, not as training targets for the result.

## 12. Conclusion

- Restate only the central V1 claim.
- Do not claim decipherment.
- Do not claim language identification.
- Do not claim phonetic values.
- Do not claim semantic interpretation.
- Do not claim proof that visual spaces are not word boundaries.
- Do not claim proof that ATOMS-V1 is the unique or optimal representation.

## 13. Reproducibility and Open Science

- Repository.
- Frozen commits and tags.
- `reproducible-release-v1`.
- Validation command.
- Expected results.
- Checksums.
- Open Science Statement.

## 14. Appendices

### Appendix A. ATOMS-V1 Inventory

### Appendix B. Family A

### Appendix C. Frozen Substitution-Family Definitions

### Appendix D. Validation Tables

### Appendix E. Version and Freeze Timeline

## Drafting Guardrails

- Do not add unsupported numerical claims.
- Do not invent references.
- Do not reinterpret structural labels linguistically.
- Do not move hypotheses into demonstrated results without a reproducible experiment.
