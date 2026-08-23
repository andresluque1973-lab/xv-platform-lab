[Fase 29.md](https://github.com/user-attachments/files/31351478/Fase.29.md)
# FASE 29 — Vista Operativa RSVP (P1/P2/P3) — Subetapas 29.0 a 29.3

**Estado**: IMPLEMENTADA Y VALIDADA EN SU ALCANCE VERIFICABLE ACTUAL.

**Base de la fase**: `main` en `27366a5` ("Create Fase 28.md"), heredando
el cierre de FASE 28 (autenticación de `/admin`, `main` en `364c3ca` + dos
commits documentales posteriores).

---

## 1. Objetivo de la fase

Construir la primera herramienta operativa del panel `/admin`: una vista
de RSVP para clientes P1/P2/P3, apoyada en infraestructura ya validada
(autenticación de FASE 28, contrato de lectura `action=getConfirmados` de
FASE 26).

**Objetivo cumplido en su totalidad**: la Vista RSVP quedó completa e
implementada — selector de clientes elegibles, verificación de
configuración disponible, consulta real a `getConfirmados` y tabla de
confirmados de estructura fija. No queda ninguna subetapa abierta ni
ningún elemento del alcance original sin construir.

## 2. Subetapas y decisiones oficiales

### 29.0 — Verificación de supuestos (solo lectura) — VALIDADA
Auditoría del routing real de `/admin`, del campo de variante en
`data/clientes/index.json` y del shape real de `config.json`. Hallazgos
clave:
- `/admin` no tiene routing por URL debajo de `/admin` — `AdminShell.jsx`
  controla la navegación interna mediante un switch de tabs en memoria
  (`useState`), no mediante rutas.
- `index.json.template` no es fuente confiable de la variante efectiva de
  un cliente (mayormente `null`, desincronizado por diseño — `CONTRATO.md`
  §8).
- El template efectivo se resuelve únicamente leyendo el `config.json`
  propio de cada cliente (mismo mecanismo que `useConfig.js`).
- El shape real de `getConfirmados` (evidencia de `src/templates/P1.jsx`
  y `docs/Fase 26.md`): éxito = array plano de `{ nombre, apellido,
  asistencia, restricciones, observaciones }`; error = `{ ok: false,
  error: "..." }`.

### 29.0.1 — Definición de fuente de elegibilidad — VALIDADA
Regla de elegibilidad para la Vista RSVP, aprobada sin excepciones:
1. `data/clientes/index.json` aporta el universo de slugs candidatos y el
   filtro operacional `deploy_estado === "deployed"`.
2. `index.json.template` no participa en la decisión.
3. La variante efectiva se resuelve en runtime leyendo el `config.json`
   propio de cada cliente candidato.
4. `templateRegistry[config.template].category === "premium"` determina
   si el cliente es P1/P2/P3.

Decisión explícita aprobada: con el catálogo actual, la Vista RSVP puede
aparecer vacía en producción — esto representa correctamente el estado
real del catálogo y no debía forzarse a mostrar algo distinto.

**Decisión explícita sobre el fixture `prueba` (formulación final, sin
ambigüedad)**: `prueba` no se incorpora al universo productivo, no se
agrega a `index.json`, y no se usa como sustituto de un cliente P1/P2/P3
real en ningún punto de la fase. No existe ninguna condición especial
por slug en el código. Su ausencia en el selector de la Vista RSVP se
explica exclusivamente porque no está registrado en `index.json` — el
mismo comportamiento que tendría cualquier otro slug no registrado.

### 29.1 — Tab RSVP (shell) en AdminShell — VALIDADA
Agrega el tercer tab `RSVP` a `AdminShell.jsx` (mismo patrón que
`Generador`/`Clientes`) y el componente `RsvpPage.jsx`, que resuelve el
universo de clientes elegibles según la regla de 29.0.1 y los muestra en
un selector.

**Evidencia de Preview**:
- `/admin` con Basic Auth: OK. Generador: OK. Clientes: OK. Tab RSVP:
  aparece correctamente.
- Requests a `config.json` al abrir RSVP: `sofia`, `valentina`, `andres`,
  `caracas` — los 4 clientes `deployed` de `index.json`.
- `prueba/config.json`: no solicitado.
- `getConfirmados`: 0 requests.
- Vista RSVP: estado vacío esperado ("No hay clientes P1/P2/P3
  desplegados todavía...") — comportamiento correcto del catálogo actual,
  no un defecto.

### 29.2 — Resolución de configuración del cliente seleccionado — VALIDADA
Amplía `resolverElegibilidad` para retener `apps_script_url`/`sheet_id`
del mismo `config.json` ya obtenido en 29.1 (sin fetch adicional), y
agrega la verificación de disponibilidad de esos dos campos al
seleccionar un cliente.

**Evidencia de Preview**: idéntica a 29.1 en los puntos comunes (Basic
Auth, Generador, Clientes, RSVP, requests a `config.json`, ausencia de
`prueba`, 0 requests a `getConfirmados`, 0 errores de consola).

### 29.3 — Consulta real a `getConfirmados` y tabla de confirmados — VALIDADA
Agrega un segundo `useEffect` (dependiente de `[seleccionado,
elegibles]`, mismo patrón `cancelado` que 29.1) que dispara la consulta
real a `action=getConfirmados` únicamente cuando `configDisponible ===
true`, reutilizando exactamente el contrato ya validado en FASE 26
(mismo patrón de `P1.jsx`/`P2.jsx`/`P3.jsx`). Agrega una tabla de
estructura fija (columnas Nombre / Apellido / Asistencia / Restricciones
/ Observaciones) con cuatro estados de cuerpo mutuamente excluyentes:
cargando, vacío, error, datos. La traducción de `asistencia`
(`"si"→"Confirma"`, `"no"→"No asiste"`) ocurre únicamente en el punto de
render — el vocabulario canónico del contrato permanece intacto en
memoria.

Decisión de diseño aprobada: no se conserva el mensaje técnico de error
del backend en la UI (estado simplificado — solo `estadoRsvp`/
`confirmados`, sin `errorRsvp`).

**Evidencia de Preview**:
- Basic Auth: OK
- Generador: OK
- Clientes: OK
- RSVP: OK
- `config.json`: `sofia`, `valentina`, `andres`, `caracas` — OK
- `prueba`: no aparece
- `getConfirmados`: 0 requests en el catálogo actual
- Consola: 0 errores

## 3. Resumen de archivos modificados en toda la fase

Verificado mediante `git diff --stat` de `main` (`27366a5`) contra el
estado final de código de la fase (`d51e5de`):

```
 src/admin/AdminShell.jsx |   4 +
 src/admin/RsvpPage.jsx   | 455 +++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 459 insertions(+)
```

Ningún otro archivo del repositorio fue modificado en ningún punto de la
fase. Verificado explícitamente sin diferencias: `data/clientes/
index.json`, `public/clientes/*/config.json` (ningún cliente),
`src/templates/templateRegistry.js`, `src/templates/{P1,P2,P3}.jsx`,
`docs/CONTRATO_RSVP_v2.md`. Apps Script no fue tocado (no versionado en
el repositorio; no se realizó ningún cambio conceptual sobre él — la
fase solo consume la rama `action=getConfirmados` ya existente desde
FASE 26).

## 4. Riesgos y observaciones abiertas — sin cambios por esta fase

- **RIESGO-C** (bundle único compartido entre `/admin` y las invitaciones
  públicas, con `data/clientes/index.json` embebido): permanece exactamente
  igual que al cierre de FASE 28. Esta fase no lo agrava ni lo resuelve —
  `RsvpPage.jsx` importa `index.json` de forma estática, igual que ya
  hacía `ClientesPage.jsx` desde antes de FASE 29.
- **`public/clientes/{slug}/config.json` público sin autenticación, por
  cliente individual**: sin cambios. Esta fase reutiliza ese hecho ya
  conocido (fetch same-origin a un archivo ya público) para resolver
  elegibilidad y configuración — no introduce una exposición nueva, pero
  tampoco la resuelve.
- Ambos riesgos quedan, como en FASE 28, conscientes y explícitamente
  fuera de alcance de esta fase.

## 5. Dependencia de validación futura

El catálogo productivo actual (`sofia`, `valentina`, `andres` sin
`template`; `caracas` con `template: "S1"`) no contiene ningún cliente
P1/P2/P3 real. **Esto no constituye una limitación de la fase ni una
deuda de implementación** — la Vista RSVP está completa, implementada, y
validada en todo lo que el catálogo actual permite verificar.

**Dependencia de validación futura**: la validación funcional con datos
reales de `getConfirmados` (selector con al menos un cliente elegible
listado, cálculo de `configDisponible` sobre una selección real, y tabla
de confirmados con datos reales) podrá completarse cuando exista el
primer cliente productivo P1/P2/P3 elegible. Es la ausencia de un dato
externo que la fase no podía generar por sí misma, no un elemento de
alcance pendiente.

`prueba` no fue utilizado en ningún punto de la FASE 29. Su ausencia del
selector se explica exclusivamente porque no está registrado en
`data/clientes/index.json`. No se modificó `index.json`, `config.json`
ni ningún otro archivo para habilitarlo.

## 6. Estado final

`RsvpPage.jsx` y el tab `RSVP` en `AdminShell.jsx` quedan implementados,
buildeados sin errores en cada subetapa, y validados en Preview en todo
lo que el catálogo actual permite verificar. Ningún archivo fuera de esos
dos fue tocado. Lista para merge a `main` bajo el mismo protocolo de
auditoría pre/post-merge usado en FASE 28.

**FASE 29 — IMPLEMENTADA Y VALIDADA EN SU ALCANCE VERIFICABLE ACTUAL.**

Documento de referencia de decisiones detalladas de diseño: historial de
chat de FASE 29 (Subetapas 29.0 a 29.3). Este documento resume el
resultado oficial.
