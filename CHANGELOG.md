# Changelog

## 1.0.1 - 2026-05-24

- Fixed package exports to support direct imports from `pada-ds`, `pada-ds/styles.css`, and `pada-ds/tokens.css`.
- Ensured type declarations publish as `dist/index.d.ts` from the source export surface.
- Added `dist/tokens.css` generation with design tokens and semantic theme variables required by `dist/pada.css`.
- Updated build pipeline to emit stable CSS artifact names (`dist/pada.css`).
- Added a consumer smoke test script (`npm run smoke:consumer`) that validates TypeScript compile, CSS subpath resolution, and primary button rendering/styling.
- Updated README package name and usage examples to match published import paths.
