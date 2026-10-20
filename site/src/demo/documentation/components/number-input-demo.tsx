import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { NumberInput } from '@pada/components/NumberInput';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function NumberInputDemo() {
  return (
    <DemoPage
      title="Number Input"
      kind="Component"
      purpose={<p>NumberInput collects a number: a quantity, a price, a percentage. It formats the value for the reader (currency symbols, grouping, percent) and still accepts whatever the user types, parsed in the same locale. Use it instead of a plain text input whenever the value is numeric and has limits or a natural step.</p>}
      design={
        <>
          <p>Steppers sit stacked at the end by default, or split on both sides for small counts. Hold a stepper to keep counting. Sizes follow the control-height tokens and respond to density.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16, maxWidth: 360 }}>
            <NumberInput label="Seats" description="Between 1 and 50." defaultValue={5} min={1} max={50} />
            <NumberInput label="Guests" stepper="split" defaultValue={2} min={1} max={12} />
            <NumberInput label="Budget" formatOptions={{ style: 'currency', currency: 'USD' }} defaultValue={1200} step={50} min={0} />
            <NumberInput label="Discount" formatOptions={{ style: 'percent' }} defaultValue={0.15} step={0.05} min={0} max={1} size="sm" />
            <NumberInput label="Retries" error="Use 10 or fewer." defaultValue={12} max={10} />
          </div>
        </>
      }
      developer={
        <>
          <p>Values are numbers (or <code>null</code> when empty). <code>onValueChange</code> fires on each step and when typed text is committed with Enter or on blur. With <code>name</code>, the raw number submits with forms.</p>
          <CodeSnippet
            code={`import { NumberInput } from 'pada-ds';

<NumberInput
  label="Budget"
  name="budget"
  min={0}
  step={50}
  largeStep={500}
  formatOptions={{ style: 'currency', currency: 'USD' }}
  value={budget}
  onValueChange={setBudget}
/>

// Unstyled parts
import { NumberInput } from 'pada-ds/headless';

<NumberInput.Root defaultValue={1} min={0}>
  <NumberInput.Decrement>−</NumberInput.Decrement>
  <NumberInput.Input aria-label="Quantity" />
  <NumberInput.Increment>+</NumberInput.Increment>
</NumberInput.Root>`}
            language="tsx"
            label="NumberInput usage"
          />
        </>
      }
      accessibility={
        <ul style={list}>
          <li>The input is a <code>spinbutton</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code> and a formatted <code>aria-valuetext</code> ("$1,200.00").</li>
          <li><kbd>↑</kbd> / <kbd>↓</kbd> step, <kbd>Page Up</kbd> / <kbd>Page Down</kbd> take a large step, <kbd>Home</kbd> / <kbd>End</kbd> jump to the limits, <kbd>Enter</kbd> commits typed text.</li>
          <li>The steppers are out of the tab order (the arrow keys do the same) and are disabled at the limits.</li>
          <li>The label, description and error are wired through Field; the error is announced when it appears.</li>
        </ul>
      }
    />
  );
}
