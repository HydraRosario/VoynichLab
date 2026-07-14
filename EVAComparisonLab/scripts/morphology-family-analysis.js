import fs from "node:fs";
import path from "node:path";
import {
  cleanToken,
  openDatasetDb,
  parseArgs,
  tokenSort,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const images = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const outPath = path.resolve(process.cwd(), args.out ?? "cases/combined-f1r-f47v-full-current/morphology-family-analysis.md");
const outDir = path.dirname(outPath);
const tsvPrefix = args.tsv_prefix
  ? path.resolve(process.cwd(), args.tsv_prefix)
  : path.join(outDir, "morphology-family");
const minCount = Number(args.min_count ?? 8);
const gridSize = Number(args.grid_size ?? 16);
const samplePoints = Number(args.sample_points ?? 32);
const k = Number(args.k ?? 5);
const db = openDatasetDb(args.db);
const snapshotRoot = path.resolve(process.cwd(), args.snapshot_root ?? "artifacts/visual-snapshots/current");
const snapshotIndex = path.join(snapshotRoot, "visual-snapshots.tsv");
const snapshotPaths = fs.existsSync(snapshotIndex) ? readSnapshotPaths(snapshotIndex) : new Map();

const atoms = atomRows(db, images)
  .map((atom) => ({
    ...atom,
    token: cleanToken(`${atom.family}${atom.structural_config ? `:${atom.structural_config}` : ""}`),
    points: parsePoints(atom.points_json),
  }))
  .filter((atom) => atom.token && atom.points.length >= 2);

const byToken = groupBy(atoms, (atom) => atom.token);
const eligibleTokens = [...byToken.entries()]
  .filter(([, rows]) => rows.length >= minCount)
  .map(([token]) => token)
  .sort(tokenSort);
const samples = atoms
  .filter((atom) => eligibleTokens.includes(atom.token))
  .map((atom) => ({
    atom,
    features: featureVector(atom, { gridSize, samplePoints }),
  }));

const featureStats = featureStatsFor(samples);
for (const sample of samples) {
  sample.normalizedFeatures = standardize(sample.features, featureStats);
}

const centroids = centroidByToken(samples);
const looRows = leaveOneOutRows(samples, eligibleTokens, k);
const familyRows = eligibleTokens.map((token) => familyReport(token, samples, centroids, looRows));
const pairRows = pairwiseCentroidRows(eligibleTokens, centroids);
const confusionRows = confusionMatrix(looRows, eligibleTokens);
const representativeRows = representativeAndOutlierRows(samples, centroids);
const globalRows = globalSummaryRows(looRows, familyRows);

fs.mkdirSync(outDir, { recursive: true });
writeTsv(`${tsvPrefix}-families.tsv`, familyRows, [
  "token",
  "count",
  "intra_mean",
  "intra_p95",
  "nearest_other",
  "nearest_other_distance",
  "separation_ratio",
  "centroid_accuracy",
  "knn_accuracy",
]);
writeTsv(`${tsvPrefix}-pairs.tsv`, pairRows, [
  "token_a",
  "token_b",
  "centroid_distance",
]);
writeTsv(`${tsvPrefix}-loo.tsv`, looRows, [
  "atom_id",
  "image_name",
  "token",
  "predicted_centroid",
  "centroid_correct",
  "predicted_knn",
  "knn_correct",
  "nearest_distance",
  "snapshot_path",
]);
writeTsv(`${tsvPrefix}-representatives.tsv`, representativeRows, [
  "token",
  "kind",
  "atom_id",
  "image_name",
  "distance_to_centroid",
  "snapshot_path",
]);
writeTsv(`${tsvPrefix}-confusion.tsv`, confusionRows, [
  "actual",
  "predicted",
  "count",
]);

fs.writeFileSync(outPath, buildMarkdown({
  atoms,
  samples,
  eligibleTokens,
  familyRows,
  pairRows,
  globalRows,
  representativeRows,
  gridSize,
  samplePoints,
  minCount,
  k,
}), "utf8");

console.log(`Wrote morphology family analysis to ${outPath}`);
console.log(`Wrote TSV tables with prefix ${tsvPrefix}`);

function atomRows(db, names) {
  const imageFilter = names.length ? `AND i.name IN (${names.map(() => "?").join(",")})` : "";
  return db
    .prepare(
      `SELECT
         a.id AS atom_id,
         a.image_id,
         i.name AS image_name,
         a.family,
         a.structural_config,
         a.points_json,
         a.anchor_x,
         a.anchor_y,
         a.bounds_x,
         a.bounds_y,
         a.bounds_w,
         a.bounds_h,
         a.length,
         a.angle,
         a.points_count,
         a.molecule_id,
         a.particle_id,
         a.atom_order,
         p.particle_order
       FROM atoms a
       JOIN images i ON i.id = a.image_id
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       WHERE a.molecule_id IS NOT NULL
       ${imageFilter}
       ORDER BY a.image_id, a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
    )
    .all(...names);
}

function featureVector(atom, { gridSize, samplePoints }) {
  const normalized = normalizePoints(atom.points);
  const resampled = resamplePolyline(normalized, samplePoints);
  const raster = rasterize(normalized, gridSize);
  const boundsW = Math.max(Number(atom.bounds_w), 1);
  const boundsH = Math.max(Number(atom.bounds_h), 1);
  const angleRad = Number(atom.angle) * Math.PI / 180;
  const anchorX = (Number(atom.anchor_x) - Number(atom.bounds_x)) / boundsW;
  const anchorY = (Number(atom.anchor_y) - Number(atom.bounds_y)) / boundsH;
  const featureHeader = [
    Math.log(boundsW / boundsH),
    Math.log(Math.max(Number(atom.length), 1) / Math.max(boundsW, boundsH)),
    Math.log(Math.max(Number(atom.points_count), 1) / Math.max(boundsW * boundsH, 1)),
    Math.sin(angleRad),
    Math.cos(angleRad),
    clamp(anchorX, -2, 3),
    clamp(anchorY, -2, 3),
  ];
  const sampled = resampled.flatMap((point) => [point.x, point.y]);
  return [...featureHeader, ...sampled, ...raster];
}

function normalizePoints(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 1);
  const h = Math.max(maxY - minY, 1);
  const scale = Math.max(w, h);
  const offsetX = (scale - w) / 2;
  const offsetY = (scale - h) / 2;
  return points.map((point) => ({
    x: (point.x - minX + offsetX) / scale,
    y: (point.y - minY + offsetY) / scale,
  }));
}

function resamplePolyline(points, count) {
  if (!points.length) return Array.from({ length: count }, () => ({ x: 0.5, y: 0.5 }));
  if (points.length === 1) return Array.from({ length: count }, () => points[0]);
  const distances = [0];
  for (let index = 1; index < points.length; index += 1) {
    distances.push(distances[index - 1] + euclideanPoint(points[index - 1], points[index]));
  }
  const total = distances.at(-1) || 1;
  const result = [];
  for (let sample = 0; sample < count; sample += 1) {
    const target = count === 1 ? 0 : (sample / (count - 1)) * total;
    let right = distances.findIndex((value) => value >= target);
    if (right <= 0) {
      result.push(points[0]);
      continue;
    }
    const left = right - 1;
    const span = Math.max(distances[right] - distances[left], 1e-9);
    const t = (target - distances[left]) / span;
    result.push({
      x: points[left].x + (points[right].x - points[left].x) * t,
      y: points[left].y + (points[right].y - points[left].y) * t,
    });
  }
  return result;
}

function rasterize(points, gridSize) {
  const cells = Array.from({ length: gridSize * gridSize }, () => 0);
  for (const point of points) {
    const x = clamp(Math.floor(point.x * gridSize), 0, gridSize - 1);
    const y = clamp(Math.floor(point.y * gridSize), 0, gridSize - 1);
    cells[y * gridSize + x] = 1;
  }
  return cells;
}

function featureStatsFor(samples) {
  const length = samples[0]?.features.length ?? 0;
  const means = Array.from({ length }, () => 0);
  for (const sample of samples) {
    for (let index = 0; index < length; index += 1) {
      means[index] += sample.features[index];
    }
  }
  for (let index = 0; index < length; index += 1) {
    means[index] /= Math.max(samples.length, 1);
  }
  const variances = Array.from({ length }, () => 0);
  for (const sample of samples) {
    for (let index = 0; index < length; index += 1) {
      variances[index] += (sample.features[index] - means[index]) ** 2;
    }
  }
  const stdevs = variances.map((variance) => Math.sqrt(variance / Math.max(samples.length, 1)) || 1);
  return { means, stdevs };
}

function standardize(features, stats) {
  return features.map((value, index) => (value - stats.means[index]) / stats.stdevs[index]);
}

function centroidByToken(samples) {
  const grouped = groupBy(samples, (sample) => sample.atom.token);
  const centroids = new Map();
  for (const [token, rows] of grouped.entries()) {
    centroids.set(token, centroid(rows.map((row) => row.normalizedFeatures)));
  }
  return centroids;
}

function familyReport(token, samples, centroids, looRows) {
  const own = samples.filter((sample) => sample.atom.token === token);
  const centroidVector = centroids.get(token);
  const ownDistances = own.map((sample) => euclidean(sample.normalizedFeatures, centroidVector)).sort((a, b) => a - b);
  const nearest = [...centroids.entries()]
    .filter(([other]) => other !== token)
    .map(([other, vector]) => ({ token: other, distance: euclidean(centroidVector, vector) }))
    .sort((a, b) => a.distance - b.distance)[0];
  const loo = looRows.filter((row) => row.token === token);
  const centroidAccuracy = share(loo.filter((row) => row.centroid_correct === "yes").length, loo.length);
  const knnAccuracy = share(loo.filter((row) => row.knn_correct === "yes").length, loo.length);
  const intraMean = mean(ownDistances);
  return {
    token,
    count: own.length,
    intra_mean: intraMean.toFixed(4),
    intra_p95: quantile(ownDistances, 0.95).toFixed(4),
    nearest_other: nearest?.token ?? "",
    nearest_other_distance: (nearest?.distance ?? 0).toFixed(4),
    separation_ratio: nearest && intraMean ? (nearest.distance / intraMean).toFixed(4) : "NA",
    centroid_accuracy: centroidAccuracy.toFixed(4),
    knn_accuracy: knnAccuracy.toFixed(4),
  };
}

function pairwiseCentroidRows(tokens, centroids) {
  const rows = [];
  for (let a = 0; a < tokens.length; a += 1) {
    for (let b = a + 1; b < tokens.length; b += 1) {
      rows.push({
        token_a: tokens[a],
        token_b: tokens[b],
        centroid_distance: euclidean(centroids.get(tokens[a]), centroids.get(tokens[b])).toFixed(4),
      });
    }
  }
  return rows.sort((a, b) => Number(a.centroid_distance) - Number(b.centroid_distance));
}

function leaveOneOutRows(samples, tokens, k) {
  const tokenStats = tokenFeatureStats(samples);
  const tokenOrder = [...tokens].sort(tokenSort);
  return samples.map((sample, index) => {
    const predictedCentroid = nearestLeaveOneOutCentroid(sample, tokenStats, tokenOrder);
    const neighbors = nearestKNeighbors(samples, index, k);
    const predictedKnn = vote(neighbors);
    return {
      atom_id: sample.atom.atom_id,
      image_name: sample.atom.image_name,
      token: sample.atom.token,
      predicted_centroid: predictedCentroid.token,
      centroid_correct: predictedCentroid.token === sample.atom.token ? "yes" : "no",
      predicted_knn: predictedKnn,
      knn_correct: predictedKnn === sample.atom.token ? "yes" : "no",
      nearest_distance: predictedCentroid.distance.toFixed(4),
      snapshot_path: snapshotPaths.get(String(sample.atom.atom_id)) ?? "",
    };
  });
}

function tokenFeatureStats(samples) {
  const stats = new Map();
  for (const sample of samples) {
    const token = sample.atom.token;
    if (!stats.has(token)) {
      stats.set(token, {
        count: 0,
        sums: Array.from({ length: sample.normalizedFeatures.length }, () => 0),
      });
    }
    const item = stats.get(token);
    item.count += 1;
    for (let index = 0; index < sample.normalizedFeatures.length; index += 1) {
      item.sums[index] += sample.normalizedFeatures[index];
    }
  }
  return stats;
}

function nearestLeaveOneOutCentroid(sample, tokenStats, tokenOrder) {
  let best = { token: "", distanceSq: Number.POSITIVE_INFINITY };
  for (const token of tokenOrder) {
    const stats = tokenStats.get(token);
    if (!stats) continue;
    const isOwnToken = token === sample.atom.token;
    const count = stats.count - (isOwnToken ? 1 : 0);
    if (count <= 0) continue;
    const distanceSq = squaredDistanceToCentroid(sample.normalizedFeatures, stats.sums, count, isOwnToken ? sample.normalizedFeatures : null, best.distanceSq);
    if (distanceSq < best.distanceSq || (distanceSq === best.distanceSq && tokenSort(token, best.token) < 0)) {
      best = { token, distanceSq };
    }
  }
  return {
    token: best.token,
    distance: Math.sqrt(best.distanceSq),
  };
}

function squaredDistanceToCentroid(features, sums, count, excludedFeatures, limit = Number.POSITIVE_INFINITY) {
  let sum = 0;
  for (let index = 0; index < features.length; index += 1) {
    const centroidValue = (sums[index] - (excludedFeatures ? excludedFeatures[index] : 0)) / count;
    const delta = features[index] - centroidValue;
    sum += delta * delta;
    if (sum > limit) return sum;
  }
  return sum;
}

function nearestKNeighbors(samples, sampleIndex, k) {
  const sample = samples[sampleIndex];
  const neighbors = [];
  let worstDistanceSq = Number.POSITIVE_INFINITY;
  for (let index = 0; index < samples.length; index += 1) {
    if (index === sampleIndex) continue;
    const candidate = samples[index];
    const distanceSq = squaredDistance(sample.normalizedFeatures, candidate.normalizedFeatures, worstDistanceSq);
    if (neighbors.length < k) {
      neighbors.push({ token: candidate.atom.token, distance: Math.sqrt(distanceSq), distanceSq });
      neighbors.sort(neighborSort);
      worstDistanceSq = neighbors.at(-1)?.distanceSq ?? Number.POSITIVE_INFINITY;
      continue;
    }
    if (distanceSq < worstDistanceSq || (distanceSq === worstDistanceSq && tokenSort(candidate.atom.token, neighbors.at(-1)?.token ?? "") < 0)) {
      neighbors[neighbors.length - 1] = { token: candidate.atom.token, distance: Math.sqrt(distanceSq), distanceSq };
      neighbors.sort(neighborSort);
      worstDistanceSq = neighbors.at(-1)?.distanceSq ?? Number.POSITIVE_INFINITY;
    }
  }
  return neighbors;
}

function neighborSort(a, b) {
  return a.distanceSq - b.distanceSq || tokenSort(a.token, b.token);
}

function nearestCentroid(features, centroids) {
  return [...centroids.entries()]
    .map(([token, vector]) => ({ token, distance: euclidean(features, vector) }))
    .sort((a, b) => a.distance - b.distance || tokenSort(a.token, b.token))[0];
}

function vote(neighbors) {
  const counts = new Map();
  const distanceSums = new Map();
  for (const neighbor of neighbors) {
    counts.set(neighbor.token, (counts.get(neighbor.token) ?? 0) + 1);
    distanceSums.set(neighbor.token, (distanceSums.get(neighbor.token) ?? 0) + neighbor.distance);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || (distanceSums.get(a[0]) ?? 0) - (distanceSums.get(b[0]) ?? 0) || tokenSort(a[0], b[0]))[0]?.[0] ?? "";
}

function confusionMatrix(rows, tokens) {
  const output = [];
  for (const actual of tokens) {
    for (const predicted of tokens) {
      const count = rows.filter((row) => row.token === actual && row.predicted_knn === predicted).length;
      if (count) output.push({ actual, predicted, count });
    }
  }
  return output;
}

function representativeAndOutlierRows(samples, centroids) {
  const rows = [];
  for (const [token, tokenSamples] of groupBy(samples, (sample) => sample.atom.token).entries()) {
    const centroidVector = centroids.get(token);
    const ranked = tokenSamples
      .map((sample) => ({
        token,
        atom: sample.atom,
        distance: euclidean(sample.normalizedFeatures, centroidVector),
      }))
      .sort((a, b) => a.distance - b.distance);
    for (const item of ranked.slice(0, 3)) rows.push(representativeRow(item, "representative"));
    for (const item of ranked.slice(-3).reverse()) rows.push(representativeRow(item, "outlier"));
  }
  return rows;
}

function representativeRow(item, kind) {
  return {
    token: item.token,
    kind,
    atom_id: item.atom.atom_id,
    image_name: item.atom.image_name,
    distance_to_centroid: item.distance.toFixed(4),
    snapshot_path: snapshotPaths.get(String(item.atom.atom_id)) ?? "",
  };
}

function globalSummaryRows(looRows, familyRows) {
  const centroidCorrect = looRows.filter((row) => row.centroid_correct === "yes").length;
  const knnCorrect = looRows.filter((row) => row.knn_correct === "yes").length;
  const ratios = familyRows
    .map((row) => Number(row.separation_ratio))
    .filter(Number.isFinite);
  return {
    centroidAccuracy: share(centroidCorrect, looRows.length),
    knnAccuracy: share(knnCorrect, looRows.length),
    meanSeparationRatio: mean(ratios),
    medianSeparationRatio: quantile(ratios.sort((a, b) => a - b), 0.5),
  };
}

function buildMarkdown({ atoms, samples, eligibleTokens, familyRows, pairRows, globalRows, representativeRows, gridSize, samplePoints, minCount, k }) {
  const sortedFamilies = [...familyRows].sort((a, b) => Number(b.separation_ratio) - Number(a.separation_ratio));
  const weakestFamilies = [...familyRows].sort((a, b) => Number(a.separation_ratio) - Number(b.separation_ratio));
  const lines = [
    "# Morphology Family Analysis",
    "",
    "## Purpose",
    "",
    "Test whether hand-labeled atom families form recurrent, measurable shape classes without using position, EVA text, or contextual grammar rules.",
    "",
    "## Method",
    "",
    `- Images: ${images.map((image) => `\`${image}\``).join(", ")}.`,
    `- Raw atoms read: \`${atoms.length}\`.`,
    `- Eligible symbols: \`${eligibleTokens.length}\` with at least \`${minCount}\` samples.`,
    `- Shape normalization: bounding-box centering, max-dimension scaling, \`${samplePoints}\` resampled path points, and \`${gridSize}x${gridSize}\` occupancy mask.`,
    `- Classifier check: leave-one-out nearest centroid and ${k}-nearest-neighbor using only normalized morphology features.`,
    "",
    "## Global Result",
    "",
    `- Nearest-centroid accuracy: \`${globalRows.centroidAccuracy.toFixed(4)}\`.`,
    `- ${k}-nearest-neighbor accuracy: \`${globalRows.knnAccuracy.toFixed(4)}\`.`,
    `- Mean separation ratio: \`${globalRows.meanSeparationRatio.toFixed(4)}\`.`,
    `- Median separation ratio: \`${globalRows.medianSeparationRatio.toFixed(4)}\`.`,
    "",
    "Interpretation: separation ratio = nearest other family centroid distance / mean within-family distance. Values above 1 indicate the family is, on average, tighter internally than it is close to its nearest competing family.",
    "",
    "## Family Cohesion And Separation",
    "",
    "| Symbol | Count | Intra mean | Intra p95 | Nearest other | Other distance | Separation ratio | Centroid acc | kNN acc |",
    "| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |",
  ];
  for (const row of sortedFamilies) {
    lines.push(`| \`${row.token}\` | ${row.count} | ${row.intra_mean} | ${row.intra_p95} | \`${row.nearest_other}\` | ${row.nearest_other_distance} | ${row.separation_ratio} | ${row.centroid_accuracy} | ${row.knn_accuracy} |`);
  }
  lines.push("");
  lines.push("## Strongest Current Morphological Families");
  lines.push("");
  for (const row of sortedFamilies.slice(0, 8)) {
    lines.push(`- \`${row.token}\`: separation ratio \`${row.separation_ratio}\`, kNN accuracy \`${row.knn_accuracy}\`, nearest competitor \`${row.nearest_other}\`.`);
  }
  lines.push("");
  lines.push("## Weakest Or Most Confusable Families");
  lines.push("");
  for (const row of weakestFamilies.slice(0, 8)) {
    lines.push(`- \`${row.token}\`: separation ratio \`${row.separation_ratio}\`, kNN accuracy \`${row.knn_accuracy}\`, nearest competitor \`${row.nearest_other}\`.`);
  }
  lines.push("");
  lines.push("## Closest Family Pairs");
  lines.push("");
  for (const row of pairRows.slice(0, 12)) {
    lines.push(`- \`${row.token_a}\` vs \`${row.token_b}\`: centroid distance \`${row.centroid_distance}\`.`);
  }
  lines.push("");
  lines.push("## Representative And Outlier Snapshots");
  lines.push("");
  lines.push("| Symbol | Kind | Atom | Image | Distance | Snapshot |");
  lines.push("| --- | --- | ---: | --- | ---: | --- |");
  for (const row of representativeRows) {
    lines.push(`| \`${row.token}\` | ${row.kind} | ${row.atom_id} | \`${row.image_name}\` | ${row.distance_to_centroid} | \`${row.snapshot_path}\` |`);
  }
  lines.push("");
  lines.push("## Scientific Reading");
  lines.push("");
  lines.push("- High within-family cohesion plus successful blind morphology-only classification supports the claim that atom labels are recurrent visual families rather than arbitrary names.");
  lines.push("- Confusable families are not failures; they identify where the alphabet needs more visual examples, sharper operational rules, or possible future merging.");
  lines.push("- This analysis deliberately ignores positional grammar, so positive results are independent from the contextual-rule reports.");
  lines.push("");
  lines.push("## Source Tables");
  lines.push("");
  lines.push("- `morphology-family-families.tsv`");
  lines.push("- `morphology-family-pairs.tsv`");
  lines.push("- `morphology-family-loo.tsv`");
  lines.push("- `morphology-family-representatives.tsv`");
  lines.push("- `morphology-family-confusion.tsv`");
  lines.push("");
  return lines.join("\n");
}

function parsePoints(pointsJson) {
  try {
    const points = JSON.parse(pointsJson);
    return Array.isArray(points)
      ? points
        .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
      : [];
  } catch {
    return [];
  }
}

function centroid(vectors) {
  const length = vectors[0]?.length ?? 0;
  return Array.from({ length }, (_, index) => mean(vectors.map((vector) => vector[index])));
}

function euclidean(a, b) {
  return Math.sqrt(squaredDistance(a, b));
}

function squaredDistance(a, b, limit = Number.POSITIVE_INFINITY) {
  let sum = 0;
  for (let index = 0; index < a.length; index += 1) {
    const delta = a[index] - b[index];
    sum += delta * delta;
    if (sum > limit) return sum;
  }
  return sum;
}

function euclideanPoint(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function quantile(sortedValues, q) {
  if (!sortedValues.length) return 0;
  const sorted = [...sortedValues].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const t = index - lower;
  return sorted[lower] * (1 - t) + sorted[upper] * t;
}

function share(count, total) {
  return total ? count / total : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function readSnapshotPaths(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift()?.split("\t") ?? [];
  const atomIdIndex = header.indexOf("entity_id");
  const typeIndex = header.indexOf("entity_type");
  const pathIndex = header.indexOf("svg_path");
  const map = new Map();
  for (const line of lines) {
    const cells = line.split("\t");
    if (cells[typeIndex] !== "atom") continue;
    map.set(cells[atomIdIndex], cells[pathIndex]);
  }
  return map;
}

function printHelp() {
  console.log(`Usage:
  node scripts/morphology-family-analysis.js --images page-003.jpg,page-094.jpg --out cases/combined-f1r-f47v-full-current/morphology-family-analysis.md

Options:
  --db <path>             DatasetCreator DB path.
  --images <csv>          Images to analyze. Default: page-003.jpg,page-094.jpg.
  --out <path>            Markdown output.
  --tsv-prefix <prefix>   Prefix for TSV outputs. Default: morphology-family.
  --snapshot-root <path>  Visual snapshot root. Default: artifacts/visual-snapshots/current.
  --min-count <n>         Minimum samples per symbol. Default: 8.
  --grid-size <n>         Occupancy grid size. Default: 16.
  --sample-points <n>     Resampled path points. Default: 32.
  --k <n>                 k for kNN. Default: 5.`);
}
