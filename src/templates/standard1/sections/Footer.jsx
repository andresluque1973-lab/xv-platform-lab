// ─────────────────────────────────────────────────────────────────────────────
// Footer.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 7
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { THEME } from "../theme";
const ROSE_LIGHT = THEME.ROSE_LIGHT;

export default function Footer({ config }) {
  return (
    <footer className="py-16 text-center" style={{background:"#3d1820",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div className="mb-4" style={{fontFamily:"'Dancing Script',cursive,Georgia,serif",fontSize:"2rem",color:ROSE_LIGHT}}>{config.nombre}</div>
      <p className="text-xs tracking-[0.4em] uppercase" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.3)"}}>{config.dia_semana} {config.fecha_display} · {config.hora}</p>
    </footer>
  );
}
