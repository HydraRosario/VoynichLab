#!/usr/bin/env node
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const registryDir = path.join(root, "research", "registry");
const publicDir = path.join(root, "research", "artifacts", "public");
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

const HIGH_RISK_DIRS = ["apps/dataset-creator", "labs/eva-comparison/backups"];
const DB_PATTERNS = ["*.db", "*.sqlite", "*.sqlite3"];
const GENERATED_DIRS = [
  "labs/eva-comparison/artifacts/visual-snapshots/current",
  "labs/eva-comparison/artifacts/visual-snapshots/pre-audit-",
  "apps/portal/data",
  "labs/eva-comparison/cases/",
  "research/audits/",
  "research/corpus-revisions/",
];
const PUBLIC_ARTIFACT_DIRS = ["research/artifacts/public"];

const LOCAL_STATE_DIRS = [
  ".vercel",
  "apps/portal/.vercel",
  "node_modules",
  "apps/dataset-creator/src-tauri/target",
  "target",
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

function normalizedTextSha256(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(text).digest("hex");
}

function portableArtifactSha256(filePath) {
  return isTextLikeFile(filePath) ? normalizedTextSha256(filePath) : sha256(filePath);
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
    ".tsv",
    ".txt",
    ".xml",
    ".yml",
    ".yaml",
  ]).has(ext);
}

function trackedTextFiles() {
  let tracked = [];
  try {
    tracked = execSync("git -c core.quotePath=false ls-files", { encoding: "utf8", cwd: root })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
  return tracked
    .map((file) => rel(file))
    .filter((file) => fs.existsSync(file) && isTextLikeFile(file));
}

function validateObject(required, object, label, errors) {
  for (const key of required) {
    if (!(key in object)) errors.push(`${label}: missing ${key}`);
  }
}

function isPlaceholderValue(value) {
  return typeof value === "string" && /to-be-filled|replace-me|placeholder/i.test(value);
}

function isGitClean() {
  try {
    const status = execSync("git status --porcelain --untracked-files=all", { encoding: "utf8", cwd: root }).trim();
    return status.length === 0;
  } catch {
    return null;
  }
}

function gitChangedFiles() {
  try {
    const status = execSync("git status --porcelain --untracked-files=all", { encoding: "utf8", cwd: root }).trim();
    if (!status) return [];
    return status.split("\n").map((line) => {
      return { status: line.slice(0, 2).trim(), file: line.slice(2).trimStart() };
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

function isGeneratedFile(filePath) {
  return GENERATED_DIRS.some((dir) => filePath.startsWith(dir));
}

function isPublicArtifactFile(filePath) {
  return PUBLIC_ARTIFACT_DIRS.some((dir) => filePath.startsWith(dir));
}

function isDirty(dir) {
  return gitChangedFiles().some((f) => f.file.startsWith(dir));
}

function validateRegistry({ strictArtifacts = true, strictPending = true } = {}) {
  const errors = [];
  const warnings = [];
  const experiments = readJson("research/registry/experiments.json");
  const milestones = readJson("research/registry/milestones.json");
  const releases = readJson("research/registry/releases.json");

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
      if (isPlaceholderValue(experiment.commit)) errors.push(`${experiment.id}: published but commit is a placeholder`);
      if (isPlaceholderValue(experiment.tag)) errors.push(`${experiment.id}: published but tag is a placeholder`);
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
    if (milestone.tag && isPlaceholderValue(milestone.tag)) errors.push(`${milestone.id}: tag is a placeholder`);
    if (milestone.commit && isPlaceholderValue(milestone.commit)) errors.push(`${milestone.id}: commit is a placeholder`);
    if (!milestone.tag && !(milestone.links?.length)) errors.push(`${milestone.id}: an untagged milestone requires a public link`);
  }

  const releaseTags = new Set();
  for (const release of releases) {
    validateObject(releaseRequired, release, `release ${release.tag || "unknown"}`, errors);
    if (releaseTags.has(release.tag)) errors.push(`duplicate release tag: ${release.tag}`);
    releaseTags.add(release.tag);
    for (const key of releaseRequired) {
      if (isPlaceholderValue(release[key])) errors.push(`${release.tag}: ${key} is a placeholder`);
    }
  }

  if (strictArtifacts) validateChecksums(errors);

  const windowsPathHits = [];
  for (const file of trackedTextFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (/[A-Za-z]:\\/.test(text)) windowsPathHits.push(posixPath(path.relative(root, file)));
    if (/(sk_live_[A-Za-z0-9_]+|pk_live_[A-Za-z0-9_]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/i.test(text)) {
      errors.push(`possible secret in ${posixPath(path.relative(root, file))}`);
    }
  }
  for (const hit of windowsPathHits) errors.push(`absolute Windows path in ${hit}`);
  for (const hit of nonCanonicalKnownLabelingLedgers()) {
    errors.push(`non-canonical known-labeling anomaly ledger: ${hit}`);
  }
  for (const script of unregisteredEvaComparisonScripts()) {
    errors.push(`EVA comparison script missing from registry: ${script}`);
  }
  for (const script of unregisteredDatasetCreatorScripts()) {
    errors.push(`DataSetCreator script missing from registry: ${script}`);
  }

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
      const rawActual = sha256(file);
      const normalizedActual = isTextLikeFile(file) ? normalizedTextSha256(file) : rawActual;
      if (rawActual !== expected && normalizedActual !== expected) {
        errors.push(`${experimentDir}: checksum mismatch ${relative}`);
      }
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
  if (fs.existsSync(dir) && process.env.VOYNICHLAB_OVERWRITE_PUBLIC_ARTIFACTS !== "1") {
    return;
  }

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
      manifest.checksums[f] = portableArtifactSha256(fullPath);
    }
  }
  writeJson(path.join(dir, "manifest.json"), manifest);

  writeArtifactChecksums(dir);
}

function writeArtifactChecksums(dir) {
  const checksumTargets = walkFiles(dir)
    .filter((file) => path.basename(file) !== "checksums.txt")
    .sort();
  const checksums = checksumTargets
    .map((file) => `${portableArtifactSha256(file)}  ${posixPath(path.relative(dir, file))}`)
    .join("\n");
  fs.writeFileSync(path.join(dir, "checksums.txt"), `${checksums}\n`);
}

function refreshPublicChecksums() {
  if (!fs.existsSync(publicDir)) return;
  for (const entry of fs.readdirSync(publicDir)) {
    const dir = path.join(publicDir, entry);
    if (fs.statSync(dir).isDirectory()) {
      writeArtifactChecksums(dir);
    }
  }
  buildPortalData();
}

function buildPortalData() {
  fs.rmSync(portalDataDir, { recursive: true, force: true });
  ensureDir(path.join(portalDataDir, "registry"));
  ensureDir(path.join(portalDataDir, "artifacts", "public"));

  for (const file of ["experiments.json", "milestones.json", "releases.json", "site.json"]) {
    const src = path.join("research", "registry", file);
    if (fs.existsSync(rel(src))) {
      copyFile(src, path.join(portalDataDir, "registry", file));
    }
  }

  if (fs.existsSync(publicDir)) {
    for (const experiment of fs.readdirSync(publicDir)) {
      const source = path.join(publicDir, experiment);
      if (!fs.statSync(source).isDirectory()) continue;
      const target = path.join(portalDataDir, "artifacts", "public", experiment);
      for (const file of walkFiles(source)) {
        const relative = path.relative(source, file);
        ensureDir(path.dirname(path.join(target, relative)));
        fs.copyFileSync(file, path.join(target, relative));
      }
    }
  }

  const evidenceCases = "research/registry/evidence-cases.json";
  if (fs.existsSync(rel(evidenceCases))) {
    copyFile(evidenceCases, path.join(portalDataDir, "evidence-cases.json"));
  }
  const atomInventory = "apps/portal/source-data/atoms-v1.json";
  if (fs.existsSync(rel(atomInventory))) copyFile(atomInventory, path.join(portalDataDir, "atoms-v1.json"));

}

function buildAll() {
  const experiments = readJson("research/registry/experiments.json");
  for (const experiment of experiments) exportExperiment(experiment);
  buildPortalData();
  console.log(`Built ${experiments.length} public experiment artifacts and portal data.`);
}

function publishOne(id) {
  const experiments = readJson("research/registry/experiments.json");
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
  const dsCreatorDirty = isDirty("apps/dataset-creator");

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

  const experiments = readJson("research/registry/experiments.json");
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

  const portalExperiments = path.join(portalDataDir, "registry", "experiments.json");
  if (!fs.existsSync(portalExperiments)) {
    console.warn(`WARN Portal data missing (run research:build)`);
  } else {
    const portalExps = JSON.parse(fs.readFileSync(portalExperiments, "utf8"));
    if (portalExps.length !== experiments.length) {
      console.warn(`WARN Portal data out of sync: ${portalExps.length} portal vs ${experiments.length} registry experiments`);
    }
  }

  const publicationsDir = rel("research/publications");
  if (fs.existsSync(publicationsDir)) {
    for (const file of ["CLAIMS.md", "OUTLINE.md", "FIGURES.md", "LITERATURE.md", "NOVELTY-MATRIX.md"]) {
      if (!fs.existsSync(path.join(publicationsDir, file))) {
        console.warn(`WARN research/publications/${file} not found`);
      }
    }
  }

  console.log("Doctor scan complete.");
  if (!allOk) process.exitCode = 1;
}

function stagePlan(id) {
  const experiments = readJson("research/registry/experiments.json");
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
    "research/registry/experiments.json",
    "research/registry/milestones.json",
    "research/registry/releases.json",
    "research/registry/site.json",
    experiment.reportPath,
    experiment.sourceScript,
    ...experiment.dataTablePaths,
    `research/artifacts/public/${experiment.id}/`,
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

  if (isDirty("apps/dataset-creator")) {
    console.warn("WARN DataSetCreator has changes. Review before staging.");
  }
}

function repoAudit() {
  const changedFiles = gitChangedFiles();
  const highRisk = changedFiles.filter((f) => isHighRiskChange(f.file));
  const dbFiles = changedFiles.filter((f) => isDbFile(f.file) && !isGeneratedFile(f.file));
  const generated = changedFiles.filter((f) => isGeneratedFile(f.file));
  const publicArtifacts = changedFiles.filter((f) => isPublicArtifactFile(f.file));
  const localState = LOCAL_STATE_DIRS.filter((dir) => fs.existsSync(rel(dir)));

  console.log("VoynichLab repo audit");
  console.log("=====================");
  console.log("");
  console.log(`Working tree clean: ${changedFiles.length === 0 ? "yes" : "no"}`);
  printChangeSummary(changedFiles, "Working tree changes");
  console.log("");

  if (highRisk.length) {
    console.warn("WARN High-risk changes:");
    for (const f of highRisk.slice(0, 25)) console.warn(`     ${f.status} ${f.file}`);
    if (highRisk.length > 25) console.warn(`     ... ${highRisk.length - 25} more`);
  } else {
    console.log("High-risk changes: none detected.");
  }

  if (dbFiles.length) {
    console.warn("WARN Database files in working tree:");
    for (const f of dbFiles) console.warn(`     ${f.status} ${f.file}`);
  } else {
    console.log("Database files in working tree: none detected.");
  }

  console.log("");
  console.log(`Generated/scratch-looking changes: ${generated.length}`);
  for (const [group, info] of summarizeChangedFiles(generated)) {
    console.log(`  ${group}: ${info.count}`);
  }

  console.log("");
  console.log(`Public artifact changes: ${publicArtifacts.length}`);
  for (const [group, info] of summarizeChangedFiles(publicArtifacts)) {
    console.log(`  ${group}: ${info.count}`);
  }

  console.log("");
  console.log("Local state directories present:");
  if (localState.length) {
    for (const dir of localState) console.log(`  ${dir}`);
  } else {
    console.log("  none detected");
  }

  const requiredDocs = [
    "REPOSITORY-GOVERNANCE.md",
    "docs/REPO-INVENTORY.md",
    "docs/REPO-AUDIT-PLAN.md",
    "docs/DEPLOYMENT.md",
    "docs/DATASETCREATOR-SAFETY.md",
  ];
  console.log("");
  console.log("Governance docs:");
  for (const doc of requiredDocs) {
    console.log(`  ${fs.existsSync(rel(doc)) ? "OK" : "MISSING"} ${doc}`);
  }

  const windowsPathHits = [];
  const secretHits = [];
  for (const file of trackedTextFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const relative = posixPath(path.relative(root, file));
    if (/[A-Za-z]:\\/.test(text)) windowsPathHits.push(relative);
    if (/(sk_live_[A-Za-z0-9_]+|pk_live_[A-Za-z0-9_]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/i.test(text)) {
      secretHits.push(relative);
    }
  }

  console.log("");
  if (windowsPathHits.length) {
    console.warn("WARN Absolute Windows paths in public/source text:");
    for (const hit of windowsPathHits) console.warn(`  ${hit}`);
  } else {
    console.log("Absolute Windows paths in public/source text: none detected.");
  }

  if (secretHits.length) {
    console.warn("WARN Possible secrets in public/source text:");
    for (const hit of secretHits) console.warn(`  ${hit}`);
    process.exitCode = 1;
  } else {
    console.log("Possible secrets in public/source text: none detected.");
  }

  const badLedgers = nonCanonicalKnownLabelingLedgers();
  if (badLedgers.length) {
    console.warn("WARN Non-canonical known-labeling anomaly ledgers:");
    for (const hit of badLedgers) console.warn(`  ${hit}`);
    process.exitCode = 1;
  } else {
    console.log("Known-labeling anomaly ledger location: canonical.");
  }

  const badGeometryLedgers = nonCanonicalGeometryLedgers();
  if (badGeometryLedgers.length) {
    console.warn("WARN Non-canonical particle-geometry anomaly ledgers:");
    for (const hit of badGeometryLedgers) console.warn(`  ${hit}`);
    process.exitCode = 1;
  } else {
    console.log("Particle-geometry anomaly ledger location: canonical.");
  }

  const retiredRootEntries = ["evidence-cases.json", "cases/"].filter((entry) =>
    trackedFiles().some((file) =>
      fs.existsSync(rel(file))
      && (file === entry.replace(/\/$/, "") || file.startsWith(entry))
    )
  );
  if (retiredRootEntries.length) {
    console.warn("WARN Retired root entries are tracked:");
    for (const entry of retiredRootEntries) console.warn(`  ${entry}`);
    process.exitCode = 1;
  } else {
    console.log("Retired root research entries: absent.");
  }

  const unregisteredScripts = unregisteredEvaComparisonScripts();
  if (unregisteredScripts.length) {
    console.warn("WARN EVA comparison scripts missing from registry:");
    for (const script of unregisteredScripts) console.warn(`  ${script}`);
    process.exitCode = 1;
  } else {
    console.log("EVA comparison script registry: complete.");
  }

  const unregisteredDatasetScripts = unregisteredDatasetCreatorScripts();
  if (unregisteredDatasetScripts.length) {
    console.warn("WARN DataSetCreator scripts missing from registry:");
    for (const script of unregisteredDatasetScripts) console.warn(`  ${script}`);
    process.exitCode = 1;
  } else {
    console.log("DataSetCreator script registry: complete.");
  }

  const frozenCatalogErrors = validateFrozenEvidenceCatalog();
  if (frozenCatalogErrors.length) {
    console.warn("WARN Frozen evidence catalog errors:");
    for (const error of frozenCatalogErrors) console.warn(`  ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Frozen evidence catalog: valid.");
  }

  const publicBundleErrors = validatePublicBundleInventory();
  if (publicBundleErrors.length) {
    console.warn("WARN Public artifact inventory errors:");
    for (const error of publicBundleErrors) console.warn(`  ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Public artifact inventory: one bundle per experiment.");
  }

  const portalMirrorErrors = validatePortalDataMirrors();
  if (portalMirrorErrors.length) {
    console.warn("WARN Portal data mirror errors:");
    for (const error of portalMirrorErrors) console.warn(`  ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Portal registry and evidence mirrors: current.");
  }

  const speculativeBoundaryErrors = validateSpeculativeBoundary();
  if (speculativeBoundaryErrors.length) {
    console.warn("WARN Speculative-work boundary errors:");
    for (const error of speculativeBoundaryErrors) console.warn(`  ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Translation lab boundary: isolated from public evidence.");
  }

  console.log("");
  console.log("Next safe actions:");
  console.log("  1. Keep DataSetCreator changes isolated.");
  console.log("  2. Separate generated/current outputs from source changes before committing.");
  console.log("  3. Confirm Vercel linkage before deploying the canonical portal.");
  console.log("  4. Move or delete files only after a written staging/quarantine plan.");
}

function trackedFiles() {
  try {
    return execSync("git -c core.quotePath=false ls-files", { encoding: "utf8", cwd: root })
      .split(/\r?\n/)
      .filter(Boolean)
      .map(posixPath);
  } catch {
    return [];
  }
}

function nonCanonicalKnownLabelingLedgers() {
  const canonical = "research/audits/known-labeling-anomalies.tsv";
  return trackedFiles().filter((file) =>
    file.endsWith("known-labeling-anomalies.tsv")
    && fs.existsSync(rel(file))
    && file !== canonical
    && !file.includes("/frozen/")
  );
}

function nonCanonicalGeometryLedgers() {
  const canonical = "research/audits/known-particle-geometry-anomalies.tsv";
  return trackedFiles().filter((file) =>
    file.endsWith("known-particle-geometry-anomalies.tsv")
    && fs.existsSync(rel(file))
    && file !== canonical
    && !file.includes("/frozen/")
  );
}

function unregisteredEvaComparisonScripts() {
  return unregisteredScriptsIn("labs/eva-comparison/scripts");
}

function unregisteredDatasetCreatorScripts() {
  return unregisteredScriptsIn("apps/dataset-creator/scripts");
}

function unregisteredScriptsIn(relativeDir) {
  const scriptsDir = rel(relativeDir);
  const registryPath = path.join(scriptsDir, "README.md");
  if (!fs.existsSync(scriptsDir) || !fs.existsSync(registryPath)) return [];
  const registry = fs.readFileSync(registryPath, "utf8");
  return fs.readdirSync(scriptsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name !== "README.md")
    .filter((name) => /\.(js|py|cjs|mjs)$/.test(name))
    .filter((name) => !registry.includes(`\`${name}\``))
    .map((name) => `${posixPath(relativeDir)}/${name}`);
}

function validateFrozenEvidenceCatalog() {
  const catalogPath = rel("research/frozen-evidence.json");
  if (!fs.existsSync(catalogPath)) return ["missing research/frozen-evidence.json"];
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const errors = [];
  const ids = new Set();
  let currentCorpusCount = 0;
  let tags = new Set();
  try {
    tags = new Set(execSync("git tag --list", { encoding: "utf8", cwd: root }).split(/\r?\n/).filter(Boolean));
  } catch {
    errors.push("unable to read Git tags");
  }
  for (const entry of catalog.entries ?? []) {
    if (!entry.id || ids.has(entry.id)) errors.push(`missing or duplicate id: ${entry.id ?? "unknown"}`);
    ids.add(entry.id);
    if (!entry.path || !fs.existsSync(rel(entry.path))) errors.push(`${entry.id}: missing path ${entry.path}`);
    if (!entry.tag || !tags.has(entry.tag)) errors.push(`${entry.id}: missing tag ${entry.tag}`);
    if (entry.type === "corpus-release" && entry.status === "current") currentCorpusCount += 1;
  }
  if (currentCorpusCount !== 1) errors.push(`expected exactly one current corpus release, found ${currentCorpusCount}`);
  return errors;
}

function validatePublicBundleInventory() {
  const errors = [];
  const experiments = readJson("research/registry/experiments.json");
  const expected = new Set(experiments.map((entry) => entry.id));
  const actual = new Set(
    fs.readdirSync(publicDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  );
  for (const id of expected) if (!actual.has(id)) errors.push(`missing bundle: research/artifacts/public/${id}`);
  for (const id of actual) if (!expected.has(id)) errors.push(`orphan bundle: research/artifacts/public/${id}`);
  return errors;
}

function validatePortalDataMirrors() {
  const errors = [];
  const pairs = [
    ["research/registry/experiments.json", "apps/portal/data/registry/experiments.json"],
    ["research/registry/milestones.json", "apps/portal/data/registry/milestones.json"],
    ["research/registry/releases.json", "apps/portal/data/registry/releases.json"],
    ["research/registry/site.json", "apps/portal/data/registry/site.json"],
    ["research/registry/evidence-cases.json", "apps/portal/data/evidence-cases.json"],
    ["apps/portal/source-data/atoms-v1.json", "apps/portal/data/atoms-v1.json"],
  ];
  for (const [source, mirror] of pairs) {
    if (!fs.existsSync(rel(source))) errors.push(`missing canonical source: ${source}`);
    else if (!fs.existsSync(rel(mirror))) errors.push(`missing portal mirror: ${mirror}`);
    else if (normalizedTextSha256(rel(source)) !== normalizedTextSha256(rel(mirror))) {
      errors.push(`stale portal mirror: ${mirror}`);
    }
  }
  return errors;
}

function validateSpeculativeBoundary() {
  const errors = [];
  const publicSources = [
    "research/registry/experiments.json",
    "research/registry/milestones.json",
    "research/registry/releases.json",
    "research/registry/evidence-cases.json",
  ];
  for (const source of publicSources) {
    const text = fs.readFileSync(rel(source), "utf8");
    if (/labs[\\/]translation[\\/]/i.test(text)) errors.push(`${source} references unpromoted translation-lab material`);
  }
  return errors;
}

function printHelp() {
  console.log(`VoynichLab Research Publisher

Usage:
  research:validate              Validate registry and artifacts
  research:build                 Build all artifacts and portal data
  research:publish --experiment <id>  Publish a single experiment
  research:doctor                Full health check
  research:stage-plan --experiment <id>  Show staging plan for experiment
  research:refresh-checksums     Refresh artifact checksum ledgers only
  repo:audit                     Non-destructive repo hygiene audit

Examples:
  npm.cmd run research:validate
  npm.cmd run research:build
  npm.cmd run research:publish -- --experiment prospective-atoms-eva-test-v1
  npm.cmd run research:doctor
  npm.cmd run research:stage-plan -- --experiment prospective-atoms-eva-test-v1
  npm.cmd run research:refresh-checksums
  npm.cmd run repo:audit`);
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
} else if (command === "refresh-checksums") {
  refreshPublicChecksums();
  validateRegistry({ strictArtifacts: true });
} else if (command === "repo-audit") {
  repoAudit();
} else {
  printHelp();
  process.exit(command ? 1 : 0);
}
