import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Popover } from '.';

function Example({ modal }: { modal?: boolean }) {
  return (
    <>
      <button type="button">Outside</button>
      <Popover.Root modal={modal}>
        <Popover.Trigger>Filters</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content aria-label="Filters" side="bottom" align="start">
            <label>
              Status <input />
            </label>
            <Popover.Close>Apply</Popover.Close>
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 10)));

describe('Popover', () => {
  it('toggles from the trigger and exposes position and state attributes', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    const content = screen.getByRole('dialog', { name: 'Filters' });
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('data-side', 'bottom');
    expect(content).toHaveAttribute('data-align', 'start');
    expect(content.style.position).toBe('fixed');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('textbox', { name: 'Status' })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);

    await tick();
    await user.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await tick();
    expect(trigger).toHaveFocus();
  });

  it('closes on a click outside and when focus leaves it', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await tick();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await tick();
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not trap focus unless modal', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus();
    await user.tab();
    // Not trapped: Tab moves on instead of wrapping back to the first field.
    expect(screen.getByRole('textbox', { name: 'Status' })).not.toHaveFocus();
  });

  it('modal popovers trap Tab', async () => {
    const user = userEvent.setup();
    render(<Example modal />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Status' })).toHaveFocus();
  });

  it('a nested popover inside a dialog-like layer only closes the top layer on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Outer</Popover.Trigger>
        <Popover.Content aria-label="Outer">
          <Popover.Root>
            <Popover.Trigger>Inner</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content aria-label="Inner">Inner content</Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Inner' }));
    expect(screen.getByRole('dialog', { name: 'Inner' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Inner' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Outer' })).toBeInTheDocument();
  });
});

describe('Popover under StrictMode', () => {
  it('keeps focus inside after effects run twice', async () => {
    const { StrictMode } = await import('react');
    const user = userEvent.setup();
    render(
      <StrictMode>
        <Example />
      </StrictMode>,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await tick();
    expect(screen.getByRole('textbox', { name: 'Status' })).toHaveFocus();
    await user.keyboard('{Escape}');
    await tick();
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveFocus();
  });

  it('closing one popover does not pull focus out of another that just opened', async () => {
    render(
      <>
        <Popover.Root>
          <Popover.Trigger>First</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content aria-label="First panel">
              <button type="button">Inside first</button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger>Second</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content aria-label="Second panel">
              <button type="button">Inside second</button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </>,
    );
    screen.getByRole('button', { name: 'First' }).focus();
    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    await tick();
    expect(screen.getByRole('button', { name: 'Inside first' })).toHaveFocus();
    // Close the first and open the second before the first's focus restore runs.
    fireEvent.keyDown(screen.getByRole('button', { name: 'Inside first' }), { key: 'Escape' });
    screen.getByRole('button', { name: 'Second' }).focus();
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    await tick();
    expect(screen.getByRole('dialog', { name: 'Second panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inside second' })).toHaveFocus();
  });
});
