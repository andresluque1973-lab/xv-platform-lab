[Fase 27.md](https://github.com/user-attachments/files/30866178/Fase.27.md)
# FASE 27 — MAU-3, primera etapa: verificación de consistencia del registro de clientes y regularización de `caracas`

Estado: **CERRADA**
Fecha de cierre: 2026-08-08

---

## 1. Objetivo de la fase

Iniciar MAU-3 ("Fuente Dinámica de Registro de Clientes", definido en FASE 20) abordando el problema evidenciado por el hallazgo de FASE 25: `public/clientes/caracas/` existía en `main` con un `config.json` real y funcional, sin entrada correspondiente en `data/clientes/index.json` — y nada en el sistema lo señalaba.

Encuadre explícito, según decisión de Andrés: esta fase **no reinterpreta ni renombra MAU-3**. La denominación histórica se mantiene sin cambios. FASE 27 constituye su **primera etapa**: resuelve el problema evidenciado por la auditoría mediante un mecanismo de verificación de consistencia, sin cerrar la puerta a evoluciones futuras (por ejemplo, un registro dinámico en sentido literal) si alguna vez resultaran necesarias. MAU-3 permanece abierto; esta fase no lo cierra.

---

## 2. Auditoría inicial de fase

Clon fresco del repositorio contra el commit `5c0d2322e3b9d5a4ed3ab056481168efdf9ec18a` (merge de FASE 26 a `main`), confirmado por `git rev-parse HEAD` contra el hash provisto por Andrés al abrir el chat — punto administrativo pendiente de FASE 26 confirmado como resuelto.

Confirmado por lectura directa de código:

- `data/clientes/index.json` ya cuenta con un contrato de schema formal y maduro (`data/clientes/CONTRATO.md`, v1, §1–§12), previo a esta fase.
- Único consumidor de `index.json` en código: `src/admin/ClientesPage.jsx`, vía `import` estático de Vite, solo lectura. El propio archivo documenta el riesgo de bundle (RIESGO-C) como "conocido y aceptado".
- El runtime público **no consume `index.json` en ningún punto**. Cadena confirmada: `xv_birthday_card.jsx` (routing por `window.location.pathname`) → `TemplateLoader.jsx` → `useConfig.js` (`fetch('/clientes/${slug}/config.json')`). Registro operativo y runtime público están completamente desacoplados, tal como documenta `CONTRATO.md` §1.
- `GeneradorPage.jsx` no escribe en `index.json` — no hay backend; el alta de clientes en el registro es 100% manual.
- `public/clientes/caracas/config.json` confirmado: `apps_script_url` y `sheet_id` reales, `plan: STANDARD`, `template: S1`, evento `2028-01-15`. Sin entrada en `index.json` al momento de la auditoría.
- **Hallazgo adicional, no reportado en fases anteriores**: `public/clientes/prueba/` (fixture de testing) tampoco tenía entrada en `index.json`. Evaluado sin riesgo arquitectónico asociado — documentado como observación, sin ampliar el alcance de esta fase, según instrucción explícita de Andrés.

**Anomalía de entorno detectada y descartada**: al iniciar la implementación, el directorio de trabajo del entorno de ejecución contenía cambios no comiteados (`scripts/validar-registro-clientes.js`, `docs/Fase 27.md`, modificaciones de `index.json`/`package.json`) con contenido casi idéntico al implementado en esta fase, pero no presentes en el commit `5c0d232` (verificado con `git show --stat` y `git cat-file -p HEAD:...`). Se interpretó como residuo de entorno, no como estado real del repositorio, y se descartó explícitamente (`git checkout -- .` + `git clean -fd`) antes de generar la implementación real desde el HEAD verificado.

---

## 3. Decisiones arquitectónicas adoptadas

1. **No se construye un registro dinámico en sentido literal** (backend, KV externo, Sheet externo). El proyecto no tiene backend salvo el Apps Script de RSVP, y todo alta de cliente ya requiere commit + deploy manual — introducir una dependencia externa nueva no resuelve el síntoma real evidenciado por `caracas`, que es de **consistencia no detectada**, no de **latencia de actualización**.
2. **Alternativa adoptada: script de validación de consistencia**, de solo lectura, sin dependencias nuevas, ejecutable manualmente. Ataca la causa raíz: la ausencia de un mecanismo que señale la divergencia entre `public/clientes/*` e `index.json`.
3. **Regularización puntual de `caracas`** en `index.json`, conforme al schema `CONTRATO.md` v1 vigente, sin modificarlo.
4. **Fechas de `creado_en`/`deployed_en` de `caracas`**: sin evidencia documental de las fechas reales, se usa la fecha de esta regularización (`2026-08-08`) como fecha de incorporación oficial al registro, por decisión explícita de Andrés. Documentado en el campo `notas` de la propia entrada.
5. **`prueba` queda fuera de alcance**, documentado como observación abierta, sin acción en esta fase — no emergió ningún riesgo arquitectónico adicional durante el análisis que justificara ampliar el alcance.
6. **RIESGO-C (bundle JS de `/admin`) no se resuelve en esta fase** — decisión consciente, no omisión. `ClientesPage.jsx` no fue modificado.
7. MAU-3 permanece con su denominación histórica ("Fuente Dinámica de Registro de Clientes"); esta fase se documenta como su primera etapa, no como su cierre ni como una reinterpretación del objetivo definido en FASE 20.

---

## 4. Implementación realizada

### 4.1 `scripts/validar-registro-clientes.js` (nuevo)

Script Node.js puro (sin dependencias nuevas), de solo lectura. Compara las carpetas de `public/clientes/` contra las entradas de `data/clientes/index.json` y reporta:

1. Huérfanos de registro (carpetas sin entrada en `index.json`).
2. Huérfanos de filesystem (entradas en `index.json` sin carpeta correspondiente).
3. Presencia del slug reservado `"admin"` en el registro (`CONTRATO.md` §6).

No valida el contenido de `config.json` contra el Contrato Ejecutable de Configuración (MAU-1) — esa validación ya existe en `useConfig.js`/`AdminPage.jsx` y queda fuera de alcance de este script. No modifica ningún archivo. Código de salida distinto de cero si hay hallazgos.

### 4.2 `package.json`

Agregado el comando `"validar:clientes": "node scripts/validar-registro-clientes.js"`. Ningún script existente (`dev`, `build`, `preview`) modificado.

### 4.3 `data/clientes/index.json`

Agregada la entrada de `caracas`, siguiendo estrictamente el schema de `CONTRATO.md` §3: `plan: "STANDARD"`, `template: "S1"`, `fecha_evento: "2028-01-15"`, `deploy_estado: "deployed"` (cumple las condiciones de §4/§5: carpeta existente, `config.json` completo, `/caracas` accesible públicamente), `creado_en`/`deployed_en: "2026-08-08"`, con la decisión sobre las fechas documentada explícitamente en `notas`. Versión del schema (`"version": "1"`) sin cambios — no constituye una ruptura de compatibilidad según §11.

Ningún registro fundacional (`sofia`, `valentina`, `andres`) modificado.

---

## 5. Archivos modificados

```
scripts/validar-registro-clientes.js  ← nuevo
package.json                          ← agregado comando validar:clientes
data/clientes/index.json              ← agregada entrada de caracas
docs/Fase 27.md                       ← nuevo, este documento
```

`ClientesPage.jsx`, `AdminPage.jsx`, `GeneradorPage.jsx`, cualquier template (S1/S2/S3/P1/P2/P3), `useConfig.js`, Apps Script, `CONTRATO.md` (catálogo y clientes) — sin modificación en esta fase.

---

## 6. Validaciones ejecutadas

- **Evidencia "antes"**: `node scripts/validar-registro-clientes.js` contra el registro sin regularizar → reporta 5 carpetas en `public/clientes/` vs. 3 entradas en `index.json`; huérfanos detectados: `caracas`, `prueba`. Exit code 1.
- **Evidencia "después"**: `npm run validar:clientes` tras la regularización de `caracas` → 5 carpetas vs. 4 entradas; único huérfano restante: `prueba` (esperado y documentado, fuera de alcance). Exit code 1 (por `prueba`, no por `caracas`).
- Confirmado que `caracas` ya no aparece en la lista de huérfanos de registro tras la regularización.

---

## 7. Resultados obtenidos

`caracas` queda formalmente incorporado a `data/clientes/index.json`, visible en `/admin` → `Clientes` con su clasificación correcta (`deployed`, `STANDARD`, `S1`). El proyecto cuenta, por primera vez, con una herramienta reproducible para detectar la próxima divergencia entre `public/clientes/` e `index.json` antes de que quede olvidada — el mismo tipo de hallazgo que originó esta fase.

---

## 8. Incidencias detectadas y resolución

| Incidencia | Origen | Resolución |
|---|---|---|
| `caracas` con `config.json` real y funcional, sin entrada en `index.json` | Hallazgo de FASE 25, confirmado en auditoría de FASE 27 | Regularizado en `index.json`, conforme a `CONTRATO.md` v1 |
| `prueba` (fixture de testing) tampoco registrado en `index.json` | Detectado en auditoría de FASE 27 | Documentado como observación abierta, sin riesgo arquitectónico asociado, sin acción — fuera de alcance por instrucción explícita |
| Directorio de trabajo del entorno con cambios no comiteados equivalentes a esta implementación, no presentes en el commit verificado | Detectado al iniciar la implementación de FASE 27 | Descartado explícitamente (`git checkout` + `git clean`); implementación regenerada desde el HEAD verificado |

---

## 9. Decisiones cerradas — NO REABRIR

- MAU-3 mantiene su denominación histórica "Fuente Dinámica de Registro de Clientes" — no fue renombrado ni reinterpretado en esta fase.
- Esta fase es la **primera etapa** de MAU-3, no su cierre. Etapas futuras no están definidas.
- No se construyó infraestructura de registro dinámico en sentido literal (backend, KV, Sheet externo) — descartado por falta de evidencia de que el problema real lo requiera.
- Las fechas `creado_en`/`deployed_en` de `caracas` usan la fecha de regularización (`2026-08-08`), no una fecha original — decisión documentada, no inferida.
- RIESGO-C (bundle JS de `/admin`) permanece sin resolver — decisión consciente.

---

## 10. Estado final de la fase

**FASE 27 CERRADA.** Primera etapa de MAU-3 implementada: script de validación de consistencia (`npm run validar:clientes`) y regularización de `caracas` en `data/clientes/index.json`. `prueba` documentado como observación abierta, sin acción. Sin desvíos arquitectónicos entre lo aprobado y lo implementado.

**Pendiente, no iniciado**: siguientes etapas de MAU-3 (alcance no definido); cualquier decisión sobre `prueba`; cualquier aplicación administrativa futura sobre `RSVP_VELA` (iniciativa independiente, ya señalada como pendiente desde FASE 26).
