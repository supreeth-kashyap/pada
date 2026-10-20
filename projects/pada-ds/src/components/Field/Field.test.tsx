import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Field } from '.';

describe('Field', () => {
  it('wires label, description, error, invalid and required onto the control', async () => {
    const { rerender } = render(
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>We never share it.</Field.Description>
        <Field.Error>Enter a valid email</Field.Error>
      </Field.Root>,
    );
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('We never share it.');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(await axeViolations()).toEqual([]);

    rerender(
      <Field.Root required invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>We never share it.</Field.Description>
        <Field.Error>Enter a valid email</Field.Error>
      </Field.Root>,
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
  });

  it('wires any control with asChild', () => {
    render(
      <Field.Root disabled>
        <Field.Label>Bio</Field.Label>
        <Field.Control asChild>
          <textarea />
        </Field.Control>
      </Field.Root>,
    );
    expect(screen.getByRole('textbox', { name: /Bio/ })).toBeDisabled();
  });
});
