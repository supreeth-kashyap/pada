import data from '../../../content/docs.json';

export interface DocComponent {
  name: string;
  slug: string;
  category: string;
  status: 'stable' | 'legacy';
  replacedBy: string | null;
  summary: string;
  related: string[];
  react: { import: string; dir: string; storybook: string | null; storyTitle: string | null; storyFile?: string; source: string } | null;
  angular: { selector: string; dir: string; storybook: string | null; storyTitle: string | null; source: string } | null;
  tokens: { component: { name: string; value: string }[]; reads: string[] };
  overview?: string;
  whenToUse?: string[];
  whenNotToUse?: string[];
  do?: string[];
  dont?: string[];
  accessibility?: string[];
  migrating?: string[];
  ai?: string;
}

export const docs = data as unknown as {
  version: string;
  links: Record<
    'site' | 'reactStorybook' | 'angularStorybook' | 'reactRepo' | 'angularRepo' | 'reactNpm' | 'angularNpm' | 'figma',
    string
  >;
  categories: string[];
  tokenStats: { reference: number; palette: number; semantic: number; derived: number; knobs: number; component: number };
  components: DocComponent[];
};

export const links = docs.links;
export const components = docs.components;
export const currentComponents = components.filter((c) => c.status === 'stable');
export const componentBySlug = new Map(components.map((c) => [c.slug, c]));
export const componentByName = new Map(components.map((c) => [c.name, c]));

export const componentsByCategory = docs.categories.map((category) => ({
  category,
  items: components.filter((c) => c.category === category),
}));
