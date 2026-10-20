import { Link as RouterLink } from 'react-router-dom';
import { currentComponents, links } from '../../lib/docs';
import { ROUTES } from '../../lib/paths';
import { ArrowRight, Book, Box, Droplet, Layers, Sparkle, Storybook, Wave } from '../../shell/icons';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';

const CARDS = [
  { to: ROUTES.gettingStarted, icon: <Book />, title: 'Getting started', body: 'Install the package for your framework and render your first component.' },
  { to: ROUTES.theming, icon: <Droplet />, title: 'Theming', body: 'Seven attributes re-theme every component: light and dark, accent, density, radius and more.' },
  { to: ROUTES.tokens, icon: <Layers />, title: 'Design tokens', body: 'How the --pada-* custom properties are layered, and how to use them in your own CSS.' },
  { to: '/docs/foundations', icon: <Wave />, title: 'Foundations', body: 'Colour, type, spacing, radius, elevation, motion and icons.' },
  { to: '/docs/headless', icon: <Box />, title: 'Headless', body: 'Behaviour, keyboard and ARIA without styles, for a look that is fully your own.' },
  { to: ROUTES.ai, icon: <Sparkle />, title: 'Build with AI', body: 'Give coding agents the manifest and llms.txt, and prompt them to build with Pada.' },
];

export function Overview() {
  return (
    <DocsLayout toc={[{ id: 'start', label: 'Start here' }, { id: 'packages', label: 'Packages' }, { id: 'principles', label: 'Principles' }]}>
      <article className="doc">
        <DocHeader
          eyebrow="Documentation"
          title="Pada documentation"
          lede={`Pada is one design system for React and Angular: ${currentComponents.length} accessible components, a headless layer and a token system. These docs explain how to install it, theme it, and use each component well.`}
        />
        <DocSection id="start" title="Start here">
          <ul className="card-grid">
            {CARDS.map((card) => (
              <li key={card.to}>
                <RouterLink to={card.to} className="guide-card">
                  <span className="bento-icon">{card.icon}</span>
                  <strong>{card.title}</strong>
                  <span>{card.body}</span>
                </RouterLink>
              </li>
            ))}
          </ul>
          <RouterLink to={ROUTES.components} className="cta" data-variant="ink">
            Browse all components <ArrowRight />
          </RouterLink>
        </DocSection>

        <DocSection id="packages" title="Packages">
          <div className="table-wrap">
            <table className="doc-table">
              <thead>
                <tr><th scope="col">Framework</th><th scope="col">Package</th><th scope="col">Storybook</th><th scope="col">Source</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">React 19</th>
                  <td><a href={links.reactNpm}>pada-ds</a></td>
                  <td><a href={links.reactStorybook}><Storybook size={13} /> React + Angular</a></td>
                  <td><a href={links.reactRepo}>supreeth-kashyap/pada</a></td>
                </tr>
                <tr>
                  <th scope="row">Angular 21</th>
                  <td><a href={links.angularNpm}>pada-ds-angular</a></td>
                  <td><a href={links.angularStorybook}><Storybook size={13} /> Angular</a></td>
                  <td><a href={links.angularRepo}>supreeth-kashyap/pada-ds-angular</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Both packages are released together under one version number, with the same components, parts, keyboard maps, tokens and motion.</p>
        </DocSection>

        <DocSection id="principles" title="Principles">
          <ul className="doc-list">
            <li><strong>Accessible by default.</strong> Every interactive component follows its WAI-ARIA Authoring Practices pattern and is tested for keyboard behaviour and with axe.</li>
            <li><strong>State lives in attributes.</strong> Components expose <code>data-state</code>, <code>data-disabled</code> and <code>aria-*</code>; you style those, never internal class names.</li>
            <li><strong>Tokens, not overrides.</strong> Variants reassign component tokens, and themes set a handful of knobs. Re-theming never means fighting specificity.</li>
            <li><strong>Parity.</strong> React and Angular differ only where the framework demands it, and every difference is documented.</li>
          </ul>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
