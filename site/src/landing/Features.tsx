import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { links } from '../lib/docs';
import { ROUTES } from '../lib/paths';
import { ArrowRight, Droplet, Figma, Keyboard, Layers, Sparkle, Wave } from '../shell/icons';

interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  body: string;
  link: { label: string; to: string; external?: boolean };
  art: ReactNode;
  wide?: boolean;
  full?: boolean;
}

/** A focus ring that walks across three controls, then "presses" the last. */
const KeyboardArt = (
  <div className="art art-keys" aria-hidden="true">
    <div className="art-keys-row">
      <span className="fake-btn">Cancel</span>
      <span className="fake-btn">Save draft</span>
      <span className="fake-btn primary">Publish</span>
      <span className="focus-walker" />
    </div>
    <div className="art-keys-caps">
      <kbd className="cap cap-tab">Tab</kbd>
      <kbd className="cap cap-tab2">Tab</kbd>
      <kbd className="cap cap-enter">Enter</kbd>
    </div>
  </div>
);

/** The same card flips between Pada's skin and a bare, headless one. */
const HeadlessArt = (
  <div className="art art-skins" aria-hidden="true">
    <div className="skin-card">
      <span className="skin-title" />
      <span className="skin-line" />
      <span className="skin-line short" />
      <span className="skin-btn" />
    </div>
    <span className="skin-label styled">styled</span>
    <span className="skin-label headless">headless</span>
  </div>
);

/** Swatches whose hue sweeps, the way one knob re-tints every ramp. */
const TokensArt = (
  <div className="art art-ramp" aria-hidden="true">
    {Array.from({ length: 9 }, (_, i) => (
      <span key={i} style={{ ['--i' as string]: i }} />
    ))}
    <code>--pada-accent-hue</code>
  </div>
);

/** A ball eased along Pada's emphasized curve. */
const MOTION_PATH = 'M10 90 C 54 90, 62 10, 190 10';
const MotionArt = (
  <div className="art art-motion" aria-hidden="true">
    <svg viewBox="0 0 200 100" className="curve">
      <path className="track" d={MOTION_PATH} />
      <circle className="ball" r="6">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={MOTION_PATH}
          keyPoints="0;1;1;0;0"
          keyTimes="0;0.4;0.5;0.9;1"
          calcMode="spline"
          keySplines="0.22 1 0.36 1;0 0 1 1;0.22 1 0.36 1;0 0 1 1"
        />
      </circle>
    </svg>
    <code>--pada-ease-emphasized</code>
  </div>
);

/** A prompt being typed and turned into code. */
const AiArt = (
  <div className="art art-ai" aria-hidden="true">
    <div className="ai-prompt">
      <Sparkle size={14} />
      <span className="typed">Add a settings form with Pada</span>
    </div>
    <div className="ai-code">
      <span style={{ ['--l' as string]: 0 }}>&lt;<b>Field.Root</b>&gt;</span>
      <span style={{ ['--l' as string]: 1 }}>&nbsp;&nbsp;&lt;<b>Field.Label</b>&gt;Email&lt;/…&gt;</span>
      <span style={{ ['--l' as string]: 2 }}>&nbsp;&nbsp;&lt;<b>Field.Control</b> type="email" /&gt;</span>
      <span style={{ ['--l' as string]: 3 }}>&lt;/<b>Field.Root</b>&gt;</span>
    </div>
  </div>
);

const FigmaArt = (
  <div className="art art-figma" aria-hidden="true">
    <div className="frame f1" />
    <div className="frame f2" />
    <div className="frame f3" />
    <span className="var-chip">color/accent/solid</span>
  </div>
);

const FEATURES: Feature[] = [
  {
    id: 'a11y',
    icon: <Keyboard />,
    title: 'Accessible by default',
    body: 'Every interactive component follows its WAI-ARIA pattern, ships its keyboard map and is tested with axe in every state.',
    link: { label: 'How we test', to: ROUTES.docs },
    art: KeyboardArt,
    wide: true,
  },
  {
    id: 'headless',
    icon: <Layers />,
    title: 'Styled or headless',
    body: 'Take the Pada look, or only the behaviour: focus, keyboard, ARIA and state attributes, with your own CSS.',
    link: { label: 'Headless parts', to: '/docs/headless' },
    art: HeadlessArt,
  },
  {
    id: 'tokens',
    icon: <Droplet />,
    title: 'One token system',
    body: 'Colour, type, space, radius, motion and elevation are --pada-* custom properties, in five tiers.',
    link: { label: 'Explore tokens', to: ROUTES.tokens },
    art: TokensArt,
  },
  {
    id: 'motion',
    icon: <Wave />,
    title: 'Motion with footing',
    body: 'Quick, settled transitions built on duration and easing tokens. They switch off when people ask them to.',
    link: { label: 'Foundations', to: '/docs/foundations' },
    art: MotionArt,
  },
  {
    id: 'figma',
    icon: <Figma />,
    title: 'Figma kit',
    body: 'A free community library whose variables map one-to-one to the tokens in code.',
    link: { label: 'Open in Figma', to: links.figma, external: true },
    art: FigmaArt,
  },
  {
    id: 'ai',
    icon: <Sparkle />,
    title: 'Ready for AI agents',
    body: 'A machine-readable manifest of every component and prop, plus llms.txt, so coding agents write correct Pada code.',
    link: { label: 'Build with AI', to: ROUTES.ai },
    art: AiArt,
    full: true,
  },
];

export function Features() {
  return (
    <section className="section features" id="features" aria-labelledby="features-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Why Pada</p>
          <h2 id="features-title" className="h2">
            Everything a product team needs <span className="serif">underfoot.</span>
          </h2>
          <p className="lede">
            The hard parts are done: behaviour, accessibility, theming and motion. You bring the product.
          </p>
        </div>
        <div className="bento">
          {FEATURES.map((feature, i) => (
            <article
              key={feature.id}
              className="bento-tile"
              data-wide={feature.wide ? '' : undefined}
              data-full={feature.full ? '' : undefined}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.06}s` }}
            >
              <div className="bento-art">{feature.art}</div>
              <div className="bento-copy">
                <span className="bento-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                {feature.link.external ? (
                  <a className="text-link" href={feature.link.to} target="_blank" rel="noopener noreferrer">
                    {feature.link.label} <ArrowRight size={14} />
                  </a>
                ) : (
                  <RouterLink className="text-link" to={feature.link.to}>
                    {feature.link.label} <ArrowRight size={14} />
                  </RouterLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
