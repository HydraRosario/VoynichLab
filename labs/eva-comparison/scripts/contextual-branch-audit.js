import fs from "node:fs";
import path from "node:path";
import {
  atomRowsFromDb,
  cleanToken,
  countBy,
  groupsFromDbRows,
  openDatasetDb,
  parseArgs,
  roleFor,
  tokenSort,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.symbol || !args.role || !args.split_token) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const scope = String(args.scope ?? "particle").toLowerCase();
const images = String(args.images ?? "page-003.jpg,page-094.jpg").split(",").map((value) => value.trim()).filter(Boolean);
const symbol = cleanToken(args.symbol);
const role = String(args.role);
const splitTest = String(args.split_test ?? "has_prior");
const splitToken = cleanToken(args.split_token);
const measure = String(args.measure ?? "starts_with");

const db = openDatasetDb(args.db);
const rows = atomRowsFromDb(db, images);
const groups = groupsFromDbRows(rows, scope);
const occurrences = [];

for (const groupRows of groups) {
  const tokens = groupRows.map((row) => row.token);
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index] !== symbol || roleFor(index, tokens.length) !== role) continue;
    const context = contextFor(tokens, index);
    occurrences.push({
      image_name: groupRows[index].image_name,
      molecule_id: groupRows[index].molecule_id,
      particle_id: groupRows[index].particle_id,
      atom_id: groupRows[index].atom_id,
      branch: testContext(context, splitTest, splitToken) ? `${splitTest}:${splitToken}` : `not_${splitTest}:${splitToken}`,
      measured_value: measureContext(context, measure),
      signature: tokens.join(" "),
    });
  }
}

const branchRows = summarizeBranches(occurrences);
const markdown = buildMarkdown({ images, scope, symbol, role, splitTest, splitToken, measure, occurrences, branchRows });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote contextual branch audit to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  writeTsv(path.resolve(process.cwd(), args.tsv), occurrences, [
    "image_name",
    "molecule_id",
    "particle_id",
    "atom_id",
    "branch",
    "measured_value",
    "signature",
  ]);
  console.log(`Wrote contextual branch audit TSV to ${path.resolve(process.cwd(), args.tsv)}`);
}

function contextFor(tokens, index) {
  return {
    first: tokens[0] ?? "",
    last: tokens.at(-1) ?? "",
    prev: tokens[index - 1] ?? "",
    next: tokens[index + 1] ?? "",
    prior: new Set(tokens.slice(0, index)),
    after: new Set(tokens.slice(index + 1)),
    signature: tokens.join(" "),
  };
}

function testContext(context, test, token) {
  if (test === "has_prior") return context.prior.has(token);
  if (test === "has_after") return context.after.has(token);
  if (test === "starts_with") return context.first === token;
  if (test === "ends_with") return context.last === token;
  if (test === "prev_is") return context.prev === token;
  if (test === "next_is") return context.next === token;
  throw new Error(`Unknown split test: ${test}`);
}

function measureContext(context, measure) {
  if (measure === "starts_with") return context.first;
  if (measure === "ends_with") return context.last;
  if (measure === "prev_is") return context.prev;
  if (measure === "next_is") return context.next;
  throw new Error(`Unknown measure: ${measure}`);
}

function summarizeBranches(rows) {
  const branches = new Map();
  for (const row of rows) {
    if (!branches.has(row.branch)) branches.set(row.branch, []);
    branches.get(row.branch).push(row);
  }
  return [...branches.entries()].map(([branch, branchRows]) => {
    const counts = countBy(branchRows, (row) => row.measured_value);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1] || tokenSort(a[0], b[0]));
    const [dominant, count] = sorted[0] ?? ["", 0];
    return {
      branch,
      total: branchRows.length,
      dominant,
      dominant_count: count,
      dominant_share: branchRows.length ? count / branchRows.length : 0,
      distribution: sorted.map(([value, valueCount]) => `${value}:${valueCount}`).join(" "),
      examples: branchRows.slice(0, 6),
    };
  }).sort((a, b) => a.branch.localeCompare(b.branch));
}

function buildMarkdown({ images, scope, symbol, role, splitTest, splitToken, measure, occurrences, branchRows }) {
  const lines = [
    "# Contextual Branch Audit",
    "",
    "## Scope",
    "",
    `- Images: ${images.map((image) => `\`${image}\``).join(", ")}`,
    `- Context scope: \`${scope}\``,
    `- Target: \`${symbol}\` as \`${role}\``,
    `- Split: \`${splitTest} ${splitToken}\``,
    `- Measure: \`${measure}\``,
    `- Occurrences: \`${occurrences.length}\``,
    "",
    "## Branch Summary",
    "",
    "| Branch | Total | Dominant measured value | Count | Share | Distribution |",
    "| --- | ---: | --- | ---: | ---: | --- |",
  ];
  for (const row of branchRows) {
    lines.push(`| \`${row.branch}\` | ${row.total} | \`${row.dominant}\` | ${row.dominant_count} | ${row.dominant_share.toFixed(4)} | ${row.distribution} |`);
  }
  lines.push("");
  lines.push("## Examples");
  lines.push("");
  for (const row of branchRows) {
    lines.push(`### ${row.branch}`);
    lines.push("");
    for (const example of row.examples) {
      lines.push(`- \`${example.image_name}\` / \`${example.molecule_id}\` / \`${example.particle_id}\` / atom ${example.atom_id}: \`${example.signature}\``);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function printHelp() {
  console.log(`Usage:
  node scripts/contextual-branch-audit.js --symbol e:1 --role final --split-token g:1 --measure starts_with --out cases/combined/e1-final-branch-audit.md

Options:
  --scope <particle|molecule>  Default: particle.
  --images <csv>              Default: page-003.jpg,page-094.jpg.
  --split-test <test>          Default: has_prior.
  --split-token <token>        Required.
  --measure <measure>          starts_with, ends_with, prev_is, next_is. Default: starts_with.
  --out <path>                 Write markdown.
  --tsv <path>                 Write occurrence TSV.`);
}

