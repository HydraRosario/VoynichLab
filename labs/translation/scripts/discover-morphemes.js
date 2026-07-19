import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset && !args.text) {
  console.error('Usage: node scripts/discover-morphemes.js --dataset <dataset.json> [--text romanization] [--out report.md]');
  process.exit(1);
}

const units = args.dataset
  ? loadUnits(path.resolve(args.dataset))
  : [];

if (args.text) {
  units.push({ order: 'manual', reading: normalize(args.text) });
}

const corpus = units.map((unit) => unit.reading).filter(Boolean);
const candidates = discoverCandidates(corpus, {
  minLength: Number(args.minLength || 2),
  maxLength: Number(args.maxLength || 8),
  minCount: Number(args.minCount || 2),
});
const segmentations = units.map((unit) => ({
  ...unit,
  segmentations: segmentText(unit.reading, candidates).slice(0, 8),
}));

const report = renderReport({ units, candidates, segmentations });

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report);
} else {
  console.log(report);
}

function loadUnits(datasetPath) {
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  return (dataset.units || []).map((unit) => ({
    order: unit.order,
    reading: normalize(unit.reading),
  }));
}

function discoverCandidates(corpus, { minLength, maxLength, minCount }) {
  const counts = new Map();
  const unitHits = new Map();

  for (const [unitIndex, text] of corpus.entries()) {
    const seenInUnit = new Set();
    for (let start = 0; start < text.length; start += 1) {
      for (let end = start + minLength; end <= Math.min(text.length, start + maxLength); end += 1) {
        const piece = text.slice(start, end);
        if (!isUsefulPiece(piece)) continue;
        counts.set(piece, (counts.get(piece) || 0) + 1);
        seenInUnit.add(piece);
      }
    }
    for (const piece of seenInUnit) {
      if (!unitHits.has(piece)) unitHits.set(piece, new Set());
      unitHits.get(piece).add(unitIndex);
    }
  }

  return [...counts.entries()]
    .map(([piece, count]) => ({
      piece,
      count,
      units: unitHits.get(piece)?.size || 0,
      score: scorePiece(piece, count, unitHits.get(piece)?.size || 0),
    }))
    .filter((item) => item.count >= minCount && item.units >= 2)
    .sort((a, b) => b.score - a.score || b.count - a.count || a.piece.localeCompare(b.piece))
    .slice(0, 80);
}

function segmentText(text, candidates) {
  const byPiece = new Map(candidates.map((item) => [item.piece, item]));
  const maxLength = Math.max(...candidates.map((item) => item.piece.length), 1);
  const memo = new Map();

  function solve(offset) {
    if (offset >= text.length) return [{ parts: [], score: 0, unknown: 0 }];
    if (memo.has(offset)) return memo.get(offset);

    const results = [];
    const maxEnd = Math.min(text.length, offset + maxLength);
    for (let end = offset + 1; end <= maxEnd; end += 1) {
      const piece = text.slice(offset, end);
      const candidate = byPiece.get(piece);
      if (!candidate) continue;

      for (const tail of solve(end)) {
        results.push({
          parts: [{ text: piece, known: true, score: candidate.score }, ...tail.parts],
          score: tail.score + candidate.score,
          unknown: tail.unknown,
        });
      }
    }

    const unknown = text.slice(offset, offset + 1);
    for (const tail of solve(offset + 1)) {
      results.push({
        parts: [{ text: unknown, known: false, score: -2 }, ...tail.parts],
        score: tail.score - 2,
        unknown: tail.unknown + 1,
      });
    }

    const best = dedupe(results)
      .sort((a, b) => b.score - a.score || a.unknown - b.unknown || a.parts.length - b.parts.length)
      .slice(0, 20);
    memo.set(offset, best);
    return best;
  }

  return solve(0);
}

function renderReport({ candidates, segmentations }) {
  const lines = [
    '# VoynichLab Morpheme Discovery',
    '',
    'This report tests whether romanized units can be segmented into recurring candidate roots without manually choosing every boundary.',
    '',
    '## Top Candidate Roots',
    '',
    ...candidates.slice(0, 40).map((item) => `- ${item.piece}: count ${item.count}, units ${item.units}, score ${item.score.toFixed(2)}`),
    '',
    '## Segmentations',
    '',
  ];

  for (const unit of segmentations) {
    lines.push(`### Unit ${unit.order}: ${unit.reading}`);
    lines.push('');
    unit.segmentations.slice(0, 5).forEach((seg, index) => {
      const parts = seg.parts.map((part) => part.known ? part.text : `${part.text}?`).join('-');
      lines.push(`${index + 1}. score ${seg.score.toFixed(2)}, unknown ${seg.unknown}: ${parts}`);
    });
    lines.push('');
  }

  lines.push('## Scientific Reading');
  lines.push('');
  lines.push('- If top segmentations rely on many one-letter unknowns, the romanization lacks enough root-boundary information.');
  lines.push('- If the same pieces recur across units and explain most letters, the key is producing reusable structure.');
  lines.push('- If multiple segmentations have similar scores, the next missing layer is likely boundary/rule annotation, not more visual boxes.');
  lines.push('');

  return lines.join('\n');
}

function scorePiece(piece, count, units) {
  const lengthBonus = Math.log2(piece.length + 1);
  const countBonus = Math.log2(count + 1);
  const spreadBonus = Math.log2(units + 1);
  const tooShortPenalty = piece.length === 2 ? 0.5 : 0;
  return lengthBonus * countBonus + spreadBonus - tooShortPenalty;
}

function isUsefulPiece(piece) {
  if (/^(.)\1+$/.test(piece)) return false;
  return /[aeiou]/.test(piece);
}

function dedupe(results) {
  const seen = new Set();
  const out = [];
  for (const result of results) {
    const key = result.parts.map((part) => part.known ? part.text : `${part.text}?`).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(result);
  }
  return out;
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
