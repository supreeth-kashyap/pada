import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Steps } from '.';

describe('Steps', () => {
  it('is a list; the current step is marked and every step announces its status', async () => {
    render(
      <Steps
        steps={[
          { title: 'Account', status: 'completed', description: 'Done yesterday' },
          { title: 'Plan', status: 'current' },
          { title: 'Confirm', status: 'upcoming', clickable: false },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveAttribute('data-status', 'completed');
    const account = screen.getByRole('button', { name: 'Account (completed)' });
    expect(account).toHaveAccessibleDescription('Done yesterday');
    expect(items[1]).toHaveTextContent('Plan (current step)');
    // Not clickable, so not a button.
    expect(screen.queryByRole('button', { name: /Confirm/ })).toBeNull();
    expect(await axeViolations()).toEqual([]);
  });

  it('clicking (or pressing Enter on) a step selects it', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(<Steps onStepChange={onStepChange} steps={[{ title: 'One', status: 'completed' }, { title: 'Two' }]} />);
    await user.click(screen.getByRole('button', { name: 'Two (not started)' }));
    expect(onStepChange).toHaveBeenLastCalledWith(2);
    screen.getByRole('button', { name: 'One (completed)' }).focus();
    await user.keyboard('{Enter}');
    expect(onStepChange).toHaveBeenLastCalledWith(1);
  });
});
