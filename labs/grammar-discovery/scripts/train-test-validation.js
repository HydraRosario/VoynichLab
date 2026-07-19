import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(process.cwd(), args.out_dir ?? "out/current");
const trainFolios = new Set(String(args.train ?? "f1r,f1v,f47v").split(",").map((item) => item.trim()).filter(Boolean));
const testFolio = String(args.test ?? "f2r");
const molecules = readTsv(path.join(outDir, "molecules-current.tsv")).map((row) => ({
  ...row,
  tokens: tokens(row.signature),
}));

const train = molecules.filter((row) => trainFolios.has(row.folio));
const test = molecules.filter((row) => row.folio === testFolio);
const trainSignatures = signatureFrequencies(train);
const testSignatures = signatureFrequencies(test);
const trainSignatureMap = new Map(trainSignatures.map((row) => [row.signature, row]));
const testSignatureMap = new Map(testSignatures.map((row) => [row.signature, row]));

const substitutionRules = induceSubstitutionRules(trainSignatures);
const optionalRules = induceOptionalRules(trainSignatures);
const substitutionValidation = validateSubstitutionRules(substitutionRules, testSignatures);
const optionalValidation = validateOptionalRules(optionalRules, testSignatureMap);
const report = buildReport({
  train,
  test,
  trainFolios: [...trainFolios].sort(),
  testFolio,
  trainSignatures,
  testSignatures,
  substitutionValidation,
  optionalValidation,
});

writeTsv(path.join(outDir, "train-test-substitution-validation.tsv"), substitutionValidation, [
  "skeleton",
  "slot_index",
  "length",
  "train_total",
  "train_values",
  "test_total",
  "test_known",
  "test_new",
  "test_values",
  "test_examples",
]);
writeTsv(path.join(outDir, "train-test-optional-validation.tsv"), optionalValidation, [
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
]);
fs.writeFileSync(path.join(outDir, "TRAIN-TEST-VALIDATION.md"), report, "utf8");

console.log(`Wrote ${path.join(outDir, "TRAIN-TEST-VALIDATION.md")}`);

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

function signatureFrequencies(rows) {
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.signature)) {
      grouped.set(row.signature, {
        signature: row.signature,
        tokens: row.tokens,
        count: 0,
        folios: new Set(),
        examples: [],
      });
    }
    const entry = grouped.get(row.signature);
    entry.count += 1;
    entry.folios.add(row.folio);
    if (entry.examples.length < 8) entry.examples.push(row.molecule_uid);
  }
  return [...grouped.values()]
    .map((entry) => ({
      signature: entry.signature,
      tokens: entry.tokens,
      count: entry.count,
      folios: [...entry.folios].sort().join(","),
      example_molecules: entry.examples.join(" "),
    }))
    .sort((a, b) => b.count - a.count || a.signature.localeCompare(b.signature));
}

function induceSubstitutionRules(signatures) {
  const bySkeleton = new Map();
  for (const signature of signatures) {
    for (let index = 0; index < signature.tokens.length; index += 1) {
      const skeletonTokens = [...signature.tokens];
      skeletonTokens[index] = "_";
      const skeleton = skeletonTokens.join(" ");
      const id = `${signature.tokens.length}\u0000${index}\u0000${skeleton}`;
      if (!bySkeleton.has(id)) {
        bySkeleton.set(id, {
          skeleton,
          slot_index: index + 1,
          zeroIndex: index,
          length: signature.tokens.length,
          train_total: 0,
          values: new Map(),
          examples: [],
        });
      }
      const rule = bySkeleton.get(id);
      rule.train_total += Number(signature.count);
      rule.values.set(signature.tokens[index], (rule.values.get(signature.tokens[index]) ?? 0) + Number(signature.count));
      if (rule.examples.length < 8) rule.examples.push(signature.signature);
    }
  }
  return [...bySkeleton.values()]
    .filter((rule) => rule.values.size >= 2 && rule.train_total >= 3)
    .sort((a, b) => b.train_total - a.train_total || b.values.size - a.values.size || a.skeleton.localeCompare(b.skeleton));
}

function validateSubstitutionRules(rules, testSignatures) {
  return rules.map((rule) => {
    const testValues = new Map();
    const examples = [];
    let testTotal = 0;
    let known = 0;
    let novel = 0;
    for (const signature of testSignatures) {
      if (signature.tokens.length !== rule.length) continue;
      if (!matchesSkeleton(signature.tokens, rule.skeleton, rule.zeroIndex)) continue;
      const value = signature.tokens[rule.zeroIndex];
      const count = Number(signature.count);
      testTotal += count;
      if (rule.values.has(value)) known += count;
      else novel += count;
      testValues.set(value, (testValues.get(value) ?? 0) + count);
      if (examples.length < 8) examples.push(`${signature.signature} (${count})`);
    }
    return {
      skeleton: rule.skeleton,
      slot_index: rule.slot_index,
      length: rule.length,
      train_total: rule.train_total,
      train_values: formatMap(rule.values),
      test_total: testTotal,
      test_known: known,
      test_new: novel,
      test_values: formatMap(testValues),
      test_examples: examples.join(" | "),
    };
  }).sort((a, b) => b.test_total - a.test_total || b.train_total - a.train_total || a.skeleton.localeCompare(b.skeleton));
}

function induceOptionalRules(signatures) {
  const signatureByText = new Map(signatures.map((signature) => [signature.signature, signature]));
  const rules = new Map();
  for (const expanded of signatures) {
    for (let index = 0; index < expanded.tokens.length; index += 1) {
      const skeletonTokens = expanded.tokens.filter((_, tokenIndex) => tokenIndex !== index);
      const skeleton = skeletonTokens.join(" ");
      const base = signatureByText.get(skeleton);
      if (!base) continue;
      const id = `${index}\u0000${skeleton}`;
      if (!rules.has(id)) {
        rules.set(id, {
          skeleton,
          optional_index: index + 1,
          zeroIndex: index,
          train_base_count: Number(base.count),
          train_expanded_count: 0,
          values: new Map(),
          examples: [],
        });
      }
      const rule = rules.get(id);
      const optionalValue = expanded.tokens[index];
      rule.train_expanded_count += Number(expanded.count);
      rule.values.set(optionalValue, (rule.values.get(optionalValue) ?? 0) + Number(expanded.count));
      if (rule.examples.length < 8) rule.examples.push(expanded.signature);
    }
  }
  return [...rules.values()]
    .filter((rule) => rule.train_base_count + rule.train_expanded_count >= 3)
    .sort((a, b) =>
      (b.train_base_count + b.train_expanded_count) - (a.train_base_count + a.train_expanded_count)
      || a.skeleton.localeCompare(b.skeleton)
    );
}

function validateOptionalRules(rules, testSignatureMap) {
  return rules.map((rule) => {
    const base = testSignatureMap.get(rule.skeleton);
    const testValues = new Map();
    const examples = [];
    let expandedKnown = 0;
    let expandedNew = 0;
    for (const signature of testSignatureMap.values()) {
      if (signature.tokens.length !== tokens(rule.skeleton).length + 1) continue;
      const removed = [...signature.tokens];
      const optional = removed.splice(rule.zeroIndex, 1)[0];
      if (removed.join(" ") !== rule.skeleton) continue;
      const count = Number(signature.count);
      if (rule.values.has(optional)) expandedKnown += count;
      else expandedNew += count;
      testValues.set(optional, (testValues.get(optional) ?? 0) + count);
      if (examples.length < 8) examples.push(`${signature.signature} (${count})`);
    }
    return {
      skeleton: rule.skeleton,
      optional_index: rule.optional_index,
      train_base_count: rule.train_base_count,
      train_expanded_count: rule.train_expanded_count,
      train_optional_values: formatMap(rule.values),
      test_base_count: base ? Number(base.count) : 0,
      test_expanded_known: expandedKnown,
      test_expanded_new: expandedNew,
      test_optional_values: formatMap(testValues),
      test_examples: examples.join(" | "),
    };
  }).sort((a, b) =>
    (b.test_base_count + b.test_expanded_known + b.test_expanded_new) -
      (a.test_base_count + a.test_expanded_known + a.test_expanded_new)
    || (b.train_base_count + b.train_expanded_count) - (a.train_base_count + a.train_expanded_count)
    || a.skeleton.localeCompare(b.skeleton)
  );
}

function buildReport(data) {
  const trainUnique = data.trainSignatures.length;
  const testUnique = data.testSignatures.length;
  const substitutionHits = data.substitutionValidation.filter((row) => Number(row.test_total) > 0);
  const substitutionCleanHits = substitutionHits.filter((row) => Number(row.test_new) === 0);
  const optionalHits = data.optionalValidation.filter((row) =>
    Number(row.test_base_count) + Number(row.test_expanded_known) + Number(row.test_expanded_new) > 0
  );
  const mainOptional = data.optionalValidation.find((row) =>
    row.skeleton === "e:1 c:1 h:2 e:1 f:1 f:1 i:1 d:1" && row.train_optional_values.includes("k:1") && row.train_optional_values.includes("l:1")
  );
  const mainSubstitution = data.substitutionValidation.find((row) =>
    row.skeleton === "e:1 c:1 h:2 e:1 f:1 _ f:1 i:1 d:1"
  );

  const lines = [];
  lines.push("# Train/Test Grammar Validation");
  lines.push("");
  lines.push(`Purpose: induce molecule families without \`${data.testFolio}\`, then test whether \`${data.testFolio}\` reuses the same restricted structures.`);
  lines.push("");
  lines.push("## Split");
  lines.push("");
  lines.push(`- Train folios: \`${data.trainFolios.join(",")}\`.`);
  lines.push(`- Test folio: \`${data.testFolio}\`.`);
  lines.push(`- Train molecules: \`${data.train.length}\`; unique signatures: \`${trainUnique}\`.`);
  lines.push(`- Test molecules: \`${data.test.length}\`; unique signatures: \`${testUnique}\`.`);
  lines.push("");
  lines.push("## Validation Summary");
  lines.push("");
  lines.push(`- Substitution families induced in train: \`${data.substitutionValidation.length}\`.`);
  lines.push(`- Substitution families observed in test: \`${substitutionHits.length}\`.`);
  lines.push(`- Substitution families observed in test without new slot values: \`${substitutionCleanHits.length}\`.`);
  lines.push(`- Optional families induced in train: \`${data.optionalValidation.length}\`.`);
  lines.push(`- Optional families with base or expansion observed in test: \`${optionalHits.length}\`.`);
  lines.push("");
  lines.push("## Priority Family A");
  lines.push("");
  if (mainOptional) {
    lines.push("Candidate productive optional-slot family:");
    lines.push("");
    lines.push("```text");
    lines.push("e:1 c:1 h:2 e:1 f:1 X f:1 i:1 d:1");
    lines.push("X in {empty, k:1, l:1}");
    lines.push("```");
    lines.push("");
    lines.push(`- Train base count, X=empty: \`${mainOptional.train_base_count}\`.`);
    lines.push(`- Train expanded count: \`${mainOptional.train_expanded_count}\`; values: \`${mainOptional.train_optional_values}\`.`);
    lines.push(`- Test base count, X=empty: \`${mainOptional.test_base_count}\`.`);
    lines.push(`- Test expanded known values: \`${mainOptional.test_expanded_known}\`; values: \`${mainOptional.test_optional_values || "none"}\`.`);
    lines.push(`- Test expanded new values: \`${mainOptional.test_expanded_new}\`.`);
    lines.push(`- Test examples: \`${mainOptional.test_examples || "none"}\`.`);
  } else {
    lines.push("Priority optional family A was not induced from train under current thresholds.");
  }
  if (mainSubstitution) {
    lines.push("");
    lines.push("Same frame as pure substitution among expanded forms:");
    lines.push("");
    lines.push(`- Train values: \`${mainSubstitution.train_values}\`.`);
    lines.push(`- Test matches: \`${mainSubstitution.test_total}\`; known=\`${mainSubstitution.test_known}\`; new=\`${mainSubstitution.test_new}\`.`);
    lines.push(`- Test values: \`${mainSubstitution.test_values || "none"}\`.`);
  }
  lines.push("");
  lines.push("## Top Substitution Families Validated In Test");
  lines.push("");
  lines.push("| Test Total | Known | New | Train Total | Slot | Skeleton | Train Values | Test Values |");
  lines.push("| ---: | ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const row of substitutionHits.slice(0, 25)) {
    lines.push(`| ${row.test_total} | ${row.test_known} | ${row.test_new} | ${row.train_total} | ${row.slot_index} | \`${row.skeleton}\` | \`${row.train_values}\` | \`${row.test_values}\` |`);
  }
  lines.push("");
  lines.push("## Top Optional Families Seen In Test");
  lines.push("");
  lines.push("| Test Base | Test Known Expansions | Test New Expansions | Train Base | Train Expanded | Optional Index | Skeleton | Train Values | Test Values |");
  lines.push("| ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const row of optionalHits.slice(0, 25)) {
    lines.push(`| ${row.test_base_count} | ${row.test_expanded_known} | ${row.test_expanded_new} | ${row.train_base_count} | ${row.train_expanded_count} | ${row.optional_index} | \`${row.skeleton}\` | \`${row.train_optional_values}\` | \`${row.test_optional_values}\` |`);
  }
  lines.push("");
  lines.push("## Reading");
  lines.push("");
  lines.push(`- A clean test hit means \`${data.testFolio}\` matched a train-induced frame and used only slot values already seen in train.`);
  lines.push("- A new test value is not automatically bad; it may be productive grammar, but it is weaker as validation.");
  lines.push("- Optional rules with repeated identical tokens can overcount insertion positions; these remain raw candidates until run-length normalization is added.");
  lines.push("");
  lines.push("## Source Files");
  lines.push("");
  lines.push("- `train-test-substitution-validation.tsv`");
  lines.push("- `train-test-optional-validation.tsv`");
  lines.push("");
  return lines.join("\n");
}

function matchesSkeleton(candidateTokens, skeleton, slotIndex) {
  const skeletonTokens = tokens(skeleton);
  if (candidateTokens.length !== skeletonTokens.length) return false;
  for (let index = 0; index < skeletonTokens.length; index += 1) {
    if (index === slotIndex) continue;
    if (candidateTokens[index] !== skeletonTokens[index]) return false;
  }
  return true;
}

function formatMap(map) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([token, count]) => `${token}:${count}`)
    .join(" ");
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

function writeTsv(filePath, rows, fields) {
  fs.writeFileSync(
    filePath,
    [fields.join("\t"), ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t"))].join("\n") + "\n",
    "utf8"
  );
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function tokens(signature) {
  return String(signature ?? "").trim().split(/\s+/).filter(Boolean);
}
