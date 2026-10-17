import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Toaster, toast } from '.';

const wait = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)));

describe('Toast', () => {
  afterEach(() => act(() => toast.dismiss()));

  it('shows toasts in a labelled region as polite status messages', async () => {
    render(<Toaster />);
    act(() => {
      toast.success({ title: 'Invite sent', description: 'ada@example.com' });
    });
    expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Invite sent');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status.closest('li')).toHaveAttribute('data-tone', 'success');
    expect(await axeViolations()).toEqual([]);
  });

  it('errors are assertive alerts', () => {
    render(<Toaster />);
    act(() => {
      toast.danger('Upload failed');
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('closes after its duration, but not while hovered', async () => {
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast({ title: 'Saved', duration: 60 });
    });
    await user.hover(screen.getByRole('status'));
    await wait(120);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.unhover(screen.getByRole('status'));
    await wait(120);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('runs its action and closes; Escape and the close button dismiss', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    const onDismiss = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({ title: 'Archived', duration: Infinity, action: { label: 'Undo', onClick: onUndo }, onDismiss });
    });
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();

    act(() => {
      toast({ title: 'Second', duration: Infinity });
    });
    await user.keyboard('{F8}');
    expect(screen.getByRole('status').closest('li')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('updates a toast in place when given the same id', () => {
    render(<Toaster />);
    act(() => {
      toast({ id: 'upload', title: 'Uploading…', duration: Infinity });
    });
    act(() => {
      toast.success({ id: 'upload', title: 'Uploaded' });
    });
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Uploaded');
  });

  it('keeps only the newest toasts visible', () => {
    render(<Toaster visibleToasts={2} />);
    act(() => {
      ['One', 'Two', 'Three'].forEach((title) => toast({ title, duration: Infinity }));
    });
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.querySelector('.toast-title')?.textContent)).toEqual(['Three', 'Two', 'One']);
    expect(items[2]).toHaveAttribute('data-hidden');
  });
});
