import fs from "node:fs";
import path from "node:path";
import {
  countBy,
  entropy,
  parseArgs,
  sequencesFromAtomsTsv,
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
const mode = String(args.mode ?? "full");
const minCount = Number(args.min_count ?? 4);
const rows = sequencesFromAtomsTsv(atomsPath, mode);
const pairRows = adjacentPairRows(rows);
const nextFindings = conditionalDistribution(pairRows, "token", "next_token", minCount);
const prevFindings = conditionalDistribution(pairRows, "token", "prev_token", minCount);
const roleContextRows = roleContextDistribution(rows, minCount);
const markdown = buildMarkdown({ atomsPath, mode, rows, pairRows, nextFindings, prevFindings, roleContextRows });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote conditional entropy report to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  writeTsv(path.resolve(process.cwd(), args.tsv), [
    ...nextFindings.map((row) => ({ direction: "next", ...row })),
    ...prevFindings.map((row) => ({ direction: "prev", ...row })),
  ], [
    "direction",
    "condition",
    "total",
    "entropy_bits",
    "relative_entropy",
    "dominant",
    "dominant_count",
    "dominant_share",
    "alternatives",
  ]);
  console.log(`Wrote conditional entropy TSV to ${path.resolve(process.cwd(), args.tsv)}`);
}

function adjacentPairRows(rows) {
  const pairs = [];
  for (const row of rows) {
    for (let index = 0; index < row.tokens.length; index += 1) {
      pairs.push({
        image_name: row.image_name,
        row_index: row.row_index,
        unit_id: row.unit_id,
        token: row.tokens[index],
        prev_token: row.tokens[index - 1] ?? "",
        next_token: row.tokens[index + 1] ?? "",
      });
    }
  }
  return pairs;
}

function conditionalDistribution(rows, conditionField, resultField, minCount) {
  const usable = rows.filter((row) => row[conditionField] && row[resultField]);
  const groups = new Map();
  for (const row of usable) {
    const key = row[conditionField];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const findings = [];
  for (const [condition, groupRows] of groups.entries()) {
    if (groupRows.length < minCount) continue;
    const counts = countBy(groupRows, (row) => row[resultField]);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1] || tokenSort(a[0], b[0]));
    const [dominant, dominantCount] = sorted[0];
    const entropyBits = entropy(Object.values(counts));
    findings.push({
      condition,
      total: groupRows.length,
      entropy_bits: entropyBits.toFixed(4),
      relative_entropy: (entropyBits / Math.log2(Object.keys(counts).length || 1 || 2)).toFixed(4),
      dominant,
      dominant_count: dominantCount,
      dominant_share: (dominantCount / groupRows.length).toFixed(4),
      alternatives: sorted.map(([token, count]) => `${token}:${count}`).join(" "),
    });
  }
  return findings.sort((a, b) =>
    Number(a.entropy_bits) - Number(b.entropy_bits)
    || Number(b.total) - Number(a.total)
    || tokenSort(a.condition, b.condition)
  );
}

function roleContextDistribution(rows, minCount) {
  const contexts = [];
  for (const row of rows) {
    for (let index = 0; index < row.tokens.length; index += 1) {
      const token = row.tokens[index];
      const role = index === 0
        ? row.tokens.length === 1 ? "singleton" : "initial"
        : index === row.tokens.length - 1 ? "final" : "medial";
      contexts.push({ token, role, prev: row.tokens[index - 1] ?? "", next: row.tokens[index + 1] ?? "" });
    }
  }
  const byToken = new Map();
  for (const row of contexts) {
    if (!byToken.has(row.token)) byToken.set(row.token, []);
    byToken.get(row.token).push(row);
  }
  return [...byToken.entries()]
    .filter(([, groupRows]) => groupRows.length >= minCount)
    .map(([token, groupRows]) => {
      const roleCounts = countBy(groupRows, (row) => row.role);
      const entropyBits = entropy(Object.values(roleCounts));
      const sorted = Object.entries(roleCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      return {
        token,
        total: groupRows.length,
        entropy_bits: entropyBits.toFixed(4),
        dominant_role: sorted[0][0],
        dominant_share: (sorted[0][1] / groupRows.length).toFixed(4),
        roles: sorted.map(([role, count]) => `${role}:${count}`).join(" "),
      };
    })
    .sort((a, b) => Number(a.entropy_bits) - Number(b.entropy_bits) || Number(b.total) - Number(a.total));
}

function buildMarkdown({ atomsPath, mode, rows, pairRows, nextFindings, prevFindings, roleContextRows }) {
  const weightedNext = weightedAverage(nextFindings.map((row) => [Number(row.entropy_bits), Number(row.total)]));
  const weightedPrev = weightedAverage(prevFindings.map((row) => [Number(row.entropy_bits), Number(row.total)]));
  const lines = [
    "# Conditional Entropy",
    "",
    "## Scope",
    "",
    `- Input: \`${path.relative(process.cwd(), atomsPath)}\``,
    `- Token mode: \`${mode}\``,
    `- Molecules: \`${rows.length}\``,
    `- Atom occurrences with adjacency rows: \`${pairRows.length}\``,
    "",
    "## Summary",
    "",
    `- Weighted next-token entropy: \`${weightedNext.toFixed(4)}\` bits.`,
    `- Weighted previous-token entropy: \`${weightedPrev.toFixed(4)}\` bits.`,
    "",
  ];
  appendFindingTable(lines, "Lowest Next-Token Entropy", nextFindings.slice(0, 18));
  appendFindingTable(lines, "Lowest Previous-Token Entropy", prevFindings.slice(0, 18));
  lines.push("## Role Entropy By Token");
  lines.push("");
  lines.push("| Token | Total | H(role) | Dominant role | Dominant share | Roles |");
  lines.push("| --- | ---: | ---: | --- | ---: | --- |");
  for (const row of roleContextRows.slice(0, 20)) {
    lines.push(`| \`${row.token}\` | ${row.total} | ${row.entropy_bits} | ${row.dominant_role} | ${row.dominant_share} | ${row.roles} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function appendFindingTable(lines, title, rows) {
  lines.push(`## ${title}`);
  lines.push("");
  lines.push("| Condition token | Total | H | Dominant | Share | Alternatives |");
  lines.push("| --- | ---: | ---: | --- | ---: | --- |");
  for (const row of rows) {
    lines.push(`| \`${row.condition}\` | ${row.total} | ${row.entropy_bits} | \`${row.dominant}\` | ${row.dominant_share} | ${row.alternatives} |`);
  }
  lines.push("");
}

function printHelp() {
  console.log(`Usage:
  node scripts/conditional-entropy.js --atoms cases/combined/atoms-current.tsv --out cases/combined/conditional-entropy.md

Options:
  --mode <full|family>  Token mode. Default: full.
  --min-count <n>      Minimum observations per condition. Default: 4.
  --out <path>         Write markdown report.
  --tsv <path>         Write conditional table.`);
}

