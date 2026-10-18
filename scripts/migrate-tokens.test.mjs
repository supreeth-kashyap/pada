import assert from 'node:assert/strict';
import test from 'node:test';
import { migrateText } from './migrate-tokens.mjs';

test('rewrites 1.x names to their exact 2.0 equivalents', () => {
  const { output, changes } = migrateText('a{color:var(--color-primary-600);padding:var(--spacing-4) var(--size-2);border-radius:var(--radius);box-shadow:var(--shadow)}');
  assert.equal(output, 'a{color:var(--pada-color-accent-600);padding:var(--pada-space-4) var(--pada-space-2);border-radius:var(--pada-radius-sm);box-shadow:var(--pada-shadow-sm)}');
  assert.equal(changes, 5);
});

test('keeps raw palette colours unthemed unless --themed is passed', () => {
  assert.equal(migrateText('var(--color-red-600)').output, 'var(--pada-ref-red-600)');
  assert.equal(migrateText('var(--color-red-600)', { themed: true }).output, 'var(--pada-color-red-600)');
  assert.equal(migrateText('var(--color-stone-200)', { themed: true }).output, 'var(--pada-color-neutral-200)');
});

test('reports names with no single 2.0 token instead of rewriting them', () => {
  const { output, manual } = migrateText('var(--color-white) var(--z-index-10) var(--my-own-token)');
  assert.equal(output, 'var(--color-white) var(--z-index-10) var(--my-own-token)');
  assert.deepEqual(manual, ['--color-white', '--z-index-10']);
});
