[Fase 20.md](https://github.com/user-attachments/files/29684625/Fase.20.md)
# FASE 20 — Transformación del Mapa de Riesgos en Arquitectura de Capacidades
## Documento de cierre oficial

Versión: 1 · Cierra FASE 20 · Depende de: FASE 19 (`docs/VELA_FASE19_AUDITORIA_ARQUITECTONICA.md`, `docs/Fase 19.md`)

---

## 1. Objetivo de la fase

Transformar el mapa de riesgos consolidado en FASE 19 (Riesgos A–I) en un plan de intervención arquitectónica mínimo, priorizado y alineado con el desarrollo del Owner Tool.

**FASE 20 fue una fase estratégica.** No se implementó código. No se modificó ningún archivo del repositorio. El entregable es una decisión arquitectónica aprobada: el **Minimum Architecture Upgrade (MAU)**.

**Relación con FASE 19 — trazabilidad explícita**: FASE 19 identifica, clasifica y no prioriza. FASE 20 no reabre, no reclasifica y no invalida ningún hallazgo de FASE 19. FASE 20 interpreta esos hallazgos y determina cuáles de ellos integran la arquitectura mínima necesaria para habilitar el Owner Tool. El MAU es la consecuencia estratégica de la auditoría, no un reemplazo de ella. Los Riesgos A–D de FASE 19 permanecen documentados como tales, sin alteración, en la sección 18 de `ESTADO_OFICIAL_PROYECTO.md`.

---

## 2. Subfase 1 — Análisis de dependencias técnicas

Se realizó inspección directa de código sobre `xv-platform-lab` (no se reutilizó memoria de sesiones anteriores) para fundar el análisis en evidencia:

- `TemplateLoader.jsx`: fallback a S1 incondicional, sin distinción entre config ausente y config inválida → confirma Riesgo B (rama fallback).
- `ClientesPage.jsx` línea 25: `import registroRaw from '../../data/clientes/index.json'` — import estático de Vite → confirma Riesgo C: toda alta de cliente queda embebida en el bundle en build time.
- `AdminPage.jsx`: el objeto de campos generado replica únicamente las claves consumidas por `standard1.jsx`; no hay rama que genere los campos §4.5 de PRODUCTOS.md → confirma Riesgo D.
- `useConfig.js`: `fetch` + `res.json()` sin validación de forma alguna antes de propagar el resultado a los templates → confirma Riesgo A como ausencia estructural, no puntual.

**Grafo de dependencias técnicas:**

```
RIESGO-A (contrato + validación)
   │
   ├──► habilita / evita-parche-ad-hoc ──► RIESGO-B2 (fallback ambiguo)
   ├──► habilita / evita-parche-ad-hoc ──► RIESGO-D (schema PREMIUM en AdminPage)
   └──► habilita / evita-parche-ad-hoc ──► RIESGO-C (registro dinámico seguro)

RIESGO-B1 (RSVP no-cors) ── sin dependencias, aislado del resto

RIESGO-C y RIESGO-D no se bloquean entre sí — son paralelos una vez que A existe,
pero ambos son prerequisito conjunto para que la primera pantalla del Owner Tool
sea completa.
```

Riesgo E (credenciales expuestas en `config.json` público) no muestra dependencia con A–D; su explotabilidad depende de una auditoría de permisos de Apps Script no realizada. Queda diferido, sin relación con este grafo. Riesgos F e I permanecen fuera de alcance, conforme a FASE 19.

---

## 3. Subfase 2 — De riesgos a capacidades de plataforma

Se reinterpretaron los cuatro riesgos bloqueantes como capacidades arquitectónicas, cambiando la pregunta de "¿qué problema resolvemos?" a "¿qué capacidad nueva adquiere el sistema?":

| Riesgo FASE 19 | Capacidad de plataforma |
|---|---|
| Riesgo A | Contrato Ejecutable de Configuración |
| Riesgo C | Gestión Dinámica de Clientes |
| Riesgo D | Generación Universal de Configuraciones |
| Riesgo B | Observabilidad Operativa |

**Grafo de capacidades:**

```
Catálogo Comercial (6 variantes — cerrado, FASE 18)
            │
            ▼
Contrato Ejecutable de Configuración          ← FUNDACIONAL
            │
   ┌────────┼─────────────────┐
   ▼        ▼                 ▼
Generación   Gestión          Observabilidad
Universal de Dinámica de      Operativa
Configuraciones Clientes       (paralela, no bloqueante)
   │            │
   └─────┬──────┘
         ▼
   Owner Tool (primera capacidad completa)
         │
         ▼
   Herramienta para Clientes (autoservicio)
         │
         ▼
   Automatizaciones futuras
```

**Clasificación:**
- **Fundacional**: Contrato Ejecutable de Configuración.
- **Habilitadoras**: Gestión Dinámica de Clientes; Generación Universal de Configuraciones.
- **Evolutiva (bajo criterio técnico)**: Observabilidad Operativa.

---

## 4. Subfase 3 — Dependencia técnica vs. dependencia estratégica

Se distinguieron dos criterios de análisis, no equivalentes entre sí:

- **Dependencia técnica**: ¿puede construirse X sin que Y exista, sin romper el sistema?
- **Dependencia estratégica**: ¿con qué conjunto mínimo de capacidades estamos dispuestos a liberar la primera versión operativa?

Bajo criterio técnico, Observabilidad Operativa es evolutiva: el Owner Tool puede construirse sin ella. Bajo criterio estratégico, su urgencia no proviene de sí misma sino del éxito de las otras tres capacidades: Contrato Ejecutable, Generación Universal y Gestión Dinámica son precisamente lo que multiplica el volumen de clientes que el sistema maneja. Liberar esa capacidad de escalar sin la capacidad de detectar fallos es liberar la causa del próximo incidente silencioso, a mayor escala que el caso Valentina.

**Principio establecido**: el éxito de una capacidad puede volver imprescindible otra que técnicamente era opcional.

---

## 5. Subfase 4 — Condiciones de liberación de la plataforma

Se reformuló el objeto de evaluación: no "¿qué necesita el Owner Tool para liberarse?" sino "¿qué necesita VELA para quedar lista para su primera operación real como plataforma?". El Owner Tool es la primera manifestación visible de ese estado, no el objetivo en sí mismo.

**Condiciones imprescindibles** (sin ellas, VELA no está lista para operar como plataforma):
1. Alta de cliente sin deploy.
2. Cobertura completa de las seis variantes del catálogo comercial.
3. Validez de configuración verificable antes de publicar.
4. Detección explícita de los fallos críticos ya identificados (fallback silencioso, RSVP no confirmado) sin depender de inspección manual.

**Condiciones deseables** (no bloquean la primera liberación):
5. Vista de estado consolidado de salud de todos los clientes.
6. Automatizaciones adicionales de notificación/alerta (fuera de alcance — territorio de Riesgo I y autoservicio).

---

## 6. Decisión arquitectónica oficial — Minimum Architecture Upgrade (MAU)

Las cuatro condiciones imprescindibles se traducen en los cuatro elementos del MAU. Este es el entregable oficial de FASE 20.

### MAU-1 — Contrato Ejecutable de Configuración
- **Condición que satisface**: validez verificable antes de publicar.
- **Por qué no puede diferirse**: sin esto, los otros tres elementos, si se construyen igual, resuelven su propio problema con una noción propia y no reconciliada de "config correcto" — el patrón que ya generó el caso Valentina.
- **Qué ocurriría si se omitiera**: cada punto de entrada de datos validaría a su manera, con criterios que divergen con el tiempo; el costo de reconciliarlos después, con clientes reales operando, es mayor que establecerlo ahora.
- **Qué habilita directamente**: que MAU-2, MAU-3 y MAU-4 se apoyen en una única fuente de verdad de validez, en vez de reinventarla cada uno.
- **Principio que preserva**: la disciplina de contratos documentados (`CONTRATO.md`) que ya rige `data/clientes/` y `data/catalogo/` desde FASE 8.2A/8.2B — extendida a runtime, no reemplazada.

### MAU-2 — Generación Universal de Configuraciones
- **Condición que satisface**: cobertura completa de las seis variantes.
- **Por qué no puede diferirse**: el catálogo comercial está cerrado y completo desde FASE 18; una herramienta interna que solo administra 1 de 6 productos activamente vendidos es una brecha entre lo comercial y lo operativo.
- **Qué ocurriría si se omitiera**: cada venta de S2/S3/P1/P2/P3 se seguiría armando a mano fuera de la herramienta.
- **Qué habilita directamente**: que cualquier cliente, de cualquier variante, se dé de alta enteramente desde la plataforma; es prerequisito de que MAU-3 tenga sentido operativo.
- **Principio que preserva**: la ortogonalidad Familia × Tier confirmada como fortaleza en FASE 19.

### MAU-3 — Fuente Dinámica de Registro de Clientes
- **Condición que satisface**: alta de clientes sin deploy.
- **Por qué no puede diferirse**: define si VELA es operable como plataforma o sigue siendo un catálogo que se reconstruye por cada cliente nuevo.
- **Qué ocurriría si se omitiera**: el Owner Tool podría verse terminado, pero cada alta real seguiría requiriendo un commit y un deploy.
- **Qué habilita directamente**: la escalabilidad operativa declarada como valor principal del producto; es prerequisito conceptual de cualquier futura Herramienta para Clientes.
- **Principio que preserva**: la separación ya establecida entre catálogo comercial (`data/catalogo/`) y registro operativo (`data/clientes/`), cerrada desde FASE 8.2A/8.2B. No se reabre ni se fusiona esa separación; cambia únicamente cuándo se lee el registro.

### MAU-4 — Señalización Explícita de Fallos Críticos
- **Condición que satisface**: detección de fallos críticos sin inspección manual.
- **Por qué no puede diferirse**: su urgencia no viene de sí misma sino del éxito de MAU-1, MAU-2 y MAU-3, que juntos multiplican el volumen de clientes que el sistema maneja.
- **Qué ocurriría si se omitiera**: los dos fallos ya identificados (RSVP no confirmado, fallback silencioso) seguirían descubriéndose cuando el cliente final los reporta.
- **Qué habilita directamente**: que crecer en volumen no implique crecer en supervisión manual en la misma proporción.
- **Principio que preserva**: el aislamiento empírico de variables validado como herramienta de auditoría desde FASE 18D — no introduce diagnóstico especulativo ni hallazgos nuevos, solo hace visibles dos fallos ya confirmados en FASE 19.

**Relación entre los cuatro elementos**: MAU-1 es la base sobre la que MAU-2 y MAU-4 validan lo que producen; MAU-3 se apoya en MAU-1 pero es arquitectónicamente independiente en su construcción. MAU-2 y MAU-3 son paralelos entre sí y, juntos, completan la primera pantalla operativa de la plataforma. MAU-4 no bloquea a los otros tres, pero su ausencia convierte el éxito de los otros tres en el vector del próximo incidente no detectado.

---

## 7. Decisiones cerradas — NO REABRIR

- El MAU de 4 elementos (Contrato Ejecutable de Configuración, Generación Universal de Configuraciones, Fuente Dinámica de Registro de Clientes, Señalización Explícita de Fallos Críticos) es la respuesta oficial de FASE 20 a la pregunta arquitectónica de la fase.
- Ninguna implementación fue aprobada en FASE 20. El MAU es una decisión arquitectónica, no un changeset.
- Los Riesgos A–D de FASE 19 no se reclasifican ni se invalidan: el MAU es su consecuencia estratégica, registrada en una fase distinta.
- Riesgos E, F, G, H, I permanecen exactamente en el estado documentado en FASE 19. No fueron parte del alcance de esta fase.
- El orden de implementación de los cuatro elementos del MAU y el diseño de pantallas del Owner Tool quedan fuera de alcance de FASE 20 — corresponden a Horizonte 3A.

---

## 8. Fuera de alcance de esta fase

- Implementación de código de cualquier tipo.
- Diseño de pantallas o flujos del Owner Tool.
- Orden de intervención entre los cuatro elementos del MAU.
- Riesgo E (diferido, sin relación de dependencia con el MAU).
- Riesgos F e I (fuera de alcance, conforme a FASE 19).
- Herramienta de autoservicio para clientes.

---

## 9. Changeset aplicado

```
docs/Fase 20.md                    ← nuevo, documento de cierre oficial
docs/ESTADO_OFICIAL_PROYECTO.md    ← v11, sección 19 incorporada (FASE 20 / MAU)
                                       sección 18 (FASE 19) sin modificar
Instrucciones maestras del proyecto ← actualizadas a versión FASE 20
```

---

## 10. Punto exacto de continuación

**FASE 20 cerrada.** El MAU queda establecido como decisión arquitectónica oficial. Próximo paso: Horizonte 3A — definición del orden de intervención para implementar los cuatro elementos del MAU, siguiendo el protocolo obligatorio del proyecto (Análisis → Riesgos → Alternativas → Recomendación → Cambio mínimo → Impacto esperado → Esperando confirmación). No se implementa código hasta que ese orden sea aprobado explícitamente por Andrés.
