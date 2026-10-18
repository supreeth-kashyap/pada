import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Sheet } from '../../../components/Sheet';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Avatar } from '../../../components/Avatar';
import { Stack } from '../../../components/Stack';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const PEOPLE = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Edsger Dijkstra', 'Barbara Liskov', 'Margaret Hamilton', 'Katherine Johnson', 'Donald Knuth'];

export default function SheetDemo() {
  return (
    <DemoPage
      title="Sheet"
      kind="Component"
      purpose={<p>Sheet rises from the bottom edge for short, mobile-first tasks: sharing, filters, quick actions, details of a map pin. People can drag it down to close or between heights. On larger screens it stays centred and capped in width; for side panels on desktop, use Drawer.</p>}
      design={
        <>
          <p>A rounded panel with a grabber. It fits its content, or rests at <code>snapPoints</code> (fractions of the viewport height). Dragging follows the pointer; releasing settles with the emphasized easing, and a quick flick down closes it.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Sheet.Root>
              <Sheet.Trigger asChild>
                <Button>Share</Button>
              </Sheet.Trigger>
              <Sheet.Content>
                <Sheet.Header>
                  <Sheet.Title>Share “Website redesign”</Sheet.Title>
                  <Sheet.Description>People you add can view and comment.</Sheet.Description>
                </Sheet.Header>
                <Sheet.Body>
                  <Stack direction="row" gap={3} wrap>
                    {PEOPLE.slice(0, 4).map((name) => (
                      <Stack key={name} gap={1} align="center" style={{ width: 72, textAlign: 'center', fontSize: 'var(--pada-font-size-sm)' }}>
                        <Avatar name={name} size="lg" />
                        {name.split(' ')[0]}
                      </Stack>
                    ))}
                  </Stack>
                </Sheet.Body>
                <Sheet.Footer>
                  <Sheet.Close asChild>
                    <Button variant="secondary">Copy link</Button>
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>

            <Sheet.Root>
              <Sheet.Trigger asChild>
                <Button variant="secondary">Filters (snap points)</Button>
              </Sheet.Trigger>
              <Sheet.Content snapPoints={[0.45, 0.9]}>
                <Sheet.Header>
                  <Sheet.Title>Filters</Sheet.Title>
                  <Sheet.Description>Drag up for more, or down to close.</Sheet.Description>
                </Sheet.Header>
                <Sheet.Body>
                  <Stack gap={2}>
                    {PEOPLE.map((name) => (
                      <Checkbox key={name} label={`Assigned to ${name}`} />
                    ))}
                  </Stack>
                </Sheet.Body>
                <Sheet.Footer justify="between">
                  <Sheet.Close asChild>
                    <Button variant="ghost">Reset</Button>
                  </Sheet.Close>
                  <Sheet.Close asChild>
                    <Button>Show 24 results</Button>
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Sheet, Button } from 'pada-ds';

<Sheet.Root>
  <Sheet.Trigger asChild><Button>Filters</Button></Sheet.Trigger>
  <Sheet.Content snapPoints={[0.45, 0.9]} onSnapChange={setSnap}>
    <Sheet.Header>
      <Sheet.Title>Filters</Sheet.Title>
    </Sheet.Header>
    <Sheet.Body>…</Sheet.Body>
    <Sheet.Footer>…</Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

// Keep it open until the user picks something
<Sheet.Content dismissible={false} snapPoints={[0.3, 0.8]}>…</Sheet.Content>`}
          language="tsx"
          label="Sheet usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A sheet is a modal dialog: named by its Title, focus moves in and stays inside, Escape and the backdrop close it, and focus returns to the trigger.</li>
          <li>Dragging is never the only way: with snap points the grabber is a button (“Expand sheet” / “Collapse sheet”) that moves between heights, and Escape always closes.</li>
          <li>Drags never start on inputs, buttons or links, or inside content that is scrolled, so controls and scrolling keep working.</li>
          <li>Under reduced motion the sheet appears and settles without sliding.</li>
        </ul>
      }
    />
  );
}
