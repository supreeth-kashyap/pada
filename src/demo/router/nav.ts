/**
 * Canonical list of foundation entries and components shown in the demo sidebar.
 *
 * The order in these arrays is the order that appears in the sidebar. Components are
 * intentionally listed alphabetically. Adding a new entry here is the only place you
 * need to touch to introduce a new sidebar item — the router auto-discovers its demo
 * page from `src/demo/documentation/{foundation|components}/{slug}-demo.tsx` via
 * `import.meta.glob` (see `routes.tsx`).
 */

import type { SidebarData, SidebarMenuItemData } from '../../components/Sidebar';

export type NavKind = 'foundation' | 'components';

export interface NavEntry {
  kind: NavKind;
  /** URL slug — used as the path segment and as the demo-file name prefix. */
  slug: string;
  /** Human-readable label displayed in the sidebar. */
  label: string;
}

const FOUNDATION_ENTRIES: NavEntry[] = [
  { kind: 'foundation', slug: 'playground', label: 'Playground (2.0)' },
  { kind: 'foundation', slug: 'typography', label: 'Typography' },
  { kind: 'foundation', slug: 'colors', label: 'Colors' },
  { kind: 'foundation', slug: 'shadows', label: 'Shadows' },
  { kind: 'foundation', slug: 'gradients', label: 'Gradients' },
  { kind: 'foundation', slug: 'animation', label: 'Animation' },
  { kind: 'foundation', slug: 'layout', label: 'Layout' },
  { kind: 'foundation', slug: 'brand', label: 'Brand' },
  { kind: 'foundation', slug: 'theme', label: 'Theme' },
];

const COMPONENT_ENTRIES: NavEntry[] = [
  { kind: 'components', slug: 'accordion', label: 'Accordion' },
  { kind: 'components', slug: 'alert', label: 'Alert' },
  { kind: 'components', slug: 'alert-dialog', label: 'Alert Dialog' },
  { kind: 'components', slug: 'autocomplete', label: 'Autocomplete' },
  { kind: 'components', slug: 'avatar', label: 'Avatar' },
  { kind: 'components', slug: 'badge', label: 'Badge' },
  { kind: 'components', slug: 'banner', label: 'Banner' },
  { kind: 'components', slug: 'logo', label: 'Brand Logo' },
  { kind: 'components', slug: 'breadcrumbs', label: 'Breadcrumbs' },
  { kind: 'components', slug: 'button', label: 'Button' },
  { kind: 'components', slug: 'calendar', label: 'Calendar' },
  { kind: 'components', slug: 'card', label: 'Card' },
  { kind: 'components', slug: 'carousel', label: 'Carousel' },
  { kind: 'components', slug: 'checkbox', label: 'Checkbox' },
  { kind: 'components', slug: 'code-snippet', label: 'Code Snippet' },
  { kind: 'components', slug: 'combo-box', label: 'Combo Box' },
  { kind: 'components', slug: 'command-palette', label: 'Command Palette' },
  { kind: 'components', slug: 'context-menu', label: 'Context Menu' },
  { kind: 'components', slug: 'date-picker', label: 'Date Picker' },
  { kind: 'components', slug: 'dialog', label: 'Dialog' },
  { kind: 'components', slug: 'drawer', label: 'Drawer' },
  { kind: 'components', slug: 'dropdown-menu', label: 'Dropdown Menu' },
  { kind: 'components', slug: 'empty-state', label: 'Empty State' },
  { kind: 'components', slug: 'field', label: 'Field' },
  { kind: 'components', slug: 'form-label', label: 'Form Label' },
  { kind: 'components', slug: 'hover-card', label: 'Hover Card' },
  { kind: 'components', slug: 'icon', label: 'Icon' },
  { kind: 'components', slug: 'icon-button', label: 'Icon Button' },
  { kind: 'components', slug: 'indexer', label: 'Indexer' },
  { kind: 'components', slug: 'input-date', label: 'Input Date' },
  { kind: 'components', slug: 'input-text', label: 'Input Text' },
  { kind: 'components', slug: 'input-text-area', label: 'Input Text Area' },
  { kind: 'components', slug: 'kbd', label: 'Kbd' },
  { kind: 'components', slug: 'key-value', label: 'Key Value' },
  { kind: 'components', slug: 'link', label: 'Link' },
  { kind: 'components', slug: 'list', label: 'List' },
  { kind: 'components', slug: 'loader', label: 'Loader' },
  { kind: 'components', slug: 'menubar', label: 'Menubar' },
  { kind: 'components', slug: 'modal', label: 'Modal' },
  { kind: 'components', slug: 'notification', label: 'Notification' },
  { kind: 'components', slug: 'number-input', label: 'Number Input' },
  { kind: 'components', slug: 'page-header', label: 'Page Header' },
  { kind: 'components', slug: 'pagination', label: 'Pagination' },
  { kind: 'components', slug: 'password-input', label: 'Password Input' },
  { kind: 'components', slug: 'pills', label: 'Pills' },
  { kind: 'components', slug: 'pin-input', label: 'Pin Input' },
  { kind: 'components', slug: 'popover', label: 'Popover' },
  { kind: 'components', slug: 'progress', label: 'Progress' },
  { kind: 'components', slug: 'radio-card', label: 'Radio Card' },
  { kind: 'components', slug: 'radio-group', label: 'Radio Group' },
  { kind: 'components', slug: 'range-slider', label: 'Range Slider' },
  { kind: 'components', slug: 'rating', label: 'Rating' },
  { kind: 'components', slug: 'resizable', label: 'Resizable' },
  { kind: 'components', slug: 'scroll-area', label: 'Scroll Area' },
  { kind: 'components', slug: 'search-field', label: 'Search Field' },
  { kind: 'components', slug: 'segment-control', label: 'Segment Control' },
  { kind: 'components', slug: 'select', label: 'Select' },
  { kind: 'components', slug: 'separator', label: 'Separator' },
  { kind: 'components', slug: 'sheet', label: 'Sheet' },
  { kind: 'components', slug: 'side-drawer', label: 'Side Drawer' },
  { kind: 'components', slug: 'sidebar', label: 'Sidebar' },
  { kind: 'components', slug: 'skeleton', label: 'Skeleton' },
  { kind: 'components', slug: 'slider', label: 'Slider' },
  { kind: 'components', slug: 'spinner', label: 'Spinner' },
  { kind: 'components', slug: 'stack', label: 'Stack' },
  { kind: 'components', slug: 'stat', label: 'Stat' },
  { kind: 'components', slug: 'steps', label: 'Steps' },
  { kind: 'components', slug: 'switch', label: 'Switch' },
  { kind: 'components', slug: 'table', label: 'Table' },
  { kind: 'components', slug: 'tabs', label: 'Tabs' },
  { kind: 'components', slug: 'tag-input', label: 'Tag Input' },
  { kind: 'components', slug: 'tags', label: 'Tags' },
  { kind: 'components', slug: 'text', label: 'Text' },
  { kind: 'components', slug: 'timeline', label: 'Timeline' },
  { kind: 'components', slug: 'toast', label: 'Toast' },
  { kind: 'components', slug: 'toggle', label: 'Toggle & Toggle Group' },
  { kind: 'components', slug: 'toolbar', label: 'Toolbar' },
  { kind: 'components', slug: 'tooltip', label: 'Tooltip' },
  { kind: 'components', slug: 'tree', label: 'Tree' },
  { kind: 'components', slug: 'upload-field', label: 'Upload Field' },
];

export const NAV_ENTRIES: NavEntry[] = [...FOUNDATION_ENTRIES, ...COMPONENT_ENTRIES];

/** URL path for a nav entry. */
export const pathFor = (entry: NavEntry): string => `/${entry.kind}/${entry.slug}`;

/** Build a sidebar-menu item from a nav entry. */
const toMenuItem = (entry: NavEntry): SidebarMenuItemData => ({
  id: `${entry.kind}/${entry.slug}`,
  label: entry.label,
  href: pathFor(entry),
});

/** Default sidebar data used by the demo app. */
export const sidebarData: SidebarData = {
  sections: [
    { id: 'foundation', label: 'Foundation', items: FOUNDATION_ENTRIES.map(toMenuItem) },
    { id: 'components', label: 'Components', items: COMPONENT_ENTRIES.map(toMenuItem) },
  ],
};

/** Default landing route when the URL is `/`. */
export const DEFAULT_PATH = pathFor(FOUNDATION_ENTRIES[0]);
