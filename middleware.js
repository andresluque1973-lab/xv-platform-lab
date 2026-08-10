// ─────────────────────────────────────────────────────────────────────────────
// middleware.js — PRUEBA TÉCNICA AISLADA (FASE 28, Etapa 1) — versión corregida
// Objetivo único: verificar si Vercel Routing Middleware funciona en este
// proyecto Vite + React SPA (sin Next.js), interceptando exclusivamente
// /admin y /admin/* con Basic Auth, sin afectar el resto del sitio.
//
// Import puntual desde el subpath '/middleware' del paquete — evita traer
// oidc/db-connections/websocket, que no se usan acá (ver auditoría de
// dependencias, FASE 28 — Etapa 1).
//
// Credencial: variable de entorno de Vercel (scope Preview), NUNCA en código.
// Nombres esperados: ADMIN_AUTH_USER, ADMIN_AUTH_PASS
// ─────────────────────────────────────────────────────────────────────────────

import { next } from '@vercel/functions/middleware';

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice('Basic '.length);

    let decoded = '';
    try {
      decoded = atob(encoded);
    } catch {
      decoded = '';
    }

    const separatorIndex = decoded.indexOf(':');
    const user = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : '';
    const pass = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

    const expectedUser = process.env.ADMIN_AUTH_USER;
    const expectedPass = process.env.ADMIN_AUTH_PASS;

    if (expectedUser && expectedPass && user === expectedUser && pass === expectedPass) {
      return next(); // credencial válida → continuación explícita de Vercel
    }
  }

  return new Response('Autenticación requerida.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="VELA Admin - prueba tecnica"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
