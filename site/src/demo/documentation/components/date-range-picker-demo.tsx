import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { DateRangePicker, type DateRangePreset } from '@pada/components/DateRangePicker';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const presets: DateRangePreset[] = [
  { label: 'Last 7 days', range: [addDays(-6), addDays(0)] },
  { label: 'Last 30 days', range: [addDays(-29), addDays(0)] },
];

export default function DateRangePickerDemo() {
  return (
    <DemoPage
      title="Date Range Picker"
      kind="Component"
      purpose={<p>Date Range Picker picks a start and an end date, such as a stay or a report period, from two months side by side, with optional presets.</p>}
      design={
        <>
          <p>A field that opens the calendar in a popover. The first click picks the start, the second the end, and the days in between preview as you hover. Presets sit beside the months.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <DateRangePicker label="Stay" defaultValue={[addDays(4), addDays(9)]} />
            <DateRangePicker label="Report period" presets={presets} weekStartsOn={1} />
            <DateRangePicker label="Booking" minDate={new Date()} isDateUnavailable={isWeekend} description="Weekdays only." />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { DateRangePicker } from 'pada-ds';

const [stay, setStay] = useState<[Date, Date] | null>(null);

<DateRangePicker label="Stay" value={stay} onValueChange={setStay} minDate={new Date()} />
<DateRangePicker
  label="Report period"
  presets={[{ label: 'Last 7 days', range: [weekAgo, today] }]}
/>`}
          language="tsx"
          label="Date Range Picker usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The field is a button that opens a dialog named “Choose {'{label}'}”; focus moves to the selected day and returns to the field on close.</li>
          <li>Arrow keys move by day and week, crossing from one month into the next; PageUp/PageDown move by month, with Shift by year.</li>
          <li>The value changes only once both ends are picked: Escape drops a half-picked range.</li>
        </ul>
      }
    />
  );
}
