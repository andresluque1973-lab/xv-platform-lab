import Standard1 from './templates/standard1.jsx';
import AdminPage from './admin/AdminPage.jsx';

function AppRouter() {
  const slug = window.location.pathname.split('/')[1] || '';

  if (slug === 'admin') {
    return <AdminPage />;
  }

  // Futuras rutas: standard2, expirado, landing, notFound
  return <Standard1 />;
}

export default AppRouter;
