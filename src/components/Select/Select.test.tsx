import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Dialog } from '../Dialog';
import { Select } from './Select';

const fruit = [
  { label: 'Banana', value: 'banana' },
  { label: 'Blackberry', value: 'blackberry' },
  { label: 'Blueberry', value: 'blueberry', disabled: true },
  { label: 'Cherry', value: 'cherry' },
];

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

  it('opens a portalled listbox and moves through it from the trigger, with multi-letter type-ahead', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Select label="Fruit" options={fruit} onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox', { name: 'Fruit' });
    expect(container).not.toContainElement(listbox);
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Banana' }).id);
    // "bl" lands on Blackberry, not the next B option.
    await user.keyboard('bl');
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Blackberry' }).id);
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('blackberry', fruit[1]);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveTextContent('Blackberry');
  });

  it('inside a dialog: picking an option or pressing Escape closes only the list', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Preferences</Dialog.Title>
          <Select label="Fruit" options={fruit} />
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Cherry');

    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeInTheDocument();
  });
});
