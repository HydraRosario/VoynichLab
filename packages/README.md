# Shared Packages
Shared repository infrastructure lives here. Packages may validate, export, or
connect research records, but they must not redefine scientific results.

| Package | Role |
|---|---|
| `lab-exporter/` | Validates the registry, prepares public artifacts, builds portal data, and audits repository boundaries |

The exporter does not commit, tag, push, or mutate frozen source evidence.
