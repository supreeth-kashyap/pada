import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Carousel } from '../../../components/Carousel';

export default function CarouselDemo() {
  return (
    <DemoPage
      title="Carousel"
      kind="Component"
      purpose={<p>Carousel cycles through a small, ordered set of items in a constrained horizontal space. Use it for product galleries, onboarding slides, or feature tours — never as a substitute for a primary navigation pattern. If users need to compare items, prefer a list or grid.</p>}
      design={<><p>A Carousel exposes navigation controls (prev/next) and pagination indicators. Auto-advance is supported but disabled by default.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><Carousel><div style={{ background: 'var(--pada-color-accent-subtle)', height: 120, padding: 24, borderRadius: 12 }}>Slide 1</div><div style={{ background: 'var(--pada-color-success-subtle)', height: 120, padding: 24, borderRadius: 12 }}>Slide 2</div><div style={{ background: 'var(--pada-color-warning-subtle)', height: 120, padding: 24, borderRadius: 12 }}>Slide 3</div></Carousel></div></div></>}
      developer={<><p>Import the <code>Carousel</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Carousel } from 'pada-ds';

export function FeatureTour() {
  return (
    <Carousel>
      <img src="/slide-1.png" alt="Step 1" />
      <img src="/slide-2.png" alt="Step 2" />
    </Carousel>
  );
}`} language="tsx" label="Carousel usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Prev/next controls are real <code>&lt;button&gt;</code> elements with descriptive <code>aria-label</code>s.</li><li>Slides are exposed as a region with <code>aria-roledescription="carousel"</code> and the active index is announced.</li><li>Auto-advance is paused on hover, focus, and when <code>prefers-reduced-motion: reduce</code> is set.</li></ul>}
    />
  );
}
