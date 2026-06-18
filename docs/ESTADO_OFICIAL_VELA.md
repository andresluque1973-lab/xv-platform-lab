
# VELA — ESTADO OFICIAL DE PROYECTO
## Documento de transferencia de contexto

Versión: 2 · Fecha de corte: 2026-06
Propósito: continuidad exacta en nuevo chat. Registra decisiones, no las resume. Todo lo aquí contenido tiene estado **aprobado** salvo indicación contraria.

---

## 1. DECISIONES VIGENTES HEREDADAS (FASE 1–10)

**Arquitectura**: SaaS de invitaciones digitales. React 18 + Vite 5 + Tailwind + Vercel. RSVP via Google Sheets + Apps Script. Sin base de datos. Laboratorio: `xv-platform-lab`. Producción: `xv-sofia` — **NO TOCAR BAJO NINGUNA CIRCUNSTANCIA**.

**Fases completadas 1–10**: setup, invitación funcional, RSVP, Admin MVP, hardening, templates, modularización standard1, soporte sheet_id, arquitectura SaaS inicial, templateRegistry + TemplateLoader, contratos Clientes y Catálogo, AdminShell + ClientesPage (FASE 9, validada en producción), PRODUCTOS.md (FASE 10).

**Deudas técnicas activas diferidas**: DEUDA-001 (doble useConfig), DEUDA-002 (duplicación S1/S2).

**Decisiones arquitectónicas oficiales vigentes**:
- 8.3.A: slug como identidad central, inmutable una vez desplegado.
- 8.3.C: estados deploy_estado — draft→deployed→archived. **Prohibido**: deployed→draft.
- 8.3.D: AdminPage responsabilidad única (generar config.json).
- FASE 8: templates como variantes visuales; divergencia funcional entre variantes = defecto.
- FASE 9: index.json solo desde ClientesPage por import estático.
- FASE 10: STANDARD y PREMIUM son los productos; S1–S3/P1–P3 son variantes visuales.

**Restricciones vigentes**: xv-sofia intocable; AdminPage sin modificación sin análisis; index.json solo lectura/solo panel admin/sin datos sensibles; slug "admin" reservado; no marcar template disponible sin 4 condiciones cumplidas (§5.3 PRODUCTOS.md); no nuevas dependencias sin consumidor real; no automatización prematura.

**Catálogo visual oficial**: `data/catalogo/VARIANTES.md` es fuente de verdad visual. Si una propuesta la contradice, VARIANTES.md prevalece.

**Documentación complementaria registrada**: `/docs/FASE_12_2.md` (cierre formal de FASE 12.2, ver sección 4).

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

**Estado de implementación registrado**: S1 = implementada y validada. S2, S3, P1, P2, P3 = declaradas, sin implementación.

---

## 3. FASE 12.1 — CERRADA Y VALIDADA (incluye FASE 12.0)

**FASE 12.0**: criterios de validación aprobados para las tres familias (versión revisada final con todos los ajustes de auditabilidad). Señales obligatorias de identidad + señales de riesgo hacia cada otra familia + condiciones mínimas de pertenencia. **Regla de autoridad**: criterios de 12.0 prevalecen sobre reglas operativas posteriores.

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

**Entregable oficial**: `/docs/FASE_12_2.md`, documento de cierre formal generado y aprobado. Este documento de estado registra su contenido consolidado; en caso de divergencia editorial menor, `/docs/FASE_12_2.md` es la fuente de verdad textual de la fase.

### 4.1 Reglas transversales (aplicadas y validadas en las tres capas)

1. **Regla de diferenciación obligatoria** (3 preguntas): por qué fortalece su familia + por qué no sería válida para cada una de las otras dos.
2. **Hipótesis cromática compartida (verificada)**: las tres familias usan los 5 colores oficiales VELA (`#F8F5EF`, `#B9A68E`, `#8B7355`, `#1A1A1A`, `#E6D3A8`). Se diferencian por función/rol, no por contenido cromático. Extensión = excepción justificada; no fue necesaria durante FASE 12.2.
3. **Filtro de modo**: Emotiva=Atmósfera / Con Carácter=Estructura / Elegante=Servicio. Aplica a color, tipografía y composición; pendiente de verificar en movimiento (FASE 12.3). **Se sostuvo sin excepciones en las tres capas cerradas.** Condición de permanencia vigente: reabrirse solo si aparece decisión correcta no describible mediante estos tres modos.
4. **Separación Familia (roles invariantes) / Instanciación (manifestación concreta S1–S3/P1–P3)**: instanciación puede alterar dominancias o polaridad pero no eliminar roles de familia. Instanciaciones gobernadas por la regla de evolución de `VARIANTES.md` §6.2 — ninguna es definitiva.
5. **Prueba de reemplazo**: si sustituir un elemento por una alternativa genérica equivalente NO cambia la identidad perceptiblemente → el elemento es instanciación, no rol obligatorio. Aplicada sistemáticamente en las tres capas; produjo las cinco reclasificaciones registradas en sección 6.

### 4.2 CAPA PALETA — CERRADA

| Familia | Rol obligatorio (signature) | Roles complementarios |
|---|---|---|
| Emotiva | **Luz emocional** — tono cálido luminoso como foco emocional | Profundidad, Transición, Soporte |
| Con Carácter | **Afirmación cromática** — decisión cromática en modo Estructura (borde duro / proporción inusual / posición asimétrica). Manifestaciones: bloque, tipografía, línea, proporción inusual | Campo, Tipografía con carácter, Soporte |
| Elegante | **Cohesión tonal** — todos los tonos en banda estrecha de temperatura/valor; ninguna transición percibida como oposición | Jerarquía, Acento (opcional) |

**Instanciaciones de referencia (paleta oficial, sin extensión):**
- Emotiva S1/P1 (polaridad oscura): Negro cálido=Profundidad (fondo+gradiente) / Mocha=Transición / Champagne=Luz emocional / Taupe=Soporte / Crema suave=texto alto contraste mínimo.
- Con Carácter S2/P2: Crema suave=Campo / Negro cálido=Afirmación cromática (bloque sólido) / Negro cálido o Mocha=Tipografía con carácter / Taupe=Soporte.
- Elegante S3/P3: Crema suave+Champagne=Cohesión tonal / Mocha=Jerarquía texto principal / Taupe=Jerarquía texto secundario / Negro cálido=Acento opcional mínimo.

**Prueba operativa Con Carácter vs Elegante**: ¿hay elemento que se recorta contra el campo con borde duro? Sí → Con Carácter. No (todo cohesiona) → Elegante.

**Hallazgo de capa**: los tres invariantes son relaciones: oposición tonal con foco (Emotiva) / oposición perceptible (Con Carácter) / ausencia de oposición (Elegante). Mutuamente excluyentes. Negro cálido cumple tres funciones distintas según familia (Profundidad en gradiente / bloque de borde duro / acento puntual mínimo) — misma sustancia, tres funciones excluyentes.

### 4.3 CAPA TIPOGRAFÍA — CERRADA

| Familia | Rol obligatorio tipográfico | Eje de identidad |
|---|---|---|
| Emotiva | **Ninguno positivo.** Restricción: ningún nivel tipográfico puede operar en modo Estructura. | Todo intercambiable |
| Con Carácter | **Tipografía con intención identitaria** — reemplazarla por genérica cambiaría perceptiblemente la identidad. | Voz/tipo de letra NO intercambiable; proporción sí |
| Elegante | **Tipografía proporcional** — identidad en relaciones de escala/espaciado/ritmo. | Sistema de proporción NO intercambiable; voz sí |

**Instanciaciones**: Emotiva S1/P1 — script/caligráfica para nombre (instanciación recomendada, no obligatoria) + serif clásica títulos + sans-serif cuerpo. Con Carácter S2/P2 — tracking amplio/rasgos distintivos en títulos. Elegante S3/P3 — Cormorant Garamond + jerarquía por tamaño/espaciado + interletrado generoso + sin contraste dramático de peso.

**Hallazgo estructural (CRÍTICO)**: tres ejes de identidad tipográfica mutuamente excluyentes — ausencia (Emotiva) / voz (Con Carácter) / proporción (Elegante). Cada familia concentra su carga identitaria en un eje distinto. La evidencia que sostiene la ausencia de rol en Emotiva es interna al sistema: la referencia Maison Margiela (FASE 12.1) cumple Emoción Sofisticada con tipografía deliberadamente uniforme.

### 4.4 CAPA COMPOSICIÓN — CERRADA

| Familia | Modo | Rol obligatorio compositivo |
|---|---|---|
| Emotiva | Atmósfera | **Continuidad atmosférica** — ausencia de divisiones duras, bordes marcados o puntos de tensión localizables en cualquier punto de la experiencia, incluyendo la entrada. Los elementos fluyen mediante transiciones graduales. |
| Con Carácter | Estructura | **Quiebre compositivo localizable** — existe al menos un punto en la composición donde la disposición esperada (simetría, grilla, proporción convencional) se interrumpe de forma deliberada y señalable. |
| Elegante | Servicio | **Espacio sin sobrante** — cada elemento, incluido el espacio vacío, cumple una función precisa y verificable. Ninguna área existe sin propósito. |

**Aclaración aprobada sobre "Espacio sin sobrante" (Elegante)**: no implica minimizar el espacio vacío ni perseguir minimalismo. Puede existir espacio vacío abundante, siempre que esté al servicio de la jerarquía, la respiración o la lectura del contenido. La condición es funcional, no cuantitativa.

**Instanciaciones de referencia**:
- Emotiva (S1/P1): pantalla de cover con transición de entrada de peso propio + secciones con transiciones graduales (Cover.jsx actual) — instanciación fuerte, no única; scroll-reveal continuo sin cover también cumpliría.
- Con Carácter (S2/P2): bloque de Afirmación cromática (negro cálido) en posición asimétrica, sirviendo simultáneamente como Afirmación cromática y como Quiebre compositivo localizable.
- Elegante (S3/P3): jerarquía resuelta por tamaño y posición —no por color ni peso tipográfico—, espaciado vertical calculado según importancia relativa, sin elementos decorativos sin función.

**Validación cruzada registrada**: Continuidad Atmosférica prohíbe lo que Quiebre Compositivo Localizable exige (y viceversa); Espacio sin Sobrante exige función verificable del vacío, incompatible con la vaguedad atmosférica deliberada de Emotiva y con el quiebre que se nota a sí mismo de Con Carácter.

**Hallazgo de capa**: el rol de Emotiva generaliza el "umbral de entrada" de FASE 12.0 — el umbral discreto es un caso particular de un principio más amplio (ausencia de quiebres en cualquier punto), no el principio en sí. Los tres roles compositivos sostienen la misma exclusión mutua ya observada en paleta y tipografía.

### 4.5 Hallazgos globales de FASE 12.2 (cierre de fase)

1. Los invariantes de familia son relaciones funcionales, no contenidos concretos — confirmado en las tres capas.
2. El mismo conjunto de recursos de marca (5 colores oficiales, tipografías ya declaradas) sirve a las tres familias; la diferenciación no requiere universos de recursos independientes.
3. Las tres familias no distribuyen su carga identitaria de forma uniforme entre sistemas: Emotiva concentra identidad en paleta y composición, no en tipografía; Con Carácter y Elegante sí tienen rol tipográfico obligatorio. Esta distribución desigual es coherente con los tres modos y no es una inconsistencia.
4. El sistema se autocorrige usando su propio historial como evidencia (caso Maison Margiela).
5. El filtro de modo se sostuvo sin excepciones en las tres capas; no fue necesario revisarlo durante FASE 12.2.

---

## 5. PRINCIPIOS, MECANISMOS Y ROLES — TABLA MAESTRA CONSOLIDADA

| Familia | Modo | Principio sintetizador | Mecanismo | Rol Paleta | Rol Tipografía | Rol Composición |
|---|---|---|---|---|---|---|
| Emotiva | Atmósfera | Emoción sofisticada | — (ver mecanismo en 3) | Luz emocional | Ninguno (restricción negativa) | Continuidad atmosférica |
| Con Carácter | Estructura | Postura visible | — (ver mecanismo en 3) | Afirmación cromática | Tipografía con intención identitaria | Quiebre compositivo localizable |
| Elegante | Servicio | Refinamiento inevitable | Servicio Absoluto | Cohesión tonal | Tipografía proporcional | Espacio sin sobrante |

---

## 6. DECISIONES DESCARTADAS (consolidado, incluye FASE 12.2 completa)

- **Estructuras familiares**: Romántica/Moderna/Elegante (superposición + "Moderna" por negación); Emotiva/Contemporánea/Elegante ("Contemporánea" sin territorio propio).
- **Nombres de principio**: "Identidad legible" (consecuencia compartida); "Inevitabilidad" sola; "Intención calculada"/"Precisión percibida" (cualidades generales); "Resolución perfecta" (no auditable); "Editorial" como descriptor de Emotiva.
- **Reclasificaciones rol → instanciación vía prueba de reemplazo** (las cinco de FASE 12.2, todas con estatus de decisión oficial):
  - "Bloque de postura" → "Afirmación cromática" (Con Carácter / Paleta).
  - "Campo dominante" → "Cohesión tonal" (Elegante / Paleta).
  - "Tipografía expresiva/caligráfica" → sin rol obligatorio, instanciación recomendada (Emotiva / Tipografía).
  - "Serif clásica con espaciado generoso" → instanciación de "Tipografía proporcional" (Elegante / Tipografía).
  - "Umbral de entrada con pantalla de cover" → instanciación de "Continuidad atmosférica" (Emotiva / Composición).
- **Camino B** (extender paleta Emotiva con rosas/burdeos/terracota) → descartado en favor de Camino A (5 colores oficiales reconfigurados); habilitó la hipótesis de sistema cromático compartido.

---

## 7. QUÉ NO DEBE REABRIRSE

- Sección 1 completa (FASE 1–10).
- FASE 11 completa.
- FASE 12.0 completa.
- FASE 12.1 completa.
- **FASE 12.2 completa** — Capa Paleta, Capa Tipografía y Capa Composición de las tres familias, incluida la aclaración funcional sobre "Espacio sin sobrante" y la hipótesis cromática compartida (ya verificada, no es hipótesis abierta).

**Excepción explícita**: el filtro de modo (Atmósfera/Estructura/Servicio) puede reabrirse si, durante FASE 12.3, aparece una decisión correcta para alguna familia que no pueda describirse mediante estos tres modos. Fuera de esa condición, no debe reabrirse.

---

## 8. QUÉ QUEDA PENDIENTE

1. **Apertura de FASE 12.3 — Sistemas de Comportamiento**: sistema de movimiento, recursos visuales permitidos y prohibidos, reglas de validación operativas, para las tres familias.
2. Decisión no abordada aún: si el resultado consolidado de FASE 12 actualiza `VARIANTES.md` directamente o si permanece distribuido en documentos de fase (`/docs/FASE_12_2.md`, futuro `/docs/FASE_12_3.md`) referenciados desde `VARIANTES.md`. A resolver al cierre completo de FASE 12.
3. Fuera de alcance hasta nuevo aviso: construcción de S2, S3, P1, P2, P3; cualquier código, componente o refactor.

---

## 9. PUNTO EXACTO DE CONTINUACIÓN

**Fase a abrir**: FASE 12.3 — Sistemas de Comportamiento.

**Metodología a aplicar**: la misma consolidada en FASE 12.2 — candidato inicial, pregunta de validación, distinción rol obligatorio/instanciación vía prueba de reemplazo, validación cruzada, definición final. Orden: Emotiva → Con Carácter → Elegante.

**Punto de partida concreto para movimiento**: los roles de composición ya cierran el comportamiento esperado:
- Continuidad Atmosférica (Emotiva) exige que el movimiento, si existe, no introduzca quiebres.
- Quiebre Compositivo Localizable (Con Carácter) es compatible con movimiento que revele o enfatice ese quiebre.
- Espacio sin Sobrante (Elegante) exige que el movimiento, si existe, tenga función verificable y no decorativa.

**Pregunta activa a mantener durante FASE 12.3**: si el sistema de movimiento de cada familia es consecuencia directa de su rol obligatorio de composición, o si requiere rol obligatorio independiente — replicando el tipo de verificación que en tipografía reveló los tres ejes de identidad mutuamente excluyentes (sección 4.3).

**Pendiente adicional de FASE 12.3**: recursos visuales permitidos/prohibidos y reglas de validación operativas por familia, derivables de los roles ya cerrados en las tres capas de FASE 12.2.

---

*Pegar íntegro al iniciar el nuevo chat, sin resúmenes adicionales.*
