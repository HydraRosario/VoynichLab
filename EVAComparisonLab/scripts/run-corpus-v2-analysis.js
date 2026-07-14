import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const node = process.execPath;
const includeMorphology = process.argv.includes("--include-morphology");

const cases = [
  { folio: "f1r", image: "page-003.jpg", dir: "cases/f1r-v2-page003-current" },
  { folio: "f1v", image: "page-004.jpg", dir: "cases/f1v-v2-page004-current" },
  { folio: "f2r", image: "page-005.jpg", dir: "cases/f2r-v2-page005-current" },
  { folio: "f2v", image: "page-006.jpg", dir: "cases/f2v-v2-page006-current" },
  { folio: "f3r", image: "page-007.jpg", dir: "cases/f3r-v2-page007-current" },
  { folio: "f47v", image: "page-094.jpg", dir: "cases/f47v-v2-page094-current" },
];

const combinedDir = "cases/corpus-v2-audited-current";
const currentImages = cases.map((item) => item.image).join(",");
const currentSymbols = "a:1,b:1,c:1,c:2,d:1,e:1,f:1,g:1,h:1,h:2,i:1,j:1,k:1,l:1,m:1,n:1";

const commands = [
  ...cases.flatMap((item) => [
    [`Extract ${item.folio} EVA`, [
      "scripts/extract-ivtff-page.js",
      "--source", "sources/IT2a-n.txt",
      "--page", item.folio,
      "--out-dir", item.dir,
    ]],
    [`Export ${item.image} ATOMS`, [
      "scripts/export-datasetcreator-atoms.js",
      "--image", item.image,
      "--out", `${item.dir}/atoms.tsv`,
    ]],
    [`${item.folio} role entropy`, [
      "scripts/role-entropy.js",
      "--eva", `${item.dir}/eva-tokens.tsv`,
      "--atoms", `${item.dir}/atoms.tsv`,
      "--out", `${item.dir}/role-entropy.md`,
    ]],
    [`${item.folio} atom symbols`, [
      "scripts/list-atom-symbols.js",
      "--atoms", `${item.dir}/atoms.tsv`,
      "--out", `${item.dir}/atom-symbols.md`,
    ]],
  ]),
  ["Combine V2 audited cases", [
    "scripts/combine-cases.js",
    "--cases", cases.map((item) => item.dir).join(","),
    "--out-dir", combinedDir,
  ]],
  ["Line alignment audit", [
    "scripts/line-alignment-audit.js",
    "--case-dir", combinedDir,
    "--page-image-map", cases.map((item) => `${item.folio}=${item.image}`).join(","),
  ]],
  ["Combined role entropy", [
    "scripts/role-entropy.js",
    "--eva", `${combinedDir}/eva-tokens.tsv`,
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/role-entropy.md`,
  ]],
  ["Combined atom symbols", [
    "scripts/list-atom-symbols.js",
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/atom-symbols.md`,
  ]],
  ["Particle rule discovery", [
    "scripts/contextual-rule-discovery.js",
    "--scope", "particle",
    "--symbols", currentSymbols,
    "--images", currentImages,
    "--out", `${combinedDir}/contextual-rule-discovery.md`,
    "--tsv", `${combinedDir}/contextual-rule-discovery.tsv`,
  ]],
  ["Molecule rule discovery", [
    "scripts/contextual-rule-discovery.js",
    "--scope", "molecule",
    "--symbols", currentSymbols,
    "--images", currentImages,
    "--out", `${combinedDir}/contextual-rule-discovery-molecule-scope.md`,
    "--tsv", `${combinedDir}/contextual-rule-discovery-molecule-scope.tsv`,
  ]],
  ["Molecule neighbor discovery", [
    "scripts/molecule-neighbor-discovery.js",
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/molecule-neighbor-discovery.md`,
    "--tsv", `${combinedDir}/molecule-neighbor-discovery.tsv`,
  ]],
  ["Search-space audit", [
    "scripts/search-space-audit.js",
    "--images", currentImages,
    "--scopes", "particle,molecule",
    "--out", `${combinedDir}/search-space-audit.md`,
    "--tsv", `${combinedDir}/search-space-audit.tsv`,
  ]],
  ["Conditional entropy", [
    "scripts/conditional-entropy.js",
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/conditional-entropy.md`,
    "--tsv", `${combinedDir}/conditional-entropy.tsv`,
  ]],
  ["Variant ablation", [
    "scripts/variant-ablation.js",
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/variant-ablation.md`,
    "--tsv", `${combinedDir}/variant-ablation.tsv`,
  ]],
  ["Macro lexeme analysis", [
    "scripts/macro-lexeme-analysis.js",
    "--atoms", `${combinedDir}/atoms.tsv`,
    "--out", `${combinedDir}/macro-lexeme-analysis.md`,
    "--tsv", `${combinedDir}/macro-lexeme-analysis.tsv`,
  ]],
  ...(includeMorphology
    ? [["Morphology family analysis", [
      "scripts/morphology-family-analysis.js",
      "--images", currentImages,
      "--out", `${combinedDir}/morphology-family-analysis.md`,
      "--tsv-prefix", `${combinedDir}/morphology-family`,
    ]]]
    : []),
  ["Cross-folio particle validation", [
    "scripts/cross-folio-validation.js",
    "--rules", `${combinedDir}/contextual-rule-discovery.tsv`,
    "--scope", "particle",
    "--images", currentImages,
    "--out", `${combinedDir}/cross-folio-validation.md`,
    "--tsv", `${combinedDir}/cross-folio-validation.tsv`,
  ]],
  ["Labeling anomaly audit", [
    "scripts/labeling-anomaly-audit.js",
    "--images", currentImages,
    "--out-dir", `${combinedDir}/labeling-anomaly-audit`,
    "--include-learned-patterns",
    "--known-anomalies", "../cases/known-labeling-anomalies.tsv",
  ]],
];

for (const [label, args] of commands) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(node, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`\nFailed during: ${label}`);
    process.exit(result.status ?? 1);
  }
}

writeManifest();
console.log("\nCorpus V2 analysis complete.");

function writeManifest() {
  const outPath = path.resolve(root, combinedDir, "CORPUS-V2-RUN-MANIFEST.md");
  const lines = [
    "# Corpus V2 Audited Run Manifest",
    "",
    "Generated from the live DatasetCreator database after geometry/order audit reached zero pending candidates.",
    "",
    "| Folio | Image | Case directory |",
    "| --- | --- | --- |",
    ...cases.map((item) => `| \`${item.folio}\` | \`${item.image}\` | \`${item.dir}\` |`),
    "",
    `Combined output: \`${combinedDir}\`.`,
    "",
  ];
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
}
