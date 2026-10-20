// Shared Storybook docs blocks for Pada, used by the React and the Angular Storybook. Written
// with createElement rather than JSX so the same file compiles in both builders. Synced to
// pada-ds-angular by scripts/sync-storybook-angular.mjs; edit it in the pada repo.
import { createElement as h, Fragment, useState, type ReactNode } from 'react';
import { Controls, Description, Primary, Stories, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import docs from './docs-data';

interface Entry {
  name: string;
  slug: string;
  status: string;
  summary: string;
  category: string;
  replacedBy: string | null;
  react: { storybook: string | null; storyTitle: string | null; import: string } | null;
  angular: { storybook: string | null; storyTitle: string | null; selector: string } | null;
  tokens: { component: { name: string; value: string }[]; reads: string[] };
  do?: string[];
  dont?: string[];
  accessibility?: string[];
  ai?: string;
}

const data = docs as unknown as { links: Record<string, string>; components: Entry[] };
export const SITE = data.links.site;
export const LINKS = data.links;

/** The docs entry for a story title ("Overlays/Dialog"); legacy titles map too. */
export function findEntry(title: string | undefined): Entry | undefined {
  if (!title) return undefined;
  return data.components.find((c) => c.react?.storyTitle === title || c.angular?.storyTitle === title);
}

const html = (markup: string) => ({ dangerouslySetInnerHTML: { __html: markup } });

function Section({ title, children }: { title: string; children: ReactNode }) {
  return h('section', { className: 'pada-doc-section' }, h('h2', { className: 'pada-doc-h2' }, title), children);
}

function Bullets({ items, kind }: { items: string[]; kind?: string }) {
  return h('ul', { className: 'pada-doc-list', 'data-kind': kind }, items.map((item) => h('li', { key: item, ...html(item) })));
}

export function CopyText({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return h(
    'button',
    {
      type: 'button',
      className: 'pada-doc-copy',
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      },
    },
    copied ? 'Copied' : label,
  );
}

export function AiPrompt({ text }: { text: string }) {
  return h(
    'div',
    { className: 'pada-doc-ai' },
    h('div', { className: 'pada-doc-ai-head' }, h('strong', null, '✦ Prompt for your coding agent'), h(CopyText, { text, label: 'Copy prompt' })),
    h('p', null, text),
    h(
      'p',
      { className: 'pada-doc-muted' },
      'Agents can read every prop from ',
      h('code', null, 'pada-ds/llms-full.txt'),
      ' and ',
      h('code', null, 'pada-ds/manifest.json'),
      '.',
    ),
  );
}

const looksLikeColour = (value: string) => /--pada-color|#[0-9a-f]{3,8}\b|oklch\(|rgb\(|light-dark\(/i.test(value);

/** The component tokens a component declares, with their defaults, and the system tokens it reads. */
export function TokenTable({ entry }: { entry: Entry }) {
  const { component, reads } = entry.tokens;
  return h(
    Fragment,
    null,
    component.length
      ? h(
          'div',
          { className: 'pada-doc-table-wrap' },
          h(
            'table',
            { className: 'pada-doc-table' },
            h('thead', null, h('tr', null, h('th', null, 'Token'), h('th', null, 'Default'))),
            h(
              'tbody',
              null,
              component.map((t) =>
                h(
                  'tr',
                  { key: t.name },
                  h('td', null, h('code', null, t.name)),
                  h(
                    'td',
                    null,
                    looksLikeColour(t.value) ? h('span', { className: 'pada-doc-swatch', style: { background: t.value } }) : null,
                    h('code', null, t.value),
                  ),
                ),
              ),
            ),
          ),
        )
      : h('p', { className: 'pada-doc-muted' }, 'This component has no tokens of its own; it reads the system tokens below directly.'),
    reads.length
      ? h(
          'details',
          { className: 'pada-doc-reads' },
          h('summary', null, `Reads ${reads.length} system tokens`),
          h('div', { className: 'pada-doc-chips' }, reads.map((name) => h('code', { key: name }, name))),
        )
      : null,
    h(
      'p',
      { className: 'pada-doc-muted' },
      'Restyle a component by reassigning its tokens on the element or any ancestor, never by overriding its class names.',
    ),
  );
}

export function DoDont({ entry }: { entry: Entry }) {
  return h(
    'div',
    { className: 'pada-doc-dodont' },
    h('div', { 'data-kind': 'do' }, h('h3', null, '✓ Do'), h(Bullets, { items: entry.do ?? [] })),
    h('div', { 'data-kind': 'dont' }, h('h3', null, '✕ Don’t'), h(Bullets, { items: entry.dont ?? [] })),
  );
}

function LinkRow({ entry }: { entry: Entry }) {
  const items: [string, string][] = [[`Usage guidelines on the Pada site`, `${SITE}docs/components/${entry.slug}/`]];
  if (entry.react?.storybook) items.push(['React story', entry.react.storybook]);
  if (entry.angular?.storybook) items.push(['Angular story', entry.angular.storybook]);
  return h(
    'p',
    { className: 'pada-doc-links' },
    items.map(([label, href]) => h('a', { key: href, href, target: '_blank', rel: 'noopener noreferrer' }, `${label} ↗`)),
  );
}

/**
 * The docs page for every component story: summary, best practices, a live playground with
 * controls, an AI prompt, the tokens it uses, accessibility notes and every story.
 */
export function PadaDocsPage() {
  const { preparedMeta } = useOf('meta') as { preparedMeta: { title: string } };
  const entry = findEntry(preparedMeta.title);
  return h(
    Fragment,
    null,
    h(Title),
    entry ? h('p', { className: 'pada-doc-summary' }, entry.summary) : h(Subtitle),
    entry && entry.status === 'legacy' && entry.replacedBy
      ? h('p', { className: 'pada-doc-legacy' }, `Deprecated: use ${entry.replacedBy}. It keeps working in 2.x and is removed in 3.0.`)
      : null,
    entry ? h(LinkRow, { entry }) : null,
    h(Description),
    entry?.do ? h(Section, { title: 'Best practices' }, h(DoDont, { entry })) : null,
    h(Section, { title: 'Playground' }, h('p', { className: 'pada-doc-muted' }, 'Change the props below and the preview updates live.'), h(Primary), h(Controls)),
    entry?.ai ? h(Section, { title: 'Use with AI' }, h(AiPrompt, { text: entry.ai })) : null,
    entry ? h(Section, { title: 'Tokens' }, h(TokenTable, { entry })) : null,
    entry?.accessibility ? h(Section, { title: 'Accessibility' }, h(Bullets, { items: entry.accessibility })) : null,
    h(Stories, { title: 'Examples', includePrimary: false }),
  );
}
