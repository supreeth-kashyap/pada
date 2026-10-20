import { useState } from 'react';
import { Button, CodeSnippet, Dialog, InputText, Tabs } from 'pada-ds';

const REACT_CODE = `import { Button, Dialog, InputText } from 'pada-ds';

export function EditProfile() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <InputText label="Name" defaultValue="Ada" />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>Save changes</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}`;

const ANGULAR_CODE = `import { Component } from '@angular/core';
import { ButtonComponent, DialogParts, InputTextComponent } from 'pada-ds-angular';

@Component({
  selector: 'app-edit-profile',
  imports: [ButtonComponent, ...DialogParts, InputTextComponent],
  template: \`
    <ds-dialog>
      <button dsButton variant="secondary" dsDialogTrigger>Edit profile</button>
      <ds-dialog-content size="sm">
        <ds-dialog-header>
          <ds-dialog-title>Edit profile</ds-dialog-title>
        </ds-dialog-header>
        <ds-dialog-body>
          <ds-input-text label="Name" value="Ada" />
        </ds-dialog-body>
        <ds-dialog-footer>
          <button dsButton dsDialogClose>Save changes</button>
        </ds-dialog-footer>
      </ds-dialog-content>
    </ds-dialog>
  \`,
})
export class EditProfileComponent {}`;

export function FrameworkSection() {
  const [framework, setFramework] = useState('react');
  return (
    <section className="section framework" aria-labelledby="framework-title">
      <div className="wrap framework-grid">
        <div className="framework-copy" data-reveal>
          <p className="eyebrow">Two frameworks, one system</p>
          <h2 id="framework-title" className="h2">
            Same parts. Same keys. <span className="serif">Same pixels.</span>
          </h2>
          <p className="lede">
            <code>pada-ds</code> and <code>pada-ds-angular</code> ship the same components, parts, keyboard maps,
            tokens and motion, released together under one version. Your React and Angular teams finally build
            the same product.
          </p>
          <ul className="check-list">
            <li>Compound parts in React, content projection and signals in Angular</li>
            <li>Identical <code>data-*</code> and <code>aria-*</code> state attributes</li>
            <li>One token file, synced from a single source</li>
          </ul>
          <div className="framework-preview">
            <span className="preview-label">Rendered live</span>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="secondary" leftIcon="edit_1">Edit profile</Button>
              </Dialog.Trigger>
              <Dialog.Content size="sm">
                <Dialog.Header>
                  <Dialog.Title>Edit profile</Dialog.Title>
                  <Dialog.Description>This dialog is the real component from pada-ds.</Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <InputText label="Name" defaultValue="Ada Lovelace" />
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button>Save changes</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
        <div className="framework-code" data-reveal style={{ ['--reveal-delay' as string]: '0.1s' }}>
          <Tabs.Root variant="pills" value={framework} onValueChange={setFramework}>
            <Tabs.List aria-label="Framework">
              <Tabs.Trigger value="react">React</Tabs.Trigger>
              <Tabs.Trigger value="angular">Angular</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="react">
              <CodeSnippet code={REACT_CODE} language="tsx" type="multi-line" label="EditProfile.tsx" />
            </Tabs.Content>
            <Tabs.Content value="angular">
              <CodeSnippet code={ANGULAR_CODE} language="typescript" type="multi-line" label="edit-profile.ts" />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </section>
  );
}
