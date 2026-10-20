import { Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';

export function DocsRoutes() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
