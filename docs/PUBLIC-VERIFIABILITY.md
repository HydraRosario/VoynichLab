# Public Verifiability Policy

VoynichLab separates public trust into three levels. Public-facing text should
use these levels instead of making broad reproducibility promises.

## Level 1: Publicly Inspectable

A reader can inspect the claim without running local tooling.

Examples:

- public reports;
- registry JSON;
- metrics JSON;
- frozen TSV tables;
- manifests;
- checksums;
- commits and tags;
- source files linked from the portal.

This is the current baseline for the public portal.

## Level 2: Maintainer Replay

The project maintainers can regenerate or validate a result in the current
working environment using repository scripts and known local conventions.

Examples:

- `npm.cmd run research:validate`;
- `npm.cmd run research:build`;
- GrammarDiscoveryLab replay commands used during publication.

These commands are useful for maintainers and reviewers working with the same
environment, but they are not yet a fully certified clean-clone protocol.

## Level 3: Clean-Clone Reproducible

An external reviewer can clone the repository onto a fresh machine, follow a
short documented setup, run the advertised commands, and reproduce the stated
outputs without private files, local databases, ignored scratch folders, or
maintainer-only context.

VoynichLab should only claim this level after a dedicated clean-clone test has
been run and documented.

## Current Public Position

The current public release is:

- Level 1 for published reports, registry entries, public artifacts, checksums,
  commits, and tags;
- Level 2 for maintainer replay commands;
- not yet certified as Level 3 for the full repository.

The portal and README files should therefore avoid phrases such as "from a clean
clone" or "fully reproducible" unless a specific artifact has been tested at
Level 3 and the test record is linked.

## Wording Guide

Use:

- "publicly inspectable";
- "frozen public artifact";
- "maintainer replay command";
- "clean-clone certification pending";
- "current public evidence trail".

Avoid unless certified:

- "from a clean clone";
- "fully reproducible";
- "anyone can clone and run";
- "run the public experiment suite";
- "reproduces the complete result from scratch".
