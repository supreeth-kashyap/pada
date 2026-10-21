import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildManifest, renderLlmsFullTxt, renderLlmsTxt, rootDir } from './component-manifest.mjs';

// Writes dist/manifest.json and the repo-root llms.txt / llms-full.txt from the TypeScript
// source. With `--check`, writes nothing and fails if the committed llms files are stale.

const check = process.argv.includes('--check');

const manifest = buildManifest();
const llmsFiles = {
  'llms.txt': renderLlmsTxt(manifest),
  'llms-full.txt': renderLlmsFullTxt(manifest),
};

if (check) {
  const stale = [];
  for (const [name, expected] of Object.entries(llmsFiles)) {
    const actual = await readFile(path.join(rootDir, name), 'utf8').catch(() => null);
    if (actual !== expected) stale.push(name);
  }
  if (stale.length) {
    console.error(`Stale: ${stale.join(', ')}. Run \`npm run build:manifest\` and commit the result.`);
    process.exit(1);
  }
  console.log(`llms.txt and llms-full.txt are up to date (${manifest.components.length} components).`);
} else {
  const distDir = path.join(rootDir, 'dist');
  await mkdir(distDir, { recursive: true });
  await writeFile(path.join(distDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  for (const [name, content] of Object.entries(llmsFiles)) {
    await writeFile(path.join(rootDir, name), content, 'utf8');
  }
  console.log(`Generated dist/manifest.json (${manifest.components.length} components)`);
  console.log('Generated llms.txt');
  console.log('Generated llms-full.txt');
}
