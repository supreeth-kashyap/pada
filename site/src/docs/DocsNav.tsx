import { useMemo, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { SearchField } from 'pada-ds';
import { NAV } from './nav';

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.map((g) => ({ ...g, links: g.links.filter((l) => l.label.toLowerCase().includes(q)) })).filter((g) => g.links.length);
  }, [query]);

  return (
    <nav className="docs-nav" aria-label="Docs">
      <SearchField value={query} onChange={setQuery} placeholder="Filter pages" aria-label="Filter docs pages" />
      {groups.map((group) => (
        <div key={group.id} className="docs-nav-group">
          <h2>{group.title}</h2>
          <ul>
            {group.links.map((link) => (
              <li key={link.to}>
                <RouterNavLink to={link.to} end onClick={onNavigate}>
                  <span>{link.label}</span>
                  {link.badge && <span className="nav-badge" data-kind={link.badge}>{link.badge === 'ng' ? 'Angular' : link.badge}</span>}
                </RouterNavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {groups.length === 0 && <p className="muted small">No pages match “{query}”.</p>}
    </nav>
  );
}
