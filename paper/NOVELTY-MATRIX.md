# VoynichLab V1 - Novelty Matrix

Status: working comparison matrix, not a priority claim.

Evidence rule: every `Yes`, `No`, `Partial`, or `Unknown` must be tied to a cited source or explicitly marked as pending verification. Do not turn this into a novelty claim until Priority A sources in `paper/LITERATURE.md` are verified.

Legend:

- `Yes`: supported by currently verified source.
- `Partial`: source supports part of the feature, but not the full VoynichLab V1 formulation.
- `No`: currently verified source indicates the feature is not present or not part of that method.
- `Unknown`: no primary source verified yet.
- `V1`: supported by VoynichLab release artifacts.

## Matrix

| Feature | EVA | Frogguy | Stolfi | Newby 2026 | Edwards | Lindemann/Bowern | Timm | VoynichLab V1 |
|---|---|---|---|---|---|---|---|---|
| Represents internal graphical components | Partial - EVA decomposes some shapes such as `in`/`iin`, but is not a semantic-unit model. Source: Zandbergen. | Partial - summarized as representing strokes/minims. Source: Zandbergen summary; primary Guy source pending. | Unknown - primary Stolfi source pending; likely word-internal, not graphical. | Partial - explicitly proposes sub-word/embedded components, but not a manually painted physical ATOMS inventory. Source: Newby 2026. | Unknown - direct book examination pending. | Partial - discusses glyph compositionality and transcription systems. Source: Lindemann/Bowern arXiv. | Unknown - the currently reviewed Timm source supports a word-similarity model, but this feature has not been established. Source: Timm arXiv. | Yes - fixed visible-stroke ATOMS inventory. Source: VoynichLab V1 artifacts. |
| Uses a fixed visual inventory | Partial - EVA defines a transliteration alphabet, but it is a transliteration inventory, not a manually painted visual inventory. Source: Zandbergen. | Unknown - primary Frogguy source pending. | Unknown - no primary source verified yet for this feature. | Unknown - no verified frozen physical visual inventory in the article. Source: Newby 2026. | Unknown - direct book examination pending. | No - uses transcription/corpora rather than proposing a new visual inventory. Source: Lindemann/Bowern arXiv. | Unknown - no primary source verified yet for this feature. | Yes - ATOMS-V1 16-symbol inventory. Source: `GrammarDiscoveryLab/docs/ATOMS-V1-SPECIFICATION.md`. |
| Manually annotates physical strokes | Unknown - the currently reviewed EVA documentation describes transliteration, but this pass has not established a comparable manual physical-stroke annotation workflow. Source: Zandbergen. | Unknown - may represent strokes/minims, but manual physical annotation pipeline not verified. | Unknown - no primary source verified yet for this feature. | Unknown - analysis appears component/transliteration based, but this pass has not established stroke-paint annotation. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown - no verified comparable workflow in the currently reviewed source. | Unknown - no verified comparable workflow in the currently reviewed source. | Yes - DatasetCreator manual stroke labeling and ATOMS export. Source: VoynichLab workflow/release docs. |
| Preserves explicit linkage from manuscript ink to subglyph labels | Unknown - the currently reviewed EVA documentation describes transliteration, but not an auditable ink-to-label annotation chain. Source: Zandbergen. | Unknown - primary Frogguy source pending. | Unknown - primary Stolfi source pending. | Unknown - no verified ink-linked annotation chain in the article. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown - no verified comparable workflow in the currently reviewed source. | Unknown - no verified comparable workflow in the currently reviewed source. | Partial - the research workflow preserves ink-linked manual annotations locally through DatasetCreator, while the current reproducible release primarily exposes derived ATOMS/GRAMMAR sequences and reports. Source: VoynichLab release artifacts and local workflow. |
| Defines recurrent structural frames | Unknown - no comparable structural-frame method established from the currently reviewed EVA source. | Unknown. | Partial - reported prefix/midfix/suffix structure, primary source pending. | Partial - proposes larger forms and layered organization with embedded components. Source: Newby 2026. | Unknown - direct book examination pending. | Partial - character placement constraints and positional predictability. Source: Lindemann/Bowern arXiv. | Partial - repeated/similar word generation model. Source: Timm arXiv. | Yes - GRAMMAR-V1 substitution and optional families. Source: `GrammarDiscoveryLab/frozen/GRAMMAR-V1-2026-07-13`. |
| Models restricted internal slots | Unknown - no comparable restricted-slot model established from the currently reviewed EVA source. | Unknown. | Unknown - primary source pending before classification. | Partial - discusses gallows substitution and constrained component behavior, but not frozen slot-value families. Source: Newby 2026. | Unknown - direct book examination pending. | Partial - constrained positions, but not frozen slot-value families. Source: Lindemann/Bowern arXiv. | Partial - generative local variation, but not frozen slot families. Source: Timm arXiv. | Yes - frozen substitution families with known slot values. Source: `GrammarDiscoveryLab/frozen/GRAMMAR-V1-2026-07-13`. |
| Reports predictive tests | Unknown. | Unknown. | Unknown. | Partial - article reports predictions and pass/fail results, but no verified public train/test freeze equivalent. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown. | Unknown. | Yes - frozen validation reports for f2r and f2v. Source: `GrammarDiscoveryLab/README.md`. |
| Freezes representation before evaluation | Unknown. | Unknown. | Unknown. | Unknown - article is versioned, but no verified freeze-before-test protocol. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown - corpus/code exist, but freeze-before-heldout design not verified. | Unknown. | Yes - ATOMS/GRAMMAR V1 frozen before later validation. Source: tags `grammar-v1`, `reproducible-release-v1`. |
| Uses held-out folios | Unknown. | Unknown. | Unknown. | Unknown - no verified held-out folio split equivalent. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown - comparisons use corpora; held-out folio design not yet verified. | Unknown. | Yes - `f2r` and `f2v` held out from GRAMMAR-V1 induction. Source: `GrammarDiscoveryLab/README.md`. |
| Includes a post-freeze prospective test | Unknown. | Unknown. | Unknown. | Unknown - no verified post-freeze prospective folio evaluation. Source: Newby 2026. | Unknown - direct book examination pending. | Unknown. | Unknown. | Yes - `f2v` evaluated after GRAMMAR-V1 freeze. Source: `GrammarDiscoveryLab/frozen/REPRODUCIBLE-RELEASE-V1/MANIFEST.md`. |
| Publishes public artifacts and maintainer replay commands | Unknown. | Unknown. | Unknown. | Unknown - no comparable public artifact/replay trail verified from article. Source: Newby 2026. | Unknown - direct book examination pending. | Partial - arXiv notes corpus/code availability, but not the same artifact/replay structure. Source: Lindemann/Bowern arXiv. | Unknown. | Yes - reports, registry entries, checksums, tags, and maintainer replay commands are published; clean-clone certification remains pending. Source: `GrammarDiscoveryLab/README.md` and `docs/PUBLIC-VERIFIABILITY.md`. |

## Feature-by-Feature Notes

### Represents Internal Graphical Components

Current evidence does not support claiming that VoynichLab is the first internal decomposition of Voynich glyphs. EVA/Frogguy history and Stolfi's internal decomposition must be treated as close antecedents.

The likely V1 contribution is not decomposition alone, but decomposition plus frozen structural validation.

### Uses a Fixed Visual Inventory

EVA has a fixed transliteration alphabet, but it was designed for computer-readable transliteration. VoynichLab's ATOMS-V1 is a fixed manually annotated visual-stroke inventory. This distinction must be phrased carefully.

### Manually Annotates Physical Strokes

This may be a stronger VoynichLab-specific feature, but it must not be described as unprecedented until Guy/Frogguy and other stroke-theory sources are verified.

### Preserves Explicit Linkage From Manuscript Ink to Subglyph Labels

This is potentially a deep methodological distinction because the research workflow can move from manuscript image, to painted physical instance, to ATOMS label, to sequence, to structural family, to statistical result. However, the current reproducible release primarily exposes derived ATOMS/GRAMMAR sequences and validation reports rather than the full public ink-linked annotation archive. Until those snapshots, masks, coordinates, or equivalent audit artifacts are published, the V1 cell remains `Partial`, not `Yes`.

### Defines Recurrent Structural Frames

Stolfi and Timm are especially relevant here. They may reduce or reshape any novelty claim about recurrent internal structure. The safer V1 claim is about frozen structural frames evaluated out of sample.

### Models Restricted Internal Slots

This is currently one of the strongest candidates for V1 novelty, but only in combination with freeze and held-out validation. Prior work on positional constraints should be acknowledged.

### Reports Predictive Tests

Newby reports explicit predictions and pass/fail outcomes, so VoynichLab should not claim predictive framing as new by itself. The stronger distinction is that VoynichLab V1 has frozen artifacts and an executable validation pipeline tied to held-out/prospective folios.

### Newby 2026

Newby is a direct conceptual antecedent for component-level morphology, positional roles, gallows substitution, and predictive framing. This narrows the V1 novelty claim in a good way: VoynichLab V1 should not present itself as the first internal/positional component model of Voynichese.

The defensible distinction is methodological: physical annotation, versioned ATOMS inventory, formal family induction, frozen grammar, held-out/prospective evaluation, and reproducible public execution.

### Edwards

Edwards is listed as `Unknown` across technical features until `Voynich Reconsidered` is examined directly. The Schiffer publisher page verifies the book, author, and broad mathematical/systematic orientation, but it is not enough evidence to classify its method against ATOMS-V1 or GRAMMAR-V1.

Until the book is reviewed, Edwards should be treated as a Priority A possible predecessor, not as evidence for or against novelty.

### Freezes Representation Before Evaluation

This is a methodological claim about VoynichLab's workflow. It depends on commits, tags, manifests, and release artifacts rather than external literature.

### Uses Held-Out Folios

The key distinction is not merely "uses multiple folios"; it is train/test separation where some folios are excluded from grammar induction.

### Includes a Post-Freeze Prospective Test

This is the strongest methodological part of the novelty hypothesis: `f2v` was annotated and evaluated after GRAMMAR-V1 was frozen and publicly archived.

### Publishes an Inspectable Artifact Trail and Maintainer Replay Command

The current V1 release provides public artifacts and a maintainer replay command:

```bash
cd GrammarDiscoveryLab
npm.cmd run validate
```

The public artifacts preserve:

```text
f2r: 8/8 observed substitution families clean; new slot values=0
f2v: 7/7 observed substitution families clean; new slot values=0
```

Clean-clone certification for external reviewers is still pending.

## Tentative Novelty Formulation

Do not use this as a final priority claim yet:

> VoynichLab V1 does not claim to be the first proposal that Voynichese has internal components or positional behavior. Its tentative novelty is a physically annotated and versioned implementation of that hypothesis class, followed by formal induction of restricted slots and frozen evaluation on held-out and prospective folios.

The likely final contribution is not:

> We invented the first internal decomposition of Voynich glyphs.

The stronger and more defensible contribution is:

> We converted an explicit subglyph representation into a frozen structural model and evaluated its restricted internal slots on held-out and post-freeze prospective folios through a reproducible public pipeline.

## Blocking Verification Before Related Work

- Verify Guy/Frogguy primary source.
- Verify Stolfi prefix-midfix-suffix primary source.
- Verify Davis 2020 primary source.
- Verify Timm & Schinner 2019 primary source.
- Verify Rugg & Taylor 2016 primary source.
- Verify whether any prior work used explicit held-out or prospective validation comparable to V1.
