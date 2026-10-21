import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { ScrollArea } from '../ScrollArea';
import { Timeline } from '../Timeline';
import { Stat } from '.';

describe('Stat', () => {
  it('formats the value and delta and names the trend', async () => {
    render(
      <Stat
        label="Revenue"
        value={128400}
        locale="en-US"
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
        delta={0.124}
        deltaFormatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
        deltaLabel="vs last month"
      />,
    );
    const group = screen.getByRole('group', { name: 'Revenue' });
    expect(group).toHaveTextContent('$128,400');
    const delta = group.querySelector('.stat-delta')!;
    expect(delta).toHaveAttribute('data-sentiment', 'positive');
    expect(delta).toHaveTextContent('up +12.4%');
    expect(await axeViolations()).toEqual([]);
  });

  it('treats a fall as good when the trend is inverted', () => {
    render(<Stat label="Errors" value={12} delta={-5} invertTrend />);
    expect(document.querySelector('.stat-delta')).toHaveAttribute('data-sentiment', 'positive');
    expect(document.querySelector('.stat-delta')).toHaveAttribute('data-trend', 'down');
  });
});

describe('Timeline', () => {
  it('is an ordered list of events with machine-readable times', async () => {
    const shipped = new Date(2026, 2, 10, 9, 30);
    render(
      <Timeline
        aria-label="Order history"
        items={[
          { title: 'Order placed', time: new Date(2026, 2, 9, 14, 0), tone: 'accent' },
          { title: 'Shipped', time: shipped, tone: 'success', icon: 'tick_1', description: 'Tracking number 1Z999' },
          { title: 'Delivered', time: 'Expected Friday', pending: true },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(screen.getByRole('list', { name: 'Order history' }).tagName).toBe('OL');
    expect(items).toHaveLength(3);
    expect(items[1].querySelector('time')).toHaveAttribute('dateTime', shipped.toISOString());
    expect(items[2]).toHaveAttribute('data-pending');
    expect(await axeViolations()).toEqual([]);
  });

  it('accepts Timeline.Item children', () => {
    render(
      <Timeline>
        <Timeline.Item title="Created">By Ada</Timeline.Item>
        <Timeline.Item title="Approved" tone="success" />
      </Timeline>,
    );
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('CreatedBy Ada');
    expect(screen.getAllByRole('listitem')[1]).toHaveStyle({ '--pada-timeline-index': '1' });
  });
});

describe('ScrollArea', () => {
  it('sets its limits and orientation', () => {
    render(
      <ScrollArea aria-label="Log" maxHeight={120} data-testid="area">
        <p>Line</p>
      </ScrollArea>,
    );
    const area = screen.getByTestId('area');
    expect(area).toHaveClass('scroll-area');
    expect(area).toHaveAttribute('data-orientation', 'vertical');
    expect(area.style.getPropertyValue('--pada-scroll-area-max-height')).toBe('120px');
    // jsdom has no layout, so nothing overflows and the area stays out of the tab order.
    expect(area).not.toHaveAttribute('tabindex');
  });
});
