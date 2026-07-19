import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function readTsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.trimEnd().split(/\r?\n/);
  if (lines.length < 2) throw new Error(`Empty TSV: ${filePath}`);
  const fields = lines[0].split("\t");
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(fields.map((field, index) => [field, cells[index] ?? ""]));
  });
}

export function loadCorpus(corpusDir) {
  const files = ["particles.tsv", "atoms.tsv", "molecules.tsv"];
  const paths = Object.fromEntries(files.map((name) => [name, path.join(corpusDir, name)]));
  for (const filePath of Object.values(paths)) {
    if (!fs.existsSync(filePath)) throw new Error(`Missing Corpus V3 file: ${filePath}`);
  }
  const particles = readTsv(paths["particles.tsv"]);
  const atoms = readTsv(paths["atoms.tsv"]);
  const molecules = readTsv(paths["molecules.tsv"]);
  validateCorpus({ particles, atoms, molecules });
  const fingerprint = crypto.createHash("sha256")
    .update(files.map((name) => fs.readFileSync(paths[name])).reduce((all, buffer) => Buffer.concat([all, buffer]), Buffer.alloc(0)))
    .digest("hex");
  return { particles, atoms, molecules, fingerprint };
}

export function validateCorpus({ particles, atoms, molecules }) {
  const atomIds = new Set(atoms.map((row) => row.atom_id));
  const moleculeIds = new Set(molecules.map((row) => row.molecule_id));
  const particleIds = new Set();
  for (const particle of particles) {
    if (!particle.particle_id || particleIds.has(particle.particle_id)) throw new Error(`Duplicate or empty particle_id: ${particle.particle_id}`);
    particleIds.add(particle.particle_id);
    if (!atomIds.has(particle.atom_id)) throw new Error(`Particle ${particle.particle_id} references missing atom ${particle.atom_id}`);
    if (!moleculeIds.has(particle.molecule_id)) throw new Error(`Particle ${particle.particle_id} references missing molecule ${particle.molecule_id}`);
  }
  for (const atom of atoms) {
    if (!moleculeIds.has(atom.molecule_id)) throw new Error(`Atom ${atom.atom_id} references missing molecule ${atom.molecule_id}`);
  }
}

export function analyzeCorpus(corpus, options = {}) {
  const minSupport = Number(options.minSupport ?? 4);
  const permutations = Number(options.permutations ?? 50);
  const compositionPermutations = Number(options.compositionPermutations ?? 30);
  const operatorPermutations = Number(options.operatorPermutations ?? 30);
  const occurrences = buildOccurrences(corpus);
  const vocabulary = [...new Set(occurrences.map((row) => row.token))].sort();
  const profiles = vocabulary.map((token) => particleProfile(token, occurrences, corpus.particles));
  const pairComparisons = [];
  for (let left = 0; left < vocabulary.length; left += 1) {
    for (let right = left + 1; right < vocabulary.length; right += 1) {
      const a = vocabulary[left];
      const b = vocabulary[right];
      const aRows = occurrences.filter((row) => row.token === a);
      const bRows = occurrences.filter((row) => row.token === b);
      if (Math.min(aRows.length, bRows.length) < minSupport) continue;
      pairComparisons.push(comparePair(a, b, aRows, bRows, corpus));
    }
  }
  attachPermutationControls(pairComparisons, occurrences, permutations);
  pairComparisons.sort((a, b) => b.functional_similarity - a.functional_similarity || b.min_support - a.min_support);

  const compositionCandidates = compositionAnalysis(occurrences, minSupport);
  attachCompositionPermutationControls(compositionCandidates, occurrences, compositionPermutations, minSupport);
  const annotationAudit = contextualAnnotationAudit(corpus, occurrences, compositionCandidates, {
    minSupport,
    minimumDelta: Number(options.auditMinimumDelta ?? 1.25),
    hypotheses: options.auditHypotheses ?? [
      { single: "m:1", composition: ["e:1", "b:1"], provenance: "declared_visual_ambiguity" },
    ],
  });
  const operatorCandidates = profiles.map((profile) => operatorProfile(profile, occurrences))
    .sort((a, b) => b.operator_score - a.operator_score);
  attachOperatorPermutationControls(operatorCandidates, occurrences, operatorPermutations);
  const representationComparison = compareRepresentations(corpus);
  const visualOutliers = geometryOutliers(corpus.particles, minSupport);
  const repeatedTemplates = templateAnalysis(corpus, minSupport);
  const structuralGrammar = structuralGrammarAnalysis(corpus, minSupport);

  return {
    schema_version: 1,
    status: "EXPLORATORY_NOT_FROZEN",
    ontology: "particle < atom < molecule",
    alphabet: "PARTICLES-V1",
    generated_at: new Date().toISOString(),
    input_fingerprint_sha256: corpus.fingerprint ?? "synthetic",
    parameters: { min_support: minSupport, permutations, composition_permutations: compositionPermutations, operator_permutations: operatorPermutations, permutation_seed: 1729 },
    summary: {
      particles: corpus.particles.length,
      atoms: corpus.atoms.length,
      molecules: corpus.molecules.length,
      images: new Set(corpus.particles.map((row) => row.image_name)).size,
      vocabulary: vocabulary.length,
      tested_pairs: pairComparisons.length,
      tested_compositions: compositionCandidates.length,
      slot_frames: structuralGrammar.slot_frames.length,
      atom_role_pairs: structuralGrammar.atom_role_pairs.length,
      molecule_transformations: structuralGrammar.molecule_transformations.length,
      annotation_audit_candidates: annotationAudit.candidates.length,
    },
    profiles,
    pair_comparisons: pairComparisons,
    composition_candidates: compositionCandidates,
    annotation_audit: annotationAudit,
    operator_candidates: operatorCandidates,
    repeated_templates: repeatedTemplates,
    structural_grammar: structuralGrammar,
    representation_comparison: representationComparison,
    visual_outliers: visualOutliers,
  };
}

function structuralGrammarAnalysis(corpus, minSupport) {
  const atoms = atomSequenceRecords(corpus);
  const molecules = moleculeAtomRecords(corpus, atoms);
  return {
    status: "EXPLORATORY_RULE_CANDIDATES",
    principle: "Particle identities remain unchanged; rules describe constrained contexts at higher levels.",
    slot_frames: slotFrameAnalysis(atoms, minSupport),
    atom_role_pairs: atomRoleAnalysis(atoms, minSupport),
    molecule_transformations: moleculeTransformationAnalysis(molecules, minSupport),
  };
}

function atomSequenceRecords(corpus) {
  const particlesByAtom = groupBy(corpus.particles, (row) => row.atom_id);
  const atomsByMolecule = groupBy(corpus.atoms, (row) => row.molecule_id);
  return corpus.atoms.map((atom) => {
    const particles = ordered(particlesByAtom.get(atom.atom_id) ?? [], "particle_order");
    const moleculeAtoms = ordered(atomsByMolecule.get(atom.molecule_id) ?? [], "atom_order");
    const atomIndex = moleculeAtoms.findIndex((row) => row.atom_id === atom.atom_id);
    return {
      atom_id: atom.atom_id,
      molecule_id: atom.molecule_id,
      image_name: atom.image_name || particles[0]?.image_name || "unknown",
      atom_order: Number(atom.atom_order ?? atomIndex + 1),
      role: role(atomIndex, moleculeAtoms.length),
      tokens: particles.map(particleToken),
    };
  }).filter((row) => row.tokens.length);
}

function moleculeAtomRecords(corpus, atoms) {
  const atomsByMolecule = groupBy(atoms, (row) => row.molecule_id);
  return corpus.molecules.map((molecule) => {
    const rows = ordered(atomsByMolecule.get(molecule.molecule_id) ?? [], "atom_order");
    return {
      molecule_id: molecule.molecule_id,
      image_name: molecule.image_name || rows[0]?.image_name || "unknown",
      atoms: rows.map((row) => row.tokens.join(" ")),
    };
  }).filter((row) => row.atoms.length);
}

function slotFrameAnalysis(atoms, minSupport) {
  const frames = new Map();
  for (const atom of atoms) {
    atom.tokens.forEach((token, index) => {
      const key = `${atom.tokens.slice(0, index).join(" ")}\u0000${atom.tokens.slice(index + 1).join(" ")}`;
      if (!frames.has(key)) frames.set(key, []);
      frames.get(key).push({ token, image: atom.image_name, atom_id: atom.atom_id, molecule_id: atom.molecule_id });
    });
  }
  return [...frames.entries()].map(([key, rows]) => {
    const [left, right] = key.split("\u0000");
    const rowsByToken = groupBy(rows, (row) => row.token);
    const eligibleTokens = [...rowsByToken.entries()]
      .filter(([, tokenRows]) => tokenRows.length >= minSupport && new Set(tokenRows.map((row) => row.image)).size >= 2)
      .map(([token]) => token);
    const eligibleRows = rows.filter((row) => eligibleTokens.includes(row.token));
    const counts = distribution(eligibleRows, (row) => row.token);
    const images = new Set(eligibleRows.map((row) => row.image));
    const fillings = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      frame: [left, "?", right].filter(Boolean).join(" "),
      support: eligibleRows.length,
      image_support: images.size,
      filling_count: fillings.length,
      fillings: fillings.map(([token, probability]) => ({ token, count: eligibleRows.filter((row) => row.token === token).length, image_support: new Set(eligibleRows.filter((row) => row.token === token).map((row) => row.image)).size, probability: round(probability) })),
      filling_entropy: round(entropy(eligibleRows.map((row) => row.token))),
      examples: eligibleRows.slice(0, 8),
      status: images.size >= 2 && fillings.length >= 2 ? "cross-folio frame" : "descriptive",
    };
  }).filter((row) => row.frame !== "?" && row.support >= minSupport * 2 && row.filling_count >= 2 && row.image_support >= 2)
    .sort((a, b) => b.image_support - a.image_support || b.support - a.support || a.filling_entropy - b.filling_entropy);
}

function atomRoleAnalysis(atoms, minSupport) {
  const byMolecule = groupBy(atoms, (row) => row.molecule_id);
  const contexts = new Map();
  for (const rowsUnordered of byMolecule.values()) {
    const rows = ordered(rowsUnordered, "atom_order");
    rows.forEach((atom, index) => {
      const signature = atom.tokens.join(" ");
      if (!contexts.has(signature)) contexts.set(signature, []);
      contexts.get(signature).push({
        image: atom.image_name,
        prev: index ? rows[index - 1].tokens.join(" ") : "<MOLECULE_START>",
        next: index + 1 < rows.length ? rows[index + 1].tokens.join(" ") : "<MOLECULE_END>",
        role: role(index, rows.length),
      });
    });
  }
  const eligible = [...contexts.entries()].filter(([, rows]) => rows.length >= minSupport && new Set(rows.map((row) => row.image)).size >= 2);
  const result = [];
  for (let left = 0; left < eligible.length; left += 1) {
    for (let right = left + 1; right < eligible.length; right += 1) {
      const [a, aRows] = eligible[left];
      const [b, bRows] = eligible[right];
      const components = {
        previous_atom: jsSimilarity(distribution(aRows, (row) => row.prev), distribution(bRows, (row) => row.prev)),
        next_atom: jsSimilarity(distribution(aRows, (row) => row.next), distribution(bRows, (row) => row.next)),
        molecule_role: jsSimilarity(distribution(aRows, (row) => row.role), distribution(bRows, (row) => row.role)),
      };
      const similarity = average(Object.values(components));
      const commonImages = [...new Set(aRows.map((row) => row.image))].filter((image) => bRows.some((row) => row.image === image));
      if (similarity < 0.72 || commonImages.length < 2) continue;
      result.push({ left: a, right: b, left_support: aRows.length, right_support: bRows.length, common_folios: commonImages.length, functional_similarity: round(similarity), components: mapRounded(components), status: "functional-class candidate; identities retained" });
    }
  }
  return result.sort((a, b) => b.functional_similarity - a.functional_similarity || b.common_folios - a.common_folios).slice(0, 200);
}

function moleculeTransformationAnalysis(molecules, minSupport) {
  const types = new Map();
  for (const molecule of molecules) {
    const key = molecule.atoms.join(" || ");
    if (!types.has(key)) types.set(key, []);
    types.get(key).push(molecule);
  }
  const entries = [...types.entries()].filter(([, rows]) => rows.length >= minSupport && new Set(rows.map((row) => row.image_name)).size >= 2);
  const transformations = [];
  for (let left = 0; left < entries.length; left += 1) {
    for (let right = left + 1; right < entries.length; right += 1) {
      const [aKey, aRows] = entries[left];
      const [bKey, bRows] = entries[right];
      const edit = singleAtomEdit(aRows[0].atoms, bRows[0].atoms);
      if (!edit) continue;
      const fromImages = new Set(aRows.map((row) => row.image_name));
      const toImages = new Set(bRows.map((row) => row.image_name));
      const commonImages = [...fromImages].filter((image) => toImages.has(image));
      if (commonImages.length < 2) continue;
      transformations.push({
        from: aKey,
        to: bKey,
        operation: edit.operation,
        index: edit.index + 1,
        removed: edit.removed ?? null,
        added: edit.added ?? null,
        from_support: aRows.length,
        to_support: bRows.length,
        from_image_support: fromImages.size,
        to_image_support: toImages.size,
        common_folios: commonImages.length,
        examples: [...aRows.slice(0, 3), ...bRows.slice(0, 3)].map((row) => ({ molecule_id: row.molecule_id, image: row.image_name })),
        status: "recurrent transformation candidate",
      });
    }
  }
  return transformations.sort((a, b) => b.common_folios - a.common_folios || (b.from_support + b.to_support) - (a.from_support + a.to_support)).slice(0, 200);
}

function singleAtomEdit(left, right) {
  if (left.length === right.length) {
    const differences = left.map((value, index) => value === right[index] ? -1 : index).filter((index) => index >= 0);
    if (differences.length === 1) return { operation: "substitute atom", index: differences[0], removed: left[differences[0]], added: right[differences[0]] };
    return null;
  }
  if (Math.abs(left.length - right.length) !== 1) return null;
  const shorter = left.length < right.length ? left : right;
  const longer = left.length < right.length ? right : left;
  let index = 0;
  while (index < shorter.length && shorter[index] === longer[index]) index += 1;
  if (shorter.slice(index).join("\u0000") !== longer.slice(index + 1).join("\u0000")) return null;
  return left.length < right.length
    ? { operation: "insert atom", index, added: longer[index] }
    : { operation: "delete atom", index, removed: longer[index] };
}

function attachOperatorPermutationControls(candidates, occurrences, repetitions) {
  if (!candidates.length || repetitions <= 0) return;
  const scores = new Map(candidates.map((row) => [row.token, []]));
  const rng = mulberry32(31415);
  for (let repeat = 0; repeat < repetitions; repeat += 1) {
    const shuffled = permutedOccurrences(occurrences, rng);
    const byToken = groupBy(shuffled, (row) => row.token);
    for (const candidate of candidates) {
      const rows = byToken.get(candidate.token) ?? [];
      const profile = {
        token: candidate.token,
        count: rows.length,
        images: new Set(rows.map((row) => row.image_name)).size,
        particle_role_entropy: entropy(rows.map((row) => row.particle_role)),
      };
      scores.get(candidate.token).push(operatorProfile(profile, shuffled).operator_score);
    }
  }
  for (const candidate of candidates) {
    const nullScores = scores.get(candidate.token);
    candidate.null_operator_mean = round(average(nullScores));
    candidate.permutation_p = (nullScores.filter((score) => score >= candidate.operator_score).length + 1) / (nullScores.length + 1);
  }
  const ranked = [...candidates].sort((a, b) => a.permutation_p - b.permutation_p);
  let running = 1;
  for (let index = ranked.length - 1; index >= 0; index -= 1) {
    running = Math.min(running, ranked[index].permutation_p * ranked.length / (index + 1));
    ranked[index].permutation_q = round(Math.min(1, running));
  }
  for (const candidate of candidates) {
    candidate.permutation_p = round(candidate.permutation_p);
    candidate.status = candidate.permutation_q <= 0.1 ? "candidate" : "mixed";
  }
}

function attachCompositionPermutationControls(candidates, occurrences, repetitions, minSupport) {
  if (!candidates.length || repetitions <= 0) return;
  const nullScores = candidates.map(() => []);
  const rng = mulberry32(2718);
  for (let repeat = 0; repeat < repetitions; repeat += 1) {
    const shuffled = permutedOccurrences(occurrences, rng);
    const singles = groupBy(shuffled, (row) => row.token);
    const pairs = withinAtomPairContexts(shuffled);
    candidates.forEach((candidate, index) => {
      const singleRows = singles.get(candidate.single) ?? [];
      const pairRows = pairs.get(`${candidate.composition[0]}\u0000${candidate.composition[1]}`) ?? [];
      if (Math.min(singleRows.length, pairRows.length) < minSupport) {
        nullScores[index].push(0);
        return;
      }
      nullScores[index].push(average([
        jsSimilarity(distribution(singleRows, (row) => row.prev), distribution(pairRows, (row) => row.prev)),
        jsSimilarity(distribution(singleRows, (row) => row.next), distribution(pairRows, (row) => row.next)),
        jsSimilarity(distribution(singleRows, (row) => row.atom_role), distribution(pairRows, (row) => row.atom_role)),
      ]));
    });
  }
  candidates.forEach((candidate, index) => {
    const scores = nullScores[index];
    candidate.null_similarity_mean = round(average(scores));
    candidate.permutation_p = (scores.filter((score) => score >= candidate.context_similarity).length + 1) / (scores.length + 1);
  });
  const ranked = [...candidates].sort((a, b) => a.permutation_p - b.permutation_p);
  let running = 1;
  for (let index = ranked.length - 1; index >= 0; index -= 1) {
    running = Math.min(running, ranked[index].permutation_p * ranked.length / (index + 1));
    ranked[index].permutation_q = round(Math.min(1, running));
  }
  for (const candidate of candidates) {
    candidate.permutation_p = round(candidate.permutation_p);
    if (candidate.permutation_q > 0.1) candidate.status = "mixed";
  }
}

function attachPermutationControls(pairs, occurrences, repetitions) {
  if (!pairs.length || repetitions <= 0) return;
  const nullScores = new Map(pairs.map((row) => [pairKey(row.left, row.right), []]));
  const rng = mulberry32(1729);
  for (let repeat = 0; repeat < repetitions; repeat += 1) {
    const shuffled = permutedOccurrences(occurrences, rng);
    const byToken = groupBy(shuffled, (row) => row.token);
    for (const pair of pairs) {
      const left = byToken.get(pair.left) ?? [];
      const right = byToken.get(pair.right) ?? [];
      const score = average([
        jsSimilarity(distribution(left, (row) => row.prev), distribution(right, (row) => row.prev)),
        jsSimilarity(distribution(left, (row) => row.next), distribution(right, (row) => row.next)),
        jsSimilarity(distribution(left, (row) => row.particle_role), distribution(right, (row) => row.particle_role)),
        jsSimilarity(distribution(left, (row) => row.atom_role), distribution(right, (row) => row.atom_role)),
      ]);
      nullScores.get(pairKey(pair.left, pair.right)).push(score);
    }
  }
  for (const pair of pairs) {
    const scores = nullScores.get(pairKey(pair.left, pair.right));
    const extreme = scores.filter((score) => score >= pair.functional_similarity).length;
    pair.permutation_p = (extreme + 1) / (scores.length + 1);
    pair.null_similarity_mean = round(average(scores));
  }
  const ranked = [...pairs].sort((a, b) => a.permutation_p - b.permutation_p);
  let running = 1;
  for (let index = ranked.length - 1; index >= 0; index -= 1) {
    const adjusted = Math.min(1, ranked[index].permutation_p * ranked.length / (index + 1));
    running = Math.min(running, adjusted);
    ranked[index].permutation_q = round(running);
  }
  for (const pair of pairs) {
    pair.permutation_p = round(pair.permutation_p);
    if (pair.status === "supported exploratory" && pair.permutation_q > 0.1) pair.status = "mixed";
  }
}

function permutedOccurrences(occurrences, rng) {
  const cloned = occurrences.map((row) => ({ ...row }));
  const byImage = groupBy(cloned, (row) => row.image_name);
  for (const rows of byImage.values()) {
    const tokens = rows.map((row) => row.token);
    for (let index = tokens.length - 1; index > 0; index -= 1) {
      const target = Math.floor(rng() * (index + 1));
      [tokens[index], tokens[target]] = [tokens[target], tokens[index]];
    }
    rows.forEach((row, index) => { row.token = tokens[index]; });
  }
  for (const rows of groupBy(cloned, (row) => row.atom_id).values()) {
    rows.sort((a, b) => a.index - b.index);
    rows.forEach((row, index) => {
      row.prev = index ? rows[index - 1].token : "<ATOM_START>";
      row.next = index + 1 < rows.length ? rows[index + 1].token : "<ATOM_END>";
    });
  }
  return cloned;
}

function pairKey(left, right) { return `${left}\u0000${right}`; }
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function buildOccurrences(corpus) {
  const particlesByAtom = groupBy(corpus.particles, (row) => row.atom_id);
  const atomsByMolecule = groupBy(corpus.atoms, (row) => row.molecule_id);
  const result = [];
  for (const atom of corpus.atoms) {
    const particles = ordered(particlesByAtom.get(atom.atom_id) ?? [], "particle_order");
    const moleculeAtoms = ordered(atomsByMolecule.get(atom.molecule_id) ?? [], "atom_order");
    const atomIndex = moleculeAtoms.findIndex((row) => row.atom_id === atom.atom_id);
    particles.forEach((particle, index) => result.push({
      particle_id: particle.particle_id,
      token: particleToken(particle),
      image_name: particle.image_name,
      atom_id: atom.atom_id,
      molecule_id: atom.molecule_id,
      prev: index ? particleToken(particles[index - 1]) : "<ATOM_START>",
      next: index + 1 < particles.length ? particleToken(particles[index + 1]) : "<ATOM_END>",
      particle_role: role(index, particles.length),
      atom_role: role(atomIndex, moleculeAtoms.length),
      index,
      atom_length: particles.length,
      points_json: particle.points_json,
      bounds_x: Number(particle.bounds_x),
      bounds_y: Number(particle.bounds_y),
      bounds_w: Number(particle.bounds_w),
      bounds_h: Number(particle.bounds_h),
      length: Number(particle.length),
      angle: Number(particle.angle),
    }));
  }
  return result;
}

function particleProfile(token, occurrences, particles) {
  const rows = occurrences.filter((row) => row.token === token);
  const visualRows = particles.filter((row) => particleToken(row) === token);
  return {
    token,
    count: rows.length,
    images: new Set(rows.map((row) => row.image_name)).size,
    previous: distribution(rows, (row) => row.prev),
    next: distribution(rows, (row) => row.next),
    particle_roles: distribution(rows, (row) => row.particle_role),
    atom_roles: distribution(rows, (row) => row.atom_role),
    particle_role_entropy: entropy(rows.map((row) => row.particle_role)),
    atom_role_entropy: entropy(rows.map((row) => row.atom_role)),
    visual_examples: representativeExamples(visualRows),
  };
}

function representativeExamples(rows) {
  if (!rows.length) return [];
  const areas = rows.map((row) => Number(row.bounds_w) * Number(row.bounds_h)).filter(Number.isFinite);
  const center = median(areas);
  return [...rows]
    .sort((a, b) => Math.abs(Number(a.bounds_w) * Number(a.bounds_h) - center) - Math.abs(Number(b.bounds_w) * Number(b.bounds_h) - center))
    .slice(0, 5)
    .map((row) => ({
      particle_id: row.particle_id,
      image_name: row.image_name,
      atom_id: row.atom_id,
      molecule_id: row.molecule_id,
      points_json: row.points_json,
      bounds_x: Number(row.bounds_x),
      bounds_y: Number(row.bounds_y),
      bounds_w: Number(row.bounds_w),
      bounds_h: Number(row.bounds_h),
    }));
}

function comparePair(a, b, aRows, bRows, corpus) {
  const components = {
    previous: jsSimilarity(distribution(aRows, (row) => row.prev), distribution(bRows, (row) => row.prev)),
    next: jsSimilarity(distribution(aRows, (row) => row.next), distribution(bRows, (row) => row.next)),
    particle_role: jsSimilarity(distribution(aRows, (row) => row.particle_role), distribution(bRows, (row) => row.particle_role)),
    atom_role: jsSimilarity(distribution(aRows, (row) => row.atom_role), distribution(bRows, (row) => row.atom_role)),
  };
  const functionalSimilarity = average(Object.values(components));
  const heldout = heldoutMergeDelta(corpus, a, b);
  const images = [...new Set([...aRows, ...bRows].map((row) => row.image_name))];
  const byImage = images.map((image) => {
    const imageA = aRows.filter((row) => row.image_name === image);
    const imageB = bRows.filter((row) => row.image_name === image);
    if (Math.min(imageA.length, imageB.length) < 2) return null;
    return {
      image,
      left_support: imageA.length,
      right_support: imageB.length,
      similarity: round(average([
        jsSimilarity(distribution(imageA, (row) => row.prev), distribution(imageB, (row) => row.prev)),
        jsSimilarity(distribution(imageA, (row) => row.next), distribution(imageB, (row) => row.next)),
        jsSimilarity(distribution(imageA, (row) => row.particle_role), distribution(imageB, (row) => row.particle_role)),
        jsSimilarity(distribution(imageA, (row) => row.atom_role), distribution(imageB, (row) => row.atom_role)),
      ])),
    };
  }).filter(Boolean);
  const stableImages = byImage.filter((row) => row.similarity >= 0.7).length;
  const status = functionalSimilarity >= 0.82 && heldout.normalized_delta <= 0.01 && stableImages >= Math.min(3, byImage.length)
    ? "supported exploratory"
    : functionalSimilarity >= 0.68 ? "mixed" : "unsupported";
  return {
    left: a,
    right: b,
    left_support: aRows.length,
    right_support: bRows.length,
    min_support: Math.min(aRows.length, bRows.length),
    functional_similarity: round(functionalSimilarity),
    components: mapRounded(components),
    heldout_merge: heldout,
    by_image: byImage,
    stable_images: stableImages,
    tested_images: byImage.length,
    status,
  };
}

function compositionAnalysis(occurrences, minSupport) {
  const singles = groupBy(occurrences, (row) => row.token);
  const pairs = withinAtomPairContexts(occurrences);
  const results = [];
  for (const [x, xRows] of singles) {
    if (xRows.length < minSupport) continue;
    for (const [key, pairRows] of pairs) {
      if (pairRows.length < minSupport) continue;
      const [z, y] = key.split("\u0000");
      if (x === z || x === y) continue;
      const components = {
        external_previous: jsSimilarity(distribution(xRows, (row) => row.prev), distribution(pairRows, (row) => row.prev)),
        external_next: jsSimilarity(distribution(xRows, (row) => row.next), distribution(pairRows, (row) => row.next)),
        atom_role: jsSimilarity(distribution(xRows, (row) => row.atom_role), distribution(pairRows, (row) => row.atom_role)),
      };
      const similarity = average(Object.values(components));
      if (similarity < 0.55) continue;
      results.push({
        single: x,
        composition: [z, y],
        boundary: "within_atom",
        single_support: xRows.length,
        composition_support: pairRows.length,
        context_similarity: round(similarity),
        components: mapRounded(components),
        status: similarity >= 0.82 ? "candidate" : "mixed",
      });
    }
  }
  return results.sort((a, b) => b.context_similarity - a.context_similarity || b.composition_support - a.composition_support).slice(0, 200);
}

function withinAtomPairContexts(occurrences) {
  const pairs = new Map();
  for (const rows of groupBy(occurrences, (row) => row.atom_id).values()) {
    const orderedRows = [...rows].sort((a, b) => a.index - b.index);
    for (let index = 0; index + 1 < orderedRows.length; index += 1) {
      const left = orderedRows[index];
      const right = orderedRows[index + 1];
      const key = `${left.token}\u0000${right.token}`;
      if (!pairs.has(key)) pairs.set(key, []);
      pairs.get(key).push({
        prev: left.prev,
        next: right.next,
        atom_role: left.atom_role,
        particle_role: spanRole(index, orderedRows.length),
        image_name: left.image_name,
        atom_id: left.atom_id,
        molecule_id: left.molecule_id,
        particle_ids: [left.particle_id, right.particle_id],
        tokens: [left.token, right.token],
        visuals: [visualPayload(left), visualPayload(right)],
        index,
      });
    }
  }
  return pairs;
}

function contextualAnnotationAudit(corpus, occurrences, compositionCandidates, options) {
  const minSupport = options.minSupport;
  const minimumDelta = options.minimumDelta;
  const singles = groupBy(occurrences, (row) => row.token);
  const pairs = withinAtomPairContexts(occurrences);
  const compositionIndex = new Map(compositionCandidates.map((row) => [
    `${row.single}\u0000${pairKey(...row.composition)}`,
    row,
  ]));
  const hypotheses = options.hypotheses.map((declared) => {
    const measured = compositionIndex.get(`${declared.single}\u0000${pairKey(...declared.composition)}`);
    return {
      type: "split_join",
      single: declared.single,
      composition: declared.composition,
      provenance: declared.provenance ?? "declared_for_audit",
      aggregate_context_similarity: measured?.context_similarity ?? null,
      single_support: measured?.single_support ?? (singles.get(declared.single)?.length ?? 0),
      composition_support: measured?.composition_support ?? (pairs.get(pairKey(...declared.composition))?.length ?? 0),
    };
  }).filter((row) => row.single_support >= minSupport && row.composition_support >= minSupport);

  const candidates = [];
  const evaluated = [];
  for (const hypothesis of hypotheses) {
    const singleRows = singles.get(hypothesis.single) ?? [];
    const pairRows = pairs.get(pairKey(...hypothesis.composition)) ?? [];
    const scored = [];
    for (const row of singleRows) scored.push(scoreAuditOccurrence(row, "single", singleRows, pairRows, hypothesis, minimumDelta));
    for (const row of pairRows) scored.push(scoreAuditOccurrence(row, "composition", pairRows, singleRows, hypothesis, minimumDelta));
    const valid = scored.filter(Boolean);
    candidates.push(...valid.filter((row) => row.status === "review_candidate"));
    evaluated.push({
      ...hypothesis,
      evaluated_occurrences: valid.length,
      review_candidates: valid.filter((row) => row.status === "review_candidate").length,
      held_out_folios: new Set(valid.map((row) => row.image_name)).size,
    });
  }

  candidates.sort((a, b) => b.context_delta - a.context_delta || b.alternative_training_support - a.alternative_training_support);
  return {
    status: "CANDIDATES_NOT_DECISIONS",
    mission: "Find individual human annotation or segmentation errors through held-out structural context.",
    method: "Naive-Bayes context score trained on every folio except the occurrence's own folio.",
    minimum_log_score_delta: minimumDelta,
    hypothesis_policy: "Only explicitly declared visual ambiguities are audited. Exploratory composition similarity cannot create correction candidates by itself.",
    safeguards: [
      "The evaluated folio is excluded from training.",
      "No candidate edits the corpus automatically.",
      "A split/join hypothesis changes segmentation and requires manuscript inspection.",
      "Rare but correct structures may be flagged and must be confirmable as valid.",
    ],
    hypotheses: evaluated,
    candidates: candidates.slice(0, 500),
  };
}

function scoreAuditOccurrence(row, currentForm, currentRows, alternativeRows, hypothesis, minimumDelta) {
  const heldOut = row.image_name;
  const currentTraining = currentRows.filter((item) => item.image_name !== heldOut);
  const alternativeTraining = alternativeRows.filter((item) => item.image_name !== heldOut);
  if (currentTraining.length < 3 || alternativeTraining.length < 3) return null;
  if (new Set(alternativeTraining.map((item) => item.image_name)).size < 2) return null;

  const universe = [...currentTraining, ...alternativeTraining];
  const currentScore = contextualClassScore(row, currentTraining, universe);
  const alternativeScore = contextualClassScore(row, alternativeTraining, universe);
  const delta = alternativeScore - currentScore;
  const alternativeForm = currentForm === "single" ? "composition" : "single";
  const currentTokens = currentForm === "single" ? [hypothesis.single] : hypothesis.composition;
  const alternativeTokens = alternativeForm === "single" ? [hypothesis.single] : hypothesis.composition;
  return {
    candidate_type: "split_join",
    image_name: row.image_name,
    atom_id: row.atom_id,
    molecule_id: row.molecule_id,
    particle_ids: row.particle_ids ?? [row.particle_id],
    current_visuals: row.visuals ?? [visualPayload(row)],
    current_form: currentForm,
    current_tokens: currentTokens,
    alternative_form: alternativeForm,
    alternative_tokens: alternativeTokens,
    external_previous: row.prev,
    external_next: row.next,
    atom_role: row.atom_role,
    particle_role: row.particle_role,
    current_log_score: round(currentScore),
    alternative_log_score: round(alternativeScore),
    context_delta: round(delta),
    current_training_support: currentTraining.length,
    alternative_training_support: alternativeTraining.length,
    held_out_folio: heldOut,
    reason: `${alternativeTokens.join(" + ")} is better supported than ${currentTokens.join(" + ")} by context learned without ${heldOut}`,
    status: delta >= minimumDelta ? "review_candidate" : "not_flagged",
  };
}

function visualPayload(row) {
  return {
    particle_id: row.particle_id,
    image_name: row.image_name,
    points_json: row.points_json,
    bounds_x: row.bounds_x,
    bounds_y: row.bounds_y,
    bounds_w: row.bounds_w,
    bounds_h: row.bounds_h,
  };
}

function contextualClassScore(row, classRows, universe) {
  const features = ["prev", "next", "atom_role", "particle_role"];
  let score = Math.log((classRows.length + 1) / (universe.length + 2));
  for (const feature of features) {
    const values = new Set(universe.map((item) => item[feature] ?? "<UNKNOWN>"));
    const value = row[feature] ?? "<UNKNOWN>";
    const matches = classRows.filter((item) => (item[feature] ?? "<UNKNOWN>") === value).length;
    score += Math.log((matches + 1) / (classRows.length + values.size));
  }
  return score;
}

function spanRole(index, length) {
  if (length <= 2) return "single";
  if (index === 0) return "initial";
  if (index + 2 === length) return "final";
  return "medial";
}

function operatorProfile(profile, occurrences) {
  const rows = occurrences.filter((row) => row.token === profile.token);
  const roleRigidity = 1 - Math.min(profile.particle_role_entropy / Math.log2(3), 1);
  const neighborEntropy = (entropy(rows.map((row) => row.prev)) + entropy(rows.map((row) => row.next))) / 2;
  const neighborVocabulary = new Set(rows.flatMap((row) => [row.prev, row.next])).size;
  const neighborPredictability = 1 - Math.min(neighborEntropy / Math.log2(Math.max(2, neighborVocabulary)), 1);
  const repetitionRate = rows.filter((row) => row.prev === profile.token || row.next === profile.token).length / Math.max(1, rows.length);
  return {
    token: profile.token,
    support: profile.count,
    image_support: profile.images,
    role_rigidity: round(roleRigidity),
    neighbor_predictability: round(neighborPredictability),
    immediate_repetition_rate: round(repetitionRate),
    operator_score: round(0.5 * roleRigidity + 0.4 * neighborPredictability + 0.1 * repetitionRate),
    interpretation: "structural operator candidate; no semantic assignment",
  };
}

function compareRepresentations(corpus) {
  const sequences16 = moleculeSequences(corpus, (token) => token);
  const sequences14 = moleculeSequences(corpus, familyToken);
  return {
    current_16: representationMetrics(sequences16),
    historical_14_counterfactual: representationMetrics(sequences14),
    mapping: { "c:1": "c", "c:2": "c", "h:1": "h", "h:2": "h" },
    interpretation: "Counterfactual only; lower held-out loss is favorable, but visual labels remain distinct unless separately audited.",
  };
}

function representationMetrics(sequences) {
  const tokens = sequences.flatMap((row) => row.tokens);
  const roleRows = sequences.flatMap((row) => row.tokens.map((token, index) => ({ token, role: role(index, row.tokens.length) })));
  const byToken = groupBy(roleRows, (row) => row.token);
  const weightedRoleEntropy = [...byToken.values()].reduce((sum, rows) => sum + rows.length * entropy(rows.map((row) => row.role)), 0) / Math.max(1, roleRows.length);
  return {
    vocabulary: new Set(tokens).size,
    tokens: tokens.length,
    weighted_role_entropy: round(weightedRoleEntropy),
    leave_one_image_out_normalized_log_loss: round(heldoutLogLoss(sequences)),
  };
}

function heldoutMergeDelta(corpus, a, b) {
  const base = moleculeSequences(corpus, (token) => token);
  const mergedToken = `{${a}|${b}}`;
  const merged = moleculeSequences(corpus, (token) => token === a || token === b ? mergedToken : token);
  const baseBreakdown = heldoutBreakdown(base);
  const mergedBreakdown = heldoutBreakdown(merged);
  const baseLoss = baseBreakdown.aggregate;
  const mergedLoss = mergedBreakdown.aggregate;
  return {
    base_normalized_log_loss: round(baseLoss),
    merged_normalized_log_loss: round(mergedLoss),
    normalized_delta: round(mergedLoss - baseLoss),
    by_image: baseBreakdown.by_image.map((row) => {
      const changed = mergedBreakdown.by_image.find((item) => item.image === row.image);
      return {
        image: row.image,
        base: round(row.normalized_log_loss),
        merged: round(changed?.normalized_log_loss ?? 0),
        delta: round((changed?.normalized_log_loss ?? 0) - row.normalized_log_loss),
      };
    }),
  };
}

function moleculeSequences(corpus, transform) {
  const particlesByMolecule = groupBy(corpus.particles, (row) => row.molecule_id);
  return corpus.molecules.map((molecule) => ({
    image: molecule.image_name,
    tokens: ordered(particlesByMolecule.get(molecule.molecule_id) ?? [], "particle_order").map(particleToken).map(transform),
  })).filter((row) => row.tokens.length);
}

function heldoutLogLoss(sequences) {
  return heldoutBreakdown(sequences).aggregate;
}

function heldoutBreakdown(sequences) {
  const images = [...new Set(sequences.map((row) => row.image))];
  if (images.length < 2) return { aggregate: 0, by_image: [] };
  let weighted = 0;
  let total = 0;
  const byImage = [];
  for (const heldout of images) {
    const train = sequences.filter((row) => row.image !== heldout);
    const test = sequences.filter((row) => row.image === heldout);
    const vocab = new Set(train.flatMap((row) => row.tokens));
    const counts = new Map();
    const contextTotals = new Map();
    for (const row of train) {
      const framed = ["<START>", ...row.tokens, "<END>"];
      for (let index = 0; index + 1 < framed.length; index += 1) {
        const key = `${framed[index]}\u0000${framed[index + 1]}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
        contextTotals.set(framed[index], (contextTotals.get(framed[index]) ?? 0) + 1);
      }
    }
    const width = Math.max(2, vocab.size + 2);
    let imageLoss = 0;
    let imageTotal = 0;
    for (const row of test) {
      const framed = ["<START>", ...row.tokens, "<END>"];
      for (let index = 0; index + 1 < framed.length; index += 1) {
        const count = counts.get(`${framed[index]}\u0000${framed[index + 1]}`) ?? 0;
        const denom = (contextTotals.get(framed[index]) ?? 0) + width;
        const loss = -Math.log2((count + 1) / denom) / Math.log2(width);
        weighted += loss;
        total += 1;
        imageLoss += loss;
        imageTotal += 1;
      }
    }
    byImage.push({ image: heldout, normalized_log_loss: imageTotal ? imageLoss / imageTotal : 0, transitions: imageTotal });
  }
  return { aggregate: total ? weighted / total : 0, by_image: byImage };
}

function geometryOutliers(particles, minSupport) {
  const byToken = groupBy(particles, particleToken);
  const results = [];
  for (const [token, rows] of byToken) {
    if (rows.length < minSupport) continue;
    for (const field of ["bounds_w", "bounds_h", "length", "angle"]) {
      const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
      const center = median(values);
      const mad = median(values.map((value) => Math.abs(value - center))) || 1;
      for (const row of rows) {
        const value = Number(row[field]);
        const score = Math.abs(value - center) / (1.4826 * mad);
        if (score >= 5) results.push({
          particle_id: row.particle_id,
          token,
          image_name: row.image_name,
          atom_id: row.atom_id,
          molecule_id: row.molecule_id,
          feature: field,
          value: round(value),
          family_median: round(center),
          robust_z: round(score),
          destination: "QC Review",
          status: "candidate only",
        });
      }
    }
  }
  return results.sort((a, b) => b.robust_z - a.robust_z).slice(0, 500);
}

function templateAnalysis(corpus, minSupport) {
  const sequences = moleculeSequences(corpus, (token) => token);
  const counts = new Map();
  for (const row of sequences) {
    for (const size of [2, 3]) {
      for (let index = 0; index + size <= row.tokens.length; index += 1) {
        const template = row.tokens.slice(index, index + size).join(" ");
        if (!counts.has(template)) counts.set(template, { template, count: 0, images: new Set() });
        const item = counts.get(template);
        item.count += 1;
        item.images.add(row.image);
      }
    }
  }
  return [...counts.values()].filter((row) => row.count >= minSupport)
    .map((row) => ({ template: row.template, count: row.count, image_support: row.images.size }))
    .sort((a, b) => b.count - a.count || b.image_support - a.image_support).slice(0, 100);
}

function particleToken(row) {
  const family = String(row.family ?? "").trim().toLowerCase();
  const config = String(row.structural_config ?? "").trim().replace(/_base$/i, "").toLowerCase();
  return config ? `${family}:${config}` : family;
}

function familyToken(token) { return String(token).split(":")[0]; }
function role(index, length) {
  if (length <= 1) return "single";
  if (index === 0) return "initial";
  if (index === length - 1) return "final";
  return "medial";
}
function groupBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}
function ordered(rows, field) { return [...rows].sort((a, b) => Number(a[field] ?? 0) - Number(b[field] ?? 0) || String(a.particle_id ?? a.atom_id).localeCompare(String(b.particle_id ?? b.atom_id))); }
function distribution(rows, keyFn) {
  const result = {};
  for (const row of rows) { const key = keyFn(row); result[key] = (result[key] ?? 0) + 1; }
  const total = Object.values(result).reduce((sum, value) => sum + value, 0) || 1;
  return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, value / total]));
}
function entropy(values) {
  const dist = distribution(values, (value) => value);
  return -Object.values(dist).reduce((sum, probability) => sum + (probability ? probability * Math.log2(probability) : 0), 0);
}
function jsSimilarity(left, right) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  let divergence = 0;
  for (const key of keys) {
    const p = left[key] ?? 0;
    const q = right[key] ?? 0;
    const m = (p + q) / 2;
    if (p) divergence += 0.5 * p * Math.log2(p / m);
    if (q) divergence += 0.5 * q * Math.log2(q / m);
  }
  return Math.max(0, 1 - divergence);
}
function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function average(values) { return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length); }
function round(value) { return Number(Number(value ?? 0).toFixed(6)); }
function mapRounded(object) { return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, round(value)])); }
