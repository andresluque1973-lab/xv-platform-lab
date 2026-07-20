# CONTRATO RSVP v2 — Comunicación Frontend ↔ Apps Script

Versión del documento: **1**
Fecha de aprobación: **2026-07**
Ubicación: `docs/CONTRATO_RSVP_V2.md`
Estado: **Diseño cerrado — implementación no iniciada**

---

## §1 Propósito

Este documento define el contrato de comunicación entre los templates de VELA
que recopilan confirmaciones de asistencia (RSVP) y el Apps Script que las
escribe en Google Sheets.

Es la fuente de verdad de qué parámetros se envían, qué valores son válidos,
cómo se determina la operación solicitada, y qué garantías de compatibilidad
existen respecto de la implementación fundacional (S1).

---

## §2 Naturaleza del documento

Este documento tiene dos partes de naturaleza distinta, y no deben
confundirse:

- **Contrato normativo** (§4 a §11): define el comportamiento esperado del
  protocolo RSVP — vocabulario, valores, dispatch, y las reglas de
  compatibilidad y evolución que lo gobiernan. Es de cumplimiento
  obligatorio para cualquier implementación, presente o futura.
- **Guía de migración** (§13): describe una secuencia sugerida de pasos para
  llevar la implementación actual a cumplir este contrato. Es informativa,
  no normativa. Puede reordenarse, ajustarse o reemplazarse por completo sin
  que eso constituya un cambio de versión del contrato — a diferencia de un
  cambio en §4 a §11, que si está sujeto a la definición formal de versión
  de §9.

---

## §3 Origen — hallazgos de auditoría

Este contrato surge de una auditoría de código realizada tras detectar que
un cliente nuevo generado con template P1 no lograba registrar sus
confirmaciones en Google Sheets, pese a usar el mismo `apps_script_url` que
un cliente S1 funcional (`andres`). La auditoría, hecha exclusivamente sobre
evidencia de código real (templates y Apps Script en producción), encontró:

1. **El Apps Script usa la presencia del parámetro `code` como única señal
   para distinguir un health check de un envío real.** Como P1/P2/P3 nunca
   envían `code`, sus confirmaciones eran descartadas antes de intentar
   escribir en Sheets — sin ningún error visible, porque el frontend usa
   `fetch` con `mode: "no-cors"` y no puede leer la respuesta.
2. **S1, P1 y P2/P3 usan tres esquemas de parámetros mutuamente
   incompatibles** para representar el mismo concepto (confirmación de un
   invitado): nombres de campo distintos, y en el caso de `asistencia`,
   también valores literales distintos entre sí (`"Confirmo"` en S1/P1 vs.
   `"Sí, voy a estar"` en P2/P3).
3. **El identificador de la planilla destino se envía con dos claves
   distintas**: `sheetId` (S1, P1) vs. `sheet_id` (P2, P3).
4. **`SpreadsheetApp.openById(sheetId)` ya funciona de forma genérica** —
   el Apps Script no tiene ninguna planilla hardcodeada; el ruteo
   multicliente ya existe en la práctica, aunque nunca se haya declarado
   como tal.
5. **P2 y P3 ya invocan `action=getConfirmados`** (lectura de confirmados)
   contra un endpoint que el Apps Script actual no implementa. Se documenta
   como hallazgo; queda fuera del alcance de este contrato (ver §11).

---

## §4 Alcance

Este contrato cubre exclusivamente los templates que escriben confirmaciones
en Google Sheets vía Apps Script: **S1, P1, P2 y P3**.

S2 y S3 confirman asistencia mediante un enlace de WhatsApp, según su
contrato de producto (`PRODUCTOS.md` §3.2). No tienen flujo de escritura a
Sheets hoy, y este documento no se lo agrega. Incorporar esa capacidad a
STANDARD es una decisión de producto independiente, no una consecuencia de
este contrato.

**S1 no migra a este contrato.** Su implementación actual (vocabulario
`code`/`g{n}_name`/etc.) permanece sin modificaciones, por tratarse de un
flujo en producción con datos reales de eventos aún no realizados. Ver §7.

---

## §5 Vocabulario canónico de campos — Contrato v2

Los siguientes son los únicos campos válidos del contrato v2. Todo template
que lo adopte (P1, P2, P3, y cualquier variante futura que se sume
explícitamente) debe usar exactamente estos nombres, en `snake_case`,
consistente con la convención ya establecida en `config.json`
(`REQUIRED_FIELDS`, MAU-1).

### Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `sheet_id` | string | ID de la planilla destino. Usado para ruteo (`SpreadsheetApp.openById`), no se almacena como columna de dato de invitado. |
| `nombre` | string | Nombre del invitado. |
| `asistencia` | string | Confirmación de asistencia. Valores válidos: `"si"` \| `"no"` — ver §6. |

### Campos opcionales

| Campo | Tipo | Descripción |
|---|---|---|
| `apellido` | string | Apellido del invitado. |
| `restricciones` | string | Restricciones o requerimientos alimentarios. Nombre único — reemplaza `restricciones_alimentarias` (P1 actual) y `restriccion` (P2/P3 actual), que son el mismo concepto con nombres distintos. |
| `observaciones` | string | Mensaje libre u observaciones adicionales. |

### Campos reservados para versiones futuras

Ninguno en v2. La extensión del vocabulario no se resuelve agregando
columnas o campos silenciosos a esta versión — se resuelve declarando una
versión nueva del contrato según la definición formal de §9. No hay
creación dinámica de columnas ni de campos: cualquier campo nuevo requiere
actualizar primero este documento y luego el Apps Script, deliberadamente,
en ese orden.

---

## §6 Normalización de valores — `asistencia`

Los templates que envíen el contrato v2 deben enviar `asistencia` como texto
plano fijo: `"si"` o `"no"`. No se aceptan variantes de redacción propias de
cada template (`"Confirmo"`, `"Sí, voy a estar"`, etc.) — esa traducción a
un label legible para humanos ocurre del lado del Apps Script al momento de
escribir en la planilla, no en el parámetro que viaja por la URL.

Esta decisión es deliberada: normalizar por coincidencia de texto o palabra
clave (ej. "empieza con S") introduciría de nuevo un criterio implícito,
exactamente el tipo de ambigüedad que originó el hallazgo de §3.

---

## §7 Compatibilidad con S1 (legacy)

El Apps Script preserva, sin modificaciones, la ruta completa de S1: el
mismo vocabulario de parámetros (`code`, `timestamp`, `ip`, `guestCount`,
`sheetId`, `g{n}_name`, `g{n}_surname`, `g{n}_attending`, `g{n}_diet`,
`g{n}_song`), la misma lógica de escritura (`RSVP_RESUMEN`, `RSVP_DETALLE`,
`STATS`), y el mismo comportamiento observable para los clientes ya en
producción (`andres`, `sofia`, `valentina`).

Ningún cliente S1 existente requiere ninguna acción como consecuencia de
este contrato.

---

## §8 Mecanismo de dispatch — parámetro `action`

El Apps Script determina la operación solicitada exclusivamente por el
parámetro explícito `action`. No se infiere el tipo de operación por la
presencia o ausencia de otros parámetros, salvo el caso legacy descrito
abajo, que es un default acotado y documentado, no una inferencia abierta.

| Condición | Operación |
|---|---|
| Sin parámetros, o `action=health` | Health check (comportamiento actual, sin cambios) |
| `action=rsvp` | Escritura, Contrato v2 (§5) |
| Parámetros presentes, sin `action` reconocido | Ruta legacy S1 (§7) — preservada porque S1 nunca envía `action` |

`action=getConfirmados` queda fuera de este contrato (§11).

### Inmutabilidad semántica de `action`

Cada valor de `action` constituye una **capacidad pública** del protocolo
RSVP. Una vez publicado, su semántica no puede modificarse retroactivamente:
ni el conjunto de parámetros que acepta, ni el comportamiento que produce,
ni el significado de sus valores. Cualquier cambio de comportamiento para
una operación ya publicada requiere un `action` nuevo, nunca una
reinterpretación silenciosa del existente. Esta regla es la aplicación
concreta, a nivel de `action`, del principio de compatibilidad de §9.

---

## §9 Principios de evolución y compatibilidad del contrato

### §9.1 No ruptura de clientes desplegados

Ninguna evolución de este contrato puede romper clientes ya desplegados.
Toda versión nueva del contrato debe coexistir con la anterior hasta que la
migración de los clientes existentes a la versión nueva se complete. No se
retira soporte de una versión por la sola existencia de una versión
posterior — se retira cuando ya no hay clientes activos dependiendo de ella.

### §9.2 Manejo de campos desconocidos

Los consumidores de este contrato (el Apps Script, y cualquier proceso que
lea su salida) deben **ignorar** cualquier campo desconocido que pertenezca
a una versión futura del contrato, en vez de rechazarlo o fallar. Nunca debe
**reinterpretarse** el significado de un campo existente — un campo con un
nombre dado conserva su tipo y su semántica en todas las versiones donde
aparece; si su significado necesita cambiar, eso constituye por definición
una versión nueva del contrato (§9.3), no una reinterpretación del campo
actual.

### §9.3 Definición formal de versión

Una nueva versión del Contrato RSVP se crea **únicamente** cuando ocurre
alguna de estas dos condiciones:

1. **Existe un cambio incompatible con la versión anterior** — por ejemplo,
   redefinir el significado o el tipo de un campo o valor ya existente, o
   eliminar un campo obligatorio sin período de coexistencia (§9.1).
2. **Se incorpora una nueva capacidad mediante un `action` nuevo** —
   consistente con la regla de una capacidad por acción (§10).

Ajustes de redacción, aclaraciones, o correcciones editoriales sobre este
documento que no cambien ninguna decisión funcional — como los que dieron
origen a esta misma revisión — no constituyen una nueva versión.

---

## §10 Regla de arquitectura — una capacidad por acción

Cada valor de `action` en el Apps Script constituye una capacidad
independiente del contrato RSVP. No se incorporan acciones nuevas
(`action=...`) dentro de una iniciativa cuyo objetivo principal sea otra
capacidad, salvo que sean estrictamente necesarias para cumplir el contrato
aprobado en ese momento.

---

## §11 Explícitamente fuera de alcance de v2

- **`action=getConfirmados`** (lectura de confirmados, ya invocada por
  P2/P3 contra un endpoint inexistente). Es una capacidad de lectura
  distinta de la de escritura que cubre este contrato. Queda documentada
  como gap detectado en la auditoría (§3, punto 5), pendiente de su propio
  diseño y validación.
- **Creación dinámica de columnas o campos.** Decisión explícita: el
  vocabulario es fijo y versionado (§5, §9.3), no generado en tiempo de
  ejecución.
- **Migración de S2/S3 a un flujo de Sheets.** Es una decisión de producto,
  no de este contrato técnico (§4).
- **Alineación de S1 con este contrato.** Registrada como divergencia
  histórica en `PRODUCTOS.md` §6; su resolución (si alguna vez se decide)
  es una iniciativa aparte.

---

## §12 Almacenamiento en Sheets

Hoja nueva `RSVP_VELA`, con columnas fijas correspondientes 1 a 1 con el
vocabulario de §5. Sin relación con `RSVP_RESUMEN`, `RSVP_DETALLE` ni
`STATS`, que pertenecen exclusivamente a la ruta legacy de S1 (§7).

---

## §13 Guía de migración (no normativa)

*Esta sección es informativa — ver §2. Describe una secuencia sugerida para
la fase de implementación, no forma parte del contrato en sí.*

1. Modificar el Apps Script en un único cambio: corrección del gate de
   health check + implementación de `action=rsvp` (Contrato v2). La ruta
   legacy de S1 no se toca.
2. Migrar `P1.jsx`, `P2.jsx` y `P3.jsx` para que envíen el vocabulario y los
   valores definidos en §5 y §6, con `action=rsvp` explícito.
3. Validar en Preview Deployment con un cliente de prueba por variante
   (P1, P2, P3) antes de tocar cualquier cliente real.
4. S1 no participa de ningún paso de esta migración.

Esta fase no está abierta todavía. Se abre formalmente una vez que este
documento quede aprobado y registrado en `ESTADO_OFICIAL_PROYECTO.md`.

---

## §14 Relación con otros documentos del sistema

| Documento | Relación con este contrato |
|---|---|
| `PRODUCTOS.md` §4.3, §4.5 | Define el "Formulario integrado de confirmación" como capacidad de producto PREMIUM y su schema de captura. Este documento define el contrato de transporte técnico que implementa esa capacidad — no redefine el producto. |
| `PRODUCTOS.md` §6 | Registra la divergencia histórica de S1 que motiva por qué S1 queda fuera de este contrato (§7 de este documento). |
| `src/hooks/useConfig.js` (Contrato Ejecutable, MAU-1) | Gobierna la validez de `config.json` — incluye `sheet_id` y `apps_script_url` como campos requeridos para P1/P2/P3. Este contrato gobierna lo que ocurre *después* de que esos campos ya son válidos: cómo se usan en tiempo de ejecución. |
| Apps Script (`VELA-RSVP-v1`, fuera de este repositorio) | Implementación del lado servidor de este contrato. No versionado en este repo — su código vive en `script.google.com`. |

---

## §15 Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1 | 2026-07 | Definición inicial. Vocabulario canónico, normalización de valores, mecanismo de dispatch, principios de compatibilidad y evolución (§9), separación explícita entre contrato normativo y guía de migración (§2). Diseño cerrado, implementación diferida. |
