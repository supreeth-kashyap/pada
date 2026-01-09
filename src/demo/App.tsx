import React from 'react';
import '../styles/global.css';
import '../styles/primitives.css';
import { InputText } from '../components/InputText';
import { FormLabel } from '../components/FormLabel';
import { InputTextArea } from '../components/InputTextArea';

const App = () => {
  return (
    <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <h1>Input Text Component</h1>

      <h2>Basic Input Text</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Username" placeholder="Enter your username" />
        <InputText label="Email" placeholder="you@example.com" />
        <InputText label="Password" type="password" placeholder="Enter your password" />
      </div>

      <h2>Input Text with Error</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Email" placeholder="you@example.com" error="Please enter a valid email." />
        <InputText label="Username" placeholder="Enter your username" error="Username is required." />
      </div>

      <h2>Input Text with Description</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText 
          label="Amount" 
          placeholder="0.00" 
          description="Please enter the amount in USD." 
        />
        <InputText 
          label="Website" 
          placeholder="example.com" 
          description="Enter your website URL without http:// or https://" 
        />
      </div>

      <h2>Input Text with Prefix</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Website" prefix="https://" placeholder="example.com" />
        <InputText label="Phone" prefix="+1" placeholder="(555) 123-4567" />
      </div>

      <h2>Input Text with Suffix</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Amount" suffix="USD" placeholder="0.00" />
        <InputText label="Weight" suffix="kg" placeholder="0" />
      </div>

      <h2>Input Text with Prefix and Suffix</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Price" prefix="$" suffix="USD" placeholder="0.00" />
      </div>

      <h2>Disabled Input Text</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Disabled Input" placeholder="This is disabled" disabled />
        <InputText label="Disabled with Value" value="Disabled value" disabled />
      </div>

      <h2>Input Text States</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputText label="Normal" placeholder="Normal state" />
        <InputText label="With Error" placeholder="Error state" error="This field has an error" />
        <InputText label="Disabled" placeholder="Disabled state" disabled />
        <InputText label="With Description" placeholder="Has description" description="This is a helpful description" />
      </div>

      <h2>Form Label</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <div>
          <FormLabel htmlFor="basic-label">Basic Label</FormLabel>
        </div>
        <div>
          <FormLabel htmlFor="required-label" required>Required Label</FormLabel>
        </div>
        <div>
          <FormLabel htmlFor="optional-label" optional>Optional Label</FormLabel>
        </div>
        <div>
          <FormLabel htmlFor="both-label" required optional>Label with Both</FormLabel>
        </div>
        <div>
          <FormLabel htmlFor="custom-label" className="custom-class">Custom Styled Label</FormLabel>
        </div>
      </div>

      <h2>Input TextArea</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputTextArea label="Basic Textarea" placeholder="Enter your message here..." />
        <InputTextArea label="Textarea with Description" placeholder="Enter your message here..." description="This is a helpful description for the textarea." />
        <InputTextArea label="Textarea with Error" placeholder="Enter your message here..." error="This field is required." />
        <InputTextArea label="Disabled Textarea" placeholder="This is disabled" disabled />
        <InputTextArea label="Textarea with Value" defaultValue="This is some default text in the textarea." />
        <InputTextArea label="Large Textarea" placeholder="Enter a longer message..." rows={6} />
      </div>

    </div>
  );
};

export default App;
