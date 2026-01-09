import React, { useState } from 'react';
import '../styles/global.css';
import '../styles/primitives.css';
import { Button } from '../components/Button';
import {
  Dropdown,
  DropdownContent,
  DropdownSearch,
  DropdownItems,
  DropdownItem,
  DropdownSection,
  DropdownFooter,
} from '../components/Dropdown';

const App = () => {
  const [selectedSingle, setSelectedSingle] = useState<string[]>([]);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);

  return (
    <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <h1>Dropdown Component</h1>

      <h2>Button Mode Dropdown</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px', width: '100%' }}>
        <Dropdown>
          <Button>Open Dropdown</Button>
          <DropdownContent>
            <DropdownSearch placeholder="Search items..." />
            <DropdownItems>
              <DropdownItem
                value="item1"
                label="Item 1"
                onClick={(value) => console.log('Clicked:', value)}
              />
              <DropdownItem
                value="item2"
                label="Item 2"
                subLabel="This is a sub label"
                onClick={(value) => console.log('Clicked:', value)}
              />
              <DropdownItem
                value="item3"
                label="Item 3"
                visual={{ type: 'icon', name: 'user_default', background: true }}
                onClick={(value) => console.log('Clicked:', value)}
              />
              <DropdownItem
                value="item4"
                label="Item 4"
                subLabel="With logo visual"
                visual={{ type: 'logo', name: 'accelo', background: true }}
                onClick={(value) => console.log('Clicked:', value)}
              />
            </DropdownItems>
            <DropdownFooter>
              <Button variant="secondary" size="sm">Footer Action</Button>
            </DropdownFooter>
          </DropdownContent>
        </Dropdown>
      </div>

      <h2>Single Select Dropdown</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px', width: '100%' }}>
        <Dropdown
          selectionMode="single"
          selectedValues={selectedSingle}
          onSelect={(value) => setSelectedSingle([value])}
        >
          <Button>Select Option</Button>
          <DropdownContent>
            <DropdownSearch placeholder="Search options..." />
            <DropdownItems>
              <DropdownSection title="Section 1">
                <DropdownItem value="opt1" label="Option 1" />
                <DropdownItem value="opt2" label="Option 2" subLabel="With description" />
                <DropdownItem
                  value="opt3"
                  label="Option 3"
                  visual={{ type: 'icon', name: 'tick_1', background: true }}
                />
              </DropdownSection>
              <DropdownSection title="Section 2">
                <DropdownItem value="opt4" label="Option 4" />
                <DropdownItem
                  value="opt5"
                  label="Option 5"
                  visual={{ type: 'logo', name: 'accelo' }}
                />
              </DropdownSection>
            </DropdownItems>
          </DropdownContent>
        </Dropdown>
      </div>

      <h2>Multi Select Dropdown</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px', width: '100%' }}>
        <Dropdown
          selectionMode="multi"
          selectedValues={selectedMulti}
          onSelect={(value) => setSelectedMulti([...selectedMulti, value])}
          onDeselect={(value) => setSelectedMulti(selectedMulti.filter(v => v !== value))}
        >
          <Button>Select Multiple</Button>
          <DropdownContent>
            <DropdownSearch placeholder="Search..." />
            <DropdownItems>
              <DropdownItem value="multi1" label="Multi Option 1" />
              <DropdownItem value="multi2" label="Multi Option 2" subLabel="With sub text" />
              <DropdownItem
                value="multi3"
                label="Multi Option 3"
                visual={{ type: 'icon', name: 'star', background: true }}
              />
              <DropdownItem
                value="multi4"
                label="Multi Option 4"
                visual={{ type: 'logo', name: 'accelo', background: true }}
              />
              <DropdownItem value="multi5" label="Disabled Option" disabled />
            </DropdownItems>
            <DropdownFooter>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)' }}>
                  {selectedMulti.length} selected
                </span>
                <Button variant="primary" size="sm">Apply</Button>
              </div>
            </DropdownFooter>
          </DropdownContent>
        </Dropdown>
      </div>

      <h2>Dropdown with All Features</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px', width: '100%' }}>
        <Dropdown
          selectionMode="single"
          selectedValues={selectedSingle}
          onSelect={(value) => setSelectedSingle([value])}
        >
          <Button>Full Featured Dropdown</Button>
          <DropdownContent>
            <DropdownSearch placeholder="Search items..." />
            <DropdownItems>
              <DropdownSection title="Team Members">
                <DropdownItem
                  value="user1"
                  label="John Doe"
                  subLabel="Software Engineer"
                  visual={{ type: 'icon', name: 'user_default', background: true }}
                />
                <DropdownItem
                  value="user2"
                  label="Jane Smith"
                  subLabel="Product Manager"
                  visual={{ type: 'icon', name: 'user_default', background: true }}
                />
              </DropdownSection>
              <DropdownSection title="Integrations">
                <DropdownItem
                  value="int1"
                  label="Accelo"
                  subLabel="Project Management"
                  visual={{ type: 'logo', name: 'accelo', background: true }}
                />
                <DropdownItem
                  value="int2"
                  label="GitHub"
                  subLabel="Version Control"
                  visual={{ type: 'logo', name: 'github_branch', background: true }}
                />
              </DropdownSection>
              <DropdownSection>
                <DropdownItem value="plain1" label="Plain Item 1" />
                <DropdownItem value="plain2" label="Plain Item 2" />
                <DropdownItem value="plain3" label="Disabled Item" disabled />
              </DropdownSection>
            </DropdownItems>
            <DropdownFooter>
              <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                View All
              </Button>
            </DropdownFooter>
          </DropdownContent>
        </Dropdown>
      </div>

    </div>
  );
};

export default App;
