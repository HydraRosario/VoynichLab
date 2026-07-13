import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || (!args.eva && !args.atoms)) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const reports = [];

if (args.eva) {
  const rows = readTsv(path.resolve(process.cwd(), args.eva));
  const mode = args.eva_token_mode ?? "glyph";
  reports.push(buildReport("eva", rows.map((row) => tokenizeEva(row.eva, mode))));
}

if (args.atoms) {
  const rows = readTsv(path.resolve(process.cwd(), args.atoms));
  reports.push(buildReport("atoms", rows.map((row) => tokenizeAtoms(row.atoms))));
}

const text = reports.map(formatReport).join("\n\n") + "\n";

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, text, "utf8");
  console.log(`Wrote role entropy report to ${outPath}`);
} else {
  process.stdout.write(text);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2).replaceAll("-", "_");
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = value;
      index += 1;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  npm run role-entropy -- --eva cases/combined-f1r-f47v-full-current/eva-tokens.tsv --atoms cases/combined-f1r-f47v-full-current/atoms-current.tsv

Options:
  --eva <path>              TSV with an eva column.
  --atoms <path>            TSV with an atoms column.
  --eva-token-mode <mode>   glyph, char, or space. Default: glyph.
  --out <path>              Write report to file instead of stdout.`);
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));

  if (lines.length === 0) return [];

  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function tokenizeAtoms(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function tokenizeEva(value, mode) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return [];

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
    } else {
      symbols.push(value[index]);
      index += 1;
    }
  }
  return symbols;
}

function buildReport(system, sequences) {
  const symbolRoles = new Map();
  let sequenceCount = 0;
  let symbolCount = 0;

  for (const sequence of sequences) {
    if (sequence.length === 0) continue;
    sequenceCount += 1;
    symbolCount += sequence.length;

    sequence.forEach((symbol, index) => {
      const role = roleFor(index, sequence.length);
      if (!symbolRoles.has(symbol)) {
        symbolRoles.set(symbol, { initial: 0, medial: 0, final: 0, singleton: 0, total: 0 });
      }
      const stats = symbolRoles.get(symbol);
      stats[role] += 1;
      stats.total += 1;
    });
  }

  const symbols = [...symbolRoles.entries()]
    .map(([symbol, stats]) => {
      const roleCounts = {
        initial: stats.initial + stats.singleton,
        medial: stats.medial,
        final: stats.final + stats.singleton,
      };
      const entropyBits = entropy(Object.values(roleCounts));
      return {
        symbol,
        total: stats.total,
        roleCounts,
        entropyBits,
        normalizedEntropy: entropyBits / Math.log2(3),
        dominantRole: dominantRole(roleCounts),
        dominantShare: Math.max(...Object.values(roleCounts)) / roleCountTotal(roleCounts),
      };
    })
    .sort((a, b) => b.entropyBits - a.entropyBits || b.total - a.total || a.symbol.localeCompare(b.symbol));

  return {
    system,
    sequenceCount,
    symbolCount,
    vocabulary: symbols.length,
    weightedEntropyBits: weightedAverage(symbols.map((symbol) => [symbol.entropyBits, symbol.total])),
    weightedNormalizedEntropy: weightedAverage(symbols.map((symbol) => [symbol.normalizedEntropy, symbol.total])),
    zeroEntropySymbols: symbols.filter((symbol) => symbol.entropyBits === 0).length,
    rigidSymbols: symbols.filter((symbol) => symbol.dominantShare >= 0.95).length,
    symbols,
  };
}

function roleFor(index, length) {
  if (length === 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}

function entropy(counts) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;

  return counts.reduce((sum, count) => {
    if (count === 0) return sum;
    const probability = count / total;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function weightedAverage(pairs) {
  const totalWeight = pairs.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight === 0) return 0;
  return pairs.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
}

function dominantRole(roleCounts) {
  return Object.entries(roleCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

function roleCountTotal(roleCounts) {
  return Object.values(roleCounts).reduce((sum, count) => sum + count, 0);
}

function formatReport(report) {
  return [
    `== ${report.system} role entropy ==`,
    `units: ${report.sequenceCount}`,
    `symbols: ${report.symbolCount}`,
    `vocabulary: ${report.vocabulary}`,
    `weighted_entropy_bits: ${formatNumber(report.weightedEntropyBits)}`,
    `weighted_relative_entropy_0_to_1: ${formatNumber(report.weightedNormalizedEntropy)}`,
    `zero_entropy_symbols: ${report.zeroEntropySymbols}`,
    `rigid_symbols_95pct: ${report.rigidSymbols}`,
    "most_positionally_chaotic:",
    ...report.symbols.slice(0, 12).map(formatSymbol),
    "most_positionally_rigid:",
    ...[...report.symbols]
      .sort((a, b) => a.entropyBits - b.entropyBits || b.total - a.total || a.symbol.localeCompare(b.symbol))
      .slice(0, 12)
      .map(formatSymbol),
  ].join("\n");
}

function formatSymbol(symbol) {
  const counts = symbol.roleCounts;
  return `  ${symbol.symbol}: H=${formatNumber(symbol.entropyBits)} rel=${formatNumber(symbol.normalizedEntropy)} n=${symbol.total} initial=${counts.initial} medial=${counts.medial} final=${counts.final} dominant=${symbol.dominantRole}:${formatNumber(symbol.dominantShare)}`;
}

function formatNumber(value) {
  return value.toFixed(4);
}
