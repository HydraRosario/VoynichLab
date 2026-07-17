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

const noDeciphermentNotes = [
  "VoynichLab does NOT claim to have translated or deciphered the Voynich Manuscript.",
  "ATOMS are stroke labels — not letters, phonemes, or morphemes.",
  "Molecular units are not claimed to be words.",
  "EVA is a valid transcription system; ATOMS is an alternative representation, not a replacement.",
  "All results are based on a small, single-annotator corpus.",
  "Positive results mean preregistered criteria were met, not that the hypothesis is proven.",
  "Negative and inconclusive results are published alongside supportive ones.",
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

const claimLevelLabels = {
  demonstrated: "Demonstrated",
  supported: "Supported",
  hypothesis: "Hypothesis",
  counterexample: "Counterexample",
  audit: "Audit",
  methodological: "Method",
  negative: "Negative",
};

const evidenceEditorial = {
  "family-a-example": { order: 1, chapter: "see", question: "Do the same structures return?", type: "Visual pattern", status: "Supported finding", experimentId: "grammar-v1-f2r-validation" },
  "atom-g1-repeated": { order: 2, chapter: "see", question: "Does one component keep the same role?", type: "Structural observation", status: "Supported finding", experimentId: "corpus-v2-audited-robustness-replay" },
  "molecule-ege": { order: 3, chapter: "see", question: "Can a complete form recur across pages?", type: "Visual pattern", status: "Supported finding", experimentId: "corpus-v2-audited-robustness-replay" },
  "clean-alignment-region": { order: 4, chapter: "test", question: "Can ATOMS and EVA be compared fairly?", type: "Method", status: "Method validated", experimentId: "representation-alignment-v1" },
  "f3r-supportive-region": { order: 5, chapter: "test", question: "Does the pattern survive a new page?", type: "Prospective test", status: "Supported finding", experimentId: "prospective-atoms-eva-test-v1" },
  "atoms-strong-win": { order: 6, chapter: "test", question: "Where does ATOMS preserve more structure?", type: "Comparison", status: "Supported finding", experimentId: "representation-comparison-v2-regions" },
  "eva-competitive-region": { order: 7, chapter: "challenge", question: "Where does EVA remain competitive?", type: "Counterexample", status: "Limiting evidence", experimentId: "representation-comparison-v3-ablations" },
  "known-valid-anomaly": { order: 8, chapter: "challenge", question: "Is every unusual case an error?", type: "Audit", status: "Audit correction", experimentId: "corpus-v2-audited-robustness-replay" },
  "null-control-v2-negative": { order: 9, chapter: "challenge", question: "Could local context explain the pattern?", type: "Negative control", status: "Claim narrowed", experimentId: "null-control-v2-contextual" }
};

const evidenceChapterLabels = {
  see: ["01", "Structural claims"],
  test: ["02", "Methods and tests"],
  challenge: ["03", "Limits and corrections"]
};

const timelineChapters = [
  {
    id: "define",
    number: "01",
    label: "Define the object",
    title: "Freeze the representation before testing it.",
    summary: "ATOMS and its first structural families received stable identities, followed by a release that made their validation inspectable.",
    milestones: ["v1-pre-validation", "grammar-v1", "reproducible-release-v1"]
  },
  {
    id: "challenge",
    number: "02",
    label: "Challenge the signal",
    title: "Compare it where it can lose.",
    summary: "Matched regions and ablations asked whether the result survived fair comparison and whether it depended on one convenient modeling choice.",
    milestones: ["atoms-eva-regional-v1", "atoms-eva-ablations-v1"]
  },
  {
    id: "prospective",
    number: "03",
    label: "Commit in advance",
    title: "Publish the rules before seeing the answer.",
    summary: "The portal exposed the record, then the next protocol and interpretation rules were frozen before the new folio was completed.",
    milestones: ["public-portal-v1", "prospective-atoms-eva-test-v1-preregistration", "prospective-atoms-eva-test-v1"]
  },
  {
    id: "audit",
    number: "04",
    label: "Audit the data",
    title: "Correct human errors without rewriting history.",
    summary: "Corpus V2 preserved its corrections as a new release, then a matched-folio comparison measured what those corrections actually changed.",
    milestones: ["corpus-v2-audited", "corpus-v1-v2-matched-comparison"]
  }
];

const timelineEditorial = {
  "v1-pre-validation": ["Representation frozen", "The visual vocabulary stopped moving before validation began."],
  "grammar-v1": ["Families frozen", "Structural families became testable objects rather than patterns chosen after the fact."],
  "reproducible-release-v1": ["Evidence published", "Expected outputs and checksums gave the frozen validation a public identity."],
  "atoms-eva-regional-v1": ["Matched comparison", "ATOMS and EVA were compared over the same manuscript regions, including negative controls."],
  "atoms-eva-ablations-v1": ["Dependency tested", "The observed advantage survived removal of exact regional sequence length."],
  "public-portal-v1": ["Record opened", "Research artifacts gained a public surface designed for inspection rather than repository navigation."],
  "prospective-atoms-eva-test-v1-preregistration": ["Rules committed", "Models, metrics, and interpretation rules were public before the next annotation was complete."],
  "prospective-atoms-eva-test-v1": ["Prospective result", "The unseen folio reproduced the ATOMS advantage under those frozen rules."],
  "corpus-v2-audited": ["Human error corrected", "A new corpus release preserved reviewed corrections and replayed the main analyses."],
  "corpus-v1-v2-matched-comparison": ["Effect measured", "The shared folios improved slightly, supporting noise removal rather than a manufactured large effect."]
};

const registry = { experiments: [], milestones: [], releases: [], site: null, evidence: null, atoms: [], loaded: false };

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

function initAnchorNavigation() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      event.preventDefault();

      if (hash === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.pushState(null, "", hash);
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      const topbar = document.querySelector(".topbar");
      const sectionHeading = target.firstElementChild?.classList?.contains("section-heading")
        ? target.firstElementChild
        : null;
      const scrollTarget = sectionHeading || target;
      const offset = (topbar?.getBoundingClientRect().height || 0) + 7;
      const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      history.pushState(null, "", hash);
    });
  });
}

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
  evidenceList: $("#evidence-list"),
  evidenceDetail: $("#evidence-detail"),
  atomInventory: $("#atom-inventory"),
  atomModal: $("#atom-modal"),
  atomModalTitle: $("#atom-modal-title"),
  atomModalCount: $("#atom-modal-count"),
  atomModalExamples: $("#atom-modal-examples"),
};

async function loadAll() {
  const [experiments, milestones, releases, site, evidence, atoms] = await Promise.all([
    loadJson("./data/research-feed/experiments.json"),
    loadJson("./data/research-feed/milestones.json"),
    loadJson("./data/research-feed/releases.json"),
    loadJson("./data/research-feed/site.json").catch(() => ({ currentExperimentId: null, featuredMilestoneId: null })),
    loadJson("./data/evidence-cases.json").catch(() => null),
    loadJson("./data/atoms-v1.json").catch(() => []),
  ]);
  registry.experiments = experiments.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.milestones = milestones.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.releases = releases;
  registry.site = site;
  registry.evidence = evidence;
  registry.atoms = atoms;
  registry.loaded = true;
}

/* ===== RENDERERS ===== */

function renderTimeline() {
  const byId = new Map(registry.milestones.map((item) => [item.id, item]));
  els.timelineList.innerHTML = timelineChapters.map((chapter) => {
    const events = chapter.milestones.map((id, index) => {
      const item = byId.get(id);
      if (!item) return "";
      const firstLink = item.links?.[0];
      const href = firstLink ? gh(firstLink.path) : item.tag ? `${repoTag}/${item.tag}` : null;
      const [status, meaning] = timelineEditorial[id] || [item.type, item.summary];
      return `<article class="timeline-event timeline-event-${html(item.type)}">
        <div class="timeline-event-index"><span>${chapter.number}.${index + 1}</span><i></i></div>
        <div class="timeline-event-body">
          <div class="timeline-event-meta"><time datetime="${html(item.date)}">${html(item.date)}</time><span>${html(status)}</span></div>
          <h4>${html(item.title)}</h4>
          <p>${html(meaning)}</p>
          <div class="timeline-event-refs">
            ${href ? `<a href="${href}">${html(firstLink?.label || item.tag)}</a>` : ""}
            ${item.commit && item.commit !== "pending" ? `<a class="commit-ref" href="${repoCommit}/${html(item.commit)}">Commit ${item.commit.slice(0, 7)}</a>` : `<span class="commit-ref">Documented result · not yet tagged</span>`}
          </div>
        </div>
      </article>`;
    }).join("");
    return `<section class="timeline-chapter timeline-chapter-${chapter.id}">
      <header class="timeline-chapter-head"><span>${chapter.number}</span><div><p>${html(chapter.label)}</p><h3>${html(chapter.title)}</h3></div><p>${html(chapter.summary)}</p></header>
      <div class="timeline-events">${events}</div>
    </section>`;
  }).join("");
}

function renderNoDecipherment() {
  if (els.noDeciphermentList) {
    els.noDeciphermentList.innerHTML = noDeciphermentNotes.map((n) => `<li>${html(n)}</li>`).join("");
  }
}

function renderAtomsV1() {
  if (!els.atomInventory) return;
  const atoms = registry.atoms || [];
  els.atomInventory.innerHTML = atoms.map((atom) => {
    const primary = atom.examples?.[0];
    return `
      <button class="atom-card" type="button" data-atom-token="${html(atom.token)}">
        <strong>${html(atom.token)}</strong>
        ${primary ? `<img src="${html(primary.file)}" alt="Real snapshot example of ${html(atom.token)}">` : ""}
        <span>${Number(atom.count).toLocaleString("en-US")} observed instances</span>
      </button>
    `;
  }).join("");

  els.atomInventory.querySelectorAll("[data-atom-token]").forEach((button) => {
    button.addEventListener("click", () => showAtomDetail(button.dataset.atomToken));
  });
}

function showAtomDetail(token) {
  const atom = (registry.atoms || []).find((item) => item.token === token);
  if (!atom || !els.atomModal) return;
  const roleLabels = {
    "closest-to-family-average": "closest to average",
    "near-average-variant": "near variant",
    "distant-variant": "distant variant",
  };
  els.atomModalTitle.textContent = atom.token;
  els.atomModalCount.textContent = `${Number(atom.count).toLocaleString("en-US")} observed instances in the current visual snapshot export.`;
  els.atomModalExamples.innerHTML = (atom.examples || []).map((example) => `
    <figure>
      <img src="${html(example.file)}" alt="Atom ${html(example.atomId)} ${html(atom.token)} from ${html(example.imageName)}">
      <figcaption>${html(roleLabels[example.role] || "variant")} - #${html(example.atomId)}</figcaption>
    </figure>
  `).join("");
  els.atomModal.classList.add("open");
  els.atomModal.setAttribute("aria-hidden", "false");
}

function closeAtomDetail() {
  if (!els.atomModal) return;
  els.atomModal.classList.remove("open");
  els.atomModal.setAttribute("aria-hidden", "true");
}

function renderCurrentResult() {
  if (!els.currentTitle || !els.currentMetrics || !els.currentCaption) return;
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
  const cases = (registry.evidence.cases || [])
    .filter((c) => evidenceEditorial[c.id])
    .sort((a, b) => evidenceEditorial[a.id].order - evidenceEditorial[b.id].order);
  els.evidenceList.innerHTML = Object.keys(evidenceChapterLabels).map((chapter) => {
    const [number, label] = evidenceChapterLabels[chapter];
    const chapterCases = cases.filter((c) => evidenceEditorial[c.id].chapter === chapter);
    return `<section class="evidence-chapter"><header><span>${number}</span><strong>${label}</strong></header>${chapterCases.map((c) => {
      const editorial = evidenceEditorial[c.id];
      return `<button type="button" class="evidence-card" data-evidence-id="${html(c.id)}" onclick="showEvidence('${html(c.id)}')"><span class="evidence-card-number">${String(editorial.order).padStart(2, "0")}</span><span class="evidence-card-copy"><strong>${html(editorial.question)}</strong><small>${html(editorial.type)} · ${html(editorial.status)}</small></span></button>`;
    }).join("")}</section>`;
  }).join("");
  /*
  cases.map((c) => {
    const icon = evidenceCategoryIcons[c.category] || "•";
    const level = c.claimLevel || c.category;
    return `<div class="evidence-card" onclick="showEvidence('${html(c.id)}')">
      <span class="evidence-icon">${icon}</span>
      <div>
        <strong>${html(c.title)}</strong>
        <p>${html(c.summary)}</p>
        <span class="evidence-tag ${html(c.category)}">${html(c.category)}</span>
        <span class="claim-tag ${html(level)}">${html(claimLevelLabels[level] || level)}</span>
      </div>
    </div>`;
  }).join(""); */

  if (cases.length > 0) showEvidence(cases[0].id);
}

function renderLegacyEvidenceDetail(id) {
  const c = registry.evidence?.cases?.find((x) => x.id === id);
  if (!c || !els.evidenceDetail) return;
  els.evidenceDetail.innerHTML = `<button class="modal-close" onclick="document.getElementById('evidence-detail').innerHTML='<p>Select a case</p>'">✕</button>
    <h3>${html(c.title)}</h3>
    <p class="evidence-summary">${html(c.summary)}</p>
    <div class="evidence-meta">
      <span>Category: ${html(c.category)}</span>
      <span>Claim: ${html(claimLevelLabels[c.claimLevel] || c.claimLevel || "Unclassified")}</span>
      <span>${c.folio ? `Folio: ${html(c.folio)}` : ""}</span>
    </div>
    <div class="claim-grid">
      ${c.shows ? `<div><span>Shows</span><p>${html(c.shows)}</p></div>` : ""}
      ${c.doesNotShow ? `<div><span>Does not show</span><p>${html(c.doesNotShow)}</p></div>` : ""}
      ${c.verification ? `<div><span>Verify</span><p>${html(c.verification)}</p></div>` : ""}
    </div>
    ${c.atomsSequence ? `<div class="evidence-sequence"><strong>ATOMS:</strong> <code>${html(c.atomsSequence)}</code></div>` : ""}
    ${c.evaToken ? `<div class="evidence-sequence"><strong>EVA:</strong> <code>${html(c.evaToken)}</code></div>` : ""}
    ${c.slotExplanation ? `<p class="evidence-note">Slot: ${html(c.slotExplanation)}</p>` : ""}
    <ul>${(c.highlights || []).map((h) => `<li>${html(h)}</li>`).join("")}</ul>
    ${c.reportLinks ? `<div class="source-links">${c.reportLinks.map((l) => `<a href="${gh(l.path)}">${html(l.label)}</a>`).join("")}</div>` : ""}`;
}

window.showEvidence = function(id) {
  const c = registry.evidence?.cases?.find((item) => item.id === id);
  const editorial = evidenceEditorial[id];
  if (!c || !editorial || !els.evidenceDetail) return;
  $$(".evidence-card").forEach((card) => card.classList.toggle("active", card.dataset.evidenceId === id));
  const metricVisual = Number.isFinite(c.atomsLogLoss) && Number.isFinite(c.evaLogLoss) ? `<div class="evidence-metric-visual">
    <div><span>ATOMS</span><i style="width:${Math.min(c.atomsLogLoss * 100, 100)}%"></i><strong>${html(c.atomsLogLoss)}</strong></div>
    <div><span>EVA</span><i style="width:${Math.min(c.evaLogLoss * 100, 100)}%"></i><strong>${html(c.evaLogLoss)}</strong></div>
    <small>Normalized log-loss · lower is better</small>
  </div>` : "";
  els.evidenceDetail.innerHTML = `<div class="evidence-detail-head"><div><span><small>Evidence type</small>${html(editorial.type)}</span><span class="evidence-status"><small>Current status</small>${html(editorial.status)}</span></div><p>Evidence case ${editorial.order} of 9</p></div>
    <p class="evidence-detail-question">The question</p>
    <h3>${html(editorial.question)}</h3>
    <p class="evidence-summary">${html(c.summary)}</p>
    ${(c.atomsSequence || c.evaToken) ? `<div class="evidence-observation"><span>What we inspected</span>${c.atomsSequence ? `<p><b>ATOMS</b><code>${html(c.atomsSequence)}</code></p>` : ""}${c.evaToken ? `<p><b>EVA</b><code>${html(c.evaToken)}</code></p>` : ""}${c.folio ? `<small>Manuscript side ${html(c.folio)}</small>` : ""}</div>` : ""}
    ${metricVisual}
    <div class="evidence-conclusion-grid"><div><span>What this supports</span><p>${html(c.shows)}</p></div><div><span>What remains open</span><p>${html(c.doesNotShow)}</p></div></div>
    <div class="evidence-findings"><span>Observed findings</span><ul>${(c.highlights || []).map((highlight) => `<li>${html(highlight)}</li>`).join("")}</ul></div>
    <div class="evidence-record"><div><span>Evidence trail</span><p>${html(c.verification)}</p></div><div class="evidence-trail">${(c.reportLinks || []).map((link) => `<a href="${gh(link.path)}"><small>Source record</small><strong>${html(link.label)}</strong><i>↗</i></a>`).join("")}<button type="button" onclick="openEvidenceExperiment('${html(editorial.experimentId)}')"><small>Connected test</small><strong>Open experiment</strong><i>↓</i></button></div></div>
    <button type="button" class="evidence-experiment-link" onclick="openEvidenceExperiment('${html(editorial.experimentId)}')">See how this observation was tested →</button>`;
};

window.openEvidenceExperiment = function(id) {
  if (!els.experimentSelect || !registry.experiments.some((experiment) => experiment.id === id)) return;
  els.experimentSelect.value = id;
  renderExperiment();
  document.getElementById("experiments")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ===== BOOT ===== */
const main = document.querySelector("main");
const narrativeOrder = [
  document.getElementById("tested"),
  document.getElementById("tools"),
  document.getElementById("corpus-v2"),
  document.querySelector(".no-decipherment"),
  document.getElementById("evidence"),
  document.getElementById("experiments"),
  document.getElementById("lifecycle"),
  document.getElementById("research"),
  document.getElementById("timeline"),
  document.getElementById("releases"),
  document.getElementById("reproduce")
];
if (main && narrativeOrder.every(Boolean)) narrativeOrder.forEach((section) => main.append(section));

initAnchorNavigation();
els.experimentSelect?.addEventListener("change", renderExperiment);
document.querySelectorAll("[data-close-atom-modal]").forEach((element) => element.addEventListener("click", closeAtomDetail));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAtomDetail();
});

renderNoDecipherment();

loadAll().then(() => {
  renderTimeline();
  renderCurrentResult();
  renderCorpusV2();
  renderAtomsV1();
  renderExperimentOptions();
  renderReleases();
  renderEvidence();
}).catch((err) => {
  els.currentTitle.textContent = "Registry unavailable";
  els.currentCaption.textContent = err.message;
});
