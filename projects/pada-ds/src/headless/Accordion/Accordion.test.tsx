import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Collapsible } from '../Collapsible';
import { Accordion, type AccordionRootProps } from '.';

function Example(props: Partial<AccordionRootProps>) {
  const rootProps = { type: 'single', ...props } as AccordionRootProps;
  return (
    <Accordion.Root {...rootProps}>
      {['Shipping', 'Returns', 'Warranty'].map((label) => (
        <Accordion.Item key={label} value={label.toLowerCase()} disabled={label === 'Returns'}>
          <Accordion.Header>
            <Accordion.Trigger>{label}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{`${label} details`}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('wires each trigger to a labelled region inside a heading', async () => {
    render(<Example defaultValue="shipping" />);
    const trigger = screen.getByRole('button', { name: 'Shipping' });
    expect(trigger.closest('h3')).not.toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: 'Shipping' });
    expect(trigger).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('Shipping details');
    // Closed content stays in the DOM (hidden, empty) so aria-controls always resolves.
    const warranty = screen.getByRole('button', { name: 'Warranty' });
    const closed = document.getElementById(warranty.getAttribute('aria-controls')!);
    expect(closed).toHaveAttribute('hidden');
    expect(closed).toBeEmptyDOMElement();
    expect(await axeViolations()).toEqual([]);
  });

  it('single: opening one closes the other, and the open one stays open unless collapsible', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = render(<Example defaultValue="shipping" onValueChange={onValueChange} />);
    const shipping = screen.getByRole('button', { name: 'Shipping' });
    expect(shipping).toHaveAttribute('aria-disabled', 'true');
    await user.click(shipping);
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Warranty' }));
    expect(onValueChange).toHaveBeenLastCalledWith('warranty');
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    unmount();

    render(<Example type="single" collapsible defaultValue="shipping" />);
    const again = screen.getByRole('button', { name: 'Shipping' });
    expect(again).not.toHaveAttribute('aria-disabled');
    await user.click(again);
    expect(again).toHaveAttribute('aria-expanded', 'false');
  });

  it('multiple: items open independently', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example type="multiple" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Warranty' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['shipping', 'warranty']);
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('arrow keys, Home and End move between enabled triggers and wrap', async () => {
    const user = userEvent.setup();
    render(<Example type="multiple" />);
    const shipping = screen.getByRole('button', { name: 'Shipping' });
    const warranty = screen.getByRole('button', { name: 'Warranty' });
    expect(screen.getByRole('button', { name: 'Returns' })).toBeDisabled();
    shipping.focus();
    await user.keyboard('{ArrowDown}');
    expect(warranty).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(shipping).toHaveFocus();
    await user.keyboard('{End}');
    expect(warranty).toHaveFocus();
    await user.keyboard('{Home}');
    expect(shipping).toHaveFocus();
  });
});

describe('Collapsible', () => {
  it('toggles its content and reports the state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Hidden text</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden text')).toBeNull();
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Hidden text')).toBeVisible();
  });
});
