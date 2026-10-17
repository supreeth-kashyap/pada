import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tabs } from '.';

function Example({ activationMode, onValueChange }: { activationMode?: 'automatic' | 'manual'; onValueChange?: (value: string) => void }) {
  return (
    <Tabs.Root defaultValue="overview" activationMode={activationMode} onValueChange={onValueChange}>
      <Tabs.List aria-label="Project">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="files" disabled>
          Files
        </Tabs.Trigger>
        <Tabs.Trigger value="activity log">Activity</Tabs.Trigger>
        <Tabs.Indicator data-testid="indicator" />
      </Tabs.List>
      <Tabs.Content value="overview">Overview panel</Tabs.Content>
      <Tabs.Content value="files">Files panel</Tabs.Content>
      <Tabs.Content value="activity log">Activity panel</Tabs.Content>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('wires tabs to panels with unique ids and roving tabindex', async () => {
    render(
      <>
        <Example />
        <Example />
      </>,
    );
    const ids = screen.getAllByRole('tab').map((tab) => tab.id);
    expect(new Set(ids).size).toBe(ids.length);
    const [overview] = screen.getAllByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveAttribute('tabindex', '0');
    const [panel] = screen.getAllByRole('tabpanel', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Overview panel');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves with arrow keys, skips disabled tabs, wraps, and selects on focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveFocus();
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith('activity log');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(activity).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('manual activation waits for Enter', async () => {
    const user = userEvent.setup();
    render(<Example activationMode="manual" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
  });

  it('selects with a click and exposes indicator geometry', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
    const indicator = screen.getByTestId('indicator');
    expect(indicator.style.getPropertyValue('--pada-tabs-indicator-size')).toBe('0px');
    expect(indicator).toHaveAttribute('data-state', 'visible');
  });
});
