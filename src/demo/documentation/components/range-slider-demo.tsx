import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { RangeSlider } from '../../../components/RangeSlider';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function RangeSliderDemo() {
  return (
    <DemoPage
      title="Range Slider"
      kind="Component"
      purpose={<p>RangeSlider picks a low and a high value on one track: a price range, a date span, a size bracket. Use it when the range matters more than exact numbers; pair it with two NumberInputs when people need to type precise values.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 24, maxWidth: 420 }}>
          <RangeSlider label="Price" defaultValue={[120, 480]} min={0} max={1000} step={10} formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} />
          <RangeSlider label="Team size" defaultValue={[5, 20]} min={1} max={50} minStepsBetweenThumbs={2} description="At least two people apart." />
          <RangeSlider label="Budget" defaultValue={[60, 90]} error="The top of the range is over budget." />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { RangeSlider } from 'pada-ds';

<RangeSlider
  label="Price"
  value={range}
  onValueChange={setRange}      // while dragging
  onValueCommit={search}        // when the drag ends
  min={0}
  max={1000}
  step={10}
  formatOptions={{ style: 'currency', currency: 'USD' }}
/>

// Headless: import { Slider } from 'pada-ds/headless' for any number of thumbs.`}
          language="tsx"
          label="RangeSlider usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Each thumb is a <code>slider</code> named "Minimum price" / "Maximum price", with a formatted <code>aria-valuetext</code> and limits set by the other thumb.</li>
          <li><kbd>←</kbd> <kbd>→</kbd> (or <kbd>↑</kbd> <kbd>↓</kbd>) step, <kbd>Page Up</kbd> / <kbd>Page Down</kbd> take ten steps, <kbd>Home</kbd> / <kbd>End</kbd> jump as far as allowed.</li>
        </ul>
      }
    />
  );
}
