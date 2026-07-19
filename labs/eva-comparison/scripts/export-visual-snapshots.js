import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const dbPath = path.resolve(
  args.db ?? path.join(os.homedir(), "AppData", "Roaming", "com.voynichlab.datasetcreator", "datasetcreator.db")
);
const images = String(args.images ?? "page-003.jpg,page-094.jpg")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const outDir = path.resolve(process.cwd(), args.out_dir ?? "artifacts/visual-snapshots/current");
const snapshotDbPath = path.resolve(outDir, "visual-snapshots.db");
const padding = Number(args.padding ?? 16);

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const sourceDb = new DatabaseSync(dbPath, { readOnly: true });
const snapshotDb = new DatabaseSync(snapshotDbPath);
setupSnapshotDb(snapshotDb);

const imageRows = imageRowsForNames(sourceDb, images);
if (!imageRows.length) {
  console.error(`No matching images found for: ${images.join(", ")}`);
  process.exit(1);
}

const writtenRows = [];
for (const image of imageRows) {
  const atoms = atomsForImage(sourceDb, image.id);
  const atomsByParticle = groupBy(atoms, (atom) => atom.particle_id || `unassigned-particle-${atom.id}`);
  const atomsByMolecule = groupBy(atoms, (atom) => atom.molecule_id || `unassigned-molecule-${atom.id}`);
  const particles = particlesForImage(sourceDb, image.id);
  const molecules = moleculesForImage(sourceDb, image.id);

  for (const atom of atoms) {
    const token = atomToken(atom);
    writtenRows.push(writeSnapshot({
      image,
      entityType: "atom",
      entityId: String(atom.id),
      token,
      signature: token,
      atoms: [atom],
      bounds: rectFromRow(atom),
      subdir: path.join("atoms", safeName(token)),
    }));
  }

  for (const particle of particles) {
    const particleAtoms = atomsByParticle.get(particle.particle_id) ?? [];
    if (!particleAtoms.length) continue;
    const signature = orderedAtoms(particleAtoms).map(atomToken).join(" ");
    writtenRows.push(writeSnapshot({
      image,
      entityType: "particle",
      entityId: particle.particle_id,
      token: signature,
      signature,
      atoms: particleAtoms,
      bounds: rectFromRow(particle),
      subdir: "particles",
    }));
  }

  for (const molecule of molecules) {
    const moleculeAtoms = atomsByMolecule.get(molecule.molecule_id) ?? [];
    if (!moleculeAtoms.length) continue;
    const signature = orderedAtoms(moleculeAtoms).map(atomToken).join(" ");
    writtenRows.push(writeSnapshot({
      image,
      entityType: "molecule",
      entityId: molecule.molecule_id,
      token: signature,
      signature,
      atoms: moleculeAtoms,
      bounds: rectFromRow(molecule),
      subdir: "molecules",
    }));
  }
}

const insert = snapshotDb.prepare(
  `INSERT INTO visual_snapshots (
     entity_type, entity_id, image_id, image_name, token, signature,
     atom_count, bounds_x, bounds_y, bounds_w, bounds_h,
     svg_path, created_at
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
);

snapshotDb.exec("BEGIN");
snapshotDb.prepare("DELETE FROM visual_snapshots").run();
for (const row of writtenRows) {
  insert.run(
    row.entity_type,
    row.entity_id,
    row.image_id,
    row.image_name,
    row.token,
    row.signature,
    row.atom_count,
    row.bounds_x,
    row.bounds_y,
    row.bounds_w,
    row.bounds_h,
    row.svg_path
  );
}
snapshotDb.exec("COMMIT");

writeTsv(path.join(outDir, "visual-snapshots.tsv"), writtenRows, [
  "entity_type",
  "entity_id",
  "image_id",
  "image_name",
  "token",
  "signature",
  "atom_count",
  "bounds_x",
  "bounds_y",
  "bounds_w",
  "bounds_h",
  "svg_path",
]);

writeReadme(outDir, writtenRows);

console.log(`Wrote ${writtenRows.length} visual snapshots to ${outDir}`);
console.log(`Wrote snapshot index DB to ${snapshotDbPath}`);

function writeSnapshot({ image, entityType, entityId, token, signature, atoms, bounds, subdir }) {
  const padded = padRect(bounds, padding, image.width, image.height);
  const relativeDir = path.join(subdir, safeName(image.name));
  const targetDir = path.join(outDir, relativeDir);
  fs.mkdirSync(targetDir, { recursive: true });
  const fileName = `${safeName(entityId)}.svg`;
  const filePath = path.join(targetDir, fileName);
  const svg = renderSvg({ image, entityType, entityId, token, signature, atoms, rect: padded });
  fs.writeFileSync(filePath, svg, "utf8");

  return {
    entity_type: entityType,
    entity_id: entityId,
    image_id: image.id,
    image_name: image.name,
    token,
    signature,
    atom_count: atoms.length,
    bounds_x: fixed(padded.x),
    bounds_y: fixed(padded.y),
    bounds_w: fixed(padded.w),
    bounds_h: fixed(padded.h),
    svg_path: path.relative(outDir, filePath),
  };
}

function renderSvg({ image, entityType, entityId, token, signature, atoms, rect }) {
  const width = Math.max(1, Math.ceil(rect.w));
  const height = Math.max(1, Math.ceil(rect.h));
  const imageHref = fileUrl(image.source_path);
  const polylines = orderedAtoms(atoms).map((atom) => atomPolyline(atom, rect)).join("\n");
  const title = `${entityType} ${entityId} ${token}`;
  const meta = {
    entityType,
    entityId,
    token,
    signature,
    imageName: image.name,
    imageId: image.id,
    bounds: rect,
    atoms: orderedAtoms(atoms).map((atom) => ({
      id: atom.id,
      token: atomToken(atom),
      particle_id: atom.particle_id,
      molecule_id: atom.molecule_id,
      atom_order: atom.atom_order,
    })),
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>${escapeXml(title)}</title>
  <metadata>${escapeXml(JSON.stringify(meta))}</metadata>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#f8f0d8"/>
  <image href="${escapeXml(imageHref)}" x="${fixed(-rect.x)}" y="${fixed(-rect.y)}" width="${image.width}" height="${image.height}" opacity="0.92"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#111827" stroke-width="1" opacity="0.35"/>
${polylines}
</svg>
`;
}

function atomPolyline(atom, rect) {
  const points = parsePoints(atom.points_json);
  if (!points.length) return "";
  const shifted = points
    .map((point) => `${fixed(point.x - rect.x)},${fixed(point.y - rect.y)}`)
    .join(" ");
  const color = atom.color || "#00b7ff";
  return `  <polyline points="${shifted}" fill="none" stroke="${escapeXml(color)}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
    <title>${escapeXml(`${atom.id} ${atomToken(atom)}`)}</title>
  </polyline>`;
}

function imageRowsForNames(db, names) {
  const filter = names.length ? `WHERE name IN (${names.map(() => "?").join(",")})` : "";
  return db
    .prepare(`SELECT id, name, source_path, width, height FROM images ${filter} ORDER BY id`)
    .all(...names)
    .filter((row) => fs.existsSync(row.source_path));
}

function atomsForImage(db, imageId) {
  return db
    .prepare(
      `SELECT
         a.id, a.region_id, a.image_id, a.family, a.color, a.points_json,
         a.anchor_x, a.anchor_y, a.bounds_x, a.bounds_y, a.bounds_w, a.bounds_h,
         a.visual_variant, a.structural_config, a.molecule_id, a.particle_id, a.atom_order,
         p.particle_order
       FROM atoms a
       LEFT JOIN particles p ON p.particle_id = a.particle_id AND p.image_id = a.image_id
       WHERE a.image_id = ? AND a.molecule_id IS NOT NULL
       ORDER BY a.molecule_id, p.particle_order, a.particle_id, a.atom_order, a.bounds_x, a.id`
    )
    .all(imageId);
}

function particlesForImage(db, imageId) {
  return db
    .prepare(
      `SELECT particle_id, molecule_id, image_id, atom_count, particle_order,
              bounds_x, bounds_y, bounds_w, bounds_h
       FROM particles
       WHERE image_id = ?
       ORDER BY molecule_id, particle_order, bounds_x, id`
    )
    .all(imageId);
}

function moleculesForImage(db, imageId) {
  return db
    .prepare(
      `SELECT molecule_id, image_id, atom_count, bounds_x, bounds_y, bounds_w, bounds_h
       FROM molecules
       WHERE image_id = ?
       ORDER BY bounds_y, bounds_x, id`
    )
    .all(imageId);
}

function setupSnapshotDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS visual_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      image_id INTEGER NOT NULL,
      image_name TEXT NOT NULL,
      token TEXT NOT NULL,
      signature TEXT NOT NULL,
      atom_count INTEGER NOT NULL,
      bounds_x REAL NOT NULL,
      bounds_y REAL NOT NULL,
      bounds_w REAL NOT NULL,
      bounds_h REAL NOT NULL,
      svg_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(entity_type, entity_id, image_id)
    );
    CREATE INDEX IF NOT EXISTS idx_visual_snapshots_token ON visual_snapshots(token);
    CREATE INDEX IF NOT EXISTS idx_visual_snapshots_signature ON visual_snapshots(signature);
    CREATE INDEX IF NOT EXISTS idx_visual_snapshots_image ON visual_snapshots(image_id);
  `);
}

function writeReadme(directory, rows) {
  const counts = countBy(rows, (row) => row.entity_type);
  const lines = [
    "# Visual Snapshots",
    "",
    "Generated from DatasetCreator geometry. SVG files reference the original manuscript page image and overlay the hand-painted atom strokes.",
    "",
    "## Counts",
    "",
    `- Atoms: \`${counts.atom ?? 0}\``,
    `- Particles: \`${counts.particle ?? 0}\``,
    `- Molecules: \`${counts.molecule ?? 0}\``,
    "",
    "## Files",
    "",
    "- `visual-snapshots.db`: SQLite index for querying snapshots by token, signature, image, and entity.",
    "- `visual-snapshots.tsv`: flat manifest with the same core metadata.",
    "- `atoms/<token>/<image>/<atom-id>.svg`: one visual sample per labeled atom.",
    "- `particles/<image>/<particle-id>.svg`: one sample per particle.",
    "- `molecules/<image>/<molecule-id>.svg`: one sample per molecule.",
    "",
    "These are evidence artifacts, not new labels. They should be regenerated from the source DB after label changes.",
    "",
  ];
  fs.writeFileSync(path.join(directory, "README.md"), lines.join("\n"), "utf8");
}

function orderedAtoms(atoms) {
  return [...atoms].sort((a, b) =>
    Number(a.particle_order ?? Number.MAX_SAFE_INTEGER) - Number(b.particle_order ?? Number.MAX_SAFE_INTEGER)
    || String(a.particle_id ?? "").localeCompare(String(b.particle_id ?? ""))
    || Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.id) - Number(b.id)
  );
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

function rectFromRow(row) {
  return {
    x: Number(row.bounds_x) || 0,
    y: Number(row.bounds_y) || 0,
    w: Math.max(1, Number(row.bounds_w) || 1),
    h: Math.max(1, Number(row.bounds_h) || 1),
  };
}

function padRect(rect, amount, maxW, maxH) {
  const x = Math.max(0, rect.x - amount);
  const y = Math.max(0, rect.y - amount);
  const right = Math.min(maxW, rect.x + rect.w + amount);
  const bottom = Math.min(maxH, rect.y + rect.h + amount);
  return {
    x,
    y,
    w: Math.max(1, right - x),
    h: Math.max(1, bottom - y),
  };
}

function atomToken(atom) {
  const family = cleanAtomKey(atom.family);
  const config = cleanAtomKey(atom.structural_config ?? "");
  return config ? `${family}:${config}` : family;
}

function cleanAtomKey(value) {
  return String(value ?? "").trim().replace(/_base$/i, "").toLowerCase();
}

function groupBy(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function writeTsv(filePath, rows, fields) {
  fs.writeFileSync(
    filePath,
    [
      fields.join("\t"),
      ...rows.map((row) => fields.map((field) => tsvCell(row[field])).join("\t")),
    ].join("\n") + "\n",
    "utf8"
  );
}

function tsvCell(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

function safeName(value) {
  return String(value ?? "")
    .trim()
    .replace(/[:\\/*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^\.+$/, "_")
    || "unnamed";
}

function fileUrl(filePath) {
  const resolved = path.resolve(filePath).replaceAll("\\", "/");
  return `file:///${resolved.replace(/^([A-Za-z]):/, "$1:")}`;
}

function fixed(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

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
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  node scripts/export-visual-snapshots.js --images page-003.jpg,page-094.jpg --out-dir artifacts/visual-snapshots/current

Options:
  --db <path>        Path to DatasetCreator SQLite DB.
  --images <csv>    Image names to export. Default: page-003.jpg,page-094.jpg.
  --out-dir <path>  Output directory. Default: artifacts/visual-snapshots/current.
  --padding <px>    Crop padding around each entity. Default: 16.`);
}
