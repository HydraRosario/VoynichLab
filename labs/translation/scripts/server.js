import { execFile } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(labRoot, '..');
const appRoot = path.join(labRoot, 'app');
const port = Number(process.env.PORT || 5174);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (req.method === 'GET' && url.pathname === '/api/latest-export') {
      return json(res, readLatestDatasetRomanizations());
    }
    if (req.method === 'POST' && url.pathname === '/api/translate') {
      const body = await readJson(req);
      return json(res, await runTranslation(body));
    }
    if (req.method === 'GET') {
      return serveStatic(res, url.pathname);
    }
    notFound(res);
  } catch (err) {
    json(res, { ok: false, error: String(err?.message || err) }, 500);
  }
});

server.listen(port, () => {
  console.log(`TranslationLab running at http://localhost:${port}`);
});

function readLatestDatasetRomanizations() {
  const datasetPath = path.join(repoRoot, 'DataSetCreator', 'evidence', 'paragraph-2-page-3', 'page-003_paragraph-2_dataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const romanizations = (dataset.units || [])
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((unit) => unit.reading)
    .filter(Boolean);
  const previousPath = path.join(labRoot, 'inputs', 'page-003-paragraph-2_romanizations.txt');
  const previous = fs.existsSync(previousPath)
    ? fs.readFileSync(previousPath, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];

  return {
    ok: true,
    datasetPath,
    exportedAt: dataset.exportedAt,
    romanizations,
    changed: diffLists(previous, romanizations),
  };
}

async function runTranslation(body) {
  const latest = readLatestDatasetRomanizations();
  const romanizations = latest.romanizations;
  if (!romanizations.length) throw new Error('No romanizations provided.');

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const inputPath = path.join(labRoot, 'inputs', `run-${stamp}.txt`);
  const etymologyMd = path.join(labRoot, 'outputs', `run-${stamp}_etymology.md`);
  const etymologyTsv = path.join(labRoot, 'outputs', `run-${stamp}_etymology.tsv`);
  const translationMd = path.join(labRoot, 'outputs', `run-${stamp}_translation.md`);
  const decisionsJson = path.join(labRoot, 'outputs', `run-${stamp}_decisions.json`);
  fs.mkdirSync(path.dirname(inputPath), { recursive: true });
  fs.mkdirSync(path.dirname(etymologyMd), { recursive: true });
  fs.writeFileSync(inputPath, `${romanizations.join('\n')}\n`, 'utf8');

  const maxTokens = String(Number(body?.maxTokens || 180));
  const minLen = String(Number(body?.minLen || 2));
  const extra = path.join(labRoot, 'cases', 'page-003-paragraph-2', 'human-etymology.tsv');

  await runNode([
    'scripts/etymology-search.js',
    '--romanizations', inputPath,
    '--maxTokens', maxTokens,
    '--minLen', minLen,
    '--delayMs', '40',
    '--out', etymologyMd,
    '--tsv', etymologyTsv,
  ]);

  const translateArgs = [
    'scripts/cherry-pick-translate.js',
    '--romanizations', inputPath,
    '--etymology', etymologyTsv,
    '--out', translationMd,
    '--json', decisionsJson,
  ];
  if (fs.existsSync(extra)) {
    translateArgs.splice(5, 0, '--extraEtymology', extra);
  }
  await runNode(translateArgs);

  return {
    ok: true,
    exportedAt: latest.exportedAt,
    romanizations,
    inputPath,
    etymologyMd,
    etymologyTsv,
    translationMd,
    decisionsJson,
    decisions: JSON.parse(fs.readFileSync(decisionsJson, 'utf8')),
    markdown: fs.readFileSync(translationMd, 'utf8'),
  };
}

function runNode(args) {
  return new Promise((resolve, reject) => {
    execFile(process.execPath, args, { cwd: labRoot, timeout: 600000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${error.message}\n${stderr || stdout}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function diffLists(previous, current) {
  const max = Math.max(previous.length, current.length);
  const changes = [];
  for (let index = 0; index < max; index += 1) {
    if ((previous[index] || '') !== (current[index] || '')) {
      changes.push({
        order: index + 1,
        previous: previous[index] || '',
        current: current[index] || '',
      });
    }
  }
  return changes;
}

function serveStatic(res, pathname) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(appRoot, safePath));
  if (!filePath.startsWith(appRoot)) return notFound(res);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return notFound(res);
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  res.end(fs.readFileSync(filePath));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error('Request too large.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(raw ? JSON.parse(raw) : {}));
    req.on('error', reject);
  });
}

function json(res, payload, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}
