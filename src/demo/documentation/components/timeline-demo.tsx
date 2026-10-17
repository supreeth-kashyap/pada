import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Timeline } from '../../../components/Timeline';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

export default function TimelineDemo() {
  return (
    <DemoPage
      title="Timeline"
      kind="Component"
      purpose={<p>Timeline lists events in order (an activity feed, an audit log, order tracking, a release history), each with a marker, a title, a time and optional details. Use it when the sequence matters; for steps the user works through, use Steps.</p>}
      design={
        <>
          <p>Markers take a tone and an optional icon. Pending events are hollow, with a dashed connector. Events fade up one after another when the timeline appears.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ width: 340 }}>
              <Timeline
                aria-label="Order history"
                items={[
                  { title: 'Order placed', time: hoursAgo(52), tone: 'accent', icon: 'document' },
                  { title: 'Payment confirmed', time: hoursAgo(51), tone: 'success', icon: 'tick_1' },
                  { title: 'Shipped', time: hoursAgo(20), tone: 'success', icon: 'tick_1', description: 'Carrier: UPS · Tracking 1Z999AA10123456784' },
                  { title: 'Out for delivery', time: 'Expected tomorrow', pending: true },
                ]}
              />
            </div>
            <div style={{ width: 320 }}>
              <Timeline aria-label="Activity" density="compact">
                <Timeline.Item title="Ada merged #482" time={hoursAgo(1)} tone="success" />
                <Timeline.Item title="Build failed on main" time={hoursAgo(3)} tone="danger" icon="alert_2">
                  2 visual tests changed. Rerun after updating the snapshots.
                </Timeline.Item>
                <Timeline.Item title="Grace commented" time={hoursAgo(5)} />
                <Timeline.Item title="Release 2.0 planned" time={hoursAgo(30)} tone="warning" />
              </Timeline>
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Timeline } from 'pada-ds';

<Timeline aria-label="Order history" items={events} />

<Timeline aria-label="Activity" density="compact">
  <Timeline.Item title="Ada merged #482" time={mergedAt} tone="success" />
  <Timeline.Item title="Build failed" time={failedAt} tone="danger" icon="alert_2">
    2 visual tests changed.
  </Timeline.Item>
</Timeline>`}
          language="tsx"
          label="Timeline usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Rendered as an ordered list (<code>&lt;ol&gt;</code>), so screen readers announce the count and each event's position. Name it with <code>aria-label</code>.</li>
          <li>Dates render in a <code>&lt;time dateTime&gt;</code> element. Markers are decorative; put meaning in the title, not only in the colour.</li>
          <li>The entrance animation is skipped under reduced motion.</li>
        </ul>
      }
    />
  );
}
