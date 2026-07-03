[ESTADO_OFICIAL_PROYECTO.md](https://github.com/user-attachments/files/29619394/ESTADO_OFICIAL_PROYECTO.md)
# VELA — ESTADO OFICIAL DE PROYECTO
## Documento de transferencia de contexto

Versión: 9 · Fecha de corte: 2026-07
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

**Documentación complementaria registrada**: `/docs/FASE_12_2.md`, `/docs/FASE_12_3.md`, `/docs/AUDITORIA_S2.md`, `/docs/AUDITORIA_S2_CIERRE.md`, `/docs/Fase 13.md`, `/docs/Fase 14.md`, `/docs/Fase 15.md`, `/docs/Fase 16.md`, `/docs/Fase 17.md`, `/docs/Fase 18.md`.

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

La fase de construcción de templates ha concluido. El proyecto pasa a modo mantenimiento hasta que se active la fase operativa.

**Condición de activación**: cliente real comprometido.

**Líneas operativas habilitadas cuando la condición se cumpla:**
- Onboarding de primer cliente real.
- AdminPage: extensión para soportar generación de configs PREMIUM (campos §4.5).
- Herramienta administrativa para organizadores — visualización de confirmados, estadísticas y métricas de asistencia (OBS-P1-001).

**Hipótesis de mayor generador de aprendizaje (registrada FASE 17, vigente):** onboarding real + AdminPage PREMIUM = mayor generador de aprendizaje operativo cuando exista cliente comprometido. No activa el roadmap en su ausencia.

**Infraestructura diferida** (sin condición de activación específica):
- Dynamic OG/SEO meta tags.
- Ruta 404 para slugs desconocidos.
- Revisión schema RSVP PREMIUM (OBS-P1-002) — requiere evidencia operativa previa.

---

## 18. PUNTO EXACTO DE CONTINUACIÓN

**FASE 18 cerrada.** Ver `docs/Fase 18.md` para historial completo.

**Catálogo comercial VELA completo.** El proyecto permanece en modo mantenimiento hasta la aparición de un cliente real comprometido que active la fase operativa.

---

*Pegar íntegro al iniciar el nuevo chat, sin resúmenes adicionales.*
