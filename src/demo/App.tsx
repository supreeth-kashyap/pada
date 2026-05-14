import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { Select } from '../components/Select/Select';

const App = () => {
  const [selectedValue, setSelectedValue] = useState<string | number>('option-1');
  const [errorValue, setErrorValue] = useState<string | number>('');

  return (
    <main className="demo-shell">
      <section style={{ padding: '40px' }}>
        <h2>Select Component</h2>

        <div style={{ marginBottom: '32px', maxWidth: '300px' }}>
          <h3>Basic Select</h3>
          <Select
            label="Choose an option"
            name="basic-select"
            id="basic-select"
            value={selectedValue}
            onChange={setSelectedValue}
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px', maxWidth: '300px' }}>
          <h3>Select with Description</h3>
          <Select
            label="Choose an option"
            name="description-select"
            id="description-select"
            value={selectedValue}
            onChange={setSelectedValue}
            description="This is a helpful description"
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px', maxWidth: '300px' }}>
          <h3>Select with Error</h3>
          <Select
            label="Choose an option"
            name="error-select"
            id="error-select"
            value={errorValue}
            onChange={setErrorValue}
            error="This field is required"
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px', maxWidth: '300px' }}>
          <h3>Disabled Select</h3>
          <Select
            label="Choose an option"
            name="disabled-select"
            id="disabled-select"
            value={selectedValue}
            onChange={setSelectedValue}
            disabled
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px', maxWidth: '300px' }}>
          <h3>Select with Disabled Options</h3>
          <Select
            label="Choose an option"
            name="partial-disabled-select"
            id="partial-disabled-select"
            value={selectedValue}
            onChange={setSelectedValue}
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2 (disabled)', value: 'option-2', disabled: true },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>
      </section>
    </main>
  );
};

export default App;
