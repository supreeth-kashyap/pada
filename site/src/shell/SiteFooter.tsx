import { Link as RouterLink } from 'react-router-dom';
import { PadaLogo } from 'pada-ds';
import { links } from '../lib/docs';
import { ROUTES } from '../lib/paths';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <PadaLogo size="md" title="Pada" />
            <p>One design system for React and Angular. Accessible, token-driven and ready for your brand.</p>
          </div>
          <div className="footer-col">
            <h2>Learn</h2>
            <ul>
              <li><RouterLink to={ROUTES.gettingStarted}>Getting started</RouterLink></li>
              <li><RouterLink to={ROUTES.components}>Components</RouterLink></li>
              <li><RouterLink to={ROUTES.theming}>Theming</RouterLink></li>
              <li><RouterLink to={ROUTES.tokens}>Tokens</RouterLink></li>
              <li><RouterLink to={ROUTES.ai}>Build with AI</RouterLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Storybook</h2>
            <ul>
              <li><a href={links.reactStorybook} {...ext}>React</a></li>
              <li><a href={links.angularStorybook} {...ext}>Angular</a></li>
              <li><a href={links.figma} {...ext}>Figma kit</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Code</h2>
            <ul>
              <li><a href={links.reactRepo} {...ext}>GitHub · React</a></li>
              <li><a href={links.angularRepo} {...ext}>GitHub · Angular</a></li>
              <li><a href={links.reactNpm} {...ext}>npm · pada-ds</a></li>
              <li><a href={links.angularNpm} {...ext}>npm · pada-ds-angular</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Project</h2>
            <ul>
              <li><RouterLink to={ROUTES.changelog}>Changelog</RouterLink></li>
              <li><a href={`${links.reactRepo}/releases`} {...ext}>Releases</a></li>
              <li><RouterLink to={ROUTES.brand}>Brand</RouterLink></li>
              <li><a href={`${links.reactRepo}/blob/main/LICENSE`} {...ext}>MIT licence</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-meaning">
          <span>
            <span className="devanagari" lang="sa">पाद</span>&ensp;pāda, Sanskrit for <em>foot</em>: the part that carries the weight.
          </span>
          <span>© {new Date().getFullYear()} Supreeth Kashyap · MIT</span>
        </div>
        <div className="footer-word" aria-hidden="true">pada</div>
      </div>
    </footer>
  );
}
