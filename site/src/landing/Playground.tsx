import { useMemo, useState, type CSSProperties } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  CodeSnippet,
  InputText,
  Select,
  Slider,
  Switch,
  Tags,
  ThemeProvider,
  ToggleGroup,
  type ThemeSettings,
} from 'pada-ds';

const ACCENTS = [
  ['indigo', 'oklch(0.51 0.23 277)'],
  ['violet', 'oklch(0.54 0.25 293)'],
  ['rose', 'oklch(0.59 0.22 11)'],
  ['orange', 'oklch(0.65 0.2 41)'],
  ['amber', 'oklch(0.67 0.16 58)'],
  ['emerald', 'oklch(0.6 0.13 163)'],
  ['teal', 'oklch(0.6 0.1 185)'],
  ['sky', 'oklch(0.59 0.14 242)'],
  ['custom', 'conic-gradient(from 0deg, oklch(0.65 0.2 0), oklch(0.65 0.2 120), oklch(0.65 0.2 240), oklch(0.65 0.2 360))'],
] as const;

type Density = NonNullable<ThemeSettings['density']>;
type Radius = NonNullable<ThemeSettings['radius']>;
type Neutral = NonNullable<ThemeSettings['neutral']>;

const NEUTRALS: { label: string; value: Neutral }[] = [
  { label: 'Stone (warm)', value: 'stone' },
  { label: 'Slate (cool)', value: 'slate' },
  { label: 'Gray', value: 'gray' },
  { label: 'Zinc', value: 'zinc' },
  { label: 'Neutral', value: 'neutral' },
];

export function Playground() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState<string>('indigo');
  const [hue, setHue] = useState(200);
  const [neutral, setNeutral] = useState<Neutral>('stone');
  const [density, setDensity] = useState<Density>('comfortable');
  const [radius, setRadius] = useState<Radius>('md');
  const [typeBase, setTypeBase] = useState(14);
  const [contrast, setContrast] = useState(false);

  const attributes = useMemo(() => {
    const attrs: [string, string][] = [
      ['data-theme', theme],
      ['data-accent', accent],
      ['data-neutral', neutral],
      ['data-density', density],
      ['data-radius', radius],
    ];
    if (contrast) attrs.push(['data-contrast', 'more']);
    return attrs;
  }, [theme, accent, neutral, density, radius, contrast]);

  const code = useMemo(() => {
    const html = `<html\n${attributes.map(([k, v]) => `  ${k}="${v}"`).join('\n')}\n>`;
    const vars = [`--pada-type-base: ${typeBase}px;`];
    if (accent === 'custom') vars.unshift(`--pada-accent-hue: ${hue};`);
    return `${html}\n\n<style>\n  :root {\n${vars.map((v) => `    ${v}`).join('\n')}\n  }\n</style>`;
  }, [attributes, accent, hue, typeBase]);

  return (
    <section className="section playground" id="customise" aria-labelledby="playground-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Make it yours</p>
          <h2 id="playground-title" className="h2">
            Seven attributes. <span className="serif">Every component.</span>
          </h2>
          <p className="lede">
            Theme, accent, neutral, density, radius, contrast and type scale are plain attributes and custom
            properties. Change one and hundreds of derived tokens follow, with no overrides and no forks. Try it.
          </p>
        </div>

        <div className="pg" data-reveal>
          <form className="pg-controls" aria-label="Theme controls" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend>Theme</legend>
              <ToggleGroup.Root type="single" size="sm" aria-label="Theme" value={theme} onValueChange={(v) => v && setTheme(v as 'light' | 'dark')}>
                <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
                <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
              </ToggleGroup.Root>
            </fieldset>

            <fieldset>
              <legend>Accent</legend>
              <ToggleGroup.Root type="single" aria-label="Accent colour" className="swatches" value={accent} onValueChange={(v) => v && setAccent(v)}>
                {ACCENTS.map(([name, swatch]) => (
                  <ToggleGroup.Item key={name} value={name} aria-label={name === 'custom' ? 'Custom hue' : name} title={name} className="swatch">
                    <span style={{ background: swatch }} />
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
              {accent === 'custom' && (
                <Slider label="Hue" min={0} max={360} value={hue} onValueChange={setHue} showValue />
              )}
            </fieldset>

            <fieldset>
              <legend>Neutral</legend>
              <Select label="Neutral palette" options={NEUTRALS} value={neutral} onChange={(v) => setNeutral(v as Neutral)} />
            </fieldset>

            <fieldset>
              <legend>Density</legend>
              <ToggleGroup.Root type="single" size="sm" aria-label="Density" value={density} onValueChange={(v) => v && setDensity(v as Density)}>
                <ToggleGroup.Item value="compact">Compact</ToggleGroup.Item>
                <ToggleGroup.Item value="comfortable">Comfortable</ToggleGroup.Item>
                <ToggleGroup.Item value="spacious">Spacious</ToggleGroup.Item>
              </ToggleGroup.Root>
            </fieldset>

            <fieldset>
              <legend>Radius</legend>
              <ToggleGroup.Root type="single" size="sm" aria-label="Corner radius" value={radius} onValueChange={(v) => v && setRadius(v as Radius)}>
                {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
                  <ToggleGroup.Item key={r} value={r}>{r === 'none' ? '0' : r.toUpperCase()}</ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </fieldset>

            <fieldset>
              <legend>Type &amp; contrast</legend>
              <Slider label="Base size (px)" min={12} max={17} step={1} value={typeBase} onValueChange={setTypeBase} showValue />
              <Switch label="More contrast" checked={contrast} onChange={(e) => setContrast(e.currentTarget.checked)} />
            </fieldset>
          </form>

          <div className="pg-stage">
            <ThemeProvider
              target="element"
              theme={theme}
              accent={accent}
              neutral={neutral}
              density={density}
              radius={radius}
              contrast={contrast ? 'more' : 'standard'}
              accentHue={accent === 'custom' ? hue : undefined}
            >
              <div className="pg-canvas" style={{ ['--pada-type-base']: `${typeBase}px` } as CSSProperties}>
                <div className="pg-card pg-card-wide">
                  <div className="pg-card-head">
                    <div>
                      <strong>Invite your team</strong>
                      <p>Collaborators can edit every project in this workspace.</p>
                    </div>
                    <Badge tone="accent">Team plan</Badge>
                  </div>
                  <div className="pg-invite">
                    <InputText label="Email address" placeholder="name@company.com" />
                    <Button leftIcon="add">Send invite</Button>
                  </div>
                  <div className="pg-people">
                    {['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map((name, i) => (
                      <div className="pg-person" key={name}>
                        <Avatar name={name} size="sm" status={i === 0 ? 'online' : undefined} />
                        <span className="pg-person-name">{name}</span>
                        <Tags variant={i === 0 ? 'primary' : 'neutral'}>{i === 0 ? 'Owner' : 'Editor'}</Tags>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pg-card">
                  <strong>Notifications</strong>
                  <Switch label="Product updates" defaultChecked />
                  <Switch label="Weekly digest" />
                  <Checkbox label="Mentions only" defaultChecked />
                </div>
                <div className="pg-card">
                  <Alert tone="success" title="Theme applied">
                    Every token above was derived from your choices.
                  </Alert>
                  <div className="pg-buttons">
                    <Button variant="secondary" size="sm">Cancel</Button>
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </div>
            </ThemeProvider>
            <div className="pg-code">
              <CodeSnippet code={code} language="html" type="multi-line" label="Your theme" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
