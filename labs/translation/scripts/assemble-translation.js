import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset || !args.candidates) {
  console.error('Usage: node scripts/assemble-translation.js --dataset <dataset.json> --candidates <etymology-candidates.tsv> [--out report.md] [--json out.json]');
  process.exit(1);
}

const datasetPath = path.resolve(args.dataset);
const candidatesPath = path.resolve(args.candidates);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const candidateIndex = loadCandidates(candidatesPath);
const units = (dataset.units || [])
  .slice()
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
  .map((unit) => analyzeUnit(unit, candidateIndex));

const paragraph = {
  page: dataset.image?.name || 'unknown page',
  manuscriptPage: dataset.image?.manuscriptPage ?? null,
  paragraphNumber: dataset.paragraph?.number ?? null,
  unitCount: units.length,
  reading: units.map((unit) => unit.reading).join(' '),
  segmentedReading: units.map((unit) => unit.segments.map((segment) => segment.token).join('|')).join(' / '),
  evidenceScore: average(units.map((unit) => unit.evidenceScore)),
  riskScore: average(units.map((unit) => unit.riskScore)),
  units,
  inventory: buildInventory(units),
  formulas: findRecurringFormulas(units),
};

const report = renderReport({ datasetPath, candidatesPath, paragraph });

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

if (args.json) {
  fs.writeFileSync(path.resolve(args.json), JSON.stringify(paragraph, null, 2), 'utf8');
}

function analyzeUnit(unit, candidateIndex) {
  const segments = (unit.parts || [])
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((part) => analyzeSegment(part, candidateIndex));

  const evidenceScore = segments.length ? average(segments.map((segment) => segment.evidenceScore)) : 0;
  const riskScore = segments.length ? average(segments.map((segment) => segment.riskScore)) : 1;

  return {
    order: Number(unit.order || 0),
    id: unit.id,
    reading: unit.reading || '',
    segmentation: segments.map((segment) => segment.token).join('|'),
    evidenceScore,
    riskScore,
    status: classifyUnit(evidenceScore, riskScore, segments),
    segments,
  };
}

function analyzeSegment(part, candidateIndex) {
  const token = cleanToken(part.reading);
  const candidate = candidateIndex.get(token) || null;
  const confidence = Number(candidate?.confidence || 0);
  const status = candidate?.status || 'unknown';
  const riskScore = segmentRisk(candidate, token);
  const evidenceScore = segmentEvidence(candidate, token);

  return {
    order: Number(part.order || 0),
    token,
    status,
    confidence,
    evidenceScore,
    riskScore,
    glossHints: extractGlossHints(candidate),
    sourceHints: extractSourceHints(candidate),
    warnings: splitWarnings(candidate?.noise),
    candidate,
  };
}

function classifyUnit(evidenceScore, riskScore, segments) {
  if (!segments.length) return 'missing-segmentation';
  if (segments.some((segment) => !segment.token)) return 'needs-reading';
  if (evidenceScore >= 0.7 && riskScore <= 0.45) return 'strong-candidate';
  if (evidenceScore >= 0.45 && riskScore <= 0.65) return 'usable-candidate';
  if (evidenceScore >= 0.3) return 'fragile-candidate';
  return 'too-ambiguous';
}

function segmentEvidence(candidate, token) {
  if (!candidate) return 0;
  const confidence = Math.min(Number(candidate.confidence || 0) / 14, 1);
  const statusBoost = candidate.status === 'inspect' ? 0.25 : candidate.status === 'weak' ? 0.05 : -0.25;
  const lengthBoost = Math.min(Math.max(token.length - 1, 0) * 0.05, 0.2);
  const etymologyBoost = candidate.has_etymology === 'yes' ? 0.12 : 0;
  return clamp(confidence + statusBoost + lengthBoost + etymologyBoost, 0, 1);
}

function segmentRisk(candidate, token) {
  if (!candidate) return 1;
  let risk = 0.25;
  if (token.length === 1) risk += 0.35;
  if (token.length === 2) risk += 0.18;
  if (candidate.status === 'weak') risk += 0.22;
  if (candidate.status === 'noisy') risk += 0.45;
  if (candidate.has_etymology !== 'yes') risk += 0.18;
  const languages = Number(candidate.wiktionary_languages || 0);
  if (languages >= 25) risk += 0.2;
  if (languages >= 70) risk += 0.15;
  if (splitWarnings(candidate.noise).length) risk += 0.08;
  return clamp(risk, 0, 1);
}

function buildInventory(units) {
  const map = new Map();
  for (const unit of units) {
    for (const segment of unit.segments) {
      if (!segment.token) continue;
      if (!map.has(segment.token)) {
        map.set(segment.token, {
          token: segment.token,
          count: 0,
          units: new Set(),
          status: segment.status,
          confidence: segment.confidence,
          evidenceScore: segment.evidenceScore,
          riskScore: segment.riskScore,
          glossHints: segment.glossHints,
          warnings: segment.warnings,
        });
      }
      const item = map.get(segment.token);
      item.count += 1;
      item.units.add(unit.order);
    }
  }

  return [...map.values()]
    .map((item) => ({
      ...item,
      units: [...item.units].sort((a, b) => a - b),
    }))
    .sort((a, b) => b.evidenceScore - a.evidenceScore || b.count - a.count || a.token.localeCompare(b.token));
}

function findRecurringFormulas(units) {
  const formulas = [];
  const ngrams = new Map();
  for (const unit of units) {
    const tokens = unit.segments.map((segment) => segment.token).filter(Boolean);
    for (const size of [2, 3]) {
      for (let index = 0; index <= tokens.length - size; index += 1) {
        const key = tokens.slice(index, index + size).join('|');
        if (!ngrams.has(key)) ngrams.set(key, { formula: key, count: 0, units: new Set() });
        const item = ngrams.get(key);
        item.count += 1;
        item.units.add(unit.order);
      }
    }
  }

  for (const item of ngrams.values()) {
    if (item.count < 2) continue;
    formulas.push({
      formula: item.formula,
      count: item.count,
      units: [...item.units].sort((a, b) => a - b),
    });
  }

  return formulas.sort((a, b) => b.count - a.count || b.formula.length - a.formula.length);
}

function renderReport({ datasetPath, candidatesPath, paragraph }) {
  const lines = [
    '# VoynichLab Translation Assembly',
    '',
    `- dataset: ${datasetPath}`,
    `- etymology candidates: ${candidatesPath}`,
    `- page: ${paragraph.page}`,
    `- manuscript page: ${paragraph.manuscriptPage ?? 'unknown'}`,
    `- paragraph: ${paragraph.paragraphNumber ?? 'unknown'}`,
    `- units: ${paragraph.unitCount}`,
    `- paragraph evidence score: ${paragraph.evidenceScore.toFixed(2)}`,
    `- paragraph risk score: ${paragraph.riskScore.toFixed(2)}`,
    '',
    'This file is the machine bridge between romanization and translation. It does not pretend the paragraph is translated yet; it ranks which roots are worth inspecting and which ones are probably statistical traps.',
    '',
    '## Paragraph Reading',
    '',
    paragraph.reading,
    '',
    '## Segmented Reading',
    '',
    paragraph.segmentedReading,
    '',
    '## Root Inventory',
    '',
    '| root | count | status | evidence | risk | units | hints | warnings |',
    '| --- | ---: | --- | ---: | ---: | --- | --- | --- |',
  ];

  for (const root of paragraph.inventory) {
    lines.push(`| ${root.token} | ${root.count} | ${root.status} | ${root.evidenceScore.toFixed(2)} | ${root.riskScore.toFixed(2)} | ${root.units.join(', ')} | ${root.glossHints.join('; ') || '-'} | ${root.warnings.join('; ') || '-'} |`);
  }

  lines.push('', '## Unit Assembly', '');
  for (const unit of paragraph.units) {
    lines.push(`### ${unit.order}. ${unit.reading}`);
    lines.push('');
    lines.push(`- segmentation: ${unit.segmentation}`);
    lines.push(`- status: ${unit.status}`);
    lines.push(`- evidence: ${unit.evidenceScore.toFixed(2)}`);
    lines.push(`- risk: ${unit.riskScore.toFixed(2)}`);
    lines.push('');
    lines.push('| part | root | status | evidence | risk | hints | warnings |');
    lines.push('| ---: | --- | --- | ---: | ---: | --- | --- |');
    for (const segment of unit.segments) {
      lines.push(`| ${segment.order} | ${segment.token || '-'} | ${segment.status} | ${segment.evidenceScore.toFixed(2)} | ${segment.riskScore.toFixed(2)} | ${segment.glossHints.join('; ') || '-'} | ${segment.warnings.join('; ') || '-'} |`);
    }
    lines.push('');
  }

  lines.push('## Recurring Formulas', '');
  if (!paragraph.formulas.length) {
    lines.push('- none found');
  } else {
    for (const formula of paragraph.formulas.slice(0, 30)) {
      lines.push(`- ${formula.formula}: ${formula.count}x, units ${formula.units.join(', ')}`);
    }
  }

  lines.push(
    '',
    '## Scientific Reading',
    '',
    '- Green light: roots with enough evidence and tolerable risk can enter a translation hypothesis.',
    '- Yellow light: short roots and roots found across many languages are allowed, but only as grammatical particles until proven otherwise.',
    '- Red light: noisy roots cannot be used as proof of meaning.',
    '- Next machine step: build phrase hypotheses from green/yellow roots, then compare them against the flat-control reading to see whether the visual segmentation actually adds signal.',
    '',
  );

  return lines.join('\n');
}

function loadCandidates(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  const map = new Map();
  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    map.set(cleanToken(row.token), row);
  }
  return map;
}

function extractGlossHints(candidate) {
  if (!candidate) return [];
  const hints = [];
  for (const field of ['top_wiktionary_candidates', 'top_datamuse_candidates']) {
    const value = candidate[field] || '';
    for (const chunk of value.split('|').slice(0, 4)) {
      const cleaned = chunk.trim().replace(/\s+/g, ' ');
      if (!cleaned) continue;
      hints.push(cleaned.slice(0, 120));
    }
  }
  return dedupe(hints).slice(0, 5);
}

function extractSourceHints(candidate) {
  if (!candidate) return [];
  return [
    candidate.top_wiktionary_candidates ? 'wiktionary' : '',
    candidate.top_wikipedia_candidates ? 'wikipedia' : '',
    candidate.top_datamuse_candidates ? 'datamuse' : '',
  ].filter(Boolean);
}

function splitWarnings(value) {
  return String(value || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
}

function dedupe(items) {
  return [...new Set(items)];
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
