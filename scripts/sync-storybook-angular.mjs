// Copies the shared Storybook docs into pada-ds-angular, so both Storybooks have the same Docs
// pages and the same component docs page:
//
//   npm run docs:data && npm run storybook:sync -- ../pada-ds-angular
//
// - projects/pada-ds/.storybook/pada-docs/{blocks.ts, foundations.ts, pada-docs.css}
// - content/docs.json → .storybook/pada-docs/docs.json (read by the Angular docs-data.ts)
// - projects/pada-ds/stories/docs/**/*.mdx, except React-only pages
//
// Each copied file starts with a header saying where it came from. Edit them in this repo.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];
if (!target) {
  console.error('Usage: npm run storybook:sync -- <path to pada-ds-angular>');
  process.exit(1);
}

const version = JSON.parse(await readFile(path.join(rootDir, 'projects/pada-ds/package.json'), 'utf8')).version;
const header = `Synced from pada ${version} by scripts/sync-storybook-angular.mjs. Do not edit here.`;
const srcDocs = path.join(rootDir, 'projects/pada-ds/.storybook/pada-docs');
const destDocs = path.resolve(target, 'projects/pada-ds/.storybook/pada-docs');
const srcPages = path.join(rootDir, 'projects/pada-ds/stories/docs');
const destPages = path.resolve(target, 'projects/pada-ds/stories/docs');

/** React-only pages, with the Angular page written in their place. */
const REPLACE = {
  'foundations/Icons.mdx': `import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Docs/Foundations/Icons" />

# Icons

Pada's built-in icons take the current text colour, size with \`--pada-icon-size-*\`, and are
decorative (\`aria-hidden\`) unless you give them a \`label\`. In Angular the set loads as a separate
chunk on first use; \`await loadIconNames()\` lists the names.

\`\`\`html
<ds-icon name="tick_1" [size]="16" />
<ds-icon name="alert_1" label="Warning" />
\`\`\`

See every icon in the **Display / Icon** stories. Use **IconButton** for icon-only actions.
`,
};

const written = [];
const write = async (file, body) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  written.push(path.relative(path.resolve(target), file));
};

await mkdir(destDocs, { recursive: true });
for (const name of ['blocks.ts', 'foundations.ts', 'pada-docs.css']) {
  const body = await readFile(path.join(srcDocs, name), 'utf8');
  await write(path.join(destDocs, name), `/* ${header} */\n${body}`);
}
await write(path.join(destDocs, 'docs.json'), await readFile(path.join(rootDir, 'content/docs.json'), 'utf8'));
await write(
  path.join(destDocs, 'docs-data.ts'),
  `/* ${header} */\n// The docs content (content/docs.json in the pada repo), synced next to this file.\nimport docs from './docs.json';\n\nexport default docs;\n`,
);

async function mdxFiles(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await mdxFiles(path.join(dir, entry.name), rel)));
    else if (entry.name.endsWith('.mdx')) out.push(rel);
  }
  return out;
}

for (const rel of await mdxFiles(srcPages)) {
  const body = REPLACE[rel] ?? (await readFile(path.join(srcPages, rel), 'utf8'));
  await write(path.join(destPages, rel), `{/* ${header} */}\n\n${body}`);
}

console.log(`Wrote ${written.length} files:\n  ${written.join('\n  ')}`);
