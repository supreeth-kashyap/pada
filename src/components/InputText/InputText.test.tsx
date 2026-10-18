import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InputTextArea } from '../InputTextArea';
import { InputText } from './InputText';

describe('InputText and InputTextArea', () => {
  it('keep the label and messages wired when the consumer passes an id', () => {
    render(
      <>
        <InputText id="email" label="Email" error="Enter a valid email" aria-describedby="email-hint" />
        <span id="email-hint">We never share it.</span>
        <InputTextArea id="bio" label="Bio" description="A sentence or two." />
      </>,
    );
    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(email).toHaveAttribute('id', 'email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('We never share it. Enter a valid email');
    const bio = screen.getByRole('textbox', { name: 'Bio' });
    expect(bio).toHaveAttribute('id', 'bio');
    expect(bio).toHaveAccessibleDescription('A sentence or two.');
  });
});
