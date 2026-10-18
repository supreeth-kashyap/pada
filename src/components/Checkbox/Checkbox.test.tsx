import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('keeps the label wired to a consumer id', () => {
    render(<Checkbox id="terms" label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveAttribute('id', 'terms');
  });

  it('supports the indeterminate (mixed) state', () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    rerender(<Checkbox label="Select all" checked onChange={() => {}} />);
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox).toBeChecked();
  });
});
