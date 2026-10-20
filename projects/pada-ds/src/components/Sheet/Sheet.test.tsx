import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Sheet } from '.';

function Example(props: Partial<React.ComponentProps<typeof Sheet.Content>> & { onOpenChange?: (open: boolean) => void }) {
  const { onOpenChange, ...content } = props;
  return (
    <Sheet.Root defaultOpen onOpenChange={onOpenChange}>
      <Sheet.Trigger>Open</Sheet.Trigger>
      <Sheet.Content {...content}>
        <Sheet.Header>
          <Sheet.Title>Share</Sheet.Title>
          <Sheet.Description>Send a link to this page.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <input aria-label="Email" />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}

// Drags in even steps over `duration` ms of a mocked clock, so release velocity is predictable.
const drag = (element: HTMLElement, from: number, to: number, { steps = 4, duration = 400 } = {}) => {
  let clock = 0;
  const now = vi.spyOn(performance, 'now').mockImplementation(() => clock);
  fireEvent.pointerDown(element, { button: 0, clientY: from, pointerId: 1 });
  for (let step = 1; step <= steps; step += 1) {
    clock = (duration * step) / steps;
    fireEvent.pointerMove(element, { clientY: from + ((to - from) * step) / steps, pointerId: 1 });
  }
  fireEvent.pointerUp(element, { clientY: to, pointerId: 1 });
  now.mockRestore();
};

describe('Sheet', () => {
  it('opens as a labelled modal dialog', async () => {
    render(<Example />);
    const sheet = screen.getByRole('dialog', { name: 'Share' });
    expect(sheet).toHaveAttribute('aria-modal', 'true');
    expect(sheet).toHaveAccessibleDescription('Send a link to this page.');
    expect(await axeViolations()).toEqual([]);
  });

  it('closes when dragged down far enough, and springs back otherwise', () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const sheet = screen.getByRole('dialog');
    sheet.getBoundingClientRect = () => ({ height: 400, width: 600, top: 368, left: 0 }) as DOMRect;
    drag(sheet, 400, 450, { duration: 1000 });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(sheet.style.getPropertyValue('--pada-sheet-drag')).toBe('0px');
    drag(sheet, 400, 600, { duration: 1000 });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on a quick flick down', () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const sheet = screen.getByRole('dialog');
    sheet.getBoundingClientRect = () => ({ height: 400 }) as DOMRect;
    drag(sheet, 400, 460, { duration: 60 });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not drag from form controls', () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    drag(screen.getByRole('textbox', { name: 'Email' }), 400, 700);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-dragging');
  });

  it('moves between snap points by dragging and with the grabber', async () => {
    const user = userEvent.setup();
    const onSnapChange = vi.fn();
    render(<Example snapPoints={[0.4, 0.9]} onSnapChange={onSnapChange} dismissible={false} />);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveAttribute('data-snap', '0.4');
    const grabber = screen.getByRole('button', { name: 'Expand sheet' });
    await user.click(grabber);
    expect(onSnapChange).toHaveBeenLastCalledWith(0.9);
    expect(screen.getByRole('button', { name: 'Collapse sheet' })).toBeInTheDocument();
    // A slow drag down by most of the viewport settles at the nearest point, never closing.
    drag(sheet, 100, 100 + window.innerHeight * 0.45, { duration: 2000 });
    expect(onSnapChange).toHaveBeenLastCalledWith(0.4);
    drag(sheet, 300, 300 + window.innerHeight * 0.6, { duration: 2000 });
    expect(sheet).toHaveAttribute('data-snap', '0.4');
  });

  it('closes with Escape like any dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
