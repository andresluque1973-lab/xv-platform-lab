# Fase 19 — Auditoría arquitectónica con foco operativo

**Estado:** CERRADA — ETAPA DE DESCUBRIMIENTO Y CONSOLIDACIÓN
**Fecha de cierre:** Julio 2026
**Resultado:** Mapa de riesgos arquitectónico consolidado. Ninguna implementación aprobada.

---

## Objetivo

Con el catálogo comercial completo (FASE 18), el objetivo del proyecto deja de ser
construir nuevas variantes y pasa a ser preparar VELA para operar decenas o
cientos de eventos simultáneos sin aumento proporcional de complejidad de
mantenimiento. FASE 19 no construye código: es una auditoría del repositorio
completo (`xv-platform-lab`) desde la perspectiva de escalabilidad operativa,
no desde la perspectiva de templates.

---

## Alcance auditado

Registro de clientes (`data/clientes/index.json` + `CONTRATO.md`), capa de
resolución técnica (`templateRegistry.js`, `TemplateLoader.jsx`), catálogo
comercial (`data/catalogo/templates.js`, `PRODUCTOS.md`), schema de
`config.json` de clientes reales (sofia, valentina, andres, prueba), flujo
RSVP (`ConfirmSection.jsx` + variantes en P1/P2/P3), herramienta de onboarding
(`AdminPage.jsx`, `AdminShell.jsx`), deploy (`vercel.json`), modelo de dominio
(Evento/Cliente/Plan/Template/Configuración/Plataforma) y modelo de datos.

**Metodología**: aislamiento empírico contra el repositorio real (no
especulación desde memoria de fase). Cada hallazgo estructural fue verificado
en código antes de registrarse.

---

## Fortalezas arquitectónicas confirmadas (preservar)

- Separación `templateRegistry.js` / catálogo comercial — frontera mejor
  definida del sistema, sin fricción en 6 variantes.
- Patrón de archivo único autocontenido por template — escaló limpiamente de
  1 a 6 variantes sin abstracción prematura.
- Ortogonalidad Familia × Tier — consistente en las 6 implementaciones.
- Disciplina de contratos documentados (`CONTRATO.md` de clientes y
  catálogo) — especificación madura; el problema identificado es de
  enforcement, no de la especificación en sí.
- Metodología de fases cerradas sin reapertura — cero drift conceptual en la
  capa visual a lo largo de 18 fases.

---

## Temas arquitectónicos identificados

Consolidados en `docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md` (documento de
referencia completo). Síntesis:

| Tema | Descripción | Clasificación |
|---|---|---|
| A | Ausencia de capa de validación de datos entre creación y consumo de `config.json` | 🔴 Resolver antes de Owner Tool |
| B | Fallos silenciecos por diseño — fallback `TemplateLoader`→S1 y RSVP `no-cors` asumido como éxito. Impacto no equivalente entre ambos componentes (ver documento completo) | 🔴 Resolver antes de Owner Tool |
| C | Registro de clientes (`index.json`) embebido en bundle JS — requiere rebuild+redeploy para cualquier alta | 🔴 Resolver antes de Owner Tool |
| D | `AdminPage.jsx` solo genera schema STANDARD; no cubre contrato PREMIUM §4.5 | 🔴 Resolver antes de Owner Tool |
| E | Exposición pública de `apps_script_url`/`sheet_id` en `config.json` bajo `public/` — explotabilidad real depende de configuración de Apps Script no auditada | 🔵 Mejora inmediata (revisión, no remediación estructural) |
| F | Modelo de dominio: Cliente/Evento fusionados, `config.json` sobrecargado con 5 responsabilidades | 🟢 Puede esperar — no es deuda activa contra el modelo comercial vigente |
| G | Slug como única integridad referencial entre 3 capas desacopladas | 🟡 Deuda aceptable — subsumido en Tema A |
| H | Sin punto de integración para CI/validación automatizada | 🟡 Deuda aceptable — consecuencia de resolver Tema A |
| I | Ausencia de estado dinámico propio de plataforma (sin DB, RSVP vive solo en Sheets) | 🟢 Puede esperar — disparador: autoservicio, no volumen de clientes |

**Corrección registrada durante la auditoría**: el estado `"proximamente"` de
S3/P1/P2/P3 en `data/catalogo/templates.js` **no es documentation drift**.
Es consistente con §5.3 de `PRODUCTOS.md`, que exige validación funcional en
producción (no solo en Preview) para el estado `disponible`. El catálogo está
comercialmente completo; no todas sus variantes están formalmente
`disponible` bajo el criterio técnico vigente. Ambas afirmaciones son
correctas y no se contradicen.

---

## Decisiones cerradas — NO REABRIR

- Ninguna implementación fue aprobada durante FASE 19. La auditoría es
  puramente de descubrimiento.
- Los cuatro temas 🔴 (A, B, C, D) quedan registrados como bloqueantes
  conceptuales de la futura FASE de Owner Tool, no como trabajo en curso.
- El Tema F (modelo de dominio Cliente/Evento) queda explícitamente
  documentado como NO deuda activa — es coherente con el alcance vigente del
  producto. No debe interpretarse como pendiente de refactor.
- La priorización entre los temas 🔴 y cualquier decisión de intervención
  quedan diferidas a una fase posterior específica, siguiendo el protocolo
  obligatorio del proyecto.

---

## Documento de referencia

`docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md` — informe ejecutivo completo,
con evidencia de repositorio, riesgos de escala y justificación de
clasificación por tema. Este documento (`Fase 19.md`) es su resumen de
cierre; el informe completo es la fuente de detalle.

---

## Changeset aplicado

```
docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md  ← nuevo, informe completo de auditoría
docs/Fase 19.md                                ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md                ← v10, sección 19 incorporada
```

No hay cambios de código fuente en este changeset. FASE 19 es exclusivamente
documental.
