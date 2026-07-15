import { useState, useEffect, useRef } from "react";

import { useCountdown } from "./shared/hooks";
import { useConfig } from "../hooks/useConfig";

// ─────────────────────────────────────────────────────────────────────────────
// S3.jsx — S3.1
// Familia: Elegante · Variante: STANDARD
// FASE 15 — primera implementación de Elegante.
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
// Roles demostrados (pendiente auditoría formal):
//   Paleta      → Cohesión tonal
//   Tipografía  → Tipografía proporcional
//   Composición → Espacio sin sobrante
//   Movimiento  → Movimiento al servicio
//
// Paleta oficial VELA — los 5 colores, función en Elegante:
//   #F8F5EF  Crema suave  → Superficie dominante (campo)
//   #E6D3A8  Champagne    → Superficie secundaria / separación tonal sutil
//   #B9A68E  Taupe        → Texto secundario / labels
//   #8B7355  Mocha        → Jerarquía tipográfica principal
//   #1A1A1A  Negro cálido → Acento tipográfico puntual únicamente
//                           NO existe como bloque estructural ni superficie
//
// Diferenciadores de familia:
//   Sin bloque de borde duro (≠ Con Carácter)
//   Sin gradiente atmosférico profundo (≠ Emotiva)
//   El espacio es el organizador visual — no el color
//
// Infraestructura intacta: templateRegistry, TemplateLoader, useConfig, S1, S2.
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
    maps_url: "https://maps.google.com/?q=Espacio+1805",
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
  whatsapp_url: "https://wa.me/5491100000000?text=Confirmo%20mi%20asistencia",
  fotos: null,
  // Para activar GallerySection, reemplazar fotos por:
  // fotos: ["/clientes/valentina/foto1.jpg", "/clientes/valentina/foto2.jpg"]
};

// ── Compatibilidad producción / preview ───────────────────────────────────────
// En producción: importar useConfig y reemplazar este hook por el real.
// En preview: usa MOCK_CONFIG directamente.
function useConfigCompat(slug) {
  return useConfig(slug);
}

// ── Utilidad: línea divisoria ─────────────────────────────────────────────────
// Separador tonal entre secciones — reemplaza el contraste cromático fuerte.
// No existe como gesto; existe para que el ritmo sea legible.
function Divider() {
  return (
    <div style={{
      width:           "clamp(3rem, 8vw, 5rem)",
      height:          "1px",
      background:      C.taupe,
      margin:          "0 auto",
      opacity:         0.5,
    }} />
  );
}

// ── Utilidad: label de sección ────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily:    "'Inter', sans-serif",
      fontSize:      "clamp(0.55rem, 0.9vw, 0.65rem)",
      fontWeight:    500,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color:         C.taupe,
      marginBottom:  "clamp(1.5rem, 3vw, 2.5rem)",
    }}>{children}</p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover — pantalla de entrada
// Fade breve al aparecer. El movimiento sirve al contenido, no al gesto.
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

      {/* Nombre protagonista */}
      <h1 style={{
        fontFamily:   "'Cormorant Garamond', serif",
        fontSize:     "clamp(4rem, 14vw, 9rem)",
        fontWeight:   300,
        lineHeight:   0.92,
        letterSpacing: "0.01em",
        color:        C.mocha,
        marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
      }}>
        {config.nombre}
      </h1>

      {/* Título del evento */}
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

      {/* Fecha */}
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

      {/* CTA entrada */}
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
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const { days, hours, minutes, seconds } = useCountdown(config.contador);

  return (
    <section style={{
      background:    C.crema,
      padding:       "clamp(5rem, 12vw, 9rem) clamp(2rem, 6vw, 4rem)",
      textAlign:     "center",
    }}>

      {/* Subtítulo */}
      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontSize:      "clamp(1rem, 2vw, 1.3rem)",
        fontWeight:    300,
        fontStyle:     "italic",
        letterSpacing: "0.05em",
        color:         C.taupe,
        marginBottom:  "clamp(3rem, 7vw, 5rem)",
        maxWidth:      "30rem",
        margin:        "0 auto clamp(3rem, 7vw, 5rem)",
        lineHeight:    1.6,
      }}>
        {config.subtitulo}
      </p>

      <Divider />

      {/* Countdown */}
      <div style={{
        marginTop:      "clamp(3rem, 7vw, 5rem)",
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
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventSection — lugar + hora + dress code
// ─────────────────────────────────────────────────────────────────────────────
function EventSection({ config }) {
  return (
    <section style={{
      background: C.champagne,
      padding:    "clamp(4rem, 10vw, 7rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "36rem", margin: "0 auto" }}>

        <SectionLabel>El evento</SectionLabel>

        {/* Lugar */}
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <p style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight:    400,
            color:         C.negro,
            letterSpacing: "0.02em",
            lineHeight:    1.2,
            marginBottom:  "0.5rem",
          }}>
            {config.lugar?.nombre}
          </p>
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

        <Divider />

        {/* Dress code */}
        {config.dress_code && (
          <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
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
                color:         C.taupe,
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
// GallerySection — condicional: solo renderiza si config.fotos existe y tiene items
// Si no hay fotos, esta sección no existe en el layout. Sin placeholder.
// ─────────────────────────────────────────────────────────────────────────────
function GallerySection({ config }) {
  const fotos = config.fotos;
  if (!fotos || fotos.length === 0) return null;

  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(4rem, 10vw, 7rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto" }}>

        <SectionLabel>Momentos</SectionLabel>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(10rem, 28vw, 14rem), 1fr))",
          gap:                 "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}>
          {fotos.map((src, i) => (
            <div
              key={i}
              style={{
                aspectRatio:    "3 / 4",
                overflow:       "hidden",
                background:     C.champagne,
              }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  display:    "block",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MusicSection — reproductor mínimo
// ─────────────────────────────────────────────────────────────────────────────
function MusicSection({ config, playing, onToggle }) {
  return (
    <section style={{
      background: C.crema,
      padding:    "clamp(3rem, 7vw, 5rem) clamp(2rem, 6vw, 4rem)",
      borderTop:  `1px solid ${C.champagne}`,
    }}>
      <div style={{
        maxWidth:      "36rem",
        margin:        "0 auto",
        display:       "flex",
        alignItems:    "center",
        justifyContent: "space-between",
        gap:           "1.5rem",
        flexWrap:      "wrap",
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
// ─────────────────────────────────────────────────────────────────────────────
function GiftsSection({ config }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:        "fixed",
            inset:           0,
            background:      "rgba(26,26,26,0.55)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            zIndex:          100,
            padding:         "1.5rem",
            opacity:         1,
            transition:      "opacity 0.3s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:   C.crema,
              padding:      "clamp(2rem, 5vw, 3.5rem)",
              maxWidth:     "26rem",
              width:        "100%",
              position:     "relative",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position:   "absolute",
                top:        "1.25rem",
                right:      "1.25rem",
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                color:      C.taupe,
                fontFamily: "'Inter', sans-serif",
                fontSize:   "0.8rem",
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
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      "clamp(1.4rem, 3vw, 2rem)",
              fontWeight:    400,
              color:         C.negro,
              marginBottom:  "0.4rem",
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
        borderTop:  `1px solid ${C.champagne}`,
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
            <SectionLabel>Regalos</SectionLabel>
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
// ConfirmSection — RSVP vía WhatsApp
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  return (
    <section style={{
      background: C.champagne,
      padding:    "clamp(5rem, 12vw, 9rem) clamp(2rem, 6vw, 4rem)",
    }}>
      <div style={{ maxWidth: "32rem", margin: "0 auto", textAlign: "center" }}>

        <SectionLabel>Confirmá tu asistencia</SectionLabel>

        <p style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      "clamp(1.8rem, 4.5vw, 3rem)",
          fontWeight:    300,
          lineHeight:    1.15,
          letterSpacing: "0.02em",
          color:         C.negro,
          marginBottom:  "clamp(0.75rem, 1.5vw, 1.25rem)",
        }}>
          Antes del<br />
          <span style={{ fontWeight: 400, color: C.mocha }}>
            {config.confirmacion_limite}
          </span>
        </p>

        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      "clamp(0.8rem, 1.4vw, 0.9rem)",
          fontWeight:    400,
          color:         C.taupe,
          letterSpacing: "0.03em",
          lineHeight:    1.7,
          marginBottom:  "clamp(2.5rem, 5vw, 4rem)",
        }}>
          Necesito saber si vas a poder acompañarme en esta noche.
        </p>

        <a
          href={config.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        "inline-block",
            fontFamily:     "'Inter', sans-serif",
            fontSize:       "clamp(0.6rem, 1vw, 0.7rem)",
            fontWeight:     500,
            letterSpacing:  "0.2em",
            textTransform:  "uppercase",
            background:     C.mocha,
            color:          C.crema,
            padding:        "1em 2.8em",
            textDecoration: "none",
            transition:     "background 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.negro}
          onMouseLeave={e => e.currentTarget.style.background = C.mocha}
        >
          Confirmar por WhatsApp
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
      background:     C.crema,
      borderTop:      `1px solid ${C.champagne}`,
      padding:        "clamp(2rem, 4vw, 3rem) clamp(2rem, 6vw, 4rem)",
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
// S3 — Root
// ─────────────────────────────────────────────────────────────────────────────
export default function S3() {
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
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        <source src={config.musica?.src} type="audio/mpeg" />
      </audio>

      {!entered && <Cover config={config} onEnter={handleEnter} />}

      {entered && (
        <main>
          <HeroSection    config={config} />
          <EventSection   config={config} />
          <GallerySection config={config} />
          <MusicSection   config={config} playing={playing} onToggle={handleToggle} />
          <GiftsSection   config={config} />
          <ConfirmSection config={config} />
          <Footer         config={config} />
        </main>
      )}
    </>
  );
}
