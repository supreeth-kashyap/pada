import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Filter, FilterChip, MoreFilter } from '.';

const OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited', disabled: true },
  { value: 'suspended', label: 'Suspended' },
];

describe('Filter', () => {
  it('single select: arrow keys move through options, Enter picks one and closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Filter label="Status" options={OPTIONS} onChange={onChange} />);
    const chip = screen.getByRole('button', { name: /Status/ });
    expect(chip).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(chip);
    const listbox = screen.getByRole('listbox', { name: 'Status' });
    expect(screen.getByRole('dialog', { name: 'Status' })).toContainElement(listbox);
    expect(screen.getByRole('option', { name: 'Active' })).toHaveFocus();
    // One tab stop: the other options are out of the tab order.
    expect(screen.getByRole('option', { name: 'Suspended' })).toHaveAttribute('tabindex', '-1');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Suspended' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(['suspended'], [OPTIONS[2]]);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(chip).toHaveFocus();
    expect(chip).toHaveTextContent('1 selected');
  });

  it('multi select: stages a draft, Apply commits it, Escape discards it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Filter label="Status" options={OPTIONS} multiSelect onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Status/ }));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(screen.getByRole('option', { name: 'Active' }));
    expect(screen.getByRole('option', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Status/ }));
    expect(screen.getByRole('option', { name: 'Active' })).toHaveAttribute('aria-selected', 'false');
    await user.click(screen.getByRole('option', { name: 'Suspended' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onChange).toHaveBeenCalledWith(['suspended'], [OPTIONS[2]]);
  });
});

describe('MoreFilter', () => {
  it('lists filters as vertical tabs with an option list each, and applies all at once', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MoreFilter
        filters={[
          { id: 'status', label: 'Status', options: OPTIONS },
          { id: 'year', label: 'Joined year', options: [{ value: '2024', label: '2024' }] },
        ]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: /More/ }));
    const status = screen.getByRole('tab', { name: 'Status' });
    expect(status).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    status.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Joined year' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('option', { name: '2024' }));
    expect(screen.getByRole('tab', { name: /Joined year/ })).toHaveTextContent('1 selected');
    expect(await axeViolations()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onChange).toHaveBeenCalledWith({ year: ['2024'] }, 1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('FilterChip', () => {
  it('has separate buttons to edit and to remove the filter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(<FilterChip label="Owner" value="Ada" onClick={onClick} onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove filter Owner: Ada' }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Owner : Ada' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(await axeViolations()).toEqual([]);
  });
});
