#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const atomsDir = path.join(root, "EVAComparisonLab", "artifacts", "visual-snapshots", "current", "atoms");
const snapshotManifestPath = path.join(root, "EVAComparisonLab", "artifacts", "visual-snapshots", "current", "visual-snapshots.tsv");
const outputDir = path.join(root, "research", "audits");
const EVA_LABELS = ["a:1","b:1","c:1","c:2","d:1","e:1","f:1","g:1","h:1","h:2","i:1","j:1","k:1","l:1","m:1","n:1"];

const TOKEN_DIR = Object.fromEntries(EVA_LABELS.map(t => [t, t.replace(":", "_")]));

function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((field, index) => [field, cells[index] ?? ""]));
  });
}

function parsePoints(svgText) {
  const m = svgText.match(/points="([^"]+)"/);
  if (!m) return [];
  const nums = m[1].match(/[\d.-]+/g);
  if (!nums) return [];
  const pts = [];
  for (let i = 0; i < nums.length - 1; i += 2) {
    pts.push([parseFloat(nums[i]), parseFloat(nums[i + 1])]);
  }
  return pts;
}

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function computeFeatures(pts) {
  const n = pts.length;
  if (n === 0) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let trajLen = 0;
  let cx = 0, cy = 0;
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    cx += x; cy += y;
    if (i > 0) trajLen += dist(pts[i - 1], pts[i]);
  }
  cx /= n; cy /= n;
  const w = maxX - minX, h = maxY - minY;
  const area = w * h;
  const gap = dist(pts[0], pts[n - 1]);
  const aspect = h !== 0 ? w / h : 0;
  const compactness = area > 0 ? (trajLen ** 2) / (4 * Math.PI * area) : 0;
  const midIdx = Math.floor(n / 2);
  const straightMid = [(pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2];
  const midOffset = dist(pts[midIdx], straightMid);
  const dirStart = Math.atan2(pts[Math.min(3, n-1)][1] - pts[0][1], pts[Math.min(3, n-1)][0] - pts[0][0]);
  const dirEnd = Math.atan2(pts[n-1][1] - pts[n-Math.min(3, n-1)-1][1], pts[n-1][0] - pts[n-Math.min(3, n-1)-1][0]);
  return { n, w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10, area: Math.round(area * 10) / 10, gap: Math.round(gap * 10) / 10, trajLen: Math.round(trajLen * 10) / 10, aspect: Math.round(aspect * 100) / 100, compactness: Math.round(compactness * 10) / 10, midOffset: Math.round(midOffset * 10) / 10, cx: Math.round(cx * 10) / 10, cy: Math.round(cy * 10) / 10, dirStart: Math.round(dirStart * 100) / 100, dirEnd: Math.round(dirEnd * 100) / 100 };
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mad(arr, med) {
  const devs = arr.map(v => Math.abs(v - med));
  return median(devs);
}

function thresholds(arr, key) {
  const med = median(arr);
  let m = mad(arr, med);
  const absMin = key === "n" ? 1 : key === "gap" ? 0.5 : key === "aspect" ? 0.05 : key === "compactness" ? 0.1 : key === "midOffset" ? 0.5 : Math.max(med * 0.05, 1);
  if (m < absMin) m = absMin;
  return { med, lower: med - 5 * m, upper: med + 5 * m, mad: m };
}

function isOutlier(val, thr) {
  return val < thr.lower || val > thr.upper;
}

function outlierSeverity(val, thr) {
  const maxDev = Math.max(Math.abs(thr.upper - thr.med), Math.abs(thr.lower - thr.med));
  if (maxDev === 0) return val !== thr.med ? 10 : 0;
  const dev = Math.abs(val - thr.med);
  return dev / maxDev;
}

function extractMetadata(svgText) {
  const m = svgText.match(/<metadata>([\s\S]*?)<\/metadata>/);
  if (!m) return { image: "", imageId: 0, bounds: null, atoms: [] };
  const decoded = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c));
  try {
    const data = JSON.parse(decoded);
    return {
      image: data.imageName || "",
      imageId: data.imageId || 0,
      bounds: data.bounds || null,
      atoms: (data.atoms || []).map(a => ({
        id: a.id, token: a.token, particle: a.particle_id, molecule: a.molecule_id, order: a.atom_order
      })),
    };
  } catch {
    return { image: "", imageId: 0, bounds: null, atoms: [] };
  }
}

// ---- MAIN ----
const allAtoms = [];
const byToken = {};

if (!fs.existsSync(snapshotManifestPath)) {
  console.error(`Missing snapshot manifest: ${snapshotManifestPath}`);
  process.exit(1);
}

const manifestRows = readTsv(snapshotManifestPath).filter((row) => row.entity_type === "atom");
for (const row of manifestRows) {
  const label = row.token;
  if (!TOKEN_DIR[label]) continue;

  const filePath = path.join(root, "EVAComparisonLab", "artifacts", "visual-snapshots", "current", row.svg_path.replace(/\\/g, path.sep));
  if (!fs.existsSync(filePath)) {
    console.error(`SKIP missing manifest SVG: ${filePath}`);
    continue;
  }

  const svg = fs.readFileSync(filePath, "utf8");
  const pts = parsePoints(svg);
  const feats = computeFeatures(pts);
  const meta = extractMetadata(svg);
  const atom = {
    id: Number(row.entity_id),
    label,
    page: row.image_name,
    feats,
    meta,
    file: filePath.replace(root, "").replace(/\\/g, "/"),
  };
  allAtoms.push(atom);
  if (!byToken[label]) byToken[label] = [];
  byToken[label].push(atom);
}

console.log(`Loaded ${allAtoms.length} atoms across ${Object.keys(byToken).length} classes`);
for (const label of EVA_LABELS) {
  console.log(`  ${label}: ${byToken[label]?.length || 0}`);
}

// ---- CLASS STATISTICS + OUTLIER DETECTION ----
const FEAT_KEYS = ["n", "w", "h", "area", "gap", "trajLen", "aspect", "compactness", "midOffset"];
const stats = {};
for (const label of EVA_LABELS) {
  const atoms = byToken[label] || [];
  const featVals = {};
  for (const key of FEAT_KEYS) {
    featVals[key] = atoms.map(a => a.feats?.[key]).filter(v => v !== null && v !== undefined);
  }
  stats[label] = {};
  for (const key of FEAT_KEYS) {
    stats[label][key] = atoms.length >= 5 ? thresholds(featVals[key], key) : null;
  }
}

const candidates = [];
for (const atom of allAtoms) {
  if (!atom.feats) {
    candidates.push({ ...atom, reasons: ["no_features"], score: 99 });
    continue;
  }
  const s = stats[atom.label];
  if (!s) continue;
  const reasons = [];
  let score = 0;
  for (const key of FEAT_KEYS) {
    const thr = s[key];
    if (!thr) continue;
    if (isOutlier(atom.feats[key], thr)) {
      const sev = outlierSeverity(atom.feats[key], thr);
      reasons.push(`${key}=${atom.feats[key]} (med=${thr.med}, bounds=[${thr.lower.toFixed(1)},${thr.upper.toFixed(1)}], sev=${sev.toFixed(1)})`);
      score += sev;
    }
  }
  if (reasons.length >= 2 && score >= 3) {
    candidates.push({ ...atom, reasons, score: Math.round(score * 10) / 10 });
  }
}

candidates.sort((a, b) => b.score - a.score);

// ---- CROSS-CLASS CONFUSION ----
const classProfiles = {};
for (const label of EVA_LABELS) {
  const atoms = (byToken[label] || []).filter(a => a.feats);
  if (atoms.length < 5) continue;
  const profile = {};
  for (const key of ["n", "area", "gap", "aspect", "compactness"]) {
    profile[key] = median(atoms.map(a => a.feats[key]));
  }
  classProfiles[label] = profile;
}

function profileDist(atom, profile) {
  let d2 = 0;
  for (const key of Object.keys(profile)) {
    const diff = (atom.feats[key] || 0) - profile[key];
    const scale = Math.abs(profile[key]) || 1;
    d2 += (diff / scale) ** 2;
  }
  return Math.sqrt(d2);
}

const confusion = [];
for (const atom of allAtoms) {
  if (!atom.feats) continue;
  const ownDist = profileDist(atom, classProfiles[atom.label]);
  for (const otherLabel of EVA_LABELS) {
    if (otherLabel === atom.label) continue;
    if (!classProfiles[otherLabel]) continue;
    const otherDist = profileDist(atom, classProfiles[otherLabel]);
    if (otherDist < ownDist * 0.5 && ownDist > 0.5) {
      confusion.push({ id: atom.id, label: atom.label, page: atom.page, closerTo: otherLabel, ownDist: Math.round(ownDist * 100) / 100, otherDist: Math.round(otherDist * 100) / 100, file: atom.file });
    }
  }
}

confusion.sort((a, b) => a.otherDist - b.otherDist);

// ---- OUTPUT ----
fs.mkdirSync(outputDir, { recursive: true });

const reportLines = [];
reportLines.push("# Atom Anomaly Detection Report");
reportLines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
reportLines.push(`Corpus: ${allAtoms.length} atoms, ${Object.keys(byToken).length} classes, ${Object.keys(byToken).filter(l => (byToken[l]||[]).length > 0).length} non-empty\n`);

reportLines.push("## Intra-class Outliers (sorted by severity)");
reportLines.push("| Score | ID | Token | Page | Reasons |");
reportLines.push("|-------|----|-------|------|---------|");
for (const c of candidates) {
  reportLines.push(`| ${c.score} | ${c.id} | ${c.label} | ${c.page} | ${c.reasons.join("; ")} |`);
}

reportLines.push(`\nTotal intra-class candidates: ${candidates.length}\n`);

reportLines.push("## Cross-class Confusion Candidates");
reportLines.push("| ID | Label | Page | Closer to | Own dist | Other dist |");
reportLines.push("|----|-------|------|-----------|----------|------------|");
for (const c of confusion) {
  reportLines.push(`| ${c.id} | ${c.label} | ${c.page} | ${c.closerTo} | ${c.ownDist} | ${c.otherDist} |`);
}

reportLines.push(`\nTotal confusion candidates: ${confusion.length}\n`);

reportLines.push("## Class Summary");
reportLines.push("| Class | Count | n (med) | area (med) | gap (med) | aspect (med) | compactness (med) |");
reportLines.push("|-------|-------|---------|-----------|-----------|--------------|-------------------|");
for (const label of EVA_LABELS) {
  const atoms = byToken[label] || [];
  const vals = atoms.filter(a => a.feats);
  if (vals.length === 0) continue;
  const meds = {};
  for (const key of ["n", "area", "gap", "aspect", "compactness"]) {
    meds[key] = median(vals.map(a => a.feats[key]));
  }
  reportLines.push(`| ${label} | ${vals.length} | ${meds.n.toFixed(0)} | ${meds.area.toFixed(0)} | ${meds.gap.toFixed(1)} | ${meds.aspect.toFixed(2)} | ${meds.compactness.toFixed(1)} |`);
}

reportLines.push("\n## Per-Class MAD Bounds");
for (const label of EVA_LABELS) {
  const s = stats[label];
  if (!s) continue;
  reportLines.push(`\n### ${label}`);
  reportLines.push("| Feature | Median | Lower | Upper |");
  reportLines.push("|---------|--------|-------|-------|");
  for (const key of FEAT_KEYS) {
    const thr = s[key];
    if (thr) {
      reportLines.push(`| ${key} | ${thr.med.toFixed(1)} | ${thr.lower.toFixed(1)} | ${thr.upper.toFixed(1)} |`);
    }
  }
}

const reportPath = path.join(outputDir, "anomaly-detection-report.md");
fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");
console.log(`\nReport written to ${reportPath}`);

// ---- JSON OUTPUT ----
const jsonOutput = {
  generatedAt: new Date().toISOString().slice(0, 10),
  corpus: { totalAtoms: allAtoms.length, classes: Object.keys(byToken).length },
  classStats: {},
  intraClassCandidates: candidates.map(c => ({
    id: c.id, label: c.label, page: c.page, score: c.score,
    reasons: c.reasons,
    feats: c.feats,
    bounds: c.meta?.bounds || null,
    image: c.meta?.image || null,
    imageId: c.meta?.imageId || null,
    file: c.file,
    moleculeInfo: c.meta?.atoms?.[0] ? {
      molecule: c.meta.atoms[0].molecule,
      particle: c.meta.atoms[0].particle,
      order: c.meta.atoms[0].order,
    } : null,
  })),
  crossClassConfusion: confusion,
  classProfiles,
};

for (const label of EVA_LABELS) {
  const s = stats[label];
  if (!s) continue;
  jsonOutput.classStats[label] = {};
  for (const key of FEAT_KEYS) {
    if (s[key]) {
      jsonOutput.classStats[label][key] = { med: s[key].med, lower: s[key].lower, upper: s[key].upper, mad: s[key].mad };
    }
  }
}

const jsonPath = path.join(outputDir, "anomaly-candidates.json");
fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), "utf8");
console.log(`JSON written to ${jsonPath}`);

console.log(`Intra-class candidates: ${candidates.length}`);
console.log(`Cross-class confusion candidates: ${confusion.length}`);
if (candidates.length > 0) {
  console.log(`\nTop candidates:`);
  for (const c of candidates.slice(0, 10)) {
    console.log(`  score=${c.score} id=${c.id} token=${c.label} page=${c.page} reasons=${c.reasons[0]}`);
  }
}
