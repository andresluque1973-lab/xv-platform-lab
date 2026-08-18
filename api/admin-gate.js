// ─────────────────────────────────────────────────────────────────────────────
// api/admin-gate.js — GATE DE AUTENTICACIÓN (FASE 28, Etapa 2B)
//
// Integra las dos capacidades ya validadas por separado:
//   - Etapa 1B.2: lectura de ADMIN_AUTH_USER / ADMIN_AUTH_PASS en runtime.
//   - Etapa 2A: self-fetch de index.html, atravesando Vercel Authentication
//     mediante VERCEL_AUTOMATION_BYPASS_SECRET (System Environment Variable).
//
// Flujo: sin credencial válida → 401 + WWW-Authenticate (no se hace el
// self-fetch). Con credencial válida → self-fetch + se sirve index.html.
//
// Todavía NO conectada a /admin — sigue respondiendo únicamente en su
// propia ruta /api/admin-gate. Ese cableado (vercel.json) es Etapa 2C,
// no esta subetapa. Sin dependencias nuevas.
// ─────────────────────────────────────────────────────────────────────────────

function isValidBasicAuth(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const encoded = authHeader.slice('Basic '.length);

  let decoded = '';
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(':');
  const user = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : '';
  const pass = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  const expectedUser = process.env.ADMIN_AUTH_USER;
  const expectedPass = process.env.ADMIN_AUTH_PASS;

  return Boolean(
    expectedUser && expectedPass && user === expectedUser && pass === expectedPass
  );
}

export default async function handler(request, response) {
  if (!isValidBasicAuth(request)) {
    response.setHeader('WWW-Authenticate', 'Basic realm="VELA Admin - Etapa 2B"');
    response.status(401).send('Autenticación requerida.');
    return;
  }

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
    response.setHeader('X-Vela-Test', 'etapa-2b-basic-auth-gate');
    response.send(html);
  } catch (error) {
    response.status(500).send('VELA GATE TEST FAIL');
  }
}
