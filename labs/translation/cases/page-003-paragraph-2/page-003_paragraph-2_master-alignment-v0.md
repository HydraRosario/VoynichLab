# Page 003 / Paragraph 2 - Alineamiento V0 con traduccion del maestro

Objetivo: comparar las 23 unidades romanizadas contra la traduccion completa del maestro.

Esta tabla NO afirma que el alineamiento sea correcto. Es el primer mapa de trabajo.

## Romanizacion del parrafo

| # | romanizacion | segmentacion V2 | posible campo semantico desde traduccion |
| ---: | --- | --- | --- |
| 1 | `ohorahiirime` | `o|hora|crime` | llegada / ciclo / piedra que vuela / falta-peligro |
| 2 | `hetraheteoa` | `hetra|he|teoa` | metales que hablan / codigo |
| 3 | `hlaolmethotra` | `laol|met|otra` | asentamiento / cordillera / Amerk |
| 4 | `ohrahorahiirime` | `ora|hora|crime` | piedras que vuelan / monjes dentro |
| 5 | `hetecrime` | `hete|crime` | peligro / piedra peligrosa / metal peligroso |
| 6 | `hlaolmethohimirriaa` | `laol|meto|imir|ria` | tunicas/sotanas / irlandes / monjes |
| 7 | `heteohorahiirimehra` | `heteo|hora|cri|mera` | codigo Avatar/Awata / procedencia |
| 8 | `hrahetehtra` | `rae|tetra` | lugar en peligro de extincion |
| 9 | `heteohorahra` | `heteo|hora|ra` | gancho que cura |
| 10 | `ololhateohra` | `olola|teora` | calor invisible / elevar en el aire |
| 11 | `olaolhateoa` | `olaol|hate|oa` | silencio / peligrosidad / hostilidad |
| 12 | `hatehtluoltra` | `ate|tluol|tra` | cabello largo / cabeza |
| 13 | `ocrinehatehra` | `o|crine|atera` | padres del tiempo |
| 14 | `horahinirriaa` | `hora|inir|ria` | padres del fin del tiempo |
| 15 | `hateoirime` | `ateo|ir|ime` | nacimiento de lider |
| 16 | `loliocrima` | `loli|o|crima` | estudio de composicion organica |
| 17 | `horahimirrii` | `ora|hi|mirrii` | hidrocarburos / cadena |
| 18 | `hetoh` | `eto` | huevo |
| 19 | `tlolmehtoa` | `tlolme|toa` | cria nacida / cubierta de hidrocarburos |
| 20 | `heteohorahra` | `eteo|hora|ra` | transformacion en hombre / envejecimiento |
| 21 | `horahinirrii` | `hora|hi|nirrii` | hombre anciano / clima |
| 22 | `oirine` | `oi|rine` | gases / vibraciones / vientos |
| 23 | `lhaoltohorahra` | `laol|to|hora|ra` | ollas / utensilios de barro |

## Problemas cientificos inmediatos

1. La traduccion tiene mas conceptos que unidades romanizadas.
2. Si el alineamiento es uno-a-uno, cada unidad codifica una frase muy comprimida.
3. Si no es uno-a-uno, necesitamos saber que parte exacta de la traduccion corresponde al parrafo etiquetado.
4. Las raices fuertes encontradas automaticamente (`crime`, `hate`, `hete`, `hora`) no alcanzan por si solas para explicar "hidrocarburos", "monjes", "metal", "codigo", "clima", etc.
5. Entonces la tecnica real de separacion del maestro probablemente usaba conocimiento etimologico externo que todavia no esta en nuestro buscador.

## Nueva direccion

La tarea ya no es solo buscar raices palabra por palabra.

Necesitamos reconstruir la llave del maestro:

- que segmento romanizado produce "piedra que vuela"
- que segmento produce "metal que habla"
- que segmento produce "codigo Avatar/Awata"
- que segmento produce "gancho que cura"
- que segmento produce "padres del tiempo"
- que segmento produce "hidrocarburos"
- que segmento produce "dios del clima"

Sin ese alineamiento, la traduccion completa sirve como objetivo, pero no como entrenamiento directo.
