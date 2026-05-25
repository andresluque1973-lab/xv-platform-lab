// ─────────────────────────────────────────────────────────────────────────────
// EventSection.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 10
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { THEME } from "../theme";

const ROSE_LIGHT = THEME.ROSE_LIGHT;
const ROSE_DARK  = THEME.ROSE_DARK;

export default function EventSection({ config }) {
  const cardBase={border:"1px solid rgba(255,255,255,0.15)",padding:"3rem",textAlign:"center",transition:"border-color 0.5s"};
  const hov=e=>e.currentTarget.style.borderColor="rgba(232,180,184,0.5)";
  const unv=e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";
  return (
    <section className="py-32 px-4" style={{background:"linear-gradient(180deg,#7a4048 0%,#5a2830 100%)"}}>
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div style={cardBase} onMouseEnter={hov} onMouseLeave={unv}>
            <div className="text-3xl mb-6" style={{color:ROSE_LIGHT}}>◇</div>
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,220,225,0.5)"}}>¿Cuándo?</p>

            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",letterSpacing:"0.06em"}}>{config?.dia_semana || ""}</p>

            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",fontSize:"1.1rem"}}>{config.fecha_larga}</p>

            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",fontSize:"1.1rem"}}>{config?.anio || ""}</p>

            <p className="text-sm mt-3 tracking-widest" style={{color:ROSE_LIGHT}}>{config.hora}</p>
          </div>
          <div style={{...cardBase,borderLeft:0}} onMouseEnter={hov} onMouseLeave={unv}>
            <div className="text-3xl mb-6" style={{color:ROSE_LIGHT}}>✦</div>
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,220,225,0.5)"}}>¿Dónde?</p>

            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",fontSize:"1.1rem"}}>{config?.lugar?.nombre || ""}</p>

            <a href={config.lugar.maps_url} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-block text-xs tracking-[0.3em] uppercase pb-0.5 transition-colors duration-300"
              style={{color:ROSE_LIGHT,borderBottom:`1px solid ${ROSE_DARK}`,textDecoration:"none"}}
              onMouseEnter={e=>e.target.style.borderBottomColor=ROSE_LIGHT}
              onMouseLeave={e=>e.target.style.borderBottomColor=ROSE_DARK}>Cómo llegar</a>
          </div>
        </div>
        <div style={{...cardBase,borderTop:0}} onMouseEnter={hov} onMouseLeave={unv}>
          <div className="text-3xl mb-6" style={{color:ROSE_LIGHT}}>◈</div>
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,220,225,0.5)"}}>Dress Code</p>

          <p className="text-xl" style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff"}}>{config?.dress_code?.descripcion || ""}</p>

          <p className="text-xs tracking-widest mt-2 uppercase" style={{color:"rgba(255,210,215,0.6)"}}>{config?.dress_code?.aclaracion || ""}</p>

        </div>
      </div>
    </section>
  );
}
