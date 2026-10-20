import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Popover } from './Popover';

function Legacy() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} title="Share" trigger={<button type="button">Share</button>} variant="active">
      Anyone with the link can view.
    </Popover>
  );
}

describe('Popover', () => {
  it('keeps the 1.x API: trigger, title, active variant and close button', async () => {
    const user = userEvent.setup();
    render(<Legacy />);
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(trigger);
    const popover = screen.getByRole('dialog', { name: 'Share' });
    expect(popover).toHaveAttribute('data-variant', 'active');
    expect(popover).toHaveTextContent('Anyone with the link can view.');
    expect(await axeViolations()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('composes with parts, labelled by Popover.Title', async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Filters</Popover.Trigger>
        <Popover.Content side="right">
          <Popover.Title>Filter results</Popover.Title>
          <Popover.CloseButton />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const popover = screen.getByRole('dialog', { name: 'Filter results' });
    expect(popover).toHaveClass('popover');
    expect(popover).toHaveAttribute('data-variant', 'default');
    expect(popover.querySelector('.popover-arrow')).not.toBeNull();
  });
});
