import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset && !args.text) {
  console.error('Usage: node scripts/translate-romanization.js --dataset <dataset.json> [--mode segmented|flat] [--roots translator/roots.tsv] [--out report.md]');
  console.error('   or: node scripts/translate-romanization.js --text "ohorahiirin"');
  process.exit(1);
}

const rootPath = path.resolve(args.roots || 'translator/roots.tsv');
const roots = loadRoots(rootPath);
const rootIndex = indexRoots(roots);
const mode = args.mode || (args.dataset ? 'segmented' : 'flat');
const units = args.dataset
  ? loadUnitsFromDataset(path.resolve(args.dataset), mode)
  : [{ order: 1, reading: args.text, segments: [{ order: 1, reading: args.text }] }];

const analyses = units.map((unit) => {
  const segmentAnalyses = unit.segments.map((segment) => ({
    order: segment.order,
    reading: segment.reading,
    candidates: segmentRomanization(segment.reading || '', rootIndex).slice(0, Number(args.limit || 5)),
  }));
  const totalUnknown = segmentAnalyses.reduce((sum, segment) => sum + (segment.candidates[0]?.unknown ?? 0), 0);
  const totalScore = segmentAnalyses.reduce((sum, segment) => sum + (segment.candidates[0]?.score ?? 0), 0);
  return {
    order: unit.order,
    reading: unit.reading || '',
    segmented: unit.segments.map((segment) => segment.reading).join('|'),
    segmentAnalyses,
    totalUnknown,
    totalScore,
  };
});

const report = renderReport({
  dataset: args.dataset ? path.resolve(args.dataset) : null,
  roots: rootPath,
  mode,
  analyses,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report);
} else {
  console.log(report);
}

function loadUnitsFromDataset(datasetPath, mode) {
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  return (dataset.units || []).map((unit) => ({
    order: unit.order,
    reading: unit.reading || '',
    segments: mode === 'flat'
      ? [{ order: 1, reading: unit.reading || '' }]
      : (unit.parts || []).map((part) => ({
        order: part.order,
        reading: part.reading || '',
      })).filter((part) => part.reading),
  }));
}

function loadRoots(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split('\t');
      const item = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
      return {
        root: item.root,
        language: item.language,
        gloss: item.gloss,
        weight: Number(item.weight || 1),
        notes: item.notes,
      };
    })
    .filter((item) => item.root);
}

function indexRoots(roots) {
  const index = new Map();
  for (const root of roots) {
    if (!index.has(root.root)) index.set(root.root, []);
    index.get(root.root).push(root);
  }
  return index;
}

function segmentRomanization(text, rootIndex) {
  const normalized = String(text || '').toLowerCase().replace(/[^a-z]/g, '');
  const memo = new Map();
  const maxRootLength = Math.max(...[...rootIndex.keys()].map((root) => root.length), 1);

  function solve(offset) {
    if (offset >= normalized.length) {
      return [{ parts: [], score: 0, unknown: 0 }];
    }
    if (memo.has(offset)) return memo.get(offset);

    const results = [];
    const maxEnd = Math.min(normalized.length, offset + maxRootLength);

    for (let end = offset + 1; end <= maxEnd; end += 1) {
      const piece = normalized.slice(offset, end);
      const matches = rootIndex.get(piece) || [];
      if (!matches.length) continue;

      for (const root of matches) {
        for (const tail of solve(end)) {
          results.push({
            parts: [{ text: piece, root }, ...tail.parts],
            score: tail.score + root.weight + piece.length * 0.02,
            unknown: tail.unknown,
          });
        }
      }
    }

    const unknownPiece = normalized.slice(offset, offset + 1);
    for (const tail of solve(offset + 1)) {
      results.push({
        parts: [{ text: unknownPiece, root: null }, ...tail.parts],
        score: tail.score - 1.5,
        unknown: tail.unknown + 1,
      });
    }

    const best = dedupeAnalyses(results)
      .sort((a, b) => b.score - a.score || a.unknown - b.unknown)
      .slice(0, 12);
    memo.set(offset, best);
    return best;
  }

  return solve(0);
}

function dedupeAnalyses(results) {
  const seen = new Set();
  const unique = [];
  for (const result of results) {
    const key = result.parts.map((part) => part.root ? `${part.text}:${part.root.gloss}` : `?${part.text}`).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(result);
  }
  return unique;
}

function renderReport({ dataset, roots, mode, analyses }) {
  const lines = [
    '# VoynichLab Romanization Translation Pass',
    '',
    `- dataset: ${dataset || 'manual text'}`,
    `- roots: ${roots}`,
    `- mode: ${mode}`,
    '',
    'This is not the final translation. It is the etymological candidate pass.',
    '',
    mode === 'segmented'
      ? 'The main input is the visual-part segmentation, because flat romanization loses root-boundary information.'
      : 'The main input is flat romanization. This mode is more ambiguous and should be treated as a control.',
    '',
  ];

  for (const unit of analyses) {
    lines.push(`## Unit ${unit.order}: ${unit.reading}`);
    lines.push('');
    lines.push(`- segmented input: ${unit.segmented || unit.reading}`);
    lines.push(`- best total score: ${unit.totalScore.toFixed(2)}`);
    lines.push(`- best total unknown: ${unit.totalUnknown}`);
    lines.push('');

    if (!unit.segmentAnalyses.length) {
      lines.push('- no segments');
      lines.push('');
      continue;
    }

    for (const segment of unit.segmentAnalyses) {
      lines.push(`### Segment ${segment.order}: ${segment.reading}`);
      if (!segment.candidates.length) {
        lines.push('- no candidates');
        lines.push('');
        continue;
      }

      segment.candidates.forEach((candidate, index) => {
        const parts = candidate.parts.map((part) => {
          if (!part.root) return `${part.text}{?}`;
          return `${part.text}{${part.root.language}:${part.root.gloss}}`;
        }).join(' + ');
        lines.push(`${index + 1}. score ${candidate.score.toFixed(2)}, unknown ${candidate.unknown}: ${parts}`);
      });
      lines.push('');
    }
    lines.push('');
  }

  return lines.join('\n');
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
