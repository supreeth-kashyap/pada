import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Resizable } from '../../components/Resizable';

const flexGrow = (element: HTMLElement) => Number(element.style.flexGrow);

function Layout(props: Partial<React.ComponentProps<typeof Resizable.Root>>) {
  return (
    <Resizable.Root data-testid="root" {...props}>
      <Resizable.Panel data-testid="files" defaultSize={30} minSize={20} maxSize={60} collapsible>
        Files
      </Resizable.Panel>
      <Resizable.Handle aria-label="Resize file list" withGrip />
      <Resizable.Panel data-testid="editor">Editor</Resizable.Panel>
    </Resizable.Root>
  );
}

describe('Resizable', () => {
  it('splits the space and exposes a focusable separator', async () => {
    render(<Layout />);
    expect(flexGrow(screen.getByTestId('files'))).toBe(30);
    expect(flexGrow(screen.getByTestId('editor'))).toBe(70);
    const handle = screen.getByRole('separator', { name: 'Resize file list' });
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-controls', screen.getByTestId('files').id);
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    expect(handle).toHaveAttribute('aria-valuemin', '0');
    expect(handle).toHaveAttribute('aria-valuemax', '60');
    expect(await axeViolations()).toEqual([]);
  });

  it('resizes with the keyboard within the limits', async () => {
    const user = userEvent.setup();
    const onSizesCommit = vi.fn();
    render(<Layout onSizesCommit={onSizesCommit} />);
    const handle = screen.getByRole('separator');
    handle.focus();
    await user.keyboard('{ArrowRight}');
    expect(onSizesCommit).toHaveBeenLastCalledWith([40, 60]);
    await user.keyboard('{End}');
    expect(handle).toHaveAttribute('aria-valuenow', '60');
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    // Arrow keys stop at the minimum instead of collapsing.
    expect(handle).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByTestId('files')).toHaveAttribute('data-state', 'expanded');
  });

  it('collapses and restores a collapsible panel with Enter', async () => {
    const user = userEvent.setup();
    render(<Layout />);
    const handle = screen.getByRole('separator');
    handle.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('files')).toHaveAttribute('data-state', 'collapsed');
    expect(handle).toHaveAttribute('aria-valuenow', '0');
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('files')).toHaveAttribute('data-state', 'expanded');
    expect(handle).toHaveAttribute('aria-valuenow', '30');
  });

  it('drags the handle relative to the group size', () => {
    const onSizesCommit = vi.fn();
    render(<Layout onSizesCommit={onSizesCommit} />);
    screen.getByTestId('root').getBoundingClientRect = () => ({ width: 1000, height: 400, left: 0, top: 0 }) as DOMRect;
    const handle = screen.getByRole('separator');
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    expect(handle).toHaveAttribute('data-dragging');
    fireEvent.pointerMove(handle, { clientX: 450, pointerId: 1 });
    expect(handle).toHaveAttribute('aria-valuenow', '45');
    // Dragged well below the minimum, a collapsible panel snaps shut.
    fireEvent.pointerMove(handle, { clientX: 50, pointerId: 1 });
    expect(handle).toHaveAttribute('aria-valuenow', '0');
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(handle).not.toHaveAttribute('data-dragging');
    expect(onSizesCommit).toHaveBeenCalledWith([0, 100]);
  });

  it('stacks vertically, with ArrowDown growing the upper panel', async () => {
    const user = userEvent.setup();
    render(
      <Resizable.Root orientation="vertical">
        <Resizable.Panel defaultSize={50}>Top</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>Bottom</Resizable.Panel>
      </Resizable.Root>,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    handle.focus();
    await user.keyboard('{ArrowDown}');
    expect(handle).toHaveAttribute('aria-valuenow', '60');
  });

  it('is controllable', async () => {
    const user = userEvent.setup();
    const onSizesChange = vi.fn();
    render(
      <Resizable.Root sizes={[50, 50]} onSizesChange={onSizesChange}>
        <Resizable.Panel>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>B</Resizable.Panel>
      </Resizable.Root>,
    );
    screen.getByRole('separator').focus();
    await user.keyboard('{ArrowLeft}');
    expect(onSizesChange).toHaveBeenCalledWith([40, 60]);
    // Controlled: nothing moves until the parent passes new sizes.
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '50');
  });
});
