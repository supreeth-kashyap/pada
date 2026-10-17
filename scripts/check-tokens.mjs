// Fails when component CSS reads a custom property that nothing defines. Undefined tokens
// fall back silently in the browser (the property just inherits), so they only show up as
// subtle visual bugs; this catches them at test time instead.
//
// A property counts as defined when it is declared in the token stylesheets, declared in
// any component stylesheet (component-local variables such as --pill-padding), or set
// from TSX as a style key ('--indexer-offset': …).
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(rootDir, 'src');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

const DECLARATION = /(--[\w-]+)\s*:/g;
const TSX_STYLE_KEY = /['"](--[\w-]+)['"]\s*:/g;
const REFERENCE = /var\(\s*(--[\w-]+)/g;

export async function findUndefinedTokens({
  scanDirs = ['components', 'headless'],
  tokenFiles = ['styles/tokens.generated.css'],
} = {}) {
  const defined = new Set();
  const addMatches = (text, pattern) => {
    for (const match of text.matchAll(pattern)) defined.add(match[1]);
  };

  for (const file of tokenFiles) {
    const text = await readFile(path.join(srcDir, file), 'utf8').catch(() => '');
    addMatches(text, DECLARATION);
  }

  const scanned = [];
  for (const dir of scanDirs) {
    const files = await walk(path.join(srcDir, dir)).catch(() => []);
    scanned.push(...files);
  }

  const cssFiles = scanned.filter((file) => file.endsWith('.css'));
  const tsxFiles = scanned.filter((file) => /\.tsx?$/.test(file));

  const cssTexts = await Promise.all(cssFiles.map((file) => readFile(file, 'utf8')));
  cssTexts.forEach((text) => addMatches(text, DECLARATION));
  for (const file of tsxFiles) addMatches(await readFile(file, 'utf8'), TSX_STYLE_KEY);

  const problems = [];
  cssFiles.forEach((file, index) => {
    cssTexts[index].split('\n').forEach((line, lineIndex) => {
      for (const match of line.matchAll(REFERENCE)) {
        if (!defined.has(match[1])) {
          problems.push(`${path.relative(rootDir, file)}:${lineIndex + 1} ${match[1]}`);
        }
      }
    });
  });
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = await findUndefinedTokens();
  if (problems.length) {
    console.error(`Undefined custom properties:\n${problems.join('\n')}`);
    process.exit(1);
  }
  console.log('All custom property references are defined.');
}
