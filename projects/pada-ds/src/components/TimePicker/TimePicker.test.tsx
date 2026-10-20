import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { TimePicker } from '.';

const spin = (name: string) => screen.getByRole('spinbutton', { name });

describe('TimePicker', () => {
  it('is a labelled, described group of spinbuttons', async () => {
    render(<TimePicker label="Start time" description="Local time." locale="en-US" defaultValue="14:30" />);
    const group = screen.getByRole('group', { name: 'Start time' });
    expect(group).toHaveAccessibleDescription('Local time.');
    expect(spin('Hours')).toHaveTextContent('2');
    expect(spin('Minutes')).toHaveTextContent('30');
    expect(spin('AM/PM')).toHaveTextContent('PM');
    expect(await axeViolations()).toEqual([]);
  });

  it('types and steps by minuteStep', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker label="Meeting" locale="en-GB" minuteStep={15} onValueChange={onValueChange} />);
    spin('Hours').focus();
    await user.keyboard('0930');
    expect(onValueChange).toHaveBeenLastCalledWith('09:30');
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith('09:45');
    expect(spin('Minutes')).toHaveFocus();
  });

  it('marks required, shows an error in place of the description, and can be disabled', async () => {
    const { rerender } = render(<TimePicker label="Alarm" description="Daily." locale="en-GB" required />);
    expect(screen.getByRole('group', { name: 'Alarm (required)' })).toBeInTheDocument();
    expect(spin('Hours')).toHaveAttribute('aria-required', 'true');

    rerender(<TimePicker label="Alarm" description="Daily." locale="en-GB" required error="Pick a time." />);
    const group = screen.getByRole('group', { name: 'Alarm (required)' });
    expect(group).toHaveAccessibleDescription('Pick a time.');
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a time.');
    expect(spin('Hours')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Daily.')).toBeNull();
    expect(document.querySelector('.time-picker')).toHaveAttribute('data-invalid');
    expect(await axeViolations()).toEqual([]);

    rerender(<TimePicker label="Alarm" locale="en-GB" disabled defaultValue="07:00" />);
    expect(spin('Hours')).toHaveAttribute('aria-disabled', 'true');
    expect(document.querySelector('.time-picker')).toHaveAttribute('data-disabled');
  });

  it('marks a time outside min/max invalid', () => {
    render(<TimePicker label="Opening" locale="en-GB" min="08:00" max="18:00" value="19:00" onValueChange={() => {}} />);
    expect(document.querySelector('.time-picker')).toHaveAttribute('data-invalid');
    expect(spin('Hours')).toHaveAttribute('aria-invalid', 'true');
  });
});
