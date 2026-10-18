# 08. React ↔ Angular parity

This file is copied verbatim into the Angular repo as `docs/roadmap/parity.md`. Update both copies together.

Legend: ✅ exists and matches the 1.x React behaviour · 🟡 partial · ⛔ missing · **Phase** = roadmap phase where the 2.0 version (headless + styled, both frameworks) lands.

**React 2.0** column: ✅ the 2.0 version ships in React (on the headless core where it has behaviour, with tests and a docs page) · 🟡 2.0 tokens and accessibility fixes only, compound parts still to do · ⛔ not started.

Status as of 2026-10-18. React work is on the `claude/pada-2` branch, not yet released. The Angular column is unchanged since the audit.

## 1. Existing React components

| Component | React 1.x | React 2.0 | Angular | Notes | 2.0 name | Phase |
|---|---|---|---|---|---|---|
| Accordion | ✅ | ✅ | ⛔ | React: headless Accordion and Collapsible | Accordion | 3 |
| Banner | ✅ | 🟡 | ⛔ |  | Banner | 3 |
| Button | ✅ | 🟡 | 🟡 | React: `size`, `loading`, `type="button"`; IconButton ✅; no ButtonGroup; Angular: Label and disabled only; no variants, icons, split | Button, IconButton, ButtonGroup | 3 |
| Card | ✅ | 🟡 | ⛔ |  | Card | 3 |
| Carousel | ✅ | 🟡 | ⛔ | React: APG carousel semantics and pause; no parts | Carousel | 3 |
| Checkbox | ✅ | 🟡 | ⛔ | React: `indeterminate` | Checkbox | 3 |
| CodeSnippet | ✅ | 🟡 | ⛔ |  | CodeSnippet | 3 |
| ComboBox | ✅ | 🟡 | ⛔ | React: roving focus; not renamed (Autocomplete is the combobox) | Listbox | 3 |
| DatePicker | ✅ | ✅ | ⛔ | React: day view on Calendar | DatePicker (on Calendar) | 3 |
| FormLabel | ✅ | ✅ | ⛔ | React: Field.Label | Field.Label | 3 |
| Icon | ✅ | 🟡 | 🟡 | Angular: `ds-info-icon` only; no icon registry | Icon | 3 |
| Indexer | ✅ | 🟡 | ⛔ |  | Indexer | 3 |
| InputDate | ✅ | ✅ | ⛔ | React: Popover dialog with Calendar | InputDate | 3 |
| InputText | ✅ | 🟡 | ⛔ | React: label and describedby fixes; not on Field yet | InputText (on Field) | 3 |
| InputTextArea | ✅ | 🟡 | ⛔ | React: as InputText | InputTextArea (on Field) | 3 |
| KeyValue | ✅ | 🟡 | 🟡 | React: DescriptionList not built; Angular: Attributes/AttributeRow in the app, not the library; stacked layout | DescriptionList | 3 |
| List | ✅ | ✅ | ⛔ | React: keyboard reorder, FLIP | List | 3 |
| Loader | ✅ | ✅ | ⛔ | React: Spinner (Loader kept) | Spinner | 3 |
| Logo (brand logos) | ✅ | ✅ | ⛔ | React: BrandLogo, Logo alias | BrandLogo | 3 |
| Modal | ✅ | ✅ | ⛔ | React: Dialog, Modal wrapper | Dialog | 2 |
| Notification | ✅ | ✅ | ⛔ | React: Toaster and `toast()`; Notification kept as 1.x | Toast / Toaster | 3 |
| PageHeader | ✅ | 🟡 | ⛔ |  | PageHeader | 3 |
| Pills | ✅ | 🟡 | ⛔ |  | Pills | 3 |
| Popover | ✅ | ✅ | ⛔ |  | Popover | 2 |
| Progress | ✅ | 🟡 | ⛔ | React: no ProgressCircle | Progress, ProgressCircle | 3 |
| RadioGroup | ✅ | 🟡 | ⛔ | React: group labelling | RadioGroup | 3 |
| SearchField | ✅ | 🟡 | ⛔ |  | SearchField | 3 |
| SegmentControl | ✅ | 🟡 | ⛔ |  | SegmentControl | 3 |
| Select | ✅ | 🟡 | ⛔ | React: portal, flip, type-ahead, `name`; no compound parts | Select | 3 |
| SideDrawer | ✅ | ✅ | ⛔ | React: Drawer, SideDrawer wrapper | Drawer | 2 |
| Sidebar | ✅ | 🟡 | ⛔ | React: PadaLogo default | Sidebar | 3 |
| Slider | ✅ | 🟡 | ⛔ | React: RangeSlider ✅ separately | Slider | 3 |
| Steps | ✅ | ✅ | ⛔ |  | Steps | 3 |
| Switch | ✅ | 🟡 | ⛔ |  | Switch | 3 |
| Table | ✅ | ✅ | ⛔ | React: table roles, `aria-sort`, resizable columns; DataTable ✅ | Table | 3 |
| Tabs | ✅ | ✅ | ⛔ |  | Tabs | 3 |
| Tags | ✅ | 🟡 | ⛔ | React: no Tag / TagGroup | Tag, TagGroup | 3 |
| Text | ✅ | 🟡 | ⛔ | React: no Heading | Text, Heading | 3 |
| Toolbar (+Filter, MoreFilter, FilterChip) | ✅ | 🟡 | ⛔ | React: filters on Popover, FilterChip fixed; no roving toolbar focus | Toolbar | 3 |
| Tooltip | ✅ | ✅ | 🟡 | Angular: `ds-info-tooltip`: top only, no overlay, fixed trigger icon | Tooltip | 2 |
| UploadField | ✅ | ✅ | ⛔ |  | UploadField | 3 |

## 2. Angular-only components

| Component | Angular | React | 2.0 name | Phase |
|---|---|---|---|---|
| Avatar | ✅ | ✅ 2.0 | Avatar, AvatarGroup | 4 |
| Badge | ✅ | ✅ 2.0 | Badge | 4 |
| InfoTooltip | ✅ | 🟡 (Tooltip + info Icon) | Tooltip recipe | 2 |
| Attributes / SectionHeader / AttributeRow | 🟡 (app only) | 🟡 (KeyValue) | DescriptionList | 3 |

## 3. New in 2.0

Angular has none of these yet.

| Component | Phase | React 2.0 | | Component | Phase | React 2.0 |
|---|---|---|---|---|---|---|
| Field | 4 | ✅ | | NumberInput | 5 | ✅ |
| Stack | 4 | ✅ | | PasswordInput | 5 | ✅ |
| Separator | 4 | ✅ | | PinInput | 5 | ✅ |
| VisuallyHidden | 2 | ✅ (headless) | | TagInput / MultiSelect | 5 | ✅ TagInput |
| Toggle | 4 | ✅ | | RangeSlider | 5 | ✅ |
| ToggleGroup | 4 | ✅ | | CheckboxGroup | 5 | ⛔ |
| DropdownMenu | 2 | ✅ | | RadioCard | 5 | ✅ |
| AlertDialog | 4 | ✅ | | Rating | 5 | ✅ |
| Combobox (filterable) | 4 | ✅ Autocomplete | | TimePicker | 5 | ⛔ |
| CommandPalette | 4 | ✅ | | ColorPicker | 5 | ✅ |
| Breadcrumbs | 4 | ✅ | | ContextMenu | 5 | ✅ |
| Pagination | 4 | ✅ | | HoverCard | 5 | ✅ |
| Skeleton | 4 | ✅ | | Collapsible | 5 | ✅ (headless) |
| Alert / Callout | 4 | ✅ Alert | | Menubar | 5 | ✅ |
| EmptyState | 4 | ✅ | | Tree | 5 | ✅ |
| Kbd | 4 | ✅ | | DataTable | 5 | ✅ |
| IconButton | 4 | ✅ | | Calendar | 5 | ✅ |
| Link | 4 | ✅ | | DateRangePicker | 5 | 🟡 range in Calendar and InputDate |
| ThemeProvider / ThemeToggle | 4 | ✅ | | Timeline | 5 | ✅ |
| PadaLogo | 7 | ✅ | | Stat | 5 | ✅ |
| Spinner | 4 | ✅ | | ScrollArea, AspectRatio, Grid, Container | 5 | ✅ |
| Toaster / toast | 4 | ✅ | | Sheet, Resizable | 5 | ✅ |

## 4. Shared foundations

| Foundation | React 1.x | React 2.0 | Angular |
|---|---|---|---|
| Tokens (CSS custom properties) | ✅ | ✅ five tiers, `--pada-*`, 1.x aliases, `pada-tokens-migrate` | ⛔ hard-coded hex values (`tokens:sync` ready to run) |
| Light/dark theming | ✅ | ✅ plus accent, neutral, density, radius, motion and contrast axes; `ThemeProvider` | ⛔ |
| Headless core | ⛔ | ✅ `pada-ds/headless`, 18 modules (Menubar lives in Menu; DataTable is the `useDataTable` hook) | ⛔ (CDK installed, unused) |
| Motion tokens | ⛔ | ✅ durations and easings scaled by `--pada-motion-scale` | ⛔ |
| Machine-readable manifest / llms.txt | ✅ | ✅ with compound parts and aliases | ⛔ |
| Library test target | 🟡 (`node --test`, SSR only) | ✅ Vitest, Testing Library and axe (223 tests) plus node script tests | ⛔ (specs live in the app) |

## 5. Process

1. **Spec first.** A component starts with `specs/<component>.md` (see [03 §4](./03-headless-architecture.md#4-shared-component-spec)). The spec is reviewed once and copied to both repos.
2. **Same tests.** Interaction tests are generated from the spec's keyboard table, so both frameworks run identical scenarios.
3. **Same tokens.** Angular uses the synced `tokens.css`; component SCSS uses only `--pada-*` tokens.
4. **Done means both.** A component's row turns ✅ only when both frameworks ship the 2.0 version. Phase exit criteria in the [README](./README.md#phases) depend on this table.
5. **Manifest parity.** The Angular repo gains a manifest generator that emits the same JSON shape as React's `manifest.json`, and a CI script diffs the two manifests' part and token lists.
