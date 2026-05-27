import type { ReactNode } from 'react';
import './documentation.css';

export interface DemoPageProps {
  /** Page title — usually the component or foundation token name. */
  title: string;
  /** Visual tag above the title. */
  kind: 'Foundation' | 'Component';
  /**
   * Short intro — 2–5 sentences explaining what the component is for, when to use it,
   * and where it fits in a typical UI.
   */
  purpose?: ReactNode;
  /**
   * Live design render — the actual component shown across its variants, with optional
   * narrative around the design properties.
   */
  design?: ReactNode;
  /**
   * Developer guidance — typically one or more `<CodeSnippet>` blocks showing the import
   * statement and basic usage. The CodeSnippet's built-in Copy button handles clipboard.
   */
  developer?: ReactNode;
  /** Accessibility notes — contrast, keyboard support, focus order, ARIA. */
  accessibility?: ReactNode;
  /**
   * Escape hatch for pages that need a fully custom layout. When set, the four standard
   * sections are ignored.
   */
  children?: ReactNode;
}

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

const Section = ({ id, title, children }: SectionProps) => (
  <section className="demo-page__section" aria-labelledby={`demo-section-${id}`}>
    <h2 id={`demo-section-${id}`} className="demo-page__section-title">
      {title}
    </h2>
    <div className="demo-page__section-body">{children}</div>
  </section>
);

/**
 * Shared layout for every demo page.
 *
 * The body follows a strict 4-section template so the documentation surface stays
 * consistent across every component and foundation token:
 *   1. **Purpose**        — why and when to use the component (2–5 sentences).
 *   2. **Design**         — a live render of the component's variants + notes.
 *   3. **Developer**      — import + usage snippet (use the `<CodeSnippet>` component).
 *   4. **Accessibility**  — contrast, keyboard, focus, ARIA notes.
 *
 * Any section can be omitted on a page; the section header simply won't render. If a
 * page genuinely doesn't fit this structure, pass `children` to bypass it entirely.
 */
export default function DemoPage({
  title,
  kind,
  purpose,
  design,
  developer,
  accessibility,
  children,
}: DemoPageProps) {
  const hasStructuredContent = purpose || design || developer || accessibility;

  return (
    <article className="demo-page">
      <header className="demo-page__header">
        <p className="demo-page__kind">{kind}</p>
        <h1 className="demo-page__title">{title}</h1>
      </header>
      <div className="demo-page__body">
        {children
          ? children
          : hasStructuredContent
            ? <>
                {purpose && <Section id="purpose" title="Purpose">{purpose}</Section>}
                {design && <Section id="design" title="Design">{design}</Section>}
                {developer && <Section id="developer" title="Developer">{developer}</Section>}
                {accessibility && <Section id="accessibility" title="Accessibility">{accessibility}</Section>}
              </>
            : (
                <div className="demo-page__placeholder">
                  Documentation for <strong>{title}</strong> is coming soon.
                </div>
              )}
      </div>
    </article>
  );
}
