import { useConfig } from '../hooks/useConfig';
import { templateRegistry } from './templateRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// templateRegistry
// Agregar nuevos templates únicamente en templateRegistry.js.
// ─────────────────────────────────────────────────────────────────────────────

// DEUDA-001:
// Doble useConfig aceptado para MVP.
// TemplateLoader lee config.template.
// Standard1 sigue usando su propio hook interno.
// Optimización futura: pasar config por props.

export default function TemplateLoader({ slug }) {
  const { config, error } = useConfig(slug);

  if (!config && !error) return null;

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#1a1a1a',
          color: '#e8b4b8',
          fontFamily: 'Georgia, serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p>No se pudo cargar la invitación.</p>
      </div>
    );
  }

  const template = config?.template;

  const fallbackComponent = templateRegistry['S1']?.component;

  const Component =
    templateRegistry[template]?.component || fallbackComponent;

  return <Component />;
}
