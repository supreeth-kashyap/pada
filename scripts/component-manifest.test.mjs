import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import {
  buildManifest,
  createEntryProgram,
  renderLlmsFullTxt,
  renderLlmsTxt,
  resolveExport,
  rootDir,
  usageExample,
} from './component-manifest.mjs';

const manifest = buildManifest();
const byName = new Map(manifest.components.map((component) => [component.name, component]));

// Found with the type checker rather than the generator's syntax rules: any PascalCase
// value export that is callable (a function or React exotic component), except contexts.
function exportedComponentNames() {
  const { checker, exports } = createEntryProgram();
  return exports
    .filter((symbol) => /^[A-Z]/.test(symbol.getName()) && !symbol.getName().endsWith('Context'))
    .filter((symbol) => {
      const target = resolveExport(checker, symbol);
      if (!target.valueDeclaration) return false;
      const type = checker.getTypeOfSymbolAtLocation(target, target.valueDeclaration);
      return checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0;
    })
    .map((symbol) => symbol.getName());
}

test('every component exported from the package entry is in the manifest', () => {
  const exported = exportedComponentNames();
  assert.ok(exported.includes('Button'), 'expected the type checker to find Button');
  const missing = exported.filter((name) => !byName.has(name));
  assert.deepEqual(missing, [], `missing from the manifest: ${missing.join(', ')}`);
  const topLevel = manifest.components.filter((component) => !component.name.includes('.'));
  assert.equal(topLevel.length, exported.length);
});

test('every component has its props, with name, type and required flag', () => {
  for (const component of manifest.components) {
    assert.equal(component.importPath, 'pada-ds');
    // Compound parts such as Dialog.Header may only forward native element props.
    assert.ok(component.props.length > 0 || component.extends.length > 0, `${component.name} has no props`);
    for (const prop of component.props) {
      assert.ok(prop.name, `${component.name} has a prop without a name`);
      assert.ok(prop.type, `${component.name}.${prop.name} has no type`);
      assert.equal(typeof prop.required, 'boolean');
    }
  }
});

test('props, types, defaults and descriptions come from the source', () => {
  const button = byName.get('Button');
  assert.deepEqual(button.props.find((prop) => prop.name === 'variant'), {
    name: 'variant',
    type: 'ButtonVariant',
    required: false,
    default: "'primary'",
    description: "Visual emphasis. Inside a `ButtonGroup` or `SplitButton.Root`, defaults to the group's.",
  });
  assert.deepEqual(button.extends, ['React.ButtonHTMLAttributes<HTMLButtonElement>']);

  const accordion = byName.get('Accordion');
  assert.deepEqual(
    accordion.props.map((prop) => prop.name),
    ['header', 'headerIconName', 'children', 'defaultOpen', 'open', 'onOpenChange', 'className', 'disabled', 'headingLevel'],
  );
  // Destructured without a default, so none is reported.
  assert.equal(accordion.props.find((prop) => prop.name === 'open').default, null);
  assert.equal(accordion.props.find((prop) => prop.name === 'headingLevel').default, '3');
  assert.equal(accordion.props.find((prop) => prop.name === 'header').required, true);

  // forwardRef components and non-exported props interfaces are both read.
  assert.equal(byName.get('Switch').props.find((prop) => prop.name === 'loading').default, 'false');
  assert.equal(byName.get('Tabs').props.find((prop) => prop.name === 'defaultValue').default, '0');

  assert.equal(
    byName.get('Select').props.find((prop) => prop.name === 'defaultValue').description,
    'Uncontrolled initial value. Ignored when `value` is provided.',
  );

  for (const name of ['ListContext', 'TableContext', 'TextSize']) {
    assert.equal(byName.has(name), false, `${name} is not a component`);
  }
});

test('compound components list their parts, imported through the namespace', () => {
  const content = byName.get('Dialog.Content');
  assert.ok(content, 'Dialog.Content is in the manifest');
  assert.equal(content.import, "import { Dialog } from 'pada-ds';");
  assert.ok(content.props.some((prop) => prop.name === 'size'));
  for (const part of ['Dialog.Root', 'Dialog.Title', 'Drawer.Content', 'DropdownMenu.Item', 'Popover.Trigger', 'Tooltip.Provider']) {
    assert.ok(byName.has(part), `${part} is in the manifest`);
  }
  // The 1.x call signature stays documented next to the parts.
  assert.ok(byName.has('Popover') && byName.has('Tooltip'));
});

test('usage examples pass only required props', () => {
  assert.equal(usageExample(byName.get('Button')), '<Button />');
  assert.equal(
    usageExample(byName.get('Modal')),
    '<Modal open={true} onOpenChange={() => {}}>...</Modal>',
  );
  assert.equal(usageExample(byName.get('Tooltip')), '<Tooltip content="..."><span>...</span></Tooltip>');
});

test('llms.txt and llms-full.txt at the repo root are up to date', async () => {
  const [llms, llmsFull] = await Promise.all([
    readFile(path.join(rootDir, 'llms.txt'), 'utf8'),
    readFile(path.join(rootDir, 'llms-full.txt'), 'utf8'),
  ]);
  const hint = 'run `npm run build:manifest` and commit llms.txt and llms-full.txt';
  assert.equal(llms, renderLlmsTxt(manifest), hint);
  assert.equal(llmsFull, renderLlmsFullTxt(manifest), hint);
});

test('llms files mention the install, imports, stylesheets and every component', () => {
  const llms = renderLlmsTxt(manifest);
  const llmsFull = renderLlmsFullTxt(manifest);
  for (const text of ['npm install pada-ds', "from 'pada-ds'", 'pada-ds/tokens.css', 'pada-ds/styles.css', 'data-theme']) {
    assert.ok(llms.includes(text), `llms.txt is missing ${text}`);
  }
  for (const component of manifest.components) {
    const marker = component.deprecated ? ' (deprecated)' : '';
    assert.ok(llms.includes(`\n- ${component.name}${marker}: `), `llms.txt is missing ${component.name}`);
    assert.ok(llmsFull.includes(`\n### ${component.name}\n`), `llms-full.txt is missing ${component.name}`);
  }
  // Deprecated components say so, with what to use instead.
  assert.match(byName.get('Modal').deprecated, /Dialog/);
  assert.match(byName.get('FormLabel').deprecated, /Field/);
  assert.equal(byName.get('Dialog.Root').deprecated, null);
});
