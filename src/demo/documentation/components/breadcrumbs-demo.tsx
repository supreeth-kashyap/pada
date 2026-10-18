import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const TRAIL = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Website redesign', href: '#' },
  { label: 'Documents', href: '#' },
  { label: 'Brand guidelines', href: '#' },
  { label: 'Version history' },
];

export default function BreadcrumbsDemo() {
  return (
    <DemoPage
      title="Breadcrumbs"
      kind="Component"
      purpose={<p>Breadcrumbs show where the current page sits in a hierarchy and let people step back up it. Use them in deep structures (projects, folders, settings) as a secondary aid, below the page header and above the title.</p>}
      design={
        <>
          <p>Ancestors are links; the last item is the current page, shown as plain text. Long trails collapse their middle behind an expand button.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            <Breadcrumbs items={TRAIL.slice(0, 3).concat({ label: 'Settings' })} />
            <Breadcrumbs items={TRAIL} />
            <Breadcrumbs items={TRAIL} maxItems={3} />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Breadcrumbs } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';

<Breadcrumbs
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Website redesign', href: '/projects/42' },
    { label: 'Settings' },
  ]}
  maxItems={4}
  renderLink={(item, props) => <RouterLink to={item.href!} {...props} />}
/>`}
          language="tsx"
          label="Breadcrumbs usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA breadcrumb pattern: a <code>nav</code> landmark named “Breadcrumb” containing an ordered list.</li>
          <li>The current page has <code>aria-current="page"</code>. Separators are decorative and hidden from screen readers.</li>
          <li>The collapse button is labelled “Show all breadcrumbs” and, once pressed, focus moves to the first revealed link.</li>
        </ul>
      }
    />
  );
}
