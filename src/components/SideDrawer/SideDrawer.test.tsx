import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SideDrawer } from './SideDrawer';

describe('SideDrawer (1.x API on Drawer)', () => {
  it('is a modal dialog that traps focus and closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <SideDrawer open onOpenChange={onOpenChange} size="lg" aria-label="Details">
        <button type="button">First</button>
        <button type="button">Last</button>
      </SideDrawer>,
    );
    const drawer = screen.getByRole('dialog', { name: 'Details' });
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('data-side', 'right');
    expect(drawer).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
