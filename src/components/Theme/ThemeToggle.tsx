import { flushSync } from 'react-dom';
import { useTheme } from './themeContext';
import './Theme.css';

export interface ThemeToggleProps {
  className?: string;
  /** sm 28px, md 32px, lg 40px. */
  size?: 'sm' | 'md' | 'lg';
}

interface ViewTransitionDocument {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
}

/**
 * Switches between light and dark. Where the browser supports view transitions (and motion is
 * allowed) the new theme spreads from the button in a circle.
 */
export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const doc = document as Document & ViewTransitionDocument;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced';
    if (!doc.startViewTransition || reduced) {
      setTheme(next);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty('--pada-theme-reveal-x', `${rect.left + rect.width / 2}px`);
    root.style.setProperty('--pada-theme-reveal-y', `${rect.top + rect.height / 2}px`);
    doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  return (
    <button
      type="button"
      data-size={size}
      data-theme-current={resolvedTheme}
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      aria-label={`Switch to ${next} theme`}
      onClick={toggle}
    >
      <svg className="theme-toggle-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {/* Sun: a disc and rays. In dark mode the rays shrink away and a bite turns the disc into a moon. */}
        <mask id="pada-theme-toggle-mask">
          <rect width="24" height="24" fill="white" />
          <circle className="theme-toggle-bite" cx="18" cy="6" r="6" fill="black" />
        </mask>
        <circle className="theme-toggle-disc" cx="12" cy="12" r="5" fill="currentColor" mask="url(#pada-theme-toggle-mask)" />
        <g className="theme-toggle-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4 6 18M18 6l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
