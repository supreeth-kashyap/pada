import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Calendar } from '.';

// Two months side by side: one root, one heading and one grid per month (`monthOffset`).
function TwoMonths({ max, onValueChange }: { max?: Date; onValueChange?: (value: unknown) => void }) {
  return (
    <Calendar.Root
      locale="en-US"
      mode="range"
      numberOfMonths={2}
      today={new Date(2026, 2, 2)}
      defaultMonth={new Date(2026, 2, 1)}
      max={max}
      onValueChange={onValueChange}
    >
      <Calendar.PrevButton>‹</Calendar.PrevButton>
      <Calendar.NextButton>›</Calendar.NextButton>
      {[0, 1].map((offset) => (
        <div key={offset}>
          <Calendar.Heading monthOffset={offset} />
          <Calendar.Grid monthOffset={offset} hideOutsideDays />
        </div>
      ))}
    </Calendar.Root>
  );
}

const day = (name: string) => screen.getByRole('button', { name });

describe('Calendar with several months', () => {
  it('labels each grid by its own month, with one tab stop across both', async () => {
    render(<TwoMonths />);
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'April 2026' })).toBeInTheDocument();
    const tabStops = screen.getAllByRole('button').filter((button) => button.getAttribute('tabindex') === '0');
    expect(tabStops).toEqual([day('Monday, March 2, 2026')]);
    expect(day('Monday, March 2, 2026')).toHaveAttribute('data-today');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves focus from one grid into the next and only scrolls past the last month', async () => {
    const user = userEvent.setup();
    render(<TwoMonths />);
    await user.click(day('Tuesday, March 31, 2026'));
    await user.keyboard('{ArrowRight}');
    // April is already shown: focus crosses grids, the months stay.
    expect(day('Wednesday, April 1, 2026')).toHaveFocus();
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument();
    await user.keyboard('{PageDown}');
    expect(day('Friday, May 1, 2026')).toHaveFocus();
    expect(screen.getByRole('grid', { name: 'April 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'May 2026' })).toBeInTheDocument();
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(day('Thursday, May 1, 2025')).toHaveFocus();
    expect(screen.getByRole('grid', { name: 'May 2025' })).toBeInTheDocument();
  });

  it('picks a range across the two months, previewing it on hover', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TwoMonths onValueChange={onValueChange} />);
    await user.click(day('Friday, March 27, 2026'));
    await user.hover(day('Friday, April 3, 2026'));
    expect(day('Tuesday, March 31, 2026')).toHaveAttribute('data-in-range');
    expect(day('Wednesday, April 1, 2026')).toHaveAttribute('data-in-range');
    await user.click(day('Friday, April 3, 2026'));
    expect(onValueChange).toHaveBeenLastCalledWith([new Date(2026, 2, 27), new Date(2026, 3, 3)]);
    expect(day('Friday, March 27, 2026')).toHaveAttribute('data-range-start');
    expect(day('Friday, April 3, 2026')).toHaveAttribute('data-range-end');
  });

  it('blocks Next once the last month shown reaches max', () => {
    render(<TwoMonths max={new Date(2026, 3, 20)} />);
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });
});
