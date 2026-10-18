import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { ContextMenu } from '.';

function Example({ onRename }: { onRename?: () => void }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger tabIndex={0} aria-label="Report.pdf">
        Report.pdf
      </ContextMenu.Trigger>
      <ContextMenu.Content aria-label="File actions">
        <ContextMenu.Item onSelect={onRename}>Rename</ContextMenu.Item>
        <ContextMenu.Item>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item tone="danger">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

describe('ContextMenu', () => {
  it('opens at the pointer on right-click with focus on the first item', async () => {
    render(<Example />);
    const area = screen.getByText('Report.pdf');
    const event = fireEvent.contextMenu(area, { clientX: 120, clientY: 80 });
    expect(event).toBe(false); // the browser menu is suppressed
    const menu = screen.getByRole('menu', { name: 'File actions' });
    expect(menu).not.toHaveAttribute('aria-labelledby');
    expect(area).toHaveAttribute('data-state', 'open');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
  });

  it('works from the keyboard and runs the chosen item', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<Example onRename={onRename} />);
    const area = screen.getByText('Report.pdf');
    area.focus();
    // Shift+F10 fires a contextmenu event with no pointer position.
    fireEvent.contextMenu(area, { clientX: 0, clientY: 0 });
    await user.keyboard('{Enter}');
    expect(onRename).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('can be disabled to keep the browser menu', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger disabled>Area</ContextMenu.Trigger>
        <ContextMenu.Content aria-label="Actions">
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(fireEvent.contextMenu(screen.getByText('Area'))).toBe(true);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
