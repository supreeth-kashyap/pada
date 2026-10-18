import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

run('npm', ['run', 'build'], { cwd: rootDir });

const packResult = spawnSync('npm', ['pack', '--silent'], {
  cwd: rootDir,
  encoding: 'utf8',
});

if (packResult.status !== 0) {
  throw new Error(packResult.stderr || 'npm pack failed');
}

const tarballName = packResult.stdout.trim().split('\n').pop();
if (!tarballName) {
  throw new Error('Failed to resolve packed tarball name');
}

const tarballPath = path.join(rootDir, tarballName);
const tempRoot = await mkdtemp(path.join(tmpdir(), 'pada-ds-smoke-'));
const appDir = path.join(tempRoot, 'consumer-app');

run('npm', ['create', 'vite@latest', 'consumer-app', '--', '--template', 'react-ts'], {
  cwd: tempRoot,
  env: {
    ...process.env,
    npm_config_yes: 'true',
  },
});

run('npm', ['install'], { cwd: appDir });
run('npm', ['install', tarballPath], { cwd: appDir });

await writeFile(
  path.join(appDir, 'src/App.tsx'),
  `import { Button } from 'pada-ds';\n\nfunction App() {\n  return (\n    <div>\n      <Button variant=\"primary\">Smoke test button</Button>\n    </div>\n  );\n}\n\nexport default App;\n`,
  'utf8',
);

await writeFile(
  path.join(appDir, 'src/main.tsx'),
  `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport 'pada-ds/tokens.css';\nimport 'pada-ds/styles.css';\nimport './index.css';\nimport App from './App';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);\n`,
  'utf8',
);

run('npm', ['run', 'build'], { cwd: appDir });

const packageCss = await readFile(path.join(appDir, 'node_modules/pada-ds/dist/pada.css'), 'utf8');
// Primary is the base .button style; variants only reassign its --pada-button-* tokens.
if (!/\.button\{[^}]*--pada-button-bg:\s*var\(--pada-color-accent-solid\)/.test(packageCss)) {
  throw new Error('Expected primary button styles were not found in dist/pada.css');
}

const tokensCss = await readFile(path.join(appDir, 'node_modules/pada-ds/dist/tokens.css'), 'utf8');
const requiredTokens = [
  '--pada-color-accent-solid',
  '--pada-space-4',
  '--pada-radius-lg',
  '--pada-font-sans',
  '--pada-shadow-lg',
  '--pada-duration-normal',
  // Pada 1.x names stay defined as aliases through 2.x.
  '--color-primary-600',
  '--spacing-4',
  '--radius-lg',
  '--font-family-sans',
  '--shadow-lg',
];

for (const token of requiredTokens) {
  if (!tokensCss.includes(token)) {
    throw new Error(`Missing required token in dist/tokens.css: ${token}`);
  }
}

const requiredThemeSelectors = [
  '[data-theme="light"]',
  '[data-theme="dark"]',
  'color-scheme: light dark',
  '[data-accent="custom"]',
  '[data-density="compact"]',
];

for (const selector of requiredThemeSelectors) {
  if (!tokensCss.includes(selector)) {
    throw new Error(`Missing theme selector in dist/tokens.css: ${selector}`);
  }
}

if (/(^|[\s,}])(body|p)\s*[{,]/m.test(tokensCss)) {
  throw new Error('dist/tokens.css must not contain body or p rules');
}

const baseCss = await readFile(path.join(appDir, 'node_modules/pada-ds/dist/base.css'), 'utf8');
if (!baseCss.includes('body {') || !baseCss.includes('p {')) {
  throw new Error('Expected body and p rules in dist/base.css');
}

const appTsx = await readFile(path.join(appDir, 'src/App.tsx'), 'utf8');
if (appTsx.includes('declare module')) {
  throw new Error('Consumer app contains declaration hack unexpectedly');
}

run('node', [
  '--input-type=module',
  '--eval',
  `import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button } from 'pada-ds'; const html = renderToString(React.createElement(Button, { variant: 'primary' }, 'Smoke test button')); if (!html.includes('button--primary')) { throw new Error('Button primary class not rendered.'); }`,
], { cwd: appDir });

// The headless entry resolves, renders without any stylesheet, and exposes ARIA wiring.
run('node', [
  '--input-type=module',
  '--eval',
  `import React from 'react'; import { renderToString } from 'react-dom/server'; import { Dialog } from 'pada-ds/headless'; const html = renderToString(React.createElement(Dialog.Root, null, React.createElement(Dialog.Trigger, null, 'Open'))); if (!html.includes('aria-haspopup="dialog"') || !html.includes('aria-expanded="false"')) { throw new Error('pada-ds/headless Dialog.Trigger did not render its ARIA attributes: ' + html); }`,
], { cwd: appDir });

// The JS token entry resolves and maps names to var() references.
run('node', [
  '--input-type=module',
  '--eval',
  `import { tokens, breakpoints } from 'pada-ds/tokens'; if (tokens['color-accent-solid'] !== 'var(--pada-color-accent-solid)' || breakpoints.md !== 768) { throw new Error('pada-ds/tokens did not export the expected values.'); }`,
], { cwd: appDir });

// Built-in icons are bundled and must render synchronously (no fetch), so SSR emits the SVG.
run('node', [
  '--input-type=module',
  '--eval',
  `import React from 'react'; import { renderToString } from 'react-dom/server'; import { Icon, iconNames } from 'pada-ds'; const html = renderToString(React.createElement(Icon, { name: 'tick_1' })); if (!html.includes('<svg')) { throw new Error('Built-in icon tick_1 did not render an <svg> during SSR: ' + html); } if (!iconNames.includes('tick_1')) { throw new Error('iconNames does not list tick_1.'); } if (!html.includes('currentColor') || html.includes('#111827')) { throw new Error('Built-in icon tick_1 was not recolored to currentColor: ' + html); }`,
], { cwd: appDir });

// The component manifest resolves through the `pada-ds/manifest.json` export and lists Button's props.
run('node', [
  '--input-type=module',
  '--eval',
  `import { createRequire } from 'node:module'; const require = createRequire(process.cwd() + '/package.json'); const manifest = require('pada-ds/manifest.json'); const button = manifest.components.find((c) => c.name === 'Button'); if (!button || !button.props.some((p) => p.name === 'variant')) { throw new Error('pada-ds/manifest.json does not describe Button.variant.'); }`,
], { cwd: appDir });

for (const llmsFile of ['llms.txt', 'llms-full.txt']) {
  const content = await readFile(path.join(appDir, 'node_modules/pada-ds', llmsFile), 'utf8');
  if (!content.includes("import { Button } from 'pada-ds'")) {
    throw new Error(`Expected Button import in published ${llmsFile}`);
  }
}

console.log('Consumer smoke test passed.');
console.log(`App directory: ${appDir}`);
