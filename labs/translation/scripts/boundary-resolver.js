import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset) {
  console.error('Usage: node scripts/boundary-resolver.js --dataset <dataset.json> [--roots translator/roots.tsv] [--unit 1] [--out report.md]');
  process.exit(1);
}

const datasetPath = path.resolve(args.dataset);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const roots = args.roots ? loadRoots(path.resolve(args.roots)) : [];
const rootSet = new Set(roots.map((root) => root.root));
const units = (dataset.units || []).map(normalizeUnit);
const targetUnit = args.unit ? String(args.unit) : null;
const selectedUnits = targetUnit
  ? units.filter((unit) => String(unit.order) === targetUnit)
  : units;

const evidence = buildEvidence(units, rootSet);
const reports = selectedUnits.map((unit) => resolveUnit(unit, evidence));
const markdown = renderReport({ datasetPath, rootCount: roots.length, reports });

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), markdown);
} else {
  console.log(markdown);
}

function normalizeUnit(unit) {
  return {
    order: unit.order,
    reading: clean(unit.reading),
    visualParts: (unit.parts || [])
      .map((part) => clean(part.reading))
      .filter(Boolean),
  };
}

function buildEvidence(units, rootSet) {
  const visualPartCounts = new Map();
  const substringCounts = new Map();
  const unitHits = new Map();

  for (const [unitIndex, unit] of units.entries()) {
    for (const part of unit.visualParts) {
      visualPartCounts.set(part, (visualPartCounts.get(part) || 0) + 1);
    }

    const seen = new Set();
    for (let start = 0; start < unit.reading.length; start += 1) {
      for (let end = start + 1; end <= Math.min(unit.reading.length, start + 10); end += 1) {
        const piece = unit.reading.slice(start, end);
        if (!piece) continue;
        substringCounts.set(piece, (substringCounts.get(piece) || 0) + 1);
        seen.add(piece);
      }
    }
    for (const piece of seen) {
      if (!unitHits.has(piece)) unitHits.set(piece, new Set());
      unitHits.get(piece).add(unitIndex);
    }
  }

  const vocabulary = new Set([
    ...visualPartCounts.keys(),
    ...rootSet,
    ...[...substringCounts.entries()]
      .filter(([piece, count]) => piece.length >= 2 && count >= 2)
      .map(([piece]) => piece),
  ]);

  return {
    visualPartCounts,
    substringCounts,
    unitHits,
    rootSet,
    vocabulary,
  };
}

function resolveUnit(unit, evidence) {
  const localEvidence = withLocalPieces(evidence, unit.reading);
  const scored = generateSegmentations(unit.reading, localEvidence)
    .map((segmentation) => scoreSegmentation(segmentation, unit, evidence))
    .sort((a, b) => b.total - a.total || a.segments.length - b.segments.length);
  const candidates = scored.slice(0, 12);
  const compactCandidates = scored
    .filter((candidate) => {
      const maxParts = Math.max(2, unit.visualParts.length + 1);
      return candidate.segments.length <= maxParts
        && !candidate.segments.some((segment) => segment.length === 1 && !unit.visualParts.includes(segment));
    })
    .slice(0, 20);

  const visualSegmentation = scoreSegmentation(unit.visualParts, unit, evidence);
  const hasVisual = candidates.some((candidate) => candidate.key === visualSegmentation.key);
  if (!hasVisual && visualSegmentation.segments.length) {
    candidates.push(visualSegmentation);
    candidates.sort((a, b) => b.total - a.total || a.segments.length - b.segments.length);
  }

  return {
    unit,
    visualSegmentation,
    candidates: candidates.slice(0, 12),
    compactCandidates,
  };
}

function withLocalPieces(evidence, text) {
  const vocabulary = new Set(evidence.vocabulary);
  for (let start = 0; start < text.length; start += 1) {
    for (let end = start + 2; end <= Math.min(text.length, start + 10); end += 1) {
      vocabulary.add(text.slice(start, end));
    }
  }
  return { ...evidence, vocabulary };
}

function generateSegmentations(text, evidence) {
  const memo = new Map();
  const maxLength = Math.min(10, Math.max(...[...evidence.vocabulary].map((piece) => piece.length), 1));

  function solve(offset) {
    if (offset >= text.length) return [[]];
    if (memo.has(offset)) return memo.get(offset);

    const results = [];
    const maxEnd = Math.min(text.length, offset + maxLength);
    for (let end = offset + 1; end <= maxEnd; end += 1) {
      const piece = text.slice(offset, end);
      const known = evidence.vocabulary.has(piece);
      const usefulUnknown = piece.length === 1;
      if (!known && !usefulUnknown) continue;

      for (const tail of solve(end)) {
        results.push([piece, ...tail]);
      }
    }

    const pruned = results
      .sort((a, b) => a.length - b.length)
      .slice(0, 5000);
    memo.set(offset, pruned);
    return pruned;
  }

  return solve(0);
}

function scoreSegmentation(segments, unit, evidence) {
  let visual = 0;
  let recurrence = 0;
  let roots = 0;
  let unknownPenalty = 0;
  let complexityPenalty = Math.max(0, segments.length - 1) * 1.8;

  const visualKey = unit.visualParts.join('|');
  const key = segments.join('|');
  if (key === visualKey) visual += 16;

  for (const segment of segments) {
    const visualCount = evidence.visualPartCounts.get(segment) || 0;
    const substringCount = evidence.substringCounts.get(segment) || 0;
    const spread = evidence.unitHits.get(segment)?.size || 0;
    const lengthWeight = Math.min(2.2, Math.max(0.2, segment.length / 3));

    if (visualCount > 0) visual += 4 + Math.log2(visualCount + 1);
    if (substringCount > 1) {
      recurrence += (Math.log2(substringCount + 1) + Math.log2(spread + 1) * 0.75) * lengthWeight;
    }
    if (evidence.rootSet.has(segment)) roots += segment.length === 1 ? 0.4 : 2;

    if (segment.length === 1 && visualCount === 0) {
      unknownPenalty += 3.5;
    }

    if (!evidence.vocabulary.has(segment)) {
      unknownPenalty += segment.length === 1 ? 2.5 : 5;
    }
  }

  const total = visual + recurrence + roots - unknownPenalty - complexityPenalty;
  return {
    key,
    segments,
    total,
    visual,
    recurrence,
    roots,
    unknownPenalty,
    complexityPenalty,
  };
}

function renderReport({ datasetPath, rootCount, reports }) {
  const lines = [
    '# VoynichLab Boundary Resolver',
    '',
    `- dataset: ${datasetPath}`,
    `- roots loaded: ${rootCount}`,
    '',
    'This report compares possible root boundaries. It does not assume the current visual-part split is correct; it scores it against alternatives.',
    '',
    'Score components:',
    '',
    '- visual: support from current visual parts',
    '- recurrence: repeated substrings in the paragraph',
    '- roots: known roots from the root table',
    '- penalties: unknown pieces and excessive fragmentation',
    '',
  ];

  for (const report of reports) {
    lines.push(`## Unit ${report.unit.order}: ${report.unit.reading}`);
    lines.push('');
    lines.push(`- current visual split: ${report.unit.visualParts.join('|') || 'none'}`);
    lines.push('');
    report.candidates.forEach((candidate, index) => {
      const marker = candidate.key === report.visualSegmentation.key ? ' visual-current' : '';
      lines.push(`${index + 1}. ${candidate.key}${marker}`);
      lines.push(`   - total ${fmt(candidate.total)} | visual ${fmt(candidate.visual)} | recurrence ${fmt(candidate.recurrence)} | roots ${fmt(candidate.roots)} | unknown penalty ${fmt(candidate.unknownPenalty)} | complexity penalty ${fmt(candidate.complexityPenalty)}`);
    });
    lines.push('');
    lines.push('### Compact Challengers');
    lines.push('');
    report.compactCandidates.forEach((candidate, index) => {
      const marker = candidate.key === report.visualSegmentation.key ? ' visual-current' : '';
      lines.push(`${index + 1}. ${candidate.key}${marker}`);
      lines.push(`   - total ${fmt(candidate.total)} | visual ${fmt(candidate.visual)} | recurrence ${fmt(candidate.recurrence)} | roots ${fmt(candidate.roots)} | unknown penalty ${fmt(candidate.unknownPenalty)} | complexity penalty ${fmt(candidate.complexityPenalty)}`);
    });
    if (!report.compactCandidates.length) {
      lines.push('- none');
    }
    lines.push('');
  }

  lines.push('## How To Use');
  lines.push('');
  lines.push('A boundary is stronger when it wins without relying only on visual bonus.');
  lines.push('If visual-current loses badly, inspect the annotation: the visual split may be wrong or the flat unit reading may be normalized differently.');
  lines.push('If many alternatives tie, the key needs an explicit boundary marker/rule.');
  lines.push('');

  return lines.join('\n');
}

function loadRoots(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split('\t');
      const item = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
      return { root: clean(item.root), ...item };
    })
    .filter((item) => item.root);
}

function clean(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
}

function fmt(value) {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
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
