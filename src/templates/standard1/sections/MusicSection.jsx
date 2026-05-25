// ─────────────────────────────────────────────────────────────────────────────
// MusicSection.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 7
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { THEME } from "../theme";
const ROSE_LIGHT = THEME.ROSE_LIGHT;

export default function MusicSection({ config, playing, onToggle }) {
  return (
    <section className="py-20 px-4 text-center" style={{background:"#5a2830",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.4)"}}>Música</p>
      <p className="text-xs mb-6" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.28)",letterSpacing:"0.1em"}}>{config.musica.nombre}</p>
      <button onClick={onToggle} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all duration-300"
        style={{border:`1px solid ${playing?ROSE_LIGHT:"rgba(255,200,210,0.35)"}`,background:playing?"rgba(196,132,138,0.2)":"transparent",cursor:"pointer"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=ROSE_LIGHT}
        onMouseLeave={e=>e.currentTarget.style.borderColor=playing?ROSE_LIGHT:"rgba(255,200,210,0.35)"}>
        <span style={{color:ROSE_LIGHT,fontSize:"1.1rem"}}>{playing?"⏸":"▶"}</span>
      </button>
      <p className="text-xs mt-4 tracking-wider" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.3)"}}>{playing?"Reproduciendo...":"Activar música"}</p>
    </section>
  );
}
