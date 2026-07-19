import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset) {
  console.error('Usage: node scripts/boundary-audit.js --dataset <dataset.json> [--out report.md]');
  process.exit(1);
}

const datasetPath = path.resolve(args.dataset);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const rows = (dataset.units || []).map((unit) => {
  const reading = normalize(unit.reading);
  const parts = (unit.parts || []).map((part) => normalize(part.reading)).filter(Boolean);
  const joined = parts.join('');
  return {
    order: unit.order,
    reading,
    segmented: parts.join('|'),
    partCount: parts.length,
    joined,
    exact: reading === joined,
  };
});

const exactCount = rows.filter((row) => row.exact).length;
const report = [
  '# VoynichLab Boundary Audit',
  '',
  `- dataset: ${datasetPath}`,
  `- units: ${rows.length}`,
  `- units where unit reading equals visual-part concatenation: ${exactCount}/${rows.length}`,
  '',
  '## Scientific Meaning',
  '',
  'If the segmented visual-part reading is coherent but the flat romanization is hard to split, the missing layer is boundary preservation, not necessarily glyph reading.',
  '',
  'The translation engine should consume segmented romanization, not only flat strings.',
  '',
  '## Units',
  '',
  ...rows.map((row) => [
    `### Unit ${row.order}`,
    '',
    `- flat: ${row.reading}`,
    `- segmented: ${row.segmented || 'sin partes'}`,
    `- match: ${row.exact ? 'yes' : 'no'}`,
    '',
  ].join('\n')),
].join('\n');

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report);
} else {
  console.log(report);
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
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
