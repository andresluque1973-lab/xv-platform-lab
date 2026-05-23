import TemplateLoader from './templates/TemplateLoader.jsx';
import AdminPage from './admin/AdminPage.jsx';

function AppRouter() {
  const slug = window.location.pathname.split('/')[1] || '';

  console.log('[AppRouter] pathname:', window.location.pathname);
  console.log('[AppRouter] slug:', JSON.stringify(slug));
  console.log('[AppRouter] slug===admin:', slug === 'admin');

  if (slug === 'admin') {
    return <AdminPage />;
  }

  return <TemplateLoader slug={slug} />;
}

export default AppRouter;
