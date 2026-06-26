[PRODUCTOS.md](https://github.com/user-attachments/files/29396844/PRODUCTOS.md)
# PRODUCTOS — Catálogo Comercial VELA

Versión del documento: **1**
Fecha de aprobación: **2026-06**
Ubicación: `data/catalogo/PRODUCTOS.md`

---

## §1 Propósito

Este documento define los productos comerciales de VELA: qué son, qué capacidades
incluyen y qué límites tienen.

Es la fuente de verdad del catálogo desde la perspectiva del producto.
No describe implementaciones técnicas ni estados actuales del código.
Describe lo que VELA vende.

Toda decisión de construcción, validación o incorporación de nuevos templates
debe tomarse contra las definiciones contenidas en este documento, no contra
el estado de implementaciones existentes.

---

## §2 Modelo de catálogo

VELA organiza su catálogo en dos productos: **STANDARD** y **PREMIUM**.

Cada producto tiene un conjunto de capacidades funcionales definidas, un contrato
de datos propio y un conjunto de variantes visuales.

### Productos y variantes visuales

| Producto | Variantes visuales |
|----------|--------------------|
| STANDARD | S1, S2, S3         |
| PREMIUM  | P1, P2, P3         |

### Principio fundamental

**STANDARD y PREMIUM son los productos. Las variantes son apariencias.**

S1, S2 y S3 no son productos distintos. Son expresiones visuales del mismo producto
STANDARD. Comparten exactamente las mismas secciones, el mismo contrato de datos
y el mismo comportamiento funcional. La única diferencia entre ellas es visual:
colores, tipografías, layout, animaciones y recursos gráficos.

Lo mismo aplica para P1, P2 y P3 respecto de PREMIUM.

Una divergencia funcional entre variantes del mismo producto es un defecto,
no una característica del sistema.

Las diferencias funcionales existen únicamente entre STANDARD y PREMIUM.

---

## §3 Producto STANDARD

### §3.1 Definición

STANDARD es la invitación digital base de VELA. Presenta la información esencial
del evento con una experiencia visual de calidad, música de fondo y la posibilidad
de confirmar asistencia mediante WhatsApp.

### §3.2 Secciones

#### Secciones obligatorias

Toda implementación de STANDARD debe incluir estas secciones.
Su ausencia constituye un incumplimiento del contrato del producto.

| Sección | Descripción |
|---------|-------------|
| Bienvenida de ingreso | Pantalla inicial animada que presenta la invitación antes de mostrar el contenido principal. Requiere acción del usuario para ingresar. |
| Cuenta regresiva | Contador en tiempo real hacia la fecha y hora del evento. |
| Ubicación y mapas | Nombre del lugar del evento con enlace a Google Maps. |
| Dress code | Indicación del código de vestimenta del evento. |
| Música de fondo | Reproducción de audio con control de pausa. |
| Frase principal | Texto personalizado central de la invitación. |
| Confirmación por WhatsApp | Mecanismo de confirmación de asistencia mediante enlace a WhatsApp. Sin formulario integrado ni recopilación estructurada de datos. |

#### Secciones opcionales

Estas secciones forman parte del producto STANDARD pero su presencia depende
de la configuración de cada cliente. Si los datos correspondientes no están
presentes en el config, la sección no se renderiza.

| Sección | Descripción |
|---------|-------------|
| Regalos | Datos de transferencia bancaria (alias, CVU u otros formatos). Se muestra únicamente si el cliente provee esta información. |

### §3.3 Límites de STANDARD

Las siguientes capacidades están explícitamente fuera del alcance de STANDARD.
Su inclusión en una variante STANDARD constituye una violación del contrato del producto.

- Sin galería de fotos
- Sin timeline ampliado ni recorrido del agasajado
- Sin formulario integrado de confirmación
- Sin recopilación estructurada de datos de invitados
- Sin gestión avanzada de invitados
- Sin listado de confirmados en tiempo real
- Sin trivia interactiva
- Sin itinerario de la fiesta

### §3.4 Contrato de datos — STANDARD

Campos que el producto STANDARD consume. Toda variante visual (S1, S2, S3)
debe consumir exactamente estos campos y ningún campo funcional adicional.

#### Campos obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | string | Nombre del agasajado. |
| `titulo` | string | Título de la invitación (ej: "Mis XV"). |
| `subtitulo` | string | Frase principal de la invitación. |
| `fecha_display` | string | Fecha del evento en formato legible para mostrar. |
| `fecha_larga` | string | Fecha del evento en formato largo (ej: "29 de Mayo"). |
| `dia_semana` | string | Día de la semana del evento. |
| `anio` | string | Año del evento. |
| `hora` | string | Hora del evento en formato legible. |
| `contador` | string ISO datetime | Fecha y hora del evento para el cálculo de la cuenta regresiva. Formato: `YYYY-MM-DDTHH:MM:SS`. |
| `lugar.nombre` | string | Nombre del lugar del evento. |
| `lugar.maps_url` | string | URL de Google Maps del lugar. |
| `dress_code.descripcion` | string | Descripción del código de vestimenta. |
| `musica.src` | string | Ruta o URL del archivo de audio. |
| `musica.nombre` | string | Nombre de la canción o artista. |
| `whatsapp_url` | string | URL de WhatsApp para confirmación de asistencia. |

#### Campos opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `dress_code.aclaracion` | string | Aclaración adicional del dress code. |
| `confirmacion_limite` | string | Fecha límite de confirmación en formato legible. |
| `regalo.alias` | string | Alias de billetera virtual para regalos. |
| `regalo.cvu` | string | CVU para regalos. |

#### Nota sobre campos heredados de S1

S1 actualmente incluye campos de formulario de confirmación (`apps_script_url`,
`sheet_id`) que corresponden a una capacidad de PREMIUM según la definición
oficial del catálogo. Estos campos son un remanente histórico de la implementación
fundacional y no forman parte del contrato de datos de STANDARD.
Ver §6 para más detalle.

---

## §4 Producto PREMIUM

### §4.1 Definición

PREMIUM es la invitación digital completa de VELA. Parte de todas las capacidades
de STANDARD y las extiende con una experiencia narrativa más rica, recopilación
estructurada de datos de invitados y funcionalidades interactivas avanzadas.

### §4.2 Relación con STANDARD

PREMIUM es un superconjunto de STANDARD. Incluye todas las secciones obligatorias
y opcionales de STANDARD más las capacidades adicionales definidas en §4.3.

Una implementación de PREMIUM que no incluya las capacidades de STANDARD es
un incumplimiento del contrato del producto.

### §4.3 Capacidades adicionales de PREMIUM

#### Secciones obligatorias adicionales

| Sección | Descripción |
|---------|-------------|
| Historia ampliada | Narrativa extendida sobre el agasajado o el evento. Mayor profundidad que la frase principal de STANDARD. |
| Timeline | Recorrido cronológico de momentos o hitos del agasajado. |
| Fotografías integradas | Imágenes del agasajado distribuidas en distintas secciones de la invitación. |
| Itinerario | Secuencia de momentos planificados para la fiesta. |
| Formulario integrado de confirmación | Formulario propio con recopilación de datos estructurados: nombre, apellido, asistencia, requerimientos alimentarios, mensajes u observaciones. Reemplaza el botón de WhatsApp de STANDARD. |
| Listado de confirmados en tiempo real | Visualización actualizada de los invitados que confirmaron asistencia. |

#### Secciones opcionales adicionales

| Sección | Descripción |
|---------|-------------|
| Trivia interactiva | Serie de preguntas personalizadas relacionadas con el agasajado o el evento. Capacidad aprobada. Especificación funcional, contrato de datos e implementación diferidos a una fase posterior. |

### §4.4 Límites de PREMIUM

- No definir funcionalidades fuera del alcance aprobado en este documento.
- No asumir capacidades futuras que no hayan sido aprobadas explícitamente.
- La trivia interactiva está aprobada como capacidad pero sin especificación
  funcional vigente. No puede implementarse hasta que su especificación sea
  aprobada formalmente.

### §4.5 Contrato de datos — PREMIUM

PREMIUM hereda el contrato de datos completo de STANDARD y lo extiende
con los siguientes campos adicionales.

### Campos obligatorios adicionales

| Campo                      | Tipo          | Descripción                                                     |
|----------------------------|---------------|-----------------------------------------------------------------|
| `historia.titulo`          | string        | Encabezado de la sección Historia ampliada.                     |
| `historia.cuerpo`          | string        | Texto narrativo. Párrafos separados por `\n`.                   |
| `timeline`                 | array         | Colección ordenada de hitos cronológicos. El orden es significativo y debe preservarse. |
| `timeline[].fecha`         | string        | Etiqueta temporal del hito (año, período o descripción temporal libre). |
| `timeline[].texto`         | string        | Descripción del hito.                                           |
| `fotos`                    | array[string] | URLs de imágenes del agasajado. El orden es significativo y debe preservarse. |
| `itinerario`               | array         | Secuencia de momentos planificados para la fiesta. El orden es significativo y debe preservarse. |
| `itinerario[].hora`        | string        | Hora del momento (ej: `"20:30"`).                               |
| `itinerario[].descripcion` | string        | Descripción del momento.                                        |
| `apps_script_url`          | string        | Endpoint de Google Apps Script para confirmaciones.             |
| `sheet_id`                 | string        | ID de la hoja de Google Sheets destino.                         |

### Campos opcionales adicionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| (ninguno en v1) | | |

### Nota sobre el Listado de confirmados en tiempo real

Esta capacidad no requiere campos adicionales en el config.
Utiliza la misma infraestructura de `apps_script_url` y `sheet_id`
del formulario de confirmación. El Apps Script debe exponer un
endpoint de lectura además del de escritura. El intervalo de
polling es responsabilidad del template (valor fijo en v1, no
configurable). Su configurabilidad queda diferida a una fase posterior.

### Schema del formulario de confirmación

Campos que el invitado completa. Son responsabilidad del template
(UI de captura) y del Apps Script (procesamiento y escritura en Sheets).
No forman parte del `config.json` del cliente.

| Campo                        | Requerido | Descripción                                          |
|------------------------------|-----------|------------------------------------------------------|
| `nombre`                     | sí        | Nombre del invitado.                                 |
| `apellido`                   | sí        | Apellido del invitado.                               |
| `asistencia`                 | sí        | Confirmación de asistencia (sí / no).                |
| `restricciones_alimentarias` | no        | Restricciones o requerimientos alimentarios.         |
| `observaciones`              | no        | Mensaje libre u observaciones adicionales.           |

### Nota de evolución — campo fotos

En v1, `fotos` es `array[string]` (URLs planas). Si en una fase posterior
se aprueba la capacidad de captions por fotografía como capacidad de producto
(§4.3), el campo puede evolucionar a `array[{url: string, caption?: string}]`.
Esa evolución requiere actualización de este contrato, migración de configs
existentes y decisión explícita de producto en §4.3.

---

## §5 Variantes visuales

### §5.1 Qué puede variar entre variantes del mismo producto

Las siguientes dimensiones pueden diferir libremente entre S1, S2 y S3
(y entre P1, P2 y P3) sin afectar el contrato del producto:

- Paleta de colores
- Tipografías
- Layout y disposición de secciones
- Animaciones y transiciones
- Recursos gráficos (imágenes decorativas, iconografía)
- Fondos y texturas
- Espaciado y densidad visual

### §5.2 Qué no puede variar entre variantes del mismo producto

Las siguientes dimensiones deben ser idénticas entre todas las variantes
de un mismo producto:

- Secciones presentes (obligatorias y opcionales)
- Campos del contrato de datos consumidos
- Comportamiento funcional de cada sección
- Lógica de renderizado condicional de secciones opcionales
- Mecanismo de confirmación

### §5.3 Criterio de disponibilidad de una variante

Una variante visual puede marcarse como `disponible` en el catálogo técnico
únicamente cuando:

1. Existe físicamente como componente en el repositorio.
2. Está registrada en `src/templates/templateRegistry.js`.
3. Cumple íntegramente el contrato del producto al que pertenece (secciones, datos, comportamiento).
4. Ha sido validada funcionalmente en producción.
5. Ha sido validada visualmente como propuesta estética diferenciada.

El cumplimiento del contrato del producto (punto 3) se verifica contra
las definiciones de §3 o §4 según corresponda.

---

## §6 Nota histórica — Divergencias en implementaciones fundacionales

S1 es la implementación original de VELA, construida antes de que existiera
una definición formal de productos. Como consecuencia, S1 implementa capacidades
que según la definición oficial del catálogo pertenecen a PREMIUM:

- Formulario integrado de confirmación con nombre, apellido, asistencia,
  requerimiento alimentario y canción sugerida.
- Envío de datos a Google Sheets via Apps Script.
- Campo `sheet_id` en el config.

Estas capacidades no forman parte del contrato de STANDARD según este documento.

Esta divergencia es un remanente histórico. No invalida la definición oficial
del catálogo ni debe condicionar la construcción de S2, S3 o la línea PREMIUM.

La resolución técnica de esta divergencia (alinear S1 con el contrato oficial
de STANDARD o reclasificarla como variante con capacidades extendidas) queda
diferida a una fase posterior cuando exista justificación operativa real
para abordarla.

---

## §7 Relación con otros documentos del sistema

| Documento | Propósito | Relación con este documento |
|-----------|-----------|----------------------------|
| `data/catalogo/templates.js` | Catálogo técnico de templates disponibles | Implementa la estructura de productos definida aquí. Los estados `disponible` / `proximamente` deben ser consistentes con §5.3. |
| `data/catalogo/CONTRATO.md` | Contrato del schema de `templates.js` | Gobierna la estructura de datos del catálogo técnico. |
| `src/templates/templateRegistry.js` | Resolución técnica de templates | Registra las implementaciones concretas de las variantes visuales. |
| `data/clientes/index.json` | Registro operativo de clientes | El campo `template` referencia códigos de variantes (S1, S2, etc.), no productos. |

---

## §8 Historial de versiones

| Versión | Fecha   | Cambios |
|---------|---------|---------|
| 1       | 2026-06 | Definición inicial. Productos STANDARD y PREMIUM. Modelo de variantes visuales. |
| 2       | 2026-06 | FASE 16A: incorporación de §4.5 — Contrato de datos PREMIUM completo. |
