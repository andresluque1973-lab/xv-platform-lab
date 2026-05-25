// ─────────────────────────────────────────────────────────────────────────────
// GiftModal.jsx
// Componente extraído de standard1.jsx — FASE 6, Paso 5
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

const ROSE_LIGHT = "#e8b4b8";

export default function GiftModal({ config, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:"rgba(30,8,12,0.85)",backdropFilter:"blur(6px)"}}
      onClick={onClose}>
      <div className="relative max-w-sm w-full p-10"
        style={{background:"linear-gradient(145deg,#7a4048,#5a2830)",border:"1px solid rgba(232,180,184,0.35)",boxShadow:"0 0 60px rgba(196,132,138,0.3)",textAlign:"center"}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-5 text-xl"
          style={{color:ROSE_LIGHT,background:"none",border:"none",cursor:"pointer",opacity:0.8}}>×</button>
        <div className="text-3xl mb-4" style={{color:ROSE_LIGHT}}>◻</div>
        <h3 className="mb-8 tracking-[0.35em] uppercase"
          style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.2rem",fontWeight:400,color:"#fff"}}>
          Regalos
        </h3>
        <div className="space-y-4">
          <div className="p-4" style={{background:"rgba(0,0,0,0.22)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs tracking-[0.35em] uppercase mb-2"
              style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(232,180,184,0.65)"}}>Alias</p>
            <p className="text-lg tracking-widest select-all"
              style={{fontFamily:"'Playfair Display',Georgia,serif",color:"#fff",letterSpacing:"0.12em"}}>{config.regalo.alias}</p>
          </div>
          <div className="p-4" style={{background:"rgba(0,0,0,0.22)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs tracking-[0.35em] uppercase mb-2"
              style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(232,180,184,0.65)"}}>CVU</p>
            <p className="text-sm select-all"
              style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"#fff",letterSpacing:"0.08em",wordBreak:"break-all"}}>
              {config.regalo.cvu}</p>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed"
          style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.45)"}}>
          Podés copiar el alias o CVU desde tu app bancaria o billetera virtual
        </p>
      </div>
    </div>
  );
}
