[Fase 28.md](https://github.com/user-attachments/files/31163964/Fase.28.md)
# FASE 28 — PLATAFORMA ADMINISTRATIVA VELA — AUTENTICACIÓN DE `/admin` — CERRADA (PARCIAL)

**Estado:** CERRADA — únicamente la línea A (autenticación de `/admin`) de su alcance original. La línea B (visibilidad operativa de RSVP para P1/P2/P3) queda formalmente diferida, sin iniciar.

**Commit de cierre en `main`:** `364c3ca` (merge de PR #45 sobre `4207a45`).

---

## 1. Objetivo original de la fase

Definido en la fase de análisis estratégico que precedió a FASE 28 (diagnóstico solicitado explícitamente antes de cualquier implementación): evaluar tres líneas posibles de trabajo — continuación de MAU-3, MAU-4, o perfeccionamiento de la plataforma administrativa — y determinar cuál tenía mayor valor concreto para el producto en ese momento.

**Recomendación resultante y aprobada:** la plataforma administrativa (línea C del diagnóstico), acotada a dos objetivos concretos con evidencia directa de brecha real:

- **A — Autenticación de `/admin`**, hoy accesible sin ningún control desde su implementación original.
- **B — Visibilidad operativa de RSVP para P1/P2/P3**, aprovechando el contrato de lectura (`action=getConfirmados`) ya implementado y validado en FASE 26, pero sin ninguna superficie administrativa que lo consumiera.

**Explícitamente fuera de alcance desde el diagnóstico inicial, y confirmado sin reabrir en ningún momento de la fase:** MAU-3 posterior a su primera etapa (FASE 27), MAU-4, RIESGO-C, CRUD de clientes, modelo Cliente/Evento, dashboard/analítica, cualquier modificación de Apps Script, de templates públicos, del Contrato RSVP v2, de `useConfig.js`, o del catálogo comercial.

**Resultado de esta fase:** únicamente la línea A quedó implementada y validada en producción. La línea B no fue iniciada — queda como punto de partida explícito para la fase siguiente.

---

## 2. Cronología completa

| Paso | Contenido | Resultado |
|---|---|---|
| Diagnóstico estratégico | Auditoría del estado de VELA, evaluación de MAU-3/MAU-4/plataforma administrativa | Línea C aprobada |
| Etapa 1 — Diseño | Diseño funcional de autenticación y de la vista RSVP, sin código | Aprobado conceptualmente |
| Paso 0 | Verificación de Vercel Deployment/Password Protection nativo | Descartado — no aísla `/admin` sin proteger todo el sitio |
| Comparación A vs B (conceptual) | Routing Middleware vs Vercel Function standalone | Recomendación inicial: A |
| Alternativa A — implementación | `middleware.js` + `@vercel/functions/middleware` | **NO VALIDADA** (ver sección 3) |
| Etapa 1B.1 | Vercel Function Node.js mínima en `api/` | **VALIDADA** |
| Etapa 1B.2 | Lectura de `ADMIN_AUTH_USER`/`ADMIN_AUTH_PASS` en runtime | **VALIDADA** |
| Etapa 2 — Diseño del gate | Diseño técnico completo del gate de `/admin`, sin código | Aprobado |
| Etapa 2A | Self-fetch de `index.html` + Protection Bypass for Automation | **VALIDADA** |
| Etapa 2B | Basic Auth + self-fetch integrado en un único flujo | **VALIDADA** |
| Etapa 2C | Conexión real de `/admin`/`/admin/*` vía `vercel.json` | **VALIDADA** |
| Etapa 2D | Merge a `main` (PR #45) + verificación en producción real | **VALIDADA** |

---

## 3. Alternativa A — Routing Middleware — NO VALIDADA

**Diseño:** `middleware.js` en la raíz del proyecto, usando `next()` de `@vercel/functions/middleware` para continuación explícita, `matcher: ['/admin', '/admin/:path*']`, Basic Auth contra `ADMIN_AUTH_USER`/`ADMIN_AUTH_PASS`.

**Auditoría de dependencias, realizada antes de la prueba empírica:** `@vercel/functions@3.9.1` verificado contra el registro de npm real — sin dependencia de Next.js en ningún nivel del árbol (`dependencies` únicamente `@vercel/oidc`), sin referencias a `next/server`, con subpath `./middleware` autocontenido (sin `require()` internos). `@vercel/edge` (paquete predecesor) confirmado deprecado en favor de `@vercel/functions` mediante su propia metadata de npm. Instalación real en copia descartable del repositorio confirmó bundle cliente byte-idéntico (sin impacto en Vite) y `package-lock.json` reproducible.

**Resultado en Preview real:**

```
The Edge Function "middleware" is referencing unsupported modules: @vercel/functions/middleware
```

**Causa técnica (confianza media, no verificada contra documentación en vivo):** el pipeline de construcción de Edge Middleware para proyectos sin framework detectado ("Other"/Vite) no resuelve dependencias de `node_modules` de la misma manera que Next.js, que cuenta con su propio paso de bundling integrado al que Vercel se conecta. No se intentó forzar ni corregir la variante — descartada por decisión explícita.

**Hallazgo lateral, registrado sin actuar sobre él:** el error apunta específicamente al *import de un módulo externo*, no a Routing Middleware como concepto. Una variante con `next()` reimplementado a mano (sin ningún `import` de `node_modules`) no fue probada — queda señalada como posibilidad no explorada, sin recomendación de retomarla dado que B ya quedó validada y en producción.

---

## 4. Etapa 1B.1 — Vercel Function Node.js mínima — VALIDADA

**Objetivo:** confirmar que Vercel reconoce, construye y ejecuta una Vercel Function Node.js standalone en `api/`, para este proyecto Vite + React SPA, sin modificar `vercel.json`.

**Implementación:** `api/admin-gate.js`, sin lógica, sin dependencias, respondiendo `200 VELA FUNCTION TEST OK`.

**Evidencia de Preview:** `Environment: Preview`, `Status: Ready`. `/api/admin-gate` → `200 OK`, body exacto. `/sofia`, `/valentina`, `/andres`, `/caracas` sin cambios. `npm run build` y `npm run validar:clientes` → `EXIT 0` en ambos casos, bundle cliente con hash idéntico al de referencia (confirma que `api/` no es tocado por Vite).

---

## 5. Etapa 1B.2 — Lectura de variables de entorno — VALIDADA

**Objetivo:** confirmar que la misma Function puede leer, en runtime de Preview, `ADMIN_AUTH_USER` y `ADMIN_AUTH_PASS` configuradas en el dashboard de Vercel, sin exponer sus valores.

**Implementación:** verificación puramente booleana (`Boolean(process.env.ADMIN_AUTH_USER)` / `Boolean(process.env.ADMIN_AUTH_PASS)`), respondiendo `VELA ENV TEST OK`/`VELA ENV TEST FAIL` sin retornar, loguear ni exponer los valores reales en ningún momento.

**Incidencia registrada, sin impacto en la validación final:** un primer intento arrojó `VELA ENV TEST FAIL` — diagnosticado correctamente como scope de las variables restringido a una rama de Preview distinta de la que se estaba probando, no como incapacidad del mecanismo. Tras corregir el scope, `VELA ENV TEST OK` confirmado.

---

## 6. Etapa 2 — Diseño técnico del gate — sin código

Documento de diseño completo, aprobado antes de cualquier implementación, cubriendo: flujo completo de una request a `/admin`; intervención de `vercel.json`; orden de `rewrites`; validación de Basic Auth; mecanismo de servido de `index.html` tras autenticación exitosa (dos alternativas evaluadas — `includeFiles`/`fs.readFileSync` en tiempo de build, vs. self-fetch en tiempo de request — elegida la segunda por menor superficie de supuestos de plataforma no verificados); aislamiento respecto de rutas públicas y `/assets/*`; archivos exactos a modificar; estrategia de rollback; plan de pruebas; riesgos específicos de modificar `vercel.json` (único archivo de ruteo de todo el sitio, mayor radio de impacto de toda la fase).

---

## 7. Etapa 2A — Self-fetch de `index.html` + Protection Bypass — VALIDADA

**Objetivo:** confirmar que `api/admin-gate.js` puede obtener el contenido de `index.html` mediante self-fetch en tiempo de request, antes de conectar el routing de `/admin`.

**Auditoría técnica previa a la implementación, con evidencia real:** instalación de `@vercel/node@5.10.0` para inspeccionar el tipo `VercelRequest` — confirmado que es literalmente `IncomingMessage` de Node extendido con `query`/`cookies`/`body`, sin ningún helper de URL absoluta o host canónico. Confirma que la reconstrucción manual de la URL desde headers (`request.headers.host`) es el único mecanismo disponible, no un atajo. Ajuste aplicado tras auditoría puntual: protocolo derivado de `x-forwarded-proto` (con fallback `'https'`) en vez de hardcodeado, eliminando un supuesto no verificado sin costo adicional.

**Primer resultado en Preview — bloqueo no anticipado:** en vez de servir `index.html`, la Function devolvía la pantalla de login de Vercel ("Log in to Vercel"). **Diagnóstico:** **Vercel Authentication** (Deployment Protection) intercepta también la request *saliente* que la Function hace hacia `/index.html` — no solo las requests entrantes de navegador. Confirmado en el dashboard real (`Settings → Deployment Protection → Vercel Authentication`).

**Resolución:** **Protection Bypass for Automation**, mecanismo nativo de Vercel para exactamente este caso — acceso automatizado/interno sin exponer el deployment completo. Secreto generado por Andrés en el dashboard (nota: *"FASE 28 - Etapa 2A - self-fetch de index.html"*), expuesto automáticamente como **System Environment Variable** `VERCEL_AUTOMATION_BYPASS_SECRET`, sin configuración manual adicional requerida. Enviado únicamente como header `x-vercel-protection-bypass` en la request saliente de la Function — nunca en la request entrante que recibe el navegador, preservando intacta la protección pública del Preview.

**Evidencia final:** `200 OK`, `Content-Type: text/html; charset=utf-8`, header `X-Vela-Test: etapa-2a-self-fetch`, body inicia con `<!DOCTYPE html>` e incluye el bundle real (`/assets/index-C8aZDbNZ.js`). Rutas públicas sin cambios.

**Hallazgo registrado, fuera de alcance de esta subetapa:** al visitar `/api/admin-gate` o `/index.html` directamente en un navegador (dejando ejecutar el JS del SPA), aparece `"No se pudo cargar la invitación."` — `AppRouter` deriva el slug del primer segmento del pathname (`api`, `index.html`), que no corresponde a ningún cliente real; `useConfig` recibe el HTML del catch-all en vez de un JSON de configuración. Confirmado como comportamiento **preexistente** del SPA (reproducible con `/index.html` directo, sin ningún código de esta fase de por medio), no un defecto del self-fetch. Sin acción tomada.

---

## 8. Etapa 2B — Basic Auth + self-fetch integrado — VALIDADA

**Objetivo:** unificar en `api/admin-gate.js` las dos capacidades ya validadas por separado (credenciales de 1B.2, self-fetch con bypass de 2A) en el flujo de decisión completo.

**Implementación:** función `isValidBasicAuth(request)` — decodifica el header `Authorization` (`Buffer.from(encoded, 'base64').toString('utf-8')`, nativo de Node), compara contra `ADMIN_AUTH_USER`/`ADMIN_AUTH_PASS`. Sin credencial válida → `401` + `WWW-Authenticate: Basic realm="VELA Admin - Etapa 2B"`, sin ejecutar el self-fetch. Con credencial válida → self-fetch + `200` + HTML real + `X-Vela-Test: etapa-2b-basic-auth-gate`.

**Evidencia de Preview:** `401` sin credencial, `401` con credencial inválida, `200` con credencial válida — los tres con los headers correspondientes. Verificado, mediante inspección exhaustiva del código, que ninguna de las tres variables sensibles (`ADMIN_AUTH_USER`, `ADMIN_AUTH_PASS`, `VERCEL_AUTOMATION_BYPASS_SECRET`) aparece en ninguna respuesta, log, ni en el bundle cliente.

---

## 9. Etapa 2C — Conexión de `/admin` vía `vercel.json` — VALIDADA

**Objetivo:** rutear `/admin` y `/admin/*` hacia `api/admin-gate.js`, preservando intacta la regla catch-all existente para el resto del sitio. Primera subetapa de toda la fase con impacto potencial sobre el ruteo completo del sitio.

**Cambio:**

```json
{
  "rewrites": [
    { "source": "/admin",       "destination": "/api/admin-gate" },
    { "source": "/admin/(.*)",  "destination": "/api/admin-gate" },
    { "source": "/(.*)",        "destination": "/index.html" }
  ]
}
```

**Incertidumbre de diseño, resuelta empíricamente en esta subetapa:** el orden de evaluación de `rewrites` de Vercel (primera coincidencia gana) era un supuesto no verificado desde el diseño original de Etapa 2 — confirmado correcto con evidencia real de Preview.

**Validación mediante requests HTTP directas (PowerShell, sin reutilizar sesión de navegador, con bypass explícito):** `/admin` sin credenciales → `401`. `/admin/lalala` sin `Authorization` → `401` + `WWW-Authenticate` correcto. `/admin/lalala` con credencial inválida → `401`. `/admin/lalala` con credencial válida → `200` + `X-Vela-Test: etapa-2b-basic-auth-gate` + HTML real. `/sofia`, `/valentina`, `/andres`, `/caracas` → sin cambios. `/lalala` (ruta pública inexistente) → `200`, comportamiento normal preexistente del catch-all.

---

## 10. Etapa 2D — Merge a producción — VALIDADA

**Auditoría pre-merge:** confirmado que `main` no tuvo drift durante toda la fase (`4207a45` sin cambios desde el inicio hasta el momento del PR). Diff preparado: únicamente `api/admin-gate.js` (nuevo, byte a byte idéntico a la versión validada en 2B) y `vercel.json` (byte a byte idéntico a la versión validada en 2C). `src/**`, `public/clientes/**`, `data/clientes/index.json`, `package.json`, `package-lock.json` — confirmados sin diferencias, path por path.

**PR #45**, título *"FASE 28 — Etapa 2D: Gate de autenticación para `/admin`"*, mergeado por Andrés.

**Auditoría post-merge, sobre clon fresco de `main` real:** HEAD `364c3ca` (merge de PR #45 sobre `4207a45`). `api/admin-gate.js` y `vercel.json` en `main` confirmados byte a byte idénticos a lo auditado pre-merge. Diff completo `4207a45 → 364c3ca` coincide exactamente con lo previsto — ningún archivo adicional. `npm run build` / `npm run validar:clientes` → `EXIT 0` sobre `main` real.

**Verificación en producción real (evidencia de Andrés):** `/admin` sin credenciales → protegido. `/admin` con credenciales → acceso correcto al panel. `/sofia`, `/valentina`, `/andres`, `/caracas` → intactas. Assets → intactos.

---

## 11. Variables de entorno — configuración final

| Variable | Scope | Origen |
|---|---|---|
| `ADMIN_AUTH_USER` | Preview + Production | Configurada manualmente por Andrés en el dashboard |
| `ADMIN_AUTH_PASS` | Preview + Production | Configurada manualmente por Andrés en el dashboard |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Todos los deployments (System Environment Variable) | Generada automáticamente por Vercel al activar Protection Bypass for Automation |

Ninguna de las tres tiene prefijo `VITE_` — por diseño, no son procesadas por el build de Vite y no llegan al bundle del cliente, confirmado empíricamente en cada subetapa mediante inspección directa de `dist/assets/*.js`.

---

## 12. Riesgos mitigados

- **Exposición sin autenticación de `/admin`** (hallazgo propio de esta fase, adyacente a Tema E de FASE 19): `/admin` ya no es accesible sin credencial válida. Antes de esta fase, cualquiera que conociera o adivinara la URL veía el registro completo de clientes y podía operar el Generador.

## 13. Riesgos abiertos — sin modificar en esta fase

- **`public/clientes/{slug}/config.json` sigue público sin autenticación**, para cada cliente individualmente (Tema E de FASE 19, documentado desde esa auditoría, no resuelto por esta fase). Contiene `apps_script_url`/`sheet_id` en texto plano. Fuera de alcance de FASE 28 desde su diagnóstico inicial.
- **RIESGO-C** (`data/clientes/index.json` embebido en el bundle JS público, vía `ClientesPage.jsx`): confirmado sin resolver. La autenticación de `/admin` protege el *punto de entrada* de la interfaz administrativa, pero no oculta datos ya embebidos en el bundle que cualquier visitante de cualquier invitación pública descarga — hallazgo verificado empíricamente durante Etapa 2A (bundle único compartido entre `/admin` y todas las invitaciones).
- **MAU-3, etapas posteriores a la primera** (FASE 27): sin definir, sin iniciar.
- **MAU-4** (señalización explícita de fallos críticos): sin iniciar.
- **Vista operativa de RSVP para P1/P2/P3** (línea B del alcance original de FASE 28): sin iniciar. El contrato de lectura (`action=getConfirmados`, FASE 26) sigue sin ninguna superficie administrativa que lo consuma — es el punto de partida más directo para la fase siguiente.

---

## 14. Lecciones aprendidas

- **Routing Middleware y Vercel Functions no son intercambiables** en un proyecto sin framework detectado — la falla de A fue de bundling de dependencias específico de "Other"/Vite, no un error de diseño ni de concepto.
- **Deployment Protection intercepta también el tráfico saliente de las propias Functions**, no solo el entrante de navegador — hallazgo no anticipado en el diseño original de Etapa 2, descubierto empíricamente en Etapa 2A. Protection Bypass for Automation es el mecanismo nativo correcto para este caso específico.
- **Un fallo puede deberse a scope de configuración (rama, ambiente), no a incapacidad técnica del mecanismo probado** — el `FAIL` inicial de 1B.2 no invalidaba la hipótesis; el diagnóstico correcto evitó descartar una vía válida por una causa equivocada.
- **La disciplina de rama nueva por subetapa, con Preview antes de cualquier merge, y auditoría pre/post-merge, contuvo el único cambio de mayor radio de impacto de la fase** (`vercel.json` en Etapa 2C) sin incidentes en producción.
- **La verificación empírica en Preview fue indispensable en cada subetapa** — ni la auditoría de dependencias con evidencia real de npm, ni el razonamiento arquitectónico previo, permitieron predecir con certeza ni la falla de A ni el bloqueo de Deployment Protection en 2A; solo el Preview los reveló.
- **Un mensaje de error del SPA no relacionado con la prueba en curso puede generar ruido de diagnóstico** — el caso `"No se pudo cargar la invitación."` en Etapa 2A parecía inicialmente un fallo del self-fetch; el diagnóstico correcto (comportamiento preexistente reproducible con `/index.html` directo, sin código de la fase) evitó una corrección innecesaria fuera de alcance.

---

## 15. Estado final en producción

- `/admin` protegido con Basic Auth en producción real, verificado.
- `api/admin-gate.js`, Vercel Function Node.js, forma parte oficial de la arquitectura del proyecto.
- `vercel.json` con las reglas de `/admin`/`/admin/*` antes de la catch-all preexistente, sin alterarla.
- Cero dependencias nuevas en `package.json`/`package-lock.json`.
- Ningún archivo de `src/**`, `public/clientes/**`, `data/clientes/index.json`, Apps Script, Contrato RSVP v2, o catálogo comercial fue modificado en ningún punto de la fase.

**Commit final:** `364c3ca`.

---

## 16. Decisiones cerradas — NO REABRIR

- Alternativa A (Routing Middleware) queda descartada para este proyecto — no reintentar sin evidencia nueva de que Vercel cambió el comportamiento de bundling para proyectos "Other"/Vite.
- El mecanismo de servido de `index.html` post-autenticación es self-fetch en tiempo de request con Protection Bypass for Automation — no `includeFiles`/`fs.readFileSync`, que no llegó a probarse por no haber sido necesario.
- La denominación de archivo `api/admin-gate.js` y su ubicación quedan fijadas como parte de la arquitectura oficial.
- `config.json` por cliente permanece deliberadamente fuera de alcance de autenticación — su exposición es un riesgo conocido, distinto y no resuelto por esta fase.

## 17. Fuera de alcance de FASE 28 — confirmado sin modificar en ningún punto

`src/**`, `public/clientes/**`, `data/clientes/index.json`, `package.json`, `package-lock.json`, Apps Script (`handleRsvpV2`, `saveToSheetsV2`, `handleGetConfirmadosV2`), Contrato RSVP v2, cualquier template (S1/S2/S3/P1/P2/P3), `useConfig.js`, catálogo comercial, MAU-3 (etapas posteriores a FASE 27), MAU-4, RIESGO-C, CRUD de clientes, modelo Cliente/Evento, dashboard/analítica.

---

## 18. Changeset aplicado

```
api/admin-gate.js                      ← nuevo — Vercel Function Node.js, gate de Basic Auth + self-fetch de index.html
vercel.json                            ← rewrites de /admin y /admin/(.*) agregados antes de la catch-all existente
docs/Fase 28.md                        ← nuevo, este documento
docs/ESTADO_OFICIAL_PROYECTO.md        ← v18, sección 34 incorporada; secciones 1–32 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 28
```

**Variables de entorno de Vercel (fuera del repositorio, gestionadas en el dashboard):** `ADMIN_AUTH_USER`, `ADMIN_AUTH_PASS` (Preview + Production), `VERCEL_AUTOMATION_BYPASS_SECRET` (System Environment Variable, todos los deployments).
