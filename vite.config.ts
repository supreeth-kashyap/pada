import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// `command` is `serve` for `vite dev` and `build` for `vite build`. The published library
// build skips copying `public/` into `dist/`; the demo dev server still serves it.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  publicDir: command === 'build' ? false : 'public',
  build: {
    lib: {
      entry: {
        pada: path.resolve(import.meta.dirname, 'src/index.ts'),
        headless: path.resolve(import.meta.dirname, 'src/headless/index.ts'),
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'pada',
      formats: ['es'],
    },
    rollupOptions: {
      // Anything matched here is left as an `import` in the bundle and resolved by the
      // consumer's package manager. `react`/`react-dom` (and their subpaths such as
      // `react/jsx-runtime`) are peer deps; `prismjs` and `@floating-ui/*` are runtime
      // dependencies. The regexes catch deep imports like `prismjs/components/...`.
      external: (id) => /^react(-dom)?(\/|$)/.test(id) || /^prismjs(\/|$)/.test(id) || /^@floating-ui\//.test(id),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          prismjs: 'Prism',
        },
      },
    },
  },
}))
