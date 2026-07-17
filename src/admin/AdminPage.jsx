import { useState, useEffect, useRef } from 'react';
import { catalogo } from '../../data/catalogo/templates.js';
import { REQUIRED_FIELDS, validate } from '../hooks/useConfig.js';
import { templateRegistry } from '../templates/templateRegistry.js';

// ─────────────────────────────────────────────────────────────────────────────
// PLANES — derivado desde catálogo
// LEGACY_VISIBLE: templates que se muestran por compatibilidad temporal
// aunque su estado sea "proximamente".
// Se resuelve en fase posterior cuando P1 tenga implementación real.
// ─────────────────────────────────────────────────────────────────────────────
const LEGACY_VISIBLE = ['P1'];

const PLANES = catalogo.templates.reduce((acc, t) => {
  const visible =
    t.estado === 'disponible' ||
    LEGACY_VISIBLE.includes(t.codigo);
  if (visible) {
    if (!acc[t.plan]) acc[t.plan] = [];
    acc[t.plan].push(t.codigo);
  }
  return acc;
}, {});

// ─────────────────────────────────────────────────────────────────────────────
// Modo Validación (MAU-2) — verdad técnica de qué templates existen y
// funcionan, sin pasar por el filtro comercial de PLANES. El catálogo
// (data/catalogo/templates.js) sigue siendo la única fuente de verdad sobre
// disponibilidad comercial; esto solo habilita generar un config.json de
// prueba para un template que el catálogo todavía marca "proximamente",
// como paso previo a su validación en Preview Deployment.
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATES_TECNICOS_POR_PLAN = Object.entries(templateRegistry).reduce(
  (acc, [codigo, meta]) => {
    const plan = meta.category === 'premium' ? 'PREMIUM' : 'STANDARD';
    if (!acc[plan]) acc[plan] = [];
    acc[plan].push(codigo);
    return acc;
  },
  {}
);

const ESTADO_POR_CODIGO = catalogo.templates.reduce((acc, t) => {
  acc[t.codigo] = t.estado;
  return acc;
}, {});

function esEnValidacion(codigo) {
  return ESTADO_POR_CODIGO[codigo] !== 'disponible' && !LEGACY_VISIBLE.includes(codigo);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — genera el valor autogenerado esperado para musica_src. 
// ─────────────────────────────────────────────────────────────────────────────
function autoSrc(slug) {
  return `/clientes/${slug || '{slug}'}/musica.mp3`;
}

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

const DIAS  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

const MESES = [
  'enero','febrero','marzo','abril',
  'mayo','junio','julio','agosto',
  'septiembre','octubre','noviembre','diciembre'
];

function derivarFechas(isoString) {
  if (!isoString || typeof isoString !== 'string')
    return null;

  if (!ISO_REGEX.test(isoString.trim()))
    return null;

  const [fecha] = isoString.split('T');

  const [anio, mes, dia] =
    fecha.split('-').map(Number);

  const d =
    new Date(anio, mes - 1, dia);

  return {
    dia_semana: DIAS[d.getDay()],
    fecha_larga: `${dia} de ${MESES[mes - 1]}`,
    anio: String(anio),
  };
}
function isMusicSrcValid(src) {
  if (!src) return false;

  const trimmed = src.trim();

  return (
    trimmed.startsWith('/') ||
    trimmed.includes('://')
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// parseLineItems — MAU-2. Convierte texto de un <textarea> (una línea por
// ítem) en un array. Si itemFields es null, cada línea es un string directo
// (uso: fotos). Si itemFields es un array de nombres (ej. ['hora',
// 'descripcion']), cada línea se separa por "|" y se arma un objeto — las
// líneas con una cantidad de segmentos distinta a la esperada se reportan
// en `errores` con su número de línea, en vez de generarse silenciosamente
// incompletas.
// ─────────────────────────────────────────────────────────────────────────────
function parseLineItems(text, itemFields) {
  const lineas = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
  const errores = [];

  const items = lineas.map((linea, i) => {
    if (!itemFields) return linea;

    const partes = linea.split('|').map(p => p.trim());

    if (partes.length !== itemFields.length) {
      errores.push(
        `Línea ${i + 1}: se esperaban ${itemFields.length} campos separados por "|" ` +
        `(${itemFields.join(' | ')}), se encontraron ${partes.length}.`
      );
    }

    return Object.fromEntries(itemFields.map((campo, idx) => [campo, partes[idx] ?? '']));
  });

  return { items, errores };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigS1 — mapeo explícito de fields → estructura JSON del cliente
// Contrato: replica exactamente las claves que consume standard1.jsx
// Renombrada desde buildConfig() en MAU-2 (FASE 23) — sin cambios de lógica,
// pasa a ser una de las 6 funciones del dispatcher TEMPLATE_BUILDERS.
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigS1(fields) {
  const { slug, nombre, subtitulo, fecha, hora, salon } = fields;

  const fechas = derivarFechas(fields.contador);
  
  return {
  // Producto
  plan:     fields.plan     || 'STANDARD',
  template: fields.template || 'S1',
  // Identidad
  nombre: nombre || 'Nombre',
    titulo:    'Mis XV',
    subtitulo: subtitulo || 'Quiero que seas parte de este momento',

    // Fecha
    // DEUDA TÉCNICA: automatizar derivación de fecha_larga / dia_semana / anio
    // desde el campo fecha (fuera de FASE 4)
    fecha_display: fecha || '',
    fecha_larga: fechas?.fecha_larga ?? '',
    dia_semana:  fechas?.dia_semana ?? '',
    anio:        fechas?.anio ?? '',
    hora:          hora  || '',

    // Evento
    contador:            fields.contador            || '',
    confirmacion_limite: fields.confirmacion_limite || '',

    // Lugar
    lugar: {
      nombre:   salon           || '',
      maps_url: fields.maps_url || '',
    },

    // Dress code
    dress_code: {
      descripcion: fields.dress_code_descripcion || '',
      aclaracion:  fields.dress_code_aclaracion  || '',
    },

    // Música
    musica: {
      src:    fields.musica_src    || autoSrc(slug),
      nombre: fields.musica_nombre || '',
    },

    // Regalo
    regalo: {
      alias: fields.alias || '',
      cvu:   fields.cvu   || '',
    },

    // Servicio
    // DEUDA TÉCNICA: confirmación muestra success incluso cuando fetch falla
    // (catch silencioso en ConfirmSection — fuera de FASE 4)
    apps_script_url: fields.apps_script_url || '',
    sheet_id:        fields.sheet_id        || '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigS2 — mismos campos base que S1, sin dress_code_descripcion
// requerido, sumando whatsapp_url (campo propio de S2). Campos derivados
// mecánicamente de REQUIRED_FIELDS.S2 en useConfig.js.
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigS2(fields) {
  const { slug, nombre, subtitulo, fecha, hora, salon } = fields;
  const fechas = derivarFechas(fields.contador);

  return {
    plan:     fields.plan     || 'STANDARD',
    template: fields.template || 'S2',

    nombre:    nombre    || '',
    subtitulo: subtitulo || '',

    fecha_display: fecha || '',
    fecha_larga:   fechas?.fecha_larga ?? '',
    dia_semana:    fechas?.dia_semana  ?? '',
    anio:          fechas?.anio        ?? '',
    hora:          hora  || '',

    contador:            fields.contador            || '',
    confirmacion_limite: fields.confirmacion_limite || '',
    whatsapp_url:        fields.whatsapp_url         || '',

    lugar: {
      nombre:   salon           || '',
      maps_url: fields.maps_url || '',
    },

    dress_code: {
      descripcion: fields.dress_code_descripcion || '',
      aclaracion:  fields.dress_code_aclaracion  || '',
    },

    musica: {
      src:    fields.musica_src    || autoSrc(slug),
      nombre: fields.musica_nombre || '',
    },

    regalo: {
      alias: fields.alias || '',
      cvu:   fields.cvu   || '',
    },

    apps_script_url: fields.apps_script_url || '',
    sheet_id:        fields.sheet_id        || '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigS3 — reutiliza la forma de S2 (mismos campos base + whatsapp_url)
// sumando titulo (requerido en S3, no en S2) y fotos (opcional, array de
// URLs). Campos derivados de REQUIRED_FIELDS.S3.
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigS3(fields) {
  const base = buildConfigS2({ ...fields, template: fields.template || 'S3' });
  const { items: fotos } = parseLineItems(fields.fotos_raw, null);

  return {
    ...base,
    titulo: fields.titulo || '',
    fotos,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigP1 — primera forma PREMIUM. Introduce historia{}, timeline[],
// itinerario[] y fotos[] (los tres arrays via parseLineItems). Campos
// derivados de REQUIRED_FIELDS.P1.
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigP1(fields) {
  const { slug, nombre, subtitulo, fecha, hora, salon } = fields;
  const fechas = derivarFechas(fields.contador);

  const { items: fotos }      = parseLineItems(fields.fotos_raw, null);
  const { items: itinerario } = parseLineItems(fields.itinerario_raw, ['hora', 'descripcion']);
  const { items: timeline }   = parseLineItems(fields.timeline_raw, ['fecha', 'texto']);

  return {
    plan:     fields.plan     || 'PREMIUM',
    template: fields.template || 'P1',

    nombre:    nombre    || '',
    subtitulo: subtitulo || '',

    fecha_display: fecha || '',
    fecha_larga:   fechas?.fecha_larga ?? '',
    dia_semana:    fechas?.dia_semana  ?? '',
    anio:          fechas?.anio        ?? '',
    hora:          hora  || '',

    contador:            fields.contador            || '',
    confirmacion_limite: fields.confirmacion_limite || '',

    historia: {
      titulo: fields.historia_titulo || '',
      cuerpo: fields.historia_cuerpo || '',
    },
    timeline,
    itinerario,
    fotos,

    lugar: {
      nombre:   salon           || '',
      maps_url: fields.maps_url || '',
    },

    dress_code: {
      descripcion: fields.dress_code_descripcion || '',
      aclaracion:  fields.dress_code_aclaracion  || '',
    },

    musica: {
      src:    fields.musica_src    || autoSrc(slug),
      nombre: fields.musica_nombre || '',
    },

    regalo: {
      alias: fields.alias || '',
      cvu:   fields.cvu   || '',
    },

    apps_script_url: fields.apps_script_url || '',
    sheet_id:        fields.sheet_id        || '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigP2 — misma forma que P1 (REQUIRED_FIELDS.P2 es un subconjunto
// de los mismos campos; historia/timeline/itinerario no son obligatorios
// para P2 pero el template los consume si están presentes, por eso se
// generan igual, como arrays vacíos si el operador no completó el textarea).
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigP2(fields) {
  return buildConfigP1({
    ...fields,
    plan:     fields.plan     || 'PREMIUM',
    template: fields.template || 'P2',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// buildConfigP3 — misma forma que P1/P2, sumando titulo (requerido en P3,
// no en P1/P2). Campos derivados de REQUIRED_FIELDS.P3.
// ─────────────────────────────────────────────────────────────────────────────
function buildConfigP3(fields) {
  const base = buildConfigP1({
    ...fields,
    plan:     fields.plan     || 'PREMIUM',
    template: fields.template || 'P3',
  });

  return {
    ...base,
    titulo: fields.titulo || '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE_BUILDERS — dispatcher. Único punto que decide qué forma de config
// se construye según fields.template. Las 6 funciones derivan su lista de
// campos obligatorios de REQUIRED_FIELDS (useConfig.js) — no hay una segunda
// definición del contrato aquí, solo el mapeo de cada campo a su input del
// formulario.
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_BUILDERS = {
  S1: buildConfigS1,
  S2: buildConfigS2,
  S3: buildConfigS3,
  P1: buildConfigP1,
  P2: buildConfigP2,
  P3: buildConfigP3,
};

function buildConfig(fields) {
  const builder = TEMPLATE_BUILDERS[fields.template] || buildConfigS1;
  return builder(fields);
}

// ─────────────────────────────────────────────────────────────────────────────
// ARRAY_FIELDS_POR_TEMPLATE — qué campos de texto libre (arrays) tiene cada
// template y con qué forma de ítem, para poder validarlos ANTES de construir
// el config (ver erroresDeArrays, usado en generar()).
// ─────────────────────────────────────────────────────────────────────────────
const ARRAY_FIELDS_POR_TEMPLATE = {
  S3: [['fotos_raw', null]],
  P1: [['fotos_raw', null], ['itinerario_raw', ['hora', 'descripcion']], ['timeline_raw', ['fecha', 'texto']]],
  P2: [['fotos_raw', null], ['itinerario_raw', ['hora', 'descripcion']], ['timeline_raw', ['fecha', 'texto']]],
  P3: [['fotos_raw', null], ['itinerario_raw', ['hora', 'descripcion']], ['timeline_raw', ['fecha', 'texto']]],
};

function erroresDeArrays(fields) {
  const specs = ARRAY_FIELDS_POR_TEMPLATE[fields.template] || [];
  return specs.flatMap(([campo, itemFields]) => parseLineItems(fields[campo], itemFields).errores);
}

// ─────────────────────────────────────────────────────────────────────────────
// AdminPage
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [fields, setFields] = useState({
  // Producto
  plan:     'STANDARD',
  template: 'S1',
  // Identificación
  slug: '',
    // Datos visibles
    nombre: '',
    subtitulo: '',
    fecha: '',
    hora: '',
    salon: '',
    // Música
    musica_src:    autoSrc(''),
    musica_nombre: '',
    // Evento
    contador:            '',
    confirmacion_limite: '',
    maps_url:            '',
    // Dress code
    dress_code_descripcion: '',
    dress_code_aclaracion:  '',
    // Regalo
    alias: '',
    cvu:   '',
    // Servicio
    apps_script_url: '',
    sheet_id: '',
    // Campos propios de S2/S3 (whatsapp) y S3/P3 (titulo)
    whatsapp_url: '',
    titulo: '',
    // Campos propios de P1/P2/P3
    historia_titulo: '',
    historia_cuerpo: '',
    itinerario_raw: '',
    timeline_raw: '',
    fotos_raw: '',
  });

  // Modo Validación (MAU-2): permite elegir cualquier template registrado
  // técnicamente, sin pasar por el filtro comercial de PLANES. El catálogo
  // sigue siendo la única fuente de verdad de disponibilidad comercial.
  const [modoValidacion, setModoValidacion] = useState(false);

  // Errores del Contrato Ejecutable (MAU-1) + del parser de arrays,
  // detectados antes de generar el config.json — ver generar().
  const [contratoErrores, setContratoErrores] = useState([]);

  const [json,      setJson]      = useState('');
  const [stage,     setStage]     = useState('form'); // 'form' | 'preview'
  const [slugError, setSlugError] = useState(false);

  const [contadorError, setContadorError] = useState(false);
  const [scriptWarn, setScriptWarn] = useState(false);

  // ── Autocompletado protegido de musica_src ───────────────────────────────
  // Inicializado con el slug inicial para evitar edge case en primer render.
  // En el primer render fields.slug es '' → prevSlugRef.current es ''
  // → autoSrc('') coincide con el valor inicial de musica_src → correcto.
  const prevSlugRef = useRef(fields.slug);

  useEffect(() => {
    const prevSlug   = prevSlugRef.current;  // slug ANTERIOR al cambio
    const newSlug    = fields.slug;          // slug NUEVO
    const currentSrc = fields.musica_src;   // valor actual del campo

    // Comparar contra la ruta autogenerada con el slug ANTERIOR.
    // Si coincide: el operador no lo editó → actualizar con slug NUEVO.
    // Si no coincide: el operador lo modificó manualmente → no tocar.
    const wasAuto = currentSrc === autoSrc(prevSlug);

    if (wasAuto) {
      setFields(prev => ({ ...prev, musica_src: autoSrc(newSlug) }));
    }

    // Registrar slug actual como "anterior" para el próximo cambio.
    prevSlugRef.current = newSlug;
  }, [fields.slug]);

  const update = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
    if (key === 'slug') setSlugError(false);
  };

  const updatePlan = (nuevoPlan) => {
    const lista = modoValidacion
      ? TEMPLATES_TECNICOS_POR_PLAN[nuevoPlan]
      : PLANES[nuevoPlan];

    setFields(prev => ({
      ...prev,
      plan:     nuevoPlan,
      template: lista?.[0] || 'S1',
    }));
  };

  const generar = () => {
    const slug = fields.slug.trim();
  
    if (!slug)            { setSlugError(true); return; }
    if (slug === 'admin') { setSlugError(true); return; }
  
    if (fields.contador.trim()) {
      const pasaRegex = ISO_REGEX.test(fields.contador.trim());
      const pasaDate  = !isNaN(new Date(fields.contador.trim()).getTime());
  
      if (!pasaRegex || !pasaDate) {
        setContadorError(true);
        return;
      }
    }
  
    setContadorError(false);
  
    setScriptWarn(!fields.apps_script_url.trim());

    const fieldsConSlug = { ...fields, slug };
    const config = buildConfig(fieldsConSlug);

    // Contrato Ejecutable (MAU-1) + parser de arrays (MAU-2) — misma función
    // validate() que usa useConfig.js en producción, sin una segunda lista
    // de campos obligatorios definida acá.
    const schema = REQUIRED_FIELDS[fields.template] || REQUIRED_FIELDS.S1;
    const camposFaltantes = validate(config, schema);
    const erroresArrays   = erroresDeArrays(fieldsConSlug);

    const errores = [
      ...erroresArrays,
      ...camposFaltantes.map(campo => `Falta completar: ${campo}`),
    ];

    if (errores.length > 0) {
      setContratoErrores(errores);
      return;
    }
    setContratoErrores([]);

    setJson(JSON.stringify(config, null, 2));
  
    setStage('preview');
  
    setTimeout(() => {
      document
        .getElementById('vela-preview')
        ?.scrollIntoView({ behavior: 'smooth' });
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

  // ── Estilos compartidos ──────────────────────────────────────────────────
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

  const inputMutedStyle = {
    ...inputStyle,
    color: '#8B7355',
    fontSize: 13,
    fontFamily: 'monospace',
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

  const hintWarnStyle = {
    fontSize: 11,
    color: '#8B7355',
    marginTop: 8,
    fontWeight: 400,
    background: 'rgba(185,166,142,0.12)',
    padding: '6px 10px',
    borderLeft: '2px solid rgba(185,166,142,0.5)',
  };

  const codeStyle = {
    background: 'rgba(185,166,142,0.15)',
    padding: '1px 6px',
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#8B7355',
    borderRadius: 2,
  };

  const divider = (
    <div className="h-px my-9" style={{ background: 'rgba(185,166,142,0.25)' }} />
  );

  // ── Render ───────────────────────────────────────────────────────────────
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

          {/* ── Brand ── */}
          <div className="flex items-center gap-3 mb-12">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#B9A68E' }}>
              VELA · Admin
            </span>
            <div className="flex-1 h-px" style={{ background: '#B9A68E', opacity: 0.35 }} />
          </div>

          {/* ── Título ── */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: '#1A1A1A', marginBottom: 6 }}>
            Nueva invitación
          </h1>
          <p style={{ fontSize: 13, color: '#B9A68E', fontWeight: 300, marginBottom: 40 }}>
            Completá los campos · generá el config.json · seguí los pasos
          </p>

          <div className="h-px mb-9" style={{ background: 'rgba(185,166,142,0.25)' }} />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Producto VELA                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Producto VELA</p>

          <div className="mb-7 flex items-center justify-between">
            <label style={{ ...labelStyle, marginBottom: 0 }}>Modo Validación</label>
            <button
              type="button"
              onClick={() => {
                const activar = !modoValidacion;
                setModoValidacion(activar);
                // Al cambiar de modo, reencuadrar el template activo contra
                // la lista correspondiente (evita quedar en un template que
                // dejó de estar visible al desactivar el modo).
                const lista = activar
                  ? TEMPLATES_TECNICOS_POR_PLAN[fields.plan]
                  : PLANES[fields.plan];
                if (!lista?.includes(fields.template)) {
                  setFields(prev => ({ ...prev, template: lista?.[0] || 'S1' }));
                }
              }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: '5px 14px',
                border: modoValidacion ? '1px solid #8B7355' : '1px solid rgba(185,166,142,0.4)',
                background: modoValidacion ? '#8B7355' : 'transparent',
                color: modoValidacion ? '#F8F5EF' : '#8B7355',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {modoValidacion ? 'Activado' : 'Desactivado'}
            </button>
          </div>

          {modoValidacion && (
            <div className="mb-7 p-4" style={{ background: 'rgba(139,115,85,0.12)', borderLeft: '2px solid #8B7355' }}>
              <p style={{ fontSize: 12, color: '#8B7355', fontWeight: 500, lineHeight: 1.6 }}>
                ⚠ Modo Validación activo — se muestran todos los templates registrados técnicamente,
                incluso los que el catálogo aún marca "En validación" y no están disponibles
                comercialmente. Usar solo para generar configs de prueba en Preview Deployment.
              </p>
            </div>
          )}

          <div className="mb-7">
            <label style={labelStyle}>Plan</label>
          
            <div className="flex gap-4 mt-1">
              {Object.keys(modoValidacion ? TEMPLATES_TECNICOS_POR_PLAN : PLANES).map(plan => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => updatePlan(plan)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 11,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    padding: '6px 18px',
          
                    border:
                      fields.plan === plan
                        ? '1px solid #1A1A1A'
                        : '1px solid rgba(185,166,142,0.4)',
          
                    background:
                      fields.plan === plan
                        ? '#1A1A1A'
                        : 'transparent',
          
                    color:
                      fields.plan === plan
                        ? '#F8F5EF'
                        : '#8B7355',
          
                    cursor: 'pointer',
                    transition: 'all .2s'
                  }}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-7">
            <label style={labelStyle}>Template</label>
          
            <div className="flex gap-4 mt-1 flex-wrap">
              {(modoValidacion ? TEMPLATES_TECNICOS_POR_PLAN[fields.plan] : PLANES[fields.plan] || []).map(tpl => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => update('template', tpl)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 11,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    padding: '6px 18px',
          
                    border:
                      fields.template === tpl
                        ? '1px solid #1A1A1A'
                        : '1px solid rgba(185,166,142,0.4)',
          
                    background:
                      fields.template === tpl
                        ? '#1A1A1A'
                        : 'transparent',
          
                    color:
                      fields.template === tpl
                        ? '#F8F5EF'
                        : '#8B7355',
          
                    cursor: 'pointer',
                    transition: 'all .2s'
                  }}
                >
                  {tpl}
                  {modoValidacion && esEnValidacion(tpl) && (
                    <span style={{ marginLeft: 8, fontSize: 9, opacity: 0.75 }}>· En validación</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {divider}
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Identificación                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
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

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Datos de la invitación                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
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

          {(fields.template === 'S3' || fields.template === 'P3') && (
            <div className="mb-7">
              <label style={labelStyle}>Título</label>
              <input
                style={inputStyle}
                value={fields.titulo}
                onChange={e => update('titulo', e.target.value)}
                placeholder="Mis XV"
              />
              <p style={hintStyle}>Campo propio de S3 y P3 — se muestra como encabezado, independiente del nombre.</p>
            </div>
          )}

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
              <label style={labelStyle}>Fecha display</label>
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

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Evento                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Evento</p>

          <div className="mb-7">
            <label style={labelStyle}>Contador (fecha ISO)</label>
            <input
              style={{
                ...inputStyle,
                borderBottomColor:
                  contadorError
                    ? '#c4848a'
                    : 'rgba(185,166,142,0.5)',
              }}
              value={fields.contador}
              onChange={e => {
                update('contador', e.target.value);
                setContadorError(false);
              }}
              placeholder="2026-08-15T21:00:00"
            />
          
            {contadorError ? (
              <p
                style={{
                  fontSize:11,
                  color:'#c4848a',
                  marginTop:4
                }}
              >
                Formato inválido — usar exactamente:
                AAAA-MM-DDTHH:MM:SS
              </p>
            ) : (
              <p style={hintStyle}>
                Formato exacto:
                AAAA-MM-DDTHH:MM:SS — determina la cuenta regresiva.
              </p>
            )}
          </div>
          
          <div className="mb-7">
            <label style={labelStyle}>Confirmar antes del</label>
            <input
              style={inputStyle}
              value={fields.confirmacion_limite}
              onChange={e => update('confirmacion_limite', e.target.value)}
              placeholder="1 de Agosto"
            />
            <p style={hintStyle}>Texto libre. Se muestra en la sección de confirmación.</p>
          </div>

          <div className="mb-7">
            <label style={labelStyle}>Link Google Maps</label>
            <input
              style={inputStyle}
              value={fields.maps_url}
              onChange={e => update('maps_url', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <p style={hintStyle}>URL completa del lugar en Google Maps.</p>
          </div>

          {(fields.template === 'S2' || fields.template === 'S3') && (
            <div className="mb-7">
              <label style={labelStyle}>Link de WhatsApp</label>
              <input
                style={inputStyle}
                value={fields.whatsapp_url}
                onChange={e => update('whatsapp_url', e.target.value)}
                placeholder="https://wa.me/549..."
              />
              <p style={hintStyle}>Campo propio de S2 y S3 — obligatorio para este template.</p>
            </div>
          )}

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Dress Code                                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Dress Code</p>

          <div className="mb-7">
            <label style={labelStyle}>Descripción</label>
            <input
              style={inputStyle}
              value={fields.dress_code_descripcion}
              onChange={e => update('dress_code_descripcion', e.target.value)}
              placeholder="Elegante"
            />
          </div>

          <div className="mb-7">
            <label style={labelStyle}>Aclaración</label>
            <input
              style={inputStyle}
              value={fields.dress_code_aclaracion}
              onChange={e => update('dress_code_aclaracion', e.target.value)}
              placeholder="Evitar zapatillas deportivas"
            />
            <p style={hintStyle}>Opcional. Se muestra debajo de la descripción.</p>
          </div>

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Música                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Música</p>

          <div className="mb-7">
            <label style={labelStyle}>Ruta del archivo</label>
          
            <input
              style={inputMutedStyle}
              value={fields.musica_src}
              onChange={e => update('musica_src', e.target.value)}
            />
          
            <p style={hintStyle}>
              Se actualiza automáticamente con el slug. Editable si el archivo tiene otro nombre.
            </p>
          
            {!isMusicSrcValid(fields.musica_src)
              && fields.musica_src.trim() !== '' && (
              <p
                style={{
                  fontSize:11,
                  color:'#c4848a',
                  marginTop:4
                }}
              >
                La ruta no parece válida — debe comenzar con / o contener ://
              </p>
            )}
          </div>
          
          <div className="mb-7">
            <label style={labelStyle}>Nombre de la canción</label>
            <input
              style={inputStyle}
              value={fields.musica_nombre}
              onChange={e => update('musica_nombre', e.target.value)}
              placeholder="Taylor Swift — Cruel Summer"
            />
            <p style={hintStyle}>Se muestra en la sección de música.</p>
          </div>

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Regalo                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Regalo</p>

          <div className="mb-7">
            <label style={labelStyle}>Alias</label>
            <input
              style={inputStyle}
              value={fields.alias}
              onChange={e => update('alias', e.target.value)}
              placeholder="melani.mp"
            />
          </div>

          <div className="mb-7">
            <label style={labelStyle}>CVU</label>
            <input
              style={inputStyle}
              value={fields.cvu}
              onChange={e => update('cvu', e.target.value)}
              placeholder="0000003100086337366028"
            />
          </div>

          {divider}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Historia y contenido PREMIUM (P1/P2/P3)               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {['P1', 'P2', 'P3'].includes(fields.template) && (
            <>
              <p style={sectionTitle}>Historia</p>

              <div className="mb-7">
                <label style={labelStyle}>Título de la historia</label>
                <input
                  style={inputStyle}
                  value={fields.historia_titulo}
                  onChange={e => update('historia_titulo', e.target.value)}
                  placeholder="Nuestra historia"
                />
              </div>

              <div className="mb-7">
                <label style={labelStyle}>Cuerpo</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90 }}
                  value={fields.historia_cuerpo}
                  onChange={e => update('historia_cuerpo', e.target.value)}
                  placeholder="Texto libre, se muestra tal cual."
                  rows={4}
                />
              </div>

              {divider}

              <p style={sectionTitle}>Timeline</p>
              <div className="mb-7">
                <label style={labelStyle}>Una línea por ítem — formato: fecha | texto</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace', fontSize: 13 }}
                  value={fields.timeline_raw}
                  onChange={e => update('timeline_raw', e.target.value)}
                  placeholder={'2010 | Nace Melani\n2020 | Primer viaje en familia'}
                  rows={4}
                  spellCheck={false}
                />
                <p style={hintStyle}>El orden de las líneas se preserva tal cual en el array final.</p>
              </div>

              {divider}

              <p style={sectionTitle}>Itinerario</p>
              <div className="mb-7">
                <label style={labelStyle}>Una línea por ítem — formato: hora | descripción</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace', fontSize: 13 }}
                  value={fields.itinerario_raw}
                  onChange={e => update('itinerario_raw', e.target.value)}
                  placeholder={'19:00 | Recepción de invitados\n21:00 | Entrada de la quinceañera'}
                  rows={4}
                  spellCheck={false}
                />
              </div>

              {divider}
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Fotos (S3 opcional · P1/P2/P3)                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {['S3', 'P1', 'P2', 'P3'].includes(fields.template) && (
            <>
              <p style={sectionTitle}>Fotos</p>
              <div className="mb-7">
                <label style={labelStyle}>Una URL por línea</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace', fontSize: 13 }}
                  value={fields.fotos_raw}
                  onChange={e => update('fotos_raw', e.target.value)}
                  placeholder={'https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg'}
                  rows={4}
                  spellCheck={false}
                />
                <p style={hintStyle}>
                  {fields.template === 'S3' ? 'Opcional en S3.' : 'Sin URLs, se genera un array vacío.'}
                </p>
              </div>

              {divider}
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN: Servicio                                              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <p style={sectionTitle}>Servicio</p>
          
          <div className="mb-7">
            <label style={labelStyle}>Apps Script URL</label>
          
            <input
              style={inputStyle}
              value={fields.apps_script_url}
              onChange={e => {
                update('apps_script_url', e.target.value);
                setScriptWarn(false);
              }}
              placeholder="https://script.google.com/macros/s/..."
            />
          
            <p style={hintWarnStyle}>
              Campo crítico. Sin esta URL las confirmaciones de asistencia no llegan a Google Sheets.
            </p>
          
            {scriptWarn && (
              <p
                style={{
                  fontSize:11,
                  color:'#c4848a',
                  marginTop:6,
                  fontWeight:500
                }}
              >
                ⚠ Generaste sin Apps Script URL — las confirmaciones no funcionarán.
              </p>
            )}
          </div>
          
          {/* NUEVO: Sheet ID */}
          <div className="mb-7">
            <label style={labelStyle}>Sheet ID</label>
          
            <input
              style={inputStyle}
              value={fields.sheet_id}
              onChange={e => update('sheet_id', e.target.value)}
              placeholder="ID de la hoja"
            />
          
            <p style={hintStyle}>
              ID de la hoja de Google Sheets vinculada.
            </p>
          </div>

          {/* ── Errores del Contrato Ejecutable (MAU-1) + parser (MAU-2) ── */}
          {contratoErrores.length > 0 && (
            <div className="mb-5 p-4" style={{ background: 'rgba(196,132,138,0.1)', borderLeft: '2px solid #c4848a' }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4848a', fontWeight: 600, marginBottom: 8 }}>
                No se puede generar — {contratoErrores.length} {contratoErrores.length === 1 ? 'problema' : 'problemas'}
              </p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {contratoErrores.map((e, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#8B4550', marginBottom: 4, lineHeight: 1.5 }}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Botón generar ── */}
          <button
            onClick={generar}
            className="w-full py-4 mt-2"
            style={{ background: '#1A1A1A', color: '#F8F5EF', border: 'none', fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#8B7355'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
          >
            Generar config.json
          </button>

          {/* ── Preview ── */}
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
                rows={28}
                className="w-full p-5 outline-none"
                style={{ background: '#fff', border: 'none', color: '#1A1A1A', fontFamily: "'Courier New', monospace", fontSize: 12.5, lineHeight: 1.7, display: 'block' }}
                spellCheck={false}
              />
            </div>
          )}

          {/* ── Instrucciones ── */}
          {stage === 'preview' && (
            <div className="mt-8 p-7" style={{ border: '1px solid rgba(185,166,142,0.35)', background: 'rgba(248,245,239,0.7)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8B7355', marginBottom: 20 }}>
                Próximos pasos
              </p>
              {[
                ['01', <span>Crear carpeta <code style={codeStyle}>public/clientes/{fields.slug.trim()}/</code> en el repositorio</span>],
                ['02', <span>Copiar <code style={codeStyle}>config.json</code> descargado dentro de esa carpeta</span>],
                ['03', <span>Subir el archivo de música a <code style={codeStyle}>{fields.musica_src}</code></span>],
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
