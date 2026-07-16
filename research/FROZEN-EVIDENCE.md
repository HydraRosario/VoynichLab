# Frozen Evidence Catalog
This is the canonical map of VoynichLab freezes. It distinguishes objects that
were previously easy to confuse because they live in different historical
directories.

## Corpus releases

### Corpus V1 development freeze

- Scientific type: frozen annotation-database snapshot.
- Scope: f1r, f1v, f47v.
- Canonical historical path: `EVAComparisonLab/frozen/VOYNICHLAB-V1-FROZEN-2026-07-13/`.
- Primary file: `datasetcreator-v1-frozen.db`.
- Tag: `v1-pre-validation`.
- Status: immutable historical input; not the current corpus.

It remains inside EVAComparisonLab because that is the path recorded by the V1
manifest, later comparison provenance, and historical tag.

### Corpus V2 audited release

- Scientific type: frozen audited corpus plus replay outputs.
- Scope: f1r, f1v, f2r, f2v, f3r, f47v.
- Canonical path: `research/frozen/CORPUS-V2-AUDITED/`.
- Primary files: `corpus/atoms.tsv`, `corpus/molecules.tsv`, `MANIFEST.md`.
- Tag: `corpus-v2-audited`.
- Status: current frozen corpus.

Corpus V2 does not overwrite Corpus V1. Corrections discovered after its freeze
belong to a future Corpus V3 release.

## Model and grammar freezes

### GRAMMAR-V1

- Scientific type: frozen structural-family model.
- Canonical historical path: `GrammarDiscoveryLab/frozen/GRAMMAR-V1-2026-07-13/`.
- Tag: `grammar-v1`.
- Status: immutable model input, not a corpus release.

### Reproducible Release V1

- Scientific type: frozen validation inputs and expected replay contract.
- Canonical historical path: `GrammarDiscoveryLab/frozen/REPRODUCIBLE-RELEASE-V1/`.
- Tag: `reproducible-release-v1`.
- Status: immutable validation release, not a corpus release.

## Public experiment artifacts

`artifacts/public/<experiment-id>/` contains inspectable bundles derived from a
named experiment. A normal bundle contains a report, summary, metrics,
provenance, manifest, checksums, and tables.

These bundles are not additional freezes of the annotation corpus. They are the
public evidence surface consumed by the registry and portal.

## Why historical paths differ

VoynichLab acquired its current repository-level freeze policy after V1 and
GRAMMAR-V1 had already been published from their respective laboratories.
Moving those directories would invalidate documentation and reproduction paths
without improving the underlying evidence. This catalog provides one discovery
surface while the original locations preserve provenance.

## Next release

Corpus V3 and later corpus versions must be created under `research/frozen/`.
No new corpus freeze may be introduced inside an individual lab directory.
