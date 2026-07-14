import fs from "node:fs";
import path from "node:path";
import { parseArgs, readTsv, writeTsv } from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.case_dir) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const caseDir = path.resolve(process.cwd(), args.case_dir);
const outPath = path.resolve(process.cwd(), args.out ?? path.join(caseDir, "line-alignment-audit.md"));
const tsvPath = path.resolve(process.cwd(), args.tsv ?? path.join(caseDir, "line-alignment-audit.tsv"));
const pageImageMap = parsePageImageMap(args.page_image_map ?? "f1r=page-003.jpg,f47v=page-094.jpg");

const evaLines = readTsv(path.join(caseDir, "eva-lines.tsv"));
const atoms = readTsv(path.join(caseDir, "atoms.tsv"));

const evaByImage = groupBy(evaLines, (row) => pageToImageName(row.page));
const atomsByImage = groupBy(atoms, (row) => row.image_name);
const imageNames = [...new Set([...evaByImage.keys(), ...atomsByImage.keys()])].sort();
const auditRows = [];

for (const imageName of imageNames) {
  const evaRows = evaByImage.get(imageName) ?? [];
  const atomRows = atomsByImage.get(imageName) ?? [];
  const atomsByRow = groupBy(atomRows, (row) => row.row_index);
  const physicalRows = [...atomsByRow.entries()]
    .map(([rowIndex, rows]) => physicalRowSummary(imageName, rowIndex, rows))
    .sort((a, b) => Number(a.physical_row) - Number(b.physical_row));
  const maxRows = Math.max(evaRows.length, physicalRows.length);

  for (let index = 0; index < maxRows; index += 1) {
    const eva = evaRows[index];
    const physical = physicalRows[index];
    const status = rowStatus(eva, physical);
    auditRows.push({
      image_name: imageName,
      ordinal: index + 1,
      status,
      eva_page: eva?.page ?? "",
      eva_paragraph: eva?.paragraph ?? "",
      eva_line: eva?.line ?? "",
      eva_token_count: eva ? tokenCount(eva.eva) : "",
      physical_row: physical?.physical_row ?? "",
      physical_unit_count: physical?.physical_unit_count ?? "",
      physical_y_min: physical?.physical_y_min ?? "",
      physical_y_max: physical?.physical_y_max ?? "",
      physical_first_unit: physical?.physical_first_unit ?? "",
      physical_last_unit: physical?.physical_last_unit ?? "",
      note: noteFor(eva, physical),
    });
  }
}

writeTsv(tsvPath, auditRows, [
  "image_name",
  "ordinal",
  "status",
  "eva_page",
  "eva_paragraph",
  "eva_line",
  "eva_token_count",
  "physical_row",
  "physical_unit_count",
  "physical_y_min",
  "physical_y_max",
  "physical_first_unit",
  "physical_last_unit",
  "note",
]);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buildMarkdown(auditRows, caseDir), "utf8");
console.log(`Wrote line alignment audit to ${outPath}`);
console.log(`Wrote line alignment TSV to ${tsvPath}`);

function physicalRowSummary(imageName, rowIndex, rows) {
  const sorted = [...rows].sort((a, b) => Number(a.unit_index) - Number(b.unit_index));
  const yMin = Math.min(...sorted.map((row) => Number(row.bounds_y)).filter(Number.isFinite));
  const yMax = Math.max(...sorted.map((row) => Number(row.bounds_y) + Number(row.bounds_h)).filter(Number.isFinite));
  return {
    image_name: imageName,
    physical_row: rowIndex,
    physical_unit_count: sorted.length,
    physical_y_min: Number.isFinite(yMin) ? yMin.toFixed(0) : "",
    physical_y_max: Number.isFinite(yMax) ? yMax.toFixed(0) : "",
    physical_first_unit: sorted[0]?.unit_id ?? "",
    physical_last_unit: sorted.at(-1)?.unit_id ?? "",
  };
}

function buildMarkdown(rows, caseDir) {
  const byImage = groupBy(rows, (row) => row.image_name);
  const lines = [
    "# Line Alignment Audit",
    "",
    `Case: \`${path.relative(process.cwd(), caseDir)}\``,
    "",
    "This audit checks whether EVA lines and DatasetCreator physical rows can be compared ordinally. It does not force alignment; it reports mismatches.",
    "",
    "## Summary",
    "",
    "| Image | EVA lines | Physical rows | Status |",
    "| --- | ---: | ---: | --- |",
  ];

  for (const [imageName, imageRows] of byImage.entries()) {
    const evaCount = imageRows.filter((row) => row.eva_line).length;
    const physicalCount = imageRows.filter((row) => row.physical_row).length;
    const status = evaCount === physicalCount ? "line-count-match" : "line-count-mismatch";
    lines.push(`| \`${imageName}\` | ${evaCount} | ${physicalCount} | ${status} |`);
  }

  lines.push("");
  lines.push("## Row Detail");
  lines.push("");
  lines.push("| Image | Ordinal | Status | EVA line | EVA tokens | Physical row | Physical units | Physical y-range | Units | Note |");
  lines.push("| --- | ---: | --- | --- | ---: | --- | ---: | --- | --- | --- |");

  for (const row of rows) {
    const evaLine = row.eva_line ? `${row.eva_page}.${row.eva_line}` : "-";
    const physicalRow = row.physical_row ? `R${row.physical_row}` : "-";
    const yRange = row.physical_y_min ? `${row.physical_y_min}-${row.physical_y_max}` : "-";
    const units = row.physical_first_unit ? `${row.physical_first_unit}..${row.physical_last_unit}` : "-";
    lines.push(`| \`${row.image_name}\` | ${row.ordinal} | ${row.status} | \`${evaLine}\` | ${row.eva_token_count || "-"} | ${physicalRow} | ${row.physical_unit_count || "-"} | ${yRange} | ${units} | ${row.note} |`);
  }

  lines.push("");
  lines.push("## Reading");
  lines.push("");
  lines.push("- Global EVA-vs-ATOMS entropy remains valid as a corpus-level comparison.");
  lines.push("- Line-level comparison is valid only for images where EVA line count and physical row count match, or after an explicit manual mapping table is created.");
  lines.push("- Combined cases must never group by `row_index` alone because row numbers restart per image. Use `image_name + row_index`.");
  lines.push("");
  return lines.join("\n");
}

function rowStatus(eva, physical) {
  if (eva && physical) return "paired-by-ordinal";
  if (eva && !physical) return "eva-only";
  if (!eva && physical) return "physical-only";
  return "empty";
}

function noteFor(eva, physical) {
  if (eva && physical) return "ordinal pair only; not visual proof of exact alignment";
  if (eva && !physical) return "EVA line has no corresponding physical row";
  if (!eva && physical) return "physical row has no corresponding EVA line in this case";
  return "";
}

function tokenCount(text) {
  return String(text ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function pageToImageName(page) {
  const explicit = pageImageMap.get(String(page ?? "").toLowerCase());
  if (explicit) return explicit;
  const match = String(page ?? "").match(/^f(\d+)([rv])$/i);
  if (!match) return page;
  const folio = Number(match[1]);
  const side = match[2].toLowerCase();
  const pageNumber = side === "r" ? folio * 2 - 1 : folio * 2;
  return `page-${String(pageNumber).padStart(3, "0")}.jpg`;
}

function parsePageImageMap(value) {
  const map = new Map();
  for (const pair of String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean)) {
    const [page, image] = pair.split("=").map((item) => item.trim());
    if (page && image) map.set(page.toLowerCase(), image);
  }
  return map;
}

function groupBy(rows, keyFn) {
  const grouped = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return grouped;
}

function printHelp() {
  console.log(`Usage:
  node scripts/line-alignment-audit.js --case-dir cases/combined --out cases/combined/line-alignment-audit.md

Options:
  --page-image-map <csv>  Explicit page-to-image mapping. Default: f1r=page-003.jpg,f47v=page-094.jpg`);
}
