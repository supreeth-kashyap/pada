import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

const plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
];

describe('Select', () => {
  it('submits its value with forms through a hidden input', () => {
    render(
      <form data-testid="form">
        <Select label="Plan" name="plan" options={plans} defaultValue="pro" />
      </form>,
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('plan')).toBe('pro');
  });

  it('describes the trigger with its description and error', () => {
    render(<Select label="Plan" options={plans} description="Billed monthly." error="Choose a plan" />);
    const trigger = screen.getByRole('combobox', { name: 'Plan' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Billed monthly. Choose a plan');
  });
});
