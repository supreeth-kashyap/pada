import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { ColorPicker } from '@pada/components/ColorPicker';
import { Popover } from '@pada/components/Popover';
import { Button } from '@pada/components/Button';
import { ThemeProvider } from '@pada/components/Theme';
import { Stack } from '@pada/components/Stack';
import { parseColor } from '@pada/components/ColorPicker/color';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const BRAND = [
  { value: '#4f46e5', label: 'Indigo' },
  { value: '#7c3aed', label: 'Violet' },
  { value: '#db2777', label: 'Pink' },
  { value: '#dc2626', label: 'Red' },
  { value: '#ea580c', label: 'Orange' },
  { value: '#ca8a04', label: 'Amber' },
  { value: '#16a34a', label: 'Green' },
  { value: '#0891b2', label: 'Cyan' },
];

export default function ColorPickerDemo() {
  const [accent, setAccent] = useState('oklch(51.1% 0.262 276.9)');
  const [label, setLabel] = useState('#db2777');
  const hue = Math.round(parseColor(accent)?.h ?? 277);
  return (
    <DemoPage
      title="Color Picker"
      kind="Component"
      purpose={<p>Color Picker lets people choose a colour: a label colour, a chart series, a brand accent. It works in OKLCH, the perceptual space Pada’s tokens are built in, so lightness stays even as the hue changes. Offer swatches for the common choices and keep the free picker for when they are not enough.</p>}
      design={
        <>
          <p>An area for chroma (left to right) and lightness (bottom to top) at the chosen hue, a hue slider, a hex field with the OKLCH reading beside it, and optional swatches. Colours outside sRGB are drawn at their nearest displayable colour.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
            <Stack gap={3}>
              <ColorPicker label="Accent colour" value={accent} onValueChange={setAccent} format="oklch" />
              <code style={{ fontSize: 'var(--pada-font-size-xs)' }}>{accent}</code>
            </Stack>
            <Stack gap={3} style={{ width: 260 }}>
              <p style={{ margin: 0 }}>
                The picked hue drives <code>accent="custom"</code> through <code>accentHue</code>:
              </p>
              <ThemeProvider accent="custom" accentHue={hue}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                </div>
              </ThemeProvider>
              <p style={{ margin: 0 }}>In a popover, with swatches:</p>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button variant="secondary">
                    <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 4, background: label, boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--pada-color-fg) 15%, transparent)' }} />
                    Label colour
                  </Button>
                </Popover.Trigger>
                <Popover.Content aria-label="Label colour">
                  <ColorPicker label="Label colour" value={label} onValueChange={setLabel} swatches={BRAND} />
                </Popover.Content>
              </Popover.Root>
            </Stack>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { ColorPicker } from 'pada-ds';

<ColorPicker label="Label colour" value={color} onValueChange={setColor} swatches={['#4f46e5', '#db2777']} />

// Keep the exact OKLCH value (it may be outside sRGB on wide-gamut screens)
<ColorPicker label="Accent" format="oklch" value={accent} onValueChange={setAccent} />

// Helpers
import { parseColor, formatHex, formatOklch } from 'pada-ds';
formatHex(parseColor('oklch(62.8% 0.258 29.2)')!); // '#ff0000'`}
          language="tsx"
          label="Color picker usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The picker is a labelled group. The area is a focusable 2D slider: Left and Right change chroma, Up and Down change lightness (Shift for bigger steps, PageUp and PageDown for lightness, Home and End for grey or full chroma), and its value text reads both.</li>
          <li>Hue is a standard slider. The hex field accepts typed values on Enter or blur, marks invalid text with <code>aria-invalid</code>, and Escape reverts it.</li>
          <li>Swatches are toggle buttons named by their label, with <code>aria-pressed</code> on the current colour.</li>
          <li>Colour alone shouldn’t carry meaning in what people pick it for: pair colours with text or icons, and check contrast where it matters.</li>
        </ul>
      }
    />
  );
}
