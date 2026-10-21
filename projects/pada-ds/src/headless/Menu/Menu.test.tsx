import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { DropdownMenu } from '.';

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 10)));

function Example({ onRename = () => {}, onArchive = () => {} }: { onRename?: () => void; onArchive?: () => void }) {
  const [pinned, setPinned] = useState(false);
  const [sort, setSort] = useState('name');
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onRename}>Rename</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Duplicate</DropdownMenu.Item>
          <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
            <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator>Pinned
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup value={sort} onValueChange={setSort} aria-label="Sort by">
            <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="date">Date</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item onSelect={onArchive}>Archive</DropdownMenu.Item>
                <DropdownMenu.Item>Trash</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  it('opens from the keyboard onto the first item, labelled by its trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    trigger.focus();
    await user.keyboard('{Enter}');
    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveAttribute('data-highlighted');
    expect(menu).toHaveAttribute('data-state', 'open');
    expect(await axeViolations()).toEqual([]);
  });

  it('ArrowUp on the trigger opens onto the last item', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Move to' })).toHaveFocus();
  });

  it('moves with arrows, skips disabled items, wraps, and supports Home/End and type-ahead', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitemcheckbox', { name: /Pinned/ })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Move to' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Move to' })).toHaveFocus();
    await user.keyboard('d');
    expect(screen.getByRole('menuitemradio', { name: 'Date' })).toHaveFocus();
  });

  it('selecting an item calls onSelect, closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<Example onRename={onRename} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}{Enter}');
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    await tick();
    expect(trigger).toHaveFocus();
  });

  it('checkbox and radio items report state with aria-checked', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /Pinned/ }));
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemcheckbox', { name: /Pinned/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('menuitemradio', { name: 'Date' }));
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemradio', { name: 'Date' })).toHaveAttribute('aria-checked', 'true');
  });

  it('opens a submenu with ArrowRight and closes it with ArrowLeft, back on its trigger', async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    render(<Example onArchive={onArchive} />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    const subTrigger = screen.getByRole('menuitem', { name: 'Move to' });
    await user.keyboard('{ArrowRight}');
    expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.queryByRole('menuitem', { name: 'Archive' })).toBeNull();
    await tick();
    expect(subTrigger).toHaveFocus();

    await user.keyboard('{Enter}{Enter}');
    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Escape closes only the submenu, then the menu', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}{ArrowRight}');
    expect(screen.getAllByRole('menu')).toHaveLength(2);
    await user.keyboard('{Escape}');
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    await tick();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Tab closes the menu', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('a click toggles the menu without highlighting an item', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    expect(screen.getByRole('menu')).toHaveFocus();
    await user.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
