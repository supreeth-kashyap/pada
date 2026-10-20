import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const lib = path.resolve(import.meta.dirname, '../projects/pada-ds/src');

// The Pada website. It renders the library from source (`@pada/*`), so changes to a component
// show up here without a library build.
export default defineConfig({
  plugins: [react()],
  base: process.env.SITE_BASE ?? '/',
  publicDir: path.resolve(import.meta.dirname, '../public'),
  resolve: {
    alias: { '@pada': lib },
  },
});
