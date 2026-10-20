<p align="center">
  <img src="https://raw.githubusercontent.com/supreeth-kashyap/pada/main/docs/assets/pada-ds-cover-image.png" alt="Pada . design: unified design system for web" width="640">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/pada-ds"><img src="https://img.shields.io/npm/v/pada-ds?color=4f46e5&label=npm" alt="npm version"></a>
  <a href="https://github.com/supreeth-kashyap/pada/releases"><img src="https://img.shields.io/github/v/release/supreeth-kashyap/pada?color=f59e0b&label=release" alt="Latest release"></a>
  <a href="https://main--6ad73b69f7d2adf27e282417.chromatic.com"><img src="https://img.shields.io/badge/storybook-React%20%2B%20Angular-ff4785" alt="Storybook"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/pada-ds?color=78716c" alt="MIT licence"></a>
  <a href="https://supreeth-kashyap.github.io/pada/"><img src="https://img.shields.io/badge/docs-website-0c0a09" alt="Website and docs"></a>
</p>

<p align="center">
  <a href="https://supreeth-kashyap.github.io/pada/"><strong>Website</strong></a> ·
  <a href="https://supreeth-kashyap.github.io/pada/docs/getting-started/">Getting started</a> ·
  <a href="https://supreeth-kashyap.github.io/pada/docs/components/">Components</a> ·
  <a href="https://supreeth-kashyap.github.io/pada/docs/tokens/">Tokens</a> ·
  <a href="https://main--6ad73b69f7d2adf27e282417.chromatic.com">Storybook</a> ·
  <a href="https://supreeth-kashyap.github.io/pada/changelog/">Changelog</a>
</p>

# Pada for React

**React** · [Angular](https://github.com/supreeth-kashyap/pada-ds-angular)

## What is Pada

Pada (पाद, Sanskrit for *foot*: the part that carries the weight) is a unified design system for the web. One design language ships as two first-class packages, one for React and one for Angular, with the same components, parts, keyboard behaviour, tokens and motion. Both are released together under the same version number.

- **Accessible by default.** Every interactive component follows its WAI-ARIA Authoring Practices pattern and is tested for keyboard behaviour and with axe.
- **Styled or headless.** Use the styled components, or take the headless layer (behaviour, focus, ARIA and state attributes, no styles) and bring your own look.
- **One token system.** Colour, type, space, radius, motion and elevation are `--pada-*` CSS custom properties. Light and dark, accent, density, radius and contrast are attributes you can set on any element.
- **Built for design and code.** The [Figma library](https://www.figma.com/community/file/1619638623779328209) is free in the Figma Community, and [pada.design](https://supreeth-kashyap.notion.site/Pada-Design-System-2c6a6474ca5a80cea166ed78587299a2) covers the principles.

<p align="center">
  <img src="https://raw.githubusercontent.com/supreeth-kashyap/pada/main/docs/assets/theme.gif" alt="Seven theme attributes re-theming Pada components live" width="720">
</p>

| Dialog | Command palette | Data table |
|---|---|---|
| ![Dialog opening, editing and saving](https://raw.githubusercontent.com/supreeth-kashyap/pada/main/docs/assets/dialog.gif) | ![Command palette filtering and running a command](https://raw.githubusercontent.com/supreeth-kashyap/pada/main/docs/assets/command-palette.gif) | ![Data table sorting and selecting rows](https://raw.githubusercontent.com/supreeth-kashyap/pada/main/docs/assets/data-table.gif) |

## Documentation

The [Pada website](https://supreeth-kashyap.github.io/pada/) has the guides (getting started, theming, tokens, foundations, headless, building with AI) and a page for every component: when to use it, best practices and accessibility, with a live preview and links to both Storybooks. Storybook is the API reference, with a playground and the tokens for each component.

## Packages

| | Package | Repository | Storybook |
|---|---|---|---|
| React | [`pada-ds`](https://www.npmjs.com/package/pada-ds) | [supreeth-kashyap/pada](https://github.com/supreeth-kashyap/pada) | [React + Angular](https://main--6ad73b69f7d2adf27e282417.chromatic.com) |
| Angular | [`pada-ds-angular`](https://www.npmjs.com/package/pada-ds-angular) | [supreeth-kashyap/pada-ds-angular](https://github.com/supreeth-kashyap/pada-ds-angular) | [Angular](https://main--6ad72a0038bb5d0de784c60f.chromatic.com) |

## Installation

```bash
npm install pada-ds
```

Peer dependencies: React 19 (`react` and `react-dom` `^19.1.1`). The tokens use `light-dark()`, `color-mix()` and relative colours, so they need a 2024-era browser (Chrome 123, Safari 18, Firefox 128 or later).

Upgrading from 1.1? Component APIs keep working; the [upgrade guide](./docs/migration-2.0.md) lists everything you might notice, including a codemod for the 1.x token names.

## Quick start

```tsx
import 'pada-ds/styles.css'; // tokens (light and dark) and component styles
import 'pada-ds/base.css';   // optional: body background, colour and font
import { Button, Dialog } from 'pada-ds';

export function Profile() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="primary">Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>…</Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

Components with parts are compound (`Dialog.Root`, `Dialog.Content`, …); simple ones are single components with props.

## Headless

`pada-ds/headless` ships the behaviour behind every component (state, keyboard handling, focus, ARIA and positioning) with no styles. Every part exposes its state as `data-state`, `data-side`, `data-disabled` and `aria-*` attributes for you to style, and accepts `asChild` to merge onto your own element.

```tsx
import { Dialog } from 'pada-ds/headless';

<Dialog.Root>
  <Dialog.Trigger className="my-button">Edit profile</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="my-overlay" />
    <Dialog.Content className="my-dialog">
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>Changes save automatically.</Dialog.Description>
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Theming

With no attribute the theme follows the operating system. Each axis is an attribute that works on `<html>` or on any container, so one section of a page can look different from the rest:

```html
<html data-theme="dark" data-accent="amber" data-density="compact">
  …
  <section data-theme="light">Always light</section>
</html>
```

| Attribute | Values |
|---|---|
| `data-theme` | `light`, `dark` (none follows the OS) |
| `data-accent` | `indigo` (default), `violet`, `amber`, `emerald`, `rose`, `sky`, … or `custom` with `--pada-accent-hue` |
| `data-neutral` | `stone` (default), `slate`, `gray`, `zinc`, `neutral` |
| `data-density` | `compact`, `comfortable`, `spacious` |
| `data-radius` | `none`, `sm`, `md`, `lg`, `xl` |
| `data-motion` | `reduced`, `full` |
| `data-contrast` | `standard`, `more` |

`ThemeProvider` sets the same attributes on a subtree, and `ThemeToggle` switches light and dark. Tokens are also available as SCSS (`tokens.scss`).

## Components

More than 90 components, the same in both packages. The [Storybook](https://main--6ad73b69f7d2adf27e282417.chromatic.com) has every one with its props and examples, and the [parity matrix](https://github.com/supreeth-kashyap/pada-ds-angular/blob/main/docs/roadmap/parity.md) maps each React component to its Angular counterpart.

| Group | Components |
|---|---|
| Actions | Button, ButtonGroup, SplitButton, IconButton, Link, Toggle, ToggleGroup, Toolbar, DropdownMenu, ContextMenu, Menubar, CommandPalette |
| Forms | Field, InputText, InputTextArea, NumberInput, PasswordInput, PinInput, SearchField, Select, ComboBox, Autocomplete, TagInput, Checkbox, CheckboxGroup, RadioGroup, RadioCardGroup, Switch, Slider, RangeSlider, Rating, SegmentControl, Pills, ColorPicker, UploadField |
| Dates and time | Calendar, DatePicker, DateRangePicker, InputDate, TimePicker |
| Overlays | Dialog, AlertDialog, Drawer, Sheet, Popover, HoverCard, Tooltip, InfoTooltip, Toaster |
| Navigation | Tabs, Accordion, Breadcrumbs, Pagination, Steps, Sidebar, Indexer, Tree |
| Data display | Table, DataTable, DescriptionList, KeyValue, List, Timeline, Stat, Badge, Tags, Avatar, Kbd, CodeSnippet, Carousel |
| Feedback | Alert, Banner, Progress, ProgressCircle, Spinner, Skeleton, EmptyState |
| Layout and type | Stack, Grid, Container, AspectRatio, Card, PageHeader, Separator, ScrollArea, Resizable, Heading, Text |
| Brand and theme | PadaLogo, BrandLogo, Icon, ThemeProvider, ThemeToggle |

## Storybook

The [Pada Storybook](https://main--6ad73b69f7d2adf27e282417.chromatic.com) shows the React components and, through Storybook composition, the [Angular Storybook](https://main--6ad72a0038bb5d0de784c60f.chromatic.com) in the same sidebar. Both are published to Chromatic on every push to `main`. The toolbar switches every theme axis, and the Accessibility panel runs axe against the current story.

## Releases

Pada follows [semantic versioning](https://semver.org). `pada-ds` and `pada-ds-angular` are released together, with the same version number.

- **Release notes:** [GitHub Releases](https://github.com/supreeth-kashyap/pada/releases), written from [`CHANGELOG.md`](./CHANGELOG.md).
- **npm:** [`pada-ds`](https://www.npmjs.com/package/pada-ds), published with provenance.
- **GitHub Packages:** also published as `@supreeth-kashyap/pada-ds` and listed under this repository's Packages. Installing from there needs an `.npmrc` line (`@supreeth-kashyap:registry=https://npm.pkg.github.com`) and a GitHub token with `read:packages`; npm is the simpler route.

To cut a release: bump the version, move the changes under a new heading in `CHANGELOG.md`, merge to `main`, then push a matching tag (`git tag v1.2.0 && git push origin v1.2.0`). The release workflow checks the tag, runs the tests, publishes both packages and creates the GitHub Release.

## Development

The repo is an npm workspace with the same shape as [pada-ds-angular](https://github.com/supreeth-kashyap/pada-ds-angular):

```
projects/pada-ds/   the library, published as pada-ds (components, headless, tokens, Storybook)
site/               the website: landing page and docs, prerendered for GitHub Pages
content/            docs content for every component, shared by the site and both Storybooks
docs/               contributing guide, migration guide, roadmap
scripts/            repo tooling (Angular token and Storybook sync, docs data, consumer smoke test)
```

```bash
npm install
npm run dev           # the website, rendering the library from source
npm run storybook     # Storybook on http://localhost:6006
npm test              # Vitest, Testing Library and axe
npm run build         # library, types, tokens and the API manifest into projects/pada-ds/dist/
npm run build:site    # the website into site/dist/ (SITE_BASE=/pada/ for GitHub Pages)
npm run docs:data     # rebuild content/docs.json after editing content/components/*.md
npm run storybook:sync -- ../pada-ds-angular   # copy the Storybook docs pages to Angular
```

[CLAUDE.md](./CLAUDE.md) is the blueprint and [docs/contributing.md](./docs/contributing.md) walks through building a component.

The package also ships a machine-readable API for AI coding agents: `pada-ds/manifest.json` (every component and prop), `llms.txt` (a short index) and `llms-full.txt` (props and an example per component).

## Contributing, security and licence

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request, and report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md). Pada is released under the [MIT licence](./LICENSE).
