// ─────────────────────────────────────────────────────────────────────────────
// Shimmer.jsx
// Componente decorativo extraído de standard1.jsx — FASE 6, Paso 3
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

export default function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0,1,2,3,4].map(i=>(
        <div key={i} className="absolute" style={{
          width:"1px",height:"45%",left:(12+i*18)+"%",top:0,
          background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.18),transparent)",
          animation:`shimLine ${5+i*1.4}s ease-in-out infinite`,animationDelay:i*0.9+"s",
        }}/>
      ))}
    </div>
  );
}
