const repoBlob = "https://github.com/HydraRosario/VoynichLab/blob/main";
const repoTree = "https://github.com/HydraRosario/VoynichLab/tree/main";
const repoCommit = "https://github.com/HydraRosario/VoynichLab/commit";
const repoTag = "https://github.com/HydraRosario/VoynichLab/releases/tag";
const gh = (path) => `${repoBlob}/${path}`;

const metricLabels = {
  atomsNormalizedLogLoss: { label: "ATOMS normalized log-loss", unit: "bits", desc: "Lower is better. How surprised the model was by the held-out data." },
  evaNormalizedLogLoss: { label: "EVA normalized log-loss", unit: "bits", desc: "Lower is better. Same metric for EVA transcription." },
  atomsMinusEvaNormalizedLogLoss: { label: "ATOMS minus EVA", unit: "bits", desc: "Negative means ATOMS predicted better than EVA." },
  atomsTop1Accuracy: { label: "ATOMS top-1 accuracy", unit: "ratio", desc: "Higher is better. How often the top guess was correct." },
  evaTop1Accuracy: { label: "EVA top-1 accuracy", unit: "ratio", desc: "Higher is better. Same metric for EVA." },
  atomsUnseenContextRate: { label: "ATOMS unseen context", unit: "ratio", desc: "Lower is better. Fraction of contexts unseen in training." },
  evaUnseenContextRate: { label: "EVA unseen context", unit: "ratio", desc: "Lower is better. Same metric for EVA." },
  atomsOutOfVocabularySymbols: { label: "ATOMS OOV", unit: "count", desc: "Zero means no unknown symbols appeared." },
  folios: { label: "Folios", unit: "count", desc: "Audited folios included in this result." },
  atomsUnits: { label: "ATOMS units", unit: "units", desc: "Physical ATOMS units in the audited corpus." },
  evaUnits: { label: "EVA units", unit: "tokens", desc: "EVA units in the matched corpus scope." },
  atomsTokens: { label: "ATOMS atom tokens", unit: "tokens", desc: "Individual ATOMS labels in the audited corpus." },
  atomsWeightedRoleEntropy: { label: "ATOMS role entropy", unit: "bits", desc: "Lower is more positionally concentrated." },
  evaWeightedRoleEntropy: { label: "EVA role entropy", unit: "bits", desc: "Same positional entropy protocol for EVA." },
  atomsMinusEvaWeightedRoleEntropy: { label: "ATOMS minus EVA entropy", unit: "bits", desc: "Negative means ATOMS is lower entropy than EVA." },
  morphologyFiveNearestNeighborAccuracy: { label: "Morphology 5NN accuracy", unit: "ratio", desc: "Snapshot-derived atom-family separability." },
  pendingAuditCandidates: { label: "Pending audit candidates", unit: "count", desc: "Unresolved current-rule QC candidates." },
  lineAlignmentMismatches: { label: "Line mismatches", unit: "count", desc: "EVA/ATOMS line-count mismatch count." },
};

const outcomeExplanations = {
  supportive: "The preregistered criteria were met. This is evidence, not proof.",
  negative: "The hypothesis was not supported under the defined criteria.",
  inconclusive: "Could not confirm or reject due to methodological limits.",
  methodological: "Result is about the method, not the hypothesis.",
  pending: "Designed but not yet evaluated.",
  superseded: "Replaced by a later version with different design.",
};

const stepTitles = [
  ["1. Start from ink", "We begin with the physical ink strokes on the manuscript page, not with pre-segmented letters."],
  ["2. Label repeated components", "We manually label recurring stroke shapes as ATOMS — structural labels, not letters or phonemes."],
  ["3. Compare sequences statistically", "We compare ATOMS sequences against EVA transcriptions over the same manuscript regions using frozen metrics."],
  ["4. Publish everything", "Every script, table, checksum, commit, and limitation is published. Nothing is hidden."],
];

const noDeciphermentNotes = [
  "VoynichLab does NOT claim to have translated or deciphered the Voynich Manuscript.",
  "ATOMS are stroke labels — not letters, phonemes, or morphemes.",
  "Molecular units are not claimed to be words.",
  "EVA is a valid transcription system; ATOMS is an alternative representation, not a replacement.",
  "All results are based on a small, single-annotator corpus.",
  "Positive results mean preregistered criteria were met, not that the hypothesis is proven.",
  "Negative and inconclusive results are published alongside supportive ones.",
];

const traceabilitySteps = [
  ["Manuscript folio", "Physical page from the Voynich Manuscript (Yale digitization)."],
  ["Annotated strokes", "Ink traces labeled manually in DatasetCreator with ATOMS-V1 labels."],
  ["Sequence data", "Strokes grouped into particles, molecules, and row streams."],
  ["Model prediction", "Local-context model evaluates held-out regions against frozen training data."],
  ["Metrics + report", "Normalized log-loss, top-1 accuracy, unseen context, OOV."],
  ["Commit + tag", "Every result is anchored to a specific Git commit and tag with checksums."],
];

const evidenceCategoryIcons = {
  grammar: "▣",
  comparison: "⇄",
  hypothesis: "?",
  audit: "✓",
  atoms: "◈",
  alignment: "→",
  "null-control": "∅",
};

const registry = { experiments: [], milestones: [], releases: [], site: null, evidence: null, loaded: false };

function html(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`Failed ${p}: ${r.status}`); return r.json(); }

function fmtVal(v) {
  if (typeof v !== "number") return v;
  if (v > 0 && v < 1) return v.toFixed(4);
  return Number.isInteger(v) ? String(v) : v.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function outcomeLabel(o) { return { pending:"Pending", supportive:"Supportive", negative:"Negative", inconclusive:"Inconclusive", methodological:"Methodological", superseded:"Superseded" }[o] || o; }

function barHtml(value, maxValue, color = "var(--accent)") {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return `<span class="metric-bar"><span class="bar-fill" style="width:${pct}%;background:${color}"></span></span>`;
}

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const els = {
  timelineList: $("#timeline-list"),
  noDeciphermentList: $("#no-decipherment-list"),
  experimentSelect: $("#experiment-select"),
  experimentKind: $("#experiment-kind"),
  experimentTitle: $("#experiment-title"),
  experimentMeta: $("#experiment-meta"),
  scoreColumns: $("#score-columns"),
  experimentInterpretation: $("#experiment-interpretation"),
  experimentDetail: $("#experiment-detail"),
  sourceLinks: $("#source-links"),
  currentTitle: $("#current-result-title"),
  currentOutcome: $("#current-outcome"),
  currentMetrics: $("#current-metrics"),
  currentCaption: $("#current-result-caption"),
  currentDefinition: $("#current-definition"),
  currentCallouts: $("#current-callouts"),
  corpusV2Grid: $("#corpus-v2-grid"),
  corpusV2Links: $("#corpus-v2-links"),
  releaseGrid: $("#release-grid"),
  stepsContainer: $("#how-steps"),
  evidenceList: $("#evidence-list"),
  evidenceDetail: $("#evidence-detail"),
  traceabilityList: $("#traceability-list"),
  readerToggle: $("#reader-toggle"),
  researchToggle: $("#research-toggle"),
  readerSections: null,
};

async function loadAll() {
  const [experiments, milestones, releases, site, evidence] = await Promise.all([
    loadJson("./data/research-feed/experiments.json"),
    loadJson("./data/research-feed/milestones.json"),
    loadJson("./data/research-feed/releases.json"),
    loadJson("./data/research-feed/site.json").catch(() => ({ currentExperimentId: null, featuredMilestoneId: null })),
    loadJson("./data/evidence-cases.json").catch(() => null),
  ]);
  registry.experiments = experiments.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.milestones = milestones.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.releases = releases;
  registry.site = site;
  registry.evidence = evidence;
  registry.loaded = true;
}

/* ===== RENDERERS ===== */

function renderTimeline() {
  els.timelineList.innerHTML = registry.milestones.map((item) => {
    const firstLink = item.links?.[0];
    const href = firstLink ? gh(firstLink.path) : `${repoTag}/${item.tag}`;
    return `<li>
      <time datetime="${html(item.date)}">${html(item.date)}</time>
      <div>
        <strong>${html(item.title)}</strong>
        <p>${html(item.summary)}</p>
        ${item.commit && item.commit !== "pending" ? `<span class="commit-ref"><a href="${repoCommit}/${html(item.commit)}">${item.commit.slice(0, 7)}</a></span>` : ""}
      </div>
      <a href="${href}">${html(firstLink?.label || item.tag)}</a>
    </li>`;
  }).join("");
}

function renderNoDecipherment() {
  if (els.noDeciphermentList) {
    els.noDeciphermentList.innerHTML = noDeciphermentNotes.map((n) => `<li>${html(n)}</li>`).join("");
  }
}

function renderHowToRead() {
  if (els.stepsContainer) {
    els.stepsContainer.innerHTML = stepTitles.map(([title, desc], i) => `
      <div class="step-card">
        <span class="step-number">${i + 1}</span>
        <h3>${html(title)}</h3>
        <p>${html(desc)}</p>
      </div>
    `).join("");
  }
}

function renderTraceability() {
  if (els.traceabilityList) {
    els.traceabilityList.innerHTML = traceabilitySteps.map(([step, desc]) => `
      <div class="trace-step">
        <span class="trace-dot"></span>
        <div>
          <strong>${html(step)}</strong>
          <p>${html(desc)}</p>
        </div>
      </div>
    `).join("");
  }
}

function renderCurrentResult() {
  const targetId = registry.site?.currentExperimentId || "prospective-atoms-eva-test-v1";
  const current = registry.experiments.find((e) => e.id === targetId) || registry.experiments.at(-1);
  if (!current) return;

  els.currentTitle.textContent = current.title;
  if (els.currentOutcome) {
    els.currentOutcome.innerHTML = `<span class="outcome ${html(current.outcome)}">${html(outcomeLabel(current.outcome))}</span>`;
  }
  els.currentCaption.textContent = current.result;
  if (els.currentDefinition) els.currentDefinition.textContent = outcomeExplanations[current.outcome] || "";

  if (els.currentCallouts) {
    els.currentCallouts.innerHTML = [
      `Test: ${current.testFolios?.join(", ") || "—"}`,
      `Train: ${current.trainFolios?.join(", ") || "—"}`,
      current.commit ? `<a href="${repoCommit}/${html(current.commit)}">Commit ${current.commit.slice(0, 7)}</a>` : null,
      current.tag ? `<a href="${repoTag}/${html(current.tag)}">${html(current.tag)}</a>` : null,
    ].filter(Boolean).map((i) => `<span>${i}</span>`).join("");
  }

  const m = current.metrics || {};
  const entropyKeys = ["atomsWeightedRoleEntropy", "evaWeightedRoleEntropy", "atomsMinusEvaWeightedRoleEntropy", "morphologyFiveNearestNeighborAccuracy", "pendingAuditCandidates", "lineAlignmentMismatches"];
  const predictionKeys = ["atomsNormalizedLogLoss", "evaNormalizedLogLoss", "atomsTop1Accuracy", "evaTop1Accuracy", "atomsUnseenContextRate", "evaUnseenContextRate"];
  const primaryKeys = entropyKeys.some((k) => k in m) ? entropyKeys : predictionKeys;
  const maxVal = Math.max(...primaryKeys.map((k) => typeof m[k] === "number" ? m[k] : 0), 1);

  els.currentMetrics.innerHTML = primaryKeys.filter((k) => k in m).map((key) => {
    const info = metricLabels[key] || {};
    const val = m[key];
    const bar = typeof val === "number" ? barHtml(val, maxVal, key.startsWith("atoms") ? "var(--accent)" : "var(--accent-2)") : "";
    return `<div title="${html(info.desc || "")}">
      <dt>${html(info.label || key)}</dt>
      <dd>${bar}<span class="metric-val"><strong>${html(fmtVal(val))}</strong> <small>${html(info.unit || "")}</small></span></dd>
    </div>`;
  }).join("");
}

function renderCorpusV2() {
  if (!els.corpusV2Grid || !els.corpusV2Links) return;
  const targetId = "corpus-v2-audited-robustness-replay";
  const current = registry.experiments.find((e) => e.id === targetId)
    || registry.experiments.find((e) => e.id === "corpus-v2-audited-robustness-replay");
  if (!current) return;

  const m = current.metrics || {};
  const pending = Number(m.pendingAuditCandidates ?? 0);
  const lineMismatches = Number(m.lineAlignmentMismatches ?? 0);
  const folios = Number(m.folios ?? current.testFolios?.length ?? 0);

  els.corpusV2Grid.innerHTML = `
    <article class="corpus-card main">
      <span class="version-badge">${html(folios ? `${folios} folios` : "Audited corpus")}</span>
      <h3>${html(pending)} pending audit candidates</h3>
      <p>The current audit gates report ${html(pending)} unresolved labeling candidates and ${html(lineMismatches)} line-count mismatches. Known valid rare structures remain documented rather than forced away.</p>
    </article>
    ${corpusMetricCard("ATOMS entropy", m.atomsWeightedRoleEntropy, `Weighted positional entropy over ${fmtVal(m.atomsUnits)} physical units.`)}
    ${corpusMetricCard("EVA entropy", m.evaWeightedRoleEntropy, `Same positional entropy protocol over ${fmtVal(m.evaUnits)} EVA units.`)}
    ${corpusMetricCard("Morphology 5NN", percent(m.morphologyFiveNearestNeighborAccuracy), "Snapshot-derived family separability after the audit replay.")}
  `;

  const reportPath = current.reportPath || "research/frozen/CORPUS-V2-AUDITED/reports/CEO-FINAL-CORPUS-V2-REPORT.md";
  const checksumPath = (current.dataTablePaths || []).find((p) => p.endsWith("checksums.txt")) || "research/frozen/CORPUS-V2-AUDITED/checksums.txt";
  els.corpusV2Links.innerHTML = [
    ["Frozen corpus", `${repoTree}/research/frozen/CORPUS-V2-AUDITED`],
    ["Final report", gh(reportPath)],
    ["Checksums", gh(checksumPath)],
  ].map(([label, href]) => `<a href="${href}">${html(label)}</a>`).join("");
}

function corpusMetricCard(label, value, description) {
  return `<article class="corpus-card">
    <span>${html(label)}</span>
    <strong>${html(fmtVal(value))}</strong>
    <p>${html(description)}</p>
  </article>`;
}

function percent(value) {
  return typeof value === "number" ? `${(value * 100).toFixed(2)}%` : value;
}

function renderExperimentOptions() {
  els.experimentSelect.innerHTML = registry.experiments.map((e) =>
    `<option value="${html(e.id)}">${html(e.title)}</option>`
  ).join("");
  const tid = registry.site?.currentExperimentId;
  els.experimentSelect.value = tid && registry.experiments.find((e) => e.id === tid) ? tid : registry.experiments.at(-1)?.id;
  renderExperiment();
}

function renderExperiment() {
  const e = registry.experiments.find((ex) => ex.id === els.experimentSelect.value) || registry.experiments[0];
  if (!e) return;

  const expl = outcomeExplanations[e.outcome] || "";
  els.experimentKind.innerHTML = `<span class="outcome ${html(e.outcome)}">${html(outcomeLabel(e.outcome))}</span> <span class="outcome-explanation">${html(expl)}</span>`;
  els.experimentTitle.textContent = e.title;

  els.experimentMeta.innerHTML = `
    <div><span>Status</span><strong>${html(e.status)}</strong></div>
    <div><span>Train</span><strong>${html(e.trainFolios.join(" · ") || "—")}</strong></div>
    <div><span>Test</span><strong>${html(e.testFolios.join(" · ") || "—")}</strong></div>
    <div><span>Tag</span><strong>${e.tag ? `<a href="${repoTag}/${html(e.tag)}">${html(e.tag)}</a>` : "—"}</strong></div>`;

  const metricEntries = Object.entries(e.metrics || {});
  const maxM = Math.max(...metricEntries.map(([, v]) => typeof v === "number" ? v : 0), 1);
  els.scoreColumns.innerHTML = metricEntries.slice(0, 8).map(([key, val]) => {
    const info = metricLabels[key] || {};
    const bar = typeof val === "number" ? barHtml(val, maxM, key.startsWith("atoms") || key.includes("Atoms") ? "var(--accent)" : "var(--accent-2)") : "";
    return `<div class="score-card" title="${html(info.desc || "")}">
      <span>${html(info.label || key)}</span>
      <strong>${html(fmtVal(val))}</strong>
      ${bar}
      <small>${html(info.unit || "metric")}</small>
    </div>`;
  }).join("");

  els.experimentInterpretation.textContent = e.interpretation;

  els.experimentDetail.innerHTML = `
    <div><h3>Question</h3><p>${html(e.question)}</p></div>
    <div><h3>Result</h3><p>${html(e.result)}</p></div>
    <div><h3>Limitations</h3><ul>${e.limitations.map((l) => `<li>${html(l)}</li>`).join("")}</ul></div>
    <div><h3>Reproduce</h3><ul>${e.commands.map((c) => `<li><code>${html(c)}</code></li>`).join("")}</ul></div>`;

  const ab = `./data/artifacts/public/${e.id}`;
  els.sourceLinks.innerHTML = [
    ["Report", gh(e.reportPath)], ["Manifest", `${ab}/manifest.json`], ["Metrics", `${ab}/metrics.json`],
    ["Checksums", `${ab}/checksums.txt`], ["Script", gh(e.sourceScript)],
    e.tag ? ["Tag", `${repoTag}/${e.tag}`] : null, e.commit ? ["Commit", `${repoCommit}/${e.commit}`] : null,
  ].filter(Boolean).map(([l, h]) => `<a href="${h}">${html(l)}</a>`).join("");
}

function renderReleases() {
  els.releaseGrid.innerHTML = registry.releases.map((r) => `
    <article class="release-card">
      <span>${html(r.date)}</span>
      <h3>${html(r.title)}</h3>
      <p>${html(r.summary)}</p>
      <dl>
        <div><dt>Tag</dt><dd><a href="${repoTag}/${html(r.tag)}">${html(r.tag)}</a></dd></div>
        <div><dt>Target</dt><dd><a href="${repoCommit}/${html(r.targetCommit)}">${r.targetCommit.slice(0, 7)}</a></dd></div>
      </dl>
    </article>
  `).join("");
}

function renderEvidence() {
  if (!registry.evidence || !els.evidenceList) return;
  const cases = registry.evidence.cases || [];
  els.evidenceList.innerHTML = cases.map((c) => {
    const icon = evidenceCategoryIcons[c.category] || "•";
    return `<div class="evidence-card" onclick="showEvidence('${html(c.id)}')">
      <span class="evidence-icon">${icon}</span>
      <div>
        <strong>${html(c.title)}</strong>
        <p>${html(c.summary)}</p>
        <span class="evidence-tag ${html(c.category)}">${html(c.category)}</span>
      </div>
    </div>`;
  }).join("");

  if (cases.length > 0) showEvidence(cases[0].id);
}

window.showEvidence = function(id) {
  const c = registry.evidence?.cases?.find((x) => x.id === id);
  if (!c || !els.evidenceDetail) return;
  els.evidenceDetail.innerHTML = `<button class="modal-close" onclick="document.getElementById('evidence-detail').innerHTML='<p>Select a case</p>'">✕</button>
    <h3>${html(c.title)}</h3>
    <p class="evidence-summary">${html(c.summary)}</p>
    <div class="evidence-meta">
      <span>Category: ${html(c.category)}</span>
      <span>${c.folio ? `Folio: ${html(c.folio)}` : ""}</span>
    </div>
    ${c.atomsSequence ? `<div class="evidence-sequence"><strong>ATOMS:</strong> <code>${html(c.atomsSequence)}</code></div>` : ""}
    ${c.evaToken ? `<div class="evidence-sequence"><strong>EVA:</strong> <code>${html(c.evaToken)}</code></div>` : ""}
    ${c.slotExplanation ? `<p class="evidence-note">Slot: ${html(c.slotExplanation)}</p>` : ""}
    <ul>${(c.highlights || []).map((h) => `<li>${html(h)}</li>`).join("")}</ul>
    ${c.reportLinks ? `<div class="source-links">${c.reportLinks.map((l) => `<a href="${gh(l.path)}">${html(l.label)}</a>`).join("")}</div>` : ""}`;
};

function renderNegativeResults() {
  const negatives = registry.experiments.filter((e) => e.outcome === "negative" || e.outcome === "inconclusive");
  const container = document.getElementById("negative-cards");
  if (!container) return;
  container.innerHTML = negatives.map((e) => `
    <div class="negative-card">
      <span class="outcome ${html(e.outcome)}">${html(outcomeLabel(e.outcome))}</span>
      <h3>${html(e.title)}</h3>
      <p>${html(e.result)}</p>
      <div class="source-links">
        <a href="${gh(e.reportPath)}">Report</a>
        ${e.tag ? `<a href="${repoTag}/${html(e.tag)}">Tag</a>` : ""}
      </div>
    </div>
  `).join("");
}

/* ===== MODE TOGGLE ===== */
function initModeToggle() {
  const reader = els.readerToggle;
  const research = els.researchToggle;
  if (!reader || !research) return;

  function setMode(mode) {
    document.body.classList.remove("mode-reader", "mode-research");
    document.body.classList.add(`mode-${mode}`);
    reader.classList.toggle("active", mode === "reader");
    research.classList.toggle("active", mode === "research");
  }

  reader.addEventListener("click", () => setMode("reader"));
  research.addEventListener("click", () => setMode("research"));
  setMode("reader");
}

/* ===== BOOT ===== */
els.experimentSelect?.addEventListener("change", renderExperiment);

initModeToggle();
renderHowToRead();
renderTraceability();
renderNoDecipherment();

loadAll().then(() => {
  renderTimeline();
  renderCurrentResult();
  renderCorpusV2();
  renderExperimentOptions();
  renderReleases();
  renderEvidence();
  renderNegativeResults();
}).catch((err) => {
  els.currentTitle.textContent = "Registry unavailable";
  els.currentCaption.textContent = err.message;
});
