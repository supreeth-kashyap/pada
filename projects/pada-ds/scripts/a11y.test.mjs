import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';
import { rootDir } from './component-manifest.mjs';

// Components are loaded through Vite (TSX + CSS imports) and rendered to static markup:
// these tests check the ARIA wiring each component renders on the server, and the pure
// keyboard-navigation logic behind Select. Overlays render through a portal, which only
// exists in the browser, so their tests are Vitest component tests (src/**/*.test.tsx).
const server = await createServer({
  root: rootDir,
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
  esbuild: { jsx: 'automatic' },
});
after(() => server.close());

const load = (file) => server.ssrLoadModule(`/src/components/${file}`);
const render = (element) => ReactDOMServer.renderToStaticMarkup(element);
const h = React.createElement;

// The first opening tag in `markup` that contains `marker`, e.g. 'role="dialog"'.
function tagWith(markup, marker) {
  const tag = markup.match(/<[a-z0-9]+\b[^>]*>/g)?.find((candidate) => candidate.includes(marker));
  assert.ok(tag, `no element with ${marker} in ${markup}`);
  return tag;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

const fruit = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', disabled: true },
  { label: 'Cherry', value: 'cherry' },
];

test('Select label points at the combobox trigger', async () => {
  const { Select } = await load('Select/Select.tsx');

  for (const props of [{ id: 'fruit' }, { name: 'fruit-name' }, {}]) {
    const markup = render(h(Select, { label: 'Fruit', options: fruit, ...props }));
    const label = tagWith(markup, '<label');
    const trigger = tagWith(markup, 'role="combobox"');
    const triggerId = attr(trigger, 'id');
    assert.ok(triggerId, `trigger has an id for ${JSON.stringify(props)}`);
    assert.equal(attr(label, 'for'), triggerId);
    if (props.id) assert.equal(triggerId, 'fruit');
    if (props.name) assert.equal(triggerId, 'fruit-name');
    assert.equal(attr(trigger, 'aria-haspopup'), 'listbox');
    assert.equal(attr(trigger, 'aria-expanded'), 'false');
    // Closed: nothing to control or point at, and the label (not aria-label) names it.
    assert.equal(attr(trigger, 'aria-controls'), undefined);
    assert.equal(attr(trigger, 'aria-activedescendant'), undefined);
    assert.equal(attr(trigger, 'aria-label'), undefined);
  }

  const two = render(h('div', null, h(Select, { label: 'A', options: fruit }), h(Select, { label: 'B', options: fruit })));
  const ids = two.match(/<button[^>]*>/g).map((tag) => attr(tag, 'id'));
  assert.equal(new Set(ids).size, 2, 'generated trigger ids are unique');
});

test('ComboBox with an id renders addressable options with aria-selected', async () => {
  const { ComboBox } = await load('ComboBox/ComboBox.tsx');
  const markup = render(
    h(ComboBox, {
      id: 'list',
      'aria-labelledby': 'list-label',
      items: [
        { id: 'a', label: 'Apple', selected: true },
        { id: 'b', label: 'Banana', disabled: true },
        { id: 'c', label: 'Cherry', active: true },
      ],
    }),
  );

  const listbox = tagWith(markup, 'role="listbox"');
  assert.equal(attr(listbox, 'id'), 'list');
  assert.equal(attr(listbox, 'aria-labelledby'), 'list-label');

  const options = markup.match(/<button[^>]*>/g);
  assert.equal(options.length, 3);
  options.forEach((option, index) => {
    assert.equal(attr(option, 'role'), 'option');
    assert.equal(attr(option, 'id'), `list-option-${index}`);
    assert.equal(attr(option, 'tabindex'), '-1');
  });
  assert.deepEqual(options.map((option) => attr(option, 'aria-selected')), ['true', 'false', 'false']);
  assert.deepEqual(options.map((option) => attr(option, 'data-active')), [undefined, undefined, '']);
  assert.ok(options[1].includes(' disabled'));

  // Without an id, the listbox manages focus itself: no option ids, and one tab stop (the
  // selected option, else the first enabled one).
  const plain = render(
    h(ComboBox, {
      items: [
        { id: 'a', label: 'Apple', disabled: true },
        { id: 'b', label: 'Banana' },
        { id: 'c', label: 'Cherry', selected: true },
      ],
    }),
  );
  const plainOptions = [...plain.matchAll(/<button[^>]*role="option"[^>]*>/g)].map((match) => match[0]);
  assert.deepEqual(plainOptions.map((option) => attr(option, 'id')), [undefined, undefined, undefined]);
  assert.deepEqual(plainOptions.map((option) => attr(option, 'tabindex')), ['-1', '-1', '0']);
});

test('Select keyboard navigation skips disabled options and stops at the ends', async () => {
  const { findEnabledIndex } = await load('Select/selectNavigation.ts');
  const options = [
    { label: 'Disabled first', disabled: true },
    { label: 'Apple' },
    { label: 'Banana', disabled: true },
    { label: 'Cherry' },
    { label: 'Disabled last', disabled: true },
  ];

  assert.equal(findEnabledIndex(options, -1, 'Home'), 1);
  assert.equal(findEnabledIndex(options, 3, 'Home'), 1);
  assert.equal(findEnabledIndex(options, -1, 'End'), 3);
  assert.equal(findEnabledIndex(options, 1, 'ArrowDown'), 3);
  assert.equal(findEnabledIndex(options, 3, 'ArrowDown'), 3);
  assert.equal(findEnabledIndex(options, 3, 'ArrowUp'), 1);
  assert.equal(findEnabledIndex(options, 1, 'ArrowUp'), 1);
  assert.equal(findEnabledIndex(options, -1, 'ArrowDown'), 1);
  assert.equal(findEnabledIndex(options, -1, 'ArrowUp'), 3);

  const allDisabled = [{ label: 'A', disabled: true }];
  for (const key of ['Home', 'End', 'ArrowDown', 'ArrowUp']) {
    assert.equal(findEnabledIndex(allDisabled, -1, key), -1);
  }
  assert.equal(findEnabledIndex([], -1, 'Home'), -1);
});

test('Select type-ahead jumps to the next enabled option by first letter', async () => {
  const { findTypeaheadIndex } = await load('Select/selectNavigation.ts');
  const options = [{ label: 'Apple' }, { label: 'Avocado', disabled: true }, { label: 'Apricot' }, { label: 'Banana' }];

  assert.equal(findTypeaheadIndex(options, -1, 'a'), 0);
  assert.equal(findTypeaheadIndex(options, 0, 'A'), 2);
  assert.equal(findTypeaheadIndex(options, 2, 'a'), 0);
  assert.equal(findTypeaheadIndex(options, 0, 'b'), 3);
  assert.equal(findTypeaheadIndex(options, 3, 'z'), 3);
});

