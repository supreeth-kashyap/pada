import { useState, type KeyboardEvent } from 'react';
import { Button, DropdownMenu, Slider, Switch, ToggleGroup } from 'pada-ds';
import { Check } from '../shell/icons';

const KEY_NAMES: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↵',
  Escape: 'Esc',
  Tab: 'Tab',
  Home: 'Home',
  End: 'End',
};

const PROMISES = [
  'Every interactive component follows its WAI-ARIA Authoring Practices pattern',
  'Keyboard maps tested for each component, in both frameworks',
  'axe checks run on every story and every component test',
  'Focus is trapped, restored and visible, never lost',
  'Respects reduced motion and increased contrast',
  'State exposed as aria-* and data-* attributes, never classes',
];

export function AccessibilitySection() {
  const [keys, setKeys] = useState<{ id: number; key: string }[]>([]);
  const onKeyDown = (event: KeyboardEvent) => {
    const key = KEY_NAMES[event.key] ?? (event.key.length === 1 ? event.key.toUpperCase() : null);
    if (!key) return;
    const label = event.shiftKey && key === 'Tab' ? '⇧ Tab' : key;
    setKeys((list) => [...list.slice(-5), { id: Date.now() + Math.random(), key: label }]);
  };

  return (
    <section className="section a11y" id="accessibility" aria-labelledby="a11y-title">
      <div className="wrap a11y-grid">
        <div data-reveal>
          <p className="eyebrow">Accessibility</p>
          <h2 id="a11y-title" className="h2">
            Accessible by default, <span className="serif">not by checklist.</span>
          </h2>
          <p className="lede">
            Accessibility is in the headless layer, so it ships with every component and survives your restyling.
          </p>
          <ul className="check-list a11y-list">
            {PROMISES.map((promise) => (
              <li key={promise}>
                <Check size={16} />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <div className="a11y-demo" data-reveal style={{ ['--reveal-delay' as string]: '0.1s' }}>
          <div className="a11y-demo-head">
            <strong>Try it with the keyboard</strong>
            <span className="muted small">Tab into the panel, then use the arrows, Space, Enter and Esc.</span>
          </div>
          <div className="a11y-demo-body" onKeyDown={onKeyDown}>
            <ToggleGroup.Root type="single" defaultValue="board" aria-label="View">
              <ToggleGroup.Item value="list" icon="menu_2">List</ToggleGroup.Item>
              <ToggleGroup.Item value="board" icon="dashboard">Board</ToggleGroup.Item>
              <ToggleGroup.Item value="timeline" icon="time_1">Timeline</ToggleGroup.Item>
            </ToggleGroup.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" rightIcon="chevron_down">Sort by</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                <DropdownMenu.Label>Sort by</DropdownMenu.Label>
                <DropdownMenu.RadioGroup defaultValue="updated">
                  <DropdownMenu.RadioItem value="updated">Last updated</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="created">Date created</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Slider label="Zoom" min={50} max={200} step={10} defaultValue={100} showValue />
            <Switch label="Show archived" />
          </div>
          <div className="key-log" aria-live="off" aria-hidden="true">
            {keys.length === 0 ? <span className="muted small">Keys you press appear here</span> : null}
            {keys.map((k) => (
              <kbd key={k.id}>{k.key}</kbd>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
