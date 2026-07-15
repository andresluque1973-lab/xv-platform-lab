import { useState, useEffect } from "react";
import { templateRegistry } from "../templates/templateRegistry";

// ─────────────────────────────────────────────────────────────────────────────
// Contrato Ejecutable de Configuración — MAU-1
// Fundacional del Minimum Architecture Upgrade (FASE 20), plan de
// implementación congelado en FASE 21. Prerrequisito técnico resuelto:
// unificación del punto de entrada de carga (los 6 templates consumen este
// hook; ver docs/Fase 21.md).
//
// Nota de acoplamiento (decisión arquitectónica, no accidental):
//   Este hook importa templateRegistry para resolver el template efectivo.
//   Es un acoplamiento deliberado: TemplateLoader.jsx ya depende de
//   templateRegistry para la misma pregunta ("¿este template existe?"),
//   y validación/render deben compartir esa respuesta para no repetir el
//   patrón que motivó el prerrequisito técnico de MAU-1 (rutas paralelas
//   resolviendo lo mismo sin coordinación). Duplicar la regla de fallback
//   aquí, o extraerla a una abstracción nueva de un solo uso, se evaluaron
//   y descartaron — ver docs/Fase 21.md.
//
// Alcance deliberado (aprobado en diseño, no reabrir sin nueva fase):
//   - Contrato exclusivamente estructural: solo detecta ausencia
//     (undefined/null). No valida calidad ni contenido de los datos
//     (ej. cadenas vacías) — eso pertenece a una capa distinta, fuera de
//     MAU-1 tal como quedó definido en FASE 20/21.
//   - Los campos obligatorios se derivan mecánicamente de los accesos
//     directos (sin `?.` ni fallback `||`) presentes en el código real de
//     cada template — no de PRODUCTOS.md ni de ninguna intención declarada.
//   - `sheet_id` se mantiene opcional en las 6 variantes. P1 tiene un acceso
//     sin `||` en ConfirmadosSection que, aplicado en aislamiento, lo haría
//     obligatorio ahí — pero es una inconsistencia interna de un único
//     template, no evidencia de que la plataforma lo requiera. El resto del
//     catálogo lo trata como opcional, y hay clientes reales (sofia,
//     valentina) funcionando hoy sin ese campo. Se documenta como
//     observación técnica, no como regla del contrato.
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = {
  S1: [
    "nombre", "fecha_display", "fecha_larga", "hora", "dia_semana",
    "contador", "confirmacion_limite", "lugar.maps_url", "musica.src",
    "musica.nombre", "regalo.alias", "regalo.cvu", "apps_script_url",
  ],
  S2: [
    "nombre", "subtitulo", "fecha_display", "fecha_larga", "dia_semana",
    "anio", "hora", "contador", "whatsapp_url",
  ],
  S3: [
    "nombre", "titulo", "fecha_display", "subtitulo", "contador",
    "dia_semana", "fecha_larga", "hora", "confirmacion_limite",
    "whatsapp_url", "anio",
  ],
  P1: [
    "nombre", "fecha_display", "subtitulo", "contador", "historia.titulo",
    "historia.cuerpo", "timeline", "anio", "hora", "lugar.nombre",
    "lugar.maps_url", "itinerario", "musica.nombre", "confirmacion_limite",
    "apps_script_url", "fecha_larga", "dia_semana",
  ],
  P2: [
    "nombre", "subtitulo", "fecha_display", "contador", "dia_semana",
    "fecha_larga", "anio", "hora", "confirmacion_limite", "apps_script_url",
    "musica.nombre",
  ],
  P3: [
    "nombre", "titulo", "subtitulo", "contador", "dia_semana",
    "fecha_larga", "hora", "confirmacion_limite", "apps_script_url", "anio",
  ],
};

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

// Solo undefined/null cuentan como campo faltante (alcance estructural,
// no de contenido — ver nota de alcance más arriba).
function validate(data, schema) {
  return schema.filter((path) => {
    const v = getPath(data, path);
    return v === undefined || v === null;
  });
}

/**
 * Carga /clientes/{slug}/config.json y valida su forma contra el Contrato
 * Ejecutable del template resuelto (misma regla de resolución que
 * TemplateLoader — ver templateRegistry).
 * @returns {{ config: object|null, error: string|null }}
 */
export function useConfig(slug = "sofia") {
  const [config, setConfig] = useState(null);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    fetch(`/clientes/${slug}/config.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const resolvedTemplate = templateRegistry[data?.template] ? data.template : "S1";
        const schema  = REQUIRED_FIELDS[resolvedTemplate] ?? REQUIRED_FIELDS.S1;
        const missing = validate(data, schema);

        if (missing.length > 0) {
          const msg = `Config inválido para template '${resolvedTemplate}': faltan campos obligatorios: ${missing.join(", ")}`;
          console.error("[useConfig] Contrato inválido:", msg);
          setConfig(null);
          setError(msg);
          return;
        }

        setConfig(data);
      })
      .catch((err) => {
        console.error("[useConfig] No se pudo cargar config:", err);
        setError(err.message);
      });
  }, [slug]);

  return { config, error };
}
