import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Calendar, type CalendarRootProps } from '.';
import { addMonths, getMonthGrid } from './dates';

function Example(props: CalendarRootProps) {
  return (
    <Calendar.Root locale="en-US" {...props}>
      <Calendar.PrevButton>‹</Calendar.PrevButton>
      <Calendar.Heading />
      <Calendar.NextButton>›</Calendar.NextButton>
      <Calendar.Grid />
    </Calendar.Root>
  );
}

const day = (name: string) => screen.getByRole('button', { name });

describe('Calendar', () => {
  it('is a grid labelled by the month, with one focusable day', async () => {
    render(<Example defaultValue={new Date(2026, 2, 10)} />);
    const grid = screen.getByRole('grid', { name: 'March 2026' });
    expect(within(grid).getAllByRole('columnheader')[0]).toHaveAttribute('abbr', 'Sunday');
    const selected = day('Tuesday, March 10, 2026');
    expect(selected).toHaveAttribute('tabindex', '0');
    expect(selected.closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(within(grid).getAllByRole('button').filter((button) => button.tabIndex === 0)).toHaveLength(1);
    expect(await axeViolations()).toEqual([]);
  });

  it('moves by day, week and month with the keyboard and selects with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example defaultValue={new Date(2026, 2, 31)} onValueChange={onValueChange} />);
    day('Tuesday, March 31, 2026').focus();
    await user.keyboard('{ArrowRight}');
    // Crossing into April shows April and keeps focus on the new day.
    expect(screen.getByRole('grid', { name: 'April 2026' })).toBeInTheDocument();
    expect(day('Wednesday, April 1, 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day('Wednesday, April 8, 2026')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day('Sunday, April 5, 2026')).toHaveFocus();
    await user.keyboard('{End}');
    expect(day('Saturday, April 11, 2026')).toHaveFocus();
    await user.keyboard('{PageDown}');
    expect(day('Monday, May 11, 2026')).toHaveFocus();
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(day('Sunday, May 11, 2025')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2025, 4, 11));
  });

  it('respects min, max and unavailable days', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Example
        defaultMonth={new Date(2026, 2, 1)}
        min={new Date(2026, 2, 5)}
        max={new Date(2026, 2, 20)}
        isDateUnavailable={(date) => date.getDay() === 0}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    await user.click(day('Wednesday, March 4, 2026'));
    await user.click(day('Sunday, March 8, 2026'));
    expect(day('Sunday, March 8, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(day('Monday, March 9, 2026'));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 2, 9));
  });

  it('range: two clicks pick the ends in order, with a preview in between', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example mode="range" defaultMonth={new Date(2026, 2, 1)} onValueChange={onValueChange} />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(day('Friday, March 20, 2026'));
    expect(onValueChange).toHaveBeenLastCalledWith([new Date(2026, 2, 20)]);
    await user.hover(day('Monday, March 16, 2026'));
    expect(day('Wednesday, March 18, 2026')).toHaveAttribute('data-in-range');
    await user.click(day('Monday, March 16, 2026'));
    expect(onValueChange).toHaveBeenLastCalledWith([new Date(2026, 2, 16), new Date(2026, 2, 20)]);
    expect(day('Monday, March 16, 2026')).toHaveAttribute('data-range-start');
    expect(day('Friday, March 20, 2026')).toHaveAttribute('data-range-end');
  });

  it('date helpers', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    const grid = getMonthGrid(new Date(2026, 2, 1), 1);
    expect(grid).toHaveLength(6);
    expect(grid[0][0]).toEqual(new Date(2026, 1, 23));
  });
});
