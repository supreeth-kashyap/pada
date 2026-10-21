import { CodeSnippet, Tabs } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../lib/paths';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';

const REACT_APP = `import 'pada-ds/styles.css'; // tokens (light and dark) and component styles
import 'pada-ds/base.css';   // optional: body background, colour and font
import { Button, Dialog, Toaster, toast } from 'pada-ds';

export function App() {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>Edit profile</Button>
        </Dialog.Trigger>
        <Dialog.Content size="sm">
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>…</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button onClick={() => toast.success({ title: 'Saved' })}>Save</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <Toaster />
    </>
  );
}`;

const ANGULAR_STYLES = `// styles.scss
@import 'pada-ds-angular/styles.css'; // tokens (light and dark) and component styles
@import 'pada-ds-angular/base.css';   // optional: body background, colour and font`;

const ANGULAR_APP = `import { Component, signal } from '@angular/core';
import { ButtonComponent, DialogParts } from 'pada-ds-angular';

@Component({
  selector: 'app-profile',
  imports: [ButtonComponent, ...DialogParts],
  template: \`
    <ds-dialog [(open)]="editing">
      <button dsButton dsDialogTrigger>Edit profile</button>
      <ds-dialog-content size="sm">
        <ds-dialog-header>
          <ds-dialog-title>Edit profile</ds-dialog-title>
        </ds-dialog-header>
        <ds-dialog-body>…</ds-dialog-body>
      </ds-dialog-content>
    </ds-dialog>
  \`,
})
export class Profile {
  editing = signal(false);
}`;

export function GettingStarted() {
  return (
    <DocsLayout
      toc={[
        { id: 'install', label: 'Install' },
        { id: 'first-component', label: 'First component' },
        { id: 'theme', label: 'Set the theme' },
        { id: 'fonts', label: 'Fonts' },
        { id: 'requirements', label: 'Requirements' },
        { id: 'next', label: 'Next steps' },
      ]}
    >
      <article className="doc">
        <DocHeader eyebrow="Guides" title="Getting started" lede="Install Pada for your framework, import the styles once, and every component is ready, in light and dark." />

        <DocSection id="install" title="Install">
          <Tabs.Root variant="pills" defaultValue="react">
            <Tabs.List aria-label="Framework">
              <Tabs.Trigger value="react">React</Tabs.Trigger>
              <Tabs.Trigger value="angular">Angular</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="react">
              <CodeSnippet code="npm install pada-ds" language="bash" type="single-line" label="Terminal" />
              <p>Peer dependencies: <code>react</code> and <code>react-dom</code> 19.</p>
            </Tabs.Content>
            <Tabs.Content value="angular">
              <CodeSnippet code="npm install pada-ds-angular" language="bash" type="single-line" label="Terminal" />
              <p>Peer dependencies: Angular 21 and the CDK (<code>@angular/core</code>, <code>@angular/common</code>, <code>@angular/forms</code>, <code>@angular/cdk</code>).</p>
            </Tabs.Content>
          </Tabs.Root>
        </DocSection>

        <DocSection id="first-component" title="Your first component">
          <Tabs.Root variant="pills" defaultValue="react">
            <Tabs.List aria-label="Framework">
              <Tabs.Trigger value="react">React</Tabs.Trigger>
              <Tabs.Trigger value="angular">Angular</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="react">
              <p>Import the styles once at the root of the app, then import components by name. Components with parts are compound (<code>Dialog.Root</code>, <code>Dialog.Content</code> …); simple ones are single components with props.</p>
              <CodeSnippet code={REACT_APP} language="tsx" type="multi-line" label="App.tsx" />
            </Tabs.Content>
            <Tabs.Content value="angular">
              <p>Add the styles to your global stylesheet, then import standalone components and parts into the components that use them.</p>
              <CodeSnippet code={ANGULAR_STYLES} language="scss" type="multi-line" label="styles.scss" />
              <CodeSnippet code={ANGULAR_APP} language="typescript" type="multi-line" label="profile.ts" />
              <p>Components are standalone and OnPush, with signal inputs, <code>model()</code> two-way bindings and <code>output()</code> events. Form controls implement <code>ControlValueAccessor</code>.</p>
            </Tabs.Content>
          </Tabs.Root>
        </DocSection>

        <DocSection id="theme" title="Set the theme">
          <p>The theme follows the operating system. Set attributes on <code>&lt;html&gt;</code> (or any container) to choose a theme, accent, density or radius:</p>
          <CodeSnippet code={'<html data-theme="dark" data-accent="emerald" data-density="compact" data-radius="lg">'} language="html" type="single-line" label="index.html" />
          <p>In React, <code>ThemeProvider</code> sets the same attributes from state and remembers the choice. <RouterLink to={ROUTES.theming}>Read the theming guide</RouterLink>.</p>
        </DocSection>

        <DocSection id="fonts" title="Fonts">
          <p>Pada uses the system font stack by default. To use your brand font, set the font tokens once:</p>
          <CodeSnippet code={":root {\n  --pada-font-sans: 'Inter', system-ui, sans-serif;\n  --pada-font-mono: 'JetBrains Mono', ui-monospace, monospace;\n}"} language="css" type="multi-line" label="global.css" />
        </DocSection>

        <DocSection id="requirements" title="Requirements">
          <ul className="doc-list">
            <li>The tokens use <code>light-dark()</code>, <code>color-mix()</code> and relative colours: Chrome 123, Safari 18, Firefox 128 or later.</li>
            <li>Server rendering works in both packages; this site is prerendered with <code>pada-ds</code>.</li>
            <li>TypeScript types ship with both packages.</li>
          </ul>
        </DocSection>

        <DocSection id="next" title="Next steps">
          <ul className="doc-list">
            <li><RouterLink to={ROUTES.components}>Browse the components</RouterLink> and read when to use each one.</li>
            <li><RouterLink to={ROUTES.tokens}>Learn the token tiers</RouterLink> before writing custom CSS.</li>
            <li><RouterLink to={ROUTES.ai}>Set up your coding agent</RouterLink> to write Pada code.</li>
          </ul>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
