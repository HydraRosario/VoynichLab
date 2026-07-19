import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(process.cwd(), args.out_dir ?? "out/current");
const moleculesPath = path.join(outDir, "molecules-current.tsv");
const molecules = readTsv(moleculesPath).map((row) => ({
  ...row,
  tokens: tokens(row.signature),
}));

const signatures = signatureFrequencies(molecules);
const slotFamilies = substitutionFamilies(signatures);
const optionalFamiliesRows = optionalFamilies(signatures);
const report = buildReport(molecules, signatures, slotFamilies, optionalFamiliesRows);

writeTsv(path.join(outDir, "signature-frequencies.tsv"), signatures, [
  "signature",
  "count",
  "atom_count",
  "folios",
  "folio_count",
  "images",
  "example_molecules",
]);
writeTsv(path.join(outDir, "slot-families.tsv"), slotFamilies, [
  "skeleton",
  "slot_index",
  "length",
  "total_count",
  "variant_count",
  "slot_values",
  "folios",
  "example_signatures",
]);
writeTsv(path.join(outDir, "optional-families.tsv"), optionalFamiliesRows, [
  "skeleton",
  "optional_index",
  "base_count",
  "expanded_count",
  "total_count",
  "optional_values",
  "folios",
  "example_expansions",
]);
fs.writeFileSync(path.join(outDir, "GRAMMAR-DISCOVERY-REPORT.md"), report, "utf8");

console.log(`Wrote ${path.join(outDir, "GRAMMAR-DISCOVERY-REPORT.md")}`);
console.log(`Found ${slotFamilies.length} substitution slot families and ${optionalFamiliesRows.length} optional-slot families.`);

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
        images: new Set(),
        examples: [],
      });
    }
    const entry = grouped.get(row.signature);
    entry.count += 1;
    entry.folios.add(row.folio);
    entry.images.add(row.image_name);
    if (entry.examples.length < 8) entry.examples.push(row.molecule_uid);
  }
  return [...grouped.values()]
    .map((entry) => ({
      signature: entry.signature,
      tokens: entry.tokens,
      count: entry.count,
      atom_count: entry.tokens.length,
      folios: [...entry.folios].sort().join(","),
      folio_count: entry.folios.size,
      images: [...entry.images].sort().join(","),
      example_molecules: entry.examples.join(" "),
    }))
    .sort((a, b) => b.count - a.count || b.folio_count - a.folio_count || a.signature.localeCompare(b.signature));
}

function substitutionFamilies(signatures) {
  const bySkeleton = new Map();
  for (const signature of signatures) {
    for (let index = 0; index < signature.tokens.length; index += 1) {
      const skeletonTokens = [...signature.tokens];
      skeletonTokens[index] = "_";
      const skeleton = skeletonTokens.join(" ");
      const key = `${signature.tokens.length}\u0000${index}\u0000${skeleton}`;
      if (!bySkeleton.has(key)) {
        bySkeleton.set(key, {
          skeleton,
          slot_index: index + 1,
          length: signature.tokens.length,
          total_count: 0,
          variants: new Map(),
          folios: new Set(),
          examples: [],
        });
      }
      const family = bySkeleton.get(key);
      family.total_count += Number(signature.count);
      family.folios = unionInto(family.folios, signature.folios.split(",").filter(Boolean));
      family.variants.set(signature.tokens[index], (family.variants.get(signature.tokens[index]) ?? 0) + Number(signature.count));
      if (family.examples.length < 8) family.examples.push(signature.signature);
    }
  }

  return [...bySkeleton.values()]
    .filter((family) => family.variants.size >= 2 && family.total_count >= 3)
    .map((family) => ({
      skeleton: family.skeleton,
      slot_index: family.slot_index,
      length: family.length,
      total_count: family.total_count,
      variant_count: family.variants.size,
      slot_values: [...family.variants.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([token, count]) => `${token}:${count}`)
        .join(" "),
      folios: [...family.folios].sort().join(","),
      example_signatures: family.examples.join(" | "),
    }))
    .sort((a, b) =>
      b.folios.split(",").filter(Boolean).length - a.folios.split(",").filter(Boolean).length
      || b.total_count - a.total_count
      || b.variant_count - a.variant_count
      || a.skeleton.localeCompare(b.skeleton)
    );
}

function optionalFamilies(signatures) {
  const signatureByText = new Map(signatures.map((signature) => [signature.signature, signature]));
  const families = new Map();
  for (const expanded of signatures) {
    for (let index = 0; index < expanded.tokens.length; index += 1) {
      const skeletonTokens = expanded.tokens.filter((_, tokenIndex) => tokenIndex !== index);
      const skeleton = skeletonTokens.join(" ");
      const base = signatureByText.get(skeleton);
      if (!base) continue;
      const optional = expanded.tokens[index];
      const key = `${index}\u0000${skeleton}`;
      if (!families.has(key)) {
        families.set(key, {
          skeleton,
          optional_index: index + 1,
          base_count: Number(base.count),
          expanded_count: 0,
          optionalValues: new Map(),
          folios: new Set(base.folios.split(",").filter(Boolean)),
          examples: [],
        });
      }
      const family = families.get(key);
      family.expanded_count += Number(expanded.count);
      family.optionalValues.set(optional, (family.optionalValues.get(optional) ?? 0) + Number(expanded.count));
      family.folios = unionInto(family.folios, expanded.folios.split(",").filter(Boolean));
      if (family.examples.length < 8) family.examples.push(expanded.signature);
    }
  }

  return [...families.values()]
    .filter((family) => family.base_count + family.expanded_count >= 3)
    .map((family) => ({
      skeleton: family.skeleton,
      optional_index: family.optional_index,
      base_count: family.base_count,
      expanded_count: family.expanded_count,
      total_count: family.base_count + family.expanded_count,
      optional_values: [...family.optionalValues.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([token, count]) => `${token}:${count}`)
        .join(" "),
      folios: [...family.folios].sort().join(","),
      example_expansions: family.examples.join(" | "),
    }))
    .sort((a, b) =>
      b.folios.split(",").filter(Boolean).length - a.folios.split(",").filter(Boolean).length
      || b.total_count - a.total_count
      || a.skeleton.localeCompare(b.skeleton)
    );
}

function buildReport(molecules, signatures, slotFamilies, optionalFamiliesRows) {
  const folioCounts = countBy(molecules, (row) => row.folio);
  const repeated = signatures.filter((row) => Number(row.count) > 1);
  const crossFolio = signatures.filter((row) => Number(row.folio_count) > 1);
  const lines = [];
  lines.push("# Grammar Discovery Report");
  lines.push("");
  lines.push("Purpose: move from local ATOMS relations to candidate generative molecule structure.");
  lines.push("");
  lines.push("## Corpus");
  lines.push("");
  lines.push(`- Molecules: \`${molecules.length}\`.`);
  lines.push(`- Unique signatures: \`${signatures.length}\`.`);
  lines.push(`- Repeated signatures: \`${repeated.length}\`.`);
  lines.push(`- Cross-folio signatures: \`${crossFolio.length}\`.`);
  lines.push(`- Folio counts: ${Object.entries(folioCounts).map(([folio, count]) => `\`${folio}=${count}\``).join(", ")}.`);
  lines.push("");
  lines.push("## Most Frequent Exact Molecules");
  lines.push("");
  lines.push("| Count | Folios | Signature | Examples |");
  lines.push("| ---: | --- | --- | --- |");
  for (const row of signatures.slice(0, 20)) {
    lines.push(`| ${row.count} | \`${row.folios}\` | \`${row.signature}\` | \`${row.example_molecules}\` |`);
  }
  lines.push("");
  lines.push("## Strongest Substitution Slots");
  lines.push("");
  lines.push("These families share every token except one slot.");
  lines.push("");
  lines.push("| Total | Variants | Slot | Skeleton | Values | Folios |");
  lines.push("| ---: | ---: | ---: | --- | --- | --- |");
  for (const row of slotFamilies.slice(0, 30)) {
    lines.push(`| ${row.total_count} | ${row.variant_count} | ${row.slot_index} | \`${row.skeleton}\` | \`${row.slot_values}\` | \`${row.folios}\` |`);
  }
  lines.push("");
  lines.push("## Strongest Optional Slots");
  lines.push("");
  lines.push("These families have an observed base form and observed one-token expansion.");
  lines.push("");
  lines.push("| Total | Base | Expanded | Optional Index | Skeleton | Optional Values | Folios |");
  lines.push("| ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const row of optionalFamiliesRows.slice(0, 30)) {
    lines.push(`| ${row.total_count} | ${row.base_count} | ${row.expanded_count} | ${row.optional_index} | \`${row.skeleton}\` | \`${row.optional_values}\` | \`${row.folios}\` |`);
  }
  lines.push("");
  lines.push("## Reading");
  lines.push("");
  lines.push("- Exact repetition is not the main target; productive variation is.");
  lines.push("- Substitution-slot rows are candidate paradigms: a shared molecule frame with a constrained variable position.");
  lines.push("- Optional-slot rows are candidate transformations: a base molecule plus a recurrent inserted operator.");
  lines.push("- The next step is train/test grammar induction: induce candidates without `f2r`, then test whether `f2r` contains predicted slot values and expansions.");
  lines.push("");
  lines.push("## Source Files");
  lines.push("");
  lines.push("- `molecules-current.tsv`");
  lines.push("- `signature-frequencies.tsv`");
  lines.push("- `slot-families.tsv`");
  lines.push("- `optional-families.tsv`");
  lines.push("");
  return lines.join("\n");
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

function unionInto(set, values) {
  for (const value of values) set.add(value);
  return set;
}

function countBy(values, keyFn) {
  const counts = {};
  for (const value of values) {
    const key = keyFn(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
