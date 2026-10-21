import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Autocomplete } from './Autocomplete';

const people = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform' },
  { value: 'alan', label: 'Alan Turing', description: 'Research', disabled: true },
];

describe('Autocomplete', () => {
  it('single: filters, picks with Enter, fills the input and submits with forms', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form data-testid="form">
        <Autocomplete label="Assignee" options={people} name="assignee" onValueChange={onValueChange} description="Who owns this task." />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Assignee' });
    expect(input).toHaveAccessibleDescription('Who owns this task.');
    await user.type(input, 'gra');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('grace');
    expect(input).toHaveValue('Grace Hopper');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('assignee')).toBe('grace');
  });

  it('single: shows the label of a default value', () => {
    render(<Autocomplete label="Assignee" options={people} defaultValue="ada" />);
    expect(screen.getByRole('combobox')).toHaveValue('Ada Lovelace');
  });

  it('multiple: chips, removal buttons and Backspace', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Autocomplete label="Reviewers" options={people} multiple defaultValue={['ada']} onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: 'Remove Ada Lovelace' })).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Reviewers' });
    await user.click(input);
    await user.click(screen.getByRole('option', { name: /Grace Hopper/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(['ada', 'grace']);
    expect(screen.getByRole('button', { name: 'Remove Grace Hopper' })).toBeInTheDocument();
    await user.keyboard('{Escape}{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['ada']);
    await user.click(screen.getByRole('button', { name: 'Remove Ada Lovelace' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('marks errors and shows the empty message', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Assignee" options={people} error="Pick someone" emptyMessage="Nobody matches" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await user.type(input, 'zzz');
    expect(screen.getByText('Nobody matches')).toBeInTheDocument();
  });
});
