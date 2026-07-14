#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const snapshotsDir = path.join(root, "EVAComparisonLab", "artifacts", "visual-snapshots", "current");
const portalAtlasDir = path.join(root, "atom-atlas");
const maxExamplesPerAtom = 24;
const maxPerPage = 6;

const snapshotPaths = [
  path.join(snapshotsDir, "visual-snapshots.tsv"),
  path.join(snapshotsDir, "atoms"),
];

const EVA_LABELS = ["a:1","b:1","c:1","c:2","d:1","e:1","f:1","g:1","h:1","h:2","i:1","j:1","k:1","l:1","m:1","n:1"];

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function posix(p) {
  return p.split(path.sep).join("/");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hasLocalImageRef(svgText) {
  return svgText.includes('href="file:///') || svgText.includes("href='file:///");
}

function stripImageTag(svgText) {
  return svgText.replace(/<image[^>]*\/>/g, "");
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

function getPageName(imageName) {
  return imageName.replace(/\.jpg$/i, "");
}

function getFolioFromImage(imageName) {
  const map = {
    "page-003.jpg": "f1r",
    "page-004.jpg": "f1v",
    "page-005.jpg": "f2r",
    "page-006.jpg": "f2v",
    "page-007.jpg": "f3r",
    "page-094.jpg": "f47v",
  };
  return map[imageName] || imageName;
}

function getAtomLabel(token) {
  const map = {
    "a:1": "Descending left curve",
    "b:1": "Short right-top tick",
    "c:1": "Tall right curve",
    "c:2": "Tall right curve (closed variant)",
    "d:1": "Left hook stroke",
    "e:1": "Vertical line with top serif",
    "f:1": "Gallows loop (left side)",
    "g:1": "Right-curved gallows loop",
    "h:1": "Left-top diagonal",
    "h:2": "Short left-top diagonal",
    "i:1": "Right-top diagonal",
    "j:1": "Right-benched stroke",
    "k:1": "Left open curve",
    "l:1": "Right open curve",
    "m:1": "Left descending tail",
    "n:1": "Right descending tail",
  };
  return map[token] || token;
}

function describePosition(uniqueFolios, positionCounts) {
  const total = Object.values(positionCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return "unknown";
  const entries = Object.entries(positionCounts).sort((a, b) => b[1] - a[1]);
  const dominant = entries[0][0];
  const pct = Math.round((entries[0][1] / total) * 100);
  const labels = { initial: "initial", medial: "medial", final: "final", solitary: "solitary" };
  return `${labels[dominant] || dominant} (${pct}%)`;
}

async function main() {
  console.log("Exporting atom atlas...");

  if (!fs.existsSync(path.join(snapshotsDir, "visual-snapshots.tsv"))) {
    console.error("visual-snapshots.tsv not found. Run export-visual-snapshots first.");
    process.exit(1);
  }

  const rows = readTsv(path.join(snapshotsDir, "visual-snapshots.tsv"));
  const atomRows = rows.filter((r) => r.entity_type === "atom");
  console.log(`Found ${atomRows.length} atom entries in TSV.`);

  const atomsByToken = {};
  for (const row of atomRows) {
    const token = row.token;
    if (!token) continue;
    if (!atomsByToken[token]) atomsByToken[token] = [];
    atomsByToken[token].push(row);
  }

  ensureDir(portalAtlasDir);
  const examplesDir = path.join(portalAtlasDir, "examples");
  ensureDir(examplesDir);

  const allAtomData = [];

  for (const token of EVA_LABELS) {
    const entries = atomsByToken[token] || [];
    const svgDir = path.join(snapshotsDir, "atoms", token.replace(":", "_"));
    const label = getAtomLabel(token);

    console.log(`  ${token} (${label}): ${entries.length} entries`);

    const folioCounts = {};
    const positionCounts = { initial: 0, medial: 0, final: 0, solitary: 0 };
    const pageExamples = {};

    for (const entry of entries) {
      const folio = getFolioFromImage(entry.image_name);
      const page = getPageName(entry.image_name);
      folioCounts[folio] = (folioCounts[folio] || 0) + 1;

      const sig = entry.signature || token;
      if (sig === token) {
        positionCounts.solitary++;
      } else {
        const parts = sig.split(" ");
        const idx = parts.indexOf(token);
        if (idx === 0) positionCounts.initial++;
        else if (idx === parts.length - 1) positionCounts.final++;
        else positionCounts.medial++;
      }

      if (!pageExamples[page]) pageExamples[page] = [];
      pageExamples[page].push(entry);
    }

    const folios = Object.keys(folioCounts).sort();
    const totalEntries = entries.length;

    let selected = [];
    const pagesShuffled = Object.keys(pageExamples).sort();
    for (const page of pagesShuffled) {
      if (selected.length >= maxExamplesPerAtom) break;
      const candidates = pageExamples[page].slice(0, maxPerPage);
      selected.push(...candidates.slice(0, maxExamplesPerAtom - selected.length));
    }

    const tokenDir = path.join(examplesDir, token.replace(":", "_"));
    ensureDir(tokenDir);

    const examples = [];
    let copied = 0;

    for (const entry of selected) {
      const svgRel = entry.svg_path || "";
      const svgPath = path.join(snapshotsDir, "atoms", token.replace(":", "_"), entry.image_name, `${entry.entity_id}.svg`);
      const altPath = path.join(snapshotsDir, svgRel.replace(/\\/g, path.sep));

      const srcPath = fs.existsSync(svgPath) ? svgPath : (fs.existsSync(altPath) ? altPath : null);
      if (!srcPath) continue;

      const raw = fs.readFileSync(srcPath, "utf8");
      const cleaned = stripImageTag(raw);

      const ext = path.extname(srcPath) || ".svg";
      const outName = `${entry.entity_id}${ext}`;
      const outPath = path.join(tokenDir, outName);
      fs.writeFileSync(outPath, cleaned, "utf8");

      const folio = getFolioFromImage(entry.image_name);
      examples.push({
        id: entry.entity_id,
        folio,
        molecule: entry.signature || token,
        svg: `./examples/${token.replace(":", "_")}/${outName}`,
        checksum: sha256(cleaned),
      });
      copied++;
    }

    const dominantPosition = describePosition(folios, positionCounts);

    const atomInfo = {
      token,
      label,
      count: totalEntries,
      folios,
      folioCounts,
      dominantPosition,
      positionDistribution: positionCounts,
      exampleCount: copied,
      examples,
    };

    allAtomData.push(atomInfo);
  }

  const atlas = {
    schemaVersion: "1.0",
    totalAtoms: allAtomData.reduce((s, a) => s + a.count, 0),
    totalSymbols: allAtomData.length,
    generatedAt: new Date().toISOString().split("T")[0],
    atoms: allAtomData,
  };

  const atlasPath = path.join(portalAtlasDir, "atoms.json");
  fs.writeFileSync(atlasPath, JSON.stringify(atlas, null, 2), "utf8");

  const totalExamples = allAtomData.reduce((s, a) => s + a.exampleCount, 0);
  console.log(`\nWrote ${atlasPath}`);
  console.log(`  ${atlas.totalAtoms} atoms across ${atlas.totalSymbols} symbols`);
  console.log(`  ${totalExamples} example SVGs copied to ${posix(examplesDir)}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
