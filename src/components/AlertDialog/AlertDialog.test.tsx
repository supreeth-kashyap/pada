import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button';
import { AlertDialog } from '.';

describe('AlertDialog', () => {
  it('is an alertdialog that focuses Cancel and ignores outside clicks', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant="destructive">Delete project</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete this project?</AlertDialog.Title>
            <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action variant="destructive" onClick={onDelete}>
              Delete
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete this project?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);

    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    await user.click(document.querySelector('.dialog-overlay') as Element);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });
});
