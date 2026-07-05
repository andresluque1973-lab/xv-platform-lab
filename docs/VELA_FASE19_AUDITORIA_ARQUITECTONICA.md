[VELA_FASE19_AUDITORIA_ARQUITECTONICA.md](https://github.com/user-attachments/files/29681388/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md)
# VELA — Auditoría Arquitectónica FASE 19
## Informe ejecutivo de consolidación

**Alcance:** repositorio `xv-platform-lab`, commit `d54d1eb8` (2 jul 2026)
**Método:** auditoría por capas (registro de clientes, contratos de configuración, TemplateLoader/registry, flujo RSVP, herramienta de onboarding, deploy, modelo de dominio, modelo de datos)
**Naturaleza del documento:** mapa de riesgos estratégico. No contiene propuestas de implementación.

---

## 1. Fortalezas arquitectónicas — preservar sin tocar

Antes de listar riesgos, es necesario dejar registrado qué decisiones ya demostraron ser sólidas. Estas partes del sistema no deben quedar expuestas a refactors especulativos en fases futuras solo por estar cerca de las zonas que sí requieren evolución.

- **Separación templateRegistry / catálogo comercial.** El desacople entre "qué existe técnicamente" (`templateRegistry.js`) y "qué se vende" (`data/catalogo/templates.js`) se sostuvo intacto a lo largo de seis variantes y tres fases de construcción PREMIUM, sin fricción ni necesidad de reinterpretación. Es la frontera mejor definida de todo el sistema.

- **Patrón de archivo único autocontenido por template.** La decisión de que cada variante (S2, S3, P1, P2, P3) sea un archivo independiente, sin capa compartida prematura, escaló limpiamente de 1 a 6 variantes sin generar duplicación descontrolada ni abstracciones injustificadas. La única extracción compartida real (`shared/hooks.js`, DEUDA-002) ocurrió cuando había evidencia concreta de repetición no trivial — exactamente como marca el principio de mínima intervención del proyecto. Este patrón validó su propia regla de origen.

- **Ortogonalidad Familia × Tier.** La separación entre identidad visual (Emotiva/Con Carácter/Elegante) y capacidad funcional (STANDARD/PREMIUM) se mantuvo consistente en las seis implementaciones, incluyendo el caso más exigente (P3, que debía diferenciarse de S3 sin heredar su Divider ni su estructura de bloques). No hubo necesidad de reabrir la definición de ninguna familia para acomodar el tier superior.

- **Disciplina de contratos documentados.** `data/clientes/CONTRATO.md` y `data/catalogo/PRODUCTOS.md/CONTRATO.md` son especificaciones de una madurez inusual para esta etapa de un proyecto — versionado explícito, reglas de transición de estado, campos prohibidos. El problema identificado en este informe no es la calidad de estas especificaciones: es que ninguna está *enforced* en código. La especificación en sí es un activo a conservar.

- **Metodología de fases cerradas con no reapertura.** El historial de FASE 9 a FASE 18 muestra cero retrocesos sobre decisiones cerradas. Esto redujo drift conceptual real en la capa visual — el único drift documental encontrado en toda la auditoría (`LEGACY_VISIBLE` desactualizado en `AdminPage.jsx`) ocurrió precisamente en el único archivo *excluido* de este proceso de cierre ("NO modificar sin análisis").

---

## 2. Temas arquitectónicos

Cada tema agrupa hallazgos que comparten una misma causa raíz. Clasificación usada:

- 🔴 **Resolver antes de Owner Tool** — bloquea o distorsiona directamente el objetivo de la próxima fase de activación.
- 🟡 **Deuda aceptable** — riesgo real pero contenido; no bloquea nada mientras el volumen se mantenga bajo.
- 🟢 **Puede esperar** — válido para el modelo actual; solo se vuelve relevante ante un disparador concreto (multi-evento por cliente, autoservicio, cientos de clientes).
- 🔵 **Mejora inmediata** — no depende de ninguna fase futura; el riesgo existe hoy, independientemente del roadmap.

---

### Tema A — Ausencia de una capa de validación de datos

**Problema estructural.** Ningún punto del sistema — ni build time, ni runtime — verifica que un `config.json` de cliente sea consistente, completo, o no colisione con otro cliente. Los contratos existen como documento, no como código ejecutable.

**Evidencia.** `valentina/config.json` referencia el asset de audio de `sofia` sin que nada lo detectara. `TemplateLoader.jsx` no distingue "config ausente" (modo degradado aceptable) de "config presente pero inválida" (dato erróneo) — ambos casos caen igual en el fallback a S1. `AdminPage.jsx` no valida completitud del output contra el contrato del plan elegido antes de generar el archivo.

**Riesgo al escalar.** A 3 clientes, la disciplina manual del operador compensa la ausencia de validación. A 50 o 100, la probabilidad de un desliz puntual crece linealmente mientras la capacidad de detección se mantiene en cero — el sistema no tiene ningún mecanismo cuya efectividad mejore con el volumen.

**Clasificación:** 🔴 Resolver antes de Owner Tool.

**Justificación.** El Owner Tool multiplicará la frecuencia de creación/edición de clientes. Introducirlo sin este control es escalar exactamente la superficie donde ya se demostró (empíricamente, con `valentina`) que el sistema falla en silencio.

---

### Tema B — Arquitectura optimizada para no fallar visualmente, no para no fallar en silencio

**Problema estructural.** Dos decisiones independientes comparten la misma filosofía de diseño: priorizar que la invitación "nunca se rompa" por sobre poder detectar que algo salió mal.

**Evidencia.** El fallback de `TemplateLoader` a S1 ante cualquier `config.template` ausente o inválido. El patrón replicado en S1/P1/P2/P3: `fetch(..., {mode: "no-cors"})` con `catch { setStatus("success") }` — documentado en el propio código como decisión consciente ("asumimos éxito si no hay network error"). Ambos mecanismos convierten un fallo real en una experiencia idéntica a un éxito, para el invitado, para el operador y para el propio sistema.

**Riesgo al escalar.** Un `apps_script_url` vencido o un Sheet borrado producen la pérdida silenciosa de RSVPs reales sin que ningún actor del sistema lo perciba, hasta que un conteo manual no cierre. A mayor volumen de eventos simultáneos, mayor probabilidad estadística de que esto ocurra en al menos uno, sin ningún mecanismo de alerta que escale con ese volumen.

**Los dos componentes no pesan igual.** Aunque comparten la misma filosofía de diseño, conviene no tratarlos como equivalentes en impacto:
- El **flujo RSVP silencioso** tiene impacto directo sobre datos reales del negocio y sobre la experiencia del cliente final: un guiso perdido significa un invitado que cree haber confirmado y no confirmó, y un cliente de VELA tomando decisiones (catering, disposición de mesas) sobre un conteo potencialmente incompleto. Es el de mayor severidad de los dos.
- El **fallback silencioso de `TemplateLoader`** afecta principalmente la **detección de errores de configuración** — no pierde datos de negocio por sí mismo, pero oculta que algo en el `config.json` de un cliente está mal, retrasando su descubrimiento hasta una revisión manual o un reclamo.

**Clasificación:** 🔴 Resolver antes de Owner Tool.

**Justificación.** Esta es la debilidad de mayor impacto directo sobre el usuario final (el cliente que contrata VELA, y sus invitados) de todo el mapa de riesgos, particularmente por su componente RSVP. Una herramienta de administración que reporte "eventos operando con normalidad" sobre un flujo que no tiene forma de saber si algo se perdió, es peor que no tener la herramienta — genera falsa confianza operativa.

---

### Tema C — Estado operativo acoplado al ciclo de deploy de código

**Problema estructural.** `data/clientes/index.json` se importa de forma estática dentro de `ClientesPage.jsx` (`import registroRaw from '../../data/clientes/index.json'`), quedando compilado dentro del bundle de JS en build time. El registro de clientes — que conceptualmente es un dato operativo dinámico — vive arquitectónicamente como si fuera código fuente.

**Evidencia.** Confirmado en el import estático de `ClientesPage.jsx`. Cualquier alta, baja o modificación de un cliente en el registro requiere rebuild + redeploy completos para reflejarse.

**Riesgo al escalar.** Este es el techo operativo más literal de la plataforma: no importa cuánto se optimicen el resto de los procesos, agregar el cliente número 20 exigirá el mismo ritual de deploy que agregar el cliente número 1.

**Clasificación:** 🔴 Resolver antes de Owner Tool.

**Justificación.** Es, en términos literales, la razón de ser original de FASE 19 ("cómo operar decenas de eventos sin redeploy por cada uno"). Ningún otro hallazgo bloquea tan directamente la premisa fundacional de la fase.

---

### Tema D — Desfasaje entre la herramienta de onboarding y el catálogo real

**Problema estructural.** `AdminPage.jsx` (`buildConfig()`) solo sabe construir el schema STANDARD base. No genera ninguno de los campos del contrato PREMIUM §4.5 (`historia`, `timeline`, `fotos`, `itinerario`). La única herramienta de creación de clientes cubre 1 de las 6 variantes del catálogo comercial completo.

**Evidencia.** Ausencia total de esos campos en `buildConfig()`. Adicionalmente, `LEGACY_VISIBLE = ['P1']` con el comentario *"se resuelve en fase posterior cuando P1 tenga implementación real"* — desactualizado desde FASE 16B, congelado porque el archivo está explícitamente protegido de modificación sin análisis previo.

**Riesgo al escalar.** El catálogo comercial "completo" (6 variantes) no es operativamente completo: onboardear un cliente PREMIUM hoy exige editar el JSON a mano por fuera de cualquier herramienta, sin ninguna guía ni validación de completitud.

**Clasificación:** 🔴 Resolver antes de Owner Tool.

**Justificación.** Un Owner Tool que no pueda producir la mitad del catálogo que la plataforma vende no reduce el trabajo del operador — simplemente traslada el mismo trabajo manual a un contexto con apariencia de herramienta, sin serlo.

---

### Tema E — Datos sensibles en superficie pública sin autenticación

**Problema estructural.** `config.json` vive bajo `public/`, es servido como archivo estático sin ninguna autenticación, y contiene `apps_script_url` y `sheet_id` en texto plano — exactamente los mismos dos campos que `CONTRATO.md` de `data/clientes/` califica como "dato sensible" cuando aparecen en `index.json`. El contrato reconoce la sensibilidad del dato pero no advierte que moverlo de archivo no cambió su exposición.

**Evidencia.** `public/clientes/{slug}/config.json` es accesible sin autenticación por cualquiera que conozca o adivine el slug (los slugs actuales son nombres propios, fácilmente adivinables). `andres/config.json` expone `sheet_id` en claro además de `apps_script_url`.

**Riesgo al escalar.** Con 3 clientes, la superficie de exposición es limitada. Con decenas o cientos de rutas `/clientes/{slug}/config.json` potencialmente indexables, la exposición pública de `apps_script_url` y `sheet_id` crece proporcionalmente al número de clientes.

**Alcance no auditado.** Esta fase no evaluó la configuración efectiva del Apps Script de cada cliente (permisos de ejecución, validaciones de payload del lado del endpoint, controles de acceso al Sheet). El riesgo operativo real depende de esa configuración, no solo de la visibilidad del identificador — un endpoint bien restringido del lado de Apps Script puede acotar significativamente el impacto de que su URL sea pública. Lo que este informe puede afirmar, con la evidencia relevada, es que existe una exposición pública de identificadores y endpoints de integración que amerita revisión; no puede afirmar el nivel de explotabilidad real sin auditar esa capa.

**Clasificación:** 🔵 Mejora inmediata.

**Justificación.** La revisión de esta exposición no depende del Owner Tool ni del volumen de clientes — es evaluable hoy, sobre los clientes ya desplegados. Lo que se prioriza como "mejora inmediata" es la revisión (confirmar qué tan protegido está cada Apps Script), no necesariamente una remediación estructural del archivo `config.json` en sí, cuya necesidad depende del resultado de esa revisión.

---

### Tema F — Modelo de dominio: Cliente y Evento fusionados, Configuración sobrecargada

**Problema estructural.** No existen como entidades separadas "Cliente" (quién contrata) y "Evento" (qué se celebra) — un slug mapea 1:1 y para siempre a un config.json. Además, ese config.json cumple simultáneamente cinco roles distintos: identidad/branding, logística del evento, clasificación comercial (plan/template), credenciales de integración, y (en PREMIUM) contenido narrativo extenso.

**Evidencia.** `index.json` es una fila plana por cliente sin relación programática con su config.json (unidos solo por convención de nombre de carpeta — ver Tema G). No hay ningún campo ni estructura que permita representar un cliente con más de un evento en su historia, o el historial de un evento pasado.

**Riesgo al escalar.** Invisible mientras cada cliente tenga exactamente un evento en su vida útil (el caso actual). Se vuelve un bloqueo real el día que la plataforma necesite modelar renovaciones anuales, múltiples eventos por cliente, o historial — preguntas que hoy no tienen dónde vivir en absoluto.

**Clasificación:** 🟢 Puede esperar.

**Justificación.** Coherente con el principio del proyecto de que ningún cliente confirmado hoy requiere esta capacidad. Resolverlo antes de que exista un caso real sería la automatización/abstracción prematura que el proyecto evita deliberadamente. Sí debe quedar registrado como el techo conceptual que definirá cuánto puede crecer el modelo de datos sin una decisión arquitectónica nueva.

**Aclaración de alcance.** Este tema no se considera deuda técnica activa contra el modelo comercial actual. El modelo 1 cliente ↔ 1 evento es coherente con el alcance vigente del producto y con la realidad de los clientes fundacionales existentes. Queda documentado únicamente como un posible límite de evolución futura, aplicable si el dominio del producto cambiara (por ejemplo, ante renovaciones anuales o múltiples eventos por cliente) — no como una recomendación de intervención sobre el modelo actual.

---

### Tema G — El slug como única fuente de integridad referencial

**Problema estructural.** El propio `CONTRATO.md` de `data/clientes/` (§7) ya documenta esto con precisión: el slug conecta tres capas independientes (registro, config público, ruta runtime) sin ningún mecanismo automático que las mantenga sincronizadas. Es una propiedad conocida y aceptada del sistema, no un hallazgo nuevo — pero el bug de `valentina` es la primera evidencia empírica de que esa dependencia en disciplina humana ya falló una vez.

**Evidencia.** Sección §7 de `CONTRATO.md` (documentado por el propio proyecto). Confirmado empíricamente por el caso `valentina`.

**Riesgo al escalar.** El contrato mismo predice el modo de falla; solo faltaba la evidencia de que ocurre en la práctica, no solo en teoría.

**Clasificación:** 🟡 Deuda aceptable — pero ver Tema A, del cual esta es una instancia particular. No es un tema separado a resolver por sí mismo: se resuelve como consecuencia de resolver la validación de datos.

---

### Tema H — Ausencia de punto de integración para validación automatizada

**Problema estructural.** No existe CI en el repositorio (sin `.github/workflows`, sin test runner, sin lint gate). El único control de calidad pre-deploy es la revisión manual del Preview Deployment — efectivo para contenido visual estático (revisable a ojo), pero sin ninguna cobertura sobre datos de cliente: un config.json mal formado no rompe el build, Vite lo empaqueta igual.

**Evidencia.** Ausencia de cualquier archivo de configuración de CI. `vercel.json` es únicamente un rewrite SPA sin gates asociados.

**Riesgo al escalar.** No hay ningún lugar donde enchufar automatización futura sin construirlo desde cero. Esto no es un riesgo activo por sí mismo — es la ausencia de la infraestructura que haría sostenibles las soluciones a los Temas A y D.

**Clasificación:** 🟡 Deuda aceptable.

**Justificación.** Coherente con "no automatización prematura": no tiene sentido construir un pipeline de CI antes de decidir qué se va a validar (Tema A). Se vuelve relevante como consecuencia directa, no como iniciativa independiente.

---

### Tema I — Ausencia de estado dinámico propio de la plataforma

**Problema estructural.** VELA es, por diseño explícito, una plataforma sin base de datos. Cada cliente es un archivo estático más una fila en otro archivo estático; el único almacenamiento dinámico real (los RSVP) vive enteramente fuera del sistema, en Google Sheets, que la plataforma nunca consulta de vuelta. No hay ningún concepto de "resultado del evento" en VELA — todo lo que ocurre después de servir el config.json es opaco para la plataforma.

**Evidencia.** `ConfirmSection.jsx` no persiste nada localmente; el Sheet es fuente de verdad unidireccional (solo escritura desde VELA). `ClientesPage.jsx` solo puede mostrar lo que alguien tipeó a mano en `index.json` — no hay ningún canal de retorno de información real (confirmados, vistas, estado del envío).

**Riesgo al escalar.** Cualquier capacidad futura mencionada como objetivo de plataforma — invitados como dato propio, historial, métricas — requiere estado dinámico consultable y propiedad de VELA. Hoy ese tipo de estado no existe en ningún punto del sistema; no es una extensión incremental sobre lo actual, es una capacidad que no tiene dónde apoyarse.

**Clasificación:** 🟢 Puede esperar (resolver antes de autoservicio, no antes de Owner Tool).

**Justificación.** Una primera versión del Owner Tool puede operar razonablemente bien sobre el modelo de archivos actual si se resuelven los Temas A, C y D. La ausencia de estado dinámico se vuelve bloqueante recién cuando el objetivo pase de "administrar clientes" a "ofrecerle a un cliente autoservicio visibilidad de sus propios datos en tiempo real" — ese es el disparador correcto para reabrir este tema, no el volumen de clientes por sí solo.

---

## 3. Mapa de prioridad consolidado

| Tema | Clasificación |
|---|---|
| A — Validación de datos ausente | 🔴 Resolver antes de Owner Tool |
| B — Fallos silenciosos (fallback S1 + RSVP no-cors) | 🔴 Resolver antes de Owner Tool |
| C — Registro de clientes embebido en bundle | 🔴 Resolver antes de Owner Tool |
| D — Onboarding desfasado del catálogo (AdminPage solo STANDARD) | 🔴 Resolver antes de Owner Tool |
| E — Credenciales expuestas en config.json público | 🔵 Mejora inmediata |
| F — Cliente/Evento fusionados, Configuración sobrecargada | 🟢 Puede esperar |
| G — Slug como única integridad referencial | 🟡 Deuda aceptable (subsumido en A) |
| H — Sin punto de integración para CI/validación | 🟡 Deuda aceptable (consecuencia de A) |
| I — Sin estado dinámico propio de plataforma | 🟢 Puede esperar (disparador: autoservicio) |

Cuatro temas comparten una misma línea de fondo: **el Owner Tool, tal como está prevista, amplifica exactamente las superficies donde hoy el sistema ya demostró (no solo en teoría — con evidencia empírica del caso `valentina`) que falla sin avisar.** Los Temas A, B, C y D no son cuatro riesgos independientes — son cuatro manifestaciones de la misma pregunta de fondo: *¿qué le pasa a VELA cuando algo sale mal, y quién se entera?* Hoy la respuesta es, en las cuatro capas, la misma: nadie, hasta que ya fue tarde.

---

## 4. Decisión de cierre de la auditoría

- Se considera concluida la etapa de descubrimiento y consolidación de riesgos de FASE 19.
- Este documento pasa a ser la referencia arquitectónica de base para las próximas fases del proyecto.
- El documento no implica la aprobación de ninguna implementación, remediación ni refactor.
- Cualquier intervención sobre los temas aquí registrados deberá evaluarse y aprobarse explícitamente en una fase posterior específica, siguiendo el protocolo obligatorio del proyecto (Análisis → Riesgos → Alternativas → Recomendación → Cambio mínimo → Impacto esperado → Esperando confirmación).

---

*Documento de consolidación de auditoría — FASE 19. No contiene propuestas de implementación. Priorización y decisiones de intervención quedan pendientes de una etapa posterior.*
