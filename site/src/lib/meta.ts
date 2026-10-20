import { componentBySlug } from './docs';

export interface PageMeta {
  title: string;
  description: string;
}

const SITE = 'Pada';
const DEFAULT_DESCRIPTION =
  'Pada is an accessible design system for React and Angular: the same components, keyboard behaviour, tokens and motion in both, styled or headless.';

const STATIC: Record<string, PageMeta> = {
  '/': { title: 'Pada — the design system for React and Angular', description: DEFAULT_DESCRIPTION },
  '/docs': { title: 'Docs · Pada', description: 'Install Pada, theme it with tokens and build with 100 accessible components.' },
  '/docs/getting-started': { title: 'Getting started · Pada', description: 'Install pada-ds or pada-ds-angular and render your first component.' },
  '/docs/theming': { title: 'Theming · Pada', description: 'Light and dark, accent, neutral, density, radius, motion and contrast: seven attributes that re-theme every component.' },
  '/docs/tokens': { title: 'Design tokens · Pada', description: 'How Pada tokens are layered: reference, palette, semantic, derived and component tokens.' },
  '/docs/foundations': { title: 'Foundations · Pada', description: 'Colour, typography, spacing, radius, elevation, motion and icons in Pada.' },
  '/docs/ai': { title: 'Build with AI · Pada', description: 'Point coding agents at llms.txt and manifest.json and prompt them to build with Pada.' },
  '/docs/headless': { title: 'Headless · Pada', description: 'Use the behaviour, keyboard handling and ARIA of every Pada component with your own styles.' },
  '/docs/components': { title: 'Components · Pada', description: 'Every Pada component for React and Angular, with usage guidance.' },
  '/changelog': { title: 'Changelog · Pada', description: 'Release notes for pada-ds and pada-ds-angular.' },
  '/brand': { title: 'Brand · Pada', description: 'The Pada mark, wordmark and how to use them.' },
};

export function metaFor(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (STATIC[path]) return STATIC[path];
  const component = /^\/docs\/components\/([a-z0-9-]+)$/.exec(path);
  if (component) {
    const entry = componentBySlug.get(component[1]);
    if (entry) return { title: `${entry.name} · ${SITE}`, description: entry.summary };
  }
  return { title: `Page not found · ${SITE}`, description: DEFAULT_DESCRIPTION };
}
