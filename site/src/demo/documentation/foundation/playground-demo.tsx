import { useState, type ReactNode } from 'react';
import {
  Alert,
  AlertDialog,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  CommandPalette,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  Field,
  IconButton,
  Kbd,
  Link,
  Pagination,
  Popover,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  Tabs,
  ThemeProvider,
  ThemeToggle,
  Toaster,
  Toggle,
  ToggleGroup,
  Tooltip,
  toast,
  useTheme,
  type ThemeMode,
} from '@pada/index';
import DemoPage from '../DemoPage';
import './playground-demo.css';

const PEOPLE = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform' },
  { value: 'alan', label: 'Alan Turing', description: 'Research' },
  { value: 'edsger', label: 'Edsger Dijkstra', description: 'Research' },
];

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="playground-panel" aria-label={title}>
      <h3 className="playground-panel-title">{title}</h3>
      {children}
    </section>
  );
}

export default function PlaygroundDemo() {
  // Starts from the demo shell's theme; the controls below then override it for this page.
  const shell = useTheme();
  const [theme, setTheme] = useState<ThemeMode>(shell.resolvedTheme);
  const [accent, setAccent] = useState('indigo');
  const [hue, setHue] = useState(277);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [radius, setRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [page, setPage] = useState(4);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);

  return (
    <DemoPage title="Playground" kind="Foundation">
      <p className="playground-intro">
        Every component below is drawn from the same five knobs. Change the theme, accent, density or radius and watch the whole
        set follow: no component CSS changes.
      </p>

      <div className="playground-controls">
        <div className="playground-control">
          <span>Theme</span>
          <ToggleGroup.Root type="single" value={theme} onValueChange={(value) => value && setTheme(value as ThemeMode)} aria-label="Theme" size="sm">
            <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
            <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="playground-control">
          <span>Accent</span>
          <ToggleGroup.Root type="single" value={accent} onValueChange={(value) => value && setAccent(value)} aria-label="Accent" size="sm">
            {['indigo', 'violet', 'emerald', 'amber', 'rose', 'custom'].map((name) => (
              <ToggleGroup.Item key={name} value={name}>
                {name}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
        {accent === 'custom' && (
          <label className="playground-control">
            Hue {hue}°
            <input type="range" min={0} max={360} value={hue} onChange={(event) => setHue(Number(event.target.value))} />
          </label>
        )}
        <div className="playground-control">
          <span>Density</span>
          <ToggleGroup.Root type="single" value={density} onValueChange={(value) => value && setDensity(value as typeof density)} aria-label="Density" size="sm">
            <ToggleGroup.Item value="compact">Compact</ToggleGroup.Item>
            <ToggleGroup.Item value="comfortable">Comfortable</ToggleGroup.Item>
            <ToggleGroup.Item value="spacious">Spacious</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="playground-control">
          <span>Radius</span>
          <ToggleGroup.Root type="single" value={radius} onValueChange={(value) => value && setRadius(value as typeof radius)} aria-label="Radius" size="sm">
            {['none', 'sm', 'md', 'lg', 'xl'].map((name) => (
              <ToggleGroup.Item key={name} value={name}>
                {name}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      </div>

      <ThemeProvider theme={theme} onThemeChange={setTheme} accent={accent} accentHue={hue} density={density} radius={radius}>
        <div className="playground-surface">
          <div className="playground-grid">
            <Panel title="Actions">
              <Stack direction="row" gap={2} wrap align="center">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button loading>Saving</Button>
                <Button size="sm" variant="secondary">
                  Small
                </Button>
                <IconButton icon="edit_1" label="Edit" tooltip />
                <Toggle icon="bell_ring">Notify</Toggle>
                <ThemeToggle />
              </Stack>
            </Panel>

            <Panel title="Status">
              <Stack gap={3}>
                <Stack direction="row" gap={2} wrap align="center">
                  <Badge>Neutral</Badge>
                  <Badge tone="accent">Beta</Badge>
                  <Badge tone="success" dot>
                    Live
                  </Badge>
                  <Badge tone="warning">Pending</Badge>
                  <Badge tone="danger" variant="solid" count={128} />
                  <Spinner size="sm" />
                </Stack>
                <Stack direction="row" gap={3} align="center">
                  <AvatarGroup label="Team" max={3}>
                    {PEOPLE.map((person) => (
                      <Avatar key={person.value} name={person.label} />
                    ))}
                  </AvatarGroup>
                  <Avatar name="Grace Hopper" size="lg" status="online" />
                  <Avatar name="Acme Inc" shape="square" />
                </Stack>
              </Stack>
            </Panel>

            <Panel title="Forms">
              <Stack gap={3}>
                <Field.Root invalid={emailError} required>
                  <Field.Label>Email</Field.Label>
                  <Field.Control type="email" placeholder="you@example.com" onBlur={(event) => setEmailError(!event.currentTarget.value.includes('@'))} />
                  <Field.Description>We never share it.</Field.Description>
                  <Field.Error>Enter a valid email address.</Field.Error>
                </Field.Root>
                <Autocomplete label="Reviewers" options={PEOPLE} multiple defaultValue={['ada']} placeholder="Add a reviewer" />
              </Stack>
            </Panel>

            <Panel title="Navigation">
              <Stack gap={4}>
                <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Pada', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Members' }]} maxItems={4} />
                <Tabs.Root defaultValue="overview" variant="pills">
                  <Tabs.List aria-label="Project">
                    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                    <Tabs.Trigger value="activity" notification>
                      Activity
                    </Tabs.Trigger>
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>
                <Pagination page={page} totalPages={12} onPageChange={setPage} />
              </Stack>
            </Panel>

            <Panel title="Overlays">
              <Stack direction="row" gap={2} wrap>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <Button variant="secondary">Dialog</Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Edit profile</Dialog.Title>
                      <Dialog.Description>Changes save automatically.</Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Field.Control defaultValue="Ada Lovelace" />
                      </Field.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.Close asChild>
                        <Button variant="secondary">Cancel</Button>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <Button>Save</Button>
                      </Dialog.Close>
                    </Dialog.Footer>
                    <Dialog.CloseButton />
                  </Dialog.Content>
                </Dialog.Root>

                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <Button variant="destructive">Alert dialog</Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title>Delete this project?</AlertDialog.Title>
                      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                      <AlertDialog.Action variant="destructive" onClick={() => toast.danger({ title: 'Project deleted' })}>
                        Delete
                      </AlertDialog.Action>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>

                <Drawer.Root>
                  <Drawer.Trigger asChild>
                    <Button variant="secondary">Drawer</Button>
                  </Drawer.Trigger>
                  <Drawer.Content side="right">
                    <Drawer.Header>
                      <Drawer.Title>Filters</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <Skeleton lines={4} />
                    </Drawer.Body>
                    <Drawer.CloseButton />
                  </Drawer.Content>
                </Drawer.Root>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="secondary" rightIcon="chevron_down">
                      Menu
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>Project</DropdownMenu.Label>
                    <DropdownMenu.Item icon="edit_1" shortcut="⌘E">
                      Rename
                    </DropdownMenu.Item>
                    <DropdownMenu.CheckboxItem checked>Pinned</DropdownMenu.CheckboxItem>
                    <DropdownMenu.Sub>
                      <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
                      <DropdownMenu.SubContent>
                        <DropdownMenu.Item>Archive</DropdownMenu.Item>
                        <DropdownMenu.Item>Trash</DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item tone="danger">Delete</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Popover.Root>
                  <Popover.Trigger asChild>
                    <Button variant="secondary">Popover</Button>
                  </Popover.Trigger>
                  <Popover.Content>
                    <Popover.Title>Share</Popover.Title>
                    Anyone with the link can view.
                    <Popover.CloseButton />
                    <Popover.Arrow />
                  </Popover.Content>
                </Popover.Root>

                <Tooltip content="Copies a link to this page">
                  <Button variant="ghost">Tooltip</Button>
                </Tooltip>

                <Button variant="secondary" onClick={() => toast.success({ title: 'Invite sent', description: 'ada@example.com', action: { label: 'Undo', onClick: () => toast('Invite cancelled') } })}>
                  Toast
                </Button>

                <Button variant="secondary" onClick={() => setPaletteOpen(true)}>
                  Command palette <Kbd keys={['⌘', 'K']} />
                </Button>
              </Stack>
            </Panel>

            <Panel title="Feedback">
              <Stack gap={3}>
                <Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>}>
                  Add a payment method to keep your projects.
                </Alert>
                <Separator />
                <EmptyState size="sm" media="empty" title="No projects yet" description="Create a project to get started." actions={<Button size="sm">New project</Button>} />
                <p className="playground-text">
                  Read the <Link href="#">migration guide</Link> or the <Link href="https://github.com/supreeth-kashyap/pada" external>source</Link>.
                </p>
              </Stack>
            </Panel>
          </div>
        </div>
        <Toaster />
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          commands={[
            { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: () => toast('New project') },
            { id: 'dark', label: 'Switch to dark theme', group: 'Appearance', keywords: ['theme'], onSelect: () => setTheme('dark') },
            { id: 'light', label: 'Switch to light theme', group: 'Appearance', keywords: ['theme'], onSelect: () => setTheme('light') },
            { id: 'compact', label: 'Compact density', group: 'Appearance', onSelect: () => setDensity('compact') },
          ]}
        />
      </ThemeProvider>
    </DemoPage>
  );
}
