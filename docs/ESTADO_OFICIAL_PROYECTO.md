[ESTADO_OFICIAL_PROYECTO_v6.md](https://github.com/user-attachments/files/29403223/ESTADO_OFICIAL_PROYECTO_v6.md)
# VELA — ESTADO OFICIAL DE PROYECTO
## Documento de transferencia de contexto

Versión: 6 · Fecha de corte: 2026-06
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

**Documentación complementaria registrada**: `/docs/FASE_12_2.md`, `/docs/FASE_12_3.md`, `/docs/AUDITORIA_S2.md`, `/docs/AUDITORIA_S2_CIERRE.md`, `/docs/Fase 13.md`, `/docs/Fase 14.md`, `/docs/Fase 15.md`, `/docs/Fase 16.md`.

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

---

## 11. QUÉ NO DEBE REABRIRSE

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

**Excepción explícita única vigente**: el filtro de modo (Atmósfera/Estructura/Servicio) puede reabrirse si durante la construcción de implementaciones futuras aparece una decisión correcta para alguna familia que no pueda describirse mediante estos tres modos.

---

## 12. OBSERVACIONES ABIERTAS (sin prioridad — requieren exposición real)

**OBS-001** (S2.2) — Si S2.2 se lee como identidad propia vs. variante oscura de S1.
**OBS-002** (S2.2) — Tratamientos alternativos para el bloque negro.
**OBS-003** (S2.2) — Bebas Neue como validación de instanciación, no decisión permanente de familia.
**OBS-S3-001** (S3.1) — EventSection usa Champagne como fondo de sección. Introduce color como separador secundario además del espacio. Dentro de Cohesión tonal. Evaluar con exposición real.
**OBS-P1-001** (P1.1) — `ConfirmadosSection` en P1 tiene como consumidor actual a los invitados de la invitación. La intención comercial es que confirmados, estadísticas y métricas de asistencia migren en fases futuras a una herramienta administrativa para el organizador, reutilizando la misma infraestructura Sheets + Apps Script. Sin impacto en P1 ni en §4.5.
**OBS-P1-002** (P1.1) — Schema simplificado de §4.5 puede no reflejar completamente las necesidades operativas reales. Candidatos para revisión futura: múltiples asistentes por confirmación, restricciones con opciones controladas, reducción de campos libres. Requiere evidencia operativa antes de reabrir §4.5.
**OBS-P1-003** (P1.1) — Historia ampliada genera scroll largo en mobile. No es defecto de implementación sino consecuencia natural del volumen narrativo PREMIUM. Evaluar con contenido real de cliente.

---

## 13. ESTADO DE IMPLEMENTACIÓN DEL CATÁLOGO

| Variante | Familia | Tier | Estado |
|---|---|---|---|
| S1 | Emotiva | STANDARD | ✅ Validada en producción |
| S2 | Con Carácter | STANDARD | ✅ Validada en producción |
| S3 | Elegante | STANDARD | ✅ Validada en Preview Deployment |
| P1 | Emotiva | PREMIUM | ✅ Validada en Preview Deployment |
| P2 | Con Carácter | PREMIUM | ⬜ Declarada |
| P3 | Elegante | PREMIUM | ⬜ Declarada |

---

## 14. DEUDAS TÉCNICAS ACTIVAS

| ID | Descripción | Estado |
|---|---|---|
| DEUDA-001 | Doble `useConfig` fetch entre TemplateLoader y templates. Harmless por browser cache. | Diferida sin fecha |

---

## 15. ROADMAP — LÍNEAS HABILITADAS PARA FASE 17

Las siguientes líneas están disponibles. Ninguna tiene prioridad aprobada aún:

**Catálogo PREMIUM**
- P2 (Con Carácter / PREMIUM) — siguiente variante natural. P1 es su referencia arquitectónica.
- P3 (Elegante / PREMIUM) — tercera variante del catálogo PREMIUM.

**Operativa**
- Onboarding de primer cliente real — identificado como prioridad candidata desde FASE 10.
- Herramienta administrativa para organizadores — visualización de confirmados, estadísticas y métricas de asistencia (OBS-P1-001). Reutiliza infraestructura Sheets + Apps Script existente.
- AdminPage: extensión para soportar generación de configs PREMIUM (campos §4.5).

**Infraestructura diferida**
- Dynamic OG/SEO meta tags.
- Ruta 404 para slugs desconocidos.
- Revisión schema RSVP PREMIUM (OBS-P1-002) — requiere evidencia operativa previa.

---

## 16. PUNTO EXACTO DE CONTINUACIÓN

**FASE 16 cerrada.** Ver `docs/Fase 16.md` para historial completo.

**Próxima fase**: FASE 17 — a definir. Candidatos: P2, onboarding primer cliente real, herramienta administrativa para organizadores.

---

*Pegar íntegro al iniciar el nuevo chat, sin resúmenes adicionales.*
