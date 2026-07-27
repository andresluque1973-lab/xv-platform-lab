[Fase 25.md](https://github.com/user-attachments/files/30435333/Fase.25.md)
# FASE 25 — Implementación del Contrato RSVP v2
## Documento de cierre oficial

Versión: 1 · Cierra FASE 25 · Depende de: FASE 24 (`docs/Fase 24.md`, `docs/CONTRATO_RSVP_V2.md`) · Modifica: Apps Script `VELA-RSVP-v1`, `src/templates/P1.jsx`, `src/templates/P2.jsx`, `src/templates/P3.jsx` · Modifica documentación: `docs/CONTRATO_RSVP_V2.md` (aclaración, sin cambio de versión)

---

## 1. Objetivo cumplido

Implementar y validar el Contrato RSVP v2, diseñado y aprobado en FASE 24, sobre el Apps Script real y sobre los tres templates que debían migrar (P1, P2, P3). S1 permanece en su ruta legacy, sin modificación, tal como cerró FASE 24. Implementación incremental, con validación funcional en Preview Deployment después de cada paso, siguiendo el protocolo obligatorio completo (Análisis → Riesgos → Alternativas → Recomendación → Cambio mínimo → Impacto esperado → Esperando confirmación) en cada intervención.

## 2. Auditoría inicial de fase

Antes de iniciar el diseño técnico, se realizó clon fresco del repositorio (`git clone --depth 1` + `git fetch --unshallow`) y auditoría de los commits recientes, incluyendo inspección de PR #40 (`MAU-2-3-iniciacion`). Se confirmó que el diff real de `useConfig.js` y `AdminPage.jsx` en ese PR coincide exactamente con lo documentado en FASE 23 — sin scope creep hacia MAU-3.

**Hallazgo no documentado, fuera de alcance de esta fase:** `public/clientes/caracas/config.json` existe en `main` (traído por el mismo PR #40) con apariencia de cliente real (título, alias de regalo, `apps_script_url` y `sheet_id` reales), **sin estar registrado en `data/clientes/index.json`**. Por el contrato de `TemplateLoader.jsx` (lee `config.json` por slug directo, sin depender del registro), esto implica que, de estar desplegado, `/caracas` sería una invitación viva e invisible para el panel de administración. Andrés lo identificó como una prueba propia olvidada. **Decisión explícita: no se modifica en esta fase.** Su regularización (alta formal, eliminación o migración) queda diferida a MAU-3, cuando se aborde la fuente dinámica de registro de clientes.

## 3. Alcance aprobado

**Dentro de alcance de FASE 25:**
- Auditoría del código real del Apps Script (aportado directamente por Andrés, no versionado en este repositorio).
- Implementación de la rama `action=rsvp` en el Apps Script, aislada de la ruta legacy S1.
- Migración incremental de `P1.jsx`, `P2.jsx` y `P3.jsx` al vocabulario y dispatch del Contrato RSVP v2, uno por uno, con validación funcional en Preview Deployment entre cada paso.
- Registro de decisiones de producto asociadas al modelo de datos de `RSVP_VELA`.

**Fuera de alcance de FASE 25 (diferido explícitamente):**
- `action=getConfirmados` — no implementado en el Apps Script. P2/P3 lo invocan sin resultado; P1 invoca `action=list` (divergencia adicional detectada en esta fase, ver §6). Ambos casos quedan exactamente como estaban — ninguno se corrigió.
- Cualquier aplicación administrativa o de visualización sobre `RSVP_VELA` (mencionada como pertinente a una capa futura, decisión de producto registrada en §5).
- Regularización de `public/clientes/caracas/` (ver §2) — diferida a MAU-3.
- MAU-3 y MAU-4 — sin iniciar, sin relación de dependencia técnica con esta fase.

## 4. Implementación — Apps Script

Auditoría del código real (pegado directamente por Andrés en el chat) confirmó el mecanismo exacto del bug ya identificado en FASE 24: `doGet` usa `!p.code` como único gate entre health check y escritura legacy; P1/P2/P3 nunca envían `code`, por lo que caían siempre en el health check, sin error visible por `mode: "no-cors"`.

**Cambio mínimo implementado:** una única condición nueva al inicio de `doGet` (`if (p.action === "rsvp") return handleRsvpV2(p)`), evaluada antes del gate existente, que permanece sin modificar. Dos funciones nuevas, sin relación con el código legacy:

- `handleRsvpV2(p)` — valida `sheet_id`, `nombre` y `asistencia` de forma estricta: si `nombre` viene vacío, o `asistencia` no es exactamente `"si"`/`"no"`, la solicitud se rechaza (no se escribe fila, se registra el motivo en el log de ejecuciones, se responde `ok:false`). Decisión explícita de Andrés: preservar la integridad del vocabulario cerrado del contrato antes que aceptar valores fuera de él.
- `saveToSheetsV2(payload, sheetId)` — escribe en una hoja nueva `RSVP_VELA` (creada con headers si no existe), con columnas en mapeo 1:1 con el vocabulario de §5 del contrato, en el mismo orden, pensadas para no requerir remapeo en una futura fase de lectura.

`saveToSheets`, `doPost`, `RSVP_RESUMEN`, `RSVP_DETALLE`, `STATS`, `testManual()` — sin ninguna modificación. Se agregó `testManualV2()` como función de verificación aislada, sin tocar la existente.

**Aclaración incorporada a `CONTRATO_RSVP_V2.md`** (sin incrementar su versión formal, por tratarse de una aclaración estructural sin cambio de comportamiento — §9.3 del propio contrato): "Regla de estructura de dispatch" bajo §8 — toda `action` nueva se implementa como rama de código independiente, evaluada antes del fallback legacy, que nunca se modifica ni se reordena.

## 5. Decisiones de producto registradas durante la validación

- VELA continúa con RSVP individual por fila (una fila = un invitado). No se incorpora todavía el concepto de familias/grupos ni envíos múltiples por confirmación.
- `restricciones` permanece como campo string libre en el contrato (§5, sin cambio). La normalización a valores cerrados (ej. Celíaco/Vegano/Vegetariano/Otro + detalle libre) es una decisión de UI a nivel template, a implementarse en una iniciativa futura — no reabre el contrato.
- Las estadísticas y visualización de confirmados pertenecen a una futura capa de aplicación/administración sobre `RSVP_VELA`, no al Apps Script. El Apps Script se limita a escribir; no se le agrega ninguna lógica de agregación.

## 6. Migración de templates — incidencias y hallazgos

**P1** (`nombre` + `apellido` + `asistencia` + `restricciones` + `observaciones`, ya usaba `sheet_id` con clave `sheetId`): migrado primero. Validación inicial mostró que la confirmación no llegaba a `RSVP_VELA` pese a que `testManualV2()` funcionaba. Se aplicó protocolo de diagnóstico antes de tocar código: se determinó, con evidencia directa (respuesta HTTP real de una URL de diagnóstico pegada en el navegador, sin pasar por `no-cors`), que el deployment web público seguía sirviendo la versión anterior del Apps Script — `testManualV2()` no ejercita el deployment público, solo la lógica interna, por lo que no había detectado el problema. Resuelto actualizando la implementación (Implementar → Gestionar implementaciones → Nueva versión). Sin cambio de código adicional. Validado correctamente después.

Hallazgo adicional documentado, no corregido: `ConfirmadosSection` de P1 invoca `action=list`, mientras que P2 y P3 invocan `action=getConfirmados` — divergencia entre variantes del mismo producto, dentro de una capacidad ya fuera de alcance de v2. Queda registrada para cuando se aborde `action=getConfirmados`.

**P2** (`nombre` único, sin `apellido` ni `observaciones`; `asistencia` almacenada internamente como string legible, no como `"si"/"no"`): migrado con mapeo local de traducción (`"Sí, voy a estar"` → `"si"`, `"No voy a poder"` → `"no"`), sin alterar el estado de React. Validado sin incidencias. Se registra como diferencia funcional entre variantes del catálogo (no un defecto): P1 separa nombre/apellido y tiene observaciones; P2 no.

**P3** (mismo patrón exacto que P2, mismos literales de `asistencia`): migrado con el mismo diseño de diff. Validación mostró dos incidencias operativas, ninguna atribuible al contrato v2:
1. El deployment del Apps Script volvió a servir una versión anterior — mismo patrón que en P1, resuelto de la misma forma (actualizar implementación). Se deja registrado como riesgo operativo recurrente: toda edición futura del Apps Script requiere verificar explícitamente que el deployment público fue actualizado, no asumir que guardar el código alcanza.
2. El `config.json` de prueba de P3 no tenía el campo obligatorio `titulo` — el Contrato Ejecutable de Configuración (MAU-1) lo rechazó correctamente antes de renderizar. Corregido agregando el campo al config de prueba. Esto confirma que MAU-1 sigue funcionando como fue diseñado; no es un hallazgo de esta fase, es una validación incidental de una fase anterior.

## 7. Decisiones cerradas — NO REABRIR

- El Contrato RSVP v2 queda implementado para P1, P2 y P3. S1 no fue tocado.
- El mecanismo de dispatch por `action`, con la regla de estructura agregada a `CONTRATO_RSVP_V2.md` §8, es la forma oficial de agregar capacidades futuras al Apps Script.
- `RSVP_VELA` es la fuente de verdad de datos del contrato v2. `RSVP_RESUMEN`/`RSVP_DETALLE`/`STATS` siguen siendo exclusivamente del flujo legacy S1.
- La validación estricta de `nombre` y `asistencia` en `handleRsvpV2` (rechazo sin escritura ante valores faltantes o fuera de vocabulario) es la política oficial de integridad de datos del contrato v2.
- `public/clientes/caracas/` no se modifica en esta fase — su tratamiento es exclusivamente de FASE MAU-3.
- La divergencia `action=list` (P1) vs. `action=getConfirmados` (P2/P3) queda documentada, no corregida.

## 8. Changeset aplicado

```
Apps Script VELA-RSVP-v1               ← action=rsvp, handleRsvpV2, saveToSheetsV2, RSVP_VELA, testManualV2
src/templates/P1.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
src/templates/P2.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
src/templates/P3.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
docs/CONTRATO_RSVP_V2.md               ← aclaración de estructura de dispatch bajo §8, sin cambio de versión
docs/Fase 25.md                        ← nuevo, este documento
docs/ESTADO_OFICIAL_PROYECTO.md        ← v15, sección 28 incorporada
Instrucciones maestras del proyecto    ← actualizadas a versión FASE 25
```

Ningún otro archivo de `src/`, `data/` o `public/` fue modificado durante esta fase.

## 9. Estado final de la fase

**FASE 25 — CERRADA.** Contrato RSVP v2 implementado y validado en Preview Deployment para P1, P2 y P3. Apps Script actualizado en producción (mismo deployment usado por todos los clientes).

**Próximo paso**: dos líneas de trabajo independientes, no iniciadas, a definir cuál se aborda primero en un chat nuevo con auditoría de código real:
1. Implementación de `action=getConfirmados` (incluye resolver la divergencia de P1 con `action=list`) y, eventualmente, una aplicación administrativa sobre `RSVP_VELA`.
2. MAU-3 — Fuente Dinámica de Registro de Clientes (incluye la regularización de `public/clientes/caracas/`).
