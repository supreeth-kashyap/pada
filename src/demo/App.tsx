import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { PickerBox } from '../components/DatePicker/_PickerBox/PickerBox';
import { DatePickerDropdown } from '../components/DatePicker';

const App = () => {
  const [isActive, setIsActive] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date?] | null>(null);

  return (
    <main className="demo-shell">
      <div className="demo-section-tag">Section 1</div>
      <button
        type="button"
        className="demo-section-tag"
        onClick={() => setShowDatePicker((prev) => !prev)}
        style={{ marginTop: '16px', width: 'fit-content' }}
      >
        {showDatePicker ? 'Hide Date Picker' : 'Show Date Picker'}
      </button>
      {showDatePicker && (
        <div style={{ marginTop: '16px' }}>
          <DatePickerDropdown
            isRange
            value={selectedDate}
            onChange={(value) => {
              setSelectedDate(value);
            }}
          />
        </div>
      )}

    </main>
  );
};

export default App;
