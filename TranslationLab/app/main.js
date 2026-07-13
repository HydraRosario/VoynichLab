const romanizationList = document.querySelector('#romanizationList');
const datasetMeta = document.querySelector('#datasetMeta');
const results = document.querySelector('#results');
const translationDraft = document.querySelector('#translationDraft');
const supportNotes = document.querySelector('#supportNotes');
const rootsTable = document.querySelector('#rootsTable');
const unitExplorer = document.querySelector('#unitExplorer');
const rawReport = document.querySelector('.raw-report');
const output = document.querySelector('#output');
const statusBox = document.querySelector('#status');
const loadLatest = document.querySelector('#loadLatest');
const translate = document.querySelector('#translate');
const maxTokens = document.querySelector('#maxTokens');
const minLen = document.querySelector('#minLen');

let latestRomanizations = [];
hideOutput();

loadLatest.addEventListener('click', async () => {
  await busy('Cargando ultimo export...', async () => {
    const data = await getJson('/api/latest-export');
    latestRomanizations = data.romanizations;
    renderRomanizations(latestRomanizations);
    datasetMeta.textContent = `${latestRomanizations.length} unidades. Export: ${data.exportedAt || 'sin fecha'}`;

    if (data.changed.length) {
      statusBox.textContent = `Cargado. Hay ${data.changed.length} diferencia(s) contra el input anterior.`;
      output.textContent = data.changed
        .map((item) => `${item.order}. ${item.previous || '-'} -> ${item.current || '-'}`)
        .join('\n');
      rawReport.open = true;
      showOutput();
    } else {
      statusBox.textContent = 'Cargado. Sin diferencias contra el input anterior.';
      hideOutput();
    }
  });
});

translate.addEventListener('click', async () => {
  await busy('Traduciendo con cherry picking auditado...', async () => {
    if (!latestRomanizations.length) {
      const latest = await getJson('/api/latest-export');
      latestRomanizations = latest.romanizations;
      renderRomanizations(latestRomanizations);
      datasetMeta.textContent = `${latestRomanizations.length} unidades. Export: ${latest.exportedAt || 'sin fecha'}`;
    }
    const data = await postJson('/api/translate', {
      romanizations: latestRomanizations.join('\n'),
      maxTokens: Number(maxTokens.value || 180),
      minLen: Number(minLen.value || 2),
    });
    latestRomanizations = data.romanizations || latestRomanizations;
    renderRomanizations(latestRomanizations);
    datasetMeta.textContent = `${latestRomanizations.length} unidades. Export: ${data.exportedAt || 'sin fecha'}`;
    statusBox.textContent = `Listo. Salida: ${data.translationMd}`;
    output.textContent = data.markdown;
    renderDecisions(data.decisions);
    rawReport.open = false;
    showOutput();
  });
});

function renderRomanizations(items) {
  romanizationList.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item;
    romanizationList.appendChild(li);
  }
}

function renderDecisions(decisions) {
  if (!decisions) {
    translationDraft.textContent = '';
    supportNotes.innerHTML = '';
    rootsTable.innerHTML = '';
    unitExplorer.innerHTML = '';
    return;
  }

  translationDraft.innerHTML = blockquoteToParagraphs(decisions.translationDraft);
  supportNotes.innerHTML = (decisions.supportNotes || [])
    .map((note) => `<li>${escapeHtml(note)}</li>`)
    .join('');
  renderRoots(decisions.roots || []);
  renderUnits(decisions.units || []);
}

function renderRoots(roots) {
  rootsTable.innerHTML = '';
  if (!roots.length) {
    rootsTable.textContent = 'Sin raices elegidas.';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Raiz</th>
        <th>Veces</th>
        <th>Estado</th>
        <th>Glosa</th>
        <th>Fuentes</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement('tbody');
  for (const root of roots.slice(0, 18)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${escapeHtml(root.token)}</code></td>
      <td>${root.count}</td>
      <td><span class="pill ${escapeHtml(root.status || 'noisy')}">${escapeHtml(root.status || '-')}</span></td>
      <td>${escapeHtml(root.gloss || '-')}</td>
      <td>${escapeHtml((root.sources || []).join(', ') || '-')}</td>
    `;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  rootsTable.appendChild(table);
}

function renderUnits(units) {
  unitExplorer.innerHTML = '';
  if (!units.length) {
    unitExplorer.textContent = 'Sin unidades para explorar.';
    return;
  }

  for (const unit of units) {
    const selected = unit.selected;
    const article = document.createElement('article');
    article.className = 'unit-card';
    article.innerHTML = `
      <button class="unit-summary" type="button">
        <span class="unit-number">${unit.order}</span>
        <span class="unit-main">
          <strong>${escapeHtml(unit.romanization)}</strong>
          <small>${escapeHtml((selected?.segmentation || []).join(' - ') || 'sin separacion')}</small>
        </span>
        <span class="unit-score">${formatScore(selected?.score)}</span>
      </button>
      <div class="unit-detail" hidden>
        <div class="decision-grid">
          <div>
            <h3>Eleccion actual</h3>
            ${renderCandidateHtml(selected)}
          </div>
          <div>
            <h3>Alternativas</h3>
            <div class="alternatives">
              ${(unit.alternatives || []).map((candidate, index) => `
                <div class="alternative">
                  <span>${index + 1}</span>
                  ${renderCandidateHtml(candidate)}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const button = article.querySelector('.unit-summary');
    const detail = article.querySelector('.unit-detail');
    button.addEventListener('click', () => {
      detail.hidden = !detail.hidden;
    });
    unitExplorer.appendChild(article);
  }
}

function renderCandidateHtml(candidate) {
  if (!candidate) return '<p class="muted">Sin candidato.</p>';
  const parts = (candidate.parts || []).map((part) => `
    <span class="part ${part.known ? 'known' : 'unknown'}" title="${escapeHtml(part.gloss || '')}">
      <code>${escapeHtml(part.token)}</code>
      <small>${escapeHtml(part.status || '?')}</small>
    </span>
  `).join('');
  return `
    <div class="candidate">
      <div class="segmentation">${parts}</div>
      <p>${escapeHtml(candidate.gloss || '-')}</p>
      <div class="candidate-meta">
        <span>score ${formatScore(candidate.score)}</span>
        <span>${candidate.unknown || 0} desconocidas</span>
        <span>${candidate.strong || 0} fuertes</span>
      </div>
    </div>
  `;
}

function blockquoteToParagraphs(markdown) {
  return String(markdown || '')
    .split(/\n>\s*/g)
    .map((line) => line.replace(/^>\s*/, '').trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

async function busy(message, fn) {
  setDisabled(true);
  statusBox.textContent = message;
  try {
    await fn();
  } catch (err) {
    statusBox.textContent = 'Error.';
    output.textContent = String(err.message || err);
    rawReport.open = true;
    showOutput();
  } finally {
    setDisabled(false);
  }
}

function setDisabled(value) {
  loadLatest.disabled = value;
  translate.disabled = value;
}

function hideOutput() {
  results.hidden = true;
  output.textContent = '';
  translationDraft.textContent = '';
  supportNotes.innerHTML = '';
  rootsTable.innerHTML = '';
  unitExplorer.innerHTML = '';
}

function showOutput() {
  results.hidden = false;
}

function formatScore(value) {
  return Number(value || 0).toFixed(2);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || response.statusText);
  return data;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || response.statusText);
  return data;
}

loadLatest.click();
