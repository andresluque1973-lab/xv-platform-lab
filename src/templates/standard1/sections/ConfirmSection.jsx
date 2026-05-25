// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSection.jsx
// Sección extraída de standard1.jsx — FASE 6, Paso 13
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { generateCode, getClientIP, emptyGuest } from "../configHelpers";
import GuestBlock from "../components/GuestBlock";

export default function ConfirmSection({ config }) {
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
