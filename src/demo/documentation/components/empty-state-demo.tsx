import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { EmptyState } from '../../../components/EmptyState';
import { Button } from '../../../components/Button';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const frame = {
  flex: '1 1 300px',
  border: '1px dashed var(--pada-color-border)',
  borderRadius: 'var(--pada-radius-lg)',
  padding: 16,
} as const;

export default function EmptyStateDemo() {
  return (
    <DemoPage
      title="Empty State"
      kind="Component"
      purpose={<p>Empty State fills a page, card or table that has nothing to show yet: a first-use screen, a search with no results, or a list that failed to load. Say what is empty, why, and the one thing to do next.</p>}
      design={
        <>
          <p>Two sizes: <code>md</code> for whole pages and <code>sm</code> inside cards and tables. The media slot takes an icon name or any illustration.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
            <div style={frame}>
              <EmptyState
                media="folder"
                title="No projects yet"
                description="Projects group your documents, people and checks. Create one to get started."
                actions={
                  <>
                    <Button leftIcon="add">New project</Button>
                    <Button variant="ghost">Import</Button>
                  </>
                }
              />
            </div>
            <div style={frame}>
              <EmptyState size="sm" media="search" title="No results for “quarterly”" description="Check the spelling or try fewer filters." actions={<Button size="sm" variant="secondary">Clear filters</Button>} />
            </div>
            <div style={frame}>
              <EmptyState size="sm" media="no_network" title="Couldn’t load activity" description="You appear to be offline." actions={<Button size="sm" variant="secondary" leftIcon="refresh_2">Retry</Button>} />
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { EmptyState, Button } from 'pada-ds';

<EmptyState
  media="folder"
  title="No projects yet"
  description="Create a project to get started."
  actions={<Button leftIcon="add">New project</Button>}
/>

<EmptyState size="sm" media="search" headingLevel={4} title="No results" />`}
          language="tsx"
          label="Empty state usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The title is a real heading (level 3 by default). Set <code>headingLevel</code> so it fits the page outline.</li>
          <li>The media is decorative. Put everything people need in the title and description.</li>
          <li>When an empty state replaces results after a search, announce the change (for example with a polite live region on the results count).</li>
        </ul>
      }
    />
  );
}
