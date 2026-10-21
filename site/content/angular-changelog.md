# Changelog

## 1.2.0 - 2026-10-20

The first public release of Pada for Angular, published to npm as `pada-ds-angular` alongside `pada-ds` 1.2.0 for React. The version numbers match on purpose: the two packages ship the same components, parts, keyboard behaviour, tokens and motion.

- **Parity with React.** Every `pada-ds` component has an Angular counterpart; the [parity matrix](./docs/roadmap/parity.md) lists them, with any deliberate differences. `ds-tag-group` is the one Angular-only component.
- **Two entry points.** `pada-ds-angular` holds the styled, standalone, OnPush components. `pada-ds-angular/headless` holds the directives with the behaviour, keyboard handling, focus, ARIA and state attributes, and no styles.
- **Signals throughout.** Inputs are `input()`, two-way state is `model()` (`[(open)]`, `[(value)]`) and events are `output()`. Form controls implement `ControlValueAccessor`.
- **Data components.** Table, DataTable, Tree, Timeline, DescriptionList and friends take one typed `data` input, built by a pure `to<Name>Data` adapter.
- **Tokens.** `styles.css`, `tokens.css`, `base.css` and `_tokens.scss` are synced from React and checked by `npm run tokens:check`, so both packages theme the same way (`data-theme`, `data-accent`, `data-density` and the other axes).
- **Brand.** `ds-pada-logo` draws the geometric Pada mark and "Pada . design" wordmark, and is the default logo in `ds-sidebar-logo`.
- **Storybook** for every component, published to Chromatic on every push to `main`.
- **Releases.** Pushing a `v*` tag runs `.github/workflows/release.yml`: it checks the tag against the library's `package.json`, publishes `pada-ds-angular` to npm with provenance and `@supreeth-kashyap/pada-ds-angular` to GitHub Packages, and creates the GitHub Release from this changelog.
