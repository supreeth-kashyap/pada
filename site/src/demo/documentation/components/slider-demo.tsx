import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Slider } from '@pada/components/Slider';

export default function SliderDemo() {
  return (
    <DemoPage
      title="Slider"
      kind="Component"
      purpose={<p>Slider lets users pick a numeric value from a continuous range. Use it for adjustments where the precise value matters less than the relative position — volume, opacity, threshold tuning. For exact numeric entry, pair with a numeric InputText.</p>}
      design={<><p>Slider renders a track and thumb, supports min/max/step, optional value label, and a disabled state. Range (two-thumb) variant available.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><Slider min={0} max={100} defaultValue={40} /></div></div></>}
      developer={<><p>Import the <code>Slider</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Slider } from 'pada-ds';

export function VolumeSlider() {
  return <Slider min={0} max={100} defaultValue={50} aria-label="Volume" />;
}`} language="tsx" label="Slider usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Native <code>&lt;input type="range"&gt;</code> so keyboard support (<kbd>←/→</kbd>, <kbd>Home/End</kbd>, <kbd>PgUp/PgDn</kbd>) works out of the box.</li><li>Always provide an <code>aria-label</code> or visible label so screen readers can announce purpose.</li><li>Track and thumb maintain a 3:1 contrast against the surface.</li></ul>}
    />
  );
}
