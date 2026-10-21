import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { TabPanel, Tabs } from './Tabs';

describe('Tabs (1.x API)', () => {
  it('two instances on one page keep separate ids and keyboard focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Tabs label="First" onChange={onChange}>
          <TabPanel label="One">Panel one</TabPanel>
          <TabPanel label="Two" notification>
            Panel two
          </TabPanel>
        </Tabs>
        <Tabs label="Second">
          <TabPanel label="One">Other one</TabPanel>
          <TabPanel label="Two">Other two</TabPanel>
        </Tabs>
      </>,
    );
    const ids = screen.getAllByRole('tab').map((tab) => tab.id);
    expect(new Set(ids).size).toBe(4);
    expect(screen.getByRole('tab', { name: /^Two\s*, unread updates$/ })).toBeInTheDocument();

    await user.tab();
    await user.keyboard('{ArrowRight}');
    const [firstTwo, secondTwo] = screen.getAllByRole('tab', { name: /^Two/ });
    expect(firstTwo).toHaveFocus();
    expect(secondTwo).toHaveAttribute('aria-selected', 'false');
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText('Panel two')).toBeVisible();
    expect(await axeViolations()).toEqual([]);
  });

  it('honours the controlled value', () => {
    render(
      <Tabs label="Controlled" value={1}>
        <TabPanel label="One">Panel one</TabPanel>
        <TabPanel label="Two">Panel two</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
  });

  it('composes styled parts with the pills variant', async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="a" variant="pills">
        <Tabs.List aria-label="View">
          <Tabs.Trigger value="a">List</Tabs.Trigger>
          <Tabs.Trigger value="b">Board</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">List view</Tabs.Content>
        <Tabs.Content value="b">Board view</Tabs.Content>
      </Tabs.Root>,
    );
    expect(screen.getByRole('tablist').closest('.tabs')).toHaveAttribute('data-variant', 'pills');
    expect(document.querySelector('.tabs-indicator')).not.toBeNull();
    await user.click(screen.getByRole('tab', { name: 'Board' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Board view');
  });
});
