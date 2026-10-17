import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Carousel } from './Carousel';

const slides = ['First', 'Second', 'Third'].map((text) => <p key={text}>{text}</p>);

describe('Carousel', () => {
  afterEach(() => vi.useRealTimers());

  it('is a labelled carousel region with slide groups and current-dot state', async () => {
    render(<Carousel label="Highlights">{slides}</Carousel>);
    expect(screen.getByRole('region', { name: 'Highlights' })).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveTextContent('First');
    expect(screen.getByRole('button', { name: 'Slide 1' })).toHaveAttribute('aria-current', 'true');
    expect(await axeViolations()).toEqual([]);
  });

  it('auto-rotates, pauses on hover, and can be stopped with the rotation button', async () => {
    vi.useFakeTimers();
    render(<Carousel interval={1000}>{slides}</Carousel>);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeInTheDocument();

    const region = screen.getByRole('region');
    act(() => region.dispatchEvent(new PointerEvent('pointerover', { bubbles: true })));
    // React listens for pointerenter through pointerover/pointerout pairs.
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeInTheDocument();
    vi.useRealTimers();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Stop automatic slide show' }));
    expect(screen.getByRole('button', { name: 'Start automatic slide show' })).toBeInTheDocument();
  });

  it('pauses while focus is inside', async () => {
    const user = userEvent.setup();
    render(<Carousel interval={50}>{slides}</Carousel>);
    await user.tab();
    const before = screen.getByRole('group').getAttribute('aria-label');
    await act(() => new Promise((resolve) => setTimeout(resolve, 150)));
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', before);
  });
});
