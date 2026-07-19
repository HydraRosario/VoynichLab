# VoynichLab Laboratories

This directory is the canonical home for all active research laboratories:

- `labs/eva-comparison/`
- `labs/grammar-discovery/`
- `labs/translation/`

A new laboratory must be created under `labs/<descriptive-name>/` and must document:

- the scientific question it addresses;
- its accepted inputs and generated outputs;
- whether its results are exploratory, reviewed, frozen, or public;
- the command used to reproduce its analysis;
- the boundary between local scratch and versioned evidence.

Laboratories do not publish claims directly. Results must pass through the
review, artifact, registry, and freeze rules defined in
`docs/MONOREPO-ARCHITECTURE.md`.

Historical tags retain the root-level paths that existed when those releases
were published. Current commands and links use the canonical paths above.
