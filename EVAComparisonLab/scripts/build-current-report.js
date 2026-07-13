import fs from "node:fs";
import path from "node:path";

const combinedDir = path.resolve(process.cwd(), "cases/combined-f1r-f1v-f2r-f47v-full-current");
const f1rDir = path.resolve(process.cwd(), "cases/f1r-full");
const f1vDir = path.resolve(process.cwd(), "cases/f1v-full");
const f2rDir = path.resolve(process.cwd(), "cases/f2r-full");
const outPath = path.resolve(process.cwd(), "cases/CURRENT-COMPRESSED-REPORT.md");

const f1rEntropy = parseEntropy(fs.readFileSync(path.join(f1rDir, "role-entropy.md"), "utf8"));
const f1vEntropy = parseEntropy(fs.readFileSync(path.join(f1vDir, "role-entropy.md"), "utf8"));
const f2rEntropy = parseEntropy(fs.readFileSync(path.join(f2rDir, "role-entropy.md"), "utf8"));
const combinedEntropy = parseEntropy(fs.readFileSync(path.join(combinedDir, "role-entropy.md"), "utf8"));
const f1rAtoms = readTsv(path.join(f1rDir, "atoms-current.tsv"));
const f1rEvaTokens = readTsv(path.join(f1rDir, "eva-tokens.tsv"));
const f1vAtoms = readTsv(path.join(f1vDir, "atoms-current.tsv"));
const f1vEvaTokens = readTsv(path.join(f1vDir, "eva-tokens.tsv"));
const f2rAtoms = readTsv(path.join(f2rDir, "atoms-current.tsv"));
const f2rEvaTokens = readTsv(path.join(f2rDir, "eva-tokens.tsv"));
const combinedAtoms = readTsv(path.join(combinedDir, "atoms-current.tsv"));
const combinedEvaLines = readTsv(path.join(combinedDir, "eva-lines.tsv"));
const combinedEvaTokens = readTsv(path.join(combinedDir, "eva-tokens.tsv"));
const symbols = readSymbolTable(path.join(combinedDir, "atom-symbols.md"));
const particleRules = fs.readFileSync(path.join(combinedDir, "contextual-rule-discovery.md"), "utf8");
const moleculeRules = fs.readFileSync(path.join(combinedDir, "contextual-rule-discovery-molecule-scope.md"), "utf8");
const moleculeNeighbors = fs.readFileSync(path.join(combinedDir, "molecule-neighbor-discovery.md"), "utf8");
const lineAlignmentAudit = fs.existsSync(path.join(combinedDir, "line-alignment-audit.md"))
  ? fs.readFileSync(path.join(combinedDir, "line-alignment-audit.md"), "utf8")
  : "";
const searchSpaceAudit = fs.existsSync(path.join(combinedDir, "search-space-audit.md"))
  ? fs.readFileSync(path.join(combinedDir, "search-space-audit.md"), "utf8")
  : "";
const conditionalEntropy = fs.existsSync(path.join(combinedDir, "conditional-entropy.md"))
  ? fs.readFileSync(path.join(combinedDir, "conditional-entropy.md"), "utf8")
  : "";
const variantAblation = fs.existsSync(path.join(combinedDir, "variant-ablation.md"))
  ? fs.readFileSync(path.join(combinedDir, "variant-ablation.md"), "utf8")
  : "";
const macroLexemeAnalysis = fs.existsSync(path.join(combinedDir, "macro-lexeme-analysis.md"))
  ? fs.readFileSync(path.join(combinedDir, "macro-lexeme-analysis.md"), "utf8")
  : "";
const morphologyFamilyAnalysis = fs.existsSync(path.join(combinedDir, "morphology-family-analysis.md"))
  ? fs.readFileSync(path.join(combinedDir, "morphology-family-analysis.md"), "utf8")
  : "";
const crossFolioValidation = fs.existsSync(path.join(combinedDir, "cross-folio-validation.md"))
  ? fs.readFileSync(path.join(combinedDir, "cross-folio-validation.md"), "utf8")
  : "";
const e1FinalBranchAudit = fs.existsSync(path.join(combinedDir, "e1-final-branch-audit.md"))
  ? fs.readFileSync(path.join(combinedDir, "e1-final-branch-audit.md"), "utf8")
  : "";
const labelingAnomalyAudit = fs.existsSync(path.join(combinedDir, "labeling-anomaly-audit.md"))
  ? fs.readFileSync(path.join(combinedDir, "labeling-anomaly-audit.md"), "utf8")
  : "";

const exceptionFiles = [
  ["e:1 final without prior g:1", "exceptions-e1-final-without-prior-g1.md"],
  ["f:1 medial without next i:1", "exceptions-f1-medial-without-next-i1.md"],
  ["m:1 medial without next c:1", "exceptions-m1-medial-without-next-c1.md"],
];

const lines = [];
lines.push("# Current Compressed Report");
lines.push("");
lines.push("Generated from the current DatasetCreator database export.");
lines.push("");
lines.push("## Scope");
lines.push("");
lines.push("- Main f1r case: full `f1r` page from IVTFF.");
lines.push(`- f1r EVA lines: \`${uniqueValues(f1rEvaTokens, "line").length}\`.`);
lines.push(`- f1r EVA tokens: \`${f1rEvaTokens.length}\`.`);
lines.push(`- f1r physical atom units: \`${f1rAtoms.length}\`.`);
lines.push(`- f1r DatasetCreator/exported rows: \`${uniqueValues(f1rAtoms, "row_index").length}\`.`);
lines.push("- New f1v case: full `f1v` page from IVTFF, mapped to `page-004.jpg`.");
lines.push(`- f1v EVA lines: \`${uniqueValues(f1vEvaTokens, "line").length}\`.`);
lines.push(`- f1v EVA tokens: \`${f1vEvaTokens.length}\`.`);
lines.push(`- f1v physical atom units: \`${f1vAtoms.length}\`.`);
lines.push(`- f1v DatasetCreator/exported rows: \`${uniqueValues(f1vAtoms, "row_index").length}\`.`);
lines.push("- New f2r case: full `f2r` page from IVTFF, mapped to `page-005.jpg`.");
lines.push(`- f2r EVA lines: \`${uniqueValues(f2rEvaTokens, "line").length}\`.`);
lines.push(`- f2r EVA tokens: \`${f2rEvaTokens.length}\`.`);
lines.push(`- f2r physical atom units: \`${f2rAtoms.length}\`.`);
lines.push(`- f2r DatasetCreator/exported rows: \`${uniqueValues(f2rAtoms, "row_index").length}\`.`);
lines.push("- Combined case: full `f1r` page + full `f1v` page + full `f2r` page + full `f47v` page.");
lines.push(`- Combined EVA lines: \`${combinedEvaLines.length}\`.`);
lines.push(`- Combined EVA tokens: \`${combinedEvaTokens.length}\`.`);
lines.push(`- Combined physical atom units: \`${combinedAtoms.length}\`.`);
lines.push("");
lines.push("Note: stored DatasetCreator row guides are not always the full computed row set. The export mirrors the backend behavior by adding overflow rows for particles outside stored guide bands, so the lab rows match the program inspector.");
lines.push("");
lines.push(`f1r exported row distribution: ${formatRowDistribution(f1rAtoms)}.`);
lines.push(`f1v exported row distribution: ${formatRowDistribution(f1vAtoms)}.`);
lines.push(`f2r exported row distribution: ${formatRowDistribution(f2rAtoms)}.`);
if (f1rEvaTokens.length !== f1rAtoms.length) {
  lines.push("");
  lines.push(`Alignment note: f1r currently has \`${f1rEvaTokens.length}\` EVA tokens and \`${f1rAtoms.length}\` physical atom units. That mismatch is preserved as evidence and should not be silently normalized.`);
}
if (f2rEvaTokens.length !== f2rAtoms.length) {
  lines.push("");
  lines.push(`Alignment note: f2r currently has \`${f2rEvaTokens.length}\` EVA tokens and \`${f2rAtoms.length}\` physical atom units. That mismatch is preserved as evidence and should not be silently normalized.`);
}
lines.push("");
lines.push("## Line Alignment Audit");
lines.push("");
for (const summary of summarizeLineAlignment(lineAlignmentAudit)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("## Entropy Summary");
lines.push("");
lines.push("### f1r Full Page");
lines.push("");
pushEntropyTable(lines, f1rEntropy);
lines.push("");
lines.push("### f1v Full Page");
lines.push("");
pushEntropyTable(lines, f1vEntropy);
lines.push("");
lines.push("### f2r Full Page");
lines.push("");
pushEntropyTable(lines, f2rEntropy);
lines.push("");
lines.push("### Combined f1r + f1v + f2r + f47v");
lines.push("");
pushEntropyTable(lines, combinedEntropy);
lines.push("");
lines.push("## Atom Vocabulary");
lines.push("");
lines.push("| Symbol | Count |");
lines.push("| --- | ---: |");
for (const row of symbols) {
  lines.push(`| \`${row.symbol}\` | ${row.count} |`);
}
lines.push("");
lines.push("## Cleanup Audit");
lines.push("");
const retiredSymbols = ["j:2", "a:2", "g:2"];
let hasRetired = false;
for (const retired of retiredSymbols) {
  const row = symbols.find((item) => item.symbol === retired);
  if (row) {
    hasRetired = true;
    lines.push(`- Retired symbol \`${retired}\` still appears \`${row.count}\` time(s). Inspect and clean upstream before treating it as grammar.`);
  }
}
const n1 = symbols.find((item) => item.symbol === "n:1");
if (n1) {
  lines.push(`- New split symbol \`n:1\` appears \`${n1.count}\` time(s) after replacing the former \`j:2\` shape.`);
}
if (!hasRetired) {
  lines.push("- No retired `j:2`, `a:2`, or `g:2` symbols remain in the current combined export.");
}
for (const summary of summarizeLabelingAudit(labelingAnomalyAudit)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("## Strong Positional Rigidity");
lines.push("");
for (const row of combinedEntropy.atoms.rigid.slice(0, 12)) {
  lines.push(`- \`${row.symbol}\`: H=${row.h}, n=${row.n}, dominant=${row.dominant}.`);
}
lines.push("");
lines.push("## Most Dispersed Atom Symbols");
lines.push("");
for (const row of combinedEntropy.atoms.chaotic.slice(0, 8)) {
  lines.push(`- \`${row.symbol}\`: H=${row.h}, n=${row.n}, ${row.counts}.`);
}
lines.push("");
lines.push("## Contextual Grammar Candidates");
lines.push("");
lines.push("Particle-scope strongest current findings:");
lines.push("");
for (const summary of summarizeParticleRules(particleRules)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("Molecule-scope exploratory signals:");
lines.push("");
for (const summary of summarizeMoleculeRules(moleculeRules)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("Molecule-neighbor scan:");
lines.push("");
for (const summary of summarizeNeighborRules(moleculeNeighbors)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("## Search-Space And Validation Guardrails");
lines.push("");
for (const summary of summarizeSearchSpace(searchSpaceAudit)) {
  lines.push(`- ${summary}`);
}
lines.push("- Strong contextual rows are treated as candidate rules, not as proof by themselves.");
lines.push("- The next scientific step is a frozen alphabet/manual plus out-of-sample annotation, so discovered rules cannot silently shape future labels.");
lines.push("");
lines.push("## New Pattern Search Layers");
lines.push("");
for (const summary of summarizeConditionalEntropy(conditionalEntropy)) {
  lines.push(`- ${summary}`);
}
for (const summary of summarizeVariantAblation(variantAblation)) {
  lines.push(`- ${summary}`);
}
for (const summary of summarizeMacroLexemes(macroLexemeAnalysis)) {
  lines.push(`- ${summary}`);
}
for (const summary of summarizeMorphology(morphologyFamilyAnalysis)) {
  lines.push(`- ${summary}`);
}
for (const summary of summarizeCrossFolio(crossFolioValidation)) {
  lines.push(`- ${summary}`);
}
for (const summary of summarizeBranchAudit(e1FinalBranchAudit)) {
  lines.push(`- ${summary}`);
}
lines.push("");
lines.push("## Exceptions To Inspect");
lines.push("");
for (const [label, fileName] of exceptionFiles) {
  const filePath = path.join(combinedDir, fileName);
  lines.push(`### ${label}`);
  lines.push("");
  lines.push(...extractExceptions(fs.readFileSync(filePath, "utf8")));
  lines.push("");
}
lines.push("## Data Quality Notes");
lines.push("");
lines.push("- This export compares complete EVA pages against the complete currently labeled DatasetCreator pages.");
lines.push("- The contaminated paint batch was removed before this export.");
lines.push("- The paint mode frontend stores a label snapshot per stroke, so a heterogeneous row should not collapse into the last active atom label.");
lines.push("- `export-datasetcreator-atoms.js` uses DatasetCreator row guides plus backend-style overflow rows when guides exist.");
lines.push("- Real rare structures remain in the dataset; only confirmed labeling errors should be corrected upstream.");
lines.push("");
lines.push("## Source Files");
lines.push("");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/role-entropy.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/contextual-rule-discovery.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/contextual-rule-discovery-molecule-scope.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/molecule-neighbor-discovery.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/line-alignment-audit.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/search-space-audit.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/conditional-entropy.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/variant-ablation.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/macro-lexeme-analysis.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/morphology-family-analysis.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/cross-folio-validation.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/e1-final-branch-audit.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/labeling-anomaly-audit.md`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/labeling-anomaly-known.tsv`");
lines.push("- `cases/combined-f1r-f1v-f2r-f47v-full-current/atom-symbols.md`");
lines.push("");

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function parseEntropy(text) {
  const sections = text.split(/\n(?===[^=]+==)/g);
  const parsed = {};
  for (const section of sections) {
    const system = section.match(/==\s*(.*?)\s+role entropy\s*==/)?.[1];
    if (!system) continue;
    parsed[system] = {
      units: field(section, "units"),
      symbols: field(section, "symbols"),
      vocabulary: field(section, "vocabulary"),
      weightedH: field(section, "weighted_entropy_bits"),
      relativeH: field(section, "weighted_relative_entropy_0_to_1"),
      zero: field(section, "zero_entropy_symbols"),
      rigidCount: field(section, "rigid_symbols_95pct"),
      chaotic: parseSymbolRows(section, "most_positionally_chaotic"),
      rigid: parseSymbolRows(section, "most_positionally_rigid"),
    };
  }
  return parsed;
}

function field(section, name) {
  return section.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1] ?? "";
}

function parseSymbolRows(section, heading) {
  const block = section.split(`${heading}:\n`)[1]?.split(/\n[a-z_]+:\n/)[0] ?? "";
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || /^[a-z0-9?:]+/.test(line))
    .map((line) => line.replace(/^-\s*/, ""))
    .map((line) => {
      const match = line.match(/^([^:]+(?::\d+)?|\?): H=([0-9.]+).*?n=(\d+)\s+(.*?)dominant=([^ ]+)/);
      if (!match) return null;
      return {
        symbol: match[1],
        h: match[2],
        n: match[3],
        counts: match[4].trim(),
        dominant: match[5],
      };
    })
    .filter(Boolean);
}

function readSymbolTable(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\| `([^`]+)` \| (\d+) \|$/))
    .filter(Boolean)
    .map((match) => ({ symbol: match[1], count: match[2] }));
}

function pushEntropyTable(lines, entropy) {
  lines.push("| System | Units | Symbols | Vocabulary | Weighted H | Relative H | Zero-H symbols | Rigid >=95% |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const system of ["eva", "atoms"]) {
    const row = entropy[system];
    lines.push(`| ${system.toUpperCase()} | ${row.units} | ${row.symbols} | ${row.vocabulary} | ${row.weightedH} | ${row.relativeH} | ${row.zero} | ${row.rigidCount} |`);
  }
}

function uniqueValues(rows, fieldName) {
  return [...new Set(rows.map((row) => row[fieldName]).filter(Boolean))];
}

function formatRowDistribution(rows) {
  const counts = new Map();
  for (const row of rows) counts.set(row.row_index, (counts.get(row.row_index) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([rowIndex, count]) => `\`R${rowIndex}=${count}\``)
    .join(", ");
}

function summarizeParticleRules(text) {
  const wanted = [
    ["d:1", "final", "has_prior", "i:1"],
    ["d:1", "medial", "has_prior", "a:1"],
    ["d:1", "medial", "has_after", "e:1"],
    ["e:1", "final", "has_prior", "g:1"],
    ["f:1", "final", "prev_is", "e:1"],
    ["f:1", "medial", "next_is", "i:1"],
    ["h:2", "final", "has_prior", "e:1"],
    ["m:1", "medial", "prev_is", "a:1"],
    ["m:1", "medial", "next_is", "c:1"],
    ["n:1", "medial", "prev_is", "g:1"],
    ["n:1", "medial", "next_is", "e:1"],
  ];
  return wanted.map(([symbol, role, test, token]) => {
    const section = text.split(`## ${symbol}\n`)[1]?.split(/\n## /)[0] ?? "";
    const row = section.split(/\r?\n/).find((line) => line.includes(`| ${role} | ${test} | ${token} |`));
    if (!row) return null;
    const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);
    return `\`${symbol}\` ${role}: \`${test} ${token}\` = \`${cells[3]}/${cells[4]}\` (${cells[5]}).`;
  }).filter(Boolean);
}

function summarizeMoleculeRules(text) {
  const wanted = [
    ["j:1", "final", "has_prior", "f:1"],
    ["j:1", "final", "prev_is", "f:1"],
    ["n:1", "initial", "has_after", "g:1"],
    ["n:1", "initial", "has_after", "e:1"],
    ["n:1", "medial", "has_prior", "c:1"],
    ["n:1", "medial", "next_is", "e:1"],
    ["k:1", "medial", "has_prior", "e:1"],
  ];
  return wanted.map(([symbol, role, test, token]) => {
    const section = text.split(`## ${symbol}\n`)[1]?.split(/\n## /)[0] ?? "";
    const row = section.split(/\r?\n/).find((line) => line.includes(`| ${role} | ${test} | ${token} |`));
    if (!row) return null;
    const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);
    return `\`${symbol}\` ${role}: \`${test} ${token}\` = \`${cells[3]}/${cells[4]}\` (${cells[5]}).`;
  }).filter(Boolean);
}

function summarizeNeighborRules(text) {
  const rows = text
    .split(/\r?\n/)
    .filter((line) => line.startsWith("| `"));
  if (!rows.length) return ["No strong molecule-neighbor findings under current thresholds."];
  return rows.map((line) => {
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    return `${cells[0]} -> ${cells[1]}: \`${cells[2]}/${cells[3]}\` (${cells[4]}).`;
  });
}

function summarizeLineAlignment(text) {
  if (!text) return ["Line alignment audit not available for this run."];
  const rows = rowsUnderHeading(text, "Summary");
  if (!rows.length) return ["Line alignment audit produced no summary rows."];
  return rows.map((row) => {
    const cells = markdownCells(row);
    return `${cells[0]}: EVA lines=\`${cells[1]}\`, physical rows=\`${cells[2]}\`, status=\`${cells[3]}\`.`;
  }).concat([
    "Corpus-level entropy comparison remains usable; strict line-by-line comparison is only valid where line counts match or after an explicit mapping table.",
  ]);
}

function summarizeSearchSpace(text) {
  if (!text) return ["Search-space audit not available for this run."];
  const rows = rowsUnderHeading(text, "Search Space");
  if (!rows.length) return ["Search-space audit produced no rows."];
  return rows.map((row) => {
    const cells = markdownCells(row);
    return `${cells[0]} scope examined \`${cells[6]}\` raw symbol-role-test-token hypotheses and reported \`${cells[7]}\` candidates.`;
  });
}

function extractExceptions(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.startsWith("| page-"));
  const header = "| Image | Molecule | Particle | Atom | Signature |";
  const divider = "| --- | --- | --- | ---: | --- |";
  if (!rows.length) return ["No exceptions."];
  return [
    header,
    divider,
    ...rows.map((row) => {
      const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);
      return `| \`${cells[0]}\` | \`${cells[1]}\` | \`${cells[2]}\` | ${cells[3]} | ${cells[9]} |`;
    }),
  ];
}

function summarizeConditionalEntropy(text) {
  if (!text) return [];
  const next = text.match(/Weighted next-token entropy: `([^`]+)` bits/)?.[1];
  const prev = text.match(/Weighted previous-token entropy: `([^`]+)` bits/)?.[1];
  const tableRows = rowsUnderHeading(text, "Lowest Next-Token Entropy").slice(0, 5);
  const strongest = tableRows.map((row) => {
    const cells = markdownCells(row);
    return `${cells[0]} -> ${cells[3]} (${cells[4]}, H=${cells[2]})`;
  }).join("; ");
  return [
    `Conditional entropy: weighted next=\`${next ?? "?"}\`, previous=\`${prev ?? "?"}\`.`,
    strongest ? `Lowest next-token entropy leads: ${strongest}.` : null,
  ].filter(Boolean);
}

function summarizeVariantAblation(text) {
  if (!text) return [];
  const rows = rowsUnderHeading(text, "Global Comparison");
  const full = rows.find((row) => row.includes("Full variants"));
  const merged = rows.find((row) => row.includes("Families merged"));
  const fullCells = full ? markdownCells(full) : [];
  const mergedCells = merged ? markdownCells(merged) : [];
  const familyRows = rowsUnderHeading(text, "Variant Families").slice(0, 4);
  const families = familyRows.map((row) => {
    const cells = markdownCells(row);
    return `${cells[0]} split-minus-merged=${cells[5]}`;
  }).join("; ");
  return [
    fullCells.length && mergedCells.length
      ? `Variant ablation: full H=\`${fullCells[3]}\`, merged-family H=\`${mergedCells[3]}\`.`
      : null,
    families ? `Variant-family checks: ${families}.` : null,
  ].filter(Boolean);
}

function summarizeMacroLexemes(text) {
  if (!text) return [];
  const molecules = fieldFromMarkdownList(text, "Molecules / physical units");
  const originalVocabulary = fieldFromMarkdownList(text, "Original atom vocabulary");
  const macroVocabulary = fieldFromMarkdownList(text, "Macro vocabulary after merge");
  const originalSignatures = fieldFromMarkdownList(text, "Original unique molecule signatures");
  const macroSignatures = fieldFromMarkdownList(text, "Macro unique lexeme signatures");
  const roleRows = rowsUnderHeading(text, "Macro Role Entropy");
  const medialOp = roleRows.map(markdownCells).find((cells) => cells[0] === "`MEDIAL_OP`");
  const topRows = rowsUnderHeading(text, "Top Macro Lexemes").slice(0, 5);
  const top = topRows.map((row) => {
    const cells = markdownCells(row);
    return `${cells[2]} (${cells[0]}x)`;
  }).join("; ");
  return [
    `Macro lexeme test: \`${originalVocabulary}\` atom symbols collapse to \`${macroVocabulary}\` macro-units over \`${molecules}\` physical units.`,
    `Macro signature diversity: original \`${originalSignatures}\` signatures, macro \`${macroSignatures}\` signatures.`,
    medialOp ? `Merged \`MEDIAL_OP\` (${stripTicks(medialOp[5])}) keeps H(role)=\`${medialOp[2]}\`, dominant=\`${medialOp[3]}\` at \`${medialOp[4]}\`.` : null,
    top ? `Top macro lexemes: ${top}.` : null,
  ].filter(Boolean);
}

function summarizeMorphology(text) {
  if (!text) return [];
  const centroidAccuracy = text.match(/Nearest-centroid accuracy: `([^`]+)`/)?.[1];
  const knnAccuracy = text.match(/nearest-neighbor accuracy: `([^`]+)`/)?.[1];
  const meanSeparation = text.match(/Mean separation ratio: `([^`]+)`/)?.[1];
  const strong = sectionBullets(text, "Strongest Current Morphological Families").slice(0, 3).join("; ");
  const weak = sectionBullets(text, "Weakest Or Most Confusable Families").slice(0, 3).join("; ");
  return [
    centroidAccuracy && knnAccuracy
      ? `Morphology-only classifier: nearest-centroid accuracy=\`${centroidAccuracy}\`, kNN accuracy=\`${knnAccuracy}\`, mean separation=\`${meanSeparation ?? "?"}\`.`
      : null,
    strong ? `Strongest morphology families: ${strong}.` : null,
    weak ? `Most confusable morphology families: ${weak}.` : null,
  ].filter(Boolean);
}

function summarizeCrossFolio(text) {
  if (!text) return [];
  const rows = rowsUnderHeading(text, "Validation Matrix");
  const byStatus = {};
  for (const row of rows) {
    const cells = markdownCells(row);
    const status = cells[6];
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }
  const statusText = Object.entries(byStatus).map(([status, count]) => `${status}:${count}`).join(", ");
  return statusText ? [`Cross-folio validation statuses: ${statusText}.`] : [];
}

function sectionBullets(text, heading) {
  const section = text.split(`## ${heading}`)[1]?.split(/\n## /)[0] ?? "";
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").replace(/\.$/, ""));
}

function fieldFromMarkdownList(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp("- " + escaped + ": `([^`]+)`"))?.[1] ?? "?";
}

function stripTicks(value) {
  return String(value).replaceAll("`", "");
}

function summarizeBranchAudit(text) {
  if (!text) return [];
  const rows = rowsUnderHeading(text, "Branch Summary");
  return rows.map((row) => {
    const cells = markdownCells(row);
    return `Branch audit ${cells[0]}: dominant ${cells[2]} = \`${cells[3]}/${cells[1]}\` (${cells[4]}), distribution ${cells[5]}.`;
  });
}

function summarizeLabelingAudit(text) {
  if (!text) return ["Labeling anomaly audit not available for this run."];
  const candidates = text.match(/- Candidates: `?(\d+)`?/)?.[1] ?? "?";
  const high = text.match(/- High priority: `?(\d+)`?/)?.[1] ?? "?";
  const medium = text.match(/- Medium priority: `?(\d+)`?/)?.[1] ?? "?";
  const suppressed = text.match(/- Known anomalies suppressed from pending list: `?(\d+)`?/)?.[1] ?? "?";
  return [
    `Labeling anomaly audit: \`${candidates}\` pending candidates, high=\`${high}\`, medium=\`${medium}\`, known anomalies suppressed=\`${suppressed}\`.`,
  ];
}

function rowsUnderHeading(text, heading) {
  const section = text.split(`## ${heading}`)[1]?.split(/\n## /)[0] ?? "";
  return section
    .split(/\r?\n/)
    .filter((line) => line.startsWith("| `") || line.startsWith("| Full") || line.startsWith("| Families") || /^\| \d/.test(line));
}

function markdownCells(row) {
  return row.split("|").map((cell) => cell.trim()).filter(Boolean);
}
