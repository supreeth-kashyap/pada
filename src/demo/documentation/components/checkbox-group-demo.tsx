import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { useState } from 'react';
import { CheckboxGroup, type CheckboxGroupOption } from '../../../components/CheckboxGroup';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const topics: CheckboxGroupOption[] = [
  { value: 'mentions', label: 'Mentions' },
  { value: 'comments', label: 'Comments on my documents' },
  { value: 'reviews', label: 'Review requests' },
  { value: 'billing', label: 'Billing (always on)', disabled: true },
];
const channels: CheckboxGroupOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push' },
  { value: 'sms', label: 'SMS' },
];

export default function CheckboxGroupDemo() {
  const [value, setValue] = useState<string[]>(['mentions', 'billing']);
  return (
    <DemoPage
      title="Checkbox Group"
      kind="Component"
      purpose={<p>Checkbox Group asks for any number of choices from a short list, with one label and one error for the whole set. Its value is the array of checked options.</p>}
      design={
        <>
          <p>Stacked or in a wrapping row. An optional Select all box turns mixed while only some are checked, and only changes the choices that are enabled.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <CheckboxGroup
              label="Notify me about"
              description="We send at most one email a day."
              options={topics}
              selectAll
              value={value}
              onValueChange={setValue}
            />
            <CheckboxGroup label="Channels" orientation="horizontal" options={channels} defaultValue={['email']} />
            <CheckboxGroup label="Topics" options={topics} required invalid error="Pick at least one topic." />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { CheckboxGroup } from 'pada-ds';

const [topics, setTopics] = useState<string[]>([]);

<CheckboxGroup
  label="Notify me about"
  options={[{ value: 'mentions', label: 'Mentions' }, { value: 'digest', label: 'Weekly digest' }]}
  selectAll
  value={topics}
  onValueChange={setTopics}
  name="topics"            // each checked choice submits as topics=value
/>`}
          language="tsx"
          label="Checkbox Group usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The set is a <code>role="group"</code> named by the label and described by the description and error.</li>
          <li>Each choice is a native checkbox: Tab moves between them and Space toggles.</li>
          <li>Select all is announced as mixed while only some choices are checked.</li>
        </ul>
      }
    />
  );
}
