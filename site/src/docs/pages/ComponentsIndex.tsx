import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SearchField } from 'pada-ds';
import { componentsByCategory, currentComponents } from '../../lib/docs';
import { ROUTES } from '../../lib/paths';
import { DocHeader, DocsLayout } from '../DocsLayout';

const BLURBS: Record<string, string> = {
  Actions: 'Buttons, links and toggles that make things happen.',
  Forms: 'Fields and choices, wired to labels, descriptions and errors.',
  Dates: 'Calendars and date and time fields.',
  Overlays: 'Dialogs, drawers, menus, popovers and tooltips.',
  Feedback: 'Status, progress, loading and notifications.',
  Navigation: 'Ways to move around an app and through a flow.',
  Data: 'Tables, records, trees and timelines.',
  Display: 'Text, media, badges and other building blocks.',
  Layout: 'Stacks, grids, containers and theming.',
  Legacy: 'Pada 1.x components that still work until 3.0.',
};

export function ComponentsIndex() {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return componentsByCategory
      .map((g) => ({ ...g, items: q ? g.items.filter((c) => `${c.name} ${c.summary}`.toLowerCase().includes(q)) : g.items }))
      .filter((g) => g.items.length);
  }, [query]);

  return (
    <DocsLayout toc={groups.map((g) => ({ id: g.category.toLowerCase(), label: g.category }))}>
      <article className="doc">
        <DocHeader
          eyebrow="Components"
          title="Components"
          lede={`${currentComponents.length} components for React and Angular, with the same parts, keyboard behaviour and tokens. Each page explains when and how to use the component; props and variants are in Storybook.`}
        />
        <div className="index-search">
          <SearchField value={query} onChange={setQuery} placeholder="Search components" aria-label="Search components" />
        </div>
        {groups.map((group) => (
          <section key={group.category} id={group.category.toLowerCase()} className="index-group" aria-labelledby={`${group.category}-h`}>
            <div className="index-group-head">
              <h2 id={`${group.category}-h`}>{group.category}</h2>
              <p>{BLURBS[group.category]}</p>
            </div>
            <ul className="index-grid">
              {group.items.map((c) => (
                <li key={c.slug}>
                  <RouterLink to={ROUTES.component(c.slug)} className="index-card" data-legacy={c.status === 'legacy' ? '' : undefined}>
                    <span className="index-card-name">{c.name}</span>
                    <span className="index-card-summary">{c.summary}</span>
                    <span className="index-card-meta">
                      {c.react && <span>React</span>}
                      {c.angular && <span>Angular</span>}
                    </span>
                  </RouterLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && <p className="muted">No components match “{query}”.</p>}
      </article>
    </DocsLayout>
  );
}
