# VoynichLab EVAComparisonLab

Laboratorio reproducible para comparar EVA contra la tokenizacion fisica de DatasetCreator.

Este lab no intenta traducir el Voynich. Mide si las unidades fisicas pintadas y ordenadas en DatasetCreator producen una estructura posicional mas estable que EVA sobre los mismos folios.

## Estado Actual

Corpus activo:

- `page-003.jpg`: folio `f1r` completo.
- `page-004.jpg`: folio `f1v` completo.
- `page-094.jpg`: folio `f47v` completo.
- EVA source: `sources/IT2a-n.txt`.
- Caso combinado vivo: `cases/combined-f1r-f1v-f47v-full-current`.
- Reporte comprimido: `cases/CURRENT-COMPRESSED-REPORT.md`.
- Reporte completo unico: `cases/FINAL-COMPLETE-REPORT.md`.
- Snapshots visuales: `artifacts/visual-snapshots/current`.

El directorio no conserva exports parciales ni carpetas legacy. Los outputs se regeneran desde la DB actual.

## Comando Principal

Desde `EVAComparisonLab`:

```powershell
npm.cmd run current
```

Ese comando regenera:

- EVA completo de `f1r`, `f1v` y `f47v`;
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
- reporte completo unico con todos los modulos embebidos.

## DB Y Permisos

Los scripts de EVAComparisonLab leen por defecto:

```text
C:\Users\<usuario>\AppData\Roaming\com.voynichlab.datasetcreator\datasetcreator.db
```

Leer/exportar la DB no deberia pedir permiso especial. Recalcular DatasetCreator con `recalculate_db` si escribe en esa DB real y por eso puede requerir aprobacion del entorno.

## Anomalias Conocidas

El audit de errores humanos no debe repetir anomalias conocidas que ya decidimos conservar para no forzar los datos. Esos casos viven en:

```text
cases/known-labeling-anomalies.tsv
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

- `cases/CURRENT-COMPRESSED-REPORT.md`
- `cases/FINAL-COMPLETE-REPORT.md`
- `cases/combined-f1r-f1v-f47v-full-current/role-entropy.md`
- `cases/combined-f1r-f1v-f47v-full-current/line-alignment-audit.md`
- `cases/combined-f1r-f1v-f47v-full-current/contextual-rule-discovery.md`
- `cases/combined-f1r-f1v-f47v-full-current/contextual-rule-discovery-molecule-scope.md`
- `cases/combined-f1r-f1v-f47v-full-current/conditional-entropy.md`
- `cases/combined-f1r-f1v-f47v-full-current/variant-ablation.md`
- `cases/combined-f1r-f1v-f47v-full-current/macro-lexeme-analysis.md`
- `cases/combined-f1r-f1v-f47v-full-current/morphology-family-analysis.md`
- `cases/combined-f1r-f1v-f47v-full-current/labeling-anomaly-audit.md`
- `artifacts/visual-snapshots/current/visual-snapshots.tsv`
- `artifacts/visual-snapshots/current/visual-snapshots.db`
