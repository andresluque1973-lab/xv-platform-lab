[Fase 26.md](https://github.com/user-attachments/files/30488902/Fase.26.md)
# FASE 26 — Implementación de `action=getConfirmados` (extensión del Contrato RSVP v2)

Estado: **CERRADA**
Fecha de cierre: 2026-07-29

---

## 1. Objetivo de la fase

Incorporar una capacidad de lectura de confirmaciones (`action=getConfirmados`) para P1, P2 y P3, unificando tres contratos de lectura hoy mutuamente incompatibles (`action=list` en P1 vs. `action=getConfirmados` en P2/P3, con shapes de respuesta y vocabularios de `asistencia` distintos entre sí), sin modificar la ruta de escritura validada en FASE 25 ni el flujo legacy de S1.

Encuadre explícito: **extensión del Contrato RSVP v2 ya vigente** (nueva capacidad vía `action` nuevo, sobre el mismo mecanismo de dispatch aprobado en FASE 24/25) — no constituye una nueva versión formal del contrato, por decisión explícita de Andrés. `action=rsvp` no fue modificado.

---

## 2. Auditoría inicial de fase

Clon fresco del repositorio. Confirmado por lectura directa de código:

- **Divergencia de lectura P1 vs. P2/P3**: distinto `action` (`list` vs. `getConfirmados`), distinto parámetro de sheet (`sheetId` sin guarda vs. `sheet_id` con guarda), distinto shape de respuesta (`{ confirmados: [...] }` vs. array plano), y distinto vocabulario de `asistencia` esperado en el filtro (P1 no filtraba; P2/P3 esperaban labels legibles legacy, no el vocabulario canónico `"si"/"no"`).
- **Hallazgo adicional, no documentado hasta esta fase**: bug interno en `P2.jsx` — el componente escribía `restricciones` (correcto, contrato v2) pero leía `c.restriccion` (singular) en el render de `ConfirmadosSection`. Inconsistencia propia del archivo, independiente de la divergencia entre templates.
- **Apps Script auditado como caja blanca** (código completo aportado por Andrés): confirmado que `RSVP_VELA` almacena `Asistencia` como `"Confirmo"`/`"No asiste"` (traducido en `handleRsvpV2` al escribir), no como `"si"`/`"no"`. Columnas confirmadas: `Timestamp | Nombre | Apellido | Asistencia | Restricciones | Observaciones`. Dispatch de `doGet` confirmado como extensible mediante rama hermana, sin reordenar lo existente.

Ver el detalle completo de ambas auditorías (frontend y Apps Script) en el historial de chat de FASE 26.

---

## 3. Decisiones arquitectónicas adoptadas

1. **No constituye nueva versión del contrato** — extensión del Contrato RSVP v2 vigente mediante `action` nuevo, mismo mecanismo de dispatch de §8.
2. **Alternativa A aprobada**: traducción inversa de `Asistencia` (`"Confirmo"→"si"`, `"No asiste"→"no"`) implementada únicamente dentro de `handleGetConfirmadosV2`, sin modificar `handleRsvpV2`, `saveToSheetsV2` ni los datos ya persistidos en `RSVP_VELA`.
3. **Backend expone únicamente vocabulario canónico** (`"si"`/`"no"`) — ningún texto de interfaz sale del servidor; la traducción a texto legible (`"Sí, voy a estar"`, etc.) es responsabilidad exclusiva del frontend.
4. **`Timestamp` queda fuera del contrato de lectura de esta fase** — no forma parte del vocabulario de §5, ningún template lo consume, no se agrega sin necesidad funcional real.
5. **Hoja `RSVP_VELA` inexistente o sin filas → HTTP 200, `[]`** — ausencia de confirmaciones no es un error del contrato.
6. **Contrato de respuesta**: éxito = array plano; error = `{ ok: false, error: "..." }`.
7. **Fuera de alcance explícito**: cualquier cambio funcional de producto — cada template sigue mostrando únicamente los campos que ya mostraba; esta fase unifica el contrato de transporte, no las interfaces.

---

## 4. Implementación realizada

### 4.1 Apps Script (`VELA-RSVP-v1`)

- Rama nueva en `doGet`: `if (p && p.action === "getConfirmados") return handleGetConfirmadosV2(p);` — hermana de la rama `action === "rsvp"` de FASE 25, evaluada en el mismo punto, antes del fallback legacy. Ningún código existente modificado.
- Función nueva `handleGetConfirmadosV2(p)`: valida `sheet_id`; si `RSVP_VELA` no existe o no tiene filas de datos, responde `[]`; si existe, lee el rango de datos, aplica la traducción inversa de `Asistencia`, y responde un array plano de `{ nombre, apellido, asistencia, restricciones, observaciones }`.
- `handleRsvpV2`, `saveToSheetsV2`, `doPost`, `saveToSheets`, `testManual()`, `testManualV2()` — sin modificación.

### 4.2 Frontend

- **`P1.jsx`** — `ConfirmadosSection.fetchConfirmados`: migrado de `action=list&sheetId=...` a `action=getConfirmados` + `sheet_id` (con guarda `|| ""`, corrigiendo el acceso sin guarda detectado en auditoría); parseo migrado de `data.confirmados` a array plano.
- **`P2.jsx`** — filtro de `asistencia` migrado de labels legacy (`"Sí, voy a estar"`/`"No voy a poder"`) a vocabulario canónico (`"si"`/`"no"`); corregido el bug interno `c.restriccion`→`c.restricciones` en el render.
- **`P3.jsx`** — filtro de `asistencia` migrado de label legacy (`"Sí, voy a estar"`) a vocabulario canónico (`"si"`).

Ningún cambio en la UI de ningún template: los campos mostrados y su disposición permanecen idénticos a antes de esta fase.

---

## 5. Archivos modificados

```
Apps Script VELA-RSVP-v1        ← nueva rama de dispatch action=getConfirmados, handleGetConfirmadosV2
src/templates/P1.jsx            ← ConfirmadosSection.fetchConfirmados migrado al contrato unificado
src/templates/P2.jsx            ← filtro de asistencia + corrección de c.restriccion → c.restricciones
src/templates/P3.jsx            ← filtro de asistencia migrado a vocabulario canónico
docs/Fase 26.md                 ← nuevo, este documento
docs/ESTADO_OFICIAL_PROYECTO.md ← v16, sección de FASE 26 incorporada
Instrucciones maestras          ← actualizadas a versión FASE 26 (fuera del repositorio de código)
```

`handleRsvpV2`, `saveToSheetsV2`, `doPost`, `saveToSheets`, S1, `CONTRATO_RSVP_V2.md` — sin modificación en esta fase.

---

## 6. Validaciones ejecutadas (reportadas por Andrés)

- Apps Script desplegado en nueva versión del Web App.
- `action=getConfirmados` validado directamente desde el navegador — devuelve array plano.
- Vocabulario `asistencia` confirmado como `"si"`/`"no"` (traducción inversa funcionando).
- Escritura (`action=rsvp`) confirmada sin regresión — las confirmaciones continúan registrándose en `RSVP_VELA`.
- P1, P2 y P3 validados individualmente, sin regresiones visuales.

**No ejercitado en esta ronda de validación** (no bloquea el cierre, queda como nota): el caso `RSVP_VELA` inexistente o sin filas — los tres clientes usados en la validación ya tenían confirmaciones previas de FASE 25.

---

## 7. Resultados obtenidos

Las tres variantes PREMIUM consumen un contrato de lectura único, alineado 1:1 al vocabulario canónico de §5 del Contrato RSVP v2. Queda resuelta la divergencia `action=list` (P1) vs. `action=getConfirmados` (P2/P3) registrada como observación abierta desde FASE 25. Corregido, como efecto colateral necesario de la unificación, el bug interno de `P2.jsx` (`c.restriccion`).

---

## 8. Incidencias detectadas y resolución

| Incidencia | Origen | Resolución |
|---|---|---|
| Divergencia de tres capas entre P1 y P2/P3 en lectura (action, param, shape) | Detectada en auditoría de frontend | Unificada bajo Alternativa A |
| `c.restriccion` (P2) desalineado del campo que el propio componente escribe | Detectada en auditoría de frontend | Corregido en el render |
| `RSVP_VELA` almacena `Asistencia` como `"Confirmo"/"No asiste"`, no `"si"/"no"` | Detectada en auditoría de Apps Script (caja blanca) | Traducción inversa aislada en `handleGetConfirmadosV2`, sin tocar la ruta de escritura |
| `main` en GitHub, al momento del cierre documental, aún no refleja el código de esta fase | Verificación de cierre (clon fresco de `main`) | No arquitectónica — pendiente de confirmar que el merge al branch de FASE 26 hacia `main` esté completo antes de considerar el árbol de código sincronizado con esta documentación |

---

## 9. Decisiones cerradas — NO REABRIR

- El vocabulario de `Asistencia` persistido en `RSVP_VELA` (`"Confirmo"/"No asiste"`) no se modifica — la traducción vive exclusivamente en la capa de lectura.
- `Timestamp` no forma parte del contrato de lectura de FASE 26.
- `action=getConfirmados` es una extensión del Contrato RSVP v2, no una v3.
- Ninguna interfaz de ningún template fue rediseñada ni homogeneizada entre variantes.

---

## 10. Estado final de la fase

**FASE 26 CERRADA.** `action=getConfirmados` implementado y validado para P1, P2 y P3, bajo el mismo mecanismo de dispatch del Contrato RSVP v2. S1 y la ruta de escritura permanecen sin modificación. Sin desvíos arquitectónicos entre lo aprobado y lo implementado.

**Pendiente de tu confirmación administrativa** (no de código): que el merge del branch de FASE 26 a `main` esté completo.
