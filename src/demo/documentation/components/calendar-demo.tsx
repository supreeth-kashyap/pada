import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Calendar } from '../../../components/Calendar';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const today = new Date();
const inDays = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);

export default function CalendarDemo() {
  return (
    <DemoPage
      title="Calendar"
      kind="Component"
      purpose={<p>Calendar shows a month and lets people pick a day or a range of days. Use it inline for scheduling and availability; DatePicker and InputDate are built on it for pickers that open from a field.</p>}
      design={
        <>
          <p>Today has a dot, the selection is a solid fill, and a range is a continuous band that previews as you hover toward its end. Unavailable days are struck through. New months fade in, and a picked day pops.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            <Calendar defaultValue={today} />
            <Calendar mode="range" defaultValue={[inDays(2), inDays(6)]} />
            <Calendar min={today} max={inDays(45)} isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6} weekStartsOn={1} />
          </div>
        </>
      }
      developer={
        <>
          <p>Dates are local <code>Date</code> objects at midnight. Single mode reports a <code>Date</code> (or <code>null</code>); range mode reports <code>[start]</code> after the first pick and <code>[start, end]</code> after the second.</p>
          <CodeSnippet
            code={`import { Calendar } from 'pada-ds';

<Calendar value={day} onValueChange={setDay} />

<Calendar
  mode="range"
  value={range}
  onValueChange={setRange}
  min={new Date()}
  isDateUnavailable={(date) => bookedDays.has(date.toDateString())}
  weekStartsOn={1}
  locale="en-GB"
/>

// Your own header
<Calendar.Root>
  <Calendar.Heading />
  <Calendar.PrevButton />
  <Calendar.NextButton />
  <Calendar.Grid renderDay={({ date }) => <DayWithPrice date={date} />} />
</Calendar.Root>`}
            language="tsx"
            label="Calendar usage"
          />
        </>
      }
      accessibility={
        <ul style={list}>
          <li>The days are a <code>grid</code> labelled by the month heading, which is announced when the month changes. Weekday headers carry their full names.</li>
          <li>One day is in the tab order. <kbd>←</kbd> <kbd>→</kbd> move by day, <kbd>↑</kbd> <kbd>↓</kbd> by week, <kbd>Home</kbd> / <kbd>End</kbd> to the start and end of the week, <kbd>Page Up</kbd> / <kbd>Page Down</kbd> by month (with <kbd>Shift</kbd>, by year). <kbd>Enter</kbd> or <kbd>Space</kbd> selects.</li>
          <li>Each day's name is the full date ("Tuesday, March 10, 2026"); today has <code>aria-current="date"</code>, selected cells <code>aria-selected</code>, unavailable days <code>aria-disabled</code>.</li>
        </ul>
      }
    />
  );
}
