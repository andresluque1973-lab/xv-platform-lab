[Fase 21.md](https://github.com/user-attachments/files/29908349/Fase.21.md)
# FASE 21 — Planificación de Implementación del Minimum Architecture Upgrade (MAU)
## Documento de cierre oficial

Versión: 1 · Cierra FASE 21 · Depende de: FASE 20 (`docs/Fase 20.md`), FASE 19 (`docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md`, `docs/Fase 19.md`)

---

## 1. Objetivo de la fase

Definir la estrategia de secuenciación e implementación del Minimum Architecture Upgrade (MAU) — los cuatro elementos arquitectónicos aprobados en FASE 20 — sin ejecutar ningún cambio de código.

FASE 21 responde a la pregunta que FASE 20 dejó explícitamente diferida: **¿en qué relación de dependencias se planifica la implementación de MAU-1, MAU-2, MAU-3 y MAU-4, y cuál es el cambio mínimo viable que satisface la condición de liberación de cada uno?**

**FASE 21 fue una fase exclusivamente de planificación.** No se implementó código. No se modificó ningún archivo de producción ni de la aplicación. El entregable es un **Plan Arquitectónico de Implementación** congelado, que sirve de marco para las fases de ejecución que le siguen (una por cada elemento del MAU).

**Relación con FASE 20 — trazabilidad explícita**: FASE 20 definió el MAU como arquitectura mínima y estableció su grafo de dependencias técnicas y estratégicas de alto nivel. FASE 21 no reabre esa definición ni el grafo — lo audita contra el estado real del código, lo profundiza en radio de impacto, costo, riesgo y beneficio por componente, y lo traduce en un plan de secuenciación operable. El MAU sigue siendo de 4 elementos, exactamente como quedó cerrado en FASE 20.

---

## 2. Contexto heredado de FASE 20

- El catálogo comercial de VELA está completo y congelado: S1, S2, S3, P1, P2, P3.
- Los Riesgos A–D de FASE 19 fueron reinterpretados en FASE 20 como las cuatro capacidades del MAU: Contrato Ejecutable de Configuración (MAU-1), Generación Universal de Configuraciones (MAU-2), Fuente Dinámica de Registro de Clientes (MAU-3), Señalización Explícita de Fallos Críticos (MAU-4).
- FASE 20 estableció la distinción metodológica entre **dependencia técnica** (¿puede construirse X sin que Y exista, sin romper el sistema?) y **dependencia estratégica** (¿con qué conjunto mínimo estamos dispuestos a liberar la primera operación real de la plataforma?). Esta distinción se usó de forma activa a lo largo de FASE 21.
- Riesgos E, F, G, H, I permanecen fuera de alcance, tal como quedaron documentados en FASE 19. FASE 21 no los reabre.
- Ninguna implementación fue aprobada en FASE 20. El orden de intervención entre los cuatro elementos del MAU quedó explícitamente diferido a Horizonte 3A — el objeto de esta fase.

---

## 3. Alcance aprobado

**Dentro de alcance de FASE 21**:
- Análisis de secuenciación entre los cuatro elementos del MAU, verificado contra el código real del repositorio.
- Análisis de ejecución por componente: radio de impacto, costo, riesgo, beneficio operativo.
- Construcción de una matriz comparativa de los cuatro elementos.
- Separación explícita entre decisiones arquitectónicas (congeladas para toda la fase) y decisiones de implementación (diferidas al inicio de cada componente).
- Diseño técnico a nivel de propuesta (qué archivos, qué contrato, qué forma de datos) — sin implementación real.

**Fuera de alcance de FASE 21** (idéntico a lo declarado en la apertura de la fase, sin modificación):
- Implementación de código de cualquier tipo sin aprobación explícita, punto por punto.
- Diseño de pantallas o flujos del Owner Tool (corresponde a Horizonte 3B).
- Reapertura del MAU o de cualquier decisión cerrada en FASE 19 o FASE 20.
- Riesgo E, Riesgo F, Riesgo I.
- Herramienta de autoservicio para clientes.

---

## 4. Metodología aplicada

FASE 21 se ejecutó en tres etapas sucesivas, cada una auditada contra el código real del repositorio (`git clone --depth 1` sobre `andresluque1973-lab/xv-platform-lab`, no memoria de sesiones anteriores):

1. **Análisis de secuenciación** — dependencias técnicas y estratégicas entre MAU-1, MAU-2, MAU-3 y MAU-4, evidencia mínima de resolución por elemento, efecto cruzado según el orden elegido.
2. **Análisis de ejecución** — radio de impacto (archivos afectados, riesgo de romper funcionalidad existente, facilidad de rollback), costo estimado (Bajo/Medio/Alto), beneficio operativo inmediato, oportunidades de reducción de alcance, y matriz comparativa.
3. **Validación metodológica** — revisión explícita para separar decisiones arquitectónicas de decisiones de implementación anticipadas, identificación de supuestos no demostrados en el código, y confirmación de que la estrategia arquitectónica es independiente de esas decisiones de implementación.

Esta secuencia en tres etapas, y la corrección terminológica final (sección 9), quedan documentadas íntegramente en esta fase por exigencia de trazabilidad — ninguna decisión tomada durante la conversación de cierre se omite.

---

## 5. Hallazgos de código incorporados en esta fase

La auditoría directa del repositorio aportó evidencia nueva, no disponible en FASE 20, que ajustó el análisis de ejecución:

- **El patrón de fallo silencioso de RSVP (Riesgo B1) está duplicado de forma independiente en seis archivos**: `standard1/sections/ConfirmSection.jsx`, `S2.jsx`, `S3.jsx`, `P1.jsx`, `P2.jsx`, `P3.jsx`. Cada uno implementa su propio `fetch(..., { mode: "no-cors" })` y asume éxito ante la ausencia de error de red. Esto no altera la clasificación arquitectónica de MAU-4, pero sí su radio de impacto real: 6 puntos de intervención más `TemplateLoader.jsx`, no 1.
- **`TemplateLoader.jsx`** confirma el fallback incondicional a S1 sin distinguir configuración ausente de configuración incorrecta (Riesgo B2), consistente con lo ya establecido en FASE 20.
- **`useConfig.js`** confirma la ausencia total de validación de forma sobre el config.json recibido — el hook propaga cualquier JSON recibido sin verificación (Riesgo A / MAU-1).
- **`ClientesPage.jsx` línea 25** confirma el import estático de `data/clientes/index.json` (Riesgo C / MAU-3), sin cambios respecto de lo ya documentado en FASE 20.
- **`data/catalogo/templates.js`** marca S3, P1, P2 y P3 como `"proximamente"`, con únicamente P1 expuesto en `AdminPage.jsx` mediante el flag temporal `LEGACY_VISIBLE`. Este dato **no constituye documentation drift** — es consistente con §5.3 de `PRODUCTOS.md`, que exige validación funcional en producción (no solo en Preview Deployment) para que un template alcance el estado formal `disponible`. Catálogo comercialmente completo y variantes formalmente `disponible` son afirmaciones independientes y ambas correctas. Este hallazgo queda incorporado como parte del radio de impacto de MAU-2, no como corrección de un defecto.

---

## 6. Definición definitiva del MAU (sin alteración respecto de FASE 20)

El MAU está compuesto por **cuatro componentes arquitectónicos**, ni más ni menos. FASE 21 no agrega, no subdivide ni reclasifica ninguno a nivel arquitectónico. Cualquier distinción interna identificada durante esta fase (por ejemplo, los dos casos de uso de MAU-4) pertenece exclusivamente al nivel de implementación, nunca al nivel de estructura arquitectónica.

---

## 7. Descripción de los cuatro componentes

### MAU-1 — Contrato Ejecutable de Configuración
Reinterpretación de Riesgo A. Establece una validación de forma verificable sobre `config.json` antes de que su contenido se propague a los templates.

### MAU-2 — Generación Universal de Configuraciones
Reinterpretación de Riesgo D. Extiende `AdminPage.jsx` para generar configuraciones válidas de las seis variantes del catálogo comercial, no solo STANDARD.

### MAU-3 — Fuente Dinámica de Registro de Clientes
Reinterpretación de Riesgo C. Reemplaza el import estático de `data/clientes/index.json` por una fuente de lectura dinámica, eliminando la necesidad de rebuild y redeploy para altas de clientes.

### MAU-4 — Señalización Explícita de Fallos Críticos
Reinterpretación de Riesgo B. Consolida la observabilidad y la señalización explícita de fallos sobre la arquitectura ya implementada por los otros tres componentes — incluyendo, sin limitarse a, el flujo de confirmación RSVP y el fallback de `TemplateLoader.jsx`.

---

## 8. Relaciones de dependencia técnicas y estratégicas

- **MAU-1 es fundacional.** Debe implementarse primero. Es prerrequisito técnico de MAU-2 y de MAU-4.
- **MAU-2 depende técnicamente de MAU-1** — necesita una noción objetiva de "configuración válida" para poder verificar lo que genera.
- **MAU-3 no tiene dependencia técnica con MAU-1 ni con MAU-2.** Es planificable en paralelo con MAU-2.
- **MAU-2 y MAU-3 no tienen dependencia técnica entre sí** — no comparten archivos ni datos.
- **MAU-4 se planifica como el componente de cierre del MAU** porque consolida la observabilidad y la señalización explícita de fallos sobre la arquitectura ya implementada por MAU-1, MAU-2 y MAU-3. Esta ubicación responde a un criterio estratégico — no a una dependencia técnica estricta. MAU-4 no está bloqueado por los otros tres; está deliberadamente ubicado al cierre porque su beneficio pleno depende del volumen de operación que los otros tres habilitan.

Esta relación se expresa deliberadamente como un **grafo de dependencias**, no como una secuencia numerada rígida — precisión adoptada durante el cierre de esta fase para evitar que el orden de ejecución se interprete como una condición arquitectónica más estricta de lo que realmente es.

---

## 9. Criterios de aceptación por componente

| Componente | Condición de liberación (evidencia empírica mínima) |
|---|---|
| **MAU-1** | Un config.json con un campo requerido faltante o de tipo incorrecto produce un error detectable y distinguible antes de renderizar el template — verificado rompiendo deliberadamente un campo de un config real. |
| **MAU-2** | AdminPage genera, para al menos una variante PREMIUM real, un config.json válido que carga correctamente en su template correspondiente sin edición manual posterior. |
| **MAU-3** | Un cliente nuevo se da de alta y aparece reflejado en `ClientesPage.jsx` sin ejecutar un rebuild ni un redeploy del bundle. |
| **MAU-4** | (a) Un fallo real de Apps Script, forzado deliberadamente, resulta visible para el usuario final en vez de absorbido como confirmación exitosa. (b) Un `config.template` inexistente o corrupto es distinguido explícitamente de un config ausente, en vez de caer indistintamente en el mismo fallback silencioso a S1. |

---

## 10. Riesgos identificados por componente

| Componente | Riesgo de romper funcionalidad existente | Facilidad de rollback |
|---|---|---|
| **MAU-1** | Bajo-Medio — único punto de lectura de config para los 6 templates; el riesgo es un contrato mal calibrado que rechace un config real hoy funcional. | Alta — hook aislado, interfaz de retorno estable. |
| **MAU-2** | Medio — riesgo de introducir regresión en la ruta STANDARD, hoy validada en producción, al extender la lógica para PREMIUM. | Media — archivo único pero con lógica de formulario acoplada. |
| **MAU-3** | Bajo — cambio mecánico y localizado en un único componente de lectura. | Alta. |
| **MAU-4** | Medio-Alto — no por complejidad individual, sino por repetición: el mismo cambio conceptual replicado en múltiples archivos multiplica la posibilidad de una inconsistencia entre ellos. | Alta por archivo individual; media si se requiere coordinar rollback entre varios sitios simultáneamente. |

---

## 11. Costo y beneficio por componente

| Componente | Costo estimado | Beneficio operativo inmediato |
|---|---|---|
| **MAU-1** | Medio — el código es acotado; el costo real está en definir con precisión el contrato para dos planes con estructuras distintas. | Bajo — beneficio preventivo, no una capacidad nueva visible el día de su cierre. |
| **MAU-2** | Alto — mayor esfuerzo bruto del MAU: multiplicar la cobertura del formulario por 6 variantes reales, más resolver el estado del catálogo en `templates.js`. | Alto — única capacidad del MAU que habilita una operación hoy inexistente (alta de cliente PREMIUM sin edición manual de JSON). |
| **MAU-3** | Bajo — el elemento de menor costo del MAU si se mantiene en su forma mínima (lectura dinámica, sin escritura). | Medio — el beneficio pleno depende de una capacidad de escritura fuera del alcance de MAU-3, probablemente correspondiente a Horizonte 3B. |
| **MAU-4** | Medio — cambio conceptualmente simple, distribuido en múltiples puntos del código ("ancho", no "profundo"). | Alto — elimina un fallo de datos invisible que hoy solo se detecta por auditoría manual del Sheet o por reporte del cliente final. |

---

## 12. Principios rectores que gobernarán la implementación

Estos principios, ya vigentes en el proyecto, se ratifican explícitamente como marco de referencia para la implementación de cada elemento del MAU:

- **"Si algo funciona, no se toca."** Ninguna intervención del MAU debe modificar comportamiento hoy funcional en producción sin justificación explícita.
- **Cambio mínimo viable sobre optimización.** Cada componente se libera con el alcance mínimo que satisface su condición de aceptación (sección 9), no con la solución teóricamente más completa.
- **Dependencia técnica ≠ dependencia estratégica.** La secuencia de implementación (sección 8) debe respetarse como marco, sin confundir ubicación estratégica con bloqueo técnico.
- **No artifact sin consumidor real.** Ninguna abstracción, util compartido o infraestructura nueva se construye por anticipado sin evidencia de que el código real la justifica.
- **Auditoría de código sobre memoria de sesión.** Toda decisión de implementación de cada componente debe verificarse contra el estado real del repositorio al momento de comenzar ese componente, no contra lo documentado en fases anteriores.
- **Diffs quirúrgicos.** Ninguna implementación del MAU debe reemplazar archivos completos cuando el cambio real es puntual.
- **Trazabilidad.** Cada componente, al implementarse, produce su propio changeset documentado, sin alterar la documentación de fases anteriores.

---

## 13. Plan arquitectónico congelado

**Estructura**: el MAU permanece compuesto por cuatro componentes, exactamente como se cerró en FASE 20. Ninguno se subdivide a nivel arquitectónico.

**Relación de dependencias**:
- MAU-1 → fundacional, primero.
- MAU-2 → depende técnicamente de MAU-1; planificable en paralelo con MAU-3.
- MAU-3 → sin dependencia técnica con MAU-1 ni MAU-2; planificable en paralelo con MAU-2.
- MAU-4 → componente de cierre del MAU por criterio estratégico, no por dependencia técnica estricta.

**Matriz comparativa final**:

| | MAU-1 | MAU-2 | MAU-3 | MAU-4 |
|---|---|---|---|---|
| Dependencia técnica | Ninguna | MAU-1 | Ninguna | Ninguna |
| Criterio estratégico | Fundacional — habilita al resto | — | — | Componente de cierre — consolida observabilidad sobre lo ya implementado |
| Riesgo | Bajo-Medio | Medio | Bajo | Medio-Alto |
| Costo | Medio | Alto | Bajo | Medio |
| Beneficio | Bajo (preventivo) | Alto | Medio | Alto |
| Relación de orden | Primero | Paralelo con MAU-3, tras MAU-1 | Paralelo con MAU-2 | Cierre del MAU |

Este plan es el entregable oficial de FASE 21 y queda congelado como marco de referencia para Horizonte 3A.

---

## 14. Decisiones explícitamente postergadas para la implementación

Estas decisiones fueron identificadas durante el análisis de FASE 21, pero se determinó explícitamente que **no** corresponden al nivel arquitectónico y quedan abiertas para resolverse al comenzar cada componente:

- **MAU-1**: orden de construcción interno del contrato (STANDARD y PREMIUM simultáneo o escalonado); alcance exacto del primer contrato desplegado; partición en commits.
- **MAU-2**: priorización de qué variante PREMIUM se construye primero; tratamiento concreto del estado `"proximamente"` en `data/catalogo/templates.js`; partición en commits.
- **MAU-3**: mecanismo técnico concreto de lectura dinámica (fetch a ruta pública u otra alternativa); partición en commits.
- **MAU-4**: si el flujo RSVP se resuelve mediante una función compartida entre los seis templates o mediante correcciones independientes por sitio — decisión que debe tomarse comparando la firma real de cada `handleSubmit` en el código al momento de implementar, no asumida de antemano; división interna del trabajo entre los distintos casos de uso que cubre (RSVP, fallback de template, y cualquier otro que se identifique en ese momento); partición en commits.

**Nota metodológica registrada durante el cierre**: se identificaron explícitamente tres supuestos que, en versiones intermedias de este análisis, se habían presentado con apariencia de conclusión arquitectónica sin estar demostrados en el código: (1) que conviene extraer un util RSVP compartido, (2) que el contrato de MAU-1 debe construirse primero para STANDARD y después para PREMIUM, y (3) que `LEGACY_VISIBLE` en `AdminPage.jsx` es evidencia de demanda comercial real de P1. Se confirmó que la estrategia arquitectónica de la fase es idéntica con o sin estos tres supuestos — por lo tanto, ninguno integra el plan congelado; los tres quedan como hipótesis de partida a validar, no como decisiones, cuando corresponda implementar MAU-1, MAU-2 y MAU-4 respectivamente.

---

## 15. Decisiones cerradas — NO REABRIR

- El MAU permanece compuesto por 4 elementos, tal como se cerró en FASE 20. No se agregan ni se subdividen componentes a nivel arquitectónico.
- La relación de dependencias descrita en las secciones 8 y 13 es la decisión oficial de secuenciación de Horizonte 3A.
- Ninguna implementación fue aprobada en FASE 21. El plan es una decisión arquitectónica y de planificación, no un changeset de código.
- Los Riesgos A–D de FASE 19 y su reinterpretación como MAU en FASE 20 no se reclasifican ni se invalidan.
- Riesgos E, F, G, H, I permanecen exactamente en el estado documentado en FASE 19. Fuera de alcance de esta fase.
- El estado `"proximamente"` de S3/P1/P2/P3 en `data/catalogo/templates.js` no se reinterpreta como defecto: es consistente con §5.3 de `PRODUCTOS.md` y queda incorporado como parte del alcance de MAU-2, sin alterar la decisión de catálogo comercial completo (FASE 18).

---

## 16. Fuera de alcance de esta fase

- Implementación de código de cualquier tipo.
- Diseño de pantallas o flujos del Owner Tool (Horizonte 3B).
- Reapertura del MAU o de cualquier decisión cerrada en FASE 19 o FASE 20.
- Riesgo E, Riesgo F, Riesgo I.
- Herramienta de autoservicio para clientes.

---

## 17. Conclusiones

FASE 21 confirma que el MAU definido en FASE 20 es implementable como una secuencia de dependencias parcialmente paralela, no como una cadena estrictamente lineal: MAU-1 habilita al resto desde una posición fundacional; MAU-2 y MAU-3 pueden avanzar en paralelo una vez satisfecha esa base; MAU-4 se reserva deliberadamente para el cierre por una razón estratégica — consolidar observabilidad sobre una arquitectura que recién en ese punto habrá alcanzado el volumen de operación que justifica su urgencia.

La auditoría de código realizada durante esta fase no alteró el grafo de dependencias de FASE 20, pero sí precisó el costo real de dos de sus componentes: MAU-2 es más costoso de lo que su descripción arquitectónica sugiere (múltiples variantes, no un solo formulario), y MAU-4 tiene un radio de impacto más disperso de lo esperado (seis puntos de intervención de RSVP, no uno). Ninguna de estas precisiones cambia el orden ni la clasificación arquitectónica — ambas quedan documentadas como información relevante para el momento de implementar.

El ejercicio de separar explícitamente decisiones arquitectónicas de decisiones de implementación, realizado al cierre de esta fase, deja un plan más liviano y menos propenso a tener que reabrirse por detalles de ejecución que no deberían haber estado congelados en primer lugar.

---

## 18. Changeset aplicado

```
docs/Fase 21.md                     ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md     ← v12, sección 21 incorporada; secciones 1–19 sin alterar
Instrucciones maestras del proyecto ← a actualizar a versión FASE 21 (pendiente de generación explícita si se solicita)
```

---

## 19. Estado final de la fase

**FASE 21 — CERRADA.**

El Plan Arquitectónico de Implementación del MAU queda oficialmente congelado. Los cuatro componentes de FASE 20 permanecen sin alteración estructural. La relación entre ellos queda expresada como dependencias técnicas y estratégicas explícitamente diferenciadas, no como una secuencia numerada rígida. Las decisiones de implementación de cada componente quedan explícitamente abiertas y postergadas para resolverse al comenzar cada uno.

**Próximo paso**: inicio de la implementación incremental del MAU, comenzando por **MAU-1 — Contrato Ejecutable de Configuración**, bajo el protocolo obligatorio del proyecto (Análisis → Riesgos → Alternativas → Recomendación → Cambio mínimo → Impacto esperado → Esperando confirmación). No se implementa código hasta que cada paso sea aprobado explícitamente por Andrés.
