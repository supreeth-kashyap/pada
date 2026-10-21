import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { NumberInput } from '.';

describe('NumberInput (styled)', () => {
  it('wires label, description and error to the spinbutton', async () => {
    render(<NumberInput label="Seats" description="Up to 50." error="Too many" required defaultValue={60} />);
    const input = screen.getByRole('spinbutton', { name: /Seats/ });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Up to 50. Too many');
    expect(await axeViolations()).toEqual([]);
  });

  it('formats currency and submits the raw number', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <NumberInput label="Budget" name="budget" locale="en-US" formatOptions={{ style: 'currency', currency: 'USD' }} defaultValue={1200} step={100} />
      </form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Budget' });
    expect(input).toHaveValue('$1,200.00');
    input.focus();
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('$1,300.00');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('budget')).toBe('1300');
  });

  it('split steppers sit on both sides', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Guests" stepper="split" defaultValue={2} min={1} />);
    const [decrease, increase] = screen.getAllByRole('button');
    expect(decrease).toHaveAccessibleName('Decrease');
    expect(increase).toHaveAccessibleName('Increase');
    await user.click(decrease);
    expect(screen.getByRole('spinbutton')).toHaveValue('1');
    expect(decrease).toBeDisabled();
  });
});
