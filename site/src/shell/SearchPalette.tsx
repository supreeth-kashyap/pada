import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandPalette, Kbd, type Command } from 'pada-ds';
import { components, links } from '../lib/docs';
import { GUIDES } from '../docs/nav';
import { ROUTES } from '../lib/paths';

/** ⌘K search over every docs page and component, from the header. */
export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const commands = useMemo<Command[]>(
    () => [
      ...GUIDES.map((g) => ({ id: g.to, label: g.label, group: 'Guides', icon: 'document', onSelect: () => navigate(g.to) })),
      ...components.map((c) => ({
        id: c.slug,
        label: c.name,
        group: c.status === 'legacy' ? 'Legacy' : c.category,
        description: c.summary,
        keywords: [c.category, c.react?.import ?? '', c.angular?.selector ?? ''],
        icon: 'dashboard',
        onSelect: () => navigate(ROUTES.component(c.slug)),
      })),
      { id: 'sb-react', label: 'Open the React Storybook', group: 'Links', icon: 'tab_out', onSelect: () => window.open(links.reactStorybook, '_blank', 'noopener') },
      { id: 'sb-angular', label: 'Open the Angular Storybook', group: 'Links', icon: 'tab_out', onSelect: () => window.open(links.angularStorybook, '_blank', 'noopener') },
      { id: 'github', label: 'Open GitHub', group: 'Links', icon: 'github_branch', onSelect: () => window.open(links.reactRepo, '_blank', 'noopener') },
    ],
    [navigate],
  );
  return (
    <>
      <button type="button" className="search-trigger" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span>Search docs</span>
        <Kbd keys={['⌘', 'K']} />
      </button>
      <CommandPalette commands={commands} open={open} onOpenChange={setOpen} placeholder="Search components and guides…" label="Search the docs" />
    </>
  );
}
