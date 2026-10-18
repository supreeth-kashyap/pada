import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const headlessDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/headless');

async function sources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? sources(path.join(dir, entry.name)) : [path.join(dir, entry.name)])),
  );
  return nested.flat().filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file));
}

test('the headless entry imports no stylesheets and nothing from the styled components', async () => {
  for (const file of await sources(headlessDir)) {
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /import\s+['"][^'"]+\.css['"]/, `${file} imports CSS`);
    assert.doesNotMatch(text, /from\s+['"][./]*\.\.\/components\//, `${file} imports a styled component`);
  }
});
