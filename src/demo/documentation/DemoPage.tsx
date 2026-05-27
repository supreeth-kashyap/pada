import type { ReactNode } from 'react';
import './documentation.css';

export interface DemoPageProps {
  /** Page title — usually the component or foundation token name. */
  title: string;
  /** Visual tag above the title. */
  kind: 'Foundation' | 'Component';
  /** Page body. If omitted, a "documentation coming soon" placeholder is shown. */
  children?: ReactNode;
}

/**
 * Shared layout for every demo page. All page-specific styling extensions should be added
 * via additional class names on children, not by overriding the layout itself, so that
 * the documentation surface stays visually consistent.
 */
export default function DemoPage({ title, kind, children }: DemoPageProps) {
  return (
    <article className="demo-page">
      <header className="demo-page__header">
        <p className="demo-page__kind">{kind}</p>
        <h1 className="demo-page__title">{title}</h1>
      </header>
      <div className="demo-page__body">
        {children ?? (
          <div className="demo-page__placeholder">
            Documentation for <strong>{title}</strong> is coming soon.
          </div>
        )}
      </div>
    </article>
  );
}
