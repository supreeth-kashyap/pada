import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Avatar } from '../../../components/Avatar';
import { Badge } from '../../../components/Badge';
import { HoverCard } from '../../../components/HoverCard';
import { Link } from '../../../components/Link';
import { Stack } from '../../../components/Stack';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

function Profile() {
  return (
    <Stack gap={3}>
      <Stack direction="row" gap={3} align="center">
        <Avatar name="Ada Lovelace" size="lg" />
        <div>
          <strong>Ada Lovelace</strong>
          <div style={{ color: 'var(--pada-color-fg-muted)', fontSize: 'var(--pada-font-size-sm)' }}>@ada · Engineering</div>
        </div>
      </Stack>
      <p style={{ margin: 0 }}>Writes the first programs for the Analytical Engine. Reviews the token pipeline.</p>
      <Stack direction="row" gap={2}>
        <Badge tone="success">Available</Badge>
        <Badge>12 reviews this week</Badge>
      </Stack>
    </Stack>
  );
}

export default function HoverCardDemo() {
  return (
    <DemoPage
      title="Hover Card"
      kind="Component"
      purpose={<p>HoverCard previews what a link points to (a person, a page, a repository) when people hover or focus it, so they can decide whether to follow it. The preview is a convenience: everything in it must also be available by following the link.</p>}
      design={
        <>
          <p>The card opens after a short delay, scales in from the link, and stays open while the pointer moves onto it. Hover the name below.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', minHeight: 220 }}>
            <p style={{ margin: 0 }}>
              Last reviewed by{' '}
              <HoverCard content={<Profile />} arrow>
                <Link href="#ada">@ada</Link>
              </HoverCard>{' '}
              two hours ago.
            </p>
          </div>
        </>
      }
      developer={
        <>
          <CodeSnippet
            code={`import { HoverCard, Link } from 'pada-ds';

<HoverCard content={<ProfilePreview user={user} />} openDelay={500} side="top" arrow>
  <Link href={user.url}>@{user.handle}</Link>
</HoverCard>`}
            language="tsx"
            label="HoverCard usage"
          />
        </>
      }
      accessibility={
        <ul style={list}>
          <li>Opens on hover (not touch) and on keyboard focus of the link, after <code>openDelay</code>; closes when the pointer or focus leaves, or on <kbd>Escape</kbd>.</li>
          <li>The card is not announced and does not take focus: screen-reader and touch users reach the same information through the link. Keep interactive content out of it, or use a Popover instead.</li>
        </ul>
      }
    />
  );
}
