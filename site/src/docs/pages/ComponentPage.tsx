import { Link as RouterLink, useParams } from 'react-router-dom';
import { Alert, Badge } from 'pada-ds';
import { componentByName, componentBySlug, links } from '../../lib/docs';
import { ROUTES } from '../../lib/paths';
import { CopyButton } from '../../shell/CopyButton';
import { ArrowRight, ExternalArrow, Github, Sparkle, Storybook } from '../../shell/icons';
import { DocHeader, DocSection, DocsLayout, type TocItem } from '../DocsLayout';
import { StoryPreview } from '../StoryPreview';
import { NotFoundPage } from '../../pages/NotFoundPage';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="doc-list">
      {items.map((item) => (
        <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

export function ComponentPage() {
  const { slug = '' } = useParams();
  const c = componentBySlug.get(slug);
  if (!c) return <NotFoundPage />;

  const legacy = c.status === 'legacy';
  const toc: TocItem[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'use', label: 'Use it' },
    { id: 'overview', label: 'Overview' },
    ...(c.whenToUse ? [{ id: 'when-to-use', label: 'When to use' }] : []),
    ...(c.do ? [{ id: 'best-practices', label: 'Best practices' }] : []),
    ...(c.accessibility ? [{ id: 'accessibility', label: 'Accessibility' }] : []),
    ...(c.related.length ? [{ id: 'related', label: 'Related' }] : []),
  ];

  const replacement = c.replacedBy ? componentByName.get(c.replacedBy) : null;

  return (
    <DocsLayout toc={toc}>
      <article className="doc component-doc">
        <nav className="doc-crumbs" aria-label="Breadcrumb">
          <RouterLink to={ROUTES.components}>Components</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to={`${ROUTES.components}#${c.category.toLowerCase()}`}>{c.category}</RouterLink>
        </nav>
        <DocHeader eyebrow={legacy ? 'Legacy component' : c.category} title={c.name} lede={c.summary}>
          <div className="doc-badges">
            {c.react && <Badge tone="accent" variant="subtle">React</Badge>}
            {c.angular && <Badge tone="danger" variant="subtle">Angular</Badge>}
            {!c.react && <Badge tone="neutral" variant="outline">Angular only</Badge>}
            {!c.angular && !legacy && <Badge tone="neutral" variant="outline">React only</Badge>}
            {legacy && <Badge tone="warning">Deprecated · removed in 3.0</Badge>}
          </div>
        </DocHeader>

        {legacy && replacement && (
          <Alert tone="warning" title={`Use ${replacement.name} instead`}>
            {c.name} still works in 2.x and is removed in 3.0.{' '}
            <RouterLink to={ROUTES.component(replacement.slug)}>Read the {replacement.name} docs</RouterLink>.
          </Alert>
        )}

        <section id="preview" className="doc-preview-wrap" aria-label="Live preview">
          <div className="doc-preview">
            {c.react?.storyFile ? (
              <StoryPreview
                file={c.react.storyFile}
                fallback={<p className="muted small">The preview couldn't load. Open it in Storybook instead.</p>}
              />
            ) : (
              <p className="muted small">
                {c.react ? 'No preview for this component.' : `${c.name} is available in Angular. See it in the Angular Storybook.`}
              </p>
            )}
          </div>
          <div className="doc-links">
            {c.react?.storybook && (
              <a className="doc-link-card" href={c.react.storybook} {...ext}>
                <Storybook size={16} />
                <span>React Storybook</span>
                <ExternalArrow size={14} />
              </a>
            )}
            {c.angular?.storybook && (
              <a className="doc-link-card" href={c.angular.storybook} {...ext}>
                <Storybook size={16} />
                <span>Angular Storybook</span>
                <ExternalArrow size={14} />
              </a>
            )}
            {c.react && (
              <a className="doc-link-card" href={c.react.source} {...ext}>
                <Github size={16} />
                <span>React source</span>
                <ExternalArrow size={14} />
              </a>
            )}
            {c.angular && (
              <a className="doc-link-card" href={c.angular.source} {...ext}>
                <Github size={16} />
                <span>Angular source</span>
                <ExternalArrow size={14} />
              </a>
            )}
          </div>
        </section>

        <DocSection id="use" title="Use it">
          {c.ai && (
            <div className="ai-prompt-card">
              <div className="ai-prompt-head">
                <Sparkle size={15} />
                <strong>Prompt for your coding agent</strong>
                <CopyButton text={c.ai} label="Copy prompt" />
              </div>
              <p>{c.ai}</p>
            </div>
          )}
          <p className="muted small">
            Props, variants and the full API are in Storybook, with a live playground. Coding agents can read them
            from <code>pada-ds/llms-full.txt</code>.{' '}
            <RouterLink to={ROUTES.ai} className="text-link">Build with AI <ArrowRight size={13} /></RouterLink>
          </p>
        </DocSection>

        <DocSection id="overview" title="Overview">
          <div className="doc-prose" dangerouslySetInnerHTML={{ __html: c.overview ?? '' }} />
        </DocSection>

        {c.whenToUse && (
          <DocSection id="when-to-use" title="When to use">
            <div className="usage-grid">
              <div className="usage-card" data-kind="use">
                <h3>Use it</h3>
                <Bullets items={c.whenToUse} />
              </div>
              {c.whenNotToUse && (
                <div className="usage-card" data-kind="avoid">
                  <h3>Use something else</h3>
                  <Bullets items={c.whenNotToUse} />
                </div>
              )}
            </div>
          </DocSection>
        )}

        {c.do && (
          <DocSection id="best-practices" title="Best practices">
            <div className="dodont">
              <div className="dodont-card" data-kind="do">
                <h3><span aria-hidden="true">✓</span> Do</h3>
                <Bullets items={c.do} />
              </div>
              <div className="dodont-card" data-kind="dont">
                <h3><span aria-hidden="true">✕</span> Don’t</h3>
                <Bullets items={c.dont ?? []} />
              </div>
            </div>
          </DocSection>
        )}

        {c.accessibility && (
          <DocSection id="accessibility" title="Accessibility">
            <Bullets items={c.accessibility} />
          </DocSection>
        )}


        {c.related.length > 0 && (
          <DocSection id="related" title="Related">
            <ul className="related-grid">
              {c.related.map((name) => {
                const r = componentByName.get(name);
                if (!r) return null;
                return (
                  <li key={name}>
                    <RouterLink to={ROUTES.component(r.slug)} className="related-card">
                      <strong>{r.name}</strong>
                      <span>{r.summary}</span>
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </DocSection>
        )}
        <p className="doc-edit muted small">
          Something missing?{' '}
          <a href={`${links.reactRepo}/edit/main/content/components/${c.slug}.md`} {...ext}>Edit this page on GitHub</a>
        </p>
      </article>
    </DocsLayout>
  );
}
