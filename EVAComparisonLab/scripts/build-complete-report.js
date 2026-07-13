import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const combinedDir = path.join(root, "cases/combined-f1r-f1v-f47v-full-current");
const snapshotsDir = path.join(root, "artifacts/visual-snapshots/current");
const outPath = path.join(root, "cases/FINAL-COMPLETE-REPORT.md");

const sections = [
  ["Current Compressed Report", path.join(root, "cases/CURRENT-COMPRESSED-REPORT.md")],
  ["Combined Role Entropy", path.join(combinedDir, "role-entropy.md")],
  ["Line Alignment Audit", path.join(combinedDir, "line-alignment-audit.md")],
  ["Atom Symbols", path.join(combinedDir, "atom-symbols.md")],
  ["Particle Rule Discovery", path.join(combinedDir, "contextual-rule-discovery.md")],
  ["Molecule Rule Discovery", path.join(combinedDir, "contextual-rule-discovery-molecule-scope.md")],
  ["Molecule Neighbor Discovery", path.join(combinedDir, "molecule-neighbor-discovery.md")],
  ["Search Space Audit", path.join(combinedDir, "search-space-audit.md")],
  ["Conditional Entropy", path.join(combinedDir, "conditional-entropy.md")],
  ["Variant Ablation", path.join(combinedDir, "variant-ablation.md")],
  ["Macro Lexeme Analysis", path.join(combinedDir, "macro-lexeme-analysis.md")],
  ["Morphology Family Analysis", path.join(combinedDir, "morphology-family-analysis.md")],
  ["Cross-Folio Validation", path.join(combinedDir, "cross-folio-validation.md")],
  ["e:1 Final Branch Audit", path.join(combinedDir, "e1-final-branch-audit.md")],
  ["e:1 Final Exceptions", path.join(combinedDir, "exceptions-e1-final-without-prior-g1.md")],
  ["f:1 Medial Exceptions", path.join(combinedDir, "exceptions-f1-medial-without-next-i1.md")],
  ["m:1 Medial Exceptions", path.join(combinedDir, "exceptions-m1-medial-without-next-c1.md")],
  ["Labeling Anomaly Audit", path.join(combinedDir, "labeling-anomaly-audit.md")],
];

const lines = [];
lines.push("# VoynichLab EVA Comparison Complete Report");
lines.push("");
lines.push("Generated from the current DatasetCreator database export.");
lines.push("");
lines.push("This is the single-file report. It embeds the current compressed report plus the full generated markdown reports for entropy, rules, pattern searches, morphology, exceptions, anomaly audit, and visual snapshot inventory.");
lines.push("");
lines.push("## Output Inventory");
lines.push("");
lines.push(`- Combined case directory: \`${path.relative(root, combinedDir)}\``);
lines.push(`- Visual snapshots directory: \`${path.relative(root, snapshotsDir)}\``);
lines.push(`- Visual snapshots DB: \`${path.relative(root, path.join(snapshotsDir, "visual-snapshots.db"))}\``);
lines.push(`- Known anomalies list: \`cases/known-labeling-anomalies.tsv\``);
lines.push("");
pushSnapshotSummary(lines);
lines.push("");

for (const [title, filePath] of sections) {
  lines.push("---");
  lines.push("");
  lines.push(`# ${title}`);
  lines.push("");
  if (!fs.existsSync(filePath)) {
    lines.push(`Missing generated file: \`${path.relative(root, filePath)}\``);
    lines.push("");
    continue;
  }
  lines.push(`Source: \`${path.relative(root, filePath)}\``);
  lines.push("");
  lines.push(stripTopHeading(fs.readFileSync(filePath, "utf8").trimEnd()));
  lines.push("");
}

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);

function pushSnapshotSummary(lines) {
  lines.push("## Visual Snapshot Inventory");
  lines.push("");
  if (!fs.existsSync(snapshotsDir)) {
    lines.push("- Snapshot directory not found for this run.");
    return;
  }

  const files = walkFiles(snapshotsDir);
  const pngs = files.filter((file) => file.toLowerCase().endsWith(".png"));
  const dbPath = path.join(snapshotsDir, "visual-snapshots.db");
  lines.push(`- Snapshot PNG files: \`${pngs.length}\``);
  lines.push(`- Snapshot index DB exists: \`${fs.existsSync(dbPath) ? "yes" : "no"}\``);

  const byKind = new Map();
  for (const file of pngs) {
    const rel = path.relative(snapshotsDir, file);
    const kind = rel.split(path.sep)[0] || "(root)";
    byKind.set(kind, (byKind.get(kind) ?? 0) + 1);
  }
  for (const [kind, count] of [...byKind.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- \`${kind}\`: \`${count}\` PNG files`);
  }

  lines.push("");
  lines.push("Representative snapshot files:");
  for (const file of pngs.slice(0, 25)) {
    lines.push(`- \`${path.relative(root, file)}\``);
  }
  if (pngs.length > 25) {
    lines.push(`- ... plus \`${pngs.length - 25}\` more PNG files.`);
  }
}

function walkFiles(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkFiles(full));
    } else {
      found.push(full);
    }
  }
  return found;
}

function stripTopHeading(text) {
  return text.replace(/^# .+?\r?\n+/, "");
}
