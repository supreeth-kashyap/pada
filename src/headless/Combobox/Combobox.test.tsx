import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Combobox } from '.';

const fruit = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];

function Example({ multiple, onValueChange }: { multiple?: boolean; onValueChange?: (value: unknown) => void }) {
  return (
    <Combobox.Root multiple={multiple as true} onValueChange={onValueChange as (value: string[]) => void}>
      <label htmlFor="fruit">Fruit</label>
      <Combobox.Anchor>
        <Combobox.Input id="fruit" />
        <Combobox.Trigger>▾</Combobox.Trigger>
      </Combobox.Anchor>
      <Combobox.Portal>
        <Combobox.Content aria-label="Fruit">
          {fruit.map((name) => (
            <Combobox.Item key={name} value={name.toLowerCase()} disabled={name === 'Banana'}>
              {name}
            </Combobox.Item>
          ))}
          <Combobox.Empty>No fruit found</Combobox.Empty>
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

describe('Combobox', () => {
  it('filters as you type and highlights the first match', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await user.type(input, 'ap');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Apple', 'Apricot']);
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id);
    expect(options[0]).toHaveAttribute('data-highlighted');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves with arrows (skipping disabled), selects with Enter and fills the input', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Escape}');
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Blueberry' }).id);
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('blueberry');
    expect(input).toHaveValue('Blueberry');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the empty state, and Escape closes then clears', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'zz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No fruit found')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveValue('zz');
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('selects with a click without losing focus; multiple keeps the list open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example multiple onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(screen.getByRole('button', { name: 'Show suggestions' }));
    expect(input).toHaveFocus();
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(screen.getByRole('option', { name: 'Apple' }));
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });
});
