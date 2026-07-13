import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.atoms) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const atomsPath = path.resolve(process.cwd(), args.atoms);
const rows = readTsv(atomsPath)
  .map((row) => ({
    ...row,
    row_index_number: Number(row.row_index),
    unit_index_number: Number(row.unit_index),
    tokens: String(row.atoms ?? "").trim().split(/\s+/).filter(Boolean),
  }))
  .filter((row) => row.tokens.length > 0)
  .sort((a, b) =>
    a.image_name.localeCompare(b.image_name)
    || a.row_index_number - b.row_index_number
    || a.unit_index_number - b.unit_index_number
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
  );

const byLine = groupBy(rows, (row) => `${row.image_name}::${row.row_index}`);
const neighborRows = [];

for (const lineRows of byLine.values()) {
  lineRows.sort((a, b) => a.unit_index_number - b.unit_index_number || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0));
  for (let index = 0; index < lineRows.length; index += 1) {
    const previous = lineRows[index - 1] ?? null;
    const current = lineRows[index];
    const next = lineRows[index + 1] ?? null;
    neighborRows.push({
      image_name: current.image_name,
      row_index: current.row_index,
      unit_id: current.unit_id,
      molecule_id: current.source_molecule_id,
      unit_index: current.unit_index,
      atom_count: current.atom_count,
      first_token: current.tokens[0] ?? "",
      last_token: current.tokens.at(-1) ?? "",
      prefix2: current.tokens.slice(0, 2).join(" "),
      suffix2: current.tokens.slice(-2).join(" "),
      signature: current.tokens.join(" "),
      prev_molecule_id: previous?.source_molecule_id ?? "",
      prev_last_token: previous?.tokens.at(-1) ?? "",
      prev_suffix2: previous?.tokens.slice(-2).join(" ") ?? "",
      next_molecule_id: next?.source_molecule_id ?? "",
      next_first_token: next?.tokens[0] ?? "",
      next_prefix2: next?.tokens.slice(0, 2).join(" ") ?? "",
    });
  }
}

const firstTokenFindings = conditionalFindings(neighborRows, "last_token", "next_first_token", "next molecule first atom");
const prevFindings = conditionalFindings(neighborRows, "first_token", "prev_last_token", "previous molecule last atom");
const suffixPrefixFindings = conditionalFindings(neighborRows, "suffix2", "next_prefix2", "next molecule prefix2");
const markdown = buildMarkdown({ rows, neighborRows, firstTokenFindings, prevFindings, suffixPrefixFindings });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote molecule neighbor discovery to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  const outPath = path.resolve(process.cwd(), args.tsv);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, toTsv(neighborRows, [
    "image_name",
    "row_index",
    "unit_id",
    "molecule_id",
    "unit_index",
    "atom_count",
    "first_token",
    "last_token",
    "prefix2",
    "suffix2",
    "prev_molecule_id",
    "prev_last_token",
    "prev_suffix2",
    "next_molecule_id",
    "next_first_token",
    "next_prefix2",
    "signature",
  ]), "utf8");
  console.log(`Wrote molecule neighbor rows to ${outPath}`);
}

function conditionalFindings(rows, conditionField, resultField, resultLabel) {
  const usable = rows.filter((row) => row[conditionField] && row[resultField]);
  const byCondition = groupBy(usable, (row) => row[conditionField]);
  const findings = [];
  for (const [condition, conditionRows] of byCondition.entries()) {
    if (conditionRows.length < Number(args.min_count ?? 3)) continue;
    const resultCounts = countBy(conditionRows, (row) => row[resultField]);
    const [result, count] = Object.entries(resultCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    const share = count / conditionRows.length;
    if (share < Number(args.min_share ?? 0.75)) continue;
    findings.push({
      condition_field: conditionField,
      condition,
      result_label: resultLabel,
      result,
      count,
      total: conditionRows.length,
      share,
      examples: conditionRows.filter((row) => row[resultField] === result).slice(0, 5),
    });
  }
  return findings.sort((a, b) => b.share - a.share || b.total - a.total || a.condition.localeCompare(b.condition));
}

function buildMarkdown({ rows, neighborRows, firstTokenFindings, prevFindings, suffixPrefixFindings }) {
  const lines = [
    "# Molecule Neighbor Discovery",
    "",
    "## Scope",
    "",
    `- Molecules: \`${rows.length}\``,
    `- Neighbor rows: \`${neighborRows.length}\``,
    `- Input: \`${path.relative(process.cwd(), atomsPath)}\``,
    "",
    "This report studies molecule-to-molecule adjacency inside each exported program row.",
    "",
  ];

  appendFindings(lines, "Current last atom -> next first atom", firstTokenFindings);
  appendFindings(lines, "Current first atom -> previous last atom", prevFindings);
  appendFindings(lines, "Current suffix2 -> next prefix2", suffixPrefixFindings);

  return lines.join("\n");
}

function appendFindings(lines, title, findings) {
  lines.push(`## ${title}`);
  lines.push("");
  if (!findings.length) {
    lines.push("No strong findings under current thresholds.");
    lines.push("");
    return;
  }
  lines.push("| Condition | Result | Count | Total | Share | Examples |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  for (const finding of findings) {
    const examples = finding.examples
      .map((row) => `${row.molecule_id}->${row.next_molecule_id || row.prev_molecule_id}`)
      .join(", ");
    lines.push(`| \`${finding.condition_field}=${finding.condition}\` | \`${finding.result}\` | ${finding.count} | ${finding.total} | ${finding.share.toFixed(4)} | ${examples} |`);
  }
  lines.push("");
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function toTsv(rows, fields) {
  return [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
  ].join("\n") + "\n";
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
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

function printHelp() {
  console.log(`Usage:
  node scripts/molecule-neighbor-discovery.js --atoms cases/combined-f1r-f47v-current/atoms-current.tsv

Options:
  --min-count <n>   Minimum condition count. Default: 3.
  --min-share <n>   Minimum dominant share. Default: 0.75.
  --out <path>      Write markdown report.
  --tsv <path>      Write raw neighbor rows.`);
}
