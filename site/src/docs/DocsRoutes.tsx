import { Route, Routes } from 'react-router-dom';
import { useReveal } from '../lib/useReveal';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Overview } from './pages/Overview';
import { GettingStarted } from './pages/GettingStarted';
import { Theming } from './pages/Theming';
import { Tokens } from './pages/Tokens';
import { Foundations } from './pages/Foundations';
import { Headless } from './pages/Headless';
import { AiGuide } from './pages/AiGuide';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';

export function DocsRoutes() {
  useReveal();
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="getting-started" element={<GettingStarted />} />
      <Route path="theming" element={<Theming />} />
      <Route path="tokens" element={<Tokens />} />
      <Route path="foundations" element={<Foundations />} />
      <Route path="headless" element={<Headless />} />
      <Route path="ai" element={<AiGuide />} />
      <Route path="components" element={<ComponentsIndex />} />
      <Route path="components/:slug" element={<ComponentPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
