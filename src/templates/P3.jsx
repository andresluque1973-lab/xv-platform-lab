import { useState, useEffect, useRef } from "react";

import { useCountdown } from "./shared/hooks";

// ─────────────────────────────────────────────────────────────────────────────
// P3.jsx — P3.1
// Familia: Elegante · Variante: PREMIUM
// FASE 18 — tercera y última implementación del catálogo PREMIUM.
//
// COMPATIBILIDAD DE PREVIEW
// En producción: consume config vía window.__VELA_CONFIG__ inyectado
// por el TemplateLoader, o hace fetch directo si el hook está disponible.
// En preview de Claude: usa MOCK_CONFIG definido abajo.
//
// Roles de familia demostrados (pendiente auditoría):
//   Paleta      → Cohesión tonal (Crema dominante, Champagne en EventSection)
//   Tipografía  → Tipografía proporcional (Cormorant Garamond + Inter)
//   Composición → Espacio sin sobrante (ritmo editorial, sin separadores)
//   Movimiento  → Movimiento al servicio (fade + translateY mínimo, invisible)
//
// Criterio arquitectónico de FASE 18 (Alt D — Ritmo editorial, APROBADO):
//   P3 se orienta mediante ritmo editorial y NO mediante delimitación visual.
//   Prohibido en este archivo: líneas divisorias, cards, paneles, cajas,
//   cambios sistemáticos de superficie. Incluye el componente Divider()
//   usado en S3.jsx — deliberadamente NO heredado en P3 (ver nota más abajo).
//
//   Tres mecanismos de orientación, ninguno introduce un organizador nuevo:
//     1. Ancho variable como herramienta narrativa (amplio/estándar/lectura/
//        escaneo/amplio) — el cambio de ancho funciona como cambio de capítulo.
//     2. Agrupación narrativa por diferencial de espaciado vertical —
//        separación moderada dentro de un bloque temático, significativamente
//        mayor entre bloques distintos.
//     3. Titulación editorial como ancla cognitiva — anclaje por aire
//        asimétrico (más arriba que abajo) y tracking generoso, nunca por
//        peso o tamaño agresivo.
//
//   Concepto rector: P3 = organizador visual de S3 + contrato funcional
//   PREMIUM + gramática editorial continua.
//
//   Diferenciador estratégico: P3 no es el PREMIUM más completo.
//   Es el PREMIUM más refinado.
//
//   Criterio de validación (auditoría 18C):
//     Si el recorrido se siente como navegar entre componentes → falló.
//     Si se siente como avanzar a través de capítulos de una misma pieza
//     editorial → exitoso.
//
// NOTA DE DISEÑO — Divider de S3 deliberadamente no heredado:
//   S3.jsx usa un componente Divider() (línea 1px, Taupe, opacity 0.5) entre
//   Hero/Countdown y entre Lugar/Dress code. Bajo el criterio Alt D, ninguna
//   línea divisoria es admisible en P3 como mecanismo sistemático, aunque sea
//   sutil. Se reemplaza por espaciado vertical diferencial. Esto no es una
//   inconsistencia respecto de S3: es la lógica Elegante llevada a sus
//   últimas consecuencias en el contrato PREMIUM. Queda registrado para
//   evaluación futura si el mismo criterio debería aplicarse a S3 (no se
//   modifica S3 en esta fase — "si algo funciona, no se toca").
//
// Paleta oficial VELA — los 5 colores, roles en esta variante:
//   #F8F5EF  Crema      → Campo (superficie dominante, todo el recorrido)
//   #E6D3A8  Champagne  → Superficie secundaria — EventSection y ConfirmSection
//                          únicamente (OBS-S3-001 formalizada como
//                          instanciación válida de Cohesión tonal)
//   #B9A68E  Taupe      → Texto secundario / labels / soporte
//   #8B7355  Mocha      → Jerarquía tipográfica principal / cuerpo narrativo
//   #1A1A1A  Negro      → Acento tipográfico puntual únicamente.
//                          NO existe como bloque estructural ni superficie.
//
// Capacidades PREMIUM adicionales respecto de STANDARD (§4.5 PRODUCTOS.md v2):
//   ✅ HistoriaSection    — narrativa ampliada del agasajado
//   ✅ TimelineSection    — hitos cronológicos
//   ✅ FotosSection       — fotografías integradas (array[string] ordenado)
//   ✅ ItinerarioSection  — secuencia de momentos del evento
//   ✅ ConfirmSection     — formulario integrado (reemplaza WhatsApp)
//   ✅ ConfirmadosSection — listado en tiempo real (polling via Apps Script)
//
// Contrato de datos: §3.4 + §4.5 de PRODUCTOS.md v2.
// Referencia arquitectónica: P1.jsx (FASE 16B).
// Referencia visual: S3.jsx (FASE 15, S3.1).
//
// Infraestructura intacta: templateRegistry, TemplateLoader, useConfig,
// S1, S2, S3, P1, P2.
//
// FASE 18D — refinamiento post-auditoría (acotado, sin reabrir Alt D):
//   1. HeroSection ahora usa ChapterTitle (eyebrow "Bienvenidos" + config.titulo)
//      como prólogo formal — refuerza orientación en la apertura del recorrido.
//   2. Reclasificación funcional Taupe → Mocha en texto informativo (no
//      decorativo): TimelineItem.fecha, dress_code.aclaracion, itinerario.hora.
//      Los eyebrows y labels de formulario permanecen en Taupe (son
//      redundantes/decorativos respecto del contenido que introducen).
//   3. HistoriaSection: maxWidth reducido 34rem→31rem, espaciado entre
//      párrafos aumentado para reducir fatiga de lectura en mobile.
//   Cover deliberadamente NO modificado — pendiente de reevaluación empírica
//   tras este ajuste, por hipótesis de que el vacío percibido podía deberse
//   a la transición Cover→Hero sin ancla, no al Cover en sí mismo.
// ─────────────────────────────────────────────────────────────────────────────

// ── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  crema:     "#F8F5EF",
  negro:     "#1A1A1A",
  mocha:     "#8B7355",
  taupe:     "#B9A68E",
  champagne: "#E6D3A8",
};

// ── Mock de datos para preview ────────────────────────────────────────────────
const MOCK_CONFIG = {
  // STANDARD
  nombre:              "Valentina",
  titulo:              "Mis XV",
  subtitulo:           "Quiero que seas parte de este momento",
  fecha_display:       "Sábado 15 · Agosto · 2026",
  fecha_larga:         "15 de agosto",
  dia_semana:          "Sábado",
  anio:                "2026",
  hora:                "21:00 hs",
  contador:            "2026-08-15T21:00:00",
  confirmacion_limite: "1 de agosto",
  lugar: {
    nombre:   "Espacio 1805",
    maps_url: "#",
  },
  dress_code: {
    descripcion: "Formal",
    aclaracion:  "Evitar zapatillas deportivas",
  },
  musica: {
    src:    "/clientes/prueba/musica.mp3",
    nombre: "Taylor Swift — Cruel Summer",
  },
  regalo: {
    alias: "valentina.mp",
    cvu:   "0000003100086337366028",
  },
  // PREMIUM adicionales (§4.5)
  historia: {
    titulo: "Nuestra Valentina",
    cuerpo:
      "Hace quince años llegaste a iluminar cada rincón de nuestra familia.\n\nDesde el primer día supiste cómo llenar los espacios con tu risa, tu curiosidad y esa forma tan tuya de ver el mundo.\n\nHoy, al verte convertida en la joven increíble que sos, solo podemos estar agradecidos por cada momento compartido.",
  },
  timeline: [
    { fecha: "2009",     texto: "Llegaste al mundo y todo cambió para siempre." },
    { fecha: "2013",     texto: "Tus primeros pasos de danza — ya sabíamos que el escenario te pertenecía." },
    { fecha: "2017",     texto: "Viaje a Bariloche con la familia. Nevó por primera vez." },
    { fecha: "2021",     texto: "Comenzaste el secundario. Nuevos amigos, nuevas historias." },
    { fecha: "Este año", texto: "Tus XV. El comienzo de la mejor etapa." },
  ],
  fotos: [
    "/clientes/prueba/foto1.jpg",
    "/clientes/prueba/foto2.jpg",
    "/clientes/prueba/foto3.jpg",
    "/clientes/prueba/foto4.jpg",
  ],
  itinerario: [
    { hora: "21:00", descripcion: "Recepción de invitados" },
    { hora: "21:30", descripcion: "Ingreso de la festejada" },
    { hora: "22:00", descripcion: "Vals y baile de honor" },
    { hora: "22:30", descripcion: "Cena" },
    { hora: "00:00", descripcion: "Torta y brindis" },
    { hora: "00:30", descripcion: "Pista de baile" },
  ],
  apps_script_url: "https://script.google.com/macros/s/PLACEHOLDER/exec",
  sheet_id:        "PLACEHOLDER_SHEET_ID",
};

// ── Compatibilidad producción / preview ───────────────────────────────────────
function useConfigCompat(slug) {
  const [config, setConfig] = useState(null);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    if (window.__VELA_CONFIG__) {
      setConfig(window.__VELA_CONFIG__);
      return;
    }
    fetch(`/clientes/${slug}/config.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setConfig)
      .catch(() => setConfig(MOCK_CONFIG));
  }, [slug]);

  return { config, error };
}

// ── Animación de entrada — movimiento al servicio ─────────────────────────────
// opacity + translateY mínimo. Sin cubic-bezier de carácter. El movimiento
// no debe notarse: su única función es la aparición ordenada del contenido.
function useEntered(delay = 0) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, []);
  return vis;
}

// ── Utilidad: titulación editorial ────────────────────────────────────────────
// Ancla cognitiva del recorrido. Anclaje por aire asimétrico (más arriba que
// abajo) y tracking generoso — nunca por peso o tamaño agresivo. El título
// pertenece a lo que introduce, no a lo que cierra.
function ChapterTitle({ eyebrow, children, color = C.mocha }) {
  return (
    <div style={{ marginTop: "clamp(0.5rem, 1vw, 1rem)", marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
      {eyebrow && (
        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          fontWeight:    500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color:         C.taupe,
          marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
        }}>{eyebrow}</p>
      )}
      <h2 style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(2rem, 4.5vw, 3.2rem)",
        fontWeight:    300,
        lineHeight:    1.1,
        letterSpacing: "0.015em",
        color,
        margin:        0,
      }}>{children}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover
// Fuente directa: S3.jsx Cover. Sin modificaciones — la entrada Elegante ya
// está completamente resuelta en la variante STANDARD.
// ─────────────────────────────────────────────────────────────────────────────
function Cover({ config, onEnter }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight:      "100svh",
      background:     C.crema,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "clamp(3rem, 8vw, 6rem) clamp(2rem, 6vw, 4rem)",
      textAlign:      "center",
      opacity:        visible ? 1 : 0,
      transition:     "opacity 0.8s ease",
    }}>
      <h1 style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(4rem, 14vw, 9rem)",
        fontWeight:    300,
        lineHeight:    0.92,
        letterSpacing: "0.01em",
        color:         C.mocha,
        marginBottom:  "clamp(1.5rem, 3vw, 2.5rem)",
      }}>
        {config.nombre}
      </h1>

      <p style={{
        fontFamily:    "'Inter', sans-serif",
        fontSize:      "clamp(0.6rem, 1.1vw, 0.75rem)",
        fontWeight:    400,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color:         C.taupe,
        marginBottom:  "clamp(0.5rem, 1vw, 0.75rem)",
      }}>
        {config.titulo}
      </p>

      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(0.95rem, 1.8vw, 1.15rem)",
        fontWeight:    400,
        letterSpacing: "0.08em",
        color:         C.negro,
        marginBottom:  "clamp(3rem, 7vw, 5rem)",
      }}>
        {config.fecha_display}
      </p>

      <button
        onClick={onEnter}
        style={{
          fontFamily:     "'Inter', sans-serif",
          fontSize:       "clamp(0.6rem, 1vw, 0.7rem)",
          fontWeight:     500,
          letterSpacing:  "0.2em",
          textTransform:  "uppercase",
          background:     "transparent",
          color:          C.mocha,
          border:         `1px solid ${C.taupe}`,
          padding:        "0.9em 2.5em",
          cursor:         "pointer",
          transition:     "border-color 0.3s, color 0.3s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = C.mocha;
          e.currentTarget.style.color = C.negro;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = C.taupe;
          e.currentTarget.style.color = C.mocha;
        }}
      >
        Ver invitación
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection — nombre + subtítulo + countdown
// Ancho: amplio (capítulo de apertura). Fuente directa: S3.jsx, sin Divider —
// el espacio entre subtítulo y countdown reemplaza la línea divisoria por
// diferencial de espaciado vertical (mecanismo 2: agrupación narrativa).
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const { days, hours, minutes, seconds } = useCountdown(config.contador);

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(5rem, 12vw, 9rem) clamp(2rem, 6vw, 4rem)",
      textAlign:  "center",
    }}>
      <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="Bienvenidos" color={C.negro}>
          {config.titulo}
        </ChapterTitle>

        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(1rem, 2vw, 1.3rem)",
          fontWeight:    300,
          fontStyle:     "italic",
          letterSpacing: "0.05em",
          color:         C.taupe,
          marginBottom:  "clamp(5rem, 10vw, 8rem)",
          maxWidth:      "30rem",
          margin:        "0 auto clamp(5rem, 10vw, 8rem)",
          lineHeight:    1.6,
        }}>
          {config.subtitulo}
        </p>

        <div style={{
          display:        "flex",
          justifyContent: "center",
          gap:            "clamp(2rem, 5vw, 4rem)",
          flexWrap:       "wrap",
        }}>
          {[
            { value: days,    label: "días"     },
            { value: hours,   label: "horas"    },
            { value: minutes, label: "minutos"  },
            { value: seconds, label: "segundos" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center", minWidth: "3.5rem" }}>
              <p style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(2.5rem, 6vw, 4rem)",
                fontWeight:    300,
                lineHeight:    1,
                color:         C.negro,
                letterSpacing: "-0.02em",
              }}>
                {String(value).padStart(2, "0")}
              </p>
              <p style={{
                fontFamily:    "'Inter', sans-serif",
                fontSize:      "clamp(0.5rem, 0.8vw, 0.6rem)",
                fontWeight:    400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         C.taupe,
                marginTop:     "0.5rem",
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HistoriaSection — narrativa ampliada
// Ancho: lectura (columna angosta, densidad de lectura controlada).
// Bloque narrativo A junto con TimelineSection — espaciado moderado entre
// ambas, significativamente mayor antes/después del bloque.
// ─────────────────────────────────────────────────────────────────────────────
function HistoriaSection({ config }) {
  const vis = useEntered(150);
  if (!config.historia) return null;

  const parrafos = (config.historia.cuerpo || "").split("\n\n").filter(Boolean);

  return (
    <section style={{
      background:    C.crema,
      paddingTop:    "clamp(6rem, 12vw, 10rem)",
      paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
      paddingLeft:   "clamp(2rem, 6vw, 4rem)",
      paddingRight:  "clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "31rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="Historia" color={C.negro}>
          {config.historia.titulo || "Su historia"}
        </ChapterTitle>

        {parrafos.map((p, i) => (
          <p key={i} style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(1rem, 1.8vw, 1.2rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.02em",
            lineHeight:    1.85,
            marginBottom:  i < parrafos.length - 1 ? "clamp(1.75rem, 3.5vw, 2.5rem)" : 0,
            opacity:       vis ? 1 : 0,
            transform:     vis ? "translateY(0)" : "translateY(12px)",
            transition:    `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`,
          }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineSection — hitos cronológicos
// Ancho: intermedio (escaneo vertical cómodo). Cierra el bloque narrativo A
// junto con HistoriaSection. Espaciado moderado respecto de Historia
// (continuidad temática); el siguiente bloque (Fotos) recibe espaciado mayor.
// ─────────────────────────────────────────────────────────────────────────────
function TimelineSection({ config }) {
  if (!config.timeline?.length) return null;

  return (
    <section style={{
      background:    C.crema,
      paddingTop:    "clamp(2.5rem, 5vw, 4rem)",
      paddingBottom: "clamp(6rem, 12vw, 10rem)",
      paddingLeft:   "clamp(2rem, 6vw, 4rem)",
      paddingRight:  "clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "38rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="Línea de tiempo" color={C.negro}>
          Momentos que la trajeron hasta hoy
        </ChapterTitle>

        <div>
          {config.timeline.map((item, i) => (
            <TimelineItem
              key={i}
              item={item}
              index={i}
              last={i === config.timeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index, last }) {
  const vis = useEntered(index * 90);

  return (
    <div style={{
      display:      "grid",
      gridTemplateColumns: "clamp(4.5rem, 10vw, 6.5rem) 1fr",
      gap:          "clamp(1rem, 3vw, 2rem)",
      marginBottom: last ? 0 : "clamp(1.75rem, 3.5vw, 2.5rem)",
      opacity:      vis ? 1 : 0,
      transform:    vis ? "translateY(0)" : "translateY(10px)",
      transition:   "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(0.95rem, 1.7vw, 1.1rem)",
        fontWeight:    400,
        color:         C.mocha,
        letterSpacing: "0.04em",
        lineHeight:    1.7,
        textAlign:     "right",
      }}>{item.fecha}</p>
      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(0.95rem, 1.7vw, 1.1rem)",
        fontWeight:    300,
        color:         C.mocha,
        letterSpacing: "0.02em",
        lineHeight:    1.7,
      }}>{item.texto}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FotosSection — galería integrada
// Ancho: amplio (recuperación de respiración tras dos secciones de lectura
// angosta). Bloque narrativo B, autónomo — espaciado generoso antes y después.
// ─────────────────────────────────────────────────────────────────────────────
function FotosSection({ config }) {
  if (!config.fotos?.length) return null;

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(6rem, 12vw, 10rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="Momentos" color={C.negro}>
          Algunas fotografías
        </ChapterTitle>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(10rem, 26vw, 15rem), 1fr))",
          gap:                 "clamp(0.75rem, 1.75vw, 1.25rem)",
        }}>
          {config.fotos.map((src, i) => (
            <div key={i} style={{
              aspectRatio: "3 / 4",
              overflow:    "hidden",
              background:  C.champagne,
            }}>
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  display:    "block",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.025)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                onError={e => {
                  e.currentTarget.parentElement.style.background = C.taupe + "33";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventSection — lugar + hora + dress code
// Fuente directa: S3.jsx EventSection. Champagne como superficie de sección
// (OBS-S3-001 formalizada como instanciación válida de Cohesión tonal en
// Elegante PREMIUM). Ancho: estándar. Sin Divider — espaciado vertical entre
// Lugar y Dress code en su lugar.
// ─────────────────────────────────────────────────────────────────────────────
function EventSection({ config }) {
  return (
    <section style={{
      background: C.champagne,
      padding:    "clamp(6rem, 12vw, 9rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="El evento" color={C.negro}>
          {config.lugar?.nombre}
        </ChapterTitle>

        <div style={{ marginBottom: "clamp(3.5rem, 7vw, 5.5rem)" }}>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.8rem, 1.4vw, 0.95rem)",
            fontWeight:    400,
            color:         C.mocha,
            letterSpacing: "0.04em",
            marginBottom:  "1rem",
          }}>
            {config.dia_semana} {config.fecha_larga} · {config.hora}
          </p>
          {config.lugar?.maps_url && config.lugar.maps_url !== "#" && (
            <a
              href={config.lugar.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:     "'Inter', sans-serif",
                fontSize:       "clamp(0.55rem, 0.9vw, 0.65rem)",
                fontWeight:     500,
                letterSpacing:  "0.2em",
                textTransform:  "uppercase",
                color:          C.taupe,
                textDecoration: "none",
                borderBottom:   `1px solid ${C.taupe}`,
                paddingBottom:  "0.1em",
                transition:     "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = C.mocha;
                e.currentTarget.style.borderColor = C.mocha;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = C.taupe;
                e.currentTarget.style.borderColor = C.taupe;
              }}
            >
              Ver en mapa
            </a>
          )}
        </div>

        {config.dress_code && (
          <div>
            <p style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
              fontWeight:    500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         C.taupe,
              marginBottom:  "0.75rem",
            }}>Dress code</p>
            <p style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight:    400,
              color:         C.negro,
              letterSpacing: "0.03em",
              marginBottom:  "0.4rem",
            }}>
              {config.dress_code.descripcion}
            </p>
            {config.dress_code.aclaracion && (
              <p style={{
                fontFamily:    "'Inter', sans-serif",
                fontSize:      "clamp(0.75rem, 1.3vw, 0.88rem)",
                fontWeight:    400,
                color:         C.mocha,
                letterSpacing: "0.03em",
                fontStyle:     "italic",
              }}>
                {config.dress_code.aclaracion}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ItinerarioSection — secuencia del evento
// Ancho: estándar. Bloque narrativo C, junto con ConfirmSection y
// ConfirmadosSection — las tres secciones funcionales de cierre.
// Sin franja Negro de quiebre (a diferencia de P2): el título editorial
// cumple la función de ancla sin introducir bloque estructural.
// ─────────────────────────────────────────────────────────────────────────────
function ItinerarioSection({ config }) {
  if (!config.itinerario?.length) return null;

  return (
    <section style={{
      background:    C.crema,
      paddingTop:    "clamp(6rem, 12vw, 10rem)",
      paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
      paddingLeft:   "clamp(2rem, 6vw, 4rem)",
      paddingRight:  "clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="La noche" color={C.negro}>
          Cómo va a transcurrir
        </ChapterTitle>

        <div>
          {config.itinerario.map((item, i) => (
            <div key={i} style={{
              display:      "grid",
              gridTemplateColumns: "clamp(3.5rem, 8vw, 5rem) 1fr",
              gap:          "clamp(1rem, 2.5vw, 2rem)",
              marginBottom: i < config.itinerario.length - 1 ? "clamp(1.1rem, 2.2vw, 1.6rem)" : 0,
            }}>
              <p style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(0.95rem, 1.7vw, 1.1rem)",
                fontWeight:    400,
                color:         C.mocha,
                letterSpacing: "0.03em",
                lineHeight:    1.7,
              }}>{item.hora}</p>
              <p style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(0.95rem, 1.7vw, 1.1rem)",
                fontWeight:    300,
                color:         C.mocha,
                letterSpacing: "0.02em",
                lineHeight:    1.7,
              }}>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MusicSection — reproductor mínimo
// Fuente directa: S3.jsx MusicSection. Sin modificaciones.
// ─────────────────────────────────────────────────────────────────────────────
function MusicSection({ config, playing, onToggle }) {
  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(3rem, 7vw, 5rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{
        maxWidth:       "36rem",
        margin:         "0 auto",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            "1.5rem",
        flexWrap:       "wrap",
      }}>
        <div>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
            fontWeight:    500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         C.taupe,
            marginBottom:  "0.4rem",
          }}>Música del evento</p>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.7vw, 1.1rem)",
            fontWeight:    400,
            color:         C.mocha,
            letterSpacing: "0.03em",
          }}>
            {config.musica?.nombre}
          </p>
        </div>
        <button
          onClick={onToggle}
          style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
            fontWeight:    500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background:    "transparent",
            color:         playing ? C.mocha : C.taupe,
            border:        `1px solid ${playing ? C.mocha : C.taupe}`,
            padding:       "0.7em 1.6em",
            cursor:        "pointer",
            flexShrink:    0,
            transition:    "color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = C.negro;
            e.currentTarget.style.borderColor = C.negro;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = playing ? C.mocha : C.taupe;
            e.currentTarget.style.borderColor = playing ? C.mocha : C.taupe;
          }}
        >
          {playing ? "Pausar" : "Reproducir"}
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GiftsSection — alias y CVU con modal
// Fuente directa: S3.jsx GiftsSection. Sin modificaciones.
// ─────────────────────────────────────────────────────────────────────────────
function GiftsSection({ config }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(26,26,26,0.55)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            zIndex:         100,
            padding:        "1.5rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.crema,
              padding:    "clamp(2rem, 5vw, 3.5rem)",
              maxWidth:   "26rem",
              width:      "100%",
              position:   "relative",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position:      "absolute",
                top:           "1.25rem",
                right:         "1.25rem",
                background:    "transparent",
                border:        "none",
                cursor:        "pointer",
                color:         C.taupe,
                fontFamily:    "'Inter', sans-serif",
                fontSize:      "0.8rem",
                letterSpacing: "0.1em",
              }}
            >
              ✕
            </button>
            <p style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
              fontWeight:    500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         C.taupe,
              marginBottom:  "1.5rem",
            }}>Datos de transferencia</p>
            <p style={{
              fontFamily:   "'Cormorant Garamond', serif",
              fontSize:     "clamp(1.4rem, 3vw, 2rem)",
              fontWeight:   400,
              color:        C.negro,
              marginBottom: "0.4rem",
            }}>
              {config.regalo?.alias}
            </p>
            <p style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      "clamp(0.7rem, 1.2vw, 0.82rem)",
              fontWeight:    400,
              color:         C.taupe,
              letterSpacing: "0.04em",
              wordBreak:     "break-all",
            }}>
              CVU {config.regalo?.cvu}
            </p>
          </div>
        </div>
      )}

      <section style={{
        background: C.crema,
        padding:    "clamp(4rem, 10vw, 7rem) clamp(2rem, 6vw, 4rem)",
      }}>
        <div style={{
          maxWidth:       "36rem",
          margin:         "0 auto",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "2rem",
          flexWrap:       "wrap",
        }}>
          <div>
            <p style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
              fontWeight:    500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         C.taupe,
              marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
            }}>Regalos</p>
            <p style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(1rem, 1.8vw, 1.2rem)",
              fontWeight:    300,
              color:         C.mocha,
              letterSpacing: "0.04em",
              lineHeight:    1.6,
              maxWidth:      "22rem",
            }}>
              Tu presencia es lo que más importa. Si querés hacerme un regalo, podés hacerlo por transferencia.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background:    "transparent",
              color:         C.mocha,
              border:        `1px solid ${C.taupe}`,
              padding:       "0.85em 2em",
              cursor:        "pointer",
              flexShrink:    0,
              transition:    "border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.mocha;
              e.currentTarget.style.color = C.negro;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.taupe;
              e.currentTarget.style.color = C.mocha;
            }}
          >
            Ver datos
          </button>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSection — formulario integrado (reemplaza WhatsApp, capacidad PREMIUM)
// Estilo de formulario inspirado funcionalmente en P2.jsx, reinstanciado en
// clave Elegante: inputs sin caja, borde inferior sutil, sin Bebas Neue ni
// bloque Negro. Ancho: estándar. Apertura del bloque narrativo C de cierre.
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  const [nombre,      setNombre]      = useState("");
  const [asistencia,  setAsistencia]  = useState("");
  const [restriccion, setRestriccion] = useState("");
  const [enviado,     setEnviado]     = useState(false);
  const [enviando,    setEnviando]    = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async () => {
    if (!nombre.trim() || !asistencia) {
      setError("Completá tu nombre y confirmá asistencia.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const url = new URL(config.apps_script_url);
      url.searchParams.set("nombre",      nombre.trim());
      url.searchParams.set("asistencia",  asistencia);
      url.searchParams.set("restriccion", restriccion.trim() || "Ninguna");
      url.searchParams.set("sheet_id",    config.sheet_id || "");
      await fetch(url.toString(), { method: "GET", mode: "no-cors" });
      setEnviado(true);
    } catch {
      setError("Hubo un problema. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <section style={{
        background:    C.champagne,
        paddingTop:    "clamp(6rem, 12vw, 9rem)",
        paddingBottom: "clamp(6rem, 12vw, 9rem)",
        paddingLeft:   "clamp(2rem, 6vw, 4rem)",
        paddingRight:  "clamp(2rem, 6vw, 4rem)",
      }}>
        <div style={{ maxWidth: "32rem", margin: "0 auto", textAlign: "center" }}>
          <ChapterTitle eyebrow="Confirmación recibida" color={C.negro}>
            Gracias, {nombre}
          </ChapterTitle>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.8rem, 1.4vw, 0.9rem)",
            fontWeight:    400,
            color:         C.mocha,
            letterSpacing: "0.03em",
            lineHeight:    1.7,
          }}>Tu confirmación quedó registrada. Nos vemos en la fiesta.</p>
        </div>
      </section>
    );
  }

  const inputStyle = {
    width:         "100%",
    background:    "transparent",
    border:        "none",
    borderBottom:  `1px solid ${C.taupe}66`,
    padding:       "0.65rem 0",
    fontFamily:    "'Cormorant Garamond', serif",
    fontSize:      "clamp(0.95rem, 1.6vw, 1.1rem)",
    fontWeight:    300,
    color:         C.negro,
    letterSpacing: "0.02em",
    outline:       "none",
    transition:    "border-color 0.2s",
  };

  return (
    <section style={{
      background:    C.champagne,
      paddingTop:    "clamp(6rem, 12vw, 9rem)",
      paddingBottom: "clamp(6rem, 12vw, 9rem)",
      paddingLeft:   "clamp(2rem, 6vw, 4rem)",
      paddingRight:  "clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "32rem", margin: "0 auto" }}>
        <ChapterTitle eyebrow="Confirmá tu asistencia" color={C.negro}>
          Antes del {config.confirmacion_limite}
        </ChapterTitle>

        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      "clamp(0.8rem, 1.4vw, 0.9rem)",
          fontWeight:    400,
          color:         C.mocha,
          letterSpacing: "0.03em",
          lineHeight:    1.7,
          marginBottom:  "clamp(2.5rem, 5vw, 3.5rem)",
        }}>Necesito saber si vas a poder acompañarme en esta noche.</p>

        <div style={{ marginBottom: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.55rem, 0.85vw, 0.62rem)",
            fontWeight:    500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         C.taupe,
            marginBottom:  "0.6rem",
          }}>Nombre y apellido</p>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderBottomColor = C.mocha}
            onBlur={e  => e.currentTarget.style.borderBottomColor = `${C.taupe}66`}
          />
        </div>

        <div style={{ marginBottom: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.55rem, 0.85vw, 0.62rem)",
            fontWeight:    500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         C.taupe,
            marginBottom:  "clamp(0.75rem, 1.5vw, 1.1rem)",
          }}>¿Asistís?</p>
          <div style={{ display: "flex", gap: "clamp(1rem, 2.5vw, 2rem)" }}>
            {["Sí, voy a estar", "No voy a poder"].map(opcion => (
              <label key={opcion} style={{
                display:    "flex",
                alignItems: "center",
                gap:        "0.5rem",
                cursor:     "pointer",
              }}>
                <input
                  type="radio"
                  name="asistencia"
                  value={opcion}
                  checked={asistencia === opcion}
                  onChange={() => setAsistencia(opcion)}
                  style={{ accentColor: C.mocha, width: "0.85rem", height: "0.85rem" }}
                />
                <span style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "clamp(0.9rem, 1.5vw, 1.05rem)",
                  fontWeight:    300,
                  color:         asistencia === opcion ? C.negro : C.mocha,
                  letterSpacing: "0.02em",
                  transition:    "color 0.2s",
                }}>{opcion}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "clamp(2.25rem, 4.5vw, 3.25rem)" }}>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.55rem, 0.85vw, 0.62rem)",
            fontWeight:    500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         C.taupe,
            marginBottom:  "0.6rem",
          }}>Restricción alimentaria (opcional)</p>
          <input
            type="text"
            value={restriccion}
            onChange={e => setRestriccion(e.target.value)}
            placeholder="Vegetariano, celíaco, etc."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderBottomColor = C.mocha}
            onBlur={e  => e.currentTarget.style.borderBottomColor = `${C.taupe}66`}
          />
        </div>

        {error && (
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.75rem, 1.2vw, 0.85rem)",
            fontWeight:    400,
            color:         "#9B5142",
            letterSpacing: "0.02em",
            marginBottom:  "1.25rem",
          }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={enviando}
          style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      "clamp(0.6rem, 1vw, 0.7rem)",
            fontWeight:    500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background:    "transparent",
            color:         C.negro,
            border:        `1px solid ${C.negro}`,
            padding:       "0.9em 2.5em",
            cursor:        enviando ? "wait" : "pointer",
            transition:    "background 0.3s, color 0.3s",
          }}
          onMouseEnter={e => {
            if (enviando) return;
            e.currentTarget.style.background = C.negro;
            e.currentTarget.style.color = C.crema;
          }}
          onMouseLeave={e => {
            if (enviando) return;
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = C.negro;
          }}
        >
          {enviando ? "Enviando..." : "Confirmar asistencia"}
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmadosSection
// Listado en tiempo real via polling Apps Script.
// Fuente funcional: P1.jsx / P2.jsx ConfirmadosSection, reinstanciado en clave
// Elegante: sin header de bloque, sin franja de color, sin grilla de tarjetas
// con borde marcado — lista editorial simple, separada por espacio.
// OBS-P1-001 heredada: candidata a migrar a herramienta admin en fases futuras.
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmadosSection({ config }) {
  const [confirmados, setConfirmados] = useState([]);
  const [cargando,    setCargando]    = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const url = new URL(config.apps_script_url);
        url.searchParams.set("action",   "getConfirmados");
        url.searchParams.set("sheet_id", config.sheet_id || "");
        const res  = await fetch(url.toString());
        const data = await res.json();
        setConfirmados(Array.isArray(data) ? data : []);
      } catch {
        setConfirmados([]);
      } finally {
        setCargando(false);
      }
    };
    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, [config.apps_script_url, config.sheet_id]);

  const van = confirmados.filter(c => c.asistencia === "Sí, voy a estar");

  return (
    <section style={{
      background:    C.crema,
      paddingTop:    "clamp(5rem, 10vw, 8rem)",
      paddingBottom: "clamp(6rem, 12vw, 10rem)",
      paddingLeft:   "clamp(2rem, 6vw, 4rem)",
      paddingRight:  "clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
        <ChapterTitle
          eyebrow={!cargando ? `${van.length} confirmados` : undefined}
          color={C.negro}
        >
          Quiénes ya confirmaron
        </ChapterTitle>

        {cargando ? (
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.5vw, 1.05rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.03em",
          }}>Cargando confirmaciones...</p>
        ) : van.length === 0 ? (
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.5vw, 1.05rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.03em",
          }}>Aún no hay confirmaciones.</p>
        ) : (
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(9rem, 24vw, 13rem), 1fr))",
            gap:                 "clamp(0.6rem, 1.5vw, 1rem)",
          }}>
            {van.map((c, i) => (
              <p key={i} style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(0.95rem, 1.6vw, 1.1rem)",
                fontWeight:    300,
                color:         C.mocha,
                letterSpacing: "0.02em",
                margin:        0,
              }}>{c.nombre}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// Adaptado de S3.jsx — se removió el borderTop de 1px que S3 usa como
// separador hacia el footer. Bajo el criterio Alt D ningún divisor sistemático
// es admisible en P3, ni siquiera heredado. El cierre del recorrido se marca
// con padding superior generoso, no con una línea.
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ config }) {
  return (
    <footer style={{
      background:     C.crema,
      paddingTop:     "clamp(4rem, 8vw, 6rem)",
      paddingBottom:  "clamp(2rem, 4vw, 3rem)",
      paddingLeft:    "clamp(2rem, 6vw, 4rem)",
      paddingRight:   "clamp(2rem, 6vw, 4rem)",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      gap:            "1rem",
      flexWrap:       "wrap",
    }}>
      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(1rem, 2.5vw, 1.5rem)",
        fontWeight:    300,
        letterSpacing: "0.08em",
        color:         C.mocha,
        margin:        0,
      }}>
        {config.nombre}
      </p>
      <p style={{
        fontFamily:    "'Inter', sans-serif",
        fontSize:      "clamp(0.5rem, 0.85vw, 0.62rem)",
        fontWeight:    400,
        letterSpacing: "0.18em",
        color:         C.taupe,
        textTransform: "uppercase",
      }}>
        {config.anio} · VELA
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// P3 — Root
// Orden de secciones y gramática editorial:
//
//   Cover               → ancho amplio (entrada)
//   HeroSection         → ancho amplio
//   ─── Bloque narrativo A (espaciado interno moderado) ───
//   HistoriaSection     → ancho lectura
//   TimelineSection     → ancho intermedio
//   ─── Bloque narrativo B ───
//   FotosSection        → ancho amplio
//   ─── Bloque funcional (espaciado interno moderado) ───
//   EventSection        → ancho estándar · superficie Champagne
//   ItinerarioSection   → ancho estándar
//   MusicSection        → ancho estándar
//   GiftsSection        → ancho estándar
//   ConfirmSection      → ancho estándar · superficie Champagne
//   ConfirmadosSection  → ancho estándar
//   ─── Cierre ───
//   Footer
//
// La separación entre bloques se resuelve mediante padding vertical mayor
// en la primera sección del bloque siguiente (mecanismo 2 del criterio
// arquitectónico de FASE 18), nunca mediante un divisor visual.
// ─────────────────────────────────────────────────────────────────────────────
export default function P3() {
  const slug = typeof window !== "undefined"
    ? window.location.pathname.split("/")[1] || "prueba"
    : "prueba";

  const { config } = useConfigCompat(slug);

  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.4;
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 800);
  };

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play().catch(() => {}); setPlaying(true); }
  };

  if (!config) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.crema}; }
        input::placeholder { color: ${C.taupe}77; }
        input[type="radio"] { width: 0.85rem; height: 0.85rem; }
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        <source src={config.musica?.src} type="audio/mpeg" />
      </audio>

      {!entered && <Cover config={config} onEnter={handleEnter} />}

      {entered && (
        <main>
          <HeroSection        config={config} />
          <HistoriaSection    config={config} />
          <TimelineSection    config={config} />
          <FotosSection       config={config} />
          <EventSection       config={config} />
          <ItinerarioSection  config={config} />
          <MusicSection       config={config} playing={playing} onToggle={handleToggle} />
          <GiftsSection       config={config} />
          <ConfirmSection     config={config} />
          <ConfirmadosSection config={config} />
          <Footer             config={config} />
        </main>
      )}
    </>
  );
}
