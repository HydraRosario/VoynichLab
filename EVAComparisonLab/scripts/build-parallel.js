import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.atoms || !args.eva) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const atomsRows = readTsv(path.resolve(process.cwd(), args.atoms));
const evaRows = readTsv(path.resolve(process.cwd(), args.eva));

if (atomsRows.length !== evaRows.length) {
  console.error(`Cannot build strict parallel TSV: atoms=${atomsRows.length}, eva=${evaRows.length}`);
  console.error("This may be evidence of a segmentation mismatch, but it must be aligned manually first.");
  process.exit(2);
}

const rows = atomsRows.map((atomRow, index) => ({
  unit_id: evaRows[index].unit_id || atomRow.unit_id,
  atoms: atomRow.atoms,
  eva: evaRows[index].eva,
  atoms_source_unit_id: atomRow.unit_id,
  eva_source_unit_id: evaRows[index].unit_id,
}));

const tsv = toTsv(rows, ["unit_id", "atoms", "eva", "atoms_source_unit_id", "eva_source_unit_id"]);

if (args.out) {
  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tsv, "utf8");
  console.log(`Built ${rows.length} aligned rows at ${outPath}`);
} else {
  process.stdout.write(tsv);
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
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = value;
      index += 1;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  npm run build:parallel -- --atoms cases/page-003/atoms.tsv --eva cases/page-003/eva-tokens.tsv --out cases/page-003/parallel.tsv

Required:
  --atoms <path>   TSV exported by export:atoms.
  --eva <path>     TSV with unit_id and eva columns.

Optional:
  --out <path>     Output parallel TSV. Prints to stdout when omitted.`);
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));

  if (lines.length === 0) return [];

  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
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
