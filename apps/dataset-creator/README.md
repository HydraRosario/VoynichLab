# DataSetCreator

Herramienta local de VoynichLab para etiquetar las particulas visuales del
manuscrito y materializar la jerarquia canonica `particula → atomo → molecula`
en SQLite.

DataSetCreator activo usa esquema V3. Se niega a abrir directamente una base
historica V2: primero debe migrarse a un archivo separado con el script
registrado en `scripts/README.md` y validarse antes de cualquier activacion.

## Flujo operativo

1. Abrir la app con `Abrir DataSetCreator.cmd`.
2. Crear o seleccionar una familia de particulas desde la tabla lateral.
3. Pintar cada aparicion real sobre el lienzo.
4. Guardar la familia base y su `structural_config`.
5. Rust sincroniza cada trazo como `particle` y calcula longitud, angulo, cantidad de puntos, ancla y bounds.
6. Cada cambio relevante dispara `recalculate_molecules`.
7. El backend recalcula:
   - `atoms`: grupos de particulas unidos por contacto.
   - `molecules`: secuencias de atomos ordenadas en renglones.
   - auditorias de gaps, enlaces, renglones y firmas estructurales.
8. El canvas dibuja de forma pasiva las cajas calculadas y permite corregir orden, renglones, cortes/uniones y fusiones desde la auditoria.

## Correccion asistida

- `molecule_gap_overrides` guarda cortes y uniones manuales entre atomos vecinos.
- `atom_row_guides` guarda guias de renglones ajustadas desde el canvas.
- `atom_particle_order_patterns` aprende el orden de particulas dentro de atomos.
- `molecule_atom_order_patterns` aprende el orden de atomos dentro de moleculas.
- `atom_merge_patterns` aprende fusiones recurrentes entre atomos.

## Persistencia

La base local vive en el directorio de datos de la app Tauri. Las tablas operativas son:

- `images`
- `regions`
- `labels`
- `particles`
- `atoms`
- `molecules`
- `molecule_gap_overrides`
- `atom_row_guides`
- `atom_particle_order_patterns`
- `molecule_atom_order_patterns`
- `atom_merge_patterns`
- `nomenclature_id_map`

## Fuera del flujo

- Exportaciones manuales de evidencia.
- Bboxes dibujados o mantenidos a mano en frontend.
- Votos de exclusion entre particulas.
- Lectura romanizada o traduccion textual.
