import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Heading } from '.';

describe('Heading', () => {
  it('renders the native heading level and sizes it by level', async () => {
    render(
      <>
        <Heading level={1}>Billing</Heading>
        <Heading level={2}>Plan</Heading>
        <Heading level={3}>Payment method</Heading>
      </>,
    );
    const h1 = screen.getByRole('heading', { level: 1, name: 'Billing' });
    expect(h1.tagName).toBe('H1');
    expect(h1).toHaveAttribute('data-level', '1');
    expect(h1).toHaveAttribute('data-size', '3xl');
    expect(h1).toHaveAttribute('data-weight', '600');
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('data-size', 'xl');
    expect(await axeViolations()).toEqual([]);
  });

  it('defaults to h2 and sizes the lower levels down to sm', () => {
    render(
      <>
        <Heading>Section</Heading>
        <Heading level={5}>Notes</Heading>
        <Heading level={6}>Footnote</Heading>
      </>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('data-size', '2xl');
    expect(screen.getByRole('heading', { level: 5 })).toHaveAttribute('data-size', 'base');
    expect(screen.getByRole('heading', { level: 6 })).toHaveAttribute('data-size', 'sm');
  });

  it('lets size and weight override the level defaults without changing the level', () => {
    render(<Heading level={2} size="lg" weight="700">Members</Heading>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Members' });
    expect(heading).toHaveAttribute('data-size', 'lg');
    expect(heading).toHaveAttribute('data-weight', '700');
    expect(heading).not.toHaveAttribute('style');
  });
});
