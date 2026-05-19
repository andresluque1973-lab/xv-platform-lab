import { useState } from 'react';

const DEFAULTS = {
  titulo: 'Mis XV',
  contador: '',
  confirmacion_limite: '20 días antes del evento',
  lugar: { maps_url: '' },
  dress_code: { descripcion: 'Elegante', aclaracion: '' },
  musica: { nombre: '' },
  regalo: { alias: '', cvu: '' },
  apps_script_url: '',
};

function buildConfig(fields) {
  const { slug, nombre, subtitulo, fecha, hora, salon } = fields;
  return {
    nombre: nombre || 'Nombre',
    titulo: DEFAULTS.titulo,
    subtitulo: subtitulo || 'Quiero que seas parte de este momento',
    fecha_display: fecha || '',
    fecha_larga: '',
    dia_semana: '',
    anio: '',
    hora: hora || '',
    contador: DEFAULTS.contador,
    confirmacion_limite: DEFAULTS.confirmacion_limite,
    lugar: {
      nombre: salon || '',
      maps_url: DEFAULTS.lugar.maps_url,
    },
    dress_code: DEFAULTS.dress_code,
    musica: {
      src: `/clientes/${slug || 'slug'}/musica.mp3`,
      nombre: DEFAULTS.musica.nombre,
    },
    regalo: DEFAULTS.regalo,
    apps_script_url: DEFAULTS.apps_script_url,
  };
}

export default function AdminPage() {
  const [fields, setFields] = useState({
    slug: '', nombre: '', subtitulo: '', fecha: '', hora: '', salon: '',
  });
  const [json, setJson]       = useState('');
  const [stage, setStage]     = useState('form'); // 'form' | 'preview'
  const [slugError, setSlugError] = useState(false);

  const update = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
    if (key === 'slug') setSlugError(false);
  };

  const generar = () => {
    const slug = fields.slug.trim();
    if (!slug) { setSlugError(true); return; }
    if (slug === 'admin') { setSlugError(true); return; }
    const config = buildConfig({ ...fields, slug });
    setJson(JSON.stringify(config, null, 2));
    setStage('preview');
    setTimeout(() => {
      document.getElementById('vela-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const descargar = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const slugClean = fields.slug.trim().toLowerCase() || '{slug}';

  const labelStyle = {
    display: 'block',
    fontSize: 10,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color: '#8B7355',
    marginBottom: 8,
    fontWeight: 500,
  };

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(185,166,142,0.5)',
    padding: '8px 0',
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 300,
    color: '#1A1A1A',
    outline: 'none',
  };

  const sectionTitle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 11,
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    color: '#8B7355',
    borderBottom: '1px solid rgba(185,166,142,0.25)',
    paddingBottom: 10,
    marginBottom: 20,
  };

  const hintStyle = {
    fontSize: 11,
    color: '#B9A68E',
    marginTop: 5,
    fontWeight: 300,
  };

  const codeStyle = {
    background: 'rgba(185,166,142,0.15)',
    padding: '1px 6px',
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#8B7355',
    borderRadius: 2,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap');
        body { background: #F8F5EF !important; }
        #vela-admin ::placeholder { color: rgba(185,166,142,0.6); font-weight: 300; }
        #vela-admin textarea { resize: vertical; }
      `}</style>

      <div
        id="vela-admin"
        className="min-h-screen px-6 py-12"
        style={{ background: '#F8F5EF', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-xl mx-auto">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#B9A68E' }}>
              VELA · Admin
            </span>
            <div className="flex-1 h-px" style={{ background: '#B9A68E', opacity: 0.35 }} />
          </div>

          {/* Título */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1A1A1A', marginBottom: 6 }}>
            Nueva invitación
          </h1>
          <p style={{ fontSize: 13, color: '#B9A68E', fontWeight: 300, marginBottom: 40 }}>
            Completá los campos · generá el config.json · seguí los pasos
          </p>

          <div className="h-px mb-9" style={{ background: 'rgba(185,166,142,0.25)' }} />

          {/* Sección identificación */}
          <p style={sectionTitle}>Identificación</p>

          <div className="mb-7">
            <label style={labelStyle}>Slug</label>
            <input
              style={{ ...inputStyle, borderBottomColor: slugError ? '#c4848a' : 'rgba(185,166,142,0.5)' }}
              value={fields.slug}
              onChange={e => update('slug', e.target.value)}
              placeholder="melani"
            />
            {slugError && (
              <p style={{ fontSize: 11, color: '#c4848a', marginTop: 4 }}>
                {fields.slug.trim() === 'admin' ? '"admin" está reservado.' : 'El slug es obligatorio.'}
              </p>
            )}
            <p style={hintStyle}>Solo minúsculas, sin espacios ni tildes.</p>
            <span style={{ display: 'inline-block', marginTop: 6, fontSize: 12, color: '#8B7355', background: 'rgba(185,166,142,0.12)', padding: '3px 10px', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.05em' }}>
              /clientes/{slugClean}/config.json
            </span>
          </div>

          <div className="h-px my-9" style={{ background: 'rgba(185,166,142,0.25)' }} />

          {/* Sección datos */}
          <p style={sectionTitle}>Datos de la invitación</p>

          <div className="mb-7">
            <label style={labelStyle}>Nombre</label>
            <input
              style={inputStyle}
              value={fields.nombre}
              onChange={e => update('nombre', e.target.value)}
              placeholder="Melani"
            />
          </div>

          <div className="mb-7">
            <label style={labelStyle}>Frase</label>
            <input
              style={inputStyle}
              value={fields.subtitulo}
              onChange={e => update('subtitulo', e.target.value)}
              placeholder="Quiero que seas parte de este momento"
            />
            <p style={hintStyle}>Se muestra debajo del nombre en la portada.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-7">
            <div>
              <label style={labelStyle}>Fecha</label>
              <input
                style={inputStyle}
                value={fields.fecha}
                onChange={e => update('fecha', e.target.value)}
                placeholder="15 · Agosto · 2026"
              />
            </div>
            <div>
              <label style={labelStyle}>Hora</label>
              <input
                style={inputStyle}
                value={fields.hora}
                onChange={e => update('hora', e.target.value)}
                placeholder="21:00 hs"
              />
            </div>
          </div>

          <div className="mb-7">
            <label style={labelStyle}>Salón / Lugar</label>
            <input
              style={inputStyle}
              value={fields.salon}
              onChange={e => update('salon', e.target.value)}
              placeholder="Espacio 1805"
            />
          </div>

          {/* Botón generar */}
          <button
            onClick={generar}
            className="w-full py-4 mt-2"
            style={{ background: '#1A1A1A', color: '#F8F5EF', border: 'none', fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#8B7355'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
          >
            Generar config.json
          </button>

          {/* Preview */}
          {stage === 'preview' && (
            <div id="vela-preview" className="mt-8" style={{ border: '1px solid rgba(185,166,142,0.35)' }}>

              <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(185,166,142,0.1)', borderBottom: '1px solid rgba(185,166,142,0.25)' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8B7355' }}>
                  Resultado · config.json
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStage('form')}
                    style={{ background: 'transparent', border: '1px solid rgba(185,166,142,0.5)', color: '#8B7355', fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '5px 14px', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#8B7355'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(185,166,142,0.5)'}
                  >
                    Editar
                  </button>
                  <button
                    onClick={descargar}
                    style={{ background: '#1A1A1A', border: 'none', color: '#F8F5EF', fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '5px 14px', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#8B7355'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
                  >
                    Descargar
                  </button>
                </div>
              </div>

              <textarea
                value={json}
                onChange={e => setJson(e.target.value)}
                rows={20}
                className="w-full p-5 outline-none"
                style={{ background: '#fff', border: 'none', color: '#1A1A1A', fontFamily: "'Courier New', monospace", fontSize: 12.5, lineHeight: 1.7, display: 'block' }}
                spellCheck={false}
              />
            </div>
          )}

          {/* Instrucciones */}
          {stage === 'preview' && (
            <div className="mt-8 p-7" style={{ border: '1px solid rgba(185,166,142,0.35)', background: 'rgba(248,245,239,0.7)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8B7355', marginBottom: 20 }}>
                Próximos pasos
              </p>
              {[
                ['01', <span>Crear carpeta <code style={codeStyle}>public/clientes/{fields.slug.trim()}/</code> en el repositorio</span>],
                ['02', <span>Copiar <code style={codeStyle}>config.json</code> descargado dentro de esa carpeta</span>],
                ['03', <span>Subir <code style={codeStyle}>musica.mp3</code> a la misma carpeta</span>],
                ['04', 'Commit + push → Vercel despliega automáticamente'],
                ['05', <span>Invitación disponible en <code style={codeStyle}>/{fields.slug.trim()}</code></span>],
              ].map(([num, text]) => (
                <div key={num} className="flex gap-4 mb-4">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: '#B9A68E', minWidth: 20, paddingTop: 2 }}>{num}</span>
                  <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 300, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
