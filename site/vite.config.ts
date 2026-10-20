import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const lib = path.resolve(import.meta.dirname, '../projects/pada-ds/src');

// The Pada website. It imports `pada-ds` from source, so changes to a component show up here
// without a library build. `SITE_BASE` is the path the site is served from ("/pada/" on GitHub
// Pages); scripts/prerender.mjs renders every route to static HTML after the build.
export default defineConfig({
  plugins: [react()],
  base: process.env.SITE_BASE ?? '/',
  publicDir: 'public',
  resolve: {
    alias: [
      { find: /^pada-ds$/, replacement: path.join(lib, 'index.ts') },
      { find: /^pada-ds\/headless$/, replacement: path.join(lib, 'headless/index.ts') },
      { find: /^pada-ds\/tokens\.css$/, replacement: path.join(lib, 'styles/tokens.generated.css') },
      { find: /^pada-ds\/base\.css$/, replacement: path.join(lib, 'styles/base.css') },
      { find: /^@pada\//, replacement: `${lib}/` },
    ],
  },
  ssr: {
    // Bundle the library and its CSS imports into the server build.
    noExternal: ['pada-ds'],
  },
});
