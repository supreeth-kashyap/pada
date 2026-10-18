import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Menubar } from '.';

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 10)));

function Example({ onNew = () => {}, onValueChange }: { onNew?: () => void; onValueChange?: (value: string) => void }) {
  return (
    <Menubar.Root aria-label="Editor" onValueChange={onValueChange}>
      <Menubar.Menu value="file">
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item shortcut="⌘N" onSelect={onNew}>
            New file
          </Menubar.Item>
          <Menubar.Item>Open…</Menubar.Item>
          <Menubar.Sub>
            <Menubar.SubTrigger>Open recent</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item>notes.md</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.Sub>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu value="edit">
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Undo</Menubar.Item>
          <Menubar.Item>Redo</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu value="view">
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.CheckboxItem checked>Word wrap</Menubar.CheckboxItem>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

describe('Menubar', () => {
  it('is a labelled menubar with one Tab stop', async () => {
    render(<Example />);
    const bar = screen.getByRole('menubar', { name: 'Editor' });
    expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    const [file, edit, view] = screen.getAllByRole('menuitem');
    expect(file).toHaveAttribute('tabindex', '0');
    expect(edit).toHaveAttribute('tabindex', '-1');
    expect(view).toHaveAttribute('aria-haspopup', 'menu');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves along the bar with the arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('tabindex', '0');
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
  });

  it('opens a menu on ArrowDown, and Escape returns to its trigger', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await tick();
    expect(onValueChange).toHaveBeenLastCalledWith('file');
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{Escape}');
    await tick();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
  });

  it('moves between open menus with ArrowRight and ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{Enter}');
    await tick();
    await user.keyboard('{ArrowRight}');
    await tick();
    expect(screen.getByRole('menu', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();
    expect(screen.queryByRole('menu', { name: 'File' })).toBeNull();
    await user.keyboard('{ArrowLeft}');
    await tick();
    expect(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    await tick();
    // Wraps round to the last menu.
    expect(screen.getByRole('menuitemcheckbox', { name: 'Word wrap' })).toHaveFocus();
  });

  it('opens a submenu with ArrowRight on its trigger instead of the next menu', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{ArrowUp}');
    await tick();
    expect(screen.getByRole('menuitem', { name: 'Open recent' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await tick();
    expect(screen.getByRole('menuitem', { name: 'notes.md' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    await tick();
    expect(screen.getByRole('menuitem', { name: 'Open recent' })).toHaveFocus();
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
  });

  it('switches menus on hover once one is open, and closes after a choice', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<Example onNew={onNew} />);
    await user.click(screen.getByRole('menuitem', { name: 'File' }));
    await tick();
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    fireEvent.pointerEnter(screen.getByRole('menuitem', { name: 'View' }));
    await tick();
    expect(screen.getByRole('menu', { name: 'View' })).toBeInTheDocument();
    expect(screen.queryByRole('menu', { name: 'File' })).toBeNull();
    fireEvent.pointerEnter(screen.getByRole('menuitem', { name: 'File' }));
    await tick();
    await user.click(screen.getByRole('menuitem', { name: /New file/ }));
    await tick();
    expect(onNew).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
