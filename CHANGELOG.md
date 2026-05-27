# Changelog

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
