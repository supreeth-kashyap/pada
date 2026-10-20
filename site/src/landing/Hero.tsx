import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, AvatarGroup, Badge, Button, InputText, Progress, Stat, Switch, ThemeProvider, ToggleGroup } from 'pada-ds';
import { CopyButton } from '../shell/CopyButton';
import { ArrowRight } from '../shell/icons';
import { currentComponents, docs } from '../lib/docs';
import { ROUTES } from '../lib/paths';

const CYCLE = [
  { accent: 'indigo', radius: 'md' },
  { accent: 'emerald', radius: 'lg' },
  { accent: 'rose', radius: 'xl' },
  { accent: 'amber', radius: 'sm' },
  { accent: 'sky', radius: 'lg' },
  { accent: 'violet', radius: 'md' },
] as const;

const INSTALL = { react: 'npm i pada-ds', angular: 'npm i pada-ds-angular' } as const;

/** Cycles the stage's accent and radius, pausing on hover, focus and under reduced motion. */
function useThemeCycle() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % CYCLE.length), 3200);
    return () => window.clearInterval(id);
  }, [paused]);
  return { ...CYCLE[index], index, setPaused };
}

export function Hero() {
  const [framework, setFramework] = useState<keyof typeof INSTALL>('react');
  const { accent, radius, setPaused } = useThemeCycle();

  return (
    <section className="hero dot-ground" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <RouterLink className="hero-pill" to={ROUTES.changelog}>
            <span className="hero-pill-tag">
              <span className="live-dot" aria-hidden="true" />v{docs.version}
            </span>
            React and Angular, at full parity
            <ArrowRight size={14} />
          </RouterLink>
          <h1 id="hero-title" className="h1 hero-title">
            <span className="line">The foundation</span>
            <span className="line">
              your product{' '}
              <span className="serif underline-draw">
                stands on.
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 14C60 6 140 4 297 10" pathLength={1} />
                </svg>
              </span>
            </span>
          </h1>
          <p className="lede hero-lede">
            Pada is one design system for React and Angular: {currentComponents.length} accessible components,
            headless behaviour you can trust, and a token system that takes your brand in seven attributes.
          </p>

          <div className="hero-install">
            <ToggleGroup.Root
              type="single"
              size="sm"
              aria-label="Framework"
              value={framework}
              onValueChange={(v) => v && setFramework(v as keyof typeof INSTALL)}
            >
              <ToggleGroup.Item value="react">React</ToggleGroup.Item>
              <ToggleGroup.Item value="angular">Angular</ToggleGroup.Item>
            </ToggleGroup.Root>
            <div className="cmd">
              <span className="prompt" aria-hidden="true">$</span>
              <code>{INSTALL[framework]}</code>
              <CopyButton text={INSTALL[framework]} label="Copy install command" />
            </div>
          </div>

          <div className="hero-ctas">
            <RouterLink className="cta" to={ROUTES.gettingStarted}>
              Get started <ArrowRight />
            </RouterLink>
            <RouterLink className="cta" data-variant="ghost" to={ROUTES.components}>
              Browse components
            </RouterLink>
          </div>

          <ul className="hero-proof" aria-label="Highlights">
            <li>WAI-ARIA patterns</li>
            <li>axe-tested</li>
            <li>Light &amp; dark</li>
            <li>MIT licensed</li>
          </ul>
        </div>

        <div
          className="hero-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="stage-callout stage-callout-a" aria-hidden="true">
            <code>
              data-accent=<b>"{accent}"</b>
            </code>
            <code>
              data-radius=<b>"{radius}"</b>
            </code>
          </div>
          <div className="stage-callout stage-callout-b" aria-hidden="true">
            <span className="kbd-row">
              <kbd>Tab</kbd>
              <kbd>↵</kbd>
            </span>
            Keyboard first
          </div>

          <ThemeProvider target="element" accent={accent} radius={radius}>
            <div className="stage-frame" aria-label="Live Pada components that re-theme every few seconds" role="group">
              <div className="stage-bar" aria-hidden="true">
                <span className="dots"><i /><i /><i /></span>
                <span className="stage-url">acme.app/projects/new</span>
              </div>
              <div className="stage-body">
                <div className="stage-row">
                  <div className="stage-ws">
                    <Avatar name="Acme Inc" shape="square" size="sm" />
                    <div>
                      <strong>Acme workspace</strong>
                      <span>12 members</span>
                    </div>
                  </div>
                  <Badge tone="accent" variant="subtle">Pro plan</Badge>
                </div>

                <div className="stage-cards">
                  <div className="stage-card">
                    <Stat
                      label="Revenue"
                      value={128400}
                      formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
                      delta={0.124}
                      deltaFormatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
                      deltaLabel="vs last month"
                      size="sm"
                      animate={false}
                    />
                  </div>
                  <div className="stage-card">
                    <Progress label="Seats used" value={72} />
                    <AvatarGroup size="sm" max={4} label="Project members">
                      <Avatar name="Ada Lovelace" />
                      <Avatar name="Grace Hopper" />
                      <Avatar name="Alan Turing" />
                      <Avatar name="Katherine Johnson" />
                      <Avatar name="Radia Perlman" />
                    </AvatarGroup>
                  </div>
                </div>

                <div className="stage-card stage-form">
                  <InputText label="Project name" defaultValue="Q4 launch" />
                  <Switch label="Notify the team" defaultChecked />
                  <div className="stage-actions">
                    <Button variant="ghost" size="sm">Cancel</Button>
                    <Button size="sm" leftIcon="add">Create project</Button>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
}
