import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const primitivesPath = path.join(rootDir, 'src/styles/primitives.css');
const globalPath = path.join(rootDir, 'src/styles/global.css');
const distDir = path.join(rootDir, 'dist');
const outputPath = path.join(distDir, 'tokens.css');

const [primitivesCss, globalCss] = await Promise.all([
  readFile(primitivesPath, 'utf8'),
  readFile(globalPath, 'utf8'),
]);

const output = [
  '/* pada-ds design tokens */',
  primitivesCss.trim(),
  '',
  '/* pada-ds semantic theme tokens */',
  globalCss.trim(),
  '',
].join('\n');

await mkdir(distDir, { recursive: true });
await writeFile(outputPath, output, 'utf8');

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
