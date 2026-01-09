import React, { useState } from 'react';
import '../styles/global.css';
import '../styles/primitives.css';
import { InputText } from '../components/InputText';
import { FormLabel } from '../components/FormLabel';
import { InputTextArea } from '../components/InputTextArea';
import { InputDate } from '../components/InputDate';

const App = () => {
  const [inputDateSingle, setInputDateSingle] = useState<Date | null>(null);
  const [inputDateRange, setInputDateRange] = useState<[Date, Date?] | null>(null);
  const [inputDateMonth, setInputDateMonth] = useState<Date | null>(null);
  const [inputDateMonthRange, setInputDateMonthRange] = useState<[Date, Date?] | null>(null);
  const [inputDateYear, setInputDateYear] = useState<Date | null>(null);
  const [inputDateYearRange, setInputDateYearRange] = useState<[Date, Date?] | null>(null);

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

      <h1 style={{ marginTop: 'var(--spacing-12)' }}>Input Date Component</h1>

      <h2>Single Date Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Date"
          mode="date"
          selection="single"
          value={inputDateSingle}
          onChange={(date) => setInputDateSingle(date as Date | null)}
        />
        <InputDate
          label="Date with Description"
          mode="date"
          selection="single"
          description="Select a date for your appointment"
        />
        <InputDate
          label="Date with Error"
          mode="date"
          selection="single"
          error="Please select a valid date"
        />
        <InputDate
          label="Disabled Input Date"
          mode="date"
          selection="single"
          disabled
        />
        <InputDate
          label="Date with Min/Max"
          mode="date"
          selection="single"
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          description="Select a date within the next 30 days"
        />
      </div>

      <h2>Date Range Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Date Range"
          mode="date"
          selection="range"
          value={inputDateRange}
          onChange={(range) => setInputDateRange(range as [Date, Date?] | null)}
        />
        <InputDate
          label="Date Range with Description"
          mode="date"
          selection="range"
          description="Select a start and end date"
        />
      </div>

      <h2>Single Month Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Month"
          mode="month"
          selection="single"
          value={inputDateMonth}
          onChange={(date) => setInputDateMonth(date as Date | null)}
        />
        <InputDate
          label="Month with Description"
          mode="month"
          selection="single"
          description="Select a month"
        />
      </div>

      <h2>Month Range Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Month Range"
          mode="month"
          selection="range"
          value={inputDateMonthRange}
          onChange={(range) => setInputDateMonthRange(range as [Date, Date?] | null)}
        />
      </div>

      <h2>Single Year Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Year"
          mode="year"
          selection="single"
          value={inputDateYear}
          onChange={(date) => setInputDateYear(date as Date | null)}
        />
        <InputDate
          label="Year with Description"
          mode="year"
          selection="single"
          description="Select a year"
        />
      </div>

      <h2>Year Range Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
        <InputDate
          label="Select Year Range"
          mode="year"
          selection="range"
          value={inputDateYearRange}
          onChange={(range) => setInputDateYearRange(range as [Date, Date?] | null)}
        />
      </div>

    </div>
  );
};

export default App;
