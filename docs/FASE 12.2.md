# FASE 12.2 — Sistemas Base

Estado: **CERRADA Y VALIDADA**
Ubicación: `/docs/FASE_12_2.md`
Documentos relacionados: `data/catalogo/VARIANTES.md`, `/docs/FASE_12_2.md` (este documento)

---

## 1. Objetivo de FASE 12.2

Traducir los principios sintetizadores y mecanismos de construcción de las tres familias visuales de VELA (Emotiva, Con Carácter, Elegante), aprobados en FASE 12.1, en sistemas base concretos: paleta, tipografía y composición.

El entregable de cada capa es, para cada familia, un conjunto de **roles obligatorios** (funciones invariantes que toda implementación de esa familia debe cumplir) y, cuando corresponde, **instanciaciones de referencia** (manifestaciones concretas asociadas a la variante técnica de esa familia, sujetas a evolución).

FASE 12.2 no construye templates, no genera código y no modifica componentes existentes.

---

## 2. Metodología utilizada

### 2.1 Separación Familia / Instanciación

Toda definición distingue dos niveles:

- **Nivel familia**: roles obligatorios. Describen una función, no un color, una tipografía o una forma específica. Son la condición de pertenencia a la familia.
- **Nivel instanciación**: la manifestación concreta de un rol en una variante técnica determinada (S1/P1, S2/P2, S3/P3). Una instanciación puede alterar dominancias, polaridad o proporciones, pero no puede eliminar un rol definido a nivel familia.

Las instanciaciones de referencia registradas en este documento no son definitivas. Quedan gobernadas por la regla de evolución de `VARIANTES.md` §6.2: las familias prevalecen sobre las implementaciones históricas, incluyendo S1.

### 2.2 Prueba de reemplazo

Método de auditoría para verificar si un elemento propuesto es un rol obligatorio o una instanciación eficiente: se evalúa si sustituir ese elemento por una alternativa genérica equivalente (en función, legibilidad o calidad) cambiaría perceptiblemente la identidad de la implementación.

- Si el reemplazo **no** cambia la identidad perceptiblemente → el elemento es instanciación, no rol obligatorio.
- Si el reemplazo **sí** cambia la identidad → el elemento es candidato a rol obligatorio.

Esta prueba se aplicó de forma sistemática en las tres capas y produjo reclasificaciones registradas en la sección 7.

### 2.3 Validación cruzada

Toda decisión de paleta, tipografía o composición debe responder tres preguntas antes de aprobarse:

1. ¿Por qué esta decisión fortalece el principio sintetizador de su familia?
2. ¿Por qué esta misma decisión no sería válida para la familia anterior en el orden de trabajo?
3. ¿Por qué esta misma decisión no sería válida para la familia siguiente?

### 2.4 Filtro de modo

Regla transversal aplicada antes de cualquier otro criterio: toda decisión debe identificarse primero según el modo operativo de su familia.

- Emotiva → modo **Atmósfera**
- Con Carácter → modo **Estructura**
- Elegante → modo **Servicio**

Si una decisión no coincide con el modo de su familia, queda descartada antes de aplicar cualquier otro criterio.

**Condición de permanencia**: esta regla se mantiene vigente mientras siga explicando de forma consistente las decisiones de paleta, tipografía, composición y movimiento de las tres familias. Se sostuvo sin excepciones durante las tres capas de FASE 12.2. Queda sujeta a revisión si en FASE 12.3 (sistema de movimiento) apareciera evidencia contraria.

### 2.5 Hipótesis de sistema cromático compartido

Verificada y sostenida en FASE 12.2: las tres familias se construyen con la paleta oficial de marca VELA (`#F8F5EF`, `#B9A68E`, `#8B7355`, `#1A1A1A`, `#E6D3A8`), diferenciándose por la función que cada color cumple, no por el contenido cromático. La extensión de la paleta oficial es una excepción que debe justificarse, no un punto de partida. No fue necesaria ninguna extensión durante FASE 12.2.

---

## 3. Capa Paleta

### 3.1 Roles obligatorios por familia

| Familia | Modo | Rol obligatorio (signature) |
|---|---|---|
| Emotiva | Atmósfera | **Luz emocional** — un tono cálido y luminoso que funciona como foco emocional dentro de la composición. |
| Con Carácter | Estructura | **Afirmación cromática** — una decisión cromática que opera en modo Estructura: borde definido, proporción inusual o posición asimétrica, no justificable por legibilidad o armonía genérica. |
| Elegante | Servicio | **Cohesión tonal** — todos los tonos presentes ocupan una banda estrecha de temperatura y valor; ninguna transición entre ellos se percibe como oposición. |

### 3.2 Roles complementarios

| Familia | Roles complementarios |
|---|---|
| Emotiva | Profundidad, Transición, Soporte |
| Con Carácter | Campo, Tipografía con carácter, Soporte |
| Elegante | Jerarquía, Acento (opcional / instanciación) |

### 3.3 Instanciaciones de referencia

Construidas íntegramente con la paleta oficial de marca VELA, sin extensión.

**Emotiva — polaridad oscura (S1/P1)**
- Negro cálido `#1A1A1A` → Profundidad (fondo dominante, en gradiente).
- Mocha `#8B7355` → Transición (puente tonal en degradado).
- Champagne `#E6D3A8` → Luz emocional (acento luminoso, foco).
- Taupe `#B9A68E` → Soporte (texto y elementos funcionales).
- Crema suave `#F8F5EF` → texto de alto contraste, uso mínimo y funcional.

**Con Carácter (S2/P2)**
- Crema suave `#F8F5EF` → Campo (superficie dominante, neutra).
- Negro cálido `#1A1A1A` → Afirmación cromática, manifestada como bloque sólido de borde duro en posición asimétrica.
- Negro cálido o Mocha `#8B7355` → Tipografía con carácter.
- Taupe `#B9A68E` → Soporte.

**Elegante (S3/P3)**
- Crema suave `#F8F5EF` + Champagne `#E6D3A8` → Cohesión tonal (superficies, dentro de la misma banda cálida-clara).
- Mocha `#8B7355` → Jerarquía (texto de nivel principal).
- Taupe `#B9A68E` → Jerarquía (texto de nivel secundario).
- Negro cálido `#1A1A1A` → Acento opcional, en proporción mínima, si se requiere un punto adicional de jerarquía.

**Prueba operativa de diferenciación entre Con Carácter y Elegante**: ¿existe un elemento que se recorte contra el campo con borde duro? Si existe, la implementación pertenece a Con Carácter. Si todos los tonos cohesionan sin recorte perceptible, pertenece a Elegante.

### 3.4 Hallazgos estructurales de la capa

- El mismo conjunto de cinco colores oficiales de VELA puede servir a los tres roles obligatorios de paleta, diferenciados únicamente por la función que cumplen, no por su contenido cromático.
- Los tres roles obligatorios resultaron ser relaciones, no colores específicos: oposición tonal con foco (Emotiva), oposición tonal perceptible (Con Carácter), ausencia de oposición o cohesión (Elegante). Las tres formulaciones son mutuamente excluyentes.
- Negro cálido `#1A1A1A` cumple tres funciones distintas según la familia: Profundidad en gradiente (Emotiva), bloque de borde duro (Con Carácter), acento puntual mínimo (Elegante). Misma sustancia cromática, tres funciones excluyentes.
- Crema suave `#F8F5EF` domina tanto en Con Carácter como en Elegante; la diferencia entre ambas instanciaciones no está en el color sino en la presencia o ausencia de un recorte de borde duro contra ese campo.

---

## 4. Capa Tipografía

### 4.1 Roles obligatorios por familia

| Familia | Rol obligatorio tipográfico | Eje de identidad |
|---|---|---|
| Emotiva | **Ninguno positivo.** Restricción heredada del modo: ningún nivel tipográfico puede operar en modo Estructura (Afirmación). | Toda la tipografía es intercambiable; no porta identidad de familia. |
| Con Carácter | **Tipografía con intención identitaria** — la elección tipográfica participa del eje identitario dominante; reemplazarla por una tipografía genérica equivalente en legibilidad cambiaría perceptiblemente la identidad. | La voz / tipo de letra no es intercambiable; el sistema de proporción sí puede variar. |
| Elegante | **Tipografía proporcional** — la identidad vive en las relaciones de escala, espaciado y ritmo; el tipo de letra es intercambiable entre opciones de calidad neutra equivalente mientras el sistema de proporción se mantenga. | El sistema de proporción y espaciado no es intercambiable; la voz / tipo de letra sí puede variar. |

### 4.2 Instanciaciones de referencia

**Emotiva (S1/P1)**
- Tipografía script o caligráfica para el nombre del agasajado — instanciación recomendada, no condición de pertenencia.
- Serif clásica (Cormorant Garamond / Playfair Display) para títulos de sección.
- Sans-serif liviana (Inter) para cuerpo de texto.

**Con Carácter (S2/P2)**
- Tracking amplio o rasgos tipográficos distintivos en el nivel de títulos — manifestación recomendada del rol obligatorio, no la única forma válida.

**Elegante (S3/P3)**
- Cormorant Garamond (tipografía ya oficial de marca) con sistema de proporción: jerarquía resuelta por tamaño y espaciado vertical, sin contraste dramático de peso, interletrado generoso en títulos.

### 4.3 Hallazgos estructurales de la capa

- La capa tipográfica no distribuye su rol obligatorio de forma uniforme entre las tres familias. Emotiva no tiene rol tipográfico obligatorio positivo; Con Carácter y Elegante sí.
- Esta asimetría se resuelve mediante un hallazgo de nivel superior: existen tres ejes de identidad tipográfica mutuamente excluyentes — **ausencia** (Emotiva, la tipografía no porta identidad), **voz** (Con Carácter, el tipo de letra elegido es la identidad), **proporción** (Elegante, el sistema de espaciado y escala es la identidad). Cada familia concentra su carga identitaria tipográfica en exactamente uno de estos tres ejes.
- La evidencia que sostiene la ausencia de rol obligatorio en Emotiva es interna al propio sistema: la referencia de inclusión Maison Margiela Replica (aprobada en FASE 12.1) cumple todos los criterios de Emoción Sofisticada con tipografía deliberadamente uniforme.

---

## 5. Capa Composición

### 5.1 Roles obligatorios por familia

| Familia | Modo | Rol obligatorio compositivo |
|---|---|---|
| Emotiva | Atmósfera | **Continuidad atmosférica** — ausencia de divisiones duras, bordes marcados o puntos de tensión localizables en cualquier punto de la experiencia, incluyendo la transición de entrada. Los elementos y secciones fluyen mediante transiciones graduales. |
| Con Carácter | Estructura | **Quiebre compositivo localizable** — existe al menos un punto en la composición donde la disposición esperada (simetría, grilla, proporción convencional) se interrumpe de forma deliberada y señalable. |
| Elegante | Servicio | **Espacio sin sobrante** — cada elemento de la composición, incluido el espacio vacío, cumple una función precisa y verificable. Ninguna área existe sin propósito. |

**Aclaración aprobada sobre "Espacio sin sobrante" (Elegante)**: este rol no implica minimizar el espacio vacío ni perseguir minimalismo como valor en sí mismo. Puede existir espacio vacío abundante, siempre que esté al servicio de la jerarquía, la respiración o la lectura del contenido. La condición de pertenencia es funcional, no cuantitativa.

### 5.2 Instanciaciones de referencia

**Emotiva (S1/P1)**: pantalla de cover con transición de entrada de peso propio, seguida de secciones con transiciones graduales (fade, scroll suave) — instanciación fuerte de Continuidad Atmosférica, no la única manifestación válida. Una implementación con scroll-reveal continuo y sin pantalla de cover separada también cumpliría el rol.

**Con Carácter (S2/P2)**: bloque de Afirmación cromática (negro cálido, definido en la capa Paleta) ubicado en posición asimétrica respecto al resto de la composición, sirviendo simultáneamente como Afirmación cromática y como Quiebre compositivo localizable.

**Elegante (S3/P3)**: jerarquía resuelta por tamaño y posición —no por color ni peso tipográfico—, con espaciado vertical calculado en función de la importancia relativa de cada bloque de información, sin elementos decorativos que ocupen espacio sin función.

### 5.3 Hallazgos estructurales de la capa

- El rol de Emotiva generaliza la condición de "umbral de entrada" de FASE 12.0: el umbral discreto (pantalla de cover) es un caso particular de un principio más amplio —ausencia de quiebres en cualquier punto de la experiencia—, no el principio en sí.
- Los tres roles obligatorios de composición sostienen la misma exclusión mutua ya observada en paleta y tipografía: lo que una familia exige (un quiebre localizable en Con Carácter, una función verificable del espacio en Elegante), las otras dos lo prohíben o lo vuelven irrelevante.

---

## 6. Hallazgos globales de FASE 12.2

1. **Los invariantes de familia son relaciones funcionales, no contenidos concretos.** En las tres capas (paleta, tipografía, composición), todo intento de fijar un rol obligatorio como un color, una tipografía o una forma específica fue reclasificado, mediante la prueba de reemplazo, hacia una función más abstracta y auditable.

2. **El mismo conjunto de recursos de marca (los cinco colores oficiales, las tipografías ya declaradas) puede servir a las tres familias.** La diferenciación entre familias no requiere universos de recursos independientes; requiere reglas de uso distintas sobre un mismo sistema compartido.

3. **Las tres familias no distribuyen su carga identitaria de forma uniforme entre los sistemas.** Emotiva concentra identidad en paleta y composición, no en tipografía. Con Carácter y Elegante sí tienen rol tipográfico obligatorio. Esta distribución desigual es coherente con los tres modos operativos (Atmósfera, Estructura, Servicio) y no constituye una inconsistencia del sistema.

4. **El sistema se autocorrige usando su propio historial de decisiones como evidencia.** Las reclasificaciones de rol a instanciación se sostuvieron, en más de un caso, en referencias o aprobaciones previas dentro de la misma FASE 12 (la referencia Maison Margiela ya aprobada en FASE 12.1 fue la evidencia que invalidó "Tipografía expresiva" como rol obligatorio de Emotiva).

5. **El filtro de modo (Atmósfera / Estructura / Servicio) se sostuvo sin excepciones en las tres capas.** No fue necesario revisarlo durante FASE 12.2.

---

## 7. Decisiones descartadas

Se listan únicamente las reclasificaciones que constituyen decisión oficial vigente. No se incluyen exploraciones intermedias sin estatus de decisión.

| Propuesta descartada | Familia / Capa | Reclasificada a | Motivo |
|---|---|---|---|
| Bloque de postura | Con Carácter / Paleta | Afirmación cromática | Postura Visible puede manifestarse sin un bloque sólido delimitado (vía tipografía, línea, proporción inusual). El invariante es la función en modo Estructura, no la forma de bloque. |
| Campo dominante | Elegante / Paleta | Cohesión tonal | Puede existir Elegante sin un tono claramente mayoritario, siempre que todos los tonos presentes estén dentro de la misma banda de temperatura y valor. La dominancia de proporción es solo una forma de lograr cohesión, no la condición misma. |
| Tipografía expresiva / caligráfica como rol obligatorio | Emotiva / Tipografía | Sin rol obligatorio positivo; instanciación recomendada | La referencia Maison Margiela Replica, ya aprobada en FASE 12.1, demuestra Emoción Sofisticada con tipografía deliberadamente uniforme. |
| Serif clásica con espaciado generoso como rol obligatorio | Elegante / Tipografía | Tipografía proporcional (instanciación: Cormorant Garamond) | El invariante es el sistema de proporción y espaciado, no la familia tipográfica específica; una sans-serif de calidad equivalente cumpliría el mismo rol. |
| Umbral de entrada con pantalla de cover como rol obligatorio | Emotiva / Composición | Continuidad atmosférica (instanciación: Cover.jsx) | El invariante es la ausencia de quiebres en toda la experiencia, no la existencia de un umbral discreto en el punto de entrada. |
| Extensión de la paleta oficial con rosas, burdeos y terracota (Camino B) | Emotiva / Paleta | Camino A: paleta oficial reconfigurada | Se priorizó construir Emotiva con los cinco colores oficiales de VELA antes que extender el sistema de marca. Esta decisión habilitó la hipótesis de sistema cromático compartido, posteriormente verificada para las tres familias. |

---

## 8. Qué queda cerrado y no debe reabrirse

- Capa Paleta completa: roles obligatorios, roles complementarios e instanciaciones de referencia de las tres familias (sección 3).
- Capa Tipografía completa: roles obligatorios, ejes de identidad e instanciaciones de referencia de las tres familias (sección 4).
- Capa Composición completa: roles obligatorios e instanciaciones de referencia de las tres familias (sección 5), incluida la aclaración funcional sobre "Espacio sin sobrante".
- La hipótesis de sistema cromático compartido (sección 2.5): verificada, no es hipótesis abierta dentro del alcance de FASE 12.2.

**Excepción explícita**: el filtro de modo (sección 2.4) puede reabrirse si, durante FASE 12.3, aparece una decisión correcta para alguna familia que no pueda describirse mediante Atmósfera, Estructura o Servicio. Fuera de esa condición, no debe reabrirse.

---

## 9. Punto exacto de continuación — FASE 12.3

**Fase a abrir**: FASE 12.3 — Sistemas de Comportamiento.

**Objetivo**: definir, para cada familia, el sistema de movimiento, los recursos visuales permitidos y prohibidos, y las reglas de validación operativas — completando los entregables previstos para Capa 3 de FASE 12.

**Metodología a aplicar**: la misma consolidada en FASE 12.2 — candidato inicial, pregunta de validación, distinción entre rol obligatorio e instanciación mediante prueba de reemplazo, validación cruzada contra las otras dos familias, definición final del rol obligatorio. Orden de trabajo: Emotiva → Con Carácter → Elegante.

**Insumo directo para el sistema de movimiento**: los roles obligatorios de composición ya definen el comportamiento esperado del movimiento en cada familia. Continuidad Atmosférica (Emotiva) exige que el movimiento, si existe, no introduzca quiebres. Quiebre Compositivo Localizable (Con Carácter) es compatible con movimiento que revele o enfatice ese quiebre. Espacio sin Sobrante (Elegante) exige que el movimiento, si existe, tenga función verificable y no decorativa.

**Pregunta abierta a mantener activa durante FASE 12.3**: si el sistema de movimiento de cada familia resulta ser una consecuencia directa de su rol obligatorio de composición, o si requiere su propio rol obligatorio independiente — siguiendo el mismo tipo de verificación que en la capa tipográfica reveló los tres ejes de identidad mutuamente excluyentes (sección 4.3).

**Reglas de validación operativas**: quedan pendientes de definición en FASE 12.3 para las tres familias, como capa final que traduce los criterios conceptuales de FASE 12.0 y los roles de FASE 12.2 en checklists verificables.

**Recursos visuales permitidos y prohibidos**: quedan pendientes de definición en FASE 12.3, derivables directamente de los roles ya cerrados en paleta, tipografía y composición.
