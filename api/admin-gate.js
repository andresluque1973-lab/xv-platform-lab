// ─────────────────────────────────────────────────────────────────────────────
// api/admin-gate.js — PRUEBA DE INFRAESTRUCTURA (FASE 28, Etapa 2A)
//
// Objetivo único: comprobar que esta Function puede obtener el contenido de
// index.html mediante self-fetch en tiempo de request, y devolverlo tal cual.
//
// Deliberadamente sin lógica de autenticación: NO lee Authorization, NO usa
// ADMIN_AUTH_USER/ADMIN_AUTH_PASS, NO está conectada todavía a /admin vía
// vercel.json. Sigue respondiendo únicamente en su propia ruta /api/admin-gate.
// Sin dependencias nuevas — únicamente fetch nativo del runtime.
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(request, response) {
  try {
    const host = request.headers.host;
    const protocol = request.headers['x-forwarded-proto'] || 'https';
    const targetUrl = `${protocol}://${host}/index.html`;

    const upstream = await fetch(targetUrl);
    const html = await upstream.text();

    response.status(upstream.status);
    response.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'text/html; charset=utf-8'
    );
    response.setHeader('X-Vela-Test', 'etapa-2a-self-fetch');
    response.send(html);
  } catch (error) {
    response.status(500).send('VELA SELF-FETCH TEST FAIL: ' + error.message);
  }
}
