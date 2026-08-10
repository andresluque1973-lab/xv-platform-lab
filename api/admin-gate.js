// ─────────────────────────────────────────────────────────────────────────────
// api/admin-gate.js — PRUEBA DE INFRAESTRUCTURA (FASE 28, Etapa 1B)
//
// Objetivo único: verificar si Vercel reconoce, construye y ejecuta una
// Vercel Function Node.js standalone en api/ para este proyecto Vite SPA,
// sin modificar vercel.json.
//
// Deliberadamente sin lógica: sin Basic Auth, sin variables de entorno,
// sin fs/path, sin lectura de index.html. Solo responde 200 con texto fijo.
// ─────────────────────────────────────────────────────────────────────────────

export default function handler(request, response) {
  response.status(200).send('VELA FUNCTION TEST OK');
}
