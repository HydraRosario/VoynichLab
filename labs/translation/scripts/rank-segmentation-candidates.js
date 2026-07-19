import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset || !args.etymology) {
  console.error('Usage: node scripts/rank-segmentation-candidates.js --dataset <dataset.json> --etymology <candidates.tsv> [--user user.tsv] [--out report.md]');
  process.exit(1);
}

const dataset = JSON.parse(fs.readFileSync(path.resolve(args.dataset), 'utf8'));
const etymology = loadEtymology(path.resolve(args.etymology));
const userRows = args.user ? loadTsv(path.resolve(args.user)) : [];
const userByOrder = new Map(userRows.map((row) => [Number(row.order), row]));
const seedTokens = buildSeedTokens({ dataset, etymology, userRows });
const units = (dataset.units || [])
  .slice()
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
  .map((unit) => rankUnit(unit, seedTokens, etymology, userByOrder.get(Number(unit.order || 0))));

const report = renderReport({
  datasetPath: args.dataset,
  etymologyPath: args.etymology,
  userPath: args.user || null,
  seedTokens,
  units,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

function rankUnit(unit, seedTokens, etymology, userRow) {
  const romanization = clean(unit.reading);
  const visual = (unit.parts || [])
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((part) => clean(part.reading))
    .filter(Boolean);
  const user = String(userRow?.user_segmentation || '')
    .split('|')
    .map(clean)
    .filter(Boolean);

  const exactCandidates = segmentExact(romanization, seedTokens, etymology);
  const manualCandidate = user.length ? scoreCandidate(user, romanization, etymology, 'human-v2') : null;
  const visualCandidate = visual.length ? scoreCandidate(visual, romanization, etymology, 'visual') : null;
  const candidates = [...exactCandidates, manualCandidate, visualCandidate]
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.parts.length - b.parts.length);

  return {
    order: Number(unit.order || 0),
    romanization,
    user,
    visual,
    candidates: dedupeCandidates(candidates).slice(0, Number(args.limit || 8)),
  };
}

function segmentExact(text, seedTokens, etymology) {
  const tokens = [...seedTokens].filter((token) => token.length > 0).sort((a, b) => b.length - a.length);
  const memo = new Map();
  const maxResults = 80;

  function solve(offset) {
    if (offset === text.length) return [{ parts: [], rawScore: 0 }];
    if (memo.has(offset)) return memo.get(offset);

    const results = [];
    for (const token of tokens) {
      if (!text.startsWith(token, offset)) continue;
      for (const tail of solve(offset + token.length)) {
        results.push({
          parts: [token, ...tail.parts],
          rawScore: tokenScore(token, etymology) + tail.rawScore,
        });
      }
    }

    const unknown = text.slice(offset, offset + 1);
    for (const tail of solve(offset + 1)) {
      results.push({
        parts: [unknown, ...tail.parts],
        rawScore: -2 + tail.rawScore,
      });
    }

    const ranked = results
      .map((item) => scoreCandidate(item.parts, text, etymology, 'generated'))
      .sort((a, b) => b.score - a.score || a.parts.length - b.parts.length)
      .slice(0, maxResults);
    memo.set(offset, ranked);
    return ranked;
  }

  return solve(0);
}

function scoreCandidate(parts, romanization, etymology, source) {
  const joined = parts.join('');
  const exact = joined === romanization;
  const known = parts.filter((part) => etymology.has(part));
  const repeated = parts.filter((part) => Number(etymology.get(part)?.count || 0) >= 2);
  const inspect = parts.filter((part) => etymology.get(part)?.status === 'inspect');
  const weak = parts.filter((part) => etymology.get(part)?.status === 'weak');
  const unknown = parts.filter((part) => !etymology.has(part));
  const short = parts.filter((part) => part.length <= 1);

  let score = 0;
  for (const part of parts) {
    score += tokenScore(part, etymology);
  }
  score += exact ? 5 : -Math.max(2, editDistance(joined, romanization) * 0.8);
  score += repeated.length * 0.8;
  score += inspect.length * 1.4;
  score += weak.length * 0.2;
  score -= unknown.length * 1.6;
  score -= short.length * 0.5;
  score -= Math.max(0, parts.length - 4) * 0.35;
  if (source === 'human-v2') score += 0.6;
  if (source === 'visual') score -= 0.2;

  return {
    source,
    parts,
    joined,
    exact,
    score,
    known: known.length,
    unknown: unknown.length,
    notes: explain(parts, etymology, exact),
  };
}

function tokenScore(token, etymology) {
  const row = etymology.get(token);
  if (!row) return token.length >= 3 ? -0.6 : -1.2;
  let score = Math.min(Number(row.confidence || 0) / 3, 4);
  if (row.status === 'inspect') score += 2;
  if (row.status === 'weak') score += 0.4;
  if (row.status === 'noisy') score -= 0.8;
  if (token.length <= 1) score -= 0.9;
  if (token.length === 2) score -= 0.4;
  score += Math.min(Number(row.count || 0) * 0.15, 1.2);
  return score;
}

function explain(parts, etymology, exact) {
  const notes = [];
  if (!exact) notes.push('no coincide literalmente con romanizacion');
  const unresolved = parts.filter((part) => !etymology.has(part));
  if (unresolved.length) notes.push(`sin datos: ${unresolved.join(', ')}`);
  const strong = parts.filter((part) => etymology.get(part)?.status === 'inspect');
  if (strong.length) notes.push(`raices fuertes: ${strong.join(', ')}`);
  return notes.join('; ') || 'ok';
}

function buildSeedTokens({ dataset, etymology, userRows }) {
  const tokens = new Set();
  for (const token of etymology.keys()) tokens.add(token);
  for (const row of userRows) {
    for (const token of String(row.user_segmentation || '').split('|')) tokens.add(clean(token));
  }
  for (const unit of dataset.units || []) {
    for (const part of unit.parts || []) tokens.add(clean(part.reading));
  }
  return [...tokens].filter(Boolean);
}

function renderReport({ datasetPath, etymologyPath, userPath, seedTokens, units }) {
  const lines = [
    '# Page 003 / Paragraph 2 - Ranking de segmentaciones candidatas',
    '',
    `- dataset: ${datasetPath}`,
    `- etymology: ${etymologyPath}`,
    `- user hypothesis: ${userPath || 'none'}`,
    `- seed tokens: ${seedTokens.length}`,
    '',
    '## Lectura',
    '',
    'Este reporte no asume que la division humana V2 sea correcta. La compara contra segmentaciones generadas automaticamente desde las raices disponibles.',
    '',
    '## Ranking por unidad',
    '',
  ];

  for (const unit of units) {
    lines.push(`### ${unit.order}. ${unit.romanization}`);
    lines.push('');
    lines.push(`- V2 humana: ${unit.user.join('|') || '-'}`);
    lines.push(`- visual cruda: ${unit.visual.join('|') || '-'}`);
    lines.push('');
    lines.push('| rank | fuente | segmentacion | score | exacta | notas |');
    lines.push('| ---: | --- | --- | ---: | --- | --- |');
    unit.candidates.forEach((candidate, index) => {
      lines.push(`| ${index + 1} | ${candidate.source} | ${cell(candidate.parts.join('|'))} | ${candidate.score.toFixed(2)} | ${candidate.exact ? 'si' : 'no'} | ${cell(candidate.notes)} |`);
    });
    lines.push('');
  }

  lines.push('## Decision', '');
  lines.push('La siguiente version del traductor debe elegir segmentaciones por ranking, no por intuicion unica. La V2 del investigador es una hipotesis fuerte, pero queda sometida a competencia contra otras divisiones.');
  lines.push('');
  return lines.join('\n');
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const out = [];
  for (const candidate of candidates) {
    const key = candidate.parts.join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
  }
  return out;
}

function loadEtymology(filePath) {
  const rows = loadTsv(filePath);
  const map = new Map();
  for (const row of rows) {
    map.set(clean(row.token), row);
  }
  return map;
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
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
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
