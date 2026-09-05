[Fase 31.md](https://github.com/user-attachments/files/31857834/Fase.31.md)
[Fase 31.md](https://github.com/user-attachments/files/31767956/Fase.31.md)
# FASE 31 — Transición de arquitectura a producto: validación E2E del MVP

Estado: ANÁLISIS Y VALIDACIÓN E2E COMPLETOS EN PREVIEW. CAMBIOS MERGEADOS A
`main` (PR #48, commit `92ef6ad`). HALLAZGOS DE PRODUCTO DOCUMENTADOS Y
DELIBERADAMENTE NO CORREGIDOS EN ESTA FASE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Objetivo de la fase

A partir de FASE 31, el criterio de trabajo cambió: dejar de perfeccionar
arquitectura por anticipación y determinar, con evidencia empírica, si VELA
puede entregar su primera invitación real a un cliente. Objetivo explícito
del proyecto (no de arquitectura): "¿Qué necesita VELA para poder entregar
su primera invitación digital a un cliente real?"

## Metodología

Análisis estático completo del repositorio real (sección 1), seguido de
validación end-to-end con un cliente de prueba controlado, aislado de
producción, siguiendo el flujo real del producto (alta → configuración →
publicación → invitación pública → RSVP → getConfirmados → /admin).

## 1. Hallazgo A1 — Catálogo comercial desalineado (corrección mergeada a `main`)

`data/catalogo/templates.js` marcaba S3, P1, P2 y P3 como "proximamente",
pese a que las FASES 15-18, 25, 26, 29 y 30 dan esos templates por
completos e implementados. Efecto concreto: en el Generador (modo normal,
sin activar "Modo Validación"), el operador solo podía seleccionar S1, S2
y P1 (este último por un override manual, `LEGACY_VISIBLE`).

Corrección mergeada a `main` (PR #48): los cuatro valores pasan a
`"disponible"`. Cambio de una sola dimensión (visibilidad comercial),
sin tocar `LEGACY_VISIBLE` ni ningún otro archivo. Build verificado
localmente antes del merge. Verificado nuevamente contra `main`
post-merge: contenido idéntico al preparado.

## 2. Cliente de prueba controlado — `prueba-e2e-p1`

Creado según la regla especial de FASE 31 (excepción operativa autorizada
para validar el producto end-to-end sin requerir un cliente comercial
real). Slug `prueba-e2e-p1`, template P1, `_fixture: true`, datos 100%
ficticios. Backend aislado (Google Sheet + Apps Script Web App nuevos, sin
relación con el recurso compartido de `andres`/`caracas`/`prueba`).
Validado contra MAU-1 (`validate()`/`REQUIRED_FIELDS.P1` real): 0 campos
faltantes. Validado contra el validador de consistencia de FASE 27
(`scripts/validar-registro-clientes.js`): sin divergencias. No modifica
ningún cliente existente (diff puramente aditivo, confirmado línea por
línea).

Registro actual en `data/clientes/index.json`, sin modificar:

```
"deploy_estado": "draft",
"deployed_en": null
```

Estos valores reflejan el estado real del cliente respecto del ciclo de
vida documentado en `data/clientes/CONTRATO.md`, incluso después del
merge a `main` (PR #48): estar mergeado a `main` no equivale, por sí
solo, a un despliegue formal conforme a ese ciclo de vida — el campo se
actualiza como paso explícito y deliberado, sujeto a verificación y
decisión conforme al contrato vigente. No se fuerza este campo para
habilitar validaciones — ver sección 6.

## 3. Validación E2E — resultados

| Etapa | Resultado | Evidencia |
|---|---|---|
| `getConfirmados` | OK | Validado en vivo, devuelve los registros reales (`Prueba/FASE31/si`, `B1/FASE31/si`) |
| Persistencia RSVP | OK | Validado en vivo, fila confirmada en `RSVP_VELA` aislado |
| Invitación pública — carga y funcionamiento general | OK | Carga correctamente en Preview |
| Invitación pública — `Regalos` | No aplica en esta prueba | No forma parte del fixture `prueba-e2e-p1` (sección opcional, deliberadamente omitida en la propuesta aprobada) |
| Invitación pública — privacidad de `ConfirmadosSection` | HALLAZGO PENDIENTE | Ver sección 5 |
| `/admin → RSVP` | PENDIENTE DE VALIDACIÓN POSTERIOR | Ver sección 6 |
| Network tras corrección de permisos de Apps Script | OK | Sin 401/`ServiceLogin`; `rsvp` y `getConfirmados` funcionan |

## 4. Hallazgo B1 — RSVP con éxito garantizado, sin verificación de persistencia real

Diagnosticado con evidencia empírica de DevTools → Network. Se distinguen
explícitamente dos cosas, que no deben confundirse entre sí:

- **Causa del fallo observado en esta fase**: el deployment de Apps
  Script aislado, en el momento de la primera prueba E2E, tenía su
  permiso de acceso configurado como `"Solo tú"`. Esto producía, para
  cualquier petición sin la sesión de Google de Andrés, la secuencia
  `302 → ServiceLogin → 401` — enmascarada del lado del frontend por
  `mode: "no-cors"` en `P1.jsx`, `ConfirmSection.handleSubmit`
  (líneas 981-1006).
- **Corrección aplicada**: cambio del permiso del Web App a
  `"Cualquiera"`, del lado de Google. No requirió ningún cambio de código
  en VELA. Confirmado en vivo: tras el cambio, `rsvp` y `getConfirmados`
  funcionan sin `401`/`ServiceLogin`.
- **Debilidad arquitectónica pendiente, no resuelta por este fix**: el
  frontend sigue usando `mode: "no-cors"` en la escritura y marca
  `status: "success"` tanto en el `try` como en el `catch`
  (líneas 1002 y 1004) — no distingue petición enviada, respuesta
  recibida, respuesta exitosa, ni persistencia real. Cualquier fallo
  futuro, de cualquier causa distinta a la de esta fase, volvería a
  mostrar "¡Gracias!" al invitado sin ninguna señal de alarma. **El fix
  de permisos resolvió la causa puntual observada en esta fase — no
  resuelve la debilidad de fondo.** No corregido en FASE 31, por
  decisión explícita — queda registrado para una fase futura.

## 5. Hallazgo nuevo — `ConfirmadosSection` expuesta en la invitación pública

Confirmado por lectura directa de `P1.jsx` (línea 1407): la lista de
confirmados se renderiza sin ninguna condición para cualquier visitante de
la invitación pública de un cliente P1 (mismo patrón esperable en P2/P3,
sin confirmar empíricamente para esos dos). Contradice la decisión de
producto fijada en esta fase: la vista de confirmados debe ser exclusiva
del propietario/administrador vía `/admin`, no visible para los
invitados. No corregido en FASE 31, por decisión explícita — queda
registrado para una fase futura.

## 6. `/admin → RSVP` — pendiente de validación posterior (no es un error técnico)

`prueba-e2e-p1` no aparece como candidato en `/admin → RSVP` en el
Preview actual. Causa determinada por análisis estático de
`RsvpPage.jsx` (líneas 154-157): el universo candidato de la Máquina A
se filtra primero por `deploy_estado === 'deployed'` sobre
`data/clientes/index.json`, antes de evaluar template/elegibilidad.
`prueba-e2e-p1` tiene `deploy_estado: "draft"`, coherente con
`CONTRATO.md`, dado que el cliente corre en Preview pero no fue
mergeado a `main`. Comportamiento correcto del código según el contrato
actual — no es un bug de la Máquina A (FASE 30).

Decisión explícita: no forzar `deploy_estado: "deployed"` para validar
artificialmente esta etapa. `deploy_estado` y `deployed_en` permanecen sin
modificar (`"draft"` / `null`). `/admin → RSVP` queda pendiente de
validación posterior, una vez que `prueba-e2e-p1` sea realmente
desplegado en producción y su registro pase legítimamente a
`deploy_estado: "deployed"` conforme al ciclo de vida del proyecto — no
se afirma que el merge a `main` por sí solo produzca ese cambio de
estado; el registro se actualiza como paso explícito y deliberado del
proceso, no como efecto automático del merge.

## 7. Hallazgo A2 — Open Graph hardcodeado, confirmado empíricamente

Confirmado en el Preview: al compartir la URL por WhatsApp no aparece
imagen, título ni descripción diferenciada — `index.html` es estático y
único para todo el sitio multi-tenant. No corregido en FASE 31, por
decisión explícita — queda registrado para una fase futura.

## 8. Pendiente para la siguiente fase

- Validación de `/admin → RSVP` en producción — condicionada a que
  `prueba-e2e-p1` sea desplegado formalmente conforme al ciclo de vida
  documentado en `data/clientes/CONTRATO.md`, y a que `deploy_estado` se
  actualice a `"deployed"` como paso explícito, sujeto a verificación y
  decisión conforme al contrato vigente. El merge a `main` (ya ocurrido,
  PR #48) no habilita ni obliga por sí solo ese cambio de estado.
- A2 (Open Graph hardcodeado) — definir y aprobar alcance de corrección.
- Debilidad arquitectónica B1 (verificación real de persistencia en el
  frontend, más allá del fix puntual de permisos ya aplicado) — definir
  y aprobar alcance de corrección.
- Privacidad de `ConfirmadosSection` (ocultar de la invitación pública,
  dejar exclusivo de `/admin`) — aplica a P1/P2/P3 por igual, pendiente
  confirmar si P2/P3 comparten el mismo patrón de código.
- Retiro posterior del fixture `prueba-e2e-p1`, una vez agotado su
  propósito de validación, según la regla de reversibilidad ya acordada.
- Backlog sin cambios en esta fase: MAU-3 (continuación), MAU-4,
  RIESGO-C, exposición de `config.json`.

## 9. Principios reforzados en esta fase

- Distinción entre "código correcto según su contrato" y "estado
  operativo real no reflejado en el registro" (caso `deploy_estado` de
  `prueba-e2e-p1`) — no se fuerza el registro para forzar una
  validación, ni se asume que un merge futuro actualiza ese campo por sí
  solo.
- Un hallazgo de producto (privacidad de confirmados) puede surgir de una
  fase de validación técnica sin haber sido buscado — se documenta como
  hallazgo nuevo, no se corrige en la misma fase sin aprobación
  explícita.
- Verificación empírica real (DevTools/Network) fue decisiva para
  diagnosticar B1 con causa raíz concreta — el análisis de código por sí
  solo había identificado la debilidad arquitectónica pero no la causa
  puntual del fallo observado.
- Corregir la causa puntual de un fallo (permisos del deployment) no
  equivale a resolver la debilidad arquitectónica de fondo que permitió
  que ese fallo pasara desapercibido — ambas cosas se registran por
  separado, sin mezclar su estado de resolución.
