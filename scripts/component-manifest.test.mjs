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
  assert.equal(manifest.components.length, exported.length);
});

test('every component has its props, with name, type and required flag', () => {
  for (const component of manifest.components) {
    assert.equal(component.importPath, 'pada-ds');
    assert.ok(component.props.length > 0, `${component.name} has no props`);
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
    description: '',
  });
  assert.deepEqual(button.extends, ['React.ButtonHTMLAttributes<HTMLButtonElement>']);

  const accordion = byName.get('Accordion');
  assert.deepEqual(
    accordion.props.map((prop) => prop.name),
    ['header', 'headerIconName', 'children', 'defaultOpen', 'open', 'onOpenChange', 'className', 'disabled'],
  );
  // `open: controlledOpen` is renamed in the destructuring and has no default.
  assert.equal(accordion.props.find((prop) => prop.name === 'open').default, null);
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
    assert.ok(llms.includes(`\n- ${component.name}: `), `llms.txt is missing ${component.name}`);
    assert.ok(llmsFull.includes(`\n### ${component.name}\n`), `llms-full.txt is missing ${component.name}`);
  }
});
