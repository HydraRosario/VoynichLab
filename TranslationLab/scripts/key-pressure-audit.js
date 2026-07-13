import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.user || !args.etymology) {
  console.error('Usage: node scripts/key-pressure-audit.js --user <user-segmentation.tsv> --etymology <etymology.tsv> [--out report.md]');
  process.exit(1);
}

const rows = loadTsv(path.resolve(args.user));
const etymology = new Map(loadTsv(path.resolve(args.etymology)).map((row) => [clean(row.token), row]));
const families = buildFamilies(rows, etymology);
const report = renderReport({ userPath: args.user, etymologyPath: args.etymology, families });

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

function buildFamilies(rows, etymology) {
  const tokenMap = new Map();

  for (const row of rows) {
    const order = Number(row.order || 0);
    for (const token of String(row.user_segmentation || '').split('|').map(clean).filter(Boolean)) {
      if (!tokenMap.has(token)) {
        tokenMap.set(token, {
          token,
          count: 0,
          units: new Set(),
          etymology: etymology.get(token) || null,
          variants: new Set(),
        });
      }
      const item = tokenMap.get(token);
      item.count += 1;
      item.units.add(order);
    }
  }

  const tokens = [...tokenMap.keys()];
  for (const item of tokenMap.values()) {
    for (const other of tokens) {
      if (item.token === other) continue;
      if (familyLike(item.token, other)) item.variants.add(other);
    }
  }

  return [...tokenMap.values()]
    .map((item) => classifyFamily(item, etymology))
    .sort((a, b) => b.pressure - a.pressure || b.count - a.count || a.token.localeCompare(b.token));
}

function classifyFamily(item, etymology) {
  const row = item.etymology;
  const status = row?.status || 'missing';
  const confidence = Number(row?.confidence || 0);
  const variants = [...item.variants].sort();
  const hasStrongVariant = variants.some((variant) => etymology.get(variant)?.status === 'inspect');
  const pressure = computePressure({ item, status, confidence, variants, hasStrongVariant });
  const recommendation = recommend({ token: item.token, status, confidence, variants, hasStrongVariant });

  return {
    token: item.token,
    count: item.count,
    units: [...item.units].sort((a, b) => a - b),
    status,
    confidence,
    variants,
    hasStrongVariant,
    pressure,
    recommendation,
    hints: hintText(row),
  };
}

function computePressure({ item, status, confidence, variants, hasStrongVariant }) {
  let score = 0;
  if (status === 'missing' || status === 'noisy') score += 4;
  if (confidence <= 1) score += 2;
  if (item.count >= 2) score += 2;
  if (item.token.length >= 4) score += 1;
  if (variants.length) score += 1;
  if (hasStrongVariant) score += 2;
  if (status === 'inspect') score -= 4;
  return score;
}

function recommend({ token, status, confidence, variants, hasStrongVariant }) {
  if (status === 'inspect') return 'mantener como raiz candidata fuerte';
  if (hasStrongVariant) return 'revisar como variante/elision de raiz fuerte';
  if (variants.length >= 2 && token.length >= 4) return 'agrupar como familia interna y buscar significado por contexto';
  if (status === 'missing' || confidence <= 1) return 'presiona contra la llave actual: probar nueva separacion o valor de glifo';
  if (status === 'weak') return 'usar solo como particula/contexto, no como traduccion';
  return 'mantener en observacion';
}

function familyLike(a, b) {
  if (a.length < 3 || b.length < 3) return false;
  if (a.includes(b) || b.includes(a)) return true;
  if (a.slice(0, 3) === b.slice(0, 3)) return true;
  if (a.slice(-3) === b.slice(-3)) return true;
  if (stripLight(a) === stripLight(b)) return true;
  return editDistance(a, b) <= 2 && Math.min(a.length, b.length) >= 4;
}

function stripLight(value) {
  return value.replace(/^h/, '').replace(/^o/, '').replace(/h/g, '').replace(/[aeiou]$/g, '');
}

function hintText(row) {
  if (!row) return '';
  return [row.top_wiktionary_candidates, row.top_datamuse_candidates]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 180);
}

function renderReport({ userPath, etymologyPath, families }) {
  const high = families.filter((item) => item.pressure >= 6);
  const strong = families.filter((item) => item.status === 'inspect');

  const lines = [
    '# Page 003 / Paragraph 2 - Auditoria de presion sobre la llave',
    '',
    `- segmentacion: ${userPath}`,
    `- etimologia: ${etymologyPath}`,
    `- raices/familias analizadas: ${families.length}`,
    `- raices fuertes: ${strong.length}`,
    `- zonas de presion alta: ${high.length}`,
    '',
    '## Que mide esto',
    '',
    'Esta auditoria acepta busquedas heuristicas, incluso separaciones que parecen cherry picking, pero las obliga a dejar rastro. Si una forma se repite y no da ninguna señal etimologica, presiona contra la llave actual: quizas esta mal separada, quizas falta una mutacion, o quizas el glifo fue romanizado con un valor incorrecto.',
    '',
    '## Zonas de presion alta',
    '',
    '| raiz/familia | veces | unidades | estado | variantes cercanas | presion | recomendacion |',
    '| --- | ---: | --- | --- | --- | ---: | --- |',
  ];

  for (const item of high) {
    lines.push(`| ${cell(item.token)} | ${item.count} | ${item.units.join(', ')} | ${item.status} | ${cell(item.variants.join(', ') || '-')} | ${item.pressure} | ${cell(item.recommendation)} |`);
  }

  lines.push('', '## Raices con señal fuerte', '');
  lines.push('| raiz | veces | unidades | señal | candidatos |');
  lines.push('| --- | ---: | --- | --- | --- |');
  for (const item of strong) {
    lines.push(`| ${cell(item.token)} | ${item.count} | ${item.units.join(', ')} | ${item.status} ${item.confidence.toFixed(2)} | ${cell(item.hints || '-')} |`);
  }

  lines.push('', '## Tabla completa', '');
  lines.push('| raiz/familia | veces | unidades | estado | presion | recomendacion |');
  lines.push('| --- | ---: | --- | --- | ---: | --- |');
  for (const item of families) {
    lines.push(`| ${cell(item.token)} | ${item.count} | ${item.units.join(', ')} | ${item.status} | ${item.pressure} | ${cell(item.recommendation)} |`);
  }

  lines.push(
    '',
    '## Uso correcto',
    '',
    'La proxima traduccion tentativa debe partir de las raices fuertes, pero mirar primero las zonas de presion alta. Si una zona como `mirrii/nirrii/ria/rine` no produce nada, no se descarta: se usa como pista de que la llave necesita una regla nueva.',
    '',
  );

  return lines.join('\n');
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

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
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
