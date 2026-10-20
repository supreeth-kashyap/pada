// Renders every route of the built site to static HTML (dist/<route>/index.html), so pages load
// with content, work without JavaScript and are indexable; the client bundle then hydrates them.
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist-server`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(siteDir, 'dist');
const serverDir = path.join(siteDir, 'dist-server');
const base = process.env.SITE_BASE ?? '/';
const basename = base.replace(/\/$/, '');
const origin = process.env.SITE_ORIGIN ?? 'https://supreeth-kashyap.github.io';

const { render, routes } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page(url, { html, meta }) {
  const canonical = `${origin}${basename}${url === '/' ? '/' : `${url}/`}`;
  const head = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${origin}${basename}/media/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
  return template.replace('<!--head-->', head).replace('<!--app-->', html);
}

let count = 0;
for (const route of routes) {
  const url = `${basename}${route === '/' ? '/' : route}`;
  const out = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, page(route, render(url, basename)), 'utf8');
  count++;
}

// GitHub Pages serves 404.html for unknown paths; the client router takes over from there.
await writeFile(path.join(distDir, '404.html'), page('/404', render(`${basename}/404`, basename)), 'utf8');
await writeFile(path.join(distDir, '.nojekyll'), '', 'utf8');
await rm(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${count} routes and 404.html into site/dist`);
