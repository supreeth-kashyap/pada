import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Heading } from '../../../components/Text';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function HeadingDemo() {
  return (
    <DemoPage
      title="Heading"
      kind="Component"
      purpose={<p>Heading titles a page or a section on the type scale. It renders a real <code>h1</code>–<code>h6</code>, so the document outline stays correct.</p>}
      design={
        <>
          <p>Each level has a default size (h1 3xl down to h6 sm). Use <code>size</code> when the look and the outline differ, and <code>weight</code> for emphasis.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <Heading level={1}>Billing</Heading>
            <Heading level={2}>Plan</Heading>
            <Heading level={3}>Payment method</Heading>
            <Heading level={4}>Invoices</Heading>
            <Heading level={2} size="lg" weight="700">A level-2 heading at lg</Heading>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Heading } from 'pada-ds';

<Heading level={1}>Billing</Heading>
<Heading level={3} size="lg">Payment method</Heading>   // h3, sized lg
<Heading level={2} weight="500">Members</Heading>`}
          language="tsx"
          label="Heading usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Native heading elements carry the heading role and level; nothing else is needed.</li>
          <li>Pick the level from the outline, not from the size you want: change the size with <code>size</code>.</li>
          <li>Sizes come from tokens, so they follow the type scale and density.</li>
        </ul>
      }
    />
  );
}
