# Public Experiment Artifacts
Each directory below corresponds to a stable experiment ID in
`research/registry/experiments.json`.

A complete bundle normally contains:

```text
manifest.json
report.md
summary.md
metrics.json
provenance.json
checksums.txt
tables/
```

These bundles are inspectable evidence, not additional corpus versions. Corpus
releases are cataloged in `research/FROZEN-EVIDENCE.md`.

Do not edit a published bundle silently. Correct the source experiment and
publish a new version or explicitly documented correction.
