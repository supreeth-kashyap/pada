import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider, ThemeToggle, useTheme } from '.';

function Current() {
  const { theme, resolvedTheme } = useTheme();
  return <output>{`${theme}/${resolvedTheme}`}</output>;
}

describe('ThemeProvider and ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    window.localStorage.clear();
  });

  it('applies theme axes to a subtree', () => {
    render(
      <ThemeProvider defaultTheme="dark" accent="amber" density="compact">
        <span>Inside</span>
      </ThemeProvider>,
    );
    const scope = screen.getByText('Inside').parentElement!;
    expect(scope).toHaveAttribute('data-theme', 'dark');
    expect(scope).toHaveAttribute('data-accent', 'amber');
    expect(scope).toHaveAttribute('data-density', 'compact');
  });

  it('toggles light and dark on <html> and remembers the choice', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider target="root" defaultTheme="light" storageKey="pada-theme">
        <ThemeToggle />
        <Current />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('status')).toHaveTextContent('dark/dark');
    expect(window.localStorage.getItem('pada-theme')).toBe('dark');
  });

  it('system follows the OS and leaves data-theme unset', () => {
    render(
      <ThemeProvider target="root">
        <Current />
      </ThemeProvider>,
    );
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(screen.getByRole('status')).toHaveTextContent('system/light');
  });
});
