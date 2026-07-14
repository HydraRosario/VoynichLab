#!/usr/bin/env node
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryDir = path.join(root, "research-feed");
const publicDir = path.join(root, "artifacts", "public");
const portalDataDir = path.join(root, "apps", "portal", "data");
const repoBlob = "https://github.com/HydraRosario/VoynichLab/blob/main";

const outcomeValues = new Set([
  "supportive",
  "negative",
  "inconclusive",
  "methodological",
  "superseded",
]);

const experimentRequired = [
  "id",
  "title",
  "status",
  "outcome",
  "question",
  "result",
  "interpretation",
  "limitations",
  "trainFolios",
  "testFolios",
  "commands",
  "reportPath",
  "dataTablePaths",
  "sourceScript",
  "sequenceIndex",
];

const milestoneRequired = ["id", "title", "date", "summary", "type", "tag", "sequenceIndex"];
const releaseRequired = ["tag", "title", "date", "tagObject", "targetCommit", "summary"];

function rel(...parts) {
  return path.join(root, ...parts);
}

function posixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(rel(relativePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(sourceRelative, targetPath) {
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(rel(sourceRelative), targetPath);
}

function sha256(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

function validateObject(required, object, label, errors) {
  for (const key of required) {
    if (!(key in object)) errors.push(`${label}: missing ${key}`);
  }
}

function validateRegistry({ strictArtifacts = true } = {}) {
  const errors = [];
  const experiments = readJson("research-feed/experiments.json");
  const milestones = readJson("research-feed/milestones.json");
  const releases = readJson("research-feed/releases.json");

  const experimentIds = new Set();
  for (const experiment of experiments) {
    validateObject(experimentRequired, experiment, `experiment ${experiment.id || "unknown"}`, errors);
    if (experimentIds.has(experiment.id)) errors.push(`duplicate experiment id: ${experiment.id}`);
    experimentIds.add(experiment.id);
    if (!outcomeValues.has(experiment.outcome)) errors.push(`${experiment.id}: invalid outcome ${experiment.outcome}`);
    for (const key of ["limitations", "trainFolios", "testFolios", "commands", "dataTablePaths"]) {
      if (!Array.isArray(experiment[key])) errors.push(`${experiment.id}: ${key} must be an array`);
    }
    for (const file of [experiment.reportPath, experiment.sourceScript, ...(experiment.dataTablePaths || [])]) {
      if (!fs.existsSync(rel(file))) errors.push(`${experiment.id}: missing source file ${file}`);
    }
    if (strictArtifacts) {
      const artifact = path.join(publicDir, experiment.id);
      for (const file of ["manifest.json", "summary.md", "metrics.json", "provenance.json", "checksums.txt"]) {
        if (!fs.existsSync(path.join(artifact, file))) errors.push(`${experiment.id}: missing public artifact ${file}`);
      }
    }
  }

  const milestoneIds = new Set();
  for (const milestone of milestones) {
    validateObject(milestoneRequired, milestone, `milestone ${milestone.id || "unknown"}`, errors);
    if (milestoneIds.has(milestone.id)) errors.push(`duplicate milestone id: ${milestone.id}`);
    milestoneIds.add(milestone.id);
  }

  const releaseTags = new Set();
  for (const release of releases) {
    validateObject(releaseRequired, release, `release ${release.tag || "unknown"}`, errors);
    if (releaseTags.has(release.tag)) errors.push(`duplicate release tag: ${release.tag}`);
    releaseTags.add(release.tag);
  }

  validateChecksums(errors);

  const windowsPathHits = [];
  for (const file of [
    ...walkFiles(registryDir),
    ...walkFiles(publicDir),
    ...walkFiles(path.join(root, "apps", "portal")),
  ]) {
    const text = fs.readFileSync(file, "utf8");
    if (/[A-Za-z]:\\/.test(text)) windowsPathHits.push(posixPath(path.relative(root, file)));
    if (/(sk_live_|pk_live_|SECRET_KEY|PRIVATE_KEY)/i.test(text)) {
      errors.push(`possible secret in ${posixPath(path.relative(root, file))}`);
    }
  }
  for (const hit of windowsPathHits) errors.push(`absolute Windows path in ${hit}`);

  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
    process.exitCode = 1;
    return false;
  }

  console.log(`Registry validation passed: ${experiments.length} experiments, ${milestones.length} milestones, ${releases.length} releases.`);
  return true;
}

function validateChecksums(errors) {
  for (const experimentDir of fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : []) {
    const checksumPath = path.join(publicDir, experimentDir, "checksums.txt");
    if (!fs.existsSync(checksumPath)) continue;
    const lines = fs.readFileSync(checksumPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const [expected, relative] = line.split(/\s+/, 2);
      const file = path.join(publicDir, experimentDir, relative);
      if (!fs.existsSync(file)) {
        errors.push(`${experimentDir}: checksum target missing ${relative}`);
        continue;
      }
      const actual = sha256(file);
      if (actual !== expected) errors.push(`${experimentDir}: checksum mismatch ${relative}`);
    }
  }
}

function exportExperiment(experiment) {
  const dir = path.join(publicDir, experiment.id);
  const tablesDir = path.join(dir, "tables");
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(tablesDir);

  const manifest = {
    schemaVersion: "1.0",
    id: experiment.id,
    title: experiment.title,
    status: experiment.status,
    outcome: experiment.outcome,
    question: experiment.question,
    result: experiment.result,
    interpretation: experiment.interpretation,
    limitations: experiment.limitations,
    commit: experiment.commit || null,
    tag: experiment.tag || null,
    publishedAt: experiment.publishedAt || null,
    commands: experiment.commands,
    reportPath: experiment.reportPath,
    sourceScript: experiment.sourceScript,
  };

  const provenance = {
    trainFolios: experiment.trainFolios,
    testFolios: experiment.testFolios,
    inputs: [experiment.reportPath, ...experiment.dataTablePaths],
    script: experiment.sourceScript,
    frozenArtifacts: [],
    generatedBy: "VoynichLab",
  };

  writeJson(path.join(dir, "manifest.json"), manifest);
  writeJson(path.join(dir, "metrics.json"), experiment.metrics || {});
  writeJson(path.join(dir, "provenance.json"), provenance);
  copyFile(experiment.reportPath, path.join(dir, "summary.md"));

  for (const table of experiment.dataTablePaths) {
    copyFile(table, path.join(tablesDir, path.basename(table)));
  }

  const checksumTargets = walkFiles(dir)
    .filter((file) => path.basename(file) !== "checksums.txt")
    .sort();
  const checksums = checksumTargets
    .map((file) => `${sha256(file)}  ${posixPath(path.relative(dir, file))}`)
    .join("\n");
  fs.writeFileSync(path.join(dir, "checksums.txt"), `${checksums}\n`);
}

function buildPortalData() {
  fs.rmSync(portalDataDir, { recursive: true, force: true });
  ensureDir(path.join(portalDataDir, "research-feed"));
  ensureDir(path.join(portalDataDir, "artifacts", "public"));

  for (const file of ["experiments.json", "milestones.json", "releases.json"]) {
    copyFile(path.join("research-feed", file), path.join(portalDataDir, "research-feed", file));
  }

  if (fs.existsSync(publicDir)) {
    for (const experiment of fs.readdirSync(publicDir)) {
      const source = path.join(publicDir, experiment);
      const target = path.join(portalDataDir, "artifacts", "public", experiment);
      for (const file of walkFiles(source)) {
        const relative = path.relative(source, file);
        ensureDir(path.dirname(path.join(target, relative)));
        fs.copyFileSync(file, path.join(target, relative));
      }
    }
  }
}

function buildAll() {
  const experiments = readJson("research-feed/experiments.json");
  for (const experiment of experiments) exportExperiment(experiment);
  buildPortalData();
  console.log(`Built ${experiments.length} public experiment artifacts and portal data.`);
}

function publishOne(id) {
  const experiments = readJson("research-feed/experiments.json");
  const experiment = experiments.find((entry) => entry.id === id);
  if (!experiment) {
    console.error(`Unknown experiment: ${id}`);
    process.exit(1);
  }
  exportExperiment(experiment);
  buildPortalData();
  console.log(`Prepared public artifact for ${id}. No commit, tag, or push was performed.`);
}

function printHelp() {
  console.log(`Usage:
  node packages/lab-exporter/src/cli.js validate
  node packages/lab-exporter/src/cli.js build
  node packages/lab-exporter/src/cli.js publish --experiment <id>`);
}

const [command, ...args] = process.argv.slice(2);

if (command === "validate") {
  validateRegistry({ strictArtifacts: false });
} else if (command === "build") {
  if (validateRegistry({ strictArtifacts: false })) {
    buildAll();
    validateRegistry({ strictArtifacts: true });
  }
} else if (command === "publish") {
  const experimentIndex = args.indexOf("--experiment");
  const id = experimentIndex >= 0 ? args[experimentIndex + 1] : null;
  if (!id) {
    console.error("publish requires --experiment <id>");
    process.exit(1);
  }
  if (validateRegistry({ strictArtifacts: false })) {
    publishOne(id);
    validateRegistry({ strictArtifacts: true });
  }
} else {
  printHelp();
  process.exit(command ? 1 : 0);
}
