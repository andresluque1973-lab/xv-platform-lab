// ─────────────────────────────────────────────────────────────────────────────
// src/admin/RsvpPage.jsx
// Vista operativa RSVP (P1/P2/P3) — FASE 29, Subetapa 29.1 (shell)
//
// PROPÓSITO
// Selector de clientes elegibles para la Vista RSVP. Esta subetapa NO llama
// a `action=getConfirmados` ni renderiza la tabla de confirmados — eso es
// objeto de subetapas posteriores (29.2/29.3). Aquí solo se resuelve el
// universo de clientes elegibles y se lo muestra en un selector.
//
// REGLA DE ELEGIBILIDAD (aprobada en Subetapa 29.0.1 — sin excepciones)
// 1. `data/clientes/index.json` aporta el universo de slugs candidatos y el
//    filtro operacional `deploy_estado === "deployed"`.
// 2. `index.json.template` NUNCA participa en esta decisión (campo no
//    confiable — ver docs/Fase 29.md / hallazgo 29.0).
// 3. La variante efectiva de cada cliente se resuelve en runtime leyendo
//    su propio `public/clientes/{slug}/config.json` (mismo mecanismo que
//    ya usa `useConfig.js` para resolver el template en el runtime público).
// 4. `templateRegistry[config.template].category === "premium"` determina
//    si el cliente es P1/P2/P3. No se hardcodea la lista de códigos acá.
//
// IMPORTANTE — sin casos especiales por slug
// Esta lógica es genérica: no existe ninguna condición para el slug
// `prueba` ni para ningún otro slug particular. `prueba` queda fuera del
// selector únicamente porque no está registrado en `index.json` — el mismo
// comportamiento que tendría cualquier otro cliente no registrado.
//
// ALCANCE DE ESTA SUBETAPA
// Solo lectura. Sin `action=getConfirmados`, sin tabla de confirmados, sin
// routing URL nuevo, sin cache, sin backend nuevo.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import registroRaw from '../../data/clientes/index.json';
import { templateRegistry } from '../templates/templateRegistry.js';

// ── Estilos (coherentes con AdminShell / ClientesPage / paleta VELA) ────────
const PALETA = {
  fondo:      '#F8F5EF',
  taupe:      '#B9A68E',
  mocha:      '#8B7355',
  negro:      '#1A1A1A',
  champagne:  '#E6D3A8',
  borde:      'rgba(185,166,142,0.25)',
  bordeMedio: 'rgba(185,166,142,0.5)',
};

// ── Resolución de elegibilidad ───────────────────────────────────────────────
// Dado un cliente de index.json, hace fetch a su config.json público y
// determina si es elegible (category === 'premium'). No lanza — cualquier
// fallo (config.json ausente, JSON inválido, template desconocido) resuelve
// a "no elegible", sin interrumpir la resolución del resto de los clientes.
async function resolverElegibilidad(cliente) {
  try {
    const res = await fetch(`/clientes/${cliente.slug}/config.json`, { cache: 'no-store' });
    if (!res.ok) return null;

    const config = await res.json();
    const template = config?.template;
    const entry = template ? templateRegistry[template] : null;

    if (!entry || entry.category !== 'premium') return null;

    return {
      slug:           cliente.slug,
      cliente_nombre: cliente.cliente_nombre,
      template,
    };
  } catch {
    // Sin red, config.json ausente o JSON inválido: cliente no elegible.
    // No es un error de la Vista RSVP — es información insuficiente sobre
    // ese cliente puntual.
    return null;
  }
}

// ── RsvpPage ──────────────────────────────────────────────────────────────────
export default function RsvpPage() {
  const [estado, setEstado]           = useState('cargando'); // 'cargando' | 'listo'
  const [elegibles, setElegibles]     = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function resolverUniverso() {
      const candidatos = registroRaw.clientes.filter(
        c => c.deploy_estado === 'deployed'
      );

      const resultados = await Promise.all(candidatos.map(resolverElegibilidad));
      const encontrados = resultados.filter(Boolean);

      if (!cancelado) {
        setElegibles(encontrados);
        setEstado('listo');
      }
    }

    resolverUniverso();
    return () => { cancelado = true; };
  }, []);

  const labelStyle = {
    fontSize:      10,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color:         PALETA.mocha,
    fontWeight:    500,
  };

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ background: PALETA.fondo, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Título ── */}
        <h1 style={{
          fontFamily:   "'Cormorant Garamond', serif",
          fontSize:     32,
          fontWeight:   400,
          color:        PALETA.negro,
          marginBottom: 6,
        }}>
          RSVP
        </h1>
        <p style={{ fontSize: 13, color: PALETA.taupe, fontWeight: 300, marginBottom: 40 }}>
          Vista operativa de confirmados · P1 / P2 / P3
        </p>

        <div className="h-px mb-9" style={{ background: PALETA.borde }} />

        {/* ── Selector ── */}
        <p style={{ ...labelStyle, marginBottom: 16 }}>Cliente</p>

        {estado === 'cargando' && (
          <p style={{
            fontSize:   13,
            color:      PALETA.taupe,
            fontWeight: 300,
            fontStyle:  'italic',
          }}>
            Resolviendo clientes elegibles…
          </p>
        )}

        {estado === 'listo' && elegibles.length === 0 && (
          <p style={{
            fontSize:   13,
            color:      PALETA.taupe,
            fontWeight: 300,
            fontStyle:  'italic',
          }}>
            No hay clientes P1/P2/P3 desplegados todavía. El catálogo
            productivo actual no incluye ningún cliente elegible para
            esta vista.
          </p>
        )}

        {estado === 'listo' && elegibles.length > 0 && (
          <div style={{
            border:    `1px solid ${PALETA.borde}`,
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(185,166,142,0.08)' }}>
                  <th style={thStyle()}>Cliente</th>
                  <th style={thStyle()}>Slug</th>
                  <th style={thStyle()}>Template</th>
                  <th style={thStyle()}></th>
                </tr>
              </thead>
              <tbody>
                {elegibles.map((cliente, idx) => (
                  <FilaElegible
                    key={cliente.slug}
                    cliente={cliente}
                    esUltimo={idx === elegibles.length - 1}
                    seleccionado={seleccionado === cliente.slug}
                    onSeleccionar={() => setSeleccionado(cliente.slug)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Placeholder del panel de detalle ── */}
        {seleccionado && (
          <>
            <div className="h-px my-9" style={{ background: PALETA.borde }} />
            <p style={{ ...labelStyle, marginBottom: 16 }}>Confirmados</p>
            <p style={{
              fontSize:   13,
              color:      PALETA.taupe,
              fontWeight: 300,
              fontStyle:  'italic',
            }}>
              {seleccionado} — vista de confirmados pendiente de
              implementación (Subetapa 29.3).
            </p>
          </>
        )}

      </div>
    </div>
  );
}

// ── Estilos de tabla (coherentes con ClientesPage) ────────────────────────────
function thStyle() {
  return {
    padding:       '10px 16px',
    fontSize:      9,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color:         PALETA.taupe,
    fontWeight:    500,
    textAlign:     'left',
    borderBottom:  `1px solid ${PALETA.bordeMedio}`,
    whiteSpace:    'nowrap',
  };
}

// ── Fila de la tabla de elegibles ─────────────────────────────────────────────
function FilaElegible({ cliente, esUltimo, seleccionado, onSeleccionar }) {
  const celdaBase = {
    padding:       '14px 16px',
    fontSize:      13,
    color:         PALETA.negro,
    fontWeight:    300,
    verticalAlign: 'middle',
    borderBottom:  esUltimo ? 'none' : `1px solid ${PALETA.borde}`,
  };

  return (
    <tr
      style={{
        transition: 'background 0.15s',
        background: seleccionado ? 'rgba(230,211,168,0.15)' : 'transparent',
        cursor:     'pointer',
      }}
      onClick={onSeleccionar}
      onMouseEnter={e => { if (!seleccionado) e.currentTarget.style.background = 'rgba(185,166,142,0.06)'; }}
      onMouseLeave={e => { if (!seleccionado) e.currentTarget.style.background = 'transparent'; }}
    >
      <td style={celdaBase}>
        <span style={{ fontWeight: 400 }}>{cliente.cliente_nombre || '—'}</span>
      </td>
      <td style={celdaBase}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: PALETA.mocha }}>
          {cliente.slug}
        </span>
      </td>
      <td style={{ ...celdaBase, color: PALETA.taupe, fontFamily: 'monospace', fontSize: 12 }}>
        {cliente.template}
      </td>
      <td style={{ ...celdaBase, textAlign: 'right' }}>
        <span style={{
          fontSize:      10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         PALETA.mocha,
          opacity:       seleccionado ? 1 : 0.5,
        }}>
          {seleccionado ? 'seleccionado' : 'seleccionar'}
        </span>
      </td>
    </tr>
  );
}
