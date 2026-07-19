# Functional Atlas Scientific Protocol

Status: active implementation protocol; exploratory results are not corpus
corrections or research claims.

## Primary question

Functional Atlas asks where a human annotation may be inconsistent with both
its drawn form and the recurring structure of the corpus. Its purpose is to
produce a small, inspectable review queue—not to rewrite labels statistically.

It separates four questions:

1. **Annotation audit** — is an individual reading suspicious enough to return
   to the manuscript and annotation geometry?
2. **Functional equivalence** — do two correctly labeled particle families
   occupy interchangeable structural contexts?
3. **Composition** — does one family behave like an ordered pair of families?
4. **Operational repetition** — do recurrent units occupy unusually rigid
   positions or templates?

Only the first question can propose a Corpus V3 annotation correction. The
other three produce experimental hypotheses.

### Contextual annotation protocol

Contextual audit is hypothesis-driven. A visually plausible ambiguity must be
declared before scoring; an exploratory similarity cannot nominate itself as a
correction. The first declared ambiguity is the one-versus-two segmentation
`m:1 ↔ e:1 + b:1`.

For every occurrence, Atlas compares previous neighbor, next neighbor,
position inside the atom, and atom position inside the molecule. Training
examples from the occurrence's own folio are excluded. A case becomes a review
candidate only when the alternative exceeds the current reading by the frozen
minimum log-score gap. The score chooses where to inspect; it does not decide
what the ink is.

## Units and boundaries

The canonical hierarchy is `particle → atom → molecule`. Every analysis keeps
atom and molecule boundaries explicit. A pair inside one atom is never pooled
with a pair crossing an atom or molecule boundary.

The historical 14-family view is reconstructed by removing configuration
suffixes. Under the current inventory this merges `c:1/c:2` and `h:1/h:2`,
while the other twelve families remain unchanged. This is a counterfactual
representation, not a rewrite of ATOMS-V1 or PARTICLES-V1.

## Primary metrics

- Jensen-Shannon similarity of previous-neighbor distributions.
- Jensen-Shannon similarity of next-neighbor distributions.
- Jensen-Shannon similarity of particle position inside atoms.
- Jensen-Shannon similarity of atom position inside molecules.
- Leave-one-image-out normalized bigram log-loss before and after a proposed
  merge.
- Weighted positional entropy for the 16-label and 14-family views.
- External-context similarity between `X` and an observed within-atom pair
  `Z → Y`.
- Role rigidity, neighbor predictability, and immediate repetition rate for
  operator candidates.

No single score establishes equivalence. Rankings are discovery aids and must
show support, per-context components, held-out behavior, and contrary evidence.

The current implementation includes deterministic, within-image token
permutations for pairwise equivalence, composition, and operator rigidity. It
applies Benjamini-Hochberg false-discovery correction separately across each
tested family. It remains a discovery instrument rather than a confirmatory
significance test: bootstrap confidence intervals and frequency-matched null
controls for repeated-template rankings remain mandatory before candidates can
be promoted beyond exploratory status.

## Safeguards

- Corpus input is read-only exported TSV, never a live database.
- Outputs are marked exploratory and carry an input fingerprint.
- Minimum support is enforced before ranking.
- Functional hypotheses never enter the QC correction ledger automatically.
- Only explicitly declared visual ambiguities enter contextual audit.
- The evaluated folio is excluded from contextual training.
- Contextual candidates and geometry outliers are exported as separate lists.
- No audit candidate changes a corpus file or database automatically.
- Frozen releases, historical reports, and checksums are never modified.

## Interpretation vocabulary

- `candidate`: enough support to inspect.
- `supported exploratory`: context similarity is high and held-out loss does
  not materially worsen.
- `mixed`: components disagree or behavior varies strongly by image.
- `unsupported`: held-out loss worsens or contexts remain distinct.
- `insufficient`: too few observations.

These labels describe a test result, not linguistic identity, phonetics,
semantics, chemistry, or decipherment.

## Structural grammar discovery

The second analysis layer keeps every PARTICLES-V1 identity unchanged and
searches above the particle level:

1. **Constrained slots** retain an atom's complete particle frame and replace
   one position with `?`. Every retained alternative must occur at least four
   times and on at least two folios.
2. **Functional atom classes** compare distinct atom signatures by the atoms
   immediately before and after them and by their role inside the molecule.
   Similarity never merges their identities.
3. **Molecule transformations** connect two recurrent molecule types only when
   one atom insertion, deletion, or substitution separates them. Both types
   must recur on multiple folios and coexist on at least two folios.

These filters establish recurrence and cross-folio coverage, not statistical
confirmation. Candidate rankings require frequency-matched nulls and a frozen
held-out replay before they may enter a future GRAMMAR-V2 claim.
