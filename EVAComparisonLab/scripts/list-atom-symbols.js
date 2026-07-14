import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.atoms) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const rows = readTsv(path.resolve(process.cwd(), args.atoms));
const counts = new Map();

for (const row of rows) {
  for (const symbol of String(row.atoms || "").trim().split(/\s+/).filter(Boolean)) {
    counts.set(symbol, (counts.get(symbol) || 0) + 1);
  }
}

const ordered = [...counts.entries()].sort((a, b) => {
  const [familyA, variantA = ""] = a[0].split(":");
  const [familyB, variantB = ""] = b[0].split(":");
  return familyA.localeCompare(familyB) || Number(variantA) - Number(variantB) || variantA.localeCompare(variantB);
});

const lines = [
  "# Physical Atom Symbols",
  "",
  `Units: ${rows.length}`,
  `Vocabulary: ${ordered.length}`,
  `Total atom tokens: ${ordered.reduce((total, [, count]) => total + count, 0)}`,
  "",
  "| Symbol | Count |",
  "| --- | ---: |",
  ...ordered.map(([symbol, count]) => `| \`${symbol}\` | ${count} |`),
  "",
];

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Wrote ${outPath}`);
} else {
  process.stdout.write(lines.join("\n"));
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
  console.log("Usage: node scripts/list-atom-symbols.js --atoms cases/combined/atoms.tsv --out cases/combined/atom-symbols.md");
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
