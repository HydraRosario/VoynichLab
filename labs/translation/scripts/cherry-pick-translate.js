import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.romanizations || !args.etymology) {
  console.error('Usage: node scripts/cherry-pick-translate.js --romanizations <romanizations.txt> --etymology <raw-etymology.tsv> [--extraEtymology seeds.tsv] [--out report.md]');
  process.exit(1);
}

const romanizationsPath = path.resolve(args.romanizations);
const etymologyPath = path.resolve(args.etymology);
const romanizations = loadRomanizations(romanizationsPath);
const etymology = loadEtymology(etymologyPath);
if (args.extraEtymology) {
  mergeEtymology(etymology, loadEtymology(path.resolve(args.extraEtymology)));
}
const tokens = [...etymology.keys()]
  .filter((token) => token.length >= Number(args.minLen || 2))
  .sort((a, b) => b.length - a.length || a.localeCompare(b));

const units = romanizations.map((word, index) => ({
  order: index + 1,
  romanization: word,
  candidates: rankSegmentations(word, tokens, etymology).slice(0, Number(args.limit || 10)),
}));

const selected = units.map((unit) => ({
  ...unit,
  selected: chooseBestCandidate(unit.candidates),
}));

const report = renderReport({
  romanizationsPath: args.romanizations,
  etymologyPath: args.etymology,
  units: selected,
  etymology,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

if (args.json) {
  fs.writeFileSync(path.resolve(args.json), JSON.stringify(renderDecisionJson({
    romanizationsPath: args.romanizations,
    etymologyPath: args.etymology,
    units: selected,
  }), null, 2), 'utf8');
}

function rankSegmentations(word, tokens, etymology) {
  const memo = new Map();
  const maxCandidates = 160;

  function solve(offset) {
    if (offset === word.length) return [{ parts: [], score: 0, unknown: 0 }];
    if (memo.has(offset)) return memo.get(offset);

    const results = [];
    for (const token of tokens) {
      if (!word.startsWith(token, offset)) continue;
      for (const tail of solve(offset + token.length)) {
        const root = etymology.get(token);
        results.push({
          parts: [{ token, root }, ...tail.parts],
          score: rootScore(token, root) + tail.score,
          unknown: tail.unknown,
        });
      }
    }

    const unknown = word.slice(offset, offset + 1);
    for (const tail of solve(offset + 1)) {
      results.push({
        parts: [{ token: unknown, root: null }, ...tail.parts],
        score: -2 + tail.score,
        unknown: tail.unknown + 1,
      });
    }

    const ranked = dedupe(results)
      .map((candidate) => finalizeCandidate(candidate, word))
      .sort((a, b) => b.score - a.score || a.unknown - b.unknown || a.parts.length - b.parts.length)
      .slice(0, maxCandidates);
    memo.set(offset, ranked);
    return ranked;
  }

  return solve(0);
}

function finalizeCandidate(candidate, word) {
  const knownParts = candidate.parts.filter((part) => part.root);
  const strongParts = knownParts.filter((part) => part.root.status === 'inspect');
  const weakParts = knownParts.filter((part) => part.root.status === 'weak');
  const shortParts = candidate.parts.filter((part) => part.token.length <= 2);
  const longParts = candidate.parts.filter((part) => part.token.length >= 4);
  const semanticHints = knownParts.flatMap((part) => extractGlossHints(part.root)).filter(Boolean);
  const coherence = semanticCoherence(semanticHints);

  let score = candidate.score;
  score += strongParts.length * 2.5;
  score += weakParts.length * 0.5;
  score += longParts.length * 0.8;
  score += coherence * 1.2;
  score -= shortParts.length * 0.35;
  score -= Math.max(0, candidate.parts.length - 4) * 0.45;

  return {
    ...candidate,
    word,
    score,
    strong: strongParts.length,
    known: knownParts.length,
    hints: semanticHints.slice(0, 8),
    gloss: candidate.parts.map((part) => part.root ? glossFor(part.root) : '?').join(' + '),
  };
}

function chooseBestCandidate(candidates) {
  const useful = candidates.filter((candidate) => candidate.strong || candidate.hints.length);
  return useful[0] || candidates[0] || null;
}

function rootScore(token, root) {
  if (!root) return -2;
  let score = Math.min(Number(root.confidence || 0) / 2, 6);
  if (root.status === 'inspect') score += 4;
  if (root.status === 'weak') score += 1;
  if (root.status === 'noisy') score -= 0.5;
  if (root.has_etymology === 'yes') score += 1.5;
  if (token.length >= 4) score += 1.2;
  if (token.length <= 2) score -= 1.2;
  score += Math.min(Number(root.count || 0) * 0.2, 1.5);
  return score;
}

function semanticCoherence(hints) {
  const text = hints.join(' ').toLowerCase();
  const fields = [
    ['crime', 'criminal', 'sin', 'wickedness', 'murder', 'offence', 'felony'],
    ['hate', 'hatred', 'anger', 'enmity', 'dislike'],
    ['heat', 'hot', 'warm', 'fire'],
    ['hour', 'time', 'circle', 'dance'],
    ['name', 'called'],
    ['liver', 'body'],
    ['water', 'swamp', 'morass'],
  ];
  return fields.reduce((score, words) => score + (words.some((word) => text.includes(word)) ? 1 : 0), 0);
}

function renderReport({ romanizationsPath, etymologyPath, units, etymology }) {
  const rootUse = new Map();
  for (const unit of units) {
    for (const part of unit.selected?.parts || []) {
      if (!part.root) continue;
      if (!rootUse.has(part.token)) rootUse.set(part.token, { token: part.token, count: 0, root: part.root, units: [] });
      const item = rootUse.get(part.token);
      item.count += 1;
      item.units.push(unit.order);
    }
  }

  const usedRoots = [...rootUse.values()]
    .sort((a, b) => b.count - a.count || rootScore(b.token, b.root) - rootScore(a.token, a.root));

  const lines = [
    '# VoynichLab - Cherry Pick Translation Draft',
    '',
    `- romanizations: ${romanizationsPath}`,
    `- etymology: ${etymologyPath}`,
    `- mode: opportunistic / cherry-pick audited`,
    '',
    '## Regla de esta corrida',
    '',
    'Esta salida intenta sacar el mejor texto posible con lo que hay. Puede elegir separaciones convenientes, pero deja registro de cada eleccion. Esto no es prueba final; es una herramienta para descubrir que valores de la llave empiezan a rendir y cuales no.',
    '',
    '## Raices elegidas por la corrida',
    '',
    '| raiz | veces | unidades | estado | glosa util |',
    '| --- | ---: | --- | --- | --- |',
  ];

  for (const item of usedRoots) {
    lines.push(`| ${cell(item.token)} | ${item.count} | ${item.units.join(', ')} | ${item.root.status} | ${cell(glossFor(item.root))} |`);
  }

  lines.push('', '## Mejor lectura por unidad', '');
  lines.push('| # | romanizacion | separacion elegida | score | glosa |');
  lines.push('| ---: | --- | --- | ---: | --- |');
  for (const unit of units) {
    const selected = unit.selected;
    lines.push(`| ${unit.order} | ${unit.romanization} | ${cell(selected?.parts.map((part) => part.token).join('|') || '-')} | ${(selected?.score || 0).toFixed(2)} | ${cell(selected?.gloss || '-')} |`);
  }

  lines.push('', '## Traduccion propuesta', '');
  lines.push('');
  lines.push(buildTranslationDraft(units));
  lines.push('');
  lines.push('## Auditoria breve', '');
  lines.push('');
  for (const note of buildSupportNotes(units)) {
    lines.push(`- ${note}`);
  }
  lines.push('');

  lines.push('## Donde la llave esta fallando', '');
  lines.push('');
  const weak = units.filter((unit) => (unit.selected?.unknown || 0) > 0 || !(unit.selected?.strong));
  if (!weak.length) {
    lines.push('- No hay unidades debiles en esta corrida.');
  } else {
    for (const unit of weak) {
      const selected = unit.selected;
      lines.push(`- ${unit.order}. ${unit.romanization}: ${selected?.parts.map((part) => part.token).join('|')} -> ${selected?.gloss || '-'}; revisar porque tiene poca senal o partes desconocidas.`);
    }
  }

  lines.push('', '## Candidatos alternativos por unidad', '');
  for (const unit of units) {
    lines.push(`### ${unit.order}. ${unit.romanization}`);
    lines.push('');
    lines.push('| rank | separacion | score | glosa |');
    lines.push('| ---: | --- | ---: | --- |');
    unit.candidates.slice(0, 5).forEach((candidate, index) => {
      lines.push(`| ${index + 1} | ${cell(candidate.parts.map((part) => part.token).join('|'))} | ${candidate.score.toFixed(2)} | ${cell(candidate.gloss)} |`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

function renderDecisionJson({ romanizationsPath, etymologyPath, units }) {
  const roots = new Map();

  for (const unit of units) {
    for (const part of unit.selected?.parts || []) {
      if (!part.root) continue;
      if (!roots.has(part.token)) {
        roots.set(part.token, {
          token: part.token,
          count: 0,
          status: part.root.status || '',
          confidence: Number(part.root.confidence || 0),
          gloss: glossFor(part.root),
          sources: sourceSummary(part.root),
          units: [],
        });
      }
      const root = roots.get(part.token);
      root.count += 1;
      root.units.push(unit.order);
    }
  }

  return {
    meta: {
      romanizationsPath,
      etymologyPath,
      unitCount: units.length,
    },
    translationDraft: buildTranslationDraft(units),
    supportNotes: buildSupportNotes(units),
    roots: [...roots.values()].sort((a, b) => b.count - a.count || b.confidence - a.confidence),
    units: units.map((unit) => ({
      order: unit.order,
      romanization: unit.romanization,
      selected: decisionCandidate(unit.selected),
      alternatives: unit.candidates.slice(0, 6).map(decisionCandidate),
    })),
  };
}

function decisionCandidate(candidate) {
  if (!candidate) return null;
  return {
    segmentation: candidate.parts.map((part) => part.token),
    score: Number(candidate.score || 0),
    unknown: Number(candidate.unknown || 0),
    strong: Number(candidate.strong || 0),
    known: Number(candidate.known || 0),
    gloss: candidate.gloss || '',
    hints: candidate.hints || [],
    parts: candidate.parts.map((part) => ({
      token: part.token,
      known: Boolean(part.root),
      status: part.root?.status || '',
      confidence: Number(part.root?.confidence || 0),
      gloss: part.root ? glossFor(part.root) : '?',
      sources: part.root ? sourceSummary(part.root) : [],
    })),
  };
}

function sourceSummary(root) {
  const sources = [];
  if (root.top_wiktionary_candidates) sources.push('Wiktionary');
  if (root.top_wikipedia_candidates) sources.push('Wikipedia');
  if (root.top_datamuse_candidates) sources.push('Datamuse');
  if (root.top_omniglot_candidates) sources.push('Omniglot');
  return sources;
}

function buildTranslationDraft(units) {
  const chosenText = units.map((unit) => (unit.selected?.hints || []).join(' ')).join(' ').toLowerCase();
  const hasCrime = /crime|criminal|sin|wickedness|murder|offence|felony/.test(chosenText);
  const hasHate = /hate|hatred|anger|enmity|dislike/.test(chosenText);
  const hasHeat = /heat|hot|warm/.test(chosenText);
  const hasTime = /hour|time|circle|dance/.test(chosenText);
  const hasName = /called|name/.test(chosenText);
  const hasBody = /liver|body/.test(chosenText);

  const first = hasTime
    ? 'En el ciclo del tiempo aparece una vuelta marcada por una falta.'
    : 'Aparece una falta en el comienzo de la lectura.';
  const second = hasCrime
    ? 'La falta se abre como transgresion y arrastra peligro.'
    : 'La accion queda oscura y todavia no se deja fijar.';
  const third = hasHate || hasHeat
    ? 'El calor y la ira rodean lo nombrado, como una fuerza que habla o presiona.'
    : 'Lo nombrado permanece comprimido y exige una llave mejor.';
  const fourth = hasBody
    ? 'Hacia el cierre aparece un cuerpo o materia interna, atada a transformacion.'
    : 'Hacia el cierre quedan formas compactas, utiles para corregir la romanizacion.';

  return `> ${first} ${second} ${third} ${fourth}`;
}

function buildSupportNotes(units) {
  const chosenText = units.map((unit) => (unit.selected?.hints || []).join(' ')).join(' ').toLowerCase();
  const notes = [];
  const fields = [
    ['tiempo/ciclo', /hour|time|circle|dance/],
    ['falta/transgresion', /crime|criminal|sin|wickedness|murder|offence|felony/],
    ['ira/peligro', /hate|hatred|anger|enmity|dislike/],
    ['calor/intensidad', /heat|hot|warm/],
    ['nombre/codigo/habla', /called|name/],
    ['cuerpo/materia', /liver|body/],
  ];
  for (const [label, pattern] of fields) {
    if (pattern.test(chosenText)) notes.push(`senal encontrada: ${label}.`);
  }
  const weak = units.filter((unit) => (unit.selected?.unknown || 0) > 0 || !(unit.selected?.strong)).length;
  notes.push(`${weak} unidades siguen presionando la llave porque tienen poca senal o partes desconocidas.`);
  return notes;
}

function glossFor(root) {
  const hints = extractGlossHints(root);
  return hints[0] || root.token || '?';
}

function extractGlossHints(root) {
  if (!root) return [];
  const values = [
    root.top_wiktionary_candidates,
    root.top_datamuse_candidates,
    root.top_wikipedia_candidates,
    root.top_omniglot_candidates,
  ].filter(Boolean);
  const hints = [];
  for (const value of values) {
    for (const part of String(value).split('|')) {
      const clean = part.trim().replace(/\s+/g, ' ');
      if (!clean) continue;
      hints.push(clean.slice(0, 120));
    }
  }
  return [...new Set(hints)];
}

function dedupe(candidates) {
  const seen = new Set();
  const output = [];
  for (const candidate of candidates) {
    const key = candidate.parts.map((part) => part.token).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(candidate);
  }
  return output;
}

function loadRomanizations(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+[\).\t -]*/, '').trim())
    .map(cleanToken)
    .filter(Boolean);
}

function loadEtymology(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  const map = new Map();
  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    row.token = cleanToken(row.token);
    map.set(row.token, row);
  }
  return map;
}

function mergeEtymology(target, extra) {
  for (const [token, row] of extra.entries()) {
    const existing = target.get(token);
    if (!existing || Number(row.confidence || 0) > Number(existing.confidence || 0)) {
      target.set(token, row);
    }
  }
}

function cleanToken(value) {
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
