import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { PasswordInput, estimatePasswordStrength } from '.';

describe('PasswordInput', () => {
  it('toggles visibility with a pressed button', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" />);
    const input = screen.getByLabelText(/^Password/);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(input).toHaveAttribute('type', 'text');
    expect(await axeViolations()).toEqual([]);
  });

  it('meters the strength as you type', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="New password" autoComplete="new-password" strength />);
    const meter = screen.getByRole('meter', { name: 'Password strength' });
    expect(meter).toHaveAttribute('aria-valuenow', '0');
    await user.type(screen.getByLabelText(/^New password/), 'correct-Horse-7');
    expect(meter).toHaveAttribute('aria-valuetext', 'Strong');
    expect(await axeViolations()).toEqual([]);
  });

  it('estimates strength', () => {
    expect(estimatePasswordStrength('')).toBe(0);
    expect(estimatePasswordStrength('abc')).toBe(0);
    expect(estimatePasswordStrength('abcdefgh')).toBe(1);
    expect(estimatePasswordStrength('abcdefgh1')).toBe(2);
    expect(estimatePasswordStrength('Abcdefgh12!x')).toBe(4);
  });
});
