// ─────────────────────────────────────────────────────────────────────────────
// src/admin/ClientesPage.jsx
// Vista operativa del registro de clientes — FASE 9
//
// PROPÓSITO
// Visibilidad operativa de data/clientes/index.json.
// Solo lectura. Sin edición, sin creación, sin eliminación.
//
// DATOS
// Consume data/clientes/index.json directamente (import estático, Vite bundle).
// Riesgo conocido y aceptado: el registro no contiene datos sensibles.
//
// ORDENAMIENTO
// 1° deployed  → fecha_evento asc (nulls al final del grupo)
// 2° draft     → fecha_evento asc (nulls al final del grupo)
// 3° archived  → fecha_evento asc (nulls al final del grupo)
//
// MÉTRICAS
// - Total clientes
// - Activos (deployed)
// - Próximos 30 días (fecha_evento dentro de los próximos 30 días, estado deployed)
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import registroRaw from '../../data/clientes/index.json';

// ── Orden de grupos de estado ────────────────────────────────────────────────
const ESTADO_ORDEN = { deployed: 0, draft: 1, archived: 2 };

// ── Helpers de fecha ─────────────────────────────────────────────────────────
function parseFecha(str) {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function formatFecha(str) {
  const d = parseFecha(str);
  if (!d) return '—';
  return d.toLocaleDateString('es-AR', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });
}

function diasHasta(str) {
  const d = parseFecha(str);
  if (!d) return null;
  const hoy  = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.ceil((d - hoy) / 86400000);
}

// ── Ordenamiento ─────────────────────────────────────────────────────────────
function ordenarClientes(clientes) {
  return [...clientes].sort((a, b) => {
    // 1° por grupo de estado
    const ga = ESTADO_ORDEN[a.deploy_estado] ?? 99;
    const gb = ESTADO_ORDEN[b.deploy_estado] ?? 99;
    if (ga !== gb) return ga - gb;

    // 2° por fecha_evento asc dentro del grupo, nulls al final
    const fa = parseFecha(a.fecha_evento);
    const fb = parseFecha(b.fecha_evento);
    if (!fa && !fb) return 0;
    if (!fa) return 1;
    if (!fb) return -1;
    return fa - fb;
  });
}

// ── Métricas ─────────────────────────────────────────────────────────────────
function calcularMetricas(clientes) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const en30 = new Date(hoy);
  en30.setDate(en30.getDate() + 30);

  return {
    total:   clientes.length,
    activos: clientes.filter(c => c.deploy_estado === 'deployed').length,
    proximos: clientes.filter(c => {
      if (c.deploy_estado !== 'deployed') return false;
      const f = parseFecha(c.fecha_evento);
      if (!f) return false;
      return f >= hoy && f <= en30;
    }).length,
  };
}

// ── Estilos compartidos (coherentes con AdminPage) ───────────────────────────
const PALETA = {
  fondo:      '#F8F5EF',
  taupe:      '#B9A68E',
  mocha:      '#8B7355',
  negro:      '#1A1A1A',
  champagne:  '#E6D3A8',
  borde:      'rgba(185,166,142,0.25)',
  bordeMedio: 'rgba(185,166,142,0.5)',
};

const ESTADO_ESTILO = {
  deployed: {
    background: 'rgba(139,115,85,0.12)',
    color:      '#8B7355',
    border:     '1px solid rgba(139,115,85,0.3)',
    label:      'Activo',
  },
  draft: {
    background: 'rgba(230,211,168,0.2)',
    color:      '#8B7355',
    border:     '1px solid rgba(230,211,168,0.5)',
    label:      'En preparación',
  },
  archived: {
    background: 'rgba(185,166,142,0.1)',
    color:      '#B9A68E',
    border:     '1px solid rgba(185,166,142,0.2)',
    label:      'Archivado',
  },
};

// ── Componente de etiqueta de estado ─────────────────────────────────────────
function EstadoBadge({ estado }) {
  const estilo = ESTADO_ESTILO[estado] ?? ESTADO_ESTILO.archived;
  return (
    <span style={{
      display:      'inline-block',
      padding:      '2px 10px',
      fontSize:     10,
      letterSpacing:'0.2em',
      textTransform:'uppercase',
      fontWeight:   500,
      background:   estilo.background,
      color:        estilo.color,
      border:       estilo.border,
    }}>
      {estilo.label}
    </span>
  );
}

// ── Componente de métrica ─────────────────────────────────────────────────────
function Metrica({ valor, label, acento }) {
  return (
    <div style={{
      flex:        1,
      padding:     '20px 24px',
      border:      `1px solid ${PALETA.borde}`,
      textAlign:   'center',
      background:  acento ? 'rgba(230,211,168,0.15)' : 'transparent',
    }}>
      <div style={{
        fontFamily:  "'Cormorant Garamond', serif",
        fontSize:    32,
        fontWeight:  400,
        color:       PALETA.negro,
        lineHeight:  1,
        marginBottom:6,
      }}>
        {valor}
      </div>
      <div style={{
        fontSize:     10,
        letterSpacing:'0.3em',
        textTransform:'uppercase',
        color:        PALETA.taupe,
        fontWeight:   500,
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Fila de la tabla ─────────────────────────────────────────────────────────
function FilaCliente({ cliente, esUltimo }) {
  const diasEvento     = diasHasta(cliente.fecha_evento);
  const diasVencimiento = diasHasta(cliente.vence_en);

  const alertaEvento      = diasEvento !== null && diasEvento >= 0 && diasEvento <= 30 && cliente.deploy_estado === 'deployed';
  const alertaVencimiento = diasVencimiento !== null && diasVencimiento >= 0 && diasVencimiento <= 15;

  const celdaBase = {
    padding:       '14px 16px',
    fontSize:      13,
    color:         PALETA.negro,
    fontWeight:    300,
    verticalAlign: 'middle',
    borderBottom:  esUltimo ? 'none' : `1px solid ${PALETA.borde}`,
  };

  return (
    <tr style={{ transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(185,166,142,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Cliente */}
      <td style={celdaBase}>
        <span style={{ fontWeight: 400 }}>{cliente.cliente_nombre || '—'}</span>
      </td>

      {/* Slug */}
      <td style={celdaBase}>
        <span style={{
          fontFamily: 'monospace',
          fontSize:   12,
          color:      PALETA.mocha,
        }}>
          {cliente.slug}
        </span>
      </td>

      {/* Estado */}
      <td style={celdaBase}>
        <EstadoBadge estado={cliente.deploy_estado} />
      </td>

      {/* Plan */}
      <td style={{ ...celdaBase, color: PALETA.taupe }}>
        {cliente.plan ?? '—'}
      </td>

      {/* Template */}
      <td style={{ ...celdaBase, color: PALETA.taupe, fontFamily: 'monospace', fontSize: 12 }}>
        {cliente.template ?? '—'}
      </td>

      {/* Evento */}
      <td style={{
        ...celdaBase,
        color: alertaEvento ? PALETA.mocha : PALETA.negro,
        fontWeight: alertaEvento ? 500 : 300,
      }}>
        <span>{formatFecha(cliente.fecha_evento)}</span>
        {alertaEvento && (
          <span style={{
            display:      'block',
            fontSize:     9,
            letterSpacing:'0.2em',
            textTransform:'uppercase',
            color:        PALETA.mocha,
            marginTop:    2,
            opacity:      0.8,
          }}>
            {diasEvento === 0 ? 'hoy' : `en ${diasEvento}d`}
          </span>
        )}
      </td>

      {/* Vencimiento */}
      <td style={{
        ...celdaBase,
        color: alertaVencimiento ? '#a07040' : PALETA.taupe,
        fontWeight: alertaVencimiento ? 500 : 300,
      }}>
        <span>{formatFecha(cliente.vence_en)}</span>
        {alertaVencimiento && (
          <span style={{
            display:      'block',
            fontSize:     9,
            letterSpacing:'0.2em',
            textTransform:'uppercase',
            color:        '#a07040',
            marginTop:    2,
            opacity:      0.8,
          }}>
            {diasVencimiento === 0 ? 'hoy' : `en ${diasVencimiento}d`}
          </span>
        )}
      </td>

      {/* URL */}
      <td style={celdaBase}>
        <a
          href={`/${cliente.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:     'monospace',
            fontSize:       12,
            color:          PALETA.mocha,
            textDecoration: 'none',
            borderBottom:   `1px solid rgba(139,115,85,0.3)`,
            paddingBottom:  1,
            transition:     'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderBottomColor = PALETA.mocha}
          onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'rgba(139,115,85,0.3)'}
        >
          /{cliente.slug}
        </a>
      </td>
    </tr>
  );
}

// ── ClientesPage ─────────────────────────────────────────────────────────────
export default function ClientesPage() {
  const clientes  = useMemo(() => ordenarClientes(registroRaw.clientes), []);
  const metricas  = useMemo(() => calcularMetricas(registroRaw.clientes), []);

  const labelStyle = {
    fontSize:      10,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color:         PALETA.mocha,
    fontWeight:    500,
  };

  const thStyle = {
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
          Clientes
        </h1>
        <p style={{ fontSize: 13, color: PALETA.taupe, fontWeight: 300, marginBottom: 40 }}>
          Registro operativo · solo lectura
        </p>

        <div className="h-px mb-9" style={{ background: PALETA.borde }} />

        {/* ── Métricas ── */}
        <p style={{ ...labelStyle, marginBottom: 16 }}>Resumen</p>
        <div className="flex gap-0 mb-10" style={{ border: `1px solid ${PALETA.borde}` }}>
          <Metrica valor={metricas.total}    label="Total clientes" />
          <div style={{ width: 1, background: PALETA.borde }} />
          <Metrica valor={metricas.activos}  label="Activos" />
          <div style={{ width: 1, background: PALETA.borde }} />
          <Metrica valor={metricas.proximos} label="Próximos 30 días" acento={metricas.proximos > 0} />
        </div>

        <div className="h-px mb-9" style={{ background: PALETA.borde }} />

        {/* ── Tabla ── */}
        <p style={{ ...labelStyle, marginBottom: 16 }}>Registro</p>

        <div style={{
          border:   `1px solid ${PALETA.borde}`,
          overflowX:'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(185,166,142,0.08)' }}>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Template</th>
                <th style={thStyle}>Evento</th>
                <th style={thStyle}>Vencimiento</th>
                <th style={thStyle}>URL</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, idx) => (
                <FilaCliente
                  key={cliente.slug}
                  cliente={cliente}
                  esUltimo={idx === clientes.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pie ── */}
        <p style={{
          fontSize:     11,
          color:        PALETA.taupe,
          marginTop:    20,
          fontWeight:   300,
          textAlign:    'right',
          opacity:      0.7,
        }}>
          {clientes.length} {clientes.length === 1 ? 'registro' : 'registros'} · v{registroRaw.version}
        </p>

      </div>
    </div>
  );
}
