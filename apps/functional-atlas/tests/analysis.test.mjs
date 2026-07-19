import assert from "node:assert/strict";
import test from "node:test";
import { analyzeCorpus, validateCorpus } from "../scripts/lib.mjs";

test("rejects a particle whose atom does not exist", () => {
  assert.throws(() => validateCorpus({
    particles: [{ particle_id: "1", atom_id: "missing", molecule_id: "m1" }],
    atoms: [],
    molecules: [{ molecule_id: "m1" }],
  }), /missing atom/);
});

test("keeps audit candidates separate from functional comparisons", () => {
  const corpus = syntheticCorpus();
  const analysis = analyzeCorpus(corpus, { minSupport: 2, permutations: 4, compositionPermutations: 4, operatorPermutations: 4 });
  assert.equal(analysis.status, "EXPLORATORY_NOT_FROZEN");
  assert.ok(Array.isArray(analysis.visual_outliers));
  assert.equal(analysis.annotation_audit.status, "CANDIDATES_NOT_DECISIONS");
  assert.ok(Array.isArray(analysis.annotation_audit.candidates));
  assert.ok(Array.isArray(analysis.pair_comparisons));
  assert.notEqual(analysis.visual_outliers, analysis.pair_comparisons);
});

test("contextual audit detects an injected split candidate without using its folio for training", () => {
  const analysis = analyzeCorpus(annotationAuditCorpus(), {
    minSupport: 2,
    auditMinimumDelta: 0.5,
    permutations: 4,
    compositionPermutations: 4,
    operatorPermutations: 4,
  });
  const candidate = analysis.annotation_audit.candidates.find((row) => row.atom_id === "folio-4-suspicious-a1");
  assert.ok(candidate);
  assert.deepEqual(candidate.current_tokens, ["e:1", "b:1"]);
  assert.deepEqual(candidate.alternative_tokens, ["m:1"]);
  assert.equal(candidate.held_out_folio, "folio-4");
  assert.ok(candidate.context_delta >= 0.5);
  assert.equal(candidate.status, "review_candidate");
});

test("evaluates all supported pairs and the 14-family counterfactual", () => {
  const analysis = analyzeCorpus(syntheticCorpus(), { minSupport: 2, permutations: 4, compositionPermutations: 4, operatorPermutations: 4 });
  const ab = analysis.pair_comparisons.find((row) => row.left === "a:1" && row.right === "b:1");
  assert.ok(ab);
  assert.ok(ab.functional_similarity >= 0 && ab.functional_similarity <= 1);
  assert.equal(analysis.representation_comparison.current_16.vocabulary, 6);
  assert.equal(analysis.representation_comparison.historical_14_counterfactual.vocabulary, 4);
});

test("composition search only reports within-atom pairs", () => {
  const analysis = analyzeCorpus(syntheticCorpus(), { minSupport: 2, permutations: 4, compositionPermutations: 4, operatorPermutations: 4 });
  assert.ok(analysis.composition_candidates.every((row) => row.boundary === "within_atom"));
});

test("operator rankings carry their own permutation control", () => {
  const analysis = analyzeCorpus(syntheticCorpus(), { minSupport: 2, permutations: 4, compositionPermutations: 4, operatorPermutations: 4 });
  assert.ok(analysis.operator_candidates.length > 0);
  assert.ok(analysis.operator_candidates.every((row) => Number.isFinite(row.null_operator_mean)));
  assert.ok(analysis.operator_candidates.every((row) => row.permutation_p > 0 && row.permutation_p <= 1));
  assert.ok(analysis.operator_candidates.every((row) => row.permutation_q > 0 && row.permutation_q <= 1));
});

test("structural grammar keeps particle identities and reports higher-level candidates", () => {
  const analysis = analyzeCorpus(syntheticCorpus(), { minSupport: 2, permutations: 4, compositionPermutations: 4, operatorPermutations: 4 });
  assert.equal(analysis.structural_grammar.status, "EXPLORATORY_RULE_CANDIDATES");
  assert.ok(Array.isArray(analysis.structural_grammar.slot_frames));
  assert.ok(Array.isArray(analysis.structural_grammar.atom_role_pairs));
  assert.ok(Array.isArray(analysis.structural_grammar.molecule_transformations));
  assert.equal(analysis.summary.vocabulary, 6);
});

function syntheticCorpus() {
  const particles = [];
  const atoms = [];
  const molecules = [];
  let particleId = 1;
  const rows = [
    ["a:1", "c:1", "b:1"],
    ["a:1", "c:2", "b:1"],
    ["a:1", "h:1", "b:1"],
    ["a:1", "h:2", "b:1"],
  ];
  for (let image = 1; image <= 2; image += 1) {
    rows.forEach((tokens, moleculeIndex) => {
      const moleculeId = `img${image}-m${moleculeIndex + 1}`;
      const atomId = `${moleculeId}-a1`;
      molecules.push({ molecule_id: moleculeId, image_name: `folio-${image}` });
      atoms.push({ atom_id: atomId, molecule_id: moleculeId, atom_order: 1 });
      tokens.forEach((token, index) => {
        const [family, structural_config] = token.split(":");
        particles.push({
          particle_id: String(particleId++), atom_id: atomId, molecule_id: moleculeId,
          image_name: `folio-${image}`, particle_order: index + 1, family, structural_config,
          bounds_w: 10, bounds_h: 10, length: 10, angle: 0, points_json: "[]",
        });
      });
    });
  }
  return { particles, atoms, molecules, fingerprint: "synthetic" };
}

function annotationAuditCorpus() {
  const particles = [];
  const atoms = [];
  const molecules = [];
  let particleId = 1;
  const add = (image, name, tokens) => {
    const moleculeId = `${image}-${name}`;
    const atomId = `${moleculeId}-a1`;
    molecules.push({ molecule_id: moleculeId, image_name: image });
    atoms.push({ atom_id: atomId, molecule_id: moleculeId, atom_order: 1 });
    tokens.forEach((token, index) => {
      const [family, structural_config] = token.split(":");
      particles.push({
        particle_id: String(particleId++), atom_id: atomId, molecule_id: moleculeId,
        image_name: image, particle_order: index + 1, family, structural_config,
        bounds_w: 10, bounds_h: 10, length: 10, angle: 0, points_json: "[]",
      });
    });
  };
  for (let folio = 1; folio <= 4; folio += 1) {
    const image = `folio-${folio}`;
    for (let repeat = 1; repeat <= 4; repeat += 1) {
      add(image, `single-${repeat}`, ["a:1", "m:1", "c:1"]);
      add(image, `pair-${repeat}`, ["x:1", "e:1", "b:1", "y:1"]);
    }
  }
  add("folio-4", "suspicious", ["a:1", "e:1", "b:1", "c:1"]);
  return { particles, atoms, molecules, fingerprint: "synthetic-annotation-audit" };
}
