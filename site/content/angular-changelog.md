# Changelog

## 1.2.1 - 2026-10-21

- The package description reads "Singular design system for Angular applications, built with TypeScript and signals.", matching `pada-ds`.

- **Storybook.** New Docs pages, shared with the React Storybook and synced from the pada repo (`stories/docs`, `.storybook/pada-docs`): introduction, getting started, theming, tokens, foundations (colour, typography, spacing and density, radius, elevation, motion, icons), building with AI, and legacy and migration. Every component's docs page now shows best practices, a playground, an AI prompt, its tokens and its accessibility notes.
- **Storybook toolbar.** Theme, accent, neutral, density, radius and contrast switches set the `data-*` attributes on every story, as in the React Storybook. The accessibility (axe) panel is enabled.
- **Docs site.** Usage guidelines for every component are on the [Pada website](https://supreeth-kashyap.github.io/pada/docs/components/).
- `tokens:check` skips `.storybook`, which holds Storybook's docs styles rather than library styles.
- **Fix: text contrast meets WCAG AA (4.5:1) in both themes**, synced from pada-ds.
  - `--pada-color-<intent>-on-solid` picks white or black from the fill's relative luminance, so text on any solid fill reaches at least 4.58:1 for every `data-accent`, including `custom`.
  - `-solid-hover` and `-solid-pressed` move away from the on-solid text, so hover and pressed never lower contrast. In dark mode, fills under white text now darken on hover.
  - Dark `-solid` is step 500 mixed 30% toward 600, so the default indigo keeps white text.
  - Dark `--pada-color-fg-subtle` (calendar weekdays, outside-month days, code comments, placeholders) reaches 4.6:1 on raised surfaces.
  - `ds-avatar` colours use step 800 for initials, as in React.

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
