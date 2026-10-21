import { useTheme } from 'pada-ds';
import { Moon, Sun } from './icons';

/** Light/dark switch. Both icons render; CSS shows the right one, so prerendered HTML matches. */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="icon-link theme-switch"
      aria-label="Switch colour theme"
      title="Switch colour theme"
      onClick={() => {
        const apply = () => setTheme(next);
        const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
        if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          doc.startViewTransition(apply);
        } else apply();
      }}
    >
      <Moon className="moon" size={17} />
      <Sun className="sun" size={17} />
    </button>
  );
}
