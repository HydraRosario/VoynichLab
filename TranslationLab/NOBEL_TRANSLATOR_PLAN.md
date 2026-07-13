# TranslationLab - Plan de herramienta seria

Objetivo: convertir romanizaciones exportadas desde DataSetCreator en traducciones candidatas, con trazabilidad suficiente para distinguir una lectura prometedora de un autoengano elegante.

## Principio central

TranslationLab no debe ser un generador de frases lindas. Debe ser una maquina de busqueda, presion y auditoria.

Entrada unica:

- Ultimo export real de DataSetCreator.

Salidas obligatorias:

- Traduccion propuesta.
- Separacion morfologica elegida para cada unidad.
- Raices usadas y fuentes.
- Alternativas descartadas.
- Puntos donde la llave de romanizacion podria estar fallando.

## Fase 1 - Base confiable

Estado esperado:

- La app no acepta romanizaciones manuales.
- El export del dataset es la unica fuente de unidades.
- Cada corrida queda guardada en `TranslationLab/outputs`.
- Cada fuente externa queda cacheada para repetir resultados.

Trabajo pendiente:

- Mostrar en la app el archivo exacto de dataset usado.
- Mostrar fecha del export y cantidad de unidades.
- Agregar boton para abrir la carpeta de outputs.
- Evitar que una corrida vieja se confunda con una nueva.

## Fase 2 - Fuentes etimologicas

Fuentes actuales:

- Wiktionary: definiciones, idiomas y etimologias explicitas.
- Wikipedia: contexto enciclopedico amplio.
- Datamuse: asociaciones lexicas, util pero ruidosa.
- Omniglot: material linguistico/cultural auxiliar, ahora integrado como proveedor cacheado.

Regla de uso:

- Wiktionary con etimologia pesa mas.
- Omniglot sirve para descubrir familias, idiomas, escrituras, nombres y paralelos culturales.
- Datamuse nunca debe decidir una traduccion por si solo.
- Wikipedia ayuda a armar contexto, pero no define raices.

Trabajo pendiente:

- Agregar fuentes especializadas por familia linguistica.
- Separar fuentes "lexicas" de fuentes "culturales".
- Guardar URL por cada candidato elegido.
- Puntuar cada raiz por fuente, no solo por cantidad de hits.

## Fase 3 - Segmentacion intensiva

Problema:

Una romanizacion como `ohorahiirime` puede separarse de muchas formas. La traduccion cambia completamente segun donde se corten las raices.

Motor necesario:

- Generar miles de segmentaciones por unidad.
- Penalizar cortes absurdos con demasiadas letras sueltas.
- Premiar raices que se repiten con el mismo sentido.
- Premiar separaciones que hacen coherente una oracion completa.
- Permitir cherry picking, pero registrarlo.

Salida por unidad:

- Separacion elegida.
- Score.
- Traduccion literal de raices.
- Alternativas principales.
- Motivo de eleccion.

## Fase 4 - Coherencia de parrafo

El traductor no debe elegir la mejor raiz aislada. Debe elegir el mejor conjunto para todo el parrafo.

Modelo de decision:

- Una raiz repetida debe tender a conservar significado.
- Una regla gramatical puede transformar sonido o valor, pero debe quedar escrita.
- Si una lectura produce una frase coherente, sube.
- Si una lectura solo funciona por una coincidencia aislada, baja.

Metricas:

- Cobertura: cuantas unidades quedan explicadas.
- Coherencia: cuantas raices mantienen sentido.
- Compresion: cuanta informacion sale de pocas reglas.
- Fragilidad: cuanto cambia la traduccion si cambia una letra.

## Fase 5 - Presion sobre la llave

Este es el punto mas importante.

Si `mirriaa` no encuentra raices utiles, el sistema debe proponer mutaciones controladas:

- mirriaa -> mirrii
- mirriaa -> merrio
- crime -> crine
- rime -> rine

Pero no debe cambiar todo libremente. Cada cambio debe registrar:

- Romanizacion original.
- Romanizacion propuesta.
- Glifo/parte visual afectada.
- Mejora obtenida.
- Costo de cambiar la llave.

Objetivo:

- Descubrir si el problema esta en la separacion.
- Descubrir si el problema esta en una regla gramatical.
- Descubrir si el problema esta en la romanizacion visual.

## Fase 6 - Traduccion candidata

La traduccion debe salir como texto, no como comentario.

Formato correcto:

1. Traduccion propuesta.
2. Lectura literal raiz por raiz.
3. Auditoria de soporte.
4. Zonas debiles.
5. Cambios sugeridos a la llave.

Formato prohibido:

- "El texto parece hablar de..."
- "Lectura oportunista..."
- "Podria tratarse de..."

Eso puede ir en auditoria, nunca en la traduccion.

## Fase 7 - Modo investigador

La app debe permitir revisar cada decision:

- Click en una frase traducida.
- Ver que unidades la sostienen.
- Ver que raices la sostienen.
- Ver fuentes externas.
- Ver partes visuales del DataSetCreator.
- Marcar una eleccion como aceptada, dudosa o rechazada.

Esto convierte el traductor en laboratorio, no en caja negra.

## Fase 8 - Preparacion academica

Para que esto aspire a algo serio:

- Versionar datasets.
- Congelar corridas.
- Guardar fuentes consultadas.
- Poder reproducir una traduccion.
- Separar hipotesis de evidencia.
- Generar reportes exportables.

Reporte final por parrafo:

- Imagen/pagina/parrafo.
- Romanizacion.
- Segmentacion.
- Traduccion.
- Tabla de raices.
- Fuentes.
- Reglas aplicadas.
- Incertidumbre.

## Fase 9 - Escala

Cuando el parrafo 2 de la pagina 1 funcione:

- Etiquetar otro parrafo conocido.
- Probar si la llave mantiene rendimiento.
- Si no mantiene rendimiento, introducir reglas locales.
- Medir si las reglas locales son sistematicas o excusas.

No se busca "probar todo" de entrada. Se busca construir un motor que pueda mejorar la llave y detectar cuando se esta mintiendo.

## Proxima implementacion

Orden recomendado:

1. Hacer que la app muestre una tabla clara de raices elegidas.
2. Separar traduccion de auditoria visualmente.
3. Agregar explorador de alternativas por unidad.
4. Agregar mutaciones controladas de romanizacion.
5. Agregar memoria de decisiones aceptadas/rechazadas.
6. Convertir la traduccion en un proceso de varias pasadas, no una sola corrida.

