[Fase 23.md](https://github.com/user-attachments/files/30172949/Fase.23.md)
# FASE 23 — Implementación y Cierre de MAU-2 (Generación Universal de Configuraciones)
## Documento de cierre oficial

Versión: 1 · Cierra FASE 23 · Depende de: FASE 22 (`docs/Fase 22.md`), FASE 21 (`docs/Fase 21.md`), FASE 20 (`docs/Fase 20.md`)

---

## 1. Objetivo de la fase

Implementar y validar MAU-2 — Generación Universal de Configuraciones, el segundo de los cuatro elementos del MAU, bajo el protocolo obligatorio completo. Extender `AdminPage.jsx` para que pueda generar configuraciones válidas de las seis variantes del catálogo comercial, no solo S1.

---

## 2. Auditoría previa — estado real encontrado

Auditoría de código real (clon del repositorio, no memoria de sesiones anteriores) confirmó:

- `buildConfig()` en `AdminPage.jsx` era una función única que ignoraba `fields.template` y siempre generaba la forma de S1. Contrastado contra el Contrato Ejecutable de MAU-1, el resultado real era: S1 válido, S2 inválido (faltaba `whatsapp_url`), P1 inválido (faltaban `historia.titulo`, `historia.cuerpo`, `timeline`, `itinerario`, `lugar.nombre`). S3, P2 y P3 no eran siquiera seleccionables desde el selector de `AdminPage.jsx`.
- `data/catalogo/templates.js` solo declaraba `disponible` a S1 y S2; S3/P1/P2/P3 en `proximamente`, con P1 visible únicamente por la excepción `LEGACY_VISIBLE`.
- P1/P2/P3 dependen de estructuras repetibles (`fotos[]`, `itinerario[]`, `timeline[]`) que `AdminPage.jsx` no tenía forma de capturar — no había campo de formulario equivalente.
- La sección "Servicio" (Apps Script URL / Sheet ID) se mostraba sin condicionar por template, exponiendo una capacidad exclusivamente PREMIUM (`PRODUCTOS.md` §3.4, §4.5) también para S2 y S3.

---

## 3. Diseño aprobado

### 3.1 Dispatcher por template

`buildConfig()` pasa a ser un dispatcher (`TEMPLATE_BUILDERS`) que invoca una función específica por template (`buildConfigS1` ... `buildConfigP3`), cada una construyendo exactamente la forma que su `REQUIRED_FIELDS` exige. `buildConfigS1` es la función original renombrada, sin cambios de lógica — cero regresión sobre el flujo ya operativo.

### 3.2 Contrato en un único lugar

`REQUIRED_FIELDS` y `validate()` de `useConfig.js` (privados hasta este punto) se exportan — sin cambio de contenido ni de lógica — y `AdminPage.jsx` los reutiliza como pre-chequeo antes de generar el `config.json`. Se evaluó explícitamente la alternativa de extraer ambos a un módulo compartido (`configContract.js`); se descartó por mayor superficie de cambio sin un segundo consumidor real fuera del entorno React existente hoy. Queda documentado como evolución posible cuando exista ese consumidor (ej. CI, asociado a MAU-4).

### 3.3 Parser de arrays con validación previa

`parseLineItems`: convierte texto de un `<textarea>` (una línea por ítem, separador `|`) en un array. Detecta líneas con una cantidad de segmentos distinta a la esperada y las reporta con su número de línea, en vez de generar un `config.json` estructuralmente incompleto.

Se evaluaron como alternativas de separador `" - "` (natural, riesgo de ambigüedad con guiones dentro del texto) y `;`; se eligió `|` por prioridad explícita a la robustez del parseo sobre la naturalidad de escritura, dejado como decisión de este MVP, revisable si en el futuro se construye una UI de filas repetibles.

### 3.4 Modo Validación

Toggle en `AdminPage.jsx` que permite generar configuraciones para cualquier template registrado técnicamente (`templateRegistry.js`), sin pasar por el filtro comercial de `PLANES`. El catálogo (`data/catalogo/templates.js`) sigue siendo la única fuente de verdad de disponibilidad comercial — el toggle no lo lee de otro lado ni lo modifica. Los templates `proximamente` se etiquetan explícitamente "En validación" cuando el modo está activo.

Resuelve un problema operativo real detectado durante la auditoría: no existía forma de generar un config de prueba para validar S3/P2/P3 en Preview Deployment antes de que el catálogo los declarara `disponible` — exactamente la distinción entre "validado" y "comercialmente habilitado" que el propio catálogo (`PRODUCTOS.md` §5.3) ya exige.

### 3.5 Corrección de alcance comercial — sección Servicio

Ajuste adicional, detectado durante la validación funcional y aprobado dentro de esta misma fase por su bajo riesgo y su relación directa con el objetivo de MAU-2: la sección "Servicio" (Apps Script URL / Sheet ID) queda condicionada a `['S1','P1','P2','P3']`. `buildConfigS2` deja de emitir `apps_script_url`/`sheet_id` en el JSON generado — no forman parte del contrato de datos de STANDARD (`PRODUCTOS.md` §3.4) ni son consumidos por `S2.jsx`/`S3.jsx`, confirmado por auditoría directa de ambos archivos antes de aplicar el cambio.

---

## 4. Validación funcional

Validación en dos niveles:

- **Lógica pura**: extracción y ejecución aislada de `TEMPLATE_BUILDERS`, `parseLineItems` y `erroresDeArrays` contra `REQUIRED_FIELDS`/`validate()` reales de `useConfig.js`. Las 6 combinaciones (S1–P3) pasan el Contrato Ejecutable. `buildConfigS1` confirmado idéntico en lógica a la función original. `apps_script_url`/`sheet_id` confirmados ausentes en la salida de S2/S3 tras el ajuste de la sección 3.5.
- **Build real**: `npx vite build` sobre el repositorio clonado, sin errores, en cada iteración del cambio.
- **Preview Deployment**: validación funcional ejecutada por Andrés. Único hallazgo reportado: un cliente nuevo generado con P1 no lograba registrar confirmaciones en Google Sheets. Investigado mediante auditoría de código (templates + Apps Script real), se determinó que la causa es ajena a MAU-2 — pertenece al contrato de comunicación entre los templates y el Apps Script, no a la generación del `config.json`. Aislado, documentado y resuelto como iniciativa arquitectónica independiente: ver `docs/Fase 24.md` / `docs/CONTRATO_RSVP_V2.md`.

Con el hallazgo aislado y explicado como ajeno al Generador, la validación funcional de MAU-2 se da por cerrada: el Generador cumple correctamente su responsabilidad — genera un `config.json` conforme al Contrato Ejecutable y al contrato por template, para las seis variantes del catálogo.

---

## 5. Decisiones cerradas — NO REABRIR

- MAU-2 queda implementado y validado como segundo elemento del MAU.
- El dispatcher por template (`TEMPLATE_BUILDERS`), no un generador de formularios dirigido por schema, es la arquitectura del Generador. Alternativa de schema dinámico evaluada y descartada por introducir abstracción sin consumidor real.
- El separador `|` para arrays de texto es la decisión de este MVP.
- `REQUIRED_FIELDS`/`validate()` exportados desde `useConfig.js` son la única fuente de verdad del contrato — no se reintroduce una segunda definición de campos obligatorios en `AdminPage.jsx`.
- Modo Validación es una capacidad del Generador, no del catálogo — el catálogo sigue siendo la única fuente de verdad de disponibilidad comercial.
- `apps_script_url`/`sheet_id` no forman parte de la salida de S2/S3.

---

## 6. Hallazgos documentados, fuera de alcance de esta fase (no resueltos)

- **`config.fotos` en `S3.jsx`** contradice `PRODUCTOS.md` §3.3 ("Sin galería de fotos" en STANDARD). Divergencia preexistente del template real, no introducida por esta fase. No modificada — decisión explícita de mantener separados los ajustes del Generador de las posibles correcciones de catálogo o templates.
- **`titulo`/`subtitulo` inconsistentes entre variantes del mismo producto** (S1 no consume ninguno de los dos; S2 no consume `titulo`) — violación de `PRODUCTOS.md` §5.2, no accionada en esta fase.
- **El contrato de comunicación RSVP entre templates y Apps Script** — causa raíz del hallazgo de Preview Deployment. Ver sección 4 y `docs/Fase 24.md`.

---

## 7. Fuera de alcance de FASE 23

MAU-3, MAU-4; diseño de pantallas del Owner Tool (Horizonte 3B); reapertura de decisiones cerradas en FASE 19–22; implementación del Contrato RSVP v2 (diferida a fase separada, ver `docs/Fase 24.md`).

---

## 8. Changeset aplicado

```
docs/Fase 22.md                     ← nuevo, retroactivo (ver docs/Fase 22.md, nota de origen)
docs/Fase 23.md                     ← nuevo, este documento
docs/ESTADO_OFICIAL_PROYECTO.md     ← v14, secciones incorporadas; secciones anteriores sin alterar
Instrucciones maestras del proyecto ← actualizadas a versión FASE 24
src/hooks/useConfig.js              ← REQUIRED_FIELDS y validate() exportados (sin cambio de contenido)
src/admin/AdminPage.jsx             ← MAU-2: dispatcher por template, parser de arrays, Modo Validación,
                                        sección Servicio condicionada por template
```

---

## 9. Estado final de la fase

**FASE 23 — CERRADA.**

MAU-2 — Generación Universal de Configuraciones queda implementado y validado. El catálogo comercial (`PRODUCTOS.md`) permanece sin alteración. El hallazgo de RSVP detectado durante la validación queda aislado como iniciativa arquitectónica independiente.

**Próximo paso**: MAU-3 — Fuente Dinámica de Registro de Clientes (sin análisis de implementación iniciado); e, independientemente del MAU, la implementación del Contrato RSVP v2 (ver `docs/Fase 24.md`), cada uno bajo su propio protocolo obligatorio completo.
