import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const dbPath = path.resolve(
  args.db ??
    path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);
const imageNames = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const requestedSymbols = String(args.symbols ?? "")
  .split(",")
  .map(cleanToken)
  .filter(Boolean);
const scope = String(args.scope ?? "particle").trim().toLowerCase();

if (!["particle", "molecule"].includes(scope)) {
  console.error(`Unknown scope: ${scope}. Expected particle or molecule.`);
  process.exit(1);
}

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = atomRows(db, imageNames);
const groups = [...groupBy(rows, groupKeyForScope).values()]
  .map((groupRows) => groupRows.sort(atomSort));
const vocabulary = [...new Set(rows.map((row) => row.token))].sort(tokenSort);
const symbols = requestedSymbols.length ? requestedSymbols : vocabulary;
const reports = symbols
  .filter((symbol) => vocabulary.includes(symbol))
  .map((symbol) => symbolReport(symbol, groups, vocabulary));

const markdown = buildMarkdown(reports, imageNames, scope);
const tsvRows = reports.flatMap((report) => report.findings.map((finding) => ({
  symbol: report.symbol,
  occurrences: report.occurrences.length,
  role: finding.role,
  test: finding.test,
  token: finding.token,
  count: finding.count,
  total: finding.total,
  share: finding.share.toFixed(4),
  contrast_count: finding.contrastCount,
  contrast_total: finding.contrastTotal,
  contrast_share: finding.contrastShare.toFixed(4),
  delta: finding.delta.toFixed(4),
})));

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote contextual rule discovery to ${outPath}`);
} else {
  process.stdout.write(markdown);
}

if (args.tsv) {
  const outPath = path.resolve(process.cwd(), args.tsv);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, toTsv(tsvRows, [
    "symbol",
    "occurrences",
    "role",
    "test",
    "token",
    "count",
    "total",
    "share",
    "contrast_count",
    "contrast_total",
    "contrast_share",
    "delta",
  ]), "utf8");
  console.log(`Wrote contextual rule discovery TSV to ${outPath}`);
}

function symbolReport(symbol, groups, vocabulary) {
  const occurrences = [];
  for (const groupRows of groups) {
    const tokens = groupRows.map((row) => row.token);
    for (let index = 0; index < groupRows.length; index += 1) {
      const row = groupRows[index];
      if (row.token !== symbol) continue;
      occurrences.push({
        ...row,
        role: roleFor(index, tokens.length),
        position: index + 1,
        particleLength: tokens.length,
        firstToken: tokens[0] ?? "",
        lastToken: tokens.at(-1) ?? "",
        prevToken: tokens[index - 1] ?? "",
        nextToken: tokens[index + 1] ?? "",
        beforeTokens: new Set(tokens.slice(0, index)),
        afterTokens: new Set(tokens.slice(index + 1)),
        particleSignature: tokens.join(" "),
      });
    }
  }

  const roleCounts = countBy(occurrences, (row) => row.role);
  const findings = [];
  for (const role of ["initial", "medial", "final", "singleton"]) {
    const roleRows = occurrences.filter((row) => row.role === role);
    const contrastRows = occurrences.filter((row) => row.role !== role);
    if (!roleRows.length) continue;
    findings.push(...contextFindingsForRole(symbol, role, roleRows, contrastRows, vocabulary));
  }

  findings.sort((a, b) =>
    b.share - a.share
    || Math.abs(b.delta) - Math.abs(a.delta)
    || b.total - a.total
    || a.test.localeCompare(b.test)
    || a.token.localeCompare(b.token)
  );

  return {
    symbol,
    occurrences,
    roleCounts,
    findings: findings.slice(0, 18),
  };
}

function contextFindingsForRole(symbol, role, roleRows, contrastRows, vocabulary) {
  const tests = [
    ["has_prior", (row, token) => row.beforeTokens.has(token)],
    ["has_after", (row, token) => row.afterTokens.has(token)],
    ["starts_with", (row, token) => row.firstToken === token],
    ["ends_with", (row, token) => row.lastToken === token],
    ["prev_is", (row, token) => row.prevToken === token],
    ["next_is", (row, token) => row.nextToken === token],
  ];
  const findings = [];
  for (const [test, predicate] of tests) {
    for (const token of vocabulary) {
      if (token === symbol) continue;
      const count = roleRows.filter((row) => predicate(row, token)).length;
      if (!count) continue;
      const contrastCount = contrastRows.filter((row) => predicate(row, token)).length;
      const share = count / roleRows.length;
      const contrastShare = contrastRows.length ? contrastCount / contrastRows.length : 0;
      const delta = share - contrastShare;
      if (share >= 0.8 || Math.abs(delta) >= 0.45) {
        findings.push({
          role,
          test,
          token,
          count,
          total: roleRows.length,
          share,
          contrastCount,
          contrastTotal: contrastRows.length,
          contrastShare,
          delta,
        });
      }
    }
  }
  return findings;
}

function buildMarkdown(reports, imageNames, scope) {
  const lines = [
    "# Contextual Rule Discovery",
    "",
    "## Scope",
    "",
    `- Images: ${imageNames.map((name) => `\`${name}\``).join(", ")}`,
    `- Context scope: \`${scope}\``,
    `- Symbols audited: ${reports.map((report) => `\`${report.symbol}\``).join(", ")}`,
    "",
  ];

  for (const report of reports) {
    lines.push(`## ${report.symbol}`);
    lines.push("");
    lines.push(`Occurrences: \`${report.occurrences.length}\``);
    lines.push("");
    lines.push("| Role | Count |");
    lines.push("| --- | ---: |");
    for (const role of ["initial", "medial", "final", "singleton"]) {
      lines.push(`| ${role} | ${report.roleCounts[role] ?? 0} |`);
    }
    lines.push("");
    lines.push("### Strong Context Findings");
    lines.push("");
    if (!report.findings.length) {
      lines.push("No strong findings under the current thresholds.");
      lines.push("");
      continue;
    }
    lines.push("| Role | Test | Token | Count | Total | Share | Contrast | Delta |");
    lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const finding of report.findings) {
      lines.push(
        `| ${finding.role} | ${finding.test} | ${finding.token} | ${finding.count} | ${finding.total} | ${finding.share.toFixed(4)} | ${finding.contrastCount}/${finding.contrastTotal} (${finding.contrastShare.toFixed(4)}) | ${finding.delta.toFixed(4)} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function atomRows(db, names) {
  const imageFilter = names.length
    ? `AND i.name IN (${names.map(() => "?").join(",")})`
    : "";
  return db
    .prepare(
      `SELECT
         a.id AS atom_id,
         a.image_id,
         i.name AS image_name,
         a.molecule_id,
         a.particle_id,
         a.atom_order,
         p.particle_order,
         a.family,
         a.structural_config,
         a.bounds_x
       FROM atoms a
       JOIN images i ON i.id = a.image_id
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       WHERE a.molecule_id IS NOT NULL
       ${imageFilter}
       ORDER BY a.image_id, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
    )
    .all(...names)
    .map((row) => ({
      ...row,
      token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
    }));
}

function atomSort(a, b) {
  return Number(a.particle_order ?? Number.MAX_SAFE_INTEGER) - Number(b.particle_order ?? Number.MAX_SAFE_INTEGER)
    || String(a.particle_id ?? "").localeCompare(String(b.particle_id ?? ""))
    || Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id);
}

function groupKeyForScope(row) {
  if (scope === "molecule") return row.molecule_id || `unassigned-molecule:${row.atom_id}`;
  return row.particle_id || `unassigned-particle:${row.atom_id}`;
}

function roleFor(index, length) {
  if (length <= 1) return "singleton";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
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

function cleanToken(value) {
  const [family, config = ""] = String(value ?? "").trim().toLowerCase().split(":");
  if (!family) return "";
  return config ? `${family}:${config}` : family;
}

function tokenSort(a, b) {
  const [familyA, variantA = ""] = a.split(":");
  const [familyB, variantB = ""] = b.split(":");
  return familyA.localeCompare(familyB) || Number(variantA) - Number(variantB) || variantA.localeCompare(variantB);
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
  node scripts/contextual-rule-discovery.js --symbols d:1,e:1,c:1,f:1,a:1,h:1,h:2,m:1 --images page-003.jpg,page-094.jpg --out cases/combined/contextual-rule-discovery.md --tsv cases/combined/contextual-rule-discovery.tsv`);
}
