import fs from "node:fs";
import path from "node:path";
import {
  atomRowsFromDb,
  cleanToken,
  groupsFromDbRows,
  openDatasetDb,
  parseArgs,
  readTsv,
  roleFor,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.rules) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const scope = String(args.scope ?? "particle").toLowerCase();
const images = String(args.images ?? "page-003.jpg,page-094.jpg").split(",").map((value) => value.trim()).filter(Boolean);
const minTotal = Number(args.min_total ?? 10);
const minShare = Number(args.min_share ?? 0.9);
const rules = readTsv(path.resolve(process.cwd(), args.rules))
  .filter((row) => Number(row.total) >= minTotal && Number(row.share) >= minShare)
  .map((row) => ({
    symbol: cleanToken(row.symbol),
    role: row.role,
    test: row.test,
    token: cleanToken(row.token),
    discovery_total: Number(row.total),
    discovery_share: Number(row.share),
  }));

const db = openDatasetDb(args.db);
const atomRows = atomRowsFromDb(db, images);
const imageRows = [];

for (const image of images) {
  const groups = groupsFromDbRows(atomRows.filter((row) => row.image_name === image), scope);
  for (const rule of rules) {
    const result = evaluateRule(groups, rule);
    imageRows.push({
      image,
      scope,
      symbol: rule.symbol,
      role: rule.role,
      test: rule.test,
      token: rule.token,
      discovery_total: rule.discovery_total,
      discovery_share: rule.discovery_share.toFixed(4),
      count: result.count,
      total: result.total,
      share: result.total ? (result.count / result.total).toFixed(4) : "NA",
      status: result.total === 0 ? "not_observed" : result.count === result.total ? "perfect" : (result.count / result.total) >= minShare ? "survives" : "weak",
      examples: result.examples.join("; "),
    });
  }
}

const markdown = buildMarkdown({ images, scope, minTotal, minShare, rules, imageRows });

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote cross-folio validation to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  writeTsv(path.resolve(process.cwd(), args.tsv), imageRows, [
    "image",
    "scope",
    "symbol",
    "role",
    "test",
    "token",
    "discovery_total",
    "discovery_share",
    "count",
    "total",
    "share",
    "status",
    "examples",
  ]);
  console.log(`Wrote cross-folio validation TSV to ${path.resolve(process.cwd(), args.tsv)}`);
}

function evaluateRule(groups, rule) {
  let count = 0;
  let total = 0;
  const examples = [];
  for (const groupRows of groups) {
    const tokens = groupRows.map((row) => row.token);
    for (let index = 0; index < groupRows.length; index += 1) {
      if (tokens[index] !== rule.symbol) continue;
      const role = roleFor(index, tokens.length);
      if (role !== rule.role) continue;
      total += 1;
      const context = contextFor(tokens, index);
      if (testContext(context, rule.test, rule.token)) {
        count += 1;
      } else if (examples.length < 4) {
        examples.push(`${groupRows[index].molecule_id}/${groupRows[index].particle_id}:${tokens.join(" ")}`);
      }
    }
  }
  return { count, total, examples };
}

function contextFor(tokens, index) {
  return {
    first: tokens[0] ?? "",
    last: tokens.at(-1) ?? "",
    prev: tokens[index - 1] ?? "",
    next: tokens[index + 1] ?? "",
    prior: new Set(tokens.slice(0, index)),
    after: new Set(tokens.slice(index + 1)),
  };
}

function testContext(context, test, token) {
  if (test === "has_prior") return context.prior.has(token);
  if (test === "has_after") return context.after.has(token);
  if (test === "starts_with") return context.first === token;
  if (test === "ends_with") return context.last === token;
  if (test === "prev_is") return context.prev === token;
  if (test === "next_is") return context.next === token;
  return false;
}

function buildMarkdown({ images, scope, minTotal, minShare, rules, imageRows }) {
  const lines = [
    "# Cross-Folio Rule Validation",
    "",
    "## Scope",
    "",
    `- Images: ${images.map((image) => `\`${image}\``).join(", ")}`,
    `- Context scope: \`${scope}\``,
    `- Discovery rules tested: \`${rules.length}\``,
    `- Rule filter: total >= \`${minTotal}\`, share >= \`${minShare}\``,
    "",
    "## Validation Matrix",
    "",
    "| Rule | Discovery | Image | Count | Total | Share | Status | Exceptions/examples |",
    "| --- | ---: | --- | ---: | ---: | ---: | --- | --- |",
  ];
  for (const row of imageRows) {
    const rule = `\`${row.symbol}\` ${row.role} ${row.test} \`${row.token}\``;
    lines.push(`| ${rule} | ${row.discovery_share} | \`${row.image}\` | ${row.count} | ${row.total} | ${row.share} | ${row.status} | ${row.examples || "-"} |`);
  }
  lines.push("");
  lines.push("Statuses:");
  lines.push("");
  lines.push("- `perfect`: every observed case in that image passes.");
  lines.push("- `survives`: observed share remains above the threshold.");
  lines.push("- `weak`: observed but below threshold.");
  lines.push("- `not_observed`: no matching role occurrence in that image yet.");
  lines.push("");
  return lines.join("\n");
}

function printHelp() {
  console.log(`Usage:
  node scripts/cross-folio-validation.js --rules cases/combined/contextual-rule-discovery.tsv --scope particle --out cases/combined/cross-folio-validation.md

Options:
  --images <csv>      Images to validate. Default: page-003.jpg,page-094.jpg.
  --scope <scope>     particle or molecule. Default: particle.
  --min-total <n>     Minimum discovery total. Default: 10.
  --min-share <n>     Minimum discovery share. Default: 0.9.
  --out <path>        Write markdown report.
  --tsv <path>        Write validation table.`);
}

