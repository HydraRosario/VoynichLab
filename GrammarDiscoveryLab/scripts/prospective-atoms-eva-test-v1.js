import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const repoRoot = path.resolve(root, "..");
const preregDir = path.join(repoRoot, "research/preregistrations/prospective-atoms-eva-test-v1");
const protocolPath = path.join(preregDir, "protocol.json");
const checksumsPath = path.join(preregDir, "checksums.txt");
const outDir = path.join(root, "out/prospective-atoms-eva-test-v1");
const dbPath = path.resolve(
  arg("--db") ?? path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);

const allowExecute = hasFlag("--confirm-complete");
const dryRunOnly = hasFlag("--preflight") || !allowExecute;

const publishedV3Regression = {
  atomsNormalizedLogLoss: 0.8079217691095135,
  atomsTop1Accuracy: 0.4296407185628742,
  atomsUnseenContextRate: 0.46182634730538924,
  evaNormalizedLogLoss: 0.8927056812757962,
  evaTop1Accuracy: 0.2629815745393635,
  evaUnseenContextRate: 0.6046901172529313,
};

fs.mkdirSync(outDir, { recursive: true });

const protocol = readJson(protocolPath);
const preregOk = verifyPreregistrationChecksums();
const target = protocol.target;
const dbMetadata = inspectDatasetCreatorMetadata();
const regression = verifyPublishedRegression();
const priorFolios = new Set([
  ...protocol.frozenTrainingFolios,
  ...protocol.previouslyEvaluatedFolios,
]);

const targetImage = dbMetadata.images.find((image) => image.id === target.datasetCreatorImageId);
const failures = [];

if (!preregOk.ok) failures.push(...preregOk.errors);
if (!regression.ok) failures.push(...regression.errors);
if (!targetImage) failures.push(`Target image ID ${target.datasetCreatorImageId} not found in DatasetCreator DB.`);
if (targetImage && targetImage.name !== target.datasetCreatorImageName) {
  failures.push(`Target image name mismatch: protocol=${target.datasetCreatorImageName}, db=${targetImage.name}.`);
}
if (priorFolios.has(target.expectedFolio)) {
  failures.push(`Target folio ${target.expectedFolio} is already a train or previously evaluated folio.`);
}

if (failures.length) {
  writePreflightReport("failed", failures, { preregOk, regression, targetImage, dbMetadata });
  process.exit(1);
}

if (dryRunOnly) {
  writePreflightReport("not-executed-annotation-in-progress", [
    "The protocol is preregistered and checksums are valid.",
    "The target folio is intentionally treated as annotation-in-progress.",
    "No ATOMS sequences, EVA alignment, model scores, or corruption results were computed.",
    "Run again only after annotation completion with --confirm-complete.",
  ], { preregOk, regression, targetImage, dbMetadata });
  console.log("Preflight complete. Test not executed.");
  process.exit(0);
}

writePreflightReport("refused-completion-runner-not-yet-armed", [
  "Completion was confirmed, but the execution branch is intentionally locked until the completed folio freeze can be reviewed.",
  "This prevents accidental metric calculation before the final completed-page freeze procedure is audited.",
], { preregOk, regression, targetImage, dbMetadata });
process.exit(2);

function verifyPreregistrationChecksums() {
  const errors = [];
  if (!fs.existsSync(checksumsPath)) return { ok: false, errors: ["Missing preregistration checksums.txt."] };
  const lines = fs.readFileSync(checksumsPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const [expected, relativePath] = line.split(/\s+/, 2);
    const filePath = path.join(preregDir, relativePath);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing preregistration file: ${relativePath}`);
      continue;
    }
    const actual = sha256(filePath);
    if (actual !== expected) errors.push(`Checksum mismatch for ${relativePath}: expected ${expected}, got ${actual}`);
  }
  return { ok: errors.length === 0, errors };
}

function verifyPublishedRegression() {
  const errors = [];
  const summaryPath = path.join(root, "out/representation-comparison-v3-ablations/representation-comparison-v3-summary.tsv");
  if (!fs.existsSync(summaryPath)) return { ok: false, errors: [`Missing V3 summary: ${summaryPath}`] };
  const rows = readTsv(summaryPath);
  const atoms = rows.find((row) => row.subset === "all" && row.model === "MODEL_3" && row.representation === "ATOMS" && row.scope === "combined");
  const eva = rows.find((row) => row.subset === "all" && row.model === "MODEL_3" && row.representation === "EVA" && row.scope === "combined");
  if (!atoms || !eva) return { ok: false, errors: ["Could not locate MODEL_3 combined ATOMS/EVA rows in V3 summary."] };
  checkNear(errors, "ATOMS MODEL_3 normalized_log_loss", Number(atoms.normalized_log_loss), publishedV3Regression.atomsNormalizedLogLoss);
  checkNear(errors, "ATOMS MODEL_3 top1_accuracy", Number(atoms.top1_accuracy), publishedV3Regression.atomsTop1Accuracy);
  checkNear(errors, "ATOMS MODEL_3 unseen_context_rate", Number(atoms.unseen_context_rate), publishedV3Regression.atomsUnseenContextRate);
  checkNear(errors, "EVA MODEL_3 normalized_log_loss", Number(eva.normalized_log_loss), publishedV3Regression.evaNormalizedLogLoss);
  checkNear(errors, "EVA MODEL_3 top1_accuracy", Number(eva.top1_accuracy), publishedV3Regression.evaTop1Accuracy);
  checkNear(errors, "EVA MODEL_3 unseen_context_rate", Number(eva.unseen_context_rate), publishedV3Regression.evaUnseenContextRate);
  return { ok: errors.length === 0, errors };
}

function inspectDatasetCreatorMetadata() {
  if (!fs.existsSync(dbPath)) return { dbPath, dbSha256: "", images: [] };
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const rows = db.prepare(
    `SELECT
       i.id,
       i.name,
       (SELECT count(*) FROM atoms a WHERE a.image_id = i.id) AS atoms,
       (SELECT count(*) FROM molecules m WHERE m.image_id = i.id) AS molecules
     FROM images i
     ORDER BY i.id`
  ).all();
  db.close();
  return {
    dbPath,
    dbSha256: sha256(dbPath),
    images: rows.map((row) => ({
      id: Number(row.id),
      name: String(row.name),
      atoms: Number(row.atoms),
      molecules: Number(row.molecules),
    })),
  };
}

function writePreflightReport(status, messages, context) {
  const report = [
    "# PROSPECTIVE-ATOMS-EVA-TEST-V1",
    "",
    `Status: \`${status}\`.`,
    "",
    "## Messages",
    "",
    ...messages.map((message) => `- ${message}`),
    "",
    "## Target",
    "",
    `- Image ID: \`${target.datasetCreatorImageId}\``,
    `- Image name: \`${target.datasetCreatorImageName}\``,
    `- Expected folio: \`${target.expectedFolio}\``,
    `- Protocol status: \`${target.currentStatus}\``,
    `- Previously evaluated: \`${protocol.previouslyEvaluatedFolios.join(", ")}\``,
    "",
    "## Verification",
    "",
    `- Preregistration checksum verification: \`${context.preregOk.ok ? "passed" : "failed"}\``,
    `- Published V3 regression verification: \`${context.regression.ok ? "passed" : "failed"}\``,
    `- DatasetCreator DB SHA-256: \`${context.dbMetadata.dbSha256}\``,
    "",
    "## DatasetCreator Metadata",
    "",
    "| Image ID | Image | Atoms | Molecules |",
    "| ---: | --- | ---: | ---: |",
    ...context.dbMetadata.images
      .filter((image) => image.atoms > 0 || image.molecules > 0)
      .map((image) => `| ${image.id} | \`${image.name}\` | ${image.atoms} | ${image.molecules} |`),
    "",
    "## Guardrail",
    "",
    "No target-page sequences or metrics are exported by preflight mode.",
  ].join("\n") + "\n";

  fs.writeFileSync(path.join(outDir, "PROSPECTIVE-ATOMS-EVA-TEST-V1.md"), report);
  writeTsv(path.join(outDir, "alignment-summary.tsv"), [{ status, aligned_regions: "", unresolved_regions: "", eva_coverage: "", atoms_coverage: "" }], ["status", "aligned_regions", "unresolved_regions", "eva_coverage", "atoms_coverage"]);
  writeTsv(path.join(outDir, "model-results.tsv"), [{ status, primary_model: "MODEL_1", atoms_normalized_log_loss: "", eva_normalized_log_loss: "", classification: "pending" }], ["status", "primary_model", "atoms_normalized_log_loss", "eva_normalized_log_loss", "classification"]);
  writeTsv(path.join(outDir, "subset-results.tsv"), [{ status, subset: "", model: "", direction: "pending" }], ["status", "subset", "model", "direction"]);
  writeTsv(path.join(outDir, "corruption-results.tsv"), [{ status, representation: "", real_better_fraction: "", mean_margin: "" }], ["status", "representation", "real_better_fraction", "mean_margin"]);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) return [];
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const header = headerLine.split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function writeTsv(filePath, rows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => String(row[field] ?? "").replaceAll("\t", " ")).join("\t")),
  ].join("\n") + "\n");
}

function checkNear(errors, label, actual, expected) {
  if (Math.abs(actual - expected) > 1e-12) errors.push(`${label} regression mismatch: expected ${expected}, got ${actual}`);
}

function sha256(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}
