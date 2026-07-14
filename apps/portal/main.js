const repoBlob = "https://github.com/HydraRosario/VoynichLab/blob/main";
const repoTree = "https://github.com/HydraRosario/VoynichLab/tree/main";
const gh = (path) => `${repoBlob}/${path}`;

const atoms = [
  "a:1", "b:1", "c:1", "c:2", "d:1", "e:1", "f:1", "g:1",
  "h:1", "h:2", "i:1", "j:1", "k:1", "l:1", "m:1", "n:1",
];

const timelineList = document.querySelector("#timeline-list");
const atomGrid = document.querySelector("#atom-grid");
const experimentSelect = document.querySelector("#experiment-select");
const experimentKind = document.querySelector("#experiment-kind");
const experimentTitle = document.querySelector("#experiment-title");
const experimentMeta = document.querySelector("#experiment-meta");
const scoreColumns = document.querySelector("#score-columns");
const experimentInterpretation = document.querySelector("#experiment-interpretation");
const experimentDetail = document.querySelector("#experiment-detail");
const sourceLinks = document.querySelector("#source-links");
const currentResultTitle = document.querySelector("#current-result-title");
const currentMetrics = document.querySelector("#current-metrics");
const currentResultCaption = document.querySelector("#current-result-caption");
const releaseGrid = document.querySelector("#release-grid");

const registry = {
  experiments: [],
  milestones: [],
  releases: [],
};

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json();
}

async function loadRegistry() {
  const [experiments, milestones, releases] = await Promise.all([
    loadJson("./data/research-feed/experiments.json"),
    loadJson("./data/research-feed/milestones.json"),
    loadJson("./data/research-feed/releases.json"),
  ]);
  registry.experiments = experiments.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.milestones = milestones.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  registry.releases = releases;
}

function outcomeLabel(outcome) {
  const labels = {
    pending: "Pending",
    supportive: "Supportive",
    negative: "Negative",
    inconclusive: "Inconclusive",
    methodological: "Methodological",
    superseded: "Superseded",
  };
  return labels[outcome] || outcome;
}

function formatMetricKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/\bEva\b/g, "EVA")
    .replace(/\bAtoms\b/g, "ATOMS");
}

function formatMetricValue(value) {
  if (typeof value !== "number") return value;
  if (value > 0 && value < 1) return value.toFixed(4);
  return Number.isInteger(value) ? String(value) : value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function renderTimeline() {
  timelineList.innerHTML = registry.milestones.map((item) => {
    const firstLink = item.links?.[0];
    const href = firstLink ? gh(firstLink.path) : `https://github.com/HydraRosario/VoynichLab/releases/tag/${item.tag}`;
    return `
      <li>
        <time datetime="${html(item.date)}">${html(item.date)}</time>
        <div>
          <strong>${html(item.title)}</strong>
          <p>${html(item.summary)}</p>
        </div>
        <a href="${href}">${html(firstLink?.label || item.tag)}</a>
      </li>
    `;
  }).join("");
}

function renderAtoms() {
  atomGrid.innerHTML = atoms.map((atom, index) => `
    <div class="atom">
      <strong>${html(atom)}</strong>
      <span>ATOMS-V1 ${String(index + 1).padStart(2, "0")}</span>
    </div>
  `).join("");
}

function renderCurrentResult() {
  const current = registry.experiments.find((entry) => entry.id === "prospective-atoms-eva-test-v1")
    || registry.experiments.find((entry) => entry.id === "representation-comparison-v3-ablations")
    || registry.experiments.at(-1);
  currentResultTitle.textContent = current.title;
  currentResultCaption.textContent = current.result;
  currentMetrics.innerHTML = Object.entries(current.metrics || {}).slice(0, 6).map(([key, value]) => `
    <div>
      <dt>${html(formatMetricKey(key))}</dt>
      <dd><span>value</span><strong>${html(formatMetricValue(value))}</strong></dd>
    </div>
  `).join("");
}

function renderExperimentOptions() {
  experimentSelect.innerHTML = registry.experiments.map((experiment) => `
    <option value="${html(experiment.id)}">${html(experiment.title)}</option>
  `).join("");
  experimentSelect.value = "prospective-atoms-eva-test-v1";
  if (!experimentSelect.value) experimentSelect.selectedIndex = registry.experiments.length - 1;
  renderExperiment();
}

function renderExperiment() {
  const experiment = registry.experiments.find((entry) => entry.id === experimentSelect.value) || registry.experiments[0];
  experimentKind.innerHTML = `<span class="outcome ${html(experiment.outcome)}">${html(outcomeLabel(experiment.outcome))}</span>`;
  experimentTitle.textContent = experiment.title;
  experimentMeta.innerHTML = `
    <div><span>Status</span><strong>${html(experiment.status)}</strong></div>
    <div><span>Train</span><strong>${html(experiment.trainFolios.join(" · ") || "none")}</strong></div>
    <div><span>Test</span><strong>${html(experiment.testFolios.join(" · ") || "none")}</strong></div>
    <div><span>Tag</span><strong>${html(experiment.tag || "untracked")}</strong></div>
  `;
  scoreColumns.innerHTML = Object.entries(experiment.metrics || {}).slice(0, 8).map(([label, value]) => `
    <div class="score-card">
      <span>${html(formatMetricKey(label))}</span>
      <strong>${html(formatMetricValue(value))}</strong>
      <small>Registry metric</small>
    </div>
  `).join("");
  experimentInterpretation.textContent = experiment.interpretation;
  experimentDetail.innerHTML = `
    <div>
      <h3>Question</h3>
      <p>${html(experiment.question)}</p>
    </div>
    <div>
      <h3>Result</h3>
      <p>${html(experiment.result)}</p>
    </div>
    <div>
      <h3>Limitations</h3>
      <ul>${experiment.limitations.map((item) => `<li>${html(item)}</li>`).join("")}</ul>
    </div>
    <div>
      <h3>Reproduce</h3>
      <ul>${experiment.commands.map((item) => `<li><code>${html(item)}</code></li>`).join("")}</ul>
    </div>
  `;
  const artifactBase = `./data/artifacts/public/${experiment.id}`;
  sourceLinks.innerHTML = [
    ["View report", gh(experiment.reportPath)],
    ["Public manifest", `${artifactBase}/manifest.json`],
    ["Metrics", `${artifactBase}/metrics.json`],
    ["Checksums", `${artifactBase}/checksums.txt`],
    ["Source script", gh(experiment.sourceScript)],
    experiment.tag ? ["Release/tag", `https://github.com/HydraRosario/VoynichLab/releases/tag/${experiment.tag}`] : null,
  ].filter(Boolean).map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
}

function renderReleases() {
  releaseGrid.innerHTML = registry.releases.map((release) => `
    <article class="release-card">
      <span>${html(release.date)}</span>
      <h3>${html(release.title)}</h3>
      <p>${html(release.summary)}</p>
      <dl>
        <div><dt>Tag</dt><dd>${html(release.tag)}</dd></div>
        <div><dt>Target</dt><dd>${html(release.targetCommit.slice(0, 7))}</dd></div>
      </dl>
      <a href="${html(release.url || `https://github.com/HydraRosario/VoynichLab/releases/tag/${release.tag}`)}">Open release</a>
    </article>
  `).join("");
}

function renderFallback(error) {
  currentResultTitle.textContent = "Registry unavailable";
  currentResultCaption.textContent = error.message;
  timelineList.innerHTML = `<li><div><strong>Unable to load research registry</strong><p>${html(error.message)}</p></div></li>`;
}

experimentSelect.addEventListener("change", renderExperiment);

renderAtoms();
loadRegistry()
  .then(() => {
    renderTimeline();
    renderCurrentResult();
    renderExperimentOptions();
    renderReleases();
  })
  .catch(renderFallback);
