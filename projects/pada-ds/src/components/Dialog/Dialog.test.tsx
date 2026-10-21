import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { Dialog } from '.';

describe('Dialog (styled)', () => {
  it('composes trigger, header, body, footer and close parts', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>Edit profile</Button>
        </Dialog.Trigger>
        <Dialog.Content size="lg">
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Changes save automatically.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <input aria-label="Name" />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
          </Dialog.Footer>
          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    expect(trigger).toHaveClass('button', 'button--primary');
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveClass('dialog');
    expect(dialog).toHaveAttribute('data-size', 'lg');
    expect(dialog).toHaveAccessibleDescription('Changes save automatically.');
    expect(document.querySelector('.dialog-overlay')).toHaveAttribute('data-state', 'open');
    expect(await axeViolations()).toEqual([]);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Drawer slides from the requested side', async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Filters</Drawer.Trigger>
        <Drawer.Content side="left" size="md">
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Content>
      </Drawer.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const drawer = screen.getByRole('dialog', { name: 'Filters' });
    expect(drawer).toHaveClass('drawer');
    expect(drawer).toHaveAttribute('data-side', 'left');
    expect(drawer).toHaveAttribute('data-size', 'md');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
