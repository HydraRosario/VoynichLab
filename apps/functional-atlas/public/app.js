const main = document.querySelector('#main');
const fileInput = document.querySelector('#analysis-file');
const nav = document.querySelector('#nav');
let analysis = null;
let activeView = 'audit';
let selectedToken = null;
let selectedPair = 0;

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  loadAnalysis(JSON.parse(await file.text()));
});
nav.addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  activeView = button.dataset.view;
  nav.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
  render();
});
main.addEventListener('click', (event) => {
  const particle = event.target.closest('[data-token]');
  if (particle) { selectedToken = particle.dataset.token; render(); }
  const pair = event.target.closest('[data-pair]');
  if (pair) { selectedPair = Number(pair.dataset.pair); render(); }
  const exportButton = event.target.closest('[data-export]');
  if (exportButton) exportJson(exportButton.dataset.export);
});

fetch('/analysis.json').then((response) => response.ok ? response.json() : null).then((data) => data && loadAnalysis(data)).catch(() => {});

function loadAnalysis(data) {
  if (data?.status !== 'EXPLORATORY_NOT_FROZEN') throw new Error('Unsupported or unmarked analysis');
  analysis = data;
  selectedToken = data.profiles?.[0]?.token;
  render();
}

function render() {
  if (!analysis) return;
  const views = { audit, overview, particles, equivalence, composition, operators, grammar, qc };
  main.innerHTML = views[activeView]();
}

function header(eyebrow, title, description) {
  return `<div class="view-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p class="lede">${description}</p></div><div class="fingerprint" title="${analysis.input_fingerprint_sha256}">input ${analysis.input_fingerprint_sha256}</div></div>`;
}

function audit() {
  const audit = analysis.annotation_audit;
  if (!audit) return `${header('ANNOTATION AUDIT','No contextual audit loaded','Regenerate the analysis with the current Functional Atlas engine.')}`;
  const candidates = audit.candidates ?? [];
  return `${header('HUMAN ANNOTATION AUDIT','Where does the local pattern look wrong?','Atlas compares declared visually ambiguous readings with patterns learned from the other folios. It ranks manuscript cases for human inspection; it never corrects them.')}
    <div class="metric-grid">${metric(candidates.length,'cases to inspect')}${metric(audit.hypotheses.length,'declared ambiguity')}${metric(analysis.summary.images,'folios compared')}${metric(audit.minimum_log_score_delta,'minimum score gap')}${metric('0','automatic edits')}${metric('human','final decision')}</div>
    <section class="research-question"><div><span class="eyebrow">HOW THE PILOT WORKS</span><h2>Could <code>e:1 + b:1</code> be a mistaken split of <code>m:1</code>?</h2></div><p>Both readings are common and visually difficult to distinguish. For each occurrence, Atlas learns their surrounding patterns without using that occurrence's folio, then asks whether the alternative reading fits substantially better.</p></section>
    <div class="warning"><strong>Candidate, not correction.</strong> Context can identify a useful place to look, but only inspection of the manuscript trace and annotation geometry can establish a human error.</div>
    <div class="actions"><button class="action primary" data-export="qc">Export audit candidates</button><button class="action" data-export="analysis">Export full analysis</button></div>
    ${candidates.length ? `<div class="candidate-grid">${candidates.map((row) => `<article class="candidate-card"><span class="eyebrow">REVIEW CANDIDATE · ${row.image_name}</span><div class="equation">${row.current_tokens.join(' + ')} → ${row.alternative_tokens.join(' + ')}</div><div class="examples">${(row.current_visuals ?? []).map(trace).join('')}</div><p><strong>${row.external_previous}</strong> · [${row.current_tokens.join(' + ')}] · <strong>${row.external_next}</strong></p><small>${row.atom_id} · particles ${row.particle_ids.join(', ')} · held-out score gap +${fmt(row.context_delta)}</small></article>`).join('')}</div>` : `<section class="detail-panel"><span class="eyebrow">NO CASE CROSSED THE REVIEW THRESHOLD</span><h2>The declared ambiguity produced no contextual candidate.</h2><p class="lede">That is a valid negative result. It does not prove every annotation is correct.</p></section>`}`;
}

function overview() {
  const s = analysis.summary;
  const reps = analysis.representation_comparison;
  const current = reps.current_16;
  const historical = reps.historical_14_counterfactual;
  const entropyDelta = historical.weighted_role_entropy - current.weighted_role_entropy;
  const lossDelta = historical.leave_one_image_out_normalized_log_loss - current.leave_one_image_out_normalized_log_loss;
  return `${header('REPRESENTATION UNDER TEST','Do the visual distinctions earn their place?','Functional Atlas measures what changes when particles are merged, expanded, repeated, or treated as structural alternatives. It does not translate the manuscript.')}
    <div class="metric-grid">${metric(s.particles,'particles')}${metric(s.atoms,'atoms')}${metric(s.molecules,'molecules')}${metric(s.images,'folios')}${metric(s.tested_pairs,'pairs tested')}${metric(s.tested_compositions,'compositions')}</div>
    <section class="research-question"><div><span class="eyebrow">THE FIRST RETROSPECTIVE TEST</span><h2>Was the older 14-category intuition structurally better?</h2></div><p>The counterfactual merges <code>c:1/c:2</code> and <code>h:1/h:2</code>. It changes the analytical representation only; the visual annotations remain untouched.</p></section>
    <div class="compare-grid"><article class="representation current"><span class="eyebrow">CURRENT</span><div class="big">16</div><h3>PARTICLES-V1 labels</h3><dl><dt>Role entropy</dt><dd>${fmt(current.weighted_role_entropy)}</dd><dt>Held-out normalized loss</dt><dd>${fmt(current.leave_one_image_out_normalized_log_loss)}</dd></dl></article><div class="versus">VERSUS</div><article class="representation historical"><span class="eyebrow">COUNTERFACTUAL</span><div class="big">14</div><h3>Families merged</h3><dl><dt>Role entropy</dt><dd>${fmt(historical.weighted_role_entropy)}</dd><dt>Held-out normalized loss</dt><dd>${fmt(historical.leave_one_image_out_normalized_log_loss)}</dd></dl></article></div>
    <div class="finding"><strong>Current reading:</strong> the 14-category view increases weighted role entropy by ${signed(entropyDelta)} and held-out normalized loss by ${signed(lossDelta)}. On this protocol, the current 16-label distinction performs better. This is evidence about representation quality—not proof that every individual annotation is correct.</div>`;
}

function particles() {
  const profile = analysis.profiles.find((row) => row.token === selectedToken) ?? analysis.profiles[0];
  return `${header('VISUAL + STRUCTURAL INVENTORY','Particle atlas','Inspect what each label looks like, where it occurs, and which contexts define its current structural role.')}
    <div class="particle-grid">${analysis.profiles.map((row) => `<button class="particle-card ${row.token === profile.token ? 'active' : ''}" data-token="${row.token}"><strong>${row.token}</strong><small>${row.count} traces · ${row.images} folios</small></button>`).join('')}</div>
    <section class="detail-panel"><span class="eyebrow">SELECTED PARTICLE</span><h2>${profile.token}</h2><div class="examples">${profile.visual_examples.map(trace).join('')}</div><div class="split"><div><h3>Previous context</h3>${bars(profile.previous)}</div><div><h3>Next context</h3>${bars(profile.next)}</div></div></section>`;
}

function equivalence() {
  const selected = analysis.pair_comparisons[selectedPair] ?? analysis.pair_comparisons[0];
  return `${header('PAIRWISE COUNTERFACTUALS','Could two labels play the same role?','All 120 possible pairs are compared through previous context, next context, particle position, atom position, and leave-one-folio-out merge loss.')}
    <div class="warning">High similarity alone is insufficient. A favorable candidate must also avoid worsening held-out prediction and must remain stable across future controls.</div>
    <section class="detail-panel"><span class="eyebrow">OPEN COMPARISON</span><h2>${selected.left} ↔ ${selected.right}</h2><div class="metric-grid">${metric(pct(selected.components.previous),'previous context')}${metric(pct(selected.components.next),'next context')}${metric(pct(selected.components.particle_role),'particle role')}${metric(pct(selected.components.atom_role),'atom role')}${metric(`${selected.stable_images}/${selected.tested_images}`,'stable folios')}${metric(signed(selected.heldout_merge.normalized_delta),'held-out loss Δ')}</div><p class="lede">Permutation control: observed ${pct(selected.functional_similarity)} · null mean ${pct(selected.null_similarity_mean)} · p ${fmt(selected.permutation_p)} · FDR q ${fmt(selected.permutation_q)}.</p><div class="bar-list">${selected.by_image.map((row)=>`<div class="bar-row"><span>${row.image}</span><span class="bar"><i style="width:${row.similarity*100}%"></i></span><span>${pct(row.similarity)}</span></div>`).join('')}</div></section>
    <div class="table"><div class="table-row header"><span>Pair</span><span>Similarity</span><span>Min support</span><span>Loss Δ</span><span>Status</span></div>${analysis.pair_comparisons.map((row,index) => `<div class="table-row clickable" data-pair="${index}"><span class="token">${row.left} ↔ ${row.right}</span><span class="score">${pct(row.functional_similarity)}</span><span>${row.min_support}</span><span>${signed(row.heldout_merge.normalized_delta)}</span><span class="status ${statusClass(row.status)}">${row.status}</span></div>`).join('')}</div>`;
}

function composition() {
  return `${header('COMPOSITION SEARCH','Could one particle behave like two?','Each candidate compares the external context of X with an observed Z → Y sequence inside the same atom. Cross-boundary pairs are deliberately excluded.')}
    <div class="candidate-grid">${analysis.composition_candidates.slice(0,60).map((row) => `<article class="candidate-card"><span class="eyebrow">${row.boundary.replace('_',' ')} · ${row.status}</span><div class="equation">${row.single} ≈ ${row.composition.join(' + ')}</div><div class="meter"><i style="width:${row.context_similarity*100}%"></i></div><p><strong>${pct(row.context_similarity)}</strong> context similarity</p><small>${row.single_support} single · ${row.composition_support} composed · null ${pct(row.null_similarity_mean)} · q ${fmt(row.permutation_q)}</small><div class="bar-list">${Object.entries(row.components).map(([name,value])=>`<div class="bar-row"><span>${name.replace('external_','')}</span><span class="bar"><i style="width:${value*100}%"></i></span><span>${pct(value)}</span></div>`).join('')}</div></article>`).join('')}</div>`;
}

function operators() {
  return `${header('FORMAL REPETITION','Does repetition organize relations?','This view ranks particles by positional rigidity and neighbor predictability. “Operator” is a structural hypothesis only; no chemical, linguistic, or semantic identity is assigned.')}
    <div class="split"><div class="table"><div class="table-row header"><span>Particle</span><span>Score</span><span>Null</span><span>FDR q</span><span>Status</span></div>${analysis.operator_candidates.map((row) => `<div class="table-row"><span class="token">${row.token}</span><span class="score">${pct(row.operator_score)}</span><span>${pct(row.null_operator_mean)}</span><span>${fmt(row.permutation_q)}</span><span class="status ${statusClass(row.status)}">${row.status}</span></div>`).join('')}</div><div><h3>Most repeated templates</h3><div class="warning">Template counts are descriptive until a frequency-matched null is added.</div><div class="table">${analysis.repeated_templates.slice(0,35).map((row) => `<div class="table-row"><span class="token">${row.template}</span><span>${row.count}×</span><span>${row.image_support} folios</span><span></span><span></span></div>`).join('')}</div></div></div>`;
}

function grammar() {
  const grammar = analysis.structural_grammar;
  if (!grammar) return `${header('STRUCTURAL GRAMMAR','No structural-rule analysis loaded','Regenerate the analysis with the current Functional Atlas engine.')}`;
  return `${header('RULES WITHOUT RENAMING PARTICLES','Which structures recur above the particle level?','This experiment keeps all 16 particle identities intact. It searches for constrained slots inside atoms, atoms that occupy similar molecule roles, and molecule types connected by one recurrent edit.')}
    <div class="metric-grid">${metric(grammar.slot_frames.length,'cross-folio frames')}${metric(grammar.atom_role_pairs.length,'atom-role pairs')}${metric(grammar.molecule_transformations.length,'transformations')}${metric(analysis.summary.images,'folios')}${metric('0','labels changed')}${metric('exploratory','status')}</div>
    <section class="research-question"><div><span class="eyebrow">THE CHANGE IN QUESTION</span><h2>Do not ask which traces to merge. Ask which structures can vary without losing their role.</h2></div><p>These candidates describe regularities at the atom and molecule levels. They are possible grammar rules, not proposed Corpus V3 corrections.</p></section>
    <section class="detail-panel"><span class="eyebrow">01 · CONSTRAINED SLOTS</span><h2>Same atom frame, limited alternatives</h2><p class="lede">Every listed filling occurs at least four times and on at least two folios. A question mark marks the changing particle; everything around it remains fixed.</p><div class="candidate-grid">${grammar.slot_frames.map((row)=>`<article class="candidate-card"><span class="eyebrow">${row.image_support} FOLIOS · ${row.support} EXAMPLES</span><div class="equation">${row.frame}</div><p>${row.fillings.map((item)=>`<strong>${item.token}</strong> ${item.count}×/${item.image_support}f`).join(' · ')}</p><small>filling entropy ${fmt(row.filling_entropy)} · ${row.status}</small></article>`).join('')}</div></section>
    <section class="detail-panel"><span class="eyebrow">02 · FUNCTIONAL ATOM CLASSES</span><h2>Different atoms, similar molecule role</h2><p class="lede">Identity is preserved. The score compares the atom before, the atom after, and position inside the molecule.</p><div class="candidate-grid">${grammar.atom_role_pairs.slice(0,36).map((row)=>`<article class="candidate-card"><span class="eyebrow">${row.common_folios} COMMON FOLIOS</span><div class="equation small-equation">${row.left}<br>↔<br>${row.right}</div><p><strong>${pct(row.functional_similarity)}</strong> contextual similarity</p><small>${row.left_support} versus ${row.right_support} observations</small></article>`).join('')}</div></section>
    <section class="detail-panel"><span class="eyebrow">03 · MOLECULE TRANSFORMATIONS</span><h2>Recurring molecule types separated by one operation</h2><p class="lede">Both molecule types must recur at least four times, occur on multiple folios, and coexist on at least two of the same folios.</p><div class="candidate-grid">${grammar.molecule_transformations.slice(0,36).map((row)=>`<article class="candidate-card"><span class="eyebrow">${row.operation.toUpperCase()} · ${row.common_folios} COMMON FOLIOS</span><div class="equation small-equation">${row.removed || '∅'} → ${row.added || '∅'}</div><p>atom position <strong>${row.index}</strong></p><small>${row.from_support} source · ${row.to_support} target occurrences</small></article>`).join('')}</div></section>
    <div class="warning">Discovery status only. Frequency controls, preregistered ranking, and held-out confirmation are required before any candidate becomes GRAMMAR-V2 evidence.</div>`;
}

function qc() {
  return `${header('GEOMETRY AUDIT','Which traces look unlike their assigned family?','This second audit channel ranks unusual length, angle, and bounds. It complements contextual audit without treating rarity as an error.')}
    <div class="table"><div class="table-row header"><span>Particle</span><span>Label</span><span>Feature</span><span>Robust z</span><span>Destination</span></div>${analysis.visual_outliers.slice(0,200).map((row) => `<div class="table-row"><span class="token">#${row.particle_id}</span><span>${row.token}</span><span>${row.feature}</span><span class="score">${fmt(row.robust_z)}</span><span>QC Review</span></div>`).join('')}</div>`;
}

function trace(example) {
  let points=[]; try { const parsed=JSON.parse(example.points_json); points=Array.isArray(parsed)?parsed:(parsed.points??[]); } catch {}
  const x=example.bounds_x,y=example.bounds_y,w=Math.max(example.bounds_w,1),h=Math.max(example.bounds_h,1);
  const polyline=points.map((point)=>`${((point.x-x)/w)*100},${((point.y-y)/h)*100}`).join(' ');
  return `<div><div class="trace"><svg viewBox="-8 -8 116 116" preserveAspectRatio="xMidYMid meet" aria-label="Particle ${example.particle_id}"><polyline points="${polyline}" fill="none" stroke="#9cff65" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg></div><small>#${example.particle_id} · ${example.image_name}</small></div>`;
}
function bars(dist){return `<div class="bar-list">${Object.entries(dist).sort((a,b)=>b[1]-a[1]).slice(0,9).map(([key,value])=>`<div class="bar-row"><span>${key}</span><span class="bar"><i style="width:${value*100}%"></i></span><span>${pct(value)}</span></div>`).join('')}</div>`}
function metric(value,label){return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`}
function fmt(value){return Number(value).toFixed(4)}
function pct(value){return `${(Number(value)*100).toFixed(1)}%`}
function signed(value){return `${Number(value)>=0?'+':''}${Number(value).toFixed(4)}`}
function statusClass(status){return status.startsWith('supported')?'supported':status}
function exportJson(kind){const payload=kind==='qc'?{schema_version:1,status:'CANDIDATES_NOT_DECISIONS',source_fingerprint_sha256:analysis.input_fingerprint_sha256,contextual_annotation_candidates:analysis.annotation_audit?.candidates??[],visual_geometry_candidates:analysis.visual_outliers}:analysis;const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=kind==='qc'?'functional-atlas-qc-candidates.json':'functional-atlas-analysis.json';link.click();URL.revokeObjectURL(link.href)}
