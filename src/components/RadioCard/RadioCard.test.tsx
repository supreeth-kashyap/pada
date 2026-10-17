import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Rating } from '../Rating';
import { RadioCardGroup } from '.';

const plans = [
  { value: 'free', title: 'Free', description: 'For trying things out', meta: '$0' },
  { value: 'pro', title: 'Pro', description: 'For small teams', meta: '$12' },
  { value: 'enterprise', title: 'Enterprise', description: 'Talk to us', disabled: true },
];

describe('RadioCardGroup', () => {
  it('is a named group of described radios; arrow keys select', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioCardGroup label="Plan" options={plans} defaultValue="free" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Plan' })).toBeInTheDocument();
    const free = screen.getByRole('radio', { name: /Free/ });
    expect(free).toBeChecked();
    expect(free).toHaveAccessibleDescription('For trying things out');
    free.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('pro');
    expect(screen.getByRole('radio', { name: /Pro/ }).closest('label')).toHaveAttribute('data-checked');
    expect(screen.getByRole('radio', { name: /Enterprise/ })).toBeDisabled();
    expect(await axeViolations()).toEqual([]);
  });
});

describe('Rating', () => {
  it('is a radio group of stars that can be cleared', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating label="Your rating" defaultValue={2} onValueChange={onValueChange} />);
    expect(screen.getByRole('radiogroup', { name: 'Your rating' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2 stars' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(await axeViolations()).toEqual([]);
  });

  it('read-only ratings are one image with the value in words', () => {
    render(<Rating label="Average" value={4.5} readOnly />);
    expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument();
    expect(screen.queryByRole('radio')).toBeNull();
  });
});
