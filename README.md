# VoynichLab

A computational microscope for the Voynich Manuscript.

VoynichLab is an open research platform for testing stroke-level, subglyph representations of Voynichese against conventional EVA transcription. The current work centers on ATOMS-V1: a fixed 16-symbol physical annotation system derived from hand-labeled ink traces.

VoynichLab does **not** currently claim translation, decipherment, phonetic values, semantic values, or a complete grammar of the manuscript.

## Start Here

| If you want to... | Open |
|---|---|
| Understand the project visually | [Public portal](https://voynich-lab.vercel.app/) |
| Inspect the current frozen corpus | [Corpus V2 manifest](research/frozen/CORPUS-V2-AUDITED/MANIFEST.md) |
| Find every corpus, model, and validation freeze | [Frozen evidence catalog](research/FROZEN-EVIDENCE.md) |
| Browse every registered experiment | [Research registry](research-feed/experiments.json) |
| Inspect public evidence bundles | [Public artifacts](artifacts/public/) |
| Understand the repository architecture | [Monorepo architecture](docs/MONOREPO-ARCHITECTURE.md) |
| Review scientific scope and limitations | [Public verifiability policy](docs/PUBLIC-VERIFIABILITY.md) |

## Current Result

**CORPUS-V2-AUDITED Robustness Replay** - Outcome: **SUPPORTIVE**

After a six-folio corpus audit and replay:
- Pending labeling anomaly candidates: **0**
- Pending particle geometry-order candidates: **0**
- Pending stale learned-memory rows: **0**
- Line alignment mismatches: **0**
- ATOMS weighted positional entropy: **0.5409**
- EVA weighted positional entropy: **0.7688**
- Delta ATOMS - EVA: **-0.2279**
- Morphology 5NN accuracy: **97.85%**

This result is a corpus-quality and robustness milestone. It does not replace the preregistered `f3r` result, and it is not proof of decipherment or global representation superiority. See the [public portal](apps/portal/) for the full experiment browser.
## Repository Structure

The root separates products, laboratories, the scientific record, published
artifacts, and repository infrastructure. For the canonical map of all corpus
and model freezes, start at
[research/FROZEN-EVIDENCE.md](research/FROZEN-EVIDENCE.md).

| Zone | Path | Role |
|---|---|---|
| Public interface | `apps/portal/` | Static public portal generated from selected evidence |
| Internal interface | `apps/qc-review/` | Maintainer-only anomaly review surface |
| Annotation product | `DataSetCreator/` | Local Tauri application for creating ATOMS annotations |
| Active laboratory | `EVAComparisonLab/` | Corpus audit, morphology, entropy, and ATOMS/EVA comparison |
| Active laboratory | `GrammarDiscoveryLab/` | Frozen-family validation, controls, alignment, and representation tests |
| Scientific record | `research/` | Audits, preregistrations, correction work, and frozen releases |
| Public evidence | `artifacts/public/` | One inspectable bundle per registered experiment |
| Public registry | `research-feed/` | Experiments, milestones, releases, and curated evidence cases |
| Shared infrastructure | `packages/` | Export, validation, build, and repository guardrails |
| Working context | `paper/` | Claims, figures, literature, and possible future publications |
| Governance | `docs/` | Architecture, safety, deployment, and repository policy |
| Isolated hypothesis space | `TranslationLab/` | Early speculative work; not part of the validated public evidence pipeline |

Historical V1 and GRAMMAR-V1 freezes remain inside the labs that published
them. They are indexed centrally under `research/`; from Corpus V3 onward, all
new corpus freezes belong in `research/frozen/`.

For source/evidence/scratch boundaries and safe monorepo handling, see
[REPOSITORY-GOVERNANCE.md](REPOSITORY-GOVERNANCE.md) and
[docs/MONOREPO-ARCHITECTURE.md](docs/MONOREPO-ARCHITECTURE.md). For ignored
local state and disk-usage policy, see
[docs/LOCAL-STATE-INVENTORY.md](docs/LOCAL-STATE-INVENTORY.md). For the
current public-verifiability boundary, see
[docs/PUBLIC-VERIFIABILITY.md](docs/PUBLIC-VERIFIABILITY.md).

## Maintainer Commands

```bash
# Validate research registry
npm.cmd run validate

# Same validator, explicit research namespace
npm.cmd run research:validate

# Build all public artifacts and portal data
npm.cmd run research:build

# Publish a single experiment artifact
npm.cmd run research:publish -- --experiment prospective-atoms-eva-test-v1

# Full health check
npm.cmd run research:doctor

# Preview staging plan
npm.cmd run research:stage-plan -- --experiment prospective-atoms-eva-test-v1
```

On non-Windows shells, use `npm run ...` instead of `npm.cmd run ...`.

## Public Verification Status

VoynichLab currently separates three levels of trust:

- Publicly inspectable: reports, metrics, manifests, checksums, commits, tags,
  and registry JSON can be read directly from the repository and portal.
- Maintainer replay: the commands below are the working replay surface used by
  project maintainers.
- Clean-clone reproducible: not yet certified for the full repository.

Do not treat the commands below as a guaranteed clean-clone protocol until a
dedicated external reproduction test has been performed and documented.

```bash
cd GrammarDiscoveryLab
npm.cmd run validate
npm.cmd run null-control:v1
npm.cmd run null-control:v2
npm.cmd run null-control:v3
npm.cmd run null-control:v3:diagnostics
npm.cmd run representation-alignment:v1
npm.cmd run representation-comparison:v2-regions
npm.cmd run representation-comparison:v3-ablations
npm.cmd run prospective-atoms-eva:verify-release

cd ../EVAComparisonLab
npm.cmd run corpus:v2
```

## Public Milestones

| Tag | Description |
|-----|-------------|
| `v1-pre-validation` | ATOMS-V1 inventory freeze |
| `grammar-v1` | GRAMMAR-V1 molecular families frozen |
| `reproducible-release-v1` | Reproducible validation pipeline |
| `atoms-eva-regional-v1` | Regional alignment + null controls |
| `atoms-eva-ablations-v1` | Ablation robustness experiments |
| `public-portal-v1` | First static public portal |
| `prospective-atoms-eva-test-v1-preregistered` | Preregistered f3r protocol |
| `prospective-atoms-eva-test-v1` | SUPPORTIVE f3r prospective test |
| `corpus-v2-audited` | Six-folio audited corpus + robustness replay |

## How to Publish an Experiment

1. Ensure the experiment is registered in `research-feed/experiments.json` with valid paths
2. Run `npm.cmd run research:validate` to check registry integrity
3. Run `npm.cmd run research:publish -- --experiment <id>` to generate public artifacts
4. Review changes with `npm.cmd run research:stage-plan -- --experiment <id>`
5. Commit and tag explicitly (the publisher never commits automatically)
6. Push main + tags to deploy the portal via Vercel

## DataSetCreator Guidelines

The `DataSetCreator/` directory contains the local annotation tool and its database. **Do not** modify database files, move labeled data, or rewrite annotation logic without understanding the full impact. Changes to `DataSetCreator` must be surgical and tested. The local database is git-ignored and must never be committed.

Architecture and safety map: [docs/DATASETCREATOR-ARCHITECTURE.md](docs/DATASETCREATOR-ARCHITECTURE.md).

## Portal

The public portal is in `apps/portal/` and is deployed via Vercel. It reads from `apps/portal/data/`, which is generated by `research:build`. Avoid hardcoding experiment IDs in portal code; use `research-feed/site.json` for configuration.

## Scientific Boundaries

- ATOMS-V1 components are not interpreted as letters, phonemes, morphemes, or semantic units
- Molecular units are not claimed to be words
- Translation hypotheses belong in `TranslationLab`
- Negative and inconclusive results are preserved as part of the scientific record
- The corpus is single-annotator and small; independent replication is needed
- VoynichLab is offered as open research infrastructure

## Contributing

Contributions should follow the repo's engineering rules:
- Do not mix scientific changes with unrelated UI changes
- Do not move valuable data folders without a plan
- Do not delete referenced outputs without inventory
- Do not hide negative results
- Do not push without explicit request
- Keep commits small and thematic

## License

See repository metadata.
