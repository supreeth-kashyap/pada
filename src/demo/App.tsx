import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useState } from 'react';
import { Select } from '../components/Select/Select';
import { Sidebar, type SidebarData } from '../components/Sidebar';
import { Icon } from '../components/Icon';

const menuIcon = (name: string) => <Icon name={name} size={20} />;

const sidebarData: SidebarData = {
  sections: [
    {
      id: 'workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: menuIcon('dashboard') },
        { id: 'inbox', label: 'Inbox', icon: menuIcon('inbox'), trailing: '12' },
        { id: 'calendar', label: 'Calendar', icon: menuIcon('calendar_today') },
      ],
    },
    {
      id: 'work',
      label: 'Work',
      items: [
        { id: 'projects', label: 'Projects', icon: menuIcon('folder') },
        { id: 'reports', label: 'Reports', icon: menuIcon('summarize') },
        { id: 'audits', label: 'Audits', icon: menuIcon('fact_check') },
        { id: 'risks', label: 'Risks', icon: menuIcon('warning') },
      ],
    },
    {
      id: 'admin',
      label: 'Admin',
      items: [
        { id: 'team', label: 'Team', icon: menuIcon('groups') },
        { id: 'access', label: 'Access control', icon: menuIcon('lock_person') },
        { id: 'settings', label: 'Settings', icon: menuIcon('settings') },
        { id: 'logout', label: 'Log out', icon: menuIcon('logout'), disabled: true },
      ],
    },
  ],
};

const App = () => {
  const [selectedValue, setSelectedValue] = useState<string | number>('option-1');
  const [errorValue, setErrorValue] = useState<string | number>('');
  const [activeId, setActiveId] = useState<string>('dashboard');

  return (
    <main className="demo-shell demo-shell--with-sidebar">
      <Sidebar
        data={sidebarData}
        activeId={activeId}
        onItemClick={(item, event) => {
          if (item.href) return;
          event.preventDefault();
          setActiveId(item.id);
        }}
      />
      <section style={{ padding: '40px', flex: 1, overflow: 'auto' }}>
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
