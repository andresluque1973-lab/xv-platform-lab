[FASE20_apertura_conceptual.md](https://github.com/user-attachments/files/29681893/FASE20_apertura_conceptual.md)
# VELA — Apertura conceptual FASE 20

**Estado:** DEFINICIÓN — no iniciada  
**Tipo de fase:** Estratégica — sin implementación de código

---

## Objetivo

Transformar el mapa de riesgos de FASE 19 en un plan de intervención arquitectónica mínimo, priorizado y alineado con el desarrollo del Owner Tool.

---

## Preguntas que deberá responder

1. ¿En qué orden deben resolverse los Riesgos A, B, C y D para minimizar dependencias entre ellos y maximizar el valor entregado en cada paso?
2. ¿Qué cambio mínimo resuelve cada riesgo sin introducir complejidad innecesaria?
3. ¿Alguno de los cuatro riesgos puede resolverse parcialmente como prerequisito del siguiente, o son independientes?
4. ¿Qué necesita estar resuelto antes de que la primera pantalla del Owner Tool sea técnicamente posible?
5. ¿El Riesgo E (exposición de credenciales) requiere intervención antes de avanzar con los demás, o puede diferirse al momento de escalar?

---

## Entregables esperados

- Plan de intervención ordenado: qué se resuelve primero, por qué, y en qué orden.
- Para cada intervención: cambio mínimo propuesto, riesgo de la intervención, impacto esperado.
- Definición de qué constituye "resuelto" para cada riesgo (criterio de validación).
- Identificación de qué parte del Owner Tool puede construirse en paralelo a los prerequisitos y qué parte depende de ellos.

---

## Criterios de éxito

- Al cerrar FASE 20, debe existir un plan de intervención aprobado con orden de ejecución definido.
- Cada intervención debe tener cambio mínimo identificado y criterio de validación claro.
- El plan debe poder ejecutarse en fases discretas sin requerir una reescritura global.
- Ninguna intervención aprobada en FASE 20 debe contradecir las fortalezas arquitectónicas identificadas en FASE 19.

---

## Fuera de alcance explícito

- Implementación de cualquier código.
- Diseño de pantallas o flujos del Owner Tool.
- Reapertura de decisiones cerradas en FASE 19 o anteriores.
- Incorporación de nuevos hallazgos arquitectónicos no registrados en FASE 19.
- Discusión de herramienta del cliente / autoservicio.
- Discusión de estado dinámico / base de datos (Riesgo I).
- Rediseño del modelo de dominio Cliente/Evento (Riesgo F).

---

## Nota metodológica

FASE 20 sigue siendo una fase estratégica. Su entregable es un plan aprobado, no código deployado. La implementación ocurrirá en fases posteriores, cada una con su propio ciclo de análisis → aprobación → ejecución → validación.

