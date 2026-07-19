import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (!args.assembly) {
  console.error('Usage: node scripts/build-translation-hypotheses.js --assembly <translation-assembly.json> [--out report.md]');
  process.exit(1);
}

const assemblyPath = path.resolve(args.assembly);
const assembly = JSON.parse(fs.readFileSync(assemblyPath, 'utf8'));
const units = assembly.units || [];
const inventory = assembly.inventory || [];
const formulas = assembly.formulas || [];

const rootProfiles = inventory.map(profileRoot);
const formulaProfiles = formulas.map((formula) => profileFormula(formula, units, rootProfiles));
const bestUnits = units
  .slice()
  .sort((a, b) => b.evidenceScore - a.evidenceScore || a.riskScore - b.riskScore)
  .slice(0, 8)
  .map((unit) => profileUnit(unit, rootProfiles));

const report = renderReport({
  assemblyPath: args.assembly,
  assembly,
  rootProfiles,
  formulaProfiles,
  bestUnits,
});

if (args.out) {
  fs.writeFileSync(path.resolve(args.out), report, 'utf8');
} else {
  console.log(report);
}

function profileRoot(root) {
  const risk = Number(root.riskScore || 0);
  const evidence = Number(root.evidenceScore || 0);
  const length = root.token.length;
  const repeated = Number(root.count || 0) >= 3;
  const role = inferRootRole(root, risk, evidence, length, repeated);

  return {
    token: root.token,
    count: Number(root.count || 0),
    status: root.status || 'unknown',
    evidence,
    risk,
    units: root.units || [],
    role,
    usable: evidence >= 0.45 && risk <= 0.8,
    proofSafe: evidence >= 0.7 && risk <= 0.55 && length >= 3,
    notes: root.warnings || [],
    hints: root.glossHints || [],
  };
}

function inferRootRole(root, risk, evidence, length, repeated) {
  if (root.status === 'unknown') return 'raiz-no-resuelta';
  if (root.status === 'noisy') return 'ruido-probable';
  if (length <= 2 && repeated) return 'particula-gramatical-posible';
  if (length <= 2) return 'micro-raiz-peligrosa';
  if (evidence >= 0.7 && risk <= 0.55) return 'raiz-lexica-candidata';
  if (repeated) return 'formula-o-morfema-recurrente';
  return 'candidata-debil';
}

function profileFormula(formula, units, rootProfiles) {
  const tokens = formula.formula.split('|');
  const rootMap = new Map(rootProfiles.map((root) => [root.token, root]));
  const occurrences = (formula.units || [])
    .map((order) => units.find((unit) => Number(unit.order) === Number(order)))
    .filter(Boolean);

  const positions = occurrences.map((unit) => formulaPosition(unit, tokens));
  const tokenProfiles = tokens.map((token) => rootMap.get(token)).filter(Boolean);
  const avgEvidence = average(tokenProfiles.map((root) => root.evidence));
  const avgRisk = average(tokenProfiles.map((root) => root.risk));
  const unresolved = tokens.filter((token) => !rootMap.get(token) || rootMap.get(token).status === 'unknown');
  const role = inferFormulaRole(tokens, positions, unresolved, avgEvidence, avgRisk);

  return {
    formula: formula.formula,
    count: Number(formula.count || 0),
    units: formula.units || [],
    positions,
    avgEvidence,
    avgRisk,
    unresolved,
    role,
    reading: describeFormula(tokens, tokenProfiles, role),
  };
}

function formulaPosition(unit, tokens) {
  const parts = (unit.segments || []).map((segment) => segment.token);
  const key = tokens.join('|');
  for (let index = 0; index <= parts.length - tokens.length; index += 1) {
    if (parts.slice(index, index + tokens.length).join('|') !== key) continue;
    if (index === 0 && tokens.length === parts.length) return 'whole-unit';
    if (index === 0) return 'prefix';
    if (index + tokens.length === parts.length) return 'suffix';
    return 'middle';
  }
  return 'unknown-position';
}

function inferFormulaRole(tokens, positions, unresolved, evidence, risk) {
  const uniquePositions = new Set(positions);
  if (unresolved.length) return 'formula-repetida-con-huecos';
  if (uniquePositions.size === 1 && uniquePositions.has('suffix')) return 'cierre-posible';
  if (uniquePositions.size === 1 && uniquePositions.has('prefix')) return 'apertura-posible';
  if (tokens.length === 2 && evidence >= 0.6 && risk <= 0.75) return 'bloque-gramatical-posible';
  if (tokens.length >= 3) return 'frase-corta-recurrente';
  return 'patron-recurrente';
}

function describeFormula(tokens, tokenProfiles, role) {
  const pieces = tokens.map((token) => {
    const profile = tokenProfiles.find((root) => root.token === token);
    if (!profile) return `${token}=sin resolver`;
    if (profile.status === 'unknown') return `${token}=sin resolver`;
    if (profile.status === 'noisy') return `${token}=ruido probable`;
    if (profile.proofSafe) return `${token}=candidata fuerte`;
    if (profile.usable) return `${token}=usable con cuidado`;
    return `${token}=debil`;
  });
  return `${role}: ${pieces.join(', ')}`;
}

function profileUnit(unit, rootProfiles) {
  const rootMap = new Map(rootProfiles.map((root) => [root.token, root]));
  const tokens = (unit.segments || []).map((segment) => segment.token);
  const known = tokens.filter((token) => rootMap.get(token)?.status !== 'unknown');
  const unresolved = tokens.filter((token) => !rootMap.get(token) || rootMap.get(token).status === 'unknown');
  const safe = tokens.filter((token) => rootMap.get(token)?.proofSafe);
  const weak = tokens.filter((token) => rootMap.get(token) && !rootMap.get(token).proofSafe && rootMap.get(token).status !== 'unknown');

  return {
    order: unit.order,
    reading: unit.reading,
    segmentation: unit.segmentation,
    status: unit.status,
    evidence: Number(unit.evidenceScore || 0),
    risk: Number(unit.riskScore || 0),
    known,
    unresolved,
    safe,
    weak,
    verdict: unitVerdict(unit, safe, weak, unresolved),
  };
}

function unitVerdict(unit, safe, weak, unresolved) {
  if (!unresolved.length && safe.length >= 2) return 'mejor candidata para intentar sentido';
  if (safe.length || weak.length >= 2) return 'sirve para estudiar patron, no para traducir sola';
  if (unresolved.length >= 2) return 'depende demasiado de raices no resueltas';
  return 'evidencia insuficiente';
}

function renderReport({ assemblyPath, assembly, rootProfiles, formulaProfiles, bestUnits }) {
  const lines = [
    '# VoynichLab - Hipotesis de Traduccion',
    '',
    `- assembly: ${assemblyPath}`,
    `- pagina: ${assembly.page}`,
    `- pagina manuscrita: ${assembly.manuscriptPage}`,
    `- parrafo: ${assembly.paragraphNumber}`,
    `- unidades: ${assembly.unitCount}`,
    `- evidencia global: ${Number(assembly.evidenceScore || 0).toFixed(2)}`,
    `- riesgo global: ${Number(assembly.riskScore || 0).toFixed(2)}`,
    '',
    '## Resultado en simple',
    '',
    'Todavia no tenemos una traduccion final. Si tenemos algo util: el parrafo muestra formulas repetidas. Eso permite empezar a separar gramatica posible de raices demasiado ambiguas.',
    '',
    'La regla operativa desde ahora es esta: ninguna raiz corta prueba significado por si sola. Solo sirve si aparece dentro de una formula repetida y compatible con las reglas visuales.',
    '',
    '## Formulas que importan',
    '',
    '| formula | veces | unidades | rol probable | lectura tecnica |',
    '| --- | ---: | --- | --- | --- |',
  ];

  for (const formula of formulaProfiles.slice(0, 16)) {
    lines.push(`| ${cell(formula.formula)} | ${formula.count} | ${formula.units.join(', ')} | ${cell(formula.role)} | ${cell(formula.reading)} |`);
  }

  lines.push('', '## Raices por prioridad', '');
  lines.push('| raiz | veces | rol | evidencia | riesgo | decision |');
  lines.push('| --- | ---: | --- | ---: | ---: | --- |');
  for (const root of rootProfiles.slice(0, 20)) {
    const decision = root.proofSafe
      ? 'puede entrar a hipotesis'
      : root.usable
        ? 'usar solo con contexto'
        : 'no usar como prueba';
    lines.push(`| ${cell(root.token)} | ${root.count} | ${cell(root.role)} | ${root.evidence.toFixed(2)} | ${root.risk.toFixed(2)} | ${cell(decision)} |`);
  }

  lines.push('', '## Mejores unidades para probar sentido', '');
  for (const unit of bestUnits) {
    lines.push(`### Unidad ${unit.order}: ${unit.reading}`);
    lines.push('');
    lines.push(`- segmentacion: ${unit.segmentation}`);
    lines.push(`- estado: ${unit.status}`);
    lines.push(`- veredicto: ${unit.verdict}`);
    lines.push(`- raices utilizables: ${unit.known.join(', ') || 'ninguna'}`);
    lines.push(`- huecos: ${unit.unresolved.join(', ') || 'ninguno'}`);
    lines.push('');
  }

  lines.push(
    '## Que significa esto para el Nobel',
    '',
    'Esto todavia no demuestra la traduccion. Pero si convierte tu parrafo en una prueba cientifica: si las mismas formulas visuales siguen produciendo las mismas funciones romanizadas en otros parrafos, la teoria gana fuerza. Si no se repiten, cae o hay que corregir la llave.',
    '',
    'Proximo paso automatico: tomar estas formulas y generar una tabla de comparacion contra el modo plano. Si el modo segmentado explica mas que el modo plano, tu etiquetado visual esta aportando informacion real.',
    '',
  );

  return lines.join('\n');
}

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function parseArgs(items) {
  const parsed = {};
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    parsed[key] = items[index + 1] && !items[index + 1].startsWith('--') ? items[++index] : true;
  }
  return parsed;
}
