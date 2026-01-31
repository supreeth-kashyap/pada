import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { Notification } from '../components/Notification/Notification';
import { Pills } from '../components/Pills/Pills';

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPill, setSelectedPill] = useState('option-1');

  return (
    <main className="demo-shell">
      <Notification
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Update complete"
        description="Your changes have been saved and synced."
        actionLabel="Undo"
        onAction={() => setIsOpen(false)}
        variant="success"
        position="top-right"
      />

      <section style={{ padding: '40px' }}>
        <h2>Pills Component</h2>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Small</h3>
          <Pills
            size="sm"
            value={selectedPill}
            onChange={setSelectedPill}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Medium (default)</h3>
          <Pills
            size="md"
            value={selectedPill}
            onChange={setSelectedPill}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Size: Large</h3>
          <Pills
            size="lg"
            value={selectedPill}
            onChange={setSelectedPill}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Disabled</h3>
          <Pills
            disabled
            value={selectedPill}
            onChange={setSelectedPill}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>With Disabled Items</h3>
          <Pills
            value={selectedPill}
            onChange={setSelectedPill}
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
