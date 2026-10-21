import { Link as RouterLink } from 'react-router-dom';
import { Badge, Button, Switch } from 'pada-ds';
import { links } from '../lib/docs';
import { ROUTES } from '../lib/paths';
import { ArrowRight, FigmaLogo } from '../shell/icons';

const LAYERS = ['Button', 'Badge', 'Switch', 'Dialog', 'Tabs', 'Input text'];

const VARIABLES = [
  { name: 'color/accent/solid', token: '--pada-color-accent-solid', swatch: 'accent' },
  { name: 'color/fg/muted', token: '--pada-color-fg-muted', swatch: 'muted' },
  { name: 'color/surface', token: '--pada-color-surface', swatch: 'surface' },
  { name: 'radius/md', token: '--pada-radius-md', swatch: 'radius' },
];

/** The Figma Community kit: a mock canvas of real Pada components with the variables panel beside it. */
export function FigmaSection() {
  return (
    <section className="section figma-kit" id="figma" aria-labelledby="figma-title">
      <div className="wrap figma-grid">
        <div className="figma-copy" data-reveal>
          <p className="eyebrow">Pada for Figma</p>
          <h2 id="figma-title" className="h2">
            Design and code, <span className="serif">one footing.</span>
          </h2>
          <p className="lede">
            The Pada kit is published free on the Figma Community. Duplicate it and design with the same
            components and tokens your engineers ship.
          </p>
          <ul className="check-list">
            <li>Variables that map one-to-one to the <code>--pada-*</code> tokens in code</li>
            <li>Light and dark modes, the same as <code>data-theme</code></li>
            <li>Free to duplicate into your own workspace and build on</li>
          </ul>
          <div className="figma-ctas">
            <a className="cta" href={links.figma} target="_blank" rel="noopener noreferrer">
              <FigmaLogo size={16} /> Open in Figma Community <ArrowRight />
            </a>
            <RouterLink className="cta" data-variant="ghost" to={ROUTES.tokens}>
              Explore tokens
            </RouterLink>
          </div>
        </div>

        <div className="figma-window" data-reveal aria-hidden="true" inert>
          <div className="figma-bar">
            <span className="dots"><i /><i /><i /></span>
            <FigmaLogo size={14} />
            <span className="figma-file">Pada Design System</span>
            <span className="figma-share">Duplicate</span>
          </div>
          <div className="figma-body">
            <div className="figma-layers">
              <span className="figma-panel-title">Components</span>
              {LAYERS.map((layer, i) => (
                <span key={layer} className="figma-layer" data-active={i === 0 ? '' : undefined}>
                  <i />
                  {layer}
                </span>
              ))}
            </div>
            <div className="figma-canvas dot-ground">
              <div className="figma-frame">
                <span className="figma-frame-name">Button</span>
                <div className="figma-frame-body">
                  <Button size="sm">Primary</Button>
                  <Button size="sm" variant="secondary">Secondary</Button>
                </div>
                <span className="figma-handle h-tl" />
                <span className="figma-handle h-tr" />
                <span className="figma-handle h-bl" />
                <span className="figma-handle h-br" />
              </div>
              <div className="figma-frame figma-frame-b">
                <span className="figma-frame-name">Badge · Switch</span>
                <div className="figma-frame-body">
                  <Badge tone="accent" variant="subtle">New</Badge>
                  <Switch aria-label="Example" defaultChecked />
                </div>
              </div>
              <span className="figma-cursor">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 1l11 6-5 1.5L6 14 2 1Z" /></svg>
                <span>Designer</span>
              </span>
            </div>
            <div className="figma-vars">
              <span className="figma-panel-title">Variables</span>
              {VARIABLES.map((v) => (
                <span key={v.name} className="figma-var">
                  <i data-swatch={v.swatch} />
                  <span>
                    <b>{v.name}</b>
                    <code>{v.token}</code>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
