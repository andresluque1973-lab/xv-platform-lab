
// ─────────────────────────────────────────────────────────────────────────────
// src/templates/templateRegistry.js
// Fuente central de resolución técnica de templates — FASE 8.1A
//
// PROPÓSITO
// Desacoplar identidad comercial (catálogo) de implementación técnica (JSX).
// Relación: código comercial → componente React concreto.
//
// ESTADO
// Conectado a TemplateLoader desde FASE 8.1B.
//
// REGLAS
// - Solo agregar entradas cuando el template exista físicamente y esté validado.
// - Usar siempre el entrypoint público estable del template (ej: ./standard1.jsx).
// - NO usar lazy imports, dynamic imports, factories ni auto-discovery.
// - Cada nueva entrada requiere: component, category, implementation.
// ─────────────────────────────────────────────────────────────────────────────

import Standard1 from './standard1.jsx';
// Entrypoint público estable — mismo path histórico usado por TemplateLoader.
// NO reemplazar por ruta interna modularizada.

import S2 from './S2.jsx';

import S3 from './S3.jsx';
// FASE 15 — primera implementación de la familia Elegante.
// No marcar como disponible en catálogo hasta validación en Preview Deployment.

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
  S3: {
    component:      S3,
    category:       'standard',
    implementation: 'S3',
  },
};
