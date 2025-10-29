import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import '../styles/primitives.css';
import tokensMap from '../docs/tokens-map.json';
import { Button, type ButtonVariant, type ButtonSize } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { RadioGroup } from '../components/RadioGroup';
import { Switch } from '../components/Switch';
import { Modal } from '../components/Modal';
import { Tabs, TabPanel } from '../components/Tabs';
import { Select } from '../components/Select';
import { Tooltip } from '../components/Tooltip';
import { Progress } from '../components/Progress';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('react');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('react');
  const [progressValue, setProgressValue] = useState(25);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const ColorSwatch = ({ colorName, colorVar }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <div
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: `var(${colorVar})`,
          border: '1px solid var(--color-border)',
          marginRight: '10px',
        }}
      ></div>
      <div>
        <div style={{ fontWeight: 'bold' }}>{colorName}</div>
        <div>{colorVar}</div>
      </div>
    </div>
  );

  const colors = [
    'primary',
    'secondary',
    'neutral',
    'accent'
  ];
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'link', 'destructive'];
  const buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const radioOptions = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ];
  const selectOptions = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
  ];


  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor:'var(--color-bg)' }}>
      <h1>Design System Demo</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>

      <h2>Modal</h2>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      <Modal title="My Modal" open={isModalOpen} onOpenChange={setIsModalOpen}>
        <p>This is the content of the modal. You can put anything you want here.</p>
      </Modal>

      <h2>Tabs</h2>
      <Tabs label="Frameworks">
        <TabPanel label="React">
          <p>React is a JavaScript library for building user interfaces.</p>
        </TabPanel>
        <TabPanel label="Vue">
          <p>Vue is a progressive framework for building user interfaces.</p>
        </TabPanel>
        <TabPanel label="Svelte">
          <p>Svelte is a radical new approach to building user interfaces.</p>
        </TabPanel>
      </Tabs>

      <h2>Forms</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '400px' }}>
        <Select
            label="Choose a framework"
            options={selectOptions}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            description="This is a description for the select component."
        />
        <Input label="Username" placeholder="Enter your username" />
        <Input label="Email" placeholder="you@example.com" error="Please enter a valid email." />
        <Input label="Website" prefix="https://" placeholder="example.com" />
        <Input label="Amount" suffix="USD" placeholder="0.00" description="Please enter the amount in USD." />
        <Checkbox label="Uncontrolled Checkbox" />
        <Checkbox label="Controlled Checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
        <RadioGroup
            name="framework"
            label="Choose a framework"
            options={radioOptions}
            value={radioValue}
            onChange={setRadioValue}
        />
        <Switch label="Uncontrolled Switch" />
        <Switch label="Controlled Switch" checked={isSwitchOn} onChange={() => setIsSwitchOn(!isSwitchOn)} />
      </div>

      <h2>Feedback</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
        <Progress label="Loading..." value={progressValue} />
        <Button onClick={() => setProgressValue(Math.random() * 100)}>Randomize Progress</Button>
      </div>

      <h2>Buttons</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
            {buttonVariants.map(variant => (
                <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)'}}>
                <h3 style={{width: '100px'}}>{variant}</h3>
                {buttonSizes.map(size => (
                    <Button key={size} variant={variant} size={size}>
                    Button
                    </Button>
                ))}
                </div>
            ))}
        </div>

      <h2>Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
        {colors.map(color => (
          <div key={color}>
            <h3>{color.charAt(0).toUpperCase() + color.slice(1)}</h3>
            {shades.map(shade => (
              <ColorSwatch
                key={`${color}-${shade}`}
                colorName={`${color}-${shade}`}
                colorVar={`--color-${color}-${shade}`}
              />
            ))}
          </div>
        ))}
      </div>

        <h2>Spacing</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)'}}>
            <div style={{backgroundColor: 'var(--color-primary-100)', padding: 'var(--space-1)'}}>space-1</div>
            <div style={{backgroundColor: 'var(--color-primary-200)', padding: 'var(--space-2)'}}>space-2</div>
            <div style={{backgroundColor: 'var(--color-primary-300)', padding: 'var(--space-3)'}}>space-3</div>
            <div style={{backgroundColor: 'var(--color-primary-400)', padding: 'var(--space-4)'}}>space-4</div>
            <div style={{backgroundColor: 'var(--color-primary-500)', padding: 'var(--space-5)'}}>space-5</div>
            <div style={{backgroundColor: 'var(--color-primary-600)', padding: 'var(--space-6)'}}>space-6</div>
        </div>

        <h2>Docs Preview</h2>
        <pre style={{ backgroundColor: 'var(--color-neutral-100)', padding: 'var(--space-3)', borderRadius: 'var(--radius-3)' }}>
          {JSON.stringify(tokensMap, null, 2)}
        </pre>
    </div>
  );
};

export default App;
