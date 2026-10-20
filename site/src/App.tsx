import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, Toaster } from 'pada-ds';
import { SiteHeader } from './shell/SiteHeader';
import { SiteFooter } from './shell/SiteFooter';
import { LandingPage } from './landing/LandingPage';
import { DocsRoutes } from './docs/DocsRoutes';
import { ChangelogPage } from './pages/ChangelogPage';
import { BrandPage } from './pages/BrandPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MediaStage } from './pages/MediaStage';
import { metaFor } from './lib/meta';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = metaFor(pathname).title;
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function App() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/media/')) {
    return (
      <ThemeProvider target="root" defaultTheme="light">
        <Routes>
          <Route path="/media/:scene" element={<MediaStage />} />
        </Routes>
        <Toaster position="bottom-right" />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider target="root" defaultTheme="system" storageKey="pada-site-theme">
      <a className="skip-link" href="#main">Skip to content</a>
      <RouteEffects />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs/*" element={<DocsRoutes />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
