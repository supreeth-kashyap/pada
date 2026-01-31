import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { SegmentControl } from '../components/SegmentControl/SegmentControl';

const App = () => {
  const [selectedSegment, setSelectedSegment] = useState('option-1');

  return (
    <main className="demo-shell">
      <section style={{ padding: '40px' }}>
        <h2>SegmentControl Component</h2>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Small</h3>
          <SegmentControl
            size="sm"
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Medium (default)</h3>
          <SegmentControl
            size="md"
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Large</h3>
          <SegmentControl
            size="lg"
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Disabled</h3>
          <SegmentControl
            disabled
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>With Disabled Items</h3>
          <SegmentControl
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2', disabled: true },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>
      </section>
    </main>
  );
};

export default App;
