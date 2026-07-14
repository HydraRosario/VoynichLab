import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoRoot = path.resolve(root, "..");
const outDir = path.resolve(root, "out/representation-comparison-v3-ablations");
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
const unresolvedRegions = readTsv(path.join(alignmentDir, "unresolved-regions.tsv"));
const unresolvedEvaLineKeys = new Set(
  unresolvedRegions.filter((row) => row.side === "EVA").map((row) => `${row.folio}|${row.line}`)
);
const atomRowsByUnitId = new Map();
for (const folio of folios) {
  for (const row of readCaseTsv(folio, "atoms.tsv")) {
    atomRowsByUnitId.set(row.unit_id, row);
  }
}

const regionRows = alignedRegions.map(toRegionRow);
const evaVocab = [...new Set(regionRows.flatMap((row) => row.evaSymbols))].sort();

const subsets = [
  {
    name: "all",
    description: "All aligned regions.",
    predicate: () => true,
  },
  {
    name: "medium",
    description: "Only medium-confidence regions.",
    predicate: (row) => row.alignment_confidence === "medium",
  },
  {
    name: "medium_low_medium",
    description: "Medium plus low-medium confidence regions.",
    predicate: (row) => ["medium", "low-medium"].includes(row.alignment_confidence),
  },
  {
    name: "one_to_one",
    description: "Only 1:1 aligned regions.",
    predicate: (row) => row.relation_type === "1:1",
  },
  {
    name: "exclude_unresolved_eva_lines",
    description: "Regions whose line has no unresolved EVA token under ALIGNMENT-V1.",
    predicate: (row) => !unresolvedEvaLineKeys.has(`${row.folio}|${row.line}`),
  },
];

const representations = [
  {
    name: "ATOMS",
    vocabulary: atomsVocab,
    sequence: (row) => row.atomsSymbols,
  },
  {
    name: "EVA",
    vocabulary: evaVocab,
    sequence: (row) => row.evaSymbols,
  },
];

const modelVariants = [
  {
    id: "MODEL_0",
    label: "Unigram baseline",
    description: "No contextual features; symbol frequency only.",
    key: () => "unigram",
  },
  {
    id: "MODEL_1",
    label: "Neighbors only",
    description: "Immediate left and right symbols only.",
    key: ({ symbols, index }) => [
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
    ].join("|"),
  },
  {
    id: "MODEL_2",
    label: "Neighbors plus coarse position",
    description: "Immediate neighbors plus first/middle/final third.",
    key: ({ symbols, index }) => [
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
      `coarse=${coarsePosition(index, symbols.length)}`,
    ].join("|"),
  },
  {
    id: "MODEL_3",
    label: "Published V2 exact-length model",
    description: "Immediate neighbors, current medial role, and exact regional sequence length.",
    key: ({ symbols, index }) => [
      `length=${symbols.length}`,
      `role=${positionalRole(index, symbols.length)}`,
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
    ].join("|"),
  },
  {
    id: "MODEL_4",
    label: "Neighbors plus coarse position and train-defined length bins",
    description: "Immediate neighbors, first/middle/final third, and short/medium/long bin from representation-specific train tertiles.",
    key: ({ symbols, index, lengthBin }) => [
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
      `coarse=${coarsePosition(index, symbols.length)}`,
      `length_bin=${lengthBin}`,
    ].join("|"),
  },
];

const summaryRows = [];
const folioRows = [];

for (const subset of subsets) {
  const subsetRows = regionRows.filter(subset.predicate);
  for (const model of modelVariants) {
    const resultByRepresentation = new Map();
    for (const representation of representations) {
      const result = runModel(subset, subsetRows, model, representation);
      resultByRepresentation.set(representation.name, result);
      summaryRows.push(result.combined);
      folioRows.push(...result.byFolio);
    }
    summaryRows.push(diffRow(subset.name, model.id, "combined", resultByRepresentation));
    for (const folio of testFolios) {
      const scoped = new Map();
      for (const [name, result] of resultByRepresentation.entries()) {
        scoped.set(name, {
          combined: result.byFolio.find((row) => row.scope === folio),
        });
      }
      folioRows.push(diffRow(subset.name, model.id, folio, scoped));
    }
  }
}

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "representation-comparison-v3-summary.tsv"), summaryRows, [
  "subset",
  "model",
  "model_label",
  "representation",
  "scope",
  "train_regions",
  "test_regions",
  "vocabulary_size",
  "evaluated_opportunities",
  "unseen_context_count",
  "unseen_context_rate",
  "normalized_log_loss",
  "top1_accuracy",
  "mean_observed_probability",
  "atoms_minus_eva_normalized_log_loss",
  "atoms_minus_eva_top1_accuracy",
  "atoms_minus_eva_unseen_context_rate",
  "atoms_minus_eva_mean_observed_probability",
]);
writeTsv(path.join(outDir, "representation-comparison-v3-folio-results.tsv"), folioRows, [
  "subset",
  "model",
  "model_label",
  "representation",
  "scope",
  "train_regions",
  "test_regions",
  "vocabulary_size",
  "evaluated_opportunities",
  "unseen_context_count",
  "unseen_context_rate",
  "normalized_log_loss",
  "top1_accuracy",
  "mean_observed_probability",
  "atoms_minus_eva_normalized_log_loss",
  "atoms_minus_eva_top1_accuracy",
  "atoms_minus_eva_unseen_context_rate",
  "atoms_minus_eva_mean_observed_probability",
]);
fs.writeFileSync(path.join(outDir, "REPRESENTATION-COMPARISON-V3-ABLATIONS.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "REPRESENTATION-COMPARISON-V3-ABLATIONS.md"))}`);
for (const model of modelVariants) {
  const atoms = findSummary("all", model.id, "ATOMS", "combined");
  const eva = findSummary("all", model.id, "EVA", "combined");
  console.log(`${model.id}: ATOMS norm=${fmt(atoms.normalized_log_loss)} EVA norm=${fmt(eva.normalized_log_loss)} delta=${fmt(atoms.normalized_log_loss - eva.normalized_log_loss)}`);
}

function runModel(subset, rows, model, representation) {
  const trainRegions = rows.filter((row) => trainFolios.has(row.folio));
  const testRegions = rows.filter((row) => testFolios.includes(row.folio));
  const lengthBinner = makeLengthBinner(
    trainRegions.map((row) => representation.sequence(row).length).filter((length) => length >= 3)
  );
  const trainSequences = trainRegions.map((row) => sequenceRow(row, representation, lengthBinner)).filter((row) => row.symbols.length >= 3);
  const testSequences = testRegions.map((row) => sequenceRow(row, representation, lengthBinner)).filter((row) => row.symbols.length >= 3);
  const modelGroups = trainModel(trainSequences, model);
  const vocabularySet = new Set(representation.vocabulary);
  const scored = testSequences.map((sequence) => scoreSequence(sequence, model, modelGroups, representation.vocabulary, vocabularySet));
  const combined = summarize(subset.name, model, representation, "combined", trainSequences, testSequences, scored);
  const byFolio = testFolios.map((folio) => summarize(
    subset.name,
    model,
    representation,
    folio,
    trainSequences,
    testSequences.filter((row) => row.folio === folio),
    scored.filter((row) => row.folio === folio),
  ));
  return { combined, byFolio };
}

function sequenceRow(row, representation, lengthBinner) {
  const symbols = representation.sequence(row);
  return {
    folio: row.folio,
    line: row.line,
    region_id: row.region_id,
    symbols,
    lengthBin: lengthBinner(symbols.length),
  };
}

function trainModel(sequences, model) {
  const groups = new Map();
  for (const sequence of sequences) {
    for (let index = 1; index < sequence.symbols.length - 1; index += 1) {
      const key = model.key({ symbols: sequence.symbols, index, lengthBin: sequence.lengthBin });
      const group = getGroup(groups, key);
      const symbol = sequence.symbols[index];
      group.total += 1;
      group.counts.set(symbol, (group.counts.get(symbol) ?? 0) + 1);
    }
  }
  return groups;
}

function scoreSequence(sequence, model, groups, vocabulary, vocabularySet) {
  const opportunities = [];
  for (let index = 1; index < sequence.symbols.length - 1; index += 1) {
    const observed = sequence.symbols[index];
    const key = model.key({ symbols: sequence.symbols, index, lengthBin: sequence.lengthBin });
    const group = groups.get(key);
    const counts = group?.counts ?? new Map();
    const total = group?.total ?? 0;
    const probability = vocabularySet.has(observed)
      ? ((counts.get(observed) ?? 0) + alpha) / (total + alpha * vocabulary.length)
      : 0;
    opportunities.push({
      observed,
      contextSeen: Boolean(group),
      probability,
      logLoss: probability > 0 ? -Math.log2(probability) : Infinity,
      top1: top1(counts, vocabulary),
    });
  }
  return { ...sequence, opportunities };
}

function summarize(subsetName, model, representation, scope, trainSequences, testSequences, scoredRows) {
  const opportunities = scoredRows.flatMap((row) => row.opportunities);
  const totalBits = opportunities.reduce((sum, row) => sum + row.logLoss, 0);
  const logLoss = opportunities.length ? totalBits / opportunities.length : 0;
  const unseen = opportunities.filter((row) => !row.contextSeen).length;
  const top1Correct = opportunities.filter((row) => row.top1 === row.observed).length;
  return {
    subset: subsetName,
    model: model.id,
    model_label: model.label,
    representation: representation.name,
    scope,
    train_regions: trainSequences.length,
    test_regions: testSequences.length,
    vocabulary_size: representation.vocabulary.length,
    evaluated_opportunities: opportunities.length,
    unseen_context_count: unseen,
    unseen_context_rate: opportunities.length ? unseen / opportunities.length : 0,
    normalized_log_loss: Math.log2(representation.vocabulary.length) ? logLoss / Math.log2(representation.vocabulary.length) : 0,
    top1_accuracy: opportunities.length ? top1Correct / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((row) => row.probability)),
    atoms_minus_eva_normalized_log_loss: "",
    atoms_minus_eva_top1_accuracy: "",
    atoms_minus_eva_unseen_context_rate: "",
    atoms_minus_eva_mean_observed_probability: "",
  };
}

function diffRow(subsetName, modelId, scope, resultByRepresentation) {
  const atoms = resultByRepresentation.get("ATOMS").combined;
  const eva = resultByRepresentation.get("EVA").combined;
  const model = modelVariants.find((item) => item.id === modelId);
  return {
    subset: subsetName,
    model: modelId,
    model_label: model.label,
    representation: "ATOMS_MINUS_EVA",
    scope,
    train_regions: "",
    test_regions: "",
    vocabulary_size: "",
    evaluated_opportunities: "",
    unseen_context_count: "",
    unseen_context_rate: "",
    normalized_log_loss: "",
    top1_accuracy: "",
    mean_observed_probability: "",
    atoms_minus_eva_normalized_log_loss: atoms.normalized_log_loss - eva.normalized_log_loss,
    atoms_minus_eva_top1_accuracy: atoms.top1_accuracy - eva.top1_accuracy,
    atoms_minus_eva_unseen_context_rate: atoms.unseen_context_rate - eva.unseen_context_rate,
    atoms_minus_eva_mean_observed_probability: atoms.mean_observed_probability - eva.mean_observed_probability,
  };
}

function renderReport() {
  const lines = [];
  lines.push("# REPRESENTATION-COMPARISON-V3-ABLATIONS");
  lines.push("");
  lines.push("Purpose: test whether the exploratory ATOMS advantage from V2 survives removal or simplification of representation-dependent contextual features.");
  lines.push("");
  lines.push("This is a predefined ablation suite. It does not add model variants after seeing results.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push("- Alignment: `out/representation-alignment-v1/aligned-regions.tsv`.");
  lines.push("- ATOMS units: `EVAComparisonLab/cases/<folio>-full/atoms.tsv`.");
  lines.push("- Train folios: `f1r`, `f1v`, `f47v`.");
  lines.push("- Test folios: `f2r`, `f2v`.");
  lines.push("- Smoothing: Lidstone `alpha=0.5`.");
  lines.push(`- ATOMS vocabulary: fixed ${atomsVocab.length}-symbol ATOMS-V1 inventory.`);
  lines.push(`- EVA vocabulary: ${evaVocab.length} symbols from the configured EVA source tables: \`${evaVocab.join(" ")}\`.`);
  lines.push("");
  lines.push("## Models");
  lines.push("");
  lines.push("| Model | Label | Features |");
  lines.push("| --- | --- | --- |");
  for (const model of modelVariants) {
    lines.push(`| \`${model.id}\` | ${model.label} | ${model.description} |`);
  }
  lines.push("");
  lines.push("MODEL_4 length bins are representation-specific train tertiles computed from training regions only. Test lengths do not set bin boundaries.");
  lines.push("");
  lines.push("## Combined Results");
  lines.push("");
  lines.push("| Subset | Model | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 | ATOMS unseen | EVA unseen | Delta unseen |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const subset of subsets) {
    for (const model of modelVariants) {
      const atoms = findSummary(subset.name, model.id, "ATOMS", "combined");
      const eva = findSummary(subset.name, model.id, "EVA", "combined");
      lines.push(`| \`${subset.name}\` | \`${model.id}\` | ${fmt(atoms.normalized_log_loss)} | ${fmt(eva.normalized_log_loss)} | ${fmt(atoms.normalized_log_loss - eva.normalized_log_loss)} | ${pct(atoms.top1_accuracy)} | ${pct(eva.top1_accuracy)} | ${pct(atoms.top1_accuracy - eva.top1_accuracy)} | ${pct(atoms.unseen_context_rate)} | ${pct(eva.unseen_context_rate)} | ${pct(atoms.unseen_context_rate - eva.unseen_context_rate)} |`);
    }
  }
  lines.push("");
  lines.push("Negative normalized-log-loss delta favors ATOMS. Positive top-1 delta favors ATOMS. Negative unseen-context delta favors ATOMS.");
  lines.push("");
  lines.push("## Held-Out Folio Results");
  lines.push("");
  lines.push("| Subset | Model | Folio | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const subset of subsets) {
    for (const model of modelVariants) {
      for (const folio of testFolios) {
        const atoms = findFolio(subset.name, model.id, "ATOMS", folio);
        const eva = findFolio(subset.name, model.id, "EVA", folio);
        lines.push(`| \`${subset.name}\` | \`${model.id}\` | \`${folio}\` | ${fmt(atoms.normalized_log_loss)} | ${fmt(eva.normalized_log_loss)} | ${fmt(atoms.normalized_log_loss - eva.normalized_log_loss)} | ${pct(atoms.top1_accuracy)} | ${pct(eva.top1_accuracy)} | ${pct(atoms.top1_accuracy - eva.top1_accuracy)} |`);
      }
    }
  }
  lines.push("");
  lines.push("## MODEL_3 Regression Check");
  lines.push("");
  lines.push(renderRegressionCheck());
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push(renderInterpretation());
  lines.push("");
  lines.push("## Output Tables");
  lines.push("");
  lines.push("- `representation-comparison-v3-summary.tsv`");
  lines.push("- `representation-comparison-v3-folio-results.tsv`");
  return lines.join("\n") + "\n";
}

function renderRegressionCheck() {
  const atoms = findSummary("all", "MODEL_3", "ATOMS", "combined");
  const eva = findSummary("all", "MODEL_3", "EVA", "combined");
  const atomsOk = near(atoms.normalized_log_loss, 0.8079217691095135) &&
    near(atoms.top1_accuracy, 0.4296407185628742) &&
    near(atoms.unseen_context_rate, 0.46182634730538924);
  const evaOk = near(eva.normalized_log_loss, 0.8927056812757962) &&
    near(eva.top1_accuracy, 0.2629815745393635) &&
    near(eva.unseen_context_rate, 0.6046901172529313);
  return [
    "| Representation | Norm log-loss | Top-1 | Unseen-context | Matches V2 |",
    "| --- | ---: | ---: | ---: | --- |",
    `| ATOMS | ${fmt(atoms.normalized_log_loss)} | ${pct(atoms.top1_accuracy)} | ${pct(atoms.unseen_context_rate)} | ${atomsOk ? "yes" : "no"} |`,
    `| EVA | ${fmt(eva.normalized_log_loss)} | ${pct(eva.top1_accuracy)} | ${pct(eva.unseen_context_rate)} | ${evaOk ? "yes" : "no"} |`,
  ].join("\n");
}

function renderInterpretation() {
  const lines = [];
  for (const model of modelVariants) {
    const atoms = findSummary("all", model.id, "ATOMS", "combined");
    const eva = findSummary("all", model.id, "EVA", "combined");
    const normWinner = atoms.normalized_log_loss < eva.normalized_log_loss ? "ATOMS" : "EVA";
    const top1Winner = atoms.top1_accuracy > eva.top1_accuracy ? "ATOMS" : "EVA";
    lines.push(`- \`${model.id}\`: normalized log-loss favors ${normWinner}; top-1 favors ${top1Winner}; unseen-context rate favors ${atoms.unseen_context_rate < eva.unseen_context_rate ? "ATOMS" : "EVA"}.`);
  }
  const m1Atoms = findSummary("all", "MODEL_1", "ATOMS", "combined");
  const m1Eva = findSummary("all", "MODEL_1", "EVA", "combined");
  const m2Atoms = findSummary("all", "MODEL_2", "ATOMS", "combined");
  const m2Eva = findSummary("all", "MODEL_2", "EVA", "combined");
  const m3Atoms = findSummary("all", "MODEL_3", "ATOMS", "combined");
  const m3Eva = findSummary("all", "MODEL_3", "EVA", "combined");
  lines.push("");
  if (m1Atoms.normalized_log_loss < m1Eva.normalized_log_loss && m2Atoms.normalized_log_loss < m2Eva.normalized_log_loss) {
    lines.push("ATOMS retains lower combined normalized log-loss without exact regional length in MODEL_1 and MODEL_2. The V2 advantage is therefore not solely dependent on exact length.");
  } else if (m3Atoms.normalized_log_loss < m3Eva.normalized_log_loss) {
    lines.push("ATOMS wins the published MODEL_3 exact-length configuration, but does not clearly survive the no-exact-length ablations. Treat the V2 advantage as feature-sensitive.");
  } else {
    lines.push("The published MODEL_3 advantage is not reproduced in this ablation run.");
  }
  return lines.join("\n");
}

function findSummary(subset, model, representation, scope) {
  return summaryRows.find((row) => row.subset === subset && row.model === model && row.representation === representation && row.scope === scope);
}

function findFolio(subset, model, representation, scope) {
  return folioRows.find((row) => row.subset === subset && row.model === model && row.representation === representation && row.scope === scope);
}

function toRegionRow(region) {
  const atomUnitIds = tokens(region.atoms_unit_sequence);
  const atomsSymbols = atomUnitIds.flatMap((unitId) => {
    const atomRow = atomRowsByUnitId.get(unitId);
    if (!atomRow) throw new Error(`Missing ATOMS unit in case tables: ${unitId}`);
    return tokens(atomRow.atoms);
  });
  return {
    ...region,
    evaSymbols: String(region.eva_token_sequence ?? "").replace(/\s+/g, "").split("").filter(Boolean),
    atomsSymbols,
  };
}

function makeLengthBinner(trainLengths) {
  const sorted = [...trainLengths].sort((a, b) => a - b);
  if (!sorted.length) return () => "medium";
  const shortMax = sorted[Math.floor((sorted.length - 1) / 3)];
  const mediumMax = sorted[Math.floor(((sorted.length - 1) * 2) / 3)];
  return (length) => {
    if (length <= shortMax) return "short";
    if (length <= mediumMax) return "medium";
    return "long";
  };
}

function coarsePosition(index, length) {
  const ratio = (index + 0.5) / length;
  if (ratio < 1 / 3) return "first_third";
  if (ratio < 2 / 3) return "middle_third";
  return "final_third";
}

function positionalRole(index, length) {
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
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

function getGroup(groups, key) {
  if (!groups.has(key)) groups.set(key, { total: 0, counts: new Map() });
  return groups.get(key);
}

function readCaseTsv(folio, fileName) {
  const filePath = path.join(evaCasesRoot, `${folio}-full`, fileName);
  return fs.existsSync(filePath) ? readTsv(filePath) : [];
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
    ...rows.map((row) => fields.map((field) => formatCell(row[field])).join("\t").trimEnd()),
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

function near(a, b) {
  return Math.abs(a - b) < 1e-12;
}
