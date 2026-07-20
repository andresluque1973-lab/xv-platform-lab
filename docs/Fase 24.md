[Fase 24.md](https://github.com/user-attachments/files/30172957/Fase.24.md)
# FASE 24 — Diseño y Aprobación del Contrato RSVP v2
## Documento de cierre oficial (fase de diseño — implementación diferida)

Versión: 1 · Cierra FASE 24 · Depende de: FASE 23 (`docs/Fase 23.md`) · Produce: `docs/CONTRATO_RSVP_V2.md`

---

## 1. Objetivo cumplido

Diseñar y aprobar un contrato único de comunicación entre los templates de VELA que escriben confirmaciones RSVP (S1, P1, P2, P3) y el Apps Script que las procesa, resolviendo la divergencia de esquemas detectada durante la validación funcional de FASE 23, sin implementar ningún cambio de código.

**FASE 24 fue una fase exclusivamente de diseño.** El entregable es `docs/CONTRATO_RSVP_V2.md`, aprobado como documento normativo. Ningún archivo de código —ni del repositorio ni del Apps Script— fue modificado durante esta fase.

## 2. Origen — hallazgo trasladado desde FASE 23

Durante la validación funcional de MAU-2 (FASE 23), un cliente de prueba con template P1 no registraba sus confirmaciones en Google Sheets pese a usar el mismo `apps_script_url` que un cliente S1 funcional (`andres`). La investigación, basada exclusivamente en evidencia de código (templates reales del repositorio y el Apps Script real, aportado por Andrés), se registra en detalle en `docs/CONTRATO_RSVP_V2.md` §3. Se determinó que la causa era ajena al Generador (MAU-2) y correspondía a una capa arquitectónica distinta — el contrato de comunicación entre frontend y Apps Script — motivando esta fase independiente.

## 3. Alcance aprobado

**Dentro de alcance de FASE 24**:
- Auditoría comparativa del payload real enviado por cada template que usa Apps Script (S1, P1, P2, P3).
- Auditoría del código real del Apps Script en producción (`VELA-RSVP-v1`).
- Diseño de un vocabulario canónico de campos único para el contrato nuevo.
- Definición de principios de compatibilidad y evolución del contrato (no ruptura de clientes desplegados, manejo de campos desconocidos, inmutabilidad semántica de `action`, definición formal de versión).
- Redacción y aprobación de `docs/CONTRATO_RSVP_V2.md` con el mismo nivel de formalidad que `PRODUCTOS.md`.

**Fuera de alcance de FASE 24**:
- Cualquier modificación del Apps Script.
- Cualquier modificación de `P1.jsx`, `P2.jsx`, `P3.jsx` o `standard1/sections/ConfirmSection.jsx`.
- Corrección del gate de health check del Apps Script — evaluada como bug aislado de bajo riesgo, pero explícitamente diferida para no dejar un Apps Script en producción en un estado intermedio (ver §5).
- `action=getConfirmados` (lectura de confirmados) — gap detectado durante la auditoría, documentado como fuera de alcance en `CONTRATO_RSVP_V2.md` §11.
- Migración de S2/S3 a un flujo de escritura en Sheets — decisión de producto independiente.
- Alineación de S1 al contrato nuevo — S1 permanece en su implementación actual, sin cambios, por tratarse de un flujo en producción con datos reales de un evento aún no realizado.

## 4. Hallazgos de auditoría incorporados al diseño

- El Apps Script usa la presencia del parámetro `code` como único gate entre health check y escritura real — no un esquema de campos incompatible en sí mismo. P1/P2/P3 nunca envían `code`, por lo que sus confirmaciones eran descartadas antes de `saveToSheets`, sin ningún error visible (`fetch` con `mode: "no-cors"`).
- S1, P1 y P2/P3 usan tres esquemas de parámetros mutuamente incompatibles, incluyendo valores literales distintos para `asistencia` (`"Confirmo"` en S1/P1 vs. `"Sí, voy a estar"` en P2/P3) y dos claves distintas para el mismo concepto de ruteo (`sheetId` vs. `sheet_id`).
- `SpreadsheetApp.openById(sheetId)` ya funciona de forma genérica en el Apps Script actual — el ruteo multicliente no requiere construirse desde cero, ya existe en la práctica.
- P2 y P3 ya invocan `action=getConfirmados` contra un endpoint que el Apps Script no implementa — gap preexistente, no introducido por esta fase.

## 5. Decisión metodológica registrada durante el cierre

Se evaluó corregir el gate de health check como arreglo aislado, previo al diseño del contrato completo. Se decidió explícitamente no hacerlo: modificar un Apps Script en producción para dejarlo en un estado intermedio que sigue escribiendo datos incompletos para P1/P2/P3 no reduce el riesgo real, solo lo dispersa en más de una intervención sobre un componente en vivo. La corrección del gate queda incorporada al contrato v2 (`CONTRATO_RSVP_V2.md` §8, §13) como parte de un único cambio futuro, no como paso previo separado.

## 6. Contrato aprobado — resumen

Ver `docs/CONTRATO_RSVP_V2.md` para el documento normativo completo. Resumen de las decisiones de diseño:

- **Vocabulario canónico** (§5 del contrato): `sheet_id`, `nombre`, `asistencia` (obligatorios); `apellido`, `restricciones`, `observaciones` (opcionales). Sin creación dinámica de campos.
- **Normalización de valores** (§6): `asistencia` viaja como `"si"`/`"no"` fijo — el Apps Script traduce al label legible, evitando cualquier heurística de coincidencia de texto.
- **Compatibilidad con S1** (§7): la ruta legacy no se modifica en absoluto.
- **Dispatch por `action`** (§8): único mecanismo explícito de enrutamiento — sin inferencia por presencia/ausencia de parámetros salvo el fallback legacy, acotado y documentado.
- **Principios de evolución** (§9): no ruptura de clientes desplegados, ignorar campos desconocidos sin reinterpretar los existentes, y definición formal de qué constituye una nueva versión del contrato.
- **Regla de una capacidad por `action`** (§10): ninguna iniciativa incorpora un `action` nuevo fuera de su objetivo principal.

## 7. Decisiones cerradas — NO REABRIR

- El contrato v2 cubre exclusivamente S1 (sin migrar), P1, P2 y P3. S2/S3 quedan fuera por decisión de alcance, no por limitación técnica.
- El Apps Script se diseña como componente genérico y multicliente por `sheet_id`, sin lógica condicional por template.
- `action=getConfirmados` y la creación dinámica de columnas quedan explícitamente fuera de v2.
- Esta iniciativa es independiente de MAU-4 (Señalización Explícita de Fallos Críticos) — comparte el mismo componente subyacente (RIESGO-B, fallos silenciosos) pero persigue un objetivo distinto (contrato de integración vs. observabilidad) y se mantiene con trazabilidad propia.

## 8. Changeset aplicado

```
docs/CONTRATO_RSVP_V2.md            ← nuevo, documento normativo aprobado
docs/Fase 24.md                     ← nuevo, este documento
docs/ESTADO_OFICIAL_PROYECTO.md     ← v14, sección 26 incorporada
Instrucciones maestras del proyecto ← actualizadas a versión FASE 24
```

Ningún archivo de `src/` fue modificado durante esta fase.

## 9. Estado final de la fase

**FASE 24 — CERRADA.** Contrato RSVP v2 aprobado como documento normativo oficial. Implementación no iniciada.

**Próximo paso**: apertura de una nueva fase, dedicada exclusivamente a la implementación del Contrato RSVP v2 (Apps Script + migración de P1/P2/P3), bajo el protocolo obligatorio completo (Análisis → Riesgos → Alternativas → Recomendación → Cambio mínimo → Impacto esperado → Esperando confirmación), auditando el código real al momento de comenzar.
