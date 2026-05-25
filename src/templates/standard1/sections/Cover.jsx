// ─────────────────────────────────────────────────────────────────────────────
// Cover.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 11
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Particles from "../components/Particles";
import Shimmer from "../components/Shimmer";

export default function Cover({ config, onEnter }) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100);},[]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{background:"linear-gradient(135deg,#c4848a 0%,#9e6068 55%,#7a4048 100%)"}}>
      <Particles/><Shimmer/>
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 50% 40%,rgba(255,200,215,0.2) 0%,transparent 65%)"}}/>
      <div className="text-center px-8 relative z-10" style={{transform:vis?"translateY(0)":"translateY(40px)",opacity:vis?1:0,transition:"all 1.2s cubic-bezier(0.16,1,0.3,1)"}}>
        <p className="text-xs tracking-[0.4em] mb-6 uppercase" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,240,242,0.8)"}}>Te invito a celebrar</p>
        <h1 className="mb-3" style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(3rem,10vw,6rem)",fontWeight:400,letterSpacing:"-0.02em",lineHeight:1,color:"#fff",textShadow:"0 2px 30px rgba(0,0,0,0.18)"}}>Mis XV</h1>
        <div className="mb-2" style={{fontFamily:"'Dancing Script',cursive,Georgia,serif",fontSize:"clamp(2.5rem,8vw,5rem)",fontWeight:700,color:"#fff",textShadow:"0 0 50px rgba(255,220,225,0.5)"}}>{config.nombre}</div>
        <p className="text-sm tracking-widest uppercase mb-12" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,240,242,0.7)"}}>Quiero que seas parte de este momento</p>
        <button onClick={onEnter} className="px-12 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-500"
          style={{fontFamily:"'Cormorant Garamond',Georgia,serif",border:"1px solid rgba(255,255,255,0.7)",color:"#fff",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(4px)",cursor:"pointer"}}
          onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.28)"}
          onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.12)"}>Ingresar</button>
      </div>
      <div className="absolute bottom-8 flex gap-2 z-10" style={{opacity:vis?1:0,transition:"opacity 2s ease 1.5s"}}>
        {[0,1,2].map(i=>(<div key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{opacity:0.3+i*0.2}}/>))}
      </div>
    </div>
  );
}
