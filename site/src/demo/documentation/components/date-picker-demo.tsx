import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { DatePickerDropdown } from '@pada/components/DatePicker';

export default function DatePickerDemo() {
  return (
    <DemoPage
      title="Date Picker"
      kind="Component"
      purpose={<p>Date Picker lets users select a single date or a date range from a calendar surface. Use it whenever the date is unbounded (e.g. birthdays, scheduling); for a small number of common ranges, prefer SegmentControl. Pair it with InputDate when typing is faster than picking.</p>}
      design={<><p>Calendar supports single-date and range modes, configurable min/max bounds, and disabled dates. The picker can render inline or as a dropdown anchored to a trigger.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><DatePickerDropdown /></div></>}
      developer={<><p>Import the <code>DatePickerDropdown</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { DatePickerDropdown } from 'pada-ds';

export function BookingDate() {
  return <DatePickerDropdown mode="range" />;
}`} language="tsx" label="DatePickerDropdown usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>The calendar grid uses <code>role="grid"</code>; days are <code>role="gridcell"</code> with <code>aria-selected</code>.</li><li>Keyboard support: <kbd>←/→</kbd> day, <kbd>↑/↓</kbd> week, <kbd>PgUp/PgDn</kbd> month, <kbd>Home/End</kbd> first/last of week, <kbd>Enter</kbd> selects.</li><li>The focused day is announced with its full date (e.g. "Tuesday, March 5, 2026").</li><li>Dropdown traps focus while open and restores it to the trigger on close.</li></ul>}
    />
  );
}
