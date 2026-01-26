import '../styles/global.css';
import '../styles/primitives.css';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Card } from '../components/Card';
import { ComboBox, type ComboBoxItem } from '../components/ComboBox';

const App = () => {
  const [checked, setChecked] = useState(false);
  const [multiMenuOpen, setMultiMenuOpen] = useState(false);
  const [singleMenuOpen, setSingleMenuOpen] = useState(false);
  const iconNames = ['bounding_box', 'info', 'star', 'menu_vertical', 'chevron_down'];
  const [items, setItems] = useState<ComboBoxItem[]>(
    Array.from({ length: 15 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: 'Combo box menu',
      selected: index === 1,
      disabled: index === 2,
      iconName: iconNames[index % iconNames.length],
    }))
  );
  const [singleItems, setSingleItems] = useState<ComboBoxItem[]>([
    { id: 'single-1', label: 'Single select item', selected: true },
    { id: 'single-2', label: 'Single select item', selected: false, iconName: 'menu_vertical' },
    { id: 'single-3', label: 'Single select item', selected: false, disabled: true, iconName: 'bounding_box' },
  ]);

  return (
    <main style={{ minHeight: '100vh', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Button variant="secondary" leftIcon="info" split onSplitClick={() => setMultiMenuOpen((open) => !open)}>
            Split Button
          </Button>
          <Button variant="secondary" leftIcon="info" split onSplitClick={() => setSingleMenuOpen((open) => !open)}>
            Split Button 2
          </Button>
          {multiMenuOpen && (
            <ComboBox
              items={items}
              multiSelect
              onItemClick={(item) => {
                if (item.disabled) return;
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, selected: !entry.selected }
                      : entry
                  )
                );
              }}
            />
          )}
          {singleMenuOpen && (
            <ComboBox
              items={singleItems}
              onItemClick={(item) => {
                if (item.disabled) return;
                setSingleItems((prev) =>
                  prev.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, selected: true }
                      : { ...entry, selected: false }
                  )
                );
              }}
            />
          )}
        </div>

      </Card>
    </main>
  );
};

export default App;
