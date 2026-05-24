// ─────────────────────────────────────────────────────────────────────────────
// Particles.jsx
// Componente decorativo extraído de standard1.jsx — FASE 6, Paso 3
// Datos separados a particlesData.js — FASE 6, Paso 4
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { PD, PC } from "../particlesData";

export default function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PD.map((p,i) => (
        <div key={i} className="absolute rounded-full" style={{
          width:p.w+"px",height:p.w+"px",left:p.l+"%",top:p.t+"%",
          background:PC[p.c],boxShadow:`0 0 ${p.w*3}px ${PC[p.c]}`,
          animation:`floatP ${p.d}s ease-in-out infinite`,animationDelay:p.dl+"s",
        }}/>
      ))}
    </div>
  );
}

