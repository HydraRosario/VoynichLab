import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const labRoot = process.cwd();
const outDir = path.resolve(labRoot, args.out_dir ?? "out/current");
const freezeDir = path.resolve(labRoot, args.freeze_dir ?? "frozen/GRAMMAR-V1-2026-07-13");

const substitution = readTsv(path.join(outDir, "train-test-substitution-validation.tsv"));
const optional = readTsv(path.join(outDir, "train-test-optional-validation.tsv"));
const molecules = readTsv(path.join(outDir, "molecules-current.tsv"));
const grammarReport = fs.readFileSync(path.join(outDir, "GRAMMAR-DISCOVERY-REPORT.md"), "utf8");
const validationReport = fs.readFileSync(path.join(outDir, "TRAIN-TEST-VALIDATION.md"), "utf8");

const familyA = optional.find((row) =>
  row.skeleton === "e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1" &&
  row.train_optional_values.includes("k:1") &&
  row.train_optional_values.includes("l:1")
);
const familyASubstitution = substitution.find((row) =>
  row.skeleton === "e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1"
);

fs.mkdirSync(freezeDir, { recursive: true });
copy(path.join(outDir, "molecules-current.tsv"), path.join(freezeDir, "molecules-current.tsv"));
copy(path.join(outDir, "signature-frequencies.tsv"), path.join(freezeDir, "signature-frequencies.tsv"));
copy(path.join(outDir, "slot-families.tsv"), path.join(freezeDir, "slot-families.tsv"));
copy(path.join(outDir, "optional-families.tsv"), path.join(freezeDir, "optional-families.tsv"));
copy(path.join(outDir, "train-test-substitution-validation.tsv"), path.join(freezeDir, "grammar-v1-substitution-families.tsv"));
copy(path.join(outDir, "train-test-optional-validation.tsv"), path.join(freezeDir, "grammar-v1-optional-families.tsv"));
fs.writeFileSync(path.join(freezeDir, "GRAMMAR-DISCOVERY-REPORT.md"), grammarReport, "utf8");
fs.writeFileSync(path.join(freezeDir, "TRAIN-TEST-VALIDATION.md"), validationReport, "utf8");
fs.writeFileSync(path.join(freezeDir, "FAMILY-A.md"), buildFamilyA(), "utf8");
fs.writeFileSync(path.join(freezeDir, "MANIFEST.md"), buildManifest(), "utf8");

console.log(`Wrote ${freezeDir}`);

function buildManifest() {
  const trainMolecules = molecules.filter((row) => ["f1r", "f1v", "f47v"].includes(row.folio));
  const testMolecules = molecules.filter((row) => row.folio === "f2r");
  const substitutionObserved = substitution.filter((row) => Number(row.test_total) > 0);
  const substitutionClean = substitutionObserved.filter((row) => Number(row.test_new) === 0);
  const optionalObserved = optional.filter((row) =>
    Number(row.test_base_count) + Number(row.test_expanded_known) + Number(row.test_expanded_new) > 0
  );
  const lines = [];
  lines.push("# GRAMMAR-V1 Manifest");
  lines.push("");
  lines.push("Frozen grammar candidate snapshot for the first molecular train/test validation.");
  lines.push("");
  lines.push("## Freeze");
  lines.push("");
  lines.push("- Freeze name: `GRAMMAR-V1-2026-07-13`.");
  lines.push("- Train folios: `f1r,f1v,f47v`.");
  lines.push("- Held-out test folio: `f2r`.");
  lines.push("- Alphabet source: ATOMS V1, after `v1-validation-f2r`.");
  lines.push("- Scope: molecule signatures, substitution slots, optional slots.");
  lines.push("");
  lines.push("## Corpus");
  lines.push("");
  lines.push(`- Total molecules: \`${molecules.length}\`.`);
  lines.push(`- Train molecules: \`${trainMolecules.length}\`.`);
  lines.push(`- Test molecules: \`${testMolecules.length}\`.`);
  lines.push("");
  lines.push("## Frozen Families");
  lines.push("");
  lines.push(`- Substitution families induced in train: \`${substitution.length}\`.`);
  lines.push(`- Substitution families observed in test: \`${substitutionObserved.length}\`.`);
  lines.push(`- Substitution families observed in test with no new slot values: \`${substitutionClean.length}\`.`);
  lines.push(`- Optional families induced in train: \`${optional.length}\`.`);
  lines.push(`- Optional families with base or expansion observed in test: \`${optionalObserved.length}\`.`);
  lines.push("");
  lines.push("## Priority Family A");
  lines.push("");
  lines.push("```text");
  lines.push("e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1");
  lines.push("X in {empty, k:1, l:1}");
  lines.push("```");
  lines.push("");
  if (familyA) {
    lines.push(`- Train base count, X=empty: \`${familyA.train_base_count}\`.`);
    lines.push(`- Train expansions: \`${familyA.train_expanded_count}\`; values: \`${familyA.train_optional_values}\`.`);
    lines.push(`- Test base count, X=empty: \`${familyA.test_base_count}\`.`);
    lines.push(`- Test known expansions: \`${familyA.test_expanded_known}\`; values: \`${familyA.test_optional_values}\`.`);
    lines.push(`- Test new expansions: \`${familyA.test_expanded_new}\`.`);
  }
  if (familyASubstitution) {
    lines.push(`- Expanded-frame train slot values: \`${familyASubstitution.train_values}\`.`);
    lines.push(`- Expanded-frame test slot values: \`${familyASubstitution.test_values}\`; new=\`${familyASubstitution.test_new}\`.`);
  }
  lines.push("");
  lines.push("## Scientific Reading");
  lines.push("");
  lines.push("- This freeze does not claim translation, words, morphemes, or full Voynich grammar.");
  lines.push("- It freezes a formal claim: train-induced molecular frames with restricted slots reappeared in a held-out folio.");
  lines.push("- Future pages should be evaluated against these frozen families before being used to revise them.");
  lines.push("");
  lines.push("## Files");
  lines.push("");
  lines.push("- `grammar-v1-substitution-families.tsv`");
  lines.push("- `grammar-v1-optional-families.tsv`");
  lines.push("- `FAMILY-A.md`");
  lines.push("- `TRAIN-TEST-VALIDATION.md`");
  lines.push("- `GRAMMAR-DISCOVERY-REPORT.md`");
  lines.push("- `molecules-current.tsv`");
  lines.push("- `signature-frequencies.tsv`");
  lines.push("- `slot-families.tsv`");
  lines.push("- `optional-families.tsv`");
  lines.push("");
  return lines.join("\n");
}

function buildFamilyA() {
  const lines = [];
  lines.push("# Priority Family A");
  lines.push("");
  lines.push("Frozen molecular frame:");
  lines.push("");
  lines.push("```text");
  lines.push("e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1");
  lines.push("X in {empty, k:1, l:1}");
  lines.push("```");
  lines.push("");
  lines.push("## Optional-Slot Evidence");
  lines.push("");
  if (familyA) {
    lines.push("| Split | Empty/Base | Expanded Known | Expanded New | Values | Examples |");
    lines.push("| --- | ---: | ---: | ---: | --- | --- |");
    lines.push(`| Train | ${familyA.train_base_count} | ${familyA.train_expanded_count} | n/a | \`${familyA.train_optional_values}\` | n/a |`);
    lines.push(`| Test f2r | ${familyA.test_base_count} | ${familyA.test_expanded_known} | ${familyA.test_expanded_new} | \`${familyA.test_optional_values}\` | \`${familyA.test_examples}\` |`);
  }
  lines.push("");
  lines.push("## Substitution-Slot Evidence");
  lines.push("");
  if (familyASubstitution) {
    lines.push("| Split | Total | Known | New | Values | Examples |");
    lines.push("| --- | ---: | ---: | ---: | --- | --- |");
    lines.push(`| Train | ${familyASubstitution.train_total} | n/a | n/a | \`${familyASubstitution.train_values}\` | n/a |`);
    lines.push(`| Test f2r | ${familyASubstitution.test_total} | ${familyASubstitution.test_known} | ${familyASubstitution.test_new} | \`${familyASubstitution.test_values}\` | \`${familyASubstitution.test_examples}\` |`);
  }
  lines.push("");
  lines.push("## Claim");
  lines.push("");
  lines.push("Family A is a candidate productive molecular construction because it was induced without `f2r`, then `f2r` reused the same frame with only train-observed slot values.");
  lines.push("");
  return lines.join("\n");
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2).replaceAll("-", "_");
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[name] = true;
    } else {
      result[name] = next;
      index += 1;
    }
  }
  return result;
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

function copy(from, to) {
  fs.copyFileSync(from, to);
}
