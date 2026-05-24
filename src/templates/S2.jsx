import { useState, useEffect, useRef } from "react";
import { useConfig } from "../hooks/useConfig";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIG — cargado desde /clientes/sofia/config.json
// ─────────────────────────────────────────────────────────────────────────────
const ROSE       = "#8B7355";
const ROSE_LIGHT = "#B9A68E";
const ROSE_DARK  = "#6b5640";

// ─────────────────────────────────────────────────────────────────────────────
// 🛠  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function generateCode() {
  return "XV-SOFIA-" + Math.random().toString(36).slice(2,6).toUpperCase();
}

async function getClientIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const d = await r.json();
    return d.ip;
  } catch { return "N/A"; }
}

const emptyGuest = () => ({ name:"", surname:"", attending:"yes", diet:"Ninguno", song:"" });

// ─────────────────────────────────────────────────────────────────────────────
// ⏱  COUNTDOWN
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) return setT({ days:0, hours:0, minutes:0, seconds:0 });
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// ✨  PARTICLES / SHIMMER
// ─────────────────────────────────────────────────────────────────────────────
const PD = [
  {w:5,l:8, t:12,c:0,d:5.2,dl:0  },{w:3,l:22,t:45,c:1,d:7.1,dl:1.2},
  {w:4,l:35,t:78,c:2,d:4.8,dl:0.5},{w:6,l:48,t:23,c:0,d:6.3,dl:2.1},
  {w:3,l:61,t:56,c:1,d:5.7,dl:0.8},{w:5,l:74,t:88,c:2,d:8.2,dl:1.5},
  {w:4,l:87,t:34,c:0,d:4.4,dl:3.0},{w:3,l:15,t:67,c:1,d:6.8,dl:0.3},
  {w:5,l:28,t:91,c:2,d:5.5,dl:2.4},{w:4,l:42,t:15,c:0,d:7.3,dl:1.8},
  {w:6,l:55,t:42,c:1,d:4.1,dl:0.6},{w:3,l:68,t:73,c:2,d:9.0,dl:2.7},
  {w:5,l:81,t:19,c:0,d:5.9,dl:1.1},{w:4,l:93,t:62,c:1,d:6.6,dl:3.3},
  {w:3,l:6, t:84,c:2,d:4.7,dl:0.9},{w:5,l:38,t:38,c:0,d:7.8,dl:2.0},
  {w:4,l:52,t:95,c:1,d:5.1,dl:1.6},{w:6,l:76,t:7, c:2,d:6.4,dl:0.4},
];
const PC = ["rgba(255,210,220,0.55)","rgba(255,255,255,0.45)","rgba(232,180,184,0.65)"];

function Particles() {
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
function Shimmer() {
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

// ─────────────────────────────────────────────────────────────────────────────
// 💝  GIFT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function GiftModal({ config, onClose }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// 🚪  COVER
// ─────────────────────────────────────────────────────────────────────────────
function Cover({ config, onEnter }) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100);},[]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{background:"linear-gradient(135deg,#2C2420 0%,#1A1A1A 55%,#0F0D0C 100%)"}}>
      <Particles/><Shimmer/>
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 50% 40%,rgba(232,211,168,0.12) 0%,transparent 65%)"}}/>
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

// ─────────────────────────────────────────────────────────────────────────────
// 🌸  HERO
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ config }) {
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),200);},[]);
  const cd=useCountdown(new Date(config.contador));
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{background:"linear-gradient(160deg,#2C2420 0%,#1A1A1A 60%,#0F0D0C 100%)"}}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 30% 20%,rgba(232,211,168,0.1) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(139,115,85,0.2) 0%,transparent 50%)`}}/>
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

// ─────────────────────────────────────────────────────────────────────────────
// 📅  EVENT
// ─────────────────────────────────────────────────────────────────────────────
function EventSection({ config }) {
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

            {/* CAMBIO 1 — dia_semana dinámico */}
            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",letterSpacing:"0.06em"}}>{config?.dia_semana || ""}</p>

            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",fontSize:"1.1rem"}}>{config.fecha_larga}</p>

            {/* CAMBIO 2 — anio dinámico */}
            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff",fontSize:"1.1rem"}}>{config?.anio || ""}</p>

            <p className="text-sm mt-3 tracking-widest" style={{color:ROSE_LIGHT}}>{config.hora}</p>
          </div>
          <div style={{...cardBase,borderLeft:0}} onMouseEnter={hov} onMouseLeave={unv}>
            <div className="text-3xl mb-6" style={{color:ROSE_LIGHT}}>✦</div>
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,220,225,0.5)"}}>¿Dónde?</p>

            {/* CAMBIO 3 — lugar.nombre dinámico (una línea en lugar de dos hardcodeadas) */}
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

          {/* CAMBIO 4 — dress_code.descripcion dinámico */}
          <p className="text-xl" style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,color:"#fff"}}>{config?.dress_code?.descripcion || ""}</p>

          {/* CAMBIO 5 — dress_code.aclaracion dinámico */}
          <p className="text-xs tracking-widest mt-2 uppercase" style={{color:"rgba(255,210,215,0.6)"}}>{config?.dress_code?.aclaracion || ""}</p>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎵  MUSIC
// ─────────────────────────────────────────────────────────────────────────────
function MusicSection({ config, playing, onToggle }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// 🎁  GIFTS
// ─────────────────────────────────────────────────────────────────────────────
function GiftsSection({ config }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// 👤  GUEST BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function GuestBlock({ num, data, onChange, errors }) {
  const inp = (field) => ({
    fontFamily:"'Cormorant Garamond',Georgia,serif",
    color:"#fff", background:"transparent",
    borderBottom: errors?.[field]
      ? "1px solid rgba(255,120,120,0.8)"
      : "1px solid rgba(255,200,210,0.3)",
    outline:"none", width:"100%", padding:"8px 0", fontSize:"0.95rem",
    transition:"border-color 0.3s",
  });

  return (
    <div className="p-6 space-y-5"
      style={{background:"rgba(0,0,0,0.15)",border:"1px solid rgba(255,255,255,0.15)"}}>
      <p className="text-xs tracking-widest uppercase"
        style={{color:"rgba(255,255,255,0.4)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        Invitado {num}
      </p>

      <div>
        <input value={data.name} onChange={e=>onChange("name",e.target.value)}
          placeholder="Nombre" style={inp("name")}/>
        {errors?.name && <p className="text-xs mt-1" style={{color:"rgba(255,140,140,0.9)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Campo requerido</p>}
      </div>

      <div>
        <input value={data.surname} onChange={e=>onChange("surname",e.target.value)}
          placeholder="Apellido" style={inp("surname")}/>
        {errors?.surname && <p className="text-xs mt-1" style={{color:"rgba(255,140,140,0.9)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Campo requerido</p>}
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{color:"rgba(255,255,255,0.4)"}}>¿Confirmás tu asistencia?</p>
        <div className="space-y-2">
          {[{val:"yes",label:"¡Confirmo!"},{val:"no",label:"No podré asistir"}].map(opt=>(
            <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center transition-colors"
                style={{border:`1px solid ${data.attending===opt.val?"#fff":"rgba(255,255,255,0.3)"}`,background:data.attending===opt.val?"rgba(255,255,255,0.25)":"transparent",cursor:"pointer"}}
                onClick={()=>onChange("attending",opt.val)}>
                {data.attending===opt.val&&<span style={{color:"#fff",fontSize:"10px"}}>✓</span>}
              </div>
              <span className="text-sm" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,255,255,0.8)"}}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs tracking-widest uppercase block mb-2" style={{color:"rgba(255,255,255,0.4)"}}>Requerimiento alimentario</label>
        <select value={data.diet} onChange={e=>onChange("diet",e.target.value)}
          style={{...inp("diet"),borderBottom:"1px solid rgba(255,200,210,0.3)"}}>
          {["Ninguno","Vegetariano","Vegano","Celíaco","Alérgico a mariscos","Otro"].map(o=>(
            <option key={o} style={{background:"#9e6068"}}>{o}</option>
          ))}
        </select>
      </div>

      {num === 1 && (
        <input value={data.song} onChange={e=>onChange("song",e.target.value)}
          placeholder="¿Qué canción no puede faltar?" style={inp("song")}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📋  CONFIRM SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSection({ config }) {
  const MAX_GUESTS = 6;
  const [guestCount, setGuestCount] = useState(1);
  const [guests, setGuests]         = useState([emptyGuest()]);
  const [errors, setErrors]         = useState([]);
  const [status, setStatus]         = useState("idle");
  const [code,   setCode]           = useState("");
  const [errMsg, setErrMsg]         = useState("");

  useEffect(() => {
    setGuests(prev => {
      const next = [...prev];
      while (next.length < guestCount) next.push(emptyGuest());
      return next.slice(0, guestCount);
    });
    setErrors(prev => prev.slice(0, guestCount));
  }, [guestCount]);

  const updateGuest = (idx, field, value) => {
    setGuests(prev => prev.map((g,i) => i===idx ? {...g,[field]:value} : g));
    setErrors(prev => prev.map((e,i) => i===idx ? {...e,[field]:false} : e));
  };

  const validate = () => {
    const newErrors = guests.map(g => ({
      name:    !g.name.trim(),
      surname: !g.surname.trim(),
    }));
    setErrors(newErrors);
    return newErrors.every(e => !e.name && !e.surname);
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setErrMsg("Por favor completá los campos requeridos de todos los invitados.");
      return;
    }
    setErrMsg("");
    setStatus("loading");

    const uniqueCode = generateCode();
    const ip         = await getClientIP();
    const timestamp  = new Date().toISOString();

    const params = new URLSearchParams();
    params.set("code",       uniqueCode);
    params.set("timestamp",  timestamp);
    params.set("ip",         ip);
    params.set("guestCount", String(guestCount));
    guests.forEach((g, i) => {
      const n = i + 1;
      params.set(`g${n}_name`,      g.name.trim());
      params.set(`g${n}_surname`,   g.surname.trim());
      params.set(`g${n}_attending`, g.attending === "yes" ? "Confirmo" : "No asiste");
      params.set(`g${n}_diet`,      g.diet);
      params.set(`g${n}_song`,      i === 0 ? g.song.trim() : "");
    });

    try {
      await fetch(config.apps_script_url + "?" + params.toString(), {
        method: "GET",
        mode:   "no-cors",
      });
      setCode(uniqueCode);
      setStatus("success");
    } catch (err) {
      setCode(uniqueCode);
      setStatus("success");
    }
  };

  const sel = {
    fontFamily:"'Cormorant Garamond',Georgia,serif",
    color:"#fff",background:"transparent",
    borderBottom:"1px solid rgba(255,200,210,0.3)",
    outline:"none",width:"100%",padding:"8px 0",fontSize:"0.95rem",
  };

  return (
    <section className="py-32 px-4"
      style={{background:"linear-gradient(180deg,#c4848a 0%,#9e6068 100%)"}}>
      <div className="max-w-md mx-auto">

        <div className="text-center mb-12">
          <div className="text-4xl mb-6" style={{color:"rgba(255,255,255,0.7)"}}>✉</div>
          <p className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,255,255,0.6)"}}>
            Confirmá tu asistencia
          </p>
          <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.8rem",fontWeight:400,color:"#fff"}}>
            Antes del {config.confirmacion_limite}
          </h2>
          <div className="w-12 h-px mx-auto mt-6" style={{background:"rgba(255,255,255,0.4)"}}/>
        </div>

        {status === "success" && (
          <div className="text-center py-16">
            <div className="text-5xl mb-6" style={{color:"#fff"}}>✓</div>
            <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:400,fontSize:"1.3rem",color:"#fff"}}>
              ¡Gracias, {guests[0].name}!
            </p>
            <p className="text-sm mt-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,255,255,0.6)"}}>
              {guests[0].attending==="yes"?`Nos vemos el ${config.fecha_larga} 🎉`:"Te vamos a extrañar en esta noche especial."}
            </p>
            <div className="mt-8 p-4 mx-auto max-w-xs" style={{background:"rgba(0,0,0,0.18)",border:"1px solid rgba(255,255,255,0.15)"}}>
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,255,255,0.5)"}}>Tu código de confirmación</p>
              <p className="text-base tracking-widest select-all" style={{fontFamily:"'Playfair Display',Georgia,serif",color:"#fff",letterSpacing:"0.1em"}}>{code}</p>
            </div>
            <p className="text-xs mt-3" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,255,255,0.35)"}}>Guardá este código como comprobante</p>
          </div>
        )}

        {status !== "success" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase block mb-2"
                style={{color:"rgba(255,255,255,0.5)"}}>Número de personas</label>
              <select value={guestCount} onChange={e=>setGuestCount(Number(e.target.value))} style={sel}>
                {Array.from({length:MAX_GUESTS},(_,i)=>i+1).map(n=>(
                  <option key={n} value={n} style={{background:"#9e6068"}}>
                    {n} {n===1?"persona":"personas"}
                  </option>
                ))}
              </select>
            </div>

            {guests.map((g,i) => (
              <GuestBlock
                key={i}
                num={i+1}
                data={g}
                onChange={(field,val)=>updateGuest(i,field,val)}
                errors={errors[i]}
              />
            ))}

            {errMsg && (
              <p className="text-xs text-center py-2" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,160,160,0.9)"}}>
                {errMsg}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status==="loading"}
              className="w-full py-4 text-xs tracking-[0.3em] uppercase transition-colors duration-300"
              style={{
                fontFamily:"'Cormorant Garamond',Georgia,serif",
                background: status==="loading" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.28)",
                color:"#fff",
                border:"1px solid rgba(255,255,255,0.2)",
                cursor: status==="loading" ? "not-allowed" : "pointer",
                opacity: status==="loading" ? 0.7 : 1,
              }}
              onMouseEnter={e=>{ if(status!=="loading") e.target.style.background="rgba(0,0,0,0.45)"; }}
              onMouseLeave={e=>{ if(status!=="loading") e.target.style.background="rgba(0,0,0,0.28)"; }}>
              {status==="loading" ? "Enviando..." : "Confirmar"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🏁  FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ config }) {
  return (
    <footer className="py-16 text-center" style={{background:"#3d1820",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div className="mb-4" style={{fontFamily:"'Dancing Script',cursive,Georgia,serif",fontSize:"2rem",color:ROSE_LIGHT}}>{config.nombre}</div>
      <p className="text-xs tracking-[0.4em] uppercase" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"rgba(255,200,210,0.3)"}}>{config.dia_semana} {config.fecha_display} · {config.hora}</p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀  APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const slug = window.location.pathname.split("/")[1] || "sofia";
  const { config, error } = useConfig(slug);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.55;
        audio.play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
    }, 900);
  };

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (!entered) return;
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.8s ease";
      document.body.style.opacity = "1";
    }, 50);
  }, [entered]);

  if (!config && !error) return null;

  if (error) {
    return (
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#1a1a1a",color:"#e8b4b8",
        fontFamily:"Georgia,serif",textAlign:"center",padding:"2rem"
      }}>
        <p>No se pudo cargar la invitación.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@300;400;500;600&family=Dancing+Script:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#c4848a;}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3);}
        select option{background:#9e6068;color:#fff;}
        @keyframes floatP{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-18px) scale(1.12);}}
        @keyframes shimLine{0%,100%{opacity:0;transform:translateY(-100%);}50%{opacity:1;transform:translateY(280%);}}
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        <source src={config.musica.src} type="audio/mpeg"/>
      </audio>

      {!entered && <Cover config={config} onEnter={handleEnter}/>}
      {entered && (
        <main>
          <HeroSection config={config}/>
          <EventSection config={config}/>
          <MusicSection playing={playing} onToggle={handleToggle} config={config}/>
          <GiftsSection config={config}/>
          <ConfirmSection config={config}/>
          <Footer config={config}/>
        </main>
      )}
    </>
  );
}
