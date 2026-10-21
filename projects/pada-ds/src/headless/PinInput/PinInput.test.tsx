import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { PinInput } from '../../components/PinInput';

const boxes = () => screen.getAllByRole('textbox');

describe('PinInput', () => {
  it('is a labelled group of named boxes; the first accepts one-time codes', async () => {
    render(<PinInput label="Verification code" length={6} groupSize={3} description="Sent to •••• 4821" />);
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(group).toHaveAccessibleDescription('Sent to •••• 4821');
    expect(boxes()).toHaveLength(6);
    expect(boxes()[0]).toHaveAccessibleName('Character 1 of 6');
    expect(boxes()[0]).toHaveAttribute('autocomplete', 'one-time-code');
    expect(boxes()[1]).toHaveAttribute('autocomplete', 'off');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves forward as you type, back with Backspace, and completes', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<PinInput label="PIN" length={4} onComplete={onComplete} />);
    await user.click(boxes()[0]);
    await user.keyboard('1a2');
    expect(boxes().map((box) => (box as HTMLInputElement).value)).toEqual(['1', '2', '', '']);
    expect(boxes()[2]).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(boxes()[1]).toHaveFocus();
    expect(boxes()[1]).toHaveValue('');
    await user.keyboard('789');
    expect(onComplete).toHaveBeenCalledWith('1789');
  });

  it('pasting a code fills every box', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <form data-testid="form">
        <PinInput label="Code" length={6} name="code" onComplete={onComplete} />
      </form>,
    );
    await user.click(boxes()[2]);
    await user.paste('482 913');
    expect(onComplete).toHaveBeenCalledWith('482913');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('code')).toBe('482913');
  });
});
