import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from '../Alert';
import { EmptyState } from '../EmptyState';
import { Kbd } from '../Kbd';
import { Separator } from '../Separator';
import { Skeleton } from '../Skeleton';
import { Spinner } from '../Spinner';
import { Stack } from '../Stack';
import { Badge } from './Badge';

describe('display primitives', () => {
  it('Badge caps counts and exposes tone and variant', () => {
    render(<Badge tone="danger" variant="solid" count={120} data-testid="badge" />);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('99+');
    expect(badge).toHaveAttribute('data-tone', 'danger');
    expect(badge).toHaveAttribute('data-variant', 'solid');
  });

  it('Alert is silent by default and announces when live', () => {
    const { rerender } = render(<Alert title="Heads up">Body</Alert>);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    rerender(
      <Alert tone="danger" live="assertive" title="Payment failed" onDismiss={() => {}}>
        Check your card.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('EmptyState renders a heading at the requested level', () => {
    render(<EmptyState media="empty" title="No projects yet" description="Create one to start." headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeInTheDocument();
  });

  it('Kbd renders one key per entry', () => {
    const { container } = render(<Kbd keys={['⌘', 'K']} />);
    expect(container.querySelectorAll('kbd kbd')).toHaveLength(2);
  });

  it('Spinner is a status with a label, Separator and Skeleton stay out of the accessibility tree', () => {
    render(
      <>
        <Spinner label="Saving" />
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
        <Skeleton lines={3} data-testid="line" />
      </>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
    expect(screen.getByTestId('decorative')).toHaveAttribute('role', 'none');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getAllByTestId('line')).toHaveLength(3);
  });

  it('Stack maps gap to a spacing token and renders the requested element', () => {
    render(
      <Stack as="ul" direction="row" gap={1.5} data-testid="stack">
        <li>One</li>
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('UL');
    expect(stack.style.getPropertyValue('--pada-stack-gap')).toBe('var(--pada-space-1-5)');
  });
});
