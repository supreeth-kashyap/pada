import { CodeSnippet } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { components } from '../../lib/docs';
import { ROUTES } from '../../lib/paths';
import { CopyButton } from '../../shell/CopyButton';
import { Sparkle } from '../../shell/icons';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';

const RULES = `## UI
- Build UI with Pada: pada-ds (React) or pada-ds-angular (Angular).
- Before writing UI code, read node_modules/pada-ds/llms-full.txt
  (every component, prop and an example) or pada-ds/manifest.json.
- Use a Pada component before writing a custom one. Style custom UI
  only with --pada-* semantic tokens; never raw colours or pixel values
  that a token covers.
- Theme with attributes on <html> (data-theme, data-accent,
  data-density, data-radius), not by overriding component CSS.
- To restyle a component, reassign its component tokens
  (--pada-button-*), never its internal class names.
- Keep the accessibility contracts: label every field, name
  icon-only buttons, confirm destructive actions with AlertDialog.`;

const GENERAL_PROMPTS = [
  ['Start a new screen', 'Using Pada, build an account settings page: a PageHeader with breadcrumbs, Tabs for Profile, Security and Notifications, InputText and Select fields laid out with Stack, and a footer with Cancel and Save buttons. Use semantic tokens for any custom spacing.'],
  ['Refactor to Pada', 'Replace the hand-written buttons, inputs, modals and dropdowns in this file with their Pada equivalents (Button, InputText, Dialog, DropdownMenu). Keep behaviour and labels identical, and remove the CSS that is no longer needed.'],
  ['Audit accessibility', 'Review this screen against Pada’s accessibility contracts: every field has a visible label, icon-only buttons have names, destructive actions use AlertDialog, and nothing relies on colour alone. List the fixes, then apply them.'],
  ['Theme to a brand', 'Theme this app with Pada: data-accent="custom" with --pada-accent-hue set to our brand hue, data-neutral="slate", data-radius="lg". Replace hard-coded colours with --pada-color-* tokens.'],
];

const FEATURED = ['dialog', 'data-table', 'field', 'toaster', 'command-palette', 'date-range-picker'];

export function AiGuide() {
  const featured = FEATURED.map((slug) => components.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => !!c);
  return (
    <DocsLayout toc={[{ id: 'files', label: 'Machine-readable docs' }, { id: 'rules', label: 'Project rules' }, { id: 'prompts', label: 'Prompts' }, { id: 'components', label: 'Per component' }, { id: 'tips', label: 'Tips' }]}>
      <article className="doc">
        <DocHeader
          eyebrow="Guides"
          title="Build with AI"
          lede="Pada describes itself to coding agents: every component, prop, type and default, in files they can read. With a few project rules, agents write Pada code that is accessible and on-brand."
        />

        <DocSection id="files" title="Machine-readable docs">
          <div className="table-wrap">
            <table className="doc-table">
              <thead>
                <tr><th scope="col">File</th><th scope="col">What's in it</th><th scope="col">Use it for</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row"><code>pada-ds/llms.txt</code></th><td>A short index of every component</td><td>Context in every request</td></tr>
                <tr><th scope="row"><code>pada-ds/llms-full.txt</code></th><td>Every prop with its type, default, description and an example</td><td>Writing and reviewing UI code</td></tr>
                <tr><th scope="row"><code>pada-ds/manifest.json</code></th><td>The same API as JSON</td><td>Tools, MCP servers and codegen</td></tr>
              </tbody>
            </table>
          </div>
          <p>They ship inside the <code>pada-ds</code> package and are regenerated from the TypeScript source on every release, so they never drift from the code. The Angular API mirrors the React one; agents working in Angular can use the same files with the Angular selectors from each docs page.</p>
        </DocSection>

        <DocSection id="rules" title="Project rules">
          <p>Add these to <code>CLAUDE.md</code>, <code>AGENTS.md</code>, <code>.cursor/rules</code> or your agent's equivalent.</p>
          <CodeSnippet code={RULES} language="markdown" type="multi-line" label="CLAUDE.md" />
        </DocSection>

        <DocSection id="prompts" title="Prompts">
          <ul className="prompt-cards">
            {GENERAL_PROMPTS.map(([title, text]) => (
              <li key={title} className="prompt-card">
                <div className="prompt-card-head">
                  <Sparkle size={14} />
                  <strong>{title}</strong>
                  <CopyButton text={text} label={`Copy prompt: ${title}`} />
                </div>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="components" title="Per component">
          <p>Every component page ends with a ready-made prompt. A few of them:</p>
          <ul className="prompt-cards">
            {featured.map((c) => (
              <li key={c.slug} className="prompt-card">
                <div className="prompt-card-head">
                  <Sparkle size={14} />
                  <RouterLink to={ROUTES.component(c.slug)}><strong>{c.name}</strong></RouterLink>
                  <CopyButton text={c.ai ?? ''} label={`Copy prompt: ${c.name}`} />
                </div>
                <p>{c.ai}</p>
              </li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="tips" title="Tips">
          <ul className="doc-list">
            <li>Name the component you want ("a Pada AlertDialog"), not just the behaviour; agents then follow its documented API.</li>
            <li>Ask for the accessibility contract explicitly in reviews: labels, names, keyboard and focus.</li>
            <li>Keep adapters for API data next to data components (<code>toTimelineData</code>), so components only see the shape they need.</li>
            <li>When an agent invents a prop, point it back to <code>llms-full.txt</code>.</li>
          </ul>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
