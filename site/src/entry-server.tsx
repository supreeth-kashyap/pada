import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import 'pada-ds/tokens.css';
import 'pada-ds/base.css';
import './styles/site.css';
import { App } from './App';
import { metaFor } from './lib/meta';
import { components } from './lib/docs';

/** Every route the prerender script writes to disk. */
export const routes = [
  '/',
  '/docs',
  '/docs/getting-started',
  '/docs/theming',
  '/docs/tokens',
  '/docs/foundations',
  '/docs/headless',
  '/docs/ai',
  '/docs/components',
  ...components.map((c) => `/docs/components/${c.slug}`),
  '/changelog',
  '/brand',
];

export function render(url: string, basename: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={basename}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: metaFor(url.slice(basename.length) || '/') };
}
