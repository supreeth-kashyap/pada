import '../styles/global.css';
import '../styles/primitives.css';
import { Step, Steps } from '../components/Steps';
import { StepIndicator, StepIcon } from '../components/Steps/sub-components';
import { useState } from 'react';

const App = () => {
  const [currentStep, setCurrentStep] = useState<number | string | undefined>(undefined);

  return (
    <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <h1>Steps Component</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', maxWidth: '600px', width: '100%' }}>
        <h2>Interaction States - Rest, Hover</h2>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--spacing-4)' }}>
          Hover over upcoming steps to see blue hover state. Click to change to current status (with box layout).
        </p>
        <Steps
          steps={[
            { title: 'Step 1', description: 'Upcoming step - hover and click me', status: 'upcoming' },
            { title: 'Step 2', description: 'Upcoming step - hover and click me', status: 'upcoming' },
            { title: 'Step 3', description: 'Upcoming step - hover and click me', status: 'upcoming' },
          ]}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        <h2>Status Variants - All Statuses</h2>
        <Steps
          steps={[
            { title: 'Step 1', description: 'Completed step', status: 'completed' },
            { title: 'Step 2', description: 'Current step', status: 'current' },
            { title: 'Step 3', description: 'Upcoming step', status: 'upcoming' },
          ]}
        />

        <h2>Mixed Status with Interaction</h2>
        <Steps
          steps={[
            { title: 'Step 1', description: 'Completed - not interactive', status: 'completed' },
            { title: 'Step 2', description: 'Current - box layout', status: 'current' },
            { title: 'Step 3', description: 'Upcoming - hover/click me', status: 'upcoming' },
            { title: 'Step 4', description: 'Upcoming - hover/click me', status: 'upcoming' },
          ]}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        <h2>Individual Step Examples</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Step 
            title="Rest State (Upcoming)" 
            description="Default grey state" 
            status="upcoming"
          />
          <Step 
            title="Current Status" 
            description="Box layout design" 
            status="current"
          />
          <Step 
            title="Completed Status" 
            description="Green checkmark with box" 
            status="completed"
          />
        </div>

        <h2>Step Indicator Sub-Component</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Concentric Type (Ring with Inner Circle)</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="concentric" state="rest" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Rest</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="concentric" state="hover" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Hover</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Solid Type (Filled Circle)</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="solid" state="rest" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Rest</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="solid" state="hover" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Hover</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Different Sizes</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="concentric" state="rest" size="sm" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Small</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="concentric" state="rest" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIndicator type="concentric" state="rest" size="lg" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Large</span>
              </div>
            </div>
          </div>
        </div>

        <h2>Step Icon Sub-Component</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Active Status</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="active" content="number" number={1} size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Number</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="active" content="dot" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Dot</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="active" content="symbol" symbol="Φ" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Symbol</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Completed Status</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="completed" size="sm" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Small</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="completed" size="md" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StepIcon status="completed" size="lg" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-600)' }}>Large</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>Active with Different Numbers</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <StepIcon status="active" content="number" number={1} size="md" />
              <StepIcon status="active" content="number" number={2} size="md" />
              <StepIcon status="active" content="number" number={3} size="md" />
              <StepIcon status="active" content="number" number={9} size="md" />
              <StepIcon status="active" content="number" number={10} size="md" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
