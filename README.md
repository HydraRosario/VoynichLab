# VoynichLab

A computational microscope for the Voynich Manuscript.

VoynichLab is an open research platform for testing stroke-level, subglyph representations of Voynichese against conventional EVA transcription. The current work centers on ATOMS-V1: a fixed 16-symbol physical annotation system derived from hand-labeled ink traces.

VoynichLab does **not** currently claim translation, decipherment, phonetic values, semantic values, or a complete grammar of the manuscript.

## Public Entry Points

- Launch VoynichLab: Vercel deployment pending.
- [Explore the research timeline](https://github.com/HydraRosario/VoynichLab/blob/main/GrammarDiscoveryLab/RESEARCH-TIMELINE.md)
- [View ATOMS vs EVA experiments](https://github.com/HydraRosario/VoynichLab/blob/main/GrammarDiscoveryLab/out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md)
- [Read the paper workspace](https://github.com/HydraRosario/VoynichLab/tree/main/paper)
- [Reproduce the results](https://github.com/HydraRosario/VoynichLab/tree/main/GrammarDiscoveryLab)

## Current Result

Under matched held-out regional comparisons, ATOMS-V1 preserved more local predictive structure than EVA across several model ablations.

Combined all-region ablation results:

| Model | ATOMS normalized log-loss | EVA normalized log-loss | Reading |
|---|---:|---:|---|
| Unigram baseline | 0.8274 | 0.8727 | ATOMS frequency distribution is more concentrated. |
| Neighbors only | 0.2427 | 0.4320 | ATOMS keeps stronger local predictive structure without exact length. |
| Neighbors + coarse position | 0.3101 | 0.5533 | ATOMS remains favorable without exact regional length. |
| Published V2 exact-length model | 0.8079 | 0.8927 | Reproduces the tagged regional comparison. |
| Neighbors + coarse position + length bins | 0.4260 | 0.6836 | ATOMS remains favorable with train-defined length bins. |

The result is exploratory evidence, not proof of global representation superiority.

## Repository Map

```text
apps/portal/          Public static entry point.
DataSetCreator/       Local visual annotator for traces, atoms, particles, molecules, rows, cuts, and joins.
EVAComparisonLab/     Entropy, morphology, snapshot, and ATOMS/EVA comparison reports.
GrammarDiscoveryLab/  Frozen grammar validation, null controls, alignment, and representation comparisons.
TranslationLab/       Experimental hypothesis space, kept separate from validated claims.
paper/                Claims, outline, figures, literature map, and novelty matrix.
```

## Public Portal Deployment

The public portal is configured for Vercel.

Recommended Vercel project settings:

```text
Framework Preset: Other
Root Directory: apps/portal
Build Command: empty
Output Directory: .
Install Command: empty
```

The portal is static and must not deploy the full repository as an application bundle. `DataSetCreator`, local databases, visual snapshots, and working research outputs remain source artifacts in Git, not public runtime assets.

## Research Registry

VoynichLab now uses a machine-readable research registry as the content source for the public portal:

```text
research-feed/experiments.json
research-feed/milestones.json
research-feed/releases.json
artifacts/public/<experiment-id>/
apps/portal/data/
```

Each published experiment has a standard public artifact:

```text
manifest.json
summary.md
metrics.json
provenance.json
checksums.txt
tables/
```

The portal is rendered from versioned experiment manifests, frozen report paths, checksums, commits, and tags. Positive, negative, inconclusive, methodological, and superseded results are all preserved as part of the scientific record.

Registry commands:

```bash
npm.cmd run research:validate
npm.cmd run research:build
npm.cmd run research:publish -- --experiment representation-comparison-v3-ablations
```

`research:publish` prepares public artifacts only. It does not commit, tag, push, or modify frozen source files.

## Reproduce

Clone the repository and run the public experiment suite:

```bash
git clone https://github.com/HydraRosario/VoynichLab.git
cd VoynichLab/GrammarDiscoveryLab
npm install
npm.cmd run validate
npm.cmd run null-control:v1
npm.cmd run null-control:v2
npm.cmd run null-control:v3
npm.cmd run null-control:v3:diagnostics
npm.cmd run representation-alignment:v1
npm.cmd run representation-comparison:v2-regions
npm.cmd run representation-comparison:v3-ablations
```

On non-Windows shells, use `npm run ...` instead of `npm.cmd run ...`.

Key reports:

```text
GrammarDiscoveryLab/out/reproducible-release-v1/VALIDATION-SUMMARY.md
GrammarDiscoveryLab/out/null-control-v2-contextual/NULL-CONTROL-V2-CONTEXTUAL.md
GrammarDiscoveryLab/out/null-control-v3/NULL-CONTROL-V3-MODEL-COMPARISON.md
GrammarDiscoveryLab/out/representation-alignment-v1/REPRESENTATION-ALIGNMENT-V1.md
GrammarDiscoveryLab/out/representation-comparison-v2-regions/REPRESENTATION-COMPARISON-V2-REGIONS.md
GrammarDiscoveryLab/out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md
```

## Public Milestones

```text
v1-pre-validation
v1-validation-f2r
grammar-v1
reproducible-release-v1
atoms-eva-regional-v1
atoms-eva-ablations-v1
public-portal-v1
```

## Scientific Boundary

ATOMS-V1 components are not currently interpreted as letters, phonemes, morphemes, or semantic units. Molecular units are not claimed to be words. Translation hypotheses belong in `TranslationLab` and are separated from the validated experimental claims.

VoynichLab is offered as open research infrastructure: evidence in Git, investigation in the browser.
