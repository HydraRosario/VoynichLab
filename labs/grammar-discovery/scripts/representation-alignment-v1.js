import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoRoot = path.resolve(root, "..");
const outDir = path.resolve(root, "out/representation-alignment-v1");
const evaCasesRoot = path.resolve(repoRoot, "labs/eva-comparison/cases");
const lineAuditPath = path.join(repoRoot, "research/artifacts/public/prospective-atoms-eva-test-v1/tables/line-alignment-audit.tsv");
const folios = ["f1r", "f1v", "f2r", "f2v", "f47v"];

const lineAudit = readTsv(lineAuditPath).filter((row) => row.status === "paired-by-ordinal");
const evaTokensByFolio = new Map(folios.map((folio) => [folio, readCaseTsv(folio, "eva-tokens.tsv")]));
const atomsByFolio = new Map(folios.map((folio) => [folio, readCaseTsv(folio, "atoms.tsv")]));

const alignedRegions = [];
const unresolvedRegions = [];

for (const line of lineAudit) {
  alignLine(line);
}

fs.mkdirSync(outDir, { recursive: true });
writeTsv(path.join(outDir, "aligned-regions.tsv"), alignedRegions, [
  "folio",
  "line",
  "region_id",
  "eva_token_sequence",
  "eva_token_count",
  "eva_symbol_count",
  "atoms_unit_sequence",
  "atoms_unit_count",
  "atoms_symbol_count",
  "relation_type",
  "alignment_confidence",
  "coordinate_evidence",
  "ambiguity_note",
]);
writeTsv(path.join(outDir, "unresolved-regions.tsv"), unresolvedRegions, [
  "folio",
  "line",
  "region_id",
  "side",
  "item_sequence",
  "item_count",
  "reason",
  "note",
]);
fs.writeFileSync(path.join(outDir, "REPRESENTATION-ALIGNMENT-V1.md"), renderReport(), "utf8");

console.log(`Wrote ${path.relative(root, path.join(outDir, "REPRESENTATION-ALIGNMENT-V1.md"))}`);
console.log(`Aligned regions: ${alignedRegions.length}`);
console.log(`Unresolved regions: ${unresolvedRegions.length}`);

function alignLine(line) {
  const folio = line.eva_page;
  const lineId = String(line.eva_line);
  const evaLineTokens = (evaTokensByFolio.get(folio) ?? [])
    .filter((row) => String(row.line) === lineId)
    .sort((a, b) => Number(a.token_index) - Number(b.token_index));
  const atomUnits = (atomsByFolio.get(folio) ?? [])
    .filter((row) => String(row.row_index) === String(line.physical_row))
    .sort((a, b) => Number(a.bounds_x) - Number(b.bounds_x) || Number(a.unit_index) - Number(b.unit_index));

  if (!evaLineTokens.length || !atomUnits.length) {
    unresolvedRegions.push({
      folio,
      line: lineId,
      region_id: `${folio}-l${lineId}-unresolved`,
      side: !evaLineTokens.length ? "EVA" : "ATOMS",
      item_sequence: "",
      item_count: 0,
      reason: "missing-line-side",
      note: "Line audit paired the row, but one side has no tokens/units in the case tables.",
    });
    return;
  }

  const evaIntervals = evaLineTokens.map((token, index) => ({
    type: "eva",
    index,
    start: index / evaLineTokens.length,
    end: (index + 1) / evaLineTokens.length,
    row: token,
  }));
  const xMin = Math.min(...atomUnits.map((unit) => Number(unit.bounds_x)));
  const xMax = Math.max(...atomUnits.map((unit) => Number(unit.bounds_x) + Number(unit.bounds_w)));
  const width = Math.max(1, xMax - xMin);
  const atomIntervals = atomUnits.map((unit, index) => ({
    type: "atoms",
    index,
    start: (Number(unit.bounds_x) - xMin) / width,
    end: (Number(unit.bounds_x) + Number(unit.bounds_w) - xMin) / width,
    row: unit,
  }));

  const edges = [];
  for (const eva of evaIntervals) {
    for (const atom of atomIntervals) {
      const overlap = intervalOverlap(eva, atom);
      if (overlap > 0) {
        edges.push([eva.index, atom.index]);
      }
    }
  }

  const components = connectedComponents(evaLineTokens.length, atomUnits.length, edges);
  const usedEva = new Set();
  const usedAtoms = new Set();

  for (const component of components) {
    const evaIndexes = [...component.eva].sort((a, b) => a - b);
    const atomIndexes = [...component.atoms].sort((a, b) => a - b);
    for (const index of evaIndexes) usedEva.add(index);
    for (const index of atomIndexes) usedAtoms.add(index);
    if (!evaIndexes.length || !atomIndexes.length) continue;

    const evaRows = evaIndexes.map((index) => evaLineTokens[index]);
    const atomRows = atomIndexes.map((index) => atomUnits[index]);
    const regionNumber = alignedRegions.filter((row) => row.folio === folio && row.line === lineId).length + 1;
    const relation = relationType(evaRows.length, atomRows.length);
    const confidence = alignmentConfidence(line, evaRows, atomRows, relation);
    const atomXMin = Math.min(...atomRows.map((row) => Number(row.bounds_x)));
    const atomXMax = Math.max(...atomRows.map((row) => Number(row.bounds_x) + Number(row.bounds_w)));
    const evaOrdinalRange = `${evaRows[0].token_index}-${evaRows.at(-1).token_index}/${evaLineTokens.length}`;
    alignedRegions.push({
      folio,
      line: lineId,
      region_id: `${folio}-l${lineId}-r${String(regionNumber).padStart(3, "0")}`,
      eva_token_sequence: evaRows.map((row) => row.eva).join(" "),
      eva_token_count: evaRows.length,
      eva_symbol_count: evaRows.reduce((sum, row) => sum + String(row.eva).length, 0),
      atoms_unit_sequence: atomRows.map((row) => row.unit_id).join(" "),
      atoms_unit_count: atomRows.length,
      atoms_symbol_count: atomRows.reduce((sum, row) => sum + tokens(row.atoms).length, 0),
      relation_type: relation,
      alignment_confidence: confidence,
      coordinate_evidence: `atoms_x=${atomXMin}-${atomXMax}; eva_ordinal=${evaOrdinalRange}; line_pair=${line.status}`,
      ambiguity_note: ambiguityNote(line, evaRows, atomRows, relation),
    });
  }

  for (const eva of evaIntervals) {
    if (!usedEva.has(eva.index)) {
      unresolvedRegions.push({
        folio,
        line: lineId,
        region_id: `${folio}-l${lineId}-eva-${eva.row.token_index}`,
        side: "EVA",
        item_sequence: eva.row.eva,
        item_count: 1,
        reason: "no-overlapping-atoms-span",
        note: "EVA token has no overlap with any ATOMS visual span under ordinal/uniform estimate.",
      });
    }
  }
  for (const atom of atomIntervals) {
    if (!usedAtoms.has(atom.index)) {
      unresolvedRegions.push({
        folio,
        line: lineId,
        region_id: `${folio}-l${lineId}-atoms-${atom.row.unit_id}`,
        side: "ATOMS",
        item_sequence: atom.row.unit_id,
        item_count: 1,
        reason: "no-overlapping-eva-span",
        note: "ATOMS unit has no overlap with any EVA ordinal span under line-level estimate.",
      });
    }
  }
}

function renderReport() {
  const lines = [];
  lines.push("# REPRESENTATION-ALIGNMENT-V1");
  lines.push("");
  lines.push("Purpose: create an auditable mapping between complete EVA tokens and ATOMS physical units over the same manuscript rows, without assuming one-to-one correspondence.");
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  lines.push("- EVA token tables: `labs/eva-comparison/cases/<folio>-full/eva-tokens.tsv`.");
  lines.push("- ATOMS unit tables: `labs/eva-comparison/cases/<folio>-full/atoms.tsv`.");
  lines.push("- Row alignment table: `research/artifacts/public/prospective-atoms-eva-test-v1/tables/line-alignment-audit.tsv`.");
  lines.push("");
  lines.push("## Method");
  lines.push("");
  lines.push("The hierarchy is:");
  lines.push("");
  lines.push("```text");
  lines.push("folio -> line -> left-to-right visual span -> EVA token group -> ATOMS unit group");
  lines.push("```");
  lines.push("");
  lines.push("ATOMS units use real bounding-box x spans. EVA tokens currently have no token-level coordinates in the case tables, so V1 assigns EVA tokens uniform ordinal spans within each paired line. Overlapping spans are merged into monotonic connected regions. This allows `1:1`, `1:N`, `N:1`, and `N:M` relations without forcing one-to-one alignment.");
  lines.push("");
  lines.push("Because EVA token coordinates are estimated, this is an alignment audit layer, not visual proof of exact token boundaries.");
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push("| Folio | EVA tokens | ATOMS units | Aligned EVA tokens | Aligned ATOMS units | EVA coverage | ATOMS coverage | Regions | Unresolved |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const folio of folios) {
    const evaTotal = (evaTokensByFolio.get(folio) ?? []).length;
    const atomTotal = (atomsByFolio.get(folio) ?? []).length;
    const rows = alignedRegions.filter((row) => row.folio === folio);
    const unresolved = unresolvedRegions.filter((row) => row.folio === folio);
    const alignedEva = rows.reduce((sum, row) => sum + Number(row.eva_token_count), 0);
    const alignedAtoms = rows.reduce((sum, row) => sum + Number(row.atoms_unit_count), 0);
    lines.push(`| \`${folio}\` | ${evaTotal} | ${atomTotal} | ${alignedEva} | ${alignedAtoms} | ${pct(evaTotal ? alignedEva / evaTotal : 0)} | ${pct(atomTotal ? alignedAtoms / atomTotal : 0)} | ${rows.length} | ${unresolved.length} |`);
  }
  lines.push("");
  lines.push("## Relation Types");
  lines.push("");
  lines.push("| Relation | Count |");
  lines.push("| --- | ---: |");
  for (const [relation, count] of countBy(alignedRegions, (row) => row.relation_type)) {
    lines.push(`| \`${relation}\` | ${count} |`);
  }
  lines.push("");
  lines.push("## Confidence");
  lines.push("");
  lines.push("| Confidence | Count |");
  lines.push("| --- | ---: |");
  for (const [confidence, count] of countBy(alignedRegions, (row) => row.alignment_confidence)) {
    lines.push(`| \`${confidence}\` | ${count} |`);
  }
  lines.push("");
  lines.push("## Examples By Relation Type");
  lines.push("");
  for (const relation of ["1:1", "1:N", "N:1", "N:M"]) {
    lines.push(`### ${relation}`);
    lines.push("");
    pushExampleTable(lines, alignedRegions.filter((row) => row.relation_type === relation).slice(0, 8));
    lines.push("");
  }
  lines.push("## Drift And Crossing Checks");
  lines.push("");
  const driftRows = lineDriftRows();
  lines.push(`- Lines with different EVA token count and ATOMS unit count: \`${driftRows.length}\`.`);
  lines.push("- Crossing alignments detected: `0`.");
  lines.push("");
  lines.push("The method builds monotonic connected regions from ordered line spans, so crossing alignments are structurally disallowed in V1. Future coordinate-level EVA spans should re-check this with real token boxes.");
  lines.push("");
  lines.push("### Lines With Count Drift");
  lines.push("");
  pushDriftTable(lines, driftRows.slice(0, 30));
  lines.push("");
  lines.push("## Unresolved Regions");
  lines.push("");
  lines.push(`Total unresolved regions: \`${unresolvedRegions.length}\`.`);
  lines.push("");
  pushUnresolvedTable(lines, unresolvedRegions.slice(0, 30));
  lines.push("");
  lines.push("## Output Tables");
  lines.push("");
  lines.push("- `aligned-regions.tsv`");
  lines.push("- `unresolved-regions.tsv`");
  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push("REPRESENTATION-ALIGNMENT-V1 is good enough to audit coverage, relation types, and line-level monotonic grouping. It is not yet good enough to claim precise token-level visual correspondence, because EVA token spans are ordinal estimates rather than measured coordinates.");
  return lines.join("\n") + "\n";
}

function pushExampleTable(lines, rows) {
  if (!rows.length) {
    lines.push("No examples.");
    return;
  }
  lines.push("| Region | EVA | ATOMS units | Confidence | Evidence |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| \`${row.region_id}\` | \`${row.eva_token_sequence}\` | \`${row.atoms_unit_sequence}\` | \`${row.alignment_confidence}\` | \`${row.coordinate_evidence}\` |`);
  }
}

function pushDriftTable(lines, rows) {
  if (!rows.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Folio | Line | EVA tokens | ATOMS units | Difference |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const row of rows) {
    lines.push(`| \`${row.folio}\` | ${row.line} | ${row.eva} | ${row.atoms} | ${row.atoms - row.eva} |`);
  }
}

function pushUnresolvedTable(lines, rows) {
  if (!rows.length) {
    lines.push("No rows.");
    return;
  }
  lines.push("| Region | Side | Items | Reason | Note |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| \`${row.region_id}\` | \`${row.side}\` | \`${row.item_sequence}\` | \`${row.reason}\` | ${row.note} |`);
  }
}

function lineDriftRows() {
  return lineAudit.map((line) => {
    const folio = line.eva_page;
    const eva = (evaTokensByFolio.get(folio) ?? []).filter((row) => String(row.line) === String(line.eva_line)).length;
    const atoms = (atomsByFolio.get(folio) ?? []).filter((row) => String(row.row_index) === String(line.physical_row)).length;
    return { folio, line: line.eva_line, eva, atoms };
  }).filter((row) => row.eva !== row.atoms);
}

function relationType(evaCount, atomCount) {
  if (evaCount === 1 && atomCount === 1) return "1:1";
  if (evaCount === 1) return "1:N";
  if (atomCount === 1) return "N:1";
  return "N:M";
}

function alignmentConfidence(line, evaRows, atomRows, relation) {
  if (line.status !== "paired-by-ordinal") return "low";
  if (relation === "1:1" && Number(line.eva_token_count) === Number(line.physical_unit_count)) return "medium";
  if (relation === "1:1") return "low-medium";
  return "low";
}

function ambiguityNote(line, evaRows, atomRows, relation) {
  const notes = ["EVA token spans are ordinal estimates; ATOMS spans use bounding boxes."];
  if (Number(line.eva_token_count) !== Number(line.physical_unit_count)) {
    notes.push(`line-count-drift eva=${line.eva_token_count} atoms=${line.physical_unit_count}`);
  }
  if (relation !== "1:1") notes.push("grouped relation; inspect visually before token-level use");
  return notes.join("; ");
}

function intervalOverlap(a, b) {
  return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
}

function connectedComponents(evaCount, atomCount, edges) {
  const nodes = new Map();
  for (let index = 0; index < evaCount; index += 1) nodes.set(`e${index}`, []);
  for (let index = 0; index < atomCount; index += 1) nodes.set(`a${index}`, []);
  for (const [eva, atom] of edges) {
    nodes.get(`e${eva}`).push(`a${atom}`);
    nodes.get(`a${atom}`).push(`e${eva}`);
  }
  const seen = new Set();
  const components = [];
  for (const node of nodes.keys()) {
    if (seen.has(node) || nodes.get(node).length === 0) continue;
    const stack = [node];
    const component = { eva: new Set(), atoms: new Set() };
    seen.add(node);
    while (stack.length) {
      const current = stack.pop();
      if (current.startsWith("e")) component.eva.add(Number(current.slice(1)));
      if (current.startsWith("a")) component.atoms.add(Number(current.slice(1)));
      for (const next of nodes.get(current)) {
        if (seen.has(next)) continue;
        seen.add(next);
        stack.push(next);
      }
    }
    components.push(component);
  }
  return components.sort((a, b) => Math.min(...a.eva) - Math.min(...b.eva));
}

function readCaseTsv(folio, fileName) {
  const filePath = path.join(evaCasesRoot, `${folio}-full`, fileName);
  return fs.existsSync(filePath) ? readTsv(filePath) : [];
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

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}
