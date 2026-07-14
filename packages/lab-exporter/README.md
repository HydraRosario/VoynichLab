# VoynichLab Lab Exporter

Common registry and public-artifact utility for VoynichLab.

## Commands

From the repository root:

```bash
npm.cmd run research:validate
npm.cmd run research:build
npm.cmd run research:publish -- --experiment representation-comparison-v3-ablations
```

## V1 Boundary

`publish` prepares public artifacts only. It does not commit, tag, push, rewrite frozen outputs, or modify DatasetCreator data.

The exporter treats source laboratory files as read-only inputs and writes only:

```text
artifacts/public/
apps/portal/data/
```
