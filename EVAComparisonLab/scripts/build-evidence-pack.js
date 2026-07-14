import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.case_dir) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const caseDir = path.resolve(process.cwd(), args.case_dir);
const evaLines = readTsv(path.join(caseDir, "eva-lines.tsv"));
const atomsRows = readTsv(path.join(caseDir, "atoms.tsv"));
const entropy = fs.readFileSync(path.join(caseDir, "role-entropy.md"), "utf8");

const entropySummary = extractEntropySummary(entropy);
const atomsByRow = groupBy(atomsRows, (row) => row.row_index);
const evaPage = args.page ?? evaLines[0]?.page ?? "?";
const imageName = args.image ?? atomsRows[0]?.image_name ?? "?";
const description = args.description ?? "selected physical lines from the manuscript page.";
const evaTokenTotal = sum(evaLines, (row) => tokenCount(row.eva));

const lines = [];
lines.push("# Evidence Pack: EVA vs Physical Atoms");
lines.push("");
lines.push("## Scope");
lines.push("");
lines.push(`- Manuscript page: \`${evaPage}\` / image \`${imageName}\`.`);
lines.push(`- Included text: ${description}`);
lines.push(`- EVA physical lines: \`${evaLines.length}\`.`);
lines.push(`- EVA tokens: \`${evaTokenTotal}\`.`);
lines.push(`- Physical atom units: \`${atomsRows.length}\`.`);
lines.push("");
lines.push("## Entropy Summary");
lines.push("");
lines.push("| System | Units | Symbols | Vocabulary | Weighted entropy bits | Relative entropy | Zero entropy symbols | Rigid symbols >=95% |");
lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
for (const row of entropySummary) {
  lines.push(`| ${row.system} | ${row.units} | ${row.symbols} | ${row.vocabulary} | ${row.weightedEntropyBits} | ${row.weightedRelativeEntropy} | ${row.zeroEntropySymbols} | ${row.rigidSymbols95} |`);
}
lines.push("");
const contextualFiles = [
  ["Contextual d:1/a:1 audit", "contextual-d1-audit.md"],
  ["Contextual rule discovery (particle scope)", "contextual-rule-discovery.md"],
  ["Contextual rule discovery table (particle scope)", "contextual-rule-discovery.tsv"],
  ["Contextual rule discovery (molecule scope)", "contextual-rule-discovery-molecule-scope.md"],
  ["Contextual rule discovery table (molecule scope)", "contextual-rule-discovery-molecule-scope.tsv"],
  ["Molecule neighbor discovery", "molecule-neighbor-discovery.md"],
  ["Molecule neighbor table", "molecule-neighbor-discovery.tsv"],
].filter(([, fileName]) => fs.existsSync(path.join(caseDir, fileName)));

if (contextualFiles.length > 0) {
  lines.push("## Contextual Rule Files");
  lines.push("");
  lines.push("These files inspect atom roles inside particle context, full molecule context, and molecule-to-molecule adjacency.");
  lines.push("");
  for (const [label, fileName] of contextualFiles) {
    lines.push(`- ${label}: \`${fileName}\``);
  }
  lines.push("");
}

lines.push("## EVA Text By Physical Line");
lines.push("");
for (const row of evaLines) {
  lines.push(`### EVA P${row.paragraph} / line ${row.line}`);
  lines.push("");
  lines.push(`Source loci: \`${row.source_loci}\``);
  lines.push("");
  lines.push("```text");
  lines.push(row.eva);
  lines.push("```");
  lines.push("");
}
lines.push("## Physical Atom Units By Program Row");
lines.push("");
for (const [rowIndex, rows] of [...atomsByRow.entries()].sort((a, b) => Number(a[0]) - Number(b[0]))) {
  lines.push(`### Atom row ${rowIndex}`);
  lines.push("");
  for (const row of rows.sort((a, b) => Number(a.unit_index) - Number(b.unit_index))) {
    lines.push(`- ${row.unit_id} / ${row.source_molecule_id}: \`${row.atoms}\``);
  }
  lines.push("");
}
lines.push("## Correspondence Status");
lines.push("");
lines.push("There is not yet a rule table that converts EVA symbols into physical atoms.");
lines.push("The comparison is currently made over the same manuscript fragment, using independent tokenizations:");
lines.push("");
lines.push("- EVA tokens are read from the IVTFF transcription.");
lines.push("- Physical atom units are exported from DatasetCreator's current molecule segmentation.");
if (evaTokenTotal === atomsRows.length) {
  lines.push("- Strict 1:1 alignment is available for this export because both systems have the same unit count.");
} else {
  lines.push(`- Strict 1:1 alignment currently fails because EVA has \`${evaTokenTotal}\` tokens and the physical system has \`${atomsRows.length}\` units.`);
}
lines.push("");
lines.push("This mismatch is part of the evidence to inspect, not something to silently normalize away.");
lines.push("");

const outPath = path.join(caseDir, args.out ?? "EVIDENCE-PACK.md");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);

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
  console.log("Usage: node scripts/build-evidence-pack.js --case-dir cases/combined");
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

function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function sum(rows, valueFn) {
  return rows.reduce((total, row) => total + valueFn(row), 0);
}

function tokenCount(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function extractEntropySummary(text) {
  const sections = text.split(/\n(?===[^=]+==)/g);
  return sections.map((section) => {
    const system = section.match(/==\s*(.*?)\s+role entropy\s*==/)?.[1] ?? "?";
    return {
      system,
      units: field(section, "units"),
      symbols: field(section, "symbols"),
      vocabulary: field(section, "vocabulary"),
      weightedEntropyBits: field(section, "weighted_entropy_bits"),
      weightedRelativeEntropy: field(section, "weighted_relative_entropy_0_to_1"),
      zeroEntropySymbols: field(section, "zero_entropy_symbols"),
      rigidSymbols95: field(section, "rigid_symbols_95pct"),
    };
  }).filter((row) => row.system !== "?");
}

function field(section, name) {
  return section.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1] ?? "";
}
