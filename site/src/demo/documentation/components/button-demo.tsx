import DemoPage from '../DemoPage';
import { Button, type ButtonVariant } from '@pada/components/Button';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';

const VARIANTS = [
  { label: 'Primary', variant: 'primary' },
  { label: 'Secondary', variant: 'secondary' },
  { label: 'Ghost', variant: 'ghost' },
  { label: 'Destructive', variant: 'destructive' },
];

const USAGE_CODE = `import { Button } from 'pada-ds';

export function Example() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" leftIcon="add">New</Button>
      <Button variant="ghost" rightIcon="chevron_right">Next</Button>
      <Button variant="destructive">Delete</Button>
    </>
  );
}`;

export default function ButtonDemo() {
  return (
    <DemoPage
      title="Button"
      kind="Component"
      purpose={
        <p>
          Buttons trigger an action or a navigation decision. Use them anywhere the user
          needs to commit to a choice — submitting a form, confirming a destructive change,
          launching a flow, or moving to the next step. Reserve the primary style for the
          single most important action on a screen; rely on secondary and ghost variants
          for supporting actions, and the destructive variant only for irreversible operations.
        </p>
      }
      design={
        <>
          <p>
            The Button supports four visual styles — <strong>primary</strong>, <strong>secondary</strong>,{' '}
            <strong>ghost</strong>, and <strong>destructive</strong> — and three icon configurations:
            label-only, leading icon, and trailing icon. Icons are 16&nbsp;px and inherit the button's
            text color, so contrast is preserved across every variant. A button has a fixed
            32&nbsp;px height and an 8&nbsp;px corner radius, regardless of content.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}>
            {VARIANTS.map(({ label, variant }) => (
              <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: 'var(--pada-color-fg-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    minWidth: 96,
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
                <Button variant={variant as ButtonVariant}>Button</Button>
                <Button variant={variant as ButtonVariant} leftIcon="add">Button</Button>
                <Button variant={variant as ButtonVariant} rightIcon="chevron_right">Button</Button>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Import the <code>Button</code> from <code>pada-ds</code>. Choose a variant and
            optionally pass <code>leftIcon</code> or <code>rightIcon</code> (Material Symbols
            name). Standard <code>onClick</code>, <code>disabled</code>, and{' '}
            <code>type</code> props are supported via React's native button attributes.
          </p>
          <CodeSnippet code={USAGE_CODE} language="tsx" label="Button usage" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>All variants meet WCAG 2.1 AA contrast against their surface (4.5:1 text, 3:1 non-text).</li>
          <li>Renders as a native <code>&lt;button&gt;</code> so keyboard activation with <kbd>Enter</kbd> and <kbd>Space</kbd> works out of the box.</li>
          <li>A 2&nbsp;px focus ring appears on <code>:focus-visible</code> for keyboard users and stays clear of mouse users.</li>
          <li>When using an icon-only button, provide an <code>aria-label</code> describing the action.</li>
          <li>Disabled buttons are skipped from the tab order and announce a disabled state to assistive tech via the native <code>disabled</code> attribute.</li>
        </ul>
      }
    />
  );
}
