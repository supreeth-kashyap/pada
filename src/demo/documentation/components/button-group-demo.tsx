import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Button } from '../../../components/Button';
import { ButtonGroup } from '../../../components/ButtonGroup';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function ButtonGroupDemo() {
  return (
    <DemoPage
      title="Button Group"
      kind="Component"
      purpose={<p>Button Group gathers related actions into one named row or column, so they read as a set. Buttons inside take the group’s size and variant unless they set their own.</p>}
      design={
        <>
          <p>Spaced by default; <code>attached</code> joins the buttons into one segmented control with shared borders and outer corners only. Lay them out in a row or a column.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <ButtonGroup label="Record actions" variant="secondary">
              <Button leftIcon="edit">Edit</Button>
              <Button leftIcon="copy">Duplicate</Button>
              <Button variant="destructive">Delete</Button>
            </ButtonGroup>
            <ButtonGroup label="Text alignment" variant="secondary" size="sm" attached>
              <Button>Left</Button>
              <Button>Center</Button>
              <Button>Right</Button>
            </ButtonGroup>
            <ButtonGroup label="Export" orientation="vertical" variant="ghost" size="sm">
              <Button>Export as CSV</Button>
              <Button>Export as PDF</Button>
            </ButtonGroup>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Button, ButtonGroup } from 'pada-ds';

<ButtonGroup label="Text alignment" variant="secondary" size="sm" attached>
  <Button>Left</Button>
  <Button>Center</Button>
  <Button variant="primary">Right</Button>   // a button's own variant wins
</ButtonGroup>`}
          language="tsx"
          label="Button Group usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Renders <code>role="group"</code> named by <code>label</code>; vertical groups set <code>aria-orientation</code>.</li>
          <li>Every button keeps its own tab stop: a group of actions is not a toolbar.</li>
          <li>For one tab stop with arrow keys, or pressed states, use Toggle Group instead.</li>
        </ul>
      }
    />
  );
}
