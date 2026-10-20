import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { TimeField, stepValue, type TimeFieldRootProps } from '.';

const spin = (name: string) => screen.getByRole('spinbutton', { name });

/** A controlled field that records every value it reports. */
function setup(props: Partial<TimeFieldRootProps> & { initial?: string | null } = {}) {
  const { initial = null, ...rest } = props;
  const onValueChange = vi.fn();
  let current: string | null = initial;
  let setExternal: (value: string | null) => void = () => {};
  function Host() {
    const [value, setValue] = useState<string | null>(initial);
    setExternal = setValue;
    return (
      <TimeField.Root
        aria-label="Start time"
        value={value}
        onValueChange={(next) => {
          current = next;
          setValue(next);
          onValueChange(next);
        }}
        {...rest}
      />
    );
  }
  const result = render(<Host />);
  return { ...result, value: () => current, onValueChange, setValue: (value: string | null) => setExternal(value) };
}

describe('TimeField', () => {
  it('lays out spinbuttons in the locale order, 12-hour with AM/PM for en-US', async () => {
    setup({ locale: 'en-US', initial: '13:05' });
    expect(screen.getByRole('group', { name: 'Start time' })).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton').map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'Hours',
      'Minutes',
      'AM/PM',
    ]);
    expect(spin('Hours')).toHaveAttribute('aria-valuenow', '1');
    expect(spin('Hours')).toHaveAttribute('aria-valuemin', '1');
    expect(spin('Hours')).toHaveAttribute('aria-valuemax', '12');
    expect(spin('Minutes')).toHaveTextContent('05');
    expect(spin('AM/PM')).toHaveTextContent('PM');
    expect(spin('AM/PM')).toHaveAttribute('aria-valuetext', 'PM');
    expect(await axeViolations()).toEqual([]);
  });

  it('is 24-hour for en-GB, with seconds when asked', () => {
    setup({ locale: 'en-GB', granularity: 'second', initial: '09:30:15' });
    expect(screen.getAllByRole('spinbutton').map((segment) => segment.textContent)).toEqual(['09', '30', '15']);
    expect(spin('Hours')).toHaveAttribute('aria-valuemax', '23');
  });

  it('steps with the arrows (wrapping), PageUp/PageDown and Home/End', async () => {
    const user = userEvent.setup();
    const { value } = setup({ locale: 'en-GB', minuteStep: 5, initial: '23:57' });
    spin('Hours').focus();
    await user.keyboard('{ArrowUp}');
    expect(value()).toBe('00:57');
    await user.keyboard('{PageUp}');
    expect(value()).toBe('02:57');
    await user.keyboard('{End}');
    expect(value()).toBe('23:57');
    await user.keyboard('{ArrowRight}');
    expect(spin('Minutes')).toHaveFocus();
    // Steps snap to the minute step.
    await user.keyboard('{ArrowDown}');
    expect(value()).toBe('23:55');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(value()).toBe('23:05');
    await user.keyboard('{Home}');
    expect(value()).toBe('23:00');
    await user.keyboard('{ArrowLeft}');
    expect(spin('Hours')).toHaveFocus();
  });

  it('types digits, moving on when a segment is full, and A/P for the period', async () => {
    const user = userEvent.setup();
    const { value, onValueChange } = setup({ locale: 'en-US' });
    expect(spin('Hours')).toHaveAttribute('aria-valuetext', 'Empty');
    spin('Hours').focus();
    await user.keyboard('9');
    // 9 cannot take a second digit on a 12-hour clock.
    expect(spin('Minutes')).toHaveFocus();
    await user.keyboard('45');
    expect(spin('AM/PM')).toHaveFocus();
    // Still incomplete without AM/PM.
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('p');
    expect(value()).toBe('21:45');
    await user.keyboard('a');
    expect(value()).toBe('09:45');
    spin('Hours').focus();
    await user.keyboard('1');
    expect(spin('Hours')).toHaveFocus();
    await user.keyboard('2');
    expect(value()).toBe('00:45');
  });

  it('Backspace empties a segment (the value becomes null), then moves back', async () => {
    const user = userEvent.setup();
    const { value } = setup({ locale: 'en-GB', initial: '08:15' });
    spin('Minutes').focus();
    await user.keyboard('{Backspace}');
    expect(value()).toBeNull();
    expect(spin('Minutes')).toHaveTextContent('––');
    expect(spin('Minutes')).toHaveAttribute('data-placeholder');
    // The half-entered time stays while the value is null.
    expect(spin('Hours')).toHaveTextContent('08');
    await user.keyboard('{Backspace}');
    expect(spin('Hours')).toHaveFocus();
    // "3" cannot start a two-digit hour: it fills Hours and "0" goes on to Minutes.
    await user.keyboard('30');
    expect(value()).toBe('03:00');
  });

  it('marks out-of-range values invalid, follows outside changes, and can be disabled', async () => {
    const user = userEvent.setup();
    const { value, setValue, rerender } = setup({ locale: 'en-GB', min: '08:00', max: '18:00', initial: '07:00' });
    expect(spin('Hours')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('group')).toHaveAttribute('data-invalid');
    spin('Hours').focus();
    await user.keyboard('{ArrowUp}');
    expect(value()).toBe('08:00');
    expect(spin('Hours')).not.toHaveAttribute('aria-invalid');
    act(() => setValue(null));
    expect(spin('Hours')).toHaveTextContent('––');
    rerender(<TimeField.Root aria-label="Start time" locale="en-GB" disabled defaultValue="10:00" />);
    expect(spin('Hours')).toHaveAttribute('aria-disabled', 'true');
    expect(spin('Hours')).not.toHaveAttribute('tabindex');
  });

  it('readOnly segments do not change', async () => {
    const user = userEvent.setup();
    const { value } = setup({ locale: 'en-GB', readOnly: true, initial: '10:00' });
    spin('Hours').focus();
    await user.keyboard('{ArrowUp}5');
    expect(value()).toBe('10:00');
    expect(spin('Hours')).toHaveAttribute('aria-readonly', 'true');
  });

  it('submits the value under a name, and takes custom segments from a render function', () => {
    const { container } = render(
      <form>
        <TimeField.Root aria-label="Alarm" locale="en-GB" name="alarm" defaultValue="06:30">
          {(layout) =>
            layout.map((part, index) =>
              part.type === 'literal' ? (
                <b key={index}>{part.text}</b>
              ) : (
                <TimeField.Segment key={index} type={part.type} className="custom" />
              ),
            )
          }
        </TimeField.Root>
      </form>,
    );
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'alarm');
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('06:30');
    expect(container.querySelectorAll('.custom')).toHaveLength(2);
    expect(container.querySelector('b')).toHaveTextContent(':');
  });

  it('stepValue snaps and wraps', () => {
    expect(stepValue(7, 1, 5, 0, 59)).toBe(10);
    expect(stepValue(7, -1, 5, 0, 59)).toBe(5);
    expect(stepValue(55, 1, 5, 0, 59)).toBe(0);
    expect(stepValue(0, -1, 5, 0, 59)).toBe(55);
    expect(stepValue(null, -1, 1, 1, 12)).toBe(12);
    expect(stepValue(12, 1, 1, 1, 12)).toBe(1);
  });
});
