import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const freezeDir = path.resolve(root, args.freeze_dir ?? "frozen/GRAMMAR-V1-2026-07-13");
const outDir = path.resolve(root, args.out_dir ?? "out/grammar-v1-vs-f2v");
const moleculesPath = path.resolve(root, args.molecules ?? "out/current/molecules-current.tsv");
const testFolio = String(args.test ?? "f2v");

const substitutionRules = readTsv(path.join(freezeDir, "grammar-v1-substitution-families.tsv")).map((row) => ({
  ...row,
  skeletonTokens: tokens(row.skeleton),
  slotIndex: Number(row.slot_index),
  knownValues: valueSet(row.train_values),
}));
const optionalRules = readTsv(path.join(freezeDir, "grammar-v1-optional-families.tsv")).map((row) => ({
  ...row,
  skeletonTokens: tokens(row.skeleton),
  optionalIndex: Number(row.optional_index),
  knownValues: valueSet(row.train_optional_values),
}));
const molecules = readTsv(moleculesPath).filter((row) => row.folio === testFolio).map((row) => ({
  ...row,
  tokens: tokens(row.signature),
}));

const signatureCounts = countBy(molecules, (row) => row.signature);
const substitutionRows = validateSubstitutionRules(substitutionRules, signatureCounts);
const optionalRows = validateOptionalRules(optionalRules, signatureCounts);
const familyA = summarizeFamilyA(substitutionRows, optionalRows);

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, `grammar-v1-vs-${testFolio}-substitution.tsv`), substitutionRows, [
  "skeleton",
  "slot_index",
  "train_total",
  "train_values",
  "test_total",
  "test_known",
  "test_new",
  "test_values",
  "test_examples",
  "contradiction",
]);
writeTsv(path.join(outDir, `grammar-v1-vs-${testFolio}-optional.tsv`), optionalRows, [
  "skeleton",
  "optional_index",
  "train_base_count",
  "train_expanded_count",
  "train_optional_values",
  "test_base_count",
  "test_expanded_known",
  "test_expanded_new",
  "test_optional_values",
  "test_examples",
  "contradiction",
]);
fs.writeFileSync(path.join(outDir, `GRAMMAR-V1-vs-${testFolio}.md`), renderReport(), "utf8");

console.log(`Wrote ${path.join(outDir, `GRAMMAR-V1-vs-${testFolio}.md`)}`);

function validateSubstitutionRules(rules, signatures) {
  return rules.map((rule) => {
    const valueCounts = new Map();
    const examples = [];
    let testTotal = 0;
    let testKnown = 0;
    let testNew = 0;

    for (const [signature, count] of signatures.entries()) {
      const sigTokens = tokens(signature);
      if (sigTokens.length !== rule.skeletonTokens.length) continue;
      const slotValue = substitutionSlotValue(rule.skeletonTokens, sigTokens, rule.slotIndex);
      if (!slotValue) continue;
      testTotal += count;
      valueCounts.set(slotValue, (valueCounts.get(slotValue) ?? 0) + count);
      if (rule.knownValues.has(slotValue)) {
        testKnown += count;
      } else {
        testNew += count;
      }
      examples.push(`${signature} (${count})`);
    }

    return {
      skeleton: rule.skeleton,
      slot_index: rule.slot_index,
      train_total: rule.train_total,
      train_values: rule.train_values,
      test_total: testTotal,
      test_known: testKnown,
      test_new: testNew,
      test_values: formatCounts(valueCounts),
      test_examples: examples.join(" | "),
      contradiction: testNew > 0 ? "new-slot-value" : "",
    };
  });
}

function validateOptionalRules(rules, signatures) {
  return rules.map((rule) => {
    const skeleton = rule.skeletonTokens.join(" ");
    const testBaseCount = signatures.get(skeleton) ?? 0;
    const valueCounts = new Map();
    const examples = [];
    let testKnown = 0;
    let testNew = 0;

    for (const [signature, count] of signatures.entries()) {
      const sigTokens = tokens(signature);
      const value = optionalValue(rule.skeletonTokens, sigTokens, rule.optionalIndex);
      if (!value) continue;
      valueCounts.set(value, (valueCounts.get(value) ?? 0) + count);
      if (rule.knownValues.has(value)) {
        testKnown += count;
      } else {
        testNew += count;
      }
      examples.push(`${signature} (${count})`);
    }

    return {
      skeleton: rule.skeleton,
      optional_index: rule.optional_index,
      train_base_count: rule.train_base_count,
      train_expanded_count: rule.train_expanded_count,
      train_optional_values: rule.train_optional_values,
      test_base_count: testBaseCount,
      test_expanded_known: testKnown,
      test_expanded_new: testNew,
      test_optional_values: formatCounts(valueCounts),
      test_examples: examples.join(" | "),
      contradiction: testNew > 0 ? "new-optional-value" : "",
    };
  });
}

function substitutionSlotValue(skeleton, sigTokens, slotIndex) {
  const slot = slotIndex - 1;
  if (slot < 0 || slot >= skeleton.length) return null;
  for (let index = 0; index < skeleton.length; index += 1) {
    if (index === slot) continue;
    if (skeleton[index] !== sigTokens[index]) return null;
  }
  return sigTokens[slot] || null;
}

function optionalValue(skeleton, sigTokens, optionalIndex) {
  const insertAt = optionalIndex - 1;
  if (insertAt < 0 || sigTokens.length !== skeleton.length + 1) return null;
  const before = sigTokens.slice(0, insertAt);
  const inserted = sigTokens[insertAt];
  const after = sigTokens.slice(insertAt + 1);
  const reconstructed = [...before, ...after];
  if (reconstructed.join(" ") !== skeleton.join(" ")) return null;
  return inserted || null;
}

function summarizeFamilyA(subRows, optRows) {
  const sub = subRows.find((row) => row.skeleton === "e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1");
  const opt = optRows.find((row) => row.skeleton === "e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1" && Number(row.optional_index) === 6);
  return { sub, opt };
}

function renderReport() {
  const observedSub = substitutionRows.filter((row) => Number(row.test_total) > 0);
  const cleanSub = observedSub.filter((row) => Number(row.test_new) === 0);
  const newSub = observedSub.filter((row) => Number(row.test_new) > 0);
  const observedOptional = optionalRows.filter((row) => Number(row.test_base_count) > 0 || Number(row.test_expanded_known) > 0 || Number(row.test_expanded_new) > 0);
  const cleanOptional = observedOptional.filter((row) => Number(row.test_expanded_new) === 0);
  const newOptional = observedOptional.filter((row) => Number(row.test_expanded_new) > 0);

  const lines = [];
  lines.push(`# GRAMMAR-V1 vs ${testFolio} Prospective Test`);
  lines.push("");
  lines.push("Purpose: evaluate the frozen `GRAMMAR-V1` families against a newly labeled folio without inducing new rules from it.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push(`- Frozen grammar: \`${path.relative(root, freezeDir)}\`.`);
  lines.push(`- Test folio: \`${testFolio}\`.`);
  lines.push(`- Test molecules: \`${molecules.length}\`; unique signatures: \`${signatureCounts.size}\`.`);
  lines.push(`- Frozen substitution families: \`${substitutionRules.length}\`.`);
  lines.push(`- Frozen optional families: \`${optionalRules.length}\`.`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Substitution families observed in \`${testFolio}\`: \`${observedSub.length}\` / \`${substitutionRules.length}\`.`);
  lines.push(`- Observed substitution families with only known slot values: \`${cleanSub.length}\` / \`${observedSub.length}\`.`);
  lines.push(`- Observed substitution families with new slot values: \`${newSub.length}\`.`);
  lines.push(`- Optional families with base or expansion observed in \`${testFolio}\`: \`${observedOptional.length}\` / \`${optionalRules.length}\`.`);
  lines.push(`- Optional families with observed expansions and no new optional values: \`${cleanOptional.length}\` / \`${observedOptional.length}\`.`);
  lines.push(`- Optional families with new optional values: \`${newOptional.length}\`.`);
  lines.push("");
  lines.push("## Priority Family A");
  lines.push("");
  lines.push("```text");
  lines.push("e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1");
  lines.push("X in {empty, k:1, l:1}");
  lines.push("```");
  lines.push("");
  if (familyA.opt) {
    lines.push(`- Base form X=empty in ${testFolio}: \`${familyA.opt.test_base_count}\`.`);
    lines.push(`- Known expansions in ${testFolio}: \`${familyA.opt.test_expanded_known}\`; values: \`${familyA.opt.test_optional_values || "(none)"}\`.`);
    lines.push(`- New expansions in ${testFolio}: \`${familyA.opt.test_expanded_new}\`.`);
  }
  if (familyA.sub) {
    lines.push(`- Expanded-frame substitution hits: \`${familyA.sub.test_total}\`; known=\`${familyA.sub.test_known}\`; new=\`${familyA.sub.test_new}\`; values: \`${familyA.sub.test_values || "(none)"}\`.`);
    lines.push(`- Examples: \`${familyA.sub.test_examples || "(none)"}\`.`);
  }
  lines.push("");
  lines.push("## Observed Substitution Families");
  lines.push("");
  pushSubstitutionTable(lines, observedSub);
  lines.push("");
  lines.push("## New Slot Values");
  lines.push("");
  pushSubstitutionTable(lines, newSub);
  lines.push("");
  lines.push("## Observed Optional Families");
  lines.push("");
  pushOptionalTable(lines, observedOptional);
  lines.push("");
  lines.push("## New Optional Values");
  lines.push("");
  pushOptionalTable(lines, newOptional);
  lines.push("");
  lines.push("## Source Files");
  lines.push("");
  lines.push(`- \`grammar-v1-vs-${testFolio}-substitution.tsv\``);
  lines.push(`- \`grammar-v1-vs-${testFolio}-optional.tsv\``);
  return lines.join("\n") + "\n";
}

function pushSubstitutionTable(lines, rows) {
  if (!rows.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Test Total | Known | New | Slot | Skeleton | Train Values | Test Values |");
  lines.push("| ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| ${row.test_total} | ${row.test_known} | ${row.test_new} | ${row.slot_index} | \`${row.skeleton}\` | \`${row.train_values}\` | \`${row.test_values}\` |`);
  }
}

function pushOptionalTable(lines, rows) {
  if (!rows.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Test Base | Known Expansions | New Expansions | Optional Index | Skeleton | Train Values | Test Values |");
  lines.push("| ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| ${row.test_base_count} | ${row.test_expanded_known} | ${row.test_expanded_new} | ${row.optional_index} | \`${row.skeleton}\` | \`${row.train_optional_values}\` | \`${row.test_optional_values}\` |`);
  }
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
  if (!lines.length) return [];
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function writeTsv(filePath, rows, fields) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => String(row[field] ?? "").replaceAll("\t", " ")).join("\t").trimEnd()),
  ].join("\n") + "\n", "utf8");
}

function tokens(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function valueSet(value) {
  return new Set(String(value ?? "").split(/\s+/).map((item) => item.split(":").slice(0, 2).join(":")).filter(Boolean));
}

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function formatCounts(counts) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => `${value}:${count}`)
    .join(" ");
}
