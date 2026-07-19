import fs from "node:fs";
import path from "node:path";
import { analyzeCorpus, loadCorpus } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.corpus || !args.out) {
  console.log(`Usage:
  npm run analyze -- --corpus <Corpus V3 corpus directory> --out <analysis.json>
  npm run analyze -- --corpus <dir> --out <analysis.json> --qc-out <qc-candidates.json> --min-support 4`);
  process.exit(args.help ? 0 : 1);
}

const corpusDir = path.resolve(args.corpus);
const outPath = path.resolve(args.out);
const corpus = loadCorpus(corpusDir);
const analysis = analyzeCorpus(corpus, {
  minSupport: args.min_support ?? 4,
  permutations: args.permutations ?? 50,
  compositionPermutations: args.composition_permutations ?? 30,
  operatorPermutations: args.operator_permutations ?? 30,
  auditMinimumDelta: args.audit_minimum_delta ?? 1.25,
});
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(analysis, null, 2)}\n`);
if (args.qc_out) {
  const qcPath = path.resolve(args.qc_out);
  fs.mkdirSync(path.dirname(qcPath), { recursive: true });
  fs.writeFileSync(qcPath, `${JSON.stringify({
    schema_version: 1,
    status: "CANDIDATES_NOT_DECISIONS",
    source_fingerprint_sha256: analysis.input_fingerprint_sha256,
    contextual_annotation_candidates: analysis.annotation_audit.candidates,
    visual_geometry_candidates: analysis.visual_outliers,
  }, null, 2)}\n`);
}
console.log(JSON.stringify({ output: outPath, ...analysis.summary }, null, 2));

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") { result.help = true; continue; }
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else { result[key] = next; index += 1; }
  }
  return result;
}
