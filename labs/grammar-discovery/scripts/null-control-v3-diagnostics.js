import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.resolve(root, "out/null-control-v3");
const trainFolios = new Set(["f1r", "f1v", "f47v"]);
const testFolios = ["f2r", "f2v"];
const frozenDir = path.resolve(root, "frozen/GRAMMAR-V1-2026-07-13");
const trainAndF2rPath = path.join(frozenDir, "molecules-current.tsv");
const f2vPath = path.resolve(root, "frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv");
const rulesPath = path.join(frozenDir, "grammar-v1-substitution-families.tsv");
const opportunitiesPath = path.join(outDir, "null-control-v3-opportunities.tsv");

const rules = readTsv(rulesPath).map((row, index) => ({
  ...row,
  familyId: `substitution-${String(index + 1).padStart(2, "0")}`,
  slotIndex: Number(row.slot_index),
  slot: Number(row.slot_index) - 1,
  skeletonTokens: tokens(row.skeleton),
}));

const trainRows = readTsv(trainAndF2rPath)
  .filter((row) => trainFolios.has(row.folio))
  .map(withTokens);
const testRows = [
  ...readTsv(trainAndF2rPath).filter((row) => row.folio === "f2r").map(withTokens),
  ...readTsv(f2vPath).filter((row) => row.folio === "f2v").map(withTokens),
];

let opportunities = fs.existsSync(opportunitiesPath) ? readTsv(opportunitiesPath) : [];
if (!opportunities.length) {
  opportunities = buildEvaluationOpportunities().map((row) => ({
    folio: row.folio,
    molecule_uid: row.molecule_uid,
    source_molecule_id: row.source_molecule_id,
    family_id: row.familyId,
    slot_index: row.slotIndex,
    observed_value: row.observedValue,
    local_context: row.localContext,
    frame_identity: row.frameIdentity,
    log_loss_difference: "",
  }));
}

const localTrain = trainGroups("local");
const frameTrain = trainGroups("frame");
const localHeldout = heldoutGroups("local_context");
const frameHeldout = heldoutGroups("frame_identity");

const localStats = groupStats(localTrain, localHeldout);
const frameStats = groupStats(frameTrain, frameHeldout);
const duplicateRows = findDuplicateRows(opportunities);
const repeatedPhysicalSlots = findRepeatedPhysicalSlots(opportunities);
const moleculesWithMultipleOpportunities = groupBy(opportunities, (row) => row.molecule_uid)
  .filter((group) => group.rows.length > 1);
const localToFamilies = familiesByKey(opportunities, "local_context");
const frameToFamilies = familiesByKey(opportunities, "frame_identity");
const deltaByFolio = aggregateDelta(opportunities, (row) => row.folio);
const deltaByFamily = aggregateDelta(opportunities, (row) => row.family_id);
const deltaByLocalContext = aggregateDelta(opportunities, (row) => row.local_context);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "NULL-CONTROL-V3-DIAGNOSTICS.md"), renderReport(), "utf8");
console.log(`Wrote ${path.relative(root, path.join(outDir, "NULL-CONTROL-V3-DIAGNOSTICS.md"))}`);

function trainGroups(kind) {
  const groups = new Map();
  for (const rule of rules) {
    for (const molecule of trainRows) {
      if (!matchesRule(rule, molecule.tokens)) continue;
      const key = kind === "local" ? localKey(rule, molecule.tokens) : frameKey(rule);
      const group = getGroup(groups, key);
      const value = molecule.tokens[rule.slot];
      group.total += 1;
      group.values.set(value, (group.values.get(value) ?? 0) + 1);
      group.families.add(rule.familyId);
    }
  }
  return groups;
}

function heldoutGroups(keyField) {
  const groups = new Map();
  for (const row of opportunities) {
    const key = row[keyField];
    const group = getGroup(groups, key);
    group.total += 1;
    group.values.set(row.observed_value, (group.values.get(row.observed_value) ?? 0) + 1);
    group.families.add(row.family_id);
  }
  return groups;
}

function groupStats(train, heldout) {
  const keys = [...new Set([...train.keys(), ...heldout.keys()])].sort();
  return keys.map((key) => {
    const trainGroup = train.get(key) ?? emptyGroup();
    const heldoutGroup = heldout.get(key) ?? emptyGroup();
    return {
      key,
      trainN: trainGroup.total,
      trainValues: formatCounts(trainGroup.values),
      heldoutN: heldoutGroup.total,
      heldoutValues: formatCounts(heldoutGroup.values),
      familyCount: new Set([...trainGroup.families, ...heldoutGroup.families]).size,
      families: [...new Set([...trainGroup.families, ...heldoutGroup.families])].sort().join(" "),
    };
  });
}

function buildEvaluationOpportunities() {
  const rows = [];
  for (const rule of rules) {
    for (const molecule of testRows) {
      if (!matchesRule(rule, molecule.tokens)) continue;
      rows.push({
        folio: molecule.folio,
        molecule_uid: molecule.molecule_uid,
        source_molecule_id: molecule.source_molecule_id,
        familyId: rule.familyId,
        slotIndex: rule.slotIndex,
        observedValue: molecule.tokens[rule.slot],
        localContext: localKey(rule, molecule.tokens),
        frameIdentity: frameKey(rule),
      });
    }
  }
  return rows;
}

function renderReport() {
  const lines = [];
  lines.push("# NULL-CONTROL-V3-DIAGNOSTICS");
  lines.push("");
  lines.push("Purpose: audit NULL-CONTROL-V3 without changing either model, smoothing, corpus, labels, or frozen family definitions.");
  lines.push("");
  lines.push("## Scope");
  lines.push("");
  lines.push("- Training folios: `f1r`, `f1v`, `f47v`.");
  lines.push("- Evaluation folios: `f2r`, `f2v`.");
  lines.push(`- Evaluated opportunities: \`${opportunities.length}\`.`);
  lines.push(`- Unique local-context keys in evaluation: \`${new Set(opportunities.map((row) => row.local_context)).size}\`.`);
  lines.push(`- Unique full-frame keys in evaluation: \`${new Set(opportunities.map((row) => row.frame_identity)).size}\`.`);
  lines.push(`- Unique frozen family IDs in evaluation: \`${new Set(opportunities.map((row) => row.family_id)).size}\`.`);
  lines.push("");
  lines.push("## Effective Training Support");
  lines.push("");
  pushSupportTable(lines, "Model A local-context keys", localStats);
  lines.push("");
  pushSupportTable(lines, "Model B full-frame keys", frameStats);
  lines.push("");
  lines.push("## Model A Local-Context Keys");
  lines.push("");
  pushGroupTable(lines, localStats);
  lines.push("");
  lines.push("## Model B Full-Frame Keys");
  lines.push("");
  pushGroupTable(lines, frameStats);
  lines.push("");
  lines.push("## Overlap And Duplication Checks");
  lines.push("");
  lines.push(`- Multiple frozen family IDs sharing the same Model A context: \`${localToFamilies.filter((entry) => entry.families.length > 1).length}\`.`);
  lines.push(`- Multiple frozen family IDs sharing the same full-frame key: \`${frameToFamilies.filter((entry) => entry.families.length > 1).length}\`.`);
  lines.push(`- Held-out molecules contributing more than one evaluated opportunity: \`${moleculesWithMultipleOpportunities.length}\`.`);
  lines.push(`- Duplicate opportunity rows: \`${duplicateRows.length}\`.`);
  lines.push(`- Repeated evaluation of the same physical slot (same molecule + slot index): \`${repeatedPhysicalSlots.length}\`.`);
  lines.push("");
  lines.push("### Shared Model A Contexts");
  lines.push("");
  pushFamiliesByKeyTable(lines, localToFamilies.filter((entry) => entry.families.length > 1));
  lines.push("");
  lines.push("### Shared Full-Frame Keys");
  lines.push("");
  pushFamiliesByKeyTable(lines, frameToFamilies.filter((entry) => entry.families.length > 1));
  lines.push("");
  lines.push("### Molecules With Multiple Opportunities");
  lines.push("");
  pushMoleculeOverlapTable(lines, moleculesWithMultipleOpportunities);
  lines.push("");
  lines.push("### Repeated Physical Slots");
  lines.push("");
  pushRepeatedSlotTable(lines, repeatedPhysicalSlots);
  lines.push("");
  lines.push("## Log-Loss Delta Decomposition");
  lines.push("");
  lines.push("Positive delta means Model B improves over Model A. Negative delta means Model B is worse.");
  lines.push("");
  lines.push("### By Folio");
  lines.push("");
  pushDeltaTable(lines, deltaByFolio);
  lines.push("");
  lines.push("### By Family");
  lines.push("");
  pushDeltaTable(lines, deltaByFamily);
  lines.push("");
  lines.push("### By Local Context");
  lines.push("");
  pushDeltaTable(lines, deltaByLocalContext);
  lines.push("");
  lines.push("### Individual Opportunities");
  lines.push("");
  pushOpportunityDeltaTable(lines, opportunities);
  lines.push("");
  lines.push("## Diagnostic Interpretation");
  lines.push("");
  lines.push(diagnosticInterpretation());
  return lines.join("\n") + "\n";
}

function pushSupportTable(lines, label, stats) {
  const observed = stats.filter((row) => row.heldoutN > 0);
  const trainNs = observed.map((row) => row.trainN).sort((a, b) => a - b);
  lines.push(`### ${label}`);
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Keys with held-out opportunities | ${observed.length} |`);
  lines.push(`| Median training N | ${median(trainNs)} |`);
  lines.push(`| Minimum training N | ${trainNs[0] ?? 0} |`);
  lines.push(`| Maximum training N | ${trainNs.at(-1) ?? 0} |`);
  lines.push(`| Keys with training N <= 2 | ${observed.filter((row) => row.trainN <= 2).length} |`);
  lines.push(`| Keys with training N <= 5 | ${observed.filter((row) => row.trainN <= 5).length} |`);
}

function pushGroupTable(lines, stats) {
  const rows = stats.filter((row) => row.heldoutN > 0);
  lines.push("| Key | Train N | Train values | Held-out N | Held-out values | Families |");
  lines.push("| --- | ---: | --- | ---: | --- | --- |");
  for (const row of rows) {
    lines.push(`| \`${row.key}\` | ${row.trainN} | \`${row.trainValues}\` | ${row.heldoutN} | \`${row.heldoutValues}\` | \`${row.families}\` |`);
  }
}

function pushFamiliesByKeyTable(lines, rows) {
  if (!rows.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Key | Families | Held-out rows |");
  lines.push("| --- | --- | ---: |");
  for (const row of rows) {
    lines.push(`| \`${row.key}\` | \`${row.families.join(" ")}\` | ${row.rows.length} |`);
  }
}

function pushMoleculeOverlapTable(lines, groups) {
  if (!groups.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Molecule | Folio | Opportunity count | Families / slots |");
  lines.push("| --- | --- | ---: | --- |");
  for (const group of groups) {
    const row = group.rows[0];
    const details = group.rows.map((item) => `${item.family_id}@${item.slot_index}`).join(" ");
    lines.push(`| \`${group.key}\` | \`${row.folio}\` | ${group.rows.length} | \`${details}\` |`);
  }
}

function pushRepeatedSlotTable(lines, groups) {
  if (!groups.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Molecule + slot | Opportunity count | Families |");
  lines.push("| --- | ---: | --- |");
  for (const group of groups) {
    lines.push(`| \`${group.key}\` | ${group.rows.length} | \`${group.rows.map((row) => row.family_id).join(" ")}\` |`);
  }
}

function pushDeltaTable(lines, rows) {
  lines.push("| Key | N | Mean delta | Sum delta |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const row of rows) {
    lines.push(`| \`${row.key}\` | ${row.count} | ${fmt(row.mean)} | ${fmt(row.sum)} |`);
  }
}

function pushOpportunityDeltaTable(lines, rows) {
  lines.push("| Folio | Molecule | Family | Slot | Observed | Local context | Delta |");
  lines.push("| --- | --- | --- | ---: | --- | --- | ---: |");
  for (const row of [...rows].sort((a, b) => Number(a.log_loss_difference) - Number(b.log_loss_difference))) {
    lines.push(`| \`${row.folio}\` | \`${row.molecule_uid}\` | \`${row.family_id}\` | ${row.slot_index} | \`${row.observed_value}\` | \`${row.local_context}\` | ${fmt(Number(row.log_loss_difference))} |`);
  }
}

function diagnosticInterpretation() {
  const sharedLocal = localToFamilies.filter((entry) => entry.families.length > 1).length;
  const repeatedSlots = repeatedPhysicalSlots.length;
  const aSupport = localStats.filter((row) => row.heldoutN > 0).map((row) => row.trainN);
  const bSupport = frameStats.filter((row) => row.heldoutN > 0).map((row) => row.trainN);
  const medianA = median(aSupport);
  const medianB = median(bSupport);
  const lines = [];
  lines.push(`Model A has median training support \`${medianA}\`; Model B has median training support \`${medianB}\`.`);
  if (medianB < medianA) {
    lines.push("This supports the fragmentation explanation: full-frame identity splits some evidence into narrower groups.");
  } else {
    lines.push("Support fragmentation is not obvious from the median support alone.");
  }
  if (sharedLocal > 0) {
    lines.push(`There are \`${sharedLocal}\` local contexts shared by multiple frozen families, so the local baseline can pool evidence that Model B separates.`);
  }
  if (repeatedSlots > 0) {
    lines.push(`There are \`${repeatedSlots}\` repeated physical-slot evaluations, so some held-out atoms are counted under more than one family definition.`);
  } else {
    lines.push("No repeated physical-slot evaluations were detected.");
  }
  return lines.join("\n\n");
}

function matchesRule(rule, sigTokens) {
  if (sigTokens.length !== rule.skeletonTokens.length) return false;
  for (let index = 0; index < rule.skeletonTokens.length; index += 1) {
    if (index === rule.slot) continue;
    if (rule.skeletonTokens[index] !== sigTokens[index]) return false;
  }
  return Boolean(sigTokens[rule.slot]);
}

function localKey(rule, sigTokens) {
  const left = rule.slot > 0 ? sigTokens[rule.slot - 1] : "START";
  const right = rule.slot < sigTokens.length - 1 ? sigTokens[rule.slot + 1] : "END";
  return [
    `length=${sigTokens.length}`,
    `role=${positionalRole(rule.slot, sigTokens.length)}`,
    `left=${left}`,
    `right=${right}`,
  ].join("|");
}

function frameKey(rule) {
  return [
    `slot=${rule.slotIndex}`,
    `skeleton=${rule.skeletonTokens.join(" ")}`,
  ].join("|");
}

function familiesByKey(rows, field) {
  return groupBy(rows, (row) => row[field]).map((group) => ({
    key: group.key,
    rows: group.rows,
    families: [...new Set(group.rows.map((row) => row.family_id))].sort(),
  }));
}

function aggregateDelta(rows, keyFn) {
  return groupBy(rows, keyFn).map((group) => {
    const deltas = group.rows.map((row) => Number(row.log_loss_difference)).filter(Number.isFinite);
    const sum = deltas.reduce((total, value) => total + value, 0);
    return {
      key: group.key,
      count: deltas.length,
      sum,
      mean: deltas.length ? sum / deltas.length : 0,
    };
  }).sort((a, b) => a.mean - b.mean || a.key.localeCompare(b.key));
}

function findDuplicateRows(rows) {
  return groupBy(rows, (row) => [
    row.folio,
    row.molecule_uid,
    row.family_id,
    row.slot_index,
    row.observed_value,
    row.local_context,
    row.frame_identity,
  ].join("|")).filter((group) => group.rows.length > 1);
}

function findRepeatedPhysicalSlots(rows) {
  return groupBy(rows, (row) => `${row.molecule_uid}|slot=${row.slot_index}`)
    .filter((group) => group.rows.length > 1);
}

function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.entries()]
    .map(([key, groupRows]) => ({ key, rows: groupRows }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

function getGroup(groups, key) {
  if (!groups.has(key)) groups.set(key, emptyGroup());
  return groups.get(key);
}

function emptyGroup() {
  return { total: 0, values: new Map(), families: new Set() };
}

function positionalRole(slot, length) {
  if (slot === 0) return "initial";
  if (slot === length - 1) return "final";
  return "medial";
}

function withTokens(row) {
  return { ...row, tokens: tokens(row.signature) };
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

function tokens(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function formatCounts(counts) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => `${value}:${count}`)
    .join(" ");
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function fmt(value) {
  if (!Number.isFinite(value)) return "Infinity";
  return value.toFixed(6);
}
