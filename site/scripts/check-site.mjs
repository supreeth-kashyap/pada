// Checks the built site: every prerendered page loads without console errors, has no serious or
// critical axe violations, and every internal link points at a page that exists.
//
//   npm run build -w site && (cd site && npx vite preview --port 4173 &)
//   node site/scripts/check-site.mjs [http://localhost:4173]
//
// Uses Playwright's Chromium (CHROME overrides the executable) and axe-core.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(siteDir, 'dist');
const baseUrl = process.argv[2] ?? 'http://localhost:4173';
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

async function pages(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'assets' && entry.name !== 'media') {
      out.push(...(await pages(path.join(dir, entry.name), `${prefix}/${entry.name}`)));
    } else if (entry.name === 'index.html') {
      out.push(prefix || '/');
    }
  }
  return out;
}

const routes = (await pages(distDir)).sort();
const exists = (href) => {
  const clean = href.split('#')[0].replace(/\/+$/, '');
  return clean === '' || existsSync(path.join(distDir, clean, 'index.html')) || existsSync(path.join(distDir, clean));
};

// Contrast findings inside library components (dark-mode accent buttons, avatar initials, calendar
// days, code comments) come from pada-ds tokens, not the site; they are reported as warnings.
const LIBRARY = '.button, .avatar, .code-snippet, .calendar';

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const problems = [];
const warnings = new Set();
for (const route of routes) {
  for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({ colorScheme, viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
    await page.goto(`${baseUrl}${route === '/' ? '/' : `${route}/`}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-in')));
    await page.waitForTimeout(900); // let reveal transitions finish before measuring contrast
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async (library) => {
      // Live story previews are checked by Storybook's a11y addon, not here.
      // @ts-expect-error axe is injected above
      const result = await window.axe.run({ exclude: [['.doc-preview']] }, { resultTypes: ['violations'] });
      return result.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .flatMap((v) =>
          v.nodes.map((n) => ({
            id: v.id,
            target: n.target.join(' '),
            inLibrary: !!document.querySelector(n.target.join(' '))?.closest(library),
          })),
        );
    }, LIBRARY);
    const links = colorScheme === 'light'
      ? await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))
      : [];
    for (const href of new Set(links)) if (!exists(href)) problems.push(`${route}: broken link ${href}`);
    for (const v of violations) {
      if (v.id === 'color-contrast' && v.inLibrary) warnings.add(`library contrast (${colorScheme}): ${v.target.split(' > ').slice(-2).join(' > ')}`);
      else problems.push(`${route} (${colorScheme}): axe ${v.id}: ${v.target}`);
    }
    for (const e of errors) problems.push(`${route} (${colorScheme}): console ${e}`);
    await page.close();
  }
}
await browser.close();

if (warnings.size) console.warn(`Known pada-ds findings (not failing):\n  ${[...warnings].join('\n  ')}\n`);
if (problems.length) {
  console.error([...new Set(problems)].join('\n'));
  console.error(`\n${problems.length} problems on ${routes.length} pages`);
  process.exit(1);
}
console.log(`${routes.length} pages: no console errors, no serious axe violations, no broken links (light and dark).`);
