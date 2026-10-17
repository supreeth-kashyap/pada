import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Rating } from '../../../components/Rating';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function RatingDemo() {
  return (
    <DemoPage
      title="Rating"
      kind="Component"
      purpose={<p>Rating lets people score something from one to five stars, and shows an average score read-only.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
          <Rating label="Your rating" defaultValue={3} />
          <Rating label="Average" value={4.3} readOnly size="sm" />
          <Rating label="Large" defaultValue={4} size="lg" showLabel={false} />
          <Rating label="Disabled" defaultValue={2} disabled />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { Rating } from 'pada-ds';

<Rating label="Your rating" name="rating" value={rating} onValueChange={setRating} />

<Rating label="Average" value={4.3} readOnly />`}
          language="tsx"
          label="Rating usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Interactive ratings are a radio group of "1 star" to "5 stars": <kbd>Tab</kbd> in, arrow keys to change. Clicking the current rating clears it.</li>
          <li>Read-only ratings are one image named "4.3 out of 5 stars", with fractions drawn partly filled.</li>
        </ul>
      }
    />
  );
}
