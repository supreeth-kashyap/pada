// Copies the built tokens into the Angular library (pada-ds-angular), which consumes them as
// files rather than as an npm dependency.
//
//   npm run build:tokens && npm run tokens:sync -- ../pada-ds-angular
//
// Each copied file starts with a header naming the source version and a hash of the body.
// The Angular repo's `tokens:check` recomputes the hash and fails CI if the file was edited
// by hand, so every change has to come from this repo.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];
if (!target) {
  console.error('Usage: npm run tokens:sync -- <path to pada-ds-angular>');
  process.exit(1);
}

const pkg = JSON.parse(await readFile(path.join(rootDir, 'package.json'), 'utf8'));
const destDir = path.resolve(target, 'projects/pada-ds/src/styles');
await mkdir(destDir, { recursive: true });

const FILES = [
  ['tokens.css', 'tokens.css', (header) => `/* ${header} */`],
  ['tokens.scss', '_tokens.scss', (header) => `// ${header}`],
];

for (const [source, dest, comment] of FILES) {
  const body = await readFile(path.join(rootDir, 'dist', source), 'utf8').catch(() => {
    throw new Error(`dist/${source} is missing. Run \`npm run build:tokens\` first.`);
  });
  const hash = createHash('sha256').update(body).digest('hex');
  const header = comment(`pada-tokens v${pkg.version} sha256:${hash} (synced from pada-ds; do not edit)`);
  await writeFile(path.join(destDir, dest), `${header}\n${body}`, 'utf8');
  console.log(`Wrote ${path.join(destDir, dest)}`);
}
