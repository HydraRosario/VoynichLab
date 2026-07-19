# VoynichLab V1 - Literature Map

Status: bibliography-planning document, not Related Work prose.

Evidence rule: do not cite a source because it repeats a claim. Track each claim to the primary source whenever possible.

Purpose: locate VoynichLab V1 relative to prior work on Voynich transcription, glyph structure, word/glyph boundaries, statistical regularity, and generative explanations.

## Research Questions

1. How does EVA define its units, and what warnings did its authors or maintainers give about segmentation?
2. Which works studied internal structure of Voynich glyphs or glyph composition?
3. Which works investigated dependencies between words, visual boundaries, or positions within words/lines?
4. Which generative, linguistic, cryptographic, or graphical models attempted to explain Voynich regularity?
5. Is there an existing comparable method of subglyph decomposition validated out of sample?

## Literature Matrix

| Source | Year | Publication venue | Publication status | Main claim | Data/transcription | Evidence used in VoynichLab | Relevance to VoynichLab | Agreement | Difference | Citation verified? |
|---|---:|---|---|---|---|---|---|---|---|---|
| Beinecke Rare Book & Manuscript Library, "Voynich Manuscript" | current official page | Beinecke/Yale collection website | Official collection page | MS 408 is an undeciphered codex held by Beinecke/Yale; page summarizes sections, history, and links to images/catalog. | Manuscript object and institutional metadata. | Manuscript identity, institutional holding, image/catalog provenance, and undeciphered status. | Primary provenance/image-source anchor for the Data section. | Agrees that the manuscript remains undeciphered and interpretation is unsettled. | Does not provide computational transcription or subglyph model. | Yes: https://beinecke.library.yale.edu/collections/highlights/voynich-manuscript |
| Zandbergen, "Text Analysis - Transliteration of the Text" | current web page, historical overview | Author-maintained technical documentation and historical overview | Web technical documentation; not a peer-reviewed article | Transliteration converts handwritten Voynich text into computer-readable symbols; it is distinct from translation and does not imply pronunciation. EVA was designed by Landini and Zandbergen with Guy's contributions. | Historical transliteration systems; EVA; Takahashi; interlinear files. | EVA is a transliteration convention and does not settle semantic unit boundaries. | Directly relevant to describing EVA and its segmentation caveats. | VoynichLab is also a representation layer and not a translation. | VoynichLab is not a roman transliteration of complete glyph units; it tests a subglyph stroke inventory. | Yes: https://www.voynich.nu/transcr.html |
| Zandbergen, EVA discussion within "Text Analysis - Transliteration of the Text" | current web page | Author-maintained technical documentation and historical overview | Web technical documentation; not a peer-reviewed article | EVA is not attempting to identify semantic units; analysts must later decide which combinations should be considered units. It also notes subjectivity in distinguishing similar shapes and word spaces. | EVA and related transliteration conventions. | Transcription/segmentation choices are methodological, not neutral. | Strong support for treating VoynichLab as a different testable representation rather than a simple "correction" of EVA. | Agrees that transliteration decisions do not automatically define meaningful units. | VoynichLab freezes a different representation and evaluates held-out structural behavior. | Yes: https://www.voynich.nu/transcr.html |
| Newby, "A Functional Morphological-Positional Model for the Voynich Manuscript" | 2026 | Medium | Public web essay; not verified as peer-reviewed | Proposes a component-based morphological-positional model where sub-word components such as `qo-`, `-aiin`, and gallows variants behave according to position, local environment, and broader structural layers. | EVA-like transliteration-level forms; component and positional analysis. | Direct conceptual predecessor for internal components, position, restricted substitution, and predictive framing. | Very close antecedent for the hypothesis class: component-level Voynichese morphology with positional behavior. | Agrees that Voynichese may contain internal components, position-dependent roles, and restricted variation inside larger forms. | VoynichLab physically annotates visible strokes, freezes an ATOMS inventory, induces structural families automatically, withholds folios, freezes GRAMMAR-V1, and runs reproducible held-out/prospective validation. | Yes for web article metadata/content: https://medium.com/@orleansphoteauxllc/a-functional-morphological-positional-model-for-the-voynich-manuscript-fc08bd82104e |
| Edwards, "Voynich Reconsidered: The Most Mysterious Manuscript in the World" | current publisher listing; publication year pending direct book check | Schiffer Publishing | Published commercial book | Publisher describes a mathematical perspective and strategy for extracting meaning if meaning exists, with systematic analysis of glyphs and illustrations. | Unknown until direct examination of the book. | Potential broad mathematical/systematic predecessor; technical comparison pending. | Priority source because it may overlap with mathematical modeling or systematic glyph analysis. | Unknown until the book is examined directly. | No technical comparison should be made from the publisher blurb alone. | Yes for title/author/publisher listing only: https://schifferbooks.com/products/voynich-reconsidered |
| Reddy & Knight, "What We Know About The Voynich Manuscript" | 2011 | ACL LaTeCH workshop proceedings | Published workshop paper | Surveys computational knowledge about the Voynich Manuscript. | Computational analysis using existing transcriptions. | Existing computational work studies Voynich structure without claiming decipherment. | Useful baseline for statistical and NLP framing. | Agrees that computational analysis can test structural properties without decipherment. | Does not propose ATOMS-style manual subglyph annotation or frozen out-of-sample slot validation. | Yes: https://aclanthology.org/W11-1511/ |
| Montemurro & Zanette, "Keywords and Co-Occurrence Patterns in the Voynich Manuscript: An Information-Theoretic Analysis" | 2013 | PLOS ONE | Peer-reviewed journal article | Long-range word distribution and co-occurrence patterns are compatible with real language sequences and support structured content. | Public EVA transcription; word/token-level information-theoretic analysis. | Voynich token distributions exhibit nontrivial long-range organization. | Relevant to statistical structure and topic-like organization in Voynichese. | Agrees that structure can be studied without decipherment. | Works at word/token level, not at manually annotated subglyph structural frames; does not freeze a subglyph grammar for prospective folio testing. | Yes: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0066344 |
| Amancio et al., "Probing the statistical properties of unknown texts: application to the Voynich Manuscript" | 2013 | PLOS ONE / arXiv | Journal article; arXiv page verified, journal metadata still to verify in final pass | Uses statistical physics/network/intermittency measures to test unknown texts; reports Voynich compatibility with natural-language-like structure and incompatibility with random texts. | Text-level and word-level statistical measurements. | Non-semantic statistical methods can compare unknown text structure to known corpora and null models. | Relevant to prior statistical evidence for structure without translation. | Agrees with the principle of non-semantic structural testing. | Does not address subglyph segmentation or frozen slot families. | Partly: arXiv verified: https://arxiv.org/abs/1303.0347 |
| Lindemann & Bowern, "Character Entropy in Modern and Historical Texts: Comparison Metrics for an Undeciphered Manuscript" | 2020 / updated 2026 | arXiv | Preprint/corpus paper; publication status pending verification | Voynichese has unusually constrained character placement within words; conditional entropy remains distinct under transcription and comparison manipulations. | Voynich transcriptions partitioned by Currier language, scribal hand, and transcription system; multilingual comparison corpora. | Voynich character placement is unusually constrained relative to comparison corpora. | Highly relevant to positional constraints, transcription systems, and glyph compositionality. | Agrees that character placement is strongly constrained and that transcription choices matter. | Still operates on transcription-level characters rather than manually segmented ATOMS strokes with held-out grammar validation. | Yes for arXiv: https://arxiv.org/abs/2010.14697 |
| Sterneck, Polish & Bowern, "Topic Modeling in the Voynich Manuscript" | 2021 | arXiv | Preprint / workshop status to verify | Topic models over Voynich pages align with illustration and paleographic clusters, supporting meaningful structure. | Voynich page-level text models; LDA/LSA/NMF. | Computational structure may align with manuscript organization. | Relevant to cross-page organization and topic/section structure. | Agrees that computational structure may align with manuscript organization. | Page-topic analysis, not subglyph sequence grammar. | Yes for arXiv: https://arxiv.org/abs/2107.02858 |
| Timm, "How the Voynich Manuscript was created" | 2014 / revised 2015 | arXiv | Preprint; not verified as peer-reviewed | Proposes a generation method based on similarly spelled words and self-copying/modification. | Voynich word similarity and text generation analysis. | Local similarity can arise under nonsemantic copying/modification models. | Important alternative explanation: structural regularity may be generated graphically or mechanically without semantic language. | Agrees that local structural constraints and similar forms matter. | VoynichLab does not claim meaningless generation or decipherment; it tests frozen structural frames and slot reuse at subglyph level. | Yes for arXiv: https://arxiv.org/abs/1407.6639 |
| Timm & Schinner, "A possible generating algorithm of the Voynich manuscript" | 2019 | Cryptologia | Journal article status likely, primary source not yet verified | Proposes a self-citation/generation algorithm that can reproduce statistical features of the manuscript. | Word-level generation model. | Generative mechanisms can create Voynich-like statistical structure without semantic language. | Key alternative explanation for restricted structure. | Agrees that generative mechanisms must be considered. | Needs direct source verification before manuscript citation. | No: find accessible DOI/official page. |
| Davis, "How Many Glyphs and How Many Scribes? Digital Paleography and the Voynich Manuscript" | 2020 | Manuscript Studies | Journal article; peer-review status to verify | Digital paleography identifies multiple scribal hands in the manuscript. | Paleographic/glyph shape analysis. | Scribal-hand variation is a possible confound and future stratification variable. | Relevant to graphical variation, scribal hands, and whether ATOMS patterns hold across hands. | Agrees that glyph shape variation is analyzable and may be structured. | Focuses on scribal hands, not ATOMS grammar or out-of-sample slot validation. | No: source located indirectly; fetch primary article. |
| Rugg & Taylor, "Hoaxing statistical features of the Voynich Manuscript" | 2016 | Cryptologia | Journal article status likely, primary source not yet verified | Argues that grille/hoax methods can reproduce larger-scale statistical features. | Generative hoax model. | Statistical structure alone is not sufficient to establish linguistic meaning. | Important null/alternative family for Discussion. | Agrees that statistical structure alone is insufficient. | Does not test a stroke-level frozen representation. | No: verify primary page/DOI. |
| Landini, "Evidence of linguistic structure in the Voynich manuscript using spectral analysis" | 2001 | Cryptologia | Journal article status likely, primary source not yet verified | Spectral/statistical analysis reports linguistic-like structure. | Existing Voynich transcriptions. | Earlier computational work reported structure in Voynichese. | Relevant to early computational evidence for structure. | Agrees that non-semantic methods can detect structure. | Not a subglyph held-out validation framework. | No: verify primary page/DOI. |
| Stolfi, "A prefix-midfix-suffix decomposition of Voynichese words" | 1997 | Web research note | Primary source pending verification | Proposes decomposition of Voynichese words into prefix/midfix/suffix-like components. | Voynichese word forms. | Internal word structure was studied before VoynichLab. | Very relevant predecessor for internal word structure and compositional decomposition. | Agrees that Voynichese units may have internal structure. | Word-string decomposition, not visual-stroke atom annotation or frozen out-of-sample grammar. | No: find and verify primary UNICAMP page. |
| Guy / Frogguy transliteration alphabet | 1991 / summarized by Zandbergen | Transliteration system / tutorial | Primary source pending verification; Zandbergen summary verified | Represents strokes/minims more closely than many complete-character alphabets; influenced EVA. | Stroke/minim-like transliteration. | Internal graphical components were represented before VoynichLab. | Potentially closest historical precedent to subglyph decomposition. | Agrees that smaller graphical components can be represented. | VoynichLab uses manually painted physical ATOMS and validates induced structural frames prospectively. | Partly: summarized by Zandbergen; find Guy primary document. |

## Priority Categories

### Priority A - Needed Before Writing Related Work

- Tracy Newby's 2026 morphological-positional model, because it is a direct conceptual predecessor for components, positional behavior, substitution, and predictive framing.
- Robert H. Edwards, `Voynich Reconsidered`, because it may contain a broad mathematical/systematic predecessor; technical comparison requires direct examination of the book, not only the publisher page.
- EVA original specification/publication, if separate from later documentation.
- Jacques Guy / Frogguy primary tutorial or specification.
- Stolfi prefix-midfix-suffix primary source.
- Lindemann & Bowern entropy/corpus work, including publication status.
- Davis 2020 primary article.
- Timm & Schinner 2019 primary article/DOI.
- Rugg & Taylor 2016 primary article/DOI.

### Priority B - Needed Before First Complete Preprint

- Landini 2001 primary article/DOI.
- Currier papers on languages/hands.
- D'Imperio's synthesis and seminar materials.
- Bowern & Lindemann overview article metadata.

### Priority C - Later Expansion

- Specific decipherment proposals.
- General manuscript history beyond what is necessary for provenance.
- Media reception.
- Secondary models not directly touching transcription, glyph structure, or generative regularity.

## Secondary Explanatory Sources

These sources can guide discovery, motivation, or public-facing context, but they should not anchor technical claims unless the underlying primary sources are identified and cited.

| Source | Role | Use in paper |
|---|---|---|
| Voynich Talk - symbol-role video: https://www.youtube.com/watch?v=5uPrt65oiGY | Discovery aid pointing to academic work on symbol roles, ligatures, and anomalous structure. | Cite the underlying paper or primary source, not the video, for technical claims. |
| Voynich Talk - Zipf video: https://www.youtube.com/watch?v=ciRmkK9Hytg | Conceptual warning that Zipf-like or language-like distributions are weak evidence by themselves. | Trace claims to primary statistical studies before using them in Related Work. |
| Voynich Talk - AI theory video: https://www.youtube.com/watch?v=V_2sOPwAQtw | Methodological and public-discourse context around AI-assisted theories. | Probably omit from technical claims unless it points to specific primary sources. |

## Preliminary Answers to the Five Questions

### 1. EVA Units and Warnings

EVA is a transliteration system, not a translation or semantic analysis. Zandbergen explicitly distinguishes transliteration from transcription/translation and says EVA does not decide semantic units. The EVA discussion also flags subjective decisions about similar shapes and word spaces. This supports framing VoynichLab as a different testable representation rather than as a "correction" that makes EVA useless in all contexts.

### 2. Internal Glyph Structure

The strongest preliminary leads are:

- Tracy Newby's morphological-positional model, because it explicitly proposes sub-word components, positional behavior, substitution, layered organization, and predictive tests.
- Frogguy / Jacques Guy, because it represented strokes or minims more directly than complete-character alphabets.
- Stolfi's prefix-midfix-suffix work, because it decomposed Voynichese word forms internally.
- Davis 2020 and Lindemann/Bowern, because they discuss glyph shape variation, scribal hands, transcription systems, and character placement constraints.

These need deeper verification before the Related Work section is written.

### 3. Dependencies and Boundaries

Relevant prior work includes Reddy & Knight, Montemurro & Zanette, Amancio et al., Lindemann & Bowern, and Stolfi. The key difference to protect for VoynichLab is that V1 tests restricted internal variation in frozen subglyph structural frames, not just word-level frequency, co-occurrence, entropy, or similarity.

### 4. Generative / Linguistic / Cryptographic / Graphical Models

Important alternative explanations include:

- natural-language-like statistical structure;
- topic/section organization;
- self-citation or copying/modification generation;
- grille/hoax generation;
- scribal or graphical construction rules;
- encoding/cipher hypotheses.

VoynichLab V1 should not pick one interpretation yet. The Discussion should state that restricted slot reuse is compatible with several classes of explanation.

### 5. Comparable Out-of-Sample Subglyph Validation

No verified source in this first pass has shown the same combination of:

```text
manual visible-stroke inventory
-> frozen subglyph units
-> induced structural frames
-> held-out folio validation
-> prospective post-freeze folio validation
```

This is a tentative novelty claim and must remain marked as tentative until the full literature review is complete.

The Newby article changes the novelty boundary. VoynichLab V1 must not claim to be the first proposal that Voynichese has internal components, positional behavior, restricted substitutions, or layered morphology. The defensible distinction is methodological: VoynichLab presents a physically annotated and versioned implementation of that hypothesis class, followed by formal induction of restricted slots and frozen evaluation on held-out and prospective folios.

## Citation Rules for the Paper

- Prefer primary papers, official collection pages, or author-maintained technical pages.
- Do not cite Wikipedia in the manuscript except as a discovery aid.
- Do not cite media coverage for technical claims unless discussing public reception.
- Mark publication venue and status explicitly.
- Distinguish "source verified" from "claim evaluated."
- Never cite a source for a stronger claim than the source actually makes.
- Do not cite claimed decipherments as evidence unless the paper discusses failed or contested decipherment claims.

## Sources Still Needed

- Primary source for Jacques Guy's Frogguy alphabet/tutorial.
- Direct examination of Robert H. Edwards, `Voynich Reconsidered`, including table of contents and relevant chapters.
- Primary academic sources behind the three Voynich Talk videos listed above.
- Primary source for Stolfi's prefix-midfix-suffix decomposition.
- Primary article page/DOI for Landini 2001.
- Primary article page/DOI for Rugg & Taylor 2016.
- Primary article page/DOI for Timm & Schinner 2019.
- Primary article page/DOI for Davis 2020.
- Annual Review page or accessible metadata for Bowern & Lindemann's overview article.
- Currier papers and D'Imperio sources for early hand/language distinctions.

## How This Literature Map Should Feed the Paper

- Introduction: use Beinecke/Yale, Zandbergen/EVA, and Reddy-Knight for high-level framing.
- Related Work 3.1: EVA and transliteration history, anchored in Zandbergen and original EVA/Frogguy sources.
- Related Work 3.2: statistical structure, anchored in Reddy-Knight, Montemurro-Zanette, Amancio et al., Lindemann-Bowern.
- Related Work 3.3: boundary/segmentation uncertainty, anchored in Zandbergen, Stolfi, and later transcription-system discussions.
- Related Work 3.4: generative alternatives, anchored in Rugg/Taylor, Timm/Schinner, Timm, and possibly Zandbergen's Cardan grille analysis.
- Discussion: use alternative explanations to limit V1 claims instead of overstating the result.
