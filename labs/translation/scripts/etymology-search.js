import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.dataset && !args.token && !args.userSegmentation && !args.romanizations) {
  console.error('Usage: node scripts/etymology-search.js --dataset <dataset.json> [--providers wiktionary,wikipedia,datamuse] [--out report.md]');
  console.error('   or: node scripts/etymology-search.js --userSegmentation <segmentation.tsv>');
  console.error('   or: node scripts/etymology-search.js --romanizations <romanizations.txt>');
  console.error('   or: node scripts/etymology-search.js --token <root>');
  process.exit(1);
}

const PROVIDERS = {
  wiktionary: lookupWiktionary,
  wikipedia: lookupWikipedia,
  datamuse: lookupDatamuse,
  omniglot: lookupOmniglot,
};

const selectedProviders = String(args.providers || 'wiktionary,wikipedia,datamuse,omniglot')
  .split(',')
  .map((item) => item.trim())
  .filter((item) => PROVIDERS[item]);

const cacheRoot = path.resolve(args.cache || 'translator/cache/etymology');
fs.mkdirSync(cacheRoot, { recursive: true });

const tokens = args.token
  ? [{ token: cleanToken(args.token), count: 1, examples: new Set(['manual']), levels: new Set(['manual']) }]
  : args.userSegmentation
    ? collectUserSegmentationTokens(path.resolve(args.userSegmentation))
    : args.romanizations
      ? collectRomanizationCandidateTokens(path.resolve(args.romanizations))
  : collectSegmentTokens(path.resolve(args.dataset));

const maxTokens = Number(args.maxTokens || 40);
const selected = tokens.slice(0, maxTokens);
const entries = [];

for (const item of selected) {
  const sources = {};
  for (const provider of selectedProviders) {
    sources[provider] = await lookupWithCache(provider, item.token);
    await sleep(Number(args.delayMs || 350));
  }

  entries.push({
    ...item,
    sources,
    synthesis: synthesizeEntry(item, sources),
  });
}

const report = renderReport({
  dataset: args.dataset ? path.resolve(args.dataset) : null,
  providers: selectedProviders,
  entries,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

if (args.tsv) {
  fs.writeFileSync(path.resolve(args.tsv), renderTsv(entries), 'utf8');
}

function collectSegmentTokens(datasetPath) {
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const map = new Map();

  for (const unit of dataset.units || []) {
    for (const part of unit.parts || []) {
      addToken(map, part.reading, unit.order, 'visual_part');
    }
    for (const part of unit.parts || []) {
      for (const stroke of part.strokes || []) {
        addToken(map, stroke.reading, unit.order, 'stroke');
      }
    }
  }

  return [...map.values()]
    .filter((item) => item.token.length >= 1)
    .sort((a, b) => b.count - a.count || b.token.length - a.token.length || a.token.localeCompare(b.token));
}

function collectUserSegmentationTokens(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split('\t');
  const map = new Map();

  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    const order = Number(row.order || 0);
    for (const token of String(row.user_segmentation || '').split('|')) {
      addToken(map, token, order, 'user_segmentation');
    }
  }

  return [...map.values()]
    .filter((item) => item.token.length >= 1)
    .sort((a, b) => b.count - a.count || b.token.length - a.token.length || a.token.localeCompare(b.token));
}

function collectRomanizationCandidateTokens(filePath) {
  const words = fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+[\).\t -]*/, '').trim())
    .map(cleanToken)
    .filter(Boolean);
  const map = new Map();
  const minLen = Number(args.minLen || 2);
  const maxLen = Number(args.maxLen || 8);
  const includeSingletons = Boolean(args.includeSingletons);

  words.forEach((word, index) => {
    addToken(map, word, index + 1, 'romanization_full');
    for (let start = 0; start < word.length; start += 1) {
      const maxEnd = Math.min(word.length, start + maxLen);
      for (let end = start + minLen; end <= maxEnd; end += 1) {
        addToken(map, word.slice(start, end), index + 1, 'romanization_substring');
      }
    }
  });

  return [...map.values()]
    .filter((item) => includeSingletons || item.count >= 2 || item.token.length >= 4)
    .filter((item) => item.token.length >= minLen)
    .sort((a, b) => {
      return romanizationCandidateScore(b) - romanizationCandidateScore(a) || a.token.localeCompare(b.token);
    });
}

function romanizationCandidateScore(item) {
  const length = item.token.length;
  const full = item.levels.has('romanization_full') ? 12 : 0;
  const repeated = Math.min(item.count, 8) * Math.min(length, 8);
  const shortPenalty = length <= 2 ? 18 : length === 3 ? 6 : 0;
  return full + repeated - shortPenalty;
}

function addToken(map, rawToken, unitOrder, level) {
  const token = cleanToken(rawToken);
  if (!token) return;
  if (!map.has(token)) {
    map.set(token, { token, count: 0, examples: new Set(), levels: new Set() });
  }
  const item = map.get(token);
  item.count += 1;
  item.examples.add(unitOrder);
  item.levels.add(level);
}

async function lookupWithCache(provider, token) {
  const providerDir = path.join(cacheRoot, provider);
  fs.mkdirSync(providerDir, { recursive: true });
  const cachePath = path.join(providerDir, `${encodeURIComponent(token)}.json`);

  if (fs.existsSync(cachePath) && !args.refresh) {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  let result;
  try {
    result = await PROVIDERS[provider](token);
  } catch (err) {
    result = {
      provider,
      found: false,
      error: String(err),
      candidates: [],
    };
  }

  fs.writeFileSync(cachePath, JSON.stringify(result, null, 2), 'utf8');
  return result;
}

async function lookupWiktionary(token) {
  const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(token)}&prop=wikitext&format=json&formatversion=2`;
  const payload = await fetchJson(url);

  if (payload.error || !payload.parse?.wikitext) {
    return {
      provider: 'wiktionary',
      found: false,
      error: payload.error?.info || 'not found',
      candidates: [],
    };
  }

  const languageSections = splitLanguageSections(payload.parse.wikitext);
  const candidates = [];

  for (const section of languageSections) {
    const definitions = extractDefinitions(section.body).slice(0, 8);
    const etymology = extractEtymology(section.body);
    const descendantHints = extractDescendantHints(section.body);
    if (!definitions.length && !etymology) continue;

    candidates.push({
      language: section.language,
      definitions,
      etymology,
      descendantHints,
      sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(token)}`,
    });
  }

  return {
    provider: 'wiktionary',
    found: candidates.length > 0,
    languages: candidates.map((candidate) => candidate.language),
    candidates,
  };
}

async function lookupWikipedia(token) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(token)}&format=json&utf8=1&srlimit=5`;
  const search = await fetchJson(searchUrl);
  const pages = search.query?.search || [];
  const candidates = [];

  for (const page of pages.slice(0, 3)) {
    const title = page.title;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
      const summary = await fetchJson(summaryUrl);
      candidates.push({
        title,
        extract: cleanWiki(summary.extract || page.snippet || '').slice(0, 700),
        sourceUrl: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      });
    } catch {
      candidates.push({
        title,
        extract: cleanWiki(page.snippet || '').slice(0, 400),
        sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      });
    }
  }

  return {
    provider: 'wikipedia',
    found: candidates.length > 0,
    candidates,
  };
}

async function lookupDatamuse(token) {
  const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(token)}&md=dp&max=12`;
  const rows = await fetchJson(url);
  const candidates = (Array.isArray(rows) ? rows : []).map((row) => ({
    word: row.word,
    score: row.score || 0,
    tags: row.tags || [],
    definitions: (row.defs || []).map((item) => cleanWiki(item)),
    sourceUrl: `https://www.datamuse.com/api/`,
  }));

  return {
    provider: 'datamuse',
    found: candidates.length > 0,
    candidates,
  };
}

async function lookupOmniglot(token) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(`site:omniglot.com ${token}`)}`;
  const html = await fetchText(url, { accept: 'text/html' });
  const candidates = [];
  const resultPattern = /<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[\s\S]*?>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = resultPattern.exec(html)) && candidates.length < 8) {
    const sourceUrl = decodeDuckDuckGoUrl(match[1]);
    if (!/https?:\/\/(?:www\.)?omniglot\.com\//i.test(sourceUrl)) continue;
    candidates.push({
      title: cleanHtml(match[2]),
      extract: cleanHtml(match[3]).slice(0, 500),
      sourceUrl,
    });
  }

  return {
    provider: 'omniglot',
    found: candidates.length > 0,
    candidates,
  };
}

async function fetchJson(url) {
  let response = await fetch(url, { headers: requestHeaders('application/json') });
  if (response.status === 429) {
    await sleep(Number(args.retryMs || 2500));
    response = await fetch(url, { headers: requestHeaders('application/json') });
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchText(url, options = {}) {
  let response = await fetch(url, { headers: requestHeaders(options.accept || 'text/plain') });
  if (response.status === 429) {
    await sleep(Number(args.retryMs || 2500));
    response = await fetch(url, { headers: requestHeaders(options.accept || 'text/plain') });
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function requestHeaders(accept) {
  return {
    'user-agent': 'VoynichLab/0.1 research prototype (local script)',
    accept,
  };
}

function synthesizeEntry(item, sources) {
  const wiktionary = sources.wiktionary;
  const wikipedia = sources.wikipedia;
  const datamuse = sources.datamuse;
  const omniglot = sources.omniglot;

  const wiktionaryCandidates = wiktionary?.candidates || [];
  const languageCount = wiktionary?.languages?.length || 0;
  const hasEtymology = wiktionaryCandidates.some((candidate) => candidate.etymology);
  const definitionCount = wiktionaryCandidates.reduce((sum, candidate) => sum + (candidate.definitions?.length || 0), 0)
    + (datamuse?.candidates || []).reduce((sum, candidate) => sum + (candidate.definitions?.length || 0), 0);
  const encyclopediaHits = wikipedia?.candidates?.length || 0;

  const frequencyScore = Math.log2(item.count + 1);
  const sourceScore = Object.values(sources).filter((source) => source?.found).length * 1.2;
  const etymologyScore = hasEtymology ? 3 : 0;
  const definitionScore = Math.min(3, definitionCount * 0.12);
  const encyclopediaScore = Math.min(1.2, encyclopediaHits * 0.4);
  const omniglotScore = Math.min(1.4, (omniglot?.candidates?.length || 0) * 0.35);
  const lengthPenalty = item.token.length === 1 ? 5 : item.token.length === 2 ? 2 : 0;
  const noisePenalty = languageCount > 12 ? Math.min(4, (languageCount - 12) * 0.18) : 0;

  const confidence = Math.max(
    0,
    frequencyScore + sourceScore + etymologyScore + definitionScore + encyclopediaScore + omniglotScore - lengthPenalty - noisePenalty
  );

  const noise = [
    item.token.length === 1 ? 'single-letter root: high false-positive risk' : '',
    item.token.length === 2 ? 'two-letter root: medium false-positive risk' : '',
    languageCount > 12 ? `many Wiktionary languages (${languageCount}): likely noisy` : '',
    !hasEtymology ? 'no explicit etymology found' : '',
  ].filter(Boolean);

  return {
    confidence,
    languageCount,
    hasEtymology,
    definitionCount,
    encyclopediaHits,
    omniglotHits: omniglot?.candidates?.length || 0,
    noise,
    status: confidence >= 6 && noise.length <= 1 ? 'inspect' : confidence >= 3 ? 'weak' : 'noisy',
  };
}

function renderReport({ dataset, providers, entries }) {
  const sorted = entries
    .slice()
    .sort((a, b) => b.synthesis.confidence - a.synthesis.confidence || b.count - a.count);

  const lines = [
    '# VoynichLab Etymology Metasearch',
    '',
    `- dataset: ${dataset || 'manual token'}`,
    `- providers: ${providers.join(', ')}`,
    '- cache: translator/cache/etymology',
    '',
    'This is a candidate generator, not a proof. It gathers external lexical evidence and marks noisy roots instead of pretending every hit is meaningful.',
    '',
    '## Ranked Roots',
    '',
  ];

  for (const entry of sorted) {
    lines.push(`### ${entry.token}`);
    lines.push('');
    lines.push(`- paragraph count: ${entry.count}`);
    lines.push(`- levels: ${[...entry.levels].join(', ')}`);
    lines.push(`- examples: ${[...entry.examples].slice(0, 12).join(', ')}`);
    lines.push(`- confidence: ${entry.synthesis.confidence.toFixed(2)}`);
    lines.push(`- status: ${entry.synthesis.status}`);
    lines.push(`- wiktionary languages: ${entry.synthesis.languageCount}`);
    lines.push(`- explicit etymology: ${entry.synthesis.hasEtymology ? 'yes' : 'no'}`);
    lines.push(`- omniglot hits: ${entry.synthesis.omniglotHits}`);
    if (entry.synthesis.noise.length) {
      lines.push('- noise warnings:');
      for (const warning of entry.synthesis.noise) lines.push(`  - ${warning}`);
    }
    lines.push('');

    renderWiktionary(lines, entry.sources.wiktionary);
    renderWikipedia(lines, entry.sources.wikipedia);
    renderDatamuse(lines, entry.sources.datamuse);
    renderOmniglot(lines, entry.sources.omniglot);
  }

  lines.push('## Scientific Use');
  lines.push('');
  lines.push('- Prioritize roots marked `inspect`, not merely frequent roots.');
  lines.push('- Single-letter and two-letter roots require extra internal evidence from the manuscript.');
  lines.push('- External etymology can suggest meanings; it cannot decide boundaries alone.');
  lines.push('- A semantic translation must reuse the same root meanings consistently across units.');
  lines.push('- If every token can be explained by many unrelated languages, the hypothesis weakens.');
  lines.push('');

  return lines.join('\n');
}

function renderTsv(entries) {
  const header = [
    'token',
    'count',
    'levels',
    'confidence',
    'status',
    'noise',
    'wiktionary_languages',
    'has_etymology',
    'top_wiktionary_candidates',
    'top_wikipedia_candidates',
    'top_datamuse_candidates',
    'top_omniglot_candidates',
  ];

  const rows = entries
    .slice()
    .sort((a, b) => b.synthesis.confidence - a.synthesis.confidence || b.count - a.count)
    .map((entry) => {
      const wiktionaryTop = (entry.sources.wiktionary?.candidates || [])
        .slice(0, 5)
        .map((candidate) => `${candidate.language}:${(candidate.definitions || []).slice(0, 2).join('/')}`)
        .join(' | ');
      const wikipediaTop = (entry.sources.wikipedia?.candidates || [])
        .slice(0, 3)
        .map((candidate) => candidate.title)
        .join(' | ');
      const datamuseTop = (entry.sources.datamuse?.candidates || [])
        .slice(0, 5)
        .map((candidate) => `${candidate.word}:${(candidate.definitions || []).slice(0, 1).join('/')}`)
        .join(' | ');
      const omniglotTop = (entry.sources.omniglot?.candidates || [])
        .slice(0, 5)
        .map((candidate) => `${candidate.title}:${candidate.extract}`)
        .join(' | ');

      return [
        entry.token,
        entry.count,
        [...entry.levels].join(','),
        entry.synthesis.confidence.toFixed(2),
        entry.synthesis.status,
        entry.synthesis.noise.join(' | '),
        entry.synthesis.languageCount,
        entry.synthesis.hasEtymology ? 'yes' : 'no',
        wiktionaryTop,
        wikipediaTop,
        datamuseTop,
        omniglotTop,
      ].map(cleanTsv);
    });

  return [header.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
}

function cleanTsv(value) {
  return String(value ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderWiktionary(lines, source) {
  lines.push('#### Wiktionary');
  if (!source?.found) {
    lines.push(`- not found${source?.error ? `: ${source.error}` : ''}`);
    lines.push('');
    return;
  }

  for (const candidate of source.candidates.slice(0, 6)) {
    lines.push(`- ${candidate.language}${candidate.etymology ? ' | etymology yes' : ''}`);
    if (candidate.etymology) lines.push(`  - etymology: ${candidate.etymology}`);
    for (const definition of (candidate.definitions || []).slice(0, 3)) {
      lines.push(`  - def: ${definition}`);
    }
  }
  lines.push('');
}

function renderWikipedia(lines, source) {
  lines.push('#### Wikipedia');
  if (!source?.found) {
    lines.push('- not found');
    lines.push('');
    return;
  }
  for (const candidate of source.candidates.slice(0, 3)) {
    lines.push(`- ${candidate.title}: ${candidate.extract}`);
  }
  lines.push('');
}

function renderDatamuse(lines, source) {
  lines.push('#### Datamuse');
  if (!source?.found) {
    lines.push('- not found');
    lines.push('');
    return;
  }
  for (const candidate of source.candidates.slice(0, 5)) {
    lines.push(`- ${candidate.word}${candidate.definitions.length ? `: ${candidate.definitions.slice(0, 2).join('; ')}` : ''}`);
  }
  lines.push('');
}

function renderOmniglot(lines, source) {
  lines.push('#### Omniglot');
  if (!source?.found) {
    lines.push(`- not found${source?.error ? `: ${source.error}` : ''}`);
    lines.push('');
    return;
  }
  for (const candidate of source.candidates.slice(0, 5)) {
    lines.push(`- ${candidate.title}: ${candidate.extract}`);
    lines.push(`  - source: ${candidate.sourceUrl}`);
  }
  lines.push('');
}

function splitLanguageSections(wikitext) {
  const lines = wikitext.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = /^==([^=]+)==\s*$/.exec(line);
    if (match) {
      if (current) sections.push(current);
      current = { language: cleanWiki(match[1]), body: '' };
      continue;
    }
    if (current) current.body += `${line}\n`;
  }
  if (current) sections.push(current);
  return sections;
}

function extractDefinitions(sectionBody) {
  return sectionBody
    .split(/\r?\n/)
    .filter((line) => /^#\s*(?![:*#])/.test(line))
    .map((line) => cleanWiki(line.replace(/^#\s*/, '')))
    .filter(Boolean)
    .filter((line) => line !== '.');
}

function extractEtymology(sectionBody) {
  const match = /===Etymology(?: \d+)?===([\s\S]*?)(?=\n===|\n==|$)/.exec(sectionBody);
  if (!match) return '';
  return cleanWiki(match[1]).slice(0, 700);
}

function extractDescendantHints(sectionBody) {
  const hints = [];
  const descendantBlock = /====Descendants====([\s\S]*?)(?=\n====|\n===|\n==|$)/.exec(sectionBody);
  if (!descendantBlock) return hints;
  for (const line of descendantBlock[1].split(/\r?\n/)) {
    const cleaned = cleanWiki(line);
    if (cleaned) hints.push(cleaned);
    if (hints.length >= 8) break;
  }
  return hints;
}

function cleanWiki(value) {
  return String(value || '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/'{2,}/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHtml(value) {
  return cleanWiki(String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>'));
}

function decodeDuckDuckGoUrl(value) {
  const raw = cleanHtml(value);
  try {
    const url = new URL(raw, 'https://duckduckgo.com');
    const uddg = url.searchParams.get('uddg');
    return uddg ? decodeURIComponent(uddg) : url.href;
  } catch {
    return raw;
  }
}

function cleanToken(value) {
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
