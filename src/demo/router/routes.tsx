import type { ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_PATH, NAV_ENTRIES, pathFor } from './nav';

/**
 * Auto-discover all demo pages under `src/demo/documentation/{foundation|components}/`.
 *
 * Convention: each entry must have a file at
 *   `src/demo/documentation/{kind}/{slug}-demo.tsx`
 * exporting a default React component. The slug + kind here must match `nav.ts`.
 *
 * Using `import.meta.glob` with `eager: true` so demo pages are bundled normally and
 * route changes feel instant; switch to `eager: false` if you want code-splitting per
 * page later.
 */
const foundationModules = import.meta.glob<{ default: ComponentType }>(
  '../documentation/foundation/*-demo.tsx',
  { eager: true }
);
const componentModules = import.meta.glob<{ default: ComponentType }>(
  '../documentation/components/*-demo.tsx',
  { eager: true }
);

const fileKey = (kind: 'foundation' | 'components', slug: string) =>
  `../documentation/${kind}/${slug}-demo.tsx`;

const resolvePage = (kind: 'foundation' | 'components', slug: string): ComponentType | null => {
  const modules = kind === 'foundation' ? foundationModules : componentModules;
  const mod = modules[fileKey(kind, slug)];
  return mod?.default ?? null;
};

const NotFound = () => (
  <section style={{ padding: '40px', flex: 1 }}>
    <h1 style={{ margin: 0 }}>Not found</h1>
    <p style={{ color: '#6b7280', marginTop: 16 }}>
      No demo page is registered for this route.
    </p>
  </section>
);

/** All routes wired to their demo pages. Drop into a `<BrowserRouter>` ancestor. */
export const DemoRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to={DEFAULT_PATH} replace />} />
    {NAV_ENTRIES.map((entry) => {
      const Page = resolvePage(entry.kind, entry.slug);
      return (
        <Route
          key={`${entry.kind}/${entry.slug}`}
          path={pathFor(entry)}
          element={Page ? <Page /> : <NotFound />}
        />
      );
    })}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
