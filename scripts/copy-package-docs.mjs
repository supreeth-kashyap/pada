// Copies the repo's README, LICENSE and CHANGELOG into the pada-ds workspace so they ship in
// the package. They are generated copies (git-ignored), so the README there never drifts from
// the root one. `npm run build` runs this, which covers `npm pack` and the release workflow.
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDir = path.join(rootDir, 'projects/pada-ds');

for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md']) {
  await copyFile(path.join(rootDir, file), path.join(packageDir, file));
}
console.log('Copied README.md, LICENSE and CHANGELOG.md into projects/pada-ds');
