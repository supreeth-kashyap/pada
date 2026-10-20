import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { CheckboxGroup, type CheckboxGroupOption } from '.';

const topics: CheckboxGroupOption[] = [
  { value: 'mentions', label: 'Mentions' },
  { value: 'comments', label: 'Comments' },
  { value: 'releases', label: 'Releases' },
];

describe('CheckboxGroup', () => {
  it('is a labelled, described group whose value is the checked options in order', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Notify me about"
        description="At most one email a day."
        options={topics}
        defaultValue={['releases']}
        onValueChange={onValueChange}
      />,
    );
    const group = screen.getByRole('group', { name: 'Notify me about' });
    expect(group).toHaveAccessibleDescription('At most one email a day.');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByRole('checkbox', { name: 'Releases' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Mentions' })).not.toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Mentions' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['mentions', 'releases']);
    await user.click(screen.getByRole('checkbox', { name: 'Releases' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['mentions']);
    expect(await axeViolations()).toEqual([]);
  });

  it('toggles with Space and moves with Tab', async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup label="Topics" options={topics} />);
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Mentions' })).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox', { name: 'Mentions' })).toBeChecked();
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Comments' })).toHaveFocus();
  });

  it('has a select-all box that is mixed for some and only changes enabled choices', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const options = [...topics, { value: 'billing', label: 'Billing', disabled: true }];
    function Host() {
      const [value, setValue] = useState(['comments', 'billing']);
      return (
        <CheckboxGroup
          label="Topics"
          options={options}
          selectAll
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    render(<Host />);
    const all = screen.getByRole('checkbox', { name: 'Select all' });
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox', { name: 'Billing' })).toBeDisabled();

    await user.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(['mentions', 'comments', 'releases', 'billing']);
    expect(all).toBeChecked();
    expect(all).not.toHaveAttribute('aria-checked');

    await user.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(['billing']);
    expect(all).not.toBeChecked();
    expect(await axeViolations()).toEqual([]);
  });

  it('shows the error while invalid, marks required, submits by name, and can be disabled', async () => {
    const { rerender } = render(
      <CheckboxGroup label="Topics" options={topics} required error="Pick at least one." name="topics" />,
    );
    const group = screen.getByRole('group', { name: 'Topics' });
    expect(group).not.toHaveAttribute('data-invalid');
    expect(screen.queryByText('Pick at least one.')).toBeNull();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('checkbox', { name: 'Comments' })).toHaveAttribute('name', 'topics');

    rerender(<CheckboxGroup label="Topics" options={topics} required invalid error="Pick at least one." name="topics" />);
    expect(group).toHaveAttribute('data-invalid');
    expect(group).toHaveAccessibleDescription('Pick at least one.');

    rerender(<CheckboxGroup label="Topics" options={topics} disabled defaultValue={['releases']} />);
    for (const box of screen.getAllByRole('checkbox')) expect(box).toBeDisabled();
    expect(group).toHaveAttribute('data-disabled');
    expect(await axeViolations()).toEqual([]);
  });

  it('lays out in a row', () => {
    render(<CheckboxGroup aria-label="Topics" options={topics} orientation="horizontal" />);
    expect(screen.getByRole('group', { name: 'Topics' })).toHaveAttribute('data-orientation', 'horizontal');
  });
});
