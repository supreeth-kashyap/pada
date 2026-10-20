import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { NumberInput, createNumberFormatter, type NumberInputRootProps } from '.';
import { roundToPrecision } from './numberFormat';

function Example(props: NumberInputRootProps) {
  return (
    <NumberInput.Root {...props}>
      <NumberInput.Decrement />
      <NumberInput.Input aria-label="Quantity" />
      <NumberInput.Increment />
    </NumberInput.Root>
  );
}

describe('NumberInput', () => {
  afterEach(() => vi.useRealTimers());

  it('is a spinbutton with its value and limits', async () => {
    render(<Example defaultValue={3} min={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('aria-valuenow', '3');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute('tabindex', '-1');
    expect(await axeViolations()).toEqual([]);
  });

  it('steps with the keyboard and stays within the limits', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example defaultValue={0.1} step={0.1} min={0} max={1} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    input.focus();
    await user.keyboard('{ArrowUp}');
    // 0.1 + 0.1 without floating-point noise.
    expect(onValueChange).toHaveBeenLastCalledWith(0.2);
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(0.3);
    await user.keyboard('{PageUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-valuenow', '0');
  });

  it('commits typed text on Enter and blur, parsed in the locale and clamped', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example locale="de-DE" max={5000} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    await user.type(input, '1.234,5{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(1234.5);
    expect(input).toHaveValue('1.234,5');
    await user.clear(input);
    await user.type(input, '99999');
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(5000);
    await user.clear(input);
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('steppers step once on press and repeat while held', () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Example defaultValue={0} onValueChange={onValueChange} />);
    const increase = screen.getByRole('button', { name: 'Increase' });
    fireEvent.pointerDown(increase, { button: 0 });
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('spinbutton')).toHaveFocus();
    act(() => vi.advanceTimersByTime(400 + 60 * 2));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    fireEvent.pointerUp(increase);
    act(() => vi.advanceTimersByTime(1000));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it('formats currency and percent, and parses them back', () => {
    const euro = createNumberFormatter('en-US', { style: 'currency', currency: 'EUR' });
    expect(euro.format(1234.5)).toBe('€1,234.50');
    expect(euro.parse('€1,234.50')).toBe(1234.5);
    expect(euro.parse('-€3')).toBe(-3);
    const percent = createNumberFormatter('en-US', { style: 'percent' });
    expect(percent.parse('25%')).toBe(0.25);
    expect(percent.parse('abc')).toBeNull();
    expect(roundToPrecision(0.1 + 0.2, 0.1)).toBe(0.3);
    expect(roundToPrecision(3.14159, 1)).toBe(3.14159);
  });
});
