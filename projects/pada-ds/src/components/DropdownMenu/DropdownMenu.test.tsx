import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button';
import { DropdownMenu } from '.';

function Example({ onDelete }: { onDelete: () => void }) {
  const [pinned, setPinned] = useState(true);
  const [view, setView] = useState('list');
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Item</DropdownMenu.Label>
        <DropdownMenu.Item icon="edit_1" shortcut="⌘E">
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pinned
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.RadioGroup value={view} onValueChange={setView} aria-label="View">
          <DropdownMenu.RadioItem value="list">List</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="grid">Grid</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger" onSelect={onDelete}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu (styled)', () => {
  it('renders styled items with indicators, shortcuts and tones', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(menu).toHaveClass('menu');
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveTextContent('⌘E');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-tone', 'danger');
    expect(await axeViolations()).toEqual([]);

    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
