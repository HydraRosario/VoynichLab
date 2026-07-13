import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset || !args.out) {
  console.error('Usage: node scripts/build-root-workbench.js --dataset <dataset.json> --out <roots-workbench.tsv>');
  process.exit(1);
}

const datasetPath = path.resolve(args.dataset);
const outPath = path.resolve(args.out);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const rows = collectRows(dataset);
const tsv = [
  [
    'token',
    'level',
    'count',
    'colors',
    'unit_examples',
    'current_role',
    'candidate_language',
    'candidate_root',
    'candidate_gloss',
    'confidence',
    'notes',
  ].join('\t'),
  ...rows.map((row) => [
    row.token,
    row.level,
    row.count,
    [...row.colors].sort().join(', '),
    [...row.unitExamples].sort((a, b) => a - b).slice(0, 8).join(', '),
    row.currentRole,
    '',
    '',
    '',
    '',
    '',
  ].map(cleanTsv).join('\t')),
].join('\n');

fs.writeFileSync(outPath, tsv);

function collectRows(dataset) {
  const map = new Map();

  for (const unit of dataset.units || []) {
    add(map, unit.reading, 'unit', unit.order, null, 'romanized unit');

    for (const part of unit.parts || []) {
      add(map, part.reading, 'visual_part', unit.order, null, 'morphological chunk');

      for (const stroke of part.strokes || []) {
        add(map, stroke.reading, 'stroke', unit.order, stroke.color, 'stroke value');
      }
    }
  }

  return [...map.values()].sort((a, b) => {
    const levelOrder = { stroke: 0, visual_part: 1, unit: 2 };
    return (levelOrder[a.level] ?? 9) - (levelOrder[b.level] ?? 9)
      || b.count - a.count
      || a.token.localeCompare(b.token);
  });
}

function add(map, rawToken, level, unitOrder, color, currentRole) {
  const token = String(rawToken || '').trim();
  if (!token) return;
  const key = `${level}:${token}`;
  if (!map.has(key)) {
    map.set(key, {
      token,
      level,
      count: 0,
      colors: new Set(),
      unitExamples: new Set(),
      currentRole,
    });
  }

  const row = map.get(key);
  row.count += 1;
  if (color) row.colors.add(color);
  if (unitOrder) row.unitExamples.add(unitOrder);
}

function cleanTsv(value) {
  return String(value ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
}

function parseArgs(items) {
  const parsed = {};
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    parsed[key] = items[index + 1] && !items[index + 1].startsWith('--') ? items[++index] : true;
  }
  return parsed;
}
