// ─────────────────────────────────────────────────────────────────────────────
// api/admin-gate.js — PRUEBA DE INFRAESTRUCTURA (FASE 28, Etapa 1B.2)
//
// Objetivo único: verificar que la Vercel Function standalone puede leer,
// en runtime Preview, las variables de entorno ADMIN_AUTH_USER y
// ADMIN_AUTH_PASS ya configuradas en el dashboard.
//
// Deliberadamente sin lógica de autenticación real: no compara valores,
// no expone valores, no los loguea. Solo verifica existencia booleana.
// Sin Basic Auth, sin fs/path, sin lectura de index.html, sin dependencias.
// ─────────────────────────────────────────────────────────────────────────────

export default function handler(request, response) {
  const hasUser = Boolean(process.env.ADMIN_AUTH_USER);
  const hasPass = Boolean(process.env.ADMIN_AUTH_PASS);

  if (hasUser && hasPass) {
    response.status(200).send('VELA ENV TEST OK');
    return;
  }

  response.status(200).send('VELA ENV TEST FAIL');
}
