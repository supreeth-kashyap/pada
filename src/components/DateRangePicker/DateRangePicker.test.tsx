import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { DateRangePicker, type DateRangePreset } from '.';

const TODAY = new Date(2026, 2, 2);
const day = (name: string) => screen.getByRole('button', { name });

describe('DateRangePicker', () => {
  it('opens two months in a dialog, picks start then end, and returns focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Stay"
        locale="en-US"
        today={TODAY}
        defaultValue={[new Date(2026, 2, 3), new Date(2026, 2, 6)]}
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByRole('button', { name: /^Stay Mar 3\s–\s6, 2026$/ });
    expect(field).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(field);
    expect(screen.getByRole('dialog', { name: 'Choose Stay' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'April 2026' })).toBeInTheDocument();
    expect(day('Tuesday, March 3, 2026')).toHaveFocus();
    expect(day('Wednesday, March 4, 2026')).toHaveAttribute('data-in-range');
    expect(await axeViolations()).toEqual([]);

    // A new start: the value waits for the end.
    await user.click(day('Monday, March 30, 2026'));
    expect(onValueChange).not.toHaveBeenCalled();
    // The end, with the keyboard, in the second month.
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith([new Date(2026, 2, 30), new Date(2026, 3, 6)]);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(field).toHaveFocus();
    expect(field).toHaveTextContent(/Mar 30\s–\sApr 6, 2026/);
  });

  it('Escape drops a half-picked range and keeps the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Stay" locale="en-US" today={TODAY} onValueChange={onValueChange} />);
    const field = screen.getByRole('button', { name: /Stay/ });
    expect(field).toHaveTextContent('Select dates');
    await user.click(field);
    await user.click(day('Tuesday, March 10, 2026'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(field);
    expect(day('Tuesday, March 10, 2026')).not.toHaveAttribute('data-selected');
  });

  it('picks a preset', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const presets: DateRangePreset[] = [
      { label: 'Last 7 days', range: [new Date(2026, 1, 24), new Date(2026, 2, 2)] },
      { label: 'This month', range: [new Date(2026, 2, 1), new Date(2026, 2, 31)] },
    ];
    render(<DateRangePicker label="Period" locale="en-US" today={TODAY} presets={presets} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: /Period/ }));
    expect(screen.getByRole('list', { name: 'Presets' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'This month' }));
    expect(onValueChange).toHaveBeenCalledWith(presets[1].range);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: /Period/ }));
    expect(screen.getByRole('button', { name: 'This month' })).toHaveAttribute('aria-pressed', 'true');
    expect(await axeViolations()).toEqual([]);
  });

  it('respects min and max, marks required and errors, and can be disabled', async () => {
    const user = userEvent.setup();
    const props = {
      label: 'Trip',
      locale: 'en-US',
      today: TODAY,
      minDate: new Date(2026, 2, 5),
      maxDate: new Date(2026, 3, 10),
      required: true,
      error: 'Pick your dates.',
    };
    const { rerender } = render(<DateRangePicker {...props} />);
    const field = screen.getByRole('button', { name: /Trip/ });
    expect(screen.getByText('(required)')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Pick your dates.');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Pick your dates.');
    await user.click(field);
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    expect(day('Wednesday, March 4, 2026')).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Escape}');

    rerender(<DateRangePicker {...props} value={[new Date(2026, 2, 10), new Date(2026, 2, 12)]} disabled />);
    expect(field).toHaveTextContent(/Mar 10\s–\s12, 2026/);
    expect(field).toBeDisabled();
  });
});
