# FASE 14 — Consolidación Arquitectónica: DEUDA-002

Estado: CERRADA
Fecha de cierre: junio 2026

---

## Objetivo

Resolver DEUDA-002: duplicación de `useCountdown` entre S1 y S2,
condición de activación cumplida al tener dos templates operativos.

---

## Cambios aplicados

| Archivo | Acción |
|---|---|
| `src/templates/shared/hooks.js` | Creado — contiene `useCountdown` canónico |
| `src/templates/standard1/hooks.js` | Re-exporta desde shared — contrato externo intacto |
| `src/templates/S2.jsx` | Import desde shared — inline eliminado |

---

## Decisiones tomadas

**Extracción mínima justificada.**
Solo `useCountdown` fue extraído. Cumplía los tres criterios:
lógica no trivial, uso verificado en ≥2 templates, alta probabilidad
de reutilización futura (S3 y variantes).

**`useAudio`, `useEntered`, `useSlug` permanecen locales.**
Sin evidencia suficiente para abstraerlos. Diferidos hasta S3
o variante que lo justifique.

**Unificación sobre implementación más robusta.**
`new Date(targetDate) - new Date()` prevalece sobre la versión
anterior de S1 (`targetDate - new Date()`), ya que el config
real pasa `contador` como string ISO. S1 hereda la mejora
sin cambio de contrato.

**Re-export desde `standard1/hooks.js`.**
Preserva compatibilidad con imports existentes de S1.
Cero riesgo sobre producción.

---

## Deudas técnicas

DEUDA-001 — double `useConfig` fetch: permanece abierta, diferida.
DEUDA-002 — duplicación S1/S2: RESUELTA en esta fase.

---

## Estado del sistema al cierre

- S1 (Emotiva / STANDARD): operativo, sin cambios de comportamiento
- S2.2 (Con Carácter / STANDARD): operativo, sin cambios de comportamiento
- `src/templates/shared/`: establecido como espacio canónico
  para lógica compartida con consumidor real verificado
- S3, P-series: fuera de alcance de esta fase

---

## Fuera de alcance — explícitamente diferido

- S3 / P1 / P2 / P3
- Nuevas abstracciones sin evidencia empírica
- Resolución de DEUDA-001
