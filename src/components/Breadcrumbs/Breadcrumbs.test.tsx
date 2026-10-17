import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Breadcrumbs } from './Breadcrumbs';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Pada', href: '/projects/pada' },
  { label: 'Settings', href: '/projects/pada/settings' },
  { label: 'Members' },
];

describe('Breadcrumbs', () => {
  it('is a labelled navigation list ending in the current page', async () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByText('Members')).toHaveAttribute('aria-current', 'page');
    expect(await axeViolations()).toEqual([]);
  });

  it('collapses the middle and expands on request', async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.queryByRole('link', { name: 'Projects' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Show all breadcrumbs' }));
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });
});
