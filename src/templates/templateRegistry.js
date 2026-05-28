// ─────────────────────────────────────────────────────────────────────────────
// src/templates/templateRegistry.js
// Fuente central de resolución técnica de templates — FASE 8.1A
//
// PROPÓSITO
// Desacoplar identidad comercial (catálogo) de implementación técnica (JSX).
// Relación: código comercial → componente React concreto.
//
// ESTADO
// Pasivo — no conectado al runtime todavía.
// TemplateLoader sigue usando su templateMap interno hasta FASE 8.1B.
//
// REGLAS
// - Solo agregar entradas cuando el template exista físicamente y esté validado.
// - NO usar lazy imports, dynamic imports, factories ni auto-discovery.
// - Cada nueva entrada requiere: component, category, implementation.
// ─────────────────────────────────────────────────────────────────────────────

import Standard1 from './standard1/standard1';
// NOTA: standard1.jsx exporta `App` internamente.
// El alias `Standard1` es convención del proyecto — no renombrar el export interno.

import S2 from './S2';
// DEUDA TÉCNICA: S2 existe como archivo pero no está validado en producción.
// Incluido en registry para mantener paridad con templateMap de TemplateLoader.
// No marcar como disponible en catálogo hasta validación real.

// ─────────────────────────────────────────────────────────────────────────────
// templateRegistry
// Cada entrada:
//   component      → componente React a renderizar
//   category       → plan comercial al que pertenece ('standard' | 'premium')
//   implementation → nombre del archivo/carpeta fuente (trazabilidad)
// ─────────────────────────────────────────────────────────────────────────────
export const templateRegistry = {
  S1: {
    component:      Standard1,
    category:       'standard',
    implementation: 'standard1',
  },
  S2: {
    component:      S2,
    category:       'standard',
    implementation: 'S2',
  },
};
