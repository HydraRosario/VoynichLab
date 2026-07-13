import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const evaMode = readOption("--eva-token-mode", "glyph");

if (!inputPath) {
  console.error("Usage: npm run compare -- <parallel.tsv> [--eva-token-mode glyph|char|space]");
  process.exit(1);
}

const absoluteInputPath = path.resolve(process.cwd(), inputPath);
const rows = readParallelTsv(absoluteInputPath);

if (rows.length === 0) {
  console.error(`No data rows found in ${absoluteInputPath}`);
  process.exit(1);
}

const atomSequences = rows.map((row) => ({
  unitId: row.unit_id,
  symbols: tokenizeAtoms(row.atoms),
}));

const evaSequences = rows.map((row) => ({
  unitId: row.unit_id,
  symbols: tokenizeEva(row.eva, evaMode),
}));

const atomReport = buildReport("atoms", atomSequences);
const evaReport = buildReport("eva", evaSequences);

printReport(atomReport);
console.log("");
printReport(evaReport);
console.log("");
printComparison(atomReport, evaReport);

function readOption(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function readParallelTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (lines.length === 0) return [];

  const header = lines[0].split("\t");
  const required = ["unit_id", "atoms", "eva"];
  for (const field of required) {
    if (!header.includes(field)) {
      throw new Error(`Missing required TSV column: ${field}`);
    }
  }

  return lines.slice(1).map((line, index) => {
    const cells = line.split("\t");
    const row = Object.fromEntries(header.map((field, cellIndex) => [field, cells[cellIndex] ?? ""]));
    for (const field of required) {
      if (!row[field]) {
        throw new Error(`Missing ${field} on data row ${index + 2}`);
      }
    }
    return row;
  });
}

function tokenizeAtoms(value) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function tokenizeEva(value, mode) {
  const trimmed = value.trim();

  if (mode === "space" || /\s/.test(trimmed)) {
    return trimmed.split(/\s+/).filter(Boolean);
  }

  if (mode === "char") {
    return Array.from(trimmed);
  }

  if (mode !== "glyph") {
    throw new Error(`Unknown EVA token mode: ${mode}`);
  }

  return tokenizeEvaGlyphs(trimmed);
}

function tokenizeEvaGlyphs(value) {
  const glyphs = [
    "ckh",
    "cth",
    "cfh",
    "cph",
    "ch",
    "sh",
    "ee",
    "qo",
  ];

  const symbols = [];
  let index = 0;

  while (index < value.length) {
    const match = glyphs.find((glyph) => value.startsWith(glyph, index));
    if (match) {
      symbols.push(match);
      index += match.length;
      continue;
    }

    symbols.push(value[index]);
    index += 1;
  }

  return symbols;
}

function buildReport(system, sequences) {
  const maxLength = Math.max(...sequences.map((sequence) => sequence.symbols.length));
  const vocabulary = new Set(sequences.flatMap((sequence) => sequence.symbols));
  const positionStats = [];

  for (let position = 0; position < maxLength; position += 1) {
    const symbolsAtPosition = sequences
      .map((sequence) => sequence.symbols[position])
      .filter((symbol) => symbol !== undefined);

    positionStats.push({
      position: position + 1,
      count: symbolsAtPosition.length,
      entropy: entropy(counts(symbolsAtPosition)),
      counts: counts(symbolsAtPosition),
    });
  }

  const symbolStats = [...vocabulary]
    .map((symbol) => {
      const positions = [];
      for (const sequence of sequences) {
        sequence.symbols.forEach((candidate, index) => {
          if (candidate === symbol) positions.push(index + 1);
        });
      }

      return {
        symbol,
        count: positions.length,
        positionalEntropy: entropy(counts(positions)),
        positions: counts(positions),
      };
    })
    .sort((a, b) => b.positionalEntropy - a.positionalEntropy || b.count - a.count);

  return {
    system,
    unitCount: sequences.length,
    symbolCount: sequences.reduce((total, sequence) => total + sequence.symbols.length, 0),
    vocabulary: [...vocabulary].sort(),
    maxLength,
    averagePositionEntropy: average(positionStats.map((stat) => stat.entropy)),
    weightedSymbolPositionEntropy: weightedAverage(
      symbolStats.map((stat) => [stat.positionalEntropy, stat.count])
    ),
    positionStats,
    symbolStats,
  };
}

function counts(values) {
  const result = new Map();
  for (const value of values) {
    result.set(value, (result.get(value) ?? 0) + 1);
  }
  return result;
}

function entropy(countMap) {
  const total = [...countMap.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;

  return [...countMap.values()].reduce((sum, count) => {
    const probability = count / total;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedAverage(pairs) {
  const totalWeight = pairs.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight === 0) return 0;
  return pairs.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
}

function formatNumber(value) {
  return value.toFixed(4);
}

function formatCounts(countMap) {
  return [...countMap.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .map(([symbol, count]) => `${symbol}:${count}`)
    .join(" ");
}

function printReport(report) {
  console.log(`== ${report.system} ==`);
  console.log(`units: ${report.unitCount}`);
  console.log(`symbols: ${report.symbolCount}`);
  console.log(`vocabulary: ${report.vocabulary.length}`);
  console.log(`max_length: ${report.maxLength}`);
  console.log(`avg_position_entropy_bits: ${formatNumber(report.averagePositionEntropy)}`);
  console.log(`weighted_symbol_position_entropy_bits: ${formatNumber(report.weightedSymbolPositionEntropy)}`);
  console.log("most_mixed_positions:");

  for (const stat of [...report.positionStats].sort((a, b) => b.entropy - a.entropy).slice(0, 8)) {
    console.log(
      `  pos ${stat.position}: H=${formatNumber(stat.entropy)} n=${stat.count} ${formatCounts(stat.counts)}`
    );
  }

  console.log("most_positionally_mobile_symbols:");
  for (const stat of report.symbolStats.slice(0, 8)) {
    console.log(
      `  ${stat.symbol}: H=${formatNumber(stat.positionalEntropy)} n=${stat.count} positions=${formatCounts(stat.positions)}`
    );
  }
}

function printComparison(atomReport, evaReport) {
  const positionDelta = evaReport.averagePositionEntropy - atomReport.averagePositionEntropy;
  const symbolDelta = evaReport.weightedSymbolPositionEntropy - atomReport.weightedSymbolPositionEntropy;

  console.log("== comparison ==");
  console.log(`eva_minus_atoms_avg_position_entropy_bits: ${formatNumber(positionDelta)}`);
  console.log(`eva_minus_atoms_weighted_symbol_position_entropy_bits: ${formatNumber(symbolDelta)}`);

  if (positionDelta > 0 && symbolDelta > 0) {
    console.log("reading: atoms are more positionally rigid on both metrics.");
  } else if (positionDelta < 0 && symbolDelta < 0) {
    console.log("reading: EVA is more positionally rigid on both metrics.");
  } else {
    console.log("reading: mixed result; inspect tokenization and per-position tables.");
  }
}
