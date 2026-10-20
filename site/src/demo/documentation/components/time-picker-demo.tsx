import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { TimePicker } from '@pada/components/TimePicker';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function TimePickerDemo() {
  return (
    <DemoPage
      title="Time Picker"
      kind="Component"
      purpose={<p>Time Picker enters a time of day: hours, minutes (and seconds), and AM/PM on a 12-hour clock, in the order and clock of the user’s locale.</p>}
      design={
        <>
          <p>Styled like Input Text. The segments are the whole control: type digits, or step each segment with the arrow keys. Out-of-range times and errors turn the border red.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <TimePicker label="Start time" description="In your local time zone." defaultValue="09:30" />
            <TimePicker label="Meeting" minuteStep={15} hourCycle={24} defaultValue="14:00" />
            <TimePicker label="Alarm" granularity="second" defaultValue="06:45:00" />
            <TimePicker label="Opening" min="08:00" max="18:00" required error="Pick a time between 08:00 and 18:00." />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { TimePicker } from 'pada-ds';

const [start, setStart] = useState<string | null>('09:30');

<TimePicker label="Start time" value={start} onValueChange={setStart} minuteStep={15} />
<TimePicker label="Alarm" granularity="second" hourCycle={24} name="alarm" />
// The value is "HH:mm" (or "HH:mm:ss") on a 24-hour clock, null until every segment is filled.`}
          language="tsx"
          label="Time Picker usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The segments are spinbuttons in a <code>role="group"</code> named by the label.</li>
          <li>ArrowUp/ArrowDown step a segment (wrapping), PageUp/PageDown by a larger step, Home/End to its ends; digits type, A/P set AM/PM, Backspace empties.</li>
          <li>ArrowLeft/ArrowRight or Tab move between segments. Built on the headless <code>TimeField</code>.</li>
        </ul>
      }
    />
  );
}
