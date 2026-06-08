# CONTRATO — Registro de Clientes VELA

Versión del contrato: **1**
Fecha de congelamiento: **2026-06**
Archivo de datos: `data/clientes/index.json`

---

## §1 Propósito del registro

`data/clientes/index.json` es el registro operacional interno de clientes VELA.

Es un artefacto de operación, no una fuente de datos del runtime público.
No debe consumirse desde el runtime público ni exponerse a usuarios finales.

Su propósito es:

- mantener un catálogo interno de clientes activos, históricos y en preparación
- servir como base para operaciones manuales de deploy y seguimiento
- preparar infraestructura para futuros paneles SaaS, onboarding y automatización

No es:

- una base de datos de invitados
- una fuente de configuración de invitaciones (eso vive en `public/clientes/{slug}/config.json`)
- un sistema de analytics o métricas

---

## §2 Versión del contrato

El campo `version` en `index.json` identifica la versión del schema de datos.

Versión actual: `"1"`

La versión de este documento y la versión del campo `version` en `index.json`
deben mantenerse sincronizadas.

---

## §3 Schema de campos

Cada entrada del array `clientes` sigue el siguiente schema:

| Campo               | Tipo                    | Obligatorio  | Descripción                                                                                          |
|---------------------|-------------------------|--------------|------------------------------------------------------------------------------------------------------|
| `slug`              | string                  | ✓ sí         | Identificador único del cliente. Inmutable una vez asignado.                                         |
| `cliente_nombre`    | string                  | recomendado  | Nombre legible del cliente. Presente en todos los registros actuales, pero no validado técnicamente. |
| `plan`              | string \| null          | no           | Plan comercial contratado. `null` en clientes fundacionales.                                         |
| `template`          | string \| null          | no           | Código de template asignado. `null` en clientes fundacionales.                                       |
| `fecha_evento`      | string ISO date \| null | no           | Fecha del evento en formato `YYYY-MM-DD`.                                                            |
| `deploy_estado`     | string (enum)           | ✓ sí         | Estado operacional del cliente. Ver §4.                                                              |
| `creado_en`         | string ISO date         | ✓ sí         | Fecha de creación del registro en formato `YYYY-MM-DD`.                                              |
| `deployed_en`       | string ISO date \| null | no           | Fecha de primer deploy. `null` si aún no fue desplegado.                                             |
| `vence_en`          | string ISO date \| null | no           | Fecha de vencimiento. `null` significa no definido aún.                                              |
| `email_contacto`    | string                  | no           | Email de contacto operacional. No se expone en runtime público.                                      |
| `telefono_contacto` | string                  | no           | Teléfono de contacto operacional. No se expone en runtime público.                                   |
| `notas`             | string                  | no           | Campo libre operacional. No se muestra en frontend.                                                  |

### Notas sobre tipos

- Las fechas ISO date siguen el formato `YYYY-MM-DD` (sin hora).
- Los campos `plan` y `template` admiten `null` explícito — no usar string vacío como sustituto.
- `vence_en: null` significa "vencimiento no definido", no "no vence".

---

## §4 Estados válidos

El campo `deploy_estado` acepta únicamente los siguientes valores:

### `draft`
El cliente está en preparación. La invitación puede no existir aún en producción.

### `deployed`
La invitación está activa y accesible públicamente en Vercel.

### `archived`
El cliente fue dado de baja operacionalmente. La invitación puede seguir técnicamente accesible pero no se considera activa.

---

Las transiciones entre estados no son aplicadas ni validadas por el sistema actualmente.
El campo es informativo y operacional.

---

## §5 — Transiciones de estado y ciclo de vida
Las transiciones entre estados de deploy_estado no son validadas automáticamente por el sistema. Son operaciones manuales que deben seguir el siguiente protocolo:
Transición draft → deployed
Condiciones requeridas:

La carpeta public/clientes/{slug}/ existe en el repositorio.
El archivo config.json está presente y completo.
El archivo de música está presente en la ruta declarada en config.json.
El deploy en Vercel fue exitoso y la URL /{slug} es accesible públicamente.

Al completar la transición:

Actualizar deploy_estado a deployed.
Registrar la fecha en deployed_en.
Verificar que vence_en esté definido si el cliente tiene plan activo.

Transición deployed → archived
Condiciones requeridas:

El cliente fue dado de baja operacionalmente o su período venció.
La decisión de archivar fue tomada explícitamente por el operador.

Al completar la transición:

Actualizar deploy_estado a archived.
La invitación puede seguir técnicamente accesible en Vercel pero no se considera activa.
No eliminar el registro del archivo. Los registros archivados son histórico operativo permanente.

Transición deployed → draft
No permitida. Una invitación desplegada no puede volver a estado borrador. Si se requiere modificar un cliente desplegado, se opera directamente sobre sus archivos sin cambiar el estado a draft.
Transición archived → deployed
Permitida únicamente con justificación operativa explícita en el campo notas. Requiere verificar que la invitación sigue siendo técnicamente accesible antes de reactivar.
Campo vence_en
vence_en: null significa vencimiento no definido, no que el cliente no vence. Para clientes con plan activo, vence_en debe definirse al momento del deploy. La política de qué ocurre al vencer queda pendiente de definición en una fase posterior cuando exista un mecanismo operativo para aplicarla.

---

## §6 Reglas de negocio

- `slug` es único dentro del registro. No puede repetirse entre clientes.
- `slug: "admin"` está reservado por el router frontend y no puede asignarse a ningún cliente.
- Una vez asignado, el `slug` no debe modificarse. Es la clave de todas las rutas del cliente en el sistema.
- `plan: null` y `template: null` son valores válidos para clientes fundacionales. No corregir.
- `notas` es texto libre. No tiene estructura ni formato esperado.
- Los campos `email_contacto` y `telefono_contacto` son datos operacionales internos. No se exponen en ninguna capa del runtime público.

---

## §7 — El slug como identidad central del cliente
El slug es la clave de identidad unificada del cliente a través de todas las capas del sistema. No es únicamente un identificador en el registro: es la clave que conecta tres artefactos independientes que deben mantenerse sincronizados manualmente.
CapaArtefactoRol del slugRegistro internodata/clientes/index.jsonIdentificador del registro operativoConfiguración públicapublic/clientes/{slug}/config.jsonNombre de la carpeta del clienteRuntimeURL /{slug}Ruta pública de la invitación
Estas tres capas no están conectadas por ningún mecanismo automático. Su consistencia depende de disciplina operativa. Si el slug en el registro no coincide con la carpeta en public/clientes/, la invitación no carga. Si la URL no coincide con la carpeta, el cliente no es accesible.
Reglas derivadas de esta propiedad:

El slug debe asignarse antes de crear cualquier otro artefacto del cliente.
Una vez asignado y desplegado, el slug no puede modificarse sin intervención en las tres capas simultáneamente.
El slug es la clave de referencia para cualquier operación de onboarding, actualización o archivo futuro.
Ningún sistema automatizado futuro debe operar sobre un cliente sin validar primero que el slug existe y es consistente en las tres capas.

---


## §8 Relación con el catálogo de templates

El campo `template` en este registro referencia códigos definidos en:

```
data/catalogo/templates.js
```

La relación es declarativa. No existe validación automática entre ambos archivos.

Consideraciones:

- Un cliente puede tener `template: null` — válido para clientes fundacionales.
- Un cliente puede referenciar un template con `estado: "proximamente"` en el catálogo. Esto es válido en el registro pero no implica que el template esté disponible en producción.
- La fuente de verdad de qué templates existen y su estado es `data/catalogo/templates.js`, no este registro.
- Los valores válidos actuales para `template` son los códigos definidos en el catálogo: `S1`, `S2`, `S3`, `P1`, `P2`, `P3`.

---

## §9 Compatibilidad histórica — clientes fundacionales

Los siguientes clientes fueron creados antes de que el contrato SaaS estuviera formalizado:

| slug        | cliente_nombre |
|-------------|----------------|
| `sofia`     | Sofía          |
| `valentina` | Valentina      |
| `andres`    | Andres         |

Estos registros tienen `plan: null` y `template: null`. Esto es correcto e intencional.

El contrato actual los considera válidos. Ninguna versión futura del contrato debe
romper la compatibilidad con estos registros. Las migraciones futuras, si existen,
serán siempre opcionales para clientes fundacionales.

---

## §10 Campos no almacenados

Los siguientes datos nunca deben agregarse a `index.json`:

| Dato                  | Razón                                                                |
|-----------------------|----------------------------------------------------------------------|
| `apps_script_url`     | Dato sensible. Vive en `public/clientes/{slug}/config.json`.         |
| `sheet_id`            | Dato sensible. Vive en `public/clientes/{slug}/config.json`.         |
| Analytics y métricas  | Fuera del scope de este registro.                                    |
| Datos de invitados    | Nunca. Pertenecen a Google Sheets vía Apps Script.                   |
| Tokens o credenciales | Nunca. Este archivo puede quedar expuesto en el repositorio.         |

---

## §11 Estrategia de versionado

El campo `version` en `index.json` se incrementa únicamente ante cambios que
rompan compatibilidad con registros existentes.

| Tipo de cambio                          | ¿Incrementa versión? |
|-----------------------------------------|----------------------|
| Agregar campo nuevo opcional            | no                   |
| Agregar nuevo valor a enum existente    | no                   |
| Eliminar campo existente                | sí                   |
| Renombrar campo existente               | sí                   |
| Cambiar tipo de campo existente         | sí                   |
| Cambiar significado de valor enum       | sí                   |

Al incrementar versión:

1. Actualizar el campo `version` en `index.json`.
2. Actualizar la sección §2 de este documento.
3. Documentar el cambio en §10 con descripción de la migración necesaria.

---

## §12 Historial de versiones del contrato

| Versión | Fecha   | Cambios                                              |
|---------|---------|------------------------------------------------------|
| 1       | 2026-06 | Contrato inicial. Formalización de schema existente. |
