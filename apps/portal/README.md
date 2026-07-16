# VoynichLab Public Portal

Static Vercel entry point for VoynichLab.

Production URL:

```text
https://voynich-lab.vercel.app/
```

## Scope

This portal is a navigable front door over the current repository artifacts:

- research timeline;
- ATOMS-V1 inventory;
- EVA/ATOMS regional comparison;
- V3 ablations;
- null controls;
- tool map;
- paper workspace;
- public verifiability status.

It does not replace the existing labs. It links to public repository files and reports.

## Data contract

- `source-data/atoms-v1.json` is the curated source for the visual ATOMS inventory.
- `research-feed/` is the canonical source for experiments, milestones, releases, and evidence cases.
- `artifacts/public/` is the canonical source for public experiment bundles.
- `data/` is the generated static mirror consumed by the browser and rebuilt by `npm.cmd run research:build`.

Do not edit files under `data/` directly.

## Roadmap

- V1: public research portal, current results, documentation, and honest verifiability boundaries.
- V2: data-driven dashboards generated from frozen experiment outputs.
- V3: interactive lab builds for selected public workflows.
- V4: manuscript explorer with linked visual annotations, coordinates, masks, and ATOMS labels.

## Local Check

Serve this directory from a static HTTP server. The portal uses relative asset paths:

```text
./styles.css
./main.js
```

Recommended Vercel project settings:

```text
Framework Preset: Other
Root Directory: apps/portal
Build Command: empty
Output Directory: .
Install Command: empty
```

## Scientific Boundary

VoynichLab does not currently claim translation, decipherment, phonetic values, semantic values, or global representation optimality.

## Reproducibility Boundary

The portal should distinguish public inspection from maintainer replay. It must
not promise that an external reader can clone the full repository and reproduce
every result until a clean-clone certification has been performed and documented.
