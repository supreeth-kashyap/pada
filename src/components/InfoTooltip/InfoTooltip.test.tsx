import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { InfoTooltip } from '.';

describe('InfoTooltip', () => {
  it('is a native button reachable by Tab, named from the label', async () => {
    const user = userEvent.setup();
    render(<InfoTooltip label="Status" text="Current state" />);
    const trigger = screen.getByRole('button', { name: 'More info about Status' });
    expect(trigger).toHaveAttribute('type', 'button');
    await user.tab();
    expect(trigger).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
  });

  it('hides the text until interaction, shows it on focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(<InfoTooltip label="Status" text="Current state" />);
    expect(screen.queryByRole('tooltip')).toBeNull();
    await user.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Current state');
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Current state');
    await user.tab();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('closes on Escape and keeps focus on the trigger', async () => {
    const user = userEvent.setup();
    render(<InfoTooltip label="Status" text="Current state" position="bottom" />);
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'bottom');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('gives each instance its own tooltip', async () => {
    const user = userEvent.setup();
    render(
      <>
        <InfoTooltip label="Seats" text="Billed monthly" />
        <InfoTooltip label="Storage" text="Shared by the team" />
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Shared by the team');
    expect(screen.getByRole('button', { name: 'More info about Storage' })).toHaveAccessibleDescription('Shared by the team');
  });
});
