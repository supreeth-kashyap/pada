import '../styles/global.css';
import '../styles/primitives.css';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CodeSnippet } from '../components/CodeSnippet';
import { List, ListItem } from '../components/List';
import { Notification } from '../components/Notification';
import { PageHeader } from '../components/PageHeader';
import { SearchField } from '../components/SearchField';
import { SideDrawer } from '../components/SideDrawer';
import { Table, TableRow, TableCell, HeaderCell } from '../components/Table';
import { Toolbar, FilterChip, BaseManageFilter, BaseToolbarMenu } from '../components/Toolbar';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const columns = [
    { id: 'name', label: 'Name', width: 180 },
    { id: 'status', label: 'Status', width: 140 },
    { id: 'owner', label: 'Owner', width: 160 },
    { id: 'updated', label: 'Updated', width: 140 }
  ];

  return (
    <main style={{ minHeight: '100vh', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Crumb 1' },
          { label: 'Crumb 2' },
          { label: 'Crumb 3' },
          { label: 'Crumb 4' }
        ]}
        profileMenu={<div style={{ padding: 'var(--spacing-2)' }}>Profile menu</div>}
      />

      <h1 style={{ marginTop: 'var(--spacing-6)' }}>Component Preview</h1>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>Notification</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Slide-in alert notification with position support.
        </p>
        <Button variant="secondary" onClick={() => setNotificationOpen(true)}>
          Show Notification
        </Button>
        <Notification
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
          title="Toast title given by PD"
          description="Subtext written by the design or product"
          actionLabel="Button"
          position="top-right"
        />
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>Side Drawer</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Opens from the right and accepts arbitrary children.
        </p>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Open Drawer
        </Button>
        <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <div style={{ padding: 'var(--spacing-6)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Drawer Content</h3>
            <p>This drawer can render any content.</p>
          </div>
        </SideDrawer>
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>Table</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Resizable and re-orderable columns with header and cells.
        </p>
        <Table
          columns={columns}
          toolbar={
            <Toolbar>
              <SearchField placeholder="Search" />
              <FilterChip variant="button" />
              <BaseToolbarMenu title="menu" count={1232} />
              <BaseManageFilter />
            </Toolbar>
          }
        >
          <TableRow>
            {columns.map((col) => (
              <HeaderCell key={col.id} columnId={col.id} label={col.label} />
            ))}
          </TableRow>
          <TableRow>
            <TableCell columnId="name">Project Alpha</TableCell>
            <TableCell columnId="status">Active</TableCell>
            <TableCell columnId="owner">Riya</TableCell>
            <TableCell columnId="updated">2h ago</TableCell>
          </TableRow>
          <TableRow>
            <TableCell columnId="name">Project Beta</TableCell>
            <TableCell columnId="status">Paused</TableCell>
            <TableCell columnId="owner">Alex</TableCell>
            <TableCell columnId="updated">1d ago</TableCell>
          </TableRow>
        </Table>
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>List</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Draggable list with list items.
        </p>
        <List draggable>
          <ListItem>List item 1</ListItem>
          <ListItem>List item 2</ListItem>
          <ListItem>List item 3</ListItem>
          <ListItem>List item 4</ListItem>
        </List>
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>Card</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Card container with fixed size and border.
        </p>
        <Card />
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        <h2>Code Snippet</h2>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          Syntax highlighted code block with language label.
        </p>
        <CodeSnippet
          language="bash"
          code={`sa="sprinto-service-account-test1"\ncurrentproject=\`gcloud info --format='value(config.project)'\`\n\n## Add project IDs of projects(other than the current one) that you want to have access to\nprojects=($currentproject)\n\necho "Integrating Sprinto"\necho "Service Account: $sa"\n\necho ""\n# Create service account\ngcloud iam service-accounts create $sa \\\n    --description="Sprinto uses this to monitor production GCP resources" \\\n    --display-name="Sprinto"`}
        />
      </div>
    </main>
  );
};

export default App;
