import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildOutputs, GENERATED_CSS } from './build-tokens.mjs';
import { tokens, knobs, axes, legacyAlias } from '../tokens/index.mjs';

const outputs = buildOutputs();
const declared = (css) => new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));

test('src/styles/tokens.generated.css is up to date', async () => {
  const committed = await readFile(GENERATED_CSS, 'utf8');
  assert.equal(committed, outputs.css, 'Run `npm run build:tokens` and commit the result.');
});

test('every Pada 1.x token name is still defined', async () => {
  const legacyNames = JSON.parse(await readFile(new URL('../tokens/legacy-names.json', import.meta.url), 'utf8'));
  const names = declared(outputs.css);
  const missing = legacyNames.filter((name) => !names.has(name));
  assert.deepEqual(missing, []);
});

test('legacy aliases only point at tokens that exist', () => {
  const names = declared(outputs.css);
  const legacyNames = [...outputs.css.matchAll(/^ {2}(--(?!pada-)[\w-]+):/gm)].map((match) => match[1]);
  for (const name of legacyNames) {
    for (const ref of legacyAlias(name).matchAll(/var\((--[\w-]+)\)/g)) {
      assert.ok(names.has(ref[1]), `${name} -> ${ref[1]} is undefined`);
    }
  }
});

test('every var() in the token CSS resolves to a declared token', () => {
  const names = declared(outputs.css);
  const missing = [...outputs.css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]).filter((name) => !names.has(name));
  assert.deepEqual([...new Set(missing)], []);
});

test('axis options only set knobs or palettes', () => {
  const settable = new Set(knobs.map((knob) => knob.name));
  for (const [axis, options] of Object.entries(axes)) {
    for (const [option, values] of Object.entries(options)) {
      for (const name of Object.keys(values)) {
        assert.ok(settable.has(name) || name.startsWith('palette-'), `data-${axis}="${option}" sets ${name}`);
      }
    }
  }
});

test('token names are unique and use the documented tiers', () => {
  const seen = new Set();
  for (const token of tokens) {
    assert.ok(!seen.has(token.name), `duplicate ${token.name}`);
    seen.add(token.name);
    assert.ok([0, 1, 2].includes(token.tier), `${token.name} has tier ${token.tier}`);
    assert.equal(token.name.startsWith('ref-'), token.tier === 0, `${token.name}: only ref-* tokens are tier 0`);
  }
});

test('the JS and type outputs list the same tokens', () => {
  const jsNames = [...outputs.js.matchAll(/^ {2}"([\w-]+)":/gm)].map((match) => match[1]);
  const dtsNames = [...outputs.dts.matchAll(/^ {2}\| '([\w-]+)'/gm)].map((match) => match[1]);
  assert.deepEqual(jsNames, dtsNames);
  assert.ok(jsNames.includes('color-accent-solid'));
});
