import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "research", "frozen", "CORPUS-V2-AUDITED");
const sourceDir = path.join(root, "labs", "eva-comparison", "cases", "corpus-v2-audited-current");
const auditDir = path.join(root, "research", "audits");

const folioRows = [
  ["f1r", "page-003.jpg", 210, 198, "0.7669", "0.5096", "24/24", "matched"],
  ["f1v", "page-004.jpg", 90, 90, "0.7182", "0.5487", "10/10", "matched"],
  ["f2r", "page-005.jpg", 99, 104, "0.7050", "0.5934", "13/13", "matched"],
  ["f2v", "page-006.jpg", 61, 57, "0.5163", "0.5136", "8/8", "matched"],
  ["f3r", "page-007.jpg", 115, 107, "0.6690", "0.4820", "20/20", "matched"],
  ["f47v", "page-094.jpg", 85, 83, "0.6974", "0.5225", "14/14", "matched"],
];

const metrics = {
  folios: 6,
  evaUnits: 660,
  atomsUnits: 639,
  atomsTokens: 6222,
  atomsVocabulary: 16,
  evaTokens: 2551,
  evaVocabulary: 26,
  evaWeightedRoleEntropy: 0.7688,
  atomsWeightedRoleEntropy: 0.5409,
  atomsMinusEvaWeightedRoleEntropy: -0.2279,
  morphologyNearestCentroidAccuracy: 0.9298,
  morphologyFiveNearestNeighborAccuracy: 0.9785,
  morphologyMeanSeparationRatio: 1.8552,
  morphologyMedianSeparationRatio: 1.0933,
  fullVariantEntropy: 0.5409,
  familyMergedEntropy: 0.5788,
  macroVocabulary: 12,
  macroUniqueLexemeSignatures: 406,
  originalUniqueMoleculeSignatures: 414,
  medialOperatorTokens: 1160,
  medialOperatorMedialShare: 0.9974,
  medialOperatorRoleEntropy: 0.0283,
};

const textFilesToCopy = [
  ["role-entropy.md", "reports/role-entropy.md"],
  ["variant-ablation.md", "reports/variant-ablation.md"],
  ["morphology-family-analysis.md", "reports/morphology-family-analysis.md"],
  ["contextual-rule-discovery.md", "reports/contextual-rule-discovery.md"],
  ["cross-folio-validation.md", "reports/cross-folio-validation.md"],
  ["macro-lexeme-analysis.md", "reports/macro-lexeme-analysis.md"],
  ["line-alignment-audit.md", "reports/line-alignment-audit.md"],
  ["CORPUS-V2-MATH-REPORT.md", "reports/CORPUS-V2-MATH-REPORT.md"],
  ["CEO-FINAL-CORPUS-V2-REPORT.md", "reports/CEO-FINAL-CORPUS-V2-REPORT.md"],
  ["CORPUS-V2-RUN-MANIFEST.md", "reports/CORPUS-V2-RUN-MANIFEST.md"],
  ["variant-ablation.tsv", "tables/variant-ablation.tsv"],
  ["contextual-rule-discovery.tsv", "tables/contextual-rule-discovery.tsv"],
  ["cross-folio-validation.tsv", "tables/cross-folio-validation.tsv"],
  ["macro-lexeme-analysis.tsv", "tables/macro-lexeme-analysis.tsv"],
  ["morphology-family-families.tsv", "tables/morphology-family-families.tsv"],
  ["morphology-family-confusion.tsv", "tables/morphology-family-confusion.tsv"],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relPath, content) {
  const target = path.join(outDir, relPath);
  ensureDir(path.dirname(target));
  const clean = trimTrailingWhitespace(content);
  fs.writeFileSync(target, clean.endsWith("\n") ? clean : `${clean}\n`, "utf8");
}

function copyFile(srcRel, destRel) {
  const source = path.join(sourceDir, srcRel);
  const target = path.join(outDir, destRel);
  ensureDir(path.dirname(target));
  const content = fs.readFileSync(source, "utf8");
  fs.writeFileSync(target, trimTrailingWhitespace(content), "utf8");
}

function trimTrailingWhitespace(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");
}

function readTsv(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  const [headerLine, ...lines] = content.split(/\r?\n/);
  const headers = headerLine.split("\t");
  return lines.filter(Boolean).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256IfExists(file) {
  return fs.existsSync(file) ? sha256(file) : null;
}

function listFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full));
    else files.push(full);
  }
  return files;
}

function cleanOutDir() {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
  ensureDir(outDir);
}

function writeCorpusTables() {
  copyFile("atoms.tsv", "corpus/atoms.tsv");
  copyFile("line-alignment-audit.tsv", "corpus/rows.tsv");

  const atomsRows = readTsv(path.join(sourceDir, "atoms.tsv"));
  const moleculeRows = atomsRows.map((row) => [
    row.unit_id,
    row.image_name,
    row.source_molecule_id,
    row.row_index,
    row.unit_index,
    row.atoms,
    row.atom_count,
    row.bounds_x,
    row.bounds_y,
    row.bounds_w,
    row.bounds_h,
  ]);

  writeFile(
    "corpus/molecules.tsv",
    [
      "unit_id\timage_name\tsource_molecule_id\trow_index\tunit_index\tatoms\tatom_count\tbounds_x\tbounds_y\tbounds_w\tbounds_h",
      ...moleculeRows.map((row) => row.join("\t")),
    ].join("\n"),
  );

  writeFile(
    "corpus/folios.tsv",
    [
      "folio\timage_name\teva_units\tatoms_units\teva_weighted_role_entropy\tatoms_weighted_role_entropy\tline_count\tline_status",
      ...folioRows.map((row) => row.join("\t")),
    ].join("\n"),
  );
}

function readQcSummary() {
  const ledgerPath = path.join(auditDir, "qc-reviewed-ledger.json");
  if (!fs.existsSync(ledgerPath)) return null;
  return JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
}

function countTsvRows(relPath) {
  const file = path.join(root, relPath);
  if (!fs.existsSync(file)) return 0;
  const content = fs.readFileSync(file, "utf8").trim();
  if (!content) return 0;
  return Math.max(0, content.split(/\r?\n/).length - 1);
}

function writeAuditTables() {
  const qc = readQcSummary();
  const corrections = [
    "source\tkind\tstatus\tpage\tobject_id\tdetail\tnote",
    "learning-memory-audit\tstale-memory-delete\tapplied\tpage-005.jpg\tmolecule_order_patterns#850\tRemoved temporary no-cut page-005 molecule order pattern\tThe live learning memory now reports zero stale patterns.",
    "operator-confirmed-chat\tcut-restoration\tapplied\tpage-005.jpg\timg5-m51\tRestored the cut around the n-over-ege unit after testing the no-cut alternative\tCurrent replay uses the restored cut.",
  ];

  if (qc?.reviewed) {
    for (const item of qc.reviewed) {
      corrections.push([
        "qc-reviewed-ledger",
        item.decision === "confirm" ? "review-confirmed" : item.decision,
        "reviewed",
        item.page ?? "",
        item.id ?? "",
        item.relabel ? `relabel=${item.relabel}` : `label=${item.currentLabel ?? ""}`,
        (item.notes ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "),
      ].join("\t"));
    }
  }

  writeFile("corrections.tsv", corrections.join("\n"));

  const auditSummary = {
    schemaVersion: "1.0",
    status: "closed",
    generatedAt: "2026-07-14",
    foliosAudited: ["f1r", "f1v", "f2r", "f2v", "f3r", "f47v"],
    qualityGates: {
      labelingAnomalyCandidatesPending: 0,
      particleGeometryOrderCandidatesPending: 0,
      learnedMemoryProblemsPending: 0,
      lineAlignmentMismatches: 0,
    },
    reviewedQcDecisions: qc
      ? {
          totalDecisions: qc.totalDecisions,
          uniqueReviewed: qc.uniqueReviewed,
          decisionCounts: qc.decisionCounts,
        }
      : null,
    knownValidExceptions: {
      geometryOrder: countTsvRows("research/audits/known-particle-geometry-anomalies.tsv"),
      labelingPatterns: countTsvRows("research/audits/known-labeling-anomalies.tsv"),
    },
    staleLearningMemoryRowsRemoved: 1,
    metrics,
  };

  writeFile("audit-summary.json", JSON.stringify(auditSummary, null, 2));
}

function writeDocs() {
  const dbPath = path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db");
  const provenance = {
    schemaVersion: "1.0",
    generatedAt: "2026-07-14",
    milestone: "CORPUS-V2-AUDITED",
    sourceDatabase: {
      label: "DatasetCreator local SQLite database",
      sha256: sha256IfExists(dbPath),
      absolutePathOmitted: true,
    },
    sourceOutputs: {
      corpusV2Current: "labs/eva-comparison/cases/corpus-v2-audited-current",
      qcLedger: "research/audits/qc-reviewed-ledger.json",
      knownGeometryExceptions: "research/audits/known-particle-geometry-anomalies.tsv",
      knownLabelingExceptions: "research/audits/known-labeling-anomalies.tsv",
    },
    scripts: [
      "labs/eva-comparison/scripts/run-corpus-v2-analysis.js --include-morphology",
      "labs/eva-comparison/scripts/learning-memory-audit.js",
      "labs/eva-comparison/scripts/particle-geometry-order-audit.js",
      "labs/eva-comparison/scripts/labeling-anomaly-audit.js",
      "labs/eva-comparison/scripts/cleanup-stale-learning-memory.js --apply",
      "packages/lab-exporter/src/freeze-corpus-v2-audited.js",
    ],
    excludedFromFreeze: [
      "local SQLite database files",
      "apps/dataset-creator/backups/*.db",
      "full raw visual snapshot scratch directories",
    ],
    scientificBoundary: "This milestone is a corpus audit and robustness replay. It is not a decipherment claim.",
  };

  writeFile("provenance.json", JSON.stringify(provenance, null, 2));

  writeFile(
    "MANIFEST.md",
    `# CORPUS-V2-AUDITED Manifest

CORPUS-V2-AUDITED closes the six-folio annotation audit and robustness replay for the current VoynichLab ATOMS corpus.

## Scope

- Folios/images: f1r/page-003, f1v/page-004, f2r/page-005, f2v/page-006, f3r/page-007, f47v/page-094
- ATOMS units: 639
- EVA units: 660
- ATOMS atom tokens: 6,222
- ATOMS vocabulary: 16
- EVA symbol tokens: 2,551
- EVA vocabulary: 26

## Main replay result

| Representation | Weighted positional entropy |
|---|---:|
| EVA | 0.7688 |
| ATOMS | 0.5409 |
| ATOMS - EVA | -0.2279 |

ATOMS remains lower than EVA under the current six-folio corpus replay. This is a structural result, not a translation claim.

## Quality gates

| Gate | Result |
|---|---:|
| Pending labeling anomaly candidates | 0 |
| Pending particle geometry-order candidates | 0 |
| Pending stale learned-memory rows | 0 |
| Line alignment mismatches | 0 |

## Files

- \`corpus/atoms.tsv\` - final exported ATOMS units with atom ids and bounds.
- \`corpus/molecules.tsv\` - molecule-level sequence table derived from the ATOMS export.
- \`corpus/rows.tsv\` - EVA/ATOMS ordinal line-alignment audit.
- \`corpus/folios.tsv\` - per-folio replay summary.
- \`reports/\` - copied replay reports from the final run.
- \`tables/\` - supporting replay TSVs.
- \`corrections.tsv\` - QC and audit ledger for the campaign.
- \`audit-summary.json\` - machine-readable audit closure summary.
- \`provenance.json\` - source, script, and checksum provenance without absolute local paths.
- \`checksums.txt\` - SHA-256 checksums for this freeze.

## Boundary

This freeze preserves the audited corpus state and its replay outputs. It does not modify ATOMS-V1 definitions, EVA source transcription, previous V1 freezes, the f3r preregistration, or any historical tags.
`,
  );

  writeFile(
    "AUDIT-METHODOLOGY.md",
    `# CORPUS-V2-AUDITED Audit Methodology

The audit campaign focused on three human-error surfaces:

1. atom label mistakes;
2. particle and molecule order mistakes;
3. stale learned-memory patterns created by temporary segmentation states.

The audit used visual QC ledgers, geometry-order anomaly checks, labeling anomaly checks, and learned-memory checks. Candidate anomalies were either corrected in DatasetCreator or marked as known valid exceptions when manual inspection confirmed that the unusual order was intentional.

Known-valid exceptions remain documented instead of hidden. This prevents repeated review of the same rare but valid structures while preserving the fact that they are unusual.

The final quality gate requires:

- zero pending labeling anomaly candidates;
- zero pending particle geometry-order candidates under the current rules;
- zero stale learned-memory rows;
- matching EVA/ATOMS line counts for the audited folios.
`,
  );

  writeFile(
    "CHANGELOG.md",
    `# CORPUS-V2-AUDITED Changelog

## 2026-07-14

- Closed the six-folio corpus audit campaign.
- Preserved reviewed QC decisions from rounds v3 through v7.
- Removed one stale learned molecule-order memory row from a temporary page-005 no-cut state.
- Re-ran labeling anomaly, particle geometry-order, learned-memory, line-alignment, entropy, morphology, variant-ablation, macro-lexeme, contextual-rule, and cross-folio reports.
- Restored the page-005 cut around img5-m51 before the final replay.
- Froze final corpus, reports, provenance, and checksums under \`research/frozen/CORPUS-V2-AUDITED\`.

No prior freeze, preregistration, source EVA transcription, or ATOMS-V1 definition was rewritten.
`,
  );

  writeFile(
    "V1-V2-ROBUSTNESS.md",
    `# V1 to V2 Robustness Summary

CORPUS-V2-AUDITED is not a new alphabet and not a redefinition of ATOMS-V1. It is a quality-control pass over the labeled corpus followed by a replay of the existing structural analyses.

## Current V2 replay

| Metric | V2 result |
|---|---:|
| Folios | 6 |
| ATOMS units | 639 |
| EVA units | 660 |
| ATOMS atom tokens | 6,222 |
| ATOMS weighted positional entropy | 0.5409 |
| EVA weighted positional entropy | 0.7688 |
| Delta ATOMS - EVA | -0.2279 |
| Morphology 5NN accuracy | 97.85% |
| Line alignment mismatches | 0 |
| Pending audit candidates | 0 |

## Robustness reading

The audited corpus preserves the main direction of the project: ATOMS remains a lower-entropy structural representation than EVA over the currently labeled folios. Morphological separability also remains high under the current snapshot-derived feature set.

The result does not prove decipherment, semantic interpretation, or global optimality. It says that after documented human-error cleanup and stale-memory removal, the current six-folio corpus still supports the structural comparison that motivated the audit.

## Historical sensitivity note

During the audit, page-003 entropy decreased from the earlier working value 0.5246 to the audited value 0.5096. This supports the interpretation that at least some manual corrections removed noise rather than manufacturing the main signal. The full-corpus V2 result should be treated as the authoritative audited state going forward.
`,
  );

  writeFile(
    "v1-v2-metrics.tsv",
    [
      "scope\tmetric\tv1_or_working\tv2_audited\treading",
      "page-003\tatoms_weighted_positional_entropy\t0.5246\t0.5096\tdecreased_after_audit",
      "six-folio\tatoms_weighted_positional_entropy\t\t0.5409\tcurrent_authoritative_v2",
      "six-folio\teva_weighted_positional_entropy\t\t0.7688\tcurrent_authoritative_v2",
      "six-folio\tatoms_minus_eva_entropy\t\t-0.2279\tatoms_lower_than_eva",
      "six-folio\tmorphology_5nn_accuracy\t\t0.9785\thigh_visual_family_separability",
      "six-folio\tpending_audit_candidates\t\t0\tclosed_under_current_rules",
    ].join("\n"),
  );
}

function writeChecksums() {
  const files = listFiles(outDir)
    .filter((file) => path.basename(file) !== "checksums.txt")
    .sort((a, b) => a.localeCompare(b));
  const lines = files.map((file) => {
    const rel = path.relative(outDir, file).replace(/\\/g, "/");
    return `${sha256(file)}  ${rel}`;
  });
  writeFile("checksums.txt", lines.join("\n"));
}

cleanOutDir();
writeCorpusTables();
for (const [src, dest] of textFilesToCopy) copyFile(src, dest);
writeAuditTables();
writeDocs();
writeChecksums();

console.log(`Wrote ${path.relative(root, outDir).replace(/\\/g, "/")}`);
