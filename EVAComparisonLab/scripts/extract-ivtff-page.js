import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.source || !args.page) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const sourcePath = path.resolve(process.cwd(), args.source);
const outDir = path.resolve(process.cwd(), args.out_dir ?? `cases/${args.page}`);
const paragraphLimit = args.paragraphs ? Number(args.paragraphs) : null;
const throughLine = args.through_line ? Number(args.through_line) : null;
const keepMissingWords = Boolean(args.keep_missing_words);

const pageLines = extractPageLines(fs.readFileSync(sourcePath, "utf8"), args.page);
const selectedLines = throughLine
  ? pageLines.filter((line) => line.line <= throughLine)
  : pageLines;
const paragraphLines = groupParagraphs(selectedLines);
const selectedParagraphs = paragraphLimit ? paragraphLines.slice(0, paragraphLimit) : paragraphLines;

const lineRows = [];
const tokenRows = [];
const plainLines = [];

for (const paragraph of selectedParagraphs) {
  for (const line of mergePhysicalLines(paragraph.lines)) {
    const tokens = tokenizeIvtffText(line.text, { keepMissingWords });
    plainLines.push(tokens.join(" "));
    lineRows.push({
      page: args.page,
      paragraph: paragraph.index,
      line: line.line,
      locus: line.locus,
      marker: line.marker,
      source_loci: line.sourceLoci.join(","),
      eva: tokens.join(" "),
      raw: line.text,
    });

    tokens.forEach((token, tokenIndex) => {
      tokenRows.push({
        unit_id: `${args.page}-p${paragraph.index}-u${String(tokenRows.length + 1).padStart(3, "0")}`,
        page: args.page,
        paragraph: paragraph.index,
        line: line.line,
        token_index: tokenIndex + 1,
        eva: token,
      });
    });
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "eva-lines.tsv"), toTsv(lineRows, ["page", "paragraph", "line", "locus", "marker", "source_loci", "eva", "raw"]), "utf8");
fs.writeFileSync(path.join(outDir, "eva-tokens.tsv"), toTsv(tokenRows, ["unit_id", "page", "paragraph", "line", "token_index", "eva"]), "utf8");
fs.writeFileSync(path.join(outDir, "eva.txt"), plainLines.join("\n") + "\n", "utf8");

console.log(`Extracted ${lineRows.length} lines and ${tokenRows.length} tokens from ${args.page}.`);
console.log(`Output: ${outDir}`);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2).replaceAll("-", "_");
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = value;
      index += 1;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  npm run extract:ivtff -- --source sources/IT2a-n.txt --page f1r --out-dir cases/f1r-full

Options:
  --source <path>          IVTFF source file.
  --page <folio>           Page/folio locus, for example f1r.
  --paragraphs <number>    Keep only the first N paragraphs.
  --through-line <number>  Keep page lines up to this line number.
  --out-dir <path>         Output folder. Default: cases/<page>.
  --keep-missing-words     Keep standalone ? missing-word tokens.`);
}

function extractPageLines(text, page) {
  const result = [];
  const pageLine = new RegExp(`^<${escapeRegex(page)}(?:\\.|>)`);
  const nextPage = /^<f[^.>]+>/;

  let inside = false;
  for (const rawLine of text.split(/\r?\n/)) {
    if (rawLine.startsWith(`<${page}>`)) {
      inside = true;
      continue;
    }

    if (inside && nextPage.test(rawLine) && !rawLine.startsWith(`<${page}.`)) {
      break;
    }

    if (!inside || !pageLine.test(rawLine)) continue;

    const match = rawLine.match(/^<([^>]+)>\s*(.*)$/);
    if (!match) continue;

    const locus = match[1];
    const textPart = match[2].trim();
    const [linePart, marker = ""] = locus.split(",");
    const line = Number(linePart.split(".")[1]);

    result.push({
      locus,
      line,
      marker,
      text: textPart,
    });
  }

  return result;
}

function groupParagraphs(lines) {
  const paragraphs = [];
  let current = null;

  for (const line of lines) {
    const startsParagraph = /[@*]/.test(line.marker) || !current;
    if (startsParagraph) {
      current = { index: paragraphs.length + 1, lines: [] };
      paragraphs.push(current);
    }

    current.lines.push(line);
  }

  return paragraphs;
}

function mergePhysicalLines(lines) {
  const merged = [];

  for (const line of lines) {
    const isContinuation = line.marker.startsWith("=");
    const previous = merged[merged.length - 1];

    if (isContinuation && previous) {
      previous.text = [previous.text, line.text].filter(Boolean).join(".");
      previous.rawText = [previous.rawText, line.text].filter(Boolean).join(".");
      previous.sourceLoci.push(line.locus);
      continue;
    }

    merged.push({
      ...line,
      sourceLoci: [line.locus],
      rawText: line.text,
    });
  }

  return merged;
}

function tokenizeIvtffText(value, options) {
  return value
    .replaceAll("<%>", "")
    .replaceAll("<$>", "")
    .replaceAll("<->", ".")
    .split(".")
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => options.keepMissingWords || token !== "?");
}

function toTsv(rows, fields) {
  return [
    fields.join("\t"),
    ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
  ].join("\n") + "\n";
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
