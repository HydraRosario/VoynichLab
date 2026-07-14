#!/usr/bin/env node
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const registryDir = path.join(root, "research-feed");
const publicDir = path.join(root, "artifacts", "public");
const portalDataDir = path.join(root, "apps", "portal", "data");
const repoBlob = "https://github.com/HydraRosario/VoynichLab/blob/main";

const outcomeValues = new Set([
  "pending", "supportive", "negative", "inconclusive", "methodological", "superseded",
]);

const experimentRequired = [
  "id", "title", "status", "outcome", "question", "result", "interpretation",
  "limitations", "trainFolios", "testFolios", "commands", "reportPath",
  "dataTablePaths", "sourceScript", "sequenceIndex",
];

const milestoneRequired = ["id", "title", "date", "summary", "type", "tag", "sequenceIndex"];
const releaseRequired = ["tag", "title", "date", "tagObject", "targetCommit", "summary"];

const HIGH_RISK_DIRS = ["DataSetCreator", "EVAComparisonLab/backups"];
const DB_PATTERNS = ["*.db", "*.sqlite", "*.sqlite3"];
const GENERATED_DIRS = [
  "EVAComparisonLab/artifacts/visual-snapshots/current",
  "EVAComparisonLab/artifacts/visual-snapshots/pre-audit-",
  "apps/portal/data",
  "artifacts/public",
];

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

function isTextLikeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return new Set([
    ".css",
    ".csv",
    ".html",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".svg",
    ".ts",
    ".tsx",
    ".txt",
    ".xml",
    ".yml",
    ".yaml",
  ]).has(ext);
}

function validateObject(required, object, label, errors) {
  for (const key of required) {
    if (!(key in object)) errors.push(`${label}: missing ${key}`);
  }
}

function isGitClean() {
  try {
    const status = execSync("git status --porcelain", { encoding: "utf8", cwd: root }).trim();
    return status.length === 0;
  } catch {
    return null;
  }
}

function gitChangedFiles() {
  try {
    const status = execSync("git status --porcelain", { encoding: "utf8", cwd: root }).trim();
    if (!status) return [];
    return status.split("\n").map((line) => {
      const parts = line.trim().split(/\s+/, 2);
      return { status: parts[0], file: parts[1] };
    });
  } catch {
    return [];
  }
}

function summarizeChangedFiles(files) {
  const groups = new Map();
  for (const f of files) {
    const group = GENERATED_DIRS.find((dir) => f.file.startsWith(dir)) || f.file.split("/").slice(0, 2).join("/");
    const current = groups.get(group) || { count: 0, examples: [] };
    current.count += 1;
    if (current.examples.length < 3) current.examples.push(`${f.status} ${f.file}`);
    groups.set(group, current);
  }
  return [...groups.entries()].sort((a, b) => b[1].count - a[1].count);
}

function printChangeSummary(files, label = "Changed files") {
  if (files.length === 0) {
    console.log(`${label}: none.`);
    return;
  }
  console.log(`${label}: ${files.length}`);
  for (const [group, info] of summarizeChangedFiles(files)) {
    console.log(`  ${group}: ${info.count}`);
    for (const example of info.examples) console.log(`    ${example}`);
    if (info.count > info.examples.length) console.log(`    ... ${info.count - info.examples.length} more`);
  }
}

function isHighRiskChange(filePath) {
  return HIGH_RISK_DIRS.some((dir) => filePath.startsWith(dir));
}

function isDbFile(filePath) {
  return DB_PATTERNS.some((pat) => {
    const ext = pat.replace("*", "");
    return filePath.endsWith(ext);
  });
}

function isDirty(dir) {
  return gitChangedFiles().some((f) => f.file.startsWith(dir));
}

function validateRegistry({ strictArtifacts = true, strictPending = true } = {}) {
  const errors = [];
  const warnings = [];
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

    if (experiment.limitations && !Array.isArray(experiment.limitations)) errors.push(`${experiment.id}: limitations must be array`);
    else if (experiment.limitations && experiment.limitations.length === 0 && experiment.outcome !== "pending") {
      warnings.push(`${experiment.id}: limitations is empty for non-pending outcome`);
    }

    if (experiment.commands && (!Array.isArray(experiment.commands) || experiment.commands.length === 0)) {
      errors.push(`${experiment.id}: commands must be a non-empty array`);
    }

    if (!fs.existsSync(rel(experiment.reportPath))) errors.push(`${experiment.id}: reportPath not found ${experiment.reportPath}`);
    if (!fs.existsSync(rel(experiment.sourceScript))) errors.push(`${experiment.id}: sourceScript not found ${experiment.sourceScript}`);
    for (const file of experiment.dataTablePaths || []) {
      if (!fs.existsSync(rel(file))) errors.push(`${experiment.id}: dataTablePath not found ${file}`);
    }

    if (experiment.status === "published" && strictPending) {
      if (!experiment.commit || experiment.commit === "pending") errors.push(`${experiment.id}: published but commit is pending`);
      if (!experiment.tag || experiment.tag === "pending") errors.push(`${experiment.id}: published but tag is pending`);
    }

    if (experiment.metrics && experiment.outcome !== "pending") {
      if (typeof experiment.metrics !== "object" || Object.keys(experiment.metrics).length === 0) {
        warnings.push(`${experiment.id}: metrics object is empty for non-pending outcome`);
      }
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

  if (strictArtifacts) validateChecksums(errors);

  const windowsPathHits = [];
  for (const dir of [registryDir, publicDir, path.join(root, "apps", "portal")]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walkFiles(dir)) {
      if (!isTextLikeFile(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      if (/[A-Za-z]:\\/.test(text)) windowsPathHits.push(posixPath(path.relative(root, file)));
      if (/(sk_live_|pk_live_|SECRET_KEY|PRIVATE_KEY)/i.test(text)) {
        errors.push(`possible secret in ${posixPath(path.relative(root, file))}`);
      }
    }
  }
  for (const hit of windowsPathHits) errors.push(`absolute Windows path in ${hit}`);

  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
  }
  if (warnings.length) {
    for (const w of warnings) console.warn(`WARN ${w}`);
  }

  if (errors.length === 0) {
    console.log(`OK: ${experiments.length} experiments, ${milestones.length} milestones, ${releases.length} releases.`);
    return true;
  }
  process.exitCode = 1;
  return false;
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

function makeSummary(experiment) {
  const lines = [];
  lines.push(`# ${experiment.title}`);
  lines.push("");
  lines.push(`**Status:** ${experiment.status} | **Outcome:** ${experiment.outcome}`);
  lines.push("");
  lines.push("## Question");
  lines.push("");
  lines.push(experiment.question);
  lines.push("");
  lines.push(`## Result`);
  lines.push("");
  lines.push(experiment.result);
  lines.push("");
  lines.push(`## Interpretation`);
  lines.push("");
  lines.push(experiment.interpretation);
  lines.push("");
  lines.push(`## Limitations`);
  for (const lim of experiment.limitations || []) {
    lines.push(`- ${lim}`);
  }
  lines.push("");
  lines.push(`## Reproduce`);
  for (const cmd of experiment.commands || []) {
    lines.push("```bash");
    lines.push(cmd);
    lines.push("```");
  }
  lines.push("");
  lines.push(`## Artifacts`);
  lines.push(`- Report: \`${experiment.reportPath}\``);
  lines.push(`- Script: \`${experiment.sourceScript}\``);
  if (experiment.dataTablePaths) {
    for (const t of experiment.dataTablePaths) {
      lines.push(`- Table: \`${t}\``);
    }
  }
  lines.push(`- Commit: \`${experiment.commit || "—"}\``);
  lines.push(`- Tag: \`${experiment.tag || "—"}\``);
  if (experiment.trainFolios && experiment.trainFolios.length) {
    lines.push(`- Train folios: ${experiment.trainFolios.join(", ")}`);
  }
  if (experiment.testFolios && experiment.testFolios.length) {
    lines.push(`- Test folios: ${experiment.testFolios.join(", ")}`);
  }
  lines.push("");
  return lines.join("\n");
}

function normalizeMetrics(experiment) {
  const raw = experiment.metrics || {};
  const metrics = { primary: [], secondary: [] };
  const primaryKeys = [
    "atomsNormalizedLogLoss", "evaNormalizedLogLoss", "atomsMinusEvaNormalizedLogLoss",
    "atomsTop1Accuracy", "evaTop1Accuracy", "atomsUnseenContextRate", "evaUnseenContextRate",
    "atomsOutOfVocabularySymbols",
  ];
  for (const key of primaryKeys) {
    if (key in raw) {
      const unit = key.includes("Rate") || key.includes("Accuracy") ? "ratio" : key.includes("LogLoss") ? "bits" : null;
      const direction = key.includes("LogLoss") || key.includes("Unseen") || key.includes("OOV") ? "lower-is-better" : "higher-is-better";
      metrics.primary.push({ label: key, value: raw[key], unit, direction });
    }
  }
  for (const [key, value] of Object.entries(raw)) {
    if (!primaryKeys.includes(key)) {
      metrics.secondary.push({ label: key, value, unit: null, direction: null });
    }
  }
  return metrics;
}

function exportExperiment(experiment) {
  const dir = path.join(publicDir, experiment.id);
  const tablesDir = path.join(dir, "tables");
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(tablesDir);

  const includedFiles = [];

  const manifest = {
    schemaVersion: "2.0",
    id: experiment.id,
    title: experiment.title,
    status: experiment.status,
    outcome: experiment.outcome,
    question: experiment.question,
    result: experiment.result,
    interpretation: experiment.interpretation,
    limitations: experiment.limitations,
    trainFolios: experiment.trainFolios,
    testFolios: experiment.testFolios,
    commit: experiment.commit || null,
    tag: experiment.tag || null,
    publishedAt: experiment.publishedAt || null,
    commands: experiment.commands,
    reportPath: experiment.reportPath,
    sourceScript: experiment.sourceScript,
    generatedAt: new Date().toISOString().split("T")[0],
    files: [],
    checksums: {},
  };

  const provenance = {
    trainFolios: experiment.trainFolios,
    testFolios: experiment.testFolios,
    inputs: [experiment.reportPath, ...experiment.dataTablePaths].filter(Boolean),
    script: experiment.sourceScript,
    sourceScript: experiment.sourceScript,
    commands: experiment.commands,
    commit: experiment.commit || null,
    tag: experiment.tag || null,
    generatedAt: new Date().toISOString().split("T")[0],
    generatedBy: "VoynichLab/research:publish",
    frozenArtifacts: [],
  };

  const metrics = normalizeMetrics(experiment);

  writeJson(path.join(dir, "metrics.json"), metrics);
  writeJson(path.join(dir, "provenance.json"), provenance);

  const summary = makeSummary(experiment);
  fs.writeFileSync(path.join(dir, "summary.md"), summary);
  includedFiles.push("summary.md");

  copyFile(experiment.reportPath, path.join(dir, "report.md"));
  includedFiles.push("report.md");

  for (const table of experiment.dataTablePaths || []) {
    copyFile(table, path.join(tablesDir, path.basename(table)));
    includedFiles.push(`tables/${path.basename(table)}`);
  }

  manifest.files = includedFiles;
  for (const f of includedFiles) {
    const fullPath = path.join(dir, f);
    if (fs.existsSync(fullPath)) {
      manifest.checksums[f] = sha256(fullPath);
    }
  }
  writeJson(path.join(dir, "manifest.json"), manifest);

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

  for (const file of ["experiments.json", "milestones.json", "releases.json", "site.json"]) {
    const src = path.join("research-feed", file);
    if (fs.existsSync(rel(src))) {
      copyFile(src, path.join(portalDataDir, "research-feed", file));
    }
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

  const extraFiles = ["evidence-cases.json"];
  for (const file of extraFiles) {
    if (fs.existsSync(rel(file))) {
      copyFile(file, path.join(portalDataDir, file));
    }
  }

  const extraDirs = ["atom-atlas"];
  for (const dir of extraDirs) {
    const dirPath = rel(dir);
    if (fs.existsSync(dirPath)) {
      const target = path.join(portalDataDir, dir);
      for (const file of walkFiles(dirPath)) {
        const relative = path.relative(dirPath, file);
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

function doctor() {
  let allOk = true;

  const changedFiles = gitChangedFiles();
  const dirtyHighRisk = changedFiles.filter((f) => isHighRiskChange(f.file));
  const dirtyDbFiles = changedFiles.filter((f) => isDbFile(f.file));
  const dsCreatorDirty = isDirty("DataSetCreator");

  printChangeSummary(changedFiles, "Working tree changes");

  if (dirtyHighRisk.length > 0) {
    console.warn(`WARN High-risk directories have uncommitted changes:`);
    for (const f of dirtyHighRisk) console.warn(`     ${f.status} ${f.file}`);
  }

  if (dirtyDbFiles.length > 0) {
    console.warn(`WARN Database files detected in working tree:`);
    for (const f of dirtyDbFiles) console.warn(`     ${f.status} ${f.file}`);
  }

  if (dsCreatorDirty) {
    console.warn(`WARN DataSetCreator has uncommitted changes — review before publishing.`);
  }

  const experiments = readJson("research-feed/experiments.json");
  for (const experiment of experiments) {
    if (!fs.existsSync(rel(experiment.reportPath))) {
      console.error(`ERROR ${experiment.id}: reportPath missing — ${experiment.reportPath}`);
      allOk = false;
    }
    if (!fs.existsSync(rel(experiment.sourceScript))) {
      console.error(`ERROR ${experiment.id}: sourceScript missing — ${experiment.sourceScript}`);
      allOk = false;
    }
    for (const table of experiment.dataTablePaths || []) {
      if (!fs.existsSync(rel(table))) {
        console.error(`ERROR ${experiment.id}: dataTablePath missing — ${table}`);
        allOk = false;
      }
    }

    if (experiment.status === "published") {
      if (!experiment.commit || experiment.commit === "pending") {
        console.warn(`WARN ${experiment.id}: published but commit is pending`);
      }
      if (!experiment.tag || experiment.tag === "pending") {
        console.warn(`WARN ${experiment.id}: published but tag is pending`);
      }
    }

    const artifact = path.join(publicDir, experiment.id);
    for (const file of ["manifest.json", "summary.md", "metrics.json", "provenance.json", "checksums.txt"]) {
      if (!fs.existsSync(path.join(artifact, file))) {
        console.warn(`WARN ${experiment.id}: missing artifact ${file} (run research:build)`);
      }
    }
  }

  const portalExperiments = path.join(portalDataDir, "research-feed", "experiments.json");
  if (!fs.existsSync(portalExperiments)) {
    console.warn(`WARN Portal data missing (run research:build)`);
  } else {
    const portalExps = readJson("research-feed/experiments.json");
    if (portalExps.length !== experiments.length) {
      console.warn(`WARN Portal data out of sync: ${portalExps.length} vs ${experiments.length} experiments`);
    }
  }

  const paperDir = rel("paper");
  if (fs.existsSync(paperDir)) {
    for (const file of ["CLAIMS.md", "OUTLINE.md", "FIGURES.md", "LITERATURE.md", "NOVELTY-MATRIX.md"]) {
      if (!fs.existsSync(path.join(paperDir, file))) {
        console.warn(`WARN paper/${file} not found`);
      }
    }
  }

  console.log("Doctor scan complete.");
  if (!allOk) process.exitCode = 1;
}

function stagePlan(id) {
  const experiments = readJson("research-feed/experiments.json");
  const experiment = experiments.find((entry) => entry.id === id);
  if (!experiment) {
    console.error(`Unknown experiment: ${id}`);
    process.exit(1);
  }

  const changedFiles = gitChangedFiles();

  console.log(`Staging plan for: ${experiment.id}`);
  console.log(`Title: ${experiment.title}`);
  console.log(`Status: ${experiment.status} | Outcome: ${experiment.outcome}`);
  console.log("");

  const proposedFiles = [
    "research-feed/experiments.json",
    "research-feed/milestones.json",
    "research-feed/releases.json",
    "research-feed/site.json",
    experiment.reportPath,
    experiment.sourceScript,
    ...experiment.dataTablePaths,
    `artifacts/public/${experiment.id}/`,
    `apps/portal/data/`,
  ];

  console.log("Files that would be staged for publishing:");
  for (const f of proposedFiles) {
    if (fs.existsSync(rel(f))) console.log(`  + ${f}`);
    else console.log(`  ? ${f} (not found)`);
  }
  console.log("");

  const dirty = changedFiles.filter((f) => !proposedFiles.some((pf) => f.file.startsWith(pf)));
  if (dirty.length > 0) {
    printChangeSummary(dirty, "Unrelated modified files (not included in this publish)");
  } else {
    console.log("No unrelated modified files detected.");
  }

  const highRisk = dirty.filter((f) => isHighRiskChange(f.file));
  if (highRisk.length > 0) {
    console.warn("WARN High-risk directories with uncommitted changes:");
    for (const f of highRisk) console.warn(`     ${f.status} ${f.file}`);
  }

  const dbFiles = dirty.filter((f) => isDbFile(f.file));
  if (dbFiles.length > 0) {
    console.warn("WARN Database files in working tree:");
    for (const f of dbFiles) console.warn(`     ${f.status} ${f.file}`);
  }

  if (isDirty("DataSetCreator")) {
    console.warn("WARN DataSetCreator has changes. Review before staging.");
  }
}

function printHelp() {
  console.log(`VoynichLab Research Publisher

Usage:
  research:validate              Validate registry and artifacts
  research:build                 Build all artifacts and portal data
  research:publish --experiment <id>  Publish a single experiment
  research:doctor                Full health check
  research:stage-plan --experiment <id>  Show staging plan for experiment

Examples:
  npm.cmd run research:validate
  npm.cmd run research:build
  npm.cmd run research:publish -- --experiment prospective-atoms-eva-test-v1
  npm.cmd run research:doctor
  npm.cmd run research:stage-plan -- --experiment prospective-atoms-eva-test-v1`);
}

const [command, ...args] = process.argv.slice(2);

if (command === "validate") {
  validateRegistry({ strictArtifacts: false });
} else if (command === "build") {
  if (validateRegistry({ strictArtifacts: false })) {
    buildAll();
    console.log("Verifying built artifacts...");
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
} else if (command === "doctor") {
  doctor();
} else if (command === "stage-plan") {
  const experimentIndex = args.indexOf("--experiment");
  const id = experimentIndex >= 0 ? args[experimentIndex + 1] : null;
  if (!id) {
    console.error("stage-plan requires --experiment <id>");
    process.exit(1);
  }
  stagePlan(id);
} else {
  printHelp();
  process.exit(command ? 1 : 0);
}
