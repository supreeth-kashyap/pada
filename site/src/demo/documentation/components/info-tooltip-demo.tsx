import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { InfoTooltip } from '@pada/components/InfoTooltip';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function InfoTooltipDemo() {
  return (
    <DemoPage
      title="Info Tooltip"
      kind="Component"
      purpose={<p>Info Tooltip explains a term or a setting without cluttering the layout: a small info icon next to the label that opens a short tooltip.</p>}
      design={
        <>
          <p>A muted icon button that opens a Tooltip on hover and keyboard focus. Keep the text to a sentence or two, and never put links or buttons in it.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              Seats <InfoTooltip label="Seats" text="Seats are billed monthly, per active member." />
            </span>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              Retention <InfoTooltip label="Retention" text="Deleted records are kept for 30 days." position="right" />
            </span>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { InfoTooltip } from 'pada-ds';

<span>
  Seats <InfoTooltip label="Seats" text="Seats are billed monthly, per active member." />
</span>`}
          language="tsx"
          label="Info Tooltip usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The trigger is a native button named “More info about {'{label}'}”, reachable with Tab.</li>
          <li>The tooltip opens on focus and describes the button through <code>aria-describedby</code>; Escape closes it.</li>
          <li>Built on Tooltip: it renders in a portal and flips to stay on screen.</li>
        </ul>
      }
    />
  );
}
