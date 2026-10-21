// Builds content/docs.json, the single source the website and both Storybooks read their docs
// from: every page in content/components/*.md (front matter plus fixed sections), the component
// tokens each component declares in its CSS, and deep links to both Storybooks and both repos.
//
//   node scripts/gen-docs-data.mjs           write content/docs.json
//   node scripts/gen-docs-data.mjs --check   fail if it is stale, or if a component folder in
//                                            either repo has no content page
//
// The Angular checks run when ../pada-ds-angular (or PADA_ANGULAR_DIR) exists.
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(rootDir, 'content/components');
const outFile = path.join(rootDir, 'content/docs.json');
const reactLib = path.join(rootDir, 'projects/pada-ds');
const angularRepo = path.resolve(process.env.PADA_ANGULAR_DIR ?? path.join(rootDir, '../pada-ds-angular'));
const angularLib = path.join(angularRepo, 'projects/pada-ds');
const check = process.argv.includes('--check');

export const LINKS = {
  site: 'https://supreeth-kashyap.github.io/pada/',
  reactStorybook: 'https://main--6ad73b69f7d2adf27e282417.chromatic.com',
  angularStorybook: 'https://main--6ad72a0038bb5d0de784c60f.chromatic.com',
  reactRepo: 'https://github.com/supreeth-kashyap/pada',
  angularRepo: 'https://github.com/supreeth-kashyap/pada-ds-angular',
  reactNpm: 'https://www.npmjs.com/package/pada-ds',
  angularNpm: 'https://www.npmjs.com/package/pada-ds-angular',
  figma: 'https://www.figma.com/community/file/1619638623779328209',
};

export const CATEGORIES = ['Actions', 'Forms', 'Dates', 'Overlays', 'Feedback', 'Navigation', 'Data', 'Display', 'Layout', 'Legacy'];

const SECTION_KEYS = {
  Overview: 'overview',
  'When to use': 'whenToUse',
  'When not to use': 'whenNotToUse',
  'Best practices': 'bestPractices',
  Accessibility: 'accessibility',
  'Use with AI': 'ai',
};

/** Storybook's id sanitiser: "Forms/ComboBox" → "forms-combobox". */
export function storyId(title) {
  return title
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFrontMatter(source, file) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: missing front matter`);
  const data = {};
  for (const line of match[1].split('\n')) {
    const pair = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (!pair) throw new Error(`${file}: bad front matter line "${line}"`);
    data[pair[1]] = pair[2].replace(/^"(.*)"$/, '$1');
  }
  return { data, body: match[2] };
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** The small Markdown subset the content uses: paragraphs, bullet lists, inline code and bold. */
export function renderMarkdown(md) {
  const blocks = md.trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((line) => /^(- |  )/.test(line))) {
        const items = [];
        for (const line of lines) {
          if (line.startsWith('- ')) items.push(line.slice(2));
          else items[items.length - 1] += ` ${line.trim()}`;
        }
        return `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
}

function bulletList(md) {
  const items = [];
  for (const line of md.split('\n')) {
    if (line.startsWith('- ')) items.push(line.slice(2));
    else if (line.startsWith('  ') && items.length) items[items.length - 1] += ` ${line.trim()}`;
  }
  return items.map((item) => inline(item));
}

function parseSections(body, file) {
  const sections = {};
  const parts = body.split(/^## /m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf('\n');
    const heading = part.slice(0, newline).trim();
    const key = SECTION_KEYS[heading];
    if (!key) throw new Error(`${file}: unknown section "## ${heading}"`);
    sections[key] = part.slice(newline + 1).trim();
  }
  return sections;
}

function shapeSections(raw, file) {
  const out = {};
  for (const [key, md] of Object.entries(raw)) {
    if (key === 'bestPractices') {
      const [, doMd = '', dontMd = ''] = /### Do\n([\s\S]*?)\n### Don't\n([\s\S]*)/.exec(md) ?? [];
      if (!doMd) throw new Error(`${file}: Best practices needs "### Do" and "### Don't"`);
      out.do = bulletList(doMd);
      out.dont = bulletList(dontMd);
    } else if (key === 'ai') {
      const prompt = /```text\n([\s\S]*?)\n```/.exec(md);
      if (!prompt) throw new Error(`${file}: Use with AI needs a \`\`\`text block`);
      out.ai = prompt[1].replace(/\n/g, ' ');
    } else if (key === 'whenToUse' || key === 'whenNotToUse' || key === 'accessibility') {
      out[key] = bulletList(md);
    } else {
      out[key] = renderMarkdown(md);
    }
  }
  return out;
}

async function cssFilesFor(dir, name, ext) {
  if (!existsSync(dir)) return [];
  const own = path.join(dir, `${name}.${ext}`);
  if (existsSync(own)) return [own];
  const files = [];
  const walk = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(`.${ext}`)) files.push(full);
    }
  };
  await walk(dir);
  return files.sort();
}

/** Component tokens (`--pada-<component>-*` declared in its stylesheet) and the tokens they read. */
async function tokensFor(files) {
  const declared = new Map();
  const reads = new Set();
  for (const file of files) {
    const css = (await readFile(file, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, name, value] of css.matchAll(/(--pada-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      if (!declared.has(name)) declared.set(name, value.trim().replace(/\s+/g, ' '));
    }
    for (const [, name] of css.matchAll(/var\((--pada-[a-z0-9-]+)/g)) reads.add(name);
  }
  for (const name of declared.keys()) reads.delete(name);
  return {
    component: [...declared].map(([name, value]) => ({ name, value })),
    reads: [...reads].sort(),
  };
}

/** Story titles in `dir`, mapped to their file (relative to `dir`). */
async function storyTitles(dir, pattern) {
  const titles = new Map();
  if (!existsSync(dir)) return null;
  const walk = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') await walk(full);
      else if (pattern.test(entry.name)) {
        const source = await readFile(full, 'utf8');
        const title = /title: '([A-Z][A-Za-z]*\/[A-Za-z]+)'/.exec(source);
        if (title) titles.set(title[1], path.relative(dir, full).split(path.sep).join('/'));
      }
    }
  };
  await walk(dir);
  return titles;
}

function slugify(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Without the Angular repo, Angular-only components keep the tokens recorded last time.
const previous = JSON.parse(await readFile(outFile, 'utf8').catch(() => '{"components":[]}'));
const previousTokens = new Map(previous.components.map((c) => [c.slug, c.tokens]));

const files = (await readdir(contentDir)).filter((file) => file.endsWith('.md')).sort();
const components = [];
for (const file of files) {
  const { data, body } = parseFrontMatter(await readFile(path.join(contentDir, file), 'utf8'), file);
  const slug = file.replace(/\.md$/, '');
  if (slug !== slugify(data.name)) throw new Error(`${file}: file name should be ${slugify(data.name)}.md`);
  if (!CATEGORIES.includes(data.category)) throw new Error(`${file}: unknown category ${data.category}`);
  const legacy = data.status === 'legacy';
  const storyName = data.story ?? data.name;
  const title = storyName === 'none' ? null : `${legacy ? 'Legacy' : data.category}/${storyName}`;

  const react = data.react && data.react !== 'none'
    ? {
        import: data.react,
        dir: data.reactDir,
        storybook: title ? `${LINKS.reactStorybook}/?path=/docs/${storyId(title)}--docs` : null,
        storyTitle: title,
        source: `${LINKS.reactRepo}/tree/main/projects/pada-ds/src/components/${data.reactDir}`,
      }
    : null;
  const angular = data.angular && data.angular !== 'none'
    ? {
        selector: data.angular,
        dir: data.angularDir,
        storybook: title ? `${LINKS.angularStorybook}/?path=/docs/${storyId(title)}--docs` : null,
        storyTitle: title,
        source: `${LINKS.angularRepo}/tree/main/projects/pada-ds/src/lib/${data.angularDir}`,
      }
    : null;

  const cssFiles = react
    ? await cssFilesFor(path.join(reactLib, 'src/components', data.reactDir), data.name, 'css')
    : await cssFilesFor(path.join(angularLib, 'src/lib', data.angularDir), slug, 'scss');

  components.push({
    name: data.name,
    slug,
    category: data.category,
    status: legacy ? 'legacy' : 'stable',
    replacedBy: data.replacedBy ?? null,
    summary: data.summary,
    related: (data.related ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    react,
    angular,
    tokens: !react && !existsSync(angularLib) && previousTokens.has(slug) ? previousTokens.get(slug) : await tokensFor(cssFiles),
    ...shapeSections(parseSections(body, file), file),
  });
}

components.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.name.localeCompare(b.name));

const problems = [];
const names = new Set(components.map((c) => c.name));
for (const component of components) {
  for (const related of component.related) {
    if (!names.has(related)) problems.push(`${component.slug}: related "${related}" has no page`);
  }
  if (component.replacedBy && !names.has(component.replacedBy)) problems.push(`${component.slug}: replacedBy "${component.replacedBy}" has no page`);
}

// Every component folder in either repo has a page, and every story link points at a story.
const reactDirs = new Set(components.map((c) => c.react?.dir).filter(Boolean));
for (const dir of await readdir(path.join(reactLib, 'src/components'))) {
  if (!reactDirs.has(dir)) problems.push(`React component folder ${dir} has no content page`);
}
const reactTitles = await storyTitles(path.join(reactLib, 'src'), /\.stories\.tsx$/);
for (const c of components) {
  if (!c.react?.storyTitle) continue;
  if (!reactTitles.has(c.react.storyTitle)) problems.push(`${c.slug}: no React story titled ${c.react.storyTitle}`);
  else c.react.storyFile = reactTitles.get(c.react.storyTitle);
}
if (existsSync(angularLib)) {
  const angularDirs = new Set(components.map((c) => c.angular?.dir).filter(Boolean));
  for (const dir of await readdir(path.join(angularLib, 'src/lib'))) {
    if (!angularDirs.has(dir)) problems.push(`Angular component folder ${dir} has no content page`);
  }
  const angularTitles = await storyTitles(path.join(angularLib, 'stories'), /\.stories\.ts$/);
  for (const c of components) {
    if (c.angular?.storyTitle && !angularTitles.has(c.angular.storyTitle)) problems.push(`${c.slug}: no Angular story titled ${c.angular.storyTitle}`);
  }
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

// How many tokens each tier defines, for the tier diagrams.
const tokensCss = await readFile(path.join(reactLib, 'src/styles/tokens.generated.css'), 'utf8');
const definitions = new Map();
for (const [, name, value] of tokensCss.matchAll(/^\s*(--pada-[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
  if (!definitions.has(name)) definitions.set(name, value);
}
const defined = new Set(definitions.keys());
const isDerived = (name) => /calc\(|color-mix\(|pow\(/.test(definitions.get(name));
const KNOBS = ['--pada-accent-hue', '--pada-accent-chroma', '--pada-radius-base', '--pada-density', '--pada-type-base', '--pada-type-ratio', '--pada-motion-scale', '--pada-contrast'];
const componentTokenNames = new Set(components.flatMap((c) => c.tokens.component.map((t) => t.name)));
const tokenStats = {
  reference: [...defined].filter((n) => n.startsWith('--pada-ref-')).length,
  palette: [...defined].filter((n) => n.startsWith('--pada-palette-')).length,
  semantic: [...defined].filter((n) => !n.startsWith('--pada-ref-') && !n.startsWith('--pada-palette-') && !KNOBS.includes(n) && !isDerived(n)).length,
  derived: [...defined].filter((n) => !n.startsWith('--pada-ref-') && !n.startsWith('--pada-palette-') && !KNOBS.includes(n) && isDerived(n)).length,
  knobs: KNOBS.length,
  component: componentTokenNames.size,
};

const version = JSON.parse(await readFile(path.join(reactLib, 'package.json'), 'utf8')).version;
// Semantic colours only: the --pada-color-<hue>-<step> names are 1.x aliases of the reference ramps.
const HUE_ALIAS = /^--pada-color-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+$/;
const colorTokens = [...defined].filter((n) => n.startsWith('--pada-color-') && !HUE_ALIAS.test(n));
const docs = { version, links: LINKS, categories: CATEGORIES, tokenStats, colorTokens, components };
const json = `${JSON.stringify(docs, null, 2)}\n`;

if (check) {
  const current = await readFile(outFile, 'utf8').catch(() => null);
  if (current !== json) {
    console.error('content/docs.json is stale. Run `npm run docs:data`.');
    process.exit(1);
  }
  console.log(`content/docs.json is up to date (${components.length} components).`);
} else {
  await writeFile(outFile, json, 'utf8');
  console.log(`Wrote content/docs.json (${components.length} components)`);
}
