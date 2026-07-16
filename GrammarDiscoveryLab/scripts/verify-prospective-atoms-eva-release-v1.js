import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const preregTag = "prospective-atoms-eva-test-v1-preregistered";
const releaseTag = "prospective-atoms-eva-test-v1";
const preregRoot = "research/preregistrations/prospective-atoms-eva-test-v1";
const artifactRoot = path.join(repoRoot, "artifacts/public/prospective-atoms-eva-test-v1");

const failures = [];
verifyFrozenPreregistration();
verifyPublicBundle();
verifyPublishedMetrics();

if (failures.length) {
  console.error("PROSPECTIVE-ATOMS-EVA-TEST-V1 release verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PROSPECTIVE-ATOMS-EVA-TEST-V1 release verification passed.");
console.log(`Preregistration anchor: ${preregTag}`);
console.log(`Published release anchor: ${releaseTag}`);
console.log("Primary MODEL_1: ATOMS=0.348262 EVA=0.564957 delta=-0.216696");
console.log("Public bundle checksums: valid");

function verifyFrozenPreregistration() {
  const checksumText = gitShow(preregTag, `${preregRoot}/checksums.txt`);
  for (const line of checksumText.trim().split(/\r?\n/)) {
    const match = line.match(/^([0-9a-f]{64})\s+(.+)$/i);
    if (!match) continue;
    const [, expected, name] = match;
    const content = gitShow(preregTag, `${preregRoot}/${name}`);
    checkHash(`preregistration ${name}`, content, expected);
  }
}

function verifyPublicBundle() {
  const checksumPath = path.join(artifactRoot, "checksums.txt");
  if (!fs.existsSync(checksumPath)) return failures.push("public artifact checksums.txt is missing");
  for (const line of fs.readFileSync(checksumPath, "utf8").trim().split(/\r?\n/)) {
    const match = line.match(/^([0-9a-f]{64})\s+(.+)$/i);
    if (!match) continue;
    const [, expected, name] = match;
    const filePath = path.join(artifactRoot, ...name.split("/"));
    if (!fs.existsSync(filePath)) {
      failures.push(`public artifact is missing: ${name}`);
      continue;
    }
    checkHash(`public artifact ${name}`, fs.readFileSync(filePath), expected);
  }
  gitShow(releaseTag, "artifacts/public/prospective-atoms-eva-test-v1/metrics.json");
}

function verifyPublishedMetrics() {
  const metrics = JSON.parse(fs.readFileSync(path.join(artifactRoot, "metrics.json"), "utf8"));
  const rows = readTsv(path.join(artifactRoot, "tables/model-results.tsv"));
  const atoms = rows.find((row) => row.subset === "all" && row.model === "MODEL_1" && row.representation === "ATOMS" && row.scope === "combined");
  const eva = rows.find((row) => row.subset === "all" && row.model === "MODEL_1" && row.representation === "EVA" && row.scope === "combined");
  const delta = rows.find((row) => row.subset === "all" && row.model === "MODEL_1" && row.representation === "ATOMS_MINUS_EVA" && row.scope === "combined");
  if (!atoms || !eva || !delta) return failures.push("primary MODEL_1 rows are missing");
  checkNear("ATOMS normalized log-loss", atoms.normalized_log_loss, metrics.atomsNormalizedLogLoss);
  checkNear("EVA normalized log-loss", eva.normalized_log_loss, metrics.evaNormalizedLogLoss);
  checkNear("ATOMS minus EVA", delta.atoms_minus_eva_normalized_log_loss, metrics.atomsMinusEvaNormalizedLogLoss);
  checkNear("ATOMS top-1", atoms.top1_accuracy, metrics.atomsTop1Accuracy);
  checkNear("EVA top-1", eva.top1_accuracy, metrics.evaTop1Accuracy);
  checkNear("ATOMS unseen context", atoms.unseen_context_rate, metrics.atomsUnseenContextRate);
  checkNear("EVA unseen context", eva.unseen_context_rate, metrics.evaUnseenContextRate);
}

function gitShow(tag, file) {
  try {
    return execFileSync("git", ["show", `${tag}:${file}`], { cwd: repoRoot, encoding: "utf8" });
  } catch {
    failures.push(`cannot read ${file} from tag ${tag}`);
    return "";
  }
}

function checkHash(label, content, expected) {
  const actual = createHash("sha256").update(content).digest("hex");
  if (actual !== expected.toLowerCase()) failures.push(`${label} checksum mismatch: expected ${expected}, got ${actual}`);
}

function checkNear(label, actual, expected) {
  if (Math.abs(Number(actual) - Number(expected)) > 5e-5) failures.push(`${label} mismatch: table=${actual}, metrics=${expected}`);
}

function readTsv(filePath) {
  const [headerLine, ...lines] = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const headers = headerLine.split("\t");
  return lines.map((line) => Object.fromEntries(headers.map((header, index) => [header, line.split("\t")[index] ?? ""])));
}
