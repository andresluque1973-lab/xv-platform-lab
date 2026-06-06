# CONTRATO — Catálogo Comercial VELA

Versión del contrato: **1**
Fecha de congelamiento: **2026-06**
Archivo de datos: `data/catalogo/templates.js`

---

## §1 Propósito del catálogo

`data/catalogo/templates.js` es la fuente de verdad del catálogo comercial de VELA.

Define qué productos existen, a qué plan pertenecen y si están disponibles.

Es un artefacto comercial, no un registro operacional.
A diferencia del registro de clientes, este archivo sí forma parte del bundle
frontend — es consumido por el panel de administración para derivar los planes
y templates disponibles al crear una invitación.

Su propósito es:

- declarar el catálogo completo de templates VELA
- ser la fuente de verdad de los códigos de template válidos en el sistema
- desacoplar la identidad comercial del producto de su implementación técnica

No es:

- un registro de clientes ni de invitaciones
- una fuente de configuración de invitaciones individuales
- un sistema de resolución técnica de componentes (eso pertenece a `templateRegistry.js`)

---

## §2 Versión del contrato

El campo `version` en `catalogo` identifica la versión del schema de datos.

Versión actual: `"1"`

La versión de este documento y la versión del campo `version` en `templates.js`
deben mantenerse sincronizadas.

A diferencia del registro de clientes, este archivo es importado en el bundle
frontend. Un cambio de schema puede tener impacto en `AdminPage.jsx` y requiere
verificación de compatibilidad antes de aplicarse.

---

## §3 Schema de campos

Cada entrada del array `templates` sigue el siguiente schema:

| Campo    | Tipo   | Obligatorio | Descripción                                                               |
|----------|--------|-------------|---------------------------------------------------------------------------|
| `codigo` | string | ✓ sí        | Identificador único del template. Inmutable una vez publicado en catálogo. |
| `plan`   | string | ✓ sí        | Plan comercial al que pertenece. Ver §6.                                   |
| `nombre` | string | ✓ sí        | Nombre legible del template. Se muestra en interfaces de administración.   |
| `estado` | string | ✓ sí        | Estado de disponibilidad del template. Ver §4.                             |

Todos los campos son obligatorios. El catálogo no admite campos opcionales ni nulls.

---

## §4 Estados válidos

El campo `estado` acepta únicamente los siguientes valores:

### `disponible`
El template existe físicamente, está conectado al sistema de resolución técnica
y ha sido validado en producción. Puede asignarse a clientes reales.

Un template no puede marcarse como `disponible` hasta que se cumplan
todas las condiciones anteriores simultáneamente.

### `proximamente`
El template está declarado en el catálogo pero no está implementado,
validado o disponible para uso en producción. Su presencia en el catálogo
es intencional: establece la identidad comercial del producto con anticipación
a su implementación técnica.

Los templates con este estado pueden ser visibles en interfaces de
administración según reglas de negocio vigentes, pero no pueden asignarse
como templates activos a invitaciones en producción.

---

## §5 Convención de códigos

Los códigos de template siguen actualmente la convención:

- prefijo que identifica el plan (`S` para STANDARD, `P` para PREMIUM)
- número secuencial dentro del plan

Esta es la convención de nomenclatura actual, no una restricción técnica del sistema.
Futuras familias de templates pueden adoptar convenciones distintas si el producto
lo requiere, siempre que los códigos sean únicos dentro del catálogo.

El `codigo` es inmutable una vez que el template ha sido publicado en el catálogo.
No debe modificarse aunque cambie el nombre comercial del template.

---

## §6 Planes comerciales

El catálogo organiza los templates en dos planes:

### `STANDARD`
Plan base. Incluye las funcionalidades esenciales de la invitación digital.

### `PREMIUM`
Plan avanzado. Incluye todo lo de STANDARD más funcionalidades adicionales
como galería de fotos, analytics y secciones extendidas.

Los planes son categorías comerciales del catálogo. Su definición técnica
de funcionalidades vive fuera de este archivo.

---

## §7 Reglas de negocio

- `codigo` es único dentro del catálogo. No puede repetirse entre templates.
- Una vez que un `codigo` es publicado en el catálogo, no debe modificarse.
  Es la clave de referencia en el registro de clientes y en el sistema de resolución técnica.
- El catálogo es cerrado. VELA no es un marketplace ni admite templates externos.
  Todos los templates son productos fijos del catálogo oficial.
- Un template con `estado: "proximamente"` puede ser visible en interfaces
  de administración, pero no debe usarse como template activo de una invitación
  en producción hasta alcanzar `estado: "disponible"`.
- Agregar un nuevo template al catálogo no lo hace técnicamente disponible.
  Son dos pasos independientes: declaración en catálogo y registro en el
  sistema de resolución técnica.

---

## §8 Relación con templateRegistry.js

`data/catalogo/templates.js` y `src/templates/templateRegistry.js` son capas
distintas con propósitos distintos:

| Archivo                             | Propósito                                      | Consumidor principal |
|-------------------------------------|------------------------------------------------|----------------------|
| `data/catalogo/templates.js`        | Catálogo comercial — qué productos existen     | `AdminPage.jsx`      |
| `src/templates/templateRegistry.js` | Resolución técnica — qué componente renderizar | `TemplateLoader.jsx` |

La relación entre ambas capas es declarativa. No existe validación automática
entre ellas.

Reglas que deben respetarse manualmente:

- Todo template con `estado: "disponible"` en el catálogo debe tener una entrada
  correspondiente en `templateRegistry.js`.
- Todo template en `templateRegistry.js` debe tener una entrada correspondiente
  en el catálogo. No deben existir templates técnicamente registrados pero
  comercialmente no declarados.
- La fuente de verdad de qué templates existen como productos es el catálogo.
  La fuente de verdad de cómo se resuelven técnicamente es el registry.

---

## §9 Relación con el registro de clientes

El campo `template` en `data/clientes/index.json` referencia el campo `codigo`
de este catálogo.

Consideraciones:

- El catálogo es la fuente de verdad de los códigos válidos.
- Un cliente puede tener `template: null` — válido para clientes fundacionales.
- Un cliente puede referenciar un template con `estado: "proximamente"`.
  Esto es válido en el registro operacional pero no implica que el template
  esté disponible en producción.
- La relación no es validada automáticamente por el sistema.

---

## §10 Compatibilidad futura — templates en proximamente

Los templates declarados con `estado: "proximamente"` forman parte del
catálogo oficial. Su presencia es intencional y no debe interpretarse
como deuda técnica a resolver urgentemente.

El criterio para pasar un template a `estado: "disponible"` es estricto
y no negociable:

1. El template existe físicamente como componente en el repositorio.
2. Está registrado en `src/templates/templateRegistry.js`.
3. Funciona correctamente en producción.
4. Ha sido validado visualmente.

Hasta que se cumplan las cuatro condiciones, el estado debe permanecer
en `"proximamente"`.

---

## §11 Estrategia de versionado

El campo `version` en el catálogo se incrementa únicamente ante cambios
que rompan compatibilidad con consumidores existentes.

| Tipo de cambio                         | ¿Incrementa versión? |
|----------------------------------------|----------------------|
| Agregar template nuevo                 | no                   |
| Agregar nuevo valor a enum de `estado` | no                   |
| Eliminar template existente            | sí                   |
| Renombrar campo del schema             | sí                   |
| Cambiar tipo de campo existente        | sí                   |
| Cambiar significado de valor enum      | sí                   |

Al incrementar versión:

1. Actualizar el campo `version` en `templates.js`.
2. Actualizar la sección §2 de este documento.
3. Verificar impacto en `AdminPage.jsx` antes de hacer deploy.
4. Documentar el cambio en §12 con descripción de la migración necesaria.

---

## §12 Historial de versiones del contrato

| Versión | Fecha   | Cambios                                                |
|---------|---------|--------------------------------------------------------|
| 1       | 2026-06 | Contrato inicial. Formalización de catálogo existente. |
