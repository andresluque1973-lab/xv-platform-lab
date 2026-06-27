import { useState, useEffect, useRef } from "react";

import { useCountdown } from "./shared/hooks";

// ─────────────────────────────────────────────────────────────────────────────
// P1.jsx — P1.1
// Familia: Emotiva · Variante: PREMIUM
// FASE 16B — primera implementación del catálogo PREMIUM.
//
// COMPATIBILIDAD DE PREVIEW
// En producción: consume config vía window.__VELA_CONFIG__ inyectado
// por el TemplateLoader, o hace fetch directo si el hook está disponible.
// En preview de Claude: usa MOCK_CONFIG definido abajo.
//
// Roles demostrados (pendiente auditoría FASE 16C):
//   Paleta      → Luz emocional (Champagne como foco sobre campo cálido profundo)
//   Tipografía  → Ninguno positivo — restricción: ningún nivel opera en modo Estructura
//   Composición → Continuidad atmosférica (gradiente térmico descendente sin quiebres)
//   Movimiento  → Asentamiento emocional (translateY + opacity con permanencia)
//
// Paleta oficial VELA — los 5 colores, roles en esta variante:
//   #F8F5EF  Crema      → Luz emergente (texto principal, acentos luminosos)
//   #B9A68E  Taupe      → Campo medio / texto secundario
//   #8B7355  Mocha      → Profundidad cálida (fondo dominante en secciones oscuras)
//   #1A1A1A  Negro      → Solo acento tipográfico — prohibido como elemento estructural
//   #E6D3A8  Champagne  → Foco de Luz emocional (títulos principales, detalles cálidos)
//
// Decisión de instanciación aprobada (FASE 16B):
//   P1 es oscuro con luz emergente. S3 es claro con refinamiento tonal.
//   Son estructuras inversas dentro de la misma paleta.
//   Si durante auditoría P1 y S3 se perciben como la misma familia estética,
//   P1 requiere ajuste de instanciación (criterio de validación cerrado FASE 16B).
//
// Capacidades PREMIUM adicionales respecto de STANDARD:
//   ✅ HistoriaSection   — narrativa ampliada del agasajado
//   ✅ TimelineSection   — hitos cronológicos
//   ✅ FotosSection      — fotografías integradas (array[string] ordenado)
//   ✅ ItinerarioSection — secuencia de momentos del evento
//   ✅ ConfirmSection    — formulario integrado (reemplaza WhatsApp)
//   ✅ ConfirmadosSection— listado en tiempo real (polling via Apps Script)
//
// Contrato de datos: §3.4 + §4.5 de PRODUCTOS.md v2.
//
// Infraestructura intacta: templateRegistry, TemplateLoader, useConfig, S1, S2, S3.
// ─────────────────────────────────────────────────────────────────────────────

// ── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  crema:     "#F8F5EF",
  taupe:     "#B9A68E",
  mocha:     "#8B7355",
  negro:     "#1A1A1A",
  champagne: "#E6D3A8",
};

// ── Gradientes térmicos — campo cálido profundo ───────────────────────────────
// Emotiva: profundidad oscura de la que emerge la luz (Champagne/Crema).
// Estructura invertida respecto de S3 (superficie clara dominante).
const G = {
  // Fondo base de la invitación: oscuro cálido descendente
  base:    `linear-gradient(170deg, ${C.mocha} 0%, #6b5544 40%, #4a3428 75%, #2e1f16 100%)`,
  // Cover: atmósfera intensa, máxima profundidad
  cover:   `linear-gradient(150deg, #5a3d2b 0%, #3d2518 50%, #1e100a 100%)`,
  // Secciones claras intercaladas: respiración dentro de la atmósfera
  claro:   `linear-gradient(180deg, #4a3428 0%, #3d2a1e 100%)`,
  // Secciones de acento lumínico: Champagne como fuente de calor
  acento:  `linear-gradient(160deg, #6b5030 0%, #8b6940 50%, #6b5030 100%)`,
  // Hero: punto de máxima emoción tras el ingreso
  hero:    `linear-gradient(170deg, #3d2518 0%, #5a3d2b 40%, #3d2518 100%)`,
};

// ── Overlay radial de calor (mecanismo atmosférico de Emotiva) ────────────────
// Reemplaza las partículas de S1; mismo efecto de fuente de luz cálida.
const warmOverlay = (pos = "50% 30%", color = C.champagne) =>
  `radial-gradient(ellipse at ${pos}, ${color}22 0%, transparent 60%)`;

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
    { fecha: "2009",        texto: "Llegaste al mundo y todo cambió para siempre." },
    { fecha: "2013",        texto: "Tus primeros pasos de danza — ya sabíamos que el escenario te pertenecía." },
    { fecha: "2017",        texto: "Viaje a Bariloche con la familia. Nevó por primera vez." },
    { fecha: "2021",        texto: "Comenzaste el secundario. Nuevos amigos, nuevas historias." },
    { fecha: "Este año",    texto: "Tus XV. El comienzo de la mejor etapa." },
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

// ── Animación de entrada — asentamiento emocional ─────────────────────────────
// Reutilizable: translateY + opacity con permanencia perceptible.
// La cadencia lenta permite que cada elemento se registre antes del siguiente.
function useEntered(delay = 0) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, []);
  return vis;
}

function fadeIn(vis, { dy = 32, duration = "1.2s", delay = "0s", easing = "cubic-bezier(0.16,1,0.3,1)" } = {}) {
  return {
    opacity:    vis ? 1 : 0,
    transform:  vis ? "translateY(0)" : `translateY(${dy}px)`,
    transition: `opacity ${duration} ${easing} ${delay}, transform ${duration} ${easing} ${delay}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover
// Bienvenida de ingreso como ritual emocional.
// Campo oscuro con luz Champagne emergente desde el centro.
// ─────────────────────────────────────────────────────────────────────────────
function Cover({ config, onEnter }) {
  const vis = useEntered(120);
  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      zIndex:     50,
      display:    "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow:   "hidden",
      background: G.cover,
    }}>
      {/* Foco de calor radial — mecanismo atmosférico */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: `${warmOverlay("50% 40%", C.champagne)}, ${warmOverlay("30% 70%", C.mocha)}`,
        pointerEvents: "none",
      }} />

      {/* Etiqueta VELA */}
      <p style={{
        position:      "absolute",
        top:           "clamp(1.5rem, 4vw, 2.5rem)",
        left:          "50%",
        transform:     "translateX(-50%)",
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
        letterSpacing: "0.5em",
        color:         C.taupe,
        ...fadeIn(vis, { dy: 8, duration: "1s", delay: "0.8s" }),
      }}>VELA</p>

      {/* Contenido central */}
      <div style={{
        textAlign:  "center",
        padding:    "0 clamp(2rem, 8vw, 4rem)",
        position:   "relative",
        zIndex:     1,
      }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.65rem, 1.2vw, 0.75rem)",
          letterSpacing: "0.4em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(1.5rem, 3vw, 2rem)",
          ...fadeIn(vis, { dy: 16, duration: "1.1s", delay: "0.1s" }),
        }}>Te invito a celebrar</p>

        {/* Nombre — foco de Luz emocional */}
        <h1 style={{
          fontFamily:  "'Cormorant Garamond', Georgia, serif",
          fontSize:    "clamp(4rem, 18vw, 10rem)",
          fontWeight:  300,
          lineHeight:  0.9,
          color:       C.champagne,
          letterSpacing: "-0.02em",
          textShadow:  `0 0 80px ${C.champagne}44, 0 4px 24px rgba(0,0,0,0.3)`,
          marginBottom: "clamp(1rem, 2vw, 1.5rem)",
          ...fadeIn(vis, { dy: 24, duration: "1.4s", delay: "0.25s" }),
        }}>{config.nombre}</h1>

        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.75rem, 1.4vw, 0.9rem)",
          letterSpacing: "0.25em",
          color:         C.taupe,
          marginBottom:  "clamp(2.5rem, 5vw, 3.5rem)",
          ...fadeIn(vis, { dy: 16, duration: "1.1s", delay: "0.4s" }),
        }}>Mis XV · {config.anio}</p>

        {/* Botón de ingreso — umbral emocional */}
        <div style={fadeIn(vis, { dy: 12, duration: "1s", delay: "0.6s" })}>
          <button
            onClick={onEnter}
            style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "clamp(0.6rem, 1vw, 0.7rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color:         C.crema,
              background:    "transparent",
              border:        `1px solid ${C.taupe}88`,
              padding:       "clamp(0.75rem, 1.5vw, 1rem) clamp(2.5rem, 5vw, 3.5rem)",
              cursor:        "pointer",
              transition:    "border-color 0.4s ease, background 0.4s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.champagne;
              e.currentTarget.style.background  = `${C.champagne}14`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${C.taupe}88`;
              e.currentTarget.style.background  = "transparent";
            }}
          >Ingresar</button>
        </div>
      </div>

      {/* Puntos indicadores */}
      <div style={{
        position:   "absolute",
        bottom:     "clamp(1.5rem, 3vw, 2rem)",
        display:    "flex",
        gap:        "0.5rem",
        ...fadeIn(vis, { dy: 0, duration: "1s", delay: "1.2s" }),
      }}>
        {[0.3, 0.5, 0.7].map((op, i) => (
          <div key={i} style={{
            width:  "6px", height: "6px",
            borderRadius: "50%",
            background:   C.champagne,
            opacity:      op,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// Primera sección post-ingreso. Nombre del agasajado a máxima escala.
// Cuenta regresiva integrada en el campo atmosférico.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const vis = useEntered(200);
  const cd  = useCountdown(new Date(config.contador));

  return (
    <section style={{
      minHeight:  "100svh",
      display:    "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      position:   "relative",
      overflow:   "hidden",
      background: G.hero,
    }}>
      {/* Overlay de calor */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: `${warmOverlay("35% 25%", C.champagne)}, ${warmOverlay("75% 75%", C.mocha)}`,
        pointerEvents: "none",
      }} />

      {/* Nombre */}
      <div style={{
        position:   "relative",
        zIndex:     1,
        textAlign:  "center",
        paddingTop: "clamp(6rem, 12vw, 10rem)",
        paddingBottom: 0,
        padding:    "clamp(6rem, 12vw, 10rem) clamp(1rem, 4vw, 2rem) 0",
        ...fadeIn(vis, { dy: 48, duration: "1.4s", delay: "0.2s" }),
      }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.6rem, 1.1vw, 0.7rem)",
          letterSpacing: "0.5em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
        }}>{config.fecha_display}</p>

        <h2 style={{
          fontFamily:   "'Cormorant Garamond', Georgia, serif",
          fontSize:     "clamp(4.5rem, 18vw, 11rem)",
          fontWeight:   300,
          lineHeight:   0.88,
          color:        C.champagne,
          textShadow:   `0 0 100px ${C.champagne}33`,
          letterSpacing: "-0.02em",
        }}>{config.nombre}</h2>

        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.75rem, 1.3vw, 0.85rem)",
          letterSpacing: "0.2em",
          color:         C.taupe,
          marginTop:     "clamp(1rem, 2vw, 1.5rem)",
          fontStyle:     "italic",
        }}>{config.subtitulo}</p>
      </div>

      {/* Cuenta regresiva */}
      <div style={{
        position:   "relative",
        zIndex:     1,
        display:    "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:        "clamp(0.5rem, 1.5vw, 0.75rem)",
        margin:     "clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem) 0",
        ...fadeIn(vis, { dy: 24, duration: "1.2s", delay: "0.5s" }),
      }}>
        {[
          { label: "Días",     value: cd.days    },
          { label: "Horas",    value: cd.hours   },
          { label: "Minutos",  value: cd.minutes },
          { label: "Segundos", value: cd.seconds },
        ].map(({ label, value }) => (
          <div key={label} style={{
            padding:       "clamp(1rem, 2.5vw, 1.5rem) clamp(0.5rem, 1vw, 0.75rem)",
            textAlign:     "center",
            background:    "rgba(0,0,0,0.22)",
            backdropFilter:"blur(6px)",
            border:        `1px solid ${C.champagne}22`,
          }}>
            <div style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "clamp(2rem, 6vw, 3rem)",
              fontWeight:    300,
              color:         C.crema,
              fontVariantNumeric: "tabular-nums",
            }}>{String(value ?? 0).padStart(2, "0")}</div>
            <div style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
              letterSpacing: "0.3em",
              color:         C.taupe,
              textTransform: "uppercase",
              marginTop:     "0.4rem",
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Línea de descenso */}
      <div style={{
        display:        "flex",
        justifyContent: "center",
        marginTop:      "clamp(2rem, 4vw, 3rem)",
      }}>
        <div style={{ width: "1px", height: "56px", background: `linear-gradient(to bottom, ${C.taupe}66, transparent)` }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HistoriaSection — PREMIUM
// Narrativa ampliada. Tratamiento atmosférico: mismo campo térmico.
// ─────────────────────────────────────────────────────────────────────────────
function HistoriaSection({ config }) {
  const vis = useEntered(100);
  const parrafos = config.historia.cuerpo.split("\n").filter(Boolean);

  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)",
      background: G.claro,
      position:   "relative",
      overflow:   "hidden",
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("80% 20%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{
        maxWidth: "640px",
        margin:   "0 auto",
        position: "relative",
        zIndex:   1,
        ...fadeIn(vis, { dy: 32, duration: "1.2s" }),
      }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(1.5rem, 3vw, 2rem)",
        }}>Historia</p>

        <h3 style={{
          fontFamily:  "'Cormorant Garamond', Georgia, serif",
          fontSize:    "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight:  300,
          color:       C.champagne,
          lineHeight:  1.1,
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        }}>{config.historia.titulo}</h3>

        {parrafos.map((p, i) => (
          <p key={i} style={{
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontSize:      "clamp(1rem, 1.6vw, 1.15rem)",
            fontWeight:    300,
            color:         C.crema,
            lineHeight:    1.8,
            opacity:       0.85,
            marginBottom:  i < parrafos.length - 1 ? "1.25em" : 0,
          }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineSection — PREMIUM
// Hitos cronológicos. Layout atmosférico, no tabular.
// Cada hito aparece con asentamiento emocional individual.
// El orden del array es significativo y se preserva.
// ─────────────────────────────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const vis = useEntered(100 + index * 120);
  return (
    <div style={{
      display:    "flex",
      gap:        "clamp(1rem, 3vw, 2rem)",
      alignItems: "flex-start",
      ...fadeIn(vis, { dy: 20, duration: "1s" }),
    }}>
      {/* Eje temporal */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width:        "8px",
          height:       "8px",
          borderRadius: "50%",
          background:   C.champagne,
          marginTop:    "0.35rem",
          flexShrink:   0,
          boxShadow:    `0 0 10px ${C.champagne}55`,
        }} />
        {index < 99 && (
          <div style={{
            width:      "1px",
            flexGrow:   1,
            minHeight:  "clamp(2rem, 4vw, 3rem)",
            background: `linear-gradient(to bottom, ${C.champagne}44, transparent)`,
            marginTop:  "0.4rem",
          }} />
        )}
      </div>

      {/* Contenido */}
      <div style={{ paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.75rem, 1.1vw, 0.8rem)",
          letterSpacing: "0.3em",
          color:         C.champagne,
          textTransform: "uppercase",
          marginBottom:  "0.4rem",
        }}>{item.fecha}</p>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize:   "clamp(0.95rem, 1.5vw, 1.1rem)",
          fontWeight: 300,
          color:      C.crema,
          lineHeight: 1.6,
          opacity:    1,
        }}>{item.texto}</p>
      </div>
    </div>
  );
}

function TimelineSection({ config }) {
  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)",
      background: G.base,
      position:   "relative",
      overflow:   "hidden",
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("20% 50%", C.mocha),
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "560px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(2.5rem, 5vw, 4rem)",
        }}>Momentos</p>

        <div>
          {config.timeline.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FotosSection — PREMIUM
// Fotografías integradas distribuidas en grilla.
// No galería centralizada: las fotos son temperatura visual, no archivo.
// El orden del array es significativo y se preserva.
// ─────────────────────────────────────────────────────────────────────────────
function FotosSection({ config }) {
  const vis = useEntered(100);
  if (!config.fotos || config.fotos.length === 0) return null;

  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
      background: G.claro,
      position:   "relative",
      overflow:   "hidden",
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("60% 40%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{
        maxWidth: "720px",
        margin:   "0 auto",
        position: "relative",
        zIndex:   1,
        ...fadeIn(vis, { dy: 24, duration: "1.2s" }),
      }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
          textAlign:     "center",
        }}>Recuerdos</p>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap:                 "clamp(0.5rem, 1.5vw, 1rem)",
        }}>
          {config.fotos.map((url, i) => (
            <div key={i} style={{
              aspectRatio:  i === 0 ? "auto" : "1",
              gridColumn:   i === 0 ? "1 / -1" : "auto",
              overflow:     "hidden",
              background:   `${C.mocha}33`,
              border:       `1px solid ${C.champagne}18`,
            }}>
              <img
                src={url}
                alt=""
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  display:    "block",
                  filter:     "brightness(0.9) sepia(0.1)",
                  transition: "filter 0.5s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1) sepia(0)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "brightness(0.9) sepia(0.1)"; }}
                onError={e => { e.currentTarget.parentNode.style.display = "none"; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventSection — STANDARD
// Fecha, lugar, dress code. Campo cálido profundo.
// ─────────────────────────────────────────────────────────────────────────────
function EventSection({ config }) {
  const vis = useEntered(100);
  const card = {
    padding:    "clamp(2rem, 4vw, 3rem)",
    textAlign:  "center",
    border:     `1px solid ${C.champagne}22`,
    transition: "border-color 0.4s ease",
  };

  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
      background: G.base,
      position:   "relative",
      overflow:   "hidden",
      ...fadeIn(vis, { dy: 24, duration: "1.2s" }),
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("50% 50%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "520px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Cuándo / Dónde */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div
            style={card}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.champagne}55`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.champagne}22`; }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", color: C.champagne, marginBottom: "1rem" }}>◇</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.4em", color: C.taupe, textTransform: "uppercase", marginBottom: "0.75rem" }}>¿Cuándo?</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)", color: `${C.crema}99`, marginBottom: "0.25rem" }}>{config.dia_semana}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: C.crema }}>{config.fecha_larga}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: C.crema }}>{config.anio}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: C.champagne, marginTop: "0.5rem", letterSpacing: "0.1em" }}>{config.hora}</p>
          </div>
          <div
            style={{ ...card, borderLeft: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.champagne}55`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.champagne}22`; }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", color: C.champagne, marginBottom: "1rem" }}>✦</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.4em", color: C.taupe, textTransform: "uppercase", marginBottom: "0.75rem" }}>¿Dónde?</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: C.crema, marginBottom: "1rem" }}>{config.lugar.nombre}</p>
            <a
              href={config.lugar.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color:         C.champagne,
                textDecoration:"none",
                borderBottom:  `1px solid ${C.taupe}66`,
                paddingBottom:  "2px",
                transition:    "border-color 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderBottomColor = C.champagne; }}
              onMouseLeave={e => { e.currentTarget.style.borderBottomColor = `${C.taupe}66`; }}
            >Cómo llegar</a>
          </div>
        </div>

        {/* Dress code */}
        <div
          style={{ ...card, borderTop: "none" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.champagne}55`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.champagne}22`; }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", color: C.champagne, marginBottom: "1rem" }}>◈</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.4em", color: C.taupe, textTransform: "uppercase", marginBottom: "0.75rem" }}>Dress Code</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 300, color: C.crema }}>{config.dress_code?.descripcion}</p>
          {config.dress_code?.aclaracion && (
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)", color: C.taupe, marginTop: "0.5rem", letterSpacing: "0.05em" }}>{config.dress_code.aclaracion}</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ItinerarioSection — PREMIUM
// Secuencia de momentos del evento. Layout atmosférico.
// El orden del array es significativo y se preserva.
// ─────────────────────────────────────────────────────────────────────────────
function ItinerarioSection({ config }) {
  const vis = useEntered(100);
  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)",
      background: G.claro,
      position:   "relative",
      overflow:   "hidden",
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("75% 60%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{
        maxWidth: "520px",
        margin:   "0 auto",
        position: "relative",
        zIndex:   1,
        ...fadeIn(vis, { dy: 24, duration: "1.2s" }),
      }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
        }}>La noche</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {config.itinerario.map((item, i) => (
            <div key={i} style={{
              display:    "grid",
              gridTemplateColumns: "5rem 1fr",
              gap:        "clamp(1rem, 2vw, 1.5rem)",
              alignItems: "baseline",
              padding:    "clamp(0.75rem, 1.5vw, 1rem) 0",
              borderBottom: i < config.itinerario.length - 1
                ? `1px solid ${C.champagne}14`
                : "none",
            }}>
              <p style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(0.7rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.15em",
                color:         C.champagne,
                fontVariantNumeric: "tabular-nums",
              }}>{item.hora}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize:   "clamp(0.9rem, 1.4vw, 1rem)",
                fontWeight: 300,
                color:      C.crema,
                opacity:    0.85,
              }}>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MusicSection — STANDARD
// ─────────────────────────────────────────────────────────────────────────────
function MusicSection({ config, playing, onToggle }) {
  return (
    <section style={{
      padding:    "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)",
      background: G.base,
      textAlign:  "center",
      borderTop:  `1px solid ${C.champagne}12`,
    }}>
      <p style={{
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
        letterSpacing: "0.45em",
        color:         C.taupe,
        textTransform: "uppercase",
        marginBottom:  "0.3rem",
      }}>Música</p>
      <p style={{
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(0.7rem, 1.1vw, 0.8rem)",
        color:         `${C.taupe}88`,
        letterSpacing: "0.1em",
        marginBottom:  "clamp(1.5rem, 3vw, 2rem)",
        fontStyle:     "italic",
      }}>{config.musica.nombre}</p>

      <button
        onClick={onToggle}
        style={{
          width:       "3.5rem",
          height:      "3.5rem",
          borderRadius:"50%",
          display:     "flex",
          alignItems:  "center",
          justifyContent:"center",
          margin:      "0 auto",
          border:      `1px solid ${playing ? C.champagne : C.taupe + "55"}`,
          background:  playing ? `${C.champagne}18` : "transparent",
          cursor:      "pointer",
          transition:  "border-color 0.4s ease, background 0.4s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.champagne; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = playing ? C.champagne : `${C.taupe}55`; }}
      >
        <span style={{ color: C.champagne, fontSize: "1rem" }}>{playing ? "⏸" : "▶"}</span>
      </button>
      <p style={{
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(0.6rem, 0.9vw, 0.7rem)",
        letterSpacing: "0.2em",
        color:         `${C.taupe}66`,
        marginTop:     "1rem",
      }}>{playing ? "Reproduciendo..." : "Activar música"}</p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GiftsSection — STANDARD (opcional)
// ─────────────────────────────────────────────────────────────────────────────
function GiftsSection({ config }) {
  const [show, setShow] = useState(false);
  if (!config.regalo?.alias && !config.regalo?.cvu) return null;

  return (
    <>
      {show && (
        <div style={{
          position:   "fixed",
          inset:      0,
          zIndex:     100,
          background: "rgba(0,0,0,0.7)",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          padding:    "1.5rem",
        }} onClick={() => setShow(false)}>
          <div style={{
            background: G.claro,
            border:     `1px solid ${C.champagne}33`,
            padding:    "clamp(2rem, 5vw, 3.5rem)",
            maxWidth:   "420px",
            width:      "100%",
            position:   "relative",
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShow(false)} style={{
              position:   "absolute",
              top:        "1rem",
              right:      "1.25rem",
              background: "transparent",
              border:     "none",
              color:      C.taupe,
              fontSize:   "1.25rem",
              cursor:     "pointer",
              lineHeight: 1,
            }}>×</button>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.4em", color: C.taupe, textTransform: "uppercase", marginBottom: "1.5rem" }}>Datos de transferencia</p>
            {config.regalo.alias && (
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.taupe, marginBottom: "0.3rem", textTransform: "uppercase" }}>Alias</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: C.crema, letterSpacing: "0.05em" }}>{config.regalo.alias}</p>
              </div>
            )}
            {config.regalo.cvu && (
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.taupe, marginBottom: "0.3rem", textTransform: "uppercase" }}>CVU</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.75rem, 1.3vw, 0.9rem)", color: C.crema, letterSpacing: "0.08em", wordBreak: "break-all" }}>{config.regalo.cvu}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <section style={{
        padding:    "clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
        background: G.claro,
        textAlign:  "center",
        borderTop:  `1px solid ${C.champagne}12`,
      }}>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", color: C.champagne, marginBottom: "1.25rem", opacity: 0.7 }}>◻</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.45em", color: C.taupe, textTransform: "uppercase", marginBottom: "1rem" }}>Regalos</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 300, color: C.crema, lineHeight: 1.6, marginBottom: "0.75rem" }}>Nada es más importante que tu presencia</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: C.taupe, lineHeight: 1.7, marginBottom: "1.75rem" }}>Pero si deseás hacerme un presente, podés hacerlo con una transferencia</p>
          <button
            onClick={() => setShow(true)}
            style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "clamp(0.6rem, 0.9vw, 0.7rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color:         C.champagne,
              background:    "transparent",
              border:        `1px solid ${C.champagne}66`,
              padding:       "0.75rem 2.5rem",
              cursor:        "pointer",
              transition:    "background 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.champagne}18`; e.currentTarget.style.borderColor = C.champagne; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${C.champagne}66`; }}
          >Ver datos</button>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSection — PREMIUM
// Formulario integrado según schema §4.5.
// Reemplaza el botón de WhatsApp de STANDARD.
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  const [form, setForm] = useState({
    nombre:    "",
    apellido:  "",
    asistencia: "si",
    restricciones_alimentarias: "",
    observaciones: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrMsg("");
  };

  const validate = () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setErrMsg("Completá tu nombre y apellido para confirmar.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("loading");

    const params = new URLSearchParams();
    params.set("timestamp",                  new Date().toISOString());
    params.set("sheetId",                    config.sheet_id || "");
    params.set("nombre",                     form.nombre.trim());
    params.set("apellido",                   form.apellido.trim());
    params.set("asistencia",                 form.asistencia === "si" ? "Confirmo" : "No asiste");
    params.set("restricciones_alimentarias", form.restricciones_alimentarias.trim());
    params.set("observaciones",              form.observaciones.trim());

    try {
      await fetch(config.apps_script_url + "?" + params.toString(), {
        method: "GET",
        mode:   "no-cors",
      });
      setStatus("success");
    } catch {
      setStatus("success"); // no-cors: asumimos éxito si no hay network error
    }
  };

  const inputStyle = {
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontSize:      "clamp(0.9rem, 1.4vw, 1rem)",
    color:         C.crema,
    background:    "transparent",
    border:        "none",
    borderBottom:  `1px solid ${C.champagne}44`,
    outline:       "none",
    width:         "100%",
    padding:       "0.6rem 0",
    transition:    "border-color 0.3s ease",
  };

  const labelStyle = {
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontSize:      "clamp(0.65rem, 0.9vw, 0.7rem)",
    letterSpacing: "0.3em",
    color:         `${C.crema}BB`,
    textTransform: "uppercase",
    display:       "block",
    marginBottom:  "0.4rem",
  };

  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)",
      background: G.acento,
      position:   "relative",
      overflow:   "hidden",
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("50% 30%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "480px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", color: C.champagne, marginBottom: "1.25rem", opacity: 0.8 }}>✉</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)", letterSpacing: "0.45em", color: C.taupe, textTransform: "uppercase", marginBottom: "0.75rem" }}>Confirmá tu asistencia</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 300, color: C.crema }}>
            Antes del {config.confirmacion_limite}
          </h2>
          <div style={{ width: "2rem", height: "1px", background: `${C.champagne}66`, margin: "1.5rem auto 0" }} />
        </div>

        {status === "success" && (
          <div style={{ textAlign: "center", padding: "clamp(2rem, 4vw, 3rem) 0" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", color: C.champagne, marginBottom: "1.25rem" }}>✓</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)", fontWeight: 300, color: C.crema, marginBottom: "0.75rem" }}>
              ¡Gracias, {form.nombre}!
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)", color: `${C.crema}99`, lineHeight: 1.7 }}>
              {form.asistencia === "si"
                ? `Te esperamos el ${config.fecha_larga}. 🎉`
                : "Te vamos a extrañar en esta noche especial."}
            </p>
          </div>
        )}

        {status !== "success" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 1.5rem)" }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => set("nombre", e.target.value)}
                  placeholder="Tu nombre"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = C.champagne; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = `${C.champagne}44`; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={e => set("apellido", e.target.value)}
                  placeholder="Tu apellido"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = C.champagne; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = `${C.champagne}44`; }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>¿Asistís?</label>
              <div style={{ display: "flex", gap: "1.5rem", paddingTop: "0.4rem" }}>
                {[["si", "Sí, confirmo"], ["no", "No puedo ir"]].map(([val, lbl]) => (
                  <label key={val} style={{
                    display:     "flex",
                    alignItems:  "center",
                    gap:         "0.5rem",
                    cursor:      "pointer",
                    fontFamily:  "'Cormorant Garamond', Georgia, serif",
                    fontSize:    "clamp(0.85rem, 1.3vw, 0.95rem)",
                    color:       form.asistencia === val ? C.champagne : C.taupe,
                    transition:  "color 0.3s ease",
                  }}>
                    <input
                      type="radio"
                      name="asistencia"
                      value={val}
                      checked={form.asistencia === val}
                      onChange={() => set("asistencia", val)}
                      style={{ accentColor: C.champagne, cursor: "pointer" }}
                    />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Restricciones alimentarias</label>
              <input
                type="text"
                value={form.restricciones_alimentarias}
                onChange={e => set("restricciones_alimentarias", e.target.value)}
                placeholder="Celíaco, vegetariano, etc. (opcional)"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderBottomColor = C.champagne; }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = `${C.champagne}44`; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Observaciones</label>
              <textarea
                value={form.observaciones}
                onChange={e => set("observaciones", e.target.value)}
                placeholder="Mensaje o comentario (opcional)"
                rows={3}
                style={{
                  ...inputStyle,
                  borderBottom: "none",
                  border:       `1px solid ${C.champagne}44`,
                  padding:      "0.75rem",
                  resize:       "none",
                  lineHeight:   1.6,
                  transition:   "border-color 0.3s ease",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = C.champagne; }}
                onBlur={e => { e.currentTarget.style.borderColor = `${C.champagne}44`; }}
              />
            </div>

            {errMsg && (
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize:   "clamp(0.8rem, 1.2vw, 0.9rem)",
                color:      "#e8a0a0",
                textAlign:  "center",
              }}>{errMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(0.6rem, 0.9vw, 0.7rem)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color:         C.crema,
                background:    status === "loading" ? `rgba(0,0,0,0.4)` : "rgba(0,0,0,0.28)",
                border:        `1px solid ${C.crema}33`,
                padding:       "clamp(0.85rem, 1.5vw, 1.1rem)",
                width:         "100%",
                cursor:        status === "loading" ? "not-allowed" : "pointer",
                opacity:       status === "loading" ? 0.65 : 1,
                transition:    "background 0.3s ease",
              }}
              onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.background = "rgba(0,0,0,0.45)"; }}
              onMouseLeave={e => { if (status !== "loading") e.currentTarget.style.background = "rgba(0,0,0,0.28)"; }}
            >{status === "loading" ? "Enviando..." : "Confirmar asistencia"}</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmadosSection — PREMIUM
// Listado de confirmados en tiempo real.
// Polling cada 30s al mismo Apps Script endpoint (GET sin parámetros de envío).
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmadosSection({ config }) {
  const [confirmados, setConfirmados] = useState([]);
  const [cargando,    setCargando]    = useState(true);

  const fetchConfirmados = async () => {
    try {
      const res = await fetch(
        `${config.apps_script_url}?action=list&sheetId=${config.sheet_id}`
      );
      const data = await res.json();
      // El Apps Script debe devolver { confirmados: [{ nombre, apellido }] }
      if (Array.isArray(data.confirmados)) {
        setConfirmados(data.confirmados);
      }
    } catch {
      // Sin red o Apps Script no configurado: sin error visible, lista vacía
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchConfirmados();
    const interval = setInterval(fetchConfirmados, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      padding:    "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 3rem)",
      background: G.base,
      position:   "relative",
      overflow:   "hidden",
      borderTop:  `1px solid ${C.champagne}12`,
    }}>
      <div style={{
        position:   "absolute",
        inset:      0,
        background: warmOverlay("40% 70%", C.champagne),
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "480px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          textTransform: "uppercase",
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
        }}>Confirmados</p>

        {cargando && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize:   "clamp(0.8rem, 1.2vw, 0.9rem)",
            color:      `${C.taupe}88`,
            fontStyle:  "italic",
          }}>Cargando...</p>
        )}

        {!cargando && confirmados.length === 0 && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize:   "clamp(0.85rem, 1.3vw, 0.95rem)",
            color:      `${C.taupe}88`,
            fontStyle:  "italic",
          }}>Todavía no hay confirmaciones. ¡Sé el primero!</p>
        )}

        {confirmados.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {confirmados.map((c, i) => (
              <div key={i} style={{
                padding:      "clamp(0.6rem, 1.2vw, 0.85rem) 0",
                borderBottom: i < confirmados.length - 1 ? `1px solid ${C.champagne}14` : "none",
                display:      "flex",
                alignItems:   "center",
                gap:          "0.75rem",
              }}>
                <div style={{
                  width:        "5px",
                  height:       "5px",
                  borderRadius: "50%",
                  background:   C.champagne,
                  flexShrink:   0,
                  opacity:      0.7,
                }} />
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize:   "clamp(0.9rem, 1.4vw, 1rem)",
                  fontWeight: 300,
                  color:      C.crema,
                  opacity:    0.85,
                }}>{c.nombre} {c.apellido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ config }) {
  return (
    <footer style={{
      padding:    "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)",
      background: "#1e100a",
      textAlign:  "center",
      borderTop:  `1px solid ${C.champagne}12`,
    }}>
      <p style={{
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(1.8rem, 5vw, 2.8rem)",
        fontWeight:    300,
        color:         C.champagne,
        letterSpacing: "-0.01em",
        marginBottom:  "0.75rem",
        textShadow:    `0 0 40px ${C.champagne}33`,
      }}>{config.nombre}</p>
      <p style={{
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontSize:      "clamp(0.6rem, 0.9vw, 0.7rem)",
        letterSpacing: "0.35em",
        color:         C.taupe,
        textTransform: "uppercase",
        opacity:       0.6,
      }}>{config.dia_semana} {config.fecha_display} · {config.hora}</p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Root
// Orden de secciones:
//   STANDARD: Cover → Hero → EventSection → MusicSection → GiftsSection
//   PREMIUM+:  HistoriaSection → TimelineSection → FotosSection →
//              ItinerarioSection → ConfirmSection → ConfirmadosSection
//   CIERRE:    Footer
// ─────────────────────────────────────────────────────────────────────────────
export default function P1() {
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
        audio.volume = 0.5;
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 900);
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #2e1f16; }
        input::placeholder, textarea::placeholder { color: ${C.taupe}66; }
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
