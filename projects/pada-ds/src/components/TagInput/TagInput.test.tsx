import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { TagInput } from '.';

const tags = () => within(screen.getByRole('list')).getAllByRole('listitem').map((item) => item.textContent);

describe('TagInput', () => {
  it('adds tags with Enter and commas, and announces them', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagInput label="Keywords" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: /Keywords/ });
    await user.type(input, 'tokens{Enter}motion,');
    expect(tags()).toEqual(['tokens', 'motion']);
    expect(onValueChange).toHaveBeenLastCalledWith(['tokens', 'motion']);
    expect(document.body).toHaveTextContent('Added motion. 2 tags.');
    expect(screen.getByRole('list', { name: 'Keywords: 2 tags' })).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
  });

  it('pastes lists, rejects duplicates and invalid tags with a message', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Emails" defaultValue={['ada@example.com']} validate={(tag) => (tag.includes('@') ? null : `${tag} is not an email.`)} />);
    const input = screen.getByRole('textbox', { name: /Emails/ });
    await user.click(input);
    await user.paste('grace@example.com, ADA@example.com\nalan');
    expect(tags()).toEqual(['ada@example.com', 'grace@example.com']);
    expect(screen.getByRole('alert')).toHaveTextContent('"ADA@example.com" is already added.');
    expect(input).toHaveValue('ADA@example.com, alan');
  });

  it('Backspace moves to the last tag and removes it; arrows move between tags', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Labels" defaultValue={['a', 'b', 'c']} />);
    await user.click(screen.getByRole('textbox', { name: /Labels/ }));
    await user.keyboard('{Backspace}');
    expect(screen.getByRole('button', { name: 'Remove c' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'Remove b' })).toHaveFocus();
    await user.keyboard('{Delete}');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(tags()).toEqual(['a', 'c']);
    expect(screen.getByRole('button', { name: 'Remove c' })).toHaveFocus();
  });

  it('stops at maxTags', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Top 2" maxTags={2} defaultValue={['x']} />);
    await user.type(screen.getByRole('textbox', { name: /Top 2/ }), 'y{Enter}');
    expect(tags()).toEqual(['x', 'y']);
    expect(screen.getByRole('textbox', { name: /Top 2/ })).toHaveAttribute('readonly');
  });
});
