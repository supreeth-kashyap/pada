/** Prefixes a site path with the deploy base ("/" locally, "/pada/" on GitHub Pages). */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export const ROUTES = {
  home: '/',
  docs: '/docs',
  gettingStarted: '/docs/getting-started',
  theming: '/docs/theming',
  tokens: '/docs/tokens',
  ai: '/docs/ai',
  components: '/docs/components',
  component: (slug: string) => `/docs/components/${slug}`,
  changelog: '/changelog',
  brand: '/brand',
};
