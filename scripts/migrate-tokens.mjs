#!/usr/bin/env node
// Rewrites Pada 1.x token references (var(--color-primary-600), var(--spacing-4), …) to their
// Pada 2.0 names in CSS, SCSS, JS and TS files.
//
//   npx pada-tokens-migrate src/              rewrite files in place
//   npx pada-tokens-migrate src/ --dry-run    list the changes without writing
//   npx pada-tokens-migrate src/ --themed     also move raw palette colours to themed ramps
//
// By default every rewrite keeps the exact meaning of the 1.x name. --themed is opt-in because
// it changes behaviour: raw palette colours such as --color-red-600 never changed with the
// theme in 1.x, while --pada-color-red-600 follows dark mode. Names whose 1.x meaning has no
// single 2.0 token (--color-white, --color-black, --z-index-*) are reported, not rewritten.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HUES, INTENTS, legacyAlias } from '../tokens/index.mjs';

const EXTENSIONS = new Set(['.css', '.scss', '.less', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue', '.svelte', '.html']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'build', 'coverage']);
const REFERENCE = /var\(\s*--((?!pada-)[\w-]+)/g;

export function migrateName(name, { themed = false } = {}) {
  const alias = legacyAlias(`--${name}`);
  if (alias === null) return null;
  const simple = alias.match(/^var\(--(pada-[\w-]+)\)$/);
  if (!simple) return { manual: true };
  let target = simple[1];
  if (themed) {
    const raw = target.match(/^pada-ref-([a-z]+)-(\d+)$/);
    if (raw) {
      const [, hue, step] = raw;
      const neutralHue = hue === INTENTS.neutral || hue === 'neutral';
      target = neutralHue ? `pada-color-neutral-${step}` : HUES.includes(hue) ? `pada-color-${hue}-${step}` : target;
    }
    const stone = target.match(/^pada-color-stone-(\d+)$/);
    if (stone) target = `pada-color-neutral-${stone[1]}`;
  }
  return { target };
}

export function migrateText(text, options) {
  const manual = new Set();
  let changes = 0;
  const output = text.replace(REFERENCE, (whole, name) => {
    const result = migrateName(name, options);
    if (!result) return whole;
    if (result.manual) {
      manual.add(`--${name}`);
      return whole;
    }
    changes += 1;
    return whole.replace(`--${name}`, `--${result.target}`);
  });
  return { output, changes, manual: [...manual] };
}

async function collect(target) {
  const info = await stat(target);
  if (info.isFile()) return [target];
  const entries = await readdir(target, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !SKIP_DIRS.has(entry.name))
      .map((entry) => {
        const full = path.join(target, entry.name);
        if (entry.isDirectory()) return collect(full);
        return EXTENSIONS.has(path.extname(entry.name)) ? [full] : [];
      }),
  );
  return nested.flat();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const options = { themed: args.includes('--themed') };
  const dryRun = args.includes('--dry-run');
  const targets = args.filter((arg) => !arg.startsWith('--'));
  if (!targets.length) {
    console.error('Usage: pada-tokens-migrate <files or directories> [--dry-run] [--themed]');
    process.exit(1);
  }
  let total = 0;
  const manualReport = new Map();
  for (const file of (await Promise.all(targets.map(collect))).flat()) {
    const text = await readFile(file, 'utf8');
    const { output, changes, manual } = migrateText(text, options);
    if (manual.length) manualReport.set(file, manual);
    if (!changes) continue;
    total += changes;
    console.log(`${dryRun ? 'would update' : 'updated'} ${file} (${changes})`);
    if (!dryRun) await writeFile(file, output, 'utf8');
  }
  console.log(`${total} reference${total === 1 ? '' : 's'} ${dryRun ? 'to update' : 'updated'}.`);
  if (manualReport.size) {
    console.log('\nReview by hand (no single 2.0 equivalent; the 1.x name still works until 3.0):');
    for (const [file, names] of manualReport) console.log(`  ${file}: ${names.join(', ')}`);
  }
}
