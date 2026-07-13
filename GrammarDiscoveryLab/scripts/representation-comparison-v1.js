import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const outDir = path.resolve(root, args.out_dir ?? "out/representation-comparison-v1");
const alpha = Number(args.alpha ?? 0.5);
const corruptionsPerSequence = Number(args.corruptions ?? 100);
const seed = Number(args.seed ?? 20260713);
const trainFolios = new Set(["f1r", "f1v", "f47v"]);
const testFolios = ["f2r", "f2v"];

const frozenDir = path.resolve(root, "frozen/GRAMMAR-V1-2026-07-13");
const trainAndF2rPath = path.join(frozenDir, "molecules-current.tsv");
const f2vPath = path.resolve(root, "frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv");

const allRows = [
  ...readTsv(trainAndF2rPath),
  ...readTsv(f2vPath).filter((row) => row.folio === "f2v"),
];
const pairedRows = allRows.filter((row) => tokens(row.signature).length >= 3 && evaSymbols(row).length >= 3);
const trainRows = pairedRows.filter((row) => trainFolios.has(row.folio));
const testRows = pairedRows.filter((row) => testFolios.includes(row.folio));
const rng = mulberry32(seed);

const representations = [
  {
    name: "ATOMS",
    sequence: (row) => tokens(row.signature),
    tokenization: "ATOMS signatures are whitespace-separated ATOMS-V1 labels.",
  },
  {
    name: "EVA",
    sequence: evaSymbols,
    tokenization: "EVA tokens are scored as raw character sequences from the exported EVA token string.",
  },
];

const results = representations.map(runRepresentation);

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "representation-comparison-summary.tsv"), results.flatMap((result) => result.summaries), [
  "representation",
  "scope",
  "train_vocabulary_size",
  "train_sequence_count",
  "test_sequence_count",
  "evaluated_symbol_opportunities",
  "zero_probability_count",
  "finite_opportunities",
  "unseen_test_context_count",
  "unseen_test_context_rate",
  "raw_log_loss_bits",
  "finite_log_loss_bits",
  "normalized_log_loss",
  "finite_normalized_log_loss",
  "top1_accuracy",
  "mean_observed_probability",
  "total_heldout_code_length_bits",
  "bits_per_sequence",
  "bits_per_predicted_symbol",
]);
writeTsv(path.join(outDir, "representation-comparison-opportunities.tsv"), results.flatMap((result) => result.opportunities), [
  "representation",
  "folio",
  "molecule_uid",
  "source_molecule_id",
  "sequence_length",
  "symbol_index",
  "observed_symbol",
  "left_symbol",
  "right_symbol",
  "positional_role",
  "local_context",
  "context_seen_in_train",
  "observed_in_train_vocab",
  "probability",
  "log_loss_bits",
  "top1_symbol",
  "top1_correct",
]);
writeTsv(path.join(outDir, "representation-corruption-test.tsv"), results.flatMap((result) => result.corruptionRows), [
  "representation",
  "folio",
  "molecule_uid",
  "source_molecule_id",
  "sequence_length",
  "predicted_symbols",
  "corruptions",
  "real_code_length_bits",
  "mean_corrupted_code_length_bits",
  "mean_real_minus_corrupted_margin",
  "fraction_real_lower_than_corrupted",
  "real_lower_count",
]);
fs.writeFileSync(path.join(outDir, "REPRESENTATION-COMPARISON-V1.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "REPRESENTATION-COMPARISON-V1.md"))}`);
for (const result of results) {
  const combined = result.summaries.find((row) => row.scope === "combined");
  console.log(`${result.name}: finite normalized log-loss=${fmt(combined.finite_normalized_log_loss)}; zero-prob=${combined.zero_probability_count}; top1=${pct(combined.top1_accuracy)}; unseen=${pct(combined.unseen_test_context_rate)}`);
}

function runRepresentation(representation) {
  const trainSequences = trainRows
    .map((row) => sequenceRow(row, representation))
    .filter((row) => row.symbols.length >= 3);
  const testSequences = testRows
    .map((row) => sequenceRow(row, representation))
    .filter((row) => row.symbols.length >= 3);
  const vocabulary = [...new Set(trainSequences.flatMap((row) => row.symbols))].sort();
  const vocabularySet = new Set(vocabulary);
  const model = trainLocalModel(trainSequences);
  const opportunities = testSequences.flatMap((row) => scoreSequence(row, model, vocabulary, vocabularySet, representation.name));
  const summaries = [
    summarize(representation.name, "combined", trainSequences, testSequences, vocabulary, opportunities),
    ...testFolios.map((folio) => summarize(
      representation.name,
      folio,
      trainSequences,
      testSequences.filter((row) => row.folio === folio),
      vocabulary,
      opportunities.filter((row) => row.folio === folio)
    )),
  ];
  const corruptionRows = testSequences.map((row) => corruptionTest(row, model, vocabulary, vocabularySet, representation.name));
  return { ...representation, trainSequences, testSequences, vocabulary, opportunities, summaries, corruptionRows };
}

function sequenceRow(row, representation) {
  return {
    folio: row.folio,
    molecule_uid: row.molecule_uid,
    source_molecule_id: row.source_molecule_id,
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

function scoreSequence(sequence, model, vocabulary, vocabularySet, representationName) {
  const rows = [];
  for (let index = 1; index < sequence.symbols.length - 1; index += 1) {
    const observed = sequence.symbols[index];
    const context = localKey(sequence.symbols, index);
    const score = scoreSymbol(model, context, observed, vocabulary, vocabularySet);
    rows.push({
      representation: representationName,
      folio: sequence.folio,
      molecule_uid: sequence.molecule_uid,
      source_molecule_id: sequence.source_molecule_id,
      sequence_length: sequence.symbols.length,
      symbol_index: index + 1,
      observed_symbol: observed,
      left_symbol: sequence.symbols[index - 1],
      right_symbol: sequence.symbols[index + 1],
      positional_role: positionalRole(index, sequence.symbols.length),
      local_context: context,
      context_seen_in_train: score.contextSeen ? "yes" : "no",
      observed_in_train_vocab: vocabularySet.has(observed) ? "yes" : "no",
      probability: score.probability,
      log_loss_bits: score.logLoss,
      top1_symbol: score.top1,
      top1_correct: score.top1 === observed ? "yes" : "no",
    });
  }
  return rows;
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
    top1: top1(counts, total, vocabulary),
  };
}

function summarize(representation, scope, trainSequences, testSequences, vocabulary, opportunities) {
  const finite = opportunities.filter((row) => Number.isFinite(row.log_loss_bits));
  const zeroProbabilityCount = opportunities.filter((row) => Number(row.probability) === 0).length;
  const totalBits = finite.reduce((sum, row) => sum + row.log_loss_bits, 0);
  const finiteLogLoss = finite.length ? totalBits / finite.length : Infinity;
  const rawLogLoss = zeroProbabilityCount > 0 ? Infinity : finiteLogLoss;
  const vocabBits = Math.log2(vocabulary.length);
  const unseen = opportunities.filter((row) => row.context_seen_in_train === "no").length;
  return {
    representation,
    scope,
    train_vocabulary_size: vocabulary.length,
    train_sequence_count: trainSequences.length,
    test_sequence_count: testSequences.length,
    evaluated_symbol_opportunities: opportunities.length,
    zero_probability_count: zeroProbabilityCount,
    finite_opportunities: finite.length,
    unseen_test_context_count: unseen,
    unseen_test_context_rate: opportunities.length ? unseen / opportunities.length : 0,
    raw_log_loss_bits: rawLogLoss,
    finite_log_loss_bits: finiteLogLoss,
    normalized_log_loss: vocabBits ? rawLogLoss / vocabBits : Infinity,
    finite_normalized_log_loss: vocabBits ? finiteLogLoss / vocabBits : Infinity,
    top1_accuracy: opportunities.length ? opportunities.filter((row) => row.top1_correct === "yes").length / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((row) => row.probability)),
    total_heldout_code_length_bits: totalBits,
    bits_per_sequence: testSequences.length ? totalBits / testSequences.length : Infinity,
    bits_per_predicted_symbol: rawLogLoss,
  };
}

function corruptionTest(sequence, model, vocabulary, vocabularySet, representationName) {
  const realCodeLength = codeLength(sequence.symbols, model, vocabulary, vocabularySet);
  let lowerCount = 0;
  let marginSum = 0;
  for (let iteration = 0; iteration < corruptionsPerSequence; iteration += 1) {
    const corrupted = corruptInternal(sequence.symbols);
    const corruptedCodeLength = codeLength(corrupted, model, vocabulary, vocabularySet);
    if (realCodeLength < corruptedCodeLength) lowerCount += 1;
    marginSum += realCodeLength - corruptedCodeLength;
  }
  return {
    representation: representationName,
    folio: sequence.folio,
    molecule_uid: sequence.molecule_uid,
    source_molecule_id: sequence.source_molecule_id,
    sequence_length: sequence.symbols.length,
    predicted_symbols: Math.max(0, sequence.symbols.length - 2),
    corruptions: corruptionsPerSequence,
    real_code_length_bits: realCodeLength,
    mean_corrupted_code_length_bits: realCodeLength - marginSum / corruptionsPerSequence,
    mean_real_minus_corrupted_margin: marginSum / corruptionsPerSequence,
    fraction_real_lower_than_corrupted: lowerCount / corruptionsPerSequence,
    real_lower_count: lowerCount,
  };
}

function codeLength(symbols, model, vocabulary, vocabularySet) {
  let total = 0;
  for (let index = 1; index < symbols.length - 1; index += 1) {
    const context = localKey(symbols, index);
    total += scoreSymbol(model, context, symbols[index], vocabulary, vocabularySet).logLoss;
  }
  return total;
}

function corruptInternal(symbols) {
  const result = [...symbols];
  const internal = result.slice(1, -1);
  for (let index = internal.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [internal[index], internal[swap]] = [internal[swap], internal[index]];
  }
  return [result[0], ...internal, result.at(-1)];
}

function renderReport() {
  const lines = [];
  lines.push("# REPRESENTATION-COMPARISON-V1");
  lines.push("");
  lines.push("Purpose: compare ATOMS-V1 and EVA under matched out-of-sample local-context prediction.");
  lines.push("");
  lines.push("This is not a decipherment claim and not a proof of optimality. It asks whether one representation gives more predictable held-out symbol sequences under the same protocol.");
  lines.push("");
  lines.push("## Split");
  lines.push("");
  lines.push("- Train folios: `f1r`, `f1v`, `f47v`.");
  lines.push("- Test folios: `f2r`, `f2v`.");
  lines.push("- Smoothing: fixed Lidstone `alpha=0.5`, fitted from train only.");
  lines.push("- Predicted opportunities: internal symbols only, excluding first and last symbols of each sequence.");
  lines.push("- Comparison rows: paired molecules only, requiring both an ATOMS signature and an aligned exported EVA token with at least three symbols.");
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push("| Split | Total molecule rows | Paired rows used | Coverage |");
  lines.push("| --- | ---: | ---: | ---: |");
  pushCoverage(lines, "train", (row) => trainFolios.has(row.folio));
  pushCoverage(lines, "f2r", (row) => row.folio === "f2r");
  pushCoverage(lines, "f2v", (row) => row.folio === "f2v");
  pushCoverage(lines, "test combined", (row) => testFolios.includes(row.folio));
  lines.push("");
  lines.push("This V1 comparison is therefore a matched aligned-subset test, not yet a complete-EVA-folio test.");
  lines.push("");
  lines.push("## Tokenization");
  lines.push("");
  for (const result of results) {
    lines.push(`- ${result.name}: ${result.tokenization}`);
  }
  lines.push("");
  lines.push("## Local-Context Model");
  lines.push("");
  lines.push("For each internal symbol, the model uses only:");
  lines.push("");
  lines.push("- immediate left symbol;");
  lines.push("- immediate right symbol;");
  lines.push("- positional role;");
  lines.push("- sequence length.");
  lines.push("");
  lines.push("All context distributions, vocabularies, and smoothing denominators are estimated from train only.");
  lines.push("");
  lines.push("## Primary Results");
  lines.push("");
  lines.push("| Representation | Scope | Vocab | Train seq | Test seq | Opps | Zero-prob | Unseen context rate | Raw log-loss | Finite log-loss | Raw normalized | Finite normalized | Top-1 | Mean P(obs) | Total finite bits | Bits/seq |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const row of results.flatMap((result) => result.summaries)) {
    lines.push(`| ${row.representation} | \`${row.scope}\` | ${row.train_vocabulary_size} | ${row.train_sequence_count} | ${row.test_sequence_count} | ${row.evaluated_symbol_opportunities} | ${row.zero_probability_count} | ${pct(row.unseen_test_context_rate)} | ${fmt(row.raw_log_loss_bits)} | ${fmt(row.finite_log_loss_bits)} | ${fmt(row.normalized_log_loss)} | ${fmt(row.finite_normalized_log_loss)} | ${pct(row.top1_accuracy)} | ${fmt(row.mean_observed_probability)} | ${fmt(row.total_heldout_code_length_bits)} | ${fmt(row.bits_per_sequence)} |`);
  }
  lines.push("");
  lines.push("Primary comparison should use normalized log-loss, top-1 accuracy, unseen-context rate, and zero-probability count. If zero-probability events occur, raw log-loss is infinite; finite log-loss is shown only as a diagnostic on the remaining opportunities.");
  lines.push("");
  lines.push("## Matched Corruption Test");
  lines.push("");
  lines.push(`For each held-out sequence, ${corruptionsPerSequence} corrupted alternatives were generated by shuffling only internal symbols while preserving sequence length, first/last symbols, and the internal symbol multiset.`);
  lines.push("");
  lines.push("| Representation | Scope | Sequences | Fraction real lower than corrupted | Mean real-minus-corrupted bits |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const result of results) {
    for (const scope of ["combined", ...testFolios]) {
      const rows = scope === "combined" ? result.corruptionRows : result.corruptionRows.filter((row) => row.folio === scope);
      const totalComparisons = rows.reduce((sum, row) => sum + Number(row.corruptions), 0);
      const lower = rows.reduce((sum, row) => sum + Number(row.real_lower_count), 0);
      const weightedMargin = rows.reduce((sum, row) => sum + Number(row.mean_real_minus_corrupted_margin) * Number(row.corruptions), 0);
      lines.push(`| ${result.name} | \`${scope}\` | ${rows.length} | ${pct(totalComparisons ? lower / totalComparisons : 0)} | ${fmt(totalComparisons ? weightedMargin / totalComparisons : 0)} |`);
    }
  }
  lines.push("");
  lines.push("Negative real-minus-corrupted margin means the real sequence receives lower code length than corrupted alternatives.");
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push(interpretResults());
  lines.push("");
  lines.push("## Output Tables");
  lines.push("");
  lines.push("- `representation-comparison-summary.tsv`");
  lines.push("- `representation-comparison-opportunities.tsv`");
  lines.push("- `representation-corruption-test.tsv`");
  return lines.join("\n") + "\n";
}

function interpretResults() {
  const atoms = results.find((result) => result.name === "ATOMS").summaries.find((row) => row.scope === "combined");
  const eva = results.find((result) => result.name === "EVA").summaries.find((row) => row.scope === "combined");
  const lines = [];
  if (atoms.normalized_log_loss < eva.normalized_log_loss) {
    lines.push("ATOMS has lower combined normalized held-out log-loss than EVA under this matched local-context protocol.");
  } else if (atoms.normalized_log_loss > eva.normalized_log_loss) {
    lines.push("EVA has lower combined normalized held-out log-loss than ATOMS under this matched local-context protocol.");
  } else {
    lines.push("ATOMS and EVA tie on combined normalized held-out log-loss under this protocol.");
  }
  if (atoms.top1_accuracy > eva.top1_accuracy) {
    lines.push("ATOMS has higher combined top-1 accuracy.");
  } else if (atoms.top1_accuracy < eva.top1_accuracy) {
    lines.push("EVA has higher combined top-1 accuracy.");
  } else {
    lines.push("ATOMS and EVA tie on combined top-1 accuracy.");
  }
  if (atoms.unseen_test_context_rate < eva.unseen_test_context_rate) {
    lines.push("ATOMS has a lower unseen-context rate.");
  } else if (atoms.unseen_test_context_rate > eva.unseen_test_context_rate) {
    lines.push("EVA has a lower unseen-context rate.");
  } else {
    lines.push("ATOMS and EVA tie on unseen-context rate.");
  }
  if (atoms.zero_probability_count || eva.zero_probability_count) {
    lines.push(`Zero-probability held-out events: ATOMS=${atoms.zero_probability_count}, EVA=${eva.zero_probability_count}.`);
  }
  return lines.join("\n\n");
}

function pushCoverage(lines, label, predicate) {
  const total = allRows.filter(predicate).length;
  const paired = pairedRows.filter(predicate).length;
  lines.push(`| \`${label}\` | ${total} | ${paired} | ${pct(total ? paired / total : 0)} |`);
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

function top1(counts, total, vocabulary) {
  if (!total) return vocabulary[0] ?? "";
  let best = "";
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
  if (!groups.has(key)) {
    groups.set(key, { total: 0, counts: new Map() });
  }
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

function evaSymbols(row) {
  return String(row.eva_token ?? "").trim().split("").filter(Boolean);
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
