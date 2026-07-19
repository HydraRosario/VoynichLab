# VoynichLab Research Registry

`research/registry/` is the machine-readable public registry for VoynichLab.

It is the content source for the public portal. Git keeps the scientific truth; the portal renders a curated view from versioned experiment metadata, report paths, table paths, commits, tags, and generated checksums.

## Files

```text
experiments.json          Published experiment index.
milestones.json           Chronological research timeline.
releases.json             Tag and release anchor index.
evidence-cases.json       Curated evidence cases rendered by the public portal.
schema/*.schema.json      Public JSON schemas.
```

## Outcomes

Allowed experiment outcomes:

```text
pending
supportive
negative
inconclusive
methodological
superseded
```

Negative results are first-class scientific results. They should remain visible in the portal.

Timeline milestones and releases are intentionally different. A published
scientific event may enter `milestones.json` without receiving a dedicated Git
tag; in that case `tag` and `commit` are `null`, and the milestone must link to
its public record. Every entry in `releases.json`, by contrast, is a real tagged
checkpoint.

## Commands

From the repository root:

```bash
npm.cmd run research:validate
npm.cmd run research:build
npm.cmd run research:publish -- --experiment representation-comparison-v3-ablations
```

`research:publish` prepares public artifacts and registry files only. V1 does not commit, tag, push, or modify frozen source files.
