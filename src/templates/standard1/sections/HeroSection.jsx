// ─────────────────────────────────────────────────────────────────────────────
// HeroSection.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 12
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useCountdown } from "../hooks";
import Particles from "../components/Particles";
import Shimmer from "../components/Shimmer";

export default function HeroSection({ config }) {
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),200);},[]);
  const cd=useCountdown(new Date(config.contador));
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{background:"linear-gradient(160deg,#c4848a 0%,#9e6068 60%,#7a4048 100%)"}}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 30% 20%,rgba(255,200,215,0.22) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(100,30,40,0.3) 0%,transparent 50%)`}}/>
        <Particles/><Shimmer/>
      </div>
      <div className="relative z-10 text-center pb-0 pt-32 px-4" style={{transform:loaded?"translateY(0)":"translateY(60px)",opacity:loaded?1:0,transition:"all 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s"}}>
        <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,240,242,0.8)"}}>{config.fecha_display}</p>
        <h2 style={{fontFamily:"'Dancing Script',cursive,Georgia,serif",fontSize:"clamp(4rem,15vw,9rem)",fontWeight:700,lineHeight:0.9,color:"#fff",textShadow:"0 0 80px rgba(255,200,215,0.55),0 4px 20px rgba(0,0,0,0.12)"}}>{config.nombre}</h2>
        <p className="mt-6 text-sm tracking-[0.2em]" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,240,242,0.75)"}}>Tu presencia en esta noche nunca la olvidaré</p>
      </div>
      <div className="relative z-10 grid grid-cols-4 gap-3 mx-4 sm:mx-8 mt-16">
        {[{label:"Días",value:cd.days},{label:"Horas",value:cd.hours},{label:"Minutos",value:cd.minutes},{label:"Segundos",value:cd.seconds}].map((item,i)=>(
          <div key={item.label} className="py-6 px-2 text-center" style={{background:"rgba(0,0,0,0.18)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)",transform:loaded?"translateY(0)":"translateY(30px)",opacity:loaded?1:0,transition:`all 1s ease ${0.6+i*0.1}s`}}>
            <div className="text-3xl sm:text-4xl font-light tabular-nums" style={{fontFamily:"'Playfair Display',Georgia,serif",color:"#fff"}}>{String(item.value??0).padStart(2,"0")}</div>
            <div className="text-xs tracking-[0.3em] uppercase mt-2" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,240,242,0.65)"}}>{item.label}</div>
          </div>
        ))}
      </div>
      <div className="relative z-10 flex justify-center mt-12 pb-0">
        <div style={{width:"1px",height:"64px",background:"linear-gradient(to bottom,rgba(255,255,255,0.5),transparent)"}}/>
      </div>
    </section>
  );
}
