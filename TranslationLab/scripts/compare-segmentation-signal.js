import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset || !args.assembly) {
  console.error('Usage: node scripts/compare-segmentation-signal.js --dataset <dataset.json> --assembly <translation-assembly.json> [--out report.md]');
  process.exit(1);
}

const datasetPath = path.resolve(args.dataset);
const assemblyPath = path.resolve(args.assembly);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const assembly = JSON.parse(fs.readFileSync(assemblyPath, 'utf8'));
const rootTokens = collectRootTokens(assembly);
const units = (dataset.units || [])
  .slice()
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
  .map((unit) => profileUnit(unit, rootTokens));
const formulas = (assembly.formulas || []).map((formula) => profileFormula(formula, dataset.units || []));

const report = renderReport({
  datasetArg: args.dataset,
  assemblyArg: args.assembly,
  units,
  formulas,
  rootTokens,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

function collectRootTokens(assembly) {
  return (assembly.inventory || [])
    .map((root) => root.token)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length || a.localeCompare(b));
}

function profileUnit(unit, rootTokens) {
  const reading = clean(unit.reading);
  const visualParts = (unit.parts || [])
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((part) => clean(part.reading))
    .filter(Boolean);
  const visualSegmentation = visualParts.join('|');
  const possibleFlatSegmentations = countSegmentations(reading, rootTokens);

  return {
    order: Number(unit.order || 0),
    reading,
    visualSegmentation,
    visualPartCount: visualParts.length,
    possibleFlatSegmentations,
    ambiguityClass: classifyAmbiguity(possibleFlatSegmentations),
  };
}

function countSegmentations(text, tokens) {
  const memo = new Map();
  const cap = 100000;

  function solve(offset) {
    if (offset === text.length) return 1;
    if (memo.has(offset)) return memo.get(offset);

    let count = 0;
    for (const token of tokens) {
      if (!text.startsWith(token, offset)) continue;
      count += solve(offset + token.length);
      if (count >= cap) {
        count = cap;
        break;
      }
    }
    memo.set(offset, count);
    return count;
  }

  return solve(0);
}

function classifyAmbiguity(count) {
  if (count === 0) return 'flat-no-puede-reconstruir';
  if (count === 1) return 'sin-ambiguedad';
  if (count <= 5) return 'ambiguedad-baja';
  if (count <= 50) return 'ambiguedad-media';
  return 'ambiguedad-alta';
}

function profileFormula(formula, datasetUnits) {
  const tokens = formula.formula.split('|');
  const flat = tokens.join('');
  const rawHits = [];

  for (const unit of datasetUnits) {
    const reading = clean(unit.reading);
    const occurrences = countSubstring(reading, flat);
    if (occurrences > 0) {
      rawHits.push({ order: unit.order, occurrences });
    }
  }

  const rawCount = rawHits.reduce((sum, hit) => sum + hit.occurrences, 0);
  const boundaryCount = Number(formula.count || 0);
  const flatAgreement = boundaryCount ? Math.min(rawCount / boundaryCount, 1) : 0;

  return {
    formula: formula.formula,
    flat,
    boundaryCount,
    rawCount,
    flatAgreement,
    units: formula.units || [],
    rawUnits: rawHits.map((hit) => `${hit.order}${hit.occurrences > 1 ? `x${hit.occurrences}` : ''}`),
    verdict: classifyFormula(boundaryCount, rawCount, flatAgreement),
  };
}

function countSubstring(text, needle) {
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while (offset <= text.length - needle.length) {
    const found = text.indexOf(needle, offset);
    if (found === -1) break;
    count += 1;
    offset = found + 1;
  }
  return count;
}

function classifyFormula(boundaryCount, rawCount, agreement) {
  if (!rawCount) return 'solo-visible-en-segmentacion';
  if (boundaryCount >= 2 && rawCount < boundaryCount) return 'segmentacion-con-mutacion';
  if (boundaryCount >= 2 && agreement >= 0.9) return 'segmentacion-fuerte';
  if (boundaryCount >= 2 && agreement >= 0.6) return 'segmentacion-util';
  if (boundaryCount >= 2) return 'aparece-pero-con-ruido';
  return 'debil';
}

function renderReport({ datasetArg, assemblyArg, units, formulas, rootTokens }) {
  const avgAmbiguity = average(units.map((unit) => unit.possibleFlatSegmentations));
  const highAmbiguity = units.filter((unit) => unit.possibleFlatSegmentations > 5).length;
  const impossibleFlat = units.filter((unit) => unit.possibleFlatSegmentations === 0).length;
  const strongFormulas = formulas.filter((formula) => formula.verdict === 'segmentacion-fuerte').length;

  const lines = [
    '# VoynichLab - Segmentation Signal Test',
    '',
    `- dataset: ${datasetArg}`,
    `- assembly: ${assemblyArg}`,
    `- root tokens tested: ${rootTokens.length}`,
    `- units: ${units.length}`,
    `- average flat ambiguity: ${avgAmbiguity.toFixed(2)}`,
    `- high-ambiguity flat units: ${highAmbiguity}`,
    `- impossible flat reconstructions: ${impossibleFlat}`,
    `- strong segmented formulas: ${strongFormulas}`,
    '',
    '## Resultado en simple',
    '',
    'Esta prueba pregunta si las partes visuales que marcaste agregan informacion. Si una formula aparece repetida justo en limites visuales, y no aparece como accidente por todos lados en el texto plano, entonces el etiquetado visual esta capturando estructura.',
    '',
    '## Formulas visuales contra texto plano',
    '',
    '| formula visual | texto plano esperado | veces con limite visual | veces como substring plano | acuerdo con plano | veredicto |',
    '| --- | --- | ---: | ---: | ---: | --- |',
  ];

  for (const formula of formulas.slice(0, 24)) {
    lines.push(`| ${cell(formula.formula)} | ${formula.flat} | ${formula.boundaryCount} | ${formula.rawCount} | ${formula.flatAgreement.toFixed(2)} | ${formula.verdict} |`);
  }

  lines.push('', '## Ambiguedad por unidad', '');
  lines.push('| unidad | romanizacion | segmentacion visual | segmentaciones planas posibles | veredicto |');
  lines.push('| ---: | --- | --- | ---: | --- |');
  for (const unit of units) {
    lines.push(`| ${unit.order} | ${unit.reading} | ${cell(unit.visualSegmentation)} | ${unit.possibleFlatSegmentations} | ${unit.ambiguityClass} |`);
  }

  lines.push(
    '',
    '## Lectura cientifica',
    '',
    'Si las formulas fuertes sobreviven en otros parrafos, tenemos evidencia a favor de que la llave no es solo romanizacion arbitraria: estaria capturando unidades visuales con funcion repetible.',
    '',
    'Cuando una formula tiene mas apariciones visuales que apariciones planas, no se trata como error automatico. Se marca como segmentacion-con-mutacion, porque puede indicar que la gramatica comprime o modifica sonidos al unir partes.',
    '',
    'Si el texto plano produce demasiadas segmentaciones alternativas, entonces el modelo no debe aprender solo romanizacion. Debe aprender imagen -> limites visuales -> raiz.',
    '',
  );

  return lines.join('\n');
}

function clean(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
}

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function average(values) {
  const cleanValues = values.filter((value) => Number.isFinite(value));
  if (!cleanValues.length) return 0;
  return cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length;
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
