import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const node = process.execPath;

const f1rDir = "cases/f1r-full";
const f1vDir = "cases/f1v-full";
const f2rDir = "cases/f2r-full";
const f47vDir = "cases/f47v-full";
const combinedDir = "cases/combined-f1r-f1v-f2r-f47v-full-current";
const currentImages = "page-003.jpg,page-004.jpg,page-005.jpg,page-094.jpg";
const currentSymbols = "d:1,e:1,c:1,c:2,f:1,a:1,h:1,h:2,m:1,g:1,j:1,n:1,k:1,l:1";

const commands = [
  ["Extract full f1r EVA", ["scripts/extract-ivtff-page.js", "--source", "sources/IT2a-n.txt", "--page", "f1r", "--out-dir", f1rDir]],
  ["Extract full f1v EVA", ["scripts/extract-ivtff-page.js", "--source", "sources/IT2a-n.txt", "--page", "f1v", "--out-dir", f1vDir]],
  ["Extract full f2r EVA", ["scripts/extract-ivtff-page.js", "--source", "sources/IT2a-n.txt", "--page", "f2r", "--out-dir", f2rDir]],
  ["Extract full f47v EVA", ["scripts/extract-ivtff-page.js", "--source", "sources/IT2a-n.txt", "--page", "f47v", "--out-dir", f47vDir]],
  ["Export page-003 atoms", ["scripts/export-datasetcreator-atoms.js", "--image", "page-003.jpg", "--out", `${f1rDir}/atoms-current.tsv`]],
  ["Export page-004 atoms", ["scripts/export-datasetcreator-atoms.js", "--image", "page-004.jpg", "--out", `${f1vDir}/atoms-current.tsv`]],
  ["Export page-005 atoms", ["scripts/export-datasetcreator-atoms.js", "--image", "page-005.jpg", "--out", `${f2rDir}/atoms-current.tsv`]],
  ["Export page-094 atoms", ["scripts/export-datasetcreator-atoms.js", "--image", "page-094.jpg", "--out", `${f47vDir}/atoms-current.tsv`]],
  ["f1r role entropy", ["scripts/role-entropy.js", "--eva", `${f1rDir}/eva-tokens.tsv`, "--atoms", `${f1rDir}/atoms-current.tsv`, "--out", `${f1rDir}/role-entropy.md`]],
  ["f1v role entropy", ["scripts/role-entropy.js", "--eva", `${f1vDir}/eva-tokens.tsv`, "--atoms", `${f1vDir}/atoms-current.tsv`, "--out", `${f1vDir}/role-entropy.md`]],
  ["f2r role entropy", ["scripts/role-entropy.js", "--eva", `${f2rDir}/eva-tokens.tsv`, "--atoms", `${f2rDir}/atoms-current.tsv`, "--out", `${f2rDir}/role-entropy.md`]],
  ["f1r atom symbols", ["scripts/list-atom-symbols.js", "--atoms", `${f1rDir}/atoms-current.tsv`, "--out", `${f1rDir}/atom-symbols.md`]],
  ["f1v atom symbols", ["scripts/list-atom-symbols.js", "--atoms", `${f1vDir}/atoms-current.tsv`, "--out", `${f1vDir}/atom-symbols.md`]],
  ["f2r atom symbols", ["scripts/list-atom-symbols.js", "--atoms", `${f2rDir}/atoms-current.tsv`, "--out", `${f2rDir}/atom-symbols.md`]],
  ["f47v atom symbols", ["scripts/list-atom-symbols.js", "--atoms", `${f47vDir}/atoms-current.tsv`, "--out", `${f47vDir}/atom-symbols.md`]],
  ["Combine current cases", ["scripts/combine-cases.js", "--cases", `${f1rDir},${f1vDir},${f2rDir},${f47vDir}`, "--out-dir", combinedDir]],
  ["Line alignment audit", ["scripts/line-alignment-audit.js", "--case-dir", combinedDir, "--page-image-map", "f1r=page-003.jpg,f1v=page-004.jpg,f2r=page-005.jpg,f47v=page-094.jpg"]],
  ["Combined role entropy", ["scripts/role-entropy.js", "--eva", `${combinedDir}/eva-tokens.tsv`, "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/role-entropy.md`]],
  ["Combined atom symbols", ["scripts/list-atom-symbols.js", "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/atom-symbols.md`]],
  ["Particle rule discovery", ["scripts/contextual-rule-discovery.js", "--scope", "particle", "--symbols", currentSymbols, "--images", currentImages, "--out", `${combinedDir}/contextual-rule-discovery.md`, "--tsv", `${combinedDir}/contextual-rule-discovery.tsv`]],
  ["Molecule rule discovery", ["scripts/contextual-rule-discovery.js", "--scope", "molecule", "--symbols", currentSymbols, "--images", currentImages, "--out", `${combinedDir}/contextual-rule-discovery-molecule-scope.md`, "--tsv", `${combinedDir}/contextual-rule-discovery-molecule-scope.tsv`]],
  ["Molecule neighbor discovery", ["scripts/molecule-neighbor-discovery.js", "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/molecule-neighbor-discovery.md`, "--tsv", `${combinedDir}/molecule-neighbor-discovery.tsv`]],
  ["Search-space audit", ["scripts/search-space-audit.js", "--images", currentImages, "--scopes", "particle,molecule", "--out", `${combinedDir}/search-space-audit.md`, "--tsv", `${combinedDir}/search-space-audit.tsv`]],
  ["Conditional entropy", ["scripts/conditional-entropy.js", "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/conditional-entropy.md`, "--tsv", `${combinedDir}/conditional-entropy.tsv`]],
  ["Variant ablation", ["scripts/variant-ablation.js", "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/variant-ablation.md`, "--tsv", `${combinedDir}/variant-ablation.tsv`]],
  ["Macro lexeme analysis", ["scripts/macro-lexeme-analysis.js", "--atoms", `${combinedDir}/atoms-current.tsv`, "--out", `${combinedDir}/macro-lexeme-analysis.md`, "--tsv", `${combinedDir}/macro-lexeme-analysis.tsv`]],
  ["Visual snapshots", ["scripts/export-visual-snapshots.js", "--images", currentImages, "--out-dir", "artifacts/visual-snapshots/current"]],
  ["Morphology family analysis", ["scripts/morphology-family-analysis.js", "--images", currentImages, "--out", `${combinedDir}/morphology-family-analysis.md`, "--tsv-prefix", `${combinedDir}/morphology-family`]],
  ["Cross-folio particle validation", ["scripts/cross-folio-validation.js", "--rules", `${combinedDir}/contextual-rule-discovery.tsv`, "--scope", "particle", "--images", currentImages, "--out", `${combinedDir}/cross-folio-validation.md`, "--tsv", `${combinedDir}/cross-folio-validation.tsv`]],
  ["e:1 final branch audit", ["scripts/contextual-branch-audit.js", "--symbol", "e:1", "--role", "final", "--split-test", "has_prior", "--split-token", "g:1", "--measure", "starts_with", "--scope", "particle", "--images", currentImages, "--out", `${combinedDir}/e1-final-branch-audit.md`, "--tsv", `${combinedDir}/e1-final-branch-audit.tsv`]],
  ["e:1 final exceptions", ["scripts/contextual-rule-exceptions.js", "--symbol", "e:1", "--role", "final", "--test", "has_prior", "--token", "g:1", "--images", currentImages, "--out", `${combinedDir}/exceptions-e1-final-without-prior-g1.md`, "--tsv", `${combinedDir}/exceptions-e1-final-without-prior-g1.tsv`]],
  ["f:1 medial exceptions", ["scripts/contextual-rule-exceptions.js", "--symbol", "f:1", "--role", "medial", "--test", "next_is", "--token", "i:1", "--images", currentImages, "--out", `${combinedDir}/exceptions-f1-medial-without-next-i1.md`, "--tsv", `${combinedDir}/exceptions-f1-medial-without-next-i1.tsv`]],
  ["m:1 medial exceptions", ["scripts/contextual-rule-exceptions.js", "--symbol", "m:1", "--role", "medial", "--test", "next_is", "--token", "c:1", "--images", currentImages, "--out", `${combinedDir}/exceptions-m1-medial-without-next-c1.md`, "--tsv", `${combinedDir}/exceptions-m1-medial-without-next-c1.tsv`]],
  ["Labeling anomaly audit", ["scripts/labeling-anomaly-audit.js", "--images", currentImages, "--out-dir", combinedDir]],
  ["Build current compressed report", ["scripts/build-current-report.js"]],
  ["Build final complete report", ["scripts/build-complete-report.js"]],
];

for (const [label, args] of commands) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(node, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    const script = path.relative(root, args[0]);
    console.error(`\nFailed while running ${script}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nCurrent analysis complete.");
