// ─────────────────────────────────────────────────────────────────────────────
// GiftsSection.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 8
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import GiftModal from "../components/GiftModal";

import { THEME } from "../theme";
const ROSE       = THEME.ROSE;
const ROSE_LIGHT = THEME.ROSE_LIGHT;

export default function GiftsSection({ config }) {
  const [show,setShow]=useState(false);
  return (
    <>
      {show && <GiftModal config={config} onClose={()=>setShow(false)}/>}
      <section className="py-32 px-4 text-center" style={{background:"#5a2830",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="max-w-sm mx-auto">
          <div className="text-4xl mb-8" style={{color:ROSE_LIGHT}}>◻</div>
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.4)"}}>Regalos</p>
          <p className="text-xl mb-4" style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",lineHeight:1.6}}>Nada es más importante que tu presencia</p>
          <p className="text-sm mb-8 leading-relaxed" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.5)"}}>Pero si deseas hacerme un presente, podés depositarlo en la siguiente cuenta</p>
          <button onClick={()=>setShow(true)} className="px-10 py-3 text-xs tracking-[0.3em] uppercase transition-all duration-300"
            style={{border:`1px solid ${ROSE_LIGHT}`,color:ROSE_LIGHT,background:"transparent",cursor:"pointer"}}
            onMouseEnter={e=>{e.target.style.background=ROSE;e.target.style.color="#fff";}}
            onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=ROSE_LIGHT;}}>Hacer regalo</button>
        </div>
      </section>
    </>
  );
}
