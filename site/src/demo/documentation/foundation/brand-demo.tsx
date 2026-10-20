import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Button } from '@pada/components/Button';
import { PadaLogo } from '@pada/components/PadaLogo';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const dark = { background: 'oklch(0.2 0.01 60)', color: 'oklch(0.96 0.005 60)', padding: 24, borderRadius: 12 } as const;

export default function BrandDemo() {
  const [replay, setReplay] = useState(0);
  return (
    <DemoPage
      title="Brand"
      kind="Foundation"
      purpose={
        <p>
          <em>Pāda</em> (पाद) is Sanskrit for <em>foot</em>: the part that carries the weight and meets the ground. In verse, a pāda is also one measured
          quarter of a whole. The mark is two mirrored geometric halves, amber and the accent colour, set side by side; the wordmark reads "Pada . design".
        </p>
      }
      design={
        <>
          <p>Lockup, mark and wordmark, in colour, accent and mono. The right half follows the accent, so it changes with <code>data-accent</code>.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 28 }}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
              <PadaLogo size="xl" />
              <PadaLogo variant="mark" size="xl" />
              <PadaLogo variant="wordmark" size="lg" />
            </div>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
              <PadaLogo tone="accent" size="lg" />
              <PadaLogo tone="mono" size="lg" style={{ color: 'var(--pada-color-fg-muted)' }} />
              <div data-accent="emerald" style={{ display: 'inline-flex' }}>
                <PadaLogo size="lg" title="Pada with an emerald accent" />
              </div>
              <div style={dark} data-theme="dark">
                <PadaLogo size="lg" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
              {[16, 20, 24, 32, 48].map((size) => (
                <PadaLogo key={size} variant="mark" size={size} />
              ))}
            </div>
          </div>
          <p>Motion: the mark steps in once (left half, right half, then the wordmark), and its halves lift in turn as a loader. Both are still under reduced motion.</p>
          <div className="demo-page__showcase" style={{ alignItems: 'center', gap: 40 }}>
            <PadaLogo key={replay} size="xl" animated />
            <Button variant="secondary" size="sm" onClick={() => setReplay((count) => count + 1)}>
              Replay
            </Button>
            <PadaLogo variant="mark" size="lg" animated="loop" />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { PadaLogo } from 'pada-ds';

<PadaLogo />                                   // lockup, 32px, colour
<PadaLogo variant="mark" size={20} tone="mono" />
<PadaLogo variant="wordmark" size="lg" />
<PadaLogo size="xl" animated />                // steps in once
<PadaLogo variant="mark" animated="loop" />    // branded loader (role="status")

// The favicon is public/favicon.svg (adapts to dark mode).`}
          language="tsx"
          label="PadaLogo usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The logo is an image named "Pada" (or your <code>title</code>); pass <code>decorative</code> when a visible label sits next to it. The looping loader is a <code>status</code> named "Loading".</li>
          <li>Rules: keep clear space of one half's width around the mark; the mark goes down to 16px and the lockup to 64px wide. Don't rotate it, recolour it outside the palette, or add effects.</li>
        </ul>
      }
    />
  );
}
