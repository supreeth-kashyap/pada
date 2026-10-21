import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from '../AspectRatio';
import { Container } from '../Container';
import { Grid } from '.';

describe('layout primitives', () => {
  it('Grid sets columns, gaps and fit mode from props', () => {
    render(
      <Grid data-testid="fixed" columns={3} gap={2}>
        <div />
      </Grid>,
    );
    const fixed = screen.getByTestId('fixed');
    expect(fixed.style.getPropertyValue('--pada-grid-columns')).toBe('3');
    expect(fixed.style.getPropertyValue('--pada-grid-gap')).toBe('var(--pada-space-2)');
    render(<Grid data-testid="fit" minItemWidth="16rem" as="ul" />);
    expect(screen.getByTestId('fit')).toHaveAttribute('data-fit');
    expect(screen.getByTestId('fit').tagName).toBe('UL');
  });

  it('Container and AspectRatio', () => {
    render(
      <Container as="main" size="md" data-testid="container">
        <AspectRatio ratio={16 / 9} data-testid="ratio" />
      </Container>,
    );
    expect(screen.getByRole('main')).toHaveAttribute('data-size', 'md');
    expect(screen.getByTestId('ratio').style.getPropertyValue('--pada-aspect-ratio')).toBe(String(16 / 9));
  });
});
