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
import { Icon, type IconSize, type IconColor, type IconVariant } from '../components/Icon';
import { Text, TextSize, TextWeight, TextFamily, TextLineHeight } from '../components/Text';
import { Accordion } from '../components/Accordion';
import { Banner } from '../components/Banner';
import { ButtonGroup, type ButtonGroupVariant, type ButtonGroupSize } from '../components/ButtonGroup';

const App = () => {
  const [theme, setTheme] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('react');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('react');
  const [progressValue, setProgressValue] = useState(25);
  const [bannerVisible, setBannerVisible] = useState({
    info: true,
    success: true,
    warning: true,
    error: true,
    neutral: true,
    noIcon: true,
    noButton: true,
    noClose: true,
    simple: true,
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'light';
      // If null, toggle to light (CSS will handle system preference when null)
      return 'light';
    });
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
  const buttonSizes: ButtonSize[] = [ 'sm', 'md', 'lg'];
  const iconSizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const iconColors: IconColor[] = ['Icy', 'Green', 'Yellow', 'Red', 'Blue', 'Purple', 'Magenta', 'Tangerine', 'White'];
  const iconVariants: IconVariant[] = ['outlined', 'filled'];
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
      <h1>Pada Design System</h1>
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

      <h2>Checkboxes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
        <div>
          <h3>With Label</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
              <Checkbox label="Unchecked" />
              <Checkbox label="Checked" defaultChecked />
              <Checkbox label="Indeterminate (Mixed)" indeterminate />
              <Checkbox label="Controlled Checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
            </div>
          </div>
        </div>

        <div>
          <h3>Without Label</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
            <Checkbox />
            <Checkbox defaultChecked />
            <Checkbox indeterminate />
            <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          </div>
        </div>

        <div>
          <h3>Disabled States</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
              <span style={{width: '150px', minWidth: '150px'}}>With Label:</span>
              <Checkbox label="Disabled Unchecked" disabled />
              <Checkbox label="Disabled Checked" disabled defaultChecked />
              <Checkbox label="Disabled Indeterminate" disabled indeterminate />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
              <span style={{width: '150px', minWidth: '150px'}}>Without Label:</span>
              <Checkbox disabled />
              <Checkbox disabled defaultChecked />
              <Checkbox disabled indeterminate />
            </div>
          </div>
        </div>

        <div>
          <h3>With Click Handlers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
              <Checkbox 
                label="Click me" 
                onClick={() => alert('Checkbox clicked!')}
              />
              <Checkbox 
                label="With onChange" 
                onChange={(e) => console.log('Checked:', e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div>
          <h3>All Combinations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)'}}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Unchecked</h4>
              <Checkbox label="With label" />
              <Checkbox />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Checked</h4>
              <Checkbox label="With label" defaultChecked />
              <Checkbox defaultChecked />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Disabled Unchecked</h4>
              <Checkbox label="With label" disabled />
              <Checkbox disabled />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Disabled Checked</h4>
              <Checkbox label="With label" disabled defaultChecked />
              <Checkbox disabled defaultChecked />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Indeterminate</h4>
              <Checkbox label="With label" indeterminate />
              <Checkbox indeterminate />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
              <h4>Disabled Indeterminate</h4>
              <Checkbox label="With label" disabled indeterminate />
              <Checkbox disabled indeterminate />
            </div>
          </div>
        </div>
      </div>

      <h2>Feedback</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
        <Progress label="Loading..." value={progressValue} />
        <Button onClick={() => setProgressValue(Math.random() * 100)}>Randomize Progress</Button>
      </div>

      <h2>Icons</h2>
      
      <h3>Icon Sizes</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {iconSizes.map(size => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="alert_1" size={size} color="Icy" />
            <span style={{ fontSize: '12px' }}>{size}</span>
          </div>
        ))}
      </div>

      <h3>Icon Colors (Outlined)</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {iconColors.map(color => (
          <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="security" size="lg" color={color} variant="outlined" />
            <span style={{ fontSize: '12px' }}>{color}</span>
          </div>
        ))}
      </div>

      <h3>Icon Colors (Filled)</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {iconColors.map(color => (
          <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="security" size="lg" color={color} variant="filled" />
            <span style={{ fontSize: '12px' }}>{color}</span>
          </div>
        ))}
      </div>

      <h3>Icons with Background</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {iconColors.slice(0, 5).map(color => (
          <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="approve" size="lg" color={color} variant="outlined" background={true} />
            <span style={{ fontSize: '12px' }}>{color} + bg</span>
          </div>
        ))}
      </div>

      <h3>Icon Variants Comparison</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {iconVariants.map(variant => (
          <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="bell" size="xl" color="Blue" variant={variant} />
            <span style={{ fontSize: '12px' }}>{variant}</span>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icon name="bell" size="xl" color="Blue" variant="outlined" background={true} />
          <span style={{ fontSize: '12px' }}>with background</span>
        </div>
      </div>

      <h3>Different Icons Showcase</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {['alert_1', 'security', 'approve', 'bell', 'dashboard', 'cog', 'user_default', 'search', 'help', 'info'].map(iconName => (
          <div key={iconName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name={iconName} size="lg" color="Icy" />
            <span style={{ fontSize: '11px', textAlign: 'center' }}>{iconName}</span>
          </div>
        ))}
      </div>

      <h2>Text</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <h3>Text Sizes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Text size={TextSize.XS}>Extra Small Text (XS)</Text>
            <Text size={TextSize.SM}>Small Text (SM)</Text>
            <Text size={TextSize.BASE}>Base Text (BASE)</Text>
            <Text size={TextSize.LG}>Large Text (LG)</Text>
            <Text size={TextSize.XL}>Extra Large Text (XL)</Text>
            <Text size={TextSize['2XL']}>2XL Text</Text>
            <Text size={TextSize['3XL']}>3XL Text</Text>
            <Text size={TextSize['4XL']}>4XL Text</Text>
          </div>
        </div>

        <div>
          <h3>Font Weights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Text weight={TextWeight.THIN}>Thin (100)</Text>
            <Text weight={TextWeight.LIGHT}>Light (300)</Text>
            <Text weight={TextWeight.NORMAL}>Normal (400)</Text>
            <Text weight={TextWeight.MEDIUM}>Medium (500)</Text>
            <Text weight={TextWeight.SEMIBOLD}>Semibold (600)</Text>
            <Text weight={TextWeight.BOLD}>Bold (700)</Text>
            <Text weight={TextWeight.EXTRABOLD}>Extra Bold (800)</Text>
            <Text weight={TextWeight.BLACK}>Black (900)</Text>
          </div>
        </div>

        <div>
          <h3>Font Families</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Text family={TextFamily.SANS}>Sans Serif Font Family</Text>
            <Text family={TextFamily.SERIF}>Serif Font Family</Text>
            <Text family={TextFamily.MONO}>Monospace Font Family</Text>
          </div>
        </div>

        <div>
          <h3>Line Heights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '400px' }}>
            <Text lineHeight={TextLineHeight.XS}>Extra Small Line Height - This is a longer text to demonstrate how line height affects the spacing between lines of text.</Text>
            <Text lineHeight={TextLineHeight.SM}>Small Line Height - This is a longer text to demonstrate how line height affects the spacing between lines of text.</Text>
            <Text lineHeight={TextLineHeight.BASE}>Base Line Height - This is a longer text to demonstrate how line height affects the spacing between lines of text.</Text>
            <Text lineHeight={TextLineHeight.LG}>Large Line Height - This is a longer text to demonstrate how line height affects the spacing between lines of text.</Text>
            <Text lineHeight={TextLineHeight.XL}>Extra Large Line Height - This is a longer text to demonstrate how line height affects the spacing between lines of text.</Text>
          </div>
        </div>

        <div>
          <h3>Colors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Text>Default color (neutral-900)</Text>
            <Text color="var(--color-blue-500)">Blue text</Text>
            <Text color="var(--color-red-600)">Red text</Text>
            <Text color="var(--color-green-600)">Green text</Text>
            <Text color="var(--color-purple-600)">Purple text</Text>
            <Text color="var(--color-neutral-500)">Muted neutral text</Text>
          </div>
        </div>

        <div>
          <h3>As Different Elements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Text as="span">Span element</Text>
            <Text as="p">Paragraph element</Text>
            <Text as="div">Div element</Text>
            <Text as="h1" size={TextSize['4XL']} weight={TextWeight.BOLD}>Heading 1</Text>
            <Text as="h2" size={TextSize['3XL']} weight={TextWeight.BOLD}>Heading 2</Text>
            <Text as="h3" size={TextSize['2XL']} weight={TextWeight.SEMIBOLD}>Heading 3</Text>
          </div>
        </div>

        <div>
          <h3>Combined Examples</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Text size={TextSize.LG} weight={TextWeight.BOLD} color="var(--color-blue-600)">
              Large, Bold, Blue Text
            </Text>
            <Text size={TextSize.XL} weight={TextWeight.SEMIBOLD} family={TextFamily.MONO} color="var(--color-purple-600)">
              XL, Semibold, Monospace, Purple Text
            </Text>
            <Text as="h2" size={TextSize['3XL']} weight={TextWeight.BOLD} lineHeight={TextLineHeight.LG} color="var(--color-green-700)">
              Heading with Custom Line Height
            </Text>
          </div>
        </div>
      </div>

      <h2>Accordion</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100vw', maxWidth: '600px' }}>
        <Accordion
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon name="info" size="sm" color="Icy" />
              <Text weight={TextWeight.MEDIUM}>Secrets Beneath the Surface</Text>
              <span style={{ 
                backgroundColor: 'var(--color-orange-500)', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '10px', 
                fontWeight: 600,
                marginLeft: 'auto',
                marginRight: 'var(--spacing-2)'
              }}>
                Tag
              </span>
            </div>
          }
        >
          <Text>
            An accordion is a versatile musical instrument that produces sound through the movement of air. 
            It consists of a bellows, which the player compresses and expands, and a series of keys or buttons 
            that control the pitch. Originating in the early 19th century, the accordion has become popular 
            in various music genres, including folk, classical, and even pop. Its rich, expressive tones can 
            evoke a range of emotions, making it a favorite among musicians. Whether played solo or as part of 
            an ensemble, the accordion adds a unique flavor to any musical performance.
          </Text>
        </Accordion>

        <Accordion
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon name="security" size="sm" color="Blue" />
              <Text weight={TextWeight.MEDIUM}>Security Best Practices</Text>
            </div>
          }
          defaultOpen={true}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <Text>• Use strong, unique passwords for each account</Text>
            <Text>• Enable two-factor authentication whenever possible</Text>
            <Text>• Keep your software and systems up to date</Text>
            <Text>• Be cautious with email attachments and links</Text>
            <Text>• Regularly review your privacy settings</Text>
          </div>
        </Accordion>

        <Accordion
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon name="dashboard" size="sm" color="Purple" />
              <Text weight={TextWeight.MEDIUM}>Dashboard Overview</Text>
            </div>
          }
        >
          <Text>
            This dashboard provides a comprehensive view of your system's performance metrics, 
            user activity, and key statistics. Use the filters and date ranges to customize 
            your view and gain deeper insights into your data.
          </Text>
        </Accordion>
      </div>

      <h2>Banner</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px' }}>
        {bannerVisible.info && (
          <Banner
            header="This is the title"
            iconName="info"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This is the body content that provides additional information about the banner message."
            variant="info"
            onClose={() => {
              console.log('Info banner closed');
              setBannerVisible(prev => ({ ...prev, info: false }));
            }}
          />
        )}

        {bannerVisible.success && (
          <Banner
            header="This is the title"
            iconName="approve"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This is the body content that provides additional information about the banner message."
            variant="success"
            onClose={() => {
              console.log('Success banner closed');
              setBannerVisible(prev => ({ ...prev, success: false }));
            }}
          />
        )}

        {bannerVisible.warning && (
          <Banner
            header="This is the title"
            iconName="alert_1"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This is the body content that provides additional information about the banner message."
            variant="warning"
            onClose={() => {
              console.log('Warning banner closed');
              setBannerVisible(prev => ({ ...prev, warning: false }));
            }}
          />
        )}

        {bannerVisible.error && (
          <Banner
            header="This is the title"
            iconName="alert_2"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This is the body content that provides additional information about the banner message."
            variant="error"
            onClose={() => {
              console.log('Error banner closed');
              setBannerVisible(prev => ({ ...prev, error: false }));
            }}
          />
        )}

        {bannerVisible.neutral && (
          <Banner
            header="This is the title"
            iconName="info"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This is the body content that provides additional information about the banner message."
            variant="neutral"
            onClose={() => {
              console.log('Neutral banner closed');
              setBannerVisible(prev => ({ ...prev, neutral: false }));
            }}
          />
        )}

        {bannerVisible.noIcon && (
          <Banner
            header="Banner without icon"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This banner doesn't have an icon because iconName is not provided."
            variant="info"
            onClose={() => {
              console.log('No icon banner closed');
              setBannerVisible(prev => ({ ...prev, noIcon: false }));
            }}
          />
        )}

        {bannerVisible.noButton && (
          <Banner
            header="Banner without button"
            iconName="info"
            text="This banner doesn't have an action button."
            variant="info"
            onClose={() => {
              console.log('No button banner closed');
              setBannerVisible(prev => ({ ...prev, noButton: false }));
            }}
          />
        )}

        {bannerVisible.noClose && (
          <Banner
            header="Banner without close button"
            iconName="info"
            buttonLabel="Action"
            onButtonClick={() => alert('Action clicked!')}
            text="This banner doesn't have a close button."
            variant="info"
          />
        )}

        {bannerVisible.simple && (
          <Banner
            header="Simple banner with just header and text"
            iconName="info"
            text="This is a simple banner with only header and body text, no buttons."
            variant="info"
            onClose={() => {
              console.log('Simple banner closed');
              setBannerVisible(prev => ({ ...prev, simple: false }));
            }}
          />
        )}
      </div>

      <h2>Buttons</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
            <div>
              <h3>All Variants & Sizes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {buttonVariants.map(variant => (
                      <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                      <h4 style={{width: '120px', minWidth: '120px'}}>{variant}</h4>
                      {buttonSizes.map(size => (
                          <Button key={size} variant={variant} size={size}>
                          Button
                          </Button>
                      ))}
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3>With Icons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {buttonVariants.map(variant => (
                      <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                      <h4 style={{width: '120px', minWidth: '120px'}}>{variant}</h4>
                      <Button variant={variant} size="md" leftIcon="security">
                        With Left Icon
                      </Button>
                      <Button variant={variant} size="md" rightIcon="approve">
                        With Right Icon
                      </Button>
                      <Button variant={variant} size="md" leftIcon="security" rightIcon="approve">
                        Both Icons
                      </Button>
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3>States</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {buttonVariants.map(variant => (
                      <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                      <h4 style={{width: '120px', minWidth: '120px'}}>{variant}</h4>
                      <Button variant={variant} size="md">
                        Normal
                      </Button>
                      <Button variant={variant} size="md" disabled>
                        Disabled
                      </Button>
                      <Button variant={variant} size="md" loading>
                        Loading
                      </Button>
                      </div>
                  ))}
              </div>
            </div>
        </div>

      <h2>Button Groups</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
            <div>
              <h3>All Variants & Sizes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {(['primary', 'secondary'] as ButtonGroupVariant[]).map(variant => (
                      <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                      <h4>{variant}</h4>
                      {(['sm', 'md', 'lg'] as ButtonGroupSize[]).map(size => (
                          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '60px', minWidth: '60px'}}>{size}</span>
                          <ButtonGroup 
                            variant={variant} 
                            size={size}
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                          </div>
                      ))}
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3>Button Configurations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {(['primary', 'secondary'] as ButtonGroupVariant[]).map(variant => (
                      <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                      <h4>{variant}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '120px', minWidth: '120px'}}>Icon + Label</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '120px', minWidth: '120px'}}>Label Only</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { children: 'Button' },
                              { children: 'Button' },
                              { children: 'Button' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '120px', minWidth: '120px'}}>Icon Only</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security' },
                              { leftIcon: 'approve' },
                              { leftIcon: 'info' }
                            ]}
                          />
                        </div>
                      </div>
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3>Split Action with Overflow (5+ items)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {(['primary', 'secondary'] as ButtonGroupVariant[]).map(variant => (
                      <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                      <h4>{variant}</h4>
                      {(['sm', 'md', 'lg'] as ButtonGroupSize[]).map(size => (
                          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '60px', minWidth: '60px'}}>{size}</span>
                          <ButtonGroup 
                            variant={variant} 
                            size={size}
                            items={[
                              { leftIcon: 'security', children: 'Button 1', onClick: () => alert('Button 1 clicked') },
                              { leftIcon: 'security', children: 'Button 2', onClick: () => alert('Button 2 clicked') },
                              { leftIcon: 'security', children: 'Button 3', onClick: () => alert('Button 3 clicked') },
                              { leftIcon: 'approve', children: 'Button 4', onClick: () => alert('Button 4 clicked') },
                              { leftIcon: 'info', children: 'Button 5', onClick: () => alert('Button 5 clicked') },
                              { children: 'Button 6 (no icon)', onClick: () => alert('Button 6 clicked') },
                              { children: 'Disabled Button', disabled: true },
                            ]}
                          />
                          </div>
                      ))}
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3>Multiple Buttons in Group</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {(['primary', 'secondary'] as ButtonGroupVariant[]).map(variant => (
                      <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                      <h4>{variant}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '100px', minWidth: '100px'}}>2 buttons</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '100px', minWidth: '100px'}}>3 buttons</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '100px', minWidth: '100px'}}>4 buttons</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                          <span style={{width: '100px', minWidth: '100px'}}>5 buttons</span>
                          <ButtonGroup 
                            variant={variant} 
                            size="md"
                            items={[
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' },
                              { leftIcon: 'security', children: 'Button' }
                            ]}
                          />
                        </div>
                      </div>
                      </div>
                  ))}
              </div>
            </div>
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
