import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.out_dir || !args.cases) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const caseDirs = String(args.cases)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .map((value) => path.resolve(process.cwd(), value));

const outDir = path.resolve(process.cwd(), args.out_dir);
fs.mkdirSync(outDir, { recursive: true });

combineTsv(caseDirs, "eva-lines.tsv", path.join(outDir, "eva-lines.tsv"));
combineTsv(caseDirs, "eva-tokens.tsv", path.join(outDir, "eva-tokens.tsv"));
combineTsv(caseDirs, "atoms-current.tsv", path.join(outDir, "atoms-current.tsv"));
combineText(caseDirs, "eva.txt", path.join(outDir, "eva.txt"));

const notes = [
  "# Combined Case",
  "",
  "Cases included:",
  "",
  ...caseDirs.map((caseDir) => `- \`${path.relative(process.cwd(), caseDir)}\``),
  "",
  "Generated files:",
  "",
  "- `eva-lines.tsv`",
  "- `eva-tokens.tsv`",
  "- `atoms-current.tsv`",
  "- `eva.txt`",
  "",
].join("\n");
fs.writeFileSync(path.join(outDir, "NOTES.md"), notes, "utf8");

console.log(`Combined ${caseDirs.length} cases into ${outDir}`);

function combineTsv(caseDirs, fileName, outPath) {
  let header = null;
  const rows = [];

  for (const caseDir of caseDirs) {
    const filePath = path.join(caseDir, fileName);
    const lines = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
    if (!lines.length) continue;
    if (!header) {
      header = lines[0];
    } else if (header !== lines[0]) {
      throw new Error(`Header mismatch for ${fileName} in ${filePath}`);
    }
    rows.push(...lines.slice(1));
  }

  fs.writeFileSync(outPath, [header, ...rows].join("\n") + "\n", "utf8");
}

function combineText(caseDirs, fileName, outPath) {
  const blocks = caseDirs.map((caseDir) => fs.readFileSync(path.join(caseDir, fileName), "utf8").trim());
  fs.writeFileSync(outPath, blocks.filter(Boolean).join("\n\n") + "\n", "utf8");
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
  console.log("Usage: node scripts/combine-cases.js --cases cases/a,cases/b --out-dir cases/combined");
}
