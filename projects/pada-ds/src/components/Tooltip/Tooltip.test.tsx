import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip (1.x API on the headless tooltip)', () => {
  it('describes its trigger while open, keeping any existing description', async () => {
    const user = userEvent.setup();
    render(
      <>
        <span id="hint">Shortcut A</span>
        <Tooltip content="Archive this record" position="bottom">
          <button type="button" aria-describedby="hint">
            Archive
          </button>
        </Tooltip>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Archive' });
    expect(trigger).toHaveAttribute('aria-describedby', 'hint');
    expect(screen.queryByRole('tooltip')).toBeNull();

    await user.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('tooltip');
    expect(tooltip).toHaveAttribute('data-side', 'bottom');
    expect(trigger).toHaveAttribute('aria-describedby', `hint ${tooltip.id}`);
    expect(trigger).toHaveAccessibleDescription('Shortcut A Archive this record');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('exposes compound parts', () => {
    expect(Tooltip.Root).toBeTypeOf('function');
    expect(Tooltip.Provider).toBeTypeOf('function');
  });
});
