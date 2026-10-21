import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axeViolations } from '../../test/axe';
import { Progress } from './Progress';

describe('Progress', () => {
  it('is a progressbar named by its label', async () => {
    const { container } = render(<Progress label="Uploading report.pdf" value={42} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading report.pdf' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(await axeViolations(container)).toEqual([]);
  });
});
