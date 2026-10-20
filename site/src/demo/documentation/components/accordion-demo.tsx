import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Accordion } from '@pada/components/Accordion';

export default function AccordionDemo() {
  return (
    <DemoPage
      title="Accordion"
      kind="Component"
      purpose={<p>Accordion lets users expand and collapse a section of content to manage information density on long pages. Use it for FAQs, settings panels, and grouped detail views where revealing every section at once would overwhelm the reader. Each section is independently controlled and progressively discloses content only when the user asks for it.</p>}
      design={<><p>An Accordion contains one or more items, each composed of an <code>AccordionHeader</code> (the always-visible trigger) and an <code>AccordionContent</code> (the disclosed body). Items can be expanded one at a time or independently.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}><Accordion header="What is Pada?" headerIconName="help" defaultOpen>Pada is a singular React design system focused on dense product UIs.</Accordion><Accordion header="How do I install it?" headerIconName="download_2">Install via <code>npm install pada-ds</code>.</Accordion><Accordion header="No leading icon">When <code>headerIconName</code> is omitted the icon slot is hidden entirely — the label sits flush against the left padding.</Accordion></div></div><p>Compose a group from parts. With <code>type="single"</code> one item is open at a time (<code>collapsible</code> lets it close again); <code>type="multiple"</code> opens items independently. The height animates open and closed.</p><div className="demo-page__showcase" style={{ flexDirection: 'column' }}><Accordion.Root type="single" collapsible defaultValue="shipping" style={{ width: '100%' }}><Accordion.Item value="shipping"><Accordion.Trigger iconName="info">Shipping</Accordion.Trigger><Accordion.Content>Orders ship within two business days.</Accordion.Content></Accordion.Item><Accordion.Item value="returns"><Accordion.Trigger>Returns</Accordion.Trigger><Accordion.Content>Return anything within 30 days.</Accordion.Content></Accordion.Item><Accordion.Item value="warranty" disabled><Accordion.Trigger>Warranty (disabled)</Accordion.Trigger><Accordion.Content>Two years.</Accordion.Content></Accordion.Item></Accordion.Root></div></>}
      developer={<><p>Import the <code>Accordion</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Accordion } from 'pada-ds';

export function FAQ() {
  return (
    <Accordion
      header="Section title"
      headerIconName="help"
      defaultOpen
    >
      Hidden body shown only when expanded. The chevron on the right turns
      when the section opens.
    </Accordion>
  );
}`} language="tsx" label="Accordion usage" /><CodeSnippet code={`import { Accordion } from 'pada-ds';

<Accordion.Root type="single" collapsible defaultValue="shipping">
  <Accordion.Item value="shipping">
    <Accordion.Trigger iconName="info">Shipping</Accordion.Trigger>
    <Accordion.Content>Orders ship within two business days.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="returns">
    <Accordion.Trigger headingLevel={2}>Returns</Accordion.Trigger>
    <Accordion.Content>Return anything within 30 days.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

// Unstyled: import { Accordion, Collapsible } from 'pada-ds/headless'`} language="tsx" label="Accordion group" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Headers expose <code>aria-expanded</code> and <code>aria-controls</code> linking to the panel.</li><li>Each header button sits inside a heading (<code>h3</code> by default, <code>headingLevel</code> to change it), and each panel is a region labelled by its header.</li><li>Keyboard support: <kbd>Enter</kbd> / <kbd>Space</kbd> toggles the section, <kbd>Tab</kbd> moves between headers, and in a group <kbd>↑</kbd> / <kbd>↓</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> move between headers.</li><li>When a single group cannot collapse, the open header is <code>aria-disabled</code>.</li><li>Trigger meets the AA 4.5:1 text contrast and shows a focus ring on <code>:focus-visible</code>.</li><li>Animations honor <code>prefers-reduced-motion: reduce</code>.</li></ul>}
    />
  );
}
