# Applications
VoynichLab applications are interfaces over different stages of the research
process. They do not have the same publication status.

| Application | Audience | Role |
|---|---|---|
| `portal/` | Public | Explains selected evidence from the registry and public artifacts |
| `qc-review/` | Maintainers | Reviews anomaly candidates before a future corpus freeze |

The portal never reads local DatasetCreator databases or scratch outputs.
QC Review is an internal audit surface, not a second public portal.
