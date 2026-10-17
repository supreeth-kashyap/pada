# Changelog

## Unreleased

- Added explicit `data-theme="light"` and `data-theme="dark"` token sets. They work on `<html>` or any container. With no attribute the theme still follows the OS. Previously, setting `data-theme` removed every semantic token.
- Moved the `body` and `p` rules out of `dist/tokens.css` into a new optional `pada-ds/base.css` export, so importing the tokens no longer overrides an app's own styles.
- Added a component API manifest for AI coding agents. `npm run build` now reads every exported component's props from the TypeScript source and writes `dist/manifest.json` (exported as `pada-ds/manifest.json`), `llms.txt` and `llms-full.txt`. Both llms files ship in the package and are committed at the repo root. `npm test` fails if they are stale or if an exported component is missing from the manifest.

- **New components (wave 1, feedback and search).**
  - `Toaster` and `toast()`: call `toast('Saved')`, `toast.success(...)`, `toast.warning(...)`, `toast.danger(...)`, `toast.info(...)` or `toast.dismiss(id)` from anywhere, with one `<Toaster />` mounted. Toasts take a title, description, tone, one action (e.g. Undo) and a duration, and an `id` updates a toast in place. They stack in a corner and fan out on hover or focus. Timers pause while the stack is hovered or focused or the window is in the background. Swipe or press Escape to dismiss, and F8 jumps to the region. Each toast is a polite live region (danger is assertive).
  - `Autocomplete`: a text field with a filtered list of options, single or `multiple` (removable chips), with a description, error, `name` for forms, a custom `filter`, or `filter={false}` plus `onInputValueChange` for server-side search.
  - `CommandPalette`: a ⌘K / Ctrl+K dialog of commands with fuzzy, ranked matching on labels and `keywords`, groups, icons and shortcut hints.
  - Headless `Combobox` (`pada-ds/headless`: `Root`, `Anchor`, `Input`, `Trigger`, `Portal`, `Content`, `Item`, `Group`, `Empty`) follows the APG combobox pattern with a listbox popup. The highlight is announced through `aria-activedescendant` and focus stays in the input. Exports `defaultComboboxFilter`.
- Overlays opened inside a `ThemeProvider` subtree (`target="element"`) now portal into that subtree, so they keep its theme and accent instead of the page's. The headless `Portal` reads the container from the new `PortalContainerContext` (exported from `pada-ds/headless`) when no `container` is passed.
- `Link`'s external-link icon is now an inline SVG, so a link inside a paragraph no longer puts a `<div>` inside the `<p>`.
- The demo has a new Playground page (Foundation → Playground) with every new component and controls for theme, accent, density and radius.
- `manifest.json` now expands union prop types (such as `AutocompleteProps`) and lists each inherited prop once.
- Fixed the consumer smoke test, which looked for a `.button--primary` rule that no longer exists now that primary is the base button style.
- **New components (wave 1, interaction).**
  - `Field` (`Field.Root`, `Label`, `Control`, `Description`, `Error`): wires any control's id, `aria-describedby`, `aria-invalid`, `required` and `disabled`; the error is announced and the control shakes once (not under reduced motion). Also headless in `pada-ds/headless`.
  - `Toggle` (`aria-pressed`) and `ToggleGroup` (single or multiple, one tab stop, arrow keys). Also headless.
  - `Breadcrumbs` (navigation landmark, `aria-current="page"`, collapsing long trails behind an expand button, `renderLink` for router links). PageHeader now reuses its `BreadcrumbItem` type.
  - `Pagination` (previous/next, numbered pages with ellipses, `aria-current="page"`) and the `paginationRange` helper.
  - `AlertDialog` (`role="alertdialog"`, focus starts on Cancel, no dismissal by clicking outside).
  - `ThemeProvider` (sets every theme axis on `<html>` or a subtree, remembers the choice in localStorage), `useTheme()`, and `ThemeToggle` (sun/moon morph; the new theme spreads from the button with a view transition where supported).
- **New components (wave 1, display).**
  - `Avatar` (image with initials or icon fallback, a stable colour per name, sizes, square shape, presence status) and `AvatarGroup` (overlap and a "+N" counter).
  - `Badge` (tones, subtle/solid/outline, counts with a `max`, a status dot, and a bump when the count changes).
  - `Skeleton` (text lines, rectangles and circles with a shimmer; static under reduced motion).
  - `Alert` (inline callout by tone, with title, actions, dismiss, and opt-in `live` announcements).
  - `EmptyState` (media, title, description, actions; sm/md).
  - `Kbd` (keys and shortcuts), `Spinner` (labelled status; pulses under reduced motion), `Separator` (decorative or semantic), `Stack` (flex layout with density-aware token gaps and an `as` prop), `Link` (accent or neutral, external links with a new-tab hint, `asChild` for router links) and `IconButton` (labelled square button with an optional tooltip).
- Moved `ListContext` and `TableContext` into their own modules (still exported from the package) and fixed the remaining lint errors; `npm run lint` is clean.
- **Accessibility and API fixes (phase 3).**
  - `Button`: new `size` (`sm`, `md`, `lg`, density-aware) and `loading` (spinner over the hidden label so the width holds; stays focusable, sets `aria-busy`, ignores clicks). Buttons now default to `type="button"`, so they no longer submit forms by accident (pass `type="submit"` explicitly). Styles moved to `--pada-button-*` component tokens; icons follow the text colour; a press scales the button slightly and a trailing icon nudges forward on hover.
  - `Checkbox`: new `indeterminate` (shows a dash, announced as "mixed"); a consumer `id` now keeps the label wired; the tick springs in.
  - `InputText` / `InputTextArea`: a consumer `id` no longer breaks the label, and a consumer `aria-describedby` is kept alongside the description or error.
  - `Select`: `name` now submits the value with forms (hidden input); the description and error describe the trigger, and errors set `aria-invalid`.
  - `Carousel` follows the APG carousel pattern: a labelled region (`label` prop) of slide groups, auto-rotation pauses on hover and focus, never runs under reduced motion, and has a pause/play button; dots are buttons with `aria-current` (not a tablist without tabs); slides fade in and the current dot widens. Fixed the controls being pushed out of view by tall slides.
  - `Notification` is a polite live region and its dismiss control is a real button.
  - `Loader` pulses more slowly under reduced motion.
- **Overlays rebuilt on the headless parts (phase 3).**
  - New `Dialog` (`Dialog.Root`, `Trigger`, `Content` with `size` auto/sm/md/lg/xl/full, `Header`, `Title`, `Description`, `Body`, `Footer`, `Close`, `CloseButton`), `Drawer` (the same parts, with `Drawer.Content side="left|right|top|bottom"` and sizes) and `DropdownMenu` (items with `icon`, `shortcut` and `tone="danger"`, checkbox and radio items, labels, separators, submenus).
  - `Popover` and `Tooltip` keep their 1.x props and are now also namespaces of parts (`Popover.Root`, `Popover.Content`, `Popover.Title`, `Popover.Arrow`, `Popover.CloseButton`; `Tooltip.Provider`, `Tooltip.Root`, `Tooltip.Content`, `Tooltip.Arrow`). They render in a portal, position with collision handling, and close on Escape and outside clicks; Popover closes when focus leaves it and labels itself from its title.
  - `Modal` and `SideDrawer` keep their 1.x props and are deprecated wrappers over `Dialog` and `Drawer`. SideDrawer is now a real modal dialog (focus trap, focus return, `aria-modal`) and accepts `aria-label` / `aria-labelledby`.
  - Every overlay animates in and out with the motion tokens (fade and scale from the trigger side, slide for drawers) and stays mounted until its exit transition finishes; reduced motion makes it instant.
  - Each styled part exposes component tokens (`--pada-dialog-*`, `--pada-drawer-*`, `--pada-popover-*`, `--pada-tooltip-*`, `--pada-menu-*`).
  - Behaviour changes: Tooltip now waits 300 ms on hover (keyboard focus still opens it at once) and only references the tooltip in `aria-describedby` while it is open; the Popover no longer follows the pointer position of the click that opened it (use `clickPosition`).
  - `Tabs` is rebuilt on new headless `Tabs` parts (`pada-ds/headless`: `Tabs.Root`, `List`, `Trigger`, `Content`, `Indicator`). Fixes: ids are unique per instance (two Tabs on a page no longer collide), keyboard focus is scoped to the tab list, Home/End work, disabled tabs are skipped. New: `Tabs.Root` with string values, `variant="underline|pills"`, `orientation`, `activationMode="automatic|manual"`, and a sliding indicator. The notification dot is announced as "unread updates" inside the tab instead of a separate `role="status"`.
  - KeyValue's info icon is now a focusable button, so keyboard users can reach its tooltip.
  - `manifest.json`, `llms.txt` and `llms-full.txt` now list compound parts as `Name.Part` entries, and expand `Omit<>` / `Pick<>` props.
- **Headless parts (`pada-ds/headless`).** Unstyled, accessible building blocks with compound parts, `asChild` composition and state exposed through `data-*` and `aria-*` attributes:
  - `Dialog` (modal and non-modal: focus trap, focus return, scroll lock, the rest of the page hidden from assistive technology, Escape and outside-click dismissal), `Popover` (anchored, flips and shifts to stay on screen, optional modal mode), `Tooltip` (hover delay, instant on keyboard focus, shared delays through `Tooltip.Provider`, hoverable content) and `DropdownMenu` (APG menu button: arrow keys, Home/End, type-ahead, checkbox and radio items, submenus).
  - Overlays stack: Escape and outside clicks only close the topmost layer. Every overlay renders through a portal and stays mounted until its exit transition finishes.
  - Utilities: `Slot`, `Portal`, `VisuallyHidden`, `useControllableState`, `usePresence`, `useDismissable`, `useFocusScope`, `useScrollLock`, `useHideOthers`, `useFloatingPosition` (Floating UI), `useTypeahead`, `findNextIndex`, `findTypeaheadIndex`, `keyToNavigation`.
  - New runtime dependency: `@floating-ui/react-dom`.
- Added component tests (Vitest, Testing Library and axe-core in jsdom); `npm test` runs them after the script tests.
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
- **Components use the 2.0 tokens.** Every component stylesheet now reads `--pada-*` tokens only: no 1.x names, no reference (tier 0) tokens, and no hard-coded colours, z-index values, durations, easings, font weights, font sizes or radii.
  - Solid fills use role tokens (`--pada-color-accent-solid`, `-solid-hover`, `-solid-pressed`, `-on-solid`), so Button, Checkbox and the Toolbar count badges keep readable text in dark mode and with any `data-accent`.
  - Overlays use `--pada-color-backdrop`, `--pada-shadow-*` and the semantic layers (`--pada-z-dropdown`, `-modal`, `-popover`, `-toast`, `-tooltip`).
  - Transitions use `--pada-duration-*` and `--pada-ease-*`, so they all stop under `prefers-reduced-motion` or `data-motion="reduced"`.
  - Dark mode fixes that came with it: CodeSnippet forces the dark scheme and stays readable in both themes; Select, SegmentControl and Steps no longer render dark text on dark fills.
- Added the `pada-tokens-migrate` CLI (`npx pada-tokens-migrate src/`), which rewrites 1.x token references in CSS, SCSS, JS and TS to their exact 2.0 names and lists the ones that need a manual choice (`--color-white`, `--color-black`, `--z-index-*`). `--themed` also moves raw palette colours to the themed ramps.
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
