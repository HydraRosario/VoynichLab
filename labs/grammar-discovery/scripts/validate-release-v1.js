import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const node = process.execPath;
const freezeDir = "frozen/GRAMMAR-V1-2026-07-13";
const releaseDir = "frozen/REPRODUCIBLE-RELEASE-V1";
const outRoot = "out/reproducible-release-v1";

const tests = [
  {
    folio: "f2r",
    molecules: path.join(freezeDir, "molecules-current.tsv"),
    expectedObserved: 8,
    expectedClean: 8,
    expectedNew: 0,
  },
  {
    folio: "f2v",
    molecules: path.join(releaseDir, "f2v-molecules.tsv"),
    expectedObserved: 7,
    expectedClean: 7,
    expectedNew: 0,
  },
];

const summaries = [];
for (const test of tests) {
  const outDir = path.join(outRoot, test.folio);
  runValidation(test, outDir);
  const summary = summarize(test, outDir);
  summaries.push(summary);
  assertExpected(test, summary);
}

writeSummary(summaries);
console.log("");
console.log("REPRODUCIBLE-RELEASE-V1 validation passed.");
for (const summary of summaries) {
  console.log(`${summary.folio}: ${summary.substitutionClean}/${summary.substitutionObserved} observed substitution families clean; new slot values=${summary.substitutionNew}`);
}

function runValidation(test, outDir) {
  const result = spawnSync(node, [
    "scripts/validate-frozen-grammar.js",
    "--freeze-dir",
    freezeDir,
    "--molecules",
    test.molecules,
    "--test",
    test.folio,
    "--out-dir",
    outDir,
  ], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function summarize(test, outDir) {
  const substitutionRows = readTsv(path.join(outDir, `grammar-v1-vs-${test.folio}-substitution.tsv`));
  const optionalRows = readTsv(path.join(outDir, `grammar-v1-vs-${test.folio}-optional.tsv`));
  const observedSubstitution = substitutionRows.filter((row) => Number(row.test_total) > 0);
  const cleanSubstitution = observedSubstitution.filter((row) => Number(row.test_new) === 0);
  const newSubstitution = observedSubstitution.reduce((sum, row) => sum + Number(row.test_new || 0), 0);
  const observedOptional = optionalRows.filter((row) =>
    Number(row.test_base_count) > 0 ||
    Number(row.test_expanded_known) > 0 ||
    Number(row.test_expanded_new) > 0
  );
  const cleanOptional = observedOptional.filter((row) => Number(row.test_expanded_new) === 0);
  const newOptional = observedOptional.reduce((sum, row) => sum + Number(row.test_expanded_new || 0), 0);
  return {
    folio: test.folio,
    report: path.join(outDir, `GRAMMAR-V1-vs-${test.folio}.md`),
    substitutionObserved: observedSubstitution.length,
    substitutionClean: cleanSubstitution.length,
    substitutionNew: newSubstitution,
    optionalObserved: observedOptional.length,
    optionalClean: cleanOptional.length,
    optionalNew: newOptional,
  };
}

function assertExpected(test, summary) {
  const failures = [];
  if (summary.substitutionObserved !== test.expectedObserved) {
    failures.push(`expected ${test.expectedObserved} observed substitution families, got ${summary.substitutionObserved}`);
  }
  if (summary.substitutionClean !== test.expectedClean) {
    failures.push(`expected ${test.expectedClean} clean observed substitution families, got ${summary.substitutionClean}`);
  }
  if (summary.substitutionNew !== test.expectedNew) {
    failures.push(`expected ${test.expectedNew} new substitution slot values, got ${summary.substitutionNew}`);
  }
  if (failures.length) {
    console.error(`${test.folio} validation failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function writeSummary(summaries) {
  const lines = [];
  lines.push("# REPRODUCIBLE-RELEASE-V1 Validation Summary");
  lines.push("");
  lines.push(`Node: \`${process.version}\``);
  lines.push("");
  lines.push("| Test folio | Observed substitution families | Clean substitution families | New substitution slot values | Observed optional families | Clean optional families | New optional values |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const summary of summaries) {
    lines.push(`| \`${summary.folio}\` | ${summary.substitutionObserved} | ${summary.substitutionClean} | ${summary.substitutionNew} | ${summary.optionalObserved} | ${summary.optionalClean} | ${summary.optionalNew} |`);
  }
  lines.push("");
  lines.push("Generated reports:");
  for (const summary of summaries) {
    lines.push(`- \`${summary.report}\``);
  }
  fs.mkdirSync(path.join(root, outRoot), { recursive: true });
  fs.writeFileSync(path.join(root, outRoot, "VALIDATION-SUMMARY.md"), lines.join("\n") + "\n", "utf8");
}

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}
