import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { RangeSlider } from '../../components/RangeSlider';

describe('Slider / RangeSlider', () => {
  it('exposes two named sliders bounded by each other', async () => {
    render(<RangeSlider label="Price" defaultValue={[20, 80]} locale="en-US" formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} />);
    expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument();
    const [low, high] = screen.getAllByRole('slider');
    expect(low).toHaveAccessibleName('Minimum price');
    expect(low).toHaveAttribute('aria-valuemax', '80');
    expect(high).toHaveAttribute('aria-valuemin', '20');
    expect(high).toHaveAttribute('aria-valuetext', '$80');
    expect(screen.getByText('$20 – $80')).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
  });

  it('steps with the keyboard and never crosses the other thumb', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(<RangeSlider label="Size" defaultValue={[40, 50]} minStepsBetweenThumbs={5} onValueChange={onValueChange} onValueCommit={onValueCommit} />);
    const [low, high] = screen.getAllByRole('slider');
    low.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith([41, 50]);
    expect(onValueCommit).toHaveBeenLastCalledWith([41, 50]);
    await user.keyboard('{End}');
    expect(low).toHaveAttribute('aria-valuenow', '45');
    await user.keyboard('{PageDown}');
    expect(low).toHaveAttribute('aria-valuenow', '35');
    high.focus();
    await user.keyboard('{Home}');
    expect(high).toHaveAttribute('aria-valuenow', '40');
  });

  it('pressing the track moves the nearest thumb and drags it', () => {
    const onValueCommit = vi.fn();
    render(<RangeSlider label="Range" defaultValue={[20, 80]} onValueCommit={onValueCommit} />);
    const track = document.querySelector('.range-slider-track') as HTMLElement;
    track.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 200, height: 12 });
    const root = document.querySelector('.range-slider-root') as HTMLElement;
    fireEvent.pointerDown(root, { button: 0, clientX: 140, pointerId: 1 });
    const [, high] = screen.getAllByRole('slider');
    expect(high).toHaveAttribute('aria-valuenow', '70');
    expect(high).toHaveFocus();
    fireEvent.pointerMove(root, { clientX: 190, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 190, pointerId: 1 });
    expect(onValueCommit).toHaveBeenCalledWith([20, 95]);
  });
});
