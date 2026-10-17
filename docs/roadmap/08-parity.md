# 08. React ↔ Angular parity

This file is copied verbatim into the Angular repo as `docs/roadmap/parity.md`. Update both copies together.

Legend: ✅ exists and matches the 1.x React behaviour · 🟡 partial · ⛔ missing · **Phase** = roadmap phase where the 2.0 version (headless + styled, both frameworks) lands.

Status as of 2026-10-17.

## 1. Existing React components

| Component | React | Angular | Angular notes | 2.0 name | Phase |
|---|---|---|---|---|---|
| Accordion | ✅ | ⛔ | | Accordion | 3 |
| Banner | ✅ | ⛔ | | Banner | 3 |
| Button | ✅ | 🟡 | Label and disabled only; no variants, icons, split | Button, IconButton, ButtonGroup | 3 |
| Card | ✅ | ⛔ | | Card | 3 |
| Carousel | ✅ | ⛔ | | Carousel | 3 |
| Checkbox | ✅ | ⛔ | | Checkbox | 3 |
| CodeSnippet | ✅ | ⛔ | | CodeSnippet | 3 |
| ComboBox | ✅ | ⛔ | | Listbox | 3 |
| DatePicker | ✅ | ⛔ | | DatePicker (on Calendar) | 3 |
| FormLabel | ✅ | ⛔ | | Field.Label | 3 |
| Icon | ✅ | 🟡 | `ds-info-icon` only; no icon registry | Icon | 3 |
| Indexer | ✅ | ⛔ | | Indexer | 3 |
| InputDate | ✅ | ⛔ | | InputDate | 3 |
| InputText | ✅ | ⛔ | | InputText (on Field) | 3 |
| InputTextArea | ✅ | ⛔ | | InputTextArea (on Field) | 3 |
| KeyValue | ✅ | 🟡 | Attributes/AttributeRow in the app, not the library; stacked layout | DescriptionList | 3 |
| List | ✅ | ⛔ | | List | 3 |
| Loader | ✅ | ⛔ | | Spinner | 3 |
| Logo (brand logos) | ✅ | ⛔ | | BrandLogo | 3 |
| Modal | ✅ | ⛔ | | Dialog | 2 |
| Notification | ✅ | ⛔ | | Toast / Toaster | 3 |
| PageHeader | ✅ | ⛔ | | PageHeader | 3 |
| Pills | ✅ | ⛔ | | Pills | 3 |
| Popover | ✅ | ⛔ | | Popover | 2 |
| Progress | ✅ | ⛔ | | Progress, ProgressCircle | 3 |
| RadioGroup | ✅ | ⛔ | | RadioGroup | 3 |
| SearchField | ✅ | ⛔ | | SearchField | 3 |
| SegmentControl | ✅ | ⛔ | | SegmentControl | 3 |
| Select | ✅ | ⛔ | | Select | 3 |
| SideDrawer | ✅ | ⛔ | | Drawer | 2 |
| Sidebar | ✅ | ⛔ | | Sidebar | 3 |
| Slider | ✅ | ⛔ | | Slider | 3 |
| Steps | ✅ | ⛔ | | Steps | 3 |
| Switch | ✅ | ⛔ | | Switch | 3 |
| Table | ✅ | ⛔ | | Table | 3 |
| Tabs | ✅ | ⛔ | | Tabs | 3 |
| Tags | ✅ | ⛔ | | Tag, TagGroup | 3 |
| Text | ✅ | ⛔ | | Text, Heading | 3 |
| Toolbar (+Filter, MoreFilter, FilterChip) | ✅ | ⛔ | | Toolbar | 3 |
| Tooltip | ✅ | 🟡 | `ds-info-tooltip`: top only, no overlay, fixed trigger icon | Tooltip | 2 |
| UploadField | ✅ | ⛔ | | UploadField | 3 |

## 2. Angular-only components

| Component | Angular | React | 2.0 name | Phase |
|---|---|---|---|---|
| Avatar | ✅ | ⛔ | Avatar, AvatarGroup | 4 |
| Badge | ✅ | ⛔ | Badge | 4 |
| InfoTooltip | ✅ | 🟡 (Tooltip + info Icon) | Tooltip recipe | 2 |
| Attributes / SectionHeader / AttributeRow | 🟡 (app only) | 🟡 (KeyValue) | DescriptionList | 3 |

## 3. New in 2.0 (both ⛔ today)

| Component | Phase | | Component | Phase |
|---|---|---|---|---|
| Field | 4 | | NumberInput | 5 |
| Stack | 4 | | PasswordInput | 5 |
| Separator | 4 | | PinInput | 5 |
| VisuallyHidden | 2 | | TagInput / MultiSelect | 5 |
| Toggle | 4 | | RangeSlider | 5 |
| ToggleGroup | 4 | | CheckboxGroup | 5 |
| DropdownMenu | 2 | | RadioCard | 5 |
| AlertDialog | 4 | | Rating | 5 |
| Combobox (filterable) | 4 | | TimePicker | 5 |
| CommandPalette | 4 | | ColorPicker | 5 |
| Breadcrumbs | 4 | | ContextMenu | 5 |
| Pagination | 4 | | HoverCard | 5 |
| Skeleton | 4 | | Collapsible | 5 |
| Alert / Callout | 4 | | Menubar | 5 |
| EmptyState | 4 | | Tree | 5 |
| Kbd | 4 | | DataTable | 5 |
| IconButton | 4 | | Calendar | 5 |
| Link | 4 | | DateRangePicker | 5 |
| ThemeProvider / ThemeToggle | 4 | | Timeline | 5 |
| PadaLogo | 7 | | Stat | 5 |
| | | | ScrollArea, AspectRatio, Grid, Container | 5 |
| | | | Sheet, Resizable | 5 |

## 4. Shared foundations

| Foundation | React | Angular |
|---|---|---|
| Tokens (CSS custom properties) | ✅ 1.x | ⛔ hard-coded hex values |
| Light/dark theming | ✅ | ⛔ |
| Headless core | ⛔ | ⛔ (CDK installed, unused) |
| Motion tokens | ⛔ | ⛔ |
| Machine-readable manifest / llms.txt | ✅ | ⛔ |
| Library test target | 🟡 (`node --test`, SSR only) | ⛔ (specs live in the app) |

## 5. Process

1. **Spec first.** A component starts with `specs/<component>.md` (see [03 §4](./03-headless-architecture.md#4-shared-component-spec)). The spec is reviewed once and copied to both repos.
2. **Same tests.** Interaction tests are generated from the spec's keyboard table, so both frameworks run identical scenarios.
3. **Same tokens.** Angular uses the synced `tokens.css`; component SCSS uses only `--pada-*` tokens.
4. **Done means both.** A component's row turns ✅ only when both frameworks ship the 2.0 version. Phase exit criteria in the [README](./README.md#phases) depend on this table.
5. **Manifest parity.** The Angular repo gains a manifest generator that emits the same JSON shape as React's `manifest.json`, and a CI script diffs the two manifests' part and token lists.
