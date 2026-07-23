import { useState, useEffect, useRef } from "react";

import { useCountdown } from "./shared/hooks";
import { useConfig } from "../hooks/useConfig";

// ─────────────────────────────────────────────────────────────────────────────
// P2.jsx — P2.1
// Familia: Con Carácter · Variante: PREMIUM
// FASE 17 — segunda implementación del catálogo PREMIUM.
//
// COMPATIBILIDAD DE PREVIEW
// En producción: consume config vía window.__VELA_CONFIG__ inyectado
// por el TemplateLoader, o hace fetch directo si el hook está disponible.
// En preview de Claude: usa MOCK_CONFIG definido abajo.
//
// Roles de familia demostrados (pendiente auditoría):
//   Paleta      → Afirmación cromática (bloque Negro / campo Crema / borde Champagne)
//   Tipografía  → Tipografía con intención identitaria (Bebas Neue — NO intercambiable)
//   Composición → Quiebre compositivo localizable (división estructural 55/45 en secciones de entrada)
//   Movimiento  → Postura en acto (bloque entra 700ms después del texto como acontecimiento)
//
// Principio de densidad de identidad aprobado (FASE 17):
//   Cover, HeroSection y EventSection son responsables de establecer
//   inequívocamente la identidad Con Carácter. Las secciones narrativas
//   extensas (Historia, Timeline, Fotos, Itinerario) relajan la estructura
//   compositiva preservando continuidad cromática, tipográfica y de tono.
//   La identidad de familia no necesita expresarse con la misma intensidad
//   en todas las secciones del recorrido PREMIUM.
//
// Paleta oficial VELA — los 5 colores, roles en esta variante:
//   #F8F5EF  Crema      → Campo (superficie dominante)
//   #1A1A1A  Negro      → Afirmación cromática (bloque asimétrico estructural)
//   #8B7355  Mocha      → Tipografía con carácter / acento tonal
//   #B9A68E  Taupe      → Soporte / texto secundario
//   #E6D3A8  Champagne  → Separador de jerarquía / acento puntual
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
// Referencia visual: S2.jsx (FASE 13, S2.2).
//
// Infraestructura intacta: templateRegistry, TemplateLoader, useConfig,
// S1, S2, S3, P1.
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
  return useConfig(slug);
}

// ── Animación de entrada — postura en acto ────────────────────────────────────
// translateY + opacity. Más rápida que Emotiva: la presencia se afirma,
// no se asienta. La cadencia es precisa, no orgánica.
function useEntered(delay = 0) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, []);
  return vis;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover
// Identidad máxima Con Carácter: bloque Negro 55% + nombre en mixBlendMode.
// Postura en acto: texto aparece primero (150ms); bloque llega como
// acontecimiento (700ms). Fuente directa: S2.jsx Cover.
// ─────────────────────────────────────────────────────────────────────────────
function Cover({ config, onEnter }) {
  const [textVis,  setTextVis]  = useState(false);
  const [blockVis, setBlockVis] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTextVis(true),  150);
    const t2 = setTimeout(() => setBlockVis(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      zIndex:     50,
      display:    "flex",
      overflow:   "hidden",
      background: C.crema,
    }}>
      {/* Bloque Negro — Afirmación cromática + Quiebre compositivo */}
      {/* Llega como acontecimiento: Postura en acto               */}
      <div style={{
        position:   "absolute",
        left:       0, top: 0, bottom: 0,
        width:      "55%",
        background: C.negro,
        transform:  blockVis ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)",
        zIndex:     1,
      }} />

      {/* Contenido */}
      <div style={{
        position:       "relative",
        zIndex:         2,
        width:          "100%",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        padding:        "clamp(2rem, 5vw, 4rem)",
      }}>
        {/* Etiqueta VELA — dentro del bloque Negro */}
        <div style={{
          position:   "absolute",
          left:       "clamp(1.25rem, 2.5vw, 2rem)",
          top:        "clamp(1.5rem, 3vw, 2.5rem)",
          opacity:    blockVis ? 1 : 0,
          transition: "opacity 0.5s ease 1s",
          zIndex:     3,
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
          }}>VELA</p>
        </div>

        {/* Cuerpo central */}
        <div style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          paddingTop:     "clamp(3rem, 8vw, 6rem)",
        }}>
          {/* Etiqueta MIS XV — lado derecho */}
          <div style={{
            marginLeft:   "40%",
            marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            opacity:      textVis ? 1 : 0,
            transform:    textVis ? "translateY(0)" : "translateY(12px)",
            transition:   "all 0.7s ease",
          }}>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(0.6rem, 1.1vw, 0.72rem)",
              letterSpacing: "0.45em",
              color:         C.taupe,
            }}>MIS XV</p>
          </div>

          {/* Nombre — cruza el límite entre negro y crema */}
          <div style={{
            opacity:    textVis ? 1 : 0,
            transform:  textVis ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}>
            <h1 style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(5rem, 18vw, 14rem)",
              lineHeight:    0.88,
              letterSpacing: "0.02em",
              color:         C.crema,
              mixBlendMode:  "difference",
              userSelect:    "none",
              margin:        0,
            }}>
              {config.nombre}
            </h1>
          </div>

          {/* Subtítulo + botón — lado derecho del campo Crema */}
          <div style={{
            marginLeft: "40%",
            marginTop:  "clamp(1.5rem, 3.5vw, 2.5rem)",
            opacity:    textVis ? 1 : 0,
            transform:  textVis ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.7s ease 0.25s",
          }}>
            <p style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(0.85rem, 1.6vw, 1rem)",
              fontWeight:    300,
              letterSpacing: "0.08em",
              color:         C.mocha,
              marginBottom:  "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight:    1.6,
            }}>
              {config.subtitulo}
            </p>
            <button
              onClick={onEnter}
              style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      "clamp(0.65rem, 1.2vw, 0.75rem)",
                letterSpacing: "0.4em",
                background:    C.crema,
                border:        `1px solid ${C.negro}`,
                color:         C.negro,
                padding:       "0.85em 2.5em",
                cursor:        "pointer",
                transition:    "background 0.25s, color 0.25s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.negro;
                e.currentTarget.style.color      = C.crema;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.crema;
                e.currentTarget.style.color      = C.negro;
              }}
            >INGRESAR</button>
          </div>
        </div>

        {/* Fecha — pie, lado derecho */}
        <div style={{
          marginLeft: "40%",
          opacity:    textVis ? 1 : 0,
          transition: "opacity 0.6s ease 0.4s",
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.6rem, 1.1vw, 0.7rem)",
            letterSpacing: "0.4em",
            color:         C.taupe,
          }}>{config.fecha_display}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// Bloque Negro persistente con estructura 55/45. Identidad máxima.
// Fuente directa: S2.jsx HeroSection.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  const cd = useCountdown(config.contador);

  return (
    <section style={{
      position:       "relative",
      minHeight:      "100svh",
      background:     C.crema,
      display:        "flex",
      flexDirection:  "column",
      overflow:       "hidden",
    }}>
      {/* Bloque Negro persistente */}
      <div style={{
        position:   "absolute",
        left: 0, top: 0, bottom: 0,
        width:      "55%",
        background: C.negro,
        zIndex:     1,
      }} />

      {/* Línea Champagne — separador de jerarquía */}
      <div style={{
        position:   "absolute",
        left:       "55%",
        top: 0, bottom: 0,
        width:      "2px",
        background: C.champagne,
        opacity:    0.6,
        zIndex:     2,
      }} />

      {/* Contenido */}
      <div style={{
        position:       "relative",
        zIndex:         3,
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        padding:        "clamp(2rem, 5vw, 4rem)",
        paddingTop:     "clamp(3rem, 7vw, 5rem)",
      }}>
        {/* Nombre sobre bloque Negro */}
        <div style={{
          width:        "55%",
          paddingRight: "clamp(0.75rem, 1.5vw, 1.25rem)",
          opacity:      vis ? 1 : 0,
          transform:    vis ? "translateY(0)" : "translateY(20px)",
          transition:   "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <h2 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(2.2rem, 6vw, 5rem)",
            lineHeight:    0.9,
            letterSpacing: "0.02em",
            color:         C.crema,
            wordBreak:     "break-word",
            margin:        0,
          }}>{config.nombre}</h2>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.65rem, 1.2vw, 0.8rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.12em",
            marginTop:     "0.85rem",
            lineHeight:    1.7,
          }}>
            {config.dia_semana}<br />
            {config.fecha_larga}<br />
            {config.anio}
          </p>
        </div>

        {/* Countdown — campo Crema */}
        <div style={{
          marginLeft: "calc(55% + clamp(1rem, 2vw, 2rem))",
          opacity:    vis ? 1 : 0,
          transform:  vis ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.9s ease 0.2s",
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
          }}>FALTAN</p>
          <div style={{ display: "flex", gap: "clamp(0.75rem, 2vw, 2rem)", alignItems: "baseline" }}>
            {[
              { val: cd.days,    label: "DÍAS"  },
              { val: cd.hours,   label: "HORAS" },
              { val: cd.minutes, label: "MIN"   },
              { val: cd.seconds, label: "SEG"   },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "clamp(2rem, 5.5vw, 4.5rem)",
                  lineHeight:    1,
                  color:         C.negro,
                  letterSpacing: "0.02em",
                }}>
                  {String(item.val ?? 0).padStart(2, "0")}
                </div>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "clamp(0.45rem, 0.85vw, 0.6rem)",
                  letterSpacing: "0.4em",
                  color:         C.taupe,
                  marginTop:     "0.2rem",
                }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtítulo — pie campo Crema */}
        <div style={{
          marginLeft: "calc(55% + clamp(1rem, 2vw, 2rem))",
          opacity:    vis ? 1 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}>
          <div style={{
            width:        "2.5rem",
            height:       "1px",
            background:   C.mocha,
            marginBottom: "0.85rem",
            opacity:      0.5,
          }} />
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.85rem, 1.6vw, 1.05rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.06em",
            lineHeight:    1.65,
            maxWidth:      "28rem",
          }}>{config.subtitulo}</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventSection
// Quiebre compositivo en header Negro + grid 55/45. Identidad máxima.
// Fuente directa: S2.jsx EventSection.
// ─────────────────────────────────────────────────────────────────────────────
function EventSection({ config }) {
  return (
    <section style={{ background: C.crema, borderTop: `1px solid ${C.champagne}` }}>
      {/* Header Negro — quiebre de sección */}
      <div style={{
        background: C.negro,
        padding:    "clamp(1.25rem, 2.5vw, 2rem) clamp(2rem, 5vw, 4rem)",
        display:    "flex",
        alignItems: "baseline",
        gap:        "1.5rem",
      }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(1.6rem, 3.5vw, 2.5rem)",
          letterSpacing: "0.05em",
          color:         C.crema,
          lineHeight:    1,
          margin:        0,
        }}>EL EVENTO</p>
        <div style={{ flex: 1, height: "1px", background: C.mocha, opacity: 0.4 }} />
      </div>

      {/* Grid 55/45 */}
      <div style={{ display: "grid", gridTemplateColumns: "55% 1fr" }}>
        {/* Celda izquierda — Negro */}
        <div style={{
          background:  C.negro,
          padding:     "clamp(1.75rem, 3.5vw, 3rem) clamp(1.25rem, 2.5vw, 2rem)",
          borderRight: `2px solid ${C.champagne}`,
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.85rem",
          }}>CUÁNDO</p>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(1.2rem, 2.8vw, 2rem)",
            lineHeight:    1,
            color:         C.crema,
            letterSpacing: "0.03em",
            marginBottom:  "0.4rem",
          }}>{config.fecha_larga?.toUpperCase()}</p>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.7rem, 1.3vw, 0.85rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.1em",
          }}>{config.dia_semana} · {config.hora}</p>
        </div>

        {/* Celda derecha — Crema */}
        <div style={{
          padding:    "clamp(1.75rem, 3.5vw, 3rem) clamp(1.25rem, 2.5vw, 2rem)",
          background: C.crema,
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.85rem",
          }}>DÓNDE</p>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(1.1rem, 2.2vw, 1.8rem)",
            lineHeight:    1.1,
            color:         C.negro,
            letterSpacing: "0.03em",
            marginBottom:  "0.85rem",
          }}>{config.lugar?.nombre}</p>
          <a
            href={config.lugar?.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily:     "'Bebas Neue', sans-serif",
              fontSize:       "clamp(0.5rem, 0.9vw, 0.62rem)",
              letterSpacing:  "0.4em",
              color:          C.mocha,
              textDecoration: "none",
              borderBottom:   `1px solid ${C.mocha}`,
              paddingBottom:  "0.15em",
            }}
          >CÓMO LLEGAR</a>

          {/* Dress code */}
          <div style={{
            marginTop:  "clamp(1.25rem, 2.5vw, 2rem)",
            paddingTop: "clamp(1.25rem, 2.5vw, 2rem)",
            borderTop:  `1px solid ${C.champagne}`,
          }}>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
              letterSpacing: "0.45em",
              color:         C.taupe,
              marginBottom:  "0.6rem",
            }}>DRESS CODE</p>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(1rem, 2vw, 1.6rem)",
              color:         C.negro,
              letterSpacing: "0.04em",
              lineHeight:    1,
            }}>{config.dress_code?.descripcion}</p>
            {config.dress_code?.aclaracion && (
              <p style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(0.7rem, 1.2vw, 0.82rem)",
                fontWeight:    300,
                color:         C.taupe,
                letterSpacing: "0.08em",
                marginTop:     "0.35rem",
              }}>{config.dress_code.aclaracion}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HistoriaSection
// Narrativa ampliada. Principio de densidad: estructura compositiva relajada.
// Se preserva: Bebas Neue en etiqueta, Cormorant en cuerpo, acento Negro/Champagne.
// ─────────────────────────────────────────────────────────────────────────────
function HistoriaSection({ config }) {
  const vis = useEntered(200);
  if (!config.historia) return null;

  const parrafos = (config.historia.cuerpo || "").split("\n\n").filter(Boolean);

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      borderTop:  `1px solid ${C.champagne}`,
    }}>
      <div style={{ maxWidth: "42rem" }}>
        {/* Etiqueta — voz Bebas Neue mantenida */}
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
          opacity:       vis ? 1 : 0,
          transition:    "opacity 0.7s ease",
        }}>HISTORIA</p>

        {/* Título */}
        {config.historia.titulo && (
          <h2 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(2rem, 5vw, 3.5rem)",
            lineHeight:    0.95,
            letterSpacing: "0.02em",
            color:         C.negro,
            marginBottom:  "clamp(1.5rem, 3vw, 2.5rem)",
            opacity:       vis ? 1 : 0,
            transform:     vis ? "translateY(0)" : "translateY(16px)",
            transition:    "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}>
            {config.historia.titulo}
          </h2>
        )}

        {/* Línea de tensión — referencia al borde Champagne */}
        <div style={{
          width:        "3rem",
          height:       "2px",
          background:   C.negro,
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          opacity:      vis ? 0.8 : 0,
          transition:   "opacity 0.6s ease 0.2s",
        }} />

        {/* Cuerpo — Cormorant, legible sobre campo Crema */}
        {parrafos.map((p, i) => (
          <p key={i} style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.95rem, 1.7vw, 1.1rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.04em",
            lineHeight:    1.75,
            marginBottom:  i < parrafos.length - 1 ? "clamp(1rem, 2vw, 1.5rem)" : 0,
            opacity:       vis ? 1 : 0,
            transform:     vis ? "translateY(0)" : "translateY(12px)",
            transition:    `all 0.8s ease ${0.2 + i * 0.1}s`,
          }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineSection
// Hitos cronológicos. Estructura relajada, tensión tipográfica mantenida.
// Fechas en Bebas Neue (voz identitaria); textos en Cormorant.
// Borde izquierdo Negro como eje estructural en lugar del bloque 55/45.
// ─────────────────────────────────────────────────────────────────────────────
function TimelineSection({ config }) {
  if (!config.timeline?.length) return null;

  return (
    <section style={{
      background: C.negro,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      borderTop:  `2px solid ${C.champagne}`,
    }}>
      {/* Etiqueta */}
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
        letterSpacing: "0.45em",
        color:         C.taupe,
        marginBottom:  "clamp(2.5rem, 5vw, 4rem)",
      }}>MOMENTOS</p>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {config.timeline.map((item, i) => (
          <TimelineItem key={i} item={item} index={i} last={i === config.timeline.length - 1} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ item, index, last }) {
  const vis = useEntered(index * 120);

  return (
    <div style={{
      display:    "grid",
      gridTemplateColumns: "clamp(3.5rem, 8vw, 6rem) 1px 1fr",
      gap:        "0 clamp(1rem, 2.5vw, 2rem)",
      opacity:    vis ? 1 : 0,
      transform:  vis ? "translateX(0)" : "translateX(-16px)",
      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      {/* Fecha — Bebas Neue, voz identitaria */}
      <div style={{
        paddingTop:  "0.1em",
        paddingBottom: last ? 0 : "clamp(2rem, 4vw, 3rem)",
        textAlign:   "right",
      }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.75rem, 1.4vw, 0.9rem)",
          letterSpacing: "0.08em",
          color:         C.champagne,
          lineHeight:    1,
        }}>{item.fecha}</p>
      </div>

      {/* Eje vertical — Champagne como separador de jerarquía */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width:        "6px",
          height:       "6px",
          background:   C.champagne,
          borderRadius: "50%",
          flexShrink:   0,
          marginTop:    "0.2em",
        }} />
        {!last && (
          <div style={{
            flex:       1,
            width:      "1px",
            background: `${C.champagne}40`,
            marginTop:  "0.5rem",
          }} />
        )}
      </div>

      {/* Texto — Cormorant */}
      <div style={{ paddingBottom: last ? 0 : "clamp(2rem, 4vw, 3rem)" }}>
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.9rem, 1.6vw, 1.05rem)",
          fontWeight:    300,
          color:         C.crema,
          letterSpacing: "0.04em",
          lineHeight:    1.65,
        }}>{item.texto}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FotosSection
// Galería en cuadrícula. Campo Crema — respira dentro de la atmósfera Con Carácter.
// Marco Negro en cada foto: tensión tipográfica trasladada al plano visual.
// ─────────────────────────────────────────────────────────────────────────────
function FotosSection({ config }) {
  if (!config.fotos?.length) return null;

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      borderTop:  `1px solid ${C.champagne}`,
    }}>
      {/* Etiqueta */}
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
        letterSpacing: "0.45em",
        color:         C.taupe,
        marginBottom:  "clamp(2rem, 4vw, 3rem)",
      }}>FOTOS</p>

      {/* Cuadrícula — gap mínimo, marco Negro */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(clamp(8rem, 22vw, 14rem), 1fr))",
        gap:                 "clamp(0.5rem, 1.5vw, 1rem)",
      }}>
        {config.fotos.map((src, i) => (
          <div key={i} style={{
            aspectRatio: "1",
            overflow:    "hidden",
            border:      `2px solid ${C.negro}`,
          }}>
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              style={{
                width:      "100%",
                height:     "100%",
                objectFit:  "cover",
                display:    "block",
                filter:     "grayscale(15%)",
                transition: "filter 0.3s ease, transform 0.4s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter    = "grayscale(0%)";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter    = "grayscale(15%)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onError={e => {
                e.currentTarget.parentElement.style.background = C.taupe + "33";
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ItinerarioSection
// Secuencia del evento. Campo Negro. Tensión tipográfica en horas (Bebas Neue).
// Layout lineal sin bloque 55/45 — estructura relajada, voz mantenida.
// ─────────────────────────────────────────────────────────────────────────────
function ItinerarioSection({ config }) {
  if (!config.itinerario?.length) return null;

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      borderTop:  `1px solid ${C.champagne}`,
    }}>
      {/* Header — quiebre local con franja Negro */}
      <div style={{
        background:   C.negro,
        padding:      "clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2.5rem)",
        marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        marginLeft:   "calc(-1 * clamp(2rem, 5vw, 4rem))",
        marginRight:  "calc(-1 * clamp(2rem, 5vw, 4rem))",
        display:      "flex",
        alignItems:   "baseline",
        gap:          "1.5rem",
      }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(1.6rem, 3.5vw, 2.5rem)",
          letterSpacing: "0.05em",
          color:         C.crema,
          lineHeight:    1,
          margin:        0,
        }}>LA NOCHE</p>
        <div style={{ flex: 1, height: "1px", background: C.champagne, opacity: 0.4 }} />
      </div>

      {/* Items */}
      <div style={{ maxWidth: "42rem" }}>
        {config.itinerario.map((item, i) => (
          <div key={i} style={{
            display:       "grid",
            gridTemplateColumns: "clamp(3rem, 7vw, 5rem) 1fr",
            gap:           "clamp(1rem, 2.5vw, 2rem)",
            paddingBottom: i < config.itinerario.length - 1 ? "clamp(1.25rem, 2.5vw, 2rem)" : 0,
            marginBottom:  i < config.itinerario.length - 1 ? "clamp(1.25rem, 2.5vw, 2rem)" : 0,
            borderBottom:  i < config.itinerario.length - 1 ? `1px solid ${C.champagne}55` : "none",
          }}>
            {/* Hora — Bebas Neue, voz identitaria */}
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(0.9rem, 1.8vw, 1.2rem)",
              letterSpacing: "0.04em",
              color:         C.negro,
              lineHeight:    1,
              paddingTop:    "0.1em",
            }}>{item.hora}</p>
            {/* Descripción — Cormorant */}
            <p style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(0.9rem, 1.6vw, 1.05rem)",
              fontWeight:    300,
              color:         C.mocha,
              letterSpacing: "0.04em",
              lineHeight:    1.6,
            }}>{item.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MusicSection
// Fuente directa: S2.jsx MusicSection. Sin modificaciones.
// ─────────────────────────────────────────────────────────────────────────────
function MusicSection({ config, playing, onToggle }) {
  return (
    <section style={{
      background:  C.negro,
      padding:     "clamp(2rem, 4vw, 3.5rem) clamp(2rem, 5vw, 4rem)",
      display:     "flex",
      alignItems:  "center",
      gap:         "clamp(1.25rem, 2.5vw, 2rem)",
      borderTop:   `1px solid rgba(230,211,168,0.2)`,
    }}>
      <button
        onClick={onToggle}
        style={{
          width:          "3rem",
          height:         "3rem",
          flexShrink:     0,
          border:         `1px solid ${playing ? C.champagne : C.mocha}`,
          background:     "transparent",
          color:          playing ? C.champagne : C.mocha,
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "0.95rem",
          transition:     "border-color 0.2s, color 0.2s",
        }}
      >{playing ? "⏸" : "▶"}</button>
      <div>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          marginBottom:  "0.3rem",
        }}>MÚSICA</p>
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.crema,
          letterSpacing: "0.06em",
        }}>{config.musica?.nombre}</p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GiftsSection
// Fuente directa: S2.jsx GiftsSection. Sin modificaciones.
// ─────────────────────────────────────────────────────────────────────────────
function GiftsSection({ config }) {
  const [open, setOpen] = useState(false);
  if (!config.regalo?.alias && !config.regalo?.cvu) return null;

  return (
    <>
      {open && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         50,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "rgba(26,26,26,0.88)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: C.crema,
              padding:    "clamp(2rem, 4vw, 3rem)",
              maxWidth:   "22rem",
              width:      "90%",
              position:   "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position:   "absolute",
                top:        "1rem",
                right:      "1rem",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                color:      C.taupe,
                fontSize:   "1.3rem",
                lineHeight: 1,
              }}
            >×</button>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(1.2rem, 2.5vw, 1.6rem)",
              letterSpacing: "0.08em",
              color:         C.negro,
              marginBottom:  "clamp(1.5rem, 3vw, 2rem)",
            }}>REGALOS</p>
            {config.regalo.alias && (
              <div style={{ marginBottom: "1rem" }}>
                <p style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "0.58rem",
                  letterSpacing: "0.45em",
                  color:         C.taupe,
                  marginBottom:  "0.4rem",
                }}>ALIAS</p>
                <p style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "1.1rem",
                  color:         C.negro,
                  letterSpacing: "0.08em",
                  userSelect:    "all",
                }}>{config.regalo.alias}</p>
              </div>
            )}
            {config.regalo.cvu && (
              <div style={{ borderTop: `1px solid ${C.champagne}`, paddingTop: "1rem" }}>
                <p style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "0.58rem",
                  letterSpacing: "0.45em",
                  color:         C.taupe,
                  marginBottom:  "0.4rem",
                }}>CVU</p>
                <p style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "0.85rem",
                  color:         C.mocha,
                  wordBreak:     "break-all",
                  userSelect:    "all",
                }}>{config.regalo.cvu}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <section style={{
        background:     C.crema,
        padding:        "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
        borderTop:      `1px solid ${C.champagne}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            "2rem",
        flexWrap:       "wrap",
      }}>
        <div>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.75rem",
          }}>REGALOS</p>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.6vw, 1.05rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.06em",
            lineHeight:    1.6,
            maxWidth:      "28rem",
          }}>Tu presencia es lo que más importa. Si querés hacerme un regalo, podés hacerlo por transferencia.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.6rem, 1.1vw, 0.72rem)",
            letterSpacing: "0.4em",
            background:    C.negro,
            color:         C.crema,
            border:        "none",
            padding:       "0.85em 2.2em",
            cursor:        "pointer",
            flexShrink:    0,
            transition:    "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.mocha}
          onMouseLeave={e => e.currentTarget.style.background = C.negro}
        >VER DATOS</button>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSection
// Formulario integrado PREMIUM. Campo Negro con voz Bebas Neue.
// Fuente funcional: P1.jsx ConfirmSection, instanciación Con Carácter.
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  const [nombre,     setNombre]     = useState("");
  const [asistencia, setAsistencia] = useState("");
  const [restriccion,setRestriccion]= useState("");
  const [enviado,    setEnviado]    = useState(false);
  const [enviando,   setEnviando]   = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async () => {
    if (!nombre.trim() || !asistencia) {
      setError("Completá tu nombre y confirmá asistencia.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      // Contrato RSVP v2 (FASE 25, docs/CONTRATO_RSVP_V2.md §5-§8). El estado
      // interno `asistencia` sigue guardando el string legible del radio —
      // solo se traduce acá, al armar el request.
      const ASISTENCIA_V2 = {
        "Sí, voy a estar": "si",
        "No voy a poder":  "no",
      };
      const url = new URL(config.apps_script_url);
      url.searchParams.set("action",        "rsvp");
      url.searchParams.set("nombre",        nombre.trim());
      url.searchParams.set("asistencia",    ASISTENCIA_V2[asistencia] || "");
      url.searchParams.set("restricciones", restriccion.trim() || "Ninguna");
      url.searchParams.set("sheet_id",      config.sheet_id || "");
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
        background: C.negro,
        padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      }}>
        <div style={{ maxWidth: "36rem" }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
          }}>CONFIRMACIÓN RECIBIDA</p>
          <h2 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(2rem, 5vw, 4rem)",
            lineHeight:    0.95,
            letterSpacing: "0.02em",
            color:         C.champagne,
            marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
          }}>
            ¡GRACIAS,<br />{nombre.toUpperCase()}!
          </h2>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.06em",
            lineHeight:    1.7,
          }}>Tu confirmación quedó registrada. ¡Nos vemos en la fiesta!</p>
        </div>
      </section>
    );
  }

  const inputStyle = {
    width:         "100%",
    background:    "transparent",
    border:        "none",
    borderBottom:  `1px solid ${C.taupe}55`,
    padding:       "0.65rem 0",
    fontFamily:    "'Cormorant Garamond', serif",
    fontSize:      "clamp(0.9rem, 1.5vw, 1rem)",
    fontWeight:    300,
    color:         C.crema,
    letterSpacing: "0.04em",
    outline:       "none",
    transition:    "border-color 0.2s",
  };

  return (
    <section style={{
      background: C.negro,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
    }}>
      <div style={{ maxWidth: "36rem" }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}>CONFIRMÁ TU ASISTENCIA</p>

        <h2 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(2.2rem, 5.5vw, 4.5rem)",
          lineHeight:    0.95,
          letterSpacing: "0.02em",
          color:         C.crema,
          marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}>
          ANTES DEL<br />{config.confirmacion_limite?.toUpperCase()}
        </h2>

        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.taupe,
          letterSpacing: "0.06em",
          lineHeight:    1.7,
          marginBottom:  "clamp(2.5rem, 5vw, 4rem)",
        }}>Necesito saber si vas a poder acompañarme en esta noche.</p>

        {/* Campo nombre */}
        <div style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.48rem, 0.85vw, 0.58rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.5rem",
          }}>NOMBRE Y APELLIDO</p>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderBottomColor = C.champagne}
            onBlur={e  => e.currentTarget.style.borderBottomColor = `${C.taupe}55`}
          />
        </div>

        {/* Asistencia */}
        <div style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.48rem, 0.85vw, 0.58rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
          }}>¿ASISTÍS?</p>
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
                  style={{ accentColor: C.champagne }}
                />
                <span style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "clamp(0.85rem, 1.4vw, 1rem)",
                  fontWeight:    300,
                  color:         asistencia === opcion ? C.crema : C.taupe,
                  letterSpacing: "0.04em",
                  transition:    "color 0.2s",
                }}>{opcion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Restricción alimentaria */}
        <div style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.48rem, 0.85vw, 0.58rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.5rem",
          }}>RESTRICCIÓN ALIMENTARIA (OPCIONAL)</p>
          <input
            type="text"
            value={restriccion}
            onChange={e => setRestriccion(e.target.value)}
            placeholder="Vegetariano, celíaco, etc."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderBottomColor = C.champagne}
            onBlur={e  => e.currentTarget.style.borderBottomColor = `${C.taupe}55`}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.8rem, 1.3vw, 0.9rem)",
            fontWeight:    300,
            color:         "#E87C6A",
            letterSpacing: "0.04em",
            marginBottom:  "1.25rem",
          }}>{error}</p>
        )}

        {/* Botón */}
        <button
          onClick={handleSubmit}
          disabled={enviando}
          style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.6rem, 1.1vw, 0.72rem)",
            letterSpacing: "0.4em",
            background:    enviando ? C.mocha : C.crema,
            color:         C.negro,
            border:        "none",
            padding:       "0.9em 2.5em",
            cursor:        enviando ? "wait" : "pointer",
            transition:    "background 0.2s",
          }}
          onMouseEnter={e => { if (!enviando) e.currentTarget.style.background = C.champagne; }}
          onMouseLeave={e => { if (!enviando) e.currentTarget.style.background = C.crema; }}
        >
          {enviando ? "ENVIANDO..." : "CONFIRMAR ASISTENCIA"}
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmadosSection
// Listado en tiempo real via polling Apps Script.
// Fuente funcional: P1.jsx ConfirmadosSection, instanciación Con Carácter.
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

  const van  = confirmados.filter(c => c.asistencia === "Sí, voy a estar");
  const noVan= confirmados.filter(c => c.asistencia === "No voy a poder");

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
      borderTop:  `2px solid ${C.negro}`,
    }}>
      {/* Header Negro — quiebre estructural */}
      <div style={{
        display:      "flex",
        alignItems:   "baseline",
        gap:          "1.5rem",
        marginBottom: "clamp(2.5rem, 5vw, 4rem)",
      }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(1.4rem, 3vw, 2.2rem)",
          letterSpacing: "0.05em",
          color:         C.negro,
          lineHeight:    1,
          margin:        0,
        }}>CONFIRMADOS</p>
        <div style={{ flex: 1, height: "1px", background: C.negro, opacity: 0.15 }} />
        {!cargando && (
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
          }}>{van.length} ASISTEN</p>
        )}
      </div>

      {cargando ? (
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.taupe,
          letterSpacing: "0.06em",
        }}>Cargando confirmaciones...</p>
      ) : confirmados.length === 0 ? (
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.taupe,
          letterSpacing: "0.06em",
        }}>Aún no hay confirmaciones.</p>
      ) : (
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(10rem, 25vw, 16rem), 1fr))",
          gap:                 "clamp(0.5rem, 1.5vw, 1rem)",
        }}>
          {van.map((c, i) => (
            <div key={i} style={{
              borderLeft:  `2px solid ${C.negro}`,
              paddingLeft: "clamp(0.75rem, 1.5vw, 1rem)",
              paddingTop:  "0.25rem",
              paddingBottom:"0.25rem",
            }}>
              <p style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      "clamp(0.8rem, 1.4vw, 1rem)",
                letterSpacing: "0.04em",
                color:         C.negro,
                lineHeight:    1.1,
                margin:        0,
              }}>{c.nombre}</p>
              {c.restriccion && c.restriccion !== "Ninguna" && (
                <p style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "clamp(0.7rem, 1.1vw, 0.8rem)",
                  fontWeight:    300,
                  color:         C.taupe,
                  letterSpacing: "0.04em",
                  marginTop:     "0.15rem",
                }}>{c.restriccion}</p>
              )}
            </div>
          ))}
          {noVan.map((c, i) => (
            <div key={`no-${i}`} style={{
              borderLeft:  `2px solid ${C.taupe}55`,
              paddingLeft: "clamp(0.75rem, 1.5vw, 1rem)",
              paddingTop:  "0.25rem",
              paddingBottom:"0.25rem",
              opacity:     0.55,
            }}>
              <p style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      "clamp(0.8rem, 1.4vw, 1rem)",
                letterSpacing: "0.04em",
                color:         C.mocha,
                lineHeight:    1.1,
                margin:        0,
              }}>{c.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// Fuente directa: S2.jsx Footer. Sin modificaciones.
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ config }) {
  return (
    <footer style={{
      background:     C.crema,
      borderTop:      `2px solid ${C.negro}`,
      padding:        "clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 5vw, 4rem)",
      display:        "flex",
      alignItems:     "baseline",
      justifyContent: "space-between",
      gap:            "1rem",
      flexWrap:       "wrap",
    }}>
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(1.4rem, 3.5vw, 2.2rem)",
        letterSpacing: "0.05em",
        color:         C.negro,
        lineHeight:    1,
        margin:        0,
      }}>{config.nombre}</p>
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(0.5rem, 0.9vw, 0.62rem)",
        letterSpacing: "0.4em",
        color:         C.taupe,
      }}>{config.fecha_display} · {config.hora}</p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// P2 — Root
// Orden de secciones:
//   STANDARD: Cover → Hero → EventSection → MusicSection → GiftsSection
//   PREMIUM+:  HistoriaSection → TimelineSection → FotosSection →
//              ItinerarioSection → ConfirmSection → ConfirmadosSection
//   CIERRE:    Footer
// ─────────────────────────────────────────────────────────────────────────────
export default function P2() {
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.crema}; }
        input::placeholder { color: ${C.taupe}55; }
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
