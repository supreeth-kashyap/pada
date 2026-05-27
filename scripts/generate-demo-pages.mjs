#!/usr/bin/env node
/**
 * One-shot generator for the per-entry demo pages under `src/demo/documentation/`.
 * Idempotent — overwrites existing placeholders, so safe to re-run after adding
 * a new component to the list below.
 *
 * Once a page has real content, you can stop re-running this script for that page
 * (just remove it from the list, or guard the write with `fs.existsSync`).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, '../src/demo/documentation');

const FOUNDATION = [
  ['typography', 'Typography', 'Typography'],
  ['colors', 'Colors', 'Colors'],
  ['shadows', 'Shadows', 'Shadows'],
  ['gradients', 'Gradients', 'Gradients'],
  ['animation', 'Animation', 'Animation'],
];

const COMPONENTS = [
  ['accordion', 'Accordion', 'Accordion'],
  ['banner', 'Banner', 'Banner'],
  ['button', 'Button', 'Button'],
  ['card', 'Card', 'Card'],
  ['carousel', 'Carousel', 'Carousel'],
  ['checkbox', 'Checkbox', 'Checkbox'],
  ['code-snippet', 'Code Snippet', 'CodeSnippet'],
  ['combo-box', 'Combo Box', 'ComboBox'],
  ['date-picker', 'Date Picker', 'DatePicker'],
  ['form-label', 'Form Label', 'FormLabel'],
  ['icon', 'Icon', 'Icon'],
  ['indexer', 'Indexer', 'Indexer'],
  ['input-date', 'Input Date', 'InputDate'],
  ['input-text', 'Input Text', 'InputText'],
  ['input-text-area', 'Input Text Area', 'InputTextArea'],
  ['key-value', 'Key Value', 'KeyValue'],
  ['list', 'List', 'List'],
  ['loader', 'Loader', 'Loader'],
  ['logo', 'Logo', 'Logo'],
  ['modal', 'Modal', 'Modal'],
  ['notification', 'Notification', 'Notification'],
  ['page-header', 'Page Header', 'PageHeader'],
  ['pills', 'Pills', 'Pills'],
  ['popover', 'Popover', 'Popover'],
  ['progress', 'Progress', 'Progress'],
  ['radio-group', 'Radio Group', 'RadioGroup'],
  ['search-field', 'Search Field', 'SearchField'],
  ['segment-control', 'Segment Control', 'SegmentControl'],
  ['select', 'Select', 'Select'],
  ['side-drawer', 'Side Drawer', 'SideDrawer'],
  ['sidebar', 'Sidebar', 'Sidebar'],
  ['slider', 'Slider', 'Slider'],
  ['steps', 'Steps', 'Steps'],
  ['switch', 'Switch', 'Switch'],
  ['table', 'Table', 'Table'],
  ['tabs', 'Tabs', 'Tabs'],
  ['tags', 'Tags', 'Tags'],
  ['text', 'Text', 'Text'],
  ['toolbar', 'Toolbar', 'Toolbar'],
  ['tooltip', 'Tooltip', 'Tooltip'],
  ['upload-field', 'Upload Field', 'UploadField'],
];

const template = (title, kind, fn) =>
  `import DemoPage from '../DemoPage';

export default function ${fn}Demo() {
  return <DemoPage title="${title}" kind="${kind}" />;
}
`;

const writeAll = (kindDir, entries, kindLabel) => {
  const dir = resolve(DOCS_DIR, kindDir);
  mkdirSync(dir, { recursive: true });
  for (const [slug, title, fn] of entries) {
    writeFileSync(resolve(dir, `${slug}-demo.tsx`), template(title, kindLabel, fn));
  }
  console.log(`✓ Wrote ${entries.length} ${kindDir} pages → ${dir}`);
};

writeAll('foundation', FOUNDATION, 'Foundation');
writeAll('components', COMPONENTS, 'Component');
