import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const repoRoot = path.resolve(root, "..");
const outDir = path.resolve(root, args.out_dir ?? "out/representation-comparison-v2-regions");
const alignmentDir = path.resolve(root, "out/representation-alignment-v1");
const evaCasesRoot = path.resolve(repoRoot, "EVAComparisonLab/cases");
const alpha = Number(args.alpha ?? 0.5);
const corruptionsPerRegion = Number(args.corruptions ?? 100);
const seed = Number(args.seed ?? 20260713);

const trainFolios = new Set(["f1r", "f1v", "f47v"]);
const testFolios = ["f2r", "f2v"];
const folios = ["f1r", "f1v", "f2r", "f2v", "f47v"];
const atomsVocab = [
  "a:1", "b:1", "c:1", "c:2", "d:1", "e:1", "f:1", "g:1",
  "h:1", "h:2", "i:1", "j:1", "k:1", "l:1", "m:1", "n:1",
];

const alignedRegions = readTsv(path.join(alignmentDir, "aligned-regions.tsv"));
const unresolvedRegions = readTsv(path.join(alignmentDir, "unresolved-regions.tsv"));
const atomRowsByUnitId = new Map();
for (const folio of folios) {
  for (const row of readCaseTsv(folio, "atoms.tsv")) {
    atomRowsByUnitId.set(row.unit_id, row);
  }
}

const unresolvedEvaLineKeys = new Set(
  unresolvedRegions
    .filter((row) => row.side === "EVA")
    .map((row) => `${row.folio}|${row.line}`)
);
const regionRows = alignedRegions.map(toRegionRow);
const evaVocab = [...new Set(regionRows.flatMap((row) => row.evaSymbols))].sort();
const rng = mulberry32(seed);

const representations = [
  {
    name: "ATOMS",
    vocabulary: atomsVocab,
    sequence: (row) => row.atomsSymbols,
    sequenceText: (row) => row.atomsSymbols.join(" "),
  },
  {
    name: "EVA",
    vocabulary: evaVocab,
    sequence: (row) => row.evaSymbols,
    sequenceText: (row) => row.evaSymbols.join(""),
  },
];

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
  ...["1:1", "1:N", "N:1", "N:M"].map((relation) => ({
    name: `relation_${relation.replace(":", "_to_")}`,
    description: `Only relation type ${relation}.`,
    predicate: (row) => row.relation_type === relation,
  })),
];

const allSummaries = [];
const allRegionScores = [];
const allCorruptionRows = [];

for (const subset of subsets) {
  const subsetRows = regionRows.filter(subset.predicate);
  for (const representation of representations) {
    const result = runRepresentation(subset, subsetRows, representation);
    allSummaries.push(...result.summaries);
    allRegionScores.push(...result.regionScores);
    allCorruptionRows.push(...result.corruptionRows);
  }
}

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "representation-comparison-v2-summary.tsv"), allSummaries, [
  "subset",
  "representation",
  "scope",
  "train_regions_available",
  "train_regions_evaluated",
  "test_regions_available",
  "test_regions_evaluated",
  "train_coverage_of_all_train_regions",
  "test_coverage_of_all_test_regions",
  "vocabulary_size",
  "predicted_opportunities",
  "unseen_context_count",
  "unseen_context_rate",
  "log_loss_bits",
  "normalized_log_loss",
  "top1_accuracy",
  "mean_observed_probability",
  "bits_per_predicted_symbol",
  "total_regional_code_length_bits",
  "mean_bits_per_region",
]);
writeTsv(path.join(outDir, "representation-comparison-v2-region-scores.tsv"), allRegionScores, [
  "subset",
  "representation",
  "folio",
  "line",
  "region_id",
  "relation_type",
  "alignment_confidence",
  "sequence_length",
  "predicted_opportunities",
  "unseen_context_count",
  "log_loss_bits",
  "normalized_log_loss",
  "top1_correct_count",
  "top1_accuracy",
  "mean_observed_probability",
  "sequence",
]);
writeTsv(path.join(outDir, "representation-comparison-v2-corruption.tsv"), allCorruptionRows, [
  "subset",
  "representation",
  "folio",
  "line",
  "region_id",
  "relation_type",
  "alignment_confidence",
  "sequence_length",
  "predicted_opportunities",
  "corruptions",
  "real_code_length_bits",
  "median_corrupted_code_length_bits",
  "mean_corrupted_code_length_bits",
  "real_minus_median_corrupted_bits",
  "real_minus_mean_corrupted_bits",
  "real_better_than_median",
  "real_better_than_all_corruptions",
  "corrupted_better_count",
]);
fs.writeFileSync(path.join(outDir, "REPRESENTATION-COMPARISON-V2-REGIONS.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "REPRESENTATION-COMPARISON-V2-REGIONS.md"))}`);
for (const representation of representations) {
  const row = allSummaries.find((summary) => summary.subset === "all" && summary.representation === representation.name && summary.scope === "combined");
  console.log(`${representation.name}: normalized=${fmt(row.normalized_log_loss)}; top1=${pct(row.top1_accuracy)}; unseen=${pct(row.unseen_context_rate)}; regions=${row.test_regions_evaluated}`);
}

function runRepresentation(subset, rows, representation) {
  const trainRegions = rows.filter((row) => trainFolios.has(row.folio));
  const testRegions = rows.filter((row) => testFolios.includes(row.folio));
  const trainSequences = trainRegions.map((row) => sequenceRow(row, representation)).filter((row) => row.symbols.length >= 3);
  const testSequences = testRegions.map((row) => sequenceRow(row, representation)).filter((row) => row.symbols.length >= 3);
  const vocabularySet = new Set(representation.vocabulary);
  const model = trainLocalModel(trainSequences);
  const scoredRegions = testSequences.map((row) => scoreRegion(row, model, representation.vocabulary, vocabularySet));
  const summaries = [
    summarize(subset, representation, "combined", trainRegions, trainSequences, testRegions, testSequences, scoredRegions),
    ...testFolios.map((folio) => summarize(
      subset,
      representation,
      folio,
      trainRegions,
      trainSequences,
      testRegions.filter((row) => row.folio === folio),
      testSequences.filter((row) => row.folio === folio),
      scoredRegions.filter((row) => row.folio === folio),
    )),
  ];
  const regionScores = scoredRegions.map((row) => ({
    subset: subset.name,
    representation: representation.name,
    folio: row.folio,
    line: row.line,
    region_id: row.region_id,
    relation_type: row.relation_type,
    alignment_confidence: row.alignment_confidence,
    sequence_length: row.symbols.length,
    predicted_opportunities: row.opportunities.length,
    unseen_context_count: row.opportunities.filter((opportunity) => !opportunity.contextSeen).length,
    log_loss_bits: row.logLoss,
    normalized_log_loss: row.opportunities.length ? (row.logLoss / row.opportunities.length) / Math.log2(representation.vocabulary.length) : 0,
    top1_correct_count: row.opportunities.filter((opportunity) => opportunity.top1 === opportunity.observed).length,
    top1_accuracy: row.opportunities.length ? row.opportunities.filter((opportunity) => opportunity.top1 === opportunity.observed).length / row.opportunities.length : 0,
    mean_observed_probability: mean(row.opportunities.map((opportunity) => opportunity.probability)),
    sequence: representation.sequenceText(row.source),
  }));
  const corruptionRows = testSequences.map((row) => corruptionTest(subset, representation, row, model, vocabularySet));
  return { summaries, regionScores, corruptionRows };
}

function sequenceRow(row, representation) {
  return {
    source: row,
    folio: row.folio,
    line: row.line,
    region_id: row.region_id,
    relation_type: row.relation_type,
    alignment_confidence: row.alignment_confidence,
    symbols: representation.sequence(row),
  };
}

function trainLocalModel(sequences) {
  const groups = new Map();
  for (const sequence of sequences) {
    for (let index = 1; index < sequence.symbols.length - 1; index += 1) {
      const key = localKey(sequence.symbols, index);
      const group = getGroup(groups, key);
      const symbol = sequence.symbols[index];
      group.total += 1;
      group.counts.set(symbol, (group.counts.get(symbol) ?? 0) + 1);
    }
  }
  return groups;
}

function scoreRegion(sequence, model, vocabulary, vocabularySet) {
  const opportunities = [];
  for (let index = 1; index < sequence.symbols.length - 1; index += 1) {
    const observed = sequence.symbols[index];
    const context = localKey(sequence.symbols, index);
    const score = scoreSymbol(model, context, observed, vocabulary, vocabularySet);
    opportunities.push({
      observed,
      context,
      contextSeen: score.contextSeen,
      probability: score.probability,
      logLoss: score.logLoss,
      top1: score.top1,
    });
  }
  return {
    ...sequence,
    opportunities,
    logLoss: opportunities.reduce((sum, opportunity) => sum + opportunity.logLoss, 0),
  };
}

function scoreSymbol(model, context, observed, vocabulary, vocabularySet) {
  const group = model.get(context);
  const contextSeen = Boolean(group);
  const total = group?.total ?? 0;
  const counts = group?.counts ?? new Map();
  const denominator = total + alpha * vocabulary.length;
  const count = counts.get(observed) ?? 0;
  const probability = vocabularySet.has(observed) ? (count + alpha) / denominator : 0;
  return {
    contextSeen,
    probability,
    logLoss: probability > 0 ? -Math.log2(probability) : Infinity,
    top1: top1(counts, vocabulary),
  };
}

function summarize(subset, representation, scope, trainRegions, trainSequences, testRegions, testSequences, scoredRegions) {
  const opportunities = scoredRegions.flatMap((row) => row.opportunities);
  const totalBits = opportunities.reduce((sum, row) => sum + row.logLoss, 0);
  const logLoss = opportunities.length ? totalBits / opportunities.length : 0;
  const unseen = opportunities.filter((row) => !row.contextSeen).length;
  const top1Correct = opportunities.filter((row) => row.top1 === row.observed).length;
  const allTrainRegions = regionRows.filter((row) => trainFolios.has(row.folio)).length;
  const allScopeTestRegions = regionRows.filter((row) => scope === "combined" ? testFolios.includes(row.folio) : row.folio === scope).length;
  return {
    subset: subset.name,
    representation: representation.name,
    scope,
    train_regions_available: trainRegions.length,
    train_regions_evaluated: trainSequences.length,
    test_regions_available: testRegions.length,
    test_regions_evaluated: testSequences.length,
    train_coverage_of_all_train_regions: allTrainRegions ? trainRegions.length / allTrainRegions : 0,
    test_coverage_of_all_test_regions: allScopeTestRegions ? testRegions.length / allScopeTestRegions : 0,
    vocabulary_size: representation.vocabulary.length,
    predicted_opportunities: opportunities.length,
    unseen_context_count: unseen,
    unseen_context_rate: opportunities.length ? unseen / opportunities.length : 0,
    log_loss_bits: logLoss,
    normalized_log_loss: Math.log2(representation.vocabulary.length) ? logLoss / Math.log2(representation.vocabulary.length) : 0,
    top1_accuracy: opportunities.length ? top1Correct / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((row) => row.probability)),
    bits_per_predicted_symbol: logLoss,
    total_regional_code_length_bits: totalBits,
    mean_bits_per_region: testSequences.length ? totalBits / testSequences.length : 0,
  };
}

function corruptionTest(subset, representation, sequence, model, vocabularySet) {
  const realCodeLength = codeLength(sequence.symbols, model, representation.vocabulary, vocabularySet);
  const corruptedCodeLengths = [];
  for (let iteration = 0; iteration < corruptionsPerRegion; iteration += 1) {
    corruptedCodeLengths.push(codeLength(corruptInternal(sequence.symbols), model, representation.vocabulary, vocabularySet));
  }
  const sorted = [...corruptedCodeLengths].sort((a, b) => a - b);
  const medianCorrupted = median(sorted);
  const meanCorrupted = mean(corruptedCodeLengths);
  return {
    subset: subset.name,
    representation: representation.name,
    folio: sequence.folio,
    line: sequence.line,
    region_id: sequence.region_id,
    relation_type: sequence.relation_type,
    alignment_confidence: sequence.alignment_confidence,
    sequence_length: sequence.symbols.length,
    predicted_opportunities: Math.max(0, sequence.symbols.length - 2),
    corruptions: corruptionsPerRegion,
    real_code_length_bits: realCodeLength,
    median_corrupted_code_length_bits: medianCorrupted,
    mean_corrupted_code_length_bits: meanCorrupted,
    real_minus_median_corrupted_bits: realCodeLength - medianCorrupted,
    real_minus_mean_corrupted_bits: realCodeLength - meanCorrupted,
    real_better_than_median: realCodeLength < medianCorrupted ? "yes" : "no",
    real_better_than_all_corruptions: corruptedCodeLengths.every((value) => realCodeLength < value) ? "yes" : "no",
    corrupted_better_count: corruptedCodeLengths.filter((value) => value < realCodeLength).length,
  };
}

function codeLength(symbols, model, vocabulary, vocabularySet) {
  let total = 0;
  for (let index = 1; index < symbols.length - 1; index += 1) {
    total += scoreSymbol(model, localKey(symbols, index), symbols[index], vocabulary, vocabularySet).logLoss;
  }
  return total;
}

function corruptInternal(symbols) {
  if (symbols.length <= 3) return [...symbols];
  const internal = symbols.slice(1, -1);
  for (let index = internal.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [internal[index], internal[swap]] = [internal[swap], internal[index]];
  }
  return [symbols[0], ...internal, symbols.at(-1)];
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
    hasUnresolvedEvaOnLine: unresolvedEvaLineKeys.has(`${region.folio}|${region.line}`),
  };
}

function renderReport() {
  const lines = [];
  lines.push("# REPRESENTATION-COMPARISON-V2-REGIONS");
  lines.push("");
  lines.push("Purpose: compare ATOMS-V1 and EVA over the same aligned manuscript regions, without assuming one-to-one token correspondence.");
  lines.push("");
  lines.push("This is an exploratory regional comparison. It is not a decipherment claim and not a final proof that either representation is globally superior.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push("- Alignment: `out/representation-alignment-v1/aligned-regions.tsv`.");
  lines.push("- EVA source tokens: `EVAComparisonLab/cases/<folio>-full/eva-tokens.tsv`.");
  lines.push("- ATOMS source units: `EVAComparisonLab/cases/<folio>-full/atoms.tsv`.");
  lines.push("");
  lines.push("## Split And Vocabularies");
  lines.push("");
  lines.push("- Train folios: `f1r`, `f1v`, `f47v`.");
  lines.push("- Test folios: `f2r`, `f2v`.");
  lines.push(`- Smoothing: Lidstone alpha=\`${alpha}\`.`);
  lines.push(`- ATOMS vocabulary: fixed ATOMS-V1 inventory, ${atomsVocab.length} symbols.`);
  lines.push(`- EVA vocabulary: fixed EVA symbol inventory observed in the configured EVA source tables, ${evaVocab.length} symbols: \`${evaVocab.join(" ")}\`.`);
  lines.push("");
  lines.push("For every aligned region, EVA is scored as the character stream of all EVA tokens assigned to that region. ATOMS is scored as the concatenated ATOMS stream of all physical units assigned to that region.");
  lines.push("");
  lines.push("## Sensitivity Subsets");
  lines.push("");
  lines.push("| Subset | Description | Train regions | Test regions |");
  lines.push("| --- | --- | ---: | ---: |");
  for (const subset of subsets) {
    const rows = regionRows.filter(subset.predicate);
    lines.push(`| \`${subset.name}\` | ${subset.description} | ${rows.filter((row) => trainFolios.has(row.folio)).length} | ${rows.filter((row) => testFolios.includes(row.folio)).length} |`);
  }
  lines.push("");
  lines.push("Each subset trains and evaluates inside the same stratum. Small high-confidence strata should therefore be read as sensitivity checks, not as standalone decisive tests.");
  lines.push("");
  lines.push("## Primary Regional Results");
  lines.push("");
  lines.push("| Subset | Representation | Scope | Train regions | Test regions | Opps | Unseen ctx | Norm log-loss | Top-1 | Mean P(obs) | Bits/region |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const row of allSummaries.filter((summary) => summary.scope === "combined")) {
    lines.push(`| \`${row.subset}\` | ${row.representation} | \`${row.scope}\` | ${row.train_regions_evaluated} | ${row.test_regions_evaluated} | ${row.predicted_opportunities} | ${pct(row.unseen_context_rate)} | ${fmt(row.normalized_log_loss)} | ${pct(row.top1_accuracy)} | ${fmt(row.mean_observed_probability)} | ${fmt(row.mean_bits_per_region)} |`);
  }
  lines.push("");
  lines.push("### By Held-Out Folio");
  lines.push("");
  lines.push("| Subset | Representation | Folio | Test regions | Opps | Unseen ctx | Norm log-loss | Top-1 | Bits/region |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const row of allSummaries.filter((summary) => summary.scope !== "combined")) {
    lines.push(`| \`${row.subset}\` | ${row.representation} | \`${row.scope}\` | ${row.test_regions_evaluated} | ${row.predicted_opportunities} | ${pct(row.unseen_context_rate)} | ${fmt(row.normalized_log_loss)} | ${pct(row.top1_accuracy)} | ${fmt(row.mean_bits_per_region)} |`);
  }
  lines.push("");
  lines.push("## Real Versus Corrupted Regions");
  lines.push("");
  lines.push(`For each test region, ${corruptionsPerRegion} corrupted alternatives were generated by shuffling only the internal symbols. Length, first/last symbols, and internal symbol multiset are preserved.`);
  lines.push("");
  lines.push("| Subset | Representation | Regions | Real better than median | Real better than all | Mean real-minus-median bits | Median real-minus-median bits |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");
  for (const subset of subsets) {
    for (const representation of representations) {
      const rows = allCorruptionRows.filter((row) => row.subset === subset.name && row.representation === representation.name);
      const margins = rows.map((row) => Number(row.real_minus_median_corrupted_bits));
      lines.push(`| \`${subset.name}\` | ${representation.name} | ${rows.length} | ${pct(fraction(rows, (row) => row.real_better_than_median === "yes"))} | ${pct(fraction(rows, (row) => row.real_better_than_all_corruptions === "yes"))} | ${fmt(mean(margins))} | ${fmt(median([...margins].sort((a, b) => a - b)))} |`);
    }
  }
  lines.push("");
  lines.push("Negative real-minus-corrupted margin means the real region received a lower code length than corrupted versions.");
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push(renderInterpretation());
  lines.push("");
  lines.push("## Output Tables");
  lines.push("");
  lines.push("- `representation-comparison-v2-summary.tsv`");
  lines.push("- `representation-comparison-v2-region-scores.tsv`");
  lines.push("- `representation-comparison-v2-corruption.tsv`");
  return lines.join("\n") + "\n";
}

function renderInterpretation() {
  const lines = [];
  const allAtoms = summaryRow("all", "ATOMS", "combined");
  const allEva = summaryRow("all", "EVA", "combined");
  lines.push(compareMetric("combined normalized log-loss", allAtoms.normalized_log_loss, allEva.normalized_log_loss, "lower"));
  lines.push(compareMetric("combined top-1 accuracy", allAtoms.top1_accuracy, allEva.top1_accuracy, "higher"));
  lines.push(compareMetric("combined unseen-context rate", allAtoms.unseen_context_rate, allEva.unseen_context_rate, "lower"));
  const stable = ["medium", "medium_low_medium", "one_to_one"].map((subset) => {
    const atoms = summaryRow(subset, "ATOMS", "combined");
    const eva = summaryRow(subset, "EVA", "combined");
    if (!atoms || !eva || atoms.predicted_opportunities === 0 || eva.predicted_opportunities === 0) return `${subset}: insufficient sample`;
    if (atoms.normalized_log_loss < eva.normalized_log_loss && atoms.top1_accuracy >= eva.top1_accuracy) return `${subset}: ATOMS favorable`;
    if (eva.normalized_log_loss < atoms.normalized_log_loss && eva.top1_accuracy >= atoms.top1_accuracy) return `${subset}: EVA favorable`;
    return `${subset}: mixed`;
  });
  lines.push(`Sensitivity read: ${stable.join("; ")}.`);
  lines.push("If the apparent winner changes across confidence strata, the result should be treated as alignment-sensitive rather than representation-level evidence.");
  return lines.join("\n\n");
}

function compareMetric(label, atomsValue, evaValue, direction) {
  if (atomsValue === evaValue) return `ATOMS and EVA tie on ${label}.`;
  const atomsWins = direction === "lower" ? atomsValue < evaValue : atomsValue > evaValue;
  return `${atomsWins ? "ATOMS" : "EVA"} is better on ${label} under this regional protocol.`;
}

function summaryRow(subset, representation, scope) {
  return allSummaries.find((row) => row.subset === subset && row.representation === representation && row.scope === scope);
}

function localKey(symbols, index) {
  return [
    `length=${symbols.length}`,
    `role=${positionalRole(index, symbols.length)}`,
    `left=${symbols[index - 1]}`,
    `right=${symbols[index + 1]}`,
  ].join("|");
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

function median(sortedValues) {
  if (!sortedValues.length) return 0;
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 ? sortedValues[middle] : (sortedValues[middle - 1] + sortedValues[middle]) / 2;
}

function fraction(rows, predicate) {
  return rows.length ? rows.filter(predicate).length / rows.length : 0;
}

function fmt(value) {
  if (!Number.isFinite(value)) return "Infinity";
  return value.toFixed(6);
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function mulberry32(seedValue) {
  let value = seedValue >>> 0;
  return function rng() {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
