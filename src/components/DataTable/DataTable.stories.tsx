import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone } from '../Badge';
import { Button } from '../Button';
import { DataTable, type DataTableColumn } from './DataTable';

interface Member {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

const tone: Record<Member['status'], BadgeTone> = { Active: 'success', Invited: 'info', Suspended: 'danger' };

const NAMES = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Margaret Hamilton', 'Linus Torvalds',
  'Barbara Liskov', 'Donald Knuth', 'Radia Perlman', 'Ken Thompson', 'Frances Allen', 'Tim Berners-Lee', 'Hedy Lamarr', 'Dennis Ritchie'];
const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const STATUSES: Member['status'][] = ['Active', 'Active', 'Invited', 'Suspended'];

const members: Member[] = NAMES.map((name, i) => ({
  id: String(i + 1),
  name,
  role: ROLES[i % ROLES.length],
  status: STATUSES[i % STATUSES.length],
  lastActive: `2026-10-${String(20 - i).padStart(2, '0')}`,
}));

const columns: DataTableColumn<Member>[] = [
  { id: 'name', header: 'Name', rowHeader: true, hideable: false },
  { id: 'role', header: 'Role', width: 110 },
  { id: 'status', header: 'Status', cell: (row) => <Badge tone={tone[row.status]}>{row.status}</Badge> },
  { id: 'lastActive', header: 'Last active', searchable: false },
];

const meta: Meta<typeof DataTable<Member>> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Team members', data: members, columns, defaultPageSize: 5 },
};

export default meta;
type Story = StoryObj<typeof DataTable<Member>>;

export const Default: Story = {};
export const Selectable: Story = {
  args: {
    selectable: true,
    actions: (selected: Member[]) => selected.length > 0 && <Button variant="destructive" size="sm">Remove {selected.length}</Button>,
  },
};
export const Sorted: Story = { args: { defaultSort: { columnId: 'lastActive', direction: 'descending' } } };
export const Empty: Story = { args: { data: [], emptyState: 'No members match your filters.' } };
