# VoynichLab EVAComparisonLab

Laboratorio reproducible para comparar EVA contra la tokenizacion fisica de DatasetCreator.

Este lab no intenta traducir el Voynich. Mide si las unidades fisicas pintadas y ordenadas en DatasetCreator producen una estructura posicional mas estable que EVA sobre los mismos folios.

## Estado Actual

Corpus activo:

- `page-003.jpg`: folio `f1r` completo.
- `page-004.jpg`: folio `f1v` completo.
- `page-005.jpg`: folio `f2r` completo.
- `page-006.jpg`: folio `f2v` completo.
- `page-007.jpg`: folio `f3r` completo.
- `page-094.jpg`: folio `f47v` completo.
- EVA source: `sources/IT2a-n.txt`.
- Exports vivos: regenerables bajo `cases/*-current` y `artifacts/visual-snapshots/current`.
- Evidencia congelada: `../../research/frozen` y `../../research/artifacts/public`.

El directorio no conserva exports parciales ni carpetas legacy. Los outputs `current` son scratch local ignorado por Git y se regeneran desde la DB actual.

## Comando Principal

Desde `labs/eva-comparison`:

```powershell
npm.cmd run corpus:v2
```

Ese comando regenera:

- EVA completo de `f1r`, `f1v`, `f2r`, `f2v`, `f3r` y `f47v`;
- export fisico actual desde DatasetCreator;
- comparacion de entropia EVA vs atoms;
- auditoria de renglones EVA/fisicos;
- vocabulario fisico;
- reglas contextuales por particula y molecula;
- vecinos entre moleculas;
- entropia condicional;
- ablacion de variantes;
- macro-lexemas;
- snapshots visuales de atomos, particulas y moleculas;
- validacion morfologica;
- validacion cruzada por folio;
- excepciones inspeccionables;
- audit de posibles errores humanos.
- manifiesto local de corrida V2.

## DB Y Permisos

Los scripts de EVAComparisonLab leen por defecto:

```text
%APPDATA%\com.voynichlab.datasetcreator\datasetcreator.db
```

Leer/exportar la DB no deberia pedir permiso especial. Recalcular DatasetCreator con `recalculate_db` si escribe en esa DB real y por eso puede requerir aprobacion del entorno.

## Anomalias Conocidas

El audit de errores humanos no debe repetir anomalias conocidas que ya decidimos conservar para no forzar los datos. Esos casos viven en:

```text
../research/audits/known-labeling-anomalies.tsv
```

Cuando el audit encuentra una rareza cuyo `atom_ids` esta en ese TSV:

- no la muestra como pendiente;
- la cuenta como anomalia conocida suprimida de la cola pendiente;
- la escribe en `labeling-anomaly-known.tsv`.

## Lectura De Resultados

La comparacion central usa entropia de Shannon por rol:

```text
H = -sum(P_i * log2(P_i))
```

Los roles son `initial`, `medial`, `final`. El maximo teorico con tres roles es `log2(3) = 1.5850`.

Senales favorables:

- atoms con menor entropia ponderada que EVA;
- simbolos fisicos rigidamente concentrados en una posicion;
- reglas contextuales que sobreviven entre folios;
- familias visuales separables sin usar EVA ni posicion;
- excepciones reducidas a casos inspeccionables.

Senales en contra:

- atoms tan mezclados como EVA;
- mejora causada solo por sobreajuste o limpieza retrospectiva;
- reglas que dependen de errores de recorte/union;
- familias visuales que no pueden distinguirse morfologicamente.

## Archivos Principales

- `../research/frozen/CORPUS-V2-AUDITED/`
- `../../research/artifacts/public/corpus-v2-audited-robustness-replay/`
- `../../research/artifacts/public/representation-comparison-v2-aligned/`
- `../research/audits/known-labeling-anomalies.tsv`
- `scripts/run-corpus-v2-analysis.js`
- `scripts/export-visual-snapshots.js`

Generated local outputs, when present:

- `cases/*-current/`
- `artifacts/visual-snapshots/current/visual-snapshots.tsv`
- `artifacts/visual-snapshots/current/visual-snapshots.db`
