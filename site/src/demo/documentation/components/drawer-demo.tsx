import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Drawer, type DrawerSide } from '@pada/components/Drawer';
import { Button } from '@pada/components/Button';
import { Checkbox } from '@pada/components/Checkbox';
import { Stack } from '@pada/components/Stack';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const SIDES: DrawerSide[] = ['right', 'left', 'top', 'bottom'];

export default function DrawerDemo() {
  return (
    <DemoPage
      title="Drawer"
      kind="Component"
      purpose={<p>Drawer slides a panel in from an edge for work that relates to the page behind it: filters, a record’s details, settings, a mobile navigation menu. People keep their place on the page. For a short, focused task, use Dialog.</p>}
      design={
        <>
          <p>Drawers open from any edge in four sizes and share the Dialog parts: header, scrolling body and footer.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SIDES.map((side) => (
              <Drawer.Root key={side}>
                <Drawer.Trigger asChild>
                  <Button variant={side === 'right' ? 'primary' : 'secondary'}>From {side}</Button>
                </Drawer.Trigger>
                <Drawer.Content side={side} size="sm">
                  <Drawer.Header>
                    <Drawer.Title>Filters</Drawer.Title>
                    <Drawer.Description>Narrow the list of projects.</Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Body>
                    <Stack gap={2}>
                      <Checkbox label="Active" defaultChecked />
                      <Checkbox label="Archived" />
                      <Checkbox label="Shared with me" defaultChecked />
                    </Stack>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.Close asChild>
                      <Button variant="secondary">Reset</Button>
                    </Drawer.Close>
                    <Drawer.Close asChild>
                      <Button>Apply</Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                  <Drawer.CloseButton />
                </Drawer.Content>
              </Drawer.Root>
            ))}
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Drawer, Button } from 'pada-ds';

<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button>Filters</Button>
  </Drawer.Trigger>
  <Drawer.Content side="right" size="sm">
    <Drawer.Header>
      <Drawer.Title>Filters</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>…</Drawer.Body>
    <Drawer.Footer>…</Drawer.Footer>
    <Drawer.CloseButton />
  </Drawer.Content>
</Drawer.Root>`}
          language="tsx"
          label="Drawer usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A drawer is a modal dialog: named by its Title, focus is trapped inside and returns to the trigger on close.</li>
          <li>Escape and a click on the backdrop close it.</li>
          <li>The slide is replaced by a fade under reduced motion.</li>
          <li><code>SideDrawer</code> from 1.x still works and now wraps Drawer.</li>
        </ul>
      }
    />
  );
}
