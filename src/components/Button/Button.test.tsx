import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('defaults to type="button" and exposes size and variant attributes', () => {
    render(
      <form>
        <Button size="sm" variant="secondary">
          Save
        </Button>
      </form>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveClass('button', 'button--secondary');
  });

  it('loading keeps focus and width, announces busy, and ignores clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    button.focus();
    rerender(
      <Button onClick={onClick} loading>
        Save
      </Button>,
    );
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    expect(button.querySelector('.button-spinner')).not.toBeNull();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('still submits forms when asked to', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });
});
