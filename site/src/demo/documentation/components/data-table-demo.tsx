import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { DataTable, type DataTableColumn } from '@pada/components/DataTable';
import { Avatar } from '@pada/components/Avatar';
import { Badge } from '@pada/components/Badge';
import { Button } from '@pada/components/Button';
import { Stack } from '@pada/components/Stack';
import { Toaster, toast } from '@pada/components/Toast';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: Date;
  commits: number;
}

const FIRST = ['Ada', 'Grace', 'Alan', 'Edsger', 'Barbara', 'Margaret', 'Katherine', 'Donald', 'Frances', 'John', 'Radia', 'Ken', 'Lynn', 'Tim', 'Hedy', 'Dennis', 'Sophie', 'Guido', 'Anita', 'Linus', 'Shafi', 'Leslie', 'Jean', 'Niklaus'];
const LAST = ['Lovelace', 'Hopper', 'Turing', 'Dijkstra', 'Liskov', 'Hamilton', 'Johnson', 'Knuth', 'Allen', 'McCarthy', 'Perlman', 'Thompson', 'Conway', 'Berners-Lee', 'Lamarr', 'Ritchie', 'Wilson', 'van Rossum', 'Borg', 'Torvalds', 'Goldwasser', 'Lamport', 'Bartik', 'Wirth'];
const ROLES: Member['role'][] = ['Owner', 'Admin', 'Editor', 'Editor', 'Viewer'];
const STATUSES: Member['status'][] = ['Active', 'Active', 'Active', 'Invited', 'Suspended'];
const NOW = new Date('2026-10-18T12:00:00Z').getTime();

const MEMBERS: Member[] = FIRST.map((first, index) => ({
  id: `member-${index}`,
  name: `${first} ${LAST[index]}`,
  email: `${first.toLowerCase()}@acme.io`,
  role: ROLES[index % ROLES.length],
  status: STATUSES[(index * 3) % STATUSES.length],
  lastActive: new Date(NOW - ((index * 7919) % 400) * 3_600_000),
  commits: (index * 173) % 900,
}));

const STATUS_TONE = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const COLUMNS: DataTableColumn<Member>[] = [
  {
    id: 'name',
    header: 'Name',
    rowHeader: true,
    hideable: false,
    minWidth: 200,
    cell: (row) => (
      <Stack direction="row" gap={2} align="center">
        <Avatar name={row.name} size="sm" aria-hidden="true" />
        <span>{row.name}</span>
      </Stack>
    ),
  },
  { id: 'email', header: 'Email', minWidth: 160 },
  { id: 'role', header: 'Role', width: 110 },
  {
    id: 'status',
    header: 'Status',
    width: 120,
    cell: (row) => (
      <Badge tone={STATUS_TONE[row.status]} dot>
        {row.status}
      </Badge>
    ),
  },
  { id: 'lastActive', header: 'Last active', width: 150, searchable: false, cell: (row) => dateFormat.format(row.lastActive) },
  { id: 'commits', header: 'Commits', width: 110, searchable: false, cell: (row) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{row.commits}</span> },
];

export default function DataTableDemo() {
  return (
    <DemoPage
      title="Data Table"
      kind="Component"
      purpose={<p>Data Table turns an array of records into a table people can sort, search, select from and page through, with column visibility on top. Use it for lists people manage (members, invoices, audit logs). For a small, static table, compose Table directly.</p>}
      design={
        <>
          <p>It builds on Table: sortable headers, resizable and reorderable columns, selected-row highlight and the pagination footer. The toolbar holds the search, the selection count with bulk actions, and the Columns menu.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <DataTable
              label="Team members"
              data={MEMBERS}
              columns={COLUMNS}
              selectable
              searchPlaceholder="Search members"
              defaultSort={{ columnId: 'lastActive', direction: 'descending' }}
              defaultHiddenColumns={['email']}
              actions={(selected) =>
                selected.length > 0 ? (
                  <Button size="sm" variant="destructive" leftIcon="delete" onClick={() => toast.danger({ title: `Removed ${selected.length} members` })}>
                    Remove
                  </Button>
                ) : (
                  <Button size="sm" leftIcon="user_add">
                    Invite
                  </Button>
                )
              }
            />
          </div>
          <Toaster />
        </>
      }
      developer={
        <CodeSnippet
          code={`import { DataTable, type DataTableColumn } from 'pada-ds';

const columns: DataTableColumn<Member>[] = [
  { id: 'name', header: 'Name', rowHeader: true, hideable: false },
  { id: 'role', header: 'Role', width: 110 },
  { id: 'status', header: 'Status', cell: (row) => <Badge tone={tone[row.status]}>{row.status}</Badge> },
  { id: 'lastActive', header: 'Last active', searchable: false, cell: (row) => format(row.lastActive) },
];

<DataTable
  label="Team members"
  data={members}
  columns={columns}
  selectable
  defaultSort={{ columnId: 'lastActive', direction: 'descending' }}
  actions={(selected) => selected.length > 0 && <Button onClick={() => remove(selected)}>Remove</Button>}
/>

// Server-side: control the state and pass one page of rows
<DataTable manual rowCount={total} data={page} columns={columns} label="Invoices"
  sort={sort} onSortChange={setSort} search={q} onSearchChange={setQ}
  page={pageNumber} onPageChange={setPageNumber} />

// Just the logic, for your own markup
import { useDataTable } from 'pada-ds/headless';`}
          language="tsx"
          label="Data table usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A named <code>table</code> with column headers; a column marked <code>rowHeader</code> names each row, and the selection checkboxes use that name (“Select Ada Lovelace”).</li>
          <li>Sortable headers are buttons, and the header reports <code>aria-sort</code>. Pressing again cycles ascending, descending and unsorted.</li>
          <li>The search field is labelled after the table, and the number of results is announced once typing pauses.</li>
          <li>The select-all box is “mixed” when only some rows on the page are selected. The Columns menu stays open while toggling, and Escape closes it.</li>
        </ul>
      }
    />
  );
}
