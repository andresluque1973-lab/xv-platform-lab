[Fase 30.md](https://github.com/user-attachments/files/31402108/Fase.30.md)
# FASE 30 — Máquina A de `RsvpPage.jsx`: distinción elegible / no_elegible / no_verificable

**Estado: CERRADA**
**`main` post-merge: `60b2e0e`**
**PR: #47 — branch `fase-30-rsvp-maquina-a` → `main`**

---

## 1. Objetivo

Corregir una ambigüedad detectada por auditoría posterior al cierre de FASE 29 en la Máquina A de `RsvpPage.jsx` (resolución de elegibilidad de candidatos P1/P2/P3): un fallo al verificar la elegibilidad de un candidato (`config.json` inaccesible, JSON inválido, sin red) se colapsaba al mismo valor de retorno (`null`) que un candidato legítimamente no elegible por regla de negocio (S1/S2/S3). Esto hacía indistinguible, desde la interfaz de `/admin`, "no hay clientes elegibles" de "no se pudo verificar si hay clientes elegibles".

El objetivo aprobado fue evitar esa confusión, preservando íntegramente la regla de elegibilidad definida y congelada en FASE 29 (Subetapa 29.0.1).

## 2. Origen

Hallazgo de auditoría de estados administrativos del panel `/admin` (`AdminShell.jsx`, `GeneradorPage.jsx`, `ClientesPage.jsx`, `RsvpPage.jsx`), solicitada explícitamente por la dirección técnica como preparación para una posible FASE orientada a observabilidad. La auditoría identificó la ambigüedad de la Máquina A como el hallazgo de mayor relevancia, y la dirección técnica decidió tratarlo como fase propia y acotada, en vez de absorberlo dentro de una iniciativa de observabilidad general (MAU-4), que permanece sin iniciar.

## 3. Etapa 1 — Análisis

Alcance: exclusivamente la Máquina A de `RsvpPage.jsx` (resolución de elegibilidad — `resolverElegibilidad()`, `resolverUniverso()`, y el estado de página que los consume). Explícitamente fuera: `getConfirmados`, Contrato RSVP v2, `configDisponible`, Máquina B completa, `templateRegistry.js`, `index.json`, `config.json`, Apps Script, MAU-3, RIESGO-C.

Conclusiones del análisis:

- **Modelo de estados**: el flujo real de `resolverElegibilidad()` produce tres desenlaces distintos, colapsados en dos valores de retorno (`objeto | null`). Modelo mínimo necesario: tres resultados explícitos por candidato — `elegible`, `no_elegible` (regla de negocio, silencioso), `no_verificable` (fallo de verificación, debe ser visible).
- **Granularidad del error**: combinación de ambos niveles. Por candidato es imprescindible porque `Promise.all` resuelve candidatos de forma independiente — un fallo no debe impedir la resolución del resto. Global es necesaria porque el selector solo muestra elegibles; sin una señal agregada, "0 elegibles por error" y "0 elegibles legítimo" seguirían siendo indistinguibles.
- **Impacto sobre FASE 29**: verificado explícitamente que la corrección no requiere modificar el Contrato RSVP v2, `getConfirmados`, la regla de elegibilidad congelada (29.0.1), `configDisponible`, ni la exclusión del fixture `prueba`. Contenible enteramente en `RsvpPage.jsx`.
- **UX mínima**: distinguir "no hay elegibles" de "no se pudo verificar", sin ruido para el caso mayoritario legítimo (S1/S2/S3), sin exponer errores técnicos crudos, sin convertir la vista en herramienta de diagnóstico. Prioridad aprobada: señal agregada (conteo), no detalle por cliente.
- **Riesgos identificados**: ruido si no se separa bien "no elegible" de "no verificable"; confusión con el vocabulario de error ya existente en la Máquina B; scope creep hacia observabilidad general; necesidad de decisión explícita de redacción antes de implementar; riesgo de sobre-ingeniería de la estructura de datos.

## 4. Etapa 2 — Diseño

Modelo interno aprobado:

```
ResultadoCandidato = {
  slug:      string,
  resultado: 'elegible' | 'no_elegible' | 'no_verificable',
  datos:     ClienteElegible | null   // solo presente cuando resultado === 'elegible'
}
```

Sin estructuras de error enriquecidas (sin causa técnica, sin código de excepción) — la etiqueta `no_verificable` es suficiente por sí sola.

Flujo de resolución: `resolverElegibilidad()` retorna siempre un `ResultadoCandidato` (nunca `null`); `resolverUniverso()` mantiene `Promise.all` sin cambios conceptuales y guarda la lista completa sin filtrar. `elegibles` y `noVerificables` se derivan por filtro, sin crear un nuevo estado global de página.

Casos mixtos diseñados explícitamente:

| Caso | Elegibles | No verificables | Comportamiento |
|---|---|---|---|
| A. Todos no elegibles | 0 | 0 | Mensaje FASE 29 sin cambios |
| B. Uno o más elegibles, sin errores | ≥1 | 0 | Selector normal, sin señal nueva |
| C. Sin elegibles, con errores | 0 | ≥1 | Mensaje nuevo — nunca equivalente al de "no hay elegibles" |
| D. Elegibles + errores | ≥1 | ≥1 | Selector normal + señal agregada de resolución parcial |

Redacción aprobada por la dirección técnica:

- Sin errores: sin cambios respecto de FASE 29.
- Elegibles + N no verificables: *"No se pudo verificar la elegibilidad de N cliente(s). Los resultados mostrados pueden estar incompletos."*
- 0 elegibles + N no verificables: *"No se pudo verificar la elegibilidad de N cliente(s). No hay clientes P1/P2/P3 confirmados para mostrar. El listado puede estar incompleto."*

## 5. Etapa 3 — Implementación + Revisión Técnica Pre-Preview

Implementación contenida en `src/admin/RsvpPage.jsx`:

- `resolverElegibilidad()`: clasifica `!res.ok` → `no_verificable`; excepción (`catch`) → `no_verificable`; `!entry || entry.category !== 'premium'` → `no_elegible` (mismo criterio de FASE 29, solo re-etiquetado); `category === 'premium'` → `elegible`.
- Estado de página: `elegibles` (useState) reemplazado por `resultados` (useState, lista completa sin filtrar).
- Render: dos bloques nuevos con la redacción aprobada, mutuamente excluyentes con el mensaje original de FASE 29.

**Decisión de implementación no prevista en el diseño original, formalmente aceptada por la dirección técnica**: derivar `elegibles`/`noVerificables` sin memoización habría roto la estabilidad de referencia que consume el `useEffect` de la Máquina B (`[seleccionado, elegibles]`), disparando `getConfirmados` en cada render en vez de solo al cambiar la selección. Se resolvió envolviendo ambas derivaciones en `useMemo(() => ..., [resultados])`, contenido enteramente en el mismo archivo, sin alterar el contrato ni el comportamiento de la Máquina B.

Revisión Técnica Pre-Preview (previa a cualquier Preview real) confirmó:

- Único archivo modificado: `src/admin/RsvpPage.jsx` (`git status --short`, `git diff --stat`).
- `git diff --check` sin salida (sin problemas de whitespace).
- Build real (`npm run build` / `vite build`) exitoso, sin errores ni warnings.
- Lectura estática confirmando que `elegibles` conserva el mismo shape, `seleccionado` sin cambios, `useEffect` de Máquina B con las mismas dependencias, `getConfirmados` sin modificar.
- Los cuatro escenarios de la matriz de diseño verificados por lectura de código, mutuamente excluyentes por construcción.

## 6. Etapa 4 — Validación Preview, Auditoría Pre-Merge y Merge

**Metodología aplicada**: implementación entregada como paquete de aplicación (contenido completo del archivo + checksum) para aplicación manual por el responsable del repositorio en branch dedicada, siguiendo el flujo habitual del proyecto — Claude no realiza commits, PRs, merges ni deploys directamente.

**Validación en Preview** (branch `fase-30-rsvp-maquina-a`):

- Deployment: Ready.
- `/admin → RSVP`: carga correctamente.
- Mensaje observado: *"No hay clientes P1/P2/P3 desplegados todavía. El catálogo productivo actual no incluye ningún cliente elegible para esta vista."* — idéntico al de FASE 29, sin ningún mensaje de `no_verificable`.
- Network: limpio, sin errores relevantes durante la resolución de candidatos.
- Console: limpia.
- **Escenario validado empíricamente**: 0 elegibles + 0 no_verificables. Los escenarios con elegibles reales y con `no_verificable` real permanecen pendientes por ausencia de candidatos P1/P2/P3 productivos en el catálogo actual (misma dependencia de validación futura ya registrada en FASE 29, ahora también aplicable a las ramas nuevas de esta fase).

**Auditoría pre-merge** (clon fresco de todas las referencias remotas, checkout limpio de la branch):

- Merge-base entre `main` y la branch = HEAD de `main` en el momento de la auditoría (`9512e01`) — sin drift.
- Único commit sobre `main`: `e9d8179`.
- Único archivo modificado: `src/admin/RsvpPage.jsx` (`git diff main..fase-30-rsvp-maquina-a --stat`).
- `git diff --check` sin salida.
- Checksum del archivo en la branch (`23d72396dc285ab8ed1a11346e158a1a`, 519 líneas) idéntico al del paquete de aplicación entregado — confirma aplicación sin desviaciones.
- Build re-ejecutado sobre el checkout real de la branch: exitoso.
- Confirmado por lectura del diff real: ausencia de cambios en Máquina B, Contrato RSVP v2, `configDisponible`, `getConfirmados`, Apps Script, `index.json`.
- Confirmado que `noVerificables` se consume exclusivamente vía `.length` en los tres puntos de render — ningún slug ni nombre de cliente `no_verificable` llega a la UI.
- Veredicto: branch apta para merge, a criterio de la dirección técnica.

**Merge**: PR #47, branch `fase-30-rsvp-maquina-a` → `main`. `main` post-merge: `60b2e0e`. Deployment de `main`: Ready. Verificado mediante clon fresco posterior al merge — checksum de `src/admin/RsvpPage.jsx` en `main` idéntico al auditado en pre-merge (`23d72396dc285ab8ed1a11346e158a1a`).

## 7. Riesgos y validaciones pendientes

- **RIESGO-C** (bundle único de `/admin` con `index.json` embebido): sin cambios. FASE 30 no toca ningún import de `index.json`.
- **Exposición de `config.json` público sin autenticación por cliente**: sin cambios. FASE 30 no modifica este archivo ni su mecanismo de acceso.
- **Validación funcional con datos reales, heredada de FASE 29 y ahora también aplicable a los escenarios nuevos**: los escenarios "elegibles + no_verificable" y "0 elegibles + no_verificable" no pudieron validarse empíricamente en Preview por ausencia de candidatos P1/P2/P3 productivos reales. No constituye deuda de implementación — es la ausencia de un dato externo que la fase no podía generar por sí misma. Queda condicionada a la existencia del primer cliente productivo P1/P2/P3 real, o a una prueba forzada intencional y explícitamente registrada como tal (no como sustituto del catálogo productivo).

## 8. Fuera de alcance de FASE 30

Contrato RSVP v2 (`docs/CONTRATO_RSVP_v2.md`), `action=getConfirmados`, `configDisponible`, Máquina B completa, Apps Script, `data/clientes/index.json`, `public/clientes/{slug}/config.json` de cualquier cliente, `templateRegistry.js`, exclusión del fixture `prueba` (sin cambios, sigue sin entrar nunca a `candidatos`), `ErrorBoundary`, logging, Sentry, `AdminStatusPanel`, observabilidad general del panel (MAU-4, sin iniciar), continuación de MAU-3, resolución de RIESGO-C.

## 9. Changeset aplicado

```
src/admin/RsvpPage.jsx                 ← único archivo funcional modificado (92 inserciones, 28 eliminaciones)
docs/Fase 30.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v20, secciones 38–39 incorporadas; secciones 1–36 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 30
```

## 10. Decisión de cierre

FASE 30 queda **CERRADA**. El objetivo aprobado (distinguir `elegible` / `no_elegible` / `no_verificable` en la Máquina A de `RsvpPage.jsx`, sin reabrir ninguna decisión de FASE 29) se cumplió en su totalidad dentro del alcance verificable con el catálogo productivo actual. La validación funcional completa de los escenarios con candidatos reales queda registrada como dependencia de validación futura, no como subetapa abierta de esta fase — mismo criterio ya establecido y aplicado en FASE 29.

**Decisiones cerradas — NO REABRIR sin evidencia nueva:**

- El modelo `elegible` / `no_elegible` / `no_verificable` y su mapeo de causas (sección 5).
- La redacción de los dos mensajes nuevos (sección 4), ya aprobada y ya vista en producción para el caso sin errores.
- El uso de `useMemo` como mecanismo de estabilidad de referencia para la Máquina B.
- El alcance excluido explícitamente en la sección 8.
