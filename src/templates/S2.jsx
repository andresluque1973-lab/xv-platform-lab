import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// S2.jsx — S2.2
// Familia: Con Carácter · Variante: STANDARD
// FASE 13 — S2.2: bloque 55% (V-B aprobada sobre S2.1).
//
// COMPATIBILIDAD DE PREVIEW
// En producción: consume useConfig(slug) vía window.__VELA_CONFIG__ inyectado
// por el TemplateLoader, o hace fetch directo si el hook está disponible.
// En preview de Claude: usa MOCK_CONFIG definido abajo.
//
// Para usar en producción, reemplazar la línea:
//   const { config } = useConfigCompat(slug);
// por:
//   const { config, error } = useConfig(slug);
// y agregar el import correspondiente.
//
// Roles demostrados (AUDITORIA_S2.md):
//   Paleta      → Afirmación cromática
//   Tipografía  → Tipografía con intención identitaria (Bebas Neue)
//   Composición → Quiebre compositivo localizable
//   Movimiento  → Postura en acto
//
// Paleta oficial VELA — los 5 colores, sin extensión:
//   #F8F5EF  Crema suave  → Campo (superficie dominante)
//   #1A1A1A  Negro cálido → Afirmación cromática (bloque asimétrico)
//   #8B7355  Mocha        → Tipografía con carácter / acento
//   #B9A68E  Taupe        → Soporte / texto secundario
//   #E6D3A8  Champagne    → Acento puntual de jerarquía
//
// Infraestructura intacta: templateRegistry, TemplateLoader, useConfig, S1.
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
// En producción este bloque no se ejecuta — el config viene de useConfig(slug).
const MOCK_CONFIG = {
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
    descripcion: "Elegante",
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
  whatsapp_url: "https://wa.me/5491100000000?text=Confirmo%20mi%20asistencia",
};

// ── Compatibilidad producción / preview ───────────────────────────────────────
// En producción: importar useConfig y reemplazar este hook por el real.
// En preview: usa MOCK_CONFIG directamente.
function useConfigCompat(slug) {
  const [config, setConfig] = useState(null);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    // Si hay config inyectado por el entorno (producción vía TemplateLoader)
    if (window.__VELA_CONFIG__) {
      setConfig(window.__VELA_CONFIG__);
      return;
    }
    // Intento de fetch real (producción normal)
    fetch(`/clientes/${slug}/config.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setConfig)
      .catch(() => {
        // Fallback a mock (preview de Claude u otros entornos sin servidor)
        setConfig(MOCK_CONFIG);
      });
  }, [slug]);

  return { config, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useCountdown
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover
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
    <div
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     50,
        display:    "flex",
        overflow:   "hidden",
        background: C.crema,
      }}
    >
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
        position:      "relative",
        zIndex:        2,
        width:         "100%",
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        padding:       "clamp(2rem, 5vw, 4rem)",
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
          flex:          1,
          display:       "flex",
          flexDirection: "column",
          justifyContent:"center",
          paddingTop:    "clamp(3rem, 8vw, 6rem)",
        }}>
          {/* Etiqueta MIS XV — lado derecho */}
          <div style={{
            marginLeft:  "40%",
            marginBottom:"clamp(1rem, 2vw, 1.5rem)",
            opacity:     textVis ? 1 : 0,
            transform:   textVis ? "translateY(0)" : "translateY(12px)",
            transition:  "all 0.7s ease",
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

          {/* Frase + botón — lado derecho del campo Crema */}
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
                background:    "transparent",
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
                e.currentTarget.style.background = "transparent";
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
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  const cd = useCountdown(config.contador);

  return (
    <section style={{
      position:      "relative",
      minHeight:     "100svh",
      background:    C.crema,
      display:       "flex",
      flexDirection: "column",
      overflow:      "hidden",
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
        position:      "relative",
        zIndex:        3,
        flex:          1,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        padding:       "clamp(2rem, 5vw, 4rem)",
        paddingTop:    "clamp(3rem, 7vw, 5rem)",
      }}>
        {/* Nombre sobre bloque Negro */}
        <div style={{
          width:      "55%",
          paddingRight:"clamp(0.75rem, 1.5vw, 1.25rem)",
          opacity:    vis ? 1 : 0,
          transform:  vis ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
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

        {/* Frase — pie campo Crema */}
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

      {/* Grid 38/62 */}
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
// MusicSection
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
// ConfirmSection — WhatsApp (contrato STANDARD)
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
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
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
        }}>Necesito saber si vas a poder acompañarme en esta noche.</p>
        <a
          href={config.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        "inline-block",
            fontFamily:     "'Bebas Neue', sans-serif",
            fontSize:       "clamp(0.6rem, 1.1vw, 0.72rem)",
            letterSpacing:  "0.4em",
            background:     C.crema,
            color:          C.negro,
            padding:        "0.9em 2.5em",
            textDecoration: "none",
            transition:     "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.champagne}
          onMouseLeave={e => e.currentTarget.style.background = C.crema}
        >CONFIRMAR POR WHATSAPP</a>
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
// S2 — Root
// ─────────────────────────────────────────────────────────────────────────────
export default function S2() {
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
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        <source src={config.musica?.src} type="audio/mpeg" />
      </audio>

      {!entered && <Cover config={config} onEnter={handleEnter} />}

      {entered && (
        <main>
          <HeroSection    config={config} />
          <EventSection   config={config} />
          <MusicSection   config={config} playing={playing} onToggle={handleToggle} />
          <GiftsSection   config={config} />
          <ConfirmSection config={config} />
          <Footer         config={config} />
        </main>
      )}
    </>
  );
}
