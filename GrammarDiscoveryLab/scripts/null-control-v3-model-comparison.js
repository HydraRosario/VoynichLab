import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const outDir = path.resolve(root, args.out_dir ?? "out/null-control-v3");
const alpha = Number(args.alpha ?? 0.5);
const trainFolios = new Set(["f1r", "f1v", "f47v"]);
const testFolios = ["f2r", "f2v"];

const frozenDir = path.resolve(root, "frozen/GRAMMAR-V1-2026-07-13");
const trainAndF2rPath = path.join(frozenDir, "molecules-current.tsv");
const f2vPath = path.resolve(root, "frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv");
const rulesPath = path.join(frozenDir, "grammar-v1-substitution-families.tsv");

const rules = readTsv(rulesPath).map((row, index) => ({
  ...row,
  familyId: `substitution-${String(index + 1).padStart(2, "0")}`,
  slotIndex: Number(row.slot_index),
  slot: Number(row.slot_index) - 1,
  skeletonTokens: tokens(row.skeleton),
}));

const trainRows = readTsv(trainAndF2rPath)
  .filter((row) => trainFolios.has(row.folio))
  .map(withTokens);
const testRows = [
  ...readTsv(trainAndF2rPath).filter((row) => row.folio === "f2r").map(withTokens),
  ...readTsv(f2vPath).filter((row) => row.folio === "f2v").map(withTokens),
];

const trainVocabulary = [...new Set(trainRows.flatMap((row) => row.tokens))].sort();
const trainVocabularySet = new Set(trainVocabulary);

const modelA = trainModel("local");
const modelB = trainModel("frame");
const opportunities = buildEvaluationOpportunities();
const evaluated = opportunities.map(evaluateOpportunity);
const summaries = [
  summarize(evaluated, "combined"),
  ...testFolios.map((folio) => summarize(evaluated.filter((row) => row.folio === folio), folio)),
];

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "null-control-v3-opportunities.tsv"), evaluated, [
  "folio",
  "molecule_uid",
  "source_molecule_id",
  "family_id",
  "slot_index",
  "observed_value",
  "local_context",
  "frame_identity",
  "model_a_key_seen",
  "model_b_key_seen",
  "observed_in_train_vocab",
  "model_a_probability",
  "model_b_probability",
  "model_a_log_loss",
  "model_b_log_loss",
  "log_loss_difference",
  "model_a_top1",
  "model_b_top1",
  "model_a_correct",
  "model_b_correct",
]);
fs.writeFileSync(path.join(outDir, "NULL-CONTROL-V3-MODEL-COMPARISON.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "NULL-CONTROL-V3-MODEL-COMPARISON.md"))}`);
for (const summary of summaries) {
  console.log(`${summary.scope}: delta log-loss=${summary.deltaLogLoss.toFixed(6)}; A=${summary.modelALogLoss.toFixed(6)}; B=${summary.modelBLogLoss.toFixed(6)}; n=${summary.count}`);
}

function trainModel(kind) {
  const groups = new Map();
  for (const rule of rules) {
    for (const molecule of trainRows) {
      if (!matchesRule(rule, molecule.tokens)) continue;
      const key = kind === "local" ? localKey(rule, molecule.tokens) : frameKey(rule);
      const group = getGroup(groups, key);
      const value = molecule.tokens[rule.slot];
      group.total += 1;
      group.counts.set(value, (group.counts.get(value) ?? 0) + 1);
    }
  }
  return { kind, groups };
}

function getGroup(groups, key) {
  if (!groups.has(key)) {
    groups.set(key, { total: 0, counts: new Map() });
  }
  return groups.get(key);
}

function buildEvaluationOpportunities() {
  const rows = [];
  for (const rule of rules) {
    for (const molecule of testRows) {
      if (!matchesRule(rule, molecule.tokens)) continue;
      rows.push({
        folio: molecule.folio,
        molecule_uid: molecule.molecule_uid,
        source_molecule_id: molecule.source_molecule_id,
        familyId: rule.familyId,
        slotIndex: rule.slotIndex,
        observedValue: molecule.tokens[rule.slot],
        localContext: localKey(rule, molecule.tokens),
        frameIdentity: frameKey(rule),
      });
    }
  }
  return rows;
}

function evaluateOpportunity(row) {
  const modelAStats = score(modelA, row.localContext, row.observedValue);
  const modelBStats = score(modelB, row.frameIdentity, row.observedValue);
  const delta = modelAStats.logLoss - modelBStats.logLoss;
  return {
    folio: row.folio,
    molecule_uid: row.molecule_uid,
    source_molecule_id: row.source_molecule_id,
    family_id: row.familyId,
    slot_index: row.slotIndex,
    observed_value: row.observedValue,
    local_context: row.localContext,
    frame_identity: row.frameIdentity,
    model_a_key_seen: modelAStats.keySeen ? "yes" : "no",
    model_b_key_seen: modelBStats.keySeen ? "yes" : "no",
    observed_in_train_vocab: trainVocabularySet.has(row.observedValue) ? "yes" : "no",
    model_a_probability: modelAStats.probability,
    model_b_probability: modelBStats.probability,
    model_a_log_loss: modelAStats.logLoss,
    model_b_log_loss: modelBStats.logLoss,
    log_loss_difference: delta,
    model_a_top1: modelAStats.top1,
    model_b_top1: modelBStats.top1,
    model_a_correct: modelAStats.top1 === row.observedValue ? "yes" : "no",
    model_b_correct: modelBStats.top1 === row.observedValue ? "yes" : "no",
  };
}

function score(model, key, observedValue) {
  const group = model.groups.get(key);
  const keySeen = Boolean(group);
  const total = group?.total ?? 0;
  const counts = group?.counts ?? new Map();
  const denominator = total + alpha * trainVocabulary.length;
  const count = counts.get(observedValue) ?? 0;
  const probability = trainVocabularySet.has(observedValue)
    ? (count + alpha) / denominator
    : 0;
  return {
    keySeen,
    probability,
    logLoss: probability > 0 ? -Math.log2(probability) : Infinity,
    top1: top1(counts, total),
  };
}

function top1(counts, total) {
  if (!total) return trainVocabulary[0] ?? "";
  let bestValue = "";
  let bestCount = -1;
  for (const value of trainVocabulary) {
    const count = counts.get(value) ?? 0;
    if (count > bestCount) {
      bestValue = value;
      bestCount = count;
    }
  }
  return bestValue;
}

function summarize(rows, scope) {
  const finiteRows = rows.filter((row) => Number.isFinite(row.model_a_log_loss) && Number.isFinite(row.model_b_log_loss));
  const count = rows.length;
  const modelALogLoss = mean(finiteRows.map((row) => row.model_a_log_loss));
  const modelBLogLoss = mean(finiteRows.map((row) => row.model_b_log_loss));
  const modelAAccuracy = count ? rows.filter((row) => row.model_a_correct === "yes").length / count : 0;
  const modelBAccuracy = count ? rows.filter((row) => row.model_b_correct === "yes").length / count : 0;
  const modelAProbability = mean(rows.map((row) => row.model_a_probability));
  const modelBProbability = mean(rows.map((row) => row.model_b_probability));
  return {
    scope,
    count,
    finiteCount: finiteRows.length,
    modelALogLoss,
    modelBLogLoss,
    deltaLogLoss: modelALogLoss - modelBLogLoss,
    modelAAccuracy,
    modelBAccuracy,
    modelAProbability,
    modelBProbability,
    modelAUnseenContexts: rows.filter((row) => row.model_a_key_seen === "no").length,
    modelBUnseenContexts: rows.filter((row) => row.model_b_key_seen === "no").length,
    unseenObservedValues: rows.filter((row) => row.observed_in_train_vocab === "no").length,
  };
}

function renderReport() {
  const lines = [];
  lines.push("# NULL-CONTROL-V3-MODEL-COMPARISON");
  lines.push("");
  lines.push("Purpose: compare whether frozen full-frame identity predicts held-out substitution slot values better than local context alone, without using held-out folios for candidate values, frequencies, smoothing, vocabulary restrictions, or model selection.");
  lines.push("");
  lines.push("## Data Split");
  lines.push("");
  lines.push("- Training folios: `f1r`, `f1v`, `f47v`.");
  lines.push("- Evaluation folios: `f2r`, `f2v`.");
  lines.push("- Frozen substitution families: `19`.");
  lines.push("- Evaluated opportunities: exactly the held-out molecules matching frozen substitution-family skeletons.");
  lines.push("");
  lines.push("## Models");
  lines.push("");
  lines.push("### Model A - Local Context Baseline");
  lines.push("");
  lines.push("Predicts slot values from:");
  lines.push("");
  lines.push("- immediate left neighbor;");
  lines.push("- immediate right neighbor;");
  lines.push("- positional role;");
  lines.push("- molecule length.");
  lines.push("");
  lines.push("### Model B - Full-Frame Model");
  lines.push("");
  lines.push("Predicts slot values from the complete frozen substitution skeleton outside the target slot. This includes the local context but also the full surrounding frame.");
  lines.push("");
  lines.push("### Smoothing");
  lines.push("");
  lines.push(`Both models use fixed Lidstone smoothing with \`alpha=${alpha}\` over the training-only ATOMS vocabulary.`);
  lines.push("");
  lines.push(`Training vocabulary size: \`${trainVocabulary.length}\`.`);
  lines.push(`Training vocabulary: \`${trainVocabulary.join(" ")}\`.`);
  lines.push("");
  lines.push("A held-out value absent from the training vocabulary receives probability `0`; this is reported separately. No held-out value was used to define the vocabulary.");
  lines.push("");
  lines.push("## Primary Metric");
  lines.push("");
  lines.push("Predictive log-loss / cross-entropy in bits. Lower is better.");
  lines.push("");
  lines.push("Delta log-loss is:");
  lines.push("");
  lines.push("```text");
  lines.push("Model A log-loss - Model B log-loss");
  lines.push("```");
  lines.push("");
  lines.push("- Positive delta: full-frame identity improves prediction.");
  lines.push("- Approximately zero: frame identity adds little beyond local context.");
  lines.push("- Negative delta: frame model generalizes worse.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Scope | N | Model A log-loss | Model B log-loss | Delta | Model A top-1 | Model B top-1 | Mean P(obs) A | Mean P(obs) B | Unseen A contexts | Unseen B frames | Unseen values |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const summary of summaries) {
    lines.push(`| \`${summary.scope}\` | ${summary.count} | ${fmt(summary.modelALogLoss)} | ${fmt(summary.modelBLogLoss)} | ${fmt(summary.deltaLogLoss)} | ${pct(summary.modelAAccuracy)} | ${pct(summary.modelBAccuracy)} | ${fmt(summary.modelAProbability)} | ${fmt(summary.modelBProbability)} | ${summary.modelAUnseenContexts} | ${summary.modelBUnseenContexts} | ${summary.unseenObservedValues} |`);
  }
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  const combined = summaries.find((summary) => summary.scope === "combined");
  if (combined.deltaLogLoss > 0.05) {
    lines.push("Model B assigns better out-of-sample probability to the observed slot values than the local-context baseline. This suggests that full frozen-frame identity carries predictive information beyond immediate neighbors, role, and length.");
  } else if (combined.deltaLogLoss < -0.05) {
    lines.push("Model B generalizes worse than the local-context baseline. Under this comparison, frozen frame identity does not improve prediction and may be over-specific for the current held-out data.");
  } else {
    lines.push("Model B is approximately tied with the local-context baseline. Under this comparison, full frozen-frame identity adds little measurable predictive information beyond immediate local context.");
  }
  lines.push("");
  lines.push("No dramatic p-value is reported here. The purpose of V3 is model comparison, not significance testing.");
  lines.push("");
  lines.push("## Output Table");
  lines.push("");
  lines.push("- `null-control-v3-opportunities.tsv` contains one row per evaluated held-out slot opportunity.");
  return lines.join("\n") + "\n";
}

function matchesRule(rule, sigTokens) {
  if (sigTokens.length !== rule.skeletonTokens.length) return false;
  for (let index = 0; index < rule.skeletonTokens.length; index += 1) {
    if (index === rule.slot) continue;
    if (rule.skeletonTokens[index] !== sigTokens[index]) return false;
  }
  return Boolean(sigTokens[rule.slot]);
}

function localKey(rule, sigTokens) {
  const left = rule.slot > 0 ? sigTokens[rule.slot - 1] : "START";
  const right = rule.slot < sigTokens.length - 1 ? sigTokens[rule.slot + 1] : "END";
  return [
    `length=${sigTokens.length}`,
    `role=${positionalRole(rule.slot, sigTokens.length)}`,
    `left=${left}`,
    `right=${right}`,
  ].join("|");
}

function frameKey(rule) {
  return [
    `slot=${rule.slotIndex}`,
    `skeleton=${rule.skeletonTokens.join(" ")}`,
  ].join("|");
}

function positionalRole(slot, length) {
  if (slot === 0) return "initial";
  if (slot === length - 1) return "final";
  return "medial";
}

function withTokens(row) {
  return { ...row, tokens: tokens(row.signature) };
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[name] = true;
    } else {
      result[name] = next;
      index += 1;
    }
  }
  return result;
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function writeTsv(filePath, rows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => formatCell(row[field])).join("\t")),
  ].join("\n") + "\n", "utf8");
}

function formatCell(value) {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "Infinity";
  return String(value ?? "").replaceAll("\t", " ");
}

function tokens(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function fmt(value) {
  if (!Number.isFinite(value)) return "Infinity";
  return value.toFixed(6);
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}
