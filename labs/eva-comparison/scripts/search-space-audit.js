import fs from "node:fs";
import path from "node:path";
import {
  atomRowsFromDb,
  cleanToken,
  groupsFromDbRows,
  openDatasetDb,
  parseArgs,
  roleFor,
  tokenSort,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const images = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const scopes = String(args.scopes ?? "particle,molecule")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);
const minShare = Number(args.min_share ?? 0.8);
const minDelta = Number(args.min_delta ?? 0.45);
const tests = ["has_prior", "has_after", "starts_with", "ends_with", "prev_is", "next_is"];

for (const scope of scopes) {
  if (!["particle", "molecule"].includes(scope)) {
    throw new Error(`Unknown scope: ${scope}`);
  }
}

const db = openDatasetDb(args.db);
const atomRows = atomRowsFromDb(db, images);
const vocabulary = [...new Set(atomRows.map((row) => row.token).filter(Boolean))].sort(tokenSort);
const rows = scopes.map((scope) => auditScope(scope));

const markdown = buildMarkdown(rows);

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote search-space audit to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  writeTsv(path.resolve(process.cwd(), args.tsv), rows, [
    "scope",
    "images",
    "atoms",
    "groups",
    "vocabulary",
    "symbols",
    "observed_symbol_role_cells",
    "tests",
    "raw_hypotheses",
    "reported_candidates",
    "min_share",
    "min_delta",
  ]);
  console.log(`Wrote search-space audit TSV to ${path.resolve(process.cwd(), args.tsv)}`);
}

function auditScope(scope) {
  const groups = groupsFromDbRows(atomRows, scope);
  const symbolRoles = new Set();
  let reportedCandidates = 0;

  for (const symbol of vocabulary) {
    const occurrences = occurrencesForSymbol(groups, symbol);
    for (const role of ["initial", "medial", "final", "singleton"]) {
      const roleRows = occurrences.filter((row) => row.role === role);
      if (!roleRows.length) continue;
      const contrastRows = occurrences.filter((row) => row.role !== role);
      symbolRoles.add(`${symbol}:${role}`);
      reportedCandidates += strongFindingsForRole(symbol, roleRows, contrastRows).length;
    }
  }

  const rawHypotheses = symbolRoles.size * tests.length * Math.max(0, vocabulary.length - 1);

  return {
    scope,
    images: images.join(","),
    atoms: atomRows.length,
    groups: groups.length,
    vocabulary: vocabulary.length,
    symbols: vocabulary.join(","),
    observed_symbol_role_cells: symbolRoles.size,
    tests: tests.length,
    raw_hypotheses: rawHypotheses,
    reported_candidates: reportedCandidates,
    min_share: minShare,
    min_delta: minDelta,
  };
}

function occurrencesForSymbol(groups, symbol) {
  const occurrences = [];
  for (const groupRows of groups) {
    const tokens = groupRows.map((row) => row.token);
    for (let index = 0; index < groupRows.length; index += 1) {
      if (tokens[index] !== symbol) continue;
      occurrences.push({
        role: roleFor(index, tokens.length),
        firstToken: tokens[0] ?? "",
        lastToken: tokens.at(-1) ?? "",
        prevToken: tokens[index - 1] ?? "",
        nextToken: tokens[index + 1] ?? "",
        beforeTokens: new Set(tokens.slice(0, index)),
        afterTokens: new Set(tokens.slice(index + 1)),
      });
    }
  }
  return occurrences;
}

function strongFindingsForRole(symbol, roleRows, contrastRows) {
  const findings = [];
  for (const test of tests) {
    for (const token of vocabulary) {
      if (token === symbol) continue;
      const count = roleRows.filter((row) => testContext(row, test, token)).length;
      if (!count) continue;
      const contrastCount = contrastRows.filter((row) => testContext(row, test, token)).length;
      const share = count / roleRows.length;
      const contrastShare = contrastRows.length ? contrastCount / contrastRows.length : 0;
      const delta = share - contrastShare;
      if (share >= minShare || Math.abs(delta) >= minDelta) {
        findings.push({ test, token, share, delta });
      }
    }
  }
  return findings;
}

function testContext(row, test, token) {
  const clean = cleanToken(token);
  if (test === "has_prior") return row.beforeTokens.has(clean);
  if (test === "has_after") return row.afterTokens.has(clean);
  if (test === "starts_with") return row.firstToken === clean;
  if (test === "ends_with") return row.lastToken === clean;
  if (test === "prev_is") return row.prevToken === clean;
  if (test === "next_is") return row.nextToken === clean;
  return false;
}

function buildMarkdown(rows) {
  const lines = [
    "# Search-Space Audit",
    "",
    "## Purpose",
    "",
    "This report estimates how many contextual hypotheses are examined before strong candidates are reported. It is a guardrail against reading the strongest rows as if they were hand-picked in advance.",
    "",
    "## Current Thresholds",
    "",
    `- Candidate if share >= \`${minShare}\` or absolute delta >= \`${minDelta}\`.`,
    `- Context tests: ${tests.map((test) => `\`${test}\``).join(", ")}.`,
    "",
    "## Search Space",
    "",
    "| Scope | Atoms | Groups | Vocabulary | Observed symbol-role cells | Tests | Raw hypotheses | Reported candidates |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const row of rows) {
    lines.push(`| \`${row.scope}\` | ${row.atoms} | ${row.groups} | ${row.vocabulary} | ${row.observed_symbol_role_cells} | ${row.tests} | ${row.raw_hypotheses} | ${row.reported_candidates} |`);
  }

  lines.push("");
  lines.push("## Interpretation Rules");
  lines.push("");
  lines.push("- A strong candidate is not automatically grammar; it is a rule worth validating.");
  lines.push("- Perfect or near-perfect rows are most persuasive when they survive on folios not used to discover or tune the category.");
  lines.push("- Counts should be interpreted with the search space in mind, especially when many symbol-role-test-token combinations are examined.");
  lines.push("- Future preregistered runs should freeze the atom inventory, thresholds, corpus split, and accepted tests before new pages are labeled.");
  lines.push("");

  return lines.join("\n");
}

function printHelp() {
  console.log(`Usage:
  node scripts/search-space-audit.js --images page-003.jpg,page-094.jpg --scopes particle,molecule --out cases/combined/search-space-audit.md --tsv cases/combined/search-space-audit.tsv`);
}
