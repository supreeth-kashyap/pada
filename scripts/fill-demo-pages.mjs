#!/usr/bin/env node
/**
 * Bulk-generate (or refresh) every component demo page under
 * `src/demo/documentation/components/`. Each entry below produces a complete
 * `.tsx` file following the canonical 4-section template (Purpose / Design /
 * Developer / Accessibility) used by the Button & Typography pilots.
 *
 * Run from repo root: `node scripts/fill-demo-pages.mjs`
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/demo/documentation/components');

const t = (s) => s.replace(/`/g, '\\`');

const A11Y = (...lines) =>
  `<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>${lines
    .map((l) => `<li>${l}</li>`)
    .join('')}</ul>`;

const DEV = (component, code) =>
  `<><p>Import the <code>${component}</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={\`${t(code)}\`} language="tsx" label="${component} usage" /></>`;

const SHOWCASE = (jsx, dir = 'row') =>
  `<div className="demo-page__showcase" style={{ flexDirection: '${dir}', gap: 16 }}>${jsx}</div>`;

const PAGE = ({ slug, fn, title, imports, purpose, designPara, designRender, dev, a11y }) => `import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
${imports}

export default function ${fn}Demo() {
  return (
    <DemoPage
      title="${title}"
      kind="Component"
      purpose={<p>${purpose}</p>}
      design={<><p>${designPara}</p>${designRender}</>}
      developer={${dev}}
      accessibility={${a11y}}
    />
  );
}
`;

// ---------------------------------------------------------------------------
// Per-component definitions
// ---------------------------------------------------------------------------

const c = (slug, fn, title, def) => ({ slug, fn, title, ...def });

const PAGES = [
  c('accordion', 'Accordion', 'Accordion', {
    imports: `import { Accordion } from '../../../components/Accordion';`,
    purpose:
      'Accordion lets users expand and collapse a section of content to manage information density on long pages. Use it for FAQs, settings panels, and grouped detail views where revealing every section at once would overwhelm the reader. Each section is independently controlled and progressively discloses content only when the user asks for it.',
    designPara:
      'An Accordion contains one or more items, each composed of an <code>AccordionHeader</code> (the always-visible trigger) and an <code>AccordionContent</code> (the disclosed body). Items can be expanded one at a time or independently.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}><Accordion header="What is Pada?" defaultOpen>Pada is a singular React design system focused on dense product UIs.</Accordion><Accordion header="How do I install it?">Install via <code>npm install pada-ds</code>.</Accordion></div>`,
      'column'
    ),
    dev: DEV(
      'Accordion',
      `import { Accordion } from 'pada-ds';

export function FAQ() {
  return (
    <Accordion header="Section title" defaultOpen>
      Hidden body shown only when expanded.
    </Accordion>
  );
}`
    ),
    a11y: A11Y(
      'Headers expose <code>aria-expanded</code> and <code>aria-controls</code> linking to the panel.',
      'Keyboard support: <kbd>Enter</kbd> / <kbd>Space</kbd> toggles the section, <kbd>Tab</kbd> moves between headers.',
      'Trigger meets the AA 4.5:1 text contrast and shows a focus ring on <code>:focus-visible</code>.',
      'Animations honor <code>prefers-reduced-motion: reduce</code>.'
    ),
  }),

  c('banner', 'Banner', 'Banner', {
    imports: `import { Banner } from '../../../components/Banner';`,
    purpose:
      'Banner displays a persistent, page-level message — system status, important warnings, or required actions that affect the entire workspace. Use it sparingly; one banner at a time keeps the message in focus. Banners are not for transient feedback (use Notification for that).',
    designPara:
      'Banner shows a title, optional subtitle, optional leading visual, and an optional call-to-action button. Place it at the top of the surface it applies to.',
    designRender: SHOWCASE(
      `<div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}><Banner title="A new version is available." subtitle="Upgrade now to get the latest features." /><Banner title="Settings saved successfully." /><Banner title="Trial ends in 3 days." subtitle="Pick a plan to keep your workspace active." /></div>`,
      'column'
    ),
    dev: DEV(
      'Banner',
      `import { Banner } from 'pada-ds';

export function MaintenanceNotice() {
  return (
    <Banner
      title="Scheduled maintenance"
      subtitle="The workspace will be unavailable from 2am to 3am UTC."
    />
  );
}`
    ),
    a11y: A11Y(
      'Each severity meets AA 4.5:1 text contrast against its tinted surface.',
      'Banners use <code>role="status"</code> for non-critical messages and <code>role="alert"</code> for errors so screen readers announce changes.',
      'When a banner is dismissible, focus returns to a logical neighbor after dismissal.'
    ),
  }),

  c('card', 'Card', 'Card', {
    imports: `import { Card } from '../../../components/Card';`,
    purpose:
      'Card groups related content and actions into a contained surface. Use cards to chunk lists of entities (records, projects, dashboards) that the user can scan and act on. Avoid nesting cards or using them for ambient page chrome.',
    designPara:
      'Cards have a white surface with subtle shadow elevation, optional padding, and consistent corner radius. Compose them with headings, body text, and action buttons.',
    designRender: SHOWCASE(
      `<div style={{ width: 280 }}><Card><div style={{ padding: 16 }}><h3 style={{ margin: 0, marginBottom: 8 }}>Card title</h3><p style={{ margin: 0, color: 'var(--color-stone-600)', fontSize: 13 }}>Cards group related information into a scannable surface.</p></div></Card></div>`
    ),
    dev: DEV(
      'Card',
      `import { Card } from 'pada-ds';

export function ProjectCard() {
  return (
    <Card>
      <h3>Acme rebrand</h3>
      <p>Started 3 days ago</p>
    </Card>
  );
}`
    ),
    a11y: A11Y(
      'Use a real heading element inside the card so screen readers can navigate by structure.',
      'When the whole card is clickable, wrap it in an <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> rather than attaching <code>onClick</code> to the div.',
      'Maintain at least AA contrast for any text or icon rendered on the card surface.'
    ),
  }),

  c('carousel', 'Carousel', 'Carousel', {
    imports: `import { Carousel } from '../../../components/Carousel';`,
    purpose:
      'Carousel cycles through a small, ordered set of items in a constrained horizontal space. Use it for product galleries, onboarding slides, or feature tours — never as a substitute for a primary navigation pattern. If users need to compare items, prefer a list or grid.',
    designPara:
      'A Carousel exposes navigation controls (prev/next) and pagination indicators. Auto-advance is supported but disabled by default.',
    designRender: SHOWCASE(
      `<div style={{ width: 320 }}><Carousel><div style={{ background: 'var(--color-indigo-100)', height: 120, padding: 24, borderRadius: 12 }}>Slide 1</div><div style={{ background: 'var(--color-emerald-100)', height: 120, padding: 24, borderRadius: 12 }}>Slide 2</div><div style={{ background: 'var(--color-amber-100)', height: 120, padding: 24, borderRadius: 12 }}>Slide 3</div></Carousel></div>`
    ),
    dev: DEV(
      'Carousel',
      `import { Carousel } from 'pada-ds';

export function FeatureTour() {
  return (
    <Carousel>
      <img src="/slide-1.png" alt="Step 1" />
      <img src="/slide-2.png" alt="Step 2" />
    </Carousel>
  );
}`
    ),
    a11y: A11Y(
      'Prev/next controls are real <code>&lt;button&gt;</code> elements with descriptive <code>aria-label</code>s.',
      'Slides are exposed as a region with <code>aria-roledescription="carousel"</code> and the active index is announced.',
      'Auto-advance is paused on hover, focus, and when <code>prefers-reduced-motion: reduce</code> is set.'
    ),
  }),

  c('checkbox', 'Checkbox', 'Checkbox', {
    imports: `import { Checkbox } from '../../../components/Checkbox';`,
    purpose:
      'Checkbox lets users select zero or more options from a set, or toggle a single boolean. Use checkboxes when each option is independent — switch to a Switch for instant-effect settings, or RadioGroup when only one value can be selected at a time.',
    designPara:
      'Checkbox supports unchecked, checked, indeterminate, and disabled states. Provide a label via the input pattern or a wrapping <code>FormLabel</code>.',
    designRender: SHOWCASE(
      `<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox /> Unchecked</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox defaultChecked /> Checked</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox disabled /> Disabled</label>`,
      'column'
    ),
    dev: DEV(
      'Checkbox',
      `import { Checkbox } from 'pada-ds';

export function TermsAccept() {
  return (
    <label>
      <Checkbox name="terms" /> I agree to the terms
    </label>
  );
}`
    ),
    a11y: A11Y(
      'Renders as a native <code>&lt;input type="checkbox"&gt;</code>, so keyboard activation with <kbd>Space</kbd> works natively.',
      'Always associate a visible label, either by wrapping the input with <code>&lt;label&gt;</code> or via <code>htmlFor</code>.',
      'Indeterminate state is exposed via <code>aria-checked="mixed"</code> for screen readers.',
      'Focus ring uses <code>:focus-visible</code> with at least 3:1 contrast against the surface.'
    ),
  }),

  c('code-snippet', 'CodeSnippet', 'Code Snippet', {
    imports: `import { CodeSnippet as CS } from '../../../components/CodeSnippet/CodeSnippet';`,
    purpose:
      'CodeSnippet renders syntax-highlighted source code with a one-click copy affordance. Use it inside docs, examples, error details, and onboarding steps where users may need to paste a command or template into their own environment.',
    designPara:
      'CodeSnippet supports three layout types — <code>multi-line</code> (default), <code>single-line</code>, and <code>micro</code> — and a wide range of languages (TypeScript, JavaScript, JSON, YAML, Bash, Python).',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><CS code={'npm install pada-ds'} language="bash" type="single-line" /></div>`,
      'column'
    ),
    dev: DEV(
      'CodeSnippet',
      `import { CodeSnippet } from 'pada-ds';

export function Example() {
  return (
    <CodeSnippet
      code={'console.log("hello world");'}
      language="javascript"
      label="Quickstart"
    />
  );
}`
    ),
    a11y: A11Y(
      'The Copy button is a real <code>&lt;button&gt;</code> with a visible label and an accessible name.',
      'The code region uses <code>aria-label</code> indicating the language, so screen readers can announce context.',
      'Copy success is announced via a transient label change ("Copied"), and re-announced for screen-reader users.'
    ),
  }),

  c('combo-box', 'ComboBox', 'Combo Box', {
    imports: `import { ComboBox } from '../../../components/ComboBox';`,
    purpose:
      'ComboBox combines a text input with a filterable dropdown. Use it when the user needs to pick from a long list — picking a customer, project, or label — and benefits from typeahead. Avoid it for short option sets (use Select) or freeform text (use InputText).',
    designPara:
      'A ComboBox shows a text-input trigger; typing filters the menu of <code>ComboBoxMenuItem</code> children. Menu items can include icons, descriptions, and disabled states.',
    designRender: SHOWCASE(
      `<div style={{ width: 280 }}><ComboBox items={[{ id: 'acme', label: 'Acme Corp' }, { id: 'globex', label: 'Globex' }, { id: 'initech', label: 'Initech' }]} /></div>`
    ),
    dev: DEV(
      'ComboBox',
      `import { ComboBox } from 'pada-ds';

const projects = [
  { id: 'acme', label: 'Acme Corp' },
  { id: 'globex', label: 'Globex' },
];

export function ProjectPicker() {
  return <ComboBox items={projects} />;
}`
    ),
    a11y: A11Y(
      'Implements the WAI-ARIA combobox pattern with <code>role="combobox"</code> and a linked <code>listbox</code>.',
      'Keyboard support: <kbd>↓</kbd>/<kbd>↑</kbd> moves through options, <kbd>Enter</kbd> selects, <kbd>Esc</kbd> closes.',
      'The currently active option is announced via <code>aria-activedescendant</code>.',
      'Disabled options are skipped from arrow-key navigation.'
    ),
  }),

  c('date-picker', 'DatePicker', 'Date Picker', {
    imports: `import { DatePickerDropdown } from '../../../components/DatePicker';`,
    purpose:
      'Date Picker lets users select a single date or a date range from a calendar surface. Use it whenever the date is unbounded (e.g. birthdays, scheduling); for a small number of common ranges, prefer SegmentControl. Pair it with InputDate when typing is faster than picking.',
    designPara:
      'Calendar supports single-date and range modes, configurable min/max bounds, and disabled dates. The picker can render inline or as a dropdown anchored to a trigger.',
    designRender: SHOWCASE(
      `<DatePickerDropdown />`
    ),
    dev: DEV(
      'DatePickerDropdown',
      `import { DatePickerDropdown } from 'pada-ds';

export function BookingDate() {
  return <DatePickerDropdown mode="range" />;
}`
    ),
    a11y: A11Y(
      'The calendar grid uses <code>role="grid"</code>; days are <code>role="gridcell"</code> with <code>aria-selected</code>.',
      'Keyboard support: <kbd>←/→</kbd> day, <kbd>↑/↓</kbd> week, <kbd>PgUp/PgDn</kbd> month, <kbd>Home/End</kbd> first/last of week, <kbd>Enter</kbd> selects.',
      'The focused day is announced with its full date (e.g. "Tuesday, March 5, 2026").',
      'Dropdown traps focus while open and restores it to the trigger on close.'
    ),
  }),

  c('form-label', 'FormLabel', 'Form Label', {
    imports: `import { FormLabel } from '../../../components/FormLabel';`,
    purpose:
      'FormLabel is the canonical label primitive for any form control. It pairs a title with an optional description, optional required indicator, and an error slot. Use it as the wrapper around inputs to guarantee consistent spacing and accessible association.',
    designPara:
      'FormLabel renders a real <code>&lt;label&gt;</code> linked to its control via <code>htmlFor</code>. Use <code>required</code> to display an asterisk indicator and <code>optional</code> to display a muted “(optional)” tag.',
    designRender: SHOWCASE(
      `<div style={{ width: 280 }}><FormLabel htmlFor="demo-email" required>Email address</FormLabel><input id="demo-email" type="email" style={{ marginTop: 4, width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--color-stone-300)' }} /></div>`,
      'column'
    ),
    dev: DEV(
      'FormLabel',
      `import { FormLabel, InputText } from 'pada-ds';

export function EmailField() {
  return (
    <>
      <FormLabel htmlFor="email" required>Email</FormLabel>
      <InputText id="email" type="email" />
    </>
  );
}`
    ),
    a11y: A11Y(
      'Renders a real <code>&lt;label&gt;</code> with <code>htmlFor</code> linking to its control, so clicking the label focuses the input.',
      'Required state is exposed both visually (asterisk) and via <code>aria-required</code> on the wrapped control.',
      'Error messages are linked to the control via <code>aria-describedby</code> for screen-reader users.'
    ),
  }),

  c('icon', 'Icon', 'Icon', {
    imports: `import { Icon } from '../../../components/Icon';`,
    purpose:
      'Icon renders a Material Symbol from the canonical Pada icon set. Use icons to reinforce labels, save space in dense UIs, or signal status — never as the only carrier of meaning. The component fetches SVGs from the Material Symbols CDN at weight 200 / outlined.',
    designPara:
      'Icon supports two paint variants: <code>stroke</code> (default, outline) and <code>fill</code> (solid silhouette). The two are mutually exclusive at the asset level so an icon never renders with both. Color inherits from <code>currentColor</code>.',
    designRender: SHOWCASE(
      `<Icon name="dashboard" /><Icon name="inbox" /><Icon name="settings" /><Icon name="logout" /><Icon name="favorite" variant="fill" />`
    ),
    dev: DEV(
      'Icon',
      `import { Icon } from 'pada-ds';

export function FavoriteIcon() {
  return <Icon name="favorite" variant="fill" size={20} color="var(--color-rose-600)" />;
}`
    ),
    a11y: A11Y(
      'Decorative icons render with <code>aria-hidden="true"</code> by default — pair them with a visible text label.',
      'For icon-only triggers (icon button, icon link), provide an <code>aria-label</code> or visually hidden text.',
      'Icons inherit <code>color</code> from their parent so contrast scales with the surrounding text style.'
    ),
  }),

  c('indexer', 'Indexer', 'Indexer', {
    imports: `import { Indexer } from '../../../components/Indexer';`,
    purpose:
      'Indexer provides a sticky, vertical list of section anchors for a long-scrolling page (also known as a "secondary nav"). Use it when a page contains discrete sections — like the documentation page itself — and users benefit from jumping between them without scrolling.',
    designPara:
      'Each entry is a clickable label with an active-state indicator (a 2&nbsp;px indigo bar on the leading edge). The active item is determined by the section currently in view.',
    designRender: SHOWCASE(
      `<Indexer items={[{ id: 'purpose', label: 'Purpose' }, { id: 'design', label: 'Design' }, { id: 'developer', label: 'Developer' }, { id: 'a11y', label: 'Accessibility' }]} activeIndex={1} />`
    ),
    dev: DEV(
      'Indexer',
      `import { Indexer } from 'pada-ds';

export function PageIndex() {
  return (
    <Indexer
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'usage', label: 'Usage' },
      ]}
    />
  );
}`
    ),
    a11y: A11Y(
      'Rendered as a <code>&lt;nav&gt;</code> with an accessible label like "Page sections".',
      'Items are real anchors so keyboard users can <kbd>Tab</kbd> through them and screen readers announce the heading order.',
      'The active item uses <code>aria-current="location"</code> so assistive tech announces which section is in view.'
    ),
  }),

  c('input-date', 'InputDate', 'Input Date', {
    imports: `import { InputDate } from '../../../components/InputDate';`,
    purpose:
      'InputDate is a typed date entry field — a text input formatted for dates, with built-in validation and an optional calendar trigger. Use it when typing a known date is faster than picking from a calendar (booking flows, expense reports). Pair with DatePicker when both interactions are useful.',
    designPara:
      'InputDate provides a controlled text input with masked formatting, label, optional helper text, and an error state. It can be combined with a calendar dropdown for two-way entry.',
    designRender: SHOWCASE(
      `<div style={{ width: 240 }}><InputDate label="Date of birth" /></div>`
    ),
    dev: DEV(
      'InputDate',
      `import { InputDate } from 'pada-ds';

export function DateField() {
  return <InputDate label="Date of birth" />;
}`
    ),
    a11y: A11Y(
      'Native <code>&lt;input&gt;</code> with <code>type="text"</code> and an explicit <code>aria-describedby</code> hint for the expected format.',
      'Errors are announced via <code>aria-invalid</code> and a linked error message.',
      'Keyboard arrow keys can step segments up/down within the masked field.'
    ),
  }),

  c('input-text', 'InputText', 'Input Text', {
    imports: `import { InputText } from '../../../components/InputText';`,
    purpose:
      'InputText is the canonical single-line text field. Use it for names, emails, search queries, and other freeform short text. For long-form content, prefer InputTextArea; for filtered selection, use ComboBox or Select.',
    designPara:
      'InputText supports leading/trailing icons, prefix/suffix slots, helper text, and an error state. Sizes follow the form-control rhythm (32&nbsp;px tall by default).',
    designRender: SHOWCASE(
      `<div style={{ width: 280 }}><InputText label="Email" placeholder="you@example.com" /></div>`
    ),
    dev: DEV(
      'InputText',
      `import { InputText } from 'pada-ds';

export function EmailField() {
  return <InputText label="Email" type="email" required />;
}`
    ),
    a11y: A11Y(
      'Always provide a label via the <code>label</code> prop or an external <code>FormLabel</code>.',
      'Error states use <code>aria-invalid</code> + <code>aria-describedby</code> so screen readers announce the message.',
      'Placeholder text is supplemental, never used as the sole label.'
    ),
  }),

  c('input-text-area', 'InputTextArea', 'Input Text Area', {
    imports: `import { InputTextArea } from '../../../components/InputTextArea';`,
    purpose:
      'InputTextArea is the multi-line counterpart to InputText, used for free-form long text — descriptions, comments, JSON snippets. Use it whenever the expected content may exceed a single line; it auto-grows up to a configurable limit.',
    designPara:
      'Supports min/max rows, character counter, helper text, and error state. The component renders a real <code>&lt;textarea&gt;</code> for native browser behavior.',
    designRender: SHOWCASE(
      `<div style={{ width: 320 }}><InputTextArea label="Comment" placeholder="Tell us what you think..." rows={4} /></div>`
    ),
    dev: DEV(
      'InputTextArea',
      `import { InputTextArea } from 'pada-ds';

export function FeedbackField() {
  return <InputTextArea label="Feedback" rows={4} maxLength={500} />;
}`
    ),
    a11y: A11Y(
      'Native <code>&lt;textarea&gt;</code> so keyboard navigation, IME, and screen readers all behave as expected.',
      'When using a character counter, link it to the control with <code>aria-describedby</code> so the count is announced.',
      'Resize handle is preserved by default; only override when the surrounding layout cannot accommodate growth.'
    ),
  }),

  c('key-value', 'KeyValue', 'Key Value', {
    imports: `import { KeyValue } from '../../../components/KeyValue';`,
    purpose:
      'KeyValue presents a label/value pair in a consistent typographic rhythm. Use it for read-only details — record metadata, billing summaries, audit logs — where dense pairs of facts need to be scanned. Group multiple KeyValues for a definition list feel.',
    designPara:
      'Each KeyValue places the label above (or beside) the value, with consistent stone-toned label typography and high-contrast value text.',
    designRender: SHOWCASE(
      `<KeyValue label="Status">Active</KeyValue><KeyValue label="Created">May 27, 2026</KeyValue><KeyValue label="Owner">Supreeth Kashyap</KeyValue>`,
      'column'
    ),
    dev: DEV(
      'KeyValue',
      `import { KeyValue } from 'pada-ds';

export function RecordSummary() {
  return (
    <>
      <KeyValue label="Status">Active</KeyValue>
      <KeyValue label="Owner">Supreeth</KeyValue>
    </>
  );
}`
    ),
    a11y: A11Y(
      'Renders as a semantic <code>&lt;dl&gt;</code> / <code>&lt;dt&gt;</code> / <code>&lt;dd&gt;</code> structure when grouped, so screen readers announce the relationship.',
      'Use sufficient color contrast between the label (stone tones) and value (slate-900) to clear AA.'
    ),
  }),

  c('list', 'List', 'List', {
    imports: `import { List, ListItem } from '../../../components/List';`,
    purpose:
      'List renders a vertical stack of items — links, records, or actions — with consistent padding, dividers, and selection behavior. Use it for inboxes, navigation menus, search results, and anywhere a sequence of homogeneous items needs scannability.',
    designPara:
      'A List wraps one or more <code>ListItem</code> children. Each item supports leading icons, primary/secondary text, trailing content, and a selected state.',
    designRender: SHOWCASE(
      `<div style={{ width: 320 }}><List><ListItem>First item</ListItem><ListItem>Second item</ListItem><ListItem>Third item</ListItem></List></div>`
    ),
    dev: DEV(
      'List',
      `import { List, ListItem } from 'pada-ds';

export function Inbox() {
  return (
    <List>
      <ListItem>Hello world</ListItem>
      <ListItem>Welcome to Pada</ListItem>
    </List>
  );
}`
    ),
    a11y: A11Y(
      'Rendered as a <code>&lt;ul&gt;</code> / <code>&lt;li&gt;</code> structure so screen readers announce list semantics and length.',
      'When items are interactive, each item is a real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>.',
      'Selected items expose <code>aria-selected</code> or <code>aria-current</code> as appropriate.'
    ),
  }),

  c('loader', 'Loader', 'Loader', {
    imports: `import { Loader } from '../../../components/Loader';`,
    purpose:
      'Loader signals that an asynchronous operation is in progress. Use it for short waits where displaying skeletons or progress would be overkill (e.g. button-level "saving..." state). For longer operations, prefer Progress for determinate work or skeletons for content placeholders.',
    designPara:
      'Loader renders a circular spinner in three sizes — <code>sm</code>, <code>md</code> (default), <code>lg</code> — and inherits its color from <code>currentColor</code> so it adapts to any surface.',
    designRender: SHOWCASE(
      `<Loader size="sm" /><Loader size="md" /><Loader size="lg" />`
    ),
    dev: DEV(
      'Loader',
      `import { Loader } from 'pada-ds';

export function SavingButton({ saving }) {
  return saving ? <Loader size="sm" /> : 'Save';
}`
    ),
    a11y: A11Y(
      'Wraps the spinner in <code>role="status"</code> with a visually-hidden "Loading" label so screen readers announce activity.',
      'Animation respects <code>prefers-reduced-motion: reduce</code> by slowing or pausing rotation.',
      'Color contrast against the surface clears the 3:1 non-text minimum at all sizes.'
    ),
  }),

  c('logo', 'Logo', 'Logo', {
    imports: `import { Logo } from '../../../components/Logo';`,
    purpose:
      'Logo renders a third-party brand or integration mark from the bundled SVG catalog. Use it in integration pickers, marketplace tiles, account-linking flows, and audit logs that reference external products.',
    designPara:
      'Logo supports six sizes (<code>xs</code>–<code>2xl</code>) and an optional <code>background</code> surface. Pass the canonical <code>name</code> (e.g. <code>airtable</code>, <code>adobe_sign</code>) — Logo resolves it against the bundled SVG/PNG catalog at runtime.',
    designRender: SHOWCASE(
      `<Logo name="airtable" size="xs" /><Logo name="airtable" size="sm" /><Logo name="airtable" size="md" /><Logo name="airtable" size="lg" /><Logo name="airtable" size="xl" />`
    ),
    dev: DEV(
      'Logo',
      `import { Logo } from 'pada-ds';

export function IntegrationTile() {
  return <Logo name="airtable" size="md" tooltip="Airtable" />;
}`
    ),
    a11y: A11Y(
      'When wrapped in a link, provides a discernible name like "Pada — home" via <code>aria-label</code>.',
      'Mark image renders with empty <code>alt=""</code> when paired with the wordmark, so screen readers announce the brand once.',
      'Size scales preserve a 3:1 contrast minimum on all surface tints in the design system.'
    ),
  }),

  c('modal', 'Modal', 'Modal', {
    imports: `import { ModalDemoPreview } from './_overlay-previews';`,
    purpose:
      'Modal interrupts the user with a focused task — a confirmation, a short form, or critical information. Use modals only when context cannot be preserved any other way; over-use breaks flow. Prefer SideDrawer for longer tasks and inline confirmation for low-stakes actions.',
    designPara:
      'Modal traps focus while open, dims the page behind, and dismisses on overlay click or <kbd>Esc</kbd>. The body slot accepts arbitrary content; standard footer patterns include primary + secondary buttons.',
    designRender: `<ModalDemoPreview />`,
    dev: DEV(
      'Modal',
      `import { useState } from 'react';
import { Modal, Button } from 'pada-ds';

export function DeleteConfirm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Modal open={open} onOpenChange={setOpen} title="Delete record?">
        This cannot be undone.
      </Modal>
    </>
  );
}`
    ),
    a11y: A11Y(
      'Uses <code>role="dialog"</code> with <code>aria-modal="true"</code> and an <code>aria-labelledby</code> pointing to the title.',
      'Focus is trapped inside the modal while open and returned to the trigger on close.',
      '<kbd>Esc</kbd> closes the modal; clicking the backdrop dismisses by default but can be disabled.',
      'Background content is marked <code>inert</code> while the modal is open so it cannot be focused or read.'
    ),
  }),

  c('notification', 'Notification', 'Notification', {
    imports: `import { Notification } from '../../../components/Notification';`,
    purpose:
      'Notification surfaces transient feedback — success, error, info, or warning — typically after the user takes an action (saved, deleted, copied). Use it for short, time-bound messages that auto-dismiss; for persistent system messages, use Banner instead.',
    designPara:
      'Notification renders a toast with a title, optional subtitle, and optional visual. Toasts are positioned in one of six corners and slide in from the matching edge.',
    designRender: SHOWCASE(
      `<div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minHeight: 160 }}><Notification open onOpenChange={() => {}} title="Saved" subtitle="Your changes are live." position="top-right" /></div>`,
      'column'
    ),
    dev: DEV(
      'Notification',
      `import { useState } from 'react';
import { Notification } from 'pada-ds';

export function SaveToast() {
  const [open, setOpen] = useState(true);
  return (
    <Notification
      open={open}
      onOpenChange={setOpen}
      title="Saved"
      subtitle="Your changes are live."
    />
  );
}`
    ),
    a11y: A11Y(
      'Each notification is announced via <code>role="status"</code> (info/success) or <code>role="alert"</code> (warning/error).',
      'A close button with an explicit <code>aria-label</code> is always available for keyboard users.',
      'Auto-dismiss timers are paused on hover/focus so users can read longer messages.'
    ),
  }),

  c('page-header', 'PageHeader', 'Page Header', {
    imports: `import { PageHeader } from '../../../components/PageHeader';`,
    purpose:
      'PageHeader establishes the title, breadcrumbs, and primary actions of a page. Use it at the top of every full-page surface so users always know where they are and what they can do next.',
    designPara:
      'PageHeader anchors the top of every full-page surface with a breadcrumb trail, an optional command launcher, an optional AI assist trigger, and a profile slot.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><PageHeader breadcrumbs={[{ label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Records' }]} commandLabel="Search" /></div>`
    ),
    dev: DEV(
      'PageHeader',
      `import { PageHeader } from 'pada-ds';

export function ProjectPage() {
  return (
    <PageHeader
      breadcrumbs={[{ label: 'Workspace', href: '/' }, { label: 'Projects' }]}
      commandLabel="Search"
      onCommandClick={() => {}}
    />
  );
}`
    ),
    a11y: A11Y(
      'Title renders as an <code>&lt;h1&gt;</code> so it sets the page landmark for assistive tech.',
      'Breadcrumbs are wrapped in a <code>&lt;nav aria-label="Breadcrumb"&gt;</code>; the current page uses <code>aria-current="page"</code>.',
      'Action buttons keep tab order consistent (left-to-right or visual order).'
    ),
  }),

  c('pills', 'Pills', 'Pills', {
    imports: `import { Pills } from '../../../components/Pills';`,
    purpose:
      'Pills provide a compact, single-select control for a small set of related options — e.g. filter scope, time range, or category toggle. Use them when a SegmentControl feels too rigid; switch to RadioGroup for forms or Tabs for view switching.',
    designPara:
      'Pills render a horizontal row of toggleable chips. Only one pill is selected at a time; the selected pill has a high-contrast surface.',
    designRender: SHOWCASE(
      `<Pills options={[{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }, { value: 'archived', label: 'Archived' }]} value="mine" onChange={() => {}} />`
    ),
    dev: DEV(
      'Pills',
      `import { Pills } from 'pada-ds';

export function ScopeFilter() {
  return <Pills options={[{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }]} value="all" onChange={() => {}} />;
}`
    ),
    a11y: A11Y(
      'Implements the radio pattern: the group has <code>role="radiogroup"</code> and each pill is <code>role="radio"</code> with <code>aria-checked</code>.',
      'Keyboard support: <kbd>←/→</kbd> moves selection, <kbd>Tab</kbd> moves into and out of the group.',
      'Selected and unselected states each clear AA contrast.'
    ),
  }),

  c('popover', 'Popover', 'Popover', {
    imports: `import { PopoverDemoPreview } from './_overlay-previews';`,
    purpose:
      'Popover surfaces extra content — a menu, form, or detail card — anchored to a trigger. Use it for actions that need a small extension to the trigger but don\\u2019t merit a full modal. Avoid using popovers for critical or confirming flows; reach for Modal instead.',
    designPara:
      'Popover supports four positions (top, right, bottom, left), a default and active visual variant, and dismisses on outside click or <kbd>Esc</kbd>.',
    designRender: `<PopoverDemoPreview />`,
    dev: DEV(
      'Popover',
      `import { useState } from 'react';
import { Popover, Button } from 'pada-ds';

export function HelpPopover() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="ghost">?</Button>}
      title="Quick tip"
    >
      This field accepts an email or username.
    </Popover>
  );
}`
    ),
    a11y: A11Y(
      'Trigger exposes <code>aria-haspopup</code> and <code>aria-expanded</code>; the surface itself uses <code>role="dialog"</code> when content is interactive.',
      'Focus moves into the popover on open and returns to the trigger on close.',
      '<kbd>Esc</kbd> dismisses; outside-click dismisses by default.'
    ),
  }),

  c('progress', 'Progress', 'Progress', {
    imports: `import { Progress } from '../../../components/Progress';`,
    purpose:
      'Progress communicates the proportion completed of a known-length operation. Use determinate progress for uploads, batch jobs, or installation steps; for unknown durations, use Loader instead.',
    designPara:
      'Progress renders a horizontal bar from 0–100, with optional label and value. The track and bar use consistent stone-tone surfaces.',
    designRender: SHOWCASE(
      `<div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}><Progress value={25} label="Uploading" /><Progress value={60} label="Processing" /><Progress value={100} label="Complete" /></div>`,
      'column'
    ),
    dev: DEV(
      'Progress',
      `import { Progress } from 'pada-ds';

export function UploadStatus({ pct }) {
  return <Progress value={pct} label="Uploading" />;
}`
    ),
    a11y: A11Y(
      'Uses <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code>.',
      'Provides a visible label or <code>aria-label</code> describing what is progressing.',
      'Color contrast between track and fill clears the 3:1 non-text minimum.'
    ),
  }),

  c('radio-group', 'RadioGroup', 'Radio Group', {
    imports: `import { RadioGroup } from '../../../components/RadioGroup';`,
    purpose:
      'RadioGroup lets users pick one option from a small, mutually exclusive set. Use it in forms when all options should be visible at a glance (typically 2–5). For more options, prefer Select; for instant-effect toggles, use SegmentControl or Switch.',
    designPara:
      'RadioGroup renders each option as a labeled radio button stacked vertically. Helper text and error states are supported.',
    designRender: SHOWCASE(
      `<RadioGroup name="plan" value="pro" onChange={() => {}} options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} />`
    ),
    dev: DEV(
      'RadioGroup',
      `import { RadioGroup } from 'pada-ds';

export function PlanPicker() {
  return (
    <RadioGroup
      name="plan"
      value="pro"
      onChange={() => {}}
      options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
    />
  );
}`
    ),
    a11y: A11Y(
      'Group is wrapped in a <code>role="radiogroup"</code> with an accessible label.',
      'Each option is a native <code>&lt;input type="radio"&gt;</code> so keyboard navigation (arrow keys) works out of the box.',
      'Errors are announced via <code>aria-invalid</code> on the group and a linked message via <code>aria-describedby</code>.'
    ),
  }),

  c('search-field', 'SearchField', 'Search Field', {
    imports: `import { SearchField } from '../../../components/SearchField';`,
    purpose:
      'SearchField is a text input optimized for searching — a leading magnifying-glass icon, a clear-on-click affordance, and debounced change events. Use it as the primary entry point for finding items in a list, table, or page.',
    designPara:
      'SearchField wraps an input with a leading icon and a trailing clear button. It supports controlled and uncontrolled value modes and an optional <code>onSubmit</code>.',
    designRender: SHOWCASE(
      `<div style={{ width: 320 }}><SearchField placeholder="Search records..." /></div>`
    ),
    dev: DEV(
      'SearchField',
      `import { SearchField } from 'pada-ds';

export function ListSearch() {
  return <SearchField placeholder="Search" onChange={(v) => console.log(v)} />;
}`
    ),
    a11y: A11Y(
      'Uses <code>type="search"</code> so browsers expose a native clear control on some platforms.',
      'Provide an explicit label via <code>aria-label</code> when the icon is the only affordance.',
      'Clear button has its own accessible name and is reachable by keyboard.'
    ),
  }),

  c('segment-control', 'SegmentControl', 'Segment Control', {
    imports: `import { SegmentControl } from '../../../components/SegmentControl';`,
    purpose:
      'SegmentControl provides a pill-style switcher among 2–5 mutually exclusive view modes. Use it to toggle visualizations (list/grid), date ranges (day/week/month), or content scopes. For more options, switch to Tabs; for forms, use RadioGroup.',
    designPara:
      'SegmentControl renders a horizontal capsule with each segment as an equal-width option. The selected segment shows a contrasting surface.',
    designRender: SHOWCASE(
      `<SegmentControl value="month" onChange={() => {}} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />`
    ),
    dev: DEV(
      'SegmentControl',
      `import { SegmentControl } from 'pada-ds';

export function RangePicker() {
  return (
    <SegmentControl
      value="week"
      onChange={() => {}}
      options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]}
    />
  );
}`
    ),
    a11y: A11Y(
      'Implements the radio pattern with <code>role="radiogroup"</code> and <code>role="radio"</code> children.',
      'Keyboard support: <kbd>←/→</kbd> moves selection; <kbd>Tab</kbd> moves into and out of the group.',
      'Selected segment carries <code>aria-checked="true"</code> and ≥AA contrast against the unselected surface.'
    ),
  }),

  c('select', 'Select', 'Select', {
    imports: `import { Select } from '../../../components/Select/Select';`,
    purpose:
      'Select is a closed dropdown for picking one option from a known list. Use it when 5–20 options exist and the user needs to scan, not type. For longer lists with typeahead, prefer ComboBox; for very few options, prefer SegmentControl or RadioGroup.',
    designPara:
      'Select renders a button-styled trigger that opens a menu of options on click. It supports labels, descriptions, errors, and disabled options.',
    designRender: SHOWCASE(
      `<div style={{ width: 280 }}><Select label="Choose a plan" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} value="pro" onChange={() => {}} /></div>`
    ),
    dev: DEV(
      'Select',
      `import { Select } from 'pada-ds';

export function PlanSelect() {
  return (
    <Select
      label="Plan"
      options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
      value="pro"
      onChange={() => {}}
    />
  );
}`
    ),
    a11y: A11Y(
      'Implements the WAI-ARIA listbox pattern with <code>role="listbox"</code> and <code>role="option"</code> items.',
      'Keyboard support: <kbd>↓</kbd>/<kbd>↑</kbd> to move, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to dismiss, type-ahead to jump.',
      'Disabled options are skipped from arrow-key navigation.'
    ),
  }),

  c('side-drawer', 'SideDrawer', 'Side Drawer', {
    imports: `import { SideDrawerDemoPreview } from './_overlay-previews';`,
    purpose:
      'SideDrawer slides a panel in from the edge of the screen for secondary tasks — record details, settings, multi-step flows. Use it when the task is too long for a Modal but should not navigate away from the current page.',
    designPara:
      'SideDrawer supports four sizes (<code>sm</code>–<code>xl</code>) and slides in from the right. It traps focus while open and dismisses on overlay click or <kbd>Esc</kbd>.',
    designRender: `<SideDrawerDemoPreview />`,
    dev: DEV(
      'SideDrawer',
      `import { useState } from 'react';
import { SideDrawer, Button } from 'pada-ds';

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <SideDrawer open={open} onOpenChange={setOpen} size="md">
        <h2>Settings</h2>
      </SideDrawer>
    </>
  );
}`
    ),
    a11y: A11Y(
      'Uses <code>role="dialog"</code> with <code>aria-modal="true"</code> and a labelled heading.',
      'Focus traps inside while open and returns to the trigger on close.',
      'Background content is marked <code>inert</code> so it cannot be reached by keyboard or screen reader.'
    ),
  }),

  c('sidebar', 'Sidebar', 'Sidebar', {
    imports: `import { Sidebar } from '../../../components/Sidebar';`,
    purpose:
      'Sidebar is the primary navigation surface for product layouts. It shows brand identity, top-level workspaces, and grouped menu items. Use a single sidebar per layout and treat it as the most stable element on screen.',
    designPara:
      'Sidebar accepts data-driven sections and items, or compose <code>SidebarLogo</code>, <code>SidebarSection</code>, and <code>SidebarMenu</code> directly. Items support icons, badges, and selected state. The component scrolls internally and pins the logo header.',
    designRender: SHOWCASE(
      `<div style={{ height: 280, width: 220, border: '1px solid var(--color-stone-200)', borderRadius: 12, overflow: 'hidden' }}><Sidebar data={{ sections: [{ id: 'main', items: [{ id: 'home', label: 'Home', selected: true }, { id: 'inbox', label: 'Inbox' }, { id: 'settings', label: 'Settings' }] }] }} /></div>`
    ),
    dev: DEV(
      'Sidebar',
      `import { Sidebar } from 'pada-ds';

export function AppShell() {
  return (
    <Sidebar
      data={{
        sections: [
          { id: 'main', items: [{ id: 'home', label: 'Home', href: '/' }] },
        ],
      }}
      activeId="home"
    />
  );
}`
    ),
    a11y: A11Y(
      'Wrapped in a <code>&lt;nav&gt;</code> landmark with an accessible name.',
      'Active item exposes <code>aria-current="page"</code> for assistive tech.',
      'Internal scroll preserves keyboard tab order through every item.',
      'Icons, when present, do not duplicate the visible label — they\\u2019re marked decorative.'
    ),
  }),

  c('slider', 'Slider', 'Slider', {
    imports: `import { Slider } from '../../../components/Slider';`,
    purpose:
      'Slider lets users pick a numeric value from a continuous range. Use it for adjustments where the precise value matters less than the relative position — volume, opacity, threshold tuning. For exact numeric entry, pair with a numeric InputText.',
    designPara:
      'Slider renders a track and thumb, supports min/max/step, optional value label, and a disabled state. Range (two-thumb) variant available.',
    designRender: SHOWCASE(
      `<div style={{ width: 320 }}><Slider min={0} max={100} defaultValue={40} /></div>`
    ),
    dev: DEV(
      'Slider',
      `import { Slider } from 'pada-ds';

export function VolumeSlider() {
  return <Slider min={0} max={100} defaultValue={50} aria-label="Volume" />;
}`
    ),
    a11y: A11Y(
      'Native <code>&lt;input type="range"&gt;</code> so keyboard support (<kbd>←/→</kbd>, <kbd>Home/End</kbd>, <kbd>PgUp/PgDn</kbd>) works out of the box.',
      'Always provide an <code>aria-label</code> or visible label so screen readers can announce purpose.',
      'Track and thumb maintain a 3:1 contrast against the surface.'
    ),
  }),

  c('steps', 'Steps', 'Steps', {
    imports: `import { Steps } from '../../../components/Steps';`,
    purpose:
      'Steps renders a horizontal or vertical progression through a multi-step flow — onboarding, checkout, or a wizard. Use it when the user needs to know how many steps remain and which step is active. For non-linear lists of tasks, prefer a checklist instead.',
    designPara:
      'Each step has a status — <code>upcoming</code>, <code>current</code>, or <code>completed</code> — visualized via the indicator color and icon. The current step is announced to assistive tech as the active step in the flow.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><Steps steps={[{ title: 'Account', status: 'completed' }, { title: 'Plan', status: 'current' }, { title: 'Confirm', status: 'upcoming' }]} /></div>`
    ),
    dev: DEV(
      'Steps',
      `import { Steps } from 'pada-ds';

export function Onboarding() {
  return (
    <Steps
      steps={[
        { title: 'Account', status: 'completed' },
        { title: 'Plan', status: 'current' },
        { title: 'Confirm', status: 'upcoming' },
      ]}
    />
  );
}`
    ),
    a11y: A11Y(
      'Wrapped in a <code>&lt;nav aria-label="Progress"&gt;</code> so screen readers can navigate to it.',
      'Active step uses <code>aria-current="step"</code>; complete steps include hidden "Completed" text for context.',
      'Status is conveyed via icon + color + label, never color alone.'
    ),
  }),

  c('switch', 'Switch', 'Switch', {
    imports: `import { Switch } from '../../../components/Switch';`,
    purpose:
      'Switch toggles a single setting with immediate effect — turning notifications on, enabling dark mode, or flipping a feature flag. Use it for instant-effect booleans; for confirmed-on-submit booleans, prefer Checkbox.',
    designPara:
      'Switch renders a horizontal track with a sliding thumb. The "on" state uses an indigo surface; the "off" state uses a stone surface. Disabled and focus states are explicit.',
    designRender: SHOWCASE(
      `<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch /> Off</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch defaultChecked /> On</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch disabled /> Disabled</label>`,
      'column'
    ),
    dev: DEV(
      'Switch',
      `import { Switch } from 'pada-ds';

export function NotificationToggle() {
  return (
    <label>
      <Switch /> Email notifications
    </label>
  );
}`
    ),
    a11y: A11Y(
      'Renders as a native <code>&lt;input type="checkbox"&gt;</code> with <code>role="switch"</code> so screen readers announce on/off rather than checked/unchecked.',
      'Keyboard support: <kbd>Space</kbd> toggles; <kbd>Tab</kbd> moves into/out.',
      'Always pair with a visible label describing the setting.'
    ),
  }),

  // NOTE: `table-demo.tsx` is hand-maintained (see also `table-demo.data.ts`) because
  // it renders a fully wired Table with toolbar, header, body rows, and pagination
  // state. Do not regenerate it from this script — re-running this generator skips
  // the `table` slug entirely.

  c('tabs', 'Tabs', 'Tabs', {
    imports: `import { Tabs, TabPanel } from '../../../components/Tabs/Tabs';`,
    purpose:
      'Tabs lets users switch among related content panes within a single page. Use them for parallel views of the same record (overview / activity / settings) — never to hide unrelated content. Keep the number of tabs small (3–5).',
    designPara:
      'Tabs renders a horizontal tablist with the active tab underlined. Panels mount only when active. Keyboard navigation cycles through tabs.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><Tabs label="Demo tabs"><TabPanel label="Overview"><div style={{ padding: 12 }}>Overview content</div></TabPanel><TabPanel label="Activity"><div style={{ padding: 12 }}>Activity content</div></TabPanel><TabPanel label="Settings"><div style={{ padding: 12 }}>Settings content</div></TabPanel></Tabs></div>`
    ),
    dev: DEV(
      'Tabs',
      `import { Tabs, TabPanel } from 'pada-ds';

export function RecordDetail() {
  return (
    <Tabs label="Record detail">
      <TabPanel label="Overview">...</TabPanel>
      <TabPanel label="Activity">...</TabPanel>
    </Tabs>
  );
}`
    ),
    a11y: A11Y(
      'Implements the WAI-ARIA tabs pattern: <code>role="tablist"</code>, <code>role="tab"</code>, <code>role="tabpanel"</code>.',
      'Keyboard support: <kbd>←/→</kbd> moves between tabs, <kbd>Tab</kbd> moves into the panel.',
      'Active tab carries <code>aria-selected="true"</code> and <code>tabindex="0"</code>; inactive tabs use <code>tabindex="-1"</code>.'
    ),
  }),

  c('tags', 'Tags', 'Tags', {
    imports: `import { Tags } from '../../../components/Tags';`,
    purpose:
      'Tags label entities with categorical metadata — labels, statuses, owners, environments. Use them in lists and tables where users need to scan many records at once. Keep the visual palette consistent within a context (e.g. always use the same color for "Production").',
    designPara:
      'Tags ship in 10 color variants and three sizes. They support an optional leading icon and an optional close button for filter contexts.',
    designRender: SHOWCASE(
      `<Tags variant="primary">Primary</Tags><Tags variant="green">Active</Tags><Tags variant="yellow">Pending</Tags><Tags variant="red">Failed</Tags><Tags variant="gray">Archived</Tags>`
    ),
    dev: DEV(
      'Tags',
      `import { Tags } from 'pada-ds';

export function StatusTag({ status }) {
  return <Tags variant={status === 'active' ? 'green' : 'gray'}>{status}</Tags>;
}`
    ),
    a11y: A11Y(
      'Color is paired with a text label; never communicate status by color alone.',
      'When dismissible, the close button has an explicit <code>aria-label</code> like "Remove tag".',
      'Each variant maintains AA contrast for the tag text against its tinted surface.'
    ),
  }),

  c('text', 'Text', 'Text', {
    imports: `import { Text } from '../../../components/Text';`,
    purpose:
      'Text is the canonical typography primitive for rendering headings, body copy, and helper text. Use it instead of bare <code>&lt;p&gt;</code>/<code>&lt;span&gt;</code> when you need design-system-aligned size, weight, line-height, and color in one prop.',
    designPara:
      'Text supports the full type scale, four weights, three families, configurable line-heights, and renders as any HTML element via <code>as</code>. It inherits color from <code>currentColor</code> by default.',
    designRender: SHOWCASE(
      `<Text as="h1" size="2xl" weight="700">Heading 2xl bold</Text><Text size="lg">Body large</Text><Text size="base">Body base — the quick brown fox jumps over the lazy dog.</Text><Text size="sm" color="var(--color-stone-500)">Caption small / secondary</Text>`,
      'column'
    ),
    dev: DEV(
      'Text',
      `import { Text } from 'pada-ds';

export function PageTitle() {
  return <Text as="h1" size="2xl" weight="700">Welcome</Text>;
}`
    ),
    a11y: A11Y(
      'Always render headings (<code>h1</code>–<code>h6</code>) via the <code>as</code> prop; do not rely on size alone for hierarchy.',
      'Default body size and color clear AA contrast on white surfaces.',
      'Avoid disabling line-height; readable line-height is essential for users with cognitive disabilities.'
    ),
  }),

  c('toolbar', 'Toolbar', 'Toolbar', {
    imports: `import { Toolbar } from '../../../components/Toolbar';
import { Button } from '../../../components/Button';`,
    purpose:
      'Toolbar groups a small set of actions or controls into a single horizontal strip — typically near a list, table, or canvas. Use it for action affordances that apply to the surrounding content (filter, sort, bulk action, view switcher).',
    designPara:
      'Toolbar is a layout container that aligns its children with consistent spacing. Place buttons, inputs, dividers, and segment controls inside.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><Toolbar><Button>New</Button><Button variant="secondary">Filter</Button><Button variant="ghost">Sort</Button></Toolbar></div>`
    ),
    dev: DEV(
      'Toolbar',
      `import { Toolbar, Button } from 'pada-ds';

export function ListToolbar() {
  return (
    <Toolbar>
      <Button>New record</Button>
      <Button variant="ghost">Filter</Button>
    </Toolbar>
  );
}`
    ),
    a11y: A11Y(
      'Wrapped in <code>role="toolbar"</code> with an accessible name.',
      'Keyboard support follows the WAI-ARIA toolbar pattern: <kbd>Tab</kbd> enters/exits, <kbd>←/→</kbd> moves between controls.',
      'Each control inside the toolbar retains its own focus indicator.'
    ),
  }),

  c('tooltip', 'Tooltip', 'Tooltip', {
    imports: `import { Tooltip } from '../../../components/Tooltip';`,
    purpose:
      'Tooltip reveals supplementary text on hover or focus — typically clarifying an icon-only button or a truncated value. Use them sparingly and never for content that the user must read to complete a task.',
    designPara:
      'Tooltip supports four placements (top/right/bottom/left) and is keyboard-accessible. It renders only when the trigger is hovered or focused.',
    designRender: SHOWCASE(
      `<Tooltip content="Quick tip"><button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--color-stone-300)', background: 'white' }}>Hover me</button></Tooltip>`
    ),
    dev: DEV(
      'Tooltip',
      `import { Tooltip } from 'pada-ds';

export function ArchiveButton() {
  return (
    <Tooltip content="Archive this record">
      <button>Archive</button>
    </Tooltip>
  );
}`
    ),
    a11y: A11Y(
      'Trigger and tooltip are linked via <code>aria-describedby</code> so screen readers announce the description.',
      'Tooltip appears on both hover and focus, and stays open while focus or hover persists.',
      'Never put critical or interactive content inside a tooltip — only short, supplementary text.'
    ),
  }),

  c('upload-field', 'UploadField', 'Upload Field', {
    imports: `import { UploadField } from '../../../components/UploadField';`,
    purpose:
      'UploadField lets users add files via drag-and-drop or a click-to-browse picker. Use it for attachment flows, profile photos, and document submission. The component handles validation (size, type) and per-file progress reporting.',
    designPara:
      'UploadField shows a dashed drop zone, a file picker button, and a list of uploaded files with progress and error states. Limits (<code>maxSize</code>, <code>maxFiles</code>) are enforced before upload.',
    designRender: SHOWCASE(
      `<div style={{ width: '100%' }}><UploadField label="Attachments" description="PDF or PNG up to 5 MB" accept="application/pdf,image/png" maxSize={5 * 1024 * 1024} /></div>`
    ),
    dev: DEV(
      'UploadField',
      `import { UploadField } from 'pada-ds';

export function Attachments() {
  return (
    <UploadField
      label="Attachments"
      multiple
      accept="application/pdf"
      onUpload={async (files) => {/* ... */}}
    />
  );
}`
    ),
    a11y: A11Y(
      'The drop zone is a real <code>&lt;button&gt;</code> with an explicit <code>aria-label</code>; keyboard <kbd>Enter</kbd> opens the file picker.',
      'Per-file progress is announced via <code>role="status"</code>; errors via <code>role="alert"</code>.',
      'File list items expose remove buttons with descriptive <code>aria-label</code>s.',
      'When disabled, the drop zone is removed from the tab order and reads as disabled.'
    ),
  }),
];

// Shared interactive previews for overlay components (Modal, SideDrawer, Popover). These
// can't render open-by-default in the docs grid, so each is wrapped behind a trigger.
const OVERLAY_PREVIEWS_FILE = `import { useState } from 'react';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { SideDrawer } from '../../../components/SideDrawer';
import { Popover } from '../../../components/Popover';

export function ModalDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onOpenChange={setOpen} title="Confirm action">
        Are you sure? This action cannot be undone.
      </Modal>
    </div>
  );
}

export function SideDrawerDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <SideDrawer open={open} onOpenChange={setOpen} size="md">
        <div style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Settings</h2>
          <p>Drawer content lives here.</p>
        </div>
      </SideDrawer>
    </div>
  );
}

export function PopoverDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="ghost">Show popover</Button>}
        title="Quick tip"
      >
        Popovers display extra content anchored to a trigger.
      </Popover>
    </div>
  );
}
`;
writeFileSync(resolve(OUT, '_overlay-previews.tsx'), OVERLAY_PREVIEWS_FILE);

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

for (const def of PAGES) {
  writeFileSync(resolve(OUT, `${def.slug}-demo.tsx`), PAGE(def));
}

// Re-emit the pilot Button page from the centralized definition so the bulk run is the
// single source of truth. Override slug to match.
const buttonPage = `import DemoPage from '../DemoPage';
import { Button } from '../../../components/Button';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';

const VARIANTS = [
  { label: 'Primary', variant: 'primary' },
  { label: 'Secondary', variant: 'secondary' },
  { label: 'Ghost', variant: 'ghost' },
  { label: 'Destructive', variant: 'destructive' },
];

const USAGE_CODE = \`import { Button } from 'pada-ds';

export function Example() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" leftIcon="add">New</Button>
      <Button variant="ghost" rightIcon="chevron_right">Next</Button>
      <Button variant="destructive">Delete</Button>
    </>
  );
}\`;

export default function ButtonDemo() {
  return (
    <DemoPage
      title="Button"
      kind="Component"
      purpose={
        <p>
          Buttons trigger an action or a navigation decision. Use them anywhere the user
          needs to commit to a choice — submitting a form, confirming a destructive change,
          launching a flow, or moving to the next step. Reserve the primary style for the
          single most important action on a screen; rely on secondary and ghost variants
          for supporting actions, and the destructive variant only for irreversible operations.
        </p>
      }
      design={
        <>
          <p>
            The Button supports four visual styles — <strong>primary</strong>, <strong>secondary</strong>,{' '}
            <strong>ghost</strong>, and <strong>destructive</strong> — and three icon configurations:
            label-only, leading icon, and trailing icon. Icons are 16&nbsp;px and inherit the button's
            text color, so contrast is preserved across every variant. A button has a fixed
            32&nbsp;px height and an 8&nbsp;px corner radius, regardless of content.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}>
            {VARIANTS.map(({ label, variant }) => (
              <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: 'var(--color-stone-500)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    minWidth: 96,
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
                <Button variant={variant as any}>Button</Button>
                <Button variant={variant as any} leftIcon="add">Button</Button>
                <Button variant={variant as any} rightIcon="chevron_right">Button</Button>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Import the <code>Button</code> from <code>pada-ds</code>. Choose a variant and
            optionally pass <code>leftIcon</code> or <code>rightIcon</code> (Material Symbols
            name). Standard <code>onClick</code>, <code>disabled</code>, and{' '}
            <code>type</code> props are supported via React's native button attributes.
          </p>
          <CodeSnippet code={USAGE_CODE} language="tsx" label="Button usage" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>All variants meet WCAG 2.1 AA contrast against their surface (4.5:1 text, 3:1 non-text).</li>
          <li>Renders as a native <code>&lt;button&gt;</code> so keyboard activation with <kbd>Enter</kbd> and <kbd>Space</kbd> works out of the box.</li>
          <li>A 2&nbsp;px focus ring appears on <code>:focus-visible</code> for keyboard users and stays clear of mouse users.</li>
          <li>When using an icon-only button, provide an <code>aria-label</code> describing the action.</li>
          <li>Disabled buttons are skipped from the tab order and announce a disabled state to assistive tech via the native <code>disabled</code> attribute.</li>
        </ul>
      }
    />
  );
}
`;

writeFileSync(resolve(OUT, 'button-demo.tsx'), buttonPage);

console.log(`Wrote ${PAGES.length + 1} component demo pages to ${OUT}`);
