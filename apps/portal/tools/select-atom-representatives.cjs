const fs = require("fs");
const path = require("path");

const snapshotRoot = path.join("labs", "eva-comparison", "artifacts", "visual-snapshots", "current", "atoms");
const outRoot = path.join("apps", "portal", "images", "atoms-v1");
const dataPath = path.join("apps", "portal", "source-data", "atoms-v1.json");
const sampleCount = 48;

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else if (entry.isFile() && entry.name.endsWith(".svg")) out.push(p);
  }
  return out;
}

function parsePoints(svg) {
  const points = [];
  for (const match of svg.matchAll(/points="([^"]+)"/g)) {
    for (const pair of match[1].trim().split(/\s+/)) {
      const [x, y] = pair.split(",").map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) points.push([x, y]);
    }
  }
  return points;
}

function resample(points, n) {
  if (points.length === 0) return Array(n * 2).fill(0);

  const distances = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    distances.push(total);
  }

  if (total === 0) {
    const [x, y] = points[0];
    return Array(n).fill(0).flatMap(() => [x, y]);
  }

  const sampled = [];
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    let i = 1;
    while (i < distances.length && distances[i] < target) i++;
    if (i >= distances.length) {
      sampled.push(points[points.length - 1]);
      continue;
    }

    const prev = distances[i - 1];
    const next = distances[i];
    const t = next === prev ? 0 : (target - prev) / (next - prev);
    sampled.push([
      points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
    ]);
  }

  return sampled.flat();
}

function vector(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  const scale = Math.max(w, h);
  const shifted = points.map(([x, y]) => [(x - minX) / scale, (y - minY) / scale]);
  const v = resample(shifted, sampleCount);
  v.push(w / scale, h / scale, points.length / 300);
  return v;
}

function dist(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum / a.length);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function traceOnlySvg(srcSvg, title) {
  const width = Number(srcSvg.match(/<svg[^>]*width="([^"]+)/)?.[1] || 96);
  const height = Number(srcSvg.match(/<svg[^>]*height="([^"]+)/)?.[1] || 96);
  const polylines = [...srcSvg.matchAll(/<polyline[\s\S]*?<\/polyline>/g)].map((m) => m[0]).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>${escapeHtml(title)}</title>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#17181b"/>
  <rect x="0.5" y="0.5" width="${Math.max(0, width - 1)}" height="${Math.max(0, height - 1)}" fill="none" stroke="#111827" stroke-width="1" opacity="0.35"/>
${polylines}
</svg>
`;
}

function readGroups() {
  const groups = new Map();
  for (const tokenDir of fs.readdirSync(snapshotRoot, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const token = tokenDir.name.replace("_", ":");
    const items = [];
    for (const file of walk(path.join(snapshotRoot, tokenDir.name))) {
      const svg = fs.readFileSync(file, "utf8");
      const points = parsePoints(svg);
      if (points.length < 2) continue;

      const id = Number(svg.match(/&quot;entityId&quot;:&quot;(\d+)&quot;/)?.[1] || path.basename(file, ".svg"));
      const imageName = svg.match(/&quot;imageName&quot;:&quot;([^&]+)&quot;/)?.[1] || "";
      items.push({ token, id, imageName, file, svg, vec: vector(points) });
    }
    groups.set(token, items);
  }
  return groups;
}

function selectExamples(items) {
  let medoid = items[0];
  let best = Infinity;

  for (let i = 0; i < items.length; i++) {
    let sum = 0;
    for (let j = 0; j < items.length; j++) {
      if (i !== j) sum += dist(items[i].vec, items[j].vec);
    }
    const avg = sum / Math.max(1, items.length - 1);
    if (avg < best) {
      best = avg;
      medoid = items[i];
    }
  }

  const ranked = items
    .filter((item) => item !== medoid)
    .map((item) => ({ item, distance: dist(medoid.vec, item.vec) }))
    .sort((a, b) => a.distance - b.distance);

  const selected = [{ role: "closest-to-family-average", item: medoid, distance: 0 }];
  if (ranked[0]) selected.push({ role: "near-average-variant", item: ranked[0].item, distance: ranked[0].distance });
  for (const far of ranked.slice(-3).reverse()) {
    selected.push({ role: "distant-variant", item: far.item, distance: far.distance });
  }

  return selected.slice(0, 5);
}

const groups = readGroups();
const atoms = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const next = atoms.map((atom) => {
  const items = groups.get(atom.token) || [];
  if (!items.length) return atom;

  const tokenSlug = atom.token.replace(":", "_");
  const outDir = path.join(outRoot, tokenSlug);
  fs.mkdirSync(outDir, { recursive: true });

  const examples = selectExamples(items).map((selection, index) => {
    const fileName = `representative-${index + 1}-${selection.item.id}.svg`;
    fs.writeFileSync(
      path.join(outDir, fileName),
      traceOnlySvg(selection.item.svg, `${atom.token} ${selection.role} atom ${selection.item.id}`)
    );

    return {
      atomId: selection.item.id,
      imageName: selection.item.imageName,
      role: selection.role,
      distanceToRepresentative: Number(selection.distance.toFixed(6)),
      file: `./images/atoms-v1/${tokenSlug}/${fileName}`,
    };
  });

  return {
    ...atom,
    representativeMethod: "shape medoid over current visual-snapshot SVG point clouds",
    examples,
  };
});

fs.writeFileSync(dataPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`updated ${next.length} atom families using medoid selection`);
