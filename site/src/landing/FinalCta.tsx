import { Link as RouterLink } from 'react-router-dom';
import { PadaLogo } from 'pada-ds';
import { links } from '../lib/docs';
import { ROUTES } from '../lib/paths';
import { CopyButton } from '../shell/CopyButton';
import { ArrowRight, Github } from '../shell/icons';

export function FinalCta() {
  return (
    <section className="section final-cta dot-ground" aria-labelledby="final-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap center" data-reveal>
        <PadaLogo variant="mark" size={56} decorative animated />
        <h2 id="final-title" className="h2">
          Give your product <span className="serif">steady footing.</span>
        </h2>
        <p className="lede">Install Pada, import the styles, and ship your first accessible screen today.</p>
        <div className="final-actions">
          <div className="cmd">
            <span className="prompt" aria-hidden="true">$</span>
            <code>npm i pada-ds</code>
            <CopyButton text="npm i pada-ds" label="Copy install command" />
          </div>
          <RouterLink className="cta" to={ROUTES.gettingStarted}>
            Read the docs <ArrowRight />
          </RouterLink>
          <a className="cta" data-variant="ghost" href={links.reactRepo} target="_blank" rel="noopener noreferrer">
            <Github size={16} /> Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
