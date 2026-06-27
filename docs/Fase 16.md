[Fase 16.md](https://github.com/user-attachments/files/29403216/Fase.16.md)
# VELA — FASE 16
## Construcción y validación del catálogo PREMIUM

Estado: **CERRADA Y VALIDADA**
Fecha de corte: 2026-06
Subfases: 16A (contrato de datos) · 16B (implementación P1) · 16C (auditoría y validación)

---

## 1. Objetivo original de la fase

Determinar qué significa PREMIUM en VELA y construir la primera variante del catálogo PREMIUM (P1), con validación empírica de percepción de categoría superior y diferenciación respecto de S3.

Preguntas abiertas al inicio de la fase:
1. ¿PREMIUM se diferencia de STANDARD por capacidades funcionales, por tratamiento visual, o por ambos?
2. ¿P1/P2/P3 comparten el organizador visual de su familia o pueden divergir en la instanciación?
3. ¿El primer candidato a implementar es P1 o se abre discusión?

---

## 2. FASE 16A — Contrato de datos PREMIUM

### Decisiones tomadas

**Pregunta 1 — cerrada**: PREMIUM se diferencia de STANDARD exclusivamente por capacidades funcionales. No existe una "estética PREMIUM" independiente de las familias visuales. Decisión derivada de PRODUCTOS.md v1, no reabrir.

**Pregunta 2 — cerrada**: P1/P2/P3 heredan los roles cerrados de su familia visual (Emotiva/Con Carácter/Elegante). Las familias son ortogonales al tier. PREMIUM es un superconjunto funcional de STANDARD dentro de la misma identidad visual de familia.

**Pregunta 3 — cerrada**: P1 como primer candidato por mayor base empírica (S1 como referencia de Emotiva) y por el precedente de infraestructura Sheets/Apps Script ya validada empíricamente.

**Decisión arquitectónica de P1**: P1 utiliza la arquitectura moderna de S2/S3 (archivo único autocontenido). No hereda la estructura modular histórica de `standard1/`. Razones: evitar deuda histórica en la línea PREMIUM, consolidar un único patrón arquitectónico moderno para P1/P2/P3.

### Entregable

`data/catalogo/PRODUCTOS.md` v2 — incorporación de §4.5 (Contrato de datos PREMIUM completo):

| Campo | Tipo | Nota |
|---|---|---|
| `historia.titulo` | string | Encabezado de Historia ampliada |
| `historia.cuerpo` | string | Texto narrativo, párrafos por `\n` |
| `timeline` | array | Orden significativo y preservado |
| `timeline[].fecha` | string | Etiqueta temporal libre (no acoplada a año) |
| `timeline[].texto` | string | Descripción del hito |
| `fotos` | array[string] | URLs ordenadas, orden significativo |
| `itinerario` | array | Orden significativo y preservado |
| `itinerario[].hora` | string | Hora del momento |
| `itinerario[].descripcion` | string | Descripción del momento |
| `apps_script_url` | string | Endpoint Apps Script |
| `sheet_id` | string | ID hoja de Sheets destino |

Schema del formulario de confirmación (responsabilidad del template, fuera del config.json): `nombre` (req.), `apellido` (req.), `asistencia` (req.), `restricciones_alimentarias` (opc.), `observaciones` (opc.).

Nota de evolución documentada: `fotos` puede evolucionar a `array[{url, caption?}]` si se aprueba como capacidad de producto en §4.3. Requiere decisión explícita y migración de configs.

Orden significativo explícitamente registrado en `timeline`, `fotos` e `itinerario`.

---

## 3. FASE 16B — Construcción de P1

### Análisis de S1 como referencia de Emotiva

**Elementos constitutivos de Emotiva preservados en P1**:
- Temperatura emocional cálida dominante como primera impresión perceptiva.
- Continuidad atmosférica: sin divisores duros entre secciones.
- Asentamiento emocional: `translateY + opacity` con permanencia perceptible entre elementos.
- Cover como ritual de ingreso: espacio de bienvenida con foco lumínico y umbral de entrada.
- Restricción tipográfica: ningún nivel opera en modo Estructura.

**Elementos accidentales de S1 no trasladados a P1**:
- Paleta propia de S1 (rosas `#c4848a`, `#9e6068`): fuera del sistema VELA oficial.
- Fuentes Dancing Script y Playfair Display: no pertenecen al sistema tipográfico oficial.
- Lógica multi-invitado con `MAX_GUESTS = 6`: supera el schema §4.5 aprobado.
- Código de confirmación generado en cliente (`generateCode`): no está en el contrato PREMIUM.
- Particles y Shimmer como únicos mecanismos atmosféricos: instanciación histórica, no invariante.

### Decisión de instanciación aprobada

Problema identificado: la paleta oficial VELA (Crema, Taupe, Mocha, Negro cálido, Champagne) podría acercar perceptualmente P1 al territorio de Elegante si no se instancia correctamente.

**Resolución**: la diferencia es estructural, no de detalle.

| Dimensión | S3 (Elegante) | P1 (Emotiva) |
|---|---|---|
| Fondo dominante | Crema plana como superficie | Mocha/oscuro-cálido como profundidad |
| Rol del espacio | Organizador primario | Respiración entre momentos emocionales |
| Champagne/Crema | Acento tonal subordinado | Luz emergente sobre campo oscuro |
| Sensación de entrada | Refinamiento, reposo | Temperatura, anticipación |

**Regla operativa verificable**: si en alguna sección el fondo es Crema plana y el texto es oscuro, P1 está derivando hacia Elegante. P1 debe tener campo oscuro cálido con texto luminoso.

**Criterio de validación empírica cerrado**: si durante la auditoría P1 y S3 se perciben como la misma familia estética, P1 requiere ajuste de instanciación.

### Instanciación de P1

- **Fondo**: gradiente térmico descendente `#5a3d2b → #3d2518 → #1e100a` (Mocha profundo como campo).
- **Foco lumínico**: Champagne (`#E6D3A8`) en nombres, títulos y detalles de Luz emocional.
- **Atmósfera**: overlays de gradiente radial (`warmOverlay`) en Champagne y Mocha. Reemplaza Particles/Shimmer de S1 con el mismo efecto perceptivo.
- **Tipografía**: Cormorant Garamond (titulares) + Inter (cuerpo). Sistema oficial VELA.
- **Cadencia**: `translateY + opacity` con `cubic-bezier(0.16,1,0.3,1)` y delays escalonados.

### Secciones de P1

| Sección | Tier | Notas |
|---|---|---|
| Cover | STANDARD | Campo oscuro, nombre en Champagne a escala grande. Umbral emocional. |
| HeroSection | STANDARD | Nombre a máxima escala + cuenta regresiva en cards oscuras. |
| HistoriaSection | PREMIUM | Narrativa ampliada. Párrafos por `\n`. Tratamiento atmosférico uniforme. |
| TimelineSection | PREMIUM | Hitos con eje de puntos Champagne. Layout atmosférico, no tabular. Delays escalonados por ítem. |
| FotosSection | PREMIUM | Grilla: primera foto a ancho completo, resto en 2 columnas. Orden preservado. |
| EventSection | STANDARD | Fecha, lugar, dress code en cards con borde Champagne sutil. |
| ItinerarioSection | PREMIUM | Grilla hora/descripción. Separadores ultrafinos. Layout atmosférico. |
| MusicSection | STANDARD | Control de reproducción. |
| GiftsSection | STANDARD | Modal de datos de transferencia. |
| ConfirmSection | PREMIUM | Formulario integrado según schema §4.5. Reemplaza botón WhatsApp de STANDARD. |
| ConfirmadosSection | PREMIUM | Polling 30s al Apps Script. Sin campo de config adicional. |
| Footer | STANDARD | Nombre en Champagne + datos del evento. |

### Changeset FASE 16B

| Archivo | Acción |
|---|---|
| `src/templates/P1.jsx` | Creado. 1.422 líneas, archivo único, patrón S2/S3. |
| `src/templates/templateRegistry.js` | +1 import P1, +1 entrada `category: 'premium'`. Diff mínimo. |
| `public/clientes/prueba/config.json` | Extendido con campos §4.5. Plan: PREMIUM, template: P1. |

---

## 4. FASE 16C — Auditoría y validación

### Incidencias registradas y resueltas

**INCIDENCIA-P1-001** — Contraste insuficiente en jerarquía baja sobre fondos oscuros en mobile.

Secciones afectadas: Timeline (fechas y textos secundarios), ConfirmSection (labels y elementos auxiliares).

Resolución: 5 diffs quirúrgicos sobre P1.jsx. Textos principales y títulos sin modificación.

| # | Elemento | Cambio |
|---|---|---|
| 1 | Timeline `item.fecha` fontSize | `clamp(0.7rem,…)` → `clamp(0.75rem,…)` mínimo mobile |
| 2 | Timeline `item.texto` opacity | `0.85` → `1` |
| 3 | `labelStyle` color | `C.taupe` → `${C.crema}BB` |
| 4 | `labelStyle` fontSize | `clamp(0.55rem,…)` → `clamp(0.65rem,…)` mínimo mobile |
| 5 | Mensaje éxito confirmación | `C.taupe` → `${C.crema}99` |

Estado: **cerrada**.

**AJUSTE-P1-001** — Dataset de prueba insuficiente en FotosSection.

Resolución: config de prueba extendido a 8 fotos Picsum con variedad de aspect ratios (portrait, landscape, cuadrado) para auditar distribución, ritmo, densidad y responsive.

Estado: **cerrado**.

### Observaciones registradas (no bloqueantes, diferidas)

**OBS-P1-001** — `ConfirmadosSection` en P1 tiene como consumidor actual a los invitados. La intención comercial es que confirmados, estadísticas y métricas de asistencia migren en fases futuras a una herramienta administrativa para el organizador, reutilizando la misma infraestructura Sheets + Apps Script. Sin impacto en P1 ni en §4.5.

**OBS-P1-002** — El schema simplificado de §4.5 puede no reflejar completamente las necesidades operativas reales. Candidatos para revisión futura: múltiples asistentes por confirmación, restricciones alimentarias con opciones controladas, reducción de campos libres. Requiere evidencia operativa antes de reabrir §4.5.

**OBS-P1-003** — Historia ampliada genera scroll largo en mobile. No es un defecto de implementación sino una consecuencia natural del volumen narrativo esperado para PREMIUM. Evaluar con contenido real de cliente cuando llegue el onboarding.

### Validaciones obtenidas

**VALIDACION-P1-001** — P1 se percibe claramente como una categoría superior respecto del catálogo STANDARD sin romper la identidad visual de VELA ni confundirse con S3.

Criterio de validación empírica (establecido en FASE 16B): **superado**. P1 y S3 no se perciben como la misma familia estética.

La distinción estructural entre campo oscuro cálido con luz emergente (P1/Emotiva) y superficie clara con refinamiento tonal (S3/Elegante) es efectiva y perceptivamente inmediata dentro de la misma paleta oficial.

---

## 5. Impacto sobre la arquitectura

- `src/templates/P1.jsx` establece el **patrón de referencia arquitectónica para toda la línea PREMIUM**. P2 y P3 seguirán el mismo patrón de archivo único moderno.
- `templateRegistry.js` incorpora la primera entrada `category: 'premium'`.
- `data/catalogo/PRODUCTOS.md` pasa a v2 con §4.5 completo.
- La infraestructura Sheets + Apps Script existente absorbe las capacidades PREMIUM sin modificación.
- No se introdujeron nuevas dependencias. No se modificó ningún archivo de producción existente.

---

## 6. Estado final del catálogo

| Variante | Familia | Tier | Estado |
|---|---|---|---|
| S1 | Emotiva | STANDARD | ✅ Validada en producción |
| S2 | Con Carácter | STANDARD | ✅ Validada en producción |
| S3 | Elegante | STANDARD | ✅ Validada en Preview Deployment |
| P1 | Emotiva | PREMIUM | ✅ Validada en Preview Deployment |
| P2 | Con Carácter | PREMIUM | ⬜ Declarada |
| P3 | Elegante | PREMIUM | ⬜ Declarada |

---

## 7. Criterios que habilitan el cierre formal

| Criterio | Estado |
|---|---|
| §4.5 aprobado y documentado en PRODUCTOS.md v2 | ✅ |
| P1.jsx construido según patrón arquitectónico moderno | ✅ |
| P1 registrado en templateRegistry con `category: 'premium'` | ✅ |
| Config de prueba PREMIUM completo y funcional | ✅ |
| INCIDENCIA-P1-001 resuelta y validada post-corrección | ✅ |
| AJUSTE-P1-001 resuelto | ✅ |
| VALIDACION-P1-001 confirmada: percepción de categoría superior | ✅ |
| Criterio de diferenciación P1/S3 superado | ✅ |
| Producción intacta | ✅ |

**FASE 16 cerrada.**
