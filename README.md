# VoynichLab

Workspace local para investigar el Manuscrito Voynich con laboratorios separados.
Cada herramienta esta pensada para vivir en su propio repositorio:

- `DataSetCreator`: etiquetador visual de manuscritos basado en atomos, trazos y agrupacion automatica por proximidad.
- `TranslationLab`: banco experimental pausado para auditar romanizaciones, segmentaciones, raices y posibles hipotesis de traduccion.
- `EVAComparisonLab`: laboratorio de control para comparar entropia posicional entre atomos propios y EVA sobre los mismos parrafos.

## Estado del proyecto

El flujo principal activo es `DataSetCreator`. El modelo viejo de cajas externas fue reemplazado por un flujo de adentro hacia afuera:

```text
tinta -> atomos -> moleculas -> corpus exportable
```

`TranslationLab` queda fuera del foco actual. `EVAComparisonLab` empieza como control matematico directo: no traduce, mide si EVA mezcla posiciones que los atomos conservan.

Este directorio padre no debe asumirse como el repositorio final. Sirve para trabajar localmente con ambos laboratorios cerca.

## Publicacion

Antes de publicar en GitHub:

- mantener fuera del repositorio los builds, caches, imagenes completas del manuscrito y exports locales;
- documentar el esquema JSON exportado por `DataSetCreator`;
- agregar licencia explicita;
- agregar pruebas minimas para el backend Rust y los scripts principales.
