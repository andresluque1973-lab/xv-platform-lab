// ─────────────────────────────────────────────────────────────────────────────
// src/admin/GeneradorPage.jsx
// Wrapper mínimo sobre AdminPage — FASE 9
//
// PROPÓSITO
// Punto de montaje de la funcionalidad de generación de config.json
// dentro del nuevo AdminShell. No introduce lógica propia.
//
// REGLA
// No agregar lógica aquí. Si AdminPage necesita cambios, modificar AdminPage.
// ─────────────────────────────────────────────────────────────────────────────

import AdminPage from './AdminPage.jsx';

export default function GeneradorPage() {
  return <AdminPage />;
}
