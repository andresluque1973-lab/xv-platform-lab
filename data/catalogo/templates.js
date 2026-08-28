// ─────────────────────────────────────────────────────────────────────────────
// data/catalogo/templates.js
// Fuente de verdad del catálogo comercial VELA — FASE 8
// NO modificar estado sin implementación real validada.
// disponible  → template implementado, validado y usable en producción
// proximamente → declarado en catálogo, sin implementación real todavía
// ─────────────────────────────────────────────────────────────────────────────

export const catalogo = {
  version: "1",
  templates: [
    { codigo: "S1", plan: "STANDARD", nombre: "Standard 1", estado: "disponible"   },
    { codigo: "S2", plan: "STANDARD", nombre: "Standard 2", estado: "disponible" },
    { codigo: "S3", plan: "STANDARD", nombre: "Standard 3", estado: "disponible" },
    { codigo: "P1", plan: "PREMIUM",  nombre: "Premium 1",  estado: "disponible" },
    { codigo: "P2", plan: "PREMIUM",  nombre: "Premium 2",  estado: "disponible" },
    { codigo: "P3", plan: "PREMIUM",  nombre: "Premium 3",  estado: "disponible" },
  ],
};
