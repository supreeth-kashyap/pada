import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { DescriptionList, type DescriptionListData } from '.';

const DATA: DescriptionListData = {
  sections: [
    {
      header: { label: 'Section A', tooltip: 'Info about section A' },
      rows: [
        { key: 'Status', value: [{ type: 'text', text: 'Active' }] },
        { key: 'Tag', tooltip: 'Current state', value: [{ type: 'badge', label: 'New', tone: 'success' }] },
      ],
    },
    {
      header: { label: 'Section B', slot: [{ type: 'button', label: 'Action' }, { type: 'badge', label: 'Beta' }] },
      rows: [
        { key: 'Owner', value: [{ type: 'avatar', name: 'Anna Banks', subtitle: 'HR @company' }] },
        {
          key: 'Edit',
          value: [
            { type: 'text', text: 'Last edited 2 days ago' },
            { type: 'button', label: 'Edit record' },
          ],
        },
      ],
    },
  ],
};

describe('DescriptionList', () => {
  it('renders named sections as description lists of terms and values', async () => {
    const { container } = render(<DescriptionList data={DATA} />);
    expect(screen.getByRole('group', { name: 'Section A' })).toBeInTheDocument();
    const sectionB = screen.getByRole('group', { name: 'Section B' });
    expect(container.querySelectorAll('dl')).toHaveLength(2);
    expect(container.querySelectorAll('dl > div')).toHaveLength(4);
    const terms = Array.from(container.querySelectorAll('dt')).map((dt) => dt.querySelector('.description-list-key-text')?.textContent);
    expect(terms).toEqual(['Status', 'Tag', 'Owner', 'Edit']);
    expect(sectionB.querySelectorAll('dd')[1]).toHaveTextContent('Last edited 2 days ago');
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
  });

  it('reports slot and row button presses', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<DescriptionList data={DATA} onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: 'Action' }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: 'section-slot-click',
      sectionLabel: 'Section B',
      item: { type: 'button', label: 'Action' },
    });
    await user.click(screen.getByRole('button', { name: 'Edit record' }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: 'row-button-click',
      sectionLabel: 'Section B',
      key: 'Edit',
      label: 'Edit record',
      index: 1,
    });
  });

  it('tells two buttons in the same row apart, and honours disabled', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DescriptionList
        onAction={onAction}
        data={{
          sections: [
            {
              header: { label: 'Section C' },
              rows: [
                {
                  key: 'Actions',
                  value: [
                    { type: 'button', label: 'Approve' },
                    { type: 'button', label: 'Reject' },
                    { type: 'button', label: 'Escalate', disabled: true },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(screen.getByRole('button', { name: 'Escalate' })).toBeDisabled();
    expect(onAction.mock.calls.map(([event]) => [event.label, event.index])).toEqual([
      ['Approve', 0],
      ['Reject', 1],
    ]);
  });

  it('shows tooltips named after the key or label, the avatar lockup, and custom content', async () => {
    const user = userEvent.setup();
    render(
      <DescriptionList
        data={{
          sections: [
            {
              header: { label: 'Profile' },
              rows: [
                { key: 'Status', tooltip: 'Current state', value: [{ type: 'avatar', name: 'Anna Banks' }] },
                { key: 'Logo', value: [{ type: 'custom', content: <img src="logo.png" alt="Northwind" /> }] },
              ],
            },
          ],
        }}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.tab();
    expect(screen.getByRole('button', { name: 'More info about Status' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Current state');
    expect(document.querySelector('.description-list-avatar-picture')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.description-list-avatar-name')).toHaveTextContent('Anna Banks');
    expect(document.querySelector('.description-list-avatar-subtitle')).toBeNull();
    expect(screen.getByRole('img', { name: 'Northwind' })).toBeInTheDocument();
  });
});
