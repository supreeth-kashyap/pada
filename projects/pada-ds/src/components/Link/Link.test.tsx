import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { IconButton } from '../IconButton';
import { Link } from './Link';

describe('Link and IconButton', () => {
  it('external links open safely and say so', () => {
    render(
      <Link href="https://example.com" external>
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('asChild styles a router link', () => {
    render(
      <Link asChild tone="neutral">
        <a href="/settings">Settings</a>
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveClass('link');
  });

  it('IconButton is named by its label and can show it as a tooltip', async () => {
    const user = userEvent.setup();
    render(<IconButton icon="edit_1" label="Rename" tooltip />);
    const button = screen.getByRole('button', { name: 'Rename' });
    expect(button).toHaveClass('icon-button', 'button--ghost');
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Rename');
  });
});
