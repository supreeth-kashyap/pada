import { useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Accordion,
  Badge,
  Button,
  Calendar,
  CommandPalette,
  DataTable,
  Kbd,
  Skeleton,
  Tabs,
  toast,
  type Command,
  type DataTableColumn,
} from 'pada-ds';
import { ClientOnly } from '../shell/ClientOnly';
import { ArrowRight } from '../shell/icons';
import { componentsByCategory, currentComponents } from '../lib/docs';
import { ROUTES } from '../lib/paths';

interface Member {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

const MEMBERS: Member[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Owner', status: 'Active' },
  { id: '2', name: 'Grace Hopper', role: 'Admin', status: 'Active' },
  { id: '3', name: 'Alan Turing', role: 'Editor', status: 'Invited' },
  { id: '4', name: 'Radia Perlman', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Ken Thompson', role: 'Viewer', status: 'Suspended' },
];

const TONE = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;

const COLUMNS: DataTableColumn<Member>[] = [
  { id: 'name', header: 'Name', rowHeader: true, hideable: false },
  { id: 'role', header: 'Role' },
  { id: 'status', header: 'Status', cell: (row) => <Badge tone={TONE[row.status]}>{row.status}</Badge> },
];

function Tile({ name, slug, className, children }: { name: string; slug: string; className?: string; children: ReactNode }) {
  return (
    <article className={['gallery-tile', className].filter(Boolean).join(' ')} data-reveal>
      <header>
        <h3>{name}</h3>
        <RouterLink to={ROUTES.component(slug)} className="gallery-link" aria-label={`${name} docs`}>
          Docs <ArrowRight size={13} />
        </RouterLink>
      </header>
      <div className="gallery-body">{children}</div>
    </article>
  );
}

function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const commands: Command[] = [
    { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: () => toast.success({ title: 'Project created' }) },
    { id: 'invite', label: 'Invite teammates', group: 'Team', icon: 'user_add', onSelect: () => toast.info({ title: 'Invite link copied' }) },
    { id: 'docs', label: 'Open documentation', group: 'Help', icon: 'document', onSelect: () => undefined },
    { id: 'settings', label: 'Workspace settings', group: 'Workspace', icon: 'cog', keywords: ['preferences'], onSelect: () => undefined },
  ];
  return (
    <div className="gallery-center">
      <Button variant="secondary" leftIcon="search" onClick={() => setOpen(true)}>
        Search commands…
      </Button>
      <span className="muted small">
        A real dialog with fuzzy search. Try <Kbd keys={['↑', '↓']} /> and <Kbd keys={['↵']} />
      </span>
      <CommandPalette commands={commands} open={open} onOpenChange={setOpen} hotkey={false} placeholder="Type a command…" />
    </div>
  );
}

export function Gallery() {
  return (
    <section className="section gallery" id="components" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Components</p>
          <h2 id="gallery-title" className="h2">
            {currentComponents.length} components. <span className="serif">All of them real.</span>
          </h2>
          <p className="lede">
            Everything on this page is Pada rendering live: open the dialogs, sort the table and tab through the
            calendar. Each component has docs, a React story and an Angular story.
          </p>
        </div>

        <div className="gallery-grid">
          <Tile name="DataTable" slug="data-table" className="span-2">
            <DataTable<Member> label="Team members" data={MEMBERS} columns={COLUMNS} selectable defaultPageSize={5} />
          </Tile>
          <Tile name="Calendar" slug="calendar">
            <ClientOnly fallback={<Skeleton shape="rect" height={280} />}>
              {() => <Calendar aria-label="Pick a date" />}
            </ClientOnly>
          </Tile>
          <Tile name="CommandPalette" slug="command-palette">
            <PaletteDemo />
          </Tile>
          <Tile name="Toaster" slug="toaster">
            <div className="gallery-center">
              <div className="gallery-row">
                <Button variant="secondary" onClick={() => toast.success({ title: 'Changes saved', description: 'Your profile is up to date.' })}>
                  Success
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.danger({ title: 'Upload failed', description: 'Check your connection.', action: { label: 'Retry', onClick: () => undefined } })}
                >
                  Error
                </Button>
              </div>
              <span className="muted small">Stacks, swipes away, and pauses on hover.</span>
            </div>
          </Tile>
          <Tile name="Tabs & Accordion" slug="tabs">
            <Tabs.Root defaultValue="overview">
              <Tabs.List aria-label="Project">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity" notification>Activity</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="overview">
                <Accordion.Root type="single" collapsible defaultValue="goals">
                  <Accordion.Item value="goals">
                    <Accordion.Trigger>Quarterly goals</Accordion.Trigger>
                    <Accordion.Content>Ship the redesign and reach 99.9% uptime.</Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item value="team">
                    <Accordion.Trigger>Team</Accordion.Trigger>
                    <Accordion.Content>Four engineers, one designer.</Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </Tabs.Content>
              <Tabs.Content value="activity">Three new comments since your last visit.</Tabs.Content>
              <Tabs.Content value="settings">Permissions and retention.</Tabs.Content>
            </Tabs.Root>
          </Tile>
        </div>

        <ul className="category-chips" aria-label="Component categories" data-reveal>
          {componentsByCategory
            .filter((group) => group.category !== 'Legacy')
            .map((group) => (
              <li key={group.category}>
                <RouterLink to={`${ROUTES.components}#${group.category.toLowerCase()}`}>
                  {group.category} <span>{group.items.length}</span>
                </RouterLink>
              </li>
            ))}
        </ul>
        <div className="center-row" data-reveal>
          <RouterLink className="cta" data-variant="ink" to={ROUTES.components}>
            Browse all components <ArrowRight />
          </RouterLink>
        </div>
      </div>
    </section>
  );
}
