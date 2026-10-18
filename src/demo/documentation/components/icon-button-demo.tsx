import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { IconButton } from '../../../components/IconButton';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

export default function IconButtonDemo() {
  return (
    <DemoPage
      title="Icon Button"
      kind="Component"
      purpose={<p>Icon Button is a square button with only an icon, for familiar actions in tight spaces: close, edit, more actions, copy. If the icon isn’t universally understood, use a Button with a label instead, or at least turn on the tooltip.</p>}
      design={
        <>
          <p>The same variants and sizes as Button, ghost by default. With <code>tooltip</code>, the label appears on hover and focus.</p>
          <div className="demo-page__showcase" style={row}>
            <IconButton icon="edit_1" label="Edit" tooltip />
            <IconButton icon="copy" label="Copy link" tooltip variant="secondary" />
            <IconButton icon="add" label="Add item" tooltip variant="primary" />
            <IconButton icon="delete" label="Delete" tooltip variant="destructive" />
            <IconButton icon="menu_vertical" label="More actions" tooltip />
            <IconButton icon="refresh_2" label="Refreshing" loading />
            <IconButton icon="share_1" label="Share" disabled />
          </div>
          <div className="demo-page__showcase" style={row}>
            <IconButton icon="cog" label="Settings" size="sm" variant="secondary" />
            <IconButton icon="cog" label="Settings" size="md" variant="secondary" />
            <IconButton icon="cog" label="Settings" size="lg" variant="secondary" />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { IconButton } from 'pada-ds';

<IconButton icon="edit_1" label="Edit" tooltip onClick={edit} />
<IconButton icon="delete" label="Delete project" variant="destructive" />`}
          language="tsx"
          label="Icon button usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li><code>label</code> is required and becomes the button’s <code>aria-label</code>: an icon alone has no text for screen readers.</li>
          <li>Make the label specific when there are many on a page (“Delete project”, not “Delete”).</li>
          <li>The tooltip repeats the label for sighted mouse and keyboard users; it is not announced a second time.</li>
          <li>The small size is 28 px square, above the 24 px minimum target size. Leave space between neighbouring buttons.</li>
        </ul>
      }
    />
  );
}
