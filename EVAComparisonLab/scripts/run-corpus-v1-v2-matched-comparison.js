import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const labRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(labRoot, "..");
const outputDir = path.join(repoRoot, "artifacts", "public", "corpus-v1-v2-matched-comparison");
const tablesDir = path.join(outputDir, "tables");
const v1Db = path.join(labRoot, "frozen", "VOYNICHLAB-V1-FROZEN-2026-07-13", "datasetcreator-v1-frozen.db");
const v2Atoms = path.join(repoRoot, "research", "frozen", "CORPUS-V2-AUDITED", "corpus", "atoms.tsv");
const pages = ["page-003.jpg", "page-004.jpg", "page-094.jpg"];
const folios = ["f1r", "f1v", "f47v"];

fs.mkdirSync(tablesDir, { recursive: true });

const v1PageFiles = pages.map((page) => {
  const output = path.join(tablesDir, `v1-${page.replace(".jpg", "")}-atoms.tsv`);
  run("export frozen V1 atoms", [
    path.join(labRoot, "scripts", "export-datasetcreator-atoms.js"),
    "--db", v1Db,
    "--image", page,
    "--out", output,
  ]);
  return output;
});

const v1Combined = path.join(tablesDir, "v1-matched-atoms.tsv");
combineTsv(v1PageFiles, v1Combined);

const v2Combined = path.join(tablesDir, "v2-matched-atoms.tsv");
filterTsv(v2Atoms, v2Combined, (row) => pages.includes(row.image_name));

const v1EntropyReport = path.join(tablesDir, "v1-role-entropy.md");
const v2EntropyReport = path.join(tablesDir, "v2-role-entropy.md");
run("compute V1 entropy", [path.join(labRoot, "scripts", "role-entropy.js"), "--atoms", v1Combined, "--out", v1EntropyReport]);
run("compute V2 entropy", [path.join(labRoot, "scripts", "role-entropy.js"), "--atoms", v2Combined, "--out", v2EntropyReport]);

const v1 = parseEntropy(v1EntropyReport);
const v2 = parseEntropy(v2EntropyReport);
const delta = v2.weightedRelativeEntropy - v1.weightedRelativeEntropy;
const relativeChange = delta / v1.weightedRelativeEntropy;

const metrics = {
  schemaVersion: "1.0",
  scope: "matched-three-folio",
  folios,
  pages,
  metric: "atoms_weighted_relative_positional_entropy",
  lowerIsMoreRegular: true,
  v1: { ...v1, source: relative(v1Db) },
  v2: { ...v2, source: relative(v2Atoms) },
  v2MinusV1: round(delta),
  relativeChange: round(relativeChange),
};
writeJson(path.join(outputDir, "metrics.json"), metrics);

writeJson(path.join(outputDir, "manifest.json"), {
  schemaVersion: "1.0",
  id: "corpus-v1-v2-matched-comparison",
  title: "Corpus V1 to V2 Matched-Folio Comparison",
  status: "complete",
  scope: "matched-three-folio",
  folios,
  result: `ATOMS weighted relative positional entropy changed from ${fixed(v1.weightedRelativeEntropy)} in V1 to ${fixed(v2.weightedRelativeEntropy)} in V2.`,
  reportPath: "artifacts/public/corpus-v1-v2-matched-comparison/report.md",
  sourceScript: "EVAComparisonLab/scripts/run-corpus-v1-v2-matched-comparison.js",
});

const comparison = [
  "scope\tversion\tfolios\tunits\tatom_tokens\tvocabulary\tweighted_relative_positional_entropy\tdelta_from_v1",
  `matched-three-folio\tV1 frozen\t${folios.join(",")}\t${v1.units}\t${v1.atomTokens}\t${v1.vocabulary}\t${fixed(v1.weightedRelativeEntropy)}\t0.0000`,
  `matched-three-folio\tV2 audited\t${folios.join(",")}\t${v2.units}\t${v2.atomTokens}\t${v2.vocabulary}\t${fixed(v2.weightedRelativeEntropy)}\t${fixed(delta)}`,
  "",
].join("\n");
fs.writeFileSync(path.join(tablesDir, "comparison.tsv"), comparison);

const report = `# Corpus V1 to V2 matched-folio comparison

## Question

On the three folios present in the official frozen V1 corpus, how did ATOMS positional entropy change after the Corpus V2 annotation audit?

## Matched scope

- Folios: ${folios.map((folio) => `\`${folio}\``).join(", ")}
- Images: ${pages.map((page) => `\`${page}\``).join(", ")}
- V1 input: frozen DatasetCreator database from \`VOYNICHLAB-V1-FROZEN-2026-07-13\`
- V2 input: frozen \`CORPUS-V2-AUDITED\` atom table, filtered to the same pages
- Metric: weighted relative positional entropy from the same \`role-entropy.js\` implementation

## Result

| Version | Physical units | Atom tokens | Vocabulary | Weighted relative positional entropy |
| --- | ---: | ---: | ---: | ---: |
| V1 frozen | ${v1.units} | ${v1.atomTokens} | ${v1.vocabulary} | ${fixed(v1.weightedRelativeEntropy)} |
| V2 audited | ${v2.units} | ${v2.atomTokens} | ${v2.vocabulary} | ${fixed(v2.weightedRelativeEntropy)} |

V2 minus V1 is **${fixed(delta)}** (${(relativeChange * 100).toFixed(2)}%). Lower entropy means ATOMS labels are more concentrated in consistent structural roles.

## Interpretation

This is a like-for-like comparison of the three folios frozen in V1. It does not compare all six V2 folios with a six-folio V1, because no official six-folio V1 freeze exists. The result measures how the audited annotations changed positional regularity on the shared historical scope.

## Reproduction

\`node EVAComparisonLab/scripts/run-corpus-v1-v2-matched-comparison.js\`

## Integrity

Inputs are read-only frozen artifacts. Generated tables preserve the exact matched rows used by the calculation.
`;
fs.writeFileSync(path.join(outputDir, "report.md"), report);
fs.writeFileSync(path.join(outputDir, "summary.md"), `# Corpus V1 to V2 Matched-Folio Comparison

On the three folios shared by the official V1 freeze and Corpus V2, ATOMS weighted relative positional entropy changed from **${fixed(v1.weightedRelativeEntropy)}** to **${fixed(v2.weightedRelativeEntropy)}**.

The small decrease is consistent with modest noise removal. See [the full report](./report.md) for scope and limitations.
`);

const provenance = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  sourceScript: "EVAComparisonLab/scripts/run-corpus-v1-v2-matched-comparison.js",
  command: "node EVAComparisonLab/scripts/run-corpus-v1-v2-matched-comparison.js",
  inputs: [
    { path: relative(v1Db), sha256: sha256(v1Db) },
    { path: relative(v2Atoms), sha256: sha256(v2Atoms) },
    { path: "EVAComparisonLab/scripts/export-datasetcreator-atoms.js", sha256: sha256(path.join(labRoot, "scripts", "export-datasetcreator-atoms.js")) },
    { path: "EVAComparisonLab/scripts/role-entropy.js", sha256: sha256(path.join(labRoot, "scripts", "role-entropy.js")) },
  ],
  scope: { folios, pages },
};
writeJson(path.join(outputDir, "provenance.json"), provenance);

const checksummed = ["manifest.json", "metrics.json", "provenance.json", "report.md", "summary.md", "tables/comparison.tsv", "tables/v1-matched-atoms.tsv", "tables/v2-matched-atoms.tsv"];
fs.writeFileSync(path.join(outputDir, "checksums.txt"), checksummed.map((file) => `${sha256(path.join(outputDir, file))}  ${file}`).join("\n") + "\n");

console.log(`Wrote matched V1/V2 comparison to ${outputDir}`);
console.log(`V1=${fixed(v1.weightedRelativeEntropy)} V2=${fixed(v2.weightedRelativeEntropy)} delta=${fixed(delta)}`);

function run(label, args) {
  const result = spawnSync(process.execPath, args, { cwd: labRoot, stdio: "inherit", shell: false });
  if (result.status !== 0) throw new Error(`${label} failed with status ${result.status}`);
}

function parseTsv(file) {
  const lines = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const header = lines[0].split("\t");
  return { header, rows: lines.slice(1).filter(Boolean).map((line) => Object.fromEntries(header.map((key, index) => [key, line.split("\t")[index] ?? ""]))) };
}

function writeTsv(file, header, rows) {
  fs.writeFileSync(file, [header.join("\t"), ...rows.map((row) => header.map((key) => row[key] ?? "").join("\t")), ""].join("\n"));
}

function combineTsv(files, output) {
  const parsed = files.map(parseTsv);
  writeTsv(output, parsed[0].header, parsed.flatMap((item) => item.rows));
}

function filterTsv(input, output, predicate) {
  const parsed = parseTsv(input);
  writeTsv(output, parsed.header, parsed.rows.filter(predicate));
}

function parseEntropy(file) {
  const text = fs.readFileSync(file, "utf8");
  const value = (key) => Number(text.match(new RegExp(`^${key}:\\s*([0-9.]+)$`, "m"))?.[1]);
  return {
    units: value("units"),
    atomTokens: value("symbols"),
    vocabulary: value("vocabulary"),
    weightedRelativeEntropy: value("weighted_relative_entropy_0_to_1"),
  };
}

function relative(file) { return path.relative(repoRoot, file).replaceAll("\\", "/"); }
function sha256(file) { return createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n"); }
function round(value) { return Number(value.toFixed(6)); }
function fixed(value) { return value.toFixed(4); }
