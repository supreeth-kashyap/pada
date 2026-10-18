import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Notification } from './Notification';

describe('Notification', () => {
  it('is a polite live region with a real dismiss button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Notification open onOpenChange={onOpenChange} title="Saved" subtitle="All changes are stored." />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
