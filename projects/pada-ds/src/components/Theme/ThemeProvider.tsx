import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { PortalContainerContext } from '../../headless/utils/portalContainer';
import { useControllableState } from '../../headless/utils/useControllableState';
import { ThemeContext, type ThemeMode, type ThemeSettings } from './themeContext';

export interface ThemeProviderProps extends ThemeSettings {
  children?: ReactNode;
  /** Initial theme when uncontrolled (and nothing is stored). */
  defaultTheme?: ThemeMode;
  /** Called when `setTheme` changes the theme. */
  onThemeChange?: (theme: ThemeMode) => void;
  /**
   * `root` applies the attributes to `<html>` (the whole page); `element` wraps the children in a
   * `display: contents` element, so a section can have its own theme.
   */
  target?: 'root' | 'element';
  /** Remember the chosen theme in localStorage under this key. */
  storageKey?: string;
  /** Hue (0–360) of the accent when `accent="custom"`; sets `--pada-accent-hue`. */
  accentHue?: number;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';
const subscribeScheme = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const systemPrefersDark = () => typeof window !== 'undefined' && !!window.matchMedia?.(DARK_QUERY).matches;

const readStored = (key: string | undefined): ThemeMode | undefined => {
  if (!key || typeof window === 'undefined') return undefined;
  try {
    const value = window.localStorage.getItem(key);
    return value === 'light' || value === 'dark' || value === 'system' ? value : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Sets Pada's theme axes (`data-theme`, `data-accent`, `data-density`, …) for the page or a
 * subtree, and shares them through `useTheme()`.
 */
export function ThemeProvider({
  children,
  theme: themeProp,
  defaultTheme = 'system',
  onThemeChange,
  target = 'element',
  storageKey,
  accent,
  neutral,
  density,
  radius,
  motion,
  contrast,
  accentHue,
}: ThemeProviderProps) {
  const [theme, setTheme] = useControllableState<ThemeMode>({
    prop: themeProp,
    defaultProp: readStored(storageKey) ?? defaultTheme,
    onChange: (next) => {
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // Storage can be unavailable (private mode); the theme still applies for this session.
        }
      }
      onThemeChange?.(next);
    },
  });
  const prefersDark = useSyncExternalStore(subscribeScheme, systemPrefersDark, () => false);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  const attributes = useMemo(
    () => ({
      'data-theme': theme === 'system' ? undefined : theme,
      'data-accent': accent,
      'data-neutral': neutral,
      'data-density': density,
      'data-radius': radius,
      'data-motion': motion,
      'data-contrast': contrast,
    }),
    [theme, accent, neutral, density, radius, motion, contrast],
  );

  // The custom accent's hue must be set on the element that carries data-accent: tokens read it
  // where they are declared, so a value set on a child would not reach them.
  useEffect(() => {
    if (target !== 'root' || accentHue === undefined) return;
    const root = document.documentElement;
    const previous = root.style.getPropertyValue('--pada-accent-hue');
    root.style.setProperty('--pada-accent-hue', String(accentHue));
    return () => {
      if (previous) root.style.setProperty('--pada-accent-hue', previous);
      else root.style.removeProperty('--pada-accent-hue');
    };
  }, [target, accentHue]);

  useEffect(() => {
    if (target !== 'root') return;
    const root = document.documentElement;
    const previous = Object.fromEntries(Object.keys(attributes).map((name) => [name, root.getAttribute(name)]));
    for (const [name, value] of Object.entries(attributes)) {
      if (value === undefined) root.removeAttribute(name);
      else root.setAttribute(name, value);
    }
    return () => {
      for (const [name, value] of Object.entries(previous)) {
        if (value === null) root.removeAttribute(name);
        else root.setAttribute(name, value);
      }
    };
  }, [target, attributes]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, accent, neutral, density, radius, motion, contrast }),
    [theme, resolvedTheme, setTheme, accent, neutral, density, radius, motion, contrast],
  );

  return (
    <ThemeContext value={value}>
      {target === 'root' ? (
        children
      ) : (
        <div
          className="theme-scope"
          {...attributes}
          style={accentHue === undefined ? undefined : ({ '--pada-accent-hue': accentHue } as CSSProperties)}
        >
          {/* Overlays opened inside this subtree portal here, so they keep its theme. */}
          <PortalContainerContext value={portalContainer}>{children}</PortalContainerContext>
          <div ref={setPortalContainer} className="theme-portal" />
        </div>
      )}
    </ThemeContext>
  );
}
