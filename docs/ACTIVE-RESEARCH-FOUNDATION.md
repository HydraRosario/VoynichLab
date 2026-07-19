# Active Research Foundation

Status: canonical map of the current development state. Historical releases
keep their own terminology and remain immutable.

## North star

VoynichLab builds an auditable visual representation of the Voynich Manuscript
and tests whether it preserves measurable structure better than a conventional
transcription over matched manuscript regions.

Translation, semantic interpretation, chemistry, and a complete grammar are
not current project deliverables.

## Active hierarchy

```text
manuscript image
  -> particle annotation
  -> atom grouping
  -> molecule sequence
  -> versioned corpus
  -> named experiment
  -> inspectable evidence
```

The canonical structural ontology is:

```text
particle -> atom -> molecule
```

`PARTICLES-V1` is the active name of the 16-label visual inventory. The public
and frozen record still uses `ATOMS-V1` where that was the published historical
name. See `docs/NOMENCLATURE-TRANSITION.md`.

## Sources of truth

| Object | Canonical source | Status |
|---|---|---|
| Live manual annotation | Local DatasetCreator V3 database | Local, never committed |
| Active visual inventory | `docs/PARTICLES-V1-SPECIFICATION.md` | Normative for V3 work |
| V3 schema and relations | `docs/CORPUS-V3-DATA-CONTRACT.md` | Normative design |
| Known annotation decisions | `research/audits/` | Canonical reviewed ledgers |
| Frozen corpus/model evidence | `research/FROZEN-EVIDENCE.md` and paths it indexes | Immutable |
| Published experiment metadata | `research/registry/experiments.json` | Public registry |
| Published result bundles | `research/artifacts/public/<experiment-id>/` | Public derived evidence |
| Public explanation | `apps/portal/` | Derived surface, not evidence source |
| Exploratory structural candidates | `apps/functional-atlas/` outputs | Local, not frozen evidence |

No generated Atlas result, portal sentence, or working export may silently
change a corpus annotation.

## Current release boundary

- Current public frozen corpus: **Corpus V2**.
- Current active development target: **Corpus V3 working candidate**.
- Corpus V3 does not exist as a release until human audit, correction ledger,
  replay, manifest, checksums, and an explicit freeze are complete.
- GRAMMAR-V2 does not exist. Functional Atlas candidates are a backlog for a
  future preregistered experiment.

## Current priority order

1. Stabilize and review the ontology migration.
2. Activate a validated V3 database copy without modifying V2.
3. Perform the human Corpus V3 annotation audit.
4. Replay selected existing experiments on the audited corpus.
5. Decide whether Corpus V3 is ready to freeze.
6. Only then design and preregister a possible GRAMMAR-V2 experiment.

## Stop rule

Do not add new exploratory analyses while the V3 foundation is unreviewed.
New observations belong in a backlog. Work resumes on them only after the V3
audit and release decision establish a stable corpus boundary.
