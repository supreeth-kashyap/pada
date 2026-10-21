import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { BrandLogo, Logo } from '../Logo';
import { SidebarLogo } from '../Sidebar';
import { PadaLogo } from '.';

describe('PadaLogo', () => {
  it('is an image named Pada, sized by height with the variant aspect ratio', async () => {
    render(<PadaLogo size="lg" />);
    const logo = screen.getByRole('img', { name: 'Pada' });
    expect(logo).toHaveAttribute('height', '48');
    expect(logo).toHaveAttribute('width', String((48 * 146.2) / 32.875));
    expect(logo.querySelectorAll('.pada-logo-half')).toHaveLength(2);
    expect(logo.querySelector('.pada-logo-wordmark')).toHaveAttribute('transform', 'translate(36.7 8.5)');
    expect(await axeViolations()).toEqual([]);
  });

  it('mark, decorative, and the looping loader', () => {
    const { container } = render(
      <>
        <PadaLogo variant="mark" size={16} decorative />
        <PadaLogo variant="mark" animated="loop" />
      </>,
    );
    const [decorative, loader] = container.querySelectorAll('svg');
    expect(decorative).toHaveAttribute('aria-hidden', 'true');
    expect(decorative.querySelector('.pada-logo-wordmark')).toBeNull();
    expect(screen.getByRole('status', { name: 'Loading' })).toBe(loader);
    expect(loader).toHaveAttribute('data-animated', 'loop');
  });

  it('BrandLogo is the renamed Logo, and SidebarLogo defaults to the Pada lockup', () => {
    expect(Logo).toBe(BrandLogo);
    render(<SidebarLogo />);
    expect(screen.getByRole('img', { name: 'Pada' })).toHaveAttribute('data-variant', 'lockup');
  });
});
