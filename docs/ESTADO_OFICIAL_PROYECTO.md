[ESTADO_OFICIAL_PROYECTO.md](https://github.com/user-attachments/files/29315805/ESTADO_OFICIAL_PROYECTO.md)
# VELA — ESTADO OFICIAL DE PROYECTO
## Documento de transferencia de contexto

Versión: 4 · Fecha de corte: 2026-06
Propósito: continuidad exacta en nuevo chat. Registra decisiones, no las resume. Todo lo aquí contenido tiene estado **aprobado** salvo indicación contraria.

---

## 1. DECISIONES VIGENTES HEREDADAS (FASE 1–10)

**Arquitectura**: SaaS de invitaciones digitales. React 18 + Vite 5 + Tailwind + Vercel. RSVP via Google Sheets + Apps Script. Sin base de datos. Laboratorio: `xv-platform-lab`. Producción: `xv-sofia` — **NO TOCAR BAJO NINGUNA CIRCUNSTANCIA**.

**Fases completadas 1–10**: setup, invitación funcional, RSVP, Admin MVP, hardening, templates, modularización standard1, soporte sheet_id, arquitectura SaaS inicial, templateRegistry + TemplateLoader, contratos Clientes y Catálogo, AdminShell + ClientesPage (FASE 9, validada en producción), PRODUCTOS.md (FASE 10).

**Deudas técnicas activas diferidas**: DEUDA-001 (doble useConfig),  (duplicación S1/S2 — condición de activación cumplida desde FASE 13, resolución pendiente como trabajo arquitectónico independiente).

**Decisiones arquitectónicas oficiales vigentes**:
- 8.3.A: slug como identidad central, inmutable una vez desplegado.
- 8.3.C: estados deploy_estado — draft→deployed→archived. **Prohibido**: deployed→draft.
- 8.3.D: AdminPage responsabilidad única (generar config.json).
- FASE 8: templates como variantes visuales; divergencia funcional entre variantes = defecto.
- FASE 9: index.json solo desde ClientesPage por import estático.
- FASE 10: STANDARD y PREMIUM son los productos; S1–S3/P1–P3 son variantes visuales.

**Restricciones vigentes**: xv-sofia intocable; AdminPage sin modificación sin análisis; index.json solo lectura/solo panel admin/sin datos sensibles; slug "admin" reservado; no marcar template disponible sin 4 condiciones cumplidas (§5.3 PRODUCTOS.md); no nuevas dependencias sin consumidor real; no automatización prematura.

**Catálogo visual oficial**: `data/catalogo/VARIANTES.md` es fuente de verdad visual. Si una propuesta la contradice, VARIANTES.md prevalece.

**Documentación complementaria registrada**: `/docs/FASE_12_2.md`, `/docs/FASE_12_3.md`, `/docs/AUDITORIA_S2.md`, `/docs/AUDITORIA_S2_CIERRE.md`, `/docs/FASE_13.md`.

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

**Estado de implementación registrado**: S1 = implementada y validada. S2 = implementada y validada (FASE 13). S3, P1, P2, P3 = declaradas, sin implementación.

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
- Los recursos temporales son compartibles entre familias; la identidad la determina la función, no la presencia del recurso. Extiende a la dimensión temporal el patrón ya registrado con Negro cálido en Paleta.
- Tres funciones temporales mutuamente excluyentes: facilitar registro emocional (Emotiva) / convertir la decisión en acontecimiento (Con Carácter) / subordinarse al contenido (Elegante).
- Quiebre Compositivo Localizable y Postura en Acto comparten estructura de localizabilidad, aplicada al espacio y al tiempo respectivamente.
- Asimetría de presencia: Emotiva presupone movimiento (sin condicional); Con Carácter y Elegante no lo exigen (con condicional).

### 5.3 Regla transversal emergente de FASE 12.3

Ninguna validación de movimiento puede formularse en términos de duración, velocidad o tipo de curva. Estas son siempre instanciaciones. La validación verifica función, no atributos del recurso temporal.

### 5.4 Capas diferidas — decisión de cierre

Recursos visuales permitidos/prohibidos y reglas operativas de validación fueron diferidas por rendimiento decreciente, mediante criterio formal aprobado. FASE 12 queda cerrada como fase de descubrimiento y abierta únicamente a validación empírica a través de implementaciones futuras. Los casos límite que aparezcan durante la construcción de S2 se registrarán como deuda de sistema en `/docs/AUDITORIA_S2.md`.

---

## 6. PRINCIPIOS, MECANISMOS Y ROLES — TABLA MAESTRA CONSOLIDADA

| Familia | Modo | Principio sintetizador | Rol Paleta | Rol Tipografía | Rol Composición | Rol Movimiento |
|---|---|---|---|---|---|---|
| Emotiva | Atmósfera | Emoción sofisticada | Luz emocional | Ninguno (restricción negativa) | Continuidad atmosférica | Asentamiento emocional |
| Con Carácter | Estructura | Postura visible | Afirmación cromática | Tipografía con intención identitaria | Quiebre compositivo localizable | Postura en acto |
| Elegante | Servicio | Refinamiento inevitable | Cohesión tonal | Tipografía proporcional | Espacio sin sobrante | Movimiento al servicio |

---

## 7. DECISIONES DESCARTADAS (consolidado hasta FASE 13)

Ver secciones de decisiones descartadas en `/docs/FASE_12_2.md` (sección 7), `/docs/FASE_12_3.md` (sección 7) y `/docs/FASE_13.md` (sección 3).

---

## 8. QUÉ NO DEBE REABRIRSE

- Sección 1 completa (FASE 1–10).
- FASE 11 completa.
- FASE 12.0 completa.
- FASE 12.1 completa.
- FASE 12.2 completa — Capa Paleta, Capa Tipografía y Capa Composición.
- FASE 12.3 completa — Capa Movimiento de las tres familias, hallazgos estructurales, regla transversal, decisión de diferir capas restantes.
- FASE 13 completa — S2.2 como referencia operativa de Con Carácter, cuatro capas auditadas, evidencia registrada en VARIANTES.md §4.13.
- FASE 14 completa — resolución de DEUDA-002, extracción de useCountdown a shared/hooks.js.
- FASE 15 completa — S3.1 como referencia operativa de Elegante, cuatro capas auditadas, catálogo STANDARD validado.

**Excepción explícita única vigente**: el filtro de modo (Atmósfera/Estructura/Servicio) puede reabrirse si durante la construcción de implementaciones futuras aparece una decisión correcta para alguna familia que no pueda describirse mediante estos tres modos.

---

## 9. HALLAZGO ESTRUCTURAL — CATÁLOGO STANDARD COMPLETO

Registrado al cierre de FASE 15. Los tres organizadores visuales del catálogo STANDARD:

| Template | Familia | Organizador visual |
|---|---|---|
| S1 | Emotiva | Atmósfera |
| S2 | Con Carácter | Contraste |
| S3 | Elegante | Espacio |

Las tres familias conviven dentro del mismo contrato técnico y sistema operativo
sin requerir evolución arquitectónica. Esto constituye la validación completa
del catálogo STANDARD.

---

## 10. OBSERVACIONES ABIERTAS (consolidado)

**OBS-001** (S2.2) — Si S2.2 se lee como identidad propia vs. variante oscura de S1.
Resoluble solo con exposición real de usuarios. Sin prioridad.

**OBS-002** (S2.2) — Tratamientos alternativos para el bloque negro.
Diferida hasta evidencia de uso real. Sin prioridad.

**OBS-003** (S2.2) — Bebas Neue como validación de instanciación, no decisión permanente de familia.
Sin prioridad.

**OBS-S3-001** (S3.1) — EventSection usa Champagne como fondo de sección.
Introduce color como separador secundario además del espacio.
Dentro de Cohesión tonal. Evaluar con exposición real. Sin prioridad.

---

## 11. ESTADO DE IMPLEMENTACIÓN DEL CATÁLOGO

| Variante | Familia | Estado |
|---|---|---|
| S1 | Emotiva | ✅ Implementada y validada en producción |
| S2 | Con Carácter | ✅ Implementada y validada en producción |
| S3 | Elegante | ✅ Implementada y validada en Preview Deployment |
| P1 | Emotiva | ⬜ Declarada, sin implementación |
| P2 | Con Carácter | ⬜ Declarada, sin implementación |
| P3 | Elegante | ⬜ Declarada, sin implementación |

---

## 12. DEUDAS TÉCNICAS VIGENTES

**DEUDA-001** — Double `useConfig` fetch entre TemplateLoader y templates.
Harmless por browser cache. Diferida sin fecha.

~~DEUDA-002~~ — Resuelta en FASE 14.

---

## 13. PUNTO EXACTO DE CONTINUACIÓN

**FASE 15 cerrada.** Ver `docs/Fase 15.md` para historial completo.

**Próxima fase**: exploración del catálogo PREMIUM (P1, P2, P3).
Requiere decisión de inicio de fase y definición de alcance.

**Preguntas abiertas para apertura de FASE 16**:
- ¿PREMIUM se diferencia de STANDARD por capacidades funcionales, por tratamiento visual, o por ambos?
- ¿P1/P2/P3 comparten el organizador visual de su familia o pueden divergir?
- ¿El primer candidato a implementar es P1 (Emotiva, familia con más base empírica) o se abre discusión?

*Pegar íntegro al iniciar el nuevo chat, sin resúmenes adicionales.*
