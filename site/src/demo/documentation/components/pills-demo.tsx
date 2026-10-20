import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Pills } from '@pada/components/Pills';

export default function PillsDemo() {
  return (
    <DemoPage
      title="Pills"
      kind="Component"
      purpose={<p>Pills provide a compact, single-select control for a small set of related options — e.g. filter scope, time range, or category toggle. Use them when a SegmentControl feels too rigid; switch to RadioGroup for forms or Tabs for view switching.</p>}
      design={<><p>Pills render a horizontal row of toggleable chips. Only one pill is selected at a time; the selected pill has a high-contrast surface.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Pills options={[{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }, { value: 'archived', label: 'Archived' }]} value="mine" onChange={() => {}} /></div></>}
      developer={<><p>Import the <code>Pills</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Pills } from 'pada-ds';

export function ScopeFilter() {
  return <Pills options={[{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }]} value="all" onChange={() => {}} />;
}`} language="tsx" label="Pills usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the radio pattern: the group has <code>role="radiogroup"</code> and each pill is <code>role="radio"</code> with <code>aria-checked</code>.</li><li>Keyboard support: <kbd>←/→</kbd> moves selection, <kbd>Tab</kbd> moves into and out of the group.</li><li>Selected and unselected states each clear AA contrast.</li></ul>}
    />
  );
}
