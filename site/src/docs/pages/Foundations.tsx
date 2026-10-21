import { useMemo, useState } from 'react';
import { Button, Icon, iconNames, SearchField } from 'pada-ds';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';
import { TokenValue } from '../TokenValue';

const HUES = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const INTENTS = ['accent', 'neutral', 'success', 'warning', 'danger', 'info'];
const TYPE = ['9xl', '8xl', '7xl', '6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'].reverse();
const SPACE = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
const RADII = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
const SHADOWS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const DURATIONS = ['instant', 'fast', 'normal', 'slow', 'slower'];
const EASINGS = ['standard', 'enter', 'exit', 'emphasized', 'spring'];

function MotionDemo() {
  const [moved, setMoved] = useState(false);
  return (
    <div className="motion-demo">
      <Button size="sm" variant="secondary" onClick={() => setMoved((m) => !m)}>
        {moved ? 'Back' : 'Play'}
      </Button>
      <div className="motion-lanes">
        {EASINGS.map((ease) => (
          <div key={ease} className="motion-lane">
            <code>--pada-ease-{ease}</code>
            <div className="motion-track">
              <span
                className="motion-dot"
                data-moved={moved ? '' : undefined}
                style={{ transitionTimingFunction: `var(--pada-ease-${ease})` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconGallery() {
  const [query, setQuery] = useState('');
  const names = useMemo(() => iconNames.filter((n) => n.includes(query.trim().toLowerCase())), [query]);
  return (
    <>
      <div className="index-search">
        <SearchField value={query} onChange={setQuery} placeholder={`Filter ${iconNames.length} icons`} aria-label="Filter icons" />
      </div>
      <ul className="icon-grid">
        {names.map((name) => (
          <li key={name}>
            <Icon name={name} size={20} />
            <code>{name}</code>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Foundations() {
  return (
    <DocsLayout
      toc={[
        { id: 'colour', label: 'Colour' },
        { id: 'intents', label: 'Intents' },
        { id: 'typography', label: 'Typography' },
        { id: 'spacing', label: 'Spacing & density' },
        { id: 'radius', label: 'Radius' },
        { id: 'elevation', label: 'Elevation' },
        { id: 'motion', label: 'Motion' },
        { id: 'icons', label: 'Icons' },
      ]}
    >
      <article className="doc">
        <DocHeader
          eyebrow="Guides"
          title="Foundations"
          lede="The raw material every component is made of. Everything on this page is drawn from the live tokens, so it follows the site's theme."
        />

        <DocSection id="colour" title="Colour">
          <p>22 reference ramps from 50 to 950. Themes map them to intents; components never read them directly.</p>
          <div className="ramps">
            {HUES.map((hue) => (
              <div key={hue} className="ramp">
                <code>{hue}</code>
                <div className="ramp-steps">
                  {STEPS.map((step) => (
                    <span key={step} title={`--pada-ref-${hue}-${step}`} style={{ background: `var(--pada-ref-${hue}-${step})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="intents" title="Intents">
          <p>Each intent has the same set of roles. Use the role that matches what you are drawing.</p>
          <div className="intent-grid">
            {INTENTS.map((intent) => (
              <div key={intent} className="intent-card">
                <strong>{intent}</strong>
                {['solid', 'subtle', 'fg', 'border'].map((role) => (
                  <div key={role} className="intent-row">
                    <span className="swatch-dot" style={{ background: `var(--pada-color-${intent}-${role})` }} />
                    <code>-{role}</code>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="typography" title="Typography">
          <p>
            Font sizes are steps on a modular scale from <code>--pada-type-base</code> (now <TokenValue name="--pada-type-base" />) by{' '}
            <code>--pada-type-ratio</code> (now <TokenValue name="--pada-type-ratio" />).
          </p>
          <div className="type-scale">
            {TYPE.slice(0, 9).map((step) => (
              <div key={step} className="type-row">
                <code>
                  {step} · <TokenValue name={`--pada-font-size-${step}`} as="length" />
                </code>
                <span style={{ fontSize: `var(--pada-font-size-${step})` }}>The foundation your product stands on</span>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="spacing" title="Spacing & density">
          <p>Space is <code>n × 0.25rem × --pada-density</code>, so <code>data-density</code> tightens or loosens every layout at once.</p>
          <div className="space-scale">
            {SPACE.map((step) => (
              <div key={step} className="space-row">
                <code>--pada-space-{step}</code>
                <span className="space-bar" style={{ width: `var(--pada-space-${step})` }} />
                <TokenValue name={`--pada-space-${step}`} as="length" />
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="radius" title="Radius">
          <p>Every radius is a multiple of <code>--pada-radius-base</code>, set by <code>data-radius</code>.</p>
          <div className="radius-grid">
            {RADII.map((r) => (
              <div key={r} className="radius-tile">
                <span style={{ borderRadius: `var(--pada-radius-${r})` }} />
                <code>{r}</code>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="elevation" title="Elevation">
          <p>Shadows for surfaces that float: menus use <code>md</code>, dialogs <code>xl</code>. Layers come from <code>--pada-z-*</code>, never hard-coded z-indexes.</p>
          <div className="shadow-grid">
            {SHADOWS.map((s) => (
              <div key={s} className="shadow-tile" style={{ boxShadow: `var(--pada-shadow-${s})` }}>
                <code>{s}</code>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="motion" title="Motion">
          <p>
            Durations ({DURATIONS.map((d, i) => (
              <span key={d}>
                {i > 0 && ', '}<code>{d}</code>
              </span>
            ))}) are multiplied by <code>--pada-motion-scale</code>, which is 0 under reduced motion. Enter motion uses{' '}
            <code>@starting-style</code>; exits wait for their transition before unmounting.
          </p>
          <MotionDemo />
        </DocSection>

        <DocSection id="icons" title="Icons">
          <p>The built-in set. Icons take the current text colour and are decorative unless you give them a label.</p>
          <IconGallery />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
