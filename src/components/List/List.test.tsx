import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { List, ListItem } from '.';

const texts = () => screen.getAllByRole('listitem').map((item) => item.querySelector('.list-item__content')?.textContent);

function Example({ onReorder }: { onReorder?: (order: string[]) => void }) {
  const [, setRenders] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setRenders((count) => count + 1)}>
        Re-render
      </button>
      <List draggable label="Tasks" onReorder={onReorder}>
        <ListItem id="a">Alpha</ListItem>
        <ListItem id="b">Bravo</ListItem>
        <ListItem id="c">Charlie</ListItem>
      </List>
    </>
  );
}

describe('List', () => {
  it('is a labelled list with a named handle per item', async () => {
    render(<Example />);
    expect(screen.getByRole('list', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Bravo' })).toHaveAttribute('aria-pressed', 'false');
    expect(await axeViolations()).toEqual([]);
  });

  it('reorders with the keyboard: Space lifts, arrows move, Space drops, and it announces each step', async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(<Example onReorder={onReorder} />);
    const handle = screen.getByRole('button', { name: 'Move Alpha' });
    handle.focus();
    await user.keyboard(' ');
    expect(handle).toHaveAttribute('aria-pressed', 'true');
    expect(document.body).toHaveTextContent('Alpha lifted, position 1 of 3.');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(texts()).toEqual(['Bravo', 'Charlie', 'Alpha']);
    expect(onReorder).toHaveBeenLastCalledWith(['b', 'c', 'a']);
    expect(screen.getByRole('button', { name: 'Move Alpha' })).toHaveFocus();
    expect(document.body).toHaveTextContent('Alpha moved to position 3 of 3.');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Move Alpha' })).toHaveAttribute('aria-pressed', 'false');
    expect(document.body).toHaveTextContent('Alpha dropped at position 3 of 3.');

    // The user's order survives a parent re-render.
    await user.click(screen.getByRole('button', { name: 'Re-render' }));
    expect(texts()).toEqual(['Bravo', 'Charlie', 'Alpha']);
  });

  it('Escape puts a lifted item back', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('button', { name: 'Move Charlie' }).focus();
    await user.keyboard(' {ArrowUp}{ArrowUp}');
    expect(texts()).toEqual(['Charlie', 'Alpha', 'Bravo']);
    await user.keyboard('{Escape}');
    expect(texts()).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(document.body).toHaveTextContent('Reordering cancelled. Charlie returned to position 3 of 3.');
  });
});
