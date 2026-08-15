// ─────────────────────────────────────────────────────────────────────────────
// api/admin-gate.js — PRUEBA DE INFRAESTRUCTURA (FASE 28, Etapa 2A)
//
// Objetivo único: comprobar que esta Function puede obtener el contenido de
// index.html mediante self-fetch en tiempo de request, y devolverlo tal cual.
//
// Deliberadamente sin lógica de autenticación de /admin: NO lee el
// Authorization del cliente, NO usa ADMIN_AUTH_USER/ADMIN_AUTH_PASS, NO está
// conectada todavía a /admin vía vercel.json. Sigue respondiendo únicamente
// en su propia ruta /api/admin-gate. Sin dependencias nuevas.
//
// Vercel Authentication está activa sobre este Preview, por lo que la
// request saliente hacia /index.html necesita atravesarla mediante
// Protection Bypass for Automation — VERCEL_AUTOMATION_BYPASS_SECRET es una
// System Environment Variable inyectada automáticamente por Vercel, leída
// aquí únicamente para agregarla como header en esa request saliente.
// Nunca se loguea, nunca se incluye en la respuesta al cliente.
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(request, response) {
  try {
    const host = request.headers.host;
    const protocol = request.headers['x-forwarded-proto'] || 'https';
    const targetUrl = `${protocol}://${host}/index.html`;

    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

    const upstream = await fetch(targetUrl, {
      headers: bypassSecret
        ? { 'x-vercel-protection-bypass': bypassSecret }
        : {},
    });
    const html = await upstream.text();

    response.status(upstream.status);
    response.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'text/html; charset=utf-8'
    );
    response.setHeader('X-Vela-Test', 'etapa-2a-self-fetch');
    response.send(html);
  } catch (error) {
    response.status(500).send('VELA SELF-FETCH TEST FAIL');
  }
}
