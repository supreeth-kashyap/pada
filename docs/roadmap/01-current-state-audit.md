# 01. Current state audit

Snapshot of `pada-ds@1.1.0` (React) and the Angular repo as of 2026-10-17. Paths are relative to the repo root unless stated.

## 1. Summary

- **41 component folders** under `src/components/`, all re-exported from `src/index.ts`.
- **Every component is styled.** Each one imports its own CSS file with fixed class names. There is no headless layer, no exported hooks, no portals and no `asChild`/slot pattern.
- **Compound APIs are rare.** Only `List` (`ListContext`) and `Table` (`TableContext`) use context-wired parts. Sidebar supports both a data-driven and a composition API.
- **Tokens have two tiers** (Tailwind-derived primitives in `src/styles/primitives.css`, semantic colours in `src/styles/global.css`). There is no component tier and no motion, breakpoint or semantic z-index tokens.
- **Motion is ad hoc.** Transitions are literal values in each CSS file. Only `Notification` animates out. Only `Switch` has a `prefers-reduced-motion` guard in CSS.
- **Angular has 5 library components** (Avatar, Badge, Button, InfoIcon, InfoTooltip) plus app-only Attributes components, with no shared tokens.

## 2. Component inventory (React)

Legend: **C/U** = controlled / uncontrolled support.

| Component | API shape | C/U | Accessibility gaps | Motion today |
|---|---|---|---|---|
| Accordion | Monolithic; `AccordionHeader`/`AccordionContent` exported but not context-wired | Both | No arrow-key navigation between headers | None; content mounts/unmounts |
| Banner | Monolithic | n/a | Click handler on a wrapper `div` | None |
| Button (+Splitter) | Variants primary/secondary/ghost/destructive, icons, split | n/a | No `size`; no default `type="button"` | 0.2s ease |
| Card | `children`, `className` only | n/a | Does not forward other HTML attributes | None |
| Carousel | Monolithic, autoplay | Uncontrolled | Dots use `role=tablist` without `role=tab`; **no pause on hover, focus or reduced motion** | No slide animation |
| Checkbox | Native input | Native | No indeterminate state | `transition: all` |
| CodeSnippet | Prism via `dangerouslySetInnerHTML` | n/a | n/a | None |
| ComboBox | Actually a listbox, no input or filtering | Stateless | Naming is misleading | Item colour |
| DatePicker | Monolithic | Partial | **No grid keyboard navigation** | 160ms on picker boxes |
| FormLabel | Simple | n/a | n/a | n/a |
| Icon | 154 bundled SVGs plus CDN fallback | n/a | Not `aria-hidden` by default | n/a |
| Indexer | Scroll-spy | Both | Good (respects reduced motion in JS) | Colour |
| InputDate | Monolithic | Both | No Escape, no focus handling, `aria-haspopup="true"` | n/a |
| InputText / InputTextArea | Monolithic | Native | A consumer `id` breaks the label's `htmlFor` | Border |
| KeyValue | Label plus children, optional tooltip | n/a | n/a | n/a |
| List | Compound (`ListContext`) | Uncontrolled | **No keyboard reorder** (HTML5 drag and drop only) | None |
| Loader | Sizes xs to 2xl | n/a | `role=status` | Pulse keyframes; **no reduced-motion guard** |
| Logo | Third-party brand logo picker (aws, okta, soc2 …), **not the Pada logo** | n/a | CSS-only tooltip | Opacity |
| Modal | Monolithic | Controlled | Strongest in the set (trap, restore, Escape, scroll lock). **No portal** | None |
| Notification | Monolithic, 8 positions | Controlled | **No live region**; dismiss is a `div role=button` | Slide and fade, 200ms delayed unmount |
| PageHeader | Breadcrumbs, command, AI button, profile menu | Internal | No `aria-expanded`, no breadcrumb landmark, no Escape | n/a |
| Pills | `data-size`/`data-disabled`, roving tabindex | Both | Good; reference implementation for `instructions.md` | `transition: all` |
| Popover | Monolithic, manual positioning | Controlled | Fixed id `popover-title` collides; no focus management | `transition: all` |
| Progress | Value, max, label | n/a | Label not linked to the progressbar | Width 0.3s |
| RadioGroup | Native radios | Controlled | Group has no label association | Yes |
| SearchField | Value plus clear | Both | OK | Yes |
| SegmentControl | Tablist | Both | Arrow keys don't skip disabled options | 0.2s |
| Select | Built on ComboBox | Both | Full APG select-only combobox. **No hidden input, so `name` does nothing in forms**. No portal or flip | Trigger |
| SideDrawer | Sizes sm to xl | Controlled | **No `role=dialog`, no focus trap** | **None** |
| Sidebar (+6 parts) | Data-driven **and** composition APIs | `activeId` | Fixed id `sidebar-collapse-content` | Collapse 0.3s |
| Slider | Native range | Both | OK | Yes |
| Steps / Step | Data array | Partial | Steps are `div role=button` | Many `transition: all` |
| Switch | Native checkbox `role=switch` | Native | Good | Spring-less 0.2s; has reduced-motion block |
| Table (+parts) | Compound (`TableContext`), CSS grid | Partial | **All `div`s, no table roles** | Cell background |
| Tabs / TabPanel | TabPanel children used as config | Both | **Fixed ids `tab-${i}` plus `document.getElementById`**, so two Tabs on a page collide; no Home/End | Colour |
| Tags | 6 variants plus 9 deprecated aliases | n/a | n/a | n/a |
| Text | Inline styles | n/a | n/a | n/a |
| Toolbar (+Filter, MoreFilter, FilterChip …) | Button descriptors | Both | Menus have no Escape or arrow keys; `role=menu` without keyboard support; clickable span nested in a button | 0.15s |
| Tooltip | Clones child | Internal | No delay, no portal, no collision handling | **None** |
| UploadField | Dropzone | Both | Dropzone is a clickable `div`; "View" button does nothing | Several |

### Duplicated logic that should become shared utilities

| Logic | Where it is copied today |
|---|---|
| Focus trap and restore | `src/components/Modal/Modal.tsx:16-33` (selector and `getTabbable`) and the effect that follows |
| Listbox keyboard navigation | `src/components/Select/selectNavigation.ts` (`findEnabledIndex`, `findTypeaheadIndex`), already pure and tested |
| Viewport-clamped positioning | `src/components/Popover/Popover.tsx` (hand-written) |
| Delayed unmount for exit animation | `src/components/Notification/Notification.tsx:54-63` |
| Click outside | Select (pointerdown), InputDate, PageHeader, Filter, MoreFilter (mousedown) |
| Escape to close | Modal, SideDrawer, Popover, Tooltip, Select |
| Hard-coded ids | `Tabs.tsx:55,70,97`, `Popover.tsx:195`, `SidebarCollapse.tsx:39` |

## 3. Token layer bugs

| Bug | Evidence | Effect |
|---|---|---|
| Semantic `--color-neutral-*` reuses the primitive name | `primitives.css:35` defines `--color-neutral-50: #fafafa`; `global.css:346` redefines it as `var(--color-stone-50)` (light), `global.css:43` as `var(--color-stone-900)` (dark) | The winner depends on stylesheet order. `dist/tokens.css` and the demo load them in different orders |
| `accent-neutral` inverted twice in dark mode | `global.css:99` sets `--color-accent-neutral-50: var(--color-neutral-900)`, and `--color-neutral-900` is already inverted in dark mode | Resolves to a near-white value in dark mode |
| Undefined tokens | `--font-5`, `--font-3`, `--color-fg-muted` (`Modal.css:31,37,53`); `--font-2` (`Tooltip.css:12`, `Progress.css:8`); `--color-fg-default` (`Progress.css:10`); `--font-size-md` (`Indexer.css:43`); `--shadow-xs` (`PickerBox.css:42`) | Fall back to inherited values silently |
| Typo | `--color-primray-200` (`Pills.css:91`) | Border colour never applies |
| Stale map | `src/docs/tokens-map.json` refers to `--tw-color-*` names that do not exist | Misleading documentation |

### Values that bypass tokens

- **z-index:** 1000 (Modal, Popover, SideDrawer, Select, InputDate, Logo), 1001 (Popover), 1100 (Notification), 20 (Filter, MoreFilter), 10 (Tooltip, PageHeader).
- **Overlay and shadow colours:** `Modal.css:7`, `SideDrawer.css:6,13`, `Popover.css:28,34`.
- **Syntax highlighting:** `CodeSnippet.css:54-78`.
- **Raw px** radius and font sizes in `Filter.css`, `MoreFilter.css`, `Modal.css`, `Notification.css`, `DatePicker.css`, `Carousel.css`, `Switch.css`.
- **Durations and easings** are literals in every component CSS file.
- **Light/dark gaps:** `--shadow-focus-ring` keeps a white inner ring in dark mode; `--size-*` duplicates `--spacing-*`; there are no `success`, `warning`, `danger`, `surface` or `fg-muted` semantic tokens.

## 4. Brand assets

- The Pada mark lives at `src/components/Sidebar/assets/pada-logo-mark.svg`: two mirrored shapes, amber `#F59E0B` on the left, indigo `#6366F1` on the right, wide at the top and tapering to a rounded point at the bottom, with a gap between them. Seen from above, the pair already reads like two soles.
- The wordmark `pada-wordmark.svg` spells "Pada . design" in stone-400.
- The favicon is still `public/vite.svg` and `index.html` has the title "myapp".

## 5. Angular repo (summary)

Full details in the Angular repo's [`docs/roadmap/README.md`](https://github.com/supreeth-kashyap/pada-ds-angular/blob/main/docs/roadmap/README.md).

- Angular 21.2, `@angular/cdk` 21.2 (installed but unused), Vitest.
- Library `projects/pada-ds` exports Avatar, Badge, Button, InfoIcon, InfoTooltip.
- App-only: Attributes, SectionHeader, AttributeRow and value renderers.
- No tokens. All colours are hard-coded hex values; the fonts (`Antique Legacy`, `Open Sans`) differ from React (`SF Pro`).
- ng-packagr is not a devDependency; the library has no test target; orphaned html/scss duplicates and re-export shims remain under `src/app/components`.
- The library's npm name `pada-ds` collides with the React package.

## 6. Test and tooling baseline

- React: `npm test` runs `node --test` on `scripts/a11y.test.mjs` (SSR markup checks) and `scripts/component-manifest.test.mjs` (manifest and llms staleness). No DOM test runner, no visual regression.
- `npm run smoke:consumer` builds, packs and compiles a consumer.
- 2.0 adds: Vitest + Testing Library + `jest-axe` (or `vitest-axe`) for interaction and a11y tests, Playwright for keyboard and visual checks, and a lint script that fails on undefined `var(--…)` references.
