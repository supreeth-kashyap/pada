import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Table } from '../../../components/Table';

export default function TableDemo() {
  return (
    <DemoPage
      title="Table"
      kind="Component"
      purpose={<p>Table presents structured rows and columns of data — records, transactions, audit logs. Use it when users need to scan, sort, or compare across rows. For free-form lists or single-record details, prefer List or KeyValue.</p>}
      design={<><p>Table supports column configuration (label, sortable, alignment), row-level actions, sticky headers, and pagination. Empty and loading states are first-class.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><Table columns={[{ id: 'name', label: 'Name' }, { id: 'role', label: 'Role' }]}><div style={{ padding: 12, color: 'var(--color-stone-500)', fontSize: 12 }}>Render &lt;Row&gt; / &lt;Cell&gt; children to populate the table.</div></Table></div></div></>}
      developer={<><p>Import the <code>Table</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Table, Row, Cell } from 'pada-ds';

export function UsersTable({ users }) {
  return (
    <Table columns={[{ id: 'name', label: 'Name' }, { id: 'email', label: 'Email' }]}>
      {users.map((u) => (
        <Row key={u.id}>
          <Cell>{u.name}</Cell>
          <Cell>{u.email}</Cell>
        </Row>
      ))}
    </Table>
  );
}`} language="tsx" label="Table usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Uses semantic <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code> markup so screen readers announce headers, rows, and cells.</li><li>Sortable columns expose <code>aria-sort</code> on the header.</li><li>Selected rows use <code>aria-selected</code>; row actions are reachable by keyboard within the table tab order.</li></ul>}
    />
  );
}
