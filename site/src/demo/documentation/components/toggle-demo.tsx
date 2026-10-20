import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Toggle } from '@pada/components/Toggle';
import { ToggleGroup } from '@pada/components/ToggleGroup';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' } as const;

export default function ToggleDemo() {
  const [archived, setArchived] = useState(false);
  const [view, setView] = useState('list');
  const [formats, setFormats] = useState<string[]>(['bold']);
  return (
    <DemoPage
      title="Toggle & Toggle Group"
      kind="Component"
      purpose={
        <p>
          Toggle is a button that stays pressed (“Show archived”, “Notify me”). Toggle Group is a segmented row of toggles: <code>single</code> works like
          radio buttons that can be cleared (a list or grid view), <code>multiple</code> like a set of checkboxes (bold, italic, underline). For a setting that
          takes effect immediately, a Switch reads more clearly.
        </p>
      }
      design={
        <>
          <p>Pressed items take the accent tint. Three sizes match the button heights.</p>
          <div className="demo-page__showcase" style={row}>
            <Toggle icon="hidden" pressed={archived} onPressedChange={setArchived}>
              Show archived
            </Toggle>
            <Toggle icon="bell_ring" defaultPressed size="sm">
              Notify
            </Toggle>
            <Toggle icon="star" aria-label="Favourite" />
            <Toggle disabled>Disabled</Toggle>
          </div>
          <div className="demo-page__showcase" style={row}>
            <ToggleGroup.Root type="single" aria-label="View" value={view} onValueChange={(value) => value && setView(value)}>
              <ToggleGroup.Item value="list" icon="menu_2">
                List
              </ToggleGroup.Item>
              <ToggleGroup.Item value="grid" icon="dashboard">
                Grid
              </ToggleGroup.Item>
              <ToggleGroup.Item value="timeline" icon="time_1">
                Timeline
              </ToggleGroup.Item>
            </ToggleGroup.Root>
            <ToggleGroup.Root type="multiple" aria-label="Text formatting" size="sm" value={formats} onValueChange={setFormats}>
              <ToggleGroup.Item value="bold" aria-label="Bold">
                <strong>B</strong>
              </ToggleGroup.Item>
              <ToggleGroup.Item value="italic" aria-label="Italic">
                <em>I</em>
              </ToggleGroup.Item>
              <ToggleGroup.Item value="underline" aria-label="Underline">
                <u>U</u>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
            <ToggleGroup.Root type="single" aria-label="Alignment" orientation="vertical" defaultValue="left" size="sm">
              <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
              <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
              <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Toggle, ToggleGroup } from 'pada-ds';

<Toggle icon="hidden" pressed={showArchived} onPressedChange={setShowArchived}>
  Show archived
</Toggle>

<ToggleGroup.Root type="single" aria-label="View" value={view} onValueChange={(v) => v && setView(v)}>
  <ToggleGroup.Item value="list" icon="menu_2">List</ToggleGroup.Item>
  <ToggleGroup.Item value="grid" icon="dashboard">Grid</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root type="multiple" aria-label="Text formatting" value={formats} onValueChange={setFormats}>
  <ToggleGroup.Item value="bold" aria-label="Bold"><strong>B</strong></ToggleGroup.Item>
  …
</ToggleGroup.Root>`}
          language="tsx"
          label="Toggle usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Toggles are buttons with <code>aria-pressed</code>. Keep the label the same when pressed: screen readers announce the state, so “Show archived, pressed” reads correctly.</li>
          <li>A Toggle Group is one Tab stop with roving focus: arrow keys move along the orientation, Home and End jump to the ends, and Space or Enter presses.</li>
          <li>Name every group with <code>aria-label</code>, and give icon-only items their own <code>aria-label</code>.</li>
          <li>In a <code>single</code> group, pressing the pressed item clears the value. Ignore an empty value, as above, if one option must always be chosen.</li>
        </ul>
      }
    />
  );
}
