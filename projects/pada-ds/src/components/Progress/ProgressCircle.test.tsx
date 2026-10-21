import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { ProgressCircle } from '.';

describe('ProgressCircle', () => {
  it('is a named progressbar whose ring fills by percentage', async () => {
    render(<ProgressCircle label="Uploading" value={15} max={60} />);
    const ring = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(ring).toHaveAttribute('aria-valuenow', '15');
    expect(ring).toHaveAttribute('aria-valuemin', '0');
    expect(ring).toHaveAttribute('aria-valuemax', '60');
    expect(ring).toHaveAttribute('aria-valuetext', '25%');
    expect(ring).toHaveAttribute('data-state', 'loading');
    expect(ring).toHaveAttribute('data-size', 'md');
    expect(ring.style.getPropertyValue('--pada-progress-circle-percentage')).toBe('25');
    expect(ring.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(await axeViolations()).toEqual([]);
  });

  it('spins without a value, leaving out aria-valuenow', async () => {
    const { container } = render(<ProgressCircle label="Syncing" size="sm" />);
    const ring = screen.getByRole('progressbar', { name: 'Syncing' });
    expect(ring).not.toHaveAttribute('aria-valuenow');
    expect(ring).toHaveAttribute('data-state', 'indeterminate');
    expect(ring).toHaveAttribute('data-size', 'sm');
    expect(container.querySelector('.progress-circle-indicator')).toHaveAttribute('data-state', 'indeterminate');
    expect(await axeViolations()).toEqual([]);
  });

  it('clamps, marks an empty ring, shows the value inside, and reports completion', () => {
    const { container, rerender } = render(<ProgressCircle label="Storage" value={0} size="lg" showValue />);
    const ring = screen.getByRole('progressbar', { name: 'Storage' });
    expect(container.querySelector('.progress-circle-indicator')).toHaveAttribute('data-empty');
    expect(container.querySelector('.progress-circle-value')).toHaveTextContent('0%');
    rerender(<ProgressCircle label="Storage" value={140} size="lg" showValue />);
    expect(ring).toHaveAttribute('data-state', 'complete');
    expect(ring.style.getPropertyValue('--pada-progress-circle-percentage')).toBe('100');
    expect(container.querySelector('.progress-circle-value')).toHaveTextContent('100%');
  });
});
