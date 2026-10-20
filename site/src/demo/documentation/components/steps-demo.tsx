import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Steps } from '@pada/components/Steps';

export default function StepsDemo() {
  return (
    <DemoPage
      title="Steps"
      kind="Component"
      purpose={<p>Steps renders a horizontal or vertical progression through a multi-step flow — onboarding, checkout, or a wizard. Use it when the user needs to know how many steps remain and which step is active. For non-linear lists of tasks, prefer a checklist instead.</p>}
      design={<><p>Each step has a status — <code>upcoming</code>, <code>current</code>, or <code>completed</code> — visualized via the indicator color and icon. The current step is announced to assistive tech as the active step in the flow.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><Steps steps={[{ title: 'Account', status: 'completed' }, { title: 'Plan', status: 'current' }, { title: 'Confirm', status: 'upcoming' }]} /></div></div></>}
      developer={<><p>Import the <code>Steps</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Steps } from 'pada-ds';

export function Onboarding() {
  return (
    <Steps
      steps={[
        { title: 'Account', status: 'completed' },
        { title: 'Plan', status: 'current' },
        { title: 'Confirm', status: 'upcoming' },
      ]}
    />
  );
}`} language="tsx" label="Steps usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Wrapped in a <code>&lt;nav aria-label="Progress"&gt;</code> so screen readers can navigate to it.</li><li>Active step uses <code>aria-current="step"</code>; complete steps include hidden "Completed" text for context.</li><li>Status is conveyed via icon + color + label, never color alone.</li></ul>}
    />
  );
}
