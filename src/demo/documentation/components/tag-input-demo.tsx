import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { TagInput } from '../../../components/TagInput';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const isEmail = (tag: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag) ? null : `${tag} is not an email address.`);

export default function TagInputDemo() {
  return (
    <DemoPage
      title="Tag Input"
      kind="Component"
      purpose={<p>TagInput collects several free-form values in one field (keywords, labels, email recipients) and shows each as a removable tag. When people should choose from a known list instead, use Autocomplete with <code>multiple</code>.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 20, maxWidth: 420 }}>
          <TagInput label="Keywords" defaultValue={['tokens', 'headless', 'motion']} placeholder="Add a keyword" />
          <TagInput label="Invite by email" placeholder="name@company.com" validate={isEmail} description="Paste a list separated by commas or lines." />
          <TagInput label="Top three" maxTags={3} defaultValue={['speed', 'clarity']} />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { TagInput } from 'pada-ds';

<TagInput
  label="Invite by email"
  name="emails"
  value={emails}
  onValueChange={setEmails}
  validate={(tag) => (isEmail(tag) ? null : \`\${tag} is not an email address.\`)}
  maxTags={20}
/>`}
          language="tsx"
          label="TagInput usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The tags are a list named with the label and count; each has a "Remove …" button. Additions and removals are announced.</li>
          <li><kbd>Enter</kbd> or <kbd>,</kbd> adds a tag. <kbd>Backspace</kbd> (or <kbd>←</kbd>) at the start of the field moves to the last tag; there <kbd>←</kbd> <kbd>→</kbd> move, and <kbd>Backspace</kbd> / <kbd>Delete</kbd> remove.</li>
          <li>Rejected entries stay in the field with an error explaining why.</li>
        </ul>
      }
    />
  );
}
