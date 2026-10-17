import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { RadioCardGroup } from '../../../components/RadioCard';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function RadioCardDemo() {
  return (
    <DemoPage
      title="Radio Card"
      kind="Component"
      purpose={<p>RadioCardGroup presents a single choice as cards, for options that need a description, an icon or a price to compare: plans, shipping speeds, templates, workspace types.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch', gap: 32 }}>
          <RadioCardGroup
            label="Plan"
            description="You can change plans at any time."
            defaultValue="pro"
            options={[
              { value: 'free', title: 'Free', description: 'For personal projects', meta: '$0 / month', icon: 'user_default' },
              { value: 'pro', title: 'Pro', description: 'For growing teams', meta: '$12 / seat', icon: 'team' },
              { value: 'enterprise', title: 'Enterprise', description: 'SSO, audit logs, SLA', meta: 'Contact us', icon: 'corporate', disabled: true },
            ]}
          />
          <RadioCardGroup
            label="Delivery"
            columns={2}
            options={[
              { value: 'standard', title: 'Standard', description: '4–6 business days', meta: 'Free' },
              { value: 'express', title: 'Express', description: '1–2 business days', meta: '$9' },
            ]}
          />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { RadioCardGroup } from 'pada-ds';

<RadioCardGroup
  label="Plan"
  name="plan"
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: 'free', title: 'Free', description: 'For personal projects', meta: '$0' },
    { value: 'pro', title: 'Pro', description: 'For growing teams', meta: '$12 / seat' },
  ]}
/>`}
          language="tsx"
          label="RadioCardGroup usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A <code>fieldset</code> named by its legend, holding native radio inputs: <kbd>Tab</kbd> reaches the group and the arrow keys move and select, as with any radio group.</li>
          <li>Each card's description describes its radio. The selected card is marked by its border, fill and a filled indicator, not by colour alone.</li>
        </ul>
      }
    />
  );
}
