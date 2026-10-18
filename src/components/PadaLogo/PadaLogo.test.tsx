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
    expect(logo).toHaveAttribute('width', String((48 * 110) / 32));
    // Toes are drawn from 48px up.
    expect(logo.querySelectorAll('circle[r="1.5"]')).toHaveLength(2);
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
    expect(decorative.querySelectorAll('circle')).toHaveLength(0);
    expect(screen.getByRole('status', { name: 'Loading' })).toBe(loader);
    expect(loader).toHaveAttribute('data-animated', 'loop');
  });

  it('BrandLogo is the renamed Logo, and SidebarLogo defaults to the Pada lockup', () => {
    expect(Logo).toBe(BrandLogo);
    render(<SidebarLogo />);
    expect(screen.getByRole('img', { name: 'Pada' })).toHaveAttribute('data-variant', 'lockup');
  });
});
