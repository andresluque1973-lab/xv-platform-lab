import { useState, useEffect, useRef } from "react";
import { useConfig } from "../hooks/useConfig";

// ─────────────────────────────────────────────────────────────────────────────
// S2.jsx — Propuesta experimental S2.1
// Familia: Con Carácter · Variante: STANDARD
// FASE 13 — Instanciación de validación. No comprometida como definitiva.
//
// Roles a demostrar (AUDITORIA_S2.md):
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
//
// Composición: campo Crema dominante + bloque Negro cálido que llega como
// acontecimiento (Postura en acto). El bloque entra después del texto,
// no es fondo preexistente.
//
// Quiebre: el bloque Negro ocupa el lado izquierdo en proporción inusual
// (~38% del ancho) rompiendo la simetría esperada de una pantalla de cover.
// ─────────────────────────────────────────────────────────────────────────────
function Cover({ config, onEnter }) {
  const [textVis,  setTextVis]  = useState(false);
  const [blockVis, setBlockVis] = useState(false);

  useEffect(() => {
    // Texto aparece primero
    const t1 = setTimeout(() => setTextVis(true),  150);
    // Bloque llega después — acontecimiento localizable en el tiempo
    const t2 = setTimeout(() => setBlockVis(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-hidden"
      style={{ background: C.crema }}
    >
      {/* ── Bloque Negro — Afirmación cromática + Quiebre compositivo ── */}
      {/*    Llega como acontecimiento: Postura en acto                   */}
      <div
        style={{
          position:   "absolute",
          left:       0,
          top:        0,
          bottom:     0,
          width:      "38%",
          background: C.negro,
          // Entra desde la izquierda como suceso, no como fondo
          transform:  blockVis ? "translateX(0)"    : "translateX(-100%)",
          transition: "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)",
          zIndex:     1,
        }}
      />

      {/* ── Contenido — sobre el campo Crema ── */}
      <div
        className="relative flex flex-col justify-between w-full h-full"
        style={{ zIndex: 2, padding: "clamp(2rem, 5vw, 4rem)" }}
      >
        {/* Etiqueta superior izquierda — dentro del bloque Negro */}
        <div
          style={{
            position:   "absolute",
            left:       "clamp(1.5rem, 3vw, 3rem)",
            top:        "clamp(2rem, 4vw, 3.5rem)",
            opacity:    blockVis ? 1 : 0,
            transition: "opacity 0.5s ease 1s",
            zIndex:     3,
          }}
        >
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.6rem, 1.2vw, 0.75rem)",
            letterSpacing: "0.4em",
            color:         C.taupe,
          }}>
            VELA
          </p>
        </div>

        {/* Contenido central */}
        <div
          className="flex flex-col justify-center"
          style={{
            flex:       1,
            paddingLeft: "clamp(2rem, 5vw, 4rem)",
            paddingTop:  "clamp(3rem, 8vw, 6rem)",
          }}
        >
          {/* Línea de contexto — sobre campo Crema, lado derecho */}
          <div
            style={{
              marginLeft:  "40%",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
              opacity:     textVis ? 1 : 0,
              transform:   textVis ? "translateY(0)" : "translateY(12px)",
              transition:  "all 0.7s ease",
            }}
          >
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(0.65rem, 1.3vw, 0.8rem)",
              letterSpacing: "0.45em",
              color:         C.taupe,
            }}>
              MIS XV
            </p>
          </div>

          {/* Nombre — cruza el quiebre: visible sobre ambas superficies */}
          <div
            style={{
              opacity:    textVis ? 1 : 0,
              transform:  textVis ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            <h1
              style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      "clamp(5rem, 18vw, 14rem)",
                lineHeight:    0.88,
                letterSpacing: "0.02em",
                color:         C.crema,
                // El nombre cruza desde el negro hacia el crema —
                // el color se invierte visualmente en el límite del bloque.
                // Logrado con mix-blend-mode: difference sobre el bloque.
                mixBlendMode:  "difference",
                userSelect:    "none",
              }}
            >
              {config.nombre}
            </h1>
          </div>

          {/* Frase + botón — lado derecho del campo Crema */}
          <div
            style={{
              marginLeft:  "40%",
              marginTop:   "clamp(2rem, 4vw, 3rem)",
              opacity:     textVis ? 1 : 0,
              transform:   textVis ? "translateY(0)" : "translateY(12px)",
              transition:  "all 0.7s ease 0.25s",
            }}
          >
            <p style={{
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(0.85rem, 1.6vw, 1rem)",
              fontWeight:    300,
              letterSpacing: "0.08em",
              color:         C.mocha,
              marginBottom:  "clamp(2rem, 4vw, 3rem)",
              lineHeight:    1.6,
            }}>
              {config.subtitulo}
            </p>

            <button
              onClick={onEnter}
              style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      "clamp(0.7rem, 1.3vw, 0.8rem)",
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
            >
              INGRESAR
            </button>
          </div>
        </div>

        {/* Fecha — pie, lado derecho */}
        <div
          style={{
            marginLeft:  "40%",
            opacity:     textVis ? 1 : 0,
            transition:  "opacity 0.6s ease 0.4s",
          }}
        >
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.65rem, 1.2vw, 0.75rem)",
            letterSpacing: "0.4em",
            color:         C.taupe,
          }}>
            {config.fecha_display}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
//
// Campo Crema con bloque Negro asimétrico persistente.
// Countdown sobre el campo claro.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  const cd = useCountdown(config.contador);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight:  "100svh",
        background: C.crema,
        display:    "flex",
        flexDirection: "column",
      }}
    >
      {/* Bloque Negro — Afirmación cromática persistente */}
      <div style={{
        position:   "absolute",
        left:       0,
        top:        0,
        bottom:     0,
        width:      "38%",
        background: C.negro,
        zIndex:     1,
      }} />

      {/* Línea separadora Champagne — jerarquía sin ornamento */}
      <div style={{
        position:   "absolute",
        left:       "38%",
        top:        0,
        bottom:     0,
        width:      "2px",
        background: C.champagne,
        zIndex:     2,
        opacity:    0.6,
      }} />

      {/* Contenido */}
      <div
        className="relative"
        style={{
          zIndex:  3,
          flex:    1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(2rem, 5vw, 4rem)",
          paddingTop: "clamp(3rem, 8vw, 5rem)",
        }}
      >
        {/* Nombre sobre bloque Negro */}
        <div style={{
          width:      "38%",
          paddingRight: "clamp(1rem, 2vw, 1.5rem)",
          opacity:    vis ? 1 : 0,
          transform:  vis ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <h2 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight:    0.9,
            letterSpacing: "0.02em",
            color:         C.crema,
            wordBreak:     "break-word",
          }}>
            {config.nombre}
          </h2>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.7rem, 1.3vw, 0.85rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.12em",
            marginTop:     "1rem",
          }}>
            {config.dia_semana}<br />
            {config.fecha_larga}<br />
            {config.anio}
          </p>
        </div>

        {/* Countdown — lado derecho del campo Crema */}
        <div
          style={{
            marginLeft:  "calc(38% + 2rem)",
            opacity:     vis ? 1 : 0,
            transform:   vis ? "translateY(0)" : "translateY(16px)",
            transition:  "all 0.9s ease 0.2s",
          }}
        >
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.6rem, 1.1vw, 0.7rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "clamp(1rem, 2.5vw, 1.5rem)",
          }}>
            FALTAN
          </p>
          <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", alignItems: "baseline" }}>
            {[
              { val: cd.days,    label: "DÍAS"    },
              { val: cd.hours,   label: "HORAS"   },
              { val: cd.minutes, label: "MIN"      },
              { val: cd.seconds, label: "SEG"      },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "clamp(2.5rem, 6vw, 4.5rem)",
                  lineHeight:    1,
                  color:         C.negro,
                  letterSpacing: "0.02em",
                }}>
                  {String(item.val ?? 0).padStart(2, "0")}
                </div>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "clamp(0.5rem, 0.9vw, 0.6rem)",
                  letterSpacing: "0.4em",
                  color:         C.taupe,
                  marginTop:     "0.25rem",
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frase — pie derecho */}
        <div
          style={{
            marginLeft:  "calc(38% + 2rem)",
            opacity:     vis ? 1 : 0,
            transition:  "opacity 0.8s ease 0.4s",
          }}
        >
          <div style={{
            width:        "2.5rem",
            height:       "1px",
            background:   C.mocha,
            marginBottom: "1rem",
            opacity:      0.5,
          }} />
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.7vw, 1.1rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.06em",
            lineHeight:    1.65,
            maxWidth:      "28rem",
          }}>
            {config.subtitulo}
          </p>
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
      {/* Banda Champagne superior — jerarquía de sección */}
      <div style={{
        background: C.negro,
        padding:    "clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 5vw, 4rem)",
        display:    "flex",
        alignItems: "baseline",
        gap:        "2rem",
      }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(1.8rem, 4vw, 2.8rem)",
          letterSpacing: "0.05em",
          color:         C.crema,
          lineHeight:    1,
        }}>
          EL EVENTO
        </p>
        <div style={{ flex: 1, height: "1px", background: C.mocha, opacity: 0.4 }} />
      </div>

      {/* Grid de información */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "38% 1fr",
      }}>
        {/* Celda izquierda — sobre campo implícito Negro */}
        <div style={{
          background: C.negro,
          padding:    "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)",
          borderRight: `2px solid ${C.champagne}`,
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "1.25rem",
          }}>
            CUÁNDO
          </p>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(1.6rem, 3.5vw, 2.5rem)",
            lineHeight:    1,
            color:         C.crema,
            letterSpacing: "0.03em",
            marginBottom:  "0.5rem",
          }}>
            {config.fecha_larga}
          </p>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.8rem, 1.5vw, 0.95rem)",
            fontWeight:    300,
            color:         C.taupe,
            letterSpacing: "0.1em",
          }}>
            {config.dia_semana} · {config.hora}
          </p>
        </div>

        {/* Celda derecha — campo Crema */}
        <div style={{
          padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)",
        }}>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "1.25rem",
          }}>
            DÓNDE
          </p>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(1.4rem, 3vw, 2.2rem)",
            lineHeight:    1.1,
            color:         C.negro,
            letterSpacing: "0.03em",
            marginBottom:  "1rem",
          }}>
            {config.lugar?.nombre}
          </p>
          <a
            href={config.lugar?.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily:     "'Bebas Neue', sans-serif",
              fontSize:       "clamp(0.6rem, 1.1vw, 0.7rem)",
              letterSpacing:  "0.4em",
              color:          C.mocha,
              textDecoration: "none",
              borderBottom:   `1px solid ${C.mocha}`,
              paddingBottom:  "0.15em",
            }}
          >
            CÓMO LLEGAR
          </a>

          {/* Dress code */}
          <div style={{ marginTop: "clamp(1.5rem, 3vw, 2.5rem)", paddingTop: "clamp(1.5rem, 3vw, 2.5rem)", borderTop: `1px solid ${C.champagne}` }}>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
              letterSpacing: "0.45em",
              color:         C.taupe,
              marginBottom:  "0.75rem",
            }}>
              DRESS CODE
            </p>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(1.2rem, 2.5vw, 1.8rem)",
              color:         C.negro,
              letterSpacing: "0.04em",
              lineHeight:    1,
            }}>
              {config.dress_code?.descripcion}
            </p>
            {config.dress_code?.aclaracion && (
              <p style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(0.75rem, 1.3vw, 0.85rem)",
                fontWeight:    300,
                color:         C.taupe,
                letterSpacing: "0.08em",
                marginTop:     "0.4rem",
              }}>
                {config.dress_code.aclaracion}
              </p>
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
      padding:     "clamp(2.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)",
      display:     "flex",
      alignItems:  "center",
      gap:         "clamp(1.5rem, 3vw, 2.5rem)",
      borderTop:   `1px solid rgba(230,211,168,0.2)`,
    }}>
      <button
        onClick={onToggle}
        style={{
          width:        "3rem",
          height:       "3rem",
          border:       `1px solid ${playing ? C.champagne : C.mocha}`,
          background:   "transparent",
          color:        playing ? C.champagne : C.mocha,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          fontSize:     "0.9rem",
          flexShrink:   0,
          transition:   "border-color 0.2s, color 0.2s",
        }}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          marginBottom:  "0.35rem",
        }}>
          MÚSICA
        </p>
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.crema,
          letterSpacing: "0.06em",
        }}>
          {config.musica?.nombre}
        </p>
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(26,26,26,0.88)", backdropFilter: "blur(4px)" }}
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
                fontSize:   "1.2rem",
                lineHeight: 1,
              }}
            >×</button>
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      "clamp(1.2rem, 2.5vw, 1.6rem)",
              letterSpacing: "0.08em",
              color:         C.negro,
              marginBottom:  "clamp(1.5rem, 3vw, 2rem)",
            }}>
              REGALOS
            </p>
            {config.regalo.alias && (
              <div style={{ marginBottom: "1rem" }}>
                <p style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "0.6rem",
                  letterSpacing: "0.45em",
                  color:         C.taupe,
                  marginBottom:  "0.4rem",
                }}>
                  ALIAS
                </p>
                <p style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "1.1rem",
                  color:         C.negro,
                  letterSpacing: "0.08em",
                  userSelect:    "all",
                }}>
                  {config.regalo.alias}
                </p>
              </div>
            )}
            {config.regalo.cvu && (
              <div style={{ borderTop: `1px solid ${C.champagne}`, paddingTop: "1rem" }}>
                <p style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "0.6rem",
                  letterSpacing: "0.45em",
                  color:         C.taupe,
                  marginBottom:  "0.4rem",
                }}>
                  CVU
                </p>
                <p style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontSize:      "0.85rem",
                  color:         C.mocha,
                  wordBreak:     "break-all",
                  userSelect:    "all",
                }}>
                  {config.regalo.cvu}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <section style={{
        background:  C.crema,
        padding:     "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
        borderTop:   `1px solid ${C.champagne}`,
        display:     "flex",
        alignItems:  "center",
        justifyContent: "space-between",
        gap:         "2rem",
        flexWrap:    "wrap",
      }}>
        <div>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.45em",
            color:         C.taupe,
            marginBottom:  "0.75rem",
          }}>
            REGALOS
          </p>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(0.9rem, 1.6vw, 1.05rem)",
            fontWeight:    300,
            color:         C.mocha,
            letterSpacing: "0.06em",
            lineHeight:    1.6,
            maxWidth:      "28rem",
          }}>
            Tu presencia es lo que más importa. Si querés hacerme un regalo, podés hacerlo por transferencia.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      "clamp(0.65rem, 1.2vw, 0.75rem)",
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
        >
          VER DATOS
        </button>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSection
// Confirmación vía WhatsApp — contrato STANDARD
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  return (
    <section style={{
      background: C.negro,
      padding:    "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4rem)",
    }}>
      {/* Quiebre en la sección de confirmación: */}
      {/* el bloque de acción rompe el eje central con alineación izquierda */}
      <div style={{ maxWidth: "36rem" }}>
        <p style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
          letterSpacing: "0.45em",
          color:         C.taupe,
          marginBottom:  "clamp(1rem, 2vw, 1.5rem)",
        }}>
          CONFIRMÁ TU ASISTENCIA
        </p>
        <h2 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      "clamp(2.5rem, 6vw, 4.5rem)",
          lineHeight:    0.95,
          letterSpacing: "0.02em",
          color:         C.crema,
          marginBottom:  "clamp(1rem, 2.5vw, 1.75rem)",
        }}>
          ANTES DEL<br />{config.confirmacion_limite}
        </h2>
        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(0.85rem, 1.5vw, 1rem)",
          fontWeight:    300,
          color:         C.taupe,
          letterSpacing: "0.06em",
          lineHeight:    1.7,
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
        }}>
          Necesito saber si vas a poder acompañarme en esta noche.
        </p>
        <a
          href={config.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        "inline-block",
            fontFamily:     "'Bebas Neue', sans-serif",
            fontSize:       "clamp(0.65rem, 1.2vw, 0.75rem)",
            letterSpacing:  "0.4em",
            background:     C.crema,
            color:          C.negro,
            padding:        "0.9em 2.5em",
            textDecoration: "none",
            transition:     "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.champagne;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = C.crema;
          }}
        >
          CONFIRMAR POR WHATSAPP
        </a>
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
      background:  C.crema,
      borderTop:   `2px solid ${C.negro}`,
      padding:     "clamp(2rem, 4vw, 3rem) clamp(2rem, 5vw, 4rem)",
      display:     "flex",
      alignItems:  "baseline",
      justifyContent: "space-between",
      gap:         "1rem",
      flexWrap:    "wrap",
    }}>
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(1.5rem, 4vw, 2.5rem)",
        letterSpacing: "0.05em",
        color:         C.negro,
        lineHeight:    1,
      }}>
        {config.nombre}
      </p>
      <p style={{
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(0.55rem, 1vw, 0.65rem)",
        letterSpacing: "0.4em",
        color:         C.taupe,
      }}>
        {config.fecha_display} · {config.hora}
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// S2 — Root
// ─────────────────────────────────────────────────────────────────────────────
export default function S2() {
  const slug   = window.location.pathname.split("/")[1] || "prueba";
  const { config, error } = useConfig(slug);

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

  if (!config && !error) return null;

  if (error) {
    return (
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        minHeight:      "100vh",
        background:     C.crema,
        color:          C.mocha,
        fontFamily:     "'Cormorant Garamond', serif",
        textAlign:      "center",
        padding:        "2rem",
      }}>
        <p>No se pudo cargar la invitación.</p>
      </div>
    );
  }

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
