import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tooltip } from '.';

const wait = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)));

function Example() {
  return (
    <Tooltip.Provider delayDuration={50} skipDelayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger aria-label="Delete">🗑</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>Delete permanently</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>Share</Tooltip.Trigger>
        <Tooltip.Content>Copy a link</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

describe('Tooltip', () => {
  it('opens immediately on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Delete' });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Delete permanently');
    expect(trigger).toHaveAccessibleDescription('Delete permanently');
    expect(await axeViolations()).toEqual([]);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('opens on hover after the delay and closes after leaving', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
    await wait(80);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Delete permanently');
    await user.unhover(screen.getByRole('button', { name: 'Delete' }));
    await wait(200);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('skips the delay when moving to the next trigger soon after', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole('button', { name: 'Delete' }));
    await wait(80);
    await user.unhover(screen.getByRole('button', { name: 'Delete' }));
    await wait(150);
    await user.hover(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy a link');
  });

  it('closes on pointer-down and does not reopen from the click focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole('button', { name: 'Delete' }));
    await wait(80);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
