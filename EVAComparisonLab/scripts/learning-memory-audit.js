import fs from "node:fs";
import path from "node:path";

import {
  cleanToken,
  defaultDatasetCreatorDbPath,
  groupBy,
  openDatasetDb,
  parseArgs,
  writeTsv,
} from "./atom-sequence-utils.js";

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(args.out_dir ?? "research/audits/learning-memory-current");
const db = openDatasetDb(args.db ?? defaultDatasetCreatorDbPath());

const atoms = atomRows(db);
const particles = particleRows(db);
const currentParticles = buildCurrentParticles(atoms);
const currentMolecules = buildCurrentMolecules(atoms, particles);

const particlePatterns = auditOrderPatternTable(db, "particle_order_patterns", currentParticles);
const moleculePatterns = auditOrderPatternTable(db, "molecule_order_patterns", currentMolecules);
const mergePatterns = auditMergePatterns(db, currentParticles);

writeTsv(path.join(outDir, "particle-order-patterns.tsv"), particlePatterns, patternFields());
writeTsv(path.join(outDir, "molecule-order-patterns.tsv"), moleculePatterns, patternFields());
writeTsv(path.join(outDir, "particle-merge-patterns.tsv"), mergePatterns, [
  "id",
  "status",
  "signature_key",
  "relation",
  "first_token",
  "second_token",
  "current_pair_count",
  "sample_image_id",
  "sample_particle_a",
  "sample_particle_b",
  "updated_at",
  "note",
]);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "LEARNING-MEMORY-AUDIT.md"),
  renderMarkdown({ particlePatterns, moleculePatterns, mergePatterns }),
  "utf8"
);

console.log(`Wrote learning memory audit to ${path.join(outDir, "LEARNING-MEMORY-AUDIT.md")}`);

function atomRows(db) {
  return db.prepare(
    `SELECT
       a.id AS atom_id,
       a.image_id,
       i.name AS image_name,
       a.molecule_id,
       a.particle_id,
       a.atom_order,
       a.family,
       a.structural_config,
       a.bounds_x
     FROM atoms a
     JOIN images i ON i.id = a.image_id
     WHERE a.molecule_id IS NOT NULL
       AND a.particle_id IS NOT NULL
       AND trim(coalesce(a.family, '')) <> ''
     ORDER BY a.image_id, a.molecule_id, a.particle_id, a.atom_order, a.bounds_x, a.id`
  ).all().map((row) => ({
    ...row,
    token: cleanToken(`${row.family}${row.structural_config ? `:${row.structural_config}` : ""}`),
  }));
}

function particleRows(db) {
  return db.prepare(
    `SELECT
       p.image_id,
       i.name AS image_name,
       p.molecule_id,
       p.particle_id,
       p.particle_order,
       p.source_index,
       p.bounds_x,
       p.bounds_y
     FROM particles p
     JOIN images i ON i.id = p.image_id
     ORDER BY p.image_id, p.molecule_id, p.particle_order, p.source_index, p.bounds_x, p.particle_id`
  ).all();
}

function buildCurrentParticles(atomRows) {
  return [...groupBy(atomRows, (row) => `${row.image_id}\u0000${row.particle_id}`).values()]
    .map((rows) => {
      const ordered = rows.slice().sort(atomSort);
      const first = ordered[0];
      const sequenceTokens = ordered.map((row) => row.token);
      return {
        signature_key: particleSignature(sequenceTokens),
        sequence: sequenceTokens.join(" "),
        image_name: first.image_name,
        image_id: first.image_id,
        molecule_id: first.molecule_id,
        particle_id: first.particle_id,
      };
    });
}

function buildCurrentMolecules(atomRows, particleRows) {
  const particleById = new Map(particleRows.map((row) => [`${row.image_id}\u0000${row.particle_id}`, row]));
  const particleTokens = new Map();
  for (const particle of buildCurrentParticles(atomRows)) {
    particleTokens.set(`${particle.image_id}\u0000${particle.particle_id}`, particle.signature_key);
  }

  return [...groupBy(particleRows, (row) => `${row.image_id}\u0000${row.molecule_id}`).values()]
    .map((rows) => {
      const first = rows[0];
      const orderedBySource = rows.slice().sort((a, b) =>
        Number(a.source_index ?? Number.MAX_SAFE_INTEGER) - Number(b.source_index ?? Number.MAX_SAFE_INTEGER)
        || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
        || String(a.particle_id).localeCompare(String(b.particle_id))
      );
      const occurrenceTokensByParticle = new Map();
      const counts = new Map();
      for (const particle of orderedBySource) {
        const base = particleTokens.get(`${particle.image_id}\u0000${particle.particle_id}`) ?? "";
        const next = (counts.get(base) ?? 0) + 1;
        counts.set(base, next);
        occurrenceTokensByParticle.set(particle.particle_id, `${base}#${next}`);
      }

      const orderedByParticleOrder = rows.slice().sort((a, b) =>
        Number(a.particle_order ?? Number.MAX_SAFE_INTEGER) - Number(b.particle_order ?? Number.MAX_SAFE_INTEGER)
        || String(a.particle_id).localeCompare(String(b.particle_id))
      );
      const baseTokens = orderedByParticleOrder
        .map((particle) => particleTokens.get(`${particle.image_id}\u0000${particle.particle_id}`) ?? "")
        .filter(Boolean);
      const occurrenceTokens = orderedByParticleOrder
        .map((particle) => occurrenceTokensByParticle.get(particle.particle_id) ?? "")
        .filter(Boolean);
      return {
        signature_key: moleculeSignature(baseTokens),
        sequence: baseTokens.join(" "),
        occurrence_sequence: occurrenceTokens.join(" "),
        image_name: first.image_name,
        image_id: first.image_id,
        molecule_id: first.molecule_id,
      };
    });
}

function auditOrderPatternTable(db, table, currentItems) {
  const rows = db.prepare(
    `SELECT id, signature_key, ordered_tokens_json, sample_image_id,
            ${table === "particle_order_patterns" ? "sample_particle_id" : "sample_molecule_id"} AS sample_id,
            updated_at
     FROM ${table}
     ORDER BY id`
  ).all();

  const bySignature = groupBy(currentItems, (item) => item.signature_key);
  const out = [];
  for (const row of rows) {
    const learnedTokens = parseJsonArray(row.ordered_tokens_json).map((token) =>
      table === "particle_order_patterns" ? cleanToken(token) : cleanParticleToken(token)
    );
    const learnedSequence = learnedTokens.join(" ");
    const usesOccurrences = learnedTokens.some((token) => /#\d+$/.test(token));
    const current = bySignature.get(row.signature_key) ?? [];
    const counts = countSequences(current, usesOccurrences ? "occurrence_sequence" : "sequence");
    const total = current.length;
    const learnedCount = counts.get(learnedSequence) ?? 0;
    const [dominantSequence = "", dominantCount = 0] = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? [];
    let status = "ok";
    let note = "";
    if (total === 0) {
      status = "stale-signature";
      note = "No current particle/molecule has this signature.";
    } else if (learnedCount === 0) {
      status = "unsupported-order";
      note = "The signature exists, but the learned order is not observed now.";
    } else if (learnedSequence !== dominantSequence) {
      status = "minority-order";
      note = "The learned order exists but is not dominant in current data.";
    }
    out.push({
      id: row.id,
      table,
      status,
      signature_key: row.signature_key,
      learned_sequence: learnedSequence,
      current_count: learnedCount,
      current_total: total,
      dominant_count: dominantCount,
      dominant_sequence: dominantSequence,
      sample_image_id: row.sample_image_id,
      sample_id: row.sample_id,
      updated_at: row.updated_at,
      note,
    });
  }
  return out;
}

function auditMergePatterns(db, currentParticles) {
  const rows = db.prepare(
    `SELECT id, signature_key, relation, first_token, second_token, sample_image_id,
            sample_particle_a, sample_particle_b, updated_at
     FROM particle_merge_patterns
     ORDER BY id`
  ).all();
  const byMolecule = groupBy(currentParticles, (item) => `${item.image_id}\u0000${item.molecule_id}`);
  const pairCounts = new Map();
  for (const items of byMolecule.values()) {
    const ordered = items.slice().sort((a, b) => String(a.particle_id).localeCompare(String(b.particle_id)));
    for (let i = 0; i < ordered.length; i += 1) {
      for (let j = i + 1; j < ordered.length; j += 1) {
        const a = ordered[i].signature_key;
        const b = ordered[j].signature_key;
        pairCounts.set(`inline|${a}|${b}`, (pairCounts.get(`inline|${a}|${b}`) ?? 0) + 1);
        pairCounts.set(`inline|${b}|${a}`, (pairCounts.get(`inline|${b}|${a}`) ?? 0) + 1);
      }
    }
  }
  return rows.map((row) => {
    const currentPairCount = pairCounts.get(row.signature_key) ?? 0;
    return {
      id: row.id,
      status: currentPairCount ? "observable-pair" : "stale-pair",
      signature_key: row.signature_key,
      relation: row.relation,
      first_token: row.first_token,
      second_token: row.second_token,
      current_pair_count: currentPairCount,
      sample_image_id: row.sample_image_id,
      sample_particle_a: row.sample_particle_a,
      sample_particle_b: row.sample_particle_b,
      updated_at: row.updated_at,
      note: currentPairCount ? "The token pair still occurs in current molecules." : "No current molecule contains this token pair.",
    };
  });
}

function parseJsonArray(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function cleanParticleToken(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "";
  const [base, occurrence] = raw.rsplit ? raw.rsplit("#", 1) : splitOccurrence(raw);
  const cleanBase = base
    .split("+")
    .map((token) => cleanToken(token))
    .filter(Boolean)
    .sort()
    .join("+");
  return occurrence ? `${cleanBase}#${occurrence}` : cleanBase;
}

function splitOccurrence(raw) {
  const match = raw.match(/^(.*)#(\d+)$/);
  return match ? [match[1], match[2]] : [raw, ""];
}

function countSequences(items, field) {
  const counts = new Map();
  for (const item of items) {
    const value = item[field] ?? "";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function particleSignature(tokens) {
  return tokens.slice().sort().join("+");
}

function moleculeSignature(tokens) {
  return tokens.slice().sort().join("|");
}

function atomSort(a, b) {
  return Number(a.atom_order ?? Number.MAX_SAFE_INTEGER) - Number(b.atom_order ?? Number.MAX_SAFE_INTEGER)
    || Number(a.bounds_x ?? 0) - Number(b.bounds_x ?? 0)
    || Number(a.atom_id) - Number(b.atom_id);
}

function patternFields() {
  return [
    "id",
    "table",
    "status",
    "signature_key",
    "learned_sequence",
    "current_count",
    "current_total",
    "dominant_count",
    "dominant_sequence",
    "sample_image_id",
    "sample_id",
    "updated_at",
    "note",
  ];
}

function summary(rows) {
  return [...groupBy(rows, (row) => row.status).entries()]
    .map(([status, items]) => `${status}: ${items.length}`)
    .join(", ");
}

function renderMarkdown({ particlePatterns, moleculePatterns, mergePatterns }) {
  const badParticle = particlePatterns.filter((row) => row.status !== "ok");
  const badMolecule = moleculePatterns.filter((row) => row.status !== "ok");
  const badMerge = mergePatterns.filter((row) => row.status !== "observable-pair");
  return `# Learning Memory Audit

Purpose: compare DatasetCreator learned memory against the current live corpus without modifying the database.

## Summary

- Particle order patterns: ${particlePatterns.length} (${summary(particlePatterns)})
- Molecule order patterns: ${moleculePatterns.length} (${summary(moleculePatterns)})
- Particle merge patterns: ${mergePatterns.length} (${summary(mergePatterns)})

## Interpretation

- \`stale-signature\`: learned rule points to a signature that no longer exists in the current corpus.
- \`unsupported-order\`: signature exists, but the learned order is no longer observed.
- \`minority-order\`: learned order exists, but another order is now dominant.
- \`stale-pair\`: merge rule points to a token pair not observed together in current molecules.

## Particle Order Problems

${badParticle.length ? badParticle.map(renderPatternRow).join("\n") : "No particle order memory problems found.\n"}

## Molecule Order Problems

${badMolecule.length ? badMolecule.slice(0, 80).map(renderPatternRow).join("\n") : "No molecule order memory problems found.\n"}

${badMolecule.length > 80 ? `\nOnly first 80 molecule problems shown here. Full table: \`molecule-order-patterns.tsv\`\n` : ""}

## Merge Pattern Problems

${badMerge.length ? badMerge.map((row) => `- #${row.id} ${row.status}: \`${row.signature_key}\` sample=${row.sample_image_id}/${row.sample_particle_a}+${row.sample_particle_b}`).join("\n") : "No merge pattern problems found.\n"}

Full tables:

- \`particle-order-patterns.tsv\`
- \`molecule-order-patterns.tsv\`
- \`particle-merge-patterns.tsv\`
`;
}

function renderPatternRow(row) {
  return `- #${row.id} ${row.status}: \`${row.signature_key}\`
  - learned: \`${row.learned_sequence}\`
  - current: ${row.current_count}/${row.current_total}; dominant ${row.dominant_count}/${row.current_total} \`${row.dominant_sequence}\`
  - sample: ${row.sample_image_id}/${row.sample_id}; updated ${row.updated_at}`;
}
