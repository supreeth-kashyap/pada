import type { ReactNode } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { ThemeProvider, ThemeToggle, type ThemeSettings } from '../../../components/Theme';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { Stack } from '../../../components/Stack';
import { Switch } from '../../../components/Switch';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const cell = { padding: '8px 12px', borderBottom: '1px solid var(--pada-color-border-subtle)', textAlign: 'left', verticalAlign: 'top' } as const;

const AXES: [string, string, string][] = [
  ['theme', 'data-theme', 'light · dark · system'],
  ['accent', 'data-accent', 'any palette hue (indigo, violet, emerald, amber, rose, …) or custom with accentHue (--pada-accent-hue)'],
  ['neutral', 'data-neutral', 'stone · slate · gray · zinc · neutral'],
  ['density', 'data-density', 'compact · comfortable · spacious'],
  ['radius', 'data-radius', 'none · sm · md · lg · xl'],
  ['motion', 'data-motion', 'reduced · full (defaults to the OS setting)'],
  ['contrast', 'data-contrast', 'standard · more'],
];

function Sample({ title, settings }: { title: string; settings: ThemeSettings }) {
  return (
    <ThemeProvider {...settings}>
      <div
        style={{
          flex: '1 1 220px',
          padding: 16,
          borderRadius: 'var(--pada-radius-lg)',
          border: '1px solid var(--pada-color-border)',
          background: 'var(--pada-color-surface)',
          color: 'var(--pada-color-fg)',
        }}
      >
        <Stack gap={3}>
          <Stack direction="row" justify="between" align="center">
            <strong>{title}</strong>
            <Badge tone="accent">Beta</Badge>
          </Stack>
          <Switch label="Email digests" defaultChecked />
          <Stack direction="row" gap={2}>
            <Button size="sm">Save</Button>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </div>
    </ThemeProvider>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
      {children}
    </div>
  );
}

export default function ThemeDemo() {
  return (
    <DemoPage
      title="Theme"
      kind="Foundation"
      purpose={
        <p>
          Every Pada colour, radius, gap and duration is derived from a handful of axes set as <code>data-*</code> attributes. <code>ThemeProvider</code> sets
          them for the whole page or for one section, remembers the choice if asked, and gives components <code>useTheme()</code>. Try every axis at once on the
          Playground page.
        </p>
      }
      design={
        <>
          <p>Providers nest: each card below is its own themed section, with no component CSS changed.</p>
          <Row>
            <Sample title="Light" settings={{ theme: 'light' }} />
            <Sample title="Dark" settings={{ theme: 'dark' }} />
            <Sample title="Dark · emerald" settings={{ theme: 'dark', accent: 'emerald' }} />
          </Row>
          <Row>
            <Sample title="Compact · sharp" settings={{ theme: 'light', density: 'compact', radius: 'none' }} />
            <Sample title="Spacious · round" settings={{ theme: 'light', density: 'spacious', radius: 'xl', accent: 'rose' }} />
            <Sample title="More contrast" settings={{ theme: 'light', contrast: 'more', neutral: 'zinc' }} />
          </Row>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <ThemeProvider defaultTheme="light">
              <ThemeToggle />
            </ThemeProvider>
            <span>ThemeToggle switches its nearest provider, spreading the new theme from the button where view transitions are supported.</span>
          </div>
          <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 760, color: 'var(--pada-color-fg)', fontSize: 'var(--pada-font-size-sm)' }}>
            <thead>
              <tr>
                <th style={cell}>Prop</th>
                <th style={cell}>Attribute</th>
                <th style={cell}>Values</th>
              </tr>
            </thead>
            <tbody>
              {AXES.map(([prop, attribute, values]) => (
                <tr key={prop}>
                  <td style={cell}>
                    <code>{prop}</code>
                  </td>
                  <td style={cell}>
                    <code>{attribute}</code>
                  </td>
                  <td style={cell}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }
      developer={
        <>
          <CodeSnippet
            code={`import { ThemeProvider, ThemeToggle, Toaster } from 'pada-ds';
import 'pada-ds/styles.css';

// Whole app: attributes go on <html>, the choice is remembered
<ThemeProvider target="root" defaultTheme="system" storageKey="theme" accent="indigo">
  <App />
  <Toaster />
</ThemeProvider>

// One section with its own theme; overlays opened inside it stay themed
<ThemeProvider theme="dark" accent="emerald">
  <Sidebar />
</ThemeProvider>

// Read or change it
const { theme, resolvedTheme, setTheme } = useTheme();`}
            language="tsx"
            label="ThemeProvider usage"
          />
          <CodeSnippet
            code={`<!-- No React needed: the attributes alone drive the tokens -->
<html data-theme="dark" data-accent="amber" data-density="compact">

/* A custom accent from any hue, set where data-accent is */
:root { --pada-accent-hue: 200; }
<html data-accent="custom">`}
            language="html"
            label="Plain HTML and CSS"
          />
        </>
      }
      accessibility={
        <ul style={list}>
          <li>Text and border roles map to palette steps chosen for readable contrast in both themes; check a custom accent hue yourself. <code>contrast="more"</code> (or the OS “increase contrast” setting) strengthens borders and muted text.</li>
          <li>
            <code>defaultTheme="system"</code> follows the operating system and updates live when it changes. Motion follows <code>prefers-reduced-motion</code> unless
            <code> motion</code> overrides it.
          </li>
          <li>ThemeToggle is a button labelled by the theme it switches to, and its transition is skipped under reduced motion.</li>
        </ul>
      }
    />
  );
}
