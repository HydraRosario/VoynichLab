# Retired Tools

This file records tools that existed during research work but are no longer
part of the active repository surface.

## Atom Atlas

Status: retired after the CORPUS-V2 audit campaign.

Atom Atlas exported per-symbol SVG examples from the labeled corpus and helped
inspect possible human labeling errors during quality control. It was useful as
a temporary review aid, but it was not promoted into a formal public laboratory
or a curated visual-evidence release.

Retirement reason:

- the Corpus V2 atom-label audit is complete;
- the generated SVG bundle was large and easy to confuse with frozen evidence;
- the portal should not expose an unfinished visual atlas as if it were a
  maintained scientific artifact;
- future visual evidence should be rebuilt as a curated, versioned release with
  manifest, checksums, provenance, and explicit selection criteria.

## EVAComparisonLab Current Report Scripts

Status: retired after the CORPUS-V2 audit campaign.

The old `run-current-analysis.js`, `build-current-report.js`, and
`build-complete-report.js` scripts generated ad hoc reports under
`cases/*current` while the corpus was still changing rapidly. They were replaced
by:

- `EVAComparisonLab/scripts/run-corpus-v2-analysis.js` for local regenerated
  analysis from the current DatasetCreator DB;
- `research/frozen/CORPUS-V2-AUDITED/` for frozen corpus evidence;
- `artifacts/public/` for portal-visible public reports.

Retirement reason:

- the old scripts referenced partial four-folio `current` paths;
- their generated report files were intentionally removed from Git;
- keeping them active made scratch outputs look like canonical evidence.
