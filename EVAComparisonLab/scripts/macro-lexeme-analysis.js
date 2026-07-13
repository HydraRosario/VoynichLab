import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const atomsPath = path.resolve(process.cwd(), args.atoms ?? "cases/combined-f1r-f47v-full-current/atoms-current.tsv");
const outPath = path.resolve(process.cwd(), args.out ?? "cases/combined-f1r-f47v-full-current/macro-lexeme-analysis.md");
const tsvPath = args.tsv
  ? path.resolve(process.cwd(), args.tsv)
  : path.resolve(path.dirname(outPath), "macro-lexeme-analysis.tsv");

const macroMap = new Map([
  ["g:1", "MEDIAL_OP"],
  ["i:1", "MEDIAL_OP"],
  ["b:1", "MEDIAL_OP"],
  ["k:1", "MEDIAL_OP"],
  ["m:1", "MEDIAL_OP"],
]);

const rows = readTsv(atomsPath);
const originalVocabulary = vocabulary(rows.flatMap((row) => tokens(row.atoms)));
const macroRows = rows.map((row) => {
  const originalTokens = tokens(row.atoms);
  const macroTokens = originalTokens.map((token) => macroMap.get(token) ?? token);
  return {
    ...row,
    original_tokens: originalTokens,
    macro_tokens: macroTokens,
    macro_signature: macroTokens.join(" "),
  };
});

const macroVocabulary = vocabulary(macroRows.flatMap((row) => row.macro_tokens));
const lexemeCounts = countBy(macroRows, (row) => row.macro_signature);
const originalLexemeCounts = countBy(rows, (row) => row.atoms);
const macroRoleReport = roleEntropy(macroRows.flatMap((row) => row.macro_tokens.map((token, index) => ({
  token,
  role: roleFor(index, row.macro_tokens.length),
}))));

const lexemeRows = [...lexemeCounts.entries()]
  .map(([signature, count]) => ({
    signature,
    count,
    share: count / macroRows.length,
    examples: macroRows
      .filter((row) => row.macro_signature === signature)
      .slice(0, 5)
      .map((row) => row.unit_id)
      .join(", "),
  }))
  .sort((a, b) => b.count - a.count || a.signature.localeCompare(b.signature));

const tsvRows = lexemeRows.map((row) => ({
  macro_signature: row.signature,
  count: row.count,
  share: row.share.toFixed(4),
  examples: row.examples,
}));

writeTsv(tsvPath, tsvRows, ["macro_signature", "count", "share", "examples"]);

const lines = [];
lines.push("# Macro Lexeme Analysis");
lines.push("");
lines.push("## Hypothesis");
lines.push("");
lines.push("Merge strict medial zero-entropy atoms `g:1`, `i:1`, `b:1`, `k:1`, `m:1` into one conceptual macro-unit: `MEDIAL_OP`.");
lines.push("");
lines.push("## Scope");
lines.push("");
lines.push(`- Input: \`${path.relative(process.cwd(), atomsPath)}\``);
lines.push(`- Molecules / physical units: \`${rows.length}\``);
lines.push(`- Original atom vocabulary: \`${originalVocabulary.length}\``);
lines.push(`- Macro vocabulary after merge: \`${macroVocabulary.length}\``);
lines.push(`- Original unique molecule signatures: \`${originalLexemeCounts.size}\``);
lines.push(`- Macro unique lexeme signatures: \`${lexemeCounts.size}\``);
lines.push("");
lines.push("## Macro Vocabulary");
lines.push("");
lines.push("| Macro Symbol | Source |");
lines.push("| --- | --- |");
for (const symbol of macroVocabulary) {
  const sources = [...macroMap.entries()]
    .filter(([, macro]) => macro === symbol)
    .map(([source]) => source);
  lines.push(`| \`${symbol}\` | ${sources.length ? sources.map((source) => `\`${source}\``).join(", ") : "`self`"} |`);
}
lines.push("");
lines.push("## Macro Role Entropy");
lines.push("");
lines.push("| Symbol | Count | H(role) | Dominant | Share | Roles |");
lines.push("| --- | ---: | ---: | --- | ---: | --- |");
for (const row of macroRoleReport.slice(0, 20)) {
  lines.push(`| \`${row.token}\` | ${row.total} | ${row.entropy.toFixed(4)} | ${row.dominantRole} | ${row.dominantShare.toFixed(4)} | ${formatCounts(row.roles)} |`);
}
lines.push("");
lines.push("## Top Macro Lexemes");
lines.push("");
lines.push("| Count | Share | Macro Signature | Examples |");
lines.push("| ---: | ---: | --- | --- |");
for (const row of lexemeRows.slice(0, 40)) {
  lines.push(`| ${row.count} | ${row.share.toFixed(4)} | \`${row.signature}\` | ${row.examples} |`);
}
lines.push("");
lines.push("## Interpretation");
lines.push("");
lines.push("- This is a hypothesis test, not a destructive relabeling.");
lines.push("- If `MEDIAL_OP` keeps low role entropy while reducing vocabulary, the merged atoms may be positional/material variants of one operator.");
lines.push("- If macro lexemes become more repeated without destroying the known contextual signals, the merge is analytically useful.");
lines.push("");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);
console.log(`Wrote ${tsvPath}`);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function writeTsv(filePath, rows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    [
      fields.join("\t"),
      ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
    ].join("\n") + "\n",
    "utf8",
  );
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function tokens(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean);
}

function vocabulary(values) {
  return [...new Set(values)].sort(tokenSort);
}

function tokenSort(a, b) {
  const [familyA, variantA = ""] = a.split(":");
  const [familyB, variantB = ""] = b.split(":");
  return familyA.localeCompare(familyB) || Number(variantA) - Number(variantB) || variantA.localeCompare(variantB);
}

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function roleFor(index, length) {
  if (length === 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}

function roleEntropy(items) {
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.token)) grouped.set(item.token, []);
    grouped.get(item.token).push(item.role);
  }
  return [...grouped.entries()]
    .map(([token, roles]) => {
      const counts = countBy(roles, (role) => role);
      const total = roles.length;
      const sortedCounts = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      return {
        token,
        total,
        roles: counts,
        entropy: entropy([...counts.values()]),
        dominantRole: sortedCounts[0]?.[0] ?? "",
        dominantShare: (sortedCounts[0]?.[1] ?? 0) / total,
      };
    })
    .sort((a, b) => a.entropy - b.entropy || b.total - a.total || tokenSort(a.token, b.token));
}

function entropy(counts) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (!total) return 0;
  return counts.reduce((sum, count) => {
    if (!count) return sum;
    const p = count / total;
    return sum - p * Math.log2(p);
  }, 0);
}

function formatCounts(counts) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([role, count]) => `${role}:${count}`)
    .join(" ");
}
