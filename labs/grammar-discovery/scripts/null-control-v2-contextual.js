import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const iterations = Number(args.iterations ?? 100000);
const seed = Number(args.seed ?? 20260713);
const outDir = path.resolve(root, args.out_dir ?? "out/null-control-v2-contextual");
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
const jointAnalytic = folioResults.reduce((product, result) => product * result.contextualAnalytic, 1);
const contextualSimulation = simulateContextual(folioResults, iterations, seed);

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "null-control-v2-contextual-family-probabilities.tsv"), familyRows(folioResults), [
  "folio",
  "skeleton",
  "slot_index",
  "length",
  "role",
  "left_neighbor",
  "right_neighbor",
  "test_total",
  "known_values",
  "candidate_total",
  "candidate_values",
  "known_candidate_count",
  "known_candidate_mass",
  "clean_probability",
]);
fs.writeFileSync(path.join(outDir, "NULL-CONTROL-V2-CONTEXTUAL.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "NULL-CONTROL-V2-CONTEXTUAL.md"))}`);
console.log(`Contextual empirical null: ${contextualSimulation.hits}/${iterations} = ${formatProbability(contextualSimulation.probability)}`);

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
  const molecules = readTsv(test.moleculesPath)
    .filter((row) => row.folio === test.folio)
    .map((row) => ({ ...row, tokens: tokens(row.signature) }));
  const rows = readTsv(substitutionPath)
    .filter((row) => Number(row.test_total) > 0)
    .map((row) => {
      const skeletonTokens = tokens(row.skeleton);
      const slotIndex = Number(row.slot_index);
      const slot = slotIndex - 1;
      const context = {
        length: skeletonTokens.length,
        role: positionalRole(slot, skeletonTokens.length),
        leftNeighbor: slot > 0 ? skeletonTokens[slot - 1] : "",
        rightNeighbor: slot < skeletonTokens.length - 1 ? skeletonTokens[slot + 1] : "",
      };
      const candidates = contextualCandidates(molecules, slot, context);
      const knownValues = valueSet(row.train_values);
      const knownCandidateCount = candidates.filter((candidate) => knownValues.has(candidate)).length;
      const candidateMass = candidates.length ? knownCandidateCount / candidates.length : 0;

      return {
        ...row,
        test_total: Number(row.test_total),
        skeletonTokens,
        slotIndex,
        slot,
        context,
        candidates,
        knownValues,
        candidateCounts: countValues(candidates),
        knownCandidateCount,
        candidateMass,
        cleanProbability: candidateMass ** Number(row.test_total),
      };
    });

  return {
    folio: test.folio,
    moleculeCount: molecules.length,
    observedFamilies: rows.length,
    observedOpportunities: rows.reduce((sum, row) => sum + row.test_total, 0),
    contextualAnalytic: rows.reduce((product, row) => product * row.cleanProbability, 1),
    rows,
  };
}

function contextualCandidates(molecules, slot, context) {
  const candidates = [];
  for (const molecule of molecules) {
    const sigTokens = molecule.tokens;
    if (sigTokens.length !== context.length) continue;
    if (positionalRole(slot, sigTokens.length) !== context.role) continue;
    if (context.leftNeighbor && sigTokens[slot - 1] !== context.leftNeighbor) continue;
    if (context.rightNeighbor && sigTokens[slot + 1] !== context.rightNeighbor) continue;
    if (!sigTokens[slot]) continue;
    candidates.push(sigTokens[slot]);
  }
  return candidates;
}

function simulateContextual(results, count, initialSeed) {
  const rng = mulberry32(initialSeed);
  let hits = 0;
  for (let iteration = 0; iteration < count; iteration += 1) {
    let clean = true;
    for (const result of results) {
      for (const row of result.rows) {
        if (!row.candidates.length) {
          clean = false;
          break;
        }
        for (let draw = 0; draw < row.test_total; draw += 1) {
          const sampled = row.candidates[Math.floor(rng() * row.candidates.length)];
          if (!row.knownValues.has(sampled)) {
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
  lines.push("# NULL-CONTROL-V2-CONTEXTUAL");
  lines.push("");
  lines.push("Purpose: test whether the clean GRAMMAR-V1 substitution result remains rare under a contextual null model that preserves local structural opportunities.");
  lines.push("");
  lines.push("This control keeps the frozen 19 substitution families unchanged and evaluates the same statistic as V1: every observed substitution family in `f2r` and `f2v` must reuse only frozen known slot values.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push("- Frozen grammar: `frozen/GRAMMAR-V1-2026-07-13`.");
  lines.push("- Test folios: `f2r`, `f2v`.");
  lines.push("- Validation command rerun by this script: `node scripts/validate-release-v1.js`.");
  lines.push(`- Simulation iterations: \`${iterations}\`.`);
  lines.push(`- RNG seed: \`${seed}\`.`);
  lines.push("");
  lines.push("## Null Model");
  lines.push("");
  lines.push("For each observed slot opportunity, replacement values are sampled only from atoms in the same test folio that match:");
  lines.push("");
  lines.push("- same molecule length;");
  lines.push("- same positional role: initial, medial, or final;");
  lines.push("- same immediate left neighbor, when the slot is not initial;");
  lines.push("- same immediate right neighbor, when the slot is not final.");
  lines.push("");
  lines.push("Example: a slot shaped as `... f:1 [X] f:1 ...` is sampled from atoms that actually occur after `f:1` and before `f:1` in same-length test molecules.");
  lines.push("");
  lines.push("The target observed molecules are included in the candidate pools. This makes the control conservative in favor of the null because real successful observations contribute to the pool of possible random draws.");
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
  lines.push(`| Contextual empirical null | ${contextualSimulation.hits} | ${iterations} | ${formatProbability(contextualSimulation.probability)}${zeroHitNote(contextualSimulation.hits)} |`);
  lines.push("");
  lines.push(`Naive analytic contextual estimate under independence assumptions: \`${formatProbability(jointAnalytic)}\`.`);
  lines.push("");
  lines.push("## Per-Folio Contextual Probability");
  lines.push("");
  lines.push("| Folio | Contextual analytic probability |");
  lines.push("| --- | ---: |");
  for (const result of folioResults) {
    lines.push(`| \`${result.folio}\` | ${formatProbability(result.contextualAnalytic)} |`);
  }
  lines.push("");
  lines.push("## Candidate Pools");
  lines.push("");
  lines.push("| Folio | Slot | Test Total | Context | Known Values | Candidate Values | Clean Probability |");
  lines.push("| --- | ---: | ---: | --- | --- | --- | ---: |");
  for (const result of folioResults) {
    for (const row of result.rows) {
      lines.push(`| \`${result.folio}\` | ${row.slotIndex} | ${row.test_total} | ${formatContext(row.context)} | \`${[...row.knownValues].join(" ")}\` | \`${formatCounts(row.candidateCounts)}\` | ${formatProbability(row.cleanProbability)} |`);
    }
  }
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push(classifyProbability(contextualSimulation.probability, jointAnalytic));
  lines.push("");
  lines.push("Important limitation: this still assumes candidate draws are exchangeable within a local context. It does not model higher-order family identity, cross-family overlap, scribal style, or annotator effects.");
  lines.push("");
  lines.push("This control addresses the main weakness of NULL-CONTROL-V1 by avoiding global draws from the full atom inventory. It does not address the independent-annotation problem.");
  lines.push("");
  lines.push("## Source Tables");
  lines.push("");
  lines.push("- `null-control-v2-contextual-family-probabilities.tsv`");
  return lines.join("\n") + "\n";
}

function classifyProbability(empirical, analytic) {
  if (empirical === 0 && analytic < 1e-4) {
    return "Under this contextual control, the clean joint result remains **rare enough to justify stronger follow-up controls**.";
  }
  if (empirical < 1e-3) {
    return "Under this contextual control, the clean joint result is **rare**.";
  }
  if (empirical < 1e-2) {
    return "Under this contextual control, the clean joint result is **interesting and uncommon**.";
  }
  if (empirical < 5e-2) {
    return "Under this contextual control, the clean joint result is **interesting but not decisive by itself**.";
  }
  return "Under this contextual control, the clean joint result is **not rare enough by itself**.";
}

function familyRows(results) {
  return results.flatMap((result) => result.rows.map((row) => ({
    folio: result.folio,
    skeleton: row.skeleton,
    slot_index: row.slot_index,
    length: row.context.length,
    role: row.context.role,
    left_neighbor: row.context.leftNeighbor,
    right_neighbor: row.context.rightNeighbor,
    test_total: row.test_total,
    known_values: [...row.knownValues].join(" "),
    candidate_total: row.candidates.length,
    candidate_values: formatCounts(row.candidateCounts),
    known_candidate_count: row.knownCandidateCount,
    known_candidate_mass: row.candidateMass,
    clean_probability: row.cleanProbability,
  })));
}

function positionalRole(slot, length) {
  if (slot === 0) return "initial";
  if (slot === length - 1) return "final";
  return "medial";
}

function formatContext(context) {
  const left = context.leftNeighbor || "START";
  const right = context.rightNeighbor || "END";
  return `len=${context.length}; role=${context.role}; ${left} [_] ${right}`;
}

function zeroHitNote(hits) {
  if (hits !== 0) return "";
  return ` (no hits; rough 95% upper bound < ${formatProbability(3 / iterations)})`;
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

function countValues(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function formatCounts(counts) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => `${value}:${count}`)
    .join(" ");
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
