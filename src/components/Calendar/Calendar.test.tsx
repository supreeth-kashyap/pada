import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { DatePickerDropdown } from '../DatePicker';
import { InputDate } from '../InputDate';
import { Calendar } from '.';

describe('Calendar (styled)', () => {
  it('renders a header and grid with styled days', async () => {
    render(<Calendar locale="en-US" defaultValue={new Date(2026, 2, 10)} />);
    expect(screen.getByRole('heading', { name: 'March 2026' })).toHaveClass('calendar-heading');
    expect(screen.getByRole('button', { name: 'Tuesday, March 10, 2026' })).toHaveClass('calendar-day');
    expect(await axeViolations()).toEqual([]);
  });
});

describe('DatePickerDropdown', () => {
  it('keeps the 1.x API: range values and a month view from the heading', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePickerDropdown isRange value={[new Date(2026, 2, 3)]} onChange={onChange} locale="en-US" />);
    await user.click(screen.getByRole('button', { name: 'Friday, March 6, 2026' }));
    expect(onChange).toHaveBeenLastCalledWith([new Date(2026, 2, 3), new Date(2026, 2, 6)]);
    await user.click(screen.getByRole('button', { name: 'March 2026' }));
    expect(screen.getByRole('button', { name: 'Jan' })).toBeInTheDocument();
  });
});

describe('InputDate', () => {
  it('opens the picker in a dialog on the selected day, picks with the keyboard, and returns focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputDate label="Due date" value={new Date(2026, 2, 10)} onChange={onChange} />);
    const field = screen.getByRole('button', { name: /Due date/ });
    expect(field).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(field);
    expect(screen.getByRole('dialog', { name: 'Choose Due date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /March 10, 2026/ })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 11));
    expect(screen.queryByRole('dialog')).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(field).toHaveFocus();
  });

  it('Escape closes without choosing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputDate label="Start" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Start/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
