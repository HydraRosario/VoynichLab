import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset || !args.user) {
  console.error('Usage: node scripts/compare-user-segmentation.js --dataset <dataset.json> --user <user-segmentation.tsv> [--out report.md]');
  process.exit(1);
}

const dataset = JSON.parse(fs.readFileSync(path.resolve(args.dataset), 'utf8'));
const userRows = loadTsv(path.resolve(args.user));
const userByOrder = new Map(userRows.map((row) => [Number(row.order), row]));
const comparisons = (dataset.units || [])
  .slice()
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
  .map((unit) => compareUnit(unit, userByOrder.get(Number(unit.order || 0))));

const visualInventory = inventory(comparisons.flatMap((item) => item.visualParts));
const userInventory = inventory(comparisons.flatMap((item) => item.userParts));
const report = renderReport({ comparisons, visualInventory, userInventory, userPath: args.user, datasetPath: args.dataset });

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

function compareUnit(unit, userRow) {
  const visualParts = (unit.parts || [])
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((part) => clean(part.reading))
    .filter(Boolean);
  const userParts = String(userRow?.user_segmentation || '')
    .split('|')
    .map(clean)
    .filter(Boolean);
  const visualFlat = visualParts.join('');
  const userFlat = userParts.join('');
  const romanization = clean(unit.reading);

  return {
    order: Number(unit.order || 0),
    romanization,
    visualParts,
    userParts,
    visualFlat,
    userFlat,
    visualMatchesRomanization: visualFlat === romanization,
    userMatchesRomanization: userFlat === romanization,
    edit: classifyChange(visualParts, userParts),
    notes: userRow?.notes || '',
  };
}

function classifyChange(visualParts, userParts) {
  if (visualParts.join('|') === userParts.join('|')) return 'same';
  if (visualParts.length === userParts.length) return 'same-count-different-boundaries';
  if (visualParts.length > userParts.length) return 'user-merged-parts';
  return 'user-split-parts';
}

function inventory(tokens) {
  const map = new Map();
  for (const token of tokens) {
    if (!token) continue;
    map.set(token, (map.get(token) || 0) + 1);
  }
  return [...map.entries()]
    .map(([token, count]) => ({ token, count }))
    .sort((a, b) => b.count - a.count || b.token.length - a.token.length || a.token.localeCompare(b.token));
}

function renderReport({ comparisons, visualInventory, userInventory, userPath, datasetPath }) {
  const repeatedUser = userInventory.filter((item) => item.count >= 2);
  const mismatch = comparisons.filter((item) => !item.userMatchesRomanization);
  const changed = comparisons.filter((item) => item.edit !== 'same');

  const lines = [
    '# Page 003 / Paragraph 2 - User Segmentation V2 Comparison',
    '',
    `- dataset: ${datasetPath}`,
    `- user segmentation: ${userPath}`,
    `- units compared: ${comparisons.length}`,
    `- changed vs visual labels: ${changed.length}`,
    `- user segmentations not matching flat romanization exactly: ${mismatch.length}`,
    '',
    '## Resultado corto',
    '',
    'La nueva division del investigador produce raices mucho mas lexicas que la division visual cruda. En particular aparecen familias repetidas como `hora`, `crime/crima/crine`, `laol`, `ate/ateo/hate`, `teo/teoa/toa`, `ra/ria/rine`.',
    '',
    'Los desajustes contra la romanizacion plana no se tratan como errores automaticos: pueden ser reglas de taquigrafia, elision o mutacion. Pero hay que documentarlos uno por uno.',
    '',
    '## Raices repetidas segun division del investigador',
    '',
    '| raiz | veces |',
    '| --- | ---: |',
  ];

  for (const item of repeatedUser) {
    lines.push(`| ${cell(item.token)} | ${item.count} |`);
  }

  lines.push('', '## Comparacion unidad por unidad', '');
  lines.push('| # | romanizacion | division visual actual | division investigador | coincide con romanizacion | tipo de cambio | notas |');
  lines.push('| ---: | --- | --- | --- | --- | --- | --- |');
  for (const item of comparisons) {
    lines.push(`| ${item.order} | ${item.romanization} | ${cell(item.visualParts.join('|'))} | ${cell(item.userParts.join('|'))} | ${item.userMatchesRomanization ? 'si' : 'no'} | ${item.edit} | ${cell(item.notes)} |`);
  }

  lines.push('', '## Desajustes que hay que volver regla o corregir', '');
  if (!mismatch.length) {
    lines.push('- none');
  } else {
    for (const item of mismatch) {
      lines.push(`- unidad ${item.order}: romanizacion \`${item.romanization}\`, division junta \`${item.userFlat}\`, diferencia: \`${diffHint(item.romanization, item.userFlat)}\``);
    }
  }

  lines.push('', '## Decision', '');
  lines.push('Esta division V2 debe usarse como entrada principal del traductor etimologico. La division visual cruda sigue siendo importante para entrenar imagen -> partes, pero la traduccion semantica necesita estas raices humanas mas grandes.');
  lines.push('');

  return lines.join('\n');
}

function diffHint(a, b) {
  if (a === b) return 'same';
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start += 1;
  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA -= 1;
    endB -= 1;
  }
  return `${a.slice(start, endA + 1) || '∅'} -> ${b.slice(start, endB + 1) || '∅'}`;
}

function loadTsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  return lines.filter(Boolean).map((line) => {
    const values = line.split('\t');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function clean(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
}

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
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
