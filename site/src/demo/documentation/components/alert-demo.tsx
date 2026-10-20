import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Alert } from '@pada/components/Alert';
import { Button } from '@pada/components/Button';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function AlertDemo() {
  const [dismissed, setDismissed] = useState(false);
  return (
    <DemoPage
      title="Alert"
      kind="Component"
      purpose={<p>Alert is an inline, persistent message inside a page or form: a trial that is about to end, a setting that needs attention, a form that failed to save. It stays until the situation changes. For a short-lived confirmation after an action, use a toast.</p>}
      design={
        <>
          <p>Five tones set the colour and the default icon. A title, actions and a dismiss button are optional.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12, maxWidth: 560 }}>
            <Alert tone="info" title="Scheduled maintenance">The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.</Alert>
            <Alert tone="success" title="Domain verified">Emails from acme.com are now signed.</Alert>
            <Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>}>
              Add a payment method to keep your projects.
            </Alert>
            <Alert tone="danger" title="Couldn’t save changes" actions={<Button size="sm" variant="secondary">Try again</Button>}>
              The server didn’t respond. Your edits are kept in this tab.
            </Alert>
            {dismissed ? (
              <Button variant="ghost" size="sm" onClick={() => setDismissed(false)} style={{ alignSelf: 'flex-start' }}>
                Show the dismissed alert
              </Button>
            ) : (
              <Alert tone="neutral" onDismiss={() => setDismissed(true)}>
                Tip: press <strong>/</strong> anywhere to search.
              </Alert>
            )}
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Alert, Button } from 'pada-ds';

<Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>}>
  Add a payment method to keep your projects.
</Alert>

// Announce an alert that appears after the page has loaded
{saveFailed && (
  <Alert tone="danger" live="assertive" title="Couldn’t save changes" onDismiss={clear} />
)}`}
          language="tsx"
          label="Alert usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Alerts present on page load are not announced; they are read in normal page order.</li>
          <li>For an alert that appears later, set <code>live="polite"</code> (<code>role="status"</code>) or <code>live="assertive"</code> (<code>role="alert"</code>) for errors that need immediate attention.</li>
          <li>The icon is decorative; the tone is also expressed in the title or text, never by colour alone.</li>
          <li>The dismiss button is labelled “Dismiss”. Move focus somewhere sensible when the alert goes away.</li>
        </ul>
      }
    />
  );
}
