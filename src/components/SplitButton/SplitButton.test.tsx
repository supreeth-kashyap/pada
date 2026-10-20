import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button';
import { DropdownMenu } from '../DropdownMenu';
import { SplitButton } from '.';

describe('SplitButton', () => {
  it('joins a main action and a named chevron button that share the variant and size', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    const more = vi.fn();
    render(
      <SplitButton.Root variant="secondary" size="sm" label="Save options">
        <Button onClick={save}>Save</Button>
        <SplitButton.Splitter onClick={more} />
      </SplitButton.Root>,
    );
    expect(screen.getByRole('group', { name: 'Save options' })).toHaveAttribute('data-variant', 'secondary');
    const main = screen.getByRole('button', { name: 'Save' });
    const splitter = screen.getByRole('button', { name: 'More options' });
    for (const button of [main, splitter]) {
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-size', 'sm');
      expect(button).toHaveAttribute('type', 'button');
    }
    expect(splitter.querySelector('svg, .icon, [aria-hidden="true"]')).not.toBeNull();

    await user.click(splitter);
    expect(more).toHaveBeenCalledTimes(1);
    expect(save).not.toHaveBeenCalled();
    await user.click(main);
    expect(save).toHaveBeenCalledTimes(1);

    main.focus();
    await user.tab();
    expect(splitter).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(more).toHaveBeenCalledTimes(2);
    expect(await axeViolations()).toEqual([]);
  });

  it('defaults to primary, takes a custom label, and can be disabled', () => {
    render(
      <SplitButton.Root>
        <Button>Publish</Button>
        <SplitButton.Splitter label="Publish options" disabled />
      </SplitButton.Root>,
    );
    const splitter = screen.getByRole('button', { name: 'Publish options' });
    expect(splitter).toHaveAttribute('data-variant', 'primary');
    expect(splitter).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publish' })).toHaveAttribute('data-variant', 'primary');
  });

  it('works on its own with its own variant', () => {
    render(<SplitButton.Splitter variant="secondary" />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveAttribute('data-variant', 'secondary');
  });

  it('opens a menu from the splitter', async () => {
    const user = userEvent.setup();
    render(
      <SplitButton.Root label="Save options">
        <Button>Save</Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <SplitButton.Splitter />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </SplitButton.Root>,
    );
    const splitter = screen.getByRole('button', { name: 'More options' });
    expect(splitter).toHaveAttribute('aria-haspopup', 'menu');
    await user.click(splitter);
    expect(await screen.findByRole('menuitem', { name: 'Save as draft' })).toBeInTheDocument();
  });

  it('keeps the 1.x Button split API working on top of it', async () => {
    const user = userEvent.setup();
    const onSplitClick = vi.fn();
    render(<Button split variant="secondary" onSplitClick={onSplitClick}>Save</Button>);
    expect(screen.getByRole('group')).toHaveClass('split-button', 'button-split');
    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(onSplitClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-variant', 'secondary');
  });
});
