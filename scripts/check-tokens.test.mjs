import assert from 'node:assert/strict';
import test from 'node:test';
import { findUndefinedTokens } from './check-tokens.mjs';

test('component CSS only reads defined custom properties', async () => {
  assert.deepEqual(await findUndefinedTokens(), []);
});
