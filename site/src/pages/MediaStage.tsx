import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  CommandPalette,
  DataTable,
  DateRangePicker,
  Dialog,
  InputText,
  Kbd,
  toast,
  type Command,
  type DataTableColumn,
} from 'pada-ds';

/**
 * Clean stages for the screen recordings made by scripts/capture-media.mjs: one component,
 * centred on the site's ground. Not linked or prerendered.
 */

interface Member {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

const MEMBERS: Member[] = [
  ['Ada Lovelace', 'Owner', 'Active', '2026-10-20'],
  ['Grace Hopper', 'Admin', 'Active', '2026-10-19'],
  ['Alan Turing', 'Editor', 'Invited', '2026-10-12'],
  ['Katherine Johnson', 'Editor', 'Active', '2026-10-18'],
  ['Radia Perlman', 'Viewer', 'Active', '2026-10-15'],
  ['Ken Thompson', 'Viewer', 'Suspended', '2026-09-30'],
].map(([name, role, status, lastActive], i) => ({ id: String(i + 1), name, role, status: status as Member['status'], lastActive }));

const TONE = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;
const COLUMNS: DataTableColumn<Member>[] = [
  { id: 'name', header: 'Name', rowHeader: true, hideable: false },
  { id: 'role', header: 'Role' },
  { id: 'status', header: 'Status', cell: (row) => <Badge tone={TONE[row.status]}>{row.status}</Badge> },
  { id: 'lastActive', header: 'Last active', searchable: false },
];

function DialogStage() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="lg" leftIcon="edit_1">Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>Your name and photo are visible to your team.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <InputText label="Name" defaultValue="Ada Lovelace" />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>Save changes</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function PaletteStage() {
  const [open, setOpen] = useState(false);
  const commands: Command[] = [
    { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: () => toast.success({ title: 'Project created' }) },
    { id: 'open', label: 'Open project…', group: 'Projects', icon: 'folder', shortcut: ['⌘', 'O'], onSelect: () => undefined },
    { id: 'invite', label: 'Invite teammates', group: 'Team', icon: 'user_add', onSelect: () => toast.success({ title: 'Invite sent', description: 'grace@example.com' }) },
    { id: 'members', label: 'Manage members', group: 'Team', icon: 'team', onSelect: () => undefined },
    { id: 'prefs', label: 'Preferences', group: 'App', icon: 'cog', keywords: ['settings'], onSelect: () => undefined },
  ];
  return (
    <div className="stage-col">
      <Button variant="secondary" size="lg" leftIcon="search" onClick={() => setOpen(true)}>
        Search commands…&ensp;<Kbd keys={['⌘', 'K']} />
      </Button>
      <CommandPalette commands={commands} open={open} onOpenChange={setOpen} placeholder="Type a command or search…" />
    </div>
  );
}

function ToastStage() {
  return (
    <div className="stage-row">
      <Button variant="secondary" size="lg" onClick={() => toast.success({ title: 'Changes saved', description: 'Your profile is up to date.' })}>
        Save
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => toast.danger({ title: 'Upload failed', description: 'Check your connection and try again.', action: { label: 'Retry', onClick: () => undefined } })}
      >
        Upload
      </Button>
      <Button variant="secondary" size="lg" onClick={() => toast.info({ title: 'Export started', description: 'We will email you when it is ready.' })}>
        Export
      </Button>
    </div>
  );
}

function TableStage() {
  return (
    <div className="stage-wide">
      <DataTable<Member> label="Team members" data={MEMBERS} columns={COLUMNS} selectable defaultPageSize={6} />
    </div>
  );
}

function RangeStage() {
  return (
    <div className="stage-top">
      <DateRangePicker label="Report period" weekStartsOn={1} today={new Date(2026, 9, 20)} />
    </div>
  );
}

const STAGES: Record<string, () => React.ReactNode> = {
  dialog: DialogStage,
  'command-palette': PaletteStage,
  toaster: ToastStage,
  'data-table': TableStage,
  'date-range-picker': RangeStage,
};

export function MediaStage() {
  const { scene = '' } = useParams();
  const Stage = STAGES[scene];
  return (
    <main id="main" className="media-stage dot-ground">
      <div className="hero-glow" aria-hidden="true" />
      {Stage ? <Stage /> : <p>Unknown scene</p>}
    </main>
  );
}
