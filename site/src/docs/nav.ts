import { componentsByCategory } from '../lib/docs';
import { ROUTES } from '../lib/paths';

export interface NavLink {
  to: string;
  label: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  id: string;
  links: NavLink[];
}

export const GUIDES: NavLink[] = [
  { to: ROUTES.docs, label: 'Introduction' },
  { to: ROUTES.gettingStarted, label: 'Getting started' },
  { to: ROUTES.theming, label: 'Theming' },
  { to: ROUTES.tokens, label: 'Design tokens' },
  { to: '/docs/foundations', label: 'Foundations' },
  { to: '/docs/headless', label: 'Headless' },
  { to: ROUTES.ai, label: 'Build with AI' },
  { to: ROUTES.components, label: 'All components' },
];

export const NAV: NavGroup[] = [
  { title: 'Guides', id: 'guides', links: GUIDES },
  ...componentsByCategory.map((group) => ({
    title: group.category,
    id: group.category.toLowerCase(),
    links: group.items.map((c) => ({
      to: ROUTES.component(c.slug),
      label: c.name,
      badge: c.status === 'legacy' ? 'legacy' : !c.react ? 'ng' : !c.angular ? 'react' : undefined,
    })),
  })),
];

/** Every docs page in reading order, for previous / next links. */
export const ORDER: NavLink[] = NAV.flatMap((group) => group.links);
