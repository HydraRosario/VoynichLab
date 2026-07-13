import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoRoot = path.resolve(root, "..");
const outDir = path.resolve(root, "out/representation-comparison-v2-regions");
const alignmentDir = path.resolve(root, "out/representation-alignment-v1");
const evaCasesRoot = path.resolve(repoRoot, "EVAComparisonLab/cases");
const alpha = 0.5;
const trainFolios = new Set(["f1r", "f1v", "f47v"]);
const testFolios = ["f2r", "f2v"];
const folios = ["f1r", "f1v", "f2r", "f2v", "f47v"];
const atomsVocab = [
  "a:1", "b:1", "c:1", "c:2", "d:1", "e:1", "f:1", "g:1",
  "h:1", "h:2", "i:1", "j:1", "k:1", "l:1", "m:1", "n:1",
];

const alignedRegions = readTsv(path.join(alignmentDir, "aligned-regions.tsv"));
const atomRowsByUnitId = new Map();
for (const folio of folios) {
  for (const row of readCaseTsv(folio, "atoms-current.tsv")) {
    atomRowsByUnitId.set(row.unit_id, row);
  }
}

const regions = alignedRegions.map((region) => {
  const evaSymbols = String(region.eva_token_sequence ?? "").replace(/\s+/g, "").split("").filter(Boolean);
  const atomsSymbols = tokens(region.atoms_unit_sequence).flatMap((unitId) => tokens(atomRowsByUnitId.get(unitId)?.atoms));
  return {
    ...region,
    hasQuestion: evaSymbols.includes("?"),
    questionCount: evaSymbols.filter((symbol) => symbol === "?").length,
    EVA: evaSymbols,
    ATOMS: atomsSymbols,
  };
});

const evaVocab = [...new Set(regions.flatMap((region) => region.EVA))].sort();
const treatments = [
  {
    name: "original_keep_question",
    description: "`?` is kept as an EVA symbol.",
    regionFilter: () => true,
    skipOpportunity: () => false,
  },
  {
    name: "exclude_question_regions",
    description: "Every region containing `?` is excluded for both representations.",
    regionFilter: (region) => !region.hasQuestion,
    skipOpportunity: () => false,
  },
  {
    name: "question_non_evaluable",
    description: "Regions are kept, but EVA opportunities touching `?` as left, observed, or right symbol are skipped.",
    regionFilter: () => true,
    skipOpportunity: (symbols, index, representation) => (
      representation === "EVA" &&
      [symbols[index - 1], symbols[index], symbols[index + 1]].includes("?")
    ),
  },
];

const representations = [
  { name: "ATOMS", vocabulary: atomsVocab },
  { name: "EVA", vocabulary: evaVocab },
];

const rows = [];
for (const treatment of treatments) {
  const treatmentRegions = regions.filter(treatment.regionFilter);
  for (const representation of representations) {
    rows.push(
      summarize(treatment, representation, "combined", treatmentRegions),
      ...testFolios.map((folio) => summarize(
        treatment,
        representation,
        folio,
        treatmentRegions.filter((region) => region.folio === folio || trainFolios.has(region.folio)),
      )),
    );
  }
}

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "eva-question-mark-sensitivity.tsv"), rows, [
  "treatment",
  "representation",
  "scope",
  "train_regions",
  "test_regions",
  "predicted_opportunities",
  "skipped_question_opportunities",
  "unseen_context_rate",
  "normalized_log_loss",
  "top1_accuracy",
  "mean_observed_probability",
]);
fs.writeFileSync(path.join(outDir, "EVA-QUESTION-MARK-SENSITIVITY.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "EVA-QUESTION-MARK-SENSITIVITY.md"))}`);
for (const row of rows.filter((row) => row.scope === "combined")) {
  console.log(`${row.treatment} ${row.representation}: normalized=${fmt(row.normalized_log_loss)} top1=${pct(row.top1_accuracy)} skipped=${row.skipped_question_opportunities}`);
}

function summarize(treatment, representation, scope, scopedRegions) {
  const trainRegions = scopedRegions.filter((region) => trainFolios.has(region.folio));
  const testRegions = scopedRegions.filter((region) => scope === "combined" ? testFolios.includes(region.folio) : region.folio === scope);
  const trainSequences = trainRegions.map((region) => region[representation.name]).filter((symbols) => symbols.length >= 3);
  const testSequences = testRegions.map((region) => region[representation.name]).filter((symbols) => symbols.length >= 3);
  const model = trainModel(trainSequences, treatment, representation.name);
  const vocabularySet = new Set(representation.vocabulary);
  const scored = testSequences.flatMap((symbols) => scoreSequence(symbols, model, representation.vocabulary, vocabularySet, treatment, representation.name));
  const opportunities = scored.filter((row) => !row.skipped);
  const skipped = scored.filter((row) => row.skipped).length;
  const totalBits = opportunities.reduce((sum, row) => sum + row.logLoss, 0);
  const logLoss = opportunities.length ? totalBits / opportunities.length : 0;
  return {
    treatment: treatment.name,
    representation: representation.name,
    scope,
    train_regions: trainSequences.length,
    test_regions: testSequences.length,
    predicted_opportunities: opportunities.length,
    skipped_question_opportunities: skipped,
    unseen_context_rate: opportunities.length ? opportunities.filter((row) => !row.contextSeen).length / opportunities.length : 0,
    normalized_log_loss: Math.log2(representation.vocabulary.length) ? logLoss / Math.log2(representation.vocabulary.length) : 0,
    top1_accuracy: opportunities.length ? opportunities.filter((row) => row.top1 === row.observed).length / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((row) => row.probability)),
  };
}

function trainModel(sequences, treatment, representation) {
  const model = new Map();
  for (const symbols of sequences) {
    for (let index = 1; index < symbols.length - 1; index += 1) {
      if (treatment.skipOpportunity(symbols, index, representation)) continue;
      const group = getGroup(model, localKey(symbols, index));
      group.total += 1;
      group.counts.set(symbols[index], (group.counts.get(symbols[index]) ?? 0) + 1);
    }
  }
  return model;
}

function scoreSequence(symbols, model, vocabulary, vocabularySet, treatment, representation) {
  const rows = [];
  for (let index = 1; index < symbols.length - 1; index += 1) {
    if (treatment.skipOpportunity(symbols, index, representation)) {
      rows.push({ skipped: true });
      continue;
    }
    const context = localKey(symbols, index);
    const group = model.get(context);
    const counts = group?.counts ?? new Map();
    const total = group?.total ?? 0;
    const probability = vocabularySet.has(symbols[index])
      ? ((counts.get(symbols[index]) ?? 0) + alpha) / (total + alpha * vocabulary.length)
      : 0;
    rows.push({
      skipped: false,
      observed: symbols[index],
      contextSeen: Boolean(group),
      probability,
      logLoss: probability > 0 ? -Math.log2(probability) : Infinity,
      top1: top1(counts, vocabulary),
    });
  }
  return rows;
}

function renderReport() {
  const lines = [];
  lines.push("# EVA Question-Mark Sensitivity");
  lines.push("");
  lines.push("Purpose: audit whether the EVA `?` symbol materially changes REPRESENTATION-COMPARISON-V2-REGIONS.");
  lines.push("");
  lines.push("The original regional comparison is preserved. This file adds predefined sensitivity treatments rather than silently removing or recoding `?` after seeing the result.");
  lines.push("");
  lines.push("## Question-Mark Counts");
  lines.push("");
  lines.push("| Folio | `?` occurrences | Regions containing `?` | Train/Test |");
  lines.push("| --- | ---: | ---: | --- |");
  for (const folio of folios) {
    const folioRegions = regions.filter((region) => region.folio === folio);
    lines.push(`| \`${folio}\` | ${folioRegions.reduce((sum, region) => sum + region.questionCount, 0)} | ${folioRegions.filter((region) => region.hasQuestion).length} | ${trainFolios.has(folio) ? "train" : "test"} |`);
  }
  lines.push("");
  lines.push("## Regional Counts");
  lines.push("");
  lines.push("| Split | Regions | Regions containing `?` |");
  lines.push("| --- | ---: | ---: |");
  lines.push(`| train | ${regions.filter((region) => trainFolios.has(region.folio)).length} | ${regions.filter((region) => trainFolios.has(region.folio) && region.hasQuestion).length} |`);
  lines.push(`| test | ${regions.filter((region) => testFolios.includes(region.folio)).length} | ${regions.filter((region) => testFolios.includes(region.folio) && region.hasQuestion).length} |`);
  lines.push("");
  lines.push("## Treatments");
  lines.push("");
  for (const treatment of treatments) {
    lines.push(`- \`${treatment.name}\`: ${treatment.description}`);
  }
  lines.push("");
  lines.push("## Metrics");
  lines.push("");
  lines.push("| Treatment | Representation | Scope | Train regions | Test regions | Opps | Skipped `?` opps | Unseen ctx | Norm log-loss | Top-1 | Mean P(obs) |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const row of rows) {
    lines.push(`| \`${row.treatment}\` | ${row.representation} | \`${row.scope}\` | ${row.train_regions} | ${row.test_regions} | ${row.predicted_opportunities} | ${row.skipped_question_opportunities} | ${pct(row.unseen_context_rate)} | ${fmt(row.normalized_log_loss)} | ${pct(row.top1_accuracy)} | ${fmt(row.mean_observed_probability)} |`);
  }
  lines.push("");
  lines.push("## Reading");
  lines.push("");
  for (const treatment of treatments) {
    const atoms = rows.find((row) => row.treatment === treatment.name && row.representation === "ATOMS" && row.scope === "combined");
    const eva = rows.find((row) => row.treatment === treatment.name && row.representation === "EVA" && row.scope === "combined");
    lines.push(`- \`${treatment.name}\`: normalized log-loss favors ${atoms.normalized_log_loss < eva.normalized_log_loss ? "ATOMS" : "EVA"}; top-1 favors ${atoms.top1_accuracy > eva.top1_accuracy ? "ATOMS" : "EVA"}; unseen-context rate favors ${atoms.unseen_context_rate < eva.unseen_context_rate ? "ATOMS" : "EVA"}.`);
  }
  lines.push("");
  lines.push("The `?` handling does not replace the original V2 regional result; it bounds one transcription-uncertainty objection.");
  return lines.join("\n") + "\n";
}

function localKey(symbols, index) {
  return [
    `length=${symbols.length}`,
    "role=medial",
    `left=${symbols[index - 1]}`,
    `right=${symbols[index + 1]}`,
  ].join("|");
}

function top1(counts, vocabulary) {
  let best = vocabulary[0] ?? "";
  let bestCount = -1;
  for (const symbol of vocabulary) {
    const count = counts.get(symbol) ?? 0;
    if (count > bestCount) {
      best = symbol;
      bestCount = count;
    }
  }
  return best;
}

function getGroup(model, key) {
  if (!model.has(key)) model.set(key, { total: 0, counts: new Map() });
  return model.get(key);
}

function readCaseTsv(folio, fileName) {
  return readTsv(path.join(evaCasesRoot, `${folio}-full`, fileName));
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

function writeTsv(filePath, dataRows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    fields.join("\t"),
    ...dataRows.map((row) => fields.map((field) => formatCell(row[field])).join("\t")),
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
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function fmt(value) {
  return Number.isFinite(value) ? value.toFixed(6) : "Infinity";
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}
