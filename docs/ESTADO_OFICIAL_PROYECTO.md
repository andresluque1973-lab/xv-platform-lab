[ESTADO_OFICIAL_PROYECTO.md](https://github.com/user-attachments/files/31767935/ESTADO_OFICIAL_PROYECTO.md)
# VELA — ESTADO OFICIAL DE PROYECTO
## Documento de transferencia de contexto

Versión: 21 · Fecha de corte: 2026-08
Propósito: continuidad exacta en nuevo chat. Registra decisiones, no las resume. Todo lo aquí contenido tiene estado **aprobado** salvo indicación contraria.

---

## 1. DECISIONES VIGENTES HEREDADAS (FASE 1–10)

**Arquitectura**: SaaS de invitaciones digitales. React 18 + Vite 5 + Tailwind + Vercel. RSVP via Google Sheets + Apps Script. Sin base de datos. Laboratorio: `xv-platform-lab`. Producción: `xv-sofia` — **NO TOCAR BAJO NINGUNA CIRCUNSTANCIA**.

**Fases completadas 1–10**: setup, invitación funcional, RSVP, Admin MVP, hardening, templates, modularización standard1, soporte sheet_id, arquitectura SaaS inicial, templateRegistry + TemplateLoader, contratos Clientes y Catálogo, AdminShell + ClientesPage (FASE 9, validada en producción), PRODUCTOS.md (FASE 10).

**Deudas técnicas activas diferidas**: DEUDA-001 (doble useConfig fetch entre TemplateLoader y templates — harmless por browser cache, diferida sin fecha).

**Decisiones arquitectónicas oficiales vigentes**:
- 8.3.A: slug como identidad central, inmutable una vez desplegado.
- 8.3.C: estados deploy_estado — draft→deployed→archived. **Prohibido**: deployed→draft.
- 8.3.D: AdminPage responsabilidad única (generar config.json).
- FASE 8: templates como variantes visuales; divergencia funcional entre variantes = defecto.
- FASE 9: index.json solo desde ClientesPage por import estático.
- FASE 10: STANDARD y PREMIUM son los productos; S1–S3/P1–P3 son variantes visuales.

**Restricciones vigentes**: xv-sofia intocable; AdminPage sin modificación sin análisis; index.json solo lectura/solo panel admin/sin datos sensibles; slug "admin" reservado; no marcar template disponible sin 4 condiciones cumplidas (§5.3 PRODUCTOS.md); no nuevas dependencias sin consumidor real; no automatización prematura.

**Catálogo visual oficial**: `data/catalogo/VARIANTES.md` es fuente de verdad visual. Si una propuesta la contradice, VARIANTES.md prevalece.

**Documentación complementaria registrada**: `/docs/FASE_12_2.md`, `/docs/FASE_12_3.md`, `/docs/AUDITORIA_S2.md`, `/docs/AUDITORIA_S2_CIERRE.md`, `/docs/Fase 13.md`, `/docs/Fase 14.md`, `/docs/Fase 15.md`, `/docs/Fase 16.md`, `/docs/Fase 17.md`, `/docs/Fase 18.md`, `/docs/Fase 19.md`, `/docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md`, `/docs/Fase 20.md`, `/docs/Fase 21.md`, `/docs/Fase 22.md`.

**Protocolo**: Análisis→Riesgos→Alternativas→Recomendación→Cambio mínimo→Impacto→Esperando confirmación. No implementar sin aprobación. Diffs quirúrgicos. Preservar comentarios y deuda documentada. "Si algo funciona, no se toca."

---

## 2. FASE 11 — CERRADA Y VALIDADA

Entregable: `data/catalogo/VARIANTES.md` v1, aprobado. Tres familias visuales:

| Familia | Propósito | STANDARD | PREMIUM |
|---|---|---|---|
| Emotiva | Conmover | S1 | P1 |
| Con Carácter | Destacar | S2 | P2 |
| Elegante | Refinar | S3 | P3 |

**Regla de evolución §6.2 (CRÍTICO)**: las familias prevalecen sobre las implementaciones históricas — incluyendo S1. S1 es una implementación de Emotiva en un momento dado, no su definición. VARIANTES.md §3 es la fuente de verdad visual de Emotiva. Ninguna variante es visualmente definitiva.

---

## 3. FASE 12.1 — CERRADA Y VALIDADA (incluye FASE 12.0)

**FASE 12.0**: criterios de validación aprobados para las tres familias. Señales obligatorias de identidad + señales de riesgo hacia cada otra familia + condiciones mínimas de pertenencia. **Regla de autoridad**: criterios de 12.0 prevalecen sobre reglas operativas posteriores.

**Regla de referencias 12.1**: toda referencia incluye criterios que demuestra / que NO demuestra / por qué pertenece y no a las otras dos / **Señales visuales extraídas** (activo permanente; la referencia es temporal).

**Referencias aprobadas**:
- Emotiva: inclusión — Lana Del Rey (Ultraviolence/Born to Die), Maison Margiela Replica. Exclusión — Glossier 2014–2019 (borde Con Carácter), Loro Piana editorial (borde Elegante).
- Con Carácter: inclusión — Off-White (Virgil Abloh), Aesop packaging. Exclusión — Chanel sistema clásico (borde Elegante), Spotify 2015–2018 (borde por exceso).
- Elegante: inclusión — Aman Resorts, Kinfolk editorial. Exclusión — informe corporativo genérico ("ordenado ≠ Elegante"), minimalismo escandinavo genérico IKEA ("económico ≠ refinado").

**Principios sintetizadores y mecanismos — APROBADOS, NO REABRIR**:

| Familia | Modo | Principio | Mecanismo |
|---|---|---|---|
| Emotiva | Atmósfera | **Emoción sofisticada** | Emoción via atmósfera/temperatura/jerarquía/ritmo — no ornamento tradicional. Recursos contemporáneos/cinematográficos/atmosféricos. |
| Con Carácter | Estructura | **Postura visible** | Decisiones visuales existen para afirmar postura perceptible antes de la lectura; no justificable por funcionalidad/jerarquía/refinamiento; incluso a costa de notarse. |
| Elegante | Servicio | **Refinamiento inevitable** | **Servicio Absoluto**: ningún elemento existe para ser notado por sí mismo; subordinado a jerarquía/contenido/evento. |

**Hallazgo estructural 12.1**: las tres familias responden de forma mutuamente excluyente a "¿en función de qué existe cada decisión visual?" — Emotiva: la sensación; Con Carácter: la postura; Elegante: todo aquello que no es la decisión misma.

---

## 4. FASE 12.2 — CERRADA Y VALIDADA

**Entregable oficial**: `/docs/FASE_12_2.md`. En caso de divergencia editorial menor, `/docs/FASE_12_2.md` es la fuente de verdad textual de la fase.

### 4.1 Reglas transversales aplicadas

1. **Regla de diferenciación obligatoria** (3 preguntas): por qué fortalece su familia + por qué no sería válida para cada una de las otras dos.
2. **Hipótesis cromática compartida (verificada)**: las tres familias usan los 5 colores oficiales VELA (`#F8F5EF`, `#B9A68E`, `#8B7355`, `#1A1A1A`, `#E6D3A8`). Se diferencian por función/rol, no por contenido cromático.
3. **Filtro de modo**: Emotiva=Atmósfera / Con Carácter=Estructura / Elegante=Servicio. Se sostuvo sin excepciones en las tres capas cerradas.
4. **Separación Familia / Instanciación**: instanciación puede alterar dominancias o polaridad pero no eliminar roles de familia.
5. **Prueba de reemplazo**: método de auditoría sistemático aplicado en las tres capas.

### 4.2 CAPA PALETA — CERRADA

| Familia | Rol obligatorio (signature) | Roles complementarios |
|---|---|---|
| Emotiva | **Luz emocional** — tono cálido luminoso como foco emocional | Profundidad, Transición, Soporte |
| Con Carácter | **Afirmación cromática** — decisión cromática en modo Estructura (borde duro / proporción inusual / posición asimétrica) | Campo, Tipografía con carácter, Soporte |
| Elegante | **Cohesión tonal** — todos los tonos en banda estrecha de temperatura/valor; ninguna transición percibida como oposición | Jerarquía, Acento (opcional) |

### 4.3 CAPA TIPOGRAFÍA — CERRADA

| Familia | Rol obligatorio tipográfico | Eje de identidad |
|---|---|---|
| Emotiva | **Ninguno positivo.** Restricción: ningún nivel tipográfico puede operar en modo Estructura. | Todo intercambiable |
| Con Carácter | **Tipografía con intención identitaria** — reemplazarla por genérica cambiaría perceptiblemente la identidad. | Voz/tipo de letra NO intercambiable; proporción sí |
| Elegante | **Tipografía proporcional** — identidad en relaciones de escala/espaciado/ritmo. | Sistema de proporción NO intercambiable; voz sí |

### 4.4 CAPA COMPOSICIÓN — CERRADA

| Familia | Modo | Rol obligatorio compositivo |
|---|---|---|
| Emotiva | Atmósfera | **Continuidad atmosférica** — ausencia de divisiones duras, bordes marcados o puntos de tensión localizables en cualquier punto de la experiencia, incluyendo la entrada. |
| Con Carácter | Estructura | **Quiebre compositivo localizable** — existe al menos un punto donde la disposición esperada se interrumpe de forma deliberada y señalable. |
| Elegante | Servicio | **Espacio sin sobrante** — cada elemento, incluido el espacio vacío, cumple una función precisa y verificable. |

**Aclaración aprobada sobre "Espacio sin sobrante"**: no implica minimizar el espacio vacío. Puede existir espacio vacío abundante, siempre que esté al servicio de la jerarquía, la respiración o la lectura. La condición es funcional, no cuantitativa.

---

## 5. FASE 12.3 — CERRADA Y VALIDADA

**Entregable oficial**: `/docs/FASE_12_3.md`. Ver ese documento para pruebas completas y hallazgos estructurales.

### 5.1 CAPA MOVIMIENTO — CERRADA

| Familia | Modo | Rol obligatorio de Movimiento |
|---|---|---|
| Emotiva | Atmósfera | **Asentamiento emocional** — cada transición conserva un margen de permanencia perceptible que permite que el contenido precedente se registre emocionalmente antes de que comience el siguiente movimiento. |
| Con Carácter | Estructura | **Postura en acto** — cuando existe movimiento en el punto del quiebre, la decisión se percibe como un acontecimiento localizable en el tiempo, no como un atributo ya dispuesto desde el principio. Intensidad, velocidad o fuerza son instanciación. |
| Elegante | Servicio | **Movimiento al servicio** — cuando existe movimiento, su única función es hacer más legible o más precisa la jerarquía del contenido. No existe para ser percibido como movimiento. |

### 5.2 Hallazgos estructurales de FASE 12.3

- Gradualidad espacial y cadencia temporal son variables independientes. Los roles de composición no implican ni garantizan los roles de movimiento.
- Los recursos temporales son compartibles entre familias; la identidad la determina la función, no la presencia del recurso.
- Tres funciones temporales mutuamente excluyentes: facilitar registro emocional (Emotiva) / convertir la decisión en acontecimiento (Con Carácter) / subordinarse al contenido (Elegante).
- Quiebre Compositivo Localizable y Postura en Acto comparten estructura de localizabilidad, aplicada al espacio y al tiempo respectivamente.
- Asimetría de presencia: Emotiva presupone movimiento (sin condicional); Con Carácter y Elegante no lo exigen (con condicional).

### 5.3 Regla transversal emergente de FASE 12.3

Ninguna validación de movimiento puede formularse en términos de duración, velocidad o tipo de curva. Estas son siempre instanciaciones. La validación verifica función, no atributos del recurso temporal.

---

## 6. PRINCIPIOS, MECANISMOS Y ROLES — TABLA MAESTRA CONSOLIDADA

| Familia | Modo | Principio sintetizador | Rol Paleta | Rol Tipografía | Rol Composición | Rol Movimiento |
|---|---|---|---|---|---|---|
| Emotiva | Atmósfera | Emoción sofisticada | Luz emocional | Ninguno (restricción negativa) | Continuidad atmosférica | Asentamiento emocional |
| Con Carácter | Estructura | Postura visible | Afirmación cromática | Tipografía con intención identitaria | Quiebre compositivo localizable | Postura en acto |
| Elegante | Servicio | Refinamiento inevitable | Cohesión tonal | Tipografía proporcional | Espacio sin sobrante | Movimiento al servicio |

---

## 7. DECISIONES DESCARTADAS

Ver secciones de decisiones descartadas en `/docs/FASE_12_2.md` (sección 7), `/docs/FASE_12_3.md` (sección 7) y `/docs/Fase 13.md` (sección 3).

---

## 8. FASE 14 — CERRADA Y VALIDADA

**Objetivo**: resolución de DEUDA-002 (duplicación de `useCountdown` entre S1 y S2).

**Cambios aplicados**:
- `src/templates/shared/hooks.js` — creado, contiene `useCountdown` canónico.
- `src/templates/standard1/hooks.js` — re-exporta desde shared, contrato externo intacto.
- `src/templates/S2.jsx` — import desde shared, inline eliminado.

**Decisiones**: solo `useCountdown` extraído. `useAudio`, `useEntered`, `useSlug` permanecen locales sin evidencia suficiente. `src/templates/shared/` establecido como espacio canónico para lógica compartida con consumidor real verificado.

---

## 9. FASE 15 — CERRADA Y VALIDADA

**Objetivo**: construir S3.jsx como primera implementación de la familia Elegante.

**Hipótesis validadas**:
1. La arquitectura soporta una tercera familia visual sin evolución arquitectónica.
2. La familia Elegante puede expresarse sin nuevas abstracciones.
3. La diferenciación respecto a S1 y S2 es inmediata y estructural.

**Auditoría visual — cuatro preguntas**:

| Pregunta | Resultado |
|---|---|
| ¿S3 se percibe inmediatamente diferente de S1? | ✅ Sí — S1 tiene profundidad atmosférica; S3 es plana en crema sin atmósfera |
| ¿S3 se percibe inmediatamente diferente de S2? | ✅ Sí — S2 tiene bloque negro estructural y tipografía de impacto; S3 no tiene negro estructural |
| ¿La organización visual depende principalmente del espacio y no del color? | ✅ Sí (con OBS-S3-001 registrada) |
| ¿La sensación dominante es refinamiento y no emoción ni afirmación? | ✅ Sí |

**Changeset**:
- `src/templates/S3.jsx` — creado, 444 líneas, autocontenido, patrón S2.
- `src/templates/templateRegistry.js` — +1 entrada S3, diff mínimo.

**Hallazgo estructural de cierre** — los tres organizadores del catálogo STANDARD:

| Template | Familia | Organizador visual |
|---|---|---|
| S1 | Emotiva | Atmósfera |
| S2 | Con Carácter | Contraste |
| S3 | Elegante | Espacio |

Las tres familias STANDARD conviven dentro del mismo contrato técnico y sistema operativo sin requerir evolución arquitectónica. Esto constituye la **validación completa del catálogo STANDARD**.

---

## 10. FASE 16 — CERRADA Y VALIDADA

**Objetivo**: determinar qué significa PREMIUM en VELA y construir la primera variante del catálogo PREMIUM (P1).

Ver `docs/Fase 16.md` para historial completo de subfases, decisiones e incidencias.

### 10.1 Decisiones cerradas de FASE 16 — NO REABRIR

**PREMIUM = superconjunto funcional de STANDARD.** La diferencia entre STANDARD y PREMIUM es exclusivamente funcional. No existe una "estética PREMIUM" independiente de las familias visuales. Derivado de PRODUCTOS.md; ratificado en FASE 16A.

**Familias visuales son ortogonales al tier.** P1/P2/P3 heredan los roles cerrados de su familia (Emotiva/Con Carácter/Elegante). El tier determina capacidades; la familia determina identidad visual.

**Instanciación de Emotiva en paleta oficial VELA**: campo oscuro cálido (Mocha profundo) con luz emergente (Champagne como foco). Estructura invertida respecto de S3 (superficie clara dominante). Esta es la distinción estructural verificable entre P1 y S3 dentro de la misma paleta.

**P1 como referencia arquitectónica de la línea PREMIUM.** Archivo único autocontenido, patrón S2/S3. P2 y P3 seguirán este patrón. La estructura modular histórica de `standard1/` no se traslada a la línea PREMIUM.

**Contrato de datos PREMIUM (§4.5)** cerrado en PRODUCTOS.md v2. El orden de `timeline`, `fotos` e `itinerario` es significativo y debe preservarse en toda la cadena.

### 10.2 Validaciones obtenidas

**VALIDACION-P1-001** — P1 se percibe claramente como categoría superior respecto del catálogo STANDARD sin romper la identidad VELA ni confundirse con S3. Criterio de diferenciación P1/S3: **superado**.

### 10.3 Changeset de FASE 16

| Archivo | Acción |
|---|---|
| `src/templates/P1.jsx` | Creado. 1.422 líneas, archivo único, patrón S2/S3. |
| `src/templates/templateRegistry.js` | +1 import P1, +1 entrada `category: 'premium'`. |
| `public/clientes/prueba/config.json` | Extendido con campos §4.5. Plan: PREMIUM, template: P1. |
| `data/catalogo/PRODUCTOS.md` | v2 — §4.5 incorporado. |

## 11. FASE 17 — CERRADA Y VALIDADA

**Objetivo**: construir P2.jsx como segunda variante del catálogo PREMIUM. Familia: Con Carácter.

Ver `docs/Fase 17.md` para historial completo de subfases, decisiones e incidencias.

### 11.1 Decisiones cerradas de FASE 17 — NO REABRIR

**Principio de densidad de identidad (Con Carácter PREMIUM):** las secciones de entrada (Cover, HeroSection, EventSection) son responsables de establecer inequívocamente la identidad Con Carácter. Las secciones narrativas extensas (Historia, Timeline, Fotos, Itinerario) pueden relajar la estructura compositiva preservando continuidad cromática, tipográfica y de tono. La identidad de familia no necesita expresarse con la misma intensidad en todas las secciones del recorrido PREMIUM.

**Instanciación de Con Carácter en tier PREMIUM verificada:** misma instanciación visual que S2.2 en secciones de entrada (bloque Negro 55%, Bebas Neue, división estructural, Postura en acto). Secciones narrativas extensas con estructura relajada, voz tipográfica y continuidad cromática mantenidas.

**P2 como segunda evidencia del patrón arquitectónico PREMIUM.** Archivo único autocontenido, 1.596 líneas, patrón P1. P3 seguirá este patrón.

**Hipótesis estratégica registrada (diferida):** cuando aparezca el primer cliente real comprometido, la combinación onboarding real + extensión AdminPage PREMIUM constituye el mayor generador de aprendizaje operativo. Requiere presión comercial concreta para activarse — no altera el roadmap vigente.

### 11.2 Validaciones obtenidas

| Criterio | Resultado |
|---|---|
| Coherencia familiar respecto de S2 | ✅ Aprobado — percepción inmediata de pertenencia a Con Carácter |
| Diferenciación respecto de P1 | ✅ Aprobado — productos claramente distintos |
| Sostenibilidad visual del recorrido PREMIUM | ✅ Aprobado con OBS-P2-001 |
| Integración de capacidades PREMIUM en lenguaje Con Carácter | ✅ Aprobado — percibido como "S2 llevada a PREMIUM" |
| Principio de densidad de identidad | ✅ Validado empíricamente — Cover como sección de mayor fuerza identitaria |

**Puntuación global auditoría 17C**: 10/10 — "P2 se siente exactamente como S2 extendida al contrato PREMIUM."

### 11.3 Changeset de FASE 17

| Archivo | Acción |
|---|---|
| `src/templates/P2.jsx` | Creado. 1.596 líneas, archivo único, patrón P1. |
| `src/templates/templateRegistry.js` | +1 import P2, +1 entrada `category: 'premium'`. |
| `public/clientes/prueba/config.json` | `"template": "P2"` durante validación. Revertir a `"P1"` tras cierre. |

---

## 12. FASE 18 — CERRADA Y VALIDADA

**Objetivo**: construir P3.jsx como tercera y última variante del catálogo PREMIUM. Familia: Elegante. **Catálogo comercial VELA completo.**

Ver `docs/Fase 18.md` para historial completo de subfases, decisiones e incidencias.

### 12.1 Decisiones cerradas de FASE 18 — NO REABRIR

**Criterio Alt D — Ritmo editorial (aprobado en FASE 18A):** P3 se orienta mediante ritmo editorial y NO mediante delimitación visual. Prohibido: líneas divisorias, cards, paneles, cajas, cambios sistemáticos de superficie. Tres mecanismos de orientación, ninguno introduce un organizador nuevo: (1) ancho variable como herramienta narrativa; (2) agrupación narrativa por diferencial de espaciado vertical; (3) titulación editorial como ancla cognitiva.

**Diferenciador estratégico cerrado:** P3 no es el PREMIUM más completo. Es el PREMIUM más refinado.

**Instanciación de Elegante en tier PREMIUM verificada:** Crema dominante en todo el recorrido. Champagne exclusivo en EventSection y ConfirmSection. Sin Bebas Neue. Sin bloque Negro estructural. Movimiento invisible (`opacity + translateY(10-12px)`, `0.5s ease`, sin cubic-bezier de carácter).

**OBS-S3-001 formalizada y cerrada:** Champagne como superficie de sección en Elegante PREMIUM es instanciación válida de Cohesión tonal. No es anomalía. No se reabre.

**Divergencias intencionales P3 vs S3:** sin `Divider()`, sin `borderTop` en Footer — reemplazados por espaciado diferencial. S3 no fue modificado. Divergencias documentadas en VARIANTES.md §5.14.

**Hipótesis de aislamiento de Cover (FASE 18D) — confirmada:** la percepción de vacío en el Cover se disolvió al anclar HeroSection como prólogo formal, sin intervenir el Cover. El principio de mínima intervención + aislamiento empírico de la variable evitó una sobrecorrección sobre la pieza más delicada de la identidad Elegante.

**P3 como tercera evidencia del patrón arquitectónico PREMIUM.** Archivo único autocontenido, 1.393 líneas, patrón P1/P2.

### 12.2 Validaciones obtenidas

| Criterio | Resultado |
|---|---|
| Coherencia familiar respecto de S3 | ✅ Aprobado — identidad Elegante desde el inicio, sin contaminación cruzada |
| Diferenciación respecto de P1 y P2 | ✅ Aprobado — percibida como "más refinada y silenciosa" que otras variantes PREMIUM |
| Sostenibilidad visual del recorrido PREMIUM | ✅ Aprobado tras FASE 18D |
| Integración de capacidades PREMIUM en lenguaje Elegante | ✅ Aprobado — ConfirmSection percibida como superior al modelo S1 |
| Gramática editorial continua (Alt D) | ✅ Validada empíricamente — criterio negativo y positivo superados |

**Criterio de validación — resultado final:**
- ✅ Prueba negativa: no se siente como navegar entre componentes.
- ✅ Prueba positiva: sí se siente como avanzar a través de capítulos de una misma pieza editorial.

### 12.3 Changeset de FASE 18

| Archivo | Acción |
|---|---|
| `src/templates/P3.jsx` | Creado. 1.393 líneas, archivo único, patrón P1/P2. |
| `src/templates/templateRegistry.js` | +1 import P3, +1 entrada `category: 'premium'`. |
| `public/clientes/prueba/config.json` | `"template": "P3"` durante validación. Revertir tras cierre. |
| `data/catalogo/VARIANTES.md` | v4 — §5.14 P3.1 incorporado. |

---

## 13. QUÉ NO DEBE REABRIRSE

- Sección 1 completa (FASE 1–10).
- FASE 11 completa.
- FASE 12.0 completa.
- FASE 12.1 completa.
- FASE 12.2 completa — Capa Paleta, Capa Tipografía y Capa Composición.
- FASE 12.3 completa — Capa Movimiento de las tres familias, hallazgos estructurales, regla transversal, decisión de diferir capas restantes.
- FASE 13 completa — S2.2 como referencia operativa de Con Carácter.
- FASE 14 completa — resolución DEUDA-002, extracción useCountdown a shared/hooks.js.
- FASE 15 completa — S3.1 como referencia operativa de Elegante, catálogo STANDARD validado.
- FASE 16 completa — P1.1 como referencia operativa de Emotiva PREMIUM, contrato §4.5, instanciación Emotiva en paleta oficial VELA.
- FASE 17 completa — P2.1 como referencia operativa de Con Carácter PREMIUM, principio de densidad de identidad validado empíricamente.
- FASE 18 completa — P3.1 como referencia operativa de Elegante PREMIUM, criterio Alt D (Ritmo editorial) validado empíricamente, OBS-S3-001 formalizada y cerrada.
- FASE 19 completa — mapa de riesgos consolidado (Riesgos A–I), fortalezas arquitectónicas confirmadas. Ver sección 18.
- FASE 20 completa — Minimum Architecture Upgrade (MAU) de 4 elementos. Ver sección 19.

**Excepción explícita única vigente**: el filtro de modo (Atmósfera/Estructura/Servicio) puede reabrirse si durante la construcción de implementaciones futuras aparece una decisión correcta para alguna familia que no pueda describirse mediante estos tres modos.

---

## 14. OBSERVACIONES ABIERTAS (sin prioridad — requieren exposición real)

**OBS-001** (S2.2) — Si S2.2 se lee como identidad propia vs. variante oscura de S1.
**OBS-002** (S2.2) — Tratamientos alternativos para el bloque negro.
**OBS-003** (S2.2) — Bebas Neue como validación de instanciación, no decisión permanente de familia.
**OBS-S3-001** (S3.1) — ~~EventSection usa Champagne como fondo de sección. Introducía color como separador secundario además del espacio.~~ **RESUELTA en FASE 18:** formalizada como instanciación válida de Cohesión tonal en Elegante PREMIUM. Extendida a ConfirmSection en P3. No es anomalía. No se reabre.
**OBS-P3-001** (P3.1) — Contraste Taupe-sobre-Crema en labels y eyebrows pequeños (`clamp(0.5rem, 0.9vw, 0.65rem)`) puede resultar insuficiente en mobile en recorridos narrativos largos. Patrón heredado de S3 y amplificado por volumen. Parcialmente corregido en FASE 18D (textos informativos reclasificados a Mocha). Patrón persiste en eyebrows y labels de formulario. Evaluar con exposición real de clientes.
**OBS-P1-001** (P1.1) — `ConfirmadosSection` en P1 tiene como consumidor actual a los invitados de la invitación. La intención comercial es que confirmados, estadísticas y métricas de asistencia migren en fases futuras a una herramienta administrativa para el organizador, reutilizando la misma infraestructura Sheets + Apps Script. Sin impacto en P1 ni en §4.5.
**OBS-P1-002** (P1.1) — Schema simplificado de §4.5 puede no reflejar completamente las necesidades operativas reales. Candidatos para revisión futura: múltiples asistentes por confirmación, restricciones con opciones controladas, reducción de campos libres. Requiere evidencia operativa antes de reabrir §4.5.
**OBS-P1-003** (P1.1) — Historia ampliada genera scroll largo en mobile. No es defecto de implementación sino consecuencia natural del volumen narrativo PREMIUM. Evaluar con contenido real de cliente.
**OBS-P2-001** (P2.1) — Mobile: entre Historia y Momentos/Timeline algunos bloques de texto se perciben largos. Ajuste iterativo de densidad y ritmo de lectura mobile. No bloqueante. Requiere exposición real con clientes.

---

## 15. ESTADO DE IMPLEMENTACIÓN DEL CATÁLOGO

| Variante | Familia | Tier | Estado |
|---|---|---|---|
| S1 | Emotiva | STANDARD | ✅ Validada en producción |
| S2 | Con Carácter | STANDARD | ✅ Validada en producción |
| S3 | Elegante | STANDARD | ✅ Validada en Preview Deployment |
| P1 | Emotiva | PREMIUM | ✅ Validada en Preview Deployment |
| P2 | Con Carácter | PREMIUM | ✅ Validada en Preview Deployment |
| P3 | Elegante | PREMIUM | ✅ Validada en Preview Deployment |

---

## 16. DEUDAS TÉCNICAS ACTIVAS

| ID | Descripción | Estado |
|---|---|---|
| DEUDA-001 | Doble `useConfig` fetch entre TemplateLoader y templates. Harmless por browser cache. | Diferida sin fecha |

---

## 17. ROADMAP — HORIZONTE ESTRATÉGICO POST-CATÁLOGO

**Catálogo comercial VELA: COMPLETO.** S1 ✅ · S2 ✅ · S3 ✅ · P1 ✅ · P2 ✅ · P3 ✅

La fase de construcción de templates concluyó en FASE 18. FASE 19 auditó el sistema con foco operativo y consolidó un mapa de riesgos. FASE 20 transformó ese mapa en una decisión arquitectónica (el MAU — ver sección 19). El proyecto entra ahora en **Horizonte 3A**: implementación del MAU como prerequisito del Owner Tool.

**Horizontes vigentes:**
- **Horizonte 3A** — Prerequisitos del Owner Tool: implementación de los 4 elementos del MAU (sección 19), en el orden que se defina en la subfase siguiente de FASE 20/Horizonte 3A, bajo protocolo obligatorio.
- **Horizonte 3B** — Construcción del Owner Tool sobre el MAU ya implementado.
- **Etapa 4** — Capacidades de autoservicio para clientes.

**Hipótesis de mayor generador de aprendizaje (registrada FASE 17, vigente):** onboarding real + AdminPage PREMIUM = mayor generador de aprendizaje operativo cuando exista cliente comprometido. No activa el roadmap en su ausencia.

**Infraestructura diferida** (sin condición de activación específica):
- Dynamic OG/SEO meta tags.
- Ruta 404 para slugs desconocidos.
- Revisión schema RSVP PREMIUM (OBS-P1-002) — requiere evidencia operativa previa.
- Riesgo E (credenciales expuestas en `config.json` público) — requiere auditoría de permisos de Apps Script no realizada aún.
- Riesgos F e I — fuera de alcance, ver sección 18.

---

## 18. FASE 19 — AUDITORÍA ARQUITECTÓNICA CON FOCO OPERATIVO — CERRADA

**Esta sección no fue modificada por FASE 20. Se preserva íntegra como resultado histórico de la auditoría.**

**Objetivo cumplido**: auditoría del repositorio completo (`xv-platform-lab`) desde la perspectiva de escalabilidad operativa, no de templates. Ningún código fue modificado. Ninguna implementación fue aprobada. Fase exclusivamente de descubrimiento y consolidación de riesgos.

**Documento de referencia completo**: `docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md` — informe ejecutivo con evidencia de repositorio, riesgos de escala y clasificación por tema.

**Fortalezas confirmadas (preservar)**: separación templateRegistry/catálogo comercial; patrón de archivo único autocontenido por template; ortogonalidad Familia × Tier; disciplina de contratos documentados (`CONTRATO.md`); metodología de fases cerradas sin reapertura.

**Temas arquitectónicos identificados**:

| Tema | Descripción | Clasificación |
|---|---|---|
| A | Ausencia de capa de validación de datos entre creación y consumo de `config.json` | 🔴 Resolver antes de Owner Tool |
| B | Fallos silenciosos por diseño — fallback `TemplateLoader`→S1 y RSVP `no-cors` asumido como éxito (impacto no equivalente entre ambos componentes) | 🔴 Resolver antes de Owner Tool |
| C | Registro de clientes (`index.json`) embebido en bundle JS — requiere rebuild+redeploy para cualquier alta | 🔴 Resolver antes de Owner Tool |
| D | `AdminPage.jsx` solo genera schema STANDARD; no cubre contrato PREMIUM §4.5 | 🔴 Resolver antes de Owner Tool |
| E | Exposición pública de `apps_script_url`/`sheet_id` en `config.json` bajo `public/` — explotabilidad real depende de configuración de Apps Script no auditada en esta fase | 🔵 Mejora inmediata (revisión, no remediación estructural) |
| F | Modelo de dominio: Cliente/Evento fusionados, `config.json` sobrecargado con 5 responsabilidades | 🟢 Puede esperar — no es deuda activa contra el modelo comercial vigente |
| G | Slug como única integridad referencial entre 3 capas desacopladas | 🟡 Deuda aceptable — subsumido en Tema A |
| H | Sin punto de integración para CI/validación automatizada | 🟡 Deuda aceptable — consecuencia de resolver Tema A |
| I | Ausencia de estado dinámico propio de plataforma (sin DB, RSVP vive solo en Sheets) | 🟢 Puede esperar — disparador: autoservicio, no volumen de clientes |

**Corrección registrada durante la auditoría**: el estado `"proximamente"` de S3/P1/P2/P3 en `data/catalogo/templates.js` no es documentation drift. Es consistente con §5.3 de `PRODUCTOS.md` (exige validación funcional en producción, no solo en Preview, para el estado `disponible`). Catálogo comercialmente completo ≠ todas las variantes formalmente `disponible`. Ambas afirmaciones son correctas y no se contradicen entre sí.

**Decisiones cerradas — NO REABRIR**:
- Ninguna implementación fue aprobada durante FASE 19.
- Los temas A, B, C, D quedan registrados como bloqueantes conceptuales de la futura fase de Owner Tool, no como trabajo en curso.
- El Tema F queda explícitamente documentado como NO deuda activa — no debe interpretarse como pendiente de refactor.
- Priorización entre temas 🔴 y cualquier decisión de intervención quedan diferidas a una fase posterior específica, siguiendo el protocolo obligatorio del proyecto.

**Nota de trazabilidad (agregada en FASE 20, sin alterar el contenido anterior)**: la priorización diferida en el último punto fue resuelta en FASE 20 mediante la definición del Minimum Architecture Upgrade (MAU) — ver sección 19. El MAU es la interpretación estratégica de los Temas A–D; no los reclasifica ni los invalida.

**Changeset aplicado**:
```
docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md  ← nuevo, informe completo de auditoría
docs/Fase 19.md                                ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md                ← v10, sección 18 incorporada
```

---

## 19. FASE 20 — TRANSFORMACIÓN DEL MAPA DE RIESGOS EN ARQUITECTURA DE CAPACIDADES — CERRADA

**Objetivo cumplido**: transformar el mapa de riesgos de FASE 19 (Temas A–D) en un plan de intervención arquitectónica mínimo, priorizado y alineado con el desarrollo del Owner Tool. Fase exclusivamente estratégica — no se implementó ni modificó código.

**Documento de referencia completo**: `docs/Fase 20.md`.

**Relación con FASE 19**: FASE 19 identifica y clasifica. FASE 20 interpreta esos hallazgos y decide cuáles integran la arquitectura mínima necesaria. El MAU es la consecuencia estratégica de la auditoría, no su reemplazo. La sección 18 de este documento permanece sin alteración.

**Grafo de dependencias técnicas (verificado por inspección directa de código)**:

```
RIESGO-A (contrato + validación) — fundacional, sin dependencias
   │
   ├──► RIESGO-B2 (fallback ambiguo TemplateLoader→S1)
   ├──► RIESGO-D (schema PREMIUM en AdminPage)
   └──► RIESGO-C (registro dinámico seguro)

RIESGO-B1 (RSVP no-cors) — aislado, sin dependencias
```

**Reinterpretación de riesgos como capacidades de plataforma**:

| Riesgo FASE 19 | Capacidad de plataforma | Clasificación |
|---|---|---|
| Riesgo A | Contrato Ejecutable de Configuración | Fundacional |
| Riesgo C | Gestión Dinámica de Clientes | Habilitadora |
| Riesgo D | Generación Universal de Configuraciones | Habilitadora |
| Riesgo B | Observabilidad Operativa | Evolutiva (técnica) / estratégicamente acoplada al éxito de las otras tres |

**Distinción metodológica establecida en esta fase**: dependencia técnica (¿puede construirse sin romper el sistema?) y dependencia estratégica (¿con qué mínimo estamos dispuestos a liberar la primera operación real?) no son equivalentes. El éxito de una capacidad puede volver imprescindible otra que técnicamente era opcional.

**Condiciones de liberación de la plataforma** (no del Owner Tool como herramienta aislada, sino de VELA como plataforma operable):

Imprescindibles:
1. Alta de cliente sin deploy.
2. Cobertura completa de las seis variantes del catálogo comercial.
3. Validez de configuración verificable antes de publicar.
4. Detección explícita de los fallos críticos ya identificados sin depender de inspección manual.

Deseables (no bloquean la primera liberación):
5. Vista de estado consolidado de salud de todos los clientes.
6. Automatizaciones adicionales de notificación/alerta.

**DECISIÓN ARQUITECTÓNICA OFICIAL — Minimum Architecture Upgrade (MAU)**:

| Elemento | Condición que satisface | Capacidad de FASE 19 que reinterpreta |
|---|---|---|
| **MAU-1** — Contrato Ejecutable de Configuración | Validez verificable antes de publicar | Riesgo A |
| **MAU-2** — Generación Universal de Configuraciones | Cobertura completa de las 6 variantes | Riesgo D |
| **MAU-3** — Fuente Dinámica de Registro de Clientes | Alta de clientes sin deploy | Riesgo C |
| **MAU-4** — Señalización Explícita de Fallos Críticos | Detección de fallos sin inspección manual | Riesgo B |

**Relación entre los cuatro elementos**: MAU-1 es la base sobre la que MAU-2 y MAU-4 validan lo que producen; MAU-3 se apoya en MAU-1 pero es arquitectónicamente independiente en su construcción. MAU-2 y MAU-3 son paralelos entre sí y, juntos, completan la primera pantalla operativa de la plataforma. MAU-4 no bloquea a los otros tres, pero su ausencia convierte el éxito de los otros tres en el vector del próximo incidente no detectado. Justificación completa de cada elemento (por qué no puede diferirse, qué ocurriría si se omitiera, qué habilita, qué principio arquitectónico preserva) en `docs/Fase 20.md`, sección 6.

**Decisiones cerradas — NO REABRIR**:
- El MAU de 4 elementos es la respuesta oficial de FASE 20. Ninguna implementación fue aprobada — es una decisión arquitectónica, no un changeset.
- Los Riesgos A–D de FASE 19 (sección 18) no se reclasifican ni se invalidan.
- Riesgos E, F, G, H, I permanecen exactamente en el estado documentado en FASE 19. Fuera de alcance de esta fase.
- El orden de implementación de los 4 elementos del MAU y el diseño de pantallas del Owner Tool quedan diferidos a Horizonte 3A.

**Fuera de alcance de FASE 20**: implementación de código; diseño de pantallas del Owner Tool; orden de intervención entre los elementos del MAU; Riesgo E; Riesgos F e I; herramienta de autoservicio para clientes.

**Changeset aplicado**:
```
docs/Fase 20.md                     ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md     ← v11, sección 19 incorporada; sección 18 sin alterar
Instrucciones maestras del proyecto ← actualizadas a versión FASE 20
```

---

## 20. [Sección histórica reemplazada — ver sección 22]

La sección 20 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 20) queda reemplazada por las secciones 21 y 22, que incorporan el cierre de FASE 21. Contenido preservado en `docs/Fase 20.md`, sección 10, sin alteración.

---

## 21. FASE 21 — PLANIFICACIÓN DE IMPLEMENTACIÓN DEL MAU — CERRADA

**Objetivo cumplido**: definir la relación de dependencias y el plan de secuenciación para implementar los cuatro elementos del MAU (Horizonte 3A), auditado contra el estado real del código. Fase exclusivamente de planificación — no se implementó ni modificó código de la aplicación.

**Documento de referencia completo**: `docs/Fase 21.md`.

**Relación con FASE 20**: FASE 20 definió el MAU y su grafo de dependencias de alto nivel. FASE 21 no reabre esa definición — la audita contra el código real, la profundiza en radio de impacto, costo, riesgo y beneficio por componente, y la traduce en un plan de secuenciación operable. El MAU permanece compuesto por 4 elementos, sin subdivisión arquitectónica. La sección 19 de este documento permanece sin alteración.

**Hallazgos de código incorporados en esta fase** (auditoría directa sobre `xv-platform-lab`, no memoria de sesión):
- El patrón de fallo silencioso de RSVP (Riesgo B1 / parte de MAU-4) está duplicado de forma independiente en seis archivos de template (`ConfirmSection.jsx`, `S2.jsx`, `S3.jsx`, `P1.jsx`, `P2.jsx`, `P3.jsx`), no centralizado — ajusta el radio de impacto real de MAU-4 sin alterar su clasificación arquitectónica.
- `data/catalogo/templates.js` marca S3/P1/P2/P3 como `"proximamente"`, con solo P1 expuesto en AdminPage vía el flag temporal `LEGACY_VISIBLE`. Confirmado que esto no es documentation drift — es consistente con §5.3 de `PRODUCTOS.md` (exige validación en producción para el estado formal `disponible`). Queda incorporado como parte del alcance de MAU-2, sin alterar la decisión de catálogo comercial completo (FASE 18).

**Relación de dependencias (Horizonte 3A) — decisión oficial de secuenciación**:
- MAU-1 es fundacional. Debe implementarse primero. Prerrequisito técnico de MAU-2 y de MAU-4.
- MAU-2 depende técnicamente de MAU-1. Sin dependencia técnica con MAU-3 — planificable en paralelo.
- MAU-3 sin dependencia técnica con MAU-1 ni MAU-2 — planificable en paralelo con MAU-2.
- MAU-4 se planifica como componente de cierre del MAU: consolida observabilidad y señalización explícita de fallos sobre la arquitectura ya implementada por los otros tres. Su ubicación responde a un criterio estratégico, no a una dependencia técnica estricta.

**Matriz comparativa final** (detalle completo de radio de impacto, riesgo, costo y beneficio por componente en `docs/Fase 21.md`, secciones 10–11):

| | MAU-1 | MAU-2 | MAU-3 | MAU-4 |
|---|---|---|---|---|
| Dependencia técnica | Ninguna | MAU-1 | Ninguna | Ninguna |
| Criterio estratégico | Fundacional | — | — | Componente de cierre |
| Riesgo | Bajo-Medio | Medio | Bajo | Medio-Alto |
| Costo | Medio | Alto | Bajo | Medio |
| Beneficio | Bajo (preventivo) | Alto | Medio | Alto |
| Relación de orden | Primero | Paralelo con MAU-3, tras MAU-1 | Paralelo con MAU-2 | Cierre del MAU |

**Decisiones de implementación explícitamente postergadas** (no forman parte del plan arquitectónico congelado; se resuelven al comenzar cada componente): orden de construcción interno del contrato de MAU-1; priorización de variante PREMIUM y tratamiento de `templates.js` en MAU-2; mecanismo técnico concreto de lectura dinámica en MAU-3; y en MAU-4, si el flujo RSVP se resuelve con una función compartida o con correcciones independientes por sitio. Detalle completo, incluyendo tres supuestos identificados como no demostrados en el código (extracción de util RSVP; orden STANDARD→PREMIUM del contrato; `LEGACY_VISIBLE` como señal de demanda), en `docs/Fase 21.md`, sección 14.

**Decisiones cerradas — NO REABRIR**:
- El MAU permanece compuesto por 4 elementos, tal como se cerró en FASE 20. Ninguna implementación fue aprobada en FASE 21 — es una decisión de planificación, no un changeset de código.
- Los Riesgos A–D de FASE 19 y su reinterpretación como MAU en FASE 20 no se reclasifican ni se invalidan.
- Riesgos E, F, G, H, I permanecen exactamente en el estado documentado en FASE 19. Fuera de alcance de esta fase.

**Fuera de alcance de FASE 21**: implementación de código; diseño de pantallas del Owner Tool (Horizonte 3B); reapertura del MAU o de decisiones cerradas en FASE 19/20; Riesgo E; Riesgos F e I; herramienta de autoservicio para clientes.

**Changeset aplicado**:
```
docs/Fase 21.md                     ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md     ← v12, sección 21 incorporada; secciones 1–19 sin alterar
```

---

## 22. [Sección histórica reemplazada — ver sección 24]

La sección 22 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 21) queda reemplazada por las secciones 23 y 24, que incorporan el cierre de FASE 22. Contenido preservado en `docs/Fase 21.md`, sin alteración.

---

## 23. FASE 22 — IMPLEMENTACIÓN Y CIERRE DE MAU-1 — CERRADA

**Objetivo cumplido**: implementar y validar MAU-1 — Contrato Ejecutable de Configuración, el primer de los cuatro elementos del MAU, bajo protocolo obligatorio completo. Primera fase de esta secuencia que modifica código de la aplicación (`src/hooks/useConfig.js` y, como prerrequisito técnico, `src/templates/{S2,S3,P1,P2}.jsx` y `P3.jsx`).

**Documento de referencia completo**: `docs/Fase 22.md`.

**Relación con FASE 21**: FASE 21 dejó explícitamente diferido el alcance exacto del primer contrato ejecutable para el inicio de este componente. FASE 22 responde esa pregunta con auditoría de código real, no con la hipótesis no demostrada que FASE 21 registró (contrato STANDARD-primero-PREMIUM-después) — la evidencia mostró que la variación de campos obligatorios ocurre por template individual, no por plan comercial. La sección 21 de este documento permanece sin alteración.

**Hallazgo no anticipado en la planificación de FASE 21**: cinco de los seis templates (S2, S3, P1, P2, P3) no consumían `useConfig.js` real — resolvían su configuración mediante un mecanismo paralelo (`useConfigCompat`) con fallback silencioso a un `MOCK_CONFIG` hardcodeado. Resuelto como **prerrequisito técnico de MAU-1**, validado en Preview Deployment, antes de implementar el contrato. Encuadre explícito: esta intervención no extiende DEUDA-001 — elimina una bifurcación accidental del flujo de carga que nunca formó parte de esa deuda documentada.

**Contrato Ejecutable — resumen de diseño** (detalle completo, esquema por template y justificación campo por campo en `docs/Fase 22.md`, secciones 5–7):
- Punto único de integración: `useConfig.js`, entre `res.json()` y `setConfig()`. Cubre los 6 templates gracias al prerrequisito técnico.
- Resolución del template efectivo: `useConfig.js` importa `templateRegistry` y aplica la misma regla de fallback que `TemplateLoader.jsx` — decisión deliberada para no introducir una segunda fuente de verdad sobre qué templates existen.
- Criterio de obligatoriedad: un campo es obligatorio para un template si su código lo consume mediante acceso directo, sin `?.` ni `\|\|` equivalente. Derivado por lectura completa de los 6 templates, no por muestreo.
- Alcance exclusivamente estructural: solo `undefined`/`null` cuentan como campo faltante. Cadenas vacías no se validan — validación de contenido queda fuera de MAU-1.
- `sheet_id` se mantiene opcional en las 6 variantes, incluida P1, pese a una inconsistencia interna detectada en `ConfirmadosSection` de P1 — documentada como observación técnica, no incorporada como regla.

**Validación funcional en Preview Deployment**: ejecutada por Andrés en dos etapas (prerrequisito técnico; luego contrato ejecutable). Confirmada satisfactoria en ambas — sin regresiones visuales ni funcionales en los clientes reales (`sofia`, `valentina`, `andres`), los 6 templates cargan correctamente vía `useConfig()` real, y el contrato detecta configuraciones inválidas antes de renderizar.

**Riesgo A (FASE 19, mapa de riesgos)**: queda resuelto por la implementación de MAU-1. El mapa de riesgos original de FASE 19 no se reclasifica ni se altera — esta es una nota de seguimiento, no una revisión del documento histórico.

**Decisiones cerradas — NO REABRIR**:
- MAU-1 queda implementado y validado como primer elemento del MAU. El MAU permanece compuesto por 4 elementos, sin alteración de FASE 20.
- El contrato es por template (S1–P3), no por plan comercial — decisión tomada con evidencia empírica de código, no reabrir sin nueva evidencia.
- `sheet_id` es opcional en las 6 variantes, incluida P1 — inconsistencia de P1 documentada como observación técnica, no como bug a corregir en esta fase.
- El acoplamiento `useConfig.js` → `templateRegistry` es una decisión arquitectónica deliberada, justificada en `docs/Fase 22.md` sección 6. No reabrir sin evidencia de que el costo real superó lo previsto.
- El alcance del contrato es exclusivamente estructural. Validación de contenido o calidad de datos queda fuera de MAU-1.
- El prerrequisito técnico no extiende DEUDA-001 — elimina una bifurcación accidental del flujo de carga. DEUDA-001 permanece en el estado ya documentado (sección 1), ahora uniforme en los 6 templates.

**Fuera de alcance de FASE 22**: MAU-2, MAU-3, MAU-4; diseño de pantallas del Owner Tool (Horizonte 3B); reapertura de decisiones cerradas en FASE 19, 20 o 21; corrección de inconsistencias de código que no constituyan bug objetivo que impida cumplir el criterio de aceptación de MAU-1.

**Changeset aplicado**:
```
docs/Fase 22.md                     ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md     ← v13, sección 23 incorporada; secciones 1–21 sin alterar
Instrucciones maestras del proyecto ← actualizadas a versión FASE 22
src/hooks/useConfig.js              ← MAU-1: Contrato Ejecutable de Configuración implementado
src/templates/S2.jsx                ← prerrequisito técnico: useConfigCompat delega a useConfig() real
src/templates/S3.jsx                ← ídem
src/templates/P1.jsx                ← ídem
src/templates/P2.jsx                ← ídem
src/templates/P3.jsx                ← ídem
```

---

## 24. [Sección histórica reemplazada — ver sección 27]

La sección 24 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 22) queda reemplazada por las secciones 25, 26 y 27, que incorporan el cierre de FASE 23 y FASE 24. Contenido preservado en `docs/Fase 22.md`, sin alteración.

---

## 25. FASE 23 — IMPLEMENTACIÓN Y CIERRE DE MAU-2 — CERRADA

**Objetivo cumplido**: implementar y validar MAU-2 — Generación Universal de Configuraciones, extendiendo `AdminPage.jsx` para generar configuraciones válidas de las seis variantes del catálogo comercial.

**Documento de referencia completo**: `docs/Fase 23.md`.

**Diseño implementado**: dispatcher por template (`TEMPLATE_BUILDERS`, 6 funciones); `REQUIRED_FIELDS`/`validate()` de `useConfig.js` exportados y reutilizados como única fuente de verdad del contrato (sin extraer a un módulo compartido — evaluado y diferido hasta que exista un consumidor real fuera de React); parser de arrays por texto con separador `|` y detección de líneas malformadas antes de generar el config; Modo Validación (permite generar configs para templates `proximamente`, sin alterar la disponibilidad comercial gobernada por el catálogo); corrección de alcance — la sección "Servicio" (Apps Script URL/Sheet ID) queda condicionada a S1/P1/P2/P3, dejando de exponerse para S2/S3.

**Validación funcional en Preview Deployment**: confirmada por Andrés. Único hallazgo reportado (P1 no registraba RSVP en Sheets) investigado y determinado ajeno al Generador — ver sección 26.

**Hallazgos documentados, no resueltos en esta fase**: `config.fotos` en `S3.jsx` contradice `PRODUCTOS.md` §3.3; `titulo`/`subtitulo` inconsistentes entre variantes del mismo producto (violación de `PRODUCTOS.md` §5.2). Ambos quedan como observaciones arquitectónicas abiertas.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 23.md` sección 5.

**Fuera de alcance de FASE 23**: MAU-3, MAU-4; Owner Tool; implementación del Contrato RSVP v2 (fase separada, ver sección 26).

---

## 26. FASE 24 — DISEÑO Y APROBACIÓN DEL CONTRATO RSVP v2 — CERRADA (SOLO DISEÑO)

**Objetivo cumplido**: diseñar y aprobar un contrato de comunicación único entre S1, P1, P2 y P3 y el Apps Script de VELA, resolviendo tres esquemas de parámetros hoy mutuamente incompatibles, sin implementar ningún cambio de código.

**Documento de referencia completo**: `docs/Fase 24.md`. **Documento de arquitectura producido**: `docs/CONTRATO_RSVP_V2.md`, aprobado con el mismo estatus documental que `PRODUCTOS.md` y `VARIANTES.md`.

**Origen**: hallazgo detectado durante la validación funcional de MAU-2 (FASE 23) — un cliente P1 no registraba confirmaciones en Sheets. Auditoría de código (templates reales + Apps Script real, aportado por Andrés) determinó causa ajena al Generador: el Apps Script usaba la presencia del parámetro `code` como único criterio de dispatch, y P1/P2/P3 nunca lo envían — sus confirmaciones se descartaban antes de intentar escribir, sin error visible por el uso de `fetch` con `mode: "no-cors"`.

**Encuadre explícito**: iniciativa arquitectónica nueva e independiente, fuera de los 4 elementos del MAU cerrados en FASE 20. No es deuda técnica ni parte de MAU-4.

**Decisiones de diseño cerradas** (detalle completo en `docs/CONTRATO_RSVP_V2.md`): vocabulario canónico de campos (`sheet_id`, `nombre`, `asistencia`, `apellido`, `restricciones`, `observaciones`); normalización de `asistencia` a `"si"`/`"no"`; dispatch exclusivo por parámetro `action`, con inmutabilidad semántica una vez publicado; principios de no ruptura de clientes desplegados, manejo de campos desconocidos, y definición formal de versión del contrato; S1 permanece en su ruta legacy, sin modificación.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 24.md` sección 6.

**Fuera de alcance de FASE 24**: cualquier implementación de código (Apps Script o templates); `action=getConfirmados` (gap independiente, documentado); migración de S1; incorporación de S2/S3 a un flujo de Sheets.

---

## 27. [Sección histórica reemplazada — ver sección 29]

La sección 27 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 24) queda reemplazada por las secciones 28 y 29, que incorporan el cierre de FASE 25. Contenido preservado en `docs/Fase 24.md`, sin alteración.

## 28. FASE 25 — IMPLEMENTACIÓN DEL CONTRATO RSVP v2 — CERRADA

**Objetivo cumplido**: implementar y validar el Contrato RSVP v2 (diseñado en FASE 24) sobre el Apps Script real y sobre `P1.jsx`, `P2.jsx`, `P3.jsx`. S1 sin modificar. Migración incremental (P1 → validación → P2 → validación → P3 → validación), bajo protocolo obligatorio completo en cada paso.

**Documento de referencia completo**: `docs/Fase 25.md`.

**Auditoría inicial de fase**: clon fresco del repositorio, confirmación de que el diff real de PR #40 coincide con lo documentado en FASE 23 (sin scope creep hacia MAU-3). **Hallazgo no documentado, fuera de alcance**: `public/clientes/caracas/config.json` existe en `main`, con apariencia de cliente real, sin registrar en `data/clientes/index.json` — confirmado por Andrés como prueba propia olvidada. No modificado en esta fase; regularización diferida a MAU-3.

**Implementación Apps Script**: una única condición nueva al inicio de `doGet` (`action === "rsvp"`), evaluada antes del gate legacy existente, que permanece sin modificar. Funciones nuevas y aisladas: `handleRsvpV2` (valida `sheet_id`, `nombre` y `asistencia` de forma estricta — rechaza sin escribir si `nombre` está vacío o `asistencia` no es exactamente `"si"`/`"no"`, decisión explícita de integridad de datos) y `saveToSheetsV2` (escribe en hoja nueva `RSVP_VELA`, columnas en mapeo 1:1 con el vocabulario de §5 del contrato). `saveToSheets`, `doPost`, `RSVP_RESUMEN`/`RSVP_DETALLE`/`STATS`, `testManual()` — sin modificación. Se agregó `CONTRATO_RSVP_V2.md` §8 "Regla de estructura de dispatch" (aclaración estructural, sin incrementar versión formal del contrato, §9.3).

**Decisiones de producto registradas**: RSVP continúa siendo individual por fila (sin familias/grupos). `restricciones` permanece string libre en el contrato — su normalización a valores cerrados es decisión de UI a nivel template, diferida. Estadísticas/visualización de confirmados pertenecen a una futura capa de aplicación sobre `RSVP_VELA`, no al Apps Script.

**Migración de templates — hallazgos**:
- **P1**: incidencia de deployment del Apps Script sirviendo versión anterior — diagnosticada con evidencia directa (URL de prueba pegada en navegador, sin `no-cors`) antes de tocar código, resuelta actualizando la implementación. `testManualV2()` no había detectado el problema porque no ejercita el deployment público. Hallazgo adicional documentado, no corregido: `ConfirmadosSection` de P1 usa `action=list`, divergiendo de `action=getConfirmados` en P2/P3 — dentro de una capacidad ya fuera de alcance de v2.
- **P2**: `asistencia` se traduce con un mapeo local (`"Sí, voy a estar"`→`"si"`, `"No voy a poder"`→`"no"`) sin alterar el estado de React. Validado sin incidencias. Diferencia funcional registrada (no defecto): P2 tiene `nombre` único, sin `apellido` ni `observaciones`, a diferencia de P1.
- **P3**: mismo patrón que P2. Dos incidencias operativas durante validación, ninguna atribuible al contrato: (1) mismo patrón de deployment desactualizado que P1, resuelto igual — registrado como riesgo operativo recurrente para toda edición futura del Apps Script; (2) `config.json` de prueba sin el campo obligatorio `titulo`, correctamente rechazado por el Contrato Ejecutable de Configuración (MAU-1) — confirma que MAU-1 sigue funcionando como fue diseñado, no es hallazgo de esta fase.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 25.md` sección 7.

**Fuera de alcance de FASE 25**: `action=getConfirmados` (incluida la divergencia de P1); aplicación administrativa sobre `RSVP_VELA`; regularización de `public/clientes/caracas/` (MAU-3); MAU-3 y MAU-4 en sí mismos.

**Changeset aplicado**:

```
Apps Script VELA-RSVP-v1               ← action=rsvp, handleRsvpV2, saveToSheetsV2, RSVP_VELA, testManualV2
src/templates/P1.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
src/templates/P2.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
src/templates/P3.jsx                   ← ConfirmSection.handleSubmit migrado a Contrato RSVP v2
docs/CONTRATO_RSVP_V2.md               ← aclaración de estructura de dispatch bajo §8, sin cambio de versión
docs/Fase 25.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v15, sección 28 incorporada; secciones 1–26 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión FASE 25
```

## 29. [Sección histórica reemplazada — ver sección 31]

La sección 29 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 25) queda reemplazada por las secciones 30 y 31, que incorporan el cierre de FASE 26. Contenido preservado en `docs/Fase 25.md`, sin alteración.

## 30. FASE 26 — IMPLEMENTACIÓN DE `action=getConfirmados` (EXTENSIÓN DEL CONTRATO RSVP v2) — CERRADA

**Objetivo cumplido**: implementar y validar `action=getConfirmados` para P1, P2 y P3, unificando tres contratos de lectura hoy mutuamente incompatibles, sin modificar `handleRsvpV2`, `saveToSheetsV2` ni la ruta legacy de S1.

**Documento de referencia completo**: `docs/Fase 26.md`.

**Encuadre explícito**: extensión del Contrato RSVP v2 vigente mediante `action` nuevo sobre el mismo mecanismo de dispatch de §8 — decisión explícita de Andrés de que esto **no** constituye una nueva versión formal del contrato. `action=rsvp` no fue tocado.

**Auditoría inicial (frontend, caja negra sobre Apps Script)**: confirmada divergencia de tres capas entre P1 (`action=list`, `sheetId` sin guarda, shape `{ confirmados: [...] }`) y P2/P3 (`action=getConfirmados`, `sheet_id` con guarda, shape array plano), más un vocabulario de `asistencia` esperado en el filtro que no correspondía al canónico. **Hallazgo adicional**: bug interno en `P2.jsx` — escribía `restricciones` pero leía `c.restriccion` en el render.

**Auditoría de Apps Script (caja blanca)**: confirmado que `RSVP_VELA` almacena `Asistencia` como `"Confirmo"`/`"No asiste"` (traducción aplicada en `handleRsvpV2` al escribir), no como `"si"`/`"no"`. Columnas confirmadas: `Timestamp | Nombre | Apellido | Asistencia | Restricciones | Observaciones`.

**Decisiones de diseño cerradas**: traducción inversa de `Asistencia` implementada únicamente dentro de una función nueva y aislada, `handleGetConfirmadosV2`, sin modificar la ruta de escritura ni los datos ya persistidos (Alternativa A); backend expone exclusivamente vocabulario canónico (`"si"`/`"no"`), los textos de interfaz son responsabilidad del frontend; `Timestamp` fuera del contrato de esta fase; hoja inexistente o sin filas → `200`, `[]` (ausencia de datos no es error); respuesta de éxito = array plano, respuesta de error = `{ ok:false, error }`.

**Implementación**: una rama nueva en `doGet` (`action === "getConfirmados"`), hermana de `action === "rsvp"`, sin reordenar el dispatch existente. `P1.jsx` migrado a `action=getConfirmados`/`sheet_id`/array plano; `P2.jsx` con filtro de `asistencia` migrado a `"si"/"no"` y bug de `c.restriccion` corregido; `P3.jsx` con filtro migrado a `"si"/"no"`. Ningún cambio de UI/producto en ningún template.

**Validación funcional**: confirmada por Andrés — Apps Script redesplegado, `action=getConfirmados` verificado desde el navegador, vocabulario canónico confirmado en la respuesta, escritura sin regresión, P1/P2/P3 validados sin regresiones visuales. No ejercitado en esta ronda: el caso `RSVP_VELA` inexistente/sin filas (los tres clientes de prueba ya tenían confirmaciones previas).

**Hallazgo de cierre, no arquitectónico**: al momento del cierre documental, un clon fresco de `main` en GitHub todavía no reflejaba el código de esta fase — consistente con el flujo de trabajo (subida manual a un branch antes del merge a `main`), pendiente de confirmación administrativa, no de código.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 26.md` sección 9.

**Fuera de alcance de FASE 26**: aplicación administrativa de lectura sobre `RSVP_VELA` (agregados, exports, dashboard); MAU-3; MAU-4; regularización de `public/clientes/caracas/`.

**Changeset aplicado**:

```
Apps Script VELA-RSVP-v1               ← nueva rama de dispatch action=getConfirmados, handleGetConfirmadosV2
src/templates/P1.jsx                   ← ConfirmadosSection migrado al contrato de lectura unificado
src/templates/P2.jsx                   ← filtro de asistencia + corrección c.restriccion → c.restricciones
src/templates/P3.jsx                   ← filtro de asistencia migrado a vocabulario canónico
docs/Fase 26.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v16, sección 30 incorporada; secciones 1–28 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión FASE 26
```

## 31. [Sección histórica reemplazada — ver sección 33]

La sección 31 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 26) queda reemplazada por las secciones 32 y 33, que incorporan el cierre de FASE 27. Contenido preservado en `docs/Fase 26.md`, sin alteración.

## 32. FASE 27 — MAU-3, PRIMERA ETAPA: VERIFICACIÓN DE CONSISTENCIA DEL REGISTRO DE CLIENTES — CERRADA

**Objetivo cumplido**: iniciar MAU-3 ("Fuente Dinámica de Registro de Clientes", definido en FASE 20) resolviendo el problema evidenciado por el hallazgo de FASE 25 (`public/clientes/caracas/` sin registro) mediante un mecanismo de verificación de consistencia, sin construir infraestructura de registro dinámico en sentido literal.

**Documento de referencia completo**: `docs/Fase 27.md`.

**Auditoría inicial**: clon fresco del repositorio contra `5c0d232` (merge de FASE 26). Confirmado que el runtime público no consume `data/clientes/index.json` en ningún punto (routing por `window.location.pathname` → `TemplateLoader` → `useConfig` → `fetch('/clientes/{slug}/config.json')`); único consumidor del registro es `ClientesPage.jsx`, solo lectura. Confirmado `public/clientes/caracas/config.json` como invitación real y funcional (`apps_script_url`/`sheet_id` reales), sin entrada en el registro. Hallazgo adicional de auditoría: `public/clientes/prueba/` tampoco tenía entrada, inicialmente sin evidencia suficiente para su clasificación.

**Aprendizaje arquitectónico central de la fase**: la evidencia recogida en la auditoría demostró que el problema real no era la ausencia de una fuente *dinámica* externa (backend, KV, Sheet externo) — el proyecto no tiene backend salvo el Apps Script de RSVP, y todo alta de cliente ya requiere commit + deploy manual. El problema real era la **verificabilidad**: nada en el sistema señalaba cuándo el registro divergía del filesystem público, como demostró el caso `caracas` pasando inadvertido desde FASE 25. En consecuencia, MAU-3 se implementó en esta primera etapa como **Fuente Verificable de Registro de Clientes** — interpretación basada en evidencia, no en la intención original de FASE 20. **La denominación histórica del elemento "MAU-3 — Fuente Dinámica de Registro de Clientes" no se reescribe retroactivamente**; queda registrado aquí, de forma explícita, que su implementación fue reinterpretada conforme a la evidencia recogida durante esta fase, por decisión de Andrés. **MAU-3 permanece abierto — esta fase cierra únicamente su primera etapa, no el elemento completo.**

**Implementación**:
- `scripts/validar-registro-clientes.js` (nuevo): script Node.js de solo lectura, sin dependencias nuevas, que compara `public/clientes/*` contra `data/clientes/index.json` y reporta huérfanos de registro, huérfanos de filesystem, y el slug reservado `admin`. Ejecutable vía `npm run validar:clientes` (`package.json`).
- `data/clientes/index.json`: regularizada la entrada de `caracas` (`plan: STANDARD`, `template: S1`, `deploy_estado: deployed`), conforme al schema de `data/clientes/CONTRATO.md` v1. Fechas `creado_en`/`deployed_en` establecidas en la fecha de esta regularización por ausencia de evidencia histórica, decisión explícita documentada en `notas`. `cliente_nombre: "caracas"` es un identificador provisional derivado del slug, no un dato comercial confirmado.
- `public/clientes/prueba/config.json`: agregado `"_fixture": true`. Evidencia documental que respalda esta clasificación: `docs/ESTADO_OFICIAL_PROYECTO.md` (versión 15, sección 28) ya registraba que `prueba` es un fixture compartido, con su `template` alternado manualmente entre P1/P2/P3 durante validaciones de fase. `scripts/validar-registro-clientes.js` extendido con `esFixture()` (fail-safe explícito: archivo ausente, JSON inválido o marca ausente/distinta de `true` nunca excluyen una carpeta) para reconocer la marca y reportarla aparte, sin afectar el exit code.

**Validación final**: `npm run validar:clientes` → `EXIT CODE 0` sobre el estado real del repositorio (`caracas` resuelto, `prueba` excluido explícitamente, sin huérfanos reales). `npm run build` → `EXIT CODE 0`, sin errores ni warnings.

**Hallazgo de cierre, no arquitectónico**: el merge a `main` se completó en dos PRs (#43, estado intermedio previo a la corrección de `prueba`; #44, corrección con los tres artefactos finales). Verificación post-merge ejecutada de forma independiente sobre clones frescos de `main` después de cada merge, confirmando en el estado final (`9d1bafd`) coincidencia byte a byte con el estado auditado y aprobado.

**Fuera de alcance de FASE 27, sin modificación**: runtime público, cualquier template (S1/S2/S3/P1/P2/P3), `useConfig.js`, `AdminPage.jsx`, `GeneradorPage.jsx`, Apps Script, Contrato RSVP v2, `CONTRATO.md` de clientes y de catálogo. **RIESGO-C (bundle JS de `/admin`) permanece conscientemente fuera de alcance y sin resolver** — decisión deliberada, no omisión.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 27.md` sección 10.

**Changeset aplicado**:

```
scripts/validar-registro-clientes.js   ← nuevo
data/clientes/index.json               ← entrada de caracas regularizada
package.json                           ← comando validar:clientes
public/clientes/prueba/config.json     ← "_fixture": true
docs/Fase 27.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v17, sección 32 incorporada; secciones 1–30 sin alterar
```

## 33. [Sección histórica reemplazada — ver sección 35]

La sección 33 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 27) queda reemplazada por las secciones 34 y 35, que incorporan el cierre de FASE 28. Contenido preservado en `docs/Fase 27.md`, sin alteración.

## 34. FASE 28 — PLATAFORMA ADMINISTRATIVA VELA: AUTENTICACIÓN DE `/admin` — CERRADA (PARCIAL)

**Objetivo cumplido**: proteger `/admin` (accesible sin ningún control desde su implementación original) mediante autenticación, sin introducir infraestructura desproporcionada para un proyecto SPA estático sin backend propio. **Objetivo no cumplido en esta fase**: visibilidad operativa de RSVP para P1/P2/P3 — línea B del alcance original, sin iniciar, diferida explícitamente a la fase siguiente.

**Documento de referencia completo**: `docs/Fase 28.md`.

**Origen**: fase de análisis estratégico previa (sin FASE 28 pre-aprobada al cierre de FASE 27), que evaluó continuación de MAU-3, MAU-4, y perfeccionamiento de la plataforma administrativa — esta última aprobada por tener evidencia directa de brecha real: `/admin` sin autenticación, y el contrato de lectura de RSVP (`action=getConfirmados`, FASE 26) sin ninguna superficie administrativa que lo consumiera.

**Alternativa descartada — Routing Middleware**: `middleware.js` + `@vercel/functions/middleware`, auditada con evidencia real de npm (sin dependencia de Next.js en ningún nivel del árbol), preparada y probada empíricamente en Preview. **NO VALIDADA** — `The Edge Function "middleware" is referencing unsupported modules: @vercel/functions/middleware`. Causa técnica (confianza media): el pipeline de bundling de Edge Middleware para proyectos "Other"/Vite no resuelve dependencias de `node_modules` como sí lo hace para Next.js. No se intentó forzar ni corregir.

**Solución implementada — Vercel Function Node.js standalone**: `api/admin-gate.js`, sin dependencias nuevas, validada incrementalmente en seis subetapas aisladas, cada una en su propia rama, con Preview antes de cualquier merge:

- **Etapa 1B.1**: Function mínima reconocida y ejecutada por Vercel en `api/`, sin tocar `vercel.json` — VALIDADA.
- **Etapa 1B.2**: lectura en runtime de `ADMIN_AUTH_USER`/`ADMIN_AUTH_PASS`, sin exponer valores — VALIDADA.
- **Etapa 2A**: self-fetch de `index.html` en tiempo de request. Bloqueo no anticipado por Vercel Authentication interceptando también el tráfico saliente de la Function, resuelto con **Protection Bypass for Automation** (`VERCEL_AUTOMATION_BYPASS_SECRET`, System Environment Variable) — VALIDADA.
- **Etapa 2B**: Basic Auth + self-fetch integrados en un único flujo (`401` sin credencial válida, `200` + HTML real con credencial válida) — VALIDADA.
- **Etapa 2C**: conexión real de `/admin` y `/admin/*` vía `vercel.json`, preservando intacta la regla catch-all existente — VALIDADA, incluyendo confirmación empírica del orden de evaluación de `rewrites` (supuesto no verificado hasta esta subetapa).
- **Etapa 2D**: merge a producción (PR #45), con auditoría pre-merge y post-merge sobre clones frescos de `main`, y verificación en producción real — VALIDADA.

**Decisiones de diseño cerradas**: mecanismo de servido de `index.html` post-autenticación es self-fetch en tiempo de request, no `includeFiles`/`fs.readFileSync` (menor superficie de supuestos de plataforma no verificados). Credenciales exclusivamente en variables de entorno server-side, sin prefijo `VITE_`, nunca en el bundle del cliente — confirmado empíricamente en cada subetapa. `config.json` por cliente permanece deliberadamente fuera de alcance de esta fase.

**Hallazgo registrado, sin acción**: al visitar `/api/admin-gate` o `/index.html` directamente en navegador, aparece `"No se pudo cargar la invitación."` — comportamiento preexistente del SPA (reproducible sin ningún código de esta fase), no relacionado con el mecanismo de autenticación.

**Riesgo mitigado**: exposición sin autenticación de `/admin` (registro completo de clientes + Generador, visible a cualquiera que conociera o adivinara la URL).

**Riesgos que permanecen abiertos, sin modificar en esta fase**: `public/clientes/{slug}/config.json` sigue público sin autenticación por cliente (Tema E de FASE 19); **RIESGO-C permanece sin resolver** — confirmado explícitamente que la autenticación de `/admin` no lo cierra, dado que el bundle JS que contiene `data/clientes/index.json` es el mismo que descarga cualquier visitante de cualquier invitación pública; MAU-3 (etapas posteriores a FASE 27); MAU-4; vista operativa de RSVP (línea B, sin iniciar).

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 28.md` sección 16.

**Fuera de alcance de FASE 28**: `src/**`, `public/clientes/**`, `data/clientes/index.json`, `package.json`, `package-lock.json`, Apps Script, Contrato RSVP v2, cualquier template, `useConfig.js`, catálogo comercial, MAU-3 posterior, MAU-4, RIESGO-C, CRUD de clientes, modelo Cliente/Evento, dashboard/analítica.

**Variables de entorno de Vercel** (fuera del repositorio): `ADMIN_AUTH_USER` y `ADMIN_AUTH_PASS` (scope Preview + Production, configuradas manualmente); `VERCEL_AUTOMATION_BYPASS_SECRET` (System Environment Variable, todos los deployments, generada automáticamente por Vercel).

**Changeset aplicado**:

```
api/admin-gate.js                      ← nuevo — Vercel Function Node.js, gate de Basic Auth + self-fetch de index.html
vercel.json                            ← rewrites de /admin y /admin/(.*) agregados antes de la catch-all existente
docs/Fase 28.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v18, sección 34 incorporada; secciones 1–32 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 28
```

## 35. [Sección histórica reemplazada — ver sección 36]

La sección 35 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 28) queda reemplazada por la sección 36, que incorpora el cierre de FASE 29. Contenido preservado en `docs/Fase 28.md`, sin alteración.

## 36. FASE 29 — VISTA OPERATIVA RSVP (P1/P2/P3) — IMPLEMENTADA Y VALIDADA EN SU ALCANCE VERIFICABLE ACTUAL

**Objetivo cumplido en su totalidad**: construir la Vista RSVP dentro de `/admin` (tercer tab de `AdminShell`), con selector de clientes elegibles, verificación de configuración disponible y consulta real a `action=getConfirmados` con tabla de confirmados de estructura fija. No queda ninguna subetapa abierta ni ningún elemento del alcance original sin construir.

**Documento de referencia completo**: `docs/Fase 29.md`.

**Origen**: línea B del alcance original de FASE 28 (diseño conceptual ya aprobado en su Etapa 1), diferida explícitamente al cierre de esa fase por no haber sido iniciada.

**Subetapas, todas VALIDADAS en su alcance verificable**:

- **29.0** (solo lectura, sin PR): auditoría del routing real de `/admin` (tabs en memoria, sin URL), del campo de variante en `index.json` (no confiable) y del shape real de `config.json` y de `getConfirmados`.
- **29.0.1** (análisis, sin PR): regla de elegibilidad oficial — `index.json` aporta universo de slugs + `deploy_estado`; `config.json` por cliente es la fuente de verdad del template efectivo; `templateRegistry[template].category === "premium"` determina P1/P2/P3. `index.json.template` explícitamente descartado de la decisión.
- **29.1**: tab `RSVP` en `AdminShell` + shell de `RsvpPage` con selector de elegibles.
- **29.2**: resolución de `apps_script_url`/`sheet_id` del cliente seleccionado, reutilizando el `config.json` ya obtenido en 29.1 (sin fetch adicional).
- **29.3**: consulta real a `action=getConfirmados` (mismo contrato de FASE 26) y tabla de confirmados de estructura fija (Nombre / Apellido / Asistencia / Restricciones / Observaciones), con traducción de `asistencia` únicamente en el punto de render.

**Regla sobre el fixture `prueba` (formulación final, sin ambigüedad)**: `prueba` no fue utilizado en ningún punto de la FASE 29. No se incorporó al universo productivo, no se agregó a `index.json`, y no se usó como sustituto de un cliente P1/P2/P3 real. No existe ninguna condición especial por slug en el código. Su ausencia del selector se explica exclusivamente porque no está registrado en `index.json` — el mismo comportamiento que tendría cualquier otro slug no registrado.

**Evidencia de Preview, consistente en 29.1/29.2/29.3**: Basic Auth OK; Generador OK; Clientes OK; tab RSVP aparece y funciona; requests a `config.json` únicamente para `sofia`, `valentina`, `andres`, `caracas` (los 4 clientes `deployed` de `index.json`); `prueba` nunca solicitado; `getConfirmados` con 0 requests en el catálogo actual; 0 errores de consola en ningún punto.

**Riesgos que permanecen abiertos, sin modificar en esta fase**: RIESGO-C (bundle único de `/admin` con `index.json` embebido) — sin cambios, `RsvpPage.jsx` reutiliza el mismo import estático que ya usaba `ClientesPage.jsx`; `config.json` público sin autenticación por cliente individual — sin cambios, reutilizado tal cual para resolver elegibilidad y configuración, sin agravarlo ni resolverlo.

**Dependencia de validación futura**: el catálogo productivo actual no contiene ningún cliente P1/P2/P3 real. La validación funcional con datos reales de `getConfirmados` (selector con al menos un cliente elegible listado, `configDisponible` sobre una selección real, tabla de confirmados con datos reales) podrá completarse cuando exista el primer cliente productivo P1/P2/P3 elegible. No constituye una limitación de la fase ni una deuda de implementación — es la ausencia de un dato externo que la fase no podía generar por sí misma.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 29.md`.

**Fuera de alcance de FASE 29**: Apps Script (no modificado, solo consumido), Contrato RSVP v2 (`docs/CONTRATO_RSVP_v2.md`, sin cambios), `templateRegistry.js` (sin cambios), `index.json`/`config.json` de cualquier cliente (sin cambios), routing URL nuevo, cache, backend nuevo, polling, refresh automático, filtros, búsqueda, exportación, estadísticas, resolución de RIESGO-C.

**Changeset aplicado**:

```
src/admin/AdminShell.jsx               ← tab RSVP agregado (+4 líneas)
src/admin/RsvpPage.jsx                 ← nuevo (455 líneas) — selector + configDisponible + tabla getConfirmados
docs/Fase 29.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v19, sección 36 incorporada; secciones 1–34 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 29
```

## 37. [Sección histórica reemplazada — ver sección 39]

La sección 37 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 29) queda reemplazada por la sección 39, que incorpora el cierre de FASE 30. Contenido preservado en `docs/Fase 29.md`, sin alteración.

## 38. FASE 30 — MÁQUINA A DE RSVPPAGE: DISTINCIÓN ELEGIBLE / NO_ELEGIBLE / NO_VERIFICABLE — CERRADA

**Objetivo cumplido en su totalidad**: corregir la ambigüedad detectada en `resolverElegibilidad()` (`RsvpPage.jsx`), donde un fallo al verificar la elegibilidad de un candidato P1/P2/P3 se colapsaba al mismo valor (`null`) que un candidato legítimamente no elegible por regla de negocio. Se introdujo la distinción `elegible` / `no_elegible` / `no_verificable`, preservando íntegramente la regla de elegibilidad congelada en FASE 29 (29.0.1).

**Documento de referencia completo**: `docs/Fase 30.md`.

**Origen**: hallazgo de auditoría de estados administrativos del panel `/admin`, solicitada por la dirección técnica como preparación para una posible fase de observabilidad. El hallazgo se trató como fase propia y acotada, sin absorberlo en una iniciativa de observabilidad general (MAU-4, que permanece sin iniciar).

**Modelo adoptado**: `ResultadoCandidato = { slug, resultado: 'elegible' | 'no_elegible' | 'no_verificable', datos }`. `resultados` (lista completa, sin filtrar) como única fuente de verdad de estado de la Máquina A; `elegibles` y `noVerificables` derivados vía `useMemo`. `Promise.all` mantenido sin cambios conceptuales — un fallo de un candidato no interrumpe la resolución del resto.

**Decisión de implementación no prevista en el diseño original, formalmente aceptada**: uso de `useMemo` para `elegibles`/`noVerificables`, necesario para preservar la estabilidad de referencia que consume el `useEffect` de la Máquina B (`[seleccionado, elegibles]`) — sin memoizar, cada render habría disparado `getConfirmados` de forma espuria. Contenida enteramente en `src/admin/RsvpPage.jsx`, sin alterar el contrato ni el comportamiento de la Máquina B.

**Evidencia de Preview**: deployment Ready; `/admin → RSVP` carga correctamente; mensaje observado idéntico al de FASE 29 para el caso sin errores ("No hay clientes P1/P2/P3 desplegados todavía..."); sin mensaje de `no_verificable` (0 no verificables reales en el catálogo actual); Network limpio; Console limpia. Único escenario disponible para validación empírica con el catálogo productivo actual: 0 elegibles + 0 no_verificables.

**Auditoría pre-merge**: aprobada. Merge-base de la branch `fase-30-rsvp-maquina-a` con `main` = HEAD de `main` al momento de ramificar (sin drift); único archivo modificado (`src/admin/RsvpPage.jsx`); build re-ejecutado exitosamente sobre el checkout real de la branch; ausencia confirmada de cambios en Máquina B, Contrato RSVP v2, `configDisponible`, `getConfirmados`, Apps Script, `index.json`; confirmado que ningún dato de cliente `no_verificable` (slug, nombre) llega a la UI — `noVerificables` se consume únicamente vía `.length`.

**Merge**: PR #47, branch `fase-30-rsvp-maquina-a` → `main`. `main` post-merge: `60b2e0e`. Deployment de `main`: Ready.

**Riesgos que permanecen abiertos, sin modificar en esta fase**: RIESGO-C (bundle único de `/admin` con `index.json` embebido) — sin cambios, esta fase no toca ningún import de `index.json`; `config.json` público sin autenticación por cliente individual — sin cambios.

**Dependencia de validación futura, heredada de FASE 29 y ahora también aplicable a los escenarios nuevos de esta fase**: los escenarios "elegibles + no_verificable" y "0 elegibles + no_verificable" no pudieron validarse empíricamente en Preview por ausencia de candidatos P1/P2/P3 productivos reales en el catálogo actual. No constituye una limitación de la fase ni una deuda de implementación.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 30.md`.

**Fuera de alcance de FASE 30**: Contrato RSVP v2, `action=getConfirmados`, `configDisponible`, Apps Script, `index.json`, `config.json` de cualquier cliente, `templateRegistry.js`, exclusión del fixture `prueba`, `ErrorBoundary`, logging, Sentry, `AdminStatusPanel`, observabilidad general del panel (MAU-4), continuación de MAU-3, resolución de RIESGO-C.

**Changeset aplicado**:

```
src/admin/RsvpPage.jsx                 ← único archivo funcional modificado (92 inserciones, 28 eliminaciones)
docs/Fase 30.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v20, secciones 38–39 incorporadas; secciones 1–36 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 30
```

## 39. [Sección histórica reemplazada — ver sección 41]

La sección 39 de la versión anterior de este documento ("Punto exacto de continuación" al cierre de FASE 30) queda reemplazada por la sección 41, que incorpora el cierre de FASE 31. Contenido preservado en `docs/Fase 30.md`, sin alteración.

## 40. FASE 31 — TRANSICIÓN DE ARQUITECTURA A PRODUCTO: VALIDACIÓN E2E DEL MVP — ANÁLISIS Y VALIDACIÓN COMPLETOS EN PREVIEW, CAMBIOS PENDIENTES DE MERGE

**Cambio de criterio de fase**: a partir de FASE 31, la prioridad del proyecto pasó de consolidar arquitectura a validar producto — pregunta central: "¿qué necesita VELA para poder entregar su primera invitación digital a un cliente real?". No se convirtió automáticamente ningún riesgo histórico (MAU-3, MAU-4, RIESGO-C, exposición de `config.json`) en trabajo de esta fase — se mantienen en backlog, sin cambios.

**Documento de referencia completo**: `docs/Fase 31.md`.

**Estado de cierre**: ANÁLISIS Y VALIDACIÓN E2E COMPLETOS EN PREVIEW. Los tres cambios preparados en esta fase (ver más abajo) **no fueron mergeados a `main` al cierre de este documento** — siguen como contenido preparado, pendiente de que Andrés los suba manualmente vía GitHub UI, siguiendo el protocolo habitual del proyecto (rama → PR → Preview → validación → merge).

### 40.1 — Hallazgo A1: catálogo comercial desalineado del estado técnico real

`data/catalogo/templates.js` marcaba S3, P1, P2 y P3 como `"proximamente"`, pese a que las FASES 15–18, 25, 26, 29 y 30 dan esos templates por completos e implementados. Efecto concreto verificado en código: en el Generador (`AdminPage.jsx`), en su modo normal (`modoValidacion = false`, valor por defecto), el operador solo podía seleccionar S1, S2 y P1 (este último por un override manual hardcodeado, `LEGACY_VISIBLE`) — S3, P2 y P3 no aparecían como opciones seleccionables sin activar un toggle pensado para pruebas técnicas, no para uso comercial.

**Corrección preparada, pendiente de merge**: los cuatro valores pasan a `"disponible"`. Cambio de una sola dimensión (visibilidad comercial), sin tocar `LEGACY_VISIBLE` ni ningún otro archivo. Build verificado localmente (`npm run build` exitoso).

### 40.2 — Cliente de prueba controlado: `prueba-e2e-p1`

Creado bajo una excepción operativa explícitamente autorizada para esta fase (distinta del fixture técnico `prueba` de FASE 27, que no fue tocado ni reutilizado): permite validar el producto end-to-end sin requerir un cliente comercial real. Slug `prueba-e2e-p1`, template P1, `_fixture: true`, datos 100% ficticios.

**Backend aislado de producción**: Google Sheet y Apps Script Web App nuevos, creados específicamente para esta validación, sin relación alguna con el recurso compartido que usan `andres`/`caracas`/`prueba` (confirmado por comparación directa: `apps_script_url` y `sheet_id` completamente distintos).

**Validación contra MAU-1**: ejecutada la lógica real de `validate()`/`REQUIRED_FIELDS.P1` (`src/hooks/useConfig.js`) contra el `config.json` propuesto — 0 campos faltantes sobre 17 requeridos.

**Validación contra el validador de FASE 27**: `scripts/validar-registro-clientes.js` ejecutado sobre el estado con `prueba-e2e-p1` agregado — sin divergencias.

**No modifica ningún cliente existente**: diff de `data/clientes/index.json` puramente aditivo, confirmado línea por línea; ninguna carpeta de `public/clientes/{sofia,valentina,andres,caracas,prueba}/` tocada.

**Registro actual en `data/clientes/index.json`, sin modificar**:
```
"deploy_estado": "draft",
"deployed_en": null
```
Estos valores reflejan fielmente el estado real del cliente conforme a `data/clientes/CONTRATO.md`: el cliente está operativo en un Preview de Vercel, pero no fue mergeado a `main`, por lo que no corresponde marcarlo `"deployed"`. Decisión explícita: no se fuerza este campo para habilitar validaciones adicionales — ver 40.5.

### 40.3 — Validación E2E realizada en Preview, con evidencia empírica real

| Etapa | Resultado | Evidencia |
|---|---|---|
| `action=rsvp` (backend aislado, prueba manual directa) | OK | `{"ok":true}`, fila confirmada en `RSVP_VELA` aislado |
| `action=getConfirmados` (backend aislado, prueba manual directa) | OK | JSON array válido, con el registro creado |
| Invitación pública de `prueba-e2e-p1` — carga y funcionamiento general | OK | Carga correctamente en Preview |
| Invitación pública — sección `Regalos` | No aplica en esta prueba | No forma parte del fixture (deliberadamente omitida) |
| RSVP público desde la invitación (primer intento) | FALLO detectado y diagnosticado | Ver 40.4 (hallazgo B1) |
| RSVP público desde la invitación (tras corregir permiso de Apps Script) | OK | Persistencia confirmada, `getConfirmados` la refleja |
| `/admin → RSVP` | PENDIENTE DE VALIDACIÓN POSTERIOR | Ver 40.5 |

### 40.4 — Hallazgo B1: RSVP con éxito garantizado, sin verificación de persistencia real

Diagnosticado con evidencia empírica de DevTools → Network durante un envío real desde el Preview. Se distinguen explícitamente dos cosas, que no deben confundirse entre sí ni tratarse como si una resolviera a la otra:

- **Causa del fallo observado en esta fase**: el deployment de Apps Script aislado, en el momento de la primera prueba E2E, tenía su permiso de acceso configurado como `"Solo tú"`. Cualquier petición sin la sesión de Google de Andrés recibía `302 → ServiceLogin → 401` — enmascarado del lado del frontend por `mode: "no-cors"` en `src/templates/P1.jsx`, `ConfirmSection.handleSubmit` (líneas 981–1006).
- **Corrección aplicada**: cambio del permiso del Web App a `"Cualquiera"`, del lado de Google. No requirió ningún cambio de código en VELA. Confirmado en vivo: tras el cambio, `action=rsvp` y `action=getConfirmados` funcionan sin `401`/`ServiceLogin`.
- **Debilidad arquitectónica pendiente, NO resuelta por este fix**: el frontend sigue usando `mode: "no-cors"` en la escritura y marca `status: "success"` tanto en el `try` como en el `catch` (líneas 1002 y 1004) — no distingue petición enviada, respuesta recibida, respuesta exitosa, ni persistencia real. Cualquier fallo futuro, de cualquier causa distinta a la de esta fase, volvería a mostrar "¡Gracias!" al invitado sin ninguna señal de alarma. **El fix de permisos resolvió la causa puntual observada en esta fase — no resuelve la debilidad de fondo.** No corregido en FASE 31, por decisión explícita.

### 40.5 — `/admin → RSVP`: pendiente de validación posterior (no es un error técnico)

`prueba-e2e-p1` no aparece como candidato en `/admin → RSVP` en el Preview actual. Causa determinada por análisis estático de `RsvpPage.jsx` (líneas 154–157): el universo candidato de la Máquina A (FASE 30) se filtra primero por `deploy_estado === 'deployed'` sobre `data/clientes/index.json`, antes de evaluar template/elegibilidad. `prueba-e2e-p1` tiene `deploy_estado: "draft"` — comportamiento correcto del código según el contrato actual, no un bug de la Máquina A.

Decisión explícita: no forzar `deploy_estado: "deployed"` para validar artificialmente esta etapa. `/admin → RSVP` queda pendiente de validación posterior, una vez que `prueba-e2e-p1` sea realmente desplegado en producción y su registro pase legítimamente a `deploy_estado: "deployed"` conforme al ciclo de vida del proyecto — no se afirma que el merge a `main` por sí solo produzca ese cambio de estado; el registro se actualiza como paso explícito y deliberado, no como efecto automático del merge.

### 40.6 — Hallazgo nuevo: `ConfirmadosSection` expuesta en la invitación pública

Confirmado por lectura directa de `src/templates/P1.jsx` (línea 1407): la lista de confirmados se renderiza sin ninguna condición para cualquier visitante de la invitación pública de un cliente P1 (mismo patrón esperable en P2/P3, sin confirmar empíricamente para esos dos). Decisión de producto fijada en esta fase: la vista de confirmados debe ser exclusiva del propietario/administrador vía `/admin`, no visible para los invitados. No corregido en FASE 31, por decisión explícita.

### 40.7 — Hallazgo A2: Open Graph hardcodeado, confirmado empíricamente

Confirmado en el Preview: al compartir la URL por WhatsApp no aparece imagen, título ni descripción diferenciada — `index.html` es estático y único para todo el sitio multi-tenant, hardcodeado con los metadatos de Sofía. No corregido en FASE 31, por decisión explícita.

**Riesgos que permanecen abiertos, sin modificar en esta fase**: RIESGO-C, exposición sin autenticación de `config.json` por cliente, MAU-3 (continuación), MAU-4 — ninguno tocado ni convertido en trabajo de FASE 31.

**Decisiones cerradas — NO REABRIR**: ver `docs/Fase 31.md`.

**Fuera de alcance de FASE 31**: corrección de código de A1 (más allá de la preparación descrita), A2, B1 (debilidad de fondo), privacidad de `ConfirmadosSection`, Apps Script (más allá del cambio de permiso ya aplicado por Andrés), MAU-3, MAU-4, RIESGO-C, exports/filtros/estadísticas de RSVP, cualquier refactor general.

**Changeset preparado, pendiente de subir manualmente (NO mergeado a `main`)**:

```
data/catalogo/templates.js             ← S3/P1/P2/P3 pasan a "disponible"
data/clientes/index.json               ← entrada nueva de prueba-e2e-p1 (deploy_estado: "draft", deployed_en: null)
public/clientes/prueba-e2e-p1/config.json  ← nuevo, cliente de prueba controlado, _fixture: true
docs/Fase 31.md                        ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md        ← v21, secciones 39–41 incorporadas; secciones 1–38 sin alterar
Instrucciones maestras del proyecto    ← actualizadas a versión post FASE 31
```

## 41. PUNTO EXACTO DE CONTINUACIÓN

**FASE 31 cerrada como análisis y validación E2E en Preview.** Ver `docs/Fase 31.md` para el historial completo. Ningún cambio de código de esta fase fue mergeado a `main` al momento de este documento — los tres archivos del changeset (catálogo, `config.json` de `prueba-e2e-p1`, entrada de `index.json`) están preparados y verificados (build local, MAU-1, validador de FASE 27), pendientes de que Andrés los suba manualmente.

**Validado empíricamente en esta fase**: backend aislado de `prueba-e2e-p1` (escritura y lectura, tras corregir el permiso del deployment de Apps Script), causa raíz puntual de B1, e invitación pública funcionando en Preview.

**Pendiente, explícito, sin pre-aprobación de implementación**:
- Merge de los tres cambios preparados, vía protocolo habitual (rama → PR → Preview → merge).
- Validación de `/admin → RSVP`, después del despliegue real de `prueba-e2e-p1` en producción y la actualización legítima de `deploy_estado` a `"deployed"` — no como efecto automático del merge, sino como paso explícito posterior.
- A2 (Open Graph hardcodeado) — sin alcance de corrección definido todavía.
- Debilidad arquitectónica de fondo de B1 (verificación real de persistencia en el frontend, más allá del fix puntual de permisos ya aplicado) — sin alcance de corrección definido todavía.
- Privacidad de `ConfirmadosSection` (ocultar de la invitación pública, exclusivo de `/admin`) — aplica a P1/P2/P3, sin confirmar empíricamente para P2/P3.
- Retiro posterior del fixture `prueba-e2e-p1`, una vez agotado su propósito de validación.
- Backlog sin cambios en esta fase: MAU-3 (continuación), MAU-4, RIESGO-C, exposición de `config.json`.

**Catálogo comercial VELA**: técnicamente completo desde antes de FASE 31; la corrección de su declaración comercial (`data/catalogo/templates.js`) está preparada pero no mergeada — ver 40.1.

**`main`**: sin cambios de FASE 31 aplicados todavía; sigue en `60b2e0e` (PR #47 de FASE 30) hasta que Andrés suba y mergee el changeset de esta fase.

**Próximo paso, no pre-aprobado por esta sección**: definir alcance de FASE 32 sobre los pendientes listados arriba — ninguno se convierte automáticamente en trabajo aprobado por estar mencionado en este documento.

---

*Pegar íntegro al iniciar el nuevo chat, sin resúmenes adicionales.*
