# AUDITORIA_S2 — Instrumento de validación para Con Carácter

Versión: 1
Estado: activo desde FASE 13
Fuente de autoridad: `docs/FASE_12_3.md`, `docs/FASE_12_2.md`, `ESTADO_OFICIAL_PROYECTO.md`

---

## Propósito

Instrumento operativo de una sola capa que traduce los cuatro roles obligatorios cerrados de la familia Con Carácter en preguntas de auditoría directamente aplicables durante la construcción de S2.

No es un checklist teórico anticipado. Es el instrumento de trabajo de FASE 13: cada decisión de construcción de S2 que no sea trivialmente derivable de los roles existentes debe pasar por este documento antes de considerarse cerrada.

---

## Las cuatro preguntas de auditoría

### Paleta — Afirmación cromática

> ¿Existe en la composición al menos un elemento que se recorta contra el campo con borde definido, en proporción inusual o posición asimétrica, no justificable por legibilidad ni por armonía genérica?

- Si **no existe**: la implementación no cumple el rol de paleta de Con Carácter.
- Prueba operativa complementaria: ¿hay un elemento que se recorta contra el campo con borde duro? Sí → Con Carácter. No (todo cohesiona) → Elegante.

**Instanciación de referencia aprobada**: campo en Crema suave `#F8F5EF`, bloque sólido en Negro cálido `#1A1A1A` en posición asimétrica respecto al resto de la composición.

---

### Tipografía — Tipografía con intención identitaria

> ¿Reemplazar la tipografía de títulos por una alternativa genérica de legibilidad equivalente cambiaría perceptiblemente la identidad de la implementación?

- Si **no cambiaría**: la tipografía elegida es instanciación genérica, no rol cumplido.
- Lo que no es intercambiable: la voz / el tipo de letra en el nivel de títulos.
- Lo que sí puede variar: el sistema de proporción y espaciado.

**Instanciación de referencia aprobada**: tracking amplio o rasgos tipográficos distintivos en el nivel de títulos.

---

### Composición — Quiebre compositivo localizable

> ¿Puede señalarse al menos un punto específico en la composición donde la disposición esperada (simetría, grilla, proporción convencional) se interrumpe de forma deliberada y señalable?

- Si **no puede señalarse**: la implementación no cumple el rol de composición de Con Carácter.
- La condición no es que haya muchos quiebres; es que haya al menos uno localizable.

**Instanciación de referencia aprobada**: el bloque de Afirmación cromática (Negro cálido, posición asimétrica) sirve simultáneamente como Afirmación cromática y como Quiebre compositivo localizable.

---

### Movimiento — Postura en acto

*(Aplica únicamente si existe movimiento en el punto del quiebre)*

> ¿La llegada del elemento que produce el quiebre se percibe como un acontecimiento localizable en el tiempo, o como un atributo que ya estaba dispuesto desde el principio?

- Si se percibe como **atributo estático**: el rol de movimiento no se cumple.
- La intensidad, velocidad o duración del movimiento son instanciación; lo obligatorio es que la llegada sea reconocible como suceso.
- Si no existe movimiento en el punto del quiebre: este rol no aplica. La composición estática cumple igualmente Quiebre Compositivo Localizable.

---

## Protocolo de caso límite

Cuando durante la construcción de S2 aparezca una decisión que las cuatro preguntas anteriores no puedan resolver, se registra en la sección siguiente con este formato:

```
### CL-XXX — [descripción breve de la decisión]
Decisión concreta: [qué se está decidiendo]
Pregunta sin respuesta: [qué aspecto no cubre ninguno de los cuatro roles]
Roles involucrados: [cuáles son relevantes]
Resolución provisional adoptada: [qué se hizo para no bloquear la construcción]
Estado: abierto / resuelto
```

Un caso límite resuelto puede convertirse en instanciación de referencia adicional o en deuda de sistema, según su naturaleza. No genera nuevos roles ni nuevas capas teóricas de forma automática.

---

## Registro de casos límite

*(Vacío al inicio de FASE 13. Se completa durante la construcción de S2.)*

---

## Qué no hace este documento

- No define recursos visuales permitidos ni prohibidos de forma anticipada.
- No genera nuevos invariantes.
- No reemplaza ni resume los documentos de fase; los referencia.
- No aplica a S3, P1, P2 ni P3 — cada implementación futura tendrá su propio instrumento equivalente si es necesario, o usará los roles directamente si no aparecen casos límite que lo justifiquen.
