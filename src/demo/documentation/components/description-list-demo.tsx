import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { DescriptionList, type DescriptionListData } from '../../../components/DescriptionList';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const vendor: DescriptionListData = {
  sections: [
    {
      header: { label: 'Ownership', slot: [{ type: 'button', label: 'Edit' }] },
      rows: [
        { key: 'Owner', value: [{ type: 'avatar', name: 'Anna Banks', subtitle: 'HR' }] },
        { key: 'Status', tooltip: 'Current state of the vendor review', value: [{ type: 'badge', label: 'Active', tone: 'success' }] },
      ],
    },
    {
      header: { label: 'Contract', tooltip: 'From the signed order form', slot: [{ type: 'badge', label: 'Renews soon', tone: 'warning' }] },
      rows: [
        { key: 'Vendor', value: [{ type: 'text', text: 'Northwind Analytics' }] },
        { key: 'Renewal', value: [{ type: 'text', text: '1 December 2026' }, { type: 'button', label: 'Set reminder' }] },
        { key: 'Data access', value: [{ type: 'badge', label: 'PII', tone: 'danger' }, { type: 'badge', label: 'Billing', tone: 'info' }] },
      ],
    },
  ],
};

export default function DescriptionListDemo() {
  return (
    <DemoPage
      title="Description List"
      kind="Component"
      purpose={<p>Description List shows a record’s attributes as labelled sections of terms and values, from data. Use it on detail pages and side panels.</p>}
      design={
        <>
          <p>A header per section, with optional help and buttons or badges at the end, then rows of a term and one or more values: text, an avatar with a name, a badge, a button, or your own content.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: '100%', maxWidth: 640 }}>
              <DescriptionList data={vendor} onAction={(event) => console.info(event)} />
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { DescriptionList, type DescriptionListData } from 'pada-ds';

const details: DescriptionListData = {
  sections: [{
    header: { label: 'Ownership', slot: [{ type: 'button', label: 'Edit' }] },
    rows: [
      { key: 'Owner', value: [{ type: 'avatar', name: 'Anna Banks', subtitle: 'HR' }] },
      { key: 'Status', tooltip: 'Current state', value: [{ type: 'badge', label: 'Active', tone: 'success' }] },
    ],
  }],
};

<DescriptionList data={details} onAction={(event) => …} />   // section-slot-click | row-button-click`}
          language="tsx"
          label="Description List usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Each section is a <code>role="group"</code> named by its header; rows are a real <code>dl</code> of <code>dt</code> and <code>dd</code>.</li>
          <li>Tooltips are Info Tooltips named after the term they explain.</li>
          <li>Avatars sit next to the name, so the picture is hidden from screen readers to avoid reading the name twice.</li>
        </ul>
      }
    />
  );
}
