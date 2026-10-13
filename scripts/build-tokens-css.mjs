import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expandThemeCss } from './theme-css.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const primitivesPath = path.join(rootDir, 'src/styles/primitives.css');
const globalPath = path.join(rootDir, 'src/styles/global.css');
const basePath = path.join(rootDir, 'src/styles/base.css');
const distDir = path.join(rootDir, 'dist');
const outputPath = path.join(distDir, 'tokens.css');
const baseOutputPath = path.join(distDir, 'base.css');

const [primitivesCss, globalCss, baseCss] = await Promise.all([
  readFile(primitivesPath, 'utf8'),
  readFile(globalPath, 'utf8'),
  readFile(basePath, 'utf8'),
]);

const output = [
  '/* pada-ds design tokens */',
  primitivesCss.trim(),
  '',
  '/* pada-ds semantic theme tokens */',
  expandThemeCss(globalCss).trim(),
  '',
].join('\n');

// tokens.css must only declare custom properties; element resets belong in base.css.
if (/(^|[\s,}])(body|p)\s*[{,]/m.test(output)) {
  throw new Error('dist/tokens.css must not contain body or p rules; put them in src/styles/base.css');
}

await mkdir(distDir, { recursive: true });
await writeFile(outputPath, output, 'utf8');
await writeFile(baseOutputPath, `/* pada-ds optional base styles */\n${baseCss.trim()}\n`, 'utf8');

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
console.log(`Generated ${path.relative(rootDir, baseOutputPath)}`);
