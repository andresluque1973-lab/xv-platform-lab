[FASE_12_3.md](https://github.com/user-attachments/files/29179066/FASE_12_3.md)
# FASE 12.3 — Sistemas de Comportamiento

Estado: **CERRADA Y VALIDADA** (capa Movimiento)
Ubicación: `/docs/FASE_12_3.md`
Documentos relacionados: `docs/FASE_12_2.md`, `data/catalogo/VARIANTES.md`, `docs/AUDITORIA_S2.md`

---

## 1. Objetivo de FASE 12.3

Definir, para cada familia visual de VELA, los sistemas de comportamiento: movimiento, recursos visuales permitidos y prohibidos, y reglas operativas de validación.

**Alcance efectivamente ejecutado**: capa de Movimiento completa para las tres familias. Las capas de recursos permitidos/prohibidos y reglas operativas de validación fueron evaluadas y diferidas por rendimiento decreciente (ver sección 8).

FASE 12.3 no construye templates, no genera código y no modifica componentes existentes.

---

## 2. Metodología aplicada

Idéntica a FASE 12.2: candidato inicial → pregunta de validación → distinción rol obligatorio/instanciación mediante prueba de reemplazo → prueba de sustitución inversa → validación cruzada → cierre formal. Orden de trabajo: Emotiva → Con Carácter → Elegante.

Se mantuvo activa durante toda la capa la pregunta heredada del punto de continuación de FASE 12.2: si el sistema de movimiento de cada familia resulta ser consecuencia directa de su rol obligatorio de composición, o si requiere rol obligatorio independiente. La capa la responde con evidencia para las tres familias: el eje temporal es independiente del eje espacial en los tres casos.

La capa de movimiento no exige que el movimiento exista en toda implementación. El rol obligatorio rige *cuando* existe movimiento; su ausencia total puede ser una instanciación válida en familias donde la composición no lo presupone.

---

## 3. Roles obligatorios de movimiento

| Familia | Modo | Rol obligatorio de Movimiento |
|---|---|---|
| Emotiva | Atmósfera | **Asentamiento emocional** — cada transición conserva un margen de permanencia perceptible que permite que el contenido precedente se registre emocionalmente antes de que comience el siguiente movimiento. |
| Con Carácter | Estructura | **Postura en acto** — cuando existe movimiento en el punto del quiebre, la decisión se percibe como un acontecimiento localizable en el tiempo, no como un atributo que ya estaba dispuesto desde el principio. La intensidad, velocidad o fuerza del movimiento son instanciación; lo obligatorio es que la decisión se manifieste como suceso, no como dato estático ya asentado. |
| Elegante | Servicio | **Movimiento al servicio** — cuando existe movimiento, su única función es hacer más legible o más precisa la jerarquía del contenido. No existe para ser percibido como movimiento; existe para que el contenido se perciba mejor. |

---

## 4. Pruebas que justificaron cada cierre

### 4.1 Emotiva — Asentamiento emocional

**Candidato descartado previo**: "Continuidad cinética" (consecuencia directa de Continuidad Atmosférica). Descartado porque la prueba de reemplazo demostró que gradualidad espacial y cadencia temporal son variables independientes.

**Prueba de reemplazo**: reemplazar el margen de permanencia por transiciones técnicamente graduales pero encadenadas sin pausa (fades de ~150ms sin margen entre ellos) produce una lectura de eficiencia funcional, incompatible con Emoción Sofisticada, aun cumpliendo íntegramente Continuidad Atmosférica. La identidad cambia perceptiblemente. El rol resiste el reemplazo.

**Reformulación metodológica**: la formulación pasó de "cadencia sin urgencia" (atributo negativo, velocidad) a "asentamiento emocional" (función positiva, presencia de margen de permanencia para el registro). Define lo que el movimiento *provee*, no lo que *evita*.

**Prueba de sustitución inversa**: introducir Asentamiento Emocional en una composición inequívocamente Con Carácter (Afirmación Cromática + Quiebre Compositivo Localizable + Tipografía con intención identitaria) no convierte la composición en Emotiva. El margen de permanencia queda reabsorbido como pausa de anticipación que precede la revelación de la postura, no como registro emocional. Necesidad sin suficiencia demostrada.

### 4.2 Con Carácter — Postura en acto

**Prueba de reemplazo**: reemplazar la llegada del quiebre por una entrada atmosférica idéntica a la instanciación de Emotiva (fade lento, margen de permanencia generoso, sin acento temporal que distinga ese movimiento del resto) produce que el bloque se presente con cautela en vez de con franqueza. La decisión visual empieza a sentirse disculpada, no sostenida. Contradice directamente Postura Visible. El rol resiste el reemplazo.

**Reformulación metodológica**: el núcleo funcional se reformuló de "afirmar" (connotación de intensidad/contundencia, atributo superficial) a "convertir la decisión en acontecimiento perceptible" (condición temporal de localizabilidad, independiente de velocidad o fuerza). La formulación final "Postura en acto" ancla el mecanismo al principio sintetizador de la familia.

**Prueba de sustitución inversa**: introducir Postura en Acto en una composición inequívocamente Emotiva (gradiente negro cálido→mocha, foco luminoso en champagne, Continuidad Atmosférica intacta, sin bordes duros ni asimetría) no convierte la composición en Con Carácter. El instante marcado se lee como punto culminante de la atmósfera, no como postura que desafía la disposición esperada. Falta Afirmación Cromática, falta Quiebre Compositivo Localizable. Necesidad sin suficiencia demostrada.

### 4.3 Elegante — Movimiento al servicio

**Prueba de reemplazo**: reemplazar una aparición funcional mínima (fade breve que hace disponible el contenido sin llamar la atención sobre sí mismo) por una transición elaborada (desplazamiento con easing pronunciado y expansión de escala, apreciable como gesto en sí mismo) produce que la transición compita por percepción con el contenido. Viola Refinamiento Inevitable sin violar ninguna condición espacial. El rol resiste el reemplazo.

**Prueba de sustitución inversa — dos escenarios**: construidos para discriminar entre la hipótesis alternativa (Movimiento al Servicio como mera extensión temporal de Espacio sin Sobrante) y la hipótesis de rol independiente.

- **Escenario 1** (Asentamiento Emocional en composición Elegante): el margen de permanencia extendido produce tiempo sin función verificable, violando Espacio sin Sobrante directamente. En este caso el invariante espacial ya cubría la condición temporal.
- **Escenario 2** (Postura en Acto en composición Elegante): la aparición-acontecimiento tiene función verificable (señala jerarquía) y aun así viola la identidad de Elegante porque el movimiento se percibe como evento antes que como medio. Espacio sin Sobrante no detecta este fallo. La condición violada es la subordinación perceptiva del movimiento al contenido — condición que no se deduce de "ningún área existe sin propósito".

La asimetría entre los dos fallos descarta la hipótesis alternativa. Movimiento al Servicio contiene una condición temporal independiente: la invisibilidad de la función misma, no solo la presencia de función. Necesidad sin suficiencia demostrada.

---

## 5. Hallazgos estructurales de la capa

**Hallazgo 1 — Independencia del eje temporal**
Gradualidad espacial (ausencia de bordes duros, cubierta por los roles de composición de FASE 12.2) y cadencia temporal (función del movimiento en el tiempo) son variables independientes. Una composición puede cumplir plenamente sus roles de composición y aun así carecer del rol de movimiento correspondiente a su familia. Los roles de composición cerrados en FASE 12.2 no implican ni garantizan los roles de movimiento definidos en esta capa.

**Hallazgo 2 — Recursos temporales compartidos; identidad por función**
Los recursos temporales (pausas, márgenes de permanencia, curvas de easing, acontecimiento localizable) son compartibles entre familias. El mismo recurso temporal queda reabsorbido e interpretado según el principio sintetizador de la familia anfitriona. La identidad no la determina la presencia del recurso sino la función que cumple. Este hallazgo extiende a la dimensión temporal el patrón ya registrado en Paleta para Negro cálido (`#1A1A1A`): misma sustancia, tres funciones excluyentes según familia.

**Hallazgo 3 — Tres funciones temporales mutuamente excluyentes**
Las tres familias producen funciones temporales del movimiento que son mutuamente excluyentes:

- Emotiva: el movimiento facilita el registro emocional del contenido. Existe para que algo se *sienta*.
- Con Carácter: el movimiento convierte la decisión en acontecimiento localizable. Existe para que algo se *perciba como acto*.
- Elegante: el movimiento se subordina al contenido y a la jerarquía. Existe para que algo se *lea mejor*, sin que el movimiento mismo sea percibido.

Lo que una familia exige, las otras dos lo prohíben o lo convierten en instanciación neutral. Este patrón replica, en la capa de movimiento, la exclusión mutua ya observada en Paleta, Tipografía y Composición.

**Hallazgo 4 — Localizabilidad como principio coherente de Con Carácter**
Quiebre Compositivo Localizable (composición) y Postura en Acto (movimiento) comparten la misma estructura lógica: localizabilidad, aplicada una vez al espacio y otra al tiempo. El principio sintetizador de Con Carácter (Postura Visible) opera de forma consistente en ambas capas sin requerir un criterio adicional para la transición entre ellas.

**Hallazgo 5 — Asimetría de presencia del movimiento entre familias**
La capa de movimiento no distribuye su rol obligatorio de forma uniforme en cuanto a la presencia del movimiento:

- Emotiva: Continuidad Atmosférica ya presupone movimiento ("los elementos fluyen mediante transiciones graduales"); el rol de movimiento opera sin condicional.
- Con Carácter y Elegante: el movimiento puede estar completamente ausente sin violar los roles de composición; el rol de movimiento opera de forma condicional (*cuando* existe movimiento).

Esta asimetría es coherente con la distribución desigual de carga identitaria ya observada en Tipografía (FASE 12.2, hallazgo 3).

---

## 6. Regla transversal emergente

**Separación función/recurso en la dimensión temporal**
Ninguna regla operativa de validación de movimiento puede formularse en términos de duración, velocidad o tipo de curva específicos. Estas son siempre instanciaciones. La validación del rol de movimiento de cualquier familia debe verificar la función que el movimiento cumple, no los atributos del recurso temporal utilizado. Esta regla es análoga a la ya vigente para paleta (los cinco colores oficiales se diferencian por función, no por contenido cromático).

---

## 7. Decisiones descartadas

| Propuesta descartada | Familia | Motivo |
|---|---|---|
| "Continuidad cinética" (consecuencia directa de Continuidad Atmosférica) | Emotiva | La prueba de reemplazo demostró que gradualidad espacial y cadencia temporal son variables independientes. |
| "Cadencia sin urgencia" como formulación del rol | Emotiva | Define lo que el movimiento evita, no lo que provee. Reformulado como función positiva. |
| "Afirmación cinética" / "afirmar" como núcleo funcional | Con Carácter | Arrastra connotación de intensidad/contundencia (atributo superficial). |
| Movimiento al Servicio como extensión temporal de Espacio sin Sobrante | Elegante | Descartada por el Escenario 2 de la prueba de sustitución inversa: la subordinación perceptiva del movimiento al contenido es una condición temporal que Espacio sin Sobrante no contiene ni implica. |

---

## 8. Capas diferidas — decisión de cierre

Las capas de **recursos visuales permitidos/prohibidos** y **reglas operativas de validación** fueron evaluadas y diferidas por rendimiento decreciente, mediante criterio formal aprobado:

*FASE 12 está completa cuando cada familia tiene un conjunto suficiente de roles funcionales invariantes, en todas las dimensiones relevantes, para (a) guiar la construcción de nuevas implementaciones sin depender de S1 como referencia implícita, y (b) evaluar si una implementación existente pertenece a esa familia, sin ambigüedad sobre el veredicto en casos representativos.*

Este criterio se consideró alcanzado con las cuatro capas cerradas (Paleta, Tipografía, Composición, Movimiento).

Las listas de recursos y los checklists teóricos anticipados ofrecen rendimiento marginal bajo antes de tener implementaciones reales que testear. Los casos límite que no puedan resolverse con los roles existentes durante la construcción de S2 se registrarán como deuda de sistema en `/docs/AUDITORIA_S2.md` y serán el único insumo para refinamiento teórico futuro, si fuera necesario.

**FASE 12 queda cerrada como fase de descubrimiento y abierta únicamente a validación empírica a través de implementaciones futuras.**

---

## 9. Tabla maestra consolidada — FASE 12 completa

| Familia | Modo | Principio sintetizador | Rol Paleta | Rol Tipografía | Rol Composición | Rol Movimiento |
|---|---|---|---|---|---|---|
| Emotiva | Atmósfera | Emoción sofisticada | Luz emocional | Ninguno (restricción negativa) | Continuidad atmosférica | Asentamiento emocional |
| Con Carácter | Estructura | Postura visible | Afirmación cromática | Tipografía con intención identitaria | Quiebre compositivo localizable | Postura en acto |
| Elegante | Servicio | Refinamiento inevitable | Cohesión tonal | Tipografía proporcional | Espacio sin sobrante | Movimiento al servicio |

---

## 10. Qué queda cerrado y no debe reabrirse

- Rol obligatorio de Movimiento de las tres familias: Asentamiento emocional (Emotiva), Postura en acto (Con Carácter), Movimiento al servicio (Elegante).
- Los cinco hallazgos estructurales de la capa (sección 5).
- La regla transversal de separación función/recurso en la dimensión temporal (sección 6).
- Las cuatro decisiones descartadas (sección 7).
- La decisión de diferir recursos permitidos/prohibidos y reglas operativas hasta disponer de evidencia empírica (sección 8).

**Excepción explícita heredada de FASE 12.2**: el filtro de modo (Atmósfera/Estructura/Servicio) puede reabrirse si durante la construcción de implementaciones futuras aparece una decisión correcta para alguna familia que no pueda describirse mediante estos tres modos. No se activó esta condición durante FASE 12.3.

---

## 11. Continuación — FASE 13

Ver `ESTADO_OFICIAL_PROYECTO.md` sección 9 y `/docs/AUDITORIA_S2.md`.
