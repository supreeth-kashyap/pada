import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { ColorPicker } from '.';
import { parseColor } from './color';

describe('ColorPicker', () => {
  it('exposes a labelled group with a 2D slider, a hue slider and a hex field', async () => {
    render(<ColorPicker label="Accent colour" defaultValue="#4f46e5" swatches={['#ef4444', { value: '#4f46e5', label: 'Indigo' }]} />);
    expect(screen.getByRole('group', { name: 'Accent colour' })).toBeInTheDocument();
    const area = screen.getByRole('slider', { name: 'Lightness and chroma' });
    expect(area).toHaveAttribute('aria-roledescription', '2D slider');
    expect(area.getAttribute('aria-valuetext')).toMatch(/^Lightness 51%, chroma 0\.2\d\d$/);
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute('aria-valuenow', '277');
    expect(screen.getByRole('textbox', { name: 'Hex' })).toHaveValue('#4f46e5');
    expect(screen.getByRole('button', { name: 'Indigo' })).toHaveAttribute('aria-pressed', 'true');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves lightness and chroma with the arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorPicker label="Colour" defaultValue="oklch(50% 0.1 200)" format="oklch" onValueChange={onValueChange} />);
    screen.getByRole('slider', { name: 'Lightness and chroma' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(51% 0.1 200)');
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(51% 0.105 200)');
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(41% 0.105 200)');
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(41% 0 200)');
  });

  it('changes hue with its slider', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorPicker label="Colour" defaultValue="oklch(60% 0.1 100)" format="oklch" onValueChange={onValueChange} />);
    screen.getByRole('slider', { name: 'Hue' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(60% 0.1 101)');
  });

  it('picks from the area with the pointer', () => {
    const onValueChange = vi.fn();
    render(<ColorPicker label="Colour" defaultValue="oklch(50% 0.1 30)" format="oklch" onValueChange={onValueChange} />);
    const area = screen.getByRole('slider', { name: 'Lightness and chroma' }).parentElement!;
    area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
    fireEvent.pointerDown(area, { button: 0, clientX: 0, clientY: 25, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(75% 0 30)');
    fireEvent.pointerMove(area, { clientX: 100, clientY: 50, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith('oklch(50% 0.185 30)');
  });

  it('accepts typed hex on Enter and reverts invalid input', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorPicker label="Colour" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Hex' });
    await user.clear(input);
    await user.type(input, '#f00{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('#ff0000');
    expect(input).toHaveValue('#ff0000');
    await user.clear(input);
    await user.type(input, 'nope');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await user.tab();
    expect(input).toHaveValue('#ff0000');
  });

  it('chooses a swatch and follows a controlled value', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('#22c55e');
      return (
        <>
          <ColorPicker label="Colour" value={value} onValueChange={setValue} swatches={['#ef4444', '#22c55e']} />
          <button type="button" onClick={() => setValue('#4f46e5')}>
            Reset
          </button>
          <span data-testid="value">{value}</span>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('button', { name: '#22c55e' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '#ef4444' }));
    expect(screen.getByTestId('value')).toHaveTextContent('#ef4444');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('textbox', { name: 'Hex' })).toHaveValue('#4f46e5');
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute('aria-valuenow', String(Math.round(parseColor('#4f46e5')!.h)));
  });
});
