import { CodeSnippet, Tabs } from 'pada-ds';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';

const REACT_CODE = `import { Dialog } from 'pada-ds/headless';

<Dialog.Root>
  <Dialog.Trigger className="my-button">Edit profile</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="my-overlay" />
    <Dialog.Content className="my-dialog">
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Close className="my-button">Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`;

const ANGULAR_CODE = `import { Component, signal } from '@angular/core';
import { DsDialog, DsDialogClose, DsDialogContent, DsDialogTitle, DsDialogTrigger, DsPresence } from 'pada-ds-angular/headless';

@Component({
  imports: [DsDialog, DsDialogTrigger, DsDialogContent, DsDialogTitle, DsDialogClose, DsPresence],
  template: \`
    <ng-container dsDialog [(open)]="open">
      <button class="my-button" dsDialogTrigger>Edit profile</button>
      <dialog *dsPresence="open()" dsDialogContent class="my-dialog">
        <h2 dsDialogTitle>Edit profile</h2>
        <button class="my-button" dsDialogClose>Done</button>
      </dialog>
    </ng-container>
  \`,
})
export class EditProfile {
  open = signal(false);
}`;

const CSS = `.my-dialog[data-state='open'] { opacity: 1; }
.my-dialog[data-state='closed'] { opacity: 0; }
.my-button[aria-expanded='true'] { background: var(--pada-color-accent-subtle); }
.my-menu-item[data-highlighted] { background: var(--pada-color-neutral-subtle); }`;

export function Headless() {
  return (
    <DocsLayout toc={[{ id: 'what', label: 'What you get' }, { id: 'usage', label: 'Usage' }, { id: 'styling', label: 'Styling state' }, { id: 'parts', label: 'Available parts' }]}>
      <article className="doc">
        <DocHeader
          eyebrow="Guides"
          title="Headless"
          lede="Every Pada component is a headless core with a styled layer on top. Use the core alone when you want Pada's behaviour with a look that is entirely your own."
        />
        <DocSection id="what" title="What you get">
          <ul className="doc-list">
            <li>State, keyboard handling, focus management and positioning.</li>
            <li>The right roles and <code>aria-*</code> attributes for each WAI-ARIA pattern.</li>
            <li>State as attributes: <code>data-state</code>, <code>data-side</code>, <code>data-disabled</code>, <code>data-highlighted</code>.</li>
            <li>No styles at all. In React, <code>asChild</code> merges a part onto your own element.</li>
          </ul>
        </DocSection>
        <DocSection id="usage" title="Usage">
          <Tabs.Root variant="pills" defaultValue="react">
            <Tabs.List aria-label="Framework">
              <Tabs.Trigger value="react">React</Tabs.Trigger>
              <Tabs.Trigger value="angular">Angular</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="react">
              <CodeSnippet code={REACT_CODE} language="tsx" type="multi-line" label="pada-ds/headless" />
            </Tabs.Content>
            <Tabs.Content value="angular">
              <CodeSnippet code={ANGULAR_CODE} language="typescript" type="multi-line" label="pada-ds-angular/headless" />
              <p>Angular's headless layer is a set of directives with signal inputs and <code>model()</code> two-way state.</p>
            </Tabs.Content>
          </Tabs.Root>
        </DocSection>
        <DocSection id="styling" title="Styling state">
          <p>Style the attributes the parts expose, not class names you toggle. The styled layer does exactly this.</p>
          <CodeSnippet code={CSS} language="css" type="multi-line" label="styles.css" />
        </DocSection>
        <DocSection id="parts" title="Available parts">
          <p>
            Accordion, Calendar, Collapsible, Combobox, DataTable (<code>useDataTable</code>), Dialog (the base of AlertDialog, Drawer and Sheet), Field,
            HoverCard, Menu (DropdownMenu, ContextMenu, Menubar), NumberInput, PinInput, Popover, Resizable, Slider, Tabs, TimeField,
            Toggle and ToggleGroup, Tooltip and Tree, plus <code>Slot</code>, <code>Portal</code> and <code>VisuallyHidden</code>. Angular
            adds directives for the rest of its components.
          </p>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
