import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { HoverCard } from '../../components/HoverCard';

function Example() {
  return (
    <p>
      Reviewed by{' '}
      <HoverCard content={<span>Ada Lovelace, Engineering</span>} openDelay={500} closeDelay={200}>
        <a href="/people/ada">@ada</a>
      </HoverCard>
    </p>
  );
}

describe('HoverCard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('opens after the delay on hover and stays open while the pointer is on the card', async () => {
    render(<Example />);
    const link = screen.getByRole('link', { name: '@ada' });
    fireEvent.pointerEnter(link, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByText('Ada Lovelace, Engineering')).toBeNull();
    act(() => vi.advanceTimersByTime(100));
    const card = screen.getByText('Ada Lovelace, Engineering').closest('.hover-card')!;
    expect(link).toHaveAttribute('data-state', 'open');
    // Moving from the link to the card keeps it open.
    fireEvent.pointerLeave(link, { pointerType: 'mouse' });
    fireEvent.pointerEnter(card, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText('Ada Lovelace, Engineering')).toBeInTheDocument();
    fireEvent.pointerLeave(card, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('Ada Lovelace, Engineering')).toBeNull();
    vi.useRealTimers();
    expect(await axeViolations()).toEqual([]);
  });

  // jsdom pointer events carry no pointerType, so the touch case is not simulated here.
  it('opens on keyboard focus and closes on Escape', () => {
    render(<Example />);
    const link = screen.getByRole('link', { name: '@ada' });
    act(() => link.focus());
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText('Ada Lovelace, Engineering')).toBeInTheDocument();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(link).toHaveAttribute('data-state', 'closed');
    // Unmounts after its exit transition.
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByText('Ada Lovelace, Engineering')).toBeNull();
  });
});
