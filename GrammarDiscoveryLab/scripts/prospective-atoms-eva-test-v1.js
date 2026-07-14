import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(root, "..");
const evaLabRoot = path.join(repoRoot, "EVAComparisonLab");
const preregDir = path.join(repoRoot, "research/preregistrations/prospective-atoms-eva-test-v1");
const protocolPath = path.join(preregDir, "protocol.json");
const checksumsPath = path.join(preregDir, "checksums.txt");
const outDir = path.join(root, "out/prospective-atoms-eva-test-v1");
const casesRoot = path.join(evaLabRoot, "cases");
const alpha = 0.5;
const corruptionsPerRegion = 100;
const seed = 20260714;
const dbPath = path.resolve(
  arg("--db") ?? path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);

const allowExecute = hasFlag("--confirm-complete");
const dryRunOnly = hasFlag("--preflight") || !allowExecute;
const protocol = readJson(protocolPath);
const target = protocol.target;
const targetFolio = target.expectedFolio;
const trainFolios = new Set(protocol.frozenTrainingFolios);
const previousFolios = protocol.previouslyEvaluatedFolios;
const testFolios = [targetFolio];
const allFolios = [...protocol.frozenTrainingFolios, ...previousFolios, targetFolio];
const atomsVocab = protocol.fixedParameters.atomsVocabulary;
const rng = mulberry32(seed);

const publishedV3Regression = {
  atomsNormalizedLogLoss: 0.8079217691095135,
  atomsTop1Accuracy: 0.4296407185628742,
  atomsUnseenContextRate: 0.46182634730538924,
  evaNormalizedLogLoss: 0.8927056812757962,
  evaTop1Accuracy: 0.2629815745393635,
  evaUnseenContextRate: 0.6046901172529313,
};

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
    label: "Published V2 exact-length regression",
    description: "Exact regional sequence length, positional role, and immediate neighbors.",
    key: ({ symbols, index }) => [
      `length=${symbols.length}`,
      `role=${positionalRole(index, symbols.length)}`,
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
    ].join("|"),
  },
  {
    id: "MODEL_4",
    label: "Neighbors plus coarse position and training-only length tertile",
    description: "Immediate neighbors, coarse position, and representation-specific train length tertile.",
    key: ({ symbols, index, lengthBin }) => [
      `left=${symbols[index - 1]}`,
      `right=${symbols[index + 1]}`,
      `coarse=${coarsePosition(index, symbols.length)}`,
      `length_bin=${lengthBin}`,
    ].join("|"),
  },
];

fs.mkdirSync(outDir, { recursive: true });

const preregOk = verifyPreregistrationChecksums();
const dbMetadata = inspectDatasetCreatorMetadata();
const regression = verifyPublishedRegression();
const priorFolios = new Set([...protocol.frozenTrainingFolios, ...protocol.previouslyEvaluatedFolios]);
const targetImage = dbMetadata.images.find((image) => image.id === target.datasetCreatorImageId);
const failures = guardrailFailures();

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

exportCompletedTargetCase();
const { lineAuditRows, alignedRegions, unresolvedRegions } = buildProspectiveAlignment();
const unresolvedEvaLineKeys = new Set(
  unresolvedRegions.filter((row) => row.side === "EVA").map((row) => `${row.folio}|${row.line}`)
);
const targetOutOfVocabulary = collectTargetOutOfVocabulary();
const results = runProspectiveModels(alignedRegions, unresolvedEvaLineKeys);
const classification = classifyOutcome(results.summaryRows, alignedRegions, targetOutOfVocabulary);
writeCompletionOutputs({ lineAuditRows, alignedRegions, unresolvedRegions, results, classification });
console.log(`Prospective test complete: ${classification.classification}`);
console.log(`Primary MODEL_1 all: ATOMS=${fmt(primaryRow(results.summaryRows, "ATOMS").normalized_log_loss)} EVA=${fmt(primaryRow(results.summaryRows, "EVA").normalized_log_loss)} delta=${fmt(primaryDiff(results.summaryRows).atoms_minus_eva_normalized_log_loss)}`);

function guardrailFailures() {
  const errors = [];
  if (!preregOk.ok) errors.push(...preregOk.errors);
  if (!regression.ok) errors.push(...regression.errors);
  if (!targetImage) errors.push(`Target image ID ${target.datasetCreatorImageId} not found in DatasetCreator DB.`);
  if (targetImage && targetImage.name !== target.datasetCreatorImageName) {
    errors.push(`Target image name mismatch: protocol=${target.datasetCreatorImageName}, db=${targetImage.name}.`);
  }
  if (priorFolios.has(target.expectedFolio)) {
    errors.push(`Target folio ${target.expectedFolio} is already a train or previously evaluated folio.`);
  }
  if (!fs.existsSync(dbPath)) errors.push(`DatasetCreator DB not found: ${dbPath}`);
  if (targetImage && (targetImage.atoms <= 0 || targetImage.molecules <= 0)) {
    errors.push(`Target image has insufficient annotations: atoms=${targetImage.atoms}, molecules=${targetImage.molecules}.`);
  }
  return errors;
}

function exportCompletedTargetCase() {
  const caseDir = path.join(casesRoot, `${targetFolio}-full`);
  fs.mkdirSync(caseDir, { recursive: true });
  execFileSync("node", [
    "scripts/extract-ivtff-page.js",
    "--source",
    "sources/IT2a-n.txt",
    "--page",
    targetFolio,
    "--out-dir",
    `cases/${targetFolio}-full`,
  ], { cwd: evaLabRoot, stdio: "inherit" });
  execFileSync("node", [
    "scripts/export-datasetcreator-atoms.js",
    "--image",
    target.datasetCreatorImageName,
    "--out",
    `cases/${targetFolio}-full/atoms-current.tsv`,
  ], { cwd: evaLabRoot, stdio: "inherit" });
}

function buildProspectiveAlignment() {
  const evaLinesByFolio = new Map(allFolios.map((folio) => [folio, readCaseTsv(folio, "eva-lines.tsv")]));
  const evaTokensByFolio = new Map(allFolios.map((folio) => [folio, readCaseTsv(folio, "eva-tokens.tsv")]));
  const atomsByFolio = new Map(allFolios.map((folio) => [folio, readCaseTsv(folio, "atoms-current.tsv")]));
  const lineAuditRows = [];
  const aligned = [];
  const unresolved = [];

  for (const folio of allFolios) {
    const evaLines = evaLinesByFolio.get(folio) ?? [];
    const atoms = atomsByFolio.get(folio) ?? [];
    const atomsByRow = groupBy(atoms, (row) => row.row_index);
    const physicalRows = [...atomsByRow.entries()]
      .map(([rowIndex, rows]) => physicalRowSummary(folioToImageName(folio), rowIndex, rows))
      .sort((a, b) => Number(a.physical_row) - Number(b.physical_row));
    const maxRows = Math.max(evaLines.length, physicalRows.length);
    for (let index = 0; index < maxRows; index += 1) {
      const eva = evaLines[index];
      const physical = physicalRows[index];
      lineAuditRows.push({
        image_name: folioToImageName(folio),
        ordinal: index + 1,
        status: eva && physical ? "paired-by-ordinal" : eva ? "eva-only" : physical ? "physical-only" : "empty",
        eva_page: eva?.page ?? "",
        eva_paragraph: eva?.paragraph ?? "",
        eva_line: eva?.line ?? "",
        eva_token_count: eva ? tokens(eva.eva).length : "",
        physical_row: physical?.physical_row ?? "",
        physical_unit_count: physical?.physical_unit_count ?? "",
        physical_y_min: physical?.physical_y_min ?? "",
        physical_y_max: physical?.physical_y_max ?? "",
        physical_first_unit: physical?.physical_first_unit ?? "",
        physical_last_unit: physical?.physical_last_unit ?? "",
        note: eva && physical ? "ordinal pair only; not visual proof of exact alignment" : "unpaired line side",
      });
    }
  }

  for (const line of lineAuditRows.filter((row) => row.status === "paired-by-ordinal")) {
    alignLine(line, evaTokensByFolio, atomsByFolio, aligned, unresolved);
  }

  return { lineAuditRows, alignedRegions: aligned, unresolvedRegions: unresolved };
}

function alignLine(line, evaTokensByFolio, atomsByFolio, alignedRegions, unresolvedRegions) {
  const folio = line.eva_page;
  const lineId = String(line.eva_line);
  const evaLineTokens = (evaTokensByFolio.get(folio) ?? [])
    .filter((row) => String(row.line) === lineId)
    .sort((a, b) => Number(a.token_index) - Number(b.token_index));
  const atomUnits = (atomsByFolio.get(folio) ?? [])
    .filter((row) => String(row.row_index) === String(line.physical_row))
    .sort((a, b) => Number(a.bounds_x) - Number(b.bounds_x) || Number(a.unit_index) - Number(b.unit_index));

  if (!evaLineTokens.length || !atomUnits.length) {
    unresolvedRegions.push({
      folio,
      line: lineId,
      region_id: `${folio}-l${lineId}-unresolved`,
      side: !evaLineTokens.length ? "EVA" : "ATOMS",
      item_sequence: "",
      item_count: 0,
      reason: "missing-line-side",
      note: "Line audit paired the row, but one side has no tokens/units in the case tables.",
    });
    return;
  }

  const evaIntervals = evaLineTokens.map((token, index) => ({
    index,
    start: index / evaLineTokens.length,
    end: (index + 1) / evaLineTokens.length,
    row: token,
  }));
  const xMin = Math.min(...atomUnits.map((unit) => Number(unit.bounds_x)));
  const xMax = Math.max(...atomUnits.map((unit) => Number(unit.bounds_x) + Number(unit.bounds_w)));
  const width = Math.max(1, xMax - xMin);
  const atomIntervals = atomUnits.map((unit, index) => ({
    index,
    start: (Number(unit.bounds_x) - xMin) / width,
    end: (Number(unit.bounds_x) + Number(unit.bounds_w) - xMin) / width,
    row: unit,
  }));

  const edges = [];
  for (const eva of evaIntervals) {
    for (const atom of atomIntervals) {
      if (intervalOverlap(eva, atom) > 0) edges.push([eva.index, atom.index]);
    }
  }

  const components = connectedComponents(evaLineTokens.length, atomUnits.length, edges);
  const usedEva = new Set();
  const usedAtoms = new Set();

  for (const component of components) {
    const evaIndexes = [...component.eva].sort((a, b) => a - b);
    const atomIndexes = [...component.atoms].sort((a, b) => a - b);
    for (const index of evaIndexes) usedEva.add(index);
    for (const index of atomIndexes) usedAtoms.add(index);
    if (!evaIndexes.length || !atomIndexes.length) continue;

    const evaRows = evaIndexes.map((index) => evaLineTokens[index]);
    const atomRows = atomIndexes.map((index) => atomUnits[index]);
    const regionNumber = alignedRegions.filter((row) => row.folio === folio && row.line === lineId).length + 1;
    const relation = relationType(evaRows.length, atomRows.length);
    const confidence = alignmentConfidence(line, relation);
    const atomXMin = Math.min(...atomRows.map((row) => Number(row.bounds_x)));
    const atomXMax = Math.max(...atomRows.map((row) => Number(row.bounds_x) + Number(row.bounds_w)));
    const evaOrdinalRange = `${evaRows[0].token_index}-${evaRows.at(-1).token_index}/${evaLineTokens.length}`;
    alignedRegions.push({
      folio,
      line: lineId,
      region_id: `${folio}-l${lineId}-r${String(regionNumber).padStart(3, "0")}`,
      eva_token_sequence: evaRows.map((row) => row.eva).join(" "),
      eva_token_count: evaRows.length,
      eva_symbol_count: evaRows.reduce((sum, row) => sum + String(row.eva).length, 0),
      atoms_unit_sequence: atomRows.map((row) => row.unit_id).join(" "),
      atoms_unit_count: atomRows.length,
      atoms_symbol_count: atomRows.reduce((sum, row) => sum + tokens(row.atoms).length, 0),
      relation_type: relation,
      alignment_confidence: confidence,
      coordinate_evidence: `atoms_x=${atomXMin}-${atomXMax}; eva_ordinal=${evaOrdinalRange}; line_pair=${line.status}`,
      ambiguity_note: ambiguityNote(line, relation),
    });
  }

  for (const eva of evaIntervals) {
    if (!usedEva.has(eva.index)) {
      unresolvedRegions.push({
        folio,
        line: lineId,
        region_id: `${folio}-l${lineId}-eva-${eva.row.token_index}`,
        side: "EVA",
        item_sequence: eva.row.eva,
        item_count: 1,
        reason: "no-overlapping-atoms-span",
        note: "EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate.",
      });
    }
  }
  for (const atom of atomIntervals) {
    if (!usedAtoms.has(atom.index)) {
      unresolvedRegions.push({
        folio,
        line: lineId,
        region_id: `${folio}-l${lineId}-atoms-${atom.row.unit_id}`,
        side: "ATOMS",
        item_sequence: atom.row.unit_id,
        item_count: 1,
        reason: "no-overlapping-eva-span",
        note: "ATOMS unit has no overlap with any EVA ordinal span under line-level estimate.",
      });
    }
  }
}

function runProspectiveModels(alignedRegions, unresolvedEvaLineKeys) {
  const atomRowsByUnitId = new Map();
  for (const folio of allFolios) {
    for (const row of readCaseTsv(folio, "atoms-current.tsv")) {
      atomRowsByUnitId.set(row.unit_id, row);
    }
  }
  const regionRows = alignedRegions.map((region) => toRegionRow(region, atomRowsByUnitId));
  const evaVocab = [...new Set(regionRows.flatMap((row) => row.evaSymbols))].sort();
  const representations = [
    { name: "ATOMS", vocabulary: atomsVocab, sequence: (row) => row.atomsSymbols, sequenceText: (row) => row.atomsSymbols.join(" ") },
    { name: "EVA", vocabulary: evaVocab, sequence: (row) => row.evaSymbols, sequenceText: (row) => row.evaSymbols.join("") },
  ];

  const activeSubsets = subsets.map((subset) => ({
    ...subset,
    predicate: subset.name === "exclude_unresolved_eva_lines"
      ? (row) => !unresolvedEvaLineKeys.has(`${row.folio}|${row.line}`)
      : subset.predicate,
  }));
  const summaryRows = [];
  const folioRows = [];
  const regionScoreRows = [];
  const corruptionRows = [];

  for (const subset of activeSubsets) {
    const subsetRows = regionRows.filter(subset.predicate);
    for (const model of modelVariants) {
      const resultByRepresentation = new Map();
      for (const representation of representations) {
        const result = runModel(subset, subsetRows, model, representation);
        resultByRepresentation.set(representation.name, result);
        summaryRows.push(result.combined);
        folioRows.push(...result.byFolio);
        regionScoreRows.push(...result.regionScores);
        corruptionRows.push(...result.corruptionRows);
      }
      summaryRows.push(diffRow(subset.name, model.id, "combined", resultByRepresentation));
      for (const folio of testFolios) {
        const scoped = new Map();
        for (const [name, result] of resultByRepresentation.entries()) {
          scoped.set(name, { combined: result.byFolio.find((row) => row.scope === folio) });
        }
        folioRows.push(diffRow(subset.name, model.id, folio, scoped));
      }
    }
  }

  return { summaryRows, folioRows, regionScoreRows, corruptionRows, evaVocab };
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
  const regionScores = scored.map((row) => regionScoreRow(subset.name, model, representation, row));
  const corruptionRows = model.id === "MODEL_1"
    ? testSequences.map((row) => corruptionTest(subset.name, model, representation, row, modelGroups, vocabularySet))
    : [];
  return { combined, byFolio, regionScores, corruptionRows };
}

function sequenceRow(row, representation, lengthBinner) {
  const symbols = representation.sequence(row);
  return {
    source: row,
    folio: row.folio,
    line: row.line,
    region_id: row.region_id,
    relation_type: row.relation_type,
    alignment_confidence: row.alignment_confidence,
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
    const score = scoreSymbol(groups, key, observed, vocabulary, vocabularySet);
    opportunities.push({ observed, context: key, ...score });
  }
  return { ...sequence, opportunities };
}

function scoreSymbol(groups, key, observed, vocabulary, vocabularySet) {
  const group = groups.get(key);
  const counts = group?.counts ?? new Map();
  const total = group?.total ?? 0;
  const probability = vocabularySet.has(observed)
    ? ((counts.get(observed) ?? 0) + alpha) / (total + alpha * vocabulary.length)
    : 0;
  return {
    contextSeen: Boolean(group),
    probability,
    logLoss: probability > 0 ? -Math.log2(probability) : Infinity,
    top1: top1(counts, vocabulary),
  };
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
    raw_log_loss_bits: logLoss,
    normalized_log_loss: Math.log2(representation.vocabulary.length) ? logLoss / Math.log2(representation.vocabulary.length) : 0,
    top1_accuracy: opportunities.length ? top1Correct / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((row) => row.probability)),
    total_heldout_code_length_bits: totalBits,
    bits_per_sequence: testSequences.length ? totalBits / testSequences.length : 0,
    bits_per_predicted_symbol: logLoss,
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
    raw_log_loss_bits: "",
    normalized_log_loss: "",
    top1_accuracy: "",
    mean_observed_probability: "",
    total_heldout_code_length_bits: "",
    bits_per_sequence: "",
    bits_per_predicted_symbol: "",
    atoms_minus_eva_normalized_log_loss: atoms.normalized_log_loss - eva.normalized_log_loss,
    atoms_minus_eva_top1_accuracy: atoms.top1_accuracy - eva.top1_accuracy,
    atoms_minus_eva_unseen_context_rate: atoms.unseen_context_rate - eva.unseen_context_rate,
    atoms_minus_eva_mean_observed_probability: atoms.mean_observed_probability - eva.mean_observed_probability,
  };
}

function regionScoreRow(subset, model, representation, row) {
  const opportunities = row.opportunities;
  const totalBits = opportunities.reduce((sum, item) => sum + item.logLoss, 0);
  return {
    subset,
    model: model.id,
    representation: representation.name,
    folio: row.folio,
    line: row.line,
    region_id: row.region_id,
    relation_type: row.relation_type,
    alignment_confidence: row.alignment_confidence,
    sequence_length: row.symbols.length,
    evaluated_opportunities: opportunities.length,
    unseen_context_count: opportunities.filter((item) => !item.contextSeen).length,
    log_loss_bits: totalBits,
    normalized_log_loss: opportunities.length ? (totalBits / opportunities.length) / Math.log2(representation.vocabulary.length) : 0,
    top1_accuracy: opportunities.length ? opportunities.filter((item) => item.top1 === item.observed).length / opportunities.length : 0,
    mean_observed_probability: mean(opportunities.map((item) => item.probability)),
    sequence: representation.sequenceText(row.source),
  };
}

function corruptionTest(subset, model, representation, sequence, groups, vocabularySet) {
  const realCodeLength = codeLength(sequence.symbols, model, groups, representation.vocabulary, vocabularySet, sequence.lengthBin);
  const corruptedCodeLengths = [];
  for (let iteration = 0; iteration < corruptionsPerRegion; iteration += 1) {
    corruptedCodeLengths.push(codeLength(corruptInternal(sequence.symbols), model, groups, representation.vocabulary, vocabularySet, sequence.lengthBin));
  }
  const sorted = [...corruptedCodeLengths].sort((a, b) => a - b);
  const medianCorrupted = median(sorted);
  const meanCorrupted = mean(corruptedCodeLengths);
  return {
    subset,
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

function codeLength(symbols, model, groups, vocabulary, vocabularySet, lengthBin) {
  let total = 0;
  for (let index = 1; index < symbols.length - 1; index += 1) {
    const key = model.key({ symbols, index, lengthBin });
    total += scoreSymbol(groups, key, symbols[index], vocabulary, vocabularySet).logLoss;
  }
  return total;
}

function collectTargetOutOfVocabulary() {
  const vocab = new Set(atomsVocab);
  const rows = readCaseTsv(targetFolio, "atoms-current.tsv");
  const counts = new Map();
  const locations = [];
  for (const row of rows) {
    const atomIds = tokens(row.atom_ids);
    const rowTokens = tokens(row.atoms);
    rowTokens.forEach((token, index) => {
      if (vocab.has(token)) return;
      counts.set(token, (counts.get(token) ?? 0) + 1);
      locations.push({
        symbol: token,
        unit_id: row.unit_id,
        molecule_id: row.source_molecule_id,
        row_index: row.row_index,
        atom_id: atomIds[index] ?? "",
      });
    });
  }
  return {
    count: locations.length,
    symbols: [...counts.entries()].map(([symbol, count]) => ({ symbol, count })),
    locations,
  };
}

function classifyOutcome(summaryRows, alignedRegions, outOfVocabulary) {
  const primaryAtoms = primaryRow(summaryRows, "ATOMS");
  const primaryEva = primaryRow(summaryRows, "EVA");
  const primaryDiffRow = primaryDiff(summaryRows);
  if (outOfVocabulary.count > 0) {
    return {
      classification: "INCONCLUSIVE",
      reason: `Target folio contains ${outOfVocabulary.count} ATOMS symbols outside the frozen 16-symbol vocabulary: ${outOfVocabulary.symbols.map((row) => `${row.symbol} x${row.count}`).join(", ")}.`,
    };
  }
  const enough = alignedRegions.filter((row) => row.folio === targetFolio).length >= 10
    && Number(primaryAtoms.evaluated_opportunities) > 0
    && Number(primaryEva.evaluated_opportunities) > 0;
  const higherConfidence = ["medium", "medium_low_medium", "one_to_one"].some((subset) => {
    const atoms = summaryRows.find((row) => row.subset === subset && row.model === "MODEL_1" && row.representation === "ATOMS" && row.scope === "combined");
    const eva = summaryRows.find((row) => row.subset === subset && row.model === "MODEL_1" && row.representation === "EVA" && row.scope === "combined");
    return atoms && eva && Number(atoms.evaluated_opportunities) > 0 && Number(eva.evaluated_opportunities) > 0
      && Number(atoms.normalized_log_loss) < Number(eva.normalized_log_loss);
  });
  if (!enough) return { classification: "INCONCLUSIVE", reason: "Insufficient aligned opportunities." };
  if (primaryAtoms.normalized_log_loss < primaryEva.normalized_log_loss && higherConfidence) {
    return { classification: "SUPPORTIVE", reason: "ATOMS has lower MODEL_1 normalized log-loss in all regions and at least one higher-confidence subset." };
  }
  if (primaryAtoms.normalized_log_loss < primaryEva.normalized_log_loss) {
    return { classification: "MIXED", reason: "MODEL_1 favors ATOMS in all regions, but higher-confidence subset support is not established." };
  }
  if (primaryEva.normalized_log_loss < primaryAtoms.normalized_log_loss) {
    return { classification: "NEGATIVE", reason: "EVA has lower MODEL_1 normalized log-loss with adequate coverage." };
  }
  return { classification: "MIXED", reason: `MODEL_1 tie or materially mixed result; delta=${primaryDiffRow.atoms_minus_eva_normalized_log_loss}.` };
}

function writeCompletionOutputs({ lineAuditRows, alignedRegions, unresolvedRegions, results, classification }) {
  const fields = [
    "subset", "model", "model_label", "representation", "scope", "train_regions", "test_regions",
    "vocabulary_size", "evaluated_opportunities", "unseen_context_count", "unseen_context_rate",
    "raw_log_loss_bits", "normalized_log_loss", "top1_accuracy", "mean_observed_probability",
    "total_heldout_code_length_bits", "bits_per_sequence", "bits_per_predicted_symbol",
    "atoms_minus_eva_normalized_log_loss", "atoms_minus_eva_top1_accuracy",
    "atoms_minus_eva_unseen_context_rate", "atoms_minus_eva_mean_observed_probability",
  ];
  writeTsv(path.join(outDir, "line-alignment-audit.tsv"), lineAuditRows, [
    "image_name", "ordinal", "status", "eva_page", "eva_paragraph", "eva_line", "eva_token_count",
    "physical_row", "physical_unit_count", "physical_y_min", "physical_y_max", "physical_first_unit",
    "physical_last_unit", "note",
  ]);
  writeTsv(path.join(outDir, "aligned-regions.tsv"), alignedRegions, [
    "folio", "line", "region_id", "eva_token_sequence", "eva_token_count", "eva_symbol_count",
    "atoms_unit_sequence", "atoms_unit_count", "atoms_symbol_count", "relation_type",
    "alignment_confidence", "coordinate_evidence", "ambiguity_note",
  ]);
  writeTsv(path.join(outDir, "unresolved-regions.tsv"), unresolvedRegions, [
    "folio", "line", "region_id", "side", "item_sequence", "item_count", "reason", "note",
  ]);
  writeTsv(path.join(outDir, "model-results.tsv"), results.summaryRows, fields);
  writeTsv(path.join(outDir, "subset-results.tsv"), results.folioRows, fields);
  writeTsv(path.join(outDir, "region-scores.tsv"), results.regionScoreRows, [
    "subset", "model", "representation", "folio", "line", "region_id", "relation_type",
    "alignment_confidence", "sequence_length", "evaluated_opportunities", "unseen_context_count",
    "log_loss_bits", "normalized_log_loss", "top1_accuracy", "mean_observed_probability", "sequence",
  ]);
  writeTsv(path.join(outDir, "corruption-results.tsv"), results.corruptionRows, [
    "subset", "representation", "folio", "line", "region_id", "relation_type", "alignment_confidence",
    "sequence_length", "predicted_opportunities", "corruptions", "real_code_length_bits",
    "median_corrupted_code_length_bits", "mean_corrupted_code_length_bits", "real_minus_median_corrupted_bits",
    "real_minus_mean_corrupted_bits", "real_better_than_median", "real_better_than_all_corruptions",
    "corrupted_better_count",
  ]);

  const manifest = {
    id: protocol.id,
    status: "completed",
    target: {
      folio: targetFolio,
      imageId: target.datasetCreatorImageId,
      imageName: target.datasetCreatorImageName,
    },
    frozenTrainingFolios: protocol.frozenTrainingFolios,
    previouslyEvaluatedFolios: protocol.previouslyEvaluatedFolios,
    dbSha256: dbMetadata.dbSha256,
    targetAtoms: targetImage.atoms,
    targetMolecules: targetImage.molecules,
    targetOutOfVocabulary,
    alignedTargetRegions: alignedRegions.filter((row) => row.folio === targetFolio).length,
    unresolvedTargetRegions: unresolvedRegions.filter((row) => row.folio === targetFolio).length,
    classification,
  };
  fs.writeFileSync(path.join(outDir, "folio-freeze-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(outDir, "PROSPECTIVE-ATOMS-EVA-TEST-V1.md"), renderCompletionReport({ alignedRegions, unresolvedRegions, results, classification, manifest }), "utf8");
  writeChecksums();
}

function renderCompletionReport({ alignedRegions, unresolvedRegions, results, classification, manifest }) {
  const targetAligned = alignedRegions.filter((row) => row.folio === targetFolio);
  const targetUnresolved = unresolvedRegions.filter((row) => row.folio === targetFolio);
  const primaryAtoms = primaryRow(results.summaryRows, "ATOMS");
  const primaryEva = primaryRow(results.summaryRows, "EVA");
  const diff = primaryDiff(results.summaryRows);
  const lines = [
    "# PROSPECTIVE-ATOMS-EVA-TEST-V1",
    "",
    `Status: \`completed\`.`,
    `Outcome classification: \`${classification.classification}\`.`,
    "",
    "## Preregistered Target",
    "",
    `- Folio: \`${targetFolio}\``,
    `- DatasetCreator image: \`${target.datasetCreatorImageName}\``,
    `- Image ID: \`${target.datasetCreatorImageId}\``,
    `- ATOMS units/molecules in completed DB export: \`${manifest.targetMolecules}\``,
    "",
    "## Guardrail Verification",
    "",
    `- Preregistration checksum verification: \`passed\``,
    `- Published V3 regression verification: \`passed\``,
    `- Training folios unchanged: \`${protocol.frozenTrainingFolios.join(", ")}\``,
    `- Previously evaluated folios not used for training update: \`${previousFolios.join(", ")}\``,
    `- Target role: \`test-only\``,
    "",
    "## Alignment Coverage",
    "",
    `- Target aligned regions: \`${targetAligned.length}\``,
    `- Target unresolved regions: \`${targetUnresolved.length}\``,
    `- Target line pairs: \`${linePairCount(targetFolio)}\``,
    "",
    "## Primary Outcome",
    "",
    "Primary preregistered metric: combined normalized held-out log-loss under `MODEL_1`, all aligned regions.",
    "",
    "| Representation | Norm log-loss | Top-1 | Unseen context | Opportunities |",
    "| --- | ---: | ---: | ---: | ---: |",
    `| ATOMS | ${fmt(primaryAtoms.normalized_log_loss)} | ${pct(primaryAtoms.top1_accuracy)} | ${pct(primaryAtoms.unseen_context_rate)} | ${primaryAtoms.evaluated_opportunities} |`,
    `| EVA | ${fmt(primaryEva.normalized_log_loss)} | ${pct(primaryEva.top1_accuracy)} | ${pct(primaryEva.unseen_context_rate)} | ${primaryEva.evaluated_opportunities} |`,
    `| ATOMS - EVA | ${fmt(diff.atoms_minus_eva_normalized_log_loss)} | ${pct(diff.atoms_minus_eva_top1_accuracy)} | ${pct(diff.atoms_minus_eva_unseen_context_rate)} |  |`,
    "",
    `Interpretation: ${classification.reason}`,
    "",
    "## Frozen Vocabulary Integrity",
    "",
    `- Out-of-vocabulary ATOMS in target folio: \`${manifest.targetOutOfVocabulary.count}\``,
    ...(manifest.targetOutOfVocabulary.symbols.length
      ? manifest.targetOutOfVocabulary.symbols.map((row) => `- \`${row.symbol}\`: ${row.count}`)
      : ["- None."]),
    "",
    "Negative normalized-log-loss delta favors ATOMS. Positive top-1 delta favors ATOMS. Negative unseen-context delta favors ATOMS.",
    "",
    "## Model And Subset Results",
    "",
    "| Subset | Model | ATOMS norm | EVA norm | Delta norm | ATOMS top-1 | EVA top-1 | Delta top-1 |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const subset of subsets) {
    for (const model of modelVariants) {
      const atoms = results.summaryRows.find((row) => row.subset === subset.name && row.model === model.id && row.representation === "ATOMS" && row.scope === "combined");
      const eva = results.summaryRows.find((row) => row.subset === subset.name && row.model === model.id && row.representation === "EVA" && row.scope === "combined");
      if (!atoms || !eva) continue;
      lines.push(`| \`${subset.name}\` | \`${model.id}\` | ${fmt(atoms.normalized_log_loss)} | ${fmt(eva.normalized_log_loss)} | ${fmt(atoms.normalized_log_loss - eva.normalized_log_loss)} | ${pct(atoms.top1_accuracy)} | ${pct(eva.top1_accuracy)} | ${pct(atoms.top1_accuracy - eva.top1_accuracy)} |`);
    }
  }

  lines.push("");
  lines.push("## Corruption Test Summary");
  lines.push("");
  lines.push("Corruption tests are reported for `MODEL_1`, preserving sequence length, first/last symbol, and internal symbol multiset.");
  lines.push("");
  lines.push("| Subset | Representation | Regions | Real better than median | Mean real-minus-median bits |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const subset of subsets) {
    for (const representation of ["ATOMS", "EVA"]) {
      const rows = results.corruptionRows.filter((row) => row.subset === subset.name && row.representation === representation);
      lines.push(`| \`${subset.name}\` | ${representation} | ${rows.length} | ${pct(fraction(rows, (row) => row.real_better_than_median === "yes"))} | ${fmt(mean(rows.map((row) => Number(row.real_minus_median_corrupted_bits))))} |`);
    }
  }
  lines.push("");
  lines.push("## Output Tables");
  lines.push("");
  lines.push("- `folio-freeze-manifest.json`");
  lines.push("- `line-alignment-audit.tsv`");
  lines.push("- `aligned-regions.tsv`");
  lines.push("- `unresolved-regions.tsv`");
  lines.push("- `model-results.tsv`");
  lines.push("- `subset-results.tsv`");
  lines.push("- `region-scores.tsv`");
  lines.push("- `corruption-results.tsv`");
  lines.push("- `checksums.txt`");
  return lines.join("\n") + "\n";
}

function writeChecksums() {
  const files = [
    "PROSPECTIVE-ATOMS-EVA-TEST-V1.md",
    "folio-freeze-manifest.json",
    "line-alignment-audit.tsv",
    "aligned-regions.tsv",
    "unresolved-regions.tsv",
    "model-results.tsv",
    "subset-results.tsv",
    "region-scores.tsv",
    "corruption-results.tsv",
  ];
  const rows = files.map((file) => `${sha256(path.join(outDir, file))}  ${file}`);
  fs.writeFileSync(path.join(outDir, "checksums.txt"), rows.join("\n") + "\n", "utf8");
}

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
  if (!fs.existsSync(dbPath)) return { dbSha256: "", images: [] };
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

function toRegionRow(region, atomRowsByUnitId) {
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

function physicalRowSummary(imageName, rowIndex, rows) {
  const sorted = [...rows].sort((a, b) => Number(a.unit_index) - Number(b.unit_index));
  const yMin = Math.min(...sorted.map((row) => Number(row.bounds_y)).filter(Number.isFinite));
  const yMax = Math.max(...sorted.map((row) => Number(row.bounds_y) + Number(row.bounds_h)).filter(Number.isFinite));
  return {
    image_name: imageName,
    physical_row: rowIndex,
    physical_unit_count: sorted.length,
    physical_y_min: Number.isFinite(yMin) ? yMin.toFixed(0) : "",
    physical_y_max: Number.isFinite(yMax) ? yMax.toFixed(0) : "",
    physical_first_unit: sorted[0]?.unit_id ?? "",
    physical_last_unit: sorted.at(-1)?.unit_id ?? "",
  };
}

function relationType(evaCount, atomCount) {
  if (evaCount === 1 && atomCount === 1) return "1:1";
  if (evaCount === 1) return "1:N";
  if (atomCount === 1) return "N:1";
  return "N:M";
}

function alignmentConfidence(line, relation) {
  if (line.status !== "paired-by-ordinal") return "low";
  if (relation === "1:1" && Number(line.eva_token_count) === Number(line.physical_unit_count)) return "medium";
  if (relation === "1:1") return "low-medium";
  return "low";
}

function ambiguityNote(line, relation) {
  const notes = ["EVA token spans are ordinal estimates; ATOMS spans use bounding boxes."];
  if (Number(line.eva_token_count) !== Number(line.physical_unit_count)) {
    notes.push(`line-count-drift eva=${line.eva_token_count} atoms=${line.physical_unit_count}`);
  }
  if (relation !== "1:1") notes.push("grouped relation; inspect visually before token-level use");
  return notes.join("; ");
}

function connectedComponents(evaCount, atomCount, edges) {
  const nodes = new Map();
  for (let index = 0; index < evaCount; index += 1) nodes.set(`e${index}`, []);
  for (let index = 0; index < atomCount; index += 1) nodes.set(`a${index}`, []);
  for (const [eva, atom] of edges) {
    nodes.get(`e${eva}`).push(`a${atom}`);
    nodes.get(`a${atom}`).push(`e${eva}`);
  }
  const seen = new Set();
  const components = [];
  for (const node of nodes.keys()) {
    if (seen.has(node) || nodes.get(node).length === 0) continue;
    const stack = [node];
    const component = { eva: new Set(), atoms: new Set() };
    seen.add(node);
    while (stack.length) {
      const current = stack.pop();
      if (current.startsWith("e")) component.eva.add(Number(current.slice(1)));
      if (current.startsWith("a")) component.atoms.add(Number(current.slice(1)));
      for (const next of nodes.get(current)) {
        if (seen.has(next)) continue;
        seen.add(next);
        stack.push(next);
      }
    }
    components.push(component);
  }
  return components.sort((a, b) => Math.min(...a.eva) - Math.min(...b.eva));
}

function intervalOverlap(a, b) {
  return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
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

function corruptInternal(symbols) {
  if (symbols.length <= 3) return [...symbols];
  const internal = symbols.slice(1, -1);
  for (let index = internal.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [internal[index], internal[swap]] = [internal[swap], internal[index]];
  }
  return [symbols[0], ...internal, symbols.at(-1)];
}

function primaryRow(rows, representation) {
  return rows.find((row) => row.subset === "all" && row.model === "MODEL_1" && row.representation === representation && row.scope === "combined");
}

function primaryDiff(rows) {
  return rows.find((row) => row.subset === "all" && row.model === "MODEL_1" && row.representation === "ATOMS_MINUS_EVA" && row.scope === "combined");
}

function linePairCount(folio) {
  const rows = readTsv(path.join(outDir, "line-alignment-audit.tsv"));
  return rows.filter((row) => row.eva_page === folio && row.status === "paired-by-ordinal").length;
}

function folioToImageName(folio) {
  const map = {
    f1r: "page-003.jpg",
    f1v: "page-004.jpg",
    f2r: "page-005.jpg",
    f2v: "page-006.jpg",
    f3r: "page-007.jpg",
    f47v: "page-094.jpg",
  };
  return map[folio] ?? folio;
}

function readCaseTsv(folio, fileName) {
  const filePath = path.join(casesRoot, `${folio}-full`, fileName);
  return fs.existsSync(filePath) ? readTsv(filePath) : [];
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
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
    ...rows.map((row) => fields.map((field) => formatCell(row[field])).join("\t").trimEnd()),
  ].join("\n") + "\n", "utf8");
}

function formatCell(value) {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "Infinity";
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function tokens(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function mean(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : 0;
}

function median(sortedValues) {
  if (!sortedValues.length) return 0;
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 ? sortedValues[middle] : (sortedValues[middle - 1] + sortedValues[middle]) / 2;
}

function fraction(rows, predicate) {
  return rows.length ? rows.filter(predicate).length / rows.length : 0;
}

function groupBy(rows, keyFn) {
  const grouped = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return grouped;
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

function fmt(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(6) : "Infinity";
}

function pct(value) {
  return `${(Number(value) * 100).toFixed(2)}%`;
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
