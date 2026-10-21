import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  /** Light, dark, or follow the operating system. */
  theme?: ThemeMode;
  /** Accent palette: any palette hue (`indigo`, `amber`, `emerald`, …) or `custom` (uses `--pada-accent-hue`). */
  accent?: string;
  /** Neutral palette for surfaces, text and borders. */
  neutral?: 'stone' | 'slate' | 'gray' | 'zinc' | 'neutral';
  density?: 'compact' | 'comfortable' | 'spacious';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Override the OS reduced-motion setting. */
  motion?: 'reduced' | 'full';
  contrast?: 'standard' | 'more';
}

export interface ThemeContextValue extends Required<Pick<ThemeSettings, 'theme'>>, Omit<ThemeSettings, 'theme'> {
  /** The theme actually shown: `system` resolved through `prefers-color-scheme`. */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** The nearest ThemeProvider's settings and setter. Throws outside a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return value;
}
