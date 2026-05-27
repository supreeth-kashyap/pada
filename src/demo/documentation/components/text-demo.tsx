import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Text } from '../../../components/Text';

export default function TextDemo() {
  return (
    <DemoPage
      title="Text"
      kind="Component"
      purpose={<p>Text is the canonical typography primitive for rendering headings, body copy, and helper text. Use it instead of bare <code>&lt;p&gt;</code>/<code>&lt;span&gt;</code> when you need design-system-aligned size, weight, line-height, and color in one prop.</p>}
      design={<><p>Text supports the full type scale, four weights, three families, configurable line-heights, and renders as any HTML element via <code>as</code>. It inherits color from <code>currentColor</code> by default.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><Text as="h1" size="2xl" weight="700">Heading 2xl bold</Text><Text size="lg">Body large</Text><Text size="base">Body base — the quick brown fox jumps over the lazy dog.</Text><Text size="sm" color="var(--color-stone-500)">Caption small / secondary</Text></div></>}
      developer={<><p>Import the <code>Text</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Text } from 'pada-ds';

export function PageTitle() {
  return <Text as="h1" size="2xl" weight="700">Welcome</Text>;
}`} language="tsx" label="Text usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Always render headings (<code>h1</code>–<code>h6</code>) via the <code>as</code> prop; do not rely on size alone for hierarchy.</li><li>Default body size and color clear AA contrast on white surfaces.</li><li>Avoid disabling line-height; readable line-height is essential for users with cognitive disabilities.</li></ul>}
    />
  );
}
