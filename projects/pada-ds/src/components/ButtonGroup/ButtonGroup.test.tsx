import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button';
import { ButtonGroup } from '.';

describe('ButtonGroup', () => {
  it('is a named group whose buttons take its size and variant unless they set their own', async () => {
    render(
      <ButtonGroup label="Text alignment" size="sm" variant="secondary" attached>
        <Button>Left</Button>
        <Button>Center</Button>
        <Button variant="primary" size="lg">Right</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Text alignment' });
    expect(group).toHaveAttribute('data-attached');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).not.toHaveAttribute('aria-orientation');
    const left = screen.getByRole('button', { name: 'Left' });
    expect(left).toHaveAttribute('data-size', 'sm');
    expect(left).toHaveAttribute('data-variant', 'secondary');
    expect(left).toHaveClass('button--secondary');
    const right = screen.getByRole('button', { name: 'Right' });
    expect(right).toHaveAttribute('data-size', 'lg');
    expect(right).toHaveAttribute('data-variant', 'primary');
    expect(await axeViolations()).toEqual([]);
  });

  it('keeps one tab stop per button and supports a vertical layout', async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup label="Actions" orientation="vertical">
        <Button>Copy</Button>
        <Button>Paste</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Actions' });
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(group).not.toHaveAttribute('data-attached');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Paste' })).toHaveFocus();
  });

  it('leaves buttons outside a group on their defaults', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('data-variant', 'primary');
  });
});
