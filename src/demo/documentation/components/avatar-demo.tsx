import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Avatar, AvatarGroup } from '../../../components/Avatar';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' } as const;
const TEAM = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Edsger Dijkstra', 'Barbara Liskov', 'Margaret Hamilton'];

export default function AvatarDemo() {
  return (
    <DemoPage
      title="Avatar"
      kind="Component"
      purpose={<p>Avatar represents a person or an organisation with a picture, or initials when there is no picture. Use it next to names in comments, assignee fields and member lists, and in groups to show who is involved.</p>}
      design={
        <>
          <p>Five sizes, circle for people and square for organisations. Initials sit on a colour derived from the name, so the same person always gets the same colour. An optional dot shows presence.</p>
          <div className="demo-page__showcase" style={row}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Avatar key={size} name="Grace Hopper" size={size} />
            ))}
            <Avatar size="lg" />
            <Avatar name="Acme Inc" shape="square" size="lg" />
          </div>
          <div className="demo-page__showcase" style={row}>
            <Avatar name="Ada Lovelace" status="online" size="lg" />
            <Avatar name="Alan Turing" status="away" size="lg" />
            <Avatar name="Edsger Dijkstra" status="busy" size="lg" />
            <Avatar name="Barbara Liskov" status="offline" size="lg" />
            <Avatar name="Broken image" src="/missing.png" size="lg" />
          </div>
          <div className="demo-page__showcase" style={row}>
            <AvatarGroup label="Project members" max={4}>
              {TEAM.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
            <AvatarGroup label="Reviewers" size="sm">
              {TEAM.slice(0, 3).map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Avatar, AvatarGroup } from 'pada-ds';

<Avatar name="Grace Hopper" src={user.photoUrl} status="online" />
<Avatar name="Acme Inc" shape="square" />

<AvatarGroup label="Project members" max={4}>
  {members.map((m) => <Avatar key={m.id} name={m.name} src={m.photoUrl} />)}
</AvatarGroup>`}
          language="tsx"
          label="Avatar usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>An avatar is an image named by <code>name</code> (or <code>alt</code>). When the name is printed right beside it, hide the avatar with <code>aria-hidden</code> to avoid hearing it twice.</li>
          <li>The presence dot has its own text label (“online”, “busy”), so colour is not the only cue.</li>
          <li>The “+2” counter in a group is labelled “2 more”.</li>
        </ul>
      }
    />
  );
}
