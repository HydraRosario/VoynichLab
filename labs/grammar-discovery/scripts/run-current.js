import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const node = process.execPath;

const commands = [
  ["Export molecule table", ["scripts/export-molecule-table.js"]],
  ["Discover grammar", ["scripts/discover-grammar.js"]],
  ["Train/test validation", ["scripts/train-test-validation.js"]],
];

for (const [label, args] of commands) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(node, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`\nFailed while running ${path.relative(root, args[0])}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nGrammar discovery current run complete.");
