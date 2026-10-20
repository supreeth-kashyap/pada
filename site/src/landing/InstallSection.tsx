import { CodeSnippet, Tabs } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../lib/paths';
import { ArrowRight } from '../shell/icons';

const STEPS = {
  react: [
    { title: 'Install', code: 'npm install pada-ds', language: 'bash', type: 'single-line' as const },
    { title: 'Import the styles once', code: "import 'pada-ds/styles.css';\nimport 'pada-ds/base.css'; // optional", language: 'tsx', type: 'multi-line' as const },
    {
      title: 'Use a component',
      code: "import { Button, toast } from 'pada-ds';\n\n<Button onClick={() => toast.success({ title: 'Saved' })}>\n  Save changes\n</Button>",
      language: 'tsx',
      type: 'multi-line' as const,
    },
  ],
  angular: [
    { title: 'Install', code: 'npm install pada-ds-angular', language: 'bash', type: 'single-line' as const },
    {
      title: 'Import the styles once',
      code: "// styles.scss\n@import 'pada-ds-angular/styles.css';\n@import 'pada-ds-angular/base.css'; // optional",
      language: 'scss',
      type: 'multi-line' as const,
    },
    {
      title: 'Use a component',
      code: "import { ButtonComponent } from 'pada-ds-angular';\n\n@Component({\n  imports: [ButtonComponent],\n  template: `<button dsButton>Save changes</button>`,\n})",
      language: 'typescript',
      type: 'multi-line' as const,
    },
  ],
};

export function InstallSection() {
  return (
    <section className="section install" id="install" aria-labelledby="install-title">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Get started</p>
          <h2 id="install-title" className="h2">
            Up and running <span className="serif">in a minute.</span>
          </h2>
          <p className="lede">
            Install the package for your framework, import the styles once, and every component is ready, themed in
            light and dark.
          </p>
        </div>
        <Tabs.Root variant="pills" defaultValue="react" className="install-tabs">
          <Tabs.List aria-label="Framework">
            <Tabs.Trigger value="react">React</Tabs.Trigger>
            <Tabs.Trigger value="angular">Angular</Tabs.Trigger>
          </Tabs.List>
          {(Object.keys(STEPS) as (keyof typeof STEPS)[]).map((fw) => (
            <Tabs.Content key={fw} value={fw}>
              <ol className="install-steps">
                {STEPS[fw].map((step, i) => (
                  <li key={step.title} data-reveal style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}>
                    <span className="step-num">{i + 1}</span>
                    <h3>{step.title}</h3>
                    <CodeSnippet code={step.code} language={step.language} type={step.type} label={step.title} />
                  </li>
                ))}
              </ol>
            </Tabs.Content>
          ))}
        </Tabs.Root>
        <div className="center-row" data-reveal>
          <RouterLink className="text-link" to={ROUTES.gettingStarted}>
            Read the full getting-started guide <ArrowRight size={14} />
          </RouterLink>
        </div>
      </div>
    </section>
  );
}
