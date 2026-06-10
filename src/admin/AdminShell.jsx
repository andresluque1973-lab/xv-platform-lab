// ─────────────────────────────────────────────────────────────────────────────
// src/admin/AdminShell.jsx
// Punto de entrada único de /admin — FASE 9
//
// PROPÓSITO
// Envuelve las páginas del panel administrativo con navegación interna por tabs.
// No conoce lógica de negocio de ninguna página.
// No usa router externo. El estado del tab activo vive en memoria local.
//
// TABS
// - generador → GeneradorPage (genera config.json)
// - clientes  → ClientesPage  (registro operativo de clientes)
//
// EXTENSIÓN FUTURA
// Al agregar un nuevo tab: agregar entrada a TABS y caso en el render.
// No modificar la lógica de navegación existente.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import GeneradorPage from './GeneradorPage.jsx';
import ClientesPage  from './ClientesPage.jsx';

// ── Definición de tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: 'generador', label: 'Generador' },
  { id: 'clientes',  label: 'Clientes'  },
];

// ── Estilos (coherentes con AdminPage / paleta VELA) ─────────────────────────
const PALETA = {
  fondo:      '#F8F5EF',
  taupe:      '#B9A68E',
  mocha:      '#8B7355',
  negro:      '#1A1A1A',
  borde:      'rgba(185,166,142,0.25)',
  bordeMedio: 'rgba(185,166,142,0.5)',
};

export default function AdminShell() {
  const [tabActivo, setTabActivo] = useState('generador');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap');
      `}</style>

      {/* ── Barra de navegación superior ── */}
      <nav style={{
        position:   'sticky',
        top:        0,
        zIndex:     100,
        background: PALETA.fondo,
        borderBottom:`1px solid ${PALETA.borde}`,
        display:    'flex',
        alignItems: 'center',
        padding:    '0 24px',
        height:     52,
        gap:        0,
      }}>

        {/* Brand */}
        <span style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      11,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color:         PALETA.taupe,
          marginRight:   32,
          userSelect:    'none',
        }}>
          VELA
        </span>

        {/* Separador vertical */}
        <div style={{ width: 1, height: 20, background: PALETA.borde, marginRight: 32 }} />

        {/* Tabs */}
        {TABS.map(tab => {
          const activo = tabActivo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActivo(tab.id)}
              style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                background:    'transparent',
                border:        'none',
                borderBottom:  activo
                  ? `1.5px solid ${PALETA.negro}`
                  : '1.5px solid transparent',
                color:         activo ? PALETA.negro : PALETA.taupe,
                padding:       '0 0 2px 0',
                marginRight:   28,
                cursor:        'pointer',
                height:        '100%',
                transition:    'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                if (!activo) e.currentTarget.style.color = PALETA.mocha;
              }}
              onMouseLeave={e => {
                if (!activo) e.currentTarget.style.color = PALETA.taupe;
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ── Contenido del tab activo ── */}
      {tabActivo === 'generador' && <GeneradorPage />}
      {tabActivo === 'clientes'  && <ClientesPage  />}
    </>
  );
}
