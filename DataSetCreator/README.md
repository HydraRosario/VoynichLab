# DataSetCreator

Herramienta local de VoynichLab para etiquetar trazos atomicos del manuscrito y materializar una estructura jerarquica en SQLite.

## Flujo operativo

1. Abrir la app con `Abrir DataSetCreator.cmd`.
2. Crear o seleccionar un patron atomico desde la tabla lateral.
3. Pintar cada aparicion real sobre el lienzo.
4. Guardar la familia base y su `structural_config`.
5. Rust sincroniza cada trazo como `atom` y calcula longitud, angulo, cantidad de puntos, ancla y bounds.
6. Cada cambio relevante dispara `recalculate_molecules`.
7. El backend recalcula:
   - `particles`: componentes internos formados por contacto atomico.
   - `molecules`: tokens formados por particulas ordenadas en renglones.
   - auditorias de gaps, enlaces, renglones y firmas estructurales.
8. El canvas dibuja de forma pasiva las cajas calculadas y permite corregir orden, renglones, cortes/uniones y fusiones desde la auditoria.

## Correccion asistida

- `molecule_gap_overrides` guarda cortes y uniones manuales entre particulas vecinas.
- `particle_row_guides` guarda guias de renglones ajustadas desde el canvas.
- `particle_order_patterns` aprende orden interno de atomos dentro de particulas.
- `molecule_order_patterns` aprende orden de particulas dentro de moleculas.
- `particle_merge_patterns` aprende fusiones recurrentes entre particulas.

## Persistencia

La base local vive en el directorio de datos de la app Tauri. Las tablas operativas son:

- `images`
- `regions`
- `labels`
- `atoms`
- `particles`
- `molecules`
- `molecule_gap_overrides`
- `particle_row_guides`
- `particle_order_patterns`
- `molecule_order_patterns`
- `particle_merge_patterns`

## Fuera del flujo

- Exportaciones manuales de evidencia.
- Bboxes dibujados o mantenidos a mano en frontend.
- Votos de exclusion entre atomos.
- Lectura romanizada o traduccion textual.
