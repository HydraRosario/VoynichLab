import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const iterations = Number(args.iterations ?? 100000);
const seed = Number(args.seed ?? 20260713);
const outDir = path.resolve(root, args.out_dir ?? "out/null-control-v1");
const validationRoot = path.resolve(root, "out/reproducible-release-v1");

const tests = [
  {
    folio: "f2r",
    moleculesPath: path.resolve(root, "frozen/GRAMMAR-V1-2026-07-13/molecules-current.tsv"),
  },
  {
    folio: "f2v",
    moleculesPath: path.resolve(root, "frozen/REPRODUCIBLE-RELEASE-V1/f2v-molecules.tsv"),
  },
];

ensureValidationOutputs();

const folioResults = tests.map((test) => analyzeFolio(test));
const jointAnalytic = folioResults.reduce((product, result) => product * result.exactKnownAnalytic, 1);
const exactKnownSimulation = simulateExactKnown(folioResults, iterations, seed);
const sizeOnlySimulation = simulateSizeOnly(folioResults, iterations, seed + 1);

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "null-control-family-probabilities.tsv"), familyRows(folioResults), [
  "folio",
  "skeleton",
  "slot_index",
  "test_total",
  "known_values",
  "known_mass",
  "clean_probability",
]);
fs.writeFileSync(path.join(outDir, "NULL-CONTROL-V1.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "NULL-CONTROL-V1.md"))}`);
console.log(`Exact-known empirical null: ${exactKnownSimulation.hits}/${iterations} = ${formatProbability(exactKnownSimulation.probability)}`);
console.log(`Size-only empirical null: ${sizeOnlySimulation.hits}/${iterations} = ${formatProbability(sizeOnlySimulation.probability)}`);

function ensureValidationOutputs() {
  const node = process.execPath;
  const result = spawnSync(node, ["scripts/validate-release-v1.js"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function analyzeFolio(test) {
  const substitutionPath = path.join(validationRoot, test.folio, `grammar-v1-vs-${test.folio}-substitution.tsv`);
  const rows = readTsv(substitutionPath)
    .filter((row) => Number(row.test_total) > 0)
    .map((row) => ({
      ...row,
      test_total: Number(row.test_total),
      knownValues: valueSet(row.train_values),
    }));
  const distribution = atomDistribution(test.moleculesPath, test.folio);

  for (const row of rows) {
    row.knownMass = probabilityMass(distribution.probabilities, row.knownValues);
    row.cleanProbability = row.knownMass ** row.test_total;
  }

  return {
    folio: test.folio,
    observedFamilies: rows.length,
    observedOpportunities: rows.reduce((sum, row) => sum + row.test_total, 0),
    exactKnownAnalytic: rows.reduce((product, row) => product * row.cleanProbability, 1),
    distribution,
    rows,
  };
}

function simulateExactKnown(results, count, initialSeed) {
  const rng = mulberry32(initialSeed);
  let hits = 0;
  for (let iteration = 0; iteration < count; iteration += 1) {
    let clean = true;
    for (const result of results) {
      for (const row of result.rows) {
        for (let draw = 0; draw < row.test_total; draw += 1) {
          if (!row.knownValues.has(sample(result.distribution.weightedAtoms, rng))) {
            clean = false;
            break;
          }
        }
        if (!clean) break;
      }
      if (!clean) break;
    }
    if (clean) hits += 1;
  }
  return { hits, probability: hits / count };
}

function simulateSizeOnly(results, count, initialSeed) {
  const rng = mulberry32(initialSeed);
  let hits = 0;
  for (let iteration = 0; iteration < count; iteration += 1) {
    let clean = true;
    for (const result of results) {
      for (const row of result.rows) {
        const randomKnown = sampleUniqueWeighted(result.distribution.weightedAtoms, row.knownValues.size, rng);
        for (let draw = 0; draw < row.test_total; draw += 1) {
          if (!randomKnown.has(sample(result.distribution.weightedAtoms, rng))) {
            clean = false;
            break;
          }
        }
        if (!clean) break;
      }
      if (!clean) break;
    }
    if (clean) hits += 1;
  }
  return { hits, probability: hits / count };
}

function renderReport() {
  const lines = [];
  lines.push("# NULL-CONTROL-V1");
  lines.push("");
  lines.push("Purpose: estimate how often the clean GRAMMAR-V1 substitution result could occur under simple empirical null models that preserve the observed test opportunities and atom-frequency distribution.");
  lines.push("");
  lines.push("This is a first control, not a final statistical proof. It tests whether `8/8` on `f2r` and `7/7` on `f2v`, with zero new substitution slot values, looks common or rare when slot values are sampled without structural restrictions.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push("- Frozen grammar: `frozen/GRAMMAR-V1-2026-07-13`.");
  lines.push("- Test folios: `f2r`, `f2v`.");
  lines.push("- Validation command rerun by this script: `node scripts/validate-release-v1.js`.");
  lines.push(`- Simulation iterations: \`${iterations}\`.`);
  lines.push(`- RNG seed: \`${seed}\`.`);
  lines.push("");
  lines.push("## Null Models");
  lines.push("");
  lines.push("### Exact-Known Empirical Null");
  lines.push("");
  lines.push("For each observed family, preserve:");
  lines.push("");
  lines.push("- the actual frozen known slot values for that family;");
  lines.push("- the number of observed test opportunities;");
  lines.push("- the empirical atom-frequency distribution of the tested folio.");
  lines.push("");
  lines.push("Then draw random slot values from the folio's atom distribution. A family is clean only if every draw falls inside its actual frozen known-value set.");
  lines.push("");
  lines.push("This is conservative because it gives the null model the real known values learned by GRAMMAR-V1.");
  lines.push("");
  lines.push("### Size-Only Empirical Null");
  lines.push("");
  lines.push("For each observed family, preserve:");
  lines.push("");
  lines.push("- the number of known values, but not their identities;");
  lines.push("- the number of observed test opportunities;");
  lines.push("- the empirical atom-frequency distribution of the tested folio.");
  lines.push("");
  lines.push("Then draw a random same-size known-value set and random slot values from the folio's atom distribution. This asks whether simply having small vocabularies of allowed values makes the result easy.");
  lines.push("");
  lines.push("## Observed Result");
  lines.push("");
  lines.push("| Folio | Observed substitution families | Observed opportunities | New slot values |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const result of folioResults) {
    lines.push(`| \`${result.folio}\` | ${result.observedFamilies} | ${result.observedOpportunities} | 0 |`);
  }
  lines.push("");
  lines.push("## Control Results");
  lines.push("");
  lines.push("| Control | Clean joint simulations | Iterations | Estimated probability |");
  lines.push("| --- | ---: | ---: | ---: |");
  lines.push(`| Exact-known empirical null | ${exactKnownSimulation.hits} | ${iterations} | ${formatProbability(exactKnownSimulation.probability)}${zeroHitNote(exactKnownSimulation.hits)} |`);
  lines.push(`| Size-only empirical null | ${sizeOnlySimulation.hits} | ${iterations} | ${formatProbability(sizeOnlySimulation.probability)}${zeroHitNote(sizeOnlySimulation.hits)} |`);
  lines.push("");
  lines.push(`Naive analytical estimate for the exact-known empirical null under independence assumptions: \`${formatProbability(jointAnalytic)}\`.`);
  lines.push("");
  lines.push("## Per-Folio Exact-Known Probability");
  lines.push("");
  lines.push("| Folio | Exact-known analytic probability |");
  lines.push("| --- | ---: |");
  for (const result of folioResults) {
    lines.push(`| \`${result.folio}\` | ${formatProbability(result.exactKnownAnalytic)} |`);
  }
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push(classifyProbability(jointAnalytic));
  lines.push("");
  lines.push("Important limitation: this null samples slot values from the full empirical atom distribution of each folio. That is useful as a first sanity check, but it is probably too broad because real slot candidates may already be constrained by position, particle context, or morphology. A stronger next null should preserve positional class or local frame context before drawing replacement slot values.");
  lines.push("");
  lines.push("This does not yet solve reviewer attack #2: all labels were produced by the project author. The next independent control remains a second annotator or a public ink-linked annotation audit.");
  lines.push("");
  lines.push("## Source Tables");
  lines.push("");
  lines.push("- `null-control-family-probabilities.tsv`");
  return lines.join("\n") + "\n";
}

function zeroHitNote(hits) {
  if (hits !== 0) return "";
  return ` (no hits; rough 95% upper bound < ${formatProbability(3 / iterations)})`;
}

function classifyProbability(probability) {
  if (probability < 1e-4) {
    return "Under this first control, the clean joint result is **extremely rare**.";
  }
  if (probability < 1e-3) {
    return "Under this first control, the clean joint result is **rare**.";
  }
  if (probability < 1e-2) {
    return "Under this first control, the clean joint result is **interesting and uncommon**.";
  }
  if (probability < 5e-2) {
    return "Under this first control, the clean joint result is **interesting but not yet strong by itself**.";
  }
  return "Under this first control, the clean joint result is **not rare enough by itself**.";
}

function atomDistribution(filePath, folio) {
  const counts = new Map();
  for (const row of readTsv(filePath)) {
    if (row.folio !== folio) continue;
    for (const token of tokens(row.signature)) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  const weightedAtoms = [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([atom, count]) => ({ atom, count, probability: count / total }));
  const probabilities = new Map(weightedAtoms.map((entry) => [entry.atom, entry.probability]));
  return { counts, total, weightedAtoms, probabilities };
}

function probabilityMass(probabilities, allowed) {
  let mass = 0;
  for (const atom of allowed) {
    mass += probabilities.get(atom) ?? 0;
  }
  return mass;
}

function sample(weightedAtoms, rng) {
  const total = weightedAtoms.reduce((sum, entry) => sum + entry.count, 0);
  let threshold = rng() * total;
  for (const entry of weightedAtoms) {
    threshold -= entry.count;
    if (threshold <= 0) return entry.atom;
  }
  return weightedAtoms.at(-1).atom;
}

function sampleUniqueWeighted(weightedAtoms, size, rng) {
  const selected = new Set();
  while (selected.size < size && selected.size < weightedAtoms.length) {
    selected.add(sample(weightedAtoms, rng));
  }
  return selected;
}

function familyRows(results) {
  return results.flatMap((result) => result.rows.map((row) => ({
    folio: result.folio,
    skeleton: row.skeleton,
    slot_index: row.slot_index,
    test_total: row.test_total,
    known_values: [...row.knownValues].join(" "),
    known_mass: row.knownMass,
    clean_probability: row.cleanProbability,
  })));
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
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
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
    ...rows.map((row) => fields.map((field) => String(row[field] ?? "").replaceAll("\t", " ")).join("\t")),
  ].join("\n") + "\n", "utf8");
}

function tokens(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean);
}

function valueSet(value) {
  return new Set(String(value ?? "")
    .split(/\s+/)
    .map((item) => item.split(":").slice(0, 2).join(":"))
    .filter(Boolean));
}

function formatProbability(value) {
  if (value === 0) return "0";
  if (value < 0.0001) return value.toExponential(4);
  return value.toFixed(6);
}

function mulberry32(seedValue) {
  let value = seedValue >>> 0;
  return function rng() {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
