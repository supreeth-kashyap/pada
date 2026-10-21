import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Dialog } from '.';

function Example({ modal = true, onOpenChange }: { modal?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <div>
      <button type="button">Before</button>
      <Dialog.Root modal={modal} onOpenChange={onOpenChange}>
        <Dialog.Trigger>Edit profile</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay data-testid="overlay" />
          <Dialog.Content>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Changes save automatically.</Dialog.Description>
            <input aria-label="Name" />
            <Dialog.Close>Done</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

const flushTimers = () => act(() => new Promise((resolve) => setTimeout(resolve, 10)));

describe('Dialog', () => {
  it('opens from the trigger with dialog semantics and moves focus inside', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Changes save automatically.');
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
  });

  it('traps Tab inside a modal dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    const name = screen.getByRole('textbox', { name: 'Name' });
    const done = screen.getByRole('button', { name: 'Done' });
    await user.tab();
    expect(done).toHaveFocus();
    await user.tab();
    expect(name).toHaveFocus();
    await user.tab({ shift: true });
    expect(done).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
    await flushTimers();
    expect(trigger).toHaveFocus();
  });

  it('closes from Dialog.Close and from a pointer-down on the overlay', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await flushTimers();
    await user.click(screen.getByTestId('overlay'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('hides the rest of the page from assistive technology and locks scroll while modal', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(container).not.toHaveAttribute('aria-hidden');
    expect(document.body.style.overflow).toBe('');
  });

  it('non-modal dialogs neither trap focus nor hide the page, and have no overlay', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example modal={false} />);
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-modal');
    expect(container).not.toHaveAttribute('aria-hidden');
    expect(screen.queryByTestId('overlay')).toBeNull();
  });

  it('lets onEscapeKeyDown keep the dialog open', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content onEscapeKeyDown={(event) => event.preventDefault()}>
          <Dialog.Title>Unsaved changes</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('works controlled, and asChild merges onto custom triggers', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <output>{open ? 'open' : 'closed'}</output>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <a href="#edit" className="link">
                Edit
              </a>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Edit</Dialog.Title>
            </Dialog.Content>
          </Dialog.Root>
        </>
      );
    }
    render(<Controlled />);
    const link = screen.getByRole('link', { name: 'Edit' });
    expect(link).toHaveClass('link');
    expect(link).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(link);
    // The page behind a modal is aria-hidden, so query the output with hidden: true.
    expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('open');
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeInTheDocument();
  });

  it('throws a readable error when a part is used outside the root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Dialog.Title>Orphan</Dialog.Title>)).toThrow('<Dialog.Title> must be used inside <Dialog.Root>.');
  });
});
