import TemplateLoader from './templates/TemplateLoader.jsx';
import AdminShell from './admin/AdminShell.jsx';

function AppRouter() {
  const slug = window.location.pathname.split('/')[1] || '';

  console.log('[AppRouter] pathname:', window.location.pathname);
  console.log('[AppRouter] slug:', JSON.stringify(slug));
  console.log('[AppRouter] slug===admin:', slug === 'admin');

  if (slug === 'admin') {
    return <AdminShell />;
  }

  return <TemplateLoader slug={slug} />;
}

export default AppRouter;
