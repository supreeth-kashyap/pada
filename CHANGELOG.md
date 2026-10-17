# Changelog

## Unreleased

- Added explicit `data-theme="light"` and `data-theme="dark"` token sets. They work on `<html>` or any container. With no attribute the theme still follows the OS. Previously, setting `data-theme` removed every semantic token.
- Moved the `body` and `p` rules out of `dist/tokens.css` into a new optional `pada-ds/base.css` export, so importing the tokens no longer overrides an app's own styles.
- Added a component API manifest for AI coding agents. `npm run build` now reads every exported component's props from the TypeScript source and writes `dist/manifest.json` (exported as `pada-ds/manifest.json`), `llms.txt` and `llms-full.txt`. Both llms files ship in the package and are committed at the repo root. `npm test` fails if they are stale or if an exported component is missing from the manifest.

- **Tokens v2.** Tokens are now generated from one model (`tokens/index.mjs`) by `npm run build:tokens`, in four tiers: reference (`--pada-ref-*`), semantic, derived and component. Every token has the `--pada-` prefix.
  - Light and dark values live in one `light-dark()` value, so themes switch with `color-scheme` and nested `data-theme` containers need no re-declared token sets.
  - New semantic tokens: surfaces (`--pada-color-surface`, `-sunken`, `-raised`, `-overlay`, `-inverse`, `backdrop`), text (`fg`, `fg-muted`, `fg-subtle`, `fg-disabled`), borders, and intents (`accent`, `neutral`, `success`, `warning`, `danger`, `info`) each with `solid`, `solid-hover`, `solid-pressed`, `on-solid`, `subtle`, `subtle-hover`, `fg` and `border`.
  - Derived tokens are computed from knobs: `--pada-accent-hue`, `--pada-radius-base`, `--pada-density`, `--pada-type-base`, `--pada-type-ratio`, `--pada-motion-scale` and `--pada-contrast`. `on-solid` text picks white or near-black from the fill's lightness.
  - New theme axes: `data-accent`, `data-neutral`, `data-density`, `data-radius`, `data-motion` and `data-contrast`, on `<html>` or any container.
  - New categories: motion (durations scaled by `--pada-motion-scale`, which is 0 under `prefers-reduced-motion`; easings), semantic z-index (`--pada-z-dropdown` … `--pada-z-tooltip`), control heights, opacity, border widths, breakpoints and a configurable focus ring (`--pada-shadow-focus`, which now uses the surface colour for its gap so it works in dark mode).
  - New exports: `pada-ds/tokens.scss` (breakpoint mixins and a `pada()` function), `pada-ds/tokens` (JS token names and breakpoints, with types) and `pada-ds/tokens.json` (DTCG-style, for design tools).
  - Every Pada 1.x token name still works as an alias (checked by `npm test`) and will be removed in 3.0.
  - Visual changes: surfaces, text and borders now come from the neutral palette (stone) instead of mixing slate and stone; `--font-size-lg` is now 15.6px (13px × 1.2); the focus ring is 2px wide; themed hue ramps (`--color-red-600` and so on, when read through the semantic layer) follow dark mode.
  - `npm run tokens:sync -- <path>` copies the built CSS and SCSS into the Angular library with a version and hash header.
- Fixed `CodeSnippet` failing to load in Node ESM (SSR): its Prism language imports now include the `.js` extension.
- Fixed token bugs:
  - `--color-neutral-*` was defined twice (Tailwind's neutral grey in the primitives, Pada's stone scale in the semantic layer), so the value depended on stylesheet order. The stone scale is now the only definition.
  - `--color-accent-neutral-*` was inverted twice in dark mode and resolved to near-white. It now maps to the stone scale and is inverted once.
  - Components read tokens that did not exist and silently fell back to inherited values: `--font-2/3/5` (Modal, Tooltip, Progress), `--color-fg-default` (Progress), `--font-size-md` (Indexer), `--shadow-xs` (DatePicker), `--color-primray-200` (Pills, typo) and every `--tw-*` token in Logo. They now use real tokens. `--color-fg-muted` is now defined (neutral-600, per theme).
- Added `npm run check:tokens`, part of `npm test`, which fails when component CSS reads a custom property that nothing defines.

## 1.1.0 - 2026-05-27

- Externalized `prismjs` from the bundle. It is still listed under `dependencies`, so consumers get it auto-installed, but the published `dist/pada.js` no longer ships its own copy.
- Added `keywords`, `engines` (`node >= 18`), and `publishConfig: { access: "public" }` to `package.json` for cleaner npm metadata.
- Reordered the `exports` map so `types` resolves before `import` (TypeScript moduleResolution `bundler`/`nodenext` requirement). Added `./package.json` to `exports` for tooling.
- Added a `clean` script that wipes `dist/` before every build to prevent stale artifacts shipping in `npm pack`.
- Stopped copying `public/` (which only contains `vite.svg`, used by the demo dev server) into `dist/` during the library build.

## 1.0.1 - 2026-05-24

- Fixed package exports to support direct imports from `pada-ds`, `pada-ds/styles.css`, and `pada-ds/tokens.css`.
- Ensured type declarations publish as `dist/index.d.ts` from the source export surface.
- Added `dist/tokens.css` generation with design tokens and semantic theme variables required by `dist/pada.css`.
- Updated build pipeline to emit stable CSS artifact names (`dist/pada.css`).
- Added a consumer smoke test script (`npm run smoke:consumer`) that validates TypeScript compile, CSS subpath resolution, and primary button rendering/styling.
- Updated README package name and usage examples to match published import paths.
