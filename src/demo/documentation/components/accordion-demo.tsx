import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Accordion } from '../../../components/Accordion';

export default function AccordionDemo() {
  return (
    <DemoPage
      title="Accordion"
      kind="Component"
      purpose={<p>Accordion lets users expand and collapse a section of content to manage information density on long pages. Use it for FAQs, settings panels, and grouped detail views where revealing every section at once would overwhelm the reader. Each section is independently controlled and progressively discloses content only when the user asks for it.</p>}
      design={<><p>An Accordion contains one or more items, each composed of an <code>AccordionHeader</code> (the always-visible trigger) and an <code>AccordionContent</code> (the disclosed body). Items can be expanded one at a time or independently.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}><Accordion header="What is Pada?" headerIconName="help_outline" defaultOpen>Pada is a singular React design system focused on dense product UIs.</Accordion><Accordion header="How do I install it?" headerIconName="download">Install via <code>npm install pada-ds</code>.</Accordion><Accordion header="No leading icon">When <code>headerIconName</code> is omitted the icon slot is hidden entirely — the label sits flush against the left padding.</Accordion></div></div></>}
      developer={<><p>Import the <code>Accordion</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Accordion } from 'pada-ds';

export function FAQ() {
  return (
    <Accordion
      header="Section title"
      headerIconName="help_outline"
      defaultOpen
    >
      Hidden body shown only when expanded. The right chevron swaps between
      \`keyboard_arrow_down\` (collapsed) and \`keyboard_arrow_up\` (expanded).
    </Accordion>
  );
}`} language="tsx" label="Accordion usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Headers expose <code>aria-expanded</code> and <code>aria-controls</code> linking to the panel.</li><li>Keyboard support: <kbd>Enter</kbd> / <kbd>Space</kbd> toggles the section, <kbd>Tab</kbd> moves between headers.</li><li>Trigger meets the AA 4.5:1 text contrast and shows a focus ring on <code>:focus-visible</code>.</li><li>Animations honor <code>prefers-reduced-motion: reduce</code>.</li></ul>}
    />
  );
}
