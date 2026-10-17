import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Modal } from './Modal';

describe('Modal (1.x API on Dialog)', () => {
  it('labels the dialog with its title heading', async () => {
    render(
      <Modal open onOpenChange={() => {}} title="Delete project">
        Body
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Delete project' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('tabindex', '-1');
    expect(dialog).toHaveAttribute('data-size', 'auto');
    expect(screen.getByRole('heading', { level: 2, name: 'Delete project' }).id).toBe(dialog.getAttribute('aria-labelledby'));
    expect(await axeViolations()).toEqual([]);
  });

  it('has no dangling aria-labelledby without a title, and renders nothing when closed', () => {
    const { rerender } = render(
      <Modal open onOpenChange={() => {}}>
        Body
      </Modal>,
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    rerender(
      <Modal open={false} onOpenChange={() => {}}>
        Body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes from its close button and from Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Settings">
        Body
      </Modal>,
    );
    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('maps width and height to the dialog size tokens', () => {
    render(
      <Modal open onOpenChange={() => {}} title="Sized" width={480} height="50vh">
        Body
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.style.getPropertyValue('--pada-dialog-width')).toBe('480px');
    expect(dialog.style.getPropertyValue('--pada-dialog-height')).toBe('50vh');
  });
});
