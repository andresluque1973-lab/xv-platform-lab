[Fase 27.md](https://github.com/user-attachments/files/30866582/Fase.27.md)
# FASE 27 — MAU-3, primera etapa: verificación de consistencia del registro de clientes, regularización de `caracas` y exclusión explícita de `prueba`

Estado: **CERRADA**
Fecha de cierre: 2026-08-08

---

## 1. Objetivo de la fase

Iniciar MAU-3 ("Fuente Dinámica de Registro de Clientes", definido en FASE 20) abordando el problema evidenciado por el hallazgo de FASE 25: `public/clientes/caracas/` existía en `main` con un `config.json` real y funcional, sin entrada correspondiente en `data/clientes/index.json` — y nada en el sistema lo señalaba.

Encuadre explícito, según decisión de Andrés: esta fase **no reinterpreta ni renombra MAU-3**. La denominación histórica se mantiene sin cambios. FASE 27 constituye su **primera etapa**: resuelve el problema evidenciado por la auditoría mediante un mecanismo de verificación de consistencia, sin cerrar la puerta a evoluciones futuras si alguna vez resultaran necesarias. MAU-3 permanece abierto; esta fase no lo cierra.

Durante la auditoría pre-merge de esta misma fase surgió un segundo caso — `public/clientes/prueba/` — que requirió su propia decisión y su propia corrección, documentada en las secciones 3 y 4.

---

## 2. Auditoría inicial de fase

Clon fresco del repositorio contra el commit `5c0d2322e3b9d5a4ed3ab056481168efdf9ec18a` (merge de FASE 26 a `main`), confirmado por `git rev-parse HEAD` contra el hash provisto por Andrés al abrir el chat.

Confirmado por lectura directa de código:

- `data/clientes/index.json` ya cuenta con un contrato de schema formal y maduro (`data/clientes/CONTRATO.md`, v1, §1–§12), previo a esta fase.
- Único consumidor de `index.json` en código: `src/admin/ClientesPage.jsx`, vía `import` estático de Vite, solo lectura.
- El runtime público **no consume `index.json` en ningún punto**. Cadena confirmada: `xv_birthday_card.jsx` (routing por `window.location.pathname`) → `TemplateLoader.jsx` → `useConfig.js` (`fetch('/clientes/${slug}/config.json')`). Registro operativo y runtime público están completamente desacoplados.
- `GeneradorPage.jsx` no escribe en `index.json` — no hay backend; el alta de clientes en el registro es 100% manual.
- `public/clientes/caracas/config.json` confirmado: `apps_script_url` y `sheet_id` reales, `plan: STANDARD`, `template: S1`, evento `2028-01-15`. Sin entrada en `index.json` al momento de la auditoría.
- `public/clientes/prueba/` también carecía de entrada en `index.json` — inicialmente registrado solo como observación, sin evidencia suficiente para clasificarlo.

**Anomalía de entorno detectada y descartada**: al iniciar la implementación, el directorio de trabajo contenía cambios no comiteados equivalentes a esta implementación, no presentes en el commit `5c0d232` (verificado con `git show --stat` y `git cat-file -p HEAD:...`). Se interpretó como residuo de entorno y se descartó explícitamente (`git checkout -- .` + `git clean -fd`) antes de generar la implementación real desde el HEAD verificado.

---

## 3. Caso `prueba` — decisión y evidencia documental

En la auditoría pre-merge de esta fase, Andrés solicitó determinar si `public/clientes/prueba/` es inequívocamente un fixture técnico. La clasificación inicial ("fixture de testing") había sido una inferencia del nombre de carpeta, no un hecho verificado contra el repositorio — se corrigió explícitamente ese punto antes de proceder.

**Evidencia documental encontrada, que respalda la clasificación como fixture técnico**: `docs/ESTADO_OFICIAL_PROYECTO.md`, línea 680 (FASE 25): *"config.json de prueba sin el campo obligatorio `titulo`, correctamente rechazado por el Contrato Ejecutable de Configuración (MAU-1) — confirma que MAU-1 sigue funcionando como fue diseñado, no es hallazgo de esta fase."* El mismo documento registra en líneas 235, 272 y 318 el uso reiterado de `public/clientes/prueba/config.json` como fixture compartido, con su campo `template` alternado manualmente entre `P1`/`P2`/`P3` durante la validación de cada variante y revertido tras el cierre de cada fase.

Con esta evidencia, Andrés confirmó explícitamente que `public/clientes/prueba/` es un fixture técnico de testing correspondiente al entorno de pruebas del template P3, y no un cliente comercial — quedando resuelta la duda planteada en la auditoría.

---

## 4. Decisiones arquitectónicas adoptadas

1. **No se construye un registro dinámico en sentido literal** (backend, KV externo, Sheet externo) para MAU-3. El síntoma real evidenciado por `caracas` es de **consistencia no detectada**, no de **latencia de actualización**.
2. **Regularización puntual de `caracas`** en `index.json`, conforme al schema `CONTRATO.md` v1 vigente, sin modificarlo. Fechas `creado_en`/`deployed_en` establecidas en `2026-08-08` (fecha de esta regularización), por ausencia de evidencia documental de las fechas reales, decisión explícita de Andrés, documentada en el campo `notas` de la propia entrada. `cliente_nombre: "caracas"` se mantiene únicamente como identificador provisional derivado del slug — no representa necesariamente el nombre comercial real, fue usado por falta de evidencia histórica, y deberá reemplazarse si posteriormente aparece el nombre real.
3. **`prueba` no se incorpora a `data/clientes/index.json`** — no es una divergencia comercial equivalente a `caracas`.
4. **Exclusión explícita de `prueba` mediante marca en su propio artefacto**: se agrega `"_fixture": true` a `public/clientes/prueba/config.json`, y el validador se extiende para reconocer esa marca. Alternativas descartadas: (a) registrar `prueba` como cliente — rechazada, no lo es; (b) hardcodear el slug `"prueba"` como excepción silenciosa dentro del validador — rechazada explícitamente por Andrés, ya que ata la excepción al código en vez de al artefacto y no es auditable por quien no lee el script; (c) lista externa de exclusiones — descartada por introducir un artefacto nuevo sin necesidad, cuando el propio `config.json` ya es el lugar natural para una marca de este tipo.
5. **Diseño fail-safe obligatorio**: si una carpeta huérfana de registro no tiene `config.json`, tiene JSON inválido, o no declara `"_fixture": true`, se sigue reportando como huérfano real. La ausencia de evidencia de fixture nunca se interpreta como fixture.
6. **RIESGO-C (bundle JS de `/admin`) no se resuelve en esta fase** — decisión consciente, no omisión.
7. MAU-3 permanece con su denominación histórica; esta fase se documenta como su primera etapa, no como su cierre.

---

## 5. Implementación realizada

### 5.1 `scripts/validar-registro-clientes.js` (nuevo)

Script Node.js puro (sin dependencias nuevas), de solo lectura. Compara las carpetas de `public/clientes/` contra las entradas de `data/clientes/index.json` y reporta:

1. Huérfanos de registro reales (carpetas sin entrada en `index.json` y sin marca de fixture válida).
2. Carpetas excluidas explícitamente (huérfanas de registro cuyo `config.json` declara `"_fixture": true`) — listadas aparte, de forma visible, sin afectar el exit code.
3. Huérfanos de filesystem (entradas en `index.json` sin carpeta correspondiente).
4. Presencia del slug reservado `"admin"` en el registro.

La función `esFixture(slug)` lee `public/clientes/{slug}/config.json` dentro de un `try/catch`: cualquier fallo (archivo ausente, JSON inválido, campo ausente o distinto de `true`) resuelve a `false`. No valida el contenido de `config.json` contra el Contrato Ejecutable de Configuración (MAU-1) — responsabilidad de `useConfig.js`/`AdminPage.jsx`. No modifica ningún archivo. Código de salida distinto de cero únicamente si hay huérfanos reales, huérfanos de filesystem, o el slug `admin` presente.

### 5.2 `package.json`

Agregado el comando `"validar:clientes": "node scripts/validar-registro-clientes.js"`. Ningún script existente modificado.

### 5.3 `data/clientes/index.json`

Agregada la entrada de `caracas`, siguiendo el schema de `CONTRATO.md` §3. Ningún registro fundacional modificado.

### 5.4 `public/clientes/prueba/config.json`

Agregado el campo `"_fixture": true`, inmediatamente después de `"template": "P3"`. Ningún otro campo del archivo modificado — títulos, fotos, itinerario, historia, credenciales y demás contenido del fixture permanecen intactos.

---

## 6. Archivos modificados (estado final a mergear)

```
data/clientes/index.json           ← agregada entrada de caracas
package.json                       ← agregado comando validar:clientes
public/clientes/prueba/config.json ← agregado "_fixture": true
scripts/validar-registro-clientes.js ← nuevo
docs/Fase 27.md                    ← nuevo, este documento
```

`ClientesPage.jsx`, `AdminPage.jsx`, `GeneradorPage.jsx`, cualquier template (S1/S2/S3/P1/P2/P3), `useConfig.js`, Apps Script, `CONTRATO.md` (catálogo y clientes) — sin modificación en esta fase.

---

## 7. Validaciones ejecutadas

**Evidencia previa a la regularización de `caracas`** (registro sin `caracas`, `prueba` aún sin marca):
```
Carpetas en public/clientes/: 5
Entradas en data/clientes/index.json: 3
⚠ Huérfanos: caracas, prueba
EXIT CODE: 1
```

**Evidencia intermedia** (tras regularizar `caracas`, antes de marcar `prueba`):
```
Carpetas en public/clientes/: 5
Entradas en data/clientes/index.json: 4
⚠ Huérfanos: prueba
EXIT CODE: 1
```

**Evidencia final** (`npm run validar:clientes`, estado a mergear — `caracas` regularizado, `prueba` marcado como fixture):
```
Carpetas en public/clientes/: 5
Entradas en data/clientes/index.json: 4
ℹ Carpetas excluidas explícitamente (marcadas como fixture técnico, "_fixture": true):
  - prueba
✓ Sin divergencias que requieran atención. Todas las carpetas de public/clientes/
  están registradas o excluidas explícitamente.
EXIT CODE: 0
```

**`npm run build`**: `✓ 62 modules transformed`, `✓ built in 5.17s`, **EXIT CODE 0**. Sin errores ni warnings. Ningún archivo de código de aplicación fue modificado para lograrlo.

**Confirmación de ausencia de cambios colaterales**: `git status --porcelain`, tras cada corrección, mostró exclusivamente los 5 archivos listados en la sección 6. Registros fundacionales (`sofia`, `valentina`, `andres`) y el resto del contenido de `prueba/config.json` verificados byte-idénticos al HEAD base mediante `git diff`.

---

## 8. Resultados obtenidos

`caracas` queda formalmente incorporado a `data/clientes/index.json`, visible en `/admin` → `Clientes` con su clasificación correcta (`deployed`, `STANDARD`, `S1`). `prueba` queda excluido explícita y auditablemente del reporte de divergencias, sin haber sido incorporado como cliente comercial. El validador cierra en verde (`EXIT CODE 0`) por primera vez desde su creación, sobre el estado legítimo real del repositorio — sin enmascarar ninguna divergencia futura, dado el diseño fail-safe de la exclusión.

---

## 9. Incidencias detectadas y resolución

| Incidencia | Origen | Resolución |
|---|---|---|
| `caracas` con `config.json` real y funcional, sin entrada en `index.json` | Hallazgo de FASE 25, confirmado en auditoría de FASE 27 | Regularizado en `index.json`, conforme a `CONTRATO.md` v1 |
| `prueba` sin entrada en `index.json`, clasificación inicial no verificada | Detectado en auditoría de FASE 27; corregido en auditoría pre-merge de la misma fase | Confirmado como fixture técnico mediante evidencia documental (`ESTADO_OFICIAL_PROYECTO.md` línea 680) y confirmación explícita de Andrés; excluido mediante `"_fixture": true` + lógica fail-safe en el validador, sin incorporarse a `index.json` |
| Directorio de trabajo del entorno con cambios no comiteados equivalentes a esta implementación, no presentes en el commit verificado | Detectado al iniciar la implementación de FASE 27 | Descartado explícitamente (`git checkout` + `git clean`); implementación regenerada desde el HEAD verificado |
| `cliente_nombre: "caracas"` sin evidencia de nombre comercial real | Detectado en auditoría pre-merge | Mantenido como identificador provisional derivado del slug, documentado explícitamente en `notas` como no verificado |

---

## 10. Decisiones cerradas — NO REABRIR

- MAU-3 mantiene su denominación histórica "Fuente Dinámica de Registro de Clientes" — no fue renombrado ni reinterpretado en esta fase.
- Esta fase es la **primera etapa** de MAU-3, no su cierre. Etapas futuras no están definidas.
- No se construyó infraestructura de registro dinámico en sentido literal.
- Las fechas `creado_en`/`deployed_en` de `caracas` usan la fecha de regularización (`2026-08-08`), documentado como decisión, no como dato histórico.
- `cliente_nombre` de `caracas` es un identificador provisional, no un dato comercial confirmado.
- `prueba` queda fuera de `index.json` de forma permanente, mientras conserve su carácter de fixture técnico — su exclusión depende de la marca `"_fixture": true` en su propio `config.json`, no de una lista externa.
- La exclusión de fixtures es genérica (por marca de artefacto), no atada al slug `"prueba"` — aplicable a cualquier fixture futuro que declare la misma marca.
- RIESGO-C (bundle JS de `/admin`) permanece sin resolver — decisión consciente.

---

## 11. Estado final de la fase

**FASE 27 CERRADA.** Primera etapa de MAU-3 implementada: script de validación de consistencia (`npm run validar:clientes`), regularización de `caracas` en `data/clientes/index.json`, y exclusión explícita y auditable de `prueba` como fixture técnico. Validador y build cierran en verde (`EXIT CODE 0`) sobre el estado real a mergear. Sin desvíos arquitectónicos entre lo aprobado y lo implementado.

**Pendiente, no iniciado**: siguientes etapas de MAU-3 (alcance no definido); cualquier aplicación administrativa futura sobre `RSVP_VELA` (iniciativa independiente, señalada desde FASE 26).
