[Fase 22.md](https://github.com/user-attachments/files/30172946/Fase.22.md)
# FASE 22 — Implementación y Cierre de MAU-1: Contrato Ejecutable de Configuración
## Documento de cierre oficial (generado retroactivamente)

Versión: 1 · Cierra FASE 22 · Depende de: FASE 21 (`docs/Fase 21.md`), FASE 20 (`docs/Fase 20.md`)

**Nota de origen**: este documento se generó de forma retroactiva durante FASE 24, para cerrar un vacío detectado por auditoría — `ESTADO_OFICIAL_PROYECTO.md` sección 23 referenciaba `docs/Fase 22.md` como "documento de cierre oficial" sin que el archivo existiera en el repositorio. Su contenido reproduce exclusivamente lo ya aprobado y registrado en esa sección al momento de su cierre original. No introduce decisiones nuevas ni reinterpreta nada de lo ya cerrado.

---

## 1. Objetivo cumplido

Implementar y validar MAU-1 — Contrato Ejecutable de Configuración, el primero de los cuatro elementos del MAU, bajo protocolo obligatorio completo. Primera fase de la secuencia que modificó código de la aplicación (`src/hooks/useConfig.js` y, como prerrequisito técnico, `src/templates/{S2,S3,P1,P2,P3}.jsx`).

## 2. Relación con FASE 21

FASE 21 dejó explícitamente diferido el alcance exacto del primer contrato ejecutable. FASE 22 respondió esa pregunta con auditoría de código real, no con la hipótesis no demostrada que FASE 21 había registrado (contrato STANDARD-primero-PREMIUM-después): la evidencia mostró que la variación de campos obligatorios ocurre por template individual, no por plan comercial. La sección de FASE 21 en `ESTADO_OFICIAL_PROYECTO.md` permanece sin alteración.

## 3. Hallazgo no anticipado en la planificación de FASE 21

Cinco de los seis templates (S2, S3, P1, P2, P3) no consumían `useConfig.js` real — resolvían su configuración mediante un mecanismo paralelo (`useConfigCompat`) con fallback silencioso a un `MOCK_CONFIG` hardcodeado. Resuelto como **prerrequisito técnico de MAU-1**, validado en Preview Deployment, antes de implementar el contrato. Encuadre explícito: esta intervención no extiende DEUDA-001 — elimina una bifurcación accidental del flujo de carga que nunca formó parte de esa deuda documentada.

## 4. Contrato Ejecutable — resumen de diseño

- Punto único de integración: `useConfig.js`, entre `res.json()` y `setConfig()`. Cubre los 6 templates gracias al prerrequisito técnico.
- Resolución del template efectivo: `useConfig.js` importa `templateRegistry` y aplica la misma regla de fallback que `TemplateLoader.jsx` — decisión deliberada para no introducir una segunda fuente de verdad sobre qué templates existen.
- Criterio de obligatoriedad: un campo es obligatorio para un template si su código lo consume mediante acceso directo, sin `?.` ni `||` equivalente. Derivado por lectura completa de los 6 templates, no por muestreo.
- Alcance exclusivamente estructural: solo `undefined`/`null` cuentan como campo faltante. Cadenas vacías no se validan — validación de contenido queda fuera de MAU-1.
- `sheet_id` se mantiene opcional en las 6 variantes, incluida P1, pese a una inconsistencia interna detectada en `ConfirmadosSection` de P1 — documentada como observación técnica, no incorporada como regla.

## 5. Validación funcional

Ejecutada por Andrés en Preview Deployment, en dos etapas (prerrequisito técnico; luego contrato ejecutable). Confirmada satisfactoria en ambas — sin regresiones visuales ni funcionales en los clientes reales (`sofia`, `valentina`, `andres`), los 6 templates cargan correctamente vía `useConfig()` real, y el contrato detecta configuraciones inválidas antes de renderizar.

## 6. Riesgo A (FASE 19, mapa de riesgos)

Queda resuelto por la implementación de MAU-1. El mapa de riesgos original de FASE 19 no se reclasifica ni se altera — es una nota de seguimiento, no una revisión del documento histórico.

## 7. Decisiones cerradas — NO REABRIR

- MAU-1 queda implementado y validado como primer elemento del MAU. El MAU permanece compuesto por 4 elementos, sin alteración de FASE 20.
- El contrato es por template (S1–P3), no por plan comercial.
- `sheet_id` es opcional en las 6 variantes, incluida P1 — inconsistencia de P1 documentada como observación técnica, no como bug a corregir en esta fase.
- El acoplamiento `useConfig.js` → `templateRegistry` es una decisión arquitectónica deliberada.
- El alcance del contrato es exclusivamente estructural. Validación de contenido o calidad de datos queda fuera de MAU-1.
- El prerrequisito técnico no extiende DEUDA-001 — elimina una bifurcación accidental del flujo de carga. DEUDA-001 permanece en el estado ya documentado, ahora uniforme en los 6 templates.

## 8. Fuera de alcance de FASE 22

MAU-2, MAU-3, MAU-4; diseño de pantallas del Owner Tool (Horizonte 3B); reapertura de decisiones cerradas en FASE 19, 20 o 21; corrección de inconsistencias de código que no constituyan bug objetivo que impida cumplir el criterio de aceptación de MAU-1.

## 9. Changeset aplicado

```
docs/ESTADO_OFICIAL_PROYECTO.md     ← v13, sección 23 incorporada; secciones 1–21 sin alterar
Instrucciones maestras del proyecto ← actualizadas a versión FASE 22
src/hooks/useConfig.js              ← MAU-1: Contrato Ejecutable de Configuración implementado
src/templates/S2.jsx                ← prerrequisito técnico: useConfigCompat delega a useConfig() real
src/templates/S3.jsx                ← ídem
src/templates/P1.jsx                ← ídem
src/templates/P2.jsx                ← ídem
src/templates/P3.jsx                ← ídem
```

## 10. Estado final de la fase

**FASE 22 — CERRADA.** MAU-1 — Contrato Ejecutable de Configuración implementado y validado.

**Próximo paso (según se registró originalmente)**: inicio de MAU-2 y/o MAU-3, planificables en paralelo. Continuado en `docs/Fase 23.md`.
