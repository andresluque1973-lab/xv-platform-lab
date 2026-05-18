import Standard1 from './templates/standard1.jsx';
import AdminPage from './admin/AdminPage.jsx';

function AppRouter() {
  const slug = window.location.pathname.split('/')[1] || '';

  console.log('[AppRouter] pathname:', window.location.pathname);
  console.log('[AppRouter] slug:', JSON.stringify(slug));
  console.log('[AppRouter] slug===admin:', slug === 'admin');

  if (slug === 'admin') {
    return <AdminPage />;
  }

  return <Standard1 />;
}

export default AppRouter;
