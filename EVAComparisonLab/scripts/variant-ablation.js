import fs from "node:fs";
import path from "node:path";
import {
  countBy,
  entropy,
  parseArgs,
  sequencesFromAtomsTsv,
  tokenFamily,
  tokenSort,
  weightedAverage,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.atoms) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const atomsPath = path.resolve(process.cwd(), args.atoms);
const fullRows = sequencesFromAtomsTsv(atomsPath, "full");
const familyRows = sequencesFromAtomsTsv(atomsPath, "family");
const fullReport = roleEntropyReport(fullRows, "full variants");
const familyReport = roleEntropyReport(familyRows, "families merged");
const familyComparisons = compareVariantFamilies(fullReport, familyReport);
const markdown = buildMarkdown({ atomsPath, fullReport, familyReport, familyComparisons });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote variant ablation report to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  writeTsv(path.resolve(process.cwd(), args.tsv), familyComparisons, [
    "family",
    "variant_count",
    "token_count",
    "merged_entropy",
    "weighted_split_entropy",
    "split_minus_merged",
    "variants",
  ]);
  console.log(`Wrote variant ablation TSV to ${path.resolve(process.cwd(), args.tsv)}`);
}

function roleEntropyReport(rows, label) {
  const stats = new Map();
  let tokenCount = 0;
  for (const row of rows) {
    tokenCount += row.tokens.length;
    for (let index = 0; index < row.tokens.length; index += 1) {
      const token = row.tokens[index];
      const role = index === 0
        ? row.tokens.length === 1 ? "singleton" : "initial"
        : index === row.tokens.length - 1 ? "final" : "medial";
      if (!stats.has(token)) stats.set(token, { initial: 0, medial: 0, final: 0, singleton: 0, total: 0 });
      const tokenStats = stats.get(token);
      tokenStats[role] += 1;
      tokenStats.total += 1;
    }
  }
  const symbols = [...stats.entries()].map(([token, tokenStats]) => {
    const counts = {
      initial: tokenStats.initial + tokenStats.singleton,
      medial: tokenStats.medial,
      final: tokenStats.final + tokenStats.singleton,
    };
    const entropyBits = entropy(Object.values(counts));
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    return {
      token,
      family: tokenFamily(token),
      total: tokenStats.total,
      counts,
      entropy_bits: entropyBits,
      dominant_role: dominant[0],
      dominant_share: dominant[1] / tokenStats.total,
    };
  }).sort((a, b) => tokenSort(a.token, b.token));
  return {
    label,
    molecule_count: rows.length,
    token_count: tokenCount,
    vocabulary: symbols.length,
    weighted_entropy: weightedAverage(symbols.map((symbol) => [symbol.entropy_bits, symbol.total])),
    rigid_symbols: symbols.filter((symbol) => symbol.dominant_share >= 0.95).length,
    symbols,
  };
}

function compareVariantFamilies(fullReport, familyReport) {
  const variantsByFamily = new Map();
  for (const symbol of fullReport.symbols) {
    if (!variantsByFamily.has(symbol.family)) variantsByFamily.set(symbol.family, []);
    variantsByFamily.get(symbol.family).push(symbol);
  }
  const mergedByFamily = new Map(familyReport.symbols.map((symbol) => [symbol.token, symbol]));
  return [...variantsByFamily.entries()]
    .filter(([, variants]) => variants.length > 1)
    .map(([family, variants]) => {
      const tokenCount = variants.reduce((sum, variant) => sum + variant.total, 0);
      const weightedSplitEntropy = weightedAverage(variants.map((variant) => [variant.entropy_bits, variant.total]));
      const mergedEntropy = mergedByFamily.get(family)?.entropy_bits ?? 0;
      return {
        family,
        variant_count: variants.length,
        token_count: tokenCount,
        merged_entropy: mergedEntropy.toFixed(4),
        weighted_split_entropy: weightedSplitEntropy.toFixed(4),
        split_minus_merged: (weightedSplitEntropy - mergedEntropy).toFixed(4),
        variants: variants.map((variant) => `${variant.token}:n${variant.total}:H${variant.entropy_bits.toFixed(4)}`).join(" "),
      };
    })
    .sort((a, b) => Number(a.split_minus_merged) - Number(b.split_minus_merged) || Number(b.token_count) - Number(a.token_count));
}

function buildMarkdown({ atomsPath, fullReport, familyReport, familyComparisons }) {
  const lines = [
    "# Variant Ablation",
    "",
    "## Scope",
    "",
    `- Input: \`${path.relative(process.cwd(), atomsPath)}\``,
    `- Molecules: \`${fullReport.molecule_count}\``,
    "",
    "## Global Comparison",
    "",
    "| Mode | Tokens | Vocabulary | Weighted role entropy | Rigid >=95% |",
    "| --- | ---: | ---: | ---: | ---: |",
    `| Full variants | ${fullReport.token_count} | ${fullReport.vocabulary} | ${fullReport.weighted_entropy.toFixed(4)} | ${fullReport.rigid_symbols} |`,
    `| Families merged | ${familyReport.token_count} | ${familyReport.vocabulary} | ${familyReport.weighted_entropy.toFixed(4)} | ${familyReport.rigid_symbols} |`,
    "",
    "Interpretation: negative `split_minus_merged` means variants reduce entropy versus merging the family; positive values mean the split is not helping positional stability yet.",
    "",
    "## Variant Families",
    "",
    "| Family | Variants | Tokens | H merged | H split weighted | Split - merged | Variant details |",
    "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ];
  if (!familyComparisons.length) {
    lines.push("| _none_ | 0 | 0 | 0 | 0 | 0 | - |");
  } else {
    for (const row of familyComparisons) {
      lines.push(`| \`${row.family}\` | ${row.variant_count} | ${row.token_count} | ${row.merged_entropy} | ${row.weighted_split_entropy} | ${row.split_minus_merged} | ${row.variants} |`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function printHelp() {
  console.log(`Usage:
  node scripts/variant-ablation.js --atoms cases/combined/atoms-current.tsv --out cases/combined/variant-ablation.md

Options:
  --out <path>  Write markdown report.
  --tsv <path>  Write family comparison table.`);
}

