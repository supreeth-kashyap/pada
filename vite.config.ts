import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { expandThemeCss } from './scripts/theme-css.mjs'

// Gives the demo the same `[data-theme="dark"]` rule that build-tokens-css.mjs adds to
// dist/tokens.css, so forcing a theme in the demo matches what consumers get.
const themeCss = (): Plugin => ({
  name: 'pada-theme-css',
  enforce: 'pre',
  transform(code, id) {
    if (id.split('?')[0].replace(/\\/g, '/').endsWith('/src/styles/global.css')) {
      return { code: expandThemeCss(code), map: null }
    }
  },
})

// https://vite.dev/config/
// `command` is `serve` for `vite dev` and `build` for `vite build`. The published library
// build skips copying `public/` into `dist/`; the demo dev server still serves it.
export default defineConfig(({ command }) => ({
  plugins: [themeCss(), react()],
  publicDir: command === 'build' ? false : 'public',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Pada',
      fileName: 'pada',
      cssFileName: 'pada',
      formats: ['es'],
    },
    rollupOptions: {
      // Anything matched here is left as an `import` in the bundle and resolved by the
      // consumer's package manager. `react`/`react-dom` are peer deps; `prismjs` is a
      // runtime dependency. The regex catches deep imports like `prismjs/components/...`.
      external: (id) => id === 'react' || id === 'react-dom' || /^prismjs(\/|$)/.test(id),
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
