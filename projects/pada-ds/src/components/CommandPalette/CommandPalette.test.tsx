import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { CommandPalette, type Command } from './CommandPalette';
import { commandScore } from './commandScore';

describe('commandScore', () => {
  it('ranks exact > prefix > word start > substring > fuzzy > none', () => {
    const scores = [
      commandScore('Settings', 'settings'),
      commandScore('Settings', 'set'),
      commandScore('Open settings', 'set'),
      commandScore('Reset theme', 'set'),
      commandScore('Sort entries', 'stn'),
      commandScore('Help', 'xyz'),
    ];
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
    expect(scores[5]).toBe(0);
  });
});

const wait = () => act(() => new Promise((resolve) => setTimeout(resolve, 10)));

function makeCommands(onSelect: (id: string) => void): Command[] {
  return [
    { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: () => onSelect('new') },
    { id: 'archive', label: 'Archive project', group: 'Projects', onSelect: () => onSelect('archive') },
    { id: 'prefs', label: 'Preferences', group: 'Settings', keywords: ['settings', 'options'], onSelect: () => onSelect('prefs') },
    { id: 'theme', label: 'Toggle theme', group: 'Settings', disabled: true, onSelect: () => onSelect('theme') },
  ];
}

describe('CommandPalette', () => {
  it('opens with Ctrl+K, filters by label and keywords, and runs with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CommandPalette commands={makeCommands(onSelect)} />);
    await user.keyboard('{Control>}k{/Control}');
    const dialog = screen.getByRole('dialog', { name: 'Command palette' });
    const input = screen.getByRole('combobox', { name: 'Command palette' });
    expect(dialog).toContainElement(input);
    expect(input).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Projects' })).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);

    await user.type(input, 'settings');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Preferences']);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Preferences' }).id);
    await user.keyboard('{Enter}');
    await wait();
    expect(onSelect).toHaveBeenCalledWith('prefs');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('moves with arrows past disabled commands and shows the empty state', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CommandPalette commands={makeCommands(onSelect)} open onOpenChange={() => {}} />);
    const input = screen.getByRole('combobox');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /New project/ }).id);
    await user.type(input, 'zzzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});
