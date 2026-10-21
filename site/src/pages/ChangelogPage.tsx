import { Tabs } from 'pada-ds';
import reactChangelog from '../../../CHANGELOG.md?raw';
import angularChangelog from '../../content/angular-changelog.md?raw';
import { renderMarkdown } from '../lib/markdown';
import { links } from '../lib/docs';
import { useReveal } from '../lib/useReveal';

/** Drops the file's "# Changelog" title; the page has its own. */
const body = (md: string) => renderMarkdown(md.replace(/^# .*\n/, ''));

const REACT_HTML = body(reactChangelog);
const ANGULAR_HTML = body(angularChangelog);

export function ChangelogPage() {
  useReveal();
  return (
    <main id="main" className="page">
      <div className="wrap">
        <header className="page-head" data-reveal>
          <p className="eyebrow">Changelog</p>
          <h1 className="h2">What's new in Pada</h1>
          <p className="lede">
            Both packages are released together under the same version. Releases are also on GitHub:{' '}
            <a className="text-link" href={`${links.reactRepo}/releases`} target="_blank" rel="noopener noreferrer">React</a>{' '}
            ·{' '}
            <a className="text-link" href={`${links.angularRepo}/releases`} target="_blank" rel="noopener noreferrer">Angular</a>
          </p>
        </header>
        <Tabs.Root defaultValue="react" variant="pills">
          <Tabs.List aria-label="Package">
            <Tabs.Trigger value="react">pada-ds (React)</Tabs.Trigger>
            <Tabs.Trigger value="angular">pada-ds-angular</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="react">
            <article className="prose changelog" dangerouslySetInnerHTML={{ __html: REACT_HTML }} />
          </Tabs.Content>
          <Tabs.Content value="angular">
            <article className="prose changelog" dangerouslySetInnerHTML={{ __html: ANGULAR_HTML }} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </main>
  );
}
