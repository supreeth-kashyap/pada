import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { RadioGroup } from '../components/RadioGroup/RadioGroup';

const App = () => {
  const [selectedRadio, setSelectedRadio] = useState('option-1');

  return (
    <main className="demo-shell">
      <section style={{ padding: '40px' }}>
        <h2>RadioGroup Component</h2>

        <div style={{ marginBottom: '32px' }}>
          <h3>Basic RadioGroup</h3>
          <RadioGroup
            name="basic-radio"
            label="Select an option"
            value={selectedRadio}
            onChange={setSelectedRadio}
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>Disabled RadioGroup</h3>
          <RadioGroup
            name="disabled-radio"
            label="Disabled group"
            value={selectedRadio}
            onChange={setSelectedRadio}
            disabled
            options={[
              { value: 'option-1', label: 'Option 1' },
              { value: 'option-2', label: 'Option 2' },
              { value: 'option-3', label: 'Option 3' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3>With Disabled Items</h3>
          <RadioGroup
            name="partial-disabled-radio"
            label="Some options disabled"
            value={selectedRadio}
            onChange={setSelectedRadio}
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
