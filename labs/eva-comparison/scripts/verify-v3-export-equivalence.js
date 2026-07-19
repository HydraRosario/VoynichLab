import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
if (!args.before || !args.after) {
  console.error("Usage: npm run corpus:v3:verify-recalculation -- --before <working-export> --after <working-export>");
  process.exit(1);
}

const files = ["particles.tsv", "atoms.tsv", "molecules.tsv", "identifier-map.tsv"];
const results = files.map((name) => {
  const before = path.resolve(args.before, "corpus", name);
  const after = path.resolve(args.after, "corpus", name);
  if (!fs.existsSync(before) || !fs.existsSync(after)) {
    throw new Error(`Missing comparison input for ${name}`);
  }
  const beforeHash = sha256(before);
  const afterHash = sha256(after);
  return { file: name, beforeHash, afterHash, identical: beforeHash === afterHash };
});

const passed = results.every((row) => row.identical);
console.log(JSON.stringify({ passed, contract: "V3_RECALCULATION_IS_IDEMPOTENT", results }, null, 2));
if (!passed) process.exit(1);

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) { parsed[key] = next; index += 1; }
  }
  return parsed;
}
