import { CodeSnippet } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { CopyButton } from '../shell/CopyButton';
import { ArrowRight, Sparkle } from '../shell/icons';
import { componentBySlug } from '../lib/docs';
import { ROUTES } from '../lib/paths';

const RULES = `## UI
- Build UI with Pada: pada-ds (React) or pada-ds-angular (Angular).
- Before writing UI code, read node_modules/pada-ds/llms-full.txt
  (every component, prop and an example) or pada-ds/manifest.json.
- Use a Pada component before writing a custom one. Style custom UI
  only with --pada-* semantic tokens; never raw colours.
- Theme with attributes on <html> (data-theme, data-accent,
  data-density, data-radius), not by overriding component CSS.
- Keep the accessibility contracts: label every field, name
  icon-only buttons, confirm destructive actions with AlertDialog.`;

const PROMPTS = [
  {
    title: 'A settings page',
    text: 'Using Pada, build a settings page with a Sidebar, a PageHeader with breadcrumbs, and Tabs for Profile, Notifications and Billing. Profile uses InputText fields in a Field layout; Notifications uses Switches that save immediately with a toast.',
  },
  {
    title: 'Theme it to our brand',
    text: 'Theme this app with Pada: set data-accent="custom" with --pada-accent-hue: 262 on <html>, data-neutral="slate", data-radius="lg" and data-density="compact". Remove any hard-coded colours and use --pada-color-* tokens instead.',
  },
  { title: 'A members table', text: componentBySlug.get('data-table')?.ai ?? '' },
  { title: 'Safe deletes', text: componentBySlug.get('alert-dialog')?.ai ?? '' },
];

const FILES = [
  { name: 'llms.txt', note: 'A short index of every component', path: 'pada-ds/llms.txt' },
  { name: 'llms-full.txt', note: 'Every prop, its type and an example', path: 'pada-ds/llms-full.txt' },
  { name: 'manifest.json', note: 'The component API as JSON', path: 'pada-ds/manifest.json' },
];

export function BuildWithAI() {
  return (
    <section className="section ai" id="ai" aria-labelledby="ai-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Build with AI</p>
          <h2 id="ai-title" className="h2">
            Built for how you <span className="serif">build now.</span>
          </h2>
          <p className="lede">
            Pada ships a machine-readable description of every component, prop and token. Point your coding agent at
            it, add a few rules, and it writes Pada code that is accessible and on-brand on the first try.
          </p>
        </div>

        <div className="ai-grid">
          <div className="ai-col" data-reveal>
            <h3 className="ai-step"><span>1</span> Give your agent the docs</h3>
            <ul className="ai-files">
              {FILES.map((file) => (
                <li key={file.name}>
                  <code>{file.name}</code>
                  <span>{file.note}</span>
                  <CopyButton text={file.path} label={`Copy ${file.path}`} />
                </li>
              ))}
            </ul>
            <p className="muted small">
              They ship inside the <code>pada-ds</code> package. Every docs page also has a ready-made prompt.
            </p>

            <h3 className="ai-step"><span>2</span> Add a few rules</h3>
            <p className="muted small">
              Paste into <code>CLAUDE.md</code>, <code>AGENTS.md</code> or <code>.cursor/rules</code>.
            </p>
            <CodeSnippet code={RULES} language="markdown" type="multi-line" label="CLAUDE.md" />
          </div>

          <div className="ai-col" data-reveal style={{ ['--reveal-delay' as string]: '0.1s' }}>
            <h3 className="ai-step"><span>3</span> Prompt in plain words</h3>
            <ul className="prompt-cards">
              {PROMPTS.map((prompt) => (
                <li key={prompt.title} className="prompt-card">
                  <div className="prompt-card-head">
                    <Sparkle size={14} />
                    <strong>{prompt.title}</strong>
                    <CopyButton text={prompt.text} label={`Copy prompt: ${prompt.title}`} />
                  </div>
                  <p>{prompt.text}</p>
                </li>
              ))}
            </ul>
            <RouterLink className="text-link" to={ROUTES.ai}>
              The full guide to building with AI <ArrowRight size={14} />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
