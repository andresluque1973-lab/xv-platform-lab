// ─────────────────────────────────────────────────────────────────────────────
// Particles.jsx
// Componente decorativo extraído de standard1.jsx — FASE 6, Paso 3
// NO modificar comportamiento. Solo reubicación.
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
