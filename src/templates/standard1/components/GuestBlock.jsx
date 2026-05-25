// ─────────────────────────────────────────────────────────────────────────────
// GuestBlock.jsx
// Componente extraído de standard1.jsx — FASE 6, Paso 6
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

export default function GuestBlock({ num, data, onChange, errors }) {
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
