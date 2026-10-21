import { useState, type ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, Indexer } from 'pada-ds';
import { DocsNav } from './DocsNav';
import { ORDER } from './nav';
import { ArrowRight, Menu } from '../shell/icons';

export interface TocItem {
  id: string;
  label: string;
}

/** The docs shell: navigation, the page, an "on this page" index and previous / next links. */
export function DocsLayout({ toc = [], children }: { toc?: TocItem[]; children: ReactNode }) {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const path = pathname.replace(/\/+$/, '') || '/';
  const index = ORDER.findIndex((link) => link.to === path);
  const prev = index > 0 ? ORDER[index - 1] : null;
  const next = index >= 0 && index < ORDER.length - 1 ? ORDER[index + 1] : null;

  return (
    <div className="docs wrap">
      <aside className="docs-sidebar">
        <DocsNav />
      </aside>

      <main id="main" className="docs-main">
        <div className="docs-mobile-bar">
          <Drawer.Root open={navOpen} onOpenChange={setNavOpen}>
            <Drawer.Trigger asChild>
              <button type="button" className="cta" data-variant="ghost">
                <Menu size={16} /> Docs menu
              </button>
            </Drawer.Trigger>
            <Drawer.Content side="left" size="sm">
              <Drawer.Header>
                <Drawer.Title>Docs</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <DocsNav onNavigate={() => setNavOpen(false)} />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </div>

        {children}

        <nav className="docs-pager" aria-label="Previous and next pages">
          {prev ? (
            <RouterLink to={prev.to} className="pager-link" data-dir="prev">
              <span>Previous</span>
              <strong>{prev.label}</strong>
            </RouterLink>
          ) : <span />}
          {next && (
            <RouterLink to={next.to} className="pager-link" data-dir="next">
              <span>Next</span>
              <strong>
                {next.label} <ArrowRight size={14} />
              </strong>
            </RouterLink>
          )}
        </nav>
      </main>

      <aside className="docs-toc" aria-label="On this page">
        {toc.length > 1 && (
          <>
            <p className="docs-toc-title">On this page</p>
            <Indexer key={path} items={toc} aria-label="On this page" />
          </>
        )}
      </aside>
    </div>
  );
}

/** A docs page heading block. */
export function DocHeader({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="doc-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="doc-lede">{lede}</p>}
      {children}
    </header>
  );
}

/** A titled section that the "on this page" index can link to. */
export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="doc-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>
        <a href={`#${id}`} className="anchor">{title}</a>
      </h2>
      {children}
    </section>
  );
}
