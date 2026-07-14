const repoBlob = "https://github.com/HydraRosario/VoynichLab/blob/main";
const gh = (path) => `${repoBlob}/${path}`;

const timeline = [
  {
    date: "2026-07-13",
    title: "ATOMS-V1 frozen",
    body: "The current 16-symbol stroke inventory became the fixed representation for public experiments.",
    href: gh("GrammarDiscoveryLab/docs/ATOMS-V1-SPECIFICATION.md"),
  },
  {
    date: "2026-07-13",
    title: "GRAMMAR-V1 frozen",
    body: "Molecular substitution and optional families were induced from f1r, f1v, and f47v before held-out evaluation.",
    href: gh("GrammarDiscoveryLab/frozen/GRAMMAR-V1-2026-07-13/MANIFEST.md"),
  },
  {
    date: "2026-07-13",
    title: "f2r and f2v compatibility",
    body: "Frozen GRAMMAR-V1 produced 8/8 clean observed substitution families on f2r and 7/7 on prospective f2v.",
    href: gh("GrammarDiscoveryLab/out/reproducible-release-v1/VALIDATION-SUMMARY.md"),
  },
  {
    date: "2026-07-13",
    title: "Contextual null weakened the grammar interpretation",
    body: "The broad null looked extreme, but the contextual null produced p approximately 0.099, reducing the strength of the full-frame grammar claim.",
    href: gh("GrammarDiscoveryLab/out/null-control-v2-contextual/NULL-CONTROL-V2-CONTEXTUAL.md"),
  },
  {
    date: "2026-07-13",
    title: "Exact frames did not beat local context",
    body: "NULL-CONTROL-V3 showed exact frozen frame identity was slightly worse than local context for held-out prediction.",
    href: gh("GrammarDiscoveryLab/out/null-control-v3/NULL-CONTROL-V3-MODEL-COMPARISON.md"),
  },
  {
    date: "2026-07-13",
    title: "Regional ATOMS-EVA comparison",
    body: "ATOMS showed lower normalized uncertainty, higher top-1 accuracy, and lower unseen-context rate over aligned manuscript regions.",
    href: gh("GrammarDiscoveryLab/out/representation-comparison-v2-regions/REPRESENTATION-COMPARISON-V2-REGIONS.md"),
  },
  {
    date: "2026-07-13",
    title: "Length and position ablations",
    body: "ATOMS retained lower normalized log-loss without exact regional length in neighbors-only and coarse-position models.",
    href: gh("GrammarDiscoveryLab/out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md"),
  },
];

const atoms = [
  "a:1", "b:1", "c:1", "c:2", "d:1", "e:1", "f:1", "g:1",
  "h:1", "h:2", "i:1", "j:1", "k:1", "l:1", "m:1", "n:1",
];

const experiments = {
  "regional-v2": {
    title: "Regional V2",
    kind: "ATOMS vs EVA",
    sources: [
      ["Report", gh("GrammarDiscoveryLab/out/representation-comparison-v2-regions/REPRESENTATION-COMPARISON-V2-REGIONS.md")],
      ["Summary TSV", gh("GrammarDiscoveryLab/out/representation-comparison-v2-regions/representation-comparison-v2-summary.tsv")],
    ],
    subsets: {
      all: {
        label: "All aligned regions",
        metrics: {
          atomsNorm: "0.8079",
          evaNorm: "0.8927",
          atomsTop1: "42.96%",
          evaTop1: "26.30%",
          atomsUnseen: "46.18%",
          evaUnseen: "60.47%",
        },
        interpretation: "ATOMS is favorable on normalized log-loss, top-1 accuracy, and unseen-context rate over 65 held-out aligned regions.",
      },
      medium: {
        label: "Medium confidence",
        metrics: {
          atomsNorm: "0.8437",
          evaNorm: "0.9440",
          atomsTop1: "38.16%",
          evaTop1: "16.13%",
          atomsUnseen: "48.68%",
          evaUnseen: "74.19%",
        },
        interpretation: "The ATOMS advantage survives the strict medium-confidence subset, though the sample is small.",
      },
      oneToOne: {
        label: "1:1 regions",
        metrics: {
          atomsNorm: "0.8192",
          evaNorm: "0.9111",
          atomsTop1: "37.65%",
          evaTop1: "22.22%",
          atomsUnseen: "47.53%",
          evaUnseen: "68.25%",
        },
        interpretation: "The result is not only driven by low-confidence N:M alignment regions.",
      },
    },
  },
  "ablations-v3": {
    title: "Ablations V3",
    kind: "Feature robustness",
    sources: [
      ["Report", gh("GrammarDiscoveryLab/out/representation-comparison-v3-ablations/REPRESENTATION-COMPARISON-V3-ABLATIONS.md")],
      ["Summary TSV", gh("GrammarDiscoveryLab/out/representation-comparison-v3-ablations/representation-comparison-v3-summary.tsv")],
    ],
    subsets: {
      model0: {
        label: "MODEL 0 - unigram",
        metrics: {
          atomsNorm: "0.8274",
          evaNorm: "0.8727",
          atomsTop1: "28.74%",
          evaTop1: "15.91%",
          atomsUnseen: "0.00%",
          evaUnseen: "0.00%",
        },
        interpretation: "ATOMS is already more concentrated under unigram prediction, so frequency distribution contributes to the advantage.",
      },
      model1: {
        label: "MODEL 1 - neighbors only",
        metrics: {
          atomsNorm: "0.2427",
          evaNorm: "0.4320",
          atomsTop1: "79.19%",
          evaTop1: "66.50%",
          atomsUnseen: "0.97%",
          evaUnseen: "2.68%",
        },
        interpretation: "ATOMS remains favorable without exact regional length or positional role, strengthening the local-structure reading.",
      },
      model2: {
        label: "MODEL 2 - neighbors + coarse position",
        metrics: {
          atomsNorm: "0.3101",
          evaNorm: "0.5533",
          atomsTop1: "79.42%",
          evaTop1: "62.98%",
          atomsUnseen: "2.02%",
          evaUnseen: "9.72%",
        },
        interpretation: "ATOMS remains favorable with coarse positional thirds and no exact length feature.",
      },
      model3: {
        label: "MODEL 3 - published V2",
        metrics: {
          atomsNorm: "0.8079",
          evaNorm: "0.8927",
          atomsTop1: "42.96%",
          evaTop1: "26.30%",
          atomsUnseen: "46.18%",
          evaUnseen: "60.47%",
        },
        interpretation: "Regression check: MODEL 3 reproduces the tagged V2 metrics exactly.",
      },
    },
  },
  "null-controls": {
    title: "Null Controls",
    kind: "Grammar interpretation",
    sources: [
      ["V1 Null", gh("GrammarDiscoveryLab/out/null-control-v1/NULL-CONTROL-V1.md")],
      ["V2 Contextual Null", gh("GrammarDiscoveryLab/out/null-control-v2-contextual/NULL-CONTROL-V2-CONTEXTUAL.md")],
      ["V3 Model Comparison", gh("GrammarDiscoveryLab/out/null-control-v3/NULL-CONTROL-V3-MODEL-COMPARISON.md")],
    ],
    subsets: {
      global: {
        label: "V1 broad null",
        metrics: {
          atomsNorm: "0 / 100000",
          evaNorm: "over-broad",
          atomsTop1: "rare",
          evaTop1: "not final",
          atomsUnseen: "extreme",
          evaUnseen: "rejected",
        },
        interpretation: "The first null made GRAMMAR-V1 look extremely rare, but it drew from an overly broad atom distribution.",
      },
      contextual: {
        label: "V2 contextual null",
        metrics: {
          atomsNorm: "0.0991",
          evaNorm: "contextual p",
          atomsTop1: "9909",
          evaTop1: "hits",
          atomsUnseen: "100000",
          evaUnseen: "runs",
        },
        interpretation: "The contextual null weakened the strong grammar interpretation and moved the project back toward representation-level comparison.",
      },
      frame: {
        label: "V3 frame vs local context",
        metrics: {
          atomsNorm: "1.1497",
          evaNorm: "1.2146",
          atomsTop1: "local",
          evaTop1: "frame",
          atomsUnseen: "better",
          evaUnseen: "worse",
        },
        interpretation: "Exact frame identity did not improve prediction over local context, preserving a negative result in the public record.",
      },
    },
  },
};

const timelineList = document.querySelector("#timeline-list");
const atomGrid = document.querySelector("#atom-grid");
const experimentSelect = document.querySelector("#experiment-select");
const subsetSelect = document.querySelector("#subset-select");
const experimentKind = document.querySelector("#experiment-kind");
const experimentTitle = document.querySelector("#experiment-title");
const scoreColumns = document.querySelector("#score-columns");
const experimentInterpretation = document.querySelector("#experiment-interpretation");
const sourceLinks = document.querySelector("#source-links");

function renderTimeline() {
  timelineList.innerHTML = timeline.map((item) => `
    <li>
      <time datetime="${item.date}">${item.date}</time>
      <div>
        <strong>${item.title}</strong>
        <p>${item.body}</p>
      </div>
      <a href="${item.href}">Source</a>
    </li>
  `).join("");
}

function renderAtoms() {
  atomGrid.innerHTML = atoms.map((atom, index) => `
    <div class="atom">
      <strong>${atom}</strong>
      <span>ATOMS-V1 ${String(index + 1).padStart(2, "0")}</span>
    </div>
  `).join("");
}

function renderExperimentOptions() {
  experimentSelect.innerHTML = Object.entries(experiments).map(([id, experiment]) => `
    <option value="${id}">${experiment.title}</option>
  `).join("");
  renderSubsetOptions();
}

function renderSubsetOptions() {
  const experiment = experiments[experimentSelect.value];
  subsetSelect.innerHTML = Object.entries(experiment.subsets).map(([id, subset]) => `
    <option value="${id}">${subset.label}</option>
  `).join("");
  renderExperiment();
}

function renderExperiment() {
  const experiment = experiments[experimentSelect.value];
  const subset = experiment.subsets[subsetSelect.value];
  experimentKind.textContent = experiment.kind;
  experimentTitle.textContent = `${experiment.title}: ${subset.label}`;
  scoreColumns.innerHTML = [
    ["ATOMS norm", subset.metrics.atomsNorm, "Lower is better"],
    ["EVA norm", subset.metrics.evaNorm, "Lower is better"],
    ["ATOMS top-1", subset.metrics.atomsTop1, "Higher is better"],
    ["EVA top-1", subset.metrics.evaTop1, "Higher is better"],
    ["ATOMS unseen", subset.metrics.atomsUnseen, "Lower is better"],
    ["EVA unseen", subset.metrics.evaUnseen, "Lower is better"],
  ].map(([label, value, note]) => `
    <div class="score-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `).join("");
  experimentInterpretation.textContent = subset.interpretation;
  sourceLinks.innerHTML = experiment.sources.map(([label, href]) => `
    <a href="${href}">${label}</a>
  `).join("");
}

experimentSelect.addEventListener("change", renderSubsetOptions);
subsetSelect.addEventListener("change", renderExperiment);

renderTimeline();
renderAtoms();
renderExperimentOptions();
