import { useConfig } from '../hooks/useConfig';
import Standard1 from './standard1.jsx';

// ─────────────────────────────────────────────────────────────
// templateMap
// Agregar nuevos templates aquí únicamente.
// ─────────────────────────────────────────────────────────────
const templateMap = {
  S1: Standard1,
};

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

  const Component =
    templateMap[template] ?? Standard1;

  return <Component />;
}
